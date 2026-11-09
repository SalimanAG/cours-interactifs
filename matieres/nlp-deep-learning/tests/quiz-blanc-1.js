/* Quiz blanc 1 (format du quiz du 9 novembre : 20 questions, 30 minutes, sans document ni calculatrice).
   Couvre : Introduction (cours 1), Text Encoding (cours 2), RNNs, LSTMs and GRUs (cours 3). */
Tests.enregistrer({
  matiere: "nlp-deep-learning", id: "quiz-blanc-1", titre: "Quiz blanc 1 (20 questions, 30 min)",
  notions: {
    intro: { titre: "Cours 1 — Introduction", lecon: "probleme-apprentissage" },
    encodage: { titre: "Cours 2 — Text Encoding", lecon: "tf-idf-cosinus" },
    rnn: { titre: "Cours 3 — RNN, LSTM, GRU", lecon: "cellule-lstm" }
  },
  questions: [
    { id: "q1", notion: "intro", enonce: "Selon Tom Mitchell, un programme apprend de l'expérience E si…", options: ["sa performance P sur la tâche T s'améliore avec E", "il est explicitement programmé pour T", "sa perte d'entraînement atteint 0"], bonnes: [0], explication: "Définition T / P / E." },
    { id: "q2", notion: "intro", enonce: "Lesquelles sont des tâches non supervisées ?", options: ["clustering", "réduction de dimension", "détection d'anomalies", "classification de sentiment"], bonnes: [0, 1, 2], explication: "La classification demande des étiquettes." },
    { id: "q3", notion: "intro", enonce: "Prédictions (2, 4), cibles (1, 4). MSE = ?", options: ["0,5", "1", "0,25", "2"], bonnes: [0], explication: "(1 + 0) / 2." },
    { id: "q4", notion: "intro", enonce: "θ = 1, gradient = −2, η = 0,5. Après un pas de descente de gradient, θ = ?", options: ["2", "0", "−1", "1,5"], bonnes: [0], explication: "θ − η·∇ = 1 + 1." },
    { id: "q5", notion: "intro", enonce: "Perte d'entraînement très basse, perte de validation haute :", options: ["sur-apprentissage", "sous-apprentissage", "bon ajustement"], bonnes: [0], explication: "" },
    { id: "q6", notion: "intro", enonce: "Lesquelles sont des techniques de régularisation citées par le cours ?", options: ["weight decay (L2)", "dropout", "early stopping", "augmenter le taux d'apprentissage"], bonnes: [0, 1, 2], explication: "+ data augmentation et modèle plus petit." },
    { id: "q7", notion: "intro", enonce: "Classes à 82 % / 11 % / 7 %. Un modèle qui prédit toujours la classe majoritaire a une accuracy de…", options: ["82 %", "33 %", "100 %", "7 %"], bonnes: [0], explication: "Et un macro-F1 très bas : il échoue sur les classes rares." },
    { id: "q8", notion: "intro", enonce: "Pour éviter une fuite de données, le scaler (ou le vocabulaire) doit être ajusté…", options: ["sur l'entraînement seulement", "sur toutes les données", "sur le test"], bonnes: [0], explication: "Fit sur le train, transform ailleurs." },
    { id: "q9", notion: "encodage", enonce: "Dans un vocabulaire, à quoi sert le token &lt;UNK&gt; ?", options: ["représenter un mot absent du vocabulaire", "compléter les séquences courtes", "marquer la fin d'une phrase"], bonnes: [0], explication: "Le remplissage, c'est &lt;PAD&gt;." },
    { id: "q10", notion: "encodage", enonce: "Pourquoi un masque d'attention dans un lot complété par du padding ?", options: ["pour que le modèle ignore les positions de padding", "pour cacher les mots inconnus", "pour mélanger les tokens"], bonnes: [0], explication: "« Padding is not content »." },
    { id: "q11", notion: "encodage", enonce: "« dog bites man » et « man bites dog » ont le même vecteur…", options: ["en sac de mots (unigrammes)", "en bigrammes de mots", "avec un LSTM"], bonnes: [0], explication: "Le sac de mots ignore l'ordre." },
    { id: "q12", notion: "encodage", enonce: "Combien de bigrammes de mots dans « the cat eats food » ?", options: ["3", "4", "2", "6"], bonnes: [0], explication: "the cat, cat eats, eats food." },
    { id: "q13", notion: "encodage", enonce: "L'IDF d'un terme présent dans tous les documents est…", options: ["minimal", "maximal", "indéfini"], bonnes: [0], explication: "Forme lissée du cours : ln(1) + 1 = 1." },
    { id: "q14", notion: "encodage", enonce: "cos((1, 1), (2, 2)) = ?", options: ["1", "0", "2", "0,5"], bonnes: [0], explication: "Même direction : le cosinus ignore la longueur." },
    { id: "q15", notion: "encodage", enonce: "La PPMI d'une paire (w, c) qui co-occurre moins souvent que sous indépendance vaut…", options: ["0", "une valeur négative", "1"], bonnes: [0], explication: "PPMI = max(PMI, 0)." },
    { id: "q16", notion: "encodage", enonce: "Skip-gram…", options: ["prédit les mots du contexte à partir du mot central", "prédit le mot central à partir du contexte", "compte les co-occurrences dans une matrice"], bonnes: [0], explication: "CBOW fait l'inverse." },
    { id: "q17", notion: "rnn", enonce: "Lesquelles sont des limites du RNN simple ?", options: ["gradients qui s'évanouissent ou explosent", "état compressé de taille fixe", "parallélisme limité", "il ne peut pas traiter de séquences"], bonnes: [0, 1, 2], explication: "" },
    { id: "q18", notion: "rnn", enonce: "Le gradient clipping sert à…", options: ["limiter les gradients qui explosent", "empêcher les gradients de s'évanouir", "réduire le vocabulaire"], bonnes: [0], explication: "Si ‖g‖ ≥ seuil : g ← (seuil/‖g‖)·g." },
    { id: "q19", notion: "rnn", enonce: "LSTM : cₜ₋₁ = 2, fₜ = 0,5, iₜ = 1, c̃ₜ = −1. cₜ = ?", options: ["0", "1", "−1", "2"], bonnes: [0], explication: "cₜ = fₜ⊙cₜ₋₁ + iₜ⊙c̃ₜ = 1 − 1." },
    { id: "q20", notion: "rnn", enonce: "Embedding(10000, 64) puis LSTM(32) (return_sequences=False) sur un lot (B, T). Forme de la sortie du LSTM ?", options: ["(B, 32)", "(B, T, 32)", "(B, T, 64)", "(B, 64)"], bonnes: [0], explication: "Un état final par séquence." }
  ]
});
