/* Atelier : TF-IDF à la main sur un corpus inédit (cours 2, diapos 21 à 26).
   E1 « good movie good » · E2 « bad movie » · E3 « good plot ». TF normalisée, IDF lissé (ln). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt;
  var CORPUS = N.tableau(["", "document"], [["E1", "good movie good"], ["E2", "bad movie"], ["E3", "good plot"]]);

  var etapes = [
    {
      titre: "Comptes et df",
      texte: CORPUS + "<p>Vocabulaire : good, movie, bad, plot.</p>",
      objectif: "Donner df(good) et la TF normalisée de « good » dans E1.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "df(good) =", attendu: 2, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "TF(good, E1) ≈", attendu: 2 / 3, tolerance: 0.01, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "2 occurrences sur 3 tokens.");
      }
    },
    {
      titre: "IDF",
      texte: CORPUS + "<div class='formule'>idf(t) = ln((1 + N) / (1 + df(t))) + 1, N = 3</div>",
      objectif: "Calculer idf(good) et idf(bad).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "idf(good) ≈", attendu: Math.log(4 / 3) + 1, tolerance: 0.01, placeholder: "ex. 1,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "idf(bad) ≈", attendu: Math.log(2) + 1, tolerance: 0.01, placeholder: "ex. 1,5", surReussite: ok }); }
        ], "« bad » n'apparaît que dans E2 : poids plus fort.");
      }
    },
    {
      titre: "Les vecteurs TF-IDF",
      texte: "<p>Colonnes (good, movie, bad, plot).</p>",
      objectif: "Compléter le poids de « good » dans E1 et de « bad » dans E2.",
      installer: function (zone, api) {
        var mx = new Matrice(zone, { lignes: ["E1", "E2", "E3"], colonnes: ["good", "movie", "bad", "plot"] });
        mx.dessiner([[null, 0.4292, 0, 0], [0, 0.6438, null, 0], [0.6438, 0, 0, 0.8466]], { classes: { "0,0": "courante", "1,2": "courante" } });
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "w(good, E1) ≈", attendu: 2 / 3 * (Math.log(4 / 3) + 1), tolerance: 0.01, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "w(bad, E2) ≈", attendu: 0.5 * (Math.log(2) + 1), tolerance: 0.01, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "E1 ≈ (0,86 ; 0,43 ; 0 ; 0), E2 ≈ (0 ; 0,64 ; 0,85 ; 0), E3 ≈ (0,64 ; 0 ; 0 ; 0,85).");
      }
    },
    {
      titre: "Le document le plus proche de E1",
      texte: "<p>E1 ≈ (0,86 ; 0,43 ; 0 ; 0), E2 ≈ (0 ; 0,64 ; 0,85 ; 0), E3 ≈ (0,64 ; 0 ; 0 ; 0,85).</p>",
      objectif: "Calculer cos(E1, E3), puis choisir le plus proche.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "cos(E1, E3) ≈", attendu: 0.5414, tolerance: 0.02, placeholder: "ex. 0,5", indice: "E1 · E3 = 0,86 × 0,64 ; normes ≈ 0,96 et 1,06.", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "cos(E1, E2) ≈ 0,27. Le plus proche de E1 est…", options: ["E3 (ils partagent « good », le terme le plus lourd de E1)", "E2 (ils partagent « movie »)"], bonne: 0, expliquer: ["Exact.", "Non : « movie » pèse moins que « good » dans E1."], surReussite: ok }); }
        ], "Avec les comptes bruts, on aurait cos(E1, E2) ≈ 0,32 et cos(E1, E3) ≈ 0,63 : le classement est le même, mais TF-IDF accentue l'écart.");
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "tf-idf-main", etapes: etapes, fin: { texte: "<p>Comptes → df → IDF lissé → TF × IDF → cosinus.</p>", cartes: "pipeline-creux" } });
})();
