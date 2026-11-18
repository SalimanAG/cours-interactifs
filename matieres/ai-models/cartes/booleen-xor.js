/* Paquet de cartes : fonctions booléennes et problème du XOR (notes 5 et NN-xor-problem). */
Paquets.enregistrer({
  matiere: "ai-models", id: "booleen-xor", titre: "Fonctions booléennes et XOR",
  cartes: [
    { id: "and", q: "Un neurone pour AND ?", r: "<span class='mono'>⟨1, {0,1}, [1 1], 2⟩</span> : y = H(x₁ + x₂ − 2), 1 seulement pour (1, 1)." },
    { id: "or", q: "Un neurone pour OR ?", r: "Poids [1 1], seuil θ = 1 : y = H(x₁ + x₂ − 1) (les notes écrivent −1 / 0, mais calculent avec θ = 1)." },
    { id: "not", q: "Un neurone pour NOT ?", r: "Poids −1, seuil 0 : f(0) = H(0) = 1, f(1) = H(−1) = 0." },
    { id: "theoreme-booleen", q: "Théorème des notes sur les fonctions booléennes, et sa preuve ?", r: "Toute fonction booléenne est simulable par un réseau linéaire à seuil : {AND, OR, NOT} est une base complète et chaque porte est un neurone." },
    { id: "ordinateur", q: "Conclusion « spectaculaire » des notes ?", r: "On pourrait simuler n'importe quel ordinateur avec des réseaux linéaires à seuil." },
    { id: "seize", q: "Combien de fonctions booléennes à 2 entrées ?", r: "<span class='mono'>2^(2²) = 16</span> (une sortie 0/1 pour chacun des 4 états)." },
    { id: "appris", q: "« A a appris B (parfaitement) » ?", r: "Pour tout x₁, …, xₙ : <span class='mono'>A(x₁, …, xₙ) = B(x₁, …, xₙ)</span>." },
    { id: "droite", q: "Que représente w¹x¹ + w²x² − θ = 0 pour le réseau (N) ?", r: "Une droite du plan : d'un côté g = 1 (et sur la droite), de l'autre g = 0." },
    { id: "cote-w2", q: "w² > 0 : quel côté de la droite donne 1 ? Et w² < 0 ?", r: "w² > 0 : au-dessus ; w² < 0 : au-dessous. Si w² = 0, la droite est verticale x¹ = θ/w¹." },
    { id: "xor-impossible", q: "Pourquoi un seul neurone ne peut pas apprendre XOR ?", r: "Il faudrait une droite avec (0,1), (1,0) d'un côté et (0,0), (1,1) de l'autre : les deux diagonales du carré se croisent, toute affectation de w¹, w² donne des sorties contradictoires." },
    { id: "xor-algebre", q: "Preuve algébrique du XOR (complément) ?", r: "0 < θ, w¹ ≥ θ, w² ≥ θ ⇒ w¹ + w² ≥ 2θ > θ, contredit w¹ + w² < θ exigé par (1,1)." },
    { id: "quatorze", q: "Combien des 16 fonctions un neurone calcule-t-il ? Lesquelles manquent ?", r: "14 (linéairement séparables) ; manquent XOR (0110) et XNOR (1001). Complément, pas dans les notes." },
    { id: "xor-couches", q: "Comment réaliser XOR avec des neurones à seuil ?", r: "Une couche cachée : h₁ = OR, h₂ = NAND, puis y = AND(h₁, h₂)." }
  ]
});
