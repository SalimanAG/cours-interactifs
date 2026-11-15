/* Paquet de cartes : contraintes d'équité (cours oral du 3 novembre, absent des slides). */
Paquets.enregistrer({
  matiere: "model-checking", id: "equite", titre: "Équité",
  cartes: [
    { id: "pourquoi", q: "À quoi sert une contrainte d'équité ?", r: "À ignorer les chemins irréalistes (ex. ouvrir et fermer la porte du four à l'infini) : seuls les chemins équitables comptent." },
    { id: "kripke-equitable", q: "Structure de Kripke équitable ?", r: "M = (S, S₀, R, L, F), où F ⊆ 2<sup>S</sup> : F = {P₁, …, Pₖ}, chaque Pᵢ est un ensemble d'états." },
    { id: "inf", q: "inf(π) ?", r: "L'ensemble des états visités une infinité de fois par π." },
    { id: "chemin-equitable", q: "π est équitable ⟺ ?", r: "Pour chaque P ∈ F : inf(π) ∩ P ≠ ∅ (π repasse à l'infini par au moins un état de chaque Pᵢ)." },
    { id: "regles", q: "Quelles règles de la sémantique changent avec ⊨_F ?", r: "Trois : p (il faut aussi un chemin équitable depuis s), E g₁ (un chemin équitable), A g₁ (tous les chemins équitables)." },
    { id: "fair", q: "La proposition fair ?", r: "Vraie dans s ssi un chemin équitable part de s : fair ≡ EG true (calculé avec la procédure équitable)." },
    { id: "scc-equitable", q: "SCC équitable ?", r: "Une SCC C telle que pour chaque Pᵢ ∈ F, C contient un état de Pᵢ." },
    { id: "eg-equitable", q: "Labelling de EG g₁ avec équité ?", r: "Restreindre à S(g₁) ; garder les SCC non triviales ET équitables ; ajouter les états de S(g₁) qui les atteignent." },
    { id: "autres-cas", q: "p, EX, EU avec équité ?", r: "p ∧ fair ; EX(f₁ ∧ fair) ; E(f₁ U (f₂ ∧ fair)). fair va à l'intérieur, pas à côté." },
    { id: "complexite", q: "Complexité du labelling équitable ?", r: "O(|f| · (|S| + |R|) · |F|) : linéaire en pratique." },
    { id: "four", q: "Four avec F = {{6, 7}} : AG(Start → AF Heat) ?", r: "Vraie dans tous les états : la SCC {1, 2, 3, 5} ne touche pas {6, 7}, donc S_F(EG¬Heat) = ∅." },
    { id: "eq-exemple", q: "Système s0 ⇄ s1 ⇄ s2, F = {{s0}, {s2}} : S_F(EG q) avec S(q) = {s0, s1} ?", r: "∅ : la SCC {s0, s1} contient s0 mais pas s2 (NOT FAIR)." }
  ]
});
