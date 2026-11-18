/* Test : évaluer un classifieur. Matrices et chiffres inventés pour le test. */
Tests.enregistrer({
  matiere: "ai-models", id: "test-evaluation", titre: "Test : métriques",
  notions: {
    zones: { titre: "Matrice et zones TP/FN/FP/TN", lecon: "matrice-confusion" },
    metriques: { titre: "Accuracy, precision, recall, F1", lecon: "matrice-confusion" },
    moyennes: { titre: "Macro, micro, pondéré, déséquilibre", lecon: "matrice-confusion" },
    seuil: { titre: "Seuil, ROC, PR", lecon: "seuil-roc-pr" },
    calibration: { titre: "Calibration et incertitude", lecon: "seuil-roc-pr" }
  },
  questions: [
    { id: "q1", notion: "zones", enonce: "Matrice (lignes = vraies classes A, B) : [[30, 10], [5, 55]]. FN(A) = ?", options: ["10", "55", "30", "5"], bonnes: [0], explication: "FN(A) = reste de la ligne A = 10." },
    { id: "q2", notion: "zones", enonce: "Même matrice. FP(A) = ?", options: ["0", "10", "5", "55"], bonnes: [2], explication: "FP(A) = reste de la colonne A = 5." },
    { id: "q3", notion: "metriques", enonce: "Même matrice. Precision(A) = ?", options: ["30/35", "55/60", "30/40", "85/100"], bonnes: [0], explication: "TP / (TP + FP) = 30 / 35." },
    { id: "q4", notion: "metriques", enonce: "Même matrice. Recall(A) = ?", options: ["30/35", "55/65", "85/100", "30/40"], bonnes: [3], explication: "TP / (TP + FN) = 30 / 40 = 0,75." },
    { id: "q5", notion: "metriques", enonce: "TP = 20, FP = 5, FN = 15. F1 = ?", options: ["40/45 ≈ 0,889", "40/60 ≈ 0,667", "20/40 = 0,5", "20/25 = 0,8"], bonnes: [1], explication: "2TP / (2TP + FP + FN) = 40 / 60." },
    { id: "q6", notion: "metriques", enonce: "Quelles formules sont correctes ? (plusieurs réponses)", options: ["Spécificité = TN / (TN + FP)", "Precision = TP / (TP + FN)", "Accuracy = (TP + TN) / Total", "Recall = TP / (TP + FN)"], bonnes: [0, 2, 3], explication: "Precision = TP / (TP + FP)." },
    { id: "q7", notion: "moyennes", enonce: "Pour une classification multi-classe à une seule étiquette, le micro-F1 est égal à…", options: ["le macro-F1", "l'accuracy", "le F1 pondéré", "la moyenne des recalls"], bonnes: [1], explication: "Fiche, section 5." },
    { id: "q8", notion: "moyennes", enonce: "Une petite classe mal reconnue fait davantage baisser…", options: ["l'accuracy", "le F1 pondéré", "le macro-F1"], bonnes: [2], explication: "En macro, chaque classe pèse autant, quelle que soit sa taille." },
    { id: "q9", notion: "moyennes", enonce: "95 % de négatifs, un modèle prédit toujours « négatif ». Son recall vaut :", options: ["0,05", "0", "0,95", "1"], bonnes: [1], explication: "Aucun vrai positif détecté ; accuracy 0,95 pourtant." },
    { id: "q10", notion: "seuil", enonce: "On abaisse le seuil t. Typiquement :", options: ["rien ne change", "recall ↓, precision ↑", "recall ↑, precision ↓", "les deux ↑"], bonnes: [2], explication: "Plus de prédictions positives." },
    { id: "q11", notion: "seuil", enonce: "La courbe ROC trace…", options: ["TPR en fonction de FPR", "precision en fonction de recall", "FPR en fonction de TPR", "accuracy en fonction du seuil"], bonnes: [0], explication: "Un point (FPR, TPR) par seuil." },
    { id: "q12", notion: "seuil", enonce: "Scores : positifs 0,9 et 0,4 ; négatifs 0,6 et 0,2. AUC = ?", options: ["1/2", "1/4", "3/4", "1"], bonnes: [2], explication: "Paires bien ordonnées : (0,9 > 0,6), (0,9 > 0,2), (0,4 > 0,2) : 3 sur 4." },
    { id: "q13", notion: "seuil", enonce: "Avec très peu de positifs, quelle courbe est souvent plus informative ?", options: ["ROC", "precision–recall", "aucune différence"], bonnes: [1], explication: "Le FPR est dilué par les nombreux négatifs." },
    { id: "q14", notion: "calibration", enonce: "Parmi les exemples à qui le modèle donne p̂ = 0,7, 40 % sont positifs. Le modèle est…", options: ["sous-confiant", "parfaitement calibré", "sur-confiant (mal calibré)"], bonnes: [2], explication: "Calibré si la fréquence observée ≈ la probabilité annoncée (70 %)." },
    { id: "q15", notion: "calibration", enonce: "Accuracy 0,9 sur N = 400. SE = ?", options: ["0,03", "0,0225", "0,015", "0,009"], bonnes: [2], explication: "√(0,9·0,1/400) = √0,000225 = 0,015 ; IC ≈ 0,9 ± 0,029." }
  ]
});
