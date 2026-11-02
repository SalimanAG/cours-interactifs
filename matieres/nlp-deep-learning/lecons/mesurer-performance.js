/* Leçon 1.7 : Mesurer la performance (cours 1, diapos 13, 40, 47 ; TP 4 :
   classification_report, ConfusionMatrixDisplay, macro-F1).
   Fil rouge : la matrice de confusion à 3 classes de la diapo 40. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var M = [[62, 8, 3], [11, 49, 7], [2, 9, 54]], CL = ["A", "B", "C"];
  function figure(zone, cl, lc, cc, onCase) {
    var mx = new Matrice(zone, { nom: "vraie ↓ / prédite →", lignes: CL, colonnes: CL, onCase: onCase });
    mx.dessiner(M, { classes: cl || {}, lignesClasses: lc || {}, colonnesClasses: cc || {}, format: function (v) { return String(v); } });
    return mx;
  }
  function P(k) { return M[k][k] / (M[0][k] + M[1][k] + M[2][k]); }
  function R(k) { return M[k][k] / M[k].reduce(function (a, b) { return a + b; }, 0); }
  function F(k) { return 2 * P(k) * R(k) / (P(k) + R(k)); }

  var etapes = [
    {
      titre: "La matrice de confusion",
      texte:
        "<p>Le cours (diapo 40) et le TP 4 : les <b>lignes</b> sont les classes <b>vraies</b>, les <b>colonnes</b> les classes <b>prédites</b>. " +
        "La diagonale compte les bonnes réponses ; hors diagonale, chaque case dit quelle classe est confondue avec laquelle. 205 exemples de validation, 3 classes.</p>",
      objectif: "Toucher la case « vrais B prédits A ».",
      tester: function (z) { z.querySelectorAll(".matrice td")[3].click(); },
      installer: function (zone, api) {
        var mx = figure(zone, {}, {}, {}, function (i, j) {
          if (i === 1 && j === 0) { mx.dessiner(M, { classes: { "1,0": "choisie" }, format: String }); api.retour("11 exemples de classe B ont été pris pour des A.", true); api.valider("Question du cours : quelles classes sont les plus confondues ? Ici, B avec A (11) et B avec C (7 et 9)."); }
          else api.retour("Case (vraie " + CL[i] + ", prédite " + CL[j] + ") = " + M[i][j] + ". Ligne = vraie classe.", false);
        });
      }
    },
    {
      titre: "Accuracy",
      texte: "<div class='formule'>accuracy = bonnes prédictions / total = somme de la diagonale / somme de toutes les cases</div>",
      objectif: "Calculer l'accuracy, à 0,001 près.",
      installer: function (zone, api) {
        figure(zone, { "0,0": "courante", "1,1": "courante", "2,2": "courante" });
        Exercices.nombre(zone, { label: "accuracy ≈", attendu: 165 / 205, tolerance: 0.001, placeholder: "ex. 0,5", indice: "(62 + 49 + 54) / 205.", bravo: "165 / 205 ≈ 0,805.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Précision d'une classe",
      texte:
        "<p>Le cours cite précision, rappel et F1 sans les définir (complément). Pour une classe k :</p>" +
        "<div class='formule'>précision(k) = bien prédits k / tous les prédits k   (la colonne k)</div>" +
        "<p>« Quand le modèle dit k, a-t-il raison ? »</p>",
      objectif: "Calculer la précision de A, à 0,001 près.",
      installer: function (zone, api) {
        figure(zone, { "0,0": "choisie" }, {}, { 0: "courante" });
        Exercices.nombre(zone, { label: "précision(A) ≈", attendu: P(0), tolerance: 0.001, placeholder: "ex. 0,5", indice: "62 / (62 + 11 + 2).", bravo: "62 / 75 ≈ 0,827.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Rappel d'une classe",
      texte: "<div class='formule'>rappel(k) = bien prédits k / tous les vrais k   (la ligne k)</div><p>« Parmi les vrais k, combien le modèle en retrouve-t-il ? »</p>",
      objectif: "Calculer le rappel de A, à 0,001 près.",
      installer: function (zone, api) {
        figure(zone, { "0,0": "choisie" }, { 0: "courante" });
        Exercices.nombre(zone, { label: "rappel(A) ≈", attendu: R(0), tolerance: 0.001, placeholder: "ex. 0,5", indice: "62 / (62 + 8 + 3).", bravo: "62 / 73 ≈ 0,849.", surReussite: function () { api.valider("Question 5 du TP 4 : « quelle classe a le plus faible rappel, et quelle autre classe reçoit la plupart de ses erreurs ? » → on lit la ligne."); } });
      }
    },
    {
      titre: "Le F1",
      texte: "<div class='formule'>F1 = 2 · précision · rappel / (précision + rappel)</div><p>Moyenne harmonique : elle est basse dès que l'une des deux est basse.</p>",
      objectif: "Calculer le F1 de A, à 0,001 près.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "F1(A) ≈", attendu: F(0), tolerance: 0.002, placeholder: "ex. 0,5", indice: "2 × 0,827 × 0,849 / (0,827 + 0,849).", bravo: "≈ 0,838.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Macro-F1 : chaque classe compte autant",
      texte:
        "<p>Le <b>macro-F1</b> est la moyenne simple des F1 des classes (le TP 4 : <span class='mono'>f1_score(..., average=\"macro\")</span>). " +
        "Il donne le même poids à chaque classe, même rare ; l'accuracy, elle, est dominée par les classes fréquentes.</p>" +
        N.tableau(["classe", "précision", "rappel", "F1"], [0, 1, 2].map(function (k) { return [CL[k], fmt(P(k), 3), fmt(R(k), 3), k ? fmt(F(k), 3) : "0,838"]; })),
      objectif: "Calculer le macro-F1, à 0,002 près.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "macro-F1 ≈", attendu: (F(0) + F(1) + F(2)) / 3, tolerance: 0.002, placeholder: "ex. 0,5", bravo: "≈ 0,804, proche de l'accuracy : les classes sont équilibrées. Ce ne sera plus vrai avec des classes déséquilibrées (leçon suivante sur le déséquilibre).", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Le bon outil selon la situation",
      texte: "<p>Récapitulatif des métriques du cours (diapo 13) : classification (accuracy, précision, rappel, F1), régression (MAE, MSE, RMSE, R²), non supervisé (silhouette, inertie, erreur de reconstruction), génération (perplexité, métriques de tâche, évaluation humaine).</p>",
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Avec des classes déséquilibrées, il faut rapporter aussi le macro-F1 et les métriques par classe.", vrai: true },
          { texte: "Une précision de 1 pour une classe signifie qu'on retrouve tous ses exemples.", vrai: false, explication: "" },
          { texte: "Le rappel d'une classe se lit sur sa ligne de la matrice de confusion.", vrai: true },
          { texte: "On choisit la métrique après avoir vu laquelle donne le meilleur résultat.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider("Précision 1 = aucune fausse alerte ; c'est le rappel 1 qui veut dire « on retrouve tout »."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "mesurer-performance", etapes: etapes,
    fin: { texte: "<ul><li>Matrice de confusion : lignes = vraies classes, colonnes = prédites.</li><li>Accuracy = diagonale / total.</li><li>Précision(k) = diagonale / colonne k ; rappel(k) = diagonale / ligne k ; F1 = moyenne harmonique.</li><li>Macro-F1 = moyenne des F1 : chaque classe pèse autant.</li></ul>", cartes: "rappels-donnees" }
  });
})();
