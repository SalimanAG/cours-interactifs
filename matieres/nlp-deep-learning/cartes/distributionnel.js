/* Paquet de cartes : Sémantique distributionnelle et SVD (cours 2, diapos 28 à 41 ; TP 3). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning", id: "distributionnel", titre: "Sémantique distributionnelle et SVD",
  cartes: [
    { id: "hypothese", q: "Hypothèse distributionnelle ?", r: "Des mots qui apparaissent dans des contextes semblables ont des sens semblables." },
    { id: "ordre-1-2", q: "Co-occurrence directe vs indirecte ?", r: "Directe (1er ordre) : apparaissent ensemble (cat ↔ eats). Indirecte (2e ordre) : partagent les mêmes voisins (cat ↔ dog)." },
    { id: "doc-vs-fenetre", q: "Contexte = document ou fenêtre ?", r: "Terme–document : similarité thématique (LSA). Mot–contexte (fenêtre ±k) : similarité lexicale (Word2Vec, GloVe)." },
    { id: "taille-fenetre", q: "Effet de la taille de fenêtre ?", r: "Petite : similarité fonctionnelle / syntaxique (eats → walks, runs). Grande : thématique (eats → food, meal)." },
    { id: "fenetre-options", q: "Fenêtre symétrique et pondération par la distance ?", r: "Symétrique : autant de voisins à gauche et à droite. Pondérée : les voisins proches comptent plus (ex. distance 1 → 1, 2 → 0,5)." },
    { id: "cooc-lecture", q: "Comment juger la proximité de deux mots dans une matrice de co-occurrence ?", r: "En comparant leurs lignes (vecteurs de contextes), par exemple par cosinus." },
    { id: "pmi", q: "Formule de la PMI ?", r: "<code>PMI(w, c) = log( P(w, c) / (P(w) P(c)) )</code> : observé / attendu sous indépendance." },
    { id: "ppmi", q: "PPMI ?", r: "<code>max(PMI, 0)</code> : garde les associations positives ; les paires jamais vues ou moins fréquentes que le hasard → 0." },
    { id: "pmi-signe", q: "PMI > 0, = 0, < 0 ?", r: "Plus souvent que le hasard ; comme sous indépendance ; moins souvent." },
    { id: "pmi-rares", q: "Pourquoi se méfier des paires rares en PMI ?", r: "De petits comptes donnent des PMI très élevées et instables : seuils de fréquence ou lissage." },
    { id: "svd", q: "SVD d'une matrice X (m × n) ?", r: "<code>X = U Σ Vᵀ</code> : U directions des lignes, Σ valeurs singulières (forces), Vᵀ directions des colonnes." },
    { id: "svd-tronquee", q: "SVD tronquée et intérêt ?", r: "<code>X ≈ Uₖ Σₖ Vₖᵀ</code>, k ≪ min(m, n) : vecteurs denses compacts, filtre le bruit, garde la structure principale. k se choisit sur la performance en aval." },
    { id: "lsa", q: "LSA ?", r: "SVD de la matrice terme–document : dimensions latentes (thèmes) qui rapprochent des documents sans mot commun, au prix de l'interprétabilité." },
    { id: "pca-svd", q: "PCA vs TruncatedSVD (TP 3) ?", r: "Deux projections linéaires ; PCA centre les vecteurs autour de la moyenne, TruncatedSVD non (adapté aux matrices creuses)." }
  ]
});
