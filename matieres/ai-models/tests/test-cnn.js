/* Test : réseaux convolutifs. Tailles et architectures inventées pour le test. */
Tests.enregistrer({
  matiere: "ai-models", id: "test-cnn", titre: "Test : CNN",
  notions: {
    convolution: { titre: "Opération de convolution", lecon: "convolution-pas-a-pas" },
    formes: { titre: "Tailles de sortie, padding, stride", lecon: "convolution-pas-a-pas" },
    parametres: { titre: "Paramètres, FLOPs, GAP", lecon: "formes-parametres" },
    champ: { titre: "Champ récepteur", lecon: "formes-parametres" },
    architecture: { titre: "Architectures et pratique", lecon: "formes-parametres" }
  },
  questions: [
    { id: "q1", notion: "convolution", enonce: "X = (1 2 ; 3 4), K = (1 0 ; 0 −1), b = 0. La sortie (une seule position) vaut :", options: ["5", "3", "−3", "−5"], bonnes: [2], explication: "1·1 + 0·2 + 0·3 + (−1)·4 = −3." },
    { id: "q2", notion: "convolution", enonce: "Ce que les frameworks appellent « convolution » est en fait…", options: ["un produit matriciel avec W", "un max pooling", "une corrélation croisée (sans retourner le noyau)"], bonnes: [2], explication: "Le retournement est absorbé par l'apprentissage." },
    { id: "q3", notion: "formes", enonce: "n = 32, k = 5, s = 1, p = 0. n_out = ?", options: ["27", "28", "30", "32"], bonnes: [1], explication: "32 − 5 + 1." },
    { id: "q4", notion: "formes", enonce: "n = 64, k = 3, s = 2, p = 1. n_out = ?", options: ["64", "33", "32", "31"], bonnes: [2], explication: "⌊(64 + 2 − 2 − 1)/2⌋ + 1 = ⌊31,5⌋ + 1 = 32." },
    { id: "q5", notion: "formes", enonce: "Taille effective d'un noyau 3×3 avec dilatation d = 3 :", options: ["5", "6", "9", "7"], bonnes: [3], explication: "d(k − 1) + 1 = 7." },
    { id: "q6", notion: "parametres", enonce: "Conv 3×3, 32 filtres, sur une entrée à 8 canaux. Paramètres ?", options: ["2 304", "296", "2 336", "320"], bonnes: [2], explication: "32 · (8·9 + 1) = 32 · 73." },
    { id: "q7", notion: "parametres", enonce: "Le nombre de paramètres d'une couche de convolution dépend de… (plusieurs réponses)", options: ["la taille du noyau", "C_out", "C_in", "la taille H × W de l'image"], bonnes: [0, 1, 2], explication: "Pas de H × W : les poids sont partagés." },
    { id: "q8", notion: "parametres", enonce: "Carte 7×7×128 vers 10 classes. Paramètres de la tête GAP + Dense(10) ?", options: ["62 730", "1 290", "1 280", "6 280"], bonnes: [1], explication: "GAP → 128 ; 128·10 + 10." },
    { id: "q9", notion: "parametres", enonce: "Combien de paramètres appris a un max pooling 2×2 ?", options: ["1", "4", "2·C", "0"], bonnes: [3], explication: "Opérateur sans paramètre." },
    { id: "q10", notion: "champ", enonce: "Trois convolutions 3×3, strides 1, 1, 1. Champ récepteur de la 3ᵉ couche ?", options: ["9", "7", "5", "27"], bonnes: [1], explication: "3, 5, 7." },
    { id: "q11", notion: "champ", enonce: "Conv 3×3 (s = 2) puis conv 3×3 (s = 1). Champ récepteur de la 2ᵉ couche ?", options: ["7", "5", "9", "6"], bonnes: [0], explication: "r₁ = 3, j₁ = 2 ; r₂ = 3 + 2·2 = 7." },
    { id: "q12", notion: "architecture", enonce: "Pourquoi deux 3×3 plutôt qu'un 5×5 ?", options: ["moins de couches", "champ récepteur plus grand", "même champ récepteur, plus de non-linéarité, moins de paramètres"], bonnes: [2], explication: "18 poids contre 25 par canal." },
    { id: "q13", notion: "architecture", enonce: "Un bloc résiduel calcule :", options: ["y = F(F(x))", "y = F(x, θ) + x", "y = max(0, x)", "y = F(x) · x"], bonnes: [1], explication: "Le chemin identité aide le signal et le gradient (ResNet)." },
    { id: "q14", notion: "architecture", enonce: "Dans le CNN CIFAR-10 du cours, que fait from_logits=True ?", options: ["convertit les étiquettes en one-hot", "normalise les pixels", "indique que la dernière couche renvoie des scores bruts ; la perte applique le softmax"], bonnes: [2], explication: "Dense(10) sans activation." },
    { id: "q15", notion: "architecture", enonce: "Accuracy d'entraînement qui monte, accuracy de test qui stagne : c'est cohérent avec…", options: ["un modèle parfaitement calibré", "du sur-apprentissage", "du sous-apprentissage"], bonnes: [1], explication: "L'écart grandit : généralisation limitée." }
  ]
});
