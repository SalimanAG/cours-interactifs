/* Leçon : sac à dos avec répétition, de V1 à V2 (cours 6 Dynamic Programming, exercices 1 et 2).
   Fil rouge : exercice 1 du cours — objets (w, v) = (8, 1), (5, 1), (3, 1), W = 17. */
(function () {
  "use strict";
  var el = Site.el;
  var E1 = SacADos.EX1, E2 = SacADos.EX2;
  var V1a = SacADos.V1(E1.objets, E1.W), V2a = SacADos.V2(E1.objets, E1.W);
  var COLS = SacADos.colonnes(E1.W);
  function t(v) { return v === -Infinity ? "–" : String(v); }

  function donnees(zone, ex, titre) {
    var tb = el("table", "tableau");
    tb.innerHTML = "<tr><th>objet i</th><th class='num'>w<sub>i</sub></th><th class='num'>v<sub>i</sub></th></tr>" +
      ex.objets.map(function (o, i) { return "<tr><td>" + (i + 1) + "</td><td class='num'>" + o[0] + "</td><td class='num'>" + o[1] + "</td></tr>"; }).join("");
    var d = el("div"); d.appendChild(el("p", "discret petit", titre + " (W = " + ex.W + ")")); d.appendChild(tb);
    zone.appendChild(d);
  }
  function depsV1(objets) {
    return function (l, c) { return objets.filter(function (o) { return c - o[0] >= 0; }).map(function (o) { return [0, c - o[0]]; }); };
  }
  function aideV1(objets) {
    return function (l, c) {
      var parts = objets.map(function (o) { return c - o[0] >= 0 ? o[1] + " + V1(" + (c - o[0]) + ") = " + o[1] + " + " + t(V1a[c - o[0]]) : null; }).filter(Boolean);
      return parts.length ? "V1(" + c + ") = max(" + parts.join(" ; ") + "). Si tous les termes valent −∞, écris « – »." :
        "Aucun objet ne pèse au plus " + c + " : V1(" + c + ") = −∞ (écris « – »).";
    };
  }

  var etapes = [

    /* 1 */
    {
      titre: "Programmation dynamique",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Définitions du cours</span>La programmation dynamique évite de calculer plusieurs fois le même sous-problème dans un algorithme récursif. " +
        "Autrement dit : on identifie une collection de sous-problèmes et on les résout un par un, <b>du plus petit au plus grand</b>, en utilisant les réponses des petits pour les grands.</div>" +
        "<p>Lien avec les graphes : les sous-problèmes sont les sommets d'un <b>DAG implicite</b> ; il y a un arc de A vers B si B a besoin de la réponse de A (A est « plus petit »).</p>" +
        "<p>Exercice 1 : objets de poids 8, 5 et 3. Pour connaître la meilleure valeur à poids <b>exactement</b> 8, de quels sous-problèmes a-t-on besoin ?</p>",
      objectif: "Trouver les prédécesseurs de « poids 8 » dans le DAG.",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          options: ["poids 0", "poids 1", "poids 3", "poids 5", "poids 7"],
          bonnes: [0, 2, 3],
          explication: "Exact : le dernier objet mis dans le sac pèse 8, 5 ou 3 ; il reste donc un sac de poids 0, 3 ou 5 à remplir au mieux.",
          surReussite: function () { api.valider("Chaque sous-problème dépend de plus petits : on peut les calculer dans l'ordre croissant des poids, sans récursion."); }
        });
      }
    },

    /* 2 */
    {
      titre: "Le sac à dos et ses variantes",
      texte:
        "<p>Remplir un sac de capacité W avec des objets (poids w<sub>i</sub>, valeur v<sub>i</sub>) pour <b>maximiser la valeur</b> sans dépasser W. " +
        "Un des 21 problèmes NP-complets de Karp. Programme linéaire (x<sub>i</sub> = nombre d'exemplaires de l'objet i) :</p>" +
        "<div class='formule'>max Σ v_i x_i   sous   Σ w_i x_i ≤ W</div>" +
        "<table class='tableau'><tr><th>avec répétition</th><th>sans répétition</th><th>subset sum</th></tr>" +
        "<tr><td class='mono'>x_i ∈ ℕ</td><td class='mono'>x_i ∈ {0, 1}</td><td class='mono'>v_i = w_i</td></tr></table>",
      objectif: "Reconnaître la variante de chaque situation.",
      installer: function (zone, api) {
        var noms = ["?", "avec répétition", "sans répétition", "subset sum"];
        var cas = [
          { t: "Une machine à monnaie : rendre au plus juste avec des pièces de 1, 2, 5, en nombre illimité.", b: "avec répétition" },
          { t: "Choisir des films à télécharger (chacun au plus une fois) dans un quota de 10 Go, en maximisant ta note totale.", b: "sans répétition" },
          { t: "Remplir un camion au plus près de sa charge maximale avec des colis tous différents (la valeur d'un colis = son poids).", b: "subset sum" }
        ];
        var sel = [];
        cas.forEach(function (c) {
          var l = el("div", "saisie"); l.style.margin = ".4rem 0";
          var lab = el("label", null, c.t); lab.style.flex = "1 1 14rem";
          var s = el("select"); noms.forEach(function (n) { var o = el("option", null, n); o.value = n; s.appendChild(o); });
          s.addEventListener("change", verif);
          l.appendChild(lab); l.appendChild(s); zone.appendChild(l); sel.push(s);
        });
        function verif() {
          var j = 0, r = 0;
          sel.forEach(function (s, i) { if (s.value !== "?") r++; if (s.value === cas[i].b) j++; });
          if (j === cas.length) { sel.forEach(function (s) { s.disabled = true; }); api.retour("Tout est juste.", true); api.valider("Le cours pose aussi la question : comment maximiser ou minimiser le nombre d'objets ? (exercice 1 : toutes les valeurs valent 1, on maximise donc le nombre d'objets)."); }
          else if (r === cas.length) api.retour(j + " sur 3.", false);
        }
      }
    },

    /* 3 */
    {
      titre: "V1 : poids exactement w",
      texte:
        "<p>Soit V1(w) la plus grande valeur possible quand le poids du sac est <b>égal</b> à w :</p>" +
        "<div class='formule lignes'>V1(w) = max(1≤i≤n) v_i + V1(w − w_i)   si w > 0\nV1(0) = 0\nV1(w) = −∞                     si w < 0</div>" +
        "<p>−∞ signifie « impossible d'atteindre exactement ce poids ». Remplis V1 pour l'exercice 1. Les cases dont dépend la case en cours sont encadrées.</p>",
      objectif: "Remplir V1(0) à V1(8).",
      installer: function (zone, api) {
        donnees(zone, E1, "Exercice 1 du cours");
        new TablePD(zone, {
          colonnes: COLS.slice(0, 9), coin: "w",
          lignes: [{ nom: "V1(w)", valeurs: V1a.slice(0, 9), remplir: [1, 2, 3, 4, 5, 6, 7, 8] }],
          deps: depsV1(E1.objets), aide: aideV1(E1.objets),
          surFin: function () { api.valider("V1(8) = 2 : un objet de 5 et un de 3 (valeur 1 + 1) vaut mieux qu'un seul objet de 8."); }
        });
        PC.html(zone, "Saisie : un entier, ou « – » pour −∞. Valide avec Entrée.", "discret petit");
      }
    },

    /* 4 */
    {
      titre: "V1 jusqu'à W = 17",
      texte: "<p>Même règle, jusqu'à la capacité. Chaque case ne regarde que trois cases plus à gauche (w − 8, w − 5, w − 3).</p>",
      objectif: "Remplir V1(9) à V1(17).",
      installer: function (zone, api) {
        new TablePD(zone, {
          colonnes: COLS, coin: "w",
          lignes: [{ nom: "V1(w)", valeurs: V1a, remplir: [9, 10, 11, 12, 13, 14, 15, 16, 17] }],
          deps: depsV1(E1.objets), aide: aideV1(E1.objets),
          surFin: function () { api.valider("Ligne du cours : 0 – – 1 – 1 2 – 2 3 2 3 4 3 4 5 4 5."); }
        });
      }
    },

    /* 5 */
    {
      titre: "La valeur optimale",
      texte: "<p>Le cours : « la valeur optimale du sac à dos est le <b>maximum</b> de V1 sur [0, W] ». Pourquoi pas simplement V1(W) ?</p>",
      objectif: "Lire la valeur optimale pour deux capacités.",
      installer: function (zone, api) {
        var tb = el("div", "code"); tb.textContent = "w     " + COLS.map(function (c) { return (c + "  ").slice(0, 3); }).join("") + "\nV1(w) " + V1a.map(function (v) { return (t(v) + "  ").slice(0, 3); }).join("");
        zone.appendChild(tb);
        Exercices.nombre(zone, {
          label: "valeur optimale pour W = 17 :", attendu: 5, tolerance: 0, placeholder: "ex. 4",
          bravo: "Exact : 5 (atteint en w = 15 et w = 17).",
          surReussite: function () {
            Exercices.nombre(zone, {
              label: "et pour W = 16 :", attendu: 5, tolerance: 0, placeholder: "ex. 4",
              indice: "V1(16) = 4, mais le sac n'a pas besoin d'être plein : regarde les w ≤ 16.",
              bravo: "Exact : 5, avec un sac de poids 15 (5 objets de 3). V1(16) = 4 seulement.",
              surReussite: function () { api.valider("V1 impose un poids exact ; la réponse autorise un sac pas plein → maximum sur [0, W]."); }
            });
          }
        });
      }
    },

    /* 6 */
    {
      titre: "V2 : poids au plus w",
      texte:
        "<p>Alternative du cours : V2(w) = plus grande valeur quand le poids est <b>inférieur ou égal</b> à w :</p>" +
        "<div class='formule lignes'>V2(w) = max(V1(w), V2(w − 1))   si w ≥ 0\nV2(w) = −∞                   si w < 0</div>" +
        "<p>La valeur optimale est alors directement V2(W).</p>",
      objectif: "Remplir V2 et lire V2(17).",
      installer: function (zone, api) {
        new TablePD(zone, {
          colonnes: COLS, coin: "w",
          lignes: [{ nom: "V1(w)", valeurs: V1a, remplir: false }, { nom: "V2(w)", valeurs: V2a, remplir: true }],
          deps: function (l, c) { return c > 0 ? [[0, c], [1, c - 1]] : [[0, 0]]; },
          aide: function (l, c) { return c === 0 ? "V2(0) = max(V1(0), V2(−1)) = max(0, −∞)." : "max(V1(" + c + ") = " + t(V1a[c]) + ", V2(" + (c - 1) + ") = " + t(V2a[c - 1]) + ")."; },
          surFin: function () { api.valider("V2(17) = 5 = maximum de V1 sur [0, 17] : V2 est un « maximum courant » de V1."); }
        });
      }
    },

    /* 7 */
    {
      titre: "Exercice 2 : une ligne fausse",
      texte:
        "<p>Exercice 2 du cours : objets (8, 3), (5, 2), (3, 1), W = 15. Voici la ligne <b>V1</b> telle qu'elle est imprimée dans les diapos. " +
        "Elle contient des erreurs : touche les cases de V1 qui devraient valoir −∞.</p>",
      objectif: "Trouver les 4 cases fausses de la ligne V1 du cours.",
      installer: function (zone, api) {
        donnees(zone, E2, "Exercice 2 du cours");
        var imprime = [0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6];
        var vrai = SacADos.V1(E2.objets, E2.W);
        var trouves = {};
        var tb = new Tableau(zone, { nom: "V1 (diapo)", compact: true, onCase: function (k) {
          if (vrai[k] === -Infinity && imprime[k] !== -Infinity) { trouves[k] = true; api.retour("V1(" + k + ") : aucune combinaison de 8, 5 et 3 ne fait exactement " + k + " → −∞.", true); }
          else api.retour("V1(" + k + ") = " + t(vrai[k]) + " est juste" + (vrai[k] === -Infinity ? "" : " (" + k + " s'obtient avec des poids 8, 5, 3).") , false);
          maj();
        } });
        function maj() {
          var cl = {}; Object.keys(trouves).forEach(function (k) { cl[k] = "barree"; });
          tb.dessiner(imprime.map(function (v, k) { return trouves[k] ? "–" : v; }), { classes: cl });
          if (Object.keys(trouves).length === 4) {
            PC.html(zone, "Dans les diapos, la ligne V1 de l'exercice 2 est identique à la ligne V2. D'après la définition (et l'exercice 1), V1(1), V1(2), V1(4) et V1(7) valent −∞. La ligne V2 et la réponse V2(15) = 6 sont justes.", "signalement");
            api.valider("Vrai V1 : 0 – – 1 – 2 2 – 3 3 4 4 4 5 5 6 ; V2(15) = 6 (trois objets de 5).");
          }
        }
        maj();
      }
    },

    /* 8 */
    {
      titre: "Coût et programme",
      texte:
        "<p>Le cours : la version décision du sac à dos est NP-complète, mais il existe un algorithme <b>pseudo-polynomial</b> par programmation dynamique.</p>",
      objectif: "Donner le coût du calcul de V1 et comprendre « pseudo-polynomial ».",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Coût du calcul de V1(0..W) pour n objets ?",
          options: ["O(n + W)", "O(n × W)", "O(2^n)"],
          bonne: 1,
          expliquer: ["Non : chaque case regarde les n objets.", "Exact : W + 1 cases, n candidats par case.", "Non : c'est l'énumération de tous les sous-ensembles."],
          surReussite: function () {
            Exercices.choix(zone, {
              question: "Pourquoi « pseudo »-polynomial ?",
              options: ["Parce que W est une valeur, pas une taille : écrit sur b bits, W peut valoir 2^b", "Parce que l'algorithme est probabiliste"],
              bonne: 0,
              expliquer: ["Exact : O(nW) est polynomial en la valeur de W, mais exponentiel en sa taille (son nombre de chiffres).", "Non : il est déterministe."],
              surReussite: function () {
                PC.code(zone,
                  "def v1(objets, W):                  # objets : liste de (w, v)\n" +
                  "    MOINS_INF = float('-inf')\n" +
                  "    V = [0] + [MOINS_INF] * W\n" +
                  "    for w in range(1, W + 1):          # du plus petit au plus grand\n" +
                  "        for wi, vi in objets:\n" +
                  "            if wi <= w and V[w - wi] + vi > V[w]:\n" +
                  "                V[w] = V[w - wi] + vi\n" +
                  "    return V\n\n" +
                  "V = v1([(8, 1), (5, 1), (3, 1)], 17)\n" +
                  "print(max(V))                          # 5  (valeur optimale = max de V1 sur [0, W])");
                api.valider();
              }
            });
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "sac-a-dos-repetition",
    etapes: etapes,
    fin: { cartes: "prog-dyn", texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul>" +
      "<li>V1(w) = max v_i + V1(w − w_i) (poids exact ; −∞ si impossible) ; optimum = max de V1 sur [0, W].</li>" +
      "<li>V2(w) = max(V1(w), V2(w − 1)) (poids ≤ w) ; optimum = V2(W).</li>" +
      "<li>Calcul de gauche à droite, O(nW) : pseudo-polynomial.</li>" +
      "<li>Sans répétition : il faut un deuxième indice → V3(w, k), dans l'atelier.</li></ul></div>" }
  });
})();
