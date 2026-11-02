/* Leçon 0.1 : Vecteurs, produit scalaire, norme, cosinus (prérequis, hors diapos
   sauf : produit scalaire — cours 1, diapos 16 à 24 ; cosinus — cours 2, diapos 25-26 ;
   neurone — cours 1, diapo 28).
   Fil rouge : un avis de film décrit par x = (nombre de « great », nombre de « bad »),
   puis par une 3e coordonnée (nombre de « ! »), et un vecteur de poids w. */
(function () {
  "use strict";
  var el = Site.el;
  var V = Vecteurs;
  var fmt = V.fmt;
  var AVIS = "Great movie, great cast, but a bad ending!";

  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function legende(zone) { var p = el("p", "legende-figure"); zone.appendChild(p); return p; }
  function html(zone, contenu, classe) { var d = el("div", classe || ""); d.innerHTML = contenu; zone.appendChild(d); return d; }
  function m(t) { return "<span class='mono'>" + t + "</span>"; }
  function par(v) { return v < 0 ? "(" + fmt(v) + ")" : fmt(v); }
  function vec(a) { return "(" + a.map(function (v) { return fmt(v, 2); }).join(" ; ") + ")"; }
  function avis() {
    return "<div class='encadre'><span class='titre-encadre'>L'avis du fil rouge</span>« " +
      AVIS.replace(/(great|Great)/g, "<b>$1</b>").replace(/bad/, "<b>bad</b>") + " »</div>";
  }
  /* Pour les tests automatiques : simule un appui sur le plan au point (x, y). */
  function toucher(z, x, y) {
    var s = z.querySelector("svg.vecteurs"), u = (320 - 28) / 6, q = s.createSVGPoint();
    q.x = 14 + (x + 1) * u; q.y = 14 + (3 - y) * u;
    var c = q.matrixTransform(s.getScreenCTM());
    ["pointerdown", "pointerup"].forEach(function (t) { s.dispatchEvent(new PointerEvent(t, { clientX: c.x, clientY: c.y, bubbles: true, pointerId: 1 })); });
  }
  var PLAN = { xmin: -1, xmax: 5, ymin: -3, ymax: 3, axes: ["great", "bad"] };
  function plan(zone, extra) {
    var o = {}; for (var k in PLAN) o[k] = PLAN[k];
    for (k in extra) o[k] = extra[k];
    return new V(cadre(zone), o);
  }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Un vecteur, une liste de nombres",
      texte:
        "<p>Un modèle ne lit pas du texte : il lit des <b>nombres</b>. La façon la plus simple de décrire un avis par des nombres est de compter des mots choisis.</p>" +
        avis() +
        "<p>Un <b>vecteur</b> est une liste ordonnée de nombres, ses <b>coordonnées</b>. Ici on décrit l'avis par x = (nombre de « great », nombre de « bad ») : " +
        "un vecteur à 2 coordonnées, qu'on dessine comme une flèche partant de l'origine (0 ; 0).</p>" +
        "<p>Fais glisser la pointe de la flèche <b>x</b> (ou touche le plan à l'endroit voulu).</p>",
      objectif: "Placer x à la position qui décrit l'avis.",
      tester: function (z) { toucher(z, 2, 1); },
      installer: function (zone, api) {
        var x = { x: 1, y: 2 };
        var leg;
        var p = plan(zone, { pas: 1, actif: "x", onDeplacer: function (id, a, b) { x.x = a; x.y = b; maj(); } });
        leg = legende(zone);
        function maj() {
          p.dessiner({ vecteurs: [{ id: "x", x: x.x, y: x.y, label: "x", classe: "courant", deplacable: true }] });
          leg.innerHTML = "<span>x = " + m(vec([x.x, x.y])) + "</span>";
          if (x.x === 2 && x.y === 1) {
            api.retour("x = (2 ; 1) : 2 fois « great », 1 fois « bad ». L'ordre des coordonnées compte : (1 ; 2) décrirait un autre avis.", true);
            api.valider("Un vecteur de dimension n est une liste de n nombres. Le cours en manipule de très grandes dimensions (une coordonnée par mot du vocabulaire, ou 768 dimensions pour un embedding).");
          } else if (x.x === 1 && x.y === 2) {
            api.retour("", null);
          } else {
            api.retour("x = " + vec([x.x, x.y]) + ". Compte de nouveau : la 1re coordonnée est le nombre de « great », la 2e le nombre de « bad ».", false);
          }
        }
        maj();
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Additionner, multiplier par un nombre",
      texte:
        "<p>On calcule <b>coordonnée par coordonnée</b> :</p>" +
        "<div class='formule'>x + w = (x₁ + w₁ ; x₂ + w₂)<br>2·x = (2·x₁ ; 2·x₂)</div>" +
        "<p>Ici w = (1 ; −1). Déplace la flèche <b>s</b> pour qu'elle vaille d'abord <b>x + w</b>, puis <b>2·x</b>.</p>",
      objectif: "Construire x + w, puis 2·x.",
      tester: function (z) { toucher(z, 3, 0); toucher(z, 4, 2); },
      installer: function (zone, api) {
        var s = { x: 0, y: 2 }, phase = 0;
        var p = plan(zone, { pas: 1, actif: "s", onDeplacer: function (id, a, b) { s.x = a; s.y = b; maj(); } });
        var leg = legende(zone);
        var cibles = [{ x: 3, y: 0, nom: "x + w" }, { x: 4, y: 2, nom: "2·x" }];
        function maj() {
          p.dessiner({
            vecteurs: [
              { id: "x", x: 2, y: 1, label: "x" },
              { id: "w", x: 1, y: -1, label: "w", classe: "pale" },
              { id: "s", x: s.x, y: s.y, label: "s", classe: "courant", deplacable: true }
            ],
            segments: phase === 0 ? [] : [{ x1: 0, y1: 0, x2: 4, y2: 2 }]
          });
          leg.innerHTML = "<span>cible : " + m(phase < 2 ? cibles[Math.min(phase, 1)].nom : "—") + "</span><span>s = " + m(vec([s.x, s.y])) + "</span>";
          if (phase === 0 && s.x === 3 && s.y === 0) {
            phase = 1;
            api.retour("x + w = (2 + 1 ; 1 + (−1)) = (3 ; 0). Maintenant, place s sur 2·x.", true);
            maj();
          } else if (phase === 1 && s.x === 4 && s.y === 2) {
            phase = 2;
            api.retour("2·x = (4 ; 2) : même direction que x, deux fois plus long. Multiplier par un nombre étire (ou retourne, si le nombre est négatif) sans changer la droite.", true);
            api.valider("Ces deux opérations se font coordonnée par coordonnée, quelle que soit la dimension.");
            leg.innerHTML = "<span>s = " + m(vec([s.x, s.y])) + "</span>";
          }
        }
        maj();
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le produit scalaire : une somme de produits",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Produit scalaire (cours 1)</span>" +
        "Il n'utilise que deux opérations, l'addition et la multiplication. À partir de deux vecteurs, il produit <b>un seul nombre réel</b>." +
        "<div class='formule'>x · w = x₁w₁ + x₂w₂ + … + xₙwₙ = Σᵢ xᵢ wᵢ</div></div>" +
        "<p>On ajoute à l'avis une 3e coordonnée : le nombre de « ! ». Donc x = (2 ; 1 ; 1). " +
        "Un vecteur de <b>poids</b> dit combien chaque coordonnée compte : w = (1 ; −1 ; 0,5) (« great » pousse vers le positif, « bad » vers le négatif).</p>",
      objectif: "Calculer x · w.",
      installer: function (zone, api) {
        html(zone, "<table class='tableau'><tr><th>i</th><th class='num'>xᵢ</th><th class='num'>wᵢ</th><th class='num'>xᵢ · wᵢ</th></tr>" +
          "<tr><td>1 (great)</td><td class='num'>2</td><td class='num'>1</td><td class='num'>?</td></tr>" +
          "<tr><td>2 (bad)</td><td class='num'>1</td><td class='num'>−1</td><td class='num'>?</td></tr>" +
          "<tr><td>3 (!)</td><td class='num'>1</td><td class='num'>0,5</td><td class='num'>?</td></tr></table>");
        Exercices.nombre(zone, {
          label: "x · w =", attendu: 1.5, tolerance: 1e-9, placeholder: "ex. 2,5",
          indice: "Multiplie ligne par ligne, puis additionne les trois produits.",
          bravo: "2·1 + 1·(−1) + 1·0,5 = 2 − 1 + 0,5 = 1,5.",
          surReussite: function () { api.valider("Le produit scalaire de deux vecteurs de même dimension est un nombre, pas un vecteur."); }
        });
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "La norme : la longueur d'un vecteur",
      texte:
        "<p>La <b>norme</b> (euclidienne) d'un vecteur est sa longueur. C'est le théorème de Pythagore, et c'est un produit scalaire du vecteur avec lui-même :</p>" +
        "<div class='formule'>‖x‖ = √(x · x) = √(x₁² + x₂² + … + xₙ²)</div>" +
        "<div class='signalement'>Le cours utilise ‖x‖ dans la formule du cosinus (cours 2, diapos 25-26) sans la définir : cette définition est un complément.</div>" +
        "<p>On revient à x = (2 ; 1). Les pointillés montrent les deux côtés de l'angle droit.</p>",
      objectif: "Calculer ‖x‖ pour x = (2 ; 1), à 0,01 près.",
      installer: function (zone, api) {
        var p = plan(zone, {});
        p.dessiner({
          vecteurs: [{ id: "x", x: 2, y: 1, label: "x", classe: "courant" }],
          segments: [{ x1: 0, y1: 0, x2: 2, y2: 0 }, { x1: 2, y1: 0, x2: 2, y2: 1 }]
        });
        legende(zone).innerHTML = "<span>côtés : " + m("2") + " et " + m("1") + "</span>";
        Exercices.nombre(zone, {
          label: "‖x‖ ≈", attendu: Math.sqrt(5), tolerance: 0.01, placeholder: "ex. 1,73",
          indice: "x · x = 2² + 1². Prends ensuite la racine carrée.",
          bravo: "‖x‖ = √(4 + 1) = √5 ≈ 2,24.",
          surReussite: function () { api.valider("Retiens : ‖2·x‖ = 2·‖x‖. Doubler toutes les coordonnées double la longueur."); }
        });
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Ce que dit le signe du produit scalaire",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Interprétation géométrique (cours 1)</span>" +
        "Si les vecteurs x et w sont <b>perpendiculaires</b> (orthogonaux), leur produit scalaire est <b>nul</b>.</div>" +
        "<p>Fais tourner w autour de l'origine et regarde x · w et l'angle entre les deux flèches.</p>",
      objectif: "Trouver un w non nul tel que x · w = 0.",
      tester: function (z) { toucher(z, -1, 2); },
      installer: function (zone, api) {
        var w = { x: 1, y: -1 };
        var vus = { pos: false, neg: false };
        var p = plan(zone, { actif: "w", onDeplacer: function (id, a, b) { w.x = a; w.y = b; maj(); } });
        var leg = legende(zone);
        function maj() {
          var ps = V.produit([2, 1], [w.x, w.y]);
          p.dessiner({
            vecteurs: [{ id: "x", x: 2, y: 1, label: "x" }, { id: "w", x: w.x, y: w.y, label: "w", classe: "courant", deplacable: true }],
            angle: ["x", "w"]
          });
          leg.innerHTML = "<span>w = " + m(vec([w.x, w.y])) + "</span><span>x · w = " + m(fmt(ps, 2)) + "</span>";
          if (ps > 0) vus.pos = true;
          if (ps < 0) vus.neg = true;
          if (!w.x && !w.y) { api.retour("w = (0 ; 0) : le produit est nul, mais ce vecteur n'a pas de direction. Cherche un w non nul.", false); return; }
          if (Math.abs(ps) < 1e-9) {
            api.retour("x · w = 2·" + par(w.x) + " + 1·" + par(w.y) + " = 0 : l'angle est de 90°.", true);
            api.valider("Angle aigu (< 90°) → produit positif ; angle droit → 0 ; angle obtus (> 90°) → produit négatif. Le produit scalaire mesure à quel point deux vecteurs « vont dans le même sens ».");
          } else {
            api.retour(ps > 0 ? "Produit positif : l'angle est aigu (moins de 90°)." : "Produit négatif : l'angle est obtus (plus de 90°).", null);
          }
        }
        maj();
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le cosinus ne regarde que la direction",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Similarité cosinus (cours 2)</span>" +
        "<div class='formule'>cos(x, y) = x · y / (‖x‖ ‖y‖)</div>" +
        "Elle compare la <b>direction</b> de deux vecteurs, pas leur longueur. Valeurs entre −1 et 1 ; en texte, avec des coordonnées positives, entre 0 et 1.</div>" +
        "<p>Pourquoi c'est utile : un avis deux fois plus long, avec deux fois plus de « great » et de « bad », a la même direction. Déplace y.</p>",
      objectif: "Obtenir cos(x, y) = 1 avec un y d'une autre longueur que x.",
      tester: function (z) { toucher(z, 4, 2); },
      installer: function (zone, api) {
        var y = { x: 1, y: 2 };
        var p = plan(zone, { actif: "y", onDeplacer: function (id, a, b) { y.x = a; y.y = b; maj(); } });
        var leg = legende(zone);
        function maj() {
          var c = V.cosinus([2, 1], [y.x, y.y]);
          p.dessiner({
            vecteurs: [{ id: "x", x: 2, y: 1, label: "x" }, { id: "y", x: y.x, y: y.y, label: "y", classe: "courant", deplacable: true }],
            angle: ["x", "y"]
          });
          leg.innerHTML = "<span>y = " + m(vec([y.x, y.y])) + "</span><span>x · y = " + m(fmt(V.produit([2, 1], [y.x, y.y]))) + "</span>" +
            "<span>‖y‖ = " + m(fmt(V.norme([y.x, y.y]))) + "</span><span>cos = " + m(fmt(c, 3)) + "</span>";
          if (!isNaN(c) && Math.abs(c - 1) < 1e-9) {
            if (Math.abs(V.norme([y.x, y.y]) - Math.sqrt(5)) < 1e-9) { api.retour("cos = 1, mais y = x. Essaie une autre longueur dans la même direction.", null); return; }
            api.retour("cos = 1 : même direction, longueurs différentes (‖y‖ = " + fmt(V.norme([y.x, y.y])) + ").", true);
            api.valider("Le cours 2 prend A = [1, 1, 0] et B = [2, 2, 0] : cos(A, B) = 1,00. B est un document plus long, mais de même direction que A.");
          } else if (!isNaN(c) && Math.abs(c) < 1e-9) {
            api.retour("cos = 0 : vecteurs perpendiculaires, comme à l'étape précédente.", null);
          } else if (!isNaN(c) && c < 0) {
            api.retour("cos négatif : directions opposées à plus de 90°.", null);
          } else api.retour("", null);
        }
        maj();
      }
    },

    /* 7 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le produit scalaire dans un neurone",
      texte:
        "<p>Un neurone artificiel (cours 1, diapo 28) reçoit des entrées x₁, …, xₘ, les pondère par des poids w₁, …, wₘ et ajoute un <b>biais</b> b :</p>" +
        "<div class='formule'>t = Σᵢ xᵢ · wᵢ + b = x · w + b        puis  ŷ = σ(t)</div>" +
        "<p>Reprends x = (2 ; 1 ; 1) et w = (1 ; −1 ; 0,5), avec b = −2. La fonction σ sera vue dans la leçon « Fonctions utiles ».</p>",
      objectif: "Calculer t pour l'avis du fil rouge.",
      installer: function (zone, api) {
        Exercices.nombre(zone, {
          label: "t =", attendu: -0.5, tolerance: 1e-9, placeholder: "ex. 0,5",
          indice: "Tu as déjà calculé x · w à l'étape 3. Ajoute le biais.",
          bravo: "t = 1,5 + (−2) = −0,5.",
          surReussite: function () { api.valider("Tout le cours repose sur ce calcul : un neurone, une couche, une cellule LSTM, l'attention… font des produits scalaires entre des entrées et des poids appris."); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning",
    id: "vecteurs-produit-scalaire",
    etapes: etapes,
    fin: {
      texte:
        "<ul><li>Un vecteur est une liste ordonnée de nombres ; on additionne et on multiplie par un nombre coordonnée par coordonnée.</li>" +
        "<li>Produit scalaire : <span class='mono'>x · w = Σ xᵢwᵢ</span>, un seul nombre ; nul si les vecteurs sont perpendiculaires.</li>" +
        "<li>Norme : <span class='mono'>‖x‖ = √(x · x)</span>.</li>" +
        "<li>Cosinus : <span class='mono'>x · y / (‖x‖ ‖y‖)</span>, ne dépend que de la direction.</li>" +
        "<li>Neurone : <span class='mono'>t = x · w + b</span>.</li></ul>",
      cartes: "prerequis"
    }
  });
})();
