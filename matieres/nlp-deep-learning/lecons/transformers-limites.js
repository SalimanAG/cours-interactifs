/* Leçon 4.5 : Forces et limites des Transformers (cours 4, diapos 49 à 57). */
(function () {
  "use strict";
  var N = NLP;

  var etapes = [
    {
      titre: "De très bons résultats",
      texte:
        "<p>Diapos 49 à 51 : traduction automatique (meilleur BLEU en EN-DE et EN-FR pour un coût d'entraînement plus faible, [Vaswani et al., 2017]), génération de documents (perplexité de test plus basse, [Liu et al., 2018]), " +
        "et très vite le <b>pré-entraînement</b> : la parallélisation des Transformers permet un pré-entraînement efficace, d'où leur statut de standard de fait (tous les meilleurs modèles du benchmark GLUE).</p>" +
        "<div class='signalement'>La diapo 51 annonce « plus de résultats jeudi, quand nous parlerons du pré-entraînement » : ce cours n'est pas dans tes documents. L'objectif « comparer les variantes de Transformers » n'est pas développé dans les diapos du cours 4.</div>",
      objectif: "Dire ce qui a rendu le pré-entraînement efficace.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Pourquoi les Transformers se prêtent-ils bien au pré-entraînement à grande échelle ?", options: ["ils se parallélisent bien (pas de récurrence)", "ils ont moins de paramètres que les RNN", "leur coût est linéaire en longueur"], bonne: 0, expliquer: ["Exact.", "Non.", "Non : il est quadratique (étape 3)."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Pre-norm ou post-norm",
      texte:
        "<p>Diapos 52-53 : premier défaut, des <b>instabilités d'entraînement</b>. <b>Post-LN</b> : la LayerNorm est appliquée après l'addition résiduelle (Transformer d'origine, BERT). <b>Pre-LN</b> : on normalise l'entrée de chaque sous-couche, de sorte que la LayerNorm ne touche pas le chemin résiduel principal. " +
        "« Presque tous les LM modernes utilisent le pre-norm (mais BERT était post-norm). »</p>",
      objectif: "Associer chaque modèle à sa variante.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Post-norm", "Pre-norm"], items: [
          { texte: "Transformer d'origine : Z = LayerNorm(Y + X)", bonne: 0 },
          { texte: "BERT", bonne: 0 },
          { texte: "La plupart des LM modernes", bonne: 1 },
          { texte: "LayerNorm placée de sorte qu'elle n'affecte pas le signal résiduel principal", bonne: 1 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Un coût quadratique en longueur",
      texte:
        "<p>Diapo 54 : l'auto-attention est très parallélisable, mais son nombre total d'opérations croît en <b>O(n²d)</b> (n : longueur de la séquence, d : dimension) : il faut calculer toutes les paires d'interactions, XQKᵀXᵀ ∈ ℝ^{n×n}. " +
        "Pour un modèle récurrent, le coût ne croissait que <b>linéairement</b>. Avec d ≈ 1 000 : une phrase courte, n ≤ 30, n² ≤ 900 ; en pratique on borne n, par exemple à 512.</p>",
      objectif: "Mesurer la croissance quadratique.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "n = 512 → n² =", attendu: 262144, placeholder: "ex. 1000", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "si n double, n² est multiplié par", attendu: 4, placeholder: "ex. 2", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "n = 50 000 (un long document) :", options: ["2,5 milliards de paires par tête et par couche : très coûteux", "50 000 paires", "aucun problème, c'est parallèle"], bonne: 0, expliquer: ["Exact.", "Non : ce serait linéaire.", "Non : parallèle ne veut pas dire gratuit."], surReussite: ok }); }
        ], "D'où les limites de contexte.");
      }
    },
    {
      titre: "Faut-il supprimer le coût quadratique ?",
      texte:
        "<p>Diapo 55 : <b>les RNN reviennent</b> — pour des contextes vraiment longs, des RNN modernes (RWKV, Mamba…) offrent une complexité linéaire et progressent. " +
        "Diapo 56 : mais quand les Transformers grandissent, une part croissante du calcul se fait <b>hors</b> de l'auto-attention ; en pratique, les grands LM de production utilisent l'attention quadratique : les méthodes moins chères marchent moins bien à grande échelle, et des optimisations système (FlashAttention, 2022) fonctionnent bien. " +
        "Diapo 57 : « la plupart des modifications du Transformer n'améliorent pas significativement les performances » (Narang et al.).</p>",
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "RWKV et Mamba ont un coût de génération linéaire en longueur.", vrai: true },
          { texte: "Les grands LM de production ont tous abandonné l'attention quadratique.", vrai: false, explication: "" },
          { texte: "Dans les très grands modèles, une grande part du calcul est dans les couches feed-forward plutôt que dans l'attention.", vrai: true },
          { texte: "La plupart des variantes proposées du Transformer améliorent nettement les résultats.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider("Récapitulatif : parallélisme et accès direct au contexte, au prix d'un coût O(n²d) et d'une longueur de contexte bornée."); } });
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "transformers-limites", etapes: etapes, fin: { texte: "<ul><li>Résultats : traduction, génération, pré-entraînement (GLUE).</li><li>Post-norm (original, BERT) vs pre-norm (LM modernes).</li><li>Coût O(n²d) ; RNN modernes linéaires ; FlashAttention.</li></ul>", cartes: "transformers" } });
})();
