/* Paquet de cartes : écrire des propriétés (slides 16 à 18). */
Paquets.enregistrer({
  matiere: "model-checking", id: "proprietes", titre: "Propriétés",
  cartes: [
    { id: "produire", q: "La cellule peut-elle produire P ?", r: "<span class='mono'>EF P</span>" },
    { id: "pq-non-r", q: "Peut-elle produire P, Q et pas R ?", r: "<span class='mono'>EF(P ∧ Q ∧ ¬R)</span>" },
    { id: "toujours", q: "Peut-elle toujours produire P ?", r: "<span class='mono'>AGEF P</span>" },
    { id: "apres", q: "Atteindre s₂ après être passée par s₁ ?", r: "<span class='mono'>EF(s₁ ∧ EF s₂)</span> (≠ EF s₁ ∧ EF s₂, qui n'impose pas l'ordre)." },
    { id: "sans", q: "Synthétiser P sans utiliser Q ?", r: "<span class='mono'>E(¬Q U P)</span>" },
    { id: "stable", q: "L'état s est-il stable ?", r: "<span class='mono'>s ⇒ AG(s)</span> : quoi qu'il arrive, on reste en s." },
    { id: "steady", q: "L'état s est-il stationnaire (steady) ?", r: "<span class='mono'>s ⇒ EG(s)</span> : il existe un chemin où l'on reste en s." },
    { id: "oscillation", q: "P peut-il osciller de façon cyclique ?", r: "<span class='mono'>EG((P ⇒ EF¬P) ∧ (¬P ⇒ EF P))</span>" },
    { id: "oscillation-erreurs", q: "Deux erreurs fréquentes sur l'oscillation ?", r: "N'écrire qu'un seul des deux sens ; écrire P ⇒ EG¬P au lieu de P ⇒ EF¬P." },
    { id: "necessite", q: "A est-il nécessaire pour produire B ?", r: "<span class='mono'>¬E(¬A U B)</span> : aucun chemin ne produit B sans passer par A." },
    { id: "mapk", q: "Cascade MAPK : résultats du cours ?", r: "MEK~{p1} est nécessaire pour MAPK~{p1,p2} (vrai). Le complexe MEK~{p1}-MEKPH ne l'est pas (faux, avec un contre-exemple)." },
    { id: "mutex", q: "Exclusion mutuelle : la formule ?", r: "<span class='mono'>g ≡ ¬EF(CR₀ ∧ CR₁)</span> ≡ AG¬(CR₀ ∧ CR₁) ; vraie dans les 14 états." }
  ]
});
