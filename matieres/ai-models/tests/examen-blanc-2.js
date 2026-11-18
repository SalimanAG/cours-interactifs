/* Examen blanc 2 : chapitres 6 à 10. Format de l'examen inconnu : questions inventées sur le contenu du cours. */
Tests.enregistrer({
  matiere: "ai-models", id: "examen-blanc-2", titre: "Examen blanc 2 : chapitres 6 à 10",
  notions: {
    "ajust": {"titre": "Sous- et sur-apprentissage", "lecon": "diagnostiquer-ajustement"},
    "conv": {"titre": "Convolution", "lecon": "convolution-pas-a-pas"},
    "formes": {"titre": "Formes et paramètres d'un CNN", "lecon": "formes-parametres"},
    "rnn": {"titre": "RNN", "lecon": "rnn-a-la-main"},
    "gnn": {"titre": "GNN", "lecon": "passage-messages"},
    "gcn": {"titre": "Normalisation GCN", "lecon": "normalisation-gcn"},
    "svm": {"titre": "Marge maximale", "lecon": "marge-maximale"},
    "noyaux": {"titre": "Noyaux", "lecon": "noyaux"}
  },
  questions: [
    { "id": "f1", "notion": "ajust", "enonce": "Accuracy train 98 %, validation 70 %. Diagnostic probable ?", "options": ["bon ajustement", "sur-apprentissage", "fuite de données certaine", "sous-apprentissage"], "bonnes": [1], "explication": "Grand écart train / validation." },
    { "id": "f2", "notion": "ajust", "enonce": "Train 60 %, validation 58 %, une baseline simple fait 85 %. Diagnostic probable ?", "options": ["bon ajustement", "sur-apprentissage", "sous-apprentissage"], "bonnes": [2], "explication": "Mauvais partout, même sur l'entraînement." },
    { "id": "f3", "notion": "ajust", "enonce": "Lesquelles sont des fuites de données ? (plusieurs réponses)", "options": ["mettre à l'échelle dans un pipeline ajusté sur l'entraînement", "choisir les hyperparamètres sur le jeu de test", "mélanger au hasard une série temporelle avant de découper", "normaliser sur tout le jeu avant de découper"], "bonnes": [1, 2, 3], "explication": "Le pipeline évite justement la fuite." },
    { "id": "f4", "notion": "ajust", "enonce": "Quelle pénalité peut mettre des coefficients exactement à zéro ?", "options": ["L2 (Ridge)", "L1 (Lasso)", "aucune"], "bonnes": [1], "explication": "L1 produit des solutions creuses." },
    { "id": "f5", "notion": "formes", "enonce": "n = 28, k = 3, s = 1, p = 1. n_out = ?", "options": ["14", "28", "26", "30"], "bonnes": [1], "explication": "⌊(28 + 2 − 3)/1⌋ + 1." },
    { "id": "f6", "notion": "formes", "enonce": "n = 32, k = 4, s = 2, p = 1. n_out = ?", "options": ["31", "16", "17", "15"], "bonnes": [1], "explication": "⌊(32 + 2 − 4)/2⌋ + 1." },
    { "id": "f7", "notion": "formes", "enonce": "Conv 5×5, 16 filtres, entrée à 3 canaux. Paramètres (poids + biais) ?", "options": ["400", "416", "1 200", "1 216"], "bonnes": [3], "explication": "5·5·3·16 + 16." },
    { "id": "f8", "notion": "conv", "enonce": "X = (2 1 ; 0 3), K = (1 1 ; −1 0), b = 1. Sortie (une seule position, calcul des frameworks sans retourner K) ?", "options": ["5", "4", "3", "6"], "bonnes": [1], "explication": "2 + 1 + 0 + 0 + 1 (corrélation croisée)." },
    { "id": "f9", "notion": "formes", "enonce": "Max pooling 2×2, stride 2, sur une carte 32×32×64. Sortie ?", "options": ["31×31×64", "32×32×64", "16×16×32", "16×16×64"], "bonnes": [3], "explication": "Le pooling agit canal par canal." },
    { "id": "f10", "notion": "rnn", "enonce": "hₜ = tanh(0,5 hₜ₋₁ + xₜ), h₀ = 0, x₁ = 0,5. h₁ ≈ ?", "options": ["0,762", "0,245", "0,462", "0,500"], "bonnes": [2], "explication": "tanh(0,5)." },
    { "id": "f11", "notion": "rnn", "enonce": "La BPTT est…", "options": ["la rétropropagation appliquée au réseau déplié dans le temps", "un optimiseur comme Adam", "une couche récurrente"], "bonnes": [0], "explication": "On additionne les contributions de chaque pas (poids partagés)." },
    { "id": "f12", "notion": "rnn", "enonce": "Le gradient clipping protège contre…", "options": ["l'évanouissement seulement", "l'explosion du gradient seulement", "les deux"], "bonnes": [1], "explication": "Contre l'évanouissement : LSTM / GRU, initialisation…" },
    { "id": "f13", "notion": "rnn", "enonce": "Classer le sentiment d'une phrase est un schéma…", "options": ["plusieurs → plusieurs", "un → un", "plusieurs → un", "un → plusieurs"], "bonnes": [2], "explication": "Une sortie pour toute la séquence." },
    { "id": "f14", "notion": "gcn", "enonce": "d̃ᵢ = 2, d̃ⱼ = 8, arête (i, j). Â_ij = ?", "options": ["1/2", "1/4", "1/16", "1/10"], "bonnes": [1], "explication": "1/√(2·8)." },
    { "id": "f15", "notion": "gnn", "enonce": "Après 2 couches de passage de messages, un nœud dépend des nœuds à au plus…", "options": ["4 sauts", "2 sauts", "1 saut", "tout le graphe"], "bonnes": [1], "explication": "L couches = L sauts." },
    { "id": "f16", "notion": "gnn", "enonce": "Quel agrégateur distingue les voisinages {2, 2} et {2} ?", "options": ["la moyenne", "le max", "la somme"], "bonnes": [2], "explication": "4 contre 2 ; moyenne et max donnent 2 et 2." },
    { "id": "f17", "notion": "svm", "enonce": "SVM canonique, w = (0, 2). Marge ?", "options": ["4", "1", "1/2", "2"], "bonnes": [1], "explication": "2/‖w‖ = 2/2." },
    { "id": "f18", "notion": "svm", "enonce": "Les vecteurs de support sont les points tels que…", "options": ["yᵢ(wᵀxᵢ + θ) < 0", "wᵀxᵢ + θ = 0", "yᵢ(wᵀxᵢ + θ) = 1"], "bonnes": [2], "explication": "Sur les bords de la marge." },
    { "id": "f19", "notion": "noyaux", "enonce": "Noyau RBF, γ = 0,5, ‖xᵢ − xⱼ‖² = 2. K ≈ ?", "options": ["0,5", "0,368", "0,607", "0,135"], "bonnes": [1], "explication": "exp(−1)." },
    { "id": "f20", "notion": "noyaux", "enonce": "Un contre un avec c = 6 classes : nombre de SVM ?", "options": ["15", "30", "6", "5"], "bonnes": [0], "explication": "6·5/2 (article des visages)." }
  ]
});
