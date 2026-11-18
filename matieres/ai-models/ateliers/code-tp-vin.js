/* Atelier : le code du TP « Wine sophistication predictor » (TP 2) — code écrit pour l'atelier, pas recopié du sujet.
   Les nombres de la matrice de confusion de l'étape 5 sont inventés. */
(function () {
  "use strict";
  var A = AIM;
  function n(b, label, attendu, ok, indice, tol) { Exercices.nombre(b, { label: label, attendu: attendu, tolerance: tol || 1e-9, placeholder: "ex. 12", indice: indice, surReussite: ok }); }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "code-tp-vin",
    etapes: [
      {
        titre: "La philosophie de scikit-learn",
        texte: "<p>Les notes de rétropropagation se terminent ainsi : chaque modélisation et apprentissage est divisé en phases standard.</p>",
        objectif: "Rattacher chaque phase à son rôle et à la méthode qui la réalise.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["SPLIT", "FIT", "PREDICT"],
            items: [
              { texte: "Entraînement", bonne: 1 },
              { texte: "Préparation des données", bonne: 0 },
              { texte: "Prédiction et contrôle", bonne: 2 },
              { texte: "<span class='mono'>train_test_split(X, y, …)</span>", bonne: 0 },
              { texte: "<span class='mono'>clf.predict(X_test)</span>", bonne: 2 },
              { texte: "<span class='mono'>clf.fit(X_train, y_train)</span>", bonne: 1 }
            ],
            surReussite: function () { api.valider("Split → fit → predict : on retrouve ce schéma dans tous les TP."); }
          });
        }
      },
      {
        titre: "Charger les données",
        texte: "<p>Le jeu du TP : une colonne <span class='mono'>Class</span> (l'origine du vin) et 13 mesures chimiques ; les noms de colonnes sont dans un fichier à part.</p>" +
          A.code("import pandas as pd\n\nnoms = pd.read_csv(\"wine.names.csv\", header=None)[0].tolist()\nmydata = pd.read_csv(\"wine.data.csv\", names=noms)   # noms donnés au chargement\nprint(mydata.head())\n\nX = mydata.drop(columns=\"Class\")   # entrées de la « boîte noire »\ny = mydata[\"Class\"]                # sortie à prédire"),
        objectif: "Lire le code : dimensions et rôle de names=.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Nombre de colonnes de X :", 13, ok, "14 colonnes moins Class."); },
            function (b, ok) { A.choix(b, { question: "Sans names=, que se passerait-il ?", options: ["pandas prendrait la première ligne de données comme noms de colonnes", "le chargement échouerait", "les colonnes seraient triées"], bonne: 0, surReussite: ok }); },
            function (b, ok) { n(b, "Nombre de classes de vins à reconnaître :", 3, ok, "Class vaut 1, 2 ou 3."); }
          ], "X et y sont l'entrée et la sortie de la fonction « boîte noire » qu'on veut apprendre.");
        }
      },
      {
        titre: "Découper et normaliser",
        texte: A.code("from sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1/3)\n\nscaler = StandardScaler()\nscaler.fit(X_train)                 # moyennes et écarts-types du train seulement\nX_train = scaler.transform(X_train)\nX_test = scaler.transform(X_test)") +
          "<p>Le jeu contient 178 vins. Les perceptrons multicouches sont sensibles à l'échelle : ils marchent mieux quand aucune donnée n'est de plusieurs ordres de grandeur plus grande que les autres.</p>",
        objectif: "Calculer la taille du jeu de test, puis justifier fit sur le train seulement.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Taille du jeu de test (scikit-learn arrondit au-dessus) :", 60, ok, "⌈178 / 3⌉."); },
            function (b, ok) { A.choix(b, { question: "Pourquoi scaler.fit(X_train) et pas scaler.fit(X) ?", options: ["pour ne pas faire fuiter d'information du test dans le prétraitement", "parce que X_test n'a pas les mêmes colonnes", "pour aller plus vite"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Pourquoi appliquer transform au test avec le scaler du train ?", options: ["pour que le test subisse exactement la même transformation que les données d'entraînement", "pour que le test ait lui aussi une moyenne nulle", "ce n'est pas nécessaire"], bonne: 0, surReussite: ok }); }
          ], "Fit sur l'entraînement, transform partout : c'est la règle « découper d'abord » du cours sur le sur-apprentissage (fuite de données).");
        }
      },
      {
        titre: "Le perceptron multicouche",
        texte: A.code("from sklearn.neural_network import MLPClassifier\n\nclf = MLPClassifier(hidden_layer_sizes=(13, 13, 13), max_iter=500)\nclf.fit(X_train, y_train)\npredictions = clf.predict(X_test)"),
        objectif: "Décrire le réseau construit.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Nombre de couches cachées :", 3, ok); },
            function (b, ok) { n(b, "Paramètres (poids + biais) du réseau 13 → 13 → 13 → 13 → 3 :", 588, ok, "3 × (13·13 + 13) + (13·3 + 3)."); },
            function (b, ok) { A.choix(b, { question: "max_iter=500 correspond, dans les notes, à…", options: ["la constante C de la condition de terminaison (nombre d'époques)", "la précision δ", "le taux d'apprentissage ε"], bonne: 0, surReussite: ok }); }
          ], "588 paramètres appris par rétropropagation, avec au plus 500 itérations.");
          A.note(zone, "Les notes utilisent la sigmoïde ; MLPClassifier utilise par défaut activation='relu' (la sigmoïde des notes s'obtient avec activation='logistic'). " +
            "C'est une précision de la documentation de scikit-learn, absente du TP.");
        }
      },
      {
        titre: "Évaluer",
        texte: A.code("from sklearn.metrics import confusion_matrix, classification_report\nprint(confusion_matrix(y_test, predictions))\nprint(classification_report(y_test, predictions))") +
          "<p>Supposons cette matrice de confusion (60 vins de test, valeurs inventées) :</p>",
        objectif: "Calculer l'accuracy et le recall de la classe 2, puis prévoir l'effet de la suppression de la normalisation.",
        installer: function (zone, api) {
          new Confusion(A.cadre(zone), { classes: ["1", "2", "3"], M: [[19, 1, 0], [1, 22, 1], [0, 0, 16]], choisie: 1, choisir: true });
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Accuracy =", 57 / 60, ok, "Diagonale / 60.", 0.002); },
            function (b, ok) { n(b, "Recall(classe 2) =", 22 / 24, ok, "Ligne 2.", 0.002); },
            function (b, ok) { A.choix(b, { question: "On relance sans StandardScaler. À quoi faut-il s'attendre ?", options: ["des performances en général nettement moins bonnes : une colonne comme Proline (≈ 1 000) écrase les autres (≈ 1)", "exactement les mêmes performances", "une meilleure accuracy"], bonne: 0, surReussite: ok }); }
          ], "classification_report donne precision, recall, F1 et support par classe, plus les moyennes macro et pondérée (voir le chapitre « Évaluer un classifieur »).");
        }
      }
    ],
    fin: { texte: "<p>Le TP en une ligne : read_csv → drop / sélection → train_test_split → StandardScaler (fit sur le train) → MLPClassifier.fit → predict → confusion_matrix.</p>", cartes: "retropropagation" }
  });
})();
