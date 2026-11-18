/* Leçon : Diagnostiquer avec train et validation (cours 5 « Overfitting and Underfitting »).
   Fil rouge : 10 points d'entraînement et 10 points de validation (synthétiques, inventés pour la leçon), ajustés par un
   polynôme de degré 0 à 9 (moindres carrés ; coefficients précalculés, du plus haut degré au terme constant). */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var XT = [-1.04, -0.75, -0.56, -0.31, -0.06, 0.11, 0.33, 0.51, 0.75, 1.0], YT = [-0.65, -0.97, -0.89, -0.91, 0.17, 0.27, 0.59, 1.27, 0.99, 0.55];
  var XV = [-0.94, -0.71, -0.54, -0.35, -0.12, 0.14, 0.29, 0.52, 0.77, 0.91], YV = [-0.95, -1.41, -0.74, -0.77, -0.39, 0.5, 0.3, 1.01, 0.62, 0.79];
  var C = [[0.042], [1.084549708, 0.04416909942], [-0.08130142586, 1.081449494, 0.07669159947], [-1.752654609, -0.1546786287, 2.388271494, 0.08052143781],
    [-0.33077948, -1.785246442, 0.1947138978, 2.406917996, 0.03914393891], [0.6638415461, -0.2755283729, -2.66592979, 0.1605486771, 2.623614961, 0.03826335504],
    [-0.689216719, 0.6341558007, 0.7815490589, -2.653340354, -0.2141843789, 2.625647834, 0.05579273217],
    [4.868157311, -0.4428289967, -7.734218975, 0.5611295221, 1.191448538, -0.162086341, 2.206801781, 0.0560575785],
    [59.11584724, 12.57078032, -109.2247169, -18.82719766, 58.38622027, 5.679653636, -9.221327788, 1.826550505, 0.2445240366],
    [-81.37789789, 51.28202829, 171.6512022, -98.59646345, -114.3712153, 54.51060353, 25.44682794, -9.026272527, 0.7773457037, 0.2538415169]];
  function p(d, x) { return C[d].reduce(function (s, c) { return s * x + c; }, 0); }
  function mse(d, X, Y) { return X.reduce(function (s, x, i) { return s + Math.pow(p(d, x) - Y[i], 2); }, 0) / X.length; }
  var ET = C.map(function (c, d) { return mse(d, XT, YT); }), EV = C.map(function (c, d) { return mse(d, XV, YV); });
  var MEILLEUR = EV.indexOf(Math.min.apply(null, EV)); // 3

  function nuage(zone, d) {
    var o = function (d) {
      return { xmin: -1.1, xmax: 1.1, ymin: -1.8, ymax: 1.8, gradX: [-1, 0, 1], gradY: [-1, 0, 1], nomX: "x", hauteur: 210,
        courbes: d === null ? [] : [{ f: function (x) { return p(d, x); }, classe: "courante" }],
        points: XT.map(function (x, i) { return { x: x, y: YT[i] }; }).concat(XV.map(function (x, i) { return { x: x, y: YV[i], classe: "vide" }; })) };
    };
    var tr = A.trace(zone, o(d));
    return function (d) { tr.redessiner(o(d)); };
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "diagnostiquer-ajustement",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Préparer un examen",
        texte: "<p>Question directrice du cours : apprend-on la structure sous-jacente, ou trop peu — ou trop — de l'échantillon d'entraînement ? " +
          "L'analogie de l'examen (d'après Gupta, 2022) :</p>",
        objectif: "Rattacher chaque description à sous- ou sur-apprentissage.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["sous-apprentissage", "sur-apprentissage"],
            items: [
              { texte: "A à peine révisé ; ne sait pas résoudre même les questions familières", bonne: 0 },
              { texte: "A appris par cœur les corrigés ; bloque quand la formulation change", bonne: 1 },
              { texte: "Le modèle apprend les particularités et le bruit", bonne: 1 },
              { texte: "Les performances d'entraînement sont déjà mauvaises", bonne: 0 },
              { texte: "Excellent sur l'entraînement, décevant sur de nouvelles données", bonne: 1 }
            ],
            surReussite: function () { api.valider("Sous-ajusté : trop simple ou pas assez entraîné. Sur-ajusté : colle au bruit propre à l'échantillon."); }
          });
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Régler la complexité",
        texte: "<p>Points pleins : entraînement ; points creux : validation (mêmes données, tirage différent). On ajuste un polynôme aux seuls points d'entraînement. Règle son degré.</p>",
        objectif: "Trouver les degrés qui donnent une erreur d'entraînement nulle, puis le meilleur degré en validation.",
        installer: function (zone, api) {
          var d = 1;
          var dessin = nuage(zone, d);
          var info = A.legende(zone);
          function maj() {
            dessin(d);
            info.innerHTML = "<span>degré <span class='mono'>" + d + "</span></span><span>EQM train <span class='mono'>" + A.fmt(ET[d], 3) + "</span></span><span>EQM validation <span class='mono'>" + A.fmt(EV[d], 3) + "</span></span>";
          }
          A.curseur(zone, { label: "degré", min: 0, max: 9, pas: 1, valeur: 1, format: String, surChange: function (v) { d = v; maj(); } });
          maj();
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Degré qui passe par tous les points d'entraînement :", attendu: 9, placeholder: "ex. 2", indice: "10 points : un polynôme de degré 9 peut tous les interpoler.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Degré avec la plus petite EQM de validation :", attendu: MEILLEUR, placeholder: "ex. 2", surReussite: ok }); }
          ], "Degré 0 ou 1 : trop rigide (sous-ajusté). Degré 9 : erreur d'entraînement nulle, mais la courbe oscille entre les points (sur-ajusté). Degré 3 : un ajustement raisonnable.");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Les deux courbes d'erreur",
        texte: "<p>Le signal central : l'erreur d'entraînement comparée à l'erreur de validation, en fonction de la complexité. Voici les courbes du fil rouge (EQM).</p>",
        objectif: "Lire le graphique et classer les affirmations.",
        installer: function (zone, api) {
          A.trace(zone, { xmin: 0, xmax: 9, ymin: 0, ymax: 0.7, gradX: [0, 3, 6, 9], gradY: [0, 0.35, 0.7], nomX: "degré", hauteur: 200,
            polylignes: [{ points: ET.map(function (e, d) { return [d, e]; }) }, { points: EV.map(function (e, d) { return [d, Math.min(e, 0.7)]; }), classe: "ref" }],
            points: [{ x: MEILLEUR, y: EV[MEILLEUR], classe: "courante", label: "validation min" }] });
          A.html(zone, "<p class='discret'>Trait plein : entraînement. Pointillés : validation (coupée à 0,7 ; elle vaut " + A.fmt(EV[9], 2) + " au degré 9).</p>");
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "L'erreur d'entraînement ne fait (presque) que baisser quand la complexité augmente.", vrai: true },
              { texte: "Il faut choisir le degré qui minimise l'erreur d'entraînement.", vrai: false, explication: "Non : ce serait le degré 9. On choisit avec la validation." },
              { texte: "Degrés 0 à 2 : les deux erreurs sont hautes, c'est probablement du sous-apprentissage.", vrai: true },
              { texte: "Degré 8 : erreur d'entraînement basse et validation bien plus haute, c'est probablement du sur-apprentissage.", vrai: true }
            ],
            surReussite: function () { api.valider("Les formes exactes dépendent du modèle, des données, de la métrique et de l'entraînement : ce sont des courbes schématiques."); }
          });
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Le tableau de diagnostic",
        texte: "<p>Le cours résume le diagnostic dans un tableau. Ne pas diagnostiquer sur un seul nombre : vérifier la métrique, une baseline, les courbes d'apprentissage, la qualité des données, et que train et validation représentent la même population.</p>",
        objectif: "Rattacher chaque situation à son interprétation probable.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["sous-apprentissage", "sur-apprentissage", "bon ajustement", "estimation instable"],
            items: [
              { texte: "Train haut, validation haute et proche", bonne: 0 },
              { texte: "Train bas, validation beaucoup plus haute", bonne: 1 },
              { texte: "Train bas, validation basse et proche (à comparer à une baseline utile)", bonne: 2 },
              { texte: "Train bas, validation très variable d'un découpage à l'autre", bonne: 3 }
            ],
            surReussite: function () { api.valider("Sous-apprentissage = biais élevé ; sur-apprentissage = variance élevée."); }
          });
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Biais et variance",
        texte:
          "<div class='formule'>Bias(x) = E[f̂(x)] − f(x)</div>" +
          "<p>Le <b>biais</b> est l'écart systématique entre la prédiction moyenne du modèle et la vraie relation (trop rigide : erreurs systématiques, même à l'entraînement). " +
          "La <b>variance</b> : trop souple, de petits changements de l'échantillon changent le modèle ajusté. Quand la complexité augmente, le biais² baisse souvent et la variance monte.</p>",
        objectif: "Comprendre pourquoi on élève le biais au carré.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Prédiction moyenne trop haute de 3 unités : biais² =", attendu: 9, placeholder: "ex. 4", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Trop basse de 3 unités : biais² =", attendu: 9, placeholder: "ex. 4", surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Pourquoi le carré ?", options: ["une erreur quadratique pénalise les écarts dans les deux sens de la même façon", "pour que le biais soit toujours plus grand que la variance", "parce que le biais est toujours négatif"], bonne: 0, surReussite: ok }); }
          ], "+3 et −3 donnent tous deux 9. Le but n'est ni le modèle le plus simple ni le plus complexe, mais la meilleure performance sur des données nouvelles.");
          A.note(zone, "Le cours précise que ces courbes biais / variance sont une illustration conceptuelle, pas une décomposition exacte valable pour toute situation d'apprentissage.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "La fuite de données",
        texte: "<div class='encadre'><span class='titre-encadre'>Définition (cours)</span>Il y a <b>fuite de données</b> quand une information qui ne serait pas légitimement disponible au moment de la prédiction influence l'entraînement, le prétraitement ou la sélection du modèle.</div>" +
          "<p>Le score peut paraître excellent sans refléter la performance sur des données vraiment nouvelles. La fuite est différente du sur-apprentissage, même si les deux embellissent les résultats.</p>",
        objectif: "Reconnaître les trois scénarios du cours.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["information future", "prétraitement", "doublons"],
            items: [
              { texte: "Prédire une résiliation avec un champ rempli seulement après la résiliation", bonne: 0 },
              { texte: "Calculer la moyenne de standardisation sur tout le jeu avant de découper", bonne: 1 },
              { texte: "Des enregistrements presque identiques d'une même personne dans le train et dans le test", bonne: 2 }
            ],
            surReussite: function () { api.valider("Prévention : découper d'abord ; ajuster les transformations sur le train seulement ; tester une seule fois sur un test intact ; respecter le temps et les groupes (découpage par personne, patient, appareil…)."); }
          });
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Régulariser",
        texte:
          "<div class='formule'>Objectif = perte d'entraînement + λ · pénalité</div>" +
          "<div class='formule lignes'>Ridge (L2) : L = MSE + α Σⱼ wⱼ²\nLasso (L1) : L = MSE + α Σⱼ |wⱼ|</div>" +
          "<p>Ridge rapproche les coefficients de zéro et garde en général toutes les variables ; Lasso peut en mettre exactement à zéro (sélection de variables). " +
          "Standardiser les variables avant (dans un pipeline) : les pénalités dépendent de l'échelle.</p>",
        objectif: "Répondre au « quick check » du cours.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "Un modèle Ridge sous-ajuste. On…", options: ["diminue alpha", "augmente alpha"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Pour LogisticRegression de scikit-learn, quelle valeur régularise le plus ?", options: ["C = 0,01", "C = 100"], bonne: 0, expliquer: ["Exact : plus C est petit, plus la régularisation est forte (l'inverse d'alpha).", "Non : grand C = régularisation faible."], surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Pourquoi ajuster le StandardScaler dans un pipeline pendant la validation croisée ?", options: ["pour éviter une fuite d'information entre les plis", "pour accélérer le calcul", "parce que Ridge l'exige pour converger"], bonne: 0, surReussite: ok }); }
          ], "Régulariser est un outil, pas une garantie : trop faible → sur-apprentissage possible, trop fort → sous-apprentissage. On règle λ (alpha, C) sur la validation ou par validation croisée.");
        }
      },

      /* 8 ─────────────────────────────────────────────── */
      {
        titre: "Train, validation, test",
        texte:
          "<p>Trois jeux, trois rôles : l'entraînement ajuste les paramètres ; la validation choisit le modèle et ses réglages ; le test sert à l'évaluation finale, une seule fois. " +
          "La validation croisée estime la performance sur plusieurs découpages (utile quand les données sont peu nombreuses) ; elle ne régularise pas le modèle et ne corrige ni une fuite ni un changement de distribution.</p>" +
          "<p>Le cas du cours : modèle 1 — train 72 %, validation 70 % ; modèle 2, plus complexe — train 98 %, validation 69 %.</p>",
        objectif: "Choisir le modèle et les prochaines étapes.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "Quel modèle a le plus de chances de mieux généraliser ?", options: ["le modèle 1", "le modèle 2"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "L'écart 98 % / 69 % du modèle 2 suggère…", options: ["un sur-apprentissage", "un sous-apprentissage", "une fuite de données certaine"], bonne: 0, surReussite: ok }); },
            function (b, ok) {
              A.cocher(b, {
                question: "Prochaines étapes avant de déployer (plusieurs réponses) :",
                options: ["vérifier l'incertitude sur plusieurs découpages", "regarder les métriques par classe et la qualité des données", "choisir le modèle d'après son score sur le test, puis le réévaluer sur ce même test", "évaluer une seule fois sur un test intact"],
                bonnes: [0, 1, 3],
                explication: "Choisir sur le test en fait une partie du réglage : le test n'est plus intact.",
                surReussite: ok
              });
            }
          ], "Diagnostiquer avec les deux erreurs ; sous-ajusté → améliorer le signal, la capacité ou l'optimisation ; sur-ajusté → contraindre, plus de données, valider proprement.");
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : erreurs train et validation toutes deux hautes → sous-apprentissage ; écart important → sur-apprentissage. " +
        "Vérifier d'abord les données et le découpage (fuites !). Ridge (L2) / Lasso (L1) : alpha grand = forte régularisation ; LogisticRegression : C petit = forte régularisation. Test : une seule fois, à la fin.</p>",
      cartes: "ajustement"
    }
  });
})();
