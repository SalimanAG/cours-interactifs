/* Atelier : de la matrice de confusion aux métriques, sur des cas inédits
   (cours 1, diapos 40 et 47 ; TP 4, exercice 2b). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt;
  function mat(zone, M, L) { var mx = new Matrice(zone, { nom: "vraie ↓ / prédite →", lignes: L, colonnes: L }); mx.dessiner(M, { format: String }); }

  var etapes = [
    {
      titre: "Deux classes : spam ou non",
      texte: "<p>200 messages. La classe qui nous intéresse est « spam ».</p>",
      objectif: "Calculer précision, rappel et F1 de la classe spam.",
      installer: function (zone, api) {
        mat(zone, [[40, 20], [10, 130]], ["spam", "normal"]);
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "précision(spam) =", attendu: 0.8, tolerance: 0.001, placeholder: "ex. 0,5", indice: "Colonne « spam » : 40 / (40 + 10).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "rappel(spam) ≈", attendu: 40 / 60, tolerance: 0.002, placeholder: "ex. 0,5", indice: "Ligne « spam » : 40 / (40 + 20).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "F1(spam) ≈", attendu: 0.7273, tolerance: 0.002, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "Accuracy = 170/200 = 0,85, alors que le modèle rate un tiers des spams : le rappel le montre, pas l'accuracy.");
      }
    },
    {
      titre: "Le classifieur qui répond toujours « A »",
      texte:
        "<p>Cours 1, diapo 47 : classes A, B, C à 82 %, 11 %, 7 %. Un modèle qui prédit toujours A. Sur 100 exemples :</p>",
      objectif: "Calculer son accuracy puis son macro-F1.",
      installer: function (zone, api) {
        mat(zone, [[82, 0, 0], [11, 0, 0], [7, 0, 0]], ["A", "B", "C"]);
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "accuracy =", attendu: 0.82, tolerance: 0.001, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "F1(A) ≈", attendu: 2 * 0.82 / 1.82, tolerance: 0.002, placeholder: "ex. 0,5", indice: "précision(A) = 82/100, rappel(A) = 82/82 = 1.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "macro-F1 ≈", attendu: 0.9011 / 3, tolerance: 0.005, placeholder: "ex. 0,5", indice: "F1(B) = F1(C) = 0 (aucun B ni C retrouvé).", surReussite: ok }); }
        ], "Macro-F1 ≈ 0,30 : l'échec sur B et C saute aux yeux.");
        N.html(zone, "<div class='signalement'>La diapo 47 affiche « F1 (macro) : 0,27 » pour ce modèle ; le calcul donne 0,30 (0,901 / 3). La conclusion est la même : un score très bas malgré 82 % d'accuracy.</div>");
      }
    },
    {
      titre: "Relire un classification_report",
      texte:
        "<p>Le second modèle de la diapo 47 (accuracy 85 %) :</p>" +
        N.tableau(["classe", "précision", "rappel", "F1"], [["A", "0,93", "0,95", "0,94"], ["B", "0,62", "0,45", "0,52"], ["C", "0,50", "0,29", "0,37"]]),
      objectif: "Retrouver la ligne « macro avg » du rapport.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "macro-F1 ≈", attendu: (0.94 + 0.52 + 0.37) / 3, tolerance: 0.005, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Quelle classe a le plus faible rappel ?", options: ["C", "B", "A"], bonne: 0, expliquer: ["0,29 : plus de 7 vrais C sur 10 sont manqués.", "Non : 0,45 > 0,29.", "Non."], surReussite: ok }); }
        ], "La diapo donne bien macro avg F1 = 0,61.");
      }
    },
    {
      titre: "Choisir la métrique à surveiller",
      texte: "<p>Pour chaque situation, la métrique la plus importante pour la classe concernée.</p>",
      objectif: "Associer chaque situation à une métrique.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Précision", "Rappel", "Macro-F1"], items: [
          { texte: "Détecter des messages haineux à faire relire : on ne veut en manquer aucun.", bonne: 1 },
          { texte: "Un filtre qui supprime des mails : une fausse alerte fait perdre un mail important.", bonne: 0 },
          { texte: "Comparer deux modèles sur 4 thèmes dont un rare, chaque thème comptant autant.", bonne: 2 }
        ], surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "matrice-confusion", etapes: etapes, fin: { texte: "<p>Précision = colonne, rappel = ligne, F1 = moyenne harmonique, macro-F1 = moyenne des classes.</p>", cartes: "rappels-donnees" } });
})();
