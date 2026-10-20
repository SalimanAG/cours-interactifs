/* Cartes : Arbres (cours 5). */
Paquets.enregistrer({
  matiere: "programming-challenge",
  id: "arbres",
  titre: "Arbres",
  cartes: [
    { id: "def", q: "Arbre (théorie des graphes) et nombre d'arêtes ?", r: "Graphe non orienté, acyclique, connexe. Arbre ⟹ n sommets, n − 1 arêtes." },
    { id: "binaire", q: "Arbre binaire ?", r: "Arbre où chaque nœud a un enfant gauche, un enfant droit, les deux ou aucun — gauche et droite sont distingués." },
    { id: "familles", q: "Les deux familles de parcours du cours ?", r: "En largeur (BFS, niveau par niveau, avec une file) et en profondeur (DFS : préfixe, infixe, postfixe)." },
    { id: "nlr", q: "Préfixe, infixe, postfixe : les ordres ?", r: "Préfixe NLR (nœud, gauche, droite) ; infixe LNR ; postfixe LRN." },
    { id: "pre", q: "Préfixe de l'arbre du cours 1 (2 (4, 5 (7, 8)), 3 (−, 6 (9, −))) ?", r: "1 2 4 5 7 8 3 6 9" },
    { id: "in", q: "Infixe de l'arbre du cours ?", r: "4 2 7 5 8 1 3 9 6" },
    { id: "post", q: "Postfixe de l'arbre du cours ?", r: "4 7 8 5 2 9 6 3 1" },
    { id: "racine", q: "Où trouver la racine dans chaque parcours ?", r: "Premier élément du préfixe, dernier du postfixe ; dans l'infixe, elle sépare le sous-arbre gauche (avant) du droit (après)." },
    { id: "couples", q: "Quels couples de parcours déterminent l'arbre ?", r: "Préfixe + infixe ✓, postfixe + infixe ✓, préfixe + postfixe ✗ (un enfant unique peut être à gauche ou à droite)." },
    { id: "ambig", q: "Combien d'arbres ont le préfixe 1 2 4 5 7 8 3 6 9 et le postfixe 4 7 8 5 2 9 6 3 1 ?", r: "4 : les nœuds 3 et 6 ont chacun un seul enfant, qui peut être à gauche ou à droite (2 × 2)." },
    { id: "treeorder", q: "Tree order : la solution 1 du cours ?", r: "Reconstruire l'arbre avec deux parcours (préfixe + infixe), générer le troisième (postfixe), comparer avec celui donné → yes / no." },
    { id: "cout", q: "Reconstruction : comment éviter O(N²) ?", r: "Précalculer pos[valeur] = indice dans l'infixe : la racine se trouve en O(1), reconstruction en O(N)." },
    { id: "recursion", q: "Tree order en Python avec N ≤ 8000 : quel risque ?", r: "Un arbre dégénéré (« peigne ») donne N appels récursifs imbriqués : au-delà de la limite par défaut (1000) → RecursionError. sys.setrecursionlimit ou pile explicite." },
    { id: "isitatree", q: "Is it a tree : l'algorithme ?", r: "Si M ≠ N − 1 → NO ; sinon BFS depuis 1 ; YES si les N sommets sont atteints. O(N + M)." }
  ]
});
