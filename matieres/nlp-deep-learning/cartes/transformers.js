/* Paquet de cartes : Transformers et auto-attention (cours 4). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning", id: "transformers", titre: "Transformers et auto-attention",
  cartes: [
    { id: "self-vs-cross", q: "Self-attention vs cross-attention ?", r: "Self : requêtes, clés, valeurs viennent de la même séquence. Cross : requêtes du décodeur, clés et valeurs de l'encodeur." },
    { id: "qkv-roles", q: "Rôles de la requête, de la clé, de la valeur ?", r: "Query : ce que le token cherche. Key : ce que chaque token offre. Value : le contenu transmis. Poids : la pertinence de chaque token." },
    { id: "qkv-calcul", q: "Comment obtient-on qᵢ, kᵢ, vᵢ ?", r: "<code>qᵢ = Qxᵢ, kᵢ = Kxᵢ, vᵢ = Vxᵢ</code>, avec Q, K, V matrices apprises (d × d)." },
    { id: "trois-etapes", q: "Les trois étapes de l'auto-attention pour le token i ?", r: "<code>eᵢⱼ = qᵢᵀkⱼ</code> ; <code>αᵢⱼ = softmax(eᵢⱼ)</code> ; <code>oᵢ = Σⱼ αᵢⱼ vⱼ</code>." },
    { id: "matriciel", q: "Formule matricielle de l'attention ?", r: "<code>Y = softmax(QKᵀ/√dₖ) V</code>, avec Q = XW_q, K = XW_k, V = XW_v ; QKᵀ de forme (n, n)." },
    { id: "racine-dk", q: "Pourquoi diviser par √dₖ ?", r: "Les produits scalaires grandissent avec dₖ ; sans division, la softmax devient très piquée. (Le cours donne la formule, la justification est un complément.)" },
    { id: "sans-poids", q: "Pourquoi pas Y = softmax(XXᵀ)X ?", r: "Il n'y aurait aucun paramètre à apprendre (diapo 18)." },
    { id: "multi-head", q: "Multi-head attention ?", r: "h têtes en parallèle, chacune avec ses W_q, W_k, W_v ; <code>Y = Concat[Y¹…Yʰ]Wᴼ</code>, en général dᵥ = d/h (512/8 = 64)." },
    { id: "pourquoi-tetes", q: "Pourquoi plusieurs têtes ?", r: "Plusieurs types de dépendances (genre, temps, contexte ; entités, syntaxe) : chaque tête peut en apprendre un." },
    { id: "permutation", q: "Pourquoi un encodage positionnel ?", r: "L'auto-attention seule ignore l'ordre ; or « Jean pense que Pierre a tort » ≠ « Pierre pense que Jean a tort »." },
    { id: "pe-formule", q: "Encodage positionnel sinusoïdal ?", r: "<code>PE(pos, 2i) = sin(pos/10000^{2i/d})</code>, <code>PE(pos, 2i+1) = cos(pos/10000^{2i/d})</code> ; additionné à l'embedding. PE(0) = (0, 1, 0, 1, …)." },
    { id: "pe-contraintes", q: "Contraintes d'un encodage positionnel (diapo 11) ?", r: "Unique par position ; relation simple entre deux positions ; toute longueur ; toute dimension ; déterministe." },
    { id: "bloc-encodeur", q: "Composition d'un bloc encodeur ?", r: "Multi-head attention → Add & Norm → feed-forward → Add & Norm, répété N fois, sans partage de poids." },
    { id: "couche-formules", q: "Formules d'une couche Transformer (diapo 28) ?", r: "<code>Z = LayerNorm(Y + X)</code> ; <code>X̃ = LayerNorm(MLP(Z) + Z)</code> ; formes (n × d) conservées." },
    { id: "residuel", q: "Connexion résiduelle et intérêt ?", r: "<code>X⁽ⁱ⁾ = X⁽ⁱ⁻¹⁾ + Layer(X⁽ⁱ⁻¹⁾)</code> : gradient qui passe bien (dérivée 1), biais vers l'identité, perte plus lisse." },
    { id: "layernorm", q: "LayerNorm ?", r: "Par vecteur : <code>(x − μ)/σ · γ + β</code>, μ et σ calculés sur les d coordonnées. (2, 4, 6, 8) → (−1,34 ; −0,45 ; 0,45 ; 1,34)." },
    { id: "ffn", q: "Rôle du feed-forward ?", r: "MLP (ReLU) appliqué à chaque vecteur séparément : introduit des non-linéarités ; l'attention seule ne fait que des combinaisons linéaires." },
    { id: "decodeur", q: "Décodeur : principe ?", r: "Auto-régressif, un token à la fois ; self-attention masquée, cross-attention, feed-forward ; à l'entraînement, phrase cible correcte décalée à droite." },
    { id: "masque", q: "Comment masque-t-on le futur ?", r: "On met −∞ sur les scores des tokens à droite avant la softmax : leur poids devient 0. Matrice triangulaire inférieure." },
    { id: "cross-formule", q: "Cross-attention en matrices ?", r: "<code>softmax(ZQ(HK)ᵀ) × HV</code> : H sorties de l'encodeur (clés, valeurs), Z états du décodeur (requêtes)." },
    { id: "sortie", q: "Du décodeur au mot ?", r: "Linear (d → taille du vocabulaire) → softmax → mot de plus forte probabilité, réinjecté pour le pas suivant." },
    { id: "norm-place", q: "Pre-norm vs post-norm ?", r: "Post-norm : LayerNorm après l'addition résiduelle (original, BERT). Pre-norm : LayerNorm hors du chemin résiduel, utilisé par presque tous les LM modernes." },
    { id: "quadratique", q: "Coût de l'auto-attention ?", r: "<code>O(n²d)</code> : toutes les paires de tokens. n = 512 → 262 144 paires. Un RNN est linéaire en n." },
    { id: "alternatives", q: "Réponses au coût quadratique ?", r: "RNN modernes linéaires (RWKV, Mamba) ; mais les grands LM gardent l'attention quadratique, avec des optimisations système (FlashAttention)." },
    { id: "variantes", q: "Les modifications du Transformer aident-elles ?", r: "« La plupart n'améliorent pas significativement les performances » (diapo 57)." }
  ]
});
