/* Atelier : préparer des données de séquences (cours 3, diapos 37 à 40 ; TP 4, 3.3). */
(function () {
  "use strict";
  var N = NLP;

  var etapes = [
    {
      titre: "Prédire l'élément n + 1",
      texte: "<p>Diapo 37 : à partir d'une séquence connue [X₁, …, Xₙ, Xₙ₊₁], on construit une entrée X = [X₁, …, Xₙ] et une sortie attendue Y = [Xₙ₊₁]. Le RNN (série → vecteur) prédit Ŷ, comparé à Xₙ₊₁.</p>" +
        "<p>Série : 3, 5, 7, 9, 11, 13. Fenêtres d'entrée de longueur n = 3, glissantes d'un pas.</p>",
      objectif: "Compter les exemples, puis écrire la cible du 2e.",
      installer: function (zone, api) {
        Jetons.rangee(zone, [{ nom: "série", valeurs: [3, 5, 7, 9, 11, 13] }]);
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "nombre de paires (X, Y) =", attendu: 3, placeholder: "ex. 2", indice: "[3, 5, 7] → 9 ; [5, 7, 9] → … ; …", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "Y du 2e exemple =", attendu: 11, placeholder: "ex. 2", surReussite: ok }); }
        ], "Paires : [3, 5, 7] → 9 ; [5, 7, 9] → 11 ; [7, 9, 11] → 13.");
      }
    },
    {
      titre: "Données non ordonnées",
      texte: "<p>Diapo 38 : pour un jeu non ordonné, on mélange puis on découpe ; <b>la distribution des données doit être comparable entre l'entraînement et le test</b>.</p>",
      objectif: "Choisir la bonne procédure.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Des avis de films indépendants, sans date :", options: ["mélanger, puis découper (éventuellement stratifié)", "garder les 80 % premiers du fichier pour l'entraînement sans mélanger", "trier par longueur puis découper"], bonne: 0, expliquer: ["Exact.", "Non : le fichier peut être trié (par film, par date…) : train et test ne se ressembleraient pas.", "Non : on créerait volontairement une différence de distribution."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Données ordonnées : le passé explique-t-il le futur ?",
      texte: "<p>Diapos 39-40 : pour un jeu ordonné (série temporelle), on <b>ne mélange pas avant de découper</b> : le passé sert à l'entraînement, le futur au test. Ensuite, à l'intérieur de chaque partie, on découpe en fenêtres et on peut les mélanger. Un <b>générateur de données</b> est très utile.</p>",
      objectif: "Juger quatre pratiques.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Températures horaires 2020-2024 : entraîner sur 2020-2023, tester sur 2024.", vrai: true },
          { texte: "Mélanger toutes les heures puis découper au hasard.", vrai: false, explication: "" },
          { texte: "Une fois le découpage passé / futur fait, mélanger les fenêtres de l'entraînement.", vrai: true },
          { texte: "Une fenêtre de test peut contenir des valeurs de l'entraînement juste avant la coupure, en entrée uniquement.", vrai: true }
        ], surReussite: function () { api.valider("Mélanger avant de couper ferait voir au modèle des moments voisins des données de test : une fuite temporelle. (La 4e affirmation est un complément : on peut utiliser le passé connu comme contexte, jamais le futur.)"); } });
      }
    },
    {
      titre: "Le pipeline tf.data du TP 4",
      texte: N.code("def make_dataset(texts, labels, training=False):\n    dataset = tf.data.Dataset.from_tensor_slices((texts, labels))\n    if training:\n        dataset = dataset.shuffle(len(texts), seed=SEED)\n    return dataset.batch(64).prefetch(tf.data.AUTOTUNE)"),
      objectif: "Comprendre ce qui est mélangé, et compter les lots.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "shuffle mélange…", options: ["l'ordre des documents (pas les mots à l'intérieur)", "les mots de chaque document", "les étiquettes indépendamment des textes"], bonne: 0, expliquer: ["Exact (TP 4).", "Non : l'ordre des mots est précisément ce que lit le RNN.", "Non : les paires (texte, étiquette) restent ensemble."], surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "1 700 documents, lots de 64 : nombre de lots =", attendu: 27, placeholder: "ex. 10", indice: "1 700 / 64 = 26,6 : le dernier lot est incomplet.", surReussite: ok }); }
        ], "Validation et test ne sont pas mélangés : les prédictions restent alignées avec les tableaux d'étiquettes. prefetch prépare les lots suivants pendant l'entraînement.");
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "preparer-sequence", etapes: etapes, fin: { texte: "<ul><li>Fenêtres [X₁…Xₙ] → Xₙ₊₁.</li><li>Non ordonné : mélanger puis découper. Ordonné : passé / futur, sans mélanger avant.</li><li>tf.data : shuffle des documents (train seulement), batch, prefetch.</li></ul>", cartes: "recurrents" } });
})();
