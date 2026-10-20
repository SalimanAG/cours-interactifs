/* Test de contrôle des prérequis : mêmes notions que le test d'autopositionnement
   du 14/10, questions nouvelles. Une notion = une leçon à revoir en cas d'erreur. */
Tests.enregistrer({
  matiere: "advanced-algorithms",
  id: "controle-prerequis",
  titre: "Test de contrôle des prérequis",
  notions: {
    notations: { titre: "Notations O, Ω, Θ", lecon: "notations-asymptotiques" },
    structures: { titre: "Tableaux et listes", lecon: "tableaux-listes" },
    tri: { titre: "Tri et arbres binaires", lecon: "tri-borne-inferieure" },
    graphes: { titre: "Graphes et parcours", lecon: "graphes-parcours" }
  },
  questions: [
    {
      id: "q1", notion: "notations",
      enonce: "Parmi les relations suivantes, lesquelles sont vraies ?",
      options: ["n² = O(n³)", "n³ = O(n²)", "3n + 5 = O(n)", "log n = O(n)", "2ⁿ = O(n¹⁰)"],
      bonnes: [0, 2, 3],
      explication: "On peut monter l'échelle (n² ≤ n³, log n ≤ n) et oublier les constantes (3n + 5 ≤ 4n pour n ≥ 5). n³ = O(n²) et 2ⁿ = O(n¹⁰) la descendent : faux (2ⁿ finit par dépasser tout polynôme)."
    },
    {
      id: "q2", notion: "notations",
      enonce: "f(n) = n log n + 5n. Alors f(n) = Θ( ? )",
      options: ["n", "n log n", "n²", "log n"],
      bonnes: [1],
      explication: "Terme dominant : n log n (5n = O(n log n)). Donc f = Θ(n log n)."
    },
    {
      id: "q3", notion: "notations",
      enonce: "f(n) = O(g(n)) signifie :",
      options: [
        "f(n) ≤ g(n) pour tout n",
        "il existe c > 0 et n₀ tels que pour tout n ≥ n₀, f(n) ≤ c·g(n)",
        "f(n) / g(n) tend vers 1",
        "il existe un n tel que f(n) ≤ g(n)"
      ],
      bonnes: [1],
      explication: "Une constante c et un rang n₀ : on ignore les constantes multiplicatives et les petites valeurs de n."
    },
    {
      id: "q4", notion: "structures",
      enonce: "Temps pour lire l'élément d'indice k d'un tableau de taille n ?",
      options: ["O(1)", "O(k)", "O(n)", "O(log n)"],
      bonnes: [0],
      explication: "Accès direct par calcul d'adresse."
    },
    {
      id: "q5", notion: "structures",
      enonce: "Temps pour accéder à la k-ième cellule d'une liste simplement chaînée de taille n (k ≤ n) ?",
      options: ["O(1)", "O(k)", "O(log n)", "O(n log n)"],
      bonnes: [1],
      explication: "k − 1 sauts depuis la tête : O(k). (O(n) serait vrai mais moins précis ; il n'est pas proposé ici.)"
    },
    {
      id: "q6", notion: "structures",
      enonce: "Supprimer la première cellule d'une liste simplement chaînée de taille n coûte :",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      bonnes: [0],
      explication: "La tête devient la cellule suivante : un seul pointeur à changer."
    },
    {
      id: "q7", notion: "tri",
      enonce: "L'arbre de décision d'un tri par comparaisons de 4 éléments a au moins combien de feuilles ?",
      options: ["4", "8", "16", "24"],
      bonnes: [3],
      explication: "Une feuille par ordre possible : 4! = 24."
    },
    {
      id: "q8", notion: "tri",
      enonce: "Dans le pire cas, un tri par comparaisons de 4 éléments fait au moins :",
      options: ["3 comparaisons", "4 comparaisons", "5 comparaisons", "6 comparaisons"],
      bonnes: [2],
      explication: "Il faut 2ᵏ ≥ 24, donc k ≥ 5 (2⁴ = 16 < 24 ≤ 32 = 2⁵)."
    },
    {
      id: "q9", notion: "tri",
      enonce: "Un arbre binaire de profondeur 4 a au plus combien de feuilles ?",
      options: ["4", "8", "16", "32"],
      bonnes: [2],
      explication: "2⁴ = 16."
    },
    {
      id: "q10", notion: "graphes",
      enonce: "Un graphe a 10 sommets, tous de degré 3. Combien a-t-il d'arêtes ?",
      options: ["10", "13", "15", "30"],
      bonnes: [2],
      explication: "Σ d(u) = 2m : 10 × 3 = 30 = 2m, donc m = 15."
    },
    {
      id: "q11", notion: "graphes",
      enonce: "Lesquels calculent les distances (en nombre d'arêtes) depuis s dans un graphe non pondéré ?",
      options: ["BFS", "DFS", "Dijkstra", "Kruskal"],
      bonnes: [0, 2],
      explication: "BFS, et Dijkstra avec tous les poids à 1. Le DFS ne suit pas les plus courts chemins ; Kruskal calcule un arbre couvrant minimum."
    },
    {
      id: "q12", notion: "graphes",
      enonce: "Complexité d'un DFS sur un graphe à n sommets et m arêtes représenté par listes d'adjacence ?",
      options: ["O(n + m)", "O(n²)", "O(nm)", "O(m log n)"],
      bonnes: [0],
      explication: "Chaque sommet est marqué une fois, chaque liste d'adjacence parcourue une fois : n + 2m."
    }
  ]
});
