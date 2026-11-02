/* Paquet de cartes : Encodeur-décodeur et attention (cours 3, diapos 41 à 46). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning", id: "attention", titre: "Encodeur-décodeur et attention",
  cartes: [
    { id: "encodeur-decodeur", q: "Fonctionnement d'un encodeur-décodeur récurrent ?", r: "L'encodeur lit l'entrée et produit une représentation (son état final initialise le décodeur) ; le décodeur prédit token par token, la prédiction précédente devenant l'entrée suivante, jusqu'à &lt;EOS&gt;." },
    { id: "longueurs", q: "Entrée et sortie doivent-elles avoir la même longueur ?", r: "Non : « Je suis étudiant » (3) → « I am a student » (4)." },
    { id: "goulot", q: "Pourquoi un seul vecteur de contexte est-il un goulot ?", r: "Taille fixe quelle que soit l'entrée ; détails perdus pour les longues entrées ; le décodeur ne peut pas revenir aux états de l'encodeur." },
    { id: "attention-etapes", q: "Les 3 étapes de l'attention ?", r: "Scorer la pertinence (sₜ₋₁ contre chaque hᵢ) ; normaliser par softmax → αₜ,ᵢ ; combiner : <code>cₜ = Σ αₜ,ᵢ hᵢ</code>." },
    { id: "attention-poids", q: "Propriétés des poids d'attention ?", r: "Positifs, somme 1, recalculés à chaque pas de sortie ; ils ne correspondent pas forcément à un alignement mot à mot." },
    { id: "self-attention", q: "Self-attention ?", r: "Chaque token combine directement l'information des positions autorisées, avec des poids appris ; l'ordre vient d'une information de position." },
    { id: "self-attention-avantages", q: "Avantages de la self-attention sur la récurrence ?", r: "Entraînement plus parallèle ; chemins d'information plus courts entre tokens lointains." },
    { id: "self-attention-limites", q: "Limites citées de la self-attention ?", r: "Masques causaux pour la génération (toujours token par token) ; attention complète de coût quadratique en longueur." },
    { id: "takeaways-cours3", q: "Les 4 messages finaux du cours 3 ?", r: "La récurrence construit un état qui évolue ; le LSTM contrôle un état de cellule séparé ; le GRU utilise deux portes et un état ; l'attention ouvre l'accès aux états de l'encodeur. Choisir sur des preuves : mémoire, qualité, coût." }
  ]
});
