/* Atelier : le CNN CIFAR-10 couche par couche (cours « CNN — a CIFAR-10 case study », d'après le tutoriel TensorFlow « Convolutional Neural Network (CNN) »). */
(function () {
  "use strict";
  var A = AIM;
  var CODE =
    "model = models.Sequential()\n" +
    "model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=(32, 32, 3)))\n" +
    "model.add(layers.MaxPooling2D((2, 2)))\n" +
    "model.add(layers.Conv2D(64, (3, 3), activation='relu'))\n" +
    "model.add(layers.MaxPooling2D((2, 2)))\n" +
    "model.add(layers.Conv2D(64, (3, 3), activation='relu'))\n" +
    "model.add(layers.Flatten())\n" +
    "model.add(layers.Dense(64, activation='relu'))\n" +
    "model.add(layers.Dense(10))";
  function n(b, label, attendu, ok, indice, tol) { Exercices.nombre(b, { label: label, attendu: attendu, tolerance: tol || 1e-9, placeholder: "ex. 12", indice: indice, surReussite: ok }); }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "cnn-cifar10",
    etapes: [
      {
        titre: "Les formes, couche par couche",
        texte: "<p>CIFAR-10 : images 32 × 32 RGB (3 072 valeurs), 10 classes exclusives ; 50 000 images d'entraînement, 10 000 de test. Le modèle :</p>" + A.code(CODE) +
          "<p>Par défaut Conv2D n'a pas de padding (« valid ») et un stride 1 ; MaxPooling2D((2, 2)) a un stride 2.</p>",
        objectif: "Donner la taille spatiale après chaque couche de la base convolutive.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Conv2D(32) : H = W =", 30, ok, "32 − 3 + 1."); },
            function (b, ok) { n(b, "MaxPooling2D : H = W =", 15, ok); },
            function (b, ok) { n(b, "Conv2D(64) : H = W =", 13, ok); },
            function (b, ok) { n(b, "MaxPooling2D : H = W =", 6, ok, "⌊13 / 2⌋ : la dernière ligne et la dernière colonne sont ignorées."); },
            function (b, ok) { n(b, "Conv2D(64) : H = W =", 4, ok); }
          ], "(32, 32, 3) → (30, 30, 32) → (15, 15, 32) → (13, 13, 64) → (6, 6, 64) → (4, 4, 64) : la résolution baisse, le nombre de canaux monte.");
          A.note(zone, "Le cours « Convolutional Neural Networks » (diapo 30) utilise un CNN didactique avec padding « same » (32×32 après la première convolution) ; " +
            "l'étude de cas CIFAR-10 suit le tutoriel, sans padding (30×30). La première couche a 896 paramètres dans les deux cas.");
        }
      },
      {
        titre: "Les paramètres de la base convolutive",
        texte: "<div class='formule'>N = (k² · C_in + 1) · C_out</div>",
        objectif: "Calculer les paramètres des trois convolutions.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Conv2D(32) sur 3 canaux :", 896, ok, "(9 · 3 + 1) · 32."); },
            function (b, ok) { n(b, "Conv2D(64) sur 32 canaux :", 18496, ok, "(9 · 32 + 1) · 64."); },
            function (b, ok) { n(b, "Conv2D(64) sur 64 canaux :", 36928, ok, "(9 · 64 + 1) · 64."); }
          ], "Base convolutive : 896 + 18 496 + 36 928 = 56 320 paramètres.");
        }
      },
      {
        titre: "La tête dense",
        texte: "<p>Les couches denses attendent un vecteur : Flatten, puis Dense(64), puis Dense(10) (10 logits, un par classe).</p>",
        objectif: "Calculer la taille après Flatten, les paramètres des couches denses et le total.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Flatten :", 1024, ok, "4 · 4 · 64."); },
            function (b, ok) { n(b, "Dense(64) :", 65600, ok, "1024 · 64 + 64."); },
            function (b, ok) { n(b, "Dense(10) :", 650, ok); },
            function (b, ok) { n(b, "Total :", 122570, ok, "56 320 + 65 600 + 650."); }
          ], "122 570 paramètres, dont plus de la moitié dans Dense(64). Avec un GAP à la place de Flatten, Dense(64) n'aurait que 64 · 64 + 64 = 4 160 paramètres.");
        }
      },
      {
        titre: "Compiler et entraîner",
        texte: A.code("train_images, test_images = train_images / 255.0, test_images / 255.0\n" +
          "model.compile(optimizer='adam',\n    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),\n    metrics=['accuracy'])\n" +
          "history = model.fit(train_images, train_labels, epochs=10,\n                    validation_data=(test_images, test_labels))"),
        objectif: "Expliquer trois choix de ce code.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) {
              A.choix(b, { question: "Pourquoi from_logits=True ?", options: ["La dernière Dense renvoie des scores bruts (pas de softmax) : la perte applique elle-même le softmax", "Parce que les étiquettes sont des entiers", "Pour normaliser les pixels"], bonne: 0, surReussite: ok });
            },
            function (b, ok) {
              A.choix(b, { question: "Pourquoi SparseCategoricalCrossentropy ?", options: ["Les étiquettes sont des entiers de classe (0 à 9), pas des vecteurs one-hot", "Parce que la sortie a 10 neurones", "Parce que l'image est en couleur"], bonne: 0, surReussite: ok });
            },
            function (b, ok) {
              A.choix(b, { question: "Quelle réserve le cours fait-il sur validation_data=(test_images, test_labels) ?", options: ["Pour une expérience rigoureuse, il faudrait un jeu de validation séparé et ne toucher au test qu'à la fin", "Aucune", "Il faudrait plus d'époques"], bonne: 0, surReussite: ok });
            }
          ], "Perte : L = −log( exp(z_y) / Σⱼ exp(zⱼ) ). La division par 255 ramène les pixels de [0, 255] à [0, 1].");
        }
      },
      {
        titre: "Lire le résultat",
        texte: "<p>Après 10 époques, le tutoriel rapporte une accuracy d'entraînement d'environ 78,75 % et une accuracy de test de 71,92 % (perte de test 0,8475). " +
          "L'accuracy de test progresse, puis reste derrière celle d'entraînement.</p>",
        objectif: "Interpréter l'écart, puis choisir une piste d'amélioration du cours.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Écart entraînement − test (points de %) :", 6.83, ok, "78,75 − 71,92.", 0.011); },
            function (b, ok) {
              A.cocher(b, {
                question: "Quelles pistes le cours cite-t-il pour améliorer ce modèle de base ? (plusieurs réponses)",
                options: ["l'augmentation de données", "la régularisation", "une évaluation plus fine : matrice de confusion, métriques par classe, plusieurs exécutions", "supprimer le jeu de test"],
                bonnes: [0, 1, 2],
                explication: "Aussi : de meilleures architectures (connexions résiduelles, normalisation), la robustesse et l'interprétabilité.",
                surReussite: ok
              });
            }
          ], "Un écart croissant est cohérent avec du sur-apprentissage. 71,9 % est un modèle de base, pas l'état de l'art : sa valeur dépend du contexte expérimental.");
        }
      }
    ],
    fin: { texte: "<p>Import → chargement → vérification → base convolutive → couches denses → compile → fit → evaluate : 122 570 paramètres, environ 72 % en test.</p>", cartes: "cnn" }
  });
})();
