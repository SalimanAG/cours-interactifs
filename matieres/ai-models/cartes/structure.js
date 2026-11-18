/* Paquet de cartes : conjugaison topologique et théorèmes de structure (notes 4 et 2). */
Paquets.enregistrer({
  matiere: "ai-models", id: "structure", titre: "Théorèmes de structure",
  cartes: [
    { id: "conjugaison", q: "⟨X, f⟩ topologiquement conjugué à ⟨Y, g⟩ ?", r: "Il existe un homéomorphisme φ : X → Y tel que <span class='mono'>φ ∘ f = g ∘ φ</span> (le diagramme commute)." },
    { id: "homeomorphisme", q: "Homéomorphisme ?", r: "Fonction bijective, continue, dont l'inverse est continue." },
    { id: "sens-conjugaison", q: "Que garantit la conjugaison topologique ?", r: "C'est une équivalence entre systèmes : les deux ont le même comportement." },
    { id: "bool-bip", q: "Booléen ⟨n, {0,1}, W, θ⟩ → bipolaire : W̃, θ̃, φ ?", r: "<span class='mono'>W̃ = ½W</span>, <span class='mono'>θ̃ = θ − ½W·(1,…,1)ᵀ</span>, <span class='mono'>φ(x) = 2x − (1,…,1)</span>." },
    { id: "bip-bool", q: "Bipolaire ⟨n, {−1,+1}, W, θ⟩ → booléen : W̃, θ̃, φ ?", r: "<span class='mono'>W̃ = 2W</span>, <span class='mono'>θ̃ = θ + W·(1,…,1)ᵀ</span>, <span class='mono'>φ(x) = ½(x + (1,…,1))</span>." },
    { id: "cle-preuve-bb", q: "Quelle relation fait marcher la preuve booléen → bipolaire ?", r: "<span class='mono'>SG = 2H − 1</span> : φ(H(z)) = 2H(z) − 1 = SG(z)." },
    { id: "strict-sep", q: "Réseau strictement séparateur ?", r: "Pour tout processeur i et tout état y : <span class='mono'>⟨Wⁱ|y⟩ − θᵢ ≠ 0</span>." },
    { id: "rendre-strict", q: "Comment rendre un réseau strictement séparateur ?", r: "K₀ = états où ⟨Wⁱ|y⟩ = θᵢ ; si K₀ ≠ ∅, kⁱ = min |⟨Wⁱ|y⟩ − θᵢ| hors de K₀ (> 0), on choisit 0 < γᵢ < kⁱ et le seuil devient θᵢ − γᵢ. Conjugué via l'identité." },
    { id: "exemple-strict", q: "Exemple des notes : W = (1, 1), θ = 0 en bipolaire ?", r: "Somme nulle pour (−1, 1) et (1, −1) ; k = 2, γ = 1 ⇒ seuil θ − γ = −1 (les notes écrivent (1) : c'est −1)." },
    { id: "q-vers-z", q: "Théorème ℚ → ℤ : idée ?", r: "d = ppcm des dénominateurs (> 0), <span class='mono'>Ŵ = dW, θ̂ = dθ</span> entiers ; SG(Wx − θ) = SG(d(Wx − θ))." },
    { id: "r-vers-q", q: "Théorème ℝ → ℚ : hypothèse et δ ?", r: "Réseau strictement séparateur ; <span class='mono'>δ = min |⟨Wᴶ,x⟩ − θ_J| > 0</span> (états en nombre fini)." },
    { id: "r-vers-q-approx", q: "ℝ → ℚ : à quelle précision approcher poids et seuils, et pourquoi ?", r: "À moins de <span class='mono'>δ/(n+1)</span> : n poids + 1 seuil, l'écart total reste < δ, donc le signe est conservé." },
    { id: "chaine", q: "Que montrent ensemble les deux théorèmes de la note 2 ?", r: "Tout réseau booléen à seuil à poids réels est conjugué (via l'identité) à un réseau à poids et seuils entiers." }
  ]
});
