/* Paquet de cartes : RNN, LSTM, GRU (cours 3, diapos 1 à 40 ; TP 4). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning", id: "recurrents", titre: "RNN, LSTM, GRU",
  cartes: [
    { id: "pourquoi-ordre", q: "Pourquoi dépasser sac de mots, n-grammes et fenêtres fixes ?", r: "Sac de mots : ordre perdu. n-grammes : contexte local seulement. Fenêtre fixe : contexte lointain exclu." },
    { id: "neurone-recurrent", q: "Équation du neurone récurrent ?", r: "<code>y₍ₜ₎ = σ(Wₓᵀ X₍ₜ₎ + w_y y₍ₜ₋₁₎ + b)</code> (w_y, b, y scalaires ; Wₓ vecteur)." },
    { id: "couche-recurrente", q: "Équation et formes d'une couche récurrente ?", r: "<code>Y₍ₜ₎ = Φ(WₓᵀX₍ₜ₎ + W_yᵀY₍ₜ₋₁₎ + b)</code> ; Wₓ : (nb_units, taille X), W_y : (nb_units, nb_units), Y : (nb_units)." },
    { id: "partage-poids", q: "Que veut dire « dérouler » un RNN ?", r: "Le voir comme une chaîne de copies, une par pas de temps, qui partagent les mêmes paramètres." },
    { id: "params-simplernn", q: "Paramètres de SimpleRNN(u) sur des entrées de dimension d ?", r: "<code>u·d + u·u + u</code> (TP 4 : 64·96 + 64·64 + 64 = 10 304)." },
    { id: "quatre-architectures", q: "Les 4 architectures récurrentes et un exemple chacune ?", r: "Série → série (série temporelle) ; série → vecteur (sentiment, classification) ; vecteur → série (annotation d'image) ; encodeur → décodeur (traduction)." },
    { id: "limites-rnn", q: "Trois limites du RNN simple ?", r: "État compressé de taille fixe réécrit à chaque pas ; long chemin de gradient (évanouissement / explosion) ; parallélisme limité." },
    { id: "explosion", q: "Pourquoi un gradient qui explose est-il un problème ?", r: "Le pas θ ← θ − α∇J devient énorme : mauvaise configuration, voire Inf ou NaN (reprendre à un checkpoint)." },
    { id: "clipping", q: "Gradient clipping ?", r: "Si ‖ĝ‖ ≥ seuil : <code>ĝ ← (seuil / ‖ĝ‖) ĝ</code> — même direction, pas plus petit. TP 4 : Adam(clipnorm=1.0)." },
    { id: "evanouissement-remedes", q: "Remèdes au gradient qui s'évanouit ?", r: "Une mémoire séparée à laquelle on ajoute (LSTM) ; des connexions plus directes (attention, résiduelles)." },
    { id: "lstm-etats", q: "Les deux états d'un LSTM ?", r: "cₜ : état de cellule (mémoire long terme) ; hₜ : état caché (court terme), version filtrée de cₜ, utilisée pour la récurrence et la prédiction." },
    { id: "lstm-equations", q: "Équations du LSTM (notation concaténée) ?", r: "fₜ, iₜ, oₜ = σ(W[hₜ₋₁ ; xₜ] + b) ; c̃ₜ = tanh(W_c[hₜ₋₁ ; xₜ] + b_c) ; <code>cₜ = fₜ ⊙ cₜ₋₁ + iₜ ⊙ c̃ₜ</code> ; <code>hₜ = oₜ ⊙ tanh(cₜ)</code>." },
    { id: "lstm-portes-roles", q: "Rôle de chaque porte du LSTM ?", r: "Forget : ce qu'on garde de cₜ₋₁. Input : combien du candidat écrire. Output : ce qu'on révèle dans hₜ. Le candidat est un calcul, pas une porte." },
    { id: "lstm-notation", q: "Deux notations du LSTM dans le cours ?", r: "Diapo 20 : matrices séparées Wₓ, W_h, candidat gₜ, ⊗. Diapos 22-25 : concaténation [hₜ₋₁ ; xₜ], c̃ₜ, ⊙. Même cellule." },
    { id: "params-lstm", q: "Paramètres de LSTM(u) ?", r: "4 × (u·d + u·u + u) : 41 216 pour u = 64, d = 96." },
    { id: "gru-equations", q: "Équations du GRU (convention du cours) ?", r: "rₜ, zₜ = σ(W[hₜ₋₁ ; xₜ] + b) ; h̃ₜ = tanh(W_h[rₜ ⊙ hₜ₋₁ ; xₜ] + b_h) ; <code>hₜ = zₜ ⊙ hₜ₋₁ + (1 − zₜ) ⊙ h̃ₜ</code> (certaines références inversent zₜ)." },
    { id: "gru-portes", q: "Rôle des portes du GRU ?", r: "Reset : combien du passé entre dans le candidat (n'efface pas l'état stocké). Update : mélange ancien état / candidat." },
    { id: "lstm-vs-gru", q: "LSTM vs GRU ?", r: "LSTM : 2 états, 3 portes, en général plus de paramètres. GRU : 1 état, 2 portes, plus léger. Aucun n'est toujours meilleur : comparer sur la validation." },
    { id: "keras-formes", q: "Formes dans le modèle Keras de la diapo 26 ?", r: "(B, T) → Embedding(10000, 64) → (B, T, 64) → LSTM(32) → (B, 32) → Dense(1, sigmoid) → (B, 1)." },
    { id: "return-sequences", q: "return_sequences=True ?", r: "Un état par pas de temps : (B, T, u). Nécessaire pour empiler une 2e couche récurrente." },
    { id: "bidirectionnel", q: "LSTM bidirectionnel : principe, taille, limite ?", r: "Deux LSTM (gauche → droite, droite → gauche), états concaténés : 2H. Inadapté à la prédiction causale du token suivant." },
    { id: "sequence-n-plus-1", q: "Préparer une série pour prédire Xₙ₊₁ ?", r: "Entrée [X₁, …, Xₙ], sortie Xₙ₊₁ (série → vecteur), par fenêtres glissantes." },
    { id: "split-temporel", q: "Découper des données ordonnées ?", r: "Passé → entraînement, futur → test, sans mélanger avant de couper ; on peut ensuite mélanger les fenêtres à l'intérieur de l'entraînement." },
    { id: "tp4-textvectorization", q: "TextVectorization du TP 4 ?", r: "max_tokens=20 000 (spéciaux compris), minuscules sans ponctuation, coupe aux espaces (pas de sous-mots), 300 tokens ; 0 = padding, 1 = inconnu ; adapt sur le train." },
    { id: "tp4-demarche", q: "Démarche de comparaison du TP 4 ?", r: "Baseline TF-IDF + régression logistique ; SimpleRNN, LSTM, GRU identiques sauf la couche récurrente ; choix sur le macro-F1 de validation ; test une seule fois." }
  ]
});
