/* Examen blanc 1 : chapitres 1 à 5. Format de l'examen inconnu : questions inventées sur le contenu du cours. */
Tests.enregistrer({
  matiere: "ai-models", id: "examen-blanc-1", titre: "Examen blanc 1 : chapitres 1 à 5",
  notions: {
    "neurone": {"titre": "Neurone et réseau à seuil", "lecon": "neurone-a-seuil"},
    "renorm": {"titre": "Renormalisation", "lecon": "reseau-renormalisation"},
    "structure": {"titre": "Théorèmes de structure", "lecon": "booleen-bipolaire"},
    "xor": {"titre": "Fonctions booléennes et XOR", "lecon": "probleme-xor"},
    "retro": {"titre": "Rétropropagation", "lecon": "retropropagation-main"},
    "eval": {"titre": "Matrice de confusion et métriques", "lecon": "matrice-confusion"},
    "seuil": {"titre": "Seuil, ROC, PR", "lecon": "seuil-roc-pr"}
  },
  questions: [
    { "id": "e1", "notion": "neurone", "enonce": "Poids (2, −1, 1), seuil θ = 1, entrées (1, 1, 0). Sortie y (y = 1 si Σ wᵢxᵢ ≥ θ) ?", "options": ["0", "1"], "bonnes": [1], "explication": "Σ = 1 ≥ 1." },
    { "id": "e2", "notion": "neurone", "enonce": "Fonction de mise à jour d'un réseau à seuil ?", "options": ["f(x) = W(x − θ)", "f(x) = Wx − θ", "f(x) = Wx + θ", "f(x) = θx − W"], "bonnes": [1], "explication": "f_J(x) = ⟨W^J|x⟩ − θ_J." },
    { "id": "e3", "notion": "renorm", "enonce": "Fonction de renormalisation pour l'ensemble d'états {0, 1} ?", "options": ["SG", "H", "S̲", "S"], "bonnes": [1], "explication": "H(x) = 1 si x ≥ 0, 0 sinon." },
    { "id": "e4", "notion": "renorm", "enonce": "S̲(0) = ?", "options": ["1", "0", "1/2", "−1"], "bonnes": [1], "explication": "(1 − 1)/(1 + 1)." },
    { "id": "e5", "notion": "structure", "enonce": "Booléen W = (6, −2), θ = 1. Seuil du réseau bipolaire conjugué θ̃ = θ − ½ W·(1, 1) ?", "options": ["3", "−3", "1", "−1"], "bonnes": [3], "explication": "1 − ½·4 ; W̃ = (3, −1)." },
    { "id": "e6", "notion": "structure", "enonce": "Booléen → bipolaire : l'homéomorphisme φ est…", "options": ["φ(x) = 2x − (1, …, 1)", "φ(x) = ½(x + (1, …, 1))", "φ(x) = −x", "φ(x) = x²"], "bonnes": [0], "explication": "0 ↦ −1, 1 ↦ 1." },
    { "id": "e7", "notion": "structure", "enonce": "Poids (2/3, −1/2), seuil 5/6. Le plus petit d du théorème ℚ → ℤ ?", "options": ["6", "12", "3", "36"], "bonnes": [0], "explication": "ppcm(3, 2, 6) = 6 → poids (4, −3), seuil 5." },
    { "id": "e8", "notion": "xor", "enonce": "Combien de fonctions booléennes à 2 entrées, et combien un seul neurone en calcule-t-il ?", "options": ["4 et 2", "16 et 16", "8 et 6", "16 et 14"], "bonnes": [3], "explication": "XOR et XNOR manquent." },
    { "id": "e9", "notion": "xor", "enonce": "Poids [1 1] : quel seuil donne AND ?", "options": ["2", "0", "1", "3"], "bonnes": [0], "explication": "Il faut les deux entrées à 1." },
    { "id": "e10", "notion": "xor", "enonce": "Pourquoi un seul neurone ne peut-il pas calculer XOR ?", "options": ["aucune droite ne sépare les entrées de sortie 1 de celles de sortie 0", "il faudrait des poids non entiers", "le seuil devrait être négatif"], "bonnes": [0], "explication": "Les 1 sont sur une diagonale du carré, les 0 sur l'autre." },
    { "id": "e11", "notion": "xor", "enonce": "Comment réaliser XOR avec des neurones à seuil ?", "options": ["avec un seul neurone à seuil négatif", "avec une couche cachée (réseau à plusieurs couches)", "c'est impossible avec des neurones à seuil"], "bonnes": [1], "explication": "Par exemple OR et NAND, puis AND." },
    { "id": "e12", "notion": "retro", "enonce": "Sortie S = 0,6, cible O = 0. δ = (S − O) S (1 − S) = ?", "options": ["−0,144", "0,144", "0,096", "0,24"], "bonnes": [1], "explication": "0,6 · 0,6 · 0,4." },
    { "id": "e13", "notion": "retro", "enonce": "ε = 0,5, δ_s = 0,2, sortie du neurone caché c : 0,5. ΔW_c^s = −ε δ_s x_c = ?", "options": ["−0,2", "0,05", "−0,1", "−0,05"], "bonnes": [3], "explication": "−0,5 · 0,2 · 0,5." },
    { "id": "e14", "notion": "retro", "enonce": "Valeur maximale de S′ = S(1 − S) ?", "options": ["1/2", "2", "1", "1/4"], "bonnes": [3], "explication": "Atteinte en S = 1/2." },
    { "id": "e15", "notion": "retro", "enonce": "Laquelle de ces connexions viole les règles d'un réseau feed-forward ? (plusieurs réponses)", "options": ["de la couche 1 vers la couche 2", "de la couche 3 vers la couche 1", "une boucle d'un neurone sur lui-même", "entre deux neurones de la couche 2"], "bonnes": [1, 2, 3], "explication": "Pas de boucle, pas de connexion dans une couche, couche i → i + 1 seulement." },
    { "id": "e16", "notion": "eval", "enonce": "Matrice (lignes = vraies classes A, B) : [[40, 10], [20, 30]]. Precision(A) = ?", "options": ["4/7", "0,7", "4/5", "2/3"], "bonnes": [3], "explication": "TP = 40, FP = 20." },
    { "id": "e17", "notion": "eval", "enonce": "Même matrice. Recall(A) = ?", "options": ["2/3", "0,6", "0,8", "0,7"], "bonnes": [2], "explication": "TP = 40, FN = 10." },
    { "id": "e18", "notion": "eval", "enonce": "TP = 30, FP = 10, FN = 30. F1 = ?", "options": ["0,75", "0,5", "0,625", "0,6"], "bonnes": [3], "explication": "P = 0,75, R = 0,5 ; 2PR/(P + R)." },
    { "id": "e19", "notion": "seuil", "enonce": "98 % de négatifs ; un modèle prédit toujours « négatif ». Accuracy et recall (classe positive) ?", "options": ["0,98 et 0,98", "0,98 et 0", "0,5 et 0", "0,02 et 1"], "bonnes": [1], "explication": "L'accuracy est trompeuse sur données déséquilibrées." },
    { "id": "e20", "notion": "seuil", "enonce": "La courbe ROC trace…", "options": ["l'accuracy en fonction du seuil", "le TPR en fonction du FPR quand le seuil varie", "la precision en fonction du recall", "la perte en fonction des époques"], "bonnes": [1], "explication": "La courbe PR trace precision contre recall." }
  ]
});
