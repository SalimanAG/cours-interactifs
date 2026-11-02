/* Test noté : réseaux récurrents et attention (cours 3, TP 4). */
Tests.enregistrer({
  matiere: "nlp-deep-learning", id: "test-recurrents", titre: "Test : réseaux récurrents",
  notions: {
    rnn: { titre: "Neurone et couche récurrents", lecon: "neurone-recurrent" },
    gradient: { titre: "Évanouissement, explosion, clipping", lecon: "neurone-recurrent" },
    lstm: { titre: "LSTM", lecon: "cellule-lstm" },
    gru: { titre: "GRU", lecon: "gru" },
    keras: { titre: "Formes Keras", lecon: "neurone-recurrent" },
    donnees: { titre: "Préparer les séquences", lecon: "neurone-recurrent" },
    attention: { titre: "Encodeur-décodeur et attention", lecon: "encodeur-attention" },
    tp4: { titre: "Démarche du TP 4", lecon: "cellule-lstm" }
  },
  questions: [
    { id: "q1", notion: "rnn", enonce: "Neurone récurrent scalaire, activation identité : wₓ = 1, w_y = 0,5, b = 0, y₍₀₎ = 0, x = (2, 0). y₍₂₎ = ?", options: ["1", "2", "0", "0,5"], bonnes: [0], explication: "y₁ = 2 ; y₂ = 0 + 0,5 × 2 = 1." },
    { id: "q2", notion: "rnn", enonce: "SimpleRNN(32) sur des entrées de dimension 10 : nombre de paramètres ?", options: ["1 376", "352", "1 344", "42"], bonnes: [0], explication: "32·10 + 32·32 + 32." },
    { id: "q3", notion: "rnn", enonce: "Classer des critiques en positif / négatif est une architecture…", options: ["série → vecteur", "vecteur → série", "série → série", "encodeur → décodeur"], bonnes: [0], explication: "" },
    { id: "q4", notion: "gradient", enonce: "ĝ = (3 ; 4), seuil = 2,5. Après clipping par la norme :", options: ["(1,5 ; 2)", "(2,5 ; 2,5)", "(3 ; 4)", "(0,6 ; 0,8)"], bonnes: [0], explication: "‖ĝ‖ = 5 ; facteur 0,5." },
    { id: "q5", notion: "gradient", enonce: "Lesquelles traitent le gradient qui s'évanouit ?", options: ["LSTM", "attention / connexions résiduelles", "gradient clipping", "augmenter η"], bonnes: [0, 1], explication: "Le clipping traite l'explosion." },
    { id: "q6", notion: "lstm", enonce: "cₜ₋₁ = 0,5, fₜ = 0,4, iₜ = 1, c̃ₜ = −0,3. cₜ = ?", options: ["−0,1", "0,2", "−0,3", "0,5"], bonnes: [0], explication: "0,2 − 0,3." },
    { id: "q7", notion: "lstm", enonce: "Quelle fonction pour le candidat c̃ₜ ?", options: ["tanh", "σ", "softmax"], bonnes: [0], explication: "Valeurs entre −1 et 1." },
    { id: "q8", notion: "lstm", enonce: "fₜ = 1 et iₜ = 0 sur toutes les dimensions :", options: ["la mémoire est recopiée telle quelle", "la mémoire est effacée", "seul le candidat est gardé"], bonnes: [0], explication: "" },
    { id: "q9", notion: "lstm", enonce: "LSTM(16) sur des entrées de dimension 8 : paramètres ?", options: ["1 600", "400", "1 536", "64"], bonnes: [0], explication: "4 × (16·8 + 16·16 + 16) = 4 × 400." },
    { id: "q10", notion: "gru", enonce: "Convention du cours : hₜ₋₁ = 1, h̃ₜ = 0, zₜ = 0,3. hₜ = ?", options: ["0,3", "0,7", "1", "0"], bonnes: [0], explication: "0,3 × 1 + 0,7 × 0." },
    { id: "q11", notion: "gru", enonce: "La porte reset du GRU…", options: ["dose le passé utilisé pour construire le candidat", "efface directement l'état stocké", "choisit la classe de sortie"], bonnes: [0], explication: "" },
    { id: "q12", notion: "keras", enonce: "Embedding(5000, 32, mask_zero=True) puis LSTM(16, return_sequences=True) sur un lot (B, T). Forme de sortie ?", options: ["(B, T, 16)", "(B, 16)", "(B, T, 32)"], bonnes: [0], explication: "" },
    { id: "q13", notion: "keras", enonce: "Bidirectional(GRU(50)) : dimension de sortie ?", options: ["100", "50", "25"], bonnes: [0], explication: "Concaténation 2H." },
    { id: "q14", notion: "keras", enonce: "Dense(4, softmax) avec étiquettes entières 0 à 3 : perte ?", options: ["sparse_categorical_crossentropy", "binary_crossentropy", "mse"], bonnes: [0], explication: "" },
    { id: "q15", notion: "donnees", enonce: "Série 2, 4, 6, 8, 10 ; fenêtres de 2 pour prédire la valeur suivante : nombre d'exemples ?", options: ["3", "4", "5", "2"], bonnes: [0], explication: "[2,4]→6, [4,6]→8, [6,8]→10." },
    { id: "q16", notion: "donnees", enonce: "Données de capteurs horodatées :", options: ["entraîner sur le passé, tester sur le futur", "mélanger puis découper au hasard", "tester sur le passé"], bonnes: [0], explication: "" },
    { id: "q17", notion: "attention", enonce: "Scores (0 ; 0) pour deux états d'encodeur h₁ = 2, h₂ = 4. Contexte cₜ ?", options: ["3", "6", "0", "2"], bonnes: [0], explication: "Softmax → (0,5 ; 0,5) ; 0,5·2 + 0,5·4." },
    { id: "q18", notion: "attention", enonce: "Lesquelles sont vraies ?", options: ["les poids d'attention somment à 1", "ils sont recalculés à chaque pas de sortie", "ils prouvent un alignement mot à mot", "la self-attention permet plus de parallélisme que la récurrence"], bonnes: [0, 1, 3], explication: "" },
    { id: "q19", notion: "attention", enonce: "Problème principal d'un encodeur-décodeur sans attention ?", options: ["tout passe par un seul vecteur de contexte de taille fixe", "la sortie doit avoir la longueur de l'entrée", "il ne peut pas utiliser de LSTM"], bonnes: [0], explication: "" },
    { id: "q20", notion: "tp4", enonce: "Avec quel ensemble choisit-on entre SimpleRNN, LSTM et GRU dans le TP 4 ?", options: ["validation (macro-F1)", "test", "entraînement (perte)"], bonnes: [0], explication: "" },
    { id: "q21", notion: "tp4", enonce: "Dans TextVectorization, l'ID 1 désigne…", options: ["un token inconnu (non masqué)", "le padding (masqué)", "le début de séquence"], bonnes: [0], explication: "" },
    { id: "q22", notion: "tp4", enonce: "EarlyStopping(monitor=\"val_loss\", patience=2, restore_best_weights=True), val_loss = 0,9 ; 0,7 ; 0,72 ; 0,75. Époques exécutées et poids gardés ?", options: ["4 époques, poids de l'époque 2", "4 époques, poids de l'époque 4", "2 époques, poids de l'époque 2"], bonnes: [0], explication: "Deux époques sans amélioration après la 2e." }
  ]
});
