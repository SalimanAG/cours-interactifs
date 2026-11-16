/* Paquet de cartes : Transformers en pratique (TD Hugging Face, Lab Transformers). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning", id: "transformers-pratique", titre: "Transformers en pratique (Hugging Face)",
  cartes: [
    { id: "pipeline", q: "Que fait <code>pipeline(\"sentiment-analysis\")</code> ?", r: "Tokenizer + modèle + post-traitement ; renvoie {label, score} : score = probabilité de l'étiquette prédite (pas une preuve de justesse)." },
    { id: "tokenizer-sorties", q: "Sorties du tokenizer ?", r: "<code>input_ids</code> (indices des tokens, spéciaux compris) et <code>attention_mask</code> (1 = token réel, 0 = padding)." },
    { id: "tokenizer-checkpoint", q: "Pourquoi le tokenizer doit-il correspondre au checkpoint ?", r: "Le modèle a appris ses embeddings pour ce vocabulaire précis : un autre tokenizer donnerait des indices sans rapport." },
    { id: "padding-truncation", q: "padding=True, truncation=True, max_length=24 ?", r: "Compléter à la plus longue séquence du lot ; couper au-delà de 24 tokens (tokens spéciaux compris)." },
    { id: "logits", q: "Des logits à l'étiquette ?", r: "<code>softmax</code> → probabilités ; <code>argmax</code> → indice ; <code>id2label</code> → nom." },
    { id: "collator", q: "DataCollatorWithPadding ?", r: "Complète les séquences lot par lot à la longueur du plus long exemple du lot (padding dynamique), avec le bon pad_token_id." },
    { id: "trainer", q: "Réglages du Trainer dans le TD ?", r: "lr 2e-5, lots de 16, 1 époque, weight_decay 0,01 ; évaluer avant (≈ hasard, tête aléatoire) puis après." },
    { id: "erreurs", q: "Catégories d'erreurs du TD ?", r: "Négation, ironie, avis mitigé, dépendance à longue distance, troncature, erreur d'annotation." },
    { id: "masque-moyenne", q: "Pourquoi une moyenne masquée ?", r: "Le masque d'attention n'annule pas les sorties aux positions de padding : il faut les exclure de la moyenne." },
    { id: "scores-taille", q: "Taille des scores d'attention pour un lot ?", r: "(B, L, L) par tête et par couche : B = 2, L = 128 → 32 768 ; L = 256 → 131 072 (× 4)." },
    { id: "features-gelees", q: "Stratégie « features gelées » ?", r: "Encodeur figé (<code>eval</code>, <code>requires_grad_(False)</code>, <code>no_grad</code>), vecteur <code>last_hidden_state[:, 0, :]</code> (B, H), puis régression logistique." },
    { id: "trois-gels", q: ".eval(), requires_grad_(False), no_grad() ?", r: "Dropout désactivé ; paramètres non mis à jour ; pas de graphe de calcul (mémoire)." },
    { id: "lora", q: "LoRA ?", r: "<code>W_eff = W₀ + (α/r)·BA</code>, W₀ gelée, A (r, d_in), B (d_out, r) entraînées : r(d_in + d_out) paramètres (768 × 768, r = 4 → 6 144)." },
    { id: "lora-config", q: "Configuration LoRA du Lab ?", r: "r = 4, α = 16, dropout 0,1, cibles query et value, modules_to_save = classifier, lr 1e-4." },
    { id: "comparer", q: "Comparer features gelées et LoRA ?", r: "Même découpage et même test ; accuracy, macro-F1, confusion normalisée par ligne (diagonale = rappel) ; coût ; prudence sur les petits écarts." }
  ]
});
