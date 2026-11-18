/* Paquet de cartes : réseaux de neurones sur graphes (cours 6, fiche Cora, lab). */
Paquets.enregistrer({
  matiere: "ai-models", id: "gnn", titre: "GNN",
  cartes: [
    { id: "quand", q: "Quand un GNN est-il utile ?", r: "Quand les relations contiennent un signal auquel un modèle qui ne voit que les caractéristiques n'accède pas directement." },
    { id: "notation", q: "Notation d'un graphe pour un GNN ?", r: "G = (V, E), n nœuds, m arêtes ; X ∈ ℝ^(n×F) ; A_ij = 1 si (i, j) ∈ E ; degré dᵢ = Σⱼ A_ij ; caractéristiques d'arêtes eᵢⱼ." },
    { id: "taches", q: "Les trois niveaux de prédiction ?", r: "Nœud (classer un article), arête (prédire un lien), graphe (propriété d'une molécule)." },
    { id: "permutation", q: "Équivariance et invariance par permutation ?", r: "Nœuds : <span class='mono'>f(PAPᵀ, PX) = P f(A, X)</span> ; graphe : <span class='mono'>g(PAPᵀ, PX) = g(A, X)</span>. D'où somme / moyenne / max." },
    { id: "message", q: "Le modèle de passage de messages ?", r: "<span class='mono'>mᵢ = AGG_(j∈N(i)) φ(hᵢ, hⱼ, eᵢⱼ)</span>, <span class='mono'>h′ᵢ = ψ(hᵢ, mᵢ)</span> ; L couches = information jusqu'à L sauts." },
    { id: "gcn-norm", q: "Normalisation du GCN ?", r: "<span class='mono'>Ã = A + I</span>, <span class='mono'>Â = D̃^(−1/2) Ã D̃^(−1/2)</span>, <span class='mono'>Â_ij = Ã_ij/√(d̃ᵢd̃ⱼ)</span>." },
    { id: "gcn-couche", q: "Couche GCN ?", r: "<span class='mono'>H^(ℓ+1) = σ(Â H^(ℓ) W^(ℓ))</span> : ÂH mélange les voisins, W transforme, σ non-linéarité." },
    { id: "gat", q: "GAT ?", r: "Poids des voisins appris par attention : <span class='mono'>h′ᵢ = σ(Σ_(j∈N(i)∪{i}) αᵢⱼ W hⱼ)</span> (GCN : poids fixés par les degrés)." },
    { id: "sage", q: "GraphSAGE ?", r: "Échantillonne un voisinage borné et l'agrège (moyenne, pooling, LSTM) : passe à l'échelle, embeddings de nœuds nouveaux (inductif)." },
    { id: "gin", q: "GIN ?", r: "<span class='mono'>h_v = MLP((1 + ε) h_v + Σ_u h_u)</span> ; la somme garde la multiplicité ; aussi discriminant que le test 1-WL sous conditions." },
    { id: "readout", q: "Readout : somme, moyenne, max ?", r: "Somme : taille / multiplicité ; moyenne : normalise par le nombre de nœuds ; max : présence d'une caractéristique." },
    { id: "pathologies", q: "Over-smoothing, over-squashing, hétérophilie ?", r: "Représentations qui deviennent toutes semblables ; signaux lointains compressés par un goulot ; nœuds reliés de classes différentes (le lissage nuit)." },
    { id: "transductif", q: "Transductif ou inductif ?", r: "Transductif : graphe et caractéristiques des nœuds de test visibles, étiquettes de test cachées (Cora). Inductif / temporel : nœuds ou interactions futures retenus plus strictement." },
    { id: "cora", q: "Cora en chiffres ?", r: "2 708 articles, 1 433 mots binaires, 5 429 citations, 7 thèmes ; 140 / 500 / 1 000 nœuds pour train / validation / test." },
    { id: "cora-modele", q: "Le GCN de la fiche Cora ?", r: "GCNConv(1433 → 16), ReLU, dropout 0,5, GCNConv(16 → 7), log-softmax ; perte = cross-entropy masquée sur les 140 nœuds d'entraînement (le script utilise 64 neurones cachés)." },
    { id: "baseline", q: "Pourquoi comparer à un MLP ?", r: "Pour mesurer ce qu'apporte le graphe ; ne pas supposer que le GNN gagne : même découpage, réglage comparable, plusieurs graines." }
  ]
});
