/* Test : chapitres 1 à 4 (neurone à seuil, théorèmes de structure, XOR, rétropropagation). Exemples inventés. */
Tests.enregistrer({
  matiere: "ai-models", id: "test-retropropagation", titre: "Test : neurones, structure, XOR, rétropropagation",
  notions: {
    neurone: { titre: "Neurone et réseaux à seuil", lecon: "neurone-a-seuil" },
    renorm: { titre: "Renormalisation", lecon: "reseau-renormalisation" },
    structure: { titre: "Théorèmes de structure", lecon: "booleen-bipolaire" },
    xor: { titre: "Fonctions booléennes et XOR", lecon: "probleme-xor" },
    retro: { titre: "Rétropropagation", lecon: "retropropagation-main" }
  },
  questions: [
    { id: "q1", notion: "neurone", enonce: "Neurone à poids (1, −2, 3), seuil θ = 2, entrées (1, 0, 1). Sortie y ?", options: ["0", "1"], bonnes: [1], explication: "Σ = 1 + 3 = 4 ≥ 2." },
    { id: "q2", notion: "neurone", enonce: "Dans le modèle de McCulloch-Pitts, l'unité de temps est…", options: ["la période de sommation latente", "la période réfractaire", "le retard de l'axone"], bonnes: [1], explication: "Notes, « l'unité de temps »." },
    { id: "q3", notion: "renorm", enonce: "Quelle fonction de renormalisation pour l'ensemble d'états [−1, +1] ?", options: ["S", "SG", "H", "S̲"], bonnes: [3], explication: "S̲(x) = (1 − e⁻ˣ)/(1 + e⁻ˣ) = 2S(x) − 1." },
    { id: "q4", notion: "renorm", enonce: "Laquelle de ces relations est juste ?", options: ["H = 2SG − 1", "SG = H − 1", "S = 2S̲ − 1", "SG = 2H − 1"], bonnes: [3], explication: "2·1 − 1 = 1 et 2·0 − 1 = −1." },
    { id: "q5", notion: "structure", enonce: "Réseau booléen W = (4 −2), θ = 3. Le réseau bipolaire conjugué a pour seuil θ̃ = θ − ½ W·(1, 1) :", options: ["4", "3", "2", "1"], bonnes: [2], explication: "3 − ½ (4 − 2) = 2 ; et W̃ = (2 −1)." },
    { id: "q6", notion: "structure", enonce: "Poids rationnels (1/4, −5/6), seuil 1/3. Le plus petit d du théorème ℚ → ℤ :", options: ["6", "72", "12", "24"], bonnes: [2], explication: "ppcm(4, 6, 3) = 12 → poids (3, −10), seuil 4." },
    { id: "q7", notion: "structure", enonce: "Le théorème ℝ → ℚ suppose que le réseau est…", options: ["à poids positifs", "strictement séparateur", "à un seul processeur", "booléen"], bonnes: [1], explication: "Pour que δ > 0." },
    { id: "q8", notion: "structure", enonce: "Dans ℝ → ℚ, chaque poids et chaque seuil est approché à moins de…", options: ["δ/2", "1/n", "δ", "δ/(n + 1)"], bonnes: [3], explication: "n poids + 1 seuil : l'écart total reste < δ." },
    { id: "q9", notion: "xor", enonce: "Quelles fonctions un seul neurone à 2 entrées ne peut-il pas calculer ? (plusieurs réponses)", options: ["NAND", "XNOR", "x₁ AND NOT x₂", "XOR"], bonnes: [1, 3], explication: "Leurs 1 et 0 sont sur les diagonales du carré." },
    { id: "q10", notion: "xor", enonce: "Poids [1 1], quel seuil donne OR (règle y = 1 si Σ ≥ θ) ?", options: ["0", "2", "−1", "1"], bonnes: [3], explication: "Une entrée à 1 suffit ; (0, 0) donne 0 < 1." },
    { id: "q11", notion: "retro", enonce: "Lequel de ces réseaux n'est PAS feed-forward ?", options: ["une seule couche de sortie reliée aux entrées", "trois couches complètement connectées d'une couche à la suivante", "une connexion entre deux neurones de la même couche"], bonnes: [2], explication: "Règle 2." },
    { id: "q12", notion: "retro", enonce: "Sortie S = 0,8, cible O = 1. δ de sortie = (S − O) S (1 − S) =", options: ["−0,16", "0,032", "−0,032", "−0,2"], bonnes: [2], explication: "(−0,2) × 0,8 × 0,2." },
    { id: "q13", notion: "retro", enonce: "δ_s = −0,1, ε = 0,5, sortie du neurone caché c : 0,6. ΔW_c^s =", options: ["−0,03", "+0,05", "+0,03", "−0,06"], bonnes: [2], explication: "−ε δ_s S_c = −0,5 × (−0,1) × 0,6." },
    { id: "q14", notion: "retro", enonce: "Le δ d'un neurone caché c est…", options: ["S_c − O_c", "Σ_k δ_k", "(S_c − O_c) S_c(1 − S_c)", "S_c(1 − S_c) Σ_k δ_k W_c^k"], bonnes: [3], explication: "Les neurones cachés n'ont pas de cible : on rétropropage les δ des successeurs." },
    { id: "q15", notion: "retro", enonce: "Avec δ = 10⁻³, l'apprentissage s'arrête dès les premières époques alors que l'EQM vaut encore 0,5. Pourquoi ?", options: ["le taux d'apprentissage est négatif", "l'EQM stagne sur un plateau : |EQM(t + 1) − EQM(t)| < δ trop tôt", "C est trop grand"], bonnes: [1], explication: "Le critère mesure une variation, pas une valeur." }
  ]
});
