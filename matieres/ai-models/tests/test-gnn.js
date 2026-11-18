/* Test : réseaux de neurones sur graphes. Graphes et nombres inventés pour le test. */
Tests.enregistrer({
  matiere: "ai-models", id: "test-gnn", titre: "Test : GNN",
  notions: {
    bases: { titre: "Graphes, tâches, permutations", lecon: "passage-messages" },
    messages: { titre: "Passage de messages", lecon: "passage-messages" },
    gcn: { titre: "Normalisation et couche GCN", lecon: "normalisation-gcn" },
    pratique: { titre: "Cora et pratique", lecon: "normalisation-gcn" }
  },
  questions: [
    { id: "q1", notion: "bases", enonce: "Graphe en étoile : nœud 1 relié à 2, 3, 4, 5 (aucune autre arête). d₁ = ?", options: ["1", "4", "10", "5"], bonnes: [1], explication: "Quatre voisins." },
    { id: "q2", notion: "bases", enonce: "Prédire la toxicité d'une molécule est une tâche au niveau…", options: ["de l'arête", "du nœud", "du graphe"], bonnes: [2], explication: "Une sortie par molécule." },
    { id: "q3", notion: "bases", enonce: "Quels agrégateurs sont invariants par permutation des voisins ? (plusieurs réponses)", options: ["max", "somme", "concaténation dans l'ordre des numéros", "moyenne"], bonnes: [0, 1, 3], explication: "La concaténation dépend de l'ordre." },
    { id: "q4", notion: "messages", enonce: "hᵢ = 2, voisins h = 1, 3 et 5 ; mᵢ = moyenne, h′ᵢ = 0,5 hᵢ + 0,5 mᵢ. h′ᵢ = ?", options: ["2,5", "3", "2", "4,5"], bonnes: [0], explication: "mᵢ = 3 ; 0,5·2 + 0,5·3." },
    { id: "q5", notion: "messages", enonce: "Après 3 couches de passage de messages, un nœud dépend des nœuds à au plus…", options: ["6 sauts", "1 saut", "3 sauts", "tout le graphe, toujours"], bonnes: [2], explication: "L couches = L sauts." },
    { id: "q6", notion: "messages", enonce: "Beaucoup de couches de moyenne rendent tous les nœuds semblables : c'est…", options: ["l'hétérophilie", "l'over-smoothing", "l'over-squashing"], bonnes: [1], explication: "Les distinctions sont lavées." },
    { id: "q7", notion: "gcn", enonce: "Pourquoi Ã = A + I ?", options: ["pour rendre A symétrique", "pour qu'un nœud garde sa propre information", "pour supprimer les arêtes"], bonnes: [1], explication: "Boucle sur chaque nœud." },
    { id: "q8", notion: "gcn", enonce: "d̃ᵢ = 4, d̃ⱼ = 9, arête (i, j). Â_ij = ?", options: ["1/6", "1/13", "1/36", "2/3"], bonnes: [0], explication: "1/√(4·9) = 1/6." },
    { id: "q9", notion: "gcn", enonce: "Dans H^(ℓ+1) = σ(ÂH^(ℓ)W^(ℓ)), le rôle de W est…", options: ["le mélange selon le graphe", "la normalisation par les degrés", "la transformation apprise des caractéristiques"], bonnes: [2], explication: "ÂH mélange, W transforme." },
    { id: "q10", notion: "gcn", enonce: "Quelle architecture apprend des poids d'attention sur les voisins ?", options: ["GIN", "GCN", "GAT", "GraphSAGE"], bonnes: [2], explication: "αᵢⱼ appris." },
    { id: "q11", notion: "gcn", enonce: "Voisinages {1, 1} et {1} : quel agrégateur les distingue ?", options: ["le max", "la moyenne", "la somme"], bonnes: [2], explication: "Somme 2 contre 1 ; moyenne et max : 1 et 1." },
    { id: "q12", notion: "pratique", enonce: "GCNConv(500 → 32) : nombre de paramètres (poids + biais) ?", options: ["15 532", "532", "16 000", "16 032"], bonnes: [3], explication: "500·32 + 32." },
    { id: "q13", notion: "pratique", enonce: "Sur Cora (transductif), la perte d'entraînement utilise…", options: ["celles du masque de test", "les étiquettes des 140 nœuds du masque d'entraînement", "les étiquettes de tous les nœuds"], bonnes: [1], explication: "Le graphe entier est vu, pas les autres étiquettes." },
    { id: "q14", notion: "pratique", enonce: "Pour la prédiction de liens, que faire des arêtes positives retenues pour le test ?", options: ["les doubler", "les garder, elles aident", "les retirer du graphe de passage de messages (selon le protocole)"], bonnes: [2], explication: "Sinon fuite." },
    { id: "q15", notion: "pratique", enonce: "Un GNN fait moins bien qu'un MLP. Pistes à vérifier (plusieurs réponses) :", options: ["rien : un GNN gagne toujours", "caractéristiques alignées avec les identifiants", "arêtes pertinentes et dans le bon sens", "trop de couches ou hétérophilie"], bonnes: [1, 2, 3], explication: "Exercice B du cours." }
  ]
});
