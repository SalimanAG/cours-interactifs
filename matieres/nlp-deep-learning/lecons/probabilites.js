/* Leçon 0.5 : Probabilités de base — empiriques, marginales, indépendance
   (prérequis, hors diapos ; liens : PMI/PPMI, cours 2 diapos 34-35 ;
   proportions et déséquilibre des classes, cours 1 et TP 1).
   Fil rouge : la matrice de co-occurrence du cours 2 (diapo 34), N = 51. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var C = [[8, 7, 0, 0], [6, 9, 0, 0], [0, 0, 11, 10]];
  var MOTS = ["cat", "dog", "model"], CTX = ["eats", "food", "trains", "data"];
  function figure(zone, cl) {
    var mx = new Matrice(zone, { nom: "count", lignes: MOTS.concat(["total"]), colonnes: CTX.concat(["total"]) });
    var v = C.map(function (l) { return l.concat([l.reduce(function (a, b) { return a + b; }, 0)]); });
    v.push([14, 16, 11, 10, 51]);
    mx.dessiner(v, { classes: cl || {}, format: function (x) { return String(x); } });
  }

  var etapes = [
    {
      titre: "Une probabilité empirique : compter puis diviser",
      texte:
        "<p>Dans un corpus, on a compté combien de fois chaque mot (lignes) apparaît près de chaque mot de contexte (colonnes). Au total N = 51 paires. " +
        "La probabilité <b>jointe</b> empirique d'une paire est sa fréquence :</p>" +
        "<div class='formule'>P(w, c) = count(w, c) / N</div>",
      objectif: "Calculer P(cat, eats), à 0,001 près.",
      installer: function (zone, api) {
        figure(zone, { "0,0": "courante", "3,4": "courante" });
        Exercices.nombre(zone, { label: "P(cat, eats) ≈", attendu: 8 / 51, tolerance: 0.001, placeholder: "ex. 0,1", indice: "8 / 51.", bravo: "≈ 0,157.", surReussite: function () { api.valider("Toutes les P(w, c) du tableau somment à 1."); } });
      }
    },
    {
      titre: "Probabilités marginales",
      texte:
        "<p>En sommant une ligne (ou une colonne), on obtient la probabilité d'un mot seul, quel que soit l'autre :</p>" +
        "<div class='formule'>P(w) = count(w, ·) / N        P(c) = count(·, c) / N</div>",
      objectif: "Calculer P(cat) et P(eats).",
      installer: function (zone, api) {
        figure(zone, { "0,4": "courante", "3,0": "courante" });
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "P(cat) ≈", attendu: 15 / 51, tolerance: 0.001, placeholder: "ex. 0,1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "P(eats) ≈", attendu: 14 / 51, tolerance: 0.001, placeholder: "ex. 0,1", surReussite: ok }); }
        ], "P(cat) = 15/51 ≈ 0,294 ; P(eats) = 14/51 ≈ 0,275.");
      }
    },
    {
      titre: "Indépendance",
      texte:
        "<p>Deux événements sont <b>indépendants</b> si savoir l'un ne change rien à l'autre ; alors la probabilité jointe est le produit :</p>" +
        "<div class='formule'>indépendants ⇔ P(w, c) = P(w) · P(c)</div>" +
        "<p>Le produit P(w)·P(c) est donc la probabilité <b>attendue par hasard</b> si w et c n'avaient aucun lien.</p>",
      objectif: "Calculer P(cat)·P(eats) et comparer à P(cat, eats).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "P(cat)·P(eats) ≈", attendu: (15 / 51) * (14 / 51), tolerance: 0.001, placeholder: "ex. 0,1", bravo: "≈ 0,081.", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Observé : P(cat, eats) ≈ 0,157. Donc « cat » et « eats »…", options: ["apparaissent ensemble plus souvent que par hasard", "apparaissent ensemble moins souvent que par hasard", "sont indépendants"], bonne: 0, expliquer: ["0,157 > 0,081 : environ deux fois plus que le hasard.", "Non : 0,157 > 0,081.", "Non : il faudrait l'égalité."], surReussite: ok }); }
        ], "Comparer « observé » et « attendu sous indépendance » : c'est exactement l'idée de la PMI du cours 2.");
      }
    },
    {
      titre: "Un rapport, puis un logarithme : la PMI",
      texte:
        "<p>Le cours 2 définit <span class='mono'>PMI(w, c) = log( P(w, c) / (P(w) P(c)) )</span>. Rapport > 1 → PMI > 0 ; rapport = 1 → 0 ; rapport < 1 → négatif.</p>",
      objectif: "Calculer PMI(cat, eats) avec ln, à 0,01 près.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "PMI(cat, eats) ≈", attendu: Math.log((8 / 51) / ((15 / 51) * (14 / 51))), tolerance: 0.01, placeholder: "ex. 1", indice: "ln(0,157 / 0,081), ou directement ln(8 × 51 / (15 × 14)).", bravo: "≈ 0,66. (La diapo 34 affiche 1,92 pour cette case : cette valeur ne découle pas du tableau de comptes ; on en reparle au chapitre 2.)", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Une distribution : des proportions qui somment à 1",
      texte:
        "<p>Les proportions des classes d'un jeu de données forment une <b>distribution</b> (pandas : <span class='mono'>value_counts(normalize=True)</span>). " +
        "Le TP 1 mesure le déséquilibre par le <b>ratio</b> <span class='mono'>plus grande classe / plus petite classe</span>.</p>" +
        "<p>Exemple du cours 1 (diapo 47) : classes A, B, C à 82 %, 11 %, 7 %.</p>",
      objectif: "Calculer le ratio de déséquilibre.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "ratio ≈", attendu: 82 / 7, tolerance: 0.05, placeholder: "ex. 2", indice: "82 / 7.", bravo: "≈ 11,7 : la classe A est presque 12 fois plus fréquente que C.", surReussite: function () { api.valider("Un modèle qui répond toujours « A » aurait déjà 82 % d'accuracy : on y reviendra avec le macro-F1."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "probabilites", etapes: etapes,
    fin: { texte: "<ul><li>P(w, c) = count(w, c) / N ; marginales P(w), P(c) par sommes de lignes / colonnes.</li><li>Indépendance : P(w, c) = P(w)·P(c), la référence « hasard ».</li><li>PMI = log(observé / attendu sous indépendance).</li><li>Proportions de classes ; ratio de déséquilibre = max / min.</li></ul>", cartes: "prerequis" }
  });
})();
