/* Test noté : encodage du texte (cours 2, TP 2, TP 3). */
Tests.enregistrer({
  matiere: "nlp-deep-learning", id: "test-encodage", titre: "Test : encodage du texte",
  notions: {
    pipeline: { titre: "Pipeline, vocabulaire, padding", lecon: "texte-identifiants" },
    pretraitement: { titre: "Prétraitement (TP 2)", lecon: "pretraiter-sens" },
    creux: { titre: "Sac de mots, n-grammes, TF-IDF", lecon: "tf-idf-cosinus" },
    cosinus: { titre: "Similarité cosinus", lecon: "tf-idf-cosinus" },
    distrib: { titre: "Co-occurrence, PPMI, SVD", lecon: "cooccurrence-ppmi-svd" },
    emb: { titre: "Embeddings et Word2Vec", lecon: "embeddings-word2vec" },
    choix: { titre: "Choisir une représentation", lecon: "choisir-representation" },
    code: { titre: "Code du TP 3", lecon: "tf-idf-cosinus" }
  },
  questions: [
    { id: "q1", notion: "pipeline", enonce: "Vocabulaire : &lt;PAD&gt; 0, &lt;UNK&gt; 1, the 4, cat 5, sat 6. « the dog sat » devient…", options: ["4 1 6", "4 0 6", "4 6", "4 5 6"], bonnes: [0], explication: "« dog » est inconnu → 1." },
    { id: "q2", notion: "pipeline", enonce: "Lot de 3 phrases de longueurs 5, 2, 4, complété à 5. Combien de positions de padding ?", options: ["4", "3", "5", "0"], bonnes: [0], explication: "0 + 3 + 1." },
    { id: "q3", notion: "pipeline", enonce: "Lesquelles sont vraies ?", options: ["le vocabulaire se construit sur le train seulement", "réduire la taille du vocabulaire augmente le nombre de &lt;UNK&gt;", "le masque d'attention vaut 0 sur les tokens inconnus", "les sous-mots permettent de représenter des mots jamais vus"], bonnes: [0, 1, 3], explication: "Le masque vaut 0 sur le padding, pas sur les inconnus." },
    { id: "q4", notion: "pretraitement", enonce: "Retirer les mots vides (liste contenant « not ») transforme « not good » en…", options: ["« good »", "« not good »", "« bad »"], bonnes: [0], explication: "D'où preserve_negation dans le TP 2." },
    { id: "q5", notion: "pretraitement", enonce: "« was → be » est le résultat…", options: ["d'une lemmatisation", "d'un stemming", "d'une tokenisation"], bonnes: [0], explication: "" },
    { id: "q6", notion: "creux", enonce: "Corpus de N = 5 documents ; un terme apparaît dans 1 document. idf (forme du cours) ≈ ?", options: ["2,10", "1,41", "1,00", "1,69"], bonnes: [0], explication: "ln(6/2) + 1." },
    { id: "q7", notion: "creux", enonce: "Un terme présent dans tous les documents (forme du cours) a un IDF de…", options: ["1", "0", "N"], bonnes: [0], explication: "ln((1+N)/(1+N)) + 1." },
    { id: "q8", notion: "creux", enonce: "Bigrammes de « not very good » ?", options: ["not very, very good", "not good, very good", "not, very, good"], bonnes: [0], explication: "" },
    { id: "q9", notion: "creux", enonce: "Quel encodage donne le même vecteur à « dog bites man » et « man bites dog » ?", options: ["sac de mots (unigrammes)", "bigrammes de mots", "aucun"], bonnes: [0], explication: "" },
    { id: "q10", notion: "cosinus", enonce: "cos((1, 0, 1), (2, 0, 2)) ?", options: ["1", "0,5", "2", "0"], bonnes: [0], explication: "Même direction." },
    { id: "q11", notion: "cosinus", enonce: "cos((1, 1, 0), (0, 1, 1)) ?", options: ["0,5", "1", "0", "0,71"], bonnes: [0], explication: "1 / (√2 × √2)." },
    { id: "q12", notion: "distrib", enonce: "P(w, c) = 0,02, P(w) = 0,1, P(c) = 0,1. PMI (ln) ≈ ?", options: ["0,69", "0", "−0,69", "2"], bonnes: [0], explication: "ln(0,02/0,01) = ln 2." },
    { id: "q13", notion: "distrib", enonce: "PPMI d'une paire jamais observée ensemble ?", options: ["0", "−∞", "1"], bonnes: [0], explication: "max(−∞, 0)." },
    { id: "q14", notion: "distrib", enonce: "Une grande fenêtre de contexte capte surtout une similarité…", options: ["thématique", "syntaxique", "orthographique"], bonnes: [0], explication: "" },
    { id: "q15", notion: "distrib", enonce: "SVD tronquée d'une matrice (5 000 × 8 000) avec k = 50 : forme de Uₖ Σₖ ?", options: ["(5 000, 50)", "(50, 8 000)", "(5 000, 8 000)"], bonnes: [0], explication: "Un vecteur dense de 50 nombres par ligne." },
    { id: "q16", notion: "emb", enonce: "Embedding(10 000, 64) : nombre de paramètres ?", options: ["640 000", "10 064", "64", "10 000"], bonnes: [0], explication: "" },
    { id: "q17", notion: "emb", enonce: "Skip-gram prédit…", options: ["les mots du contexte à partir du mot central", "le mot central à partir du contexte", "le document suivant"], bonnes: [0], explication: "" },
    { id: "q18", notion: "emb", enonce: "Avec l'échantillonnage négatif (k = 10), combien de scores par paire (w, c) ?", options: ["11", "10", "|V|"], bonnes: [0], explication: "1 positif + 10 négatifs." },
    { id: "q19", notion: "emb", enonce: "« bank » (rive) et « bank » (banque) ont des vecteurs différents avec…", options: ["une représentation contextuelle (BERT)", "Word2Vec", "TF-IDF"], bonnes: [0], explication: "" },
    { id: "q20", notion: "choix", enonce: "Peu de données étiquetées, besoin d'interprétabilité, inférence sur CPU : point de départ ?", options: ["TF-IDF + modèle linéaire", "un grand modèle fine-tuné sur GPU", "Word2Vec entraîné sur le jeu étiqueté"], bonnes: [0], explication: "Guide de la diapo 51." },
    { id: "q21", notion: "code", enonce: "<code>CountVectorizer().fit_transform([\"a cat, a dog\"])</code> : vocabulaire ?", options: ["['cat' 'dog']", "['a' 'cat' 'dog']", "['a cat' 'a dog']"], bonnes: [0], explication: "« a » n'a qu'un caractère : écarté par le motif par défaut." },
    { id: "q22", notion: "code", enonce: "Après <code>TfidfVectorizer()</code> par défaut, chaque ligne a…", options: ["une norme L2 égale à 1", "une somme égale à 1", "des valeurs entières"], bonnes: [0], explication: "norm=\"l2\"." }
  ]
});
