/* Paquet de cartes : neurone de McCulloch-Pitts et réseaux à seuil (notes 3 et 1). */
Paquets.enregistrer({
  matiere: "ai-models", id: "neurone-seuil", titre: "Neurone et réseaux à seuil",
  cartes: [
    { id: "dendrites-axone", q: "Dendrites et axone : quelle information, quels conducteurs ?", r: "Dendrites : information locale, mauvais conducteur électrique. Axone : information à longue distance, très bon conducteur (signaux ≈ 120 m/s)." },
    { id: "hypothese-mp", q: "L'hypothèse du modèle de McCulloch-Pitts ?", r: "Le fonctionnement du cerveau consiste intégralement en le passage / échange de signaux électriques dans certaines cellules, les neurones." },
    { id: "consequences-mp", q: "Les deux conséquences de cette hypothèse ?", r: "On ignore complètement le rôle des cellules gliales ; le comportement des neurones est constant et dépend exclusivement de leur état électrique et de leurs connexions." },
    { id: "seuil-critique", q: "Période de sommation latente et seuil critique ?", r: "Si assez de signaux s'accumulent pendant un court laps de temps (période de sommation latente), une décharge part le long de l'axone ; la quantité nécessaire est le seuil critique." },
    { id: "refractaire", q: "Période réfractaire, et quel rôle dans le modèle ?", r: "Après la décharge, le neurone ne réagit plus à aucune impulsion pendant cette période. Elle sert d'unité de temps." },
    { id: "poids-signe", q: "Comment le modèle représente-t-il une impulsion déclencheuse ou inhibitrice ?", r: "Par un poids positif (déclencheur) ou négatif (inhibiteur) au niveau des synapses." },
    { id: "formule-mp", q: "Formule du neurone de McCulloch-Pitts ?", r: "<span class='mono'>yᵗ⁺¹ = 1 si Σᵢ wᵢxᵢᵗ ≥ θ, 0 sinon</span> (l'égalité fait décharger)." },
    { id: "reseau-tuple", q: "Un réseau à seuil, formellement ?", r: "<span class='mono'>⟨n, ℝ, W, θ⟩</span> : n processeurs, ensemble des états, W ∈ ℝ<sup>n×n</sup> matrice des connexions, θ ∈ ℝⁿ vecteur des seuils (bias)." },
    { id: "w-i-J", q: "Que désigne w<sub>i</sub><sup>J</sup> (notes 1) ?", r: "Le poids de la connexion du processeur i vers le processeur J : ligne J, colonne i de W." },
    { id: "mise-a-jour", q: "Fonction de mise à jour d'un réseau à seuil ?", r: "<span class='mono'>f(x) = Wx − θ</span>, soit <span class='mono'>f_J(x) = ⟨W^J|x⟩ − θ_J</span>." },
    { id: "pourquoi-renorm", q: "Pourquoi une fonction de renormalisation ?", r: "Si x ∈ Sⁿ on veut f(x) ∈ Sⁿ (Sⁿ ⊂ ℝⁿ restreint) ; or Wx − θ sort en général de Sⁿ (ex. (7/6, −3, 21/5) pour un état de {−1,1}³)." },
    { id: "quatre-fonctions", q: "Fonction de renormalisation pour [0,1], [−1,1], {0,1}, {−1,+1} ?", r: "S(x) = 1/(1+e⁻ˣ) ; S̲(x) = (1−e⁻ˣ)/(1+e⁻ˣ) ; H(x) = 1 si x ≥ 0, 0 sinon ; SG(x) = +1 si x ≥ 0, −1 sinon." },
    { id: "relations", q: "Relations entre S et S̲, H et SG ?", r: "<span class='mono'>S̲ = 2S − 1</span> et <span class='mono'>SG = 2H − 1</span> ; inverses : S = (S̲ + 1)/2, H = (SG + 1)/2." },
    { id: "valeurs-zero", q: "S(0), S̲(0), H(0), SG(0) ?", r: "1/2, 0, 1, +1." }
  ]
});
