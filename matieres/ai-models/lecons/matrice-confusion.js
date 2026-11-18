/* Leçon : Lire une matrice de confusion (fiche « The confusion matrix explained », page Google « Classification »,
   TP vin section 5). Fil rouge : un classifieur de vins à 3 classes A, B, C, matrice inventée pour la leçon (50 vins de test). */
(function () {
  "use strict";
  var A = AIM;
  var CL = ["A", "B", "C"];
  var M = [[18, 2, 0], [3, 14, 3], [1, 2, 7]];
  var mB = Confusion.metriques(M, 1), G = Confusion.globales(M);
  function nombre(b, label, attendu, indice, ok, tol) {
    Exercices.nombre(b, { label: label, attendu: attendu, tolerance: tol === undefined ? 0.005 : tol, placeholder: "ex. 0,5 ou 3/4", indice: indice, surReussite: ok });
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "matrice-confusion",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Lignes, colonnes",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Définition (fiche)</span>" +
          "La matrice de confusion est calculée sur le <b>jeu de test</b> en comparant prédictions et classes connues. " +
          "L'élément <span class='mono'>m<sub>i,j</sub></span> est le nombre d'exemples <b>prédits dans la classe j</b> alors qu'ils sont <b>dans la classe i</b>.</div>" +
          "<p>Fil rouge : un classifieur de vins (trois classes A, B, C), testé sur 50 vins. En scikit-learn : " +
          "<span class='mono'>confusion_matrix(y_test, predictions)</span>.</p>",
        objectif: "Toucher la case « vins B prédits C », puis donner le nombre de vins de classe A.",
        installer: function (zone, api) {
          var fait = false;
          var cf = new Confusion(A.cadre(zone), {
            classes: CL, M: M, choisie: null,
            onCase: function (i, j) {
              if (fait) return;
              if (i === 1 && j === 2) { fait = true; cf.dessiner({ classes: { "1,2": "courante" } }); api.retour("m₁,₂ = 3 : ligne B (vraie classe), colonne C (prédite).", true); suite(); }
              else api.retour("Ligne = vraie classe, colonne = classe prédite.", false);
            }
          });
          function suite() {
            var b = Site.el("div"); zone.appendChild(b);
            nombre(b, "Nombre de vins de classe A :", 20, "La somme de la ligne A.", function () { api.valider("Une ligne = tous les exemples d'une vraie classe (20 vins A), une colonne = tous ceux prédits dans une classe."); }, 0);
          }
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "TP, FN, FP, TN pour une classe",
        texte:
          "<p>En multi-classe, TP, TN, FP et FN se calculent <b>relativement à une classe i</b> :</p>" +
          "<div class='formule lignes'>TPᵢ = mᵢ,ᵢ\nFNᵢ = (Σⱼ mᵢ,ⱼ) − mᵢ,ᵢ\nFPᵢ = (Σⱼ mⱼ,ᵢ) − mᵢ,ᵢ\nTNᵢ = Total − FPᵢ − FNᵢ − TPᵢ</div>" +
          "<p>FN : la ligne i sans la diagonale (vraie classe i, prédite ailleurs). FP : la colonne i sans la diagonale (prédite i, vraie classe ailleurs). Touche une classe pour voir ses zones.</p>",
        objectif: "Donner TP, FN, FP et TN de la classe A.",
        installer: function (zone, api) {
          new Confusion(A.cadre(zone), { classes: CL, M: M, choisie: 0, choisir: true });
          A.enchainer(zone, api, [
            function (b, ok) { nombre(b, "TP(A) =", 18, "La case diagonale.", ok, 0); },
            function (b, ok) { nombre(b, "FN(A) =", 2, "Ligne A, hors diagonale.", ok, 0); },
            function (b, ok) { nombre(b, "FP(A) =", 4, "Colonne A, hors diagonale : 3 + 1.", ok, 0); },
            function (b, ok) { nombre(b, "TN(A) =", 26, "50 − 18 − 2 − 4.", ok, 0); }
          ], "Les quatre zones de A : 18 + 2 + 4 + 26 = 50.");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Accuracy",
        texte:
          "<div class='formule'>Accuracy = (TP + TN) / (TP + TN + FP + FN)</div>" +
          "<p>Elle mesure la fraction de toutes les prédictions qui sont correctes. Sur une matrice multi-classe, les prédictions correctes sont sur la diagonale.</p>",
        objectif: "Calculer l'accuracy du classifieur.",
        installer: function (zone, api) {
          new Confusion(A.cadre(zone), { classes: CL, M: M, choisie: null });
          nombre(zone, "Accuracy =", G.accuracy, "(18 + 14 + 7) / 50.", function () {
            api.valider("39 / 50 = 0,78. La page Google l'appelle « justesse » ; elle peut être très trompeuse quand les classes sont déséquilibrées.");
          });
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Precision et recall",
        texte:
          "<div class='formule lignes'>Precision = TP / (TP + FP)\nRecall    = TP / (TP + FN)</div>" +
          "<p>Precision : parmi les observations prédites positives, combien le sont vraiment ? Recall : parmi toutes les observations vraiment positives, combien le classifieur a-t-il détectées ?</p>" +
          "<p>Le recall s'appelle aussi <b>sensibilité</b> ou <b>taux de vrais positifs</b> (TPR). Pour la classe B : precision = sa <b>colonne</b>, recall = sa <b>ligne</b>.</p>",
        objectif: "Calculer la precision et le recall de la classe B.",
        installer: function (zone, api) {
          new Confusion(A.cadre(zone), { classes: CL, M: M, choisie: 1, choisir: true });
          A.enchainer(zone, api, [
            function (b, ok) { nombre(b, "Precision(B) =", mB.precision, "14 / (14 + 2 + 2).", ok); },
            function (b, ok) { nombre(b, "Recall(B) =", mB.recall, "14 / (14 + 3 + 3).", ok); }
          ], "Precision(B) = 14/18 ≈ 0,78 ; recall(B) = 14/20 = 0,7 : le modèle rate 30 % des vins B.");
          A.note(zone, "Piège de vocabulaire : la page Google traduite (document 9) titre « Précision » sa section sur l'<i>accuracy</i>, qu'elle appelle aussi « justesse ». " +
            "Dans ce cours, <b>precision</b> = TP / (TP + FP) et <b>accuracy</b> = proportion de bonnes prédictions.");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Spécificité et F1",
        texte:
          "<div class='formule lignes'>Spécificité = TN / (TN + FP)\nF1 = 2·P·R / (P + R)\n   = 2TP / (2TP + FP + FN)</div>" +
          "<p>La spécificité mesure la capacité à bien rejeter les négatifs. Le F1 est la <b>moyenne harmonique</b> de precision et recall : il n'est élevé que si les deux le sont.</p>",
        objectif: "Calculer la spécificité et le F1 de la classe B.",
        installer: function (zone, api) {
          new Confusion(A.cadre(zone), { classes: CL, M: M, choisie: 1, choisir: true });
          A.enchainer(zone, api, [
            function (b, ok) { nombre(b, "Spécificité(B) =", mB.specificite, "TN(B) = 26, FP(B) = 4.", ok); },
            function (b, ok) { nombre(b, "F1(B) =", mB.f1, "2·14 / (2·14 + 4 + 6).", ok); }
          ], "F1(B) = 28/38 ≈ 0,737 : entre precision 0,78 et recall 0,7, plus près du plus faible.");
          A.note(zone, "Le sujet du TP vin écrit F1 = 2 · Accuracy · Recall / (Accuracy + Recall) : c'est une coquille. " +
            "La fiche « The confusion matrix explained » et la page Google donnent bien Precision à la place d'Accuracy.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Macro, pondéré, micro",
        texte:
          "<div class='formule lignes'>F1,macro    = (1/K) Σₖ F1,ₖ\nF1,weighted = Σₖ (nₖ/N) F1,ₖ</div>" +
          "<p>Macro : chaque classe compte autant. Pondéré : chaque classe pèse son effectif nₖ. Micro : on agrège les comptes avant de calculer la métrique.</p>" +
          "<p>F1 par classe : A ≈ " + A.fmt(G.f1[0]) + ", B ≈ " + A.fmt(G.f1[1]) + ", C = " + A.fmt(G.f1[2]) + ". Effectifs : 20, 20, 10.</p>",
        objectif: "Calculer le macro-F1 et le F1 pondéré, puis le micro-F1.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { nombre(b, "macro-F1 ≈", G.macroF1, "Moyenne simple des trois F1.", ok); },
            function (b, ok) { nombre(b, "F1 pondéré ≈", G.weightedF1, "0,4·F1(A) + 0,4·F1(B) + 0,2·F1(C).", ok); },
            function (b, ok) { nombre(b, "micro-F1 =", G.microF1, "Pour une classification multi-classe à une étiquette, F1 micro = accuracy.", ok); }
          ], "macro ≈ 0,765 < pondéré ≈ 0,778 : la petite classe C, la moins bien reconnue, pèse plus dans la macro-moyenne. micro = accuracy = 0,78.");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Le piège du déséquilibre",
        texte:
          "<p>Exemple de la fiche : 99 % d'exemples négatifs, 1 % de positifs. Un classifieur qui prédit <b>toujours négatif</b>. " +
          "Sur 1 000 exemples :</p>",
        objectif: "Calculer accuracy, recall et spécificité de ce classifieur.",
        installer: function (zone, api) {
          var D = [[0, 10], [0, 990]];
          new Confusion(A.cadre(zone), { classes: ["positif", "négatif"], M: D, choisie: 0 });
          A.enchainer(zone, api, [
            function (b, ok) { nombre(b, "Accuracy =", 0.99, "(0 + 990) / 1000.", ok); },
            function (b, ok) { nombre(b, "Recall (positif) =", 0, "TP = 0.", ok); },
            function (b, ok) { nombre(b, "Spécificité =", 1, "TN / (TN + FP) = 990 / 990.", ok); }
          ], "99 % d'accuracy, et aucune capacité à détecter les positifs. Une accuracy élevée n'implique pas une classification utile : on rapporte precision, recall, F1, PR-AUC et les métriques par classe.");
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : <span class='mono'>m_ij</span> = vraie classe i, prédite j. Pour une classe : TP = diagonale, FN = reste de la ligne, FP = reste de la colonne, TN = tout le reste. " +
        "Precision = colonne, recall = ligne, F1 = 2TP/(2TP + FP + FN). Macro : classes égales ; pondéré : par effectif ; micro = accuracy.</p>",
      cartes: "evaluation"
    }
  });
})();
