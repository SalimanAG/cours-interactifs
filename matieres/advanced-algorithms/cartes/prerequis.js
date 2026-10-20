/* Paquet de cartes : Prérequis (notations, structures, tri, graphes et parcours).
   Notions absentes des documents du cours : définitions standard (Cormen). */
Paquets.enregistrer({
  matiere: "advanced-algorithms",
  id: "prerequis",
  titre: "Prérequis",
  cartes: [
    { id: "def-O", q: "Définition de f(n) = O(g(n)) ?", r: "Il existe c > 0 et n₀ tels que pour tout n ≥ n₀, <code>f(n) ≤ c·g(n)</code>. Borne supérieure à une constante près." },
    { id: "def-Omega", q: "Définition de f(n) = Ω(g(n)) ?", r: "Il existe c > 0 et n₀ tels que pour tout n ≥ n₀, <code>f(n) ≥ c·g(n)</code>. Autrement dit g = O(f)." },
    { id: "def-Theta", q: "Que signifie f = Θ(g) ?", r: "f = O(g) <b>et</b> f = Ω(g) : f est encadrée par deux multiples de g, « du même ordre »." },
    { id: "echelle", q: "Ranger : n², log n, 2ⁿ, n log n, 1, n.", r: "<code>1 < log n < n < n log n < n² < 2ⁿ</code>" },
    { id: "nlogn-On", q: "n log n = O(n) ? n = O(n log n) ?", r: "Faux : pour tout c, n log n > c·n dès que n > 2^c.<br>Vrai : n ≤ n log n pour n ≥ 2." },
    { id: "constantes", q: "4n = O(n) ? n = O(4n) ?", r: "Les deux sont vrais : les constantes multiplicatives ne comptent pas (c = 4, puis c = 1)." },
    { id: "terme-dominant", q: "3n² + 5n + 7 = Θ(?)", r: "<code>Θ(n²)</code> : on garde le terme dominant sans sa constante." },
    { id: "2n-n2", q: "À partir de quel n a-t-on 2ⁿ > n² pour toujours ?", r: "n ≥ 5 (n = 2 et 4 : égalité ; n = 3 : 8 < 9)." },
    { id: "acces-tableau", q: "Coût d'accès à la case d'indice i d'un tableau de taille n ?", r: "<code>O(1)</code> : adresse = début + (i − 1) × taille d'une case." },
    { id: "acces-liste", q: "Coût d'accès à la i-ème cellule d'une liste simplement chaînée de taille n ?", r: "<code>O(i)</code> : i − 1 sauts depuis la tête. O(n) est vrai mais moins précis." },
    { id: "insertion-tete", q: "Insérer en tête : liste chaînée ? tableau ?", r: "Liste : <code>O(1)</code> (un pointeur). Tableau : <code>O(n)</code> (décaler les éléments)." },
    { id: "dichotomie", q: "Recherche dans un tableau trié de taille n ?", r: "<code>O(log n)</code> par dichotomie (grâce à l'accès direct)." },
    { id: "borne-tri", q: "Nombre minimum de comparaisons, dans le pire cas, pour trier n nombres par comparaisons ?", r: "<code>Θ(n log n)</code> : au moins log₂(n!) = Ω(n log n), atteint par le tri fusion." },
    { id: "arbre-decision", q: "Pourquoi un tri par comparaisons fait-il au moins log₂(n!) comparaisons ?", r: "Son arbre de décision a au moins n! feuilles (une par ordre possible) ; un arbre binaire de profondeur k a au plus 2ᵏ feuilles, donc k ≥ log₂(n!)." },
    { id: "feuilles", q: "Arbre binaire de profondeur k : nombre maximum de feuilles ?", r: "<code>2ᵏ</code>." },
    { id: "logfact", q: "Pourquoi log₂(n!) = Ω(n log n) ?", r: "n! ≥ (n/2)^(n/2) (au moins n/2 facteurs ≥ n/2), donc log₂(n!) ≥ (n/2)·log₂(n/2)." },
    { id: "voisinage", q: "Qu'est-ce que le voisinage N(u) d'un sommet u ?", r: "L'ensemble des <b>sommets</b> reliés à u par une arête. Le degré d(u) = |N(u)|." },
    { id: "somme-degres", q: "Somme des degrés d'un graphe à m arêtes ?", r: "<code>Σ d(u) = 2m</code> : chaque arête compte pour ses deux extrémités." },
    { id: "proba-paire", q: "On tire uniformément une paire de sommets (n sommets, m arêtes). Probabilité qu'ils soient reliés ?", r: "<code>m / (n(n−1)/2) = 2m / (n(n−1))</code>." },
    { id: "bfs-file", q: "Quelle structure utilise le BFS ? Et le DFS ?", r: "BFS : une <b>file</b> (premier entré, premier sorti). DFS : une <b>pile</b> (la pile des appels récursifs)." },
    { id: "bfs-complexite", q: "Complexité du BFS (et du DFS) avec listes d'adjacence ?", r: "<code>O(n + m)</code> : chaque sommet traité une fois, chaque liste N(u) parcourue une fois (2m examens). Avec une matrice d'adjacence : O(n²)." },
    { id: "distances", q: "Quels algorithmes calculent les distances dans un graphe non pondéré ?", r: "BFS, et Dijkstra (poids tous égaux à 1). Pas le DFS ; Prim et Kruskal calculent un arbre couvrant minimum." },
    { id: "techniques", q: "BFS, DFS, Prim : quelle technique ?", r: "BFS → itératif (boucle sur une file) ; DFS → récursif ; Prim → glouton." },
    { id: "composante", q: "Que visite un parcours (BFS ou DFS) lancé depuis s ?", r: "Exactement la composante connexe de s. Pour tout visiter, on relance depuis chaque sommet non visité (total toujours O(n + m))." },
    { id: "bfs-niveaux", q: "Pourquoi le BFS donne-t-il les distances depuis s ?", r: "Il traite les sommets par distance croissante : un sommet découvert depuis u (à distance d) reçoit d + 1, et la file sort tous les sommets à distance d avant ceux à distance d + 1." }
  ]
});
