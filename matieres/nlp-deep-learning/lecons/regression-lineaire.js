/* Leçon 1.3 : Régression linéaire, MSE, RMSE (cours 1, diapos 16 à 20).
   Fil rouge : 5 observations (x, y) = (1, 2), (2, 3), (3, 5), (4, 4), (5, 6). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var PTS = [[1, 2], [2, 3], [3, 5], [4, 4], [5, 6]];
  function mse(a, b) { return PTS.reduce(function (s, p) { var e = a * p[0] + b - p[1]; return s + e * e; }, 0) / PTS.length; }
  function plan(zone, a, b, residus) {
    var v = new Vecteurs(N.cadre(zone), { xmin: -0.5, xmax: 6, ymin: -0.5, ymax: 7, axes: ["x", "y"], pas: 0 });
    var seg = [];
    if (a !== null) seg.push({ x1: -0.5, y1: a * -0.5 + b, x2: 6, y2: a * 6 + b, classe: "pleine" });
    if (residus) PTS.forEach(function (p) { seg.push({ x1: p[0], y1: p[1], x2: p[0], y2: a * p[0] + b }); });
    v.dessiner({ points: PTS.map(function (p) { return { x: p[0], y: p[1], classe: "plein" }; }), segments: seg });
    return v;
  }
  /* la droite en trait plein (les segments de vecteurs.js sont en pointillés par défaut) */
  var st = document.createElement("style"); st.textContent = ".vecteurs .seg.pleine{stroke:var(--accent);stroke-width:2.4;stroke-dasharray:none}"; document.head.appendChild(st);

  var etapes = [
    {
      titre: "Un phénomène, des observations, du bruit",
      texte:
        "<p>Le cours 1 (diapo 16) : on observe un phénomène et on suppose <span class='mono'>Y = X · θ + N</span>, c'est-à-dire pour un seul x : " +
        "<span class='mono'>y = a·x + b + bruit</span>. On cherche θ = (a ; b) pour que la prédiction <span class='mono'>ŷ = a·x + b</span> soit « aussi proche que possible » des points.</p>",
      objectif: "Identifier le rôle du bruit N.",
      installer: function (zone, api) {
        plan(zone, null, 0, false);
        Exercices.choix(zone, { question: "Pourquoi les points ne sont-ils pas exactement alignés ?", options: ["À cause du bruit N : des variations que le modèle linéaire n'explique pas.", "Parce que θ est faux.", "Parce qu'il manque des points."], bonne: 0, expliquer: ["Exact : même la meilleure droite ne passera pas par tous les points.", "Non : même avec le meilleur θ, il restera des écarts.", "Non : plus de points ne supprimerait pas les écarts."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Chercher la droite à la main",
      texte:
        "<p>Règle a (la pente) et b (l'ordonnée à l'origine). Pour juger la position de la droite, on mesure l'écart moyen au carré, la <b>MSE</b> (étape suivante) : elle s'affiche sous la figure.</p>",
      objectif: "Obtenir une MSE inférieure à 0,5.",
      tester: function (z) { var r = z.querySelectorAll("input[type=range]"); r[0].value = "0.9"; r[0].dispatchEvent(new Event("input")); r[1].value = "1.3"; r[1].dispatchEvent(new Event("input")); },
      installer: function (zone, api) {
        var a = 0.3, b = 3, boite = N.el("div"), leg;
        zone.appendChild(boite);
        function maj() {
          boite.innerHTML = ""; plan(boite, a, b, true); leg = N.legende(boite);
          var e = mse(a, b);
          leg.innerHTML = "<span>ŷ = " + m(fmt(a, 1) + "·x + " + fmt(b, 1)) + "</span><span>MSE = " + m(fmt(e, 3)) + "</span>";
          if (e < 0.5) { api.retour("MSE = " + fmt(e, 3) + ".", true); api.valider("Le minimum possible ici est 0,38 (a = 0,9 ; b = 1,3). On a mesuré la qualité, puis bougé la droite : c'est le cycle du cours (diapo 19)."); }
        }
        N.curseur(zone, { label: "a =", min: -1, max: 2, pas: 0.1, valeur: a, surChange: function (x) { a = x; maj(); } });
        N.curseur(zone, { label: "b =", min: -1, max: 5, pas: 0.1, valeur: b, surChange: function (x) { b = x; maj(); } });
        maj();
      }
    },
    {
      titre: "La fonction de perte : MSE",
      texte:
        "<p>Le cours (diapo 20) mesure la position de la droite par une <b>fonction de perte</b> à minimiser :</p>" +
        "<div class='formule'>MSE(X, h_θ) = (1/n) Σᵢ [h_θ(x⁽ⁱ⁾) − y⁽ⁱ⁾]²</div>" +
        "<p>Mean Squared Error, la moyenne du carré des erreurs. Chaque <b>résidu</b> (trait pointillé) est l'écart entre la prédiction et le point. Prenons a = 1 et b = 1.</p>",
      objectif: "Calculer la MSE pour ŷ = x + 1.",
      installer: function (zone, api) {
        plan(zone, 1, 1, true);
        N.html(zone, N.tableau(["x", "y", "ŷ = x + 1", "(ŷ − y)²"], PTS.map(function (p) { return [p[0], p[1], p[0] + 1, "?"]; })));
        Exercices.nombre(zone, { label: "MSE =", attendu: mse(1, 1), tolerance: 1e-9, placeholder: "ex. 0,5", indice: "Les carrés valent 0, 0, 1, 1, 0. Divise leur somme par n = 5.", bravo: "2 / 5 = 0,4.", surReussite: function () { api.valider("Le carré rend toutes les erreurs positives et pénalise fortement les grosses erreurs."); } });
      }
    },
    {
      titre: "RMSE : revenir à l'unité de y",
      texte:
        "<div class='formule'>RMSE = √MSE</div>" +
        "<p>Root Mean Square Error : la MSE est en « unités de y au carré » ; sa racine est dans la même unité que y, plus facile à interpréter (« on se trompe d'environ… »).</p>",
      objectif: "Calculer la RMSE de ŷ = x + 1, à 0,01 près.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "RMSE ≈", attendu: Math.sqrt(0.4), tolerance: 0.01, placeholder: "ex. 0,5", bravo: "√0,4 ≈ 0,63 : une erreur typique d'environ 0,63 unité de y.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Une solution directe… coûteuse",
      texte:
        "<p>Le cours (diapo 18) : bonne nouvelle, il existe une <b>solution directe</b> (l'équation normale) ; mauvaise nouvelle, sa complexité est en n³.</p>" +
        "<div class='formule'>θ̂ = (Xᵀ · X)⁻¹ · Xᵀ · Y</div>" +
        "<div class='signalement'>La diapo écrit « X⁻ᵀ » : c'est une coquille pour Xᵀ (transposée). Elle ne précise pas ce que désigne n dans n³ : le coût vient de l'inversion de XᵀX, " +
        "une matrice carrée dont la taille est le nombre de caractéristiques (plus le biais).</div>" +
        "<p>Ici, θ̂ donne a = 0,9 et b = 1,3 (MSE 0,38).</p>",
      objectif: "Dire pourquoi on préfère souvent une méthode itérative.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Avec des dizaines de milliers de caractéristiques (un vocabulaire TF-IDF de 30 000 termes, par exemple)…", options: ["inverser XᵀX devient très coûteux : on optimise plutôt pas à pas (descente de gradient)", "l'équation normale devient plus rapide", "on ne peut plus définir de perte"], bonne: 0, expliquer: ["Exact. Et pour un réseau de neurones, il n'existe de toute façon pas de solution directe.", "Non : le coût augmente comme le cube de la taille.", "Non : la MSE reste définie."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Autres métriques de régression : MAE et R²",
      texte:
        "<p>Le cours cite MAE, MSE, RMSE et R² (diapo 13) ; définitions (complément) :</p>" +
        N.tableau(["métrique", "formule", "lecture"], [[m("MAE"), m("(1/n) Σ |ŷᵢ − yᵢ|"), "erreur absolue moyenne, moins sensible aux grosses erreurs"], [m("R²"), m("1 − Σ(ŷᵢ − yᵢ)² / Σ(yᵢ − ȳ)²"), "part de la variation de y expliquée ; 1 = parfait, 0 = pas mieux que prédire la moyenne ȳ"]]) +
        "<p>Pour ŷ = x + 1 : ȳ = 4, Σ(yᵢ − ȳ)² = 4 + 1 + 1 + 0 + 4 = 10.</p>",
      objectif: "Calculer la MAE puis le R² de ŷ = x + 1.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "MAE =", attendu: 0.4, placeholder: "ex. 0,5", indice: "Erreurs absolues : 0, 0, 1, 1, 0.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "R² =", attendu: 0.8, placeholder: "ex. 0,5", indice: "Somme des carrés des erreurs = 2 ; 1 − 2/10.", surReussite: ok }); }
        ], "R² = 0,8 : la droite explique 80 % de la variation de y.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "regression-lineaire", etapes: etapes,
    fin: { texte: "<ul><li>Modèle : Y = X·θ + N ; prédiction ŷ = a·x + b.</li><li>MSE = (1/n) Σ (ŷ − y)² ; RMSE = √MSE (unité de y).</li><li>Équation normale θ̂ = (XᵀX)⁻¹XᵀY : directe mais coûteuse (inversion).</li><li>MAE = moyenne des |erreurs| ; R² = 1 − SS_rés / SS_tot.</li></ul>", cartes: "rappels-optimisation" }
  });
})();
