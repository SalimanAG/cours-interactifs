/* Paquet de cartes : Embeddings appris et choix de représentation (cours 2, diapos 42 à 58 ; TP 3 ; TP 4). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning", id: "embeddings", titre: "Embeddings appris",
  cartes: [
    { id: "embedding-couche", q: "Qu'est-ce qu'une couche d'embedding ?", r: "Une table apprise E ∈ ℝ^{|V|×d} : chaque ID sélectionne une ligne ; mise à jour par rétropropagation." },
    { id: "lookup-onehot", q: "Lien entre lookup et one-hot ?", r: "<code>eᵢᵀ E = xᵢ</code> : multiplier le one-hot par E sélectionne la ligne i." },
    { id: "embedding-formes", q: "Formes autour d'une couche Embedding(V, d) ?", r: "Entrée (B, T) d'IDs → sortie (B, T, d) ; |V| × d paramètres (TP 4 : (B, 300) → (B, 300, 96))." },
    { id: "cbow-skipgram", q: "CBOW vs skip-gram ?", r: "CBOW : contexte → mot central (efficace, mots fréquents). Skip-gram : mot central → contextes (mots rares, relations fines). gensim : sg=0 / sg=1." },
    { id: "paires-skipgram", q: "Paires d'entraînement skip-gram pour « sits » dans « the cat sits on the mat », fenêtre ±2 ?", r: "(sits, the), (sits, cat), (sits, on), (sits, the) : 4 paires positives." },
    { id: "softmax-complet", q: "Pourquoi le softmax complet est-il coûteux ?", r: "Il calcule un score pour chaque mot du vocabulaire pour chaque paire : coût proportionnel à |V|." },
    { id: "negative-sampling", q: "Échantillonnage négatif ?", r: "1 paire positive σ(u_w · v_c) à rapprocher + quelques négatives (5–20) σ(−u_w · v_n) à éloigner, tirées selon unigramme^{3/4}." },
    { id: "voisinages", q: "Que reflètent les plus proches voisins d'un embedding ?", r: "Les contextes du corpus d'entraînement, pas forcément des synonymes, et aussi ses biais (stéréotypes, déséquilibres)." },
    { id: "w2v-glove", q: "Peut-on comparer un vecteur Word2Vec et un vecteur GloVe par cosinus ?", r: "Non : modèles entraînés séparément, coordonnées sans correspondance ; on compare leurs listes de voisins (TP 3)." },
    { id: "statique-contextuel", q: "Embedding statique vs contextuel ?", r: "Statique : un vecteur par type de mot (bank = bank). Contextuel : un vecteur par occurrence, selon la phrase (polysémie)." },
    { id: "pretraining-objectifs", q: "Deux objectifs de pré-entraînement auto-supervisé ?", r: "Tokens masqués (BERT : « sat on the [MASK] » → mat) ; token suivant (GPT : « sat on the » → mat)." },
    { id: "adaptation-3", q: "Trois façons d'adapter un modèle pré-entraîné ?", r: "Fine-tuning (données étiquetées), prompting / in-context learning (instructions + exemples), paramètres efficaces (LoRA, adapters)." },
    { id: "choix-representation", q: "Démarche de choix d'une représentation ?", r: "Tâche → données → budget → baseline (TF-IDF + linéaire) → représentations apprises si nécessaire." },
    { id: "creux-vs-neuronal", q: "Quand préférer creux ? neuronal ?", r: "Creux : interprétabilité, peu de données, CPU rapide, signal lexical fort. Neuronal : transfert sémantique, contexte, calcul disponible, modèles pré-entraînés." },
    { id: "comparaison-equitable", q: "Comparer équitablement deux représentations ?", r: "Mêmes découpages, même prétraitement (fit sur train), plusieurs métriques (qualité, coût, latence, mémoire), analyse des erreurs." },
    { id: "takeaways-cours2", q: "Les 4 messages finaux du cours 2 ?", r: "L'encodage est un goulot d'information ; les bases creuses restent précieuses ; les vecteurs denses échangent de l'interprétabilité contre du transfert ; le pré-entraînement contextuel rend les représentations réutilisables." }
  ]
});
