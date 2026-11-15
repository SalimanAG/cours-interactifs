/* Paquet de cartes : CTL*, CTL et LTL (slides 10 à 14). */
Paquets.enregistrer({
  matiere: "model-checking", id: "logiques", titre: "Logiques temporelles",
  cartes: [
    { id: "quantif-chemin", q: "Quantificateurs de chemin ?", r: "A (pour tous les chemins) et E (il existe un chemin)." },
    { id: "operateurs", q: "X, F, G, U ?", r: "X : état suivant (next) ; F : un jour (in the future) ; G : toujours (globally) ; U : jusqu'à (until)." },
    { id: "etat-chemin", q: "Formule d'état / formule de chemin ?", r: "Une formule d'état est vraie dans un état (p, ¬f, f ∨ g, A g, E g) ; une formule de chemin est vraie sur un chemin (X, F, G, U…). Une formule d'état est aussi une formule de chemin." },
    { id: "sem-X", q: "M, π ⊨ X g ⟺ ?", r: "M, π¹ ⊨ g." },
    { id: "sem-F", q: "M, π ⊨ F g ⟺ ?", r: "Il existe k ≥ 0 tel que M, πᵏ ⊨ g (k = 0 compris)." },
    { id: "sem-G", q: "M, π ⊨ G g ⟺ ?", r: "Pour chaque i ≥ 0, M, πⁱ ⊨ g." },
    { id: "sem-U", q: "M, π ⊨ g₁ U g₂ ⟺ ?", r: "Il existe k ≥ 0 tel que M, πᵏ ⊨ g₂ et pour chaque 0 ≤ j < k, M, πʲ ⊨ g₁. (g₂ doit arriver.)" },
    { id: "sem-E", q: "M, s ⊨ E g ⟺ ?", r: "Il existe un chemin π partant de s tel que M, π ⊨ g." },
    { id: "sem-A", q: "M, s ⊨ A g ⟺ ?", r: "Pour chaque chemin π partant de s, M, π ⊨ g." },
    { id: "sem-etat-chemin", q: "M, π ⊨ f (f formule d'état) ⟺ ?", r: "s est le premier état de π et M, s ⊨ f." },
    { id: "ltl", q: "LTL ?", r: "Décrit ce qui se passe le long d'un seul chemin : formules de la forme A f, où f ne contient aucun quantificateur de chemin. Ex. AFG p." },
    { id: "ctl", q: "CTL ?", r: "Chaque opérateur temporel (X, F, G, U) est immédiatement précédé d'un quantificateur de chemin (A, E). Ex. AGEF p, E(p U q)." },
    { id: "GF-FG", q: "G F p et F G p ?", r: "G F p : p infiniment souvent. F G p : un jour, p pour toujours." },
    { id: "dualite-GF", q: "G g en fonction de F ?", r: "G g ≡ ¬F¬g (et F g ≡ ¬G¬g)." },
    { id: "negations-AE", q: "¬AG f, ¬AX f, ¬AF f ?", r: "EF¬f, EX¬f, EG¬f." },
    { id: "EF-AF", q: "S(EF ¬q) et S(AF ¬q) sur le système s0, s1, s2 ?", r: "EF ¬q : {s0, s2} (on peut atteindre s0). AF ¬q : {s0} (depuis s2, le chemin s2 s1 s1 … ne rencontre jamais ¬q)." }
  ]
});
