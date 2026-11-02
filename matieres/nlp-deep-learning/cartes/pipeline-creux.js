/* Paquet de cartes : Pipeline d'entrée et représentations creuses (cours 2, diapos 1 à 27 ; TP 2 ; TP 3). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning", id: "pipeline-creux", titre: "Pipeline d'entrée et représentations creuses",
  cartes: [
    { id: "representation-choix", q: "Pourquoi « la représentation est un choix de modélisation » ?", r: "Elle détermine l'information que le modèle peut voir, comparer et apprendre (cours 2)." },
    { id: "pipeline-4", q: "Les 4 décisions du pipeline d'entrée ?", r: "Segmenter (unités) → indexer (IDs) → représenter (comptes ou vecteurs) → mettre en lots (padding, masque)." },
    { id: "mots-sous-mots", q: "Tokens mots vs sous-mots (BPE, WordPiece) ?", r: "Mots : lisibles, séquences courtes, grand vocabulaire, risque de mots inconnus. Sous-mots : vocabulaire ouvert, robustes à la morphologie, séquences plus longues, moins lisibles (« ##ing »)." },
    { id: "vocab-train", q: "Sur quoi construit-on le vocabulaire, et pourquoi ?", r: "Sur le train seulement (sinon fuite) ; on le sauvegarde avec le modèle (vocab.json) pour une inférence reproductible." },
    { id: "tokens-speciaux", q: "Tokens spéciaux et leurs IDs (diapo 9, TP 4) ?", r: "&lt;PAD&gt; 0 (remplissage), &lt;UNK&gt; 1 (inconnu), &lt;BOS&gt; 2 et &lt;EOS&gt; 3 (début / fin, optionnels), éventuellement &lt;MASK&gt;." },
    { id: "taille-vocab", q: "Comment limiter la taille du vocabulaire ? Conséquence ?", r: "Fréquence minimale (k = 5), budget fixe (top K = 30 000), autres filtres. Plus petit = moins de mémoire, plus rapide, mais plus de &lt;UNK&gt;." },
    { id: "padding-masque", q: "Padding, troncature et masque ?", r: "On complète avec 0 jusqu'à une longueur fixe et on tronque au-delà (TP 4 : 300) ; le masque (1 = token réel, 0 = padding) dit quoi ignorer : « padding is not content » ; Keras : mask_zero=True." },
    { id: "pad-vs-unk", q: "Pourquoi masquer l'ID 0 mais pas l'ID 1 ?", r: "0 = remplissage sans contenu ; 1 = un vrai mot, simplement absent du vocabulaire (TP 4, Q7)." },
    { id: "split-spacy", q: "split() vs tokeniseur spaCy (TP 2) ?", r: "split() coupe aux espaces (« mat. » reste collé) ; spaCy sépare ponctuation et contractions (is + n't, He + 's)." },
    { id: "stem-lemme", q: "Stemming vs lemmatisation ?", r: "Stemming : règles de troncature, formes parfois non-mots (studies → studi). Lemmatisation : forme du dictionnaire (was → be). Les deux réduisent le vocabulaire." },
    { id: "stopwords-negation", q: "Risque de la suppression des mots vides ?", r: "Perdre la négation : « I did not like the film » → « like film », comme la phrase positive. Moins grave pour la classification par thème." },
    { id: "doc-terme", q: "Matrice document–terme ?", r: "Lignes = documents, colonnes = termes, valeurs = comptes. Très creuse." },
    { id: "bow-ordre", q: "Limite principale du sac de mots ?", r: "L'ordre est perdu : « dog bites man » = « man bites dog »." },
    { id: "binaire-comptes", q: "Binaire vs comptes ?", r: "Binaire : le terme apparaît-il ? (réduit la répétition, bon pour textes courts, sentiment). Comptes : combien de fois ? (textes longs, peut surpondérer la répétition)." },
    { id: "ngrammes", q: "n-grammes de mots vs de caractères ?", r: "Mots : expressions courtes, ordre local (« not good »), interprétables, sensibles à la tokenisation. Caractères : robustes aux fautes et à la morphologie, bons pour identifier la langue." },
    { id: "csr", q: "Format CSR ?", r: "data (valeurs non nulles), indices (colonnes), indptr (début de chaque ligne) : la ligne i occupe indptr[i] à indptr[i+1] − 1." },
    { id: "tf-variantes", q: "Les 4 variantes de TF ?", r: "Brute count(t, d) ; binaire ; normalisée count/longueur ; log 1 + log(count)." },
    { id: "idf-formule", q: "Formule de l'IDF lissé du cours (et de scikit-learn) ?", r: "<code>idf(t) = ln((1 + N)/(1 + df(t))) + 1</code> ; df(t) = nombre de documents contenant t." },
    { id: "tfidf", q: "TF-IDF : formule et idée ?", r: "<code>w(t, d) = TF(t, d) × IDF(t)</code> : élevé pour un terme fréquent dans le document mais rare dans le corpus. Change le poids, ne crée pas de sens." },
    { id: "cosinus-texte", q: "Pourquoi le cosinus pour comparer des documents ?", r: "Il dépend de la direction, pas de la longueur : un document plus long au contenu proportionnel reste similaire." },
    { id: "creux-forces-limites", q: "Forces et limites des vecteurs creux ?", r: "Forces : rapides, interprétables, solides avec peu de données, efficaces avec des modèles linéaires. Limites : pas de synonymes, ordre lointain ignoré, 10⁴–10⁶ dimensions, indépendants du contexte." },
    { id: "countvectorizer-defaut", q: "Que fait CountVectorizer par défaut sur « I LOVE cats! » ?", r: "Minuscules, tokens d'au moins 2 caractères alphanumériques : « I » et « ! » disparaissent → cats, love ; colonnes par ordre alphabétique." }
  ]
});
