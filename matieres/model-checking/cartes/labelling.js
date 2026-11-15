/* Paquet de cartes : l'algorithme de labelling CTL (slides 19 à 22, exemples du four). */
Paquets.enregistrer({
  matiere: "model-checking", id: "labelling", titre: "Labelling CTL",
  cartes: [
    { id: "probleme", q: "Problème du model checking (et version générale) ?", r: "Étant donnés M, un état s et une formule f : M, s ⊨ f ? Version générale : trouver {s ∈ S | M, s ⊨ f}." },
    { id: "complexite", q: "Complexité : CTL ? LTL ?", r: "CTL : linéaire en le nombre d'états et d'arcs, O((|S| + |R|) · |f|). LTL : PSPACE-complet." },
    { id: "base", q: "Avec quels opérateurs s'écrit toute formule CTL ?", r: "¬, ∨, EX, EU, EG (∧ s'en déduit)." },
    { id: "principe", q: "Principe de l'algorithme ?", r: "Étiqueter avec fᵢ tous les états qui satisfont fᵢ, des sous-formules les plus petites à la formule entière (à l'étape i : i − 1 opérateurs imbriqués)." },
    { id: "EF", q: "EF f dans la base ?", r: "E(true U f)." },
    { id: "AX", q: "AX f dans la base ?", r: "¬EX¬f." },
    { id: "AG", q: "AG f dans la base ?", r: "¬EF¬f ≡ ¬E(true U ¬f)." },
    { id: "AF", q: "AF f dans la base ?", r: "¬EG¬f." },
    { id: "neg-imp", q: "¬(a → b) ?", r: "a ∧ ¬b." },
    { id: "cas-EX", q: "Labelling de EX g ?", r: "Construire R⁻¹ ; étiqueter les prédécesseurs des états étiquetés g. O(|S| + |R|)." },
    { id: "cas-EU", q: "Labelling de E(g₁ U g₂) ?", r: "Étiqueter S(g₂) ; puis, en remontant R⁻¹, ajouter tout état de S(g₁) qui a un successeur déjà étiqueté, jusqu'à stabilité. O(|S| + |R|)." },
    { id: "cas-EG", q: "Labelling de EG g ?", r: "Restreindre à (S_g, R_g) ; calculer les SCC non triviales ; étiqueter leurs états et ceux de S_g qui les atteignent. O(|S| + |R|)." },
    { id: "scc-non-triviale", q: "SCC non triviale ?", r: "Plus d'un nœud, ou un seul nœud avec une boucle sur lui-même." },
    { id: "pourquoi-scc", q: "Pourquoi des SCC pour EG ?", r: "Un chemin infini dans un graphe fini finit par boucler : il reste dans une SCC qui contient un cycle." },
    { id: "four-formule", q: "Four : g ≡ AG(Start → AF Heat) dans la base ?", r: "¬E(true U (Start ∧ EG¬Heat))." },
    { id: "four-EG", q: "Four : S(EG¬Heat) ?", r: "{1, 2, 3, 5} (cycle 1 → 2 → 5 → 3 → 1 ; 6 est une SCC triviale qui n'atteint rien)." },
    { id: "four-resultat", q: "Four : la propriété est-elle vraie ?", r: "Non : S(g) = ∅. Contre-exemple : 1 → 2 → 5 → 2 → 5 … (Start vrai, Heat jamais)." },
    { id: "true-U-false", q: "S(E(true U false)) ?", r: "∅ : f₁ U f₂ exige que f₂ arrive, et false n'est jamais vraie." }
  ]
});
