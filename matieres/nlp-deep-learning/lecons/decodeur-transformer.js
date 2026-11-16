/* Leçon 4.4 : Le décodeur (cours 4, diapos 30 à 48).
   Fil rouge : traduire « The big red dog » → « Le gros chien rouge » (exemple du cours). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var MASQ = N.softmax([1, 2]);

  var etapes = [
    {
      titre: "Le rôle du décodeur",
      texte:
        "<p>Diapo 31 : <b>générer une séquence de sortie</b> à partir de la représentation encodée de l'entrée, de façon <b>auto-régressive</b> : un token à la fois, en utilisant les tokens précédents. Mêmes composants que l'encodeur, mais avec une <b>self-attention masquée</b> et une <b>attention encodeur–décodeur</b> (cross-attention).</p>" +
        "<p>Diapo 35 : à l'entraînement, on fournit au décodeur la phrase française correcte (« gold »), décalée d'une position (« outputs shifted right »).</p>",
      objectif: "Ordonner les sous-couches d'un bloc décodeur.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, { items: ["embeddings de sortie + PE", "masked multi-head attention", "Add & Norm", "multi-head attention (cross)", "Add & Norm", "feed forward", "Add & Norm"], separateur: "→", surReussite: function () { api.valider("Puis, après les N blocs : Linear → Softmax → probabilités du mot suivant."); } });
      }
    },
    {
      titre: "Pourquoi masquer",
      texte:
        "<p>Diapo 38 : le modèle utilise <b>tous</b> les mots anglais, mais seulement <b>les mots à gauche</b> pour la phrase française ; sinon il « tricherait » pendant l'entraînement en voyant le mot qu'il doit prédire. On masque volontairement la partie droite.</p>",
      objectif: "Dire ce que « chien » a le droit de regarder.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Pour produire la représentation de « chien » dans la self-attention masquée :", options: ["Le", "gros", "chien", "rouge", "tous les mots anglais (via la cross-attention)"], bonnes: [0, 1, 2, 4], explication: "« rouge » est à droite : masqué.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Le masque en pratique",
      texte:
        "<p>Diapo 37 : on calcule les scores entre toutes les paires de tokens, puis on <b>interdit les cases grisées</b> en y mettant −∞ <b>avant</b> la softmax : exp(−∞) = 0, donc leur poids devient 0.</p>" +
        "<div class='formule'>Y = softmax( QKᵀ/√dₖ + masque ) V</div>" +
        "<p>Scores de « gros » vers (Le, gros, chien) : (1 ; 2 ; 3). « chien » est dans le futur.</p>" +
        "<div class='signalement'>La diapo 37 parle d'un masque « d × d » ; le masque a en réalité la taille de la matrice des scores, n × n (une ligne et une colonne par token), comme le dessine la diapo.</div>",
      objectif: "Calculer le poids de « gros » sur lui-même après masquage.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "poids sur « chien » =", attendu: 0, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "poids sur « gros » ≈", attendu: MASQ[1], tolerance: 0.01, placeholder: "ex. 0,5", indice: "softmax(1 ; 2) : e² / (e¹ + e²) = e / (1 + e).", surReussite: ok }); }
        ], "Poids (0,27 ; 0,73 ; 0). La matrice d'attention masquée est triangulaire inférieure.");
        N.html(zone, "<div class='signalement'>Les vecteurs d'attention dessinés aux diapos 16, 36, 40 et 41 sont illustratifs : certains ne somment pas exactement à 1 (par ex. [0,05 ; 0,45 ; 0,55 ; 0] pour « chien »), alors qu'une ligne de softmax somme toujours à 1.</div>");
      }
    },
    {
      titre: "La cross-attention",
      texte:
        "<p>Diapo 43 : soit h₁, …, hₙ les vecteurs de <b>sortie de l'encodeur</b> et z₁, …, zₙ les vecteurs du <b>décodeur</b>. " +
        "Les <b>clés et valeurs</b> viennent de l'encodeur (comme une mémoire) : kᵢ = Khᵢ, vᵢ = Vhᵢ ; les <b>requêtes</b> viennent du décodeur : qᵢ = Qzᵢ (la sortie de la self-attention masquée). " +
        "Diapo 44, en matrices : output = softmax(ZQ(HK)ᵀ) × HV.</p>" +
        "<p>Diapo 41 : la ligne « chien » met son poids sur « dog » (0,82), la ligne « rouge » sur « red » (0,89).</p>",
      objectif: "Dire d'où viennent Q, K, V.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Encodeur", "Décodeur"], items: [
          { texte: "Les requêtes de la cross-attention", bonne: 1 },
          { texte: "Les clés de la cross-attention", bonne: 0 },
          { texte: "Les valeurs de la cross-attention", bonne: 0 },
          { texte: "Requêtes, clés et valeurs de la self-attention masquée", bonne: 1 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Les formes de la cross-attention",
      texte: "<p>Diapo 44 : H ∈ ℝ^{T×d} (encodeur), Z ∈ ℝ^{T×d} (décodeur) ; ZQ(HK)ᵀ ∈ ℝ^{T×T} contient <b>toutes les paires de scores</b> ; output ∈ ℝ^{T×d}.</p>",
      objectif: "Adapter les formes à des longueurs différentes.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Phrase anglaise de 4 tokens, phrase française de 5 tokens. Forme de la matrice des scores de cross-attention (lignes = décodeur) ?", options: ["(5, 4)", "(4, 5)", "(5, 5)", "(4, 4)"], bonne: 0, expliquer: ["Une ligne par requête (mot français), une colonne par clé (mot anglais). La diapo prend la même longueur T des deux côtés.", "Non : les lignes sont les requêtes du décodeur.", "Non.", "Non."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "De la sortie au mot suivant",
      texte:
        "<p>Diapos 46 à 48 : une couche <b>Linear</b> (entièrement connectée) étend la dimension d à la <b>taille du vocabulaire français</b> ; la <b>softmax</b> transforme ce vecteur en distribution de probabilités ; le mot de sortie est celui de <b>plus forte probabilité</b>. Il est ensuite ajouté à l'entrée du décodeur pour prédire le suivant.</p>",
      objectif: "Prévoir la forme de la sortie.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "d = 512, vocabulaire français de 32 000 tokens. Forme de la matrice de la couche Linear ?", options: ["(512, 32 000)", "(32 000, 32 000)", "(512, 512)"], bonne: 0, expliquer: ["Un score par mot du vocabulaire.", "Non.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Probabilités : le 0,10 ; gros 0,70 ; chien 0,15 ; rouge 0,05. Mot produit ?", options: ["gros", "chien", "le"], bonne: 0, expliquer: ["argmax.", "Non.", "Non."], surReussite: ok }); }
        ], "Diapo 46 (reprise par erreur sous le titre « Masked Self-Attention » à la diapo 47) : la softmax rend le vecteur interprétable comme une distribution.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "decodeur-transformer", etapes: etapes,
    fin: { texte: "<ul><li>Décodeur auto-régressif ; entraînement avec la sortie correcte décalée.</li><li>Self-attention masquée : −∞ sur le futur avant la softmax.</li><li>Cross-attention : Q du décodeur, K et V de l'encodeur ; softmax(ZQ(HK)ᵀ)HV.</li><li>Linear → taille du vocabulaire, softmax, mot le plus probable.</li></ul>", cartes: "transformers" }
  });
})();
