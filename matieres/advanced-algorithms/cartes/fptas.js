/* Paquet de cartes : schéma d'approximation pour le sac à dos (cours 5). */
Paquets.enregistrer({
  matiere: "advanced-algorithms",
  id: "fptas",
  titre: "Schéma d'approximation",
  cartes: [
    { id: "sad-def", q: "Problème du sac à dos : entrée, sortie, difficulté ?", r: "Entrée : W et n objets (valeur vᵢ, poids wᵢ). Sortie : S ⊆ ⟦1, n⟧ avec Σ_S wᵢ ≤ W et Σ_S vᵢ maximum. NP-complet." },
    { id: "schema-def", q: "Qu'est-ce qu'un schéma polynomial d'approximation ?", r: "Une famille d'algorithmes A_ε, polynomiaux, donnant une approximation de ratio 1 + ε pour n'importe quel ε > 0 (aussi bonne qu'on veut)." },
    { id: "exact-entier", q: "Complexité de l'algo exact pour le sac à dos à valeurs entières ?", r: "<code>O(n² v*)</code> avec v* = max vᵢ (programmation dynamique sur OPT(i, V))." },
    { id: "pas-poly", q: "Pourquoi O(n² v*) n'est-il pas polynomial ?", r: "La taille de la donnée est O(n log v*) ; v* = exp(log v*) est exponentiel en la taille (pseudo-polynomial)." },
    { id: "trois-buts", q: "Les trois buts de la modification des valeurs ?", r: "1) valeurs entières (pour l'algo exact) ; 2) v̂* = O(n) (temps polynomial) ; 3) l'optimum modifié est une approximation à 1 + ε de l'optimum initial." },
    { id: "pretraitement", q: "Premier prétraitement de l'algo d'approximation ?", r: "Retirer les objets tels que wᵢ > W : ils ne peuvent être dans aucune solution." },
    { id: "facteur-b", q: "Facteur d'échelle b ?", r: "<code>b = (ε / 2n) · v*</code>, avec 1/ε entier (et ε ≤ 1)." },
    { id: "arrondi", q: "Valeurs arrondies ṽᵢ et v̂ᵢ ?", r: "<code>ṽᵢ = ⌈vᵢ / b⌉ · b</code> et <code>v̂ᵢ = ⌈vᵢ / b⌉</code> (entier). On résout exactement sur (v̂ᵢ, wᵢ) et on retourne S." },
    { id: "vchapeau-max", q: "Que vaut v̂* et pourquoi ?", r: "Pour j tel que vⱼ = v* : v̂* = ⌈v*/b⌉ = 2n/ε. Il ne dépend plus des valeurs." },
    { id: "complexite", q: "Complexité totale de l'algo d'approximation ?", r: "O(n² v̂*) = <code>O(n³ / ε)</code>, soit O(n³) pour ε fixé." },
    { id: "encadrement", q: "Encadrement de ṽᵢ utilisé dans la preuve ?", r: "vᵢ ≤ ṽᵢ ≤ vᵢ + b : l'arrondi coûte au plus b par objet, donc au plus nb sur un ensemble." },
    { id: "preuve-chaine", q: "Chaîne d'inégalités de la preuve du ratio ?", r: "Σ_{S*} vᵢ ≤ Σ_{S*} ṽᵢ ≤ Σ_S ṽᵢ ≤ nb + Σ_S vᵢ (S optimal pour les ṽᵢ)." },
    { id: "preuve-nb", q: "Comment borne-t-on nb dans la preuve ?", r: "Comme wⱼ ≤ W, Σ_S ṽᵢ ≥ ṽⱼ = (2/ε) nb, donc Σ_S vᵢ ≥ (2/ε − 1) nb ≥ nb/ε pour ε ≤ 1, d'où nb ≤ ε Σ_S vᵢ." },
    { id: "ratio", q: "Ratio garanti par l'algo ?", r: "Σ_{S*} vᵢ ≤ (1 + ε) Σ_S vᵢ." },
    { id: "idee-geniale", q: "Pourquoi ne peut-on pas prendre ε assez petit pour avoir la solution exacte en temps polynomial ?", r: "Il faudrait que 1/ε croisse exponentiellement avec la taille de l'instance : O(n³/ε) ne serait plus polynomial." }
  ]
});
