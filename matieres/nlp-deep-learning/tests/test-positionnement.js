/* Test de positionnement : prérequis (chapitre 0). */
Tests.enregistrer({
  matiere: "nlp-deep-learning", id: "test-positionnement", titre: "Test de positionnement",
  notions: {
    vecteurs: { titre: "Vecteurs et produit scalaire", lecon: "vecteurs-produit-scalaire" },
    matrices: { titre: "Matrices et formes", lecon: "matrices" },
    derivees: { titre: "Dérivée et gradient", lecon: "derivee-gradient" },
    fonctions: { titre: "ln, σ, tanh, softmax", lecon: "fonctions-utiles" },
    probas: { titre: "Probabilités", lecon: "probabilites" }
  },
  questions: [
    { id: "q1", notion: "vecteurs", enonce: "x = (1 ; 2 ; 0), w = (3 ; −1 ; 5). x · w = ?", options: ["1", "−2", "(3 ; −2 ; 0)", "6"], bonnes: [0], explication: "1·3 + 2·(−1) + 0·5 = 1. Le produit scalaire est un nombre." },
    { id: "q2", notion: "vecteurs", enonce: "‖(3 ; 4)‖ = ?", options: ["5", "7", "25", "12"], bonnes: [0], explication: "√(9 + 16) = 5." },
    { id: "q3", notion: "vecteurs", enonce: "cos(A, B) avec A = (1 ; 0) et B = (0 ; 3) ?", options: ["0", "1", "3", "−1"], bonnes: [0], explication: "A · B = 0 : vecteurs perpendiculaires." },
    { id: "q4", notion: "vecteurs", enonce: "Lesquelles sont vraies ? (plusieurs réponses)", options: ["cos(x, 2x) = 1", "x · w = 0 si x et w sont perpendiculaires", "Le cosinus dépend de la longueur des vecteurs", "‖2x‖ = 2‖x‖"], bonnes: [0, 1, 3], explication: "Le cosinus ne dépend que de la direction." },
    { id: "q5", notion: "matrices", enonce: "A de forme (32, 300), B de forme (300, 64). Forme de A · B ?", options: ["(32, 64)", "(300, 300)", "(64, 32)", "impossible"], bonnes: [0], explication: "(m, n)·(n, p) → (m, p)." },
    { id: "q6", notion: "matrices", enonce: "X a la forme (5, 3). Lesquels de ces produits existent ?", options: ["Xᵀ · X", "X · Xᵀ", "X · X", "X · w avec w de dimension 3"], bonnes: [0, 1, 3], explication: "Xᵀ·X : (3,5)(5,3) ; X·Xᵀ : (5,3)(3,5) ; X·X : 3 ≠ 5." },
    { id: "q7", notion: "matrices", enonce: "e₂ = (0, 0, 1, 0) (one-hot, indices à partir de 0) et E de forme (4, d). e₂ᵀ · E = ?", options: ["la ligne 2 de E", "la colonne 2 de E", "la somme des lignes de E", "un nombre"], bonnes: [0], explication: "Le one-hot sélectionne une ligne : c'est le lookup d'embedding." },
    { id: "q8", notion: "derivees", enonce: "L(θ) = (θ − 5)². L′(2) = ?", options: ["−6", "6", "9", "−3"], bonnes: [0], explication: "2(2 − 5) = −6." },
    { id: "q9", notion: "derivees", enonce: "En θ = 2, L′(2) = −6. Avec η = 0,1, un pas de descente de gradient donne θ = ?", options: ["2,6", "1,4", "8", "−4"], bonnes: [0], explication: "θ ← θ − η L′ = 2 − 0,1·(−6) = 2,6." },
    { id: "q10", notion: "derivees", enonce: "Le gradient ∇L pointe vers…", options: ["la plus forte hausse de L", "la plus forte baisse de L", "le minimum de L", "l'origine"], bonnes: [0], explication: "D'où le signe « − » dans Θ ← Θ − η∇L." },
    { id: "q11", notion: "fonctions", enonce: "Lesquelles sont vraies ?", options: ["σ(0) = 0,5", "tanh(0) = 0", "σ(t) peut être négatif", "softmax renvoie des valeurs de somme 1"], bonnes: [0, 1, 3], explication: "σ ∈ (0, 1), tanh ∈ (−1, 1)." },
    { id: "q12", notion: "fonctions", enonce: "softmax(0 ; 0 ; 0 ; 0) = ?", options: ["(0,25 ; 0,25 ; 0,25 ; 0,25)", "(0 ; 0 ; 0 ; 0)", "(1 ; 1 ; 1 ; 1)", "indéfini"], bonnes: [0], explication: "e⁰ = 1 pour chacun, divisé par 4." },
    { id: "q13", notion: "fonctions", enonce: "La vraie classe reçoit la probabilité 1. Entropie croisée ?", options: ["0", "1", "−1", "+∞"], bonnes: [0], explication: "−ln(1) = 0." },
    { id: "q14", notion: "probas", enonce: "count(w, c) = 6, N = 60, P(w) = 0,2, P(c) = 0,25. Que conclure ?", options: ["w et c apparaissent ensemble plus souvent que par hasard", "moins souvent", "ils sont indépendants"], bonnes: [2], explication: "P(w, c) = 0,1 = 0,2 × 0,25 : indépendance, PMI = 0." },
    { id: "q15", notion: "probas", enonce: "Classes à 70 %, 20 %, 10 %. Ratio de déséquilibre ?", options: ["7", "3,5", "2", "0,7"], bonnes: [0], explication: "70 / 10." }
  ]
});
