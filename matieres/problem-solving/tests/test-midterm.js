/* Test d'entraînement au midterm (20/10) : Introduction, Modélisation, Gloutons,
   Recherche locale. Questions nouvelles, instances inventées (aucun sujet recopié). */
Tests.enregistrer({
  matiere: "problem-solving",
  id: "test-midterm",
  titre: "Test d'entraînement au midterm",
  notions: {
    intro: { titre: "Problèmes, décision, optimisation", lecon: "decision-optimisation" },
    modele: { titre: "Modéliser en CSP", lecon: "modeliser-csp" },
    espace: { titre: "Espace de recherche", lecon: "modeliser-csp" },
    glouton: { titre: "Algorithmes gloutons", lecon: "selection-activites" },
    locale: { titre: "Recherche locale", lecon: "cbls-reines" }
  },
  questions: [
    {
      id: "q1", notion: "intro",
      enonce: "« Un graphe donné peut-il être colorié avec 4 couleurs ? » est :",
      options: ["une instance", "un problème indécidable", "un problème de décision", "un problème d'optimisation"],
      bonnes: [2],
      explication: "La réponse est oui ou non : c'est un problème de décision. La version optimisation demande le nombre minimum de couleurs."
    },
    {
      id: "q2", notion: "intro",
      enonce: "On a trouvé une tournée de longueur 120, puis on montre qu'aucune tournée de longueur &lt; 120 n'existe. Qu'a-t-on obtenu ?",
      options: ["Rien : il faut tester toutes les tournées", "Une solution optimale et sa preuve d'optimalité", "Seulement une heuristique", "Une solution non réalisable"],
      bonnes: [1],
      explication: "C'est la méthode du cours : une suite de problèmes de décision. La dernière recherche (« existe-t-il &lt; 120 ? ») échoue, ce qui prouve l'optimalité."
    },
    {
      id: "q3", notion: "intro",
      enonce: "Quelles affirmations sont conformes au cours ?",
      options: ["Un problème indécidable est un problème très difficile mais résoluble en temps exponentiel.", "Les problèmes NP-complets peuvent se transformer les uns en les autres.", "Trouver l'optimum et prouver son optimalité prennent toujours le même temps.", "Un problème difficile est un problème pour lequel on ne connaît pas (encore) d'algorithme efficace."],
      bonnes: [1, 3],
      explication: "Indécidable = aucun algorithme n'existe. Trouver et prouver peuvent être l'un rapide, l'autre lent."
    },
    {
      id: "q4", notion: "modele",
      enonce: "Sudoku 4×4 (chiffres 1 à 4, une fois par ligne, colonne et bloc 2×2). Quel modèle est correct ?",
      options: ["16 variables x<sub>i,j</sub> (valeur de la case), D = {1, 2, 3, 4}, x<sub>i,j</sub> ≠ x<sub>i,k</sub>, x<sub>i,j</sub> ≠ x<sub>k,j</sub>, et différentes dans chaque bloc", "4 variables (une par chiffre), D = {1, …, 16}", "16 variables, D = {0, 1}, somme de chaque ligne = 4", "1 variable par ligne, D = toutes les permutations, aucune contrainte"],
      bonnes: [0],
      explication: "Les inconnues sont les valeurs des cases, les valeurs possibles sont 1 à 4, et les règles deviennent des contraintes de différence."
    },
    {
      id: "q5", notion: "modele",
      enonce: "Dans le Zebra du cours, la variable m<sub>rouge</sub> désigne :",
      options: ["un booléen « la maison est rouge »", "la nationalité de l'habitant de la maison rouge", "le numéro de la maison rouge", "la couleur de la maison 1"],
      bonnes: [2],
      explication: "Chaque attribut est une variable dont la valeur est un numéro de maison : D = {1, …, 5}. « L'Anglais vit dans la maison rouge » devient m<sub>Anglais</sub> = m<sub>rouge</sub>."
    },
    {
      id: "q6", notion: "modele",
      enonce: "Avec le modèle du Zebra, comment écrire « la maison orange est juste après la verte » ?",
      options: ["m<sub>orange</sub> &gt; m<sub>vert</sub>", "m<sub>orange</sub> = m<sub>vert</sub> + 1", "|m<sub>orange</sub> − m<sub>vert</sub>| = 1", "m<sub>orange</sub> ≠ m<sub>vert</sub>"],
      bonnes: [1],
      explication: "« Juste après » donne un ordre et une distance de 1. « À côté de » (voisin) s'écrirait |a − b| = 1. Ce sont des corrigés proposés : le cours ne donne pas les contraintes du Zebra."
    },
    {
      id: "q7", notion: "modele",
      enonce: "Recette : l'étape a (durée 120 s) doit se faire avant l'étape b. Avec t<sub>x</sub> = date de début de x :",
      options: ["t<sub>a</sub> &lt; t<sub>b</sub>", "t<sub>b</sub> + 120 ≤ t<sub>a</sub>", "t<sub>a</sub> = t<sub>b</sub> − 1", "t<sub>a</sub> + 120 ≤ t<sub>b</sub>"],
      bonnes: [3],
      explication: "b ne peut commencer qu'une fois a terminée. t<sub>a</sub> &lt; t<sub>b</sub> autoriserait un chevauchement. (Modèle des annales, corrigé proposé.)"
    },
    {
      id: "q8", notion: "espace",
      enonce: "Une carte de 5 régions à colorier avec 4 couleurs (une variable par région). Espace de recherche ?",
      options: ["2⁵ = 32", "4⁵ = 1 024", "5⁴ = 625", "5 × 4 = 20"],
      bonnes: [1],
      explication: "Produit des tailles des domaines : 4 × 4 × 4 × 4 × 4. (Le cours ne définit pas le terme ; c'est la lecture de ses exemples.)"
    },
    {
      id: "q9", notion: "espace",
      enonce: "Carré latin d'ordre 3, une variable par case, domaine {1, 2, 3}. Espace de recherche ?",
      options: ["3! = 6", "3 × 9 = 27", "3⁹ = 19 683", "9³ = 729"],
      bonnes: [2],
      explication: "9 cases, 3 valeurs chacune : 3⁹. En général n^(n²) pour un carré d'ordre n."
    },
    {
      id: "q10", notion: "espace",
      enonce: "Pourquoi le second modèle de SEND + MORE (avec retenues) a-t-il un espace plus grand (2⁴ × 9² × 10⁶) ?",
      options: ["Il ajoute 4 variables binaires r₁…r₄", "Les domaines de s et m passent à [0, 9]", "Il supprime la contrainte alldifferent", "Il compte aussi les solutions fausses deux fois"],
      bonnes: [0],
      explication: "4 retenues à 2 valeurs chacune multiplient l'espace par 2⁴. Pourtant ce modèle est meilleur avec la propagation (57 feuilles au lieu de 483 840 en forward checking)."
    },
    {
      id: "q11", notion: "glouton",
      enonce: "Pièces (1, 5, 6), rendre 10. Le glouton « plus grande pièce possible » donne :",
      options: ["5 + 5 (2 pièces), optimal", "6 + 4", "10", "6 + 1 + 1 + 1 + 1 (5 pièces), non optimal"],
      bonnes: [3],
      explication: "Le glouton prend 6, puis ne peut prendre que des 1. L'optimum est 5 + 5. Même phénomène que le contre-exemple (1, 3, 4) du cours."
    },
    {
      id: "q12", notion: "glouton",
      enonce: "Événements [0, 10], [1, 3], [4, 6], [7, 9]. Combien en garde la stratégie « début croissant » ? « fin croissante » ?",
      options: ["3 et 1", "1 et 3", "3 et 3", "1 et 1"],
      bonnes: [1],
      explication: "Début croissant prend [0, 10], qui bloque tout. Fin croissante prend [1, 3], [4, 6], [7, 9] : l'optimum."
    },
    {
      id: "q13", notion: "glouton",
      enonce: "Sac à dos <b>fractionnaire</b>, W = 10 : A (valeur 12, 4 kg), B (valeur 15, 6 kg), C (valeur 4, 4 kg). Valeur optimale ?",
      options: ["24,5", "31", "27", "25"],
      bonnes: [2],
      explication: "Efficacités : A 3, B 2,5, C 1. On prend A (4 kg) puis B en entier (6 kg) : 12 + 15 = 27, sac plein."
    },
    {
      id: "q14", notion: "glouton",
      enonce: "Une heuristique, selon le cours :",
      options: ["s'évalue seulement en prouvant un ratio d'approximation", "fournit rapidement une solution réalisable, pas forcément optimale", "fournit toujours l'optimum", "est en général conçue pour un problème précis"],
      bonnes: [1, 3],
      explication: "Le cours donne deux critères d'évaluation : empirique (benchmark) et mathématique (garantie)."
    },
    {
      id: "q15", notion: "locale",
      enonce: "Sac à dos, modifications « ajouter un objet » et « retirer un objet ». Le voisinage de la solution {o₁, o₃} parmi o₁…o₄ (en ignorant la capacité) contient :",
      options: ["2 solutions", "16 solutions", "3 solutions", "4 solutions"],
      bonnes: [3],
      explication: "Une seule modification : retirer o₁, retirer o₃, ajouter o₂, ajouter o₄. Ensuite on écarte les voisins qui dépassent la capacité."
    },
    {
      id: "q16", notion: "locale",
      enonce: "La descente de gradient s'arrête : aucun voisin n'améliore strictement l'objectif. On est :",
      options: ["sur une solution non réalisable", "dans la liste tabou", "dans un minimum local, peut-être pas global", "forcément à l'optimum global"],
      bonnes: [2],
      explication: "C'est le défaut de la descente. Les remèdes du cours : redémarrages, ou accepter des voisins non améliorants (tabou)."
    },
    {
      id: "q17", notion: "locale",
      enonce: "Recherche tabou : quelles affirmations sont justes ?",
      options: ["Un mouvement tabou peut être accepté s'il bat la meilleure solution connue", "On va vers le meilleur voisin non interdit, même s'il est moins bon", "On interdit en général des mouvements plutôt que des solutions", "Une liste trop longue intensifie la recherche"],
      bonnes: [0, 1, 2],
      explication: "Une liste trop longue <b>diversifie</b> trop (risque de rater des solutions) ; trop courte, elle intensifie trop. La dernière affirmation est le critère d'aspiration."
    },
    {
      id: "q18", notion: "locale",
      enonce: "4-reines, lᵢ = colonne de la reine de la ligne i (lignes et colonnes de 1 à 4). l = (1, 2, 3, 4). Combien de paires (i, j) violent au moins une contrainte ?",
      options: ["0", "4", "6", "3"],
      bonnes: [2],
      explication: "Toutes les reines sont sur la même diagonale : lᵢ − i = 0 pour tout i. Les 6 paires violent lᵢ − i ≠ lⱼ − j. (On compte ici les paires ; le cours compte des contraintes non satisfaites, ce qui revient au même pour cette diagonale.)"
    }
  ]
});
