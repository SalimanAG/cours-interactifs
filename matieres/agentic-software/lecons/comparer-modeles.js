/* Leçon : Comparer deux modèles honnêtement (session 2, « Models, local inference and API experiments »).
   Fil rouge : un petit modèle local (qwen3:0.6b via Ollama) face à un modèle hébergé (openai/gpt-oss-20b via Groq).
   Le protocole du benchmark est dans l'atelier TP 2 ; ici : ce qui se passe à l'intérieur. */
(function () {
  "use strict";
  var el = Site.el, A = ASD;

  var etapes = [
    {
      titre: "Modèle, runtime, interface",
      texte: "<p>Fil rouge : on compare <span class='mono'>qwen3:0.6b</span> en local et <span class='mono'>openai/gpt-oss-20b</span> hébergé. Trois couches à ne pas confondre.</p>",
      objectif: "Ranger chaque élément dans sa couche.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["modèle", "runtime / provider", "interface"],
          items: [
            { texte: "Qwen, GPT OSS : paramètres appris, comportement de génération", bonne: 0 },
            { texte: "Ollama, Groq : charger les poids et exécuter l'inférence", bonne: 1 },
            { texte: "Python, Langflow : préparer les requêtes, inspecter les résultats", bonne: 2 }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "La génération autorégressive",
      texte: "<p>Les deux modèles génèrent de la même façon, un token après l'autre.</p>",
      objectif: "Ordonner un tour de génération, puis dire qui répète.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.ordonner(b, { items: ["Tokens du prompt", "États du décodeur", "Scores du prochain token", "Un token ajouté"], separateur: "→", surReussite: ok }); },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Qui répète la génération, et jusqu'à quand ?",
              options: ["l'application, jusqu'à une condition d'arrêt ou une limite", "le modèle, jusqu'à ce qu'il soit sûr", "le réseau, jusqu'au timeout"], bonne: 0,
              expliquer: ["Oui. D'où le finish reason : « stop » ou « length » si la limite de sortie coupe.", "Non.", "Non."],
              surReussite: ok
            });
          }
        ], "Un token par tour, jusqu'à l'arrêt ou la limite.");
      }
    },
    {
      titre: "Compter les tokens",
      texte: "<p>Un token peut être un fragment de mot, une ponctuation ou une autre unité. Les deux modèles du fil rouge n'ont pas le même tokenizer.</p>",
      objectif: "Vérifier quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Le tokenizer appartient au modèle.", vrai: true },
            { texte: "« 120 tokens » chez Qwen et « 120 tokens » chez GPT OSS désignent le même texte.", vrai: false, explication: "Les comptes de tokenizers différents ne sont pas interchangeables." },
            { texte: "Le fournisseur peut compter aussi le formatage des messages.", vrai: true },
            { texte: "Les tokens d'entrée et de sortie comptent pour le contexte et le quota.", vrai: true }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Le masque causal",
      texte: "<p>Pendant la génération, chaque position voit les précédentes et elle-même, <b>jamais les suivantes</b>. Coche les cases <b>visibles</b> (ligne = position traitée, colonne = token vu).</p>",
      objectif: "Reconstituer le masque causal de trois tokens A, B, C.",
      installer: function (zone, api) {
        var T = ["A", "B", "C"], v = {};
        var t = el("table", "tableau");
        zone.appendChild(t);
        var bouton = A.boutons(zone, ["Vérifier"], verifier)[0];
        function dessiner(fin) {
          t.innerHTML = "<tr><th>position</th>" + T.map(function (x) { return "<th>token " + x + "</th>"; }).join("") + "</tr>";
          T.forEach(function (ligne, i) {
            var tr = el("tr"); tr.appendChild(el("td", null, ligne));
            T.forEach(function (col, j) {
              var td = el("td"); var k = i + "-" + j;
              var b = el("button", "btn btn-petit" + (v[k] ? " choisi" : ""), v[k] ? "visible" : "masqué");
              b.type = "button"; b.disabled = !!fin;
              b.onclick = function () { v[k] = !v[k]; dessiner(); };
              td.appendChild(b); tr.appendChild(td);
            });
            t.appendChild(tr);
          });
        }
        function verifier() {
          var faux = 0;
          T.forEach(function (_, i) { T.forEach(function (_, j) { if (!!v[i + "-" + j] !== (j <= i)) faux++; }); });
          if (faux) { api.retour(faux + " case" + (faux > 1 ? "s" : "") + " fausse" + (faux > 1 ? "s" : "") + ". Une position voit les tokens avant elle et elle-même.", false); return; }
          dessiner(true); bouton.disabled = true;
          api.retour("A voit A ; B voit A et B ; C voit A, B et C.", true);
          api.valider("Attention : ce tableau montre le masque, pas des poids d'attention mesurés.");
        }
        dessiner();
      }
    },
    {
      titre: "Poids, contexte, mémoire de l'application",
      texte: "<p>Trois endroits où une information peut se trouver, et trois leviers différents.</p>",
      objectif: "Associer chaque situation à son endroit.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["poids", "contexte courant", "mémoire de l'application"],
          items: [
            { texte: "Ce que le modèle a appris : levier = choisir un autre modèle ou checkpoint.", bonne: 0 },
            { texte: "Instructions, messages et preuves fournies : levier = changer le contenu et le budget.", bonne: 1 },
            { texte: "Historique et fichiers stockés, récupérés dans une requête : levier = contrôler la récupération et les sessions.", bonne: 2 },
            { texte: "Les règles privées d'Orbitra, qu'aucun modèle ne peut inventer.", bonne: 1, explication: "Il faut les fournir comme preuves : c'est la session 3 (RAG)." }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Combien pèsent les poids ?",
      texte: "<p>Estimation des poids nus d'un modèle de <b>7 milliards</b> de paramètres (Go décimaux) — pas la RAM réellement nécessaire.</p>",
      objectif: "Calculer deux tailles, puis distinguer quantification et distillation.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "16 bits par paramètre (Go) :", attendu: 14, tolerance: 0.01, placeholder: "ex. 7", indice: "7·10⁹ × 2 octets.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "4 bits par paramètre (Go) :", attendu: 3.5, tolerance: 0.01, placeholder: "ex. 7", indice: "7·10⁹ × 0,5 octet.", bravo: "Plus les métadonnées et le surcoût du runtime ; un contexte actif plus long coûte une mémoire séparée (KV cache).", surReussite: ok }); },
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["quantification", "distillation"],
              items: [
                { texte: "représenter des poids avec moins de bits", bonne: 0 },
                { texte: "entraîner un élève sur les sorties ou distributions d'un enseignant", bonne: 1 },
                { texte: "change la représentation numérique", bonne: 0 },
                { texte: "change l'entraînement", bonne: 1 }
              ],
              surReussite: ok
            });
          }
        ], "Dans les deux cas : mesurer la qualité et la vitesse, avec des réglages contrôlés.");
      }
    },
    {
      titre: "Froid, chaud, et trois mesures de vitesse",
      texte: "<p>Le premier appel au modèle local inclut souvent son chargement ; l'appel hébergé inclut le réseau.</p>",
      objectif: "Dire ce que contient chaque temps, puis quelle mesure répond à quelle question.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["première invocation", "invocation chaude", "requête réseau"],
              items: [
                { texte: "chargement du modèle et initialisation du runtime : à garder à part", bonne: 0 },
                { texte: "traitement du prompt et génération : répéter la même tâche", bonne: 1 },
                { texte: "transport et attente chez le fournisseur : dans le temps de bout en bout", bonne: 2 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["elapsed seconds", "output tokens / s", "time to first token"],
              items: [
                { texte: "combien de temps cette requête a pris", bonne: 0 },
                { texte: "le débit de génération", bonne: 1 },
                { texte: "l'attente avant le début du streaming", bonne: 2 }
              ],
              surReussite: ok
            });
          }
        ], "Chaque mesure répond à une question différente.");
      }
    },
    {
      titre: "La similarité d'embeddings",
      texte:
        "<p>Dernière idée de la session 2, qui prépare le RAG : comparer des vecteurs par le cosinus. Vecteurs définis à la main (pas de vrais embeddings) :</p>" +
        "<table class='tableau'><tr><th></th><th>coordonnées</th></tr><tr><td>requête</td><td class='mono'>(1, 0)</td></tr><tr><td>document A</td><td class='mono'>(0,9 ; 0,1)</td></tr><tr><td>document B</td><td class='mono'>(0, 1)</td></tr></table>",
      objectif: "Calculer un cosinus, puis choisir le document le plus proche.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "cos(requête, B) =", attendu: 0, placeholder: "ex. 0,5", indice: "(1×0 + 0×1) / (1 × 1).", bravo: "0 : direction orthogonale.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "cos(requête, A), 2 décimales :", attendu: 0.9 / Math.sqrt(0.82), tolerance: 0.01, placeholder: "ex. 0,5", indice: "0,9 / √(0,81 + 0,01) = 0,9 / 0,906.", bravo: "≈ 0,99 : presque la même direction.", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Le plus proche de la requête ?", options: ["A", "B"], bonne: 0, surReussite: ok }); }
        ], "La semaine suivante : retrouver les bons documents avec ce genre de similarité.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software", id: "comparer-modeles", etapes: etapes,
    fin: { texte: "<p>Pour le protocole du benchmark (référence, format et faits, un seul réglage changé, recommandation défendue), fais l'atelier <b>TP 2 · Le benchmark contrôlé</b>.</p>", cartes: "s2-modeles" }
  });
})();
