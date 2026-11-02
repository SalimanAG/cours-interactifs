/* Leçon 3.4 : De l'encodeur-décodeur à l'attention (cours 3, diapos 41 à 46).
   Fil rouge : traduire « Je suis étudiant » → « I am a student » (diapo 42),
   puis l'attention sur « The student reads books » (diapo 44). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var SC = [2, 0, 1], AL = N.softmax(SC);
  var H = [[1, 0], [0, 1], [1, 1]];

  var etapes = [
    {
      titre: "L'encodeur-décodeur",
      texte:
        "<p>Diapo 42 : <b>1. encoder</b> — l'encodeur récurrent lit la séquence d'entrée et produit une représentation de son contexte (dans un modèle de base, son état final initialise le décodeur) ; " +
        "<b>2. décoder</b> — à partir de cette représentation et d'un token de début, le décodeur prédit les tokens un par un ; <b>pendant la génération, la prédiction précédente devient l'entrée suivante</b> ; on s'arrête sur un token de fin ou une longueur limite ; " +
        "<b>3. longueurs différentes</b> — la sortie n'a pas à avoir la longueur de l'entrée (3 mots → 4 mots).</p>",
      objectif: "Remettre la génération dans l'ordre.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, { items: ["encoder « Je suis étudiant »", "<BOS>", "I", "am", "a", "student", "<EOS>"], separateur: "→", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Un seul vecteur de contexte : un goulot",
      texte: "<p>Diapo 43, sans attention : toute la phrase est résumée dans <b>un vecteur de taille fixe</b>.</p>",
      objectif: "Cocher les trois problèmes cités.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Problèmes d'un seul vecteur de contexte :", options: ["résumé limité : même taille que l'entrée soit courte ou longue", "des détails se perdent quand les entrées s'allongent", "le décodeur ne peut pas revenir consulter les états de l'encodeur", "le décodeur ne peut pas produire plus de mots qu'il n'en a lus"], bonnes: [0, 1, 2], explication: "La sortie peut être plus longue que l'entrée (étape précédente).", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Des scores aux poids d'attention",
      texte:
        "<p>Diapo 44 : chaque token d'entrée est encodé en un état hᵢ. À chaque pas de sortie t, on compare l'état précédent du décodeur sₜ₋₁ à chaque hᵢ pour obtenir un <b>score de pertinence</b>, " +
        "puis la <b>softmax</b> transforme les scores en <b>poids d'attention αₜ,ᵢ</b>, positifs et de somme 1.</p>" +
        "<p>Trois états d'encodeur ; scores (2 ; 0 ; 1).</p>",
      objectif: "Calculer α₁, à 0,01 près.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "α₁ ≈", attendu: AL[0], tolerance: 0.01, placeholder: "ex. 0,5", indice: "e² / (e² + e⁰ + e¹).", bravo: "α ≈ (" + AL.map(function (a) { return fmt(a, 3); }).join(" ; ") + ").", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Le vecteur de contexte pondéré",
      texte:
        "<div class='formule'>cₜ = Σᵢ αₜ,ᵢ · hᵢ</div>" +
        "<p>Une <b>somme pondérée</b> des états de l'encodeur, propre à ce pas de sortie. Avec h₁ = (1 ; 0), h₂ = (0 ; 1), h₃ = (1 ; 1) et α ≈ (0,665 ; 0,090 ; 0,245).</p>",
      objectif: "Calculer cₜ.",
      installer: function (zone, api) {
        var c = [0, 1].map(function (k) { return H.reduce(function (s, h, i) { return s + AL[i] * h[k]; }, 0); });
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "cₜ (1re) ≈", attendu: c[0], tolerance: 0.01, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "cₜ (2e) ≈", attendu: c[1], tolerance: 0.01, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "cₜ, avec sₜ₋₁ et la sortie précédente, sert à prédire le token suivant. Les poids sont recalculés au pas suivant.");
      }
    },
    {
      titre: "Ce que disent (et ne disent pas) les poids",
      texte: "<p>Diapo 44 : 1. scorer la pertinence ; 2. normaliser (softmax) ; 3. combiner l'information. Un poids plus fort sur « books » pour produire « livres » est une illustration : <b>l'attention apprise ne correspond pas forcément à un alignement mot à mot</b>.</p>",
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Les poids d'attention d'un pas de sortie sont positifs et somment à 1.", vrai: true },
          { texte: "Les poids sont les mêmes pour tous les pas de sortie.", vrai: false, explication: "" },
          { texte: "Avec l'attention, le décodeur accède à tous les états de l'encodeur, pas seulement au dernier.", vrai: true },
          { texte: "Un poids élevé prouve que le modèle « traduit » ce mot à cet endroit.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Et si l'attention remplaçait la récurrence ?",
      texte:
        "<p>Diapo 45 : <b>traitement récurrent</b> — chaque état dépend du précédent, l'information lointaine traverse de nombreux états. <b>Self-attention</b> — chaque token combine directement l'information des positions autorisées, " +
        "avec des poids appris ; l'information de position encode l'ordre. Les Transformers suppriment la récurrence : meilleur parallélisme et meilleur accès au contexte, sans supprimer tous les coûts de calcul et de mémoire.</p>",
      objectif: "Associer chaque propriété.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Récurrence", "Self-attention"], items: [
          { texte: "Les tokens sont traités l'un après l'autre", bonne: 0 },
          { texte: "Les représentations de nombreux tokens se calculent en parallèle dans une couche", bonne: 1 },
          { texte: "Deux tokens lointains interagissent directement dans une seule couche", bonne: 1 },
          { texte: "La génération autorégressive procède quand même token par token ; l'attention complète a un coût quadratique en longueur", bonne: 1, explication: "Les limites citées par la diapo 45." }
        ], surReussite: function () { api.valider("Diapo 46 : la récurrence construit un état qui évolue ; le LSTM contrôle un état de cellule séparé ; le GRU utilise deux portes et un état ; l'attention ouvre l'accès aux états de l'encodeur. Choisir l'architecture sur des preuves : mémoire, qualité et coût comptent. La suite : le chapitre Transformers."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "encodeur-attention", etapes: etapes,
    fin: { texte: "<ul><li>Encodeur → contexte → décodeur, token par token, longueurs différentes.</li><li>Un seul vecteur de contexte = goulot d'information.</li><li>Attention : scores → softmax → αₜ,ᵢ ; cₜ = Σ αₜ,ᵢ hᵢ, recalculé à chaque pas.</li><li>Self-attention : parallélisme et accès direct au contexte, pas sans coût.</li></ul>", cartes: "attention" }
  });
})();
