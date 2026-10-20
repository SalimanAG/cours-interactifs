/* Cartes : questions possibles à l'oral sur « Is it a tree » (midterm).
   Les cartes marquées « hors cours » vont au-delà des diapos : à connaître
   comme culture, pas comme contenu du cours. */
Paquets.enregistrer({
  matiere: "programming-challenge",
  id: "oral-est-un-arbre",
  titre: "Is it a tree — questions d'oral",
  cartes: [
    { id: "def-arbre", q: "Définition d'un arbre (cours 5) ?",
      r: "Un graphe <b>non orienté</b>, <b>acyclique</b> et <b>connexe</b>." },
    { id: "n-1-sens", q: "« Arbre ⟹ n − 1 arêtes » : la réciproque est-elle vraie ?",
      r: "Non. Contre-exemple (cas 4 du cours) : 5 sommets, arêtes 1-3, 1-4, 2-5, 3-4 → 4 arêtes, mais un cycle 1-3-4 et {2, 5} isolé. Réponse NO." },
    { id: "deux-sur-trois", q: "Pourquoi « M = N − 1 et connexe » suffit-il pour dire YES ?",
      r: "Propriété classique (pas énoncée dans le cours) : pour un graphe à n sommets, deux des trois conditions <i>connexe</i>, <i>acyclique</i>, <i>n − 1 arêtes</i> entraînent la troisième. Connexe + n − 1 arêtes ⟹ acyclique." },
    { id: "algo", q: "Ton algorithme en trois lignes ?",
      r: "1. Si M ≠ N − 1 → NO.<br>2. Construire les listes d'adjacence, BFS depuis 1 en marquant vu[] et en comptant les sommets marqués.<br>3. YES si compte = N, sinon NO." },
    { id: "pourquoi-1", q: "Pourquoi partir du sommet 1 ? Et si 1 n'existait pas ?",
      r: "N'importe quel sommet convient : si le graphe est connexe, on atteint tout depuis n'importe où. 1 existe toujours car 0 &lt; N et les sommets sont numérotés de 1 à N." },
    { id: "cout-temps", q: "Complexité en temps ?",
      r: "O(N + M) : O(M) pour lire et remplir Adj, O(N + M) pour le BFS (chaque sommet enfilé au plus une fois, chaque liste Adj parcourue une fois → 2M voisins examinés). Après le test de la ligne 1, M = N − 1 donc O(N)." },
    { id: "cout-memoire", q: "Complexité en mémoire ? Pourquoi pas une matrice d'adjacence ?",
      r: "O(N + M) avec les listes d'adjacence (2M entrées). Une matrice N × N demanderait 10<sup>8</sup> cases pour N = 10 000 : trop de mémoire, et O(N²) pour la remplir et la parcourir." },
    { id: "deux-sens", q: "Pourquoi ajouter chaque arête u v dans Adj[u] <i>et</i> dans Adj[v] ?",
      r: "Le graphe est non orienté : depuis u on doit pouvoir aller en v et inversement. Sinon le BFS depuis 1 raterait des sommets (ex. arête « 4 2 » lue dans ce sens : on ne pourrait pas remonter de 2 vers 4)." },
    { id: "vu-quand", q: "Pourquoi marquer vu[v] au moment où on <i>enfile</i> v, et pas quand on le défile ?",
      r: "Pour qu'un sommet ne soit enfilé qu'une seule fois. Sinon plusieurs voisins peuvent l'ajouter à la file avant qu'il soit défilé : file plus longue, et compte faux si on compte à l'enfilage. (Marquer au défilement marche aussi, à condition d'ignorer un sommet déjà vu quand on le défile.)" },
    { id: "bfs-dfs", q: "BFS ou DFS : est-ce que ça change le résultat ? Pourquoi ton choix en Python ?",
      r: "Le résultat est le même (on teste seulement quels sommets sont atteints). En Python, un DFS récursif dépasse la limite de récursion (1000 par défaut) sur une chaîne de 10 000 sommets → RecursionError. Le BFS itératif avec <span class='mono'>deque</span> évite le problème." },
    { id: "deque", q: "Pourquoi <span class='mono'>collections.deque</span> plutôt qu'une liste pour la file ?",
      r: "<span class='mono'>deque.popleft()</span> est en O(1) ; <span class='mono'>list.pop(0)</span> décale tous les éléments, O(longueur de la file) → jusqu'à O(N²) au total." },
    { id: "lecture", q: "Comment lis-tu l'entrée en Python, et pourquoi ?",
      r: "<span class='mono'>data = sys.stdin.buffer.read().split()</span> : tout d'un coup, puis on avance dans la liste. Plus rapide que <span class='mono'>input()</span> appelé 20 000 fois." },
    { id: "cas-limites", q: "Sorties pour <span class='mono'>1 0</span>, <span class='mono'>4 0</span>, <span class='mono'>2 1 / 2 2</span> ?",
      r: "<span class='mono'>1 0</span> → YES (un sommet seul est un arbre).<br><span class='mono'>4 0</span> → NO (M ≠ 3).<br><span class='mono'>2 1 / 2 2</span> → NO (boucle : M = N − 1 mais 1 n'est pas relié à 2, compte = 1)." },
    { id: "doublon", q: "Une arête répétée (ex. <span class='mono'>3 2 / 1 2 / 1 2</span>) : faut-il la traiter à part ?",
      r: "Non. Avec M = N − 1, le doublon « gaspille » une arête : le graphe ne peut pas être connexe, le BFS donne compte &lt; N → NO. Même raisonnement pour une boucle." },
    { id: "test-m-utile", q: "Le test M ≠ N − 1 est-il indispensable ? Que se passe-t-il sans lui ?",
      r: "Indispensable pour la correction : sans lui, un graphe connexe <i>avec un cycle</i> (ex. cas 2 du cours, M = 5) donnerait compte = N → YES à tort. Il sert aussi à répondre tout de suite NO quand M est grand." },
    { id: "sol2-naif", q: "« Solution 2 : check on the list » — pourquoi ne suffit-il pas de vérifier que chaque sommet apparaît dans la liste d'arêtes ?",
      r: "Cas 4 du cours : M = 4 = N − 1 et 1, 2, 3, 4, 5 apparaissent tous, mais ce n'est pas un arbre. Il faut suivre les arêtes (BFS ou union-find). La diapo ne précise pas la méthode." },
    { id: "union-find", q: "(Hors cours) L'alternative union-find en une phrase ?",
      r: "Pour chaque arête u v : si u et v sont déjà dans le même groupe → cycle → NO ; sinon fusionner les groupes. Avec M = N − 1 et aucun cycle → YES. Presque O(M)." }
  ]
});
