/* Paquet de cartes : introduction et structures de Kripke (slides 3 à 9). */
Paquets.enregistrer({
  matiere: "model-checking", id: "kripke", titre: "Introduction et Kripke",
  cartes: [
    { id: "but", q: "À quoi sert le model checking ?", r: "Vérifier automatiquement des systèmes matériels et logiciels où une panne est inacceptable (introduit au début des années 80 par Clarke, Emerson, Queille et Sifakis)." },
    { id: "autres-techniques", q: "Autres techniques de validation citées ?", r: "La simulation et le test ; la vérification déductive." },
    { id: "avantages", q: "Les deux avantages du model checking ?", r: "Technique complètement automatique ; si le système ne satisfait pas la formule, un contre-exemple est donné." },
    { id: "inconvenient", q: "L'inconvénient du model checking, et les deux réponses citées ?", r: "L'explosion du nombre d'états ⇒ model checking symbolique, model checking à la volée (on-the-fly)." },
    { id: "trois-ingredients", q: "Les trois ingrédients du model checking ?", r: "Un système (structure de Kripke M), une spécification (formule de logique temporelle φ), un algorithme : M, φ ⇒ M ⊨ φ ?" },
    { id: "decidable", q: "Le model checking est-il décidable ?", r: "Oui : pour la classe de systèmes et la logique temporelle définies par Clarke, Emerson, Queille et Sifakis." },
    { id: "kripke-def", q: "Structure de Kripke sur AP ?", r: "M = (S, S₀, R, L) : S ensemble fini d'états, S₀ ⊆ S états initiaux, R ⊆ S × S relation de transition <b>totale</b>, L : S → 2<sup>AP</sup> (propositions vraies dans chaque état)." },
    { id: "totale", q: "R totale : que veut dire « totale » ?", r: "Pour chaque état s, il existe s′ tel que R(s, s′) : chaque état a au moins un successeur." },
    { id: "chemin", q: "Chemin de M partant de s ?", r: "Une suite <b>infinie</b> π = s₀ s₁ s₂ … avec s₀ = s et R(sᵢ, sᵢ₊₁) pour tout i ≥ 0." },
    { id: "suffixe", q: "Que note πⁱ ?", r: "Le suffixe de π qui commence à sᵢ (positions numérotées à partir de 0)." },
    { id: "biocham", q: "Biocham : de quoi est-il fait ?", r: "Un langage de règles pour modéliser des systèmes biochimiques, un simulateur, un langage de requêtes en logique temporelle, une interface avec le model checker NuSMV." },
    { id: "biocham-kripke", q: "Structure de Kripke d'un modèle Biocham booléen ?", r: "États : tuples de booléens (présence/absence de chaque objet) ; état initial : celui du modèle ; transitions : union des relations des règles ; L(s) : objets présents dans s." }
  ]
});
