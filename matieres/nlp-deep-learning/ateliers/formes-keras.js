/* Atelier : suivre les formes des tenseurs en Keras (cours 3, diapos 26 à 28 ;
   TP 4, exercice 3 et extension A). B = taille du lot, T = longueur des séquences. */
(function () {
  "use strict";
  var N = NLP;
  var FORMES = ["(B, T)", "(B, T, 64)", "(B, 32)", "(B, 1)", "(B, T, 32)"];

  var etapes = [
    {
      titre: "Le LSTM simple de la diapo 26",
      texte: N.code("model = keras.Sequential([\n    keras.Input(shape=(None,), dtype=\"int32\"),\n    layers.Embedding(10000, 64, mask_zero=True),\n    layers.LSTM(32),\n    layers.Dense(1, activation=\"sigmoid\")\n])") +
        "<p>X_train contient des IDs complétés par du padding (0 à 9999) ; étiquettes 0 ou 1.</p>",
      objectif: "Associer chaque étage à sa forme de sortie.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: FORMES.slice(0, 4), items: [
          { texte: "IDs en entrée", bonne: 0 }, { texte: "Embedding(10000, 64)", bonne: 1, explication: "Un vecteur entraînable par token." },
          { texte: "LSTM(32)", bonne: 2, explication: "Un état caché final par séquence (return_sequences=False par défaut)." },
          { texte: "Dense(1, sigmoid)", bonne: 3, explication: "La probabilité estimée de la classe 1." }
        ], surReussite: function () { api.valider("mask_zero=True : l'ID 0 est réservé au padding ; le masque fait sauter ces positions au LSTM."); } });
      }
    },
    {
      titre: "return_sequences et LSTM empilés",
      texte: "<p>Diapo 26 : <span class='mono'>return_sequences=True</span> donne un état caché <b>par pas de temps</b>. Diapo 28, LSTM empilés : la 1re couche lit les embeddings et produit une séquence d'états, lue par la 2e couche ; chaque couche a ses propres paramètres.</p>" +
        N.code("layers.Embedding(10000, 64, mask_zero=True),\nlayers.LSTM(64, return_sequences=True),\nlayers.LSTM(32),\nlayers.Dense(1, activation=\"sigmoid\")"),
      objectif: "Prévoir la sortie de chaque LSTM.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "Sortie de LSTM(64, return_sequences=True) ?", options: ["(B, T, 64)", "(B, 64)", "(B, T, 32)"], bonne: 0, expliquer: ["Un état de 64 par pas de temps.", "Non : ce serait sans return_sequences.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Pourquoi return_sequences=True sur la 1re couche ?", options: ["la 2e couche récurrente a besoin d'une séquence en entrée", "pour réduire le nombre de paramètres", "pour masquer le padding"], bonne: 0, expliquer: ["Exact.", "Non.", "Non : c'est mask_zero."], surReussite: ok }); }
        ], "Diapo 28 : empiler ajoute de la profondeur à travers les couches, la récurrence porte l'information dans le temps. Plus de capacité, mais plus de calcul, de risque de sur-apprentissage, et aucune garantie d'amélioration.");
      }
    },
    {
      titre: "LSTM bidirectionnel",
      texte: "<p>Diapo 27 : deux LSTM séparés, l'un lit de gauche à droite (contexte précédent), l'autre de droite à gauche (contexte suivant), chacun avec ses paramètres ; à chaque position, leurs états (taille H chacun) sont concaténés : [h⃗ₜ ; h⃖ₜ], taille 2H.</p>" +
        N.code("layers.Bidirectional(layers.LSTM(64))"),
      objectif: "Donner la taille de la représentation.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "dimension de sortie =", attendu: 128, placeholder: "ex. 64", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Pour quelle tâche le bidirectionnel ne convient-il pas ?", options: ["prédire le token suivant (génération causale)", "classer un document entier", "reconnaître des entités nommées dans une phrase complète"], bonne: 0, expliquer: ["Exact : les tokens futurs n'y sont pas disponibles.", "Non : toute l'entrée est disponible (TP 4, extension A).", "Non : c'est un cas d'usage cité par le cours."], surReussite: ok }); }
        ], "Compromis : plus de paramètres et de calcul qu'une seule direction de même taille d'état.");
      }
    },
    {
      titre: "Les formes du modèle du TP 4",
      texte: N.code("inputs = keras.Input(shape=(), dtype=\"string\")\nx = vectorizer(inputs)\nx = layers.Embedding(VOCAB_SIZE, 96, mask_zero=True)(x)\nx = layers.SimpleRNN(64, return_sequences=False)(x)\nx = layers.Dropout(0.3)(x)\noutputs = layers.Dense(4, activation=\"softmax\")(x)\nmodel = keras.Model(inputs, outputs)"),
      objectif: "Associer chaque étage à sa forme.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["(B,)", "(B, 300)", "(B, 300, 96)", "(B, 64)", "(B, 4)"], items: [
          { texte: "textes bruts (une chaîne par document)", bonne: 0 },
          { texte: "après vectorizer", bonne: 1 },
          { texte: "après Embedding", bonne: 2 },
          { texte: "après SimpleRNN", bonne: 3 },
          { texte: "après Dropout", bonne: 3, explication: "Le dropout ne change pas la forme." },
          { texte: "probabilités des 4 thèmes", bonne: 4 }
        ], surReussite: function () { api.valider("API fonctionnelle (keras.Model(inputs, outputs)) au lieu de Sequential : même idée, on relie explicitement les étages."); } });
      }
    },
    {
      titre: "Sortie, perte et étiquettes",
      texte: "<p>Diapo 26 : <span class='mono'>Dense(1, sigmoid)</span> + <span class='mono'>binary_crossentropy</span>. TP 4 : <span class='mono'>Dense(4, softmax)</span> + <span class='mono'>sparse_categorical_crossentropy</span>, étiquettes entières 0 à 3.</p>",
      objectif: "Associer chaque situation à la bonne perte.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["binary_crossentropy", "sparse_categorical_crossentropy", "mse"], items: [
          { texte: "2 classes, une sortie sigmoïde, étiquettes 0/1", bonne: 0 },
          { texte: "4 classes, softmax, étiquettes 0, 1, 2, 3", bonne: 1 },
          { texte: "Régression : prédire 2 coordonnées avec Dense(2) sans activation", bonne: 2, explication: "C'est le cas du TP « Spider-Man » mentionné par le TP 4." }
        ], surReussite: function () { api.valider(); } });
        N.html(zone, "<div class='signalement'>Le TP 4 renvoie à un TP « Spider-Man » (régression de coordonnées avec Dense(2)) qui ne figure pas dans tes documents : il n'est pas couvert ici au-delà de cette mention.</div>");
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "formes-keras", etapes: etapes, fin: { texte: "<ul><li>(B, T) → Embedding → (B, T, d) → LSTM(u) → (B, u) ; return_sequences=True → (B, T, u).</li><li>Bidirectional : 2u.</li><li>Sortie et perte : sigmoid + binary_crossentropy ; softmax + sparse_categorical_crossentropy.</li></ul>", cartes: "recurrents" } });
})();
