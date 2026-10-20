/* Paquet de cartes : Coupe minimum (cours 2 — algorithmes probabilistes, TP1). */
Paquets.enregistrer({
  matiere: "advanced-algorithms",
  id: "coupe-min",
  titre: "Coupe minimum",
  cartes: [
    {
      id: "def-probleme",
      q: "Coupe minimum (version du cours 2) : entrée et sortie ?",
      r: "Entrée : un multigraphe non orienté (arêtes multiples possibles).<br>Sortie : une coupe (U, U′) de G — une bipartition de V(G) — ayant le nombre minimum d'arêtes qui traversent."
    },
    {
      id: "diff-precedemment",
      q: "Trois différences avec la coupe minimum vue « précédemment » (par flot) ?",
      r: "Ni puits ni source ; graphe non orienté ; arêtes multiples (équivalent à des capacités entières)."
    },
    {
      id: "algo-deterministe",
      q: "Solution déterministe proposée par le cours et sa complexité ?",
      r: "n(n − 1)/2 fois l'algo d'Edmonds-Karp, avec toutes les paires {source, puits} : <code>O(n³m²)</code> (<code>O(n³m)</code> avec le meilleur algo de flot max, en <code>O(nm)</code>)."
    },
    {
      id: "proba-perd-gagne",
      q: "Algorithme probabiliste : qu'est-ce qu'on perd, qu'est-ce qu'on gagne ?",
      r: "On perd : on n'obtient pas toujours l'optimum.<br>On gagne : la complexité baisse (ici <code>O(n³m²) → O(n⁴ log n)</code>).<br>Ça marche si la probabilité d'obtenir l'optimum n'est pas trop faible."
    },
    {
      id: "def-contraction",
      q: "Définition de G/uv (contraction de l'arête uv) ?",
      r: "<code>G/uv = (V \\ {u}, E \\ ⦃ux | x ∈ N(u)⦄ ∪ ⦃vx | ux ∈ E et x ≠ v⦄)</code><br>u disparaît, ses arêtes sont rattachées à v, les arêtes uv disparaissent (pas de boucle)."
    },
    {
      id: "algo-contraction",
      q: "Écrire l'algorithme Contraction Aléatoire.",
      r: "<code>pour tout v ∈ V : S(v) ← {v}</code><br><code>tant que |V| > 2 :</code><br><code>&nbsp;&nbsp;choisir uv uniformément au hasard</code><br><code>&nbsp;&nbsp;G ← G/uv ; S(v) ← S(v) ∪ S(u)</code><br><code>retourner (S(x), S(y))</code> où {x, y} = V"
    },
    {
      id: "nb-contractions",
      q: "Combien de contractions fait toujours l'algorithme ?",
      r: "n − 2, pour finir avec un graphe à 2 sommets."
    },
    {
      id: "condition-C",
      q: "C = (X, Y) une coupe minimum fixée. Quand l'algorithme renvoie-t-il C ?",
      r: "Ssi il ne contracte aucune arête traversant C."
    },
    {
      id: "premiere-contraction",
      q: "Probabilité, à la 1re contraction, de choisir une arête ne traversant pas C ?",
      r: "<code>p = 1 − k/m</code>, où k est la taille d'une coupe minimum et m le nombre d'arêtes."
    },
    {
      id: "nb-aretes-min",
      q: "Pourquoi G<sub>j</sub> (n − j + 1 sommets, coupe min de taille k) a-t-il au moins k(n − j + 1)/2 arêtes ?",
      r: "Son degré minimum est au moins k (sinon un sommet seul formerait une coupe plus petite), et la somme des degrés vaut 2 × (nombre d'arêtes)."
    },
    {
      id: "borne-pj",
      q: "Borne sur p<sub>j</sub> = Pr[E<sub>j</sub> | E<sub>1</sub> ∩ … ∩ E<sub>j−1</sub>] ?",
      r: "<code>1 − p_j ≤ k / (k(n−j+1)/2) = 2/(n−j+1)</code>, d'où <code>p_j ≥ (n−j−1)/(n−j+1)</code>."
    },
    {
      id: "proba-C",
      q: "Probabilité qu'une exécution renvoie la coupe minimum C fixée ?",
      r: "<code>p ≥ (n−2)/n × (n−3)/(n−1) × … × 2/4 × 1/3 = 2/(n(n−1))</code> (produit télescopique)."
    },
    {
      id: "nb-essais",
      q: "Combien d'exécutions pour trouver C avec probabilité → 1 ? Pourquoi ?",
      r: "<code>p_echec = (1 − p)^t</code> et <code>(1 − p)^(1/p) ≤ 1/e</code>.<br>Avec <code>t = n(n−1)/2 · log n</code> : <code>p_echec ≤ (1/e)^(log n) = 1/n</code>, donc succès ≥ 1 − 1/n → 1."
    },
    {
      id: "complexite-contraction",
      q: "Complexité d'une exécution de Contraction (détail par ligne) ?",
      r: "Boucle principale O(n) fois ; ligne 5 (choix) O(1) ; ligne 6 (G/uv) O(n) ; ligne 7 (S(v) ∪ S(u)) O(n). Total <code>O(n²)</code>."
    },
    {
      id: "complexite-totale",
      q: "Complexité totale de l'algo probabiliste pour la coupe minimum ?",
      r: "<code>O(f(n) · n² log n)</code> avec <code>f(n) = O(n²)</code> : <code>O(n⁴ log n)</code>, pour une probabilité de succès ≥ 1 − 1/n."
    },
    {
      id: "variantes",
      q: "Variantes du nombre d'exécutions t (conclusion du cours) ?",
      r: "<code>t = n(n−1)/2</code> : p ≥ 1 − 1/e, O(n⁴).<br><code>t = log 1000 · n(n−1)/2</code> : p ≥ 1 − 1/1000, O(n⁴).<br><code>t = n · n(n−1)/2</code> : p ≥ 1 − 1/eⁿ, O(n⁵)."
    },
    {
      id: "tp-groupes",
      q: "TP1 : comment simuler les contractions sans modifier le graphe ?",
      r: "Chaque sommet porte l'identifiant de son groupe ; contracter = unir les groupes des deux extrémités (on ne réétiquette que le plus petit groupe). Une arête uv existe encore ssi u et v sont dans des groupes différents."
    },
    {
      id: "tp-tirage",
      q: "TP1 : comment tirer une arête uniformément parmi celles qui restent ?",
      r: "On fixe d'emblée un ordre aléatoire π de toutes les arêtes de G (mélange), puis on les parcourt : on contracte la première arête encore présente, on rejette celles qui ont disparu."
    }
  ]
});
