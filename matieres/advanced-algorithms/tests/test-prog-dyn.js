/* Test du chapitre Programmation dynamique (TD1). */
Tests.enregistrer({
  matiere: "advanced-algorithms",
  id: "test-prog-dyn",
  titre: "Test — Programmation dynamique",
  notions: {
    restau: { titre: "Restaurants sur l'autoroute", lecon: "restaurants" },
    sad: { titre: "Sac à dos à valeurs entières", lecon: "table-sac-a-dos" }
  },
  questions: [
    { id: "q1", notion: "restau",
      enonce: "Récurrence de OPT(j) pour les restaurants ?",
      options: ["OPT(j − 1) + rⱼ", "min{OPT(j − 1), rⱼ + OPT(p(j))}", "max{OPT(j − 1), OPT(j − 2) + rⱼ}", "max{OPT(j − 1), rⱼ + OPT(p(j))}"],
      bonnes: [3],
      explication: "Soit j n'est pas utilisé (OPT(j − 1)), soit il l'est et les autres aires sont ≤ p(j)." },
    { id: "q2", notion: "restau",
      enonce: "p(i) est :",
      options: ["le profit de l'aire i", "la plus proche aire avant i et à au moins 50 km de i (0 sinon)", "l'aire suivant i", "le nombre d'aires à moins de 50 km"],
      bonnes: [1],
      explication: "Tous les p(i) se calculent en O(n) avec un indice qui ne fait qu'avancer." },
    { id: "q3", notion: "sad",
      enonce: "OPT(i, V) désigne :",
      options: ["la valeur maximum d'un sac de poids ≤ V", "la valeur maximum avec i objets", "le nombre de sacs de valeur V", "le poids minimum d'un sac de valeur ≥ V avec les objets 1…i"],
      bonnes: [3],
      explication: "La valeur optimale est le plus grand V tel que OPT(n, V) ≤ W." },
    { id: "q4", notion: "sad",
      enonce: "Complexité de l'algorithme exact pour des valeurs entières ?",
      options: ["O(n log v*)", "O(2ⁿ)", "O(n W)", "O(n² v*)"],
      bonnes: [3],
      explication: "i jusqu'à n, V jusqu'à n v*." },
    { id: "q5", notion: "sad",
      enonce: "Cet algorithme est-il polynomial ?",
      options: ["Non, il est exponentiel en n", "Oui, car n² v* est un polynôme", "Non : pseudo-polynomial, v* est exponentiel en la taille O(n log v*)", "Oui si W est entier"],
      bonnes: [2],
      explication: "Il serait polynomial si les nombres étaient codés en unaire." },
    { id: "q6", notion: "sad",
      enonce: "Si V > v₁ + … + vᵢ₋₁, alors OPT(i, V) =",
      options: ["+∞", "wᵢ + OPT(i − 1, max{0, V − vᵢ})", "OPT(i − 1, V)", "min{OPT(i − 1, V), wᵢ}"],
      bonnes: [1],
      explication: "Les objets précédents ne suffisent pas : on est obligé de prendre i." }
  ]
});
