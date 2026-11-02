/* Test noté : rappels ML/DL (cours 1, TP 1). */
Tests.enregistrer({
  matiere: "nlp-deep-learning", id: "test-rappels", titre: "Test : rappels ML/DL",
  notions: {
    paradigmes: { titre: "Paradigmes et problème d'apprentissage", lecon: "probleme-apprentissage" },
    optim: { titre: "Régression et descente de gradient", lecon: "descente-gradient" },
    gen: { titre: "Généralisation et régularisation", lecon: "sur-apprentissage" },
    reseau: { titre: "Neurone et réseau", lecon: "neurone-reseau" },
    metriques: { titre: "Métriques", lecon: "mesurer-performance" },
    donnees: { titre: "Données : audit, nettoyage, transformations", lecon: "nettoyer" },
    fuite: { titre: "Déséquilibre et fuite", lecon: "desequilibre-fuite" },
    code: { titre: "Code du TP 1", lecon: "auditer-explorer" }
  },
  questions: [
    { id: "q1", notion: "paradigmes", enonce: "Regrouper des articles par thème sans étiquettes est…", options: ["non supervisé (clustering)", "supervisé (classification)", "de la régression"], bonnes: [0], explication: "Pas de cible y." },
    { id: "q2", notion: "paradigmes", enonce: "Prédire le mot caché dans « The cat sat on the [MASK] » sur un grand corpus brut est…", options: ["auto-supervisé", "supervisé avec annotation humaine", "non supervisé par clustering"], bonnes: [0], explication: "La cible vient du texte lui-même." },
    { id: "q3", notion: "paradigmes", enonce: "Selon le cours, apprendre c'est…", options: ["choisir les paramètres qui réduisent l'erreur attendue sur des données jamais vues", "obtenir la perte d'entraînement la plus basse possible", "mémoriser les exemples"], bonnes: [0], explication: "Diapos 14-15." },
    { id: "q4", notion: "optim", enonce: "Prédictions (1, 3), cibles (2, 3). MSE = ?", options: ["0,5", "1", "0,25", "2"], bonnes: [0], explication: "(1 + 0)/2." },
    { id: "q5", notion: "optim", enonce: "θ = 2, dL/dθ = 5, η = 0,1. Après un pas, θ = ?", options: ["1,5", "2,5", "−3", "1,9"], bonnes: [0], explication: "2 − 0,1 × 5." },
    { id: "q6", notion: "optim", enonce: "La perte augmente en oscillant à chaque itération. Que faire en premier ?", options: ["diminuer η", "augmenter η", "ajouter des époques"], bonnes: [0], explication: "Pas trop grand : divergence." },
    { id: "q7", notion: "optim", enonce: "1 000 exemples, batch_size = 100, 6 époques : combien de pas de gradient ?", options: ["60", "6", "600", "6 000"], bonnes: [0], explication: "10 pas par époque × 6." },
    { id: "q8", notion: "gen", enonce: "Perte d'entraînement 0,05, perte de validation 0,90 :", options: ["sur-apprentissage", "sous-apprentissage", "bon ajustement"], bonnes: [0], explication: "Grand écart de généralisation." },
    { id: "q9", notion: "gen", enonce: "Lesquelles sont des techniques de régularisation citées par le cours ?", options: ["dropout", "early stopping", "augmenter le nombre d'époques", "data augmentation"], bonnes: [0, 1, 3], explication: "+ weight decay et modèle plus petit." },
    { id: "q10", notion: "reseau", enonce: "Couche Dense de 64 entrées vers 4 sorties : nombre de paramètres ?", options: ["260", "256", "68", "64"], bonnes: [0], explication: "64 × 4 + 4." },
    { id: "q11", notion: "reseau", enonce: "Couche de sortie pour 4 thèmes exclusifs ?", options: ["Dense(4, activation=\"softmax\")", "Dense(1)", "Dense(4) sans activation", "Dense(1, activation=\"sigmoid\")"], bonnes: [0], explication: "4 probabilités de somme 1 (TP 4)." },
    { id: "q12", notion: "metriques", enonce: "Matrice de confusion [[8, 2], [4, 6]] (lignes = vraies). Rappel de la classe 1 (2e ligne) ?", options: ["0,6", "0,75", "0,7", "0,8"], bonnes: [0], explication: "6 / (4 + 6)." },
    { id: "q13", notion: "metriques", enonce: "Même matrice. Précision de la classe 1 ?", options: ["0,75", "0,6", "0,7"], bonnes: [0], explication: "6 / (2 + 6)." },
    { id: "q14", notion: "metriques", enonce: "Pourquoi rapporter le macro-F1 en plus de l'accuracy ?", options: ["il donne le même poids à chaque classe et révèle les échecs sur les classes rares", "il est toujours plus élevé", "il ne dépend pas des prédictions"], bonnes: [0], explication: "" },
    { id: "q15", notion: "donnees", enonce: "Série 1, 2, 3, 100. Laquelle est la plus robuste ?", options: ["la médiane (2,5)", "la moyenne (26,5)", "le maximum"], bonnes: [0], explication: "" },
    { id: "q16", notion: "donnees", enonce: "Standardisation : μ = 50, σ = 5 (train). z pour x = 40 ?", options: ["−2", "2", "−10", "0,8"], bonnes: [0], explication: "(40 − 50)/5." },
    { id: "q17", notion: "donnees", enonce: "Couleur ∈ {rouge, vert, bleu} pour un modèle linéaire :", options: ["one-hot", "rouge = 1, vert = 2, bleu = 3", "supprimer la colonne"], bonnes: [0], explication: "Pas d'ordre arbitraire." },
    { id: "q18", notion: "fuite", enonce: "Lesquelles sont des fuites ?", options: ["ajuster le scaler sur train + test", "imputer le test avec la médiane du train", "adapter le vocabulaire sur la validation", "choisir l'architecture sur le test"], bonnes: [0, 2, 3], explication: "Seule la 2e applique au test un paramètre appris sur le train." },
    { id: "q19", notion: "fuite", enonce: "Rôle de l'ensemble de validation ?", options: ["surveiller l'entraînement et choisir modèles et réglages", "ajuster les poids", "rapporter la performance finale"], bonnes: [0], explication: "" },
    { id: "q20", notion: "code", enonce: "<code>pd.Series([2, 4, 6]).std()</code> renvoie…", options: ["2.0", "1.633…", "4.0", "0"], bonnes: [0], explication: "ddof=1 : √((4 + 0 + 4)/2) = 2." },
    { id: "q21", notion: "code", enonce: "<code>pd.Series([\"a\", \"b\", \"a\", \"a\"]).value_counts(normalize=True)[\"a\"]</code> ?", options: ["0.75", "3", "0.25"], bonnes: [0], explication: "" },
    { id: "q22", notion: "code", enonce: "Un DataFrame de 10 lignes dont 3 contiennent au moins un NaN. <code>len(df.dropna())</code> ?", options: ["7", "10", "3"], bonnes: [0], explication: "" }
  ]
});
