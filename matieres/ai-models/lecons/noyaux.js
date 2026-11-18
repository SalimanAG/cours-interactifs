/* Leçon : Noyaux et données non séparables (cours 7 « SVM », parties 1 à 3).
   Fil rouge : le motif XOR en bipolaire, puis deux observations (1, 2) et (3, −1) pour les noyaux,
   puis le pipeline Iris du cours (les nombres 100, 25 et 0,96 viennent du cours). */
(function () {
  "use strict";
  var A = AIM;
  /* XOR bipolaire : classe +1 si x₁ ≠ x₂. */
  var XOR = [[1, 1, -1], [-1, -1, -1], [1, -1, 1], [-1, 1, 1]];
  function sg(v) { return String(v).replace("-", "−"); }
  function planXor(zone, marquer) {
    var v = new Vecteurs(A.cadre(zone), { xmin: -2, xmax: 2, ymin: -2, ymax: 2, largeur: 240, grille: 1, axes: ["x₁", "x₂"] });
    v.dessiner({ points: XOR.map(function (p, i) { return { id: "x" + i, x: p[0], y: p[1], label: "(" + sg(p[0]) + ", " + sg(p[1]) + ")", classe: (marquer && marquer[i]) ? "courant" : (p[2] > 0 ? "plein" : "") }; }) });
    return v;
  }
  function rbf(g, d2) { return Math.exp(-g * d2); }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "noyaux",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Le motif XOR",
        texte: "<p>Cours : <i>XOR pattern: no single straight line separates classes</i>. Points pleins : classe +1 (x₁ ≠ x₂) ; creux : classe −1.</p>" +
          "<p>Idée du cours : représenter les données dans un espace (souvent de plus grande dimension) <span class='mono'>φ(x)</span> où elles deviennent peut-être linéairement séparables. " +
          "Essayons <span class='mono'>φ(x) = (x₁, x₂, x₁x₂)</span>.</p>",
        objectif: "Calculer la troisième coordonnée x₁x₂ de chaque point.",
        installer: function (zone, api) {
          planXor(zone);
          Exercices.associer(zone, {
            consigne: "x₁x₂ vaut…",
            categories: ["+1", "−1"],
            items: XOR.map(function (p) { return { texte: "(" + sg(p[0]) + ", " + sg(p[1]) + ")" + (p[2] > 0 ? " (classe +1)" : " (classe −1)"), bonne: p[0] * p[1] > 0 ? 0 : 1 }; }),
            surReussite: function () { api.valider("La classe +1 a toujours x₁x₂ = −1, la classe −1 a toujours x₁x₂ = +1."); }
          });
          A.note(zone, "Le cours dessine φ(x) sans donner de formule. Le choix φ(x) = (x₁, x₂, x₁x₂) est un exemple ajouté pour la leçon.");
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Séparable après transformation",
        texte: "<p>Dans l'espace φ, la troisième coordonnée x₃ = x₁x₂ suffit : <i>A linear separator may work after mapping</i>.</p>" +
          "<p>On cherche un hyperplan <span class='mono'>wᵀφ(x) + θ = 0</span> avec wᵀφ(x) + θ &gt; 0 pour la classe +1.</p>",
        objectif: "Choisir w et θ qui séparent, puis vérifier sur un point.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "Quel hyperplan sépare les quatre points φ(x) ?", options: ["w = (0, 0, −1), θ = 0 (le plan x₃ = 0)", "w = (1, 1, 0), θ = 0", "w = (1, 0, 0), θ = 0", "w = (0, 0, 1), θ = 0"], bonne: 0,
              explication: "Classe +1 : x₃ = −1 donne −x₃ = 1 > 0 ; classe −1 : −x₃ = −1 < 0. Avec (0, 0, 1) les signes sont inversés.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "wᵀφ(x) + θ pour x = (−1, 1) :", attendu: 1, placeholder: "ex. 0", indice: "φ(−1, 1) = (−1, 1, −1).", surReussite: ok }); }
          ], "Une frontière linéaire dans l'espace φ correspond à une frontière non linéaire (x₁x₂ = 0, les deux axes) dans l'espace de départ.");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Noyaux linéaire et polynomial",
        texte: "<p>Un noyau <span class='mono'>K(xᵢ, xⱼ)</span> mesure la similarité entre deux observations dans la représentation des caractéristiques ; on ne calcule pas φ explicitement.</p>" +
          "<div class='formule lignes'><span>linéaire : K(xᵢ, xⱼ) = xᵢᵀxⱼ</span><span>polynomial : K(xᵢ, xⱼ) = (xᵢᵀxⱼ + c)^d</span></div>" +
          "<p>Prenons xᵢ = (1, 2) et xⱼ = (3, −1).</p>",
        objectif: "Calculer les deux noyaux.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Linéaire : K =", attendu: 1, placeholder: "ex. 5", indice: "1·3 + 2·(−1).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Polynomial, c = 1, d = 2 : K =", attendu: 4, placeholder: "ex. 9", surReussite: ok }); }
          ], "Le noyau linéaire convient quand une frontière linéaire suffit ; c est une constante, d le degré.");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Le noyau RBF et γ",
        texte: "<div class='formule'>K(xᵢ, xⱼ) = exp(−γ ‖xᵢ − xⱼ‖²)</div>" +
          "<p>γ règle à quel point l'influence de chaque point d'apprentissage est locale. Courbe : K en fonction de la distance d = ‖xᵢ − xⱼ‖ ; fais varier γ.</p>",
        objectif: "Calculer K pour deux paires avec γ = 0,5, puis dire l'effet d'un grand γ.",
        installer: function (zone, api) {
          var g = 0.5;
          var tr = A.trace(zone, { xmin: 0, xmax: 4, ymin: 0, ymax: 1, gradX: [0, 1, 2, 3, 4], gradY: [0, 0.5, 1], nomX: "d", hauteur: 170, courbes: [{ f: function (d) { return rbf(g, d * d); }, classe: "courante" }] });
          A.curseur(zone, { label: "γ", min: 0.1, max: 5, pas: 0.1, valeur: 0.5, surChange: function (v) { g = v; tr.redessiner({ xmin: 0, xmax: 4, ymin: 0, ymax: 1, gradX: [0, 1, 2, 3, 4], gradY: [0, 0.5, 1], nomX: "d", hauteur: 170, courbes: [{ f: function (d) { return rbf(g, d * d); }, classe: "courante" }] }); } });
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "‖(1, 2) − (3, −1)‖² =", attendu: 13, placeholder: "ex. 5", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "K((1, 2), (3, −1)) avec γ = 0,5 ≈", attendu: rbf(0.5, 13), tolerance: 0.0002, placeholder: "ex. 0,1", indice: "exp(−6,5).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "K((1, 2), (1,5, 2)) avec γ = 0,5 ≈", attendu: rbf(0.5, 0.25), tolerance: 0.001, placeholder: "ex. 0,5", surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "γ grand :", options: ["influence très locale : frontière complexe, risque de sur-apprentissage", "influence large : frontière lisse, presque linéaire", "aucun effet sur la frontière"], bonne: 0, surReussite: ok }); }
          ], "Proches : K ≈ 1 ; éloignés : K ≈ 0. Petit γ : frontière plus lisse. Noyau et paramètres se choisissent par validation ou validation croisée.");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Un premier SVM avec scikit-learn",
        texte: "<p>Le cours garde deux espèces d'iris (setosa = 0, versicolor = 1, soit 100 fleurs) et deux mesures (longueur et largeur du sépale).</p>" +
          A.code('keep = iris.target < 2\nX = iris.data[keep, :2]\ny = iris.target[keep]\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.25, random_state=42, stratify=y)\nmodel = make_pipeline(StandardScaler(),\n    SVC(kernel="rbf", C=1.0, gamma="scale"))\nmodel.fit(X_train, y_train)'),
        objectif: "Remettre le flux dans l'ordre, puis lire les nombres.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.ordonner(b, { consigne: "Le flux complet du cours :", items: ["charger les données", "découper (train / test)", "mettre à l'échelle + entraîner", "prédire", "évaluer"], surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Taille du jeu de test :", attendu: 25, placeholder: "ex. 30", indice: "25 % de 100.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Accuracy 0,96 : fleurs de test bien classées =", attendu: 24, placeholder: "ex. 20", surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Pourquoi un pipeline avec StandardScaler ?", options: ["les SVM sont sensibles aux échelles, et le pipeline évite toute fuite du test (moyennes et écarts-types estimés sur l'entraînement)", "pour accélérer predict", "pour que stratify fonctionne"], bonne: 0, surReussite: ok }); }
          ], "Le cours propose ensuite d'essayer kernel=\"linear\" et de comparer les régions de décision et le score.");
          A.note(zone, "« 24 sur 25 » est déduit de 0,96 et de test_size = 0,25 sur 100 fleurs ; le cours donne seulement 96 %.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Quand choisir un SVM ?",
        texte: "<p>Message du cours : les SVM restent des modèles spécialisés utiles, pas un choix par défaut.</p>",
        objectif: "Associer chaque situation au point de départ du tableau du cours, puis juger les limites.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.associer(b, {
              categories: ["SVM linéaire", "SVM RBF", "One-Class SVM", "Deep learning", "Boosting"],
              items: [
                { texte: "Texte en grande dimension, creux", bonne: 0 },
                { texte: "Petit jeu de données, motifs non linéaires", bonne: 1 },
                { texte: "Détection d'anomalies, données surtout normales", bonne: 2 },
                { texte: "Très grand jeu d'images ou de sons bruts", bonne: 3 },
                { texte: "Grand jeu tabulaire d'entreprise", bonne: 4 }
              ], surReussite: ok }); },
            function (b, ok) { Exercices.vraiFaux(b, { items: [
              { texte: "Un SVM à noyau devient coûteux à entraîner quand le nombre d'exemples grandit.", vrai: true },
              { texte: "Un SVC donne directement des probabilités bien calibrées.", vrai: false, explication: "Il faut une étape de calibration supplémentaire." },
              { texte: "Le choix du noyau et la régularisation influencent fortement les résultats.", vrai: true },
              { texte: "SVR est la version des SVM pour la régression.", vrai: true }
            ], surReussite: ok }); }
          ], "Ce sont des points de départ, pas des règles : comparer les modèles par validation croisée avec des métriques adaptées.");
        }
      }
    ],
    fin: { texte: "<p>À retenir : un noyau mesure une similarité dans un espace transformé ; linéaire <span class='mono'>xᵢᵀxⱼ</span>, polynomial <span class='mono'>(xᵢᵀxⱼ + c)^d</span>, RBF <span class='mono'>exp(−γ‖xᵢ − xⱼ‖²)</span> ; mettre à l'échelle dans un pipeline et régler noyau, C et γ par validation croisée.</p>", cartes: "svm" }
  });
})();
