/* Cartes : Algorithmes gloutons. */
Paquets.enregistrer({
  matiere: "problem-solving",
  id: "gloutons",
  titre: "Algorithmes gloutons",
  cartes: [
    { id: "def", q: "Algorithme glouton : définition ?", r: "À chaque étape, on fait le choix <b>localement optimal</b> (celui qui semble le meilleur sur le moment), sans revenir sur ses décisions, en espérant un résultat globalement optimal." },
    { id: "heuristique-gloutonne", q: "Quand parle-t-on d'heuristique gloutonne ? De stratégie gloutonne ?", r: "Heuristique gloutonne : quand l'algorithme ne donne pas toujours la solution optimale. Stratégie gloutonne : la règle utilisée pour faire le choix." },
    { id: "monnaie", q: "Rendre 37 centimes avec le moins de pièces (système européen) ?", r: "On prend à chaque fois la plus grande pièce qui ne dépasse pas le reste : 20 + 10 + 5 + 2. Dans le système européen, ce glouton est toujours optimal." },
    { id: "monnaie-contre", q: "Contre-exemple du rendu de monnaie glouton ?", r: "Système (1, 3, 4), rendre 6 : le glouton donne 4 + 1 + 1 (3 pièces), l'optimum est 3 + 3 (2 pièces)." },
    { id: "frac", q: "Sac à dos fractionnaire (poudres de métaux) : la stratégie ?", r: "Calculer la valeur par gramme (l'<b>efficacité</b>), prendre le sac le plus efficace autant que possible ; si le sac à dos est plein, s'arrêter, sinon tout prendre et recommencer. Cette stratégie est <b>optimale</b>." },
    { id: "frac-preuve", q: "Preuve d'optimalité du sac à dos fractionnaire ?", r: "Par l'absurde : si une solution optimale laisse 1 g d'un objet oᵢ mais prend 1 g d'un objet o<sub>k</sub> moins efficace, échanger ce gramme améliore la solution ⇒ contradiction." },
    { id: "01", q: "Sac à dos 0-1 : le modèle du cours ?", r: "xᵢ ∈ {0, 1} (l'objet i est pris ou non). Objectif : max Σ vᵢ xᵢ. Contrainte : Σ pᵢ xᵢ ≤ W. <i>(Poids noté pᵢ dans le cours Gloutons, wᵢ dans Recherche locale.)</i>" },
    { id: "01-glouton", q: "Sac à dos 0-1 : que fait-on « comme si » ? Est-ce optimal ?", r: "On trie par efficacité vᵢ/pᵢ et on prend les objets qui tiennent encore. Ce n'est plus optimal (le problème devient difficile) : c'est une heuristique." },
    { id: "01-exemple", q: "Exemple du cours (W = 15 ; o₁ 10/9 kg, o₂ 7/12, o₃ 1/2, o₄ 3/7, o₅ 2/5) : glouton par efficacité ? optimum ?", r: "Glouton : o₁ (9 kg) puis o₃ (11 kg) → valeur <b>11</b>. Optimum : o₁ + o₅ (14 kg) → <b>12</b>. <i>Calcul fait ici : les slides donnent les données sans la réponse.</i>" },
    { id: "heuristique", q: "Heuristique : définition du cours ?", r: "Un algorithme qui fournit <b>rapidement</b> (en temps polynomial) une solution <b>réalisable</b>, pas forcément optimale, pour un problème d'optimisation NP-difficile. Souvent conçue pour un problème précis, en exploitant sa structure." },
    { id: "evaluer", q: "Deux critères pour évaluer une heuristique ?", r: "<b>Empirique</b> : comparer ses solutions aux optimales (ou aux meilleures connues) sur un benchmark. <b>Mathématique</b> : prouver une garantie de performance (éventuellement probabiliste). Les deux peuvent se contredire." },
    { id: "activites-strat", q: "Sélection d'activités : les 3 stratégies et lesquelles échouent ?", r: "1. Début croissant : ✗ (un long événement qui commence tôt bloque tout). 2. Durée croissante : ✗ (un court événement à cheval sur deux longs). 3. <b>Fin croissante : optimale.</b>" },
    { id: "activites-preuve", q: "Preuve que « fin croissante » est optimale ?", r: "Soit f₁ l'événement qui finit le plus tôt et O = f<sub>i1</sub>, …, f<sub>ik</sub> une solution optimale. Si f<sub>i1</sub> ≠ f₁, on remplace f<sub>i1</sub> par f₁ : il finit plus tôt, donc ne chevauche pas f<sub>i2</sub>. Il existe donc une solution optimale contenant f₁ ; on recommence sur les événements compatibles avec f₁ (récurrence)." },
    { id: "plein", q: "Faire le plein (annales 2019) : quel glouton est optimal ?", r: "Rouler jusqu'à la <b>dernière station atteignable</b> avant la panne, s'y arrêter, recommencer. Solution si et seulement si chaque écart entre stations consécutives (départ et arrivée compris) est ≤ d. <i>Corrigé proposé (absent du cours), preuve par échange comme pour les activités.</i>" }
  ]
});
