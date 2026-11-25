/* Leçon : Du BM25 à la porte « not found » (session 6, RAG in Production with Elasticsearch).
   Fil rouge : les trois documents de la diapo « Inverted index » et trois questions du type de la démo :
   un code exact, une paraphrase, une question sans réponse. Les vecteurs et les scores de reranker
   sont INVENTÉS pour l'illustration ; les formules et les règles sont celles du cours. */
(function () {
  "use strict";
  var el = Site.el, A = ASD;
  var DOCS = [
    { id: 1, texte: "Payments API timeout", termes: ["payments", "api", "timeout"] },
    { id: 2, texte: "Rollback the payments deploy", termes: ["rollback", "the", "payments", "deploy"] },
    { id: 3, texte: "Deploy freeze in December", termes: ["deploy", "freeze", "in", "december"] }
  ];
  function tableDocs() {
    return "<table class='tableau'><tr><th>doc</th><th>texte</th><th>termes (analyzer simple, minuscules)</th></tr>" +
      DOCS.map(function (d) { return "<tr><td class='num'>" + d.id + "</td><td>" + d.texte + "</td><td class='mono'>" + d.termes.join(" · ") + "</td></tr>"; }).join("") + "</table>";
  }
  function f(x, n) { return x.toFixed(n === undefined ? 2 : n).replace(".", ","); }

  var etapes = [
    {
      titre: "L'index inversé",
      texte:
        "<p>Fil rouge : trois petits documents (diapo « Inverted index »).</p>" + tableDocs() +
        "<p>Un index normal va du document vers ses termes : pour chercher, il faut lire chaque document. Un <b>index inversé</b> va du terme vers les documents qui le contiennent (sa <b>posting list</b>).</p>",
      objectif: "Écrire deux posting lists, puis classer la requête « deploy freeze ».",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.cocher(b, { question: "Posting list de <span class='mono'>deploy</span> :", options: ["doc 1", "doc 2", "doc 3"], bonnes: [1, 2], surReussite: ok }); },
          function (b, ok) { Exercices.cocher(b, { question: "Posting list de <span class='mono'>payments</span> :", options: ["doc 1", "doc 2", "doc 3"], bonnes: [0, 1], surReussite: ok }); },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Requête « deploy freeze » : quel document sort en premier ?",
              options: ["doc 3", "doc 2", "doc 1"], bonne: 0,
              expliquer: ["Oui : deploy → {2, 3}, freeze → {3}. Le doc 3 contient les deux termes.", "Le doc 2 ne contient que deploy.", "Le doc 1 ne contient aucun des deux termes."],
              surReussite: ok
            });
          }
        ], "On ne lit que les posting lists des termes de la requête : le coût ne croît plus avec tout le corpus.");
      }
    },
    {
      titre: "L'analyzer décide ce qu'est un terme",
      texte: "<p>Un analyzer = filtres de caractères → tokenizer → filtres de tokens, <b>le même</b> à l'indexation et à la requête. Le lab en utilise deux sur le texte « ORB-9001: replication lagging on ledger-db ».</p>",
      objectif: "Associer chaque découpage à son analyzer, puis choisir le champ pour un code d'erreur.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["english (champ text)", "identifiants (text.ids)"],
              items: [
                { texte: "<span class='mono'>[orb] [9001] [replic] [lag] [ledger] [db]</span>", bonne: 0, explication: "Racines et mots vides retirés : bon pour la prose, mais le code est coupé." },
                { texte: "<span class='mono'>[orb-9001] [replication] [lagging] [on] [ledger-db]</span>", bonne: 1, explication: "Coupe sur tout sauf lettres, chiffres, « - » et « _ » : les codes restent entiers." }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "La requête du lab 2 est un multi_match sur section, text et text.ids. Quel champ reçoit le poids le plus fort ?",
              options: ["text.ids (×3)", "section (×2)", "text (×1)"], bonne: 0,
              expliquer: ["Oui : section ×2, text, text.ids ×3. Le poids de chaque champ reste ta décision, mesurée par catégorie.", "section a ×2.", "text n'a pas de poids supplémentaire."],
              surReussite: ok
            });
          }
        ], "Le même texte, deux analyzers, deux usages : la prose et les codes.");
      }
    },
    {
      titre: "BM25 : les termes rares pèsent plus",
      texte:
        "<p>BM25 est le classement par défaut d'Elasticsearch. Son poids de terme :</p>" +
        "<div class='formule'>IDF(t) = ln(1 + (N − n(t) + 0,5) / (n(t) + 0,5))</div>" +
        "<p>N = nombre de sections, n(t) = nombre de sections qui contiennent t. Exemple du cours : « orb-9001 » est dans 1 section sur 76, « error » dans des dizaines.</p>",
      objectif: "Calculer deux IDF (2 décimales).",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "IDF(orb-9001), N = 76, n = 1 :", attendu: Math.log(1 + 75.5 / 1.5), tolerance: 0.01, placeholder: "ex. 2,15", indice: "ln(1 + 75,5 / 1,5) = ln(51,33).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "IDF(error), N = 76, n = 40 :", attendu: Math.log(1 + 36.5 / 40.5), tolerance: 0.01, placeholder: "ex. 2,15", indice: "ln(1 + 36,5 / 40,5) = ln(1,90).", surReussite: ok }); }
        ], "≈ 3,94 contre ≈ 0,64 : le code rare pèse environ six fois plus.");
      }
    },
    {
      titre: "BM25 : répétition et longueur",
      texte:
        "<div class='formule'>score(q, d) = Σ IDF(t) · tf·(k1+1) / (tf + k1·(1 − b + b·|d|/avgdl))</div>" +
        "<p>Par défaut k1 = 1,2 et b = 0,75. Pour une section de longueur moyenne (|d| = avgdl), le facteur de fréquence vaut tf·2,2 / (tf + 1,2) :</p>" +
        "<table class='tableau'><tr><th class='num'>tf</th><th class='num'>1</th><th class='num'>3</th><th class='num'>10</th></tr>" +
        "<tr><td>facteur</td><td class='num'>1,00</td><td class='num'>1,57</td><td class='num'>1,96</td></tr></table>",
      objectif: "Interpréter le tableau, puis l'effet de la longueur.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.choix(b, {
              question: "Que montre le tableau ?",
              options: ["la répétition sature : la 10e occurrence de « payment » ajoute peu par rapport à la 3e", "le score est proportionnel à tf", "un terme répété 10 fois compte 10 fois plus"], bonne: 0,
              expliquer: ["Oui : c'est le rôle de k1 (le facteur ne dépasse jamais k1 + 1 = 2,2).", "Non : de 1 à 10 occurrences, le facteur ne fait même pas doubler.", "Non."],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.nombre(b, { label: "tf = 1 dans une section deux fois plus longue que la moyenne : facteur =", attendu: 2.2 / (1 + 1.2 * (1 - 0.75 + 0.75 * 2)), tolerance: 0.01, placeholder: "ex. 0,85",
              indice: "1 × 2,2 / (1 + 1,2 × (0,25 + 0,75 × 2)) = 2,2 / 3,1.", bravo: "≈ 0,71 au lieu de 1 : b pénalise les sections longues — un match dans une section courte compte plus.", surReussite: ok });
          }
        ], "Trois idées : termes rares (IDF), saturation (k1), longueur (b).");
      }
    },
    {
      titre: "La paraphrase que BM25 ne voit pas",
      texte:
        "<p>Question : « <i>Can I ship code over the winter holidays?</i> ». La bonne réponse est le doc 3 (« Deploy freeze in December »).</p>" +
        "<p>Avec des <b>embeddings</b>, des sens proches donnent des vecteurs proches ; on compare par le cosinus (1 = même direction). Cosinus inventés pour l'illustration :</p>" +
        "<table class='tableau'><tr><th>doc</th><th class='num'>cosinus avec la question</th></tr><tr><td>1 · Payments API timeout</td><td class='num'>0,12</td></tr><tr><td>2 · Rollback the payments deploy</td><td class='num'>0,41</td></tr><tr><td>3 · Deploy freeze in December</td><td class='num'>0,78</td></tr></table>",
      objectif: "Compter les termes communs, puis choisir le document le plus proche.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "Termes communs entre la question et le doc 3 :", attendu: 0, placeholder: "ex. 2", indice: "can, i, ship, code, over, the, winter, holidays… contre deploy, freeze, in, december.", bravo: "Aucun : son score BM25 est 0. « A paraphrase shares no word with its answer. »", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Recherche kNN (plus proches vecteurs) : quel document vient en 1er ?", options: ["doc 3", "doc 2", "doc 1"], bonne: 0, surReussite: ok }); },
          function (b, ok) {
            Exercices.vraiFaux(b, {
              items: [
                { texte: "Il faut le même modèle d'embedding à l'indexation et à la requête.", vrai: true, explication: "Sinon les vecteurs ne se comparent pas." },
                { texte: "HNSW parcourt tous les vecteurs un par un.", vrai: false, explication: "C'est un graphe en couches construit à l'indexation : on saute vers la requête au lieu de tout parcourir." },
                { texte: "Avec int8_hnsw, 1 M vecteurs de 1 536 dimensions tiennent dans environ 1,6 Go de RAM (≈ 6,2 Go en float).", vrai: true }
              ],
              surReussite: ok
            });
          }
        ], "BM25 pour les termes exacts, vecteurs pour les paraphrases.");
      }
    },
    {
      titre: "Fusionner par les rangs (RRF)",
      texte:
        "<p>On lance BM25 et kNN ensemble (<span class='mono'>_msearch</span>, un aller-retour), puis on fusionne. On ne peut pas additionner un score BM25 (non borné) et un cosinus (entre −1 et 1) : on fusionne les <b>rangs</b>.</p>" +
        "<div class='formule'>RRF(chunk) = Σ 1 / (k + rang), k = 60</div>" +
        "<table class='tableau'><tr><th>rang</th><th>BM25</th><th>kNN</th></tr><tr><td class='num'>1</td><td>A</td><td>B</td></tr><tr><td class='num'>2</td><td>B</td><td>C</td></tr><tr><td class='num'>3</td><td>D</td><td>E</td></tr></table>",
      objectif: "Calculer le score de B, puis le top 3 fusionné.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "RRF(B), 4 décimales :", attendu: 1 / 62 + 1 / 61, tolerance: 0.0002, placeholder: "ex. 0,0164", indice: "B est 2e en BM25 et 1er en kNN : 1/62 + 1/61.", surReussite: ok }); },
          function (b, ok) {
            Exercices.ordonner(b, {
              consigne: "Top 3 après fusion (A = 1/61, C = 1/62) :",
              items: ["B", "A", "C"], separateur: ">",
              bravo: "B (≈ 0,0325) > A (≈ 0,0164) > C (≈ 0,0161) : trouvé par les deux recherches, B passe devant.",
              surReussite: ok
            });
          }
        ], "Mots et sens, fusionnés par des rangs.");
      }
    },
    {
      titre: "Rerank, puis la porte « not found »",
      texte:
        "<p>Un score BM25 ne sait pas dire « not found » : dans la démo, une question sans réponse obtenait un meilleur score qu'une bonne réponse. On ajoute un <b>cross-encoder</b> (reranker) qui lit chaque paire (question, chunk), puis une <b>porte</b> : sous le seuil, <span class='mono'>retrieve()</span> ne renvoie rien et l'agent répond « Not found in the knowledge base. »</p>" +
        "<p>Choisis le seuil sur des données, avec la <b>balanced accuracy</b> = (taux de questions sans réponse bloquées + taux de questions avec réponse laissées passer) / 2. Meilleurs scores du reranker (inventés) :</p>",
      objectif: "Trouver un seuil qui maximise la balanced accuracy, puis nommer l'erreur que chaque choix laisse passer.",
      installer: function (zone, api) {
        var QS = [
          { q: "SLO de l'API Payments ?", rep: true, s: 0.92 }, { q: "Que faire pour ORB-4031 ?", rep: true, s: 0.81 },
          { q: "Livrer pendant les fêtes ?", rep: true, s: 0.66 }, { q: "Qui est appelé la nuit ?", rep: true, s: 0.35 },
          { q: "Langage du service Checkout ?", rep: false, s: 0.48 }, { q: "Nom du PDG ?", rep: false, s: 0.22 },
          { q: "Budget marketing ?", rep: false, s: 0.15 }, { q: "GPU en production ?", rep: false, s: 0.05 }
        ];
        var SEUILS = [0.1, 0.3, 0.4, 0.5, 0.7];
        var tab = el("div"); zone.appendChild(tab);
        var mes = el("p", "legende-figure"); zone.appendChild(mes);
        var meilleurs = [];
        var suite = el("div");
        function balanced(t) {
          var bl = QS.filter(function (x) { return !x.rep && x.s < t; }).length / 4;
          var pa = QS.filter(function (x) { return x.rep && x.s >= t; }).length / 4;
          return { bl: bl, pa: pa, ba: (bl + pa) / 2 };
        }
        function dessiner(t) {
          tab.innerHTML = "<table class='tableau'><tr><th>question</th><th>réponse dans les docs ?</th><th class='num'>score</th><th>porte</th></tr>" +
            QS.map(function (x) {
              var passe = t !== null && x.s >= t;
              var verdict = t === null ? "—" : passe ? (x.rep ? "passe" : "passe : fausse réponse") : (x.rep ? "bloquée : faux not found" : "bloquée");
              return "<tr><td>" + x.q + "</td><td>" + (x.rep ? "oui" : "non") + "</td><td class='num'>" + f(x.s) + "</td><td>" + verdict + "</td></tr>";
            }).join("") + "</table>";
          if (t === null) { mes.textContent = "Choisis un seuil."; return; }
          var r = balanced(t);
          mes.innerHTML = "<span>seuil <span class='mono'>" + f(t) + "</span></span><span>bloquées (sans réponse) <span class='mono'>" + f(r.bl) + "</span></span><span>laissées passer (avec réponse) <span class='mono'>" + f(r.pa) + "</span></span><span>balanced accuracy <span class='mono'>" + f(r.ba, 3) + "</span></span>";
        }
        var max = Math.max.apply(null, SEUILS.map(function (t) { return balanced(t).ba; }));
        var bs = A.boutons(zone, SEUILS.map(function (t) { return "seuil " + f(t); }), function (i, b) {
          bs.forEach(function (x) { x.classList.remove("choisi"); }); b.classList.add("choisi");
          var t = SEUILS[i]; dessiner(t);
          var r = balanced(t);
          if (Math.abs(r.ba - max) < 1e-9) {
            if (meilleurs.indexOf(t) < 0) meilleurs.push(t);
            api.retour("Maximum atteint (" + f(max, 3) + ")" + (meilleurs.length < 2 ? ". Un autre seuil fait aussi bien : trouve-le." : " avec deux seuils : 0,30 et 0,50."), true);
            if (meilleurs.length === 2 && !suite.parentNode) { zone.appendChild(suite); question(); }
          } else api.retour("Balanced accuracy " + f(r.ba, 3) + " : on peut faire mieux.", false);
        });
        function question() {
          Exercices.associer(suite, {
            consigne: "Deux seuils, même score, mais pas la même erreur. Laquelle laisse passer chacun ?",
            categories: ["fausse réponse", "faux « not found »"],
            items: [
              { texte: "seuil 0,30", bonne: 0, explication: "« Langage du service Checkout ? » (0,48) passe : l'agent répondrait à partir d'un chunk sans rapport." },
              { texte: "seuil 0,50", bonne: 1, explication: "« Qui est appelé la nuit ? » (0,35) est bloquée : l'astreinte cherchera à la main à 3 h du matin." }
            ],
            surReussite: function () { api.valider("Le choix final est le tien, justifié en une phrase : c'est exactement la décision du lab 4."); }
          });
        }
        dessiner(null);
      }
    },
    {
      titre: "Changer d'index sans interruption",
      texte: "<p>L'agent ne lit jamais un index : il lit un <b>alias</b>, un second nom qu'on déplace en un appel atomique. On peut donc reconstruire l'index puis basculer, et revenir en arrière.</p>",
      objectif: "Ordonner une ré-ingestion, puis faire un rollback.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.ordonner(b, {
              items: ["Créer v3, refresh désactivé", "Charger en bulk, puis refresh une fois", "Vérifier le nombre de documents (sinon s'arrêter)", "Déplacer l'alias de v2 vers v3, en un appel"],
              separateur: "→", surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "v3 donne de mauvais résultats. Que faire ?",
              options: ["remettre l'alias sur v2, gardée pour ça", "réindexer v2 depuis les documents", "supprimer l'alias"], bonne: 0,
              expliquer: ["Oui : rollback = déplacer l'alias. Chaque version gardée coûte une copie sur disque (INDEX_KEEP_VERSIONS).", "Inutile : v2 est encore là.", "L'agent ne trouverait plus rien."],
              surReussite: ok
            });
          }
        ], "Derrière une interface stable : l'alias pour les données, retrieve() pour le code.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software", id: "bm25-porte", etapes: etapes,
    fin: { texte: "<p>Les trois idées de la session 6 : une interface stable (alias, retrieve()) ; mots et sens (BM25, vecteurs, RRF) ; mesuré puis observé (un seuil choisi sur des données, une trace par question dans Elasticsearch).</p>", cartes: "s6-elasticsearch" }
  });
})();
