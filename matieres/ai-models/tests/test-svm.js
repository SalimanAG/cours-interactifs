/* Test : SVM. Nombres inventés pour le test. */
Tests.enregistrer({
  matiere: "ai-models", id: "test-svm", titre: "Test : SVM",
  notions: {
    "marge": {"titre": "Hyperplan, marge, vecteurs de support", "lecon": "marge-maximale"},
    "noyaux": {"titre": "Noyaux", "lecon": "noyaux"},
    "pratique": {"titre": "scikit-learn et choix du modèle", "lecon": "noyaux"},
    "visages": {"titre": "L'article des visages", "lecon": "tournoi-visages"}
  },
  questions: [
    { "id": "q1", "notion": "marge", "enonce": "w = (1, −1), θ = 1. Valeur de wᵀx + θ en x = (2, 4) ?", "options": ["5", "−1", "3", "−3"], "bonnes": [1], "explication": "2 − 4 + 1 = −1 : côté négatif." },
    { "id": "q2", "notion": "marge", "enonce": "Marge d'un SVM canonique avec w = (3, 4) ?", "options": ["0,2", "0,4", "2/7", "5"], "bonnes": [1], "explication": "2/‖w‖ = 2/5." },
    { "id": "q3", "notion": "marge", "enonce": "Le point (x, y = −1) vérifie wᵀx + θ = −1. C'est…", "options": ["un point à l'intérieur de la marge", "un point mal classé", "un vecteur de support"], "bonnes": [2], "explication": "y(wᵀx + θ) = 1 : sur le bord de la marge." },
    { "id": "q4", "notion": "marge", "enonce": "Pour des données séparables, le SVM résout…", "options": ["max ‖w‖ sous yᵢ(wᵀxᵢ + θ) ≥ 1", "min ½‖w‖² sous yᵢ(wᵀxᵢ + θ) ≥ 1", "min θ² sous ‖w‖ = 1", "min Σ (yᵢ − wᵀxᵢ)²"], "bonnes": [1], "explication": "Maximiser 2/‖w‖." },
    { "id": "q5", "notion": "marge", "enonce": "Supprimer un point d'apprentissage qui n'est pas vecteur de support…", "options": ["élargit toujours la marge", "rétrécit toujours la marge", "ne change pas l'hyperplan optimal"], "bonnes": [2], "explication": "Seuls les vecteurs de support le déterminent." },
    { "id": "q6", "notion": "noyaux", "enonce": "Noyau linéaire : K((2, 1), (1, −3)) = ?", "options": ["−6", "−1", "1", "5"], "bonnes": [1], "explication": "2 − 3." },
    { "id": "q7", "notion": "noyaux", "enonce": "Noyau polynomial, c = 1, d = 3 : K((1, 1), (1, 0)) = ?", "options": ["1", "2", "4", "8"], "bonnes": [3], "explication": "(1 + 1)³." },
    { "id": "q8", "notion": "noyaux", "enonce": "Noyau RBF, γ = 1 : K((0, 0), (1, 1)) ≈ ?", "options": ["0,368", "0,135", "0,5", "0,018"], "bonnes": [1], "explication": "exp(−2)." },
    { "id": "q9", "notion": "noyaux", "enonce": "Avec un noyau RBF, γ très grand conduit plutôt à…", "options": ["une frontière presque linéaire", "une frontière très complexe, risque de sur-apprentissage", "une marge infinie"], "bonnes": [1], "explication": "Influence très locale." },
    { "id": "q10", "notion": "noyaux", "enonce": "Pourquoi le motif XOR pose-t-il problème à un SVM linéaire ?", "options": ["il a trop de points", "les étiquettes ne sont pas ±1", "aucune droite ne sépare les deux classes"], "bonnes": [2], "explication": "D'où l'astuce du noyau." },
    { "id": "q11", "notion": "pratique", "enonce": "Dans le pipeline, StandardScaler estime moyennes et écarts-types…", "options": ["sur tout le jeu de données", "sur les données de test", "sur les données d'entraînement"], "bonnes": [2], "explication": "Sinon fuite du test." },
    { "id": "q12", "notion": "pratique", "enonce": "Comment choisir le noyau, C et γ ?", "options": ["par validation ou validation croisée", "sur l'accuracy de test", "en prenant les plus grandes valeurs"], "bonnes": [0], "explication": "Note pratique du cours." },
    { "id": "q13", "notion": "pratique", "enonce": "Situations où le cours suggère un SVM comme point de départ (plusieurs réponses) :", "options": ["détection d'anomalies avec surtout des données normales", "petit jeu, motifs non linéaires", "texte creux en grande dimension", "très grand jeu d'images brutes"], "bonnes": [0, 1, 2], "explication": "Images brutes : deep learning." },
    { "id": "q14", "notion": "visages", "enonce": "Un contre un avec c = 10 classes : nombre de SVM ?", "options": ["90", "9", "45", "10"], "bonnes": [2], "explication": "10 × 9 / 2." },
    { "id": "q15", "notion": "visages", "enonce": "Tournoi en arbre binaire avec c = 10 : comparaisons pour une requête ?", "options": ["45", "10", "9", "5"], "bonnes": [2], "explication": "c − 1, par exemple 10 = 8 + 2." },
    { "id": "q16", "notion": "visages", "enonce": "Pourquoi l'article écarte-t-il un contre tous ?", "options": ["il demande plus de SVM", "il mène souvent à une classification ambiguë", "il exige un noyau RBF"], "bonnes": [1], "explication": "Argument de l'article." }
  ]
});
