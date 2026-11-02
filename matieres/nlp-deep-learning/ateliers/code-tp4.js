/* Atelier : code du TP 4 (RNN, LSTM, GRU sur 20 Newsgroups) — comprendre la
   démarche et prédire ce que fait le code. Extraits réécrits pour l'atelier. */
(function () {
  "use strict";
  var N = NLP;

  var etapes = [
    {
      titre: "Trois parties, trois rôles",
      texte: "<p>Le TP garde le découpage train / test fourni par 20 Newsgroups et réserve <b>15 % du train pour la validation</b>, stratifié par classe :</p>" +
        N.code("X_train, X_val, y_train, y_val = train_test_split(\n    X_all, y_all, test_size=0.15, stratify=y_all, random_state=SEED)"),
      objectif: "Calculer la taille de la validation.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "X_all : 2 000 documents → len(X_val) =", attendu: 300, placeholder: "ex. 100", surReussite: function () { api.valider("Train : ajuster vocabulaires, IDF, paramètres. Validation : surveiller et choisir. Test : évaluation finale, une fois les choix figés."); } });
      }
    },
    {
      titre: "La baseline TF-IDF + régression logistique",
      texte: N.code("tfidf = TfidfVectorizer(lowercase=True, min_df=3,\n                        ngram_range=(1, 2), max_features=30000)\nX_train_tfidf = tfidf.fit_transform(X_train)\nX_val_tfidf = tfidf.???(X_val)\nbaseline = LogisticRegression(max_iter=1000).fit(X_train_tfidf, y_train)"),
      objectif: "Compléter le code, puis interpréter min_df.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "Que mettre à la place de ??? ?", options: ["transform", "fit_transform", "fit"], bonne: 0, expliquer: ["Exact : vocabulaire et IDF viennent du train seulement (Q4).", "Non : ce serait une fuite (vocabulaire et IDF ajustés sur la validation).", "Non : fit ne renvoie pas la matrice."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "min_df=3 signifie…", options: ["on ignore les termes présents dans moins de 3 documents", "on garde au plus 3 termes", "chaque document doit contenir au moins 3 termes"], bonne: 0, expliquer: ["Exact : élagage des termes rares.", "Non : c'est max_features (ici 30 000).", "Non."], surReussite: ok }); }
        ], "Accuracy et macro-F1 de validation (average=\"macro\") servent de référence pour les réseaux.");
      }
    },
    {
      titre: "TextVectorization",
      texte: N.code("vectorizer = layers.TextVectorization(\n    max_tokens=20_000, standardize=\"lower_and_strip_punctuation\",\n    split=\"whitespace\", output_mode=\"int\", output_sequence_length=300)\nvectorizer.adapt(training_texts)"),
      objectif: "Juger cinq affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "L'ID 0 désigne le padding, l'ID 1 un token inconnu.", vrai: true },
          { texte: "max_tokens=20 000 compte aussi les entrées spéciales.", vrai: true },
          { texte: "vectorizer(tf.constant(X_train[:2])) a la forme (2, 300).", vrai: true },
          { texte: "Ce vectoriseur découpe les mots rares en sous-mots.", vrai: false, explication: "" },
          { texte: "adapt() sur les textes de validation serait sans conséquence.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider("Un texte plus long que 300 tokens est tronqué ; un plus court est complété par des 0 à la fin (Q6)."); } });
      }
    },
    {
      titre: "Vérifier le modèle avant un long entraînement",
      texte: N.code("p = rnn_model(tf.constant(X_train[:2])).numpy()\nassert p.shape == (2, NUM_CLASSES)\nassert np.allclose(p.sum(axis=1), 1.0, atol=1e-5)") + "<p>NUM_CLASSES = 4.</p>",
      objectif: "Dire ce que vérifient ces assertions.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Ces lignes vérifient que…", options: ["la sortie a une ligne par document et une colonne par classe", "chaque ligne est une distribution de probabilités (somme 1)", "le modèle a déjà appris quelque chose", "les valeurs sont finies (pas de NaN), avec la 3e assertion du TP"], bonnes: [0, 1, 3], explication: "Avant l'entraînement, une distribution presque uniforme est normale : ce n'est pas un échec.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Entraîner, choisir, évaluer",
      texte: "<p>TP 4, parties 4 à 6 : <span class='mono'>train_and_validate</span> entraîne avec un early stopping neuf pour chaque modèle (patience 2, restore_best_weights), mesure le temps d'entraînement et les métriques de validation ; " +
        "on choisit le modèle récurrent de meilleur macro-F1 de <b>validation</b>, puis on évalue ce modèle et la baseline <b>une seule fois</b> sur le test.</p>",
      objectif: "Ordonner la démarche.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, { items: ["entraîner SimpleRNN, LSTM, GRU", "comparer sur la validation", "choisir le meilleur macro-F1 de validation", "figer les choix", "évaluer une fois sur le test"], separateur: "→", surReussite: function () { api.valider("Ne pas changer d'architecture, de longueur ou de nombre d'époques en voyant le test : sinon le test devient une autre validation."); } });
      }
    },
    {
      titre: "Des probabilités aux métriques de test",
      texte: N.code("test_probabilities = best_result[\"model\"].predict(test_ds)\nbest_test_pred = test_probabilities.argmax(axis=1)\nf1_score(y_test, best_test_pred, average=\"macro\")"),
      objectif: "Prévoir la forme de best_test_pred.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Le test contient 1 500 documents. Forme de best_test_pred ?", options: ["(1500,)", "(1500, 4)", "(4,)"], bonne: 0, expliquer: ["Une classe prédite par document.", "Non : ce sont les probabilités.", "Non."], surReussite: function () { api.valider("Exercice 6b : rapport de classification, matrice de confusion et trois erreurs, en regardant les tokens réellement vus par le modèle (les 300 premiers)."); } });
      }
    },
    {
      titre: "Interpréter honnêtement",
      texte: "<p>TP 4, Q11 à Q13 : séparer les <b>observations</b> des <b>hypothèses</b> ; une explication plausible n'est pas une preuve du raisonnement du modèle.</p>",
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Une baseline TF-IDF peut rester compétitive en classification par thème : les mots de thème sont très discriminants.", vrai: true },
          { texte: "Si le GRU a le meilleur macro-F1 de validation sur une graine, il est meilleur sur tous les jeux de données.", vrai: false, explication: "" },
          { texte: "« Le modèle s'est trompé parce que le début du message parle de sport » est une hypothèse, pas une observation.", vrai: true },
          { texte: "Pour tester une amélioration, on la compare sur la validation, pas sur le test.", vrai: true }
        ], surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "code-tp4", etapes: etapes, fin: { texte: "<ul><li>train_test_split(stratify) ; fit sur train, transform ailleurs.</li><li>TextVectorization : 0 padding, 1 inconnu, 300 tokens, adapt sur train.</li><li>Choisir sur la validation (macro-F1), évaluer une fois sur le test.</li><li>Observations ≠ hypothèses.</li></ul>", cartes: "recurrents" } });
})();
