/* Atelier : les 10 exercices de la fiche « The confusion matrix explained », mêmes types, chiffres changés, corrigés. */
(function () {
  "use strict";
  var A = AIM;
  function n(b, label, attendu, ok, indice, tol) {
    Exercices.nombre(b, { label: label, attendu: attendu, tolerance: tol === undefined ? 0.005 : tol, placeholder: "ex. 0,5", indice: indice, surReussite: ok });
  }
  function f1(p, r) { return 2 * p * r / (p + r); }

  // Ex. 3 et 5-6 : données
  var Y3 = [1, 1, 0, 1, 0, 1, 0, 0, 1, 0], P3 = [0.9, 0.8, 0.75, 0.65, 0.6, 0.5, 0.4, 0.3, 0.25, 0.1];
  function seuil(t) {
    var c = { tp: 0, fp: 0, fn: 0 };
    Y3.forEach(function (y, i) { var yh = P3[i] >= t; if (y && yh) c.tp++; else if (!y && yh) c.fp++; else if (y) c.fn++; });
    c.p = c.tp / (c.tp + c.fp); c.r = c.tp / (c.tp + c.fn); c.f = 2 * c.tp / (2 * c.tp + c.fp + c.fn);
    return c;
  }
  var C7 = [[50, 3, 2, 0], [4, 40, 5, 1], [1, 6, 45, 3], [0, 2, 4, 34]], G7 = Confusion.globales(C7);

  Lecon.demarrer({
    matiere: "ai-models",
    id: "exercices-metriques",
    etapes: [
      {
        titre: "1. Matrice de confusion binaire",
        texte: "<p>Un réseau détecte des pièces défectueuses. Sur 1 000 observations de test : <span class='mono'>TP = 150, TN = 800, FP = 30, FN = 20</span>.</p>",
        objectif: "Calculer accuracy, precision, recall, spécificité et F1.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Accuracy =", 0.95, ok, "(TP + TN) / 1000."); },
            function (b, ok) { n(b, "Precision =", 150 / 180, ok, "TP / (TP + FP)."); },
            function (b, ok) { n(b, "Recall =", 150 / 170, ok, "TP / (TP + FN)."); },
            function (b, ok) { n(b, "Spécificité =", 800 / 830, ok, "TN / (TN + FP)."); },
            function (b, ok) { n(b, "F1 =", 300 / 350, ok, "2TP / (2TP + FP + FN)."); }
          ], "0,95 ; 150/180 ≈ 0,833 ; 150/170 ≈ 0,882 ; 800/830 ≈ 0,964 ; 300/350 ≈ 0,857.");
          A.note(zone, "Les dix étapes reprennent l'ordre et le type des exercices de la fiche, avec des chiffres changés. La fiche ne donne pas de corrigé : " +
            "les corrections (messages après chaque réponse) sont calculées pour l'atelier.");
        }
      },
      {
        titre: "2. Déséquilibre des classes",
        texte: "<p>Une maladie touche 2 % d'une population de 500 patients. Un classifieur prédit <b>tous</b> les patients en bonne santé.</p>",
        objectif: "Calculer accuracy, recall et spécificité, puis expliquer.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Accuracy =", 0.98, ok, "10 malades, 490 sains, tous prédits sains."); },
            function (b, ok) { n(b, "Recall =", 0, ok, "TP = 0."); },
            function (b, ok) { n(b, "Spécificité =", 1, ok, "TN / (TN + FP) = 490 / 490."); },
            function (b, ok) {
              A.choix(b, { question: "Pourquoi l'accuracy est-elle trompeuse ici ?", options: ["Elle est dominée par la classe majoritaire : 98 % sans détecter un seul malade", "Elle est mal calculée", "Le recall devrait valoir 1"], bonne: 0, surReussite: ok });
            }
          ], "Accuracy 0,98, recall 0, spécificité 1 : le modèle est inutile pour sa tâche (détecter les malades).");
        }
      },
      {
        titre: "3. Choisir un seuil",
        texte: "<p>Un classifieur produit :</p>" +
          A.tableau(["i"].concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String)), [["yᵢ"].concat(Y3.map(String)), ["p̂ᵢ"].concat(P3.map(function (v) { return A.fmt(v, 2); }))]) +
          "<p>Évaluer les seuils t = 0,3 ; 0,5 ; 0,7 (ŷ = 1 si p̂ ≥ t).</p>",
        objectif: "Calculer precision, recall et F1 pour t = 0,5, puis le F1 des deux autres seuils.",
        installer: function (zone, api) {
          var a = seuil(0.3), m = seuil(0.5), h = seuil(0.7);
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "t = 0,5 : precision =", m.p, ok, "6 prédits positifs (i = 1 à 6)."); },
            function (b, ok) { n(b, "t = 0,5 : recall =", m.r, ok, "5 positifs au total (i = 1, 2, 4, 6, 9)."); },
            function (b, ok) { n(b, "t = 0,5 : F1 =", m.f, ok); },
            function (b, ok) { n(b, "t = 0,3 : F1 =", a.f, ok, "8 prédits positifs, dont 4 vrais."); },
            function (b, ok) { n(b, "t = 0,7 : F1 =", h.f, ok, "3 prédits positifs, dont 2 vrais."); }
          ], "t = 0,3 : P = 0,5, R = 0,8, F1 ≈ 0,615 ; t = 0,5 : P ≈ 0,667, R = 0,8, F1 ≈ 0,727 ; t = 0,7 : P ≈ 0,667, R = 0,4, F1 = 0,5. Meilleur F1 à t = 0,5.");
        }
      },
      {
        titre: "4. Classification sensible aux coûts",
        texte: "<p>Au seuil t : FP = 60, FN = 30. Au seuil t′ : FP = 15, FN = 70. Coût total = C_FP·FP + C_FN·FN.</p>",
        objectif: "Choisir le seuil dans chacun des deux scénarios.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Scénario C_FP = 1, C_FN = 4 : coût au seuil t =", 180, ok, "60·1 + 30·4.", 0); },
            function (b, ok) { n(b, "même scénario, coût au seuil t′ =", 295, ok, "15·1 + 70·4.", 0); },
            function (b, ok) { A.choix(b, { question: "Scénario C_FP = 4, C_FN = 1 : quel seuil ?", options: ["t (coût 270)", "t′ (coût 130)"], bonne: 1, expliquer: ["Non : 60·4 + 30 = 270 > 15·4 + 70 = 130.", "Exact."], surReussite: ok }); }
          ], "Faux négatifs chers → t (plus de positifs prédits) ; faux positifs chers → t′. Le bon seuil dépend des coûts du problème.");
        }
      },
      {
        titre: "5. Courbe ROC et AUC",
        texte: "<p>Un classifieur produit :</p>" +
          A.tableau(["i", "1", "2", "3", "4", "5", "6"], [["yᵢ", "1", "1", "0", "1", "0", "0"], ["sᵢ", "0,9", "0,7", "0,65", "0,5", "0,3", "0,2"]]),
        objectif: "Construire la courbe ROC et estimer l'AUC par la méthode des trapèzes.",
        installer: function (zone, api) {
          var pts = [[0, 0], [0, 1 / 3], [0, 2 / 3], [1 / 3, 2 / 3], [1 / 3, 1], [2 / 3, 1], [1, 1]];
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Au seuil t = 0,5 : TPR =", 1, ok, "Prédits positifs : i = 1 à 4."); },
            function (b, ok) { n(b, "Au seuil t = 0,5 : FPR =", 1 / 3, ok, "Un négatif (i = 3) sur trois est prédit positif."); },
            function (b, ok) {
              A.trace(b, { xmin: 0, xmax: 1, ymin: 0, ymax: 1, gradX: [0, 1], gradY: [0, 1], nomX: "FPR", nomY: "TPR", hauteur: 200, polylignes: [{ points: pts }], courbes: [{ f: function (x) { return x; }, classe: "ref" }] });
              n(b, "AUC =", 8 / 9, ok, "Trapèzes : (1/3)·(2/3) + (2/3)·1.");
            }
          ], "AUC = 8/9 ≈ 0,889 ; vérification par paires : 8 paires (positif, négatif) bien ordonnées sur 9.");
        }
      },
      {
        titre: "6. Courbe precision–recall",
        texte: "<p>Même classifieur qu'à l'exercice 5.</p>",
        objectif: "Calculer la precision à chaque point de fonctionnement et expliquer l'intérêt de la PR.",
        installer: function (zone, api) {
          A.html(zone, A.tableau(["seuil", "0,9", "0,7", "0,65", "0,5", "0,3", "0,2"], [["recall", "1/3", "2/3", "2/3", "1", "1", "1"], ["precision", "1", "1", "?", "?", "3/5", "1/2"]]));
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "precision à 0,65 =", 2 / 3, ok, "3 prédits positifs, 2 vrais."); },
            function (b, ok) { n(b, "precision à 0,5 =", 0.75, ok, "4 prédits positifs, 3 vrais."); },
            function (b, ok) { A.choix(b, { question: "Pourquoi la PR est-elle utile en cas de fort déséquilibre ?", options: ["La precision compte les faux positifs par rapport aux prédits positifs, pas par rapport à tous les négatifs", "Elle ignore les faux positifs"], bonne: 0, surReussite: ok }); }
          ], "Points (R, P) : (1/3, 1), (2/3, 1), (2/3, 2/3), (1, 3/4), (1, 3/5), (1, 1/2).");
        }
      },
      {
        titre: "7. Matrice multi-classe",
        texte: "<p>Matrice de confusion à 4 classes (lignes = vraies classes) :</p>",
        objectif: "Calculer l'accuracy, une precision, un recall, puis le macro-F1.",
        installer: function (zone, api) {
          new Confusion(A.cadre(zone), { classes: ["1", "2", "3", "4"], M: C7, choisie: 1, choisir: true });
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Accuracy =", G7.accuracy, ok, "Diagonale / 200."); },
            function (b, ok) { n(b, "Precision(classe 2) =", 40 / 51, ok, "Colonne 2 : 3 + 40 + 6 + 2."); },
            function (b, ok) { n(b, "Recall(classe 3) =", 45 / 55, ok, "Ligne 3 : 1 + 6 + 45 + 3."); },
            function (b, ok) { n(b, "macro-F1 =", G7.macroF1, ok, "F1 par classe ≈ 0,909 ; 0,792 ; 0,811 ; 0,872.", 0.002); }
          ], "Accuracy = 169/200 = 0,845. Precision : 0,909 ; 0,784 ; 0,804 ; 0,895. Recall : 0,909 ; 0,8 ; 0,818 ; 0,85. macro-F1 ≈ 0,846.");
        }
      },
      {
        titre: "8. Macro ou pondéré",
        texte: A.tableau(["classe", "nₖ", "Pₖ", "Rₖ"], [["A", "600", "0,90", "0,92"], ["B", "300", "0,75", "0,70"], ["C", "100", "0,50", "0,30"]]),
        objectif: "Calculer les F1 par classe, le macro-F1 et le F1 pondéré.",
        installer: function (zone, api) {
          var a = f1(0.9, 0.92), b2 = f1(0.75, 0.7), c = f1(0.5, 0.3);
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "F1(C) =", c, ok, "2·0,5·0,3 / (0,5 + 0,3)."); },
            function (b, ok) { n(b, "macro-F1 =", (a + b2 + c) / 3, ok, "F1(A) ≈ 0,910 ; F1(B) ≈ 0,724."); },
            function (b, ok) { n(b, "F1 pondéré =", 0.6 * a + 0.3 * b2 + 0.1 * c, ok, "Poids 0,6 ; 0,3 ; 0,1."); }
          ], "macro ≈ 0,670 : la classe C, mal reconnue, compte pour un tiers ; pondéré ≈ 0,801 : elle ne pèse que 10 %. Le pondéré cache les petites classes mal traitées.");
        }
      },
      {
        titre: "9. Calibration (ECE)",
        texte: "<p>Probabilités prédites : 0,05 0,25 0,3 0,45 0,55 0,6 0,75 0,95 ; classes : 0 1 0 0 1 0 1 1. Intervalles [0 ; 0,5) et [0,5 ; 1].</p>",
        objectif: "Calculer l'ECE.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "conf(B₁) =", 0.2625, ok, "Moyenne de 0,05 ; 0,25 ; 0,3 ; 0,45.", 0.0005); },
            function (b, ok) { n(b, "acc(B₁) =", 0.25, ok, "Un positif sur quatre.", 0.0005); },
            function (b, ok) { n(b, "ECE =", 0.025, ok, "B₂ : conf 0,7125, acc 0,75 ; chaque intervalle pèse 4/8.", 0.0005); }
          ], "ECE = ½·|0,25 − 0,2625| + ½·|0,75 − 0,7125| = 0,00625 + 0,01875 = 0,025.");
        }
      },
      {
        titre: "10. Intervalle de confiance",
        texte: "<p>Un classifieur prédit correctement 1 782 observations sur 2 000.</p>",
        objectif: "Calculer l'accuracy, l'erreur type et l'intervalle de confiance à 95 %.",
        installer: function (zone, api) {
          var p = 0.891, se = Math.sqrt(p * (1 - p) / 2000);
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Accuracy =", p, ok, "1782 / 2000.", 0.0005); },
            function (b, ok) { n(b, "SE =", se, ok, "√(p̂(1 − p̂)/N).", 0.0002); },
            function (b, ok) { n(b, "Borne haute de l'IC 95 % =", p + 1.96 * se, ok, "p̂ + 1,96·SE.", 0.001); }
          ], "SE ≈ 0,00697 ; IC 95 % ≈ [0,877 ; 0,905].");
        }
      }
    ],
    fin: {
      texte: "<p>Les dix types d'exercices de la fiche sont couverts. Réflexe : écrire TP, FP, FN, TN avant toute formule.</p>",
      cartes: "evaluation"
    }
  });
})();
