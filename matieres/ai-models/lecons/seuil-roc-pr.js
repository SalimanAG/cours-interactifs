/* Leçon : Seuil, courbe ROC et courbe PR (fiche « The confusion matrix explained », sections 2 à 4, 7 et 8).
   Fil rouge : 10 exemples avec une probabilité p̂ = P(y = 1 | x) et leur vraie classe (inventés pour la leçon). */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var Y = [1, 1, 0, 1, 1, 0, 1, 0, 0, 0];
  var P = [0.92, 0.85, 0.78, 0.70, 0.62, 0.55, 0.48, 0.35, 0.22, 0.10];
  function comptes(t) {
    var c = { tp: 0, fp: 0, fn: 0, tn: 0 };
    Y.forEach(function (y, i) { var yh = P[i] >= t ? 1 : 0; if (y && yh) c.tp++; else if (!y && yh) c.fp++; else if (y) c.fn++; else c.tn++; });
    c.tpr = c.tp / (c.tp + c.fn); c.fpr = c.fp / (c.fp + c.tn);
    c.prec = c.tp + c.fp ? c.tp / (c.tp + c.fp) : NaN; c.rec = c.tpr;
    return c;
  }
  // Points ROC : un par seuil (scores décroissants), en partant de (0, 0).
  var ROC = [[0, 0]].concat(P.map(function (t) { var c = comptes(t); return [c.fpr, c.tpr]; }));
  var PR = P.map(function (t) { var c = comptes(t); return [c.rec, c.prec]; });
  function tableau(t) {
    return A.tableau(["i", "y", "p̂", "ŷ"], Y.map(function (y, i) {
      var yh = P[i] >= t ? 1 : 0;
      return [String(i + 1), String(y), "<span class='mono'>" + A.fmt(P[i], 2) + "</span>", "<b>" + yh + "</b>" + (yh !== y ? " ✗" : "")];
    }));
  }
  function mat2(zone) {
    var mx = new Matrice(A.cadre(zone), { nom: "vraie ↓ prédite →", lignes: ["y = 1", "y = 0"], colonnes: ["ŷ = 1", "ŷ = 0"] });
    return function (c) { mx.dessiner([[c.tp, c.fn], [c.fp, c.tn]], { format: String }); };
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "seuil-roc-pr",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Un seuil sur une probabilité",
        texte:
          "<p>Un réseau de neurones produit souvent une probabilité <span class='mono'>p̂ = P(y = 1 | x)</span>. La règle de classification</p>" +
          "<div class='formule'>ŷ = 1 si p̂ ≥ t, 0 sinon</div>" +
          "<p>dépend du <b>seuil t</b>. Changer t change la matrice de confusion.</p>",
        objectif: "Trouver un seuil qui ne fait aucun faux positif tout en gardant au moins 2 vrais positifs.",
        installer: function (zone, api) {
          var dessin = mat2(zone);
          var info = A.legende(zone);
          var tab = A.html(zone, "");
          function maj(t) {
            var c = comptes(t); dessin(c);
            info.innerHTML = "<span>t = <span class='mono'>" + A.fmt(t, 2) + "</span></span><span>TP " + c.tp + "</span><span>FP " + c.fp + "</span><span>FN " + c.fn + "</span><span>TN " + c.tn + "</span>";
            tab.innerHTML = tableau(t);
            if (c.fp === 0 && c.tp >= 2) { api.retour("FP = 0 et TP = " + c.tp + ".", true); api.valider("Entre 0,79 et 0,85 : seuls les deux exemples les plus sûrs sont prédits positifs, et ce sont de vrais positifs."); }
          }
          A.curseur(zone, { label: "seuil t", min: 0, max: 1, pas: 0.01, valeur: 0.5, format: function (v) { return A.fmt(v, 2); }, surChange: maj });
          maj(0.5);
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Baisser ou monter le seuil",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Fiche, section 2</span>" +
          "t ↓ ⇒ plus de prédictions positives ⇒ typiquement Recall ↑ et Precision ↓.<br>t ↑ ⇒ moins de prédictions positives ⇒ typiquement Recall ↓ et Precision ↑.</div>",
        objectif: "Classer les effets d'une baisse du seuil.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "Si t baisse, le nombre de prédictions positives ne peut pas diminuer.", vrai: true, explication: "Tout exemple avec p̂ ≥ t reste au-dessus d'un seuil plus bas." },
              { texte: "Si t baisse, le recall ne peut pas diminuer.", vrai: true, explication: "TP ne peut qu'augmenter, et TP + FN (le nombre de vrais positifs) est fixe." },
              { texte: "Si t baisse, la precision augmente toujours.", vrai: false, explication: "Non : typiquement elle baisse, car on ajoute surtout des faux positifs." },
              { texte: "Avec t = 0, tous les exemples sont prédits positifs.", vrai: true, explication: "p̂ ≥ 0 toujours : recall = 1, precision = proportion de positifs." }
            ],
            surReussite: function () { api.valider("Le seuil règle le compromis precision / recall."); }
          });
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Un point de la courbe ROC",
        texte:
          "<div class='formule lignes'>TPR = TP / (TP + FN)\nFPR = FP / (FP + TN)</div><p>(TPR = recall.)</p>" +
          "<p>La courbe ROC trace TPR en fonction de FPR ; <b>chaque seuil donne un point</b>. Prends t = 0,5.</p>",
        objectif: "Calculer TPR et FPR pour t = 0,5.",
        installer: function (zone, api) {
          var c = comptes(0.5);
          mat2(zone)(c);
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "TPR =", attendu: c.tpr, tolerance: 0.005, placeholder: "ex. 0,5", indice: "TP / (TP + FN).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "FPR =", attendu: c.fpr, tolerance: 0.005, placeholder: "ex. 0,5", indice: "FP / (FP + TN).", surReussite: ok }); }
          ], "Point (FPR, TPR) = (0,4 ; 0,8).");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Toute la courbe ROC",
        texte: "<p>Fais descendre le seuil d'un exemple à l'autre (du score le plus haut au plus bas) : chaque passage ajoute un point. " +
          "Un vrai positif fait monter la courbe, un faux positif la fait aller à droite.</p>",
        objectif: "Balayer tous les seuils jusqu'à t = 0,10.",
        installer: function (zone, api) {
          var k = 0;
          var tr = A.trace(zone, opts());
          var info = A.legende(zone);
          function opts() {
            return { xmin: 0, xmax: 1, ymin: 0, ymax: 1, gradX: [0, 0.5, 1], gradY: [0, 0.5, 1], nomX: "FPR", nomY: "TPR", hauteur: 230,
              courbes: [{ f: function (x) { return x; }, classe: "ref" }],
              polylignes: [{ points: ROC.slice(0, k + 1), classe: "" }],
              points: k ? [{ x: ROC[k][0], y: ROC[k][1], classe: "courante" }] : [] };
          }
          var r = el("div", "rangee-btn"); zone.appendChild(r);
          var b = el("button", "btn btn-plein", "Seuil suivant ▶"); b.type = "button"; r.appendChild(b);
          b.onclick = function () {
            if (k >= P.length) return;
            k++;
            var c = comptes(P[k - 1]);
            info.innerHTML = "<span>t = <span class='mono'>" + A.fmt(P[k - 1], 2) + "</span></span><span>exemple " + k + " : y = " + Y[k - 1] + "</span><span>(FPR, TPR) = (" + A.fmt(c.fpr, 2) + " ; " + A.fmt(c.tpr, 2) + ")</span>";
            tr.redessiner(opts());
            if (k === P.length) { b.disabled = true; api.valider("La diagonale (pointillés) est le classifieur aléatoire ; plus la courbe est près du coin (0, 1), mieux le score classe."); }
          };
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "L'aire sous la courbe",
        texte:
          "<div class='formule'>AUC_ROC = ∫₀¹ TPR(FPR) dFPR = P( s(x⁺) &gt; s(x⁻) )</div>" +
          "<p>Interprétation : la probabilité qu'un positif tiré au hasard ait un score plus haut qu'un négatif tiré au hasard. " +
          "L'AUC mesure la qualité du <b>classement</b>, pas la performance à un seuil donné.</p>" +
          "<p>Ici 5 positifs et 5 négatifs, donc 25 paires (positif, négatif).</p>",
        objectif: "Compter les paires bien ordonnées, puis donner l'AUC.",
        installer: function (zone, api) {
          A.html(zone, A.tableau(["i", "y", "p̂"], Y.map(function (y, i) { return [String(i + 1), String(y), "<span class='mono'>" + A.fmt(P[i], 2) + "</span>"]; })));
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Paires avec s(x⁺) > s(x⁻) :", attendu: 21, placeholder: "ex. 20", indice: "Positif 0,92 : 5 ; 0,85 : 5 ; 0,70 : 4 ; 0,62 : 4 ; 0,48 : ?", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "AUC =", attendu: 0.84, tolerance: 0.005, placeholder: "ex. 0,5", surReussite: ok }); }
          ], "21/25 = 0,84 ; la méthode des trapèzes sur la courbe de l'étape 4 donne la même aire : 0,2·0,4 + 0,2·0,8 + 0,6·1 = 0,84.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "La courbe precision–recall",
        texte:
          "<p>La courbe PR trace la precision en fonction du recall quand le seuil varie. Pour des problèmes très déséquilibrés, elle peut être " +
          "plus informative que la ROC : la precision compte les faux positifs <b>relativement au nombre de prédits positifs</b>.</p>",
        objectif: "Lire la precision à t = 0,5, puis dire pourquoi la PR aide en cas de déséquilibre.",
        installer: function (zone, api) {
          A.trace(zone, { xmin: 0, xmax: 1, ymin: 0, ymax: 1, gradX: [0, 0.5, 1], gradY: [0, 0.5, 1], nomX: "recall", nomY: "precision", hauteur: 220,
            polylignes: [{ points: PR }], points: PR.map(function (q) { return { x: q[0], y: q[1] }; }) });
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Precision à t = 0,5 :", attendu: 4 / 6, tolerance: 0.005, placeholder: "ex. 0,5", indice: "6 prédits positifs, dont 4 vrais.", surReussite: ok }); },
            function (b, ok) {
              A.choix(b, {
                question: "Avec 10 000 négatifs et 50 positifs, 200 faux positifs donnent un FPR de 2 %. Pourquoi la PR est-elle plus parlante ?",
                options: ["La precision chute fortement (200 faux positifs pour au plus 50 vrais), alors que le FPR reste petit", "La courbe ROC ne peut pas être tracée", "La PR ne dépend pas du seuil"],
                bonne: 0,
                expliquer: ["Exact : le FPR est dilué par l'énorme nombre de négatifs, pas la precision.", "Non : elle se trace, mais semble trop optimiste.", "Non : elle se construit justement en faisant varier le seuil."],
                surReussite: ok
              });
            }
          ], "ROC-AUC mesure le classement ; PR et PR-AUC disent combien de prédictions positives sont fiables.");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Calibration et incertitude",
        texte:
          "<p>Un classifieur est <b>parfaitement calibré</b> si <span class='mono'>P(Y = 1 | p̂ = p) = p</span> : parmi les exemples à 0,8, environ 80 % sont positifs.</p>" +
          "<div class='formule lignes'>ECE = Σₘ (|Bₘ|/N)·|acc(Bₘ) − conf(Bₘ)|\nSE = √( p̂(1 − p̂) / N )\nIC 95 % ≈ p̂ ± 1,96·SE</div>" +
          "<p>conf(Bₘ) = moyenne des probabilités prédites dans l'intervalle Bₘ ; acc(Bₘ) = proportion de positifs. " +
          "Probabilités : 0,15 0,3 0,35 0,45 0,55 0,65 0,85 0,9 ; classes : 0 0 1 0 1 0 1 1 ; intervalles [0 ; 0,5) et [0,5 ; 1].</p>",
        objectif: "Calculer l'ECE, puis l'intervalle de confiance d'une accuracy de 870/1000.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "ECE =", attendu: 0.0375, tolerance: 0.001, placeholder: "ex. 0,05", indice: "B₁ : conf 0,3125, acc 1/4 ; B₂ : conf 0,7375, acc 3/4 ; chacun pèse 4/8.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "SE pour p̂ = 0,87, N = 1000 :", attendu: Math.sqrt(0.87 * 0.13 / 1000), tolerance: 0.0003, placeholder: "ex. 0,01", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Borne basse de l'IC 95 % :", attendu: 0.87 - 1.96 * Math.sqrt(0.87 * 0.13 / 1000), tolerance: 0.0015, placeholder: "ex. 0,85", surReussite: ok }); }
          ], "ECE = 0,0375 ; IC ≈ [0,849 ; 0,891]. Une métrique est une estimation : pour F1 ou AUC, on estime l'incertitude par bootstrap (rééchantillonner le jeu de test avec remise).");
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : ŷ = 1 si p̂ ≥ t ; baisser t monte le recall et baisse (en général) la precision. ROC = TPR contre FPR, un point par seuil ; " +
        "AUC = P(s(x⁺) &gt; s(x⁻)). PR = precision contre recall, à préférer quand les positifs sont rares. Calibration : ECE ; incertitude : SE et IC à 95 %.</p>",
      cartes: "evaluation"
    }
  });
})();
