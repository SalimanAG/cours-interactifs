/* Paquet de cartes : Branching — stable maximum (cours 4, TP2). */
Paquets.enregistrer({
  matiere: "advanced-algorithms",
  id: "branching",
  titre: "Branching",
  cartes: [
    { id: "stable-def", q: "Définition d'un stable, d'un stable maximum ?", r: "Stable : S ⊆ V de sommets deux à deux non adjacents. Stable maximum : un stable de cardinal |S| maximum parmi tous les stables de G." },
    { id: "maximum-maximal", q: "Stable maximum vs stable maximal ?", r: "Maximal : on ne peut plus ajouter aucun sommet. Maximum : de taille maximum. Tout stable maximum est maximal, pas l'inverse." },
    { id: "difficulte", q: "Difficulté du stable maximum ? Exemple d'application du cours ?", r: "NP-complet. Les arêtes représentent des incompatibilités : nombre maximum de séances de CM/TD/TP compatibles dans une semaine." },
    { id: "brute-force", q: "Algo brute force pour le stable maximum et sa complexité ?", r: "Tester les 2ⁿ sous-ensembles, chacun en O(n + m) : <code>O((n + m) · 2ⁿ)</code> = O*(2ⁿ)." },
    { id: "p1", q: "Propriété 1 (stable et voisinage) ?", r: "Si S est un stable et x ∈ S, alors S ∩ N(x) = ∅." },
    { id: "p2", q: "Propriété 2 (stable maximum et voisinage fermé) ?", r: "Si S est un stable maximum (donc maximal) et x ∈ V, alors S ∩ ({x} ∪ N(x)) ≠ ∅." },
    { id: "branching-idee", q: "Idée générale du branching ?", r: "Faire une disjonction de cas qui tombe sur des problèmes de taille réduite, résoudre récursivement chaque problème réduit, garder le meilleur résultat." },
    { id: "branching-regle", q: "Règle de branchement pour le stable maximum ?", r: "Choisir x de degré minimum ; pour chaque y ∈ {x} ∪ N(x) : mettre y dans S, retirer y et N(y) de G (G̃_y), résoudre sur G̃_y. Garder la meilleure solution." },
    { id: "pourquoi-degre-min", q: "Pourquoi brancher sur un sommet de degré minimum ?", r: "Pour réduire le nombre de branches : d + 1 branches pour un sommet de degré d, et chaque voisin yᵢ a d(yᵢ) ≥ d, donc chaque branche retire au moins d + 1 sommets." },
    { id: "complexite-arbre", q: "Complexité du branching en fonction de l'arbre de récursion ?", r: "O(n + m) par nœud : <code>O((n + m) · T(n))</code>, où T(n) est le nombre de nœuds de l'arbre dans le pire des cas (graphe à au plus n sommets)." },
    { id: "recurrence", q: "Récurrence vérifiée par T(n) ?", r: "<code>T(n) ≤ 1 + (d + 1) T(n − (d + 1))</code>, soit T(n) ≤ 1 + s T(n − s) avec s = d + 1 ; d'où T(n) = O(s^(n/s))." },
    { id: "pire-s", q: "Pourquoi O(1,45ⁿ) ?", r: "s^(1/s) est maximum sur les entiers pour s = 3 : T(n) = O(3^(n/3)) = O(1,45ⁿ) (3^(1/3) ≈ 1,442)." },
    { id: "vector", q: "Branching vector d'une règle ?", r: "Si brancher sur un graphe à n sommets donne des graphes à n − t₁, …, n − t_r sommets, le vecteur est (t₁, …, t_r)." },
    { id: "factor", q: "Branching factor τ(t₁, …, t_r) ?", r: "L'unique racine réelle (> 1) de xⁿ − x^(n−t₁) − … − x^(n−t_r) ; alors T(n) ≤ τⁿ. Avec plusieurs règles : le plus grand τ." },
    { id: "tau-exemples", q: "τ(3,3,3), τ(2,2), τ(1,2) ?", r: "τ(3,3,3) = 3^(1/3) ≈ 1,442 ; τ(2,2) = √2 ≈ 1,414 ; τ(1,2) = nombre d'or ≈ 1,618." },
    { id: "tous-stables", q: "Que donne en plus l'algo de branching pour le stable maximum ?", r: "Tous les stables maximum… mais plusieurs fois chacun." },
    { id: "tp2-tableaux", q: "TP2 : comment représenter le graphe induit courant ?", r: "Sans le construire : un tableau presence[v] (sommet encore dans G̃ ?) et un tableau degre_courant[v] (degré dans G̃), partagés par tous les appels." },
    { id: "tp2-defaire", q: "TP2 : pourquoi chaque appel doit-il « défaire » ses modifications ?", r: "Tous les appels partagent les mêmes tableaux globaux (pas de copie : profondeur jusqu'à n). On défait avec la liste L des voisins retirés : degrés, puis présence, puis on retire x de S." },
    { id: "tp2-arret", q: "TP2 : condition d'arrêt plus faible que le graphe vide ?", r: "Si |S courant| + |G̃| ≤ taille du meilleur stable trouvé, la branche ne peut pas faire mieux : on s'arrête." }
  ]
});
