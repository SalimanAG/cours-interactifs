/* Test : sous-apprentissage, sur-apprentissage, régularisation. Situations inventées. */
Tests.enregistrer({
  matiere: "ai-models", id: "test-ajustement", titre: "Test : ajustement",
  notions: {
    diagnostic: { titre: "Diagnostic train / validation", lecon: "diagnostiquer-ajustement" },
    fuite: { titre: "Fuite de données et découpage", lecon: "diagnostiquer-ajustement" },
    regul: { titre: "Remèdes et régularisation", lecon: "diagnostiquer-ajustement" }
  },
  questions: [
    { id: "q1", notion: "diagnostic", enonce: "Accuracy train 61 %, validation 59 %, alors qu'une baseline fait 80 %. Diagnostic probable ?", options: ["sous-apprentissage", "sur-apprentissage", "fuite de données"], bonnes: [0], explication: "Les deux erreurs sont hautes et proches." },
    { id: "q2", notion: "diagnostic", enonce: "Train 99 %, validation 74 %. Diagnostic probable ?", options: ["sous-apprentissage", "bon ajustement", "sur-apprentissage"], bonnes: [2], explication: "Grand écart." },
    { id: "q3", notion: "diagnostic", enonce: "La prédiction moyenne est trop basse de 2 unités. Biais² =", options: ["4", "2", "−2", "−4"], bonnes: [0], explication: "(−2)² = 4." },
    { id: "q4", notion: "diagnostic", enonce: "Quand la complexité augmente, typiquement…", options: ["le biais² baisse et la variance monte", "le biais² monte et la variance baisse", "les deux baissent"], bonnes: [0], explication: "D'où le compromis." },
    { id: "q5", notion: "fuite", enonce: "Lesquels sont des fuites de données ? (plusieurs réponses)", options: ["un même patient présent dans le train et dans le test", "standardiser avec la moyenne de tout le jeu avant de découper", "ajuster le scaler sur le train seulement", "utiliser une variable mesurée après l'événement à prédire"], bonnes: [0, 1, 3], explication: "La dernière est la bonne pratique." },
    { id: "q6", notion: "fuite", enonce: "Prévision de la demande heure par heure : comment découper ?", options: ["aléatoirement", "chronologiquement (passé → futur)", "par ordre alphabétique des jours"], bonnes: [1], explication: "Sinon le futur fuit dans l'entraînement." },
    { id: "q7", notion: "fuite", enonce: "On compare 20 modèles sur le jeu de test et on garde le meilleur. Problème ?", options: ["aucun", "le modèle sous-apprend", "le test devient une partie du réglage : son score est optimiste"], bonnes: [2], explication: "Choisir sur la validation, tester une fois." },
    { id: "q8", notion: "regul", enonce: "Ridge sous-ajuste. On…", options: ["augmente alpha", "diminue alpha", "passe à Lasso avec alpha plus grand"], bonnes: [1], explication: "Moins de pénalité." },
    { id: "q9", notion: "regul", enonce: "Quelle pénalité peut mettre des coefficients exactement à zéro ?", options: ["L2 (Ridge)", "aucune", "L1 (Lasso)"], bonnes: [2], explication: "Sélection de variables." },
    { id: "q10", notion: "regul", enonce: "LogisticRegression : laquelle régularise le plus ?", options: ["C = 1000", "C = 0,1", "C = 10"], bonnes: [1], explication: "Petit C = forte régularisation." },
    { id: "q11", notion: "regul", enonce: "Remèdes au sur-apprentissage d'un réseau de neurones (plusieurs réponses) :", options: ["dropout", "augmentation de données", "arrêt précoce", "entraîner plus longtemps sans validation"], bonnes: [0, 1, 2], explication: "Le dernier aggrave en général le problème." },
    { id: "q12", notion: "regul", enonce: "La validation croisée…", options: ["estime la performance sur plusieurs découpages", "régularise le modèle final", "corrige les fuites de données"], bonnes: [0], explication: "Elle ne fait ni l'un ni l'autre des deux derniers." }
  ]
});
