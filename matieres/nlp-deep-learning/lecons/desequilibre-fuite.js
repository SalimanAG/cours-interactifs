/* Leçon 1.11 : Déséquilibre des classes et fuite de données (cours 1,
   diapos 47, 48, 53 ; TP 1 synthèse ; TP 4 rôles train / validation / test).
   Fil rouge : un classifieur de messages en 3 classes, A 82 %, B 11 %, C 7 % (diapo 47). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;

  var etapes = [
    {
      titre: "Une accuracy élevée peut tromper",
      texte:
        "<p>Le cours (diapo 47) : un modèle qui prédit <b>toujours</b> la classe majoritaire A obtient 82 % d'accuracy… et échoue complètement sur B et C. " +
        "L'atelier « De la matrice de confusion aux métriques » fait le calcul : macro-F1 ≈ 0,30 (la diapo affiche 0,27).</p>",
      objectif: "Dire ce qu'il faut regarder en plus.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Pour évaluer ce problème, on…", options: ["regarde précision et rappel par classe", "rapporte le macro-F1", "se contente de l'accuracy", "utilise des découpages stratifiés"], bonnes: [0, 1, 3], explication: "Les trois recommandations « Evaluate » de la diapo 47.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Découper en gardant les proportions",
      texte:
        "<p>Un découpage <b>stratifié</b> garde les proportions de classes dans chaque partie. TP 4 : <span class='mono'>train_test_split(..., test_size=0.15, stratify=y_all)</span>.</p>" +
        "<p>200 exemples (C : 7 % = 14), découpage 80 / 20 stratifié.</p>",
      objectif: "Prévoir le nombre d'exemples de C dans la partie de 20 %.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "exemples de C dans les 20 % ≈", attendu: 2.8, tolerance: 0.21, placeholder: "ex. 5", indice: "7 % de 40 exemples.", bravo: "Environ 3. Sans stratification, le hasard pourrait n'en mettre aucun : la classe C deviendrait impossible à évaluer.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Rééquilibrer le signal d'apprentissage",
      texte: "<p>Le cours (diapo 47, « Train ») : équilibrer le signal d'apprentissage <b>sans perdre de vue la distribution réelle de déploiement</b>.</p>",
      objectif: "Associer chaque stratégie à sa description.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Poids de classes", "Sur/sous-échant.", "Collecte ciblée", "Seuils"], items: [
          { texte: "Donner plus d'importance aux classes minoritaires dans la fonction de perte", bonne: 0 },
          { texte: "Rééquilibrer les données d'entraînement (SMOTE, sous-échantillonnage aléatoire)", bonne: 1 },
          { texte: "Rassembler plus d'exemples des classes rares", bonne: 2 },
          { texte: "Ajuster le seuil de décision de chaque classe", bonne: 3 }
        ], surReussite: function () { api.valider("On valide ces choix sur un ensemble de test réaliste, qui reflète la distribution de déploiement (pas rééquilibré)."); } });
      }
    },
    {
      titre: "La fuite de données",
      texte:
        "<p>Le cours (diapo 48) : <b>tout ce qui est appris à partir des données doit être ajusté dans la partie d'entraînement</b>. " +
        "Train : fit imputer → fit scaler → fit encoder → fit modèle. Test : appliquer imputer, scaler, encoder (avec les paramètres du train) → évaluer. <b>Aucune information ne remonte du test vers le train.</b></p>",
      objectif: "Repérer les fuites.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Lesquelles de ces pratiques sont des fuites ?", options: [
          "Calculer μ et σ de la standardisation sur toutes les données, puis découper",
          "Construire le vocabulaire TF-IDF sur train + test",
          "Adapter le TextVectorization du TP 4 sur les textes de validation",
          "Appliquer au test le scaler ajusté sur le train",
          "Choisir l'architecture qui obtient le meilleur score sur le test",
          "Imputer les valeurs manquantes du test avec la médiane du train"
        ], bonnes: [0, 1, 2, 4], explication: "Les deux pratiques correctes appliquent au test des paramètres appris sur le train. Choisir sur le test transforme le test en validation (TP 4) : l'estimation finale devient optimiste.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Trois rôles : train, validation, test",
      texte:
        "<p>Tableau du TP 4 :</p>" +
        N.tableau(["partie", "rôle", "peut influencer le prétraitement ajusté ?"], [["train", "ajuster vocabulaires, poids IDF, paramètres du modèle", "oui"], ["validation", "surveiller l'entraînement, choisir modèles et réglages", "non"], ["test", "évaluation finale, une fois les choix figés", "non"]]),
      objectif: "Associer chaque action à la partie qui convient.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Train", "Validation", "Test"], items: [
          { texte: "vectorizer.adapt(...) / tfidf.fit_transform(...)", bonne: 0 },
          { texte: "Surveiller val_loss pour l'early stopping", bonne: 1 },
          { texte: "Choisir entre SimpleRNN, LSTM et GRU selon le macro-F1", bonne: 1 },
          { texte: "Rapporter la performance finale du modèle retenu", bonne: 2 }
        ], surReussite: function () { api.valider("Si l'on change un choix après avoir vu le test, il faut un nouvel ensemble jamais vu pour une estimation non biaisée (TP 4)."); } });
      }
    },
    {
      titre: "Les pipelines empêchent les fuites",
      texte:
        "<p>Diapo 48 : garder le prétraitement <b>dans</b> le pipeline, avec les API de validation croisée. Voici un extrait (dans l'esprit du TP) :</p>" +
        N.code("pipe = Pipeline([(\"scaler\", StandardScaler()),\n                 (\"model\", LogisticRegression())])\npipe.fit(X_train, y_train)          # ajuste scaler et modèle sur le train\ny_pred = pipe.predict(X_test)       # applique le scaler du train, puis prédit"),
      objectif: "Dire ce que fait pipe.predict(X_test).",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Lors de pipe.predict(X_test), le scaler…", options: ["utilise μ et σ appris sur X_train", "recalcule μ et σ sur X_test", "n'est pas utilisé"], bonne: 0, expliquer: ["Exact : transform, jamais fit, sur le test.", "Non : ce serait une fuite (et des échelles différentes entre train et test).", "Non : chaque étape s'applique."], surReussite: function () { api.valider("Les trois idées finales du cours 1 : partir de la frontière d'évaluation (découper avant d'apprendre les transformations) ; la profondeur ne remplace pas le diagnostic ; la visualisation doit déclencher une action."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "desequilibre-fuite", etapes: etapes,
    fin: { texte: "<ul><li>Déséquilibre : accuracy trompeuse → métriques par classe, macro-F1, découpage stratifié.</li><li>Stratégies : poids de classes, sur/sous-échantillonnage, collecte ciblée, seuils.</li><li>Fuite : tout « fit » sur le train seulement ; pipelines.</li><li>Train ajuste, validation choisit, test évalue une fois.</li></ul>", cartes: "rappels-donnees" }
  });
})();
