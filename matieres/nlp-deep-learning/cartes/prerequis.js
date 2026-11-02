/* Paquet de cartes : Prérequis (hors diapos, sauf mention). Grossit avec les leçons du chapitre 0. */
Paquets.enregistrer({
  matiere: "nlp-deep-learning",
  id: "prerequis",
  titre: "Prérequis",
  cartes: [
    { id: "vecteur-def", q: "Qu'est-ce qu'un vecteur de dimension n ?", r: "Une liste ordonnée de n nombres (ses coordonnées). Ex. un avis décrit par (nombre de « great », nombre de « bad ») = (2 ; 1)." },
    { id: "vecteur-operations", q: "Comment calcule-t-on x + w et 2·x ?", r: "Coordonnée par coordonnée : x + w = (x₁ + w₁ ; …), 2·x = (2x₁ ; …). Multiplier par un nombre garde la direction (ou la retourne s'il est négatif)." },
    { id: "produit-scalaire-def", q: "Produit scalaire x · w : formule et nature du résultat ?", r: "<code>x · w = Σᵢ xᵢwᵢ</code> : seulement des additions et des multiplications ; le résultat est <b>un seul nombre réel</b> (cours 1)." },
    { id: "produit-scalaire-calcul", q: "x = (2 ; 1 ; 1), w = (1 ; −1 ; 0,5). x · w = ?", r: "2 − 1 + 0,5 = <code>1,5</code>." },
    { id: "produit-scalaire-signe", q: "Que vaut x · w si x et w sont perpendiculaires ? Et si l'angle est aigu ? obtus ?", r: "Perpendiculaires (orthogonaux) → 0 (cours 1). Angle aigu → positif ; obtus → négatif." },
    { id: "norme-def", q: "Norme euclidienne ‖x‖ : définition ? ‖(2 ; 1)‖ ?", r: "<code>‖x‖ = √(x · x) = √(Σ xᵢ²)</code> (longueur, Pythagore). ‖(2 ; 1)‖ = √5 ≈ 2,24." },
    { id: "cosinus-def", q: "Similarité cosinus : formule et intervalle ?", r: "<code>cos(x, y) = x · y / (‖x‖ ‖y‖)</code>, entre −1 et 1 ; en texte (coordonnées positives) entre 0 et 1 (cours 2)." },
    { id: "cosinus-longueur", q: "A = [1, 1, 0], B = [2, 2, 0]. cos(A, B) ? Pourquoi est-ce utile en texte ?", r: "1 : même direction. Le cosinus ignore la longueur : un document plus long mais de même contenu relatif reste similaire (cours 2)." },
    { id: "neurone-t", q: "Que calcule un neurone avant sa fonction d'activation ?", r: "<code>t = Σᵢ xᵢwᵢ + b = x · w + b</code> (poids w, biais b), puis <code>ŷ = σ(t)</code> (cours 1, diapo 28)." }
  ]
});
