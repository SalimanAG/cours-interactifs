/* Leçon 1.6 : Le neurone et le réseau multicouche (cours 1, diapos 28 à 34 ;
   Dense et count_params du TP 4).
   Fil rouge : classer des photos de chats et de lapins (exemple du cours),
   chaque photo étant déjà réduite à quelques nombres. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;

  var etapes = [
    {
      titre: "Le neurone artificiel",
      texte:
        "<p>Le cours (diapo 28) : entrées x₁…xₘ, poids w₁…wₘ, biais b, puis une fonction d'activation σ :</p>" +
        "<div class='formule'>t = Σᵢ xᵢ · wᵢ + b        ŷ = σ(t)</div>" +
        "<p>Une photo est résumée par x = (0,8 ; 0,1 ; 0,5) ; poids w = (2 ; −1 ; 0) ; b = −1. σ est la sigmoïde (leçon « Fonctions utiles »).</p>",
      objectif: "Calculer t, puis ŷ.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "t =", attendu: 0.5, tolerance: 1e-9, placeholder: "ex. 1", indice: "0,8·2 + 0,1·(−1) + 0,5·0 − 1.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "ŷ = σ(t) ≈", attendu: N.sigmoide(0.5), tolerance: 0.01, placeholder: "ex. 0,5", bravo: "≈ 0,62 : probabilité (selon ce neurone) que la photo soit un chat.", surReussite: ok }); }
        ], "Les poids w et le biais b sont les paramètres appris.");
      }
    },
    {
      titre: "Une couche : plusieurs neurones en parallèle",
      texte:
        "<p>Une <b>couche</b> (Dense en Keras) applique plusieurs neurones aux mêmes entrées. Avec 3 entrées et 4 neurones : W de forme (3, 4), b de dimension 4, sortie de dimension 4 :</p>" +
        "<div class='formule'>y = σ(Wᵀ · x + b)</div>" +
        "<p>Chaque neurone a 3 poids et 1 biais.</p>",
      objectif: "Compter les paramètres de cette couche.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "paramètres =", attendu: 16, placeholder: "ex. 10", indice: "3 × 4 poids + 4 biais.", bravo: "12 + 4 = 16. Formule générale : entrées × neurones + neurones.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Le réseau multicouche",
      texte:
        "<p>Le cours (diapos 29-30) : une couche d'entrée, des <b>couches cachées</b>, une couche de sortie. Les observations Xᵢ sont <b>normalisées</b> en entrée ; le réseau produit Ŷᵢ.</p>" +
        "<p>Réseau : 4 entrées → couche cachée de 8 → couche cachée de 8 → 2 sorties (toutes les couches sont denses).</p>",
      objectif: "Compter tous les paramètres (comme model.count_params() dans le TP 4).",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "paramètres =", attendu: 130, placeholder: "ex. 100", indice: "(4·8 + 8) + (8·8 + 8) + (8·2 + 2).", bravo: "40 + 72 + 18 = 130.", surReussite: function () { api.valider("Dans le TP 4, l'essentiel des paramètres est dans l'Embedding : 20 000 × 96 ≈ 1,9 million."); } });
      }
    },
    {
      titre: "La sortie dépend de la tâche",
      texte:
        "<p>Le cours (diapo 30) indique « no activation function » en sortie pour une régression. Les autres cas viennent du cours 3 (Keras) et du TP 4.</p>",
      objectif: "Associer chaque tâche à sa couche de sortie.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Dense(1)", "Dense(1, sigmoid)", "Dense(K, softmax)"], items: [
          { texte: "Prédire un prix (régression)", bonne: 0, explication: "Pas d'activation : n'importe quel réel." },
          { texte: "Avis positif ou négatif (2 classes)", bonne: 1, explication: "Une probabilité de la classe 1 (cours 3, diapo 26)." },
          { texte: "4 thèmes de 20 Newsgroups (TP 4)", bonne: 2, explication: "4 probabilités de somme 1." },
          { texte: "Note continue d'un film entre −∞ et +∞", bonne: 0 }
        ], surReussite: function () { api.valider("La perte suit : MSE pour une régression, entropie croisée binaire pour sigmoid, entropie croisée (sparse) catégorielle pour softmax."); } });
      }
    },
    {
      titre: "Pourquoi des activations non linéaires",
      texte:
        "<p>Complément : sans fonction d'activation, enchaîner deux couches revient à W₂ᵀ(W₁ᵀx + b₁) + b₂ = Wᵀx + b, une seule couche linéaire. " +
        "Les activations non linéaires (σ, tanh…) entre les couches permettent au réseau d'apprendre des représentations de plus en plus abstraites (définition du DL).</p>",
      objectif: "Vérifier ce point.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Empiler 10 couches linéaires sans activation donne un modèle linéaire.", vrai: true },
          { texte: "La couche de sortie d'une régression n'a pas d'activation.", vrai: true },
          { texte: "Les poids d'un réseau sont fixés par le programmeur.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "La boucle d'entraînement",
      texte:
        "<p>Exemple du cours (diapos 31 à 33) : 80 % des photos étiquetées pour l'apprentissage, 20 % pour l'évaluation. Puis on entraîne en boucle.</p>",
      objectif: "Remettre la boucle dans l'ordre.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, { consigne: "Une itération sur les données d'entraînement :", items: ["prédictions", "erreurs (perte)", "corrections (gradient)", "itération suivante"], separateur: "→", surReussite: function () { api.valider("Les corrections de tous les poids sont calculées par rétropropagation du gradient (« backpropagation », cours 3), puis appliquées par descente de gradient."); } });
      }
    },
    {
      titre: "Surveiller l'apprentissage",
      texte:
        "<p>Le cours (diapo 34) évalue à chaque époque sur les données d'entraînement (courbe d'apprentissage) et sur les données de validation (courbe de validation). " +
        "La courbe de validation qui se met à baisser en accuracy — ou à remonter en perte — signale le <b>sur-apprentissage</b>.</p>",
      objectif: "Interpréter la courbe de validation.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "L'accuracy d'entraînement monte toujours, l'accuracy de validation monte puis redescend. Que faire ?", options: ["garder le modèle de l'époque où la validation était la meilleure (early stopping)", "entraîner plus longtemps", "évaluer sur le test et choisir l'époque qui y donne le meilleur score"], bonne: 0, expliquer: ["Exact.", "Non : le sur-apprentissage s'aggraverait.", "Non : choisir sur le test en fait un ensemble de validation (TP 4) ; l'estimation finale serait biaisée."], surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "neurone-reseau", etapes: etapes,
    fin: { texte: "<ul><li>Neurone : t = Σxᵢwᵢ + b, ŷ = σ(t).</li><li>Couche Dense : entrées × neurones + neurones paramètres.</li><li>Sortie : rien (régression), sigmoid (2 classes), softmax (K classes).</li><li>Boucle : prédire → perte → gradient → corriger ; surveiller train et validation.</li></ul>", cartes: "rappels-optimisation" }
  });
})();
