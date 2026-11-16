/* Test : Transformers (cours 4, TD Hugging Face, Lab Transformers). Format du quiz : 20 questions. */
Tests.enregistrer({
  matiere: "nlp-deep-learning", id: "test-transformers", titre: "Test Transformers (20 questions)",
  notions: {
    attention: { titre: "Auto-attention", lecon: "auto-attention" },
    tetes: { titre: "Multi-head et position", lecon: "multi-tetes-position" },
    encodeur: { titre: "Bloc encodeur", lecon: "bloc-encodeur" },
    decodeur: { titre: "Décodeur", lecon: "decodeur-transformer" },
    limites: { titre: "Forces et limites", lecon: "transformers-limites" },
    pratique: { titre: "Hugging Face (TD et Lab)", lecon: "code-td-hugging-face" }
  },
  questions: [
    { id: "t1", notion: "attention", enonce: "Dans l'auto-attention, la similarité entre le token i et le token j est…", options: ["qᵢᵀkⱼ", "qᵢᵀvⱼ", "kᵢᵀvⱼ", "xᵢᵀxⱼ sans paramètre"], bonnes: [0], explication: "Requête de i, clé de j." },
    { id: "t2", notion: "attention", enonce: "Scores (0 ; 0 ; 0) pour trois tokens. Poids d'attention ?", options: ["(1/3 ; 1/3 ; 1/3)", "(0 ; 0 ; 0)", "(1 ; 0 ; 0)"], bonnes: [0], explication: "softmax de valeurs égales : distribution uniforme." },
    { id: "t3", notion: "attention", enonce: "Poids (0,5 ; 0,5 ; 0), valeurs v₁ = (2 ; 0), v₂ = (0 ; 2), v₃ = (4 ; 4). Sortie ?", options: ["(1 ; 1)", "(2 ; 2)", "(3 ; 3)", "(0 ; 0)"], bonnes: [0], explication: "0,5·(2 ; 0) + 0,5·(0 ; 2)." },
    { id: "t4", notion: "attention", enonce: "n = 20 tokens, dₖ = 64. Forme de QKᵀ ?", options: ["(20, 20)", "(20, 64)", "(64, 64)"], bonnes: [0], explication: "" },
    { id: "t5", notion: "attention", enonce: "Propriétés des poids αᵢⱼ d'une ligne :", options: ["positifs ou nuls", "somme égale à 1", "toujours égaux", "appris directement comme des paramètres"], bonnes: [0, 1], explication: "Ils sont calculés (softmax des scores), pas appris directement." },
    { id: "t6", notion: "tetes", enonce: "d = 768, h = 12 têtes. dᵥ (en général) ?", options: ["64", "768", "12", "9 216"], bonnes: [0], explication: "768 / 12." },
    { id: "t7", notion: "tetes", enonce: "Sans encodage positionnel, l'auto-attention…", options: ["ne distingue pas « Jean pense que Pierre a tort » de « Pierre pense que Jean a tort »", "ne peut pas calculer de softmax", "devient récurrente"], bonnes: [0], explication: "" },
    { id: "t8", notion: "tetes", enonce: "PE(pos = 0) dans la formule sinusoïdale :", options: ["(0, 1, 0, 1, …)", "(1, 0, 1, 0, …)", "(0, 0, 0, …)"], bonnes: [0], explication: "sin(0) = 0 aux indices pairs, cos(0) = 1 aux impairs." },
    { id: "t9", notion: "tetes", enonce: "Comment l'encodage positionnel est-il combiné à l'embedding ?", options: ["additionné", "concaténé", "multiplié"], bonnes: [0], explication: "" },
    { id: "t10", notion: "encodeur", enonce: "Z = LayerNorm(Y + X) : le « + X » est…", options: ["une connexion résiduelle", "l'encodage positionnel", "un biais appris"], bonnes: [0], explication: "" },
    { id: "t11", notion: "encodeur", enonce: "LayerNorm de x = (1 ; 3) (γ = 1, β = 0, ε ≈ 0) :", options: ["(−1 ; 1)", "(0 ; 1)", "(1 ; 3)", "(−2 ; 2)"], bonnes: [0], explication: "μ = 2, σ = 1." },
    { id: "t12", notion: "encodeur", enonce: "Le feed-forward d'un bloc Transformer…", options: ["est appliqué à chaque vecteur séparément", "apporte des non-linéarités", "mélange l'information entre tokens"], bonnes: [0, 1], explication: "Le mélange entre tokens se fait dans l'attention." },
    { id: "t13", notion: "encodeur", enonce: "Les N couches empilées d'un encodeur…", options: ["n'ont pas de poids partagés", "partagent leurs poids comme un RNN", "changent la forme (n, d) à chaque couche"], bonnes: [0], explication: "" },
    { id: "t14", notion: "decodeur", enonce: "Dans la self-attention masquée, on met −∞…", options: ["sur les scores des tokens futurs, avant la softmax", "sur les poids, après la softmax", "sur les tokens de l'encodeur"], bonnes: [0], explication: "exp(−∞) = 0." },
    { id: "t15", notion: "decodeur", enonce: "Dans la cross-attention :", options: ["requêtes du décodeur, clés et valeurs de l'encodeur", "requêtes de l'encodeur, clés et valeurs du décodeur", "tout vient du décodeur"], bonnes: [0], explication: "" },
    { id: "t16", notion: "decodeur", enonce: "La dernière couche Linear du décodeur produit un vecteur de taille…", options: ["la taille du vocabulaire cible", "d", "n"], bonnes: [0], explication: "Puis softmax et mot le plus probable." },
    { id: "t17", notion: "limites", enonce: "Si la longueur de séquence double, le nombre de scores d'attention est multiplié par…", options: ["4", "2", "8", "1"], bonnes: [0], explication: "Coût en n²." },
    { id: "t18", notion: "limites", enonce: "Placement de la LayerNorm :", options: ["BERT est post-norm", "la plupart des LM modernes sont pre-norm", "pre-norm et post-norm sont identiques"], bonnes: [0, 1], explication: "" },
    { id: "t19", notion: "pratique", enonce: "Dans enc = tok(textes, padding=True), attention_mask vaut 0 sur…", options: ["les tokens de padding", "[CLS] et [SEP]", "les mots inconnus"], bonnes: [0], explication: "" },
    { id: "t20", notion: "pratique", enonce: "LoRA sur une matrice 512 × 512 avec r = 8. Paramètres entraînés pour cette matrice ?", options: ["8 192", "262 144", "4 096", "64"], bonnes: [0], explication: "r(d_in + d_out) = 8 × 1 024." }
  ]
});
