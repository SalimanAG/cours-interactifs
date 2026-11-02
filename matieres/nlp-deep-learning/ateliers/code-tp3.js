/* Atelier : code du TP 3 (encodage et embeddings) — prédire ce que renvoie
   scikit-learn ou gensim. Extraits réécrits pour l'atelier. */
(function () {
  "use strict";
  var N = NLP;

  var etapes = [
    {
      titre: "CountVectorizer et le motif de tokens par défaut",
      texte: N.code("docs = [\"I LOVE cats!\", \"I love cats.\"]\nv = CountVectorizer(binary=True)\nX = v.fit_transform(docs)\nprint(v.get_feature_names_out())\nprint(X.toarray())") +
        "<p>Par défaut, CountVectorizer met en minuscules et garde les tokens d'<b>au moins 2 caractères alphanumériques</b> (motif <span class='mono'>\\b\\w\\w+\\b</span>).</p>",
      objectif: "Prévoir le vocabulaire et la matrice.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "get_feature_names_out() ?", options: ["['cats' 'love']", "['i' 'love' 'cats']", "['I' 'LOVE' 'cats' 'love']", "['cats!' 'love']"], bonne: 0, expliquer: ["Exact : « I » (1 caractère) est écarté, la ponctuation aussi ; colonnes triées par ordre alphabétique.", "Non : « i » n'a qu'un caractère.", "Non : tout est mis en minuscules.", "Non : la ponctuation ne fait pas partie des tokens."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "X.toarray() ?", options: ["[[1 1] [1 1]]", "[[1 2] [1 1]]", "[[2 2]]"], bonne: 0, expliquer: ["Les deux documents deviennent identiques : l'emphase (majuscules, « ! ») est perdue (TP 3, checkpoint 1).", "Non.", "Non : une ligne par document."], surReussite: ok }); }
        ], "fit_transform renvoie une matrice creuse (CSR) ; toarray() la rend dense pour l'afficher.");
      }
    },
    {
      titre: "Comptes et ordre des colonnes",
      texte: N.code("v = CountVectorizer()\nX = v.fit_transform([\"the cat and the dog\"])\nprint(X.toarray())"),
      objectif: "Écrire la ligne obtenue.",
      installer: function (zone, api) {
        Exercices.texte(zone, { label: "X.toarray() =", attendu: ["[[1 1 1 2]]", "1 1 1 2", "[1 1 1 2]", "[[1, 1, 1, 2]]"], mode: "souple", verdict: false, placeholder: "[[…]]", indice: "Colonnes triées : and, cat, dog, the.", bravo: "[[1 1 1 2]] : « the » apparaît deux fois.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "TfidfVectorizer par défaut",
      texte: N.code("t = TfidfVectorizer()          # smooth_idf=True, norm=\"l2\"\nX = t.fit_transform(docs_train)\nX_val = t.transform(docs_val)"),
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "L'IDF par défaut est ln((1 + N)/(1 + df)) + 1, la forme lissée du cours.", vrai: true },
          { texte: "Chaque ligne de X a une norme euclidienne égale à 1.", vrai: true },
          { texte: "t.transform(docs_val) recalcule le vocabulaire sur la validation.", vrai: false, explication: "" },
          { texte: "Avec des lignes de norme 1, cosine_similarity(X) revient aux produits scalaires entre lignes.", vrai: true }
        ], surReussite: function () { api.valider("TP 4 : TfidfVectorizer(lowercase=True, min_df=3, ngram_range=(1, 2), max_features=30000), fit sur le train, transform sur validation et test."); } });
      }
    },
    {
      titre: "cosine_similarity",
      texte: N.code("S = cosine_similarity(X_tfidf)   # X_tfidf : 6 documents\nprint(S.shape, S[2, 2])"),
      objectif: "Prévoir la forme et la diagonale.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Sortie ?", options: ["(6, 6) 1.0", "(6,) 1.0", "(6, 6) 0.0", "(1, 6) 1.0"], bonne: 0, expliquer: ["Une ligne et une colonne par document ; chaque document est identique à lui-même.", "Non.", "Non.", "Non."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "TruncatedSVD",
      texte: N.code("svd = TruncatedSVD(n_components=2, random_state=42)\nX_lsa = svd.fit_transform(X_tfidf)      # X_tfidf : (6, 20)\nprint(X_lsa.shape, svd.components_.shape)\nprint(svd.explained_variance_ratio_.sum())"),
      objectif: "Prévoir les formes.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "X_lsa.shape, svd.components_.shape ?", options: ["(6, 2) (2, 20)", "(2, 20) (6, 2)", "(6, 20) (2, 2)"], bonne: 0, expliquer: ["2 coordonnées par document ; 2 dimensions × 20 mots (poids des mots dans chaque dimension).", "Non : inversé.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "explained_variance_ratio_.sum() est…", options: ["entre 0 et 1 : la part de variation conservée par les 2 dimensions", "toujours égal à 1", "le nombre de composantes"], bonne: 0, expliquer: ["Exact.", "Non : 2 dimensions ne gardent en général qu'une partie.", "Non."], surReussite: ok }); }
        ], "TP 3, checkpoint 2 : une projection en 2 dimensions n'est pas une représentation parfaite de la géométrie d'origine.");
      }
    },
    {
      titre: "Les paramètres de Word2Vec",
      texte: N.code("model = Word2Vec(sentences=training_sentences,\n                 vector_size=50, window=5, min_count=5, sg=1)\nmodel.wv.most_similar(\"happy\", topn=5)"),
      objectif: "Associer chaque paramètre à son rôle.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["vector_size", "window", "min_count", "sg"], items: [
          { texte: "Chaque mot est représenté par 50 nombres", bonne: 0 },
          { texte: "Distance maximale entre le mot central et ses contextes (5 de chaque côté)", bonne: 1 },
          { texte: "Les mots vus moins de 5 fois n'ont pas de vecteur (KeyError dans most_similar)", bonne: 2 },
          { texte: "1 = skip-gram, 0 = CBOW", bonne: 3 }
        ], surReussite: function () { api.valider("TP 3, exercice 3 : changer un seul paramètre à la fois (window=2 puis 10 ; sg=0 vs sg=1) pour une comparaison contrôlée."); } });
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "code-tp3", etapes: etapes, fin: { texte: "<p>CountVectorizer (binary, motif par défaut, ordre alphabétique), TfidfVectorizer (IDF lissé, norme L2, fit / transform), cosine_similarity, TruncatedSVD, Word2Vec.</p>", cartes: "pipeline-creux" } });
})();
