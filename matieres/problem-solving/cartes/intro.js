/* Cartes : Introduction (Problem Solving). */
Paquets.enregistrer({
  matiere: "problem-solving",
  id: "intro",
  titre: "Introduction",
  cartes: [
    { id: "probleme", q: "Qu'est-ce qu'un problème ? Qu'est-ce qu'une instance ?", r: "Un <b>problème</b> est une question générale, décrite par des <b>données</b> et une <b>question</b> (ex. plus court chemin entre deux points). Une <b>instance</b> est un jeu de données précis (ex. le plus court chemin entre Nice et Nantes). On cherche un algorithme qui marche pour toutes les instances." },
    { id: "tsp", q: "TSP : données, question, formulation mathématique ?", r: "Données : une liste de villes et leurs distances deux à deux. Question : la tournée la plus courte qui visite chaque ville exactement une fois (une seule tournée, pas de sous-tours). Formulation : un <b>cycle hamiltonien de poids minimum</b> dans un graphe complet pondéré." },
    { id: "trois-sortes", q: "Facile, difficile, indécidable : quelle différence ?", r: "<b>Facile</b> : on connaît un algorithme efficace (polynomial). <b>Difficile</b> : on n'en connaît pas (encore ?). <b>Indécidable</b> : aucun algorithme n'existe." },
    { id: "p-np", q: "La question P vs NP, selon le cours ?", r: "Les problèmes faciles ont des algorithmes polynomiaux ; pour les difficiles, on ne connaît que des algorithmes exponentiels (2ⁿ). Question clé : existe-t-il toujours un algorithme polynomial ?" },
    { id: "karp", q: "Des problèmes NP-complets cités (parmi les 21 de Karp) ? Leur propriété commune ?", r: "Hitting-set (couverture d'ensemble), sac à dos, subset sum, bin packing, coloration de graphe, clique maximum. Ils sont tous équivalents : on peut transformer l'un en l'autre." },
    { id: "interrupteurs", q: "Interrupteurs et ampoules : quelle question, quelle taille d'énumération ?", r: "Nombre minimum d'interrupteurs pour allumer toutes les ampoules. n interrupteurs, 2 choix chacun ⇒ <span class='mono'>2ⁿ</span> combinaisons." },
    { id: "coloration-cl", q: "Coloration par contraction / connexion : le principe ?", r: "Pour deux sommets a, b non adjacents : soit même couleur ⇒ <b>contraction</b> (C), soit couleurs différentes ⇒ <b>connexion</b> (L). On arrive à une clique, dont le nombre de sommets donne le nombre de couleurs. p arêtes possibles, 2 choix ⇒ <span class='mono'>2ᵖ</span>." },
    { id: "decision", q: "Problème de décision : définition et exemple ?", r: "Une question mathématique sur des paramètres, dont la réponse est <b>oui ou non</b>. Ex. : un graphe peut-il être colorié avec k couleurs ?" },
    { id: "optimisation", q: "Problème d'optimisation : définition ?", r: "Trouver la meilleure solution parmi les solutions réalisables, selon une <b>fonction objectif</b> (min ou max). Une solution optimale minimise (ou maximise) l'objectif parmi toutes les solutions réalisables." },
    { id: "preuve", q: "Pourquoi distinguer « solution optimale » et « preuve d'optimalité » ?", r: "Trouver l'optimum et prouver qu'il est optimal sont deux choses : l'une peut être rapide et l'autre lente." },
    { id: "suite-decisions", q: "Comment résoudre une optimisation par une suite de problèmes de décision ?", r: "On trouve une solution de coût k, puis on demande s'il existe une solution de coût &lt; k, et on recommence. La dernière recherche échoue : c'est la <b>preuve d'optimalité</b>." },
    { id: "approches", q: "Les deux familles d'approches du cours ?", r: "Les <b>heuristiques</b> (inexactes mais rapides) et l'<b>énumération complète</b> des combinaisons (exacte mais lente)." }
  ]
});
