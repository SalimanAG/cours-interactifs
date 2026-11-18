/* Leçon : La marge maximale (cours 7 « Support Vector Machines », partie 1).
   Fil rouge : 8 points du plan, inventés pour la leçon. Classe +1 (pleins) : (3,3), (5,3), (4,5), (5,5) ;
   classe −1 (creux) : (1,1), (0,2), (2,−1), (−1,1). Hyperplan optimal : x₁ + x₂ = 4, soit w = (½, ½), θ = −2. */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var PTS = [[3, 3, 1], [5, 3, 1], [4, 5, 1], [5, 5, 1], [1, 1, -1], [0, 2, -1], [2, -1, -1], [-1, 1, -1]];
  var XMIN = -2, XMAX = 6, YMIN = -2, YMAX = 6;
  function nom(p) { return "(" + A.fmt(p[0]) + ", " + A.fmt(p[1]) + ")"; }
  /* Segment de la droite w₁x₁ + w₂x₂ + c = 0, coupé au cadre. */
  function droite(w, c, classe) {
    var pts = [];
    if (Math.abs(w[1]) > 1e-12) { [XMIN, XMAX].forEach(function (x) { pts.push([x, -(w[0] * x + c) / w[1]]); }); }
    else if (Math.abs(w[0]) > 1e-12) { pts = [[-c / w[0], YMIN], [-c / w[0], YMAX]]; }
    if (pts.length < 2) return null;
    // couper verticalement
    function clip(p, q) {
      var t0 = 0, t1 = 1, dx = q[0] - p[0], dy = q[1] - p[1];
      [[-dy, p[1] - YMIN], [dy, YMAX - p[1]]].forEach(function (c2) { if (c2[0] === 0) return; var t = c2[1] / c2[0]; if (c2[0] < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t); });
      if (t0 > t1) return null;
      return { x1: p[0] + dx * t0, y1: p[1] + dy * t0, x2: p[0] + dx * t1, y2: p[1] + dy * t1, classe: classe };
    }
    return clip(pts[0], pts[1]);
  }
  function plan(zone, w, th, opts) {
    opts = opts || {};
    var v = new Vecteurs(A.cadre(zone), { xmin: XMIN, xmax: XMAX, ymin: YMIN, ymax: YMAX, largeur: 300, grille: 1, axes: ["x₁", "x₂"] });
    function dessiner(w, th, marquer) {
      var segs = [];
      if (w) {
        var d = droite(w, th, "plein"); if (d) segs.push(d);
        if (opts.marges) { [1, -1].forEach(function (k) { var m = droite(w, th - k); if (m) segs.push(m); }); }
      }
      v.dessiner({ segments: segs, points: PTS.map(function (p, i) { return { id: "p" + i, x: p[0], y: p[1], classe: (marquer && marquer[i]) ? "courant" : (p[2] > 0 ? "plein" : "") }; }) });
    }
    dessiner(w, th, opts.marquer);
    return dessiner;
  }
  function reglages(zone, valeurs, noms, pas, surChange) {
    var r = el("div", "neurone-reglages"); r.style.display = "flex"; r.style.flexWrap = "wrap"; r.style.gap = ".4rem .9rem"; r.style.justifyContent = "center";
    var spans = valeurs.map(function (v, i) {
      var g = el("div"); g.style.display = "flex"; g.style.alignItems = "center"; g.style.gap = ".25rem";
      g.appendChild(el("span", "discret", noms[i]));
      var m = el("button", "btn btn-petit", "−"), s = el("span", "mono", A.fmt(v)), p = el("button", "btn btn-petit", "+");
      m.type = p.type = "button"; s.style.minWidth = "2.6rem"; s.style.textAlign = "center";
      m.onclick = function () { valeurs[i] = Math.round((valeurs[i] - pas) * 100) / 100; s.textContent = A.fmt(valeurs[i]); surChange(valeurs); };
      p.onclick = function () { valeurs[i] = Math.round((valeurs[i] + pas) * 100) / 100; s.textContent = A.fmt(valeurs[i]); surChange(valeurs); };
      g.appendChild(m); g.appendChild(s); g.appendChild(p); r.appendChild(g); return s;
    });
    zone.appendChild(r);
    return spans;
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "marge-maximale",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Un hyperplan séparateur",
        texte: "<p>En apprentissage supervisé, un <b>hyperplan séparateur</b> est une frontière de décision qui sépare les points de classes différentes. " +
          "Un hyperplan est défini par <span class='mono'>wᵀx + θ = 0</span> ; en 2D, <span class='mono'>w₁x₁ + w₂x₂ + θ = 0</span>, une droite. " +
          "Le <b>signe</b> de l'expression donne le côté prédit.</p>" +
          "<p>Ici w = (½, ½), θ = −2 : la droite x₁ + x₂ = 4.</p>",
        objectif: "Donner le signe de wᵀx + θ pour quatre points.",
        installer: function (zone, api) {
          plan(zone, [0.5, 0.5], -2);
          Exercices.associer(zone, {
            categories: ["> 0", "< 0", "= 0"],
            items: [{ texte: "(5, 3)", bonne: 0 }, { texte: "(0, 2)", bonne: 1 }, { texte: "(2, 2)", bonne: 2 }, { texte: "(4, 5)", bonne: 0 }],
            surReussite: function () { api.valider("(5, 3) : 4 − 2 = 2 > 0 ; (0, 2) : 1 − 2 = −1 < 0 ; (2, 2) est sur la droite."); }
          });
          A.note(zone, "Le cours SVM écrit l'hyperplan wᵀx <b>+</b> θ = 0, alors que les neurones à seuil utilisaient Σ wᵢxᵢ <b>−</b> θ. C'est la même idée, avec un signe différent pour θ.");
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Une infinité de séparateurs",
        texte: "<p>Si les données sont linéairement séparables, il peut exister une infinité d'hyperplans séparateurs. Points pleins : classe +1 ; points creux : classe −1. " +
          "Règle w₁, w₂ et θ pour que tous les points +1 soient du côté wᵀx + θ &gt; 0 et tous les −1 du côté &lt; 0.</p>",
        objectif: "Trouver un hyperplan qui sépare les 8 points.",
        installer: function (zone, api) {
          var val = [1, 0, 0];
          var redess = plan(zone, [1, 0], 0);
          var info = A.legende(zone);
          function maj(v) {
            var mal = PTS.filter(function (p) { return p[2] * (v[0] * p[0] + v[1] * p[1] + v[2]) <= 0; });
            redess([v[0], v[1]], v[2], PTS.map(function (p) { return mal.indexOf(p) >= 0; }));
            info.innerHTML = "<span>" + mal.length + " point(s) mal placé(s) (en couleur)</span>";
            if (!mal.length) { api.retour("Séparé.", true); api.valider("Il y en a beaucoup d'autres. Lequel choisir ? Principe des SVM : celui qui maximise la marge entre les deux classes."); }
          }
          reglages(zone, val, ["w₁", "w₂", "θ"], 0.5, maj);
          maj(val);
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Étiquettes ±1 et vecteurs de support",
        texte: "<p>On note yᵢ ∈ {+1, −1}. Les contraintes de séparation s'écrivent</p>" +
          "<div class='formule'>yᵢ (wᵀxᵢ + θ) ≥ 1</div>" +
          "<p>et les bords de la marge sont <span class='mono'>wᵀx + θ = +1</span> et <span class='mono'>wᵀx + θ = −1</span> (pointillés). " +
          "Les points d'apprentissage les plus proches, sur ces bords, sont les <b>vecteurs de support</b>. Ici w = (½, ½), θ = −2.</p>",
        objectif: "Calculer yᵢ(wᵀxᵢ + θ) pour deux points, puis cocher les vecteurs de support.",
        installer: function (zone, api) {
          plan(zone, [0.5, 0.5], -2, { marges: true });
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Pour (5, 3), y = +1 :", attendu: 2, placeholder: "ex. 1", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Pour (2, −1), y = −1 :", attendu: 1.5, placeholder: "ex. 1", indice: "−1 × (0,5 − 2).", surReussite: ok }); },
            function (b, ok) { A.cocher(b, { question: "Vecteurs de support (yᵢ(wᵀxᵢ + θ) = 1) :", options: PTS.map(nom), bonnes: [0, 4, 5], explication: "(3, 3), (1, 1) et (0, 2) sont sur les bords de la marge.", surReussite: ok }); }
          ], "Les autres points vérifient la contrainte avec une inégalité stricte : ils ne « touchent » pas la marge.");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "La largeur de la marge",
        texte: "<p>La distance entre les deux bords wᵀx + θ = ±1 vaut</p><div class='formule'>marge = 2 / ‖w‖</div>",
        objectif: "Calculer ‖w‖ puis la marge pour w = (½, ½).",
        installer: function (zone, api) {
          plan(zone, [0.5, 0.5], -2, { marges: true });
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "‖w‖ ≈", attendu: Math.SQRT1_2, tolerance: 0.002, placeholder: "ex. 0,5", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "marge ≈", attendu: 2 / Math.SQRT1_2, tolerance: 0.005, placeholder: "ex. 2", surReussite: ok }); }
          ], "2√2 ≈ 2,83 : c'est exactement la distance entre (1, 1) et (3, 3).");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Maximiser la marge = minimiser ½‖w‖²",
        texte: "<p>Pour des données linéairement séparables, maximiser la marge 2/‖w‖ revient à</p>" +
          "<div class='formule'>minimiser ½ ‖w‖²  sous les contraintes  yᵢ (wᵀxᵢ + θ) ≥ 1</div>" +
          "<p>Comparons à la droite verticale x₁ = 2,5, écrite sous forme canonique (les points les plus proches à ±1) : w = (2, 0), θ = −5.</p>",
        objectif: "Calculer la marge de ce second séparateur et choisir le meilleur.",
        installer: function (zone, api) {
          plan(zone, [2, 0], -5, { marges: true });
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Marge de w = (2, 0) :", attendu: 1, placeholder: "ex. 2", surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Lequel choisit le SVM ?", options: ["x₁ + x₂ = 4 : ½‖w‖² = 0,25", "x₁ = 2,5 : ½‖w‖² = 2"], bonne: 0, surReussite: ok }); }
          ], "Le plus petit ½‖w‖² donne la plus grande marge (2,83 contre 1).");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Ce qui compte : les vecteurs de support",
        texte: "<p>Le SVM trouve l'hyperplan séparateur à partir des vecteurs de support.</p>",
        objectif: "Prévoir l'effet de déplacements de points.",
        installer: function (zone, api) {
          plan(zone, [0.5, 0.5], -2, { marges: true });
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "Déplacer (5, 5) vers (6, 4) (il reste loin de la marge) ne change pas l'hyperplan.", vrai: true, explication: "Ce n'est pas un vecteur de support." },
              { texte: "Rapprocher (3, 3) de la droite change l'hyperplan optimal.", vrai: true, explication: "C'est un vecteur de support : la marge diminue." },
              { texte: "Ajouter un point −1 en (−2, −2) change l'hyperplan.", vrai: false, explication: "Il est loin, du bon côté." },
              { texte: "Tous les points d'apprentissage ont le même poids dans la solution.", vrai: false, explication: "Seuls les vecteurs de support la déterminent." }
            ],
            surReussite: function () { api.valider("Les points éloignés ne pèsent pas : seuls les plus proches définissent la marge."); }
          });
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Et si on ne peut pas séparer ?",
        texte: "<p>Deux réponses dans le cours : l'<b>astuce du noyau</b> (leçon suivante), et le paramètre <span class='mono'>C</span> de scikit-learn, qui « contrôle la pénalité des erreurs d'entraînement ; " +
          "de grandes valeurs ajustent en général les points d'entraînement plus strictement ».</p>",
        objectif: "Dire l'effet de C.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "C très grand :", options: ["les points d'entraînement sont ajustés plus strictement (forte pénalité des erreurs)", "les erreurs d'entraînement ne sont plus pénalisées", "C n'a d'effet qu'avec le noyau linéaire"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Comment choisir C ?", options: ["par validation ou validation croisée", "le plus grand possible", "C = 1, toujours"], bonne: 0, surReussite: ok }); }
          ], "C règle la pénalité des erreurs d'entraînement : trop strict, on retrouve le risque de sur-apprentissage du chapitre 6 ; c'est un hyperparamètre à choisir sur la validation.");
          A.note(zone, "L'article sur la reconnaissance de visages introduit des variables d'écart (cas non séparable, équations 13 à 17) ; ce passage est barré dans ton exemplaire, et le cours n'en donne pas la formule. " +
            "La leçon s'en tient à l'effet de C décrit par le cours.");
        }
      }
    ],
    fin: { texte: "<p>À retenir : <span class='mono'>yᵢ(wᵀxᵢ + θ) ≥ 1</span>, marge <span class='mono'>2/‖w‖</span>, donc minimiser <span class='mono'>½‖w‖²</span> ; les vecteurs de support sont sur les bords wᵀx + θ = ±1 et déterminent l'hyperplan.</p>", cartes: "svm" }
  });
})();
