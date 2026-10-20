/* Cartes : Recherche locale. */
Paquets.enregistrer({
  matiere: "problem-solving",
  id: "recherche-locale",
  titre: "Recherche locale",
  cartes: [
    { id: "principe", q: "Recherche locale : le principe ?", r: "Partir d'une solution initiale ; à chaque étape la modifier pour améliorer l'objectif, en espérant atteindre l'optimum global. Pas de garantie d'optimalité (heuristique), coût faible." },
    { id: "vs-glouton", q: "Glouton vs recherche locale ?", r: "Le glouton <b>construit</b> une solution pas à pas sans revenir sur ses décisions. La recherche locale part d'une solution <b>complète</b> et la <b>modifie</b>." },
    { id: "initiale", q: "Trois façons d'obtenir la solution initiale ?", r: "Solution « vide », solution aléatoire (à vérifier : est-ce bien une solution ?), solution d'un algorithme glouton." },
    { id: "modifs", q: "Modifications types ?", r: "Changer la valeur d'une variable ; échanger les valeurs de deux variables. Sac à dos : ajouter un objet (si la capacité le permet), retirer un objet. TSP : k-opt (k = 2, k = 3)." },
    { id: "voisinage", q: "Voisinage d'une solution ?", r: "L'ensemble des solutions obtenues par <b>une seule modification</b>." },
    { id: "quel-voisin", q: "Quel voisin choisir ?", r: "Au hasard, le meilleur, ou l'un des meilleurs." },
    { id: "marche", q: "Marche aléatoire ?", r: "À chaque étape, la solution est modifiée aléatoirement." },
    { id: "descente", q: "Descente de gradient : principe et défaut ?", r: "Aller vers un voisin qui <b>améliore strictement</b> l'objectif. Défaut : on reste bloqué dans un <b>minimum local</b>." },
    { id: "restarts", q: "Les redémarrages du cours ?", r: "Repartir d'une autre solution : aléatoire, ou « vide » avec un pourcentage de variables (5 %, 10 %, 20 %) fixées comme dans la meilleure solution trouvée — Large Neighborhood Search (Shaw, 1998)." },
    { id: "poisson", q: "« Don't be a goldfish » : de quoi parle-t-on ?", r: "Accepter d'aller vers un voisin <b>sans amélioration</b>… sans revenir en arrière en boucle : il faut de la mémoire, d'où la recherche tabou." },
    { id: "tabou", q: "Recherche tabou (Glover, 1986) ?", r: "Depuis s, aller vers le <b>meilleur voisin non interdit</b>, et interdire s pendant les m itérations suivantes. En pratique, on interdit des <b>mouvements</b> plutôt que des solutions (mémoire)." },
    { id: "aspiration", q: "Critère d'aspiration ?", r: "Un mouvement tabou est accepté s'il mène à une solution meilleure que la meilleure connue." },
    { id: "taille-m", q: "Taille m de la liste tabou : trop petite ? trop grande ?", r: "Trop petite : intensification trop forte, on tourne autour d'un optimum local. Trop grande : diversification trop forte, on risque de rater des solutions. Battiti et Protasi (2001) l'adaptent dynamiquement." },
    { id: "cbls", q: "Constraint Based Local Search : quel objectif ?", r: "Quand il n'y a pas de fonction objectif : on minimise le <b>nombre de contraintes non satisfaites</b> du CSP (V, D, C). Une solution = objectif 0." }
  ]
});
