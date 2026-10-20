/* carte.js — la carte à 7 régions du cours (Modélisation, PPC), redessinée.
   Régions numérotées comme dans le cours « Modélisation » ; les 10 frontières
   sont celles des contraintes C1…C10 de ce cours.

   var c = new Carte(conteneur, { onRegion: function (r) {…} });
   c.dessiner({
     valeurs: { 1: "B", 4: "R" },        // couleur affectée (B = bleu, R = rose, V = vert)
     classes: { 2: "courante" },         // "courante" (accent : en cours), "conflit", "choisie"
   });
   Carte.FRONTIERES : [[1, 2], [1, 4], …]   (10 paires)
   Carte.NOMS : { B: "bleu", R: "rose", V: "vert" }

   Les couleurs du cours sont rendues par des motifs (hachures, points, aplat)
   et une lettre : la seule couleur vive du site reste réservée à « en cours ». */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function svg(t, a) {
    var e = document.createElementNS(NS, t);
    for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) e.setAttribute(k, a[k]);
    return e;
  }

  var REGIONS = {
    1: { pts: "10,50 110,15 110,170 25,165", x: 58, y: 102 },
    2: { pts: "110,15 170,15 170,95 110,95", x: 140, y: 55 },
    3: { pts: "170,15 225,8 300,100 300,125 210,125 210,95 170,95", x: 240, y: 75 },
    4: { pts: "110,95 210,95 210,175 160,178 110,170", x: 158, y: 137 },
    5: { pts: "210,125 300,125 295,165 255,185 240,165 210,150", x: 262, y: 147 },
    6: { pts: "210,150 240,165 255,185 210,185", x: 226, y: 172 },
    7: { pts: "220,185 245,185 240,207 225,207", x: 232, y: 197 }
  };
  var FRONTIERES = [[1, 2], [1, 4], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5], [4, 6], [5, 6], [6, 7]];
  var NOMS = { B: "bleu", R: "rose", V: "vert" };

  var STYLE =
    ".carte-csp{width:100%;height:auto;display:block;max-width:420px;margin:0 auto;touch-action:manipulation;user-select:none;-webkit-user-select:none}" +
    ".carte-csp .region polygon{fill:var(--fond);stroke:var(--encre-2);stroke-width:1.5;stroke-linejoin:round}" +
    ".carte-csp .region.vB polygon{fill:url(#motif-B)}" +
    ".carte-csp .region.vR polygon{fill:url(#motif-R)}" +
    ".carte-csp .region.vV polygon{fill:var(--trait-fort)}" +
    ".carte-csp .region.choisie polygon{stroke:var(--encre);stroke-width:3}" +
    ".carte-csp .region.conflit polygon{stroke:var(--encre);stroke-width:3;stroke-dasharray:6 4}" +
    ".carte-csp .region.courante polygon{stroke:var(--accent);stroke-width:3.5}" +
    ".carte-csp.cliquable .region{cursor:pointer}" +
    ".carte-csp.cliquable .region:hover polygon{stroke:var(--accent)}" +
    ".carte-csp .num{font-family:var(--texte);font-size:15px;font-weight:600;fill:var(--encre);text-anchor:middle;dominant-baseline:central;pointer-events:none;paint-order:stroke;stroke:var(--fond);stroke-width:4px;stroke-linejoin:round}" +
    ".carte-csp .val{font-family:var(--mono);font-size:11px;fill:var(--encre);text-anchor:middle;pointer-events:none;paint-order:stroke;stroke:var(--fond);stroke-width:3.5px;stroke-linejoin:round}" +
    ".carte-csp .motif-trait{stroke:var(--encre-2);stroke-width:1.6}" +
    ".carte-csp .motif-point{fill:var(--encre-2)}" +
    ".legende-carte{display:flex;gap:.3rem 1rem;flex-wrap:wrap;justify-content:center;font-size:.85rem;color:var(--encre-2);margin:.3rem 0 0}" +
    ".legende-carte svg{width:16px;height:16px;vertical-align:-3px;margin-right:.25rem;border:1px solid var(--trait-fort);border-radius:3px}";

  function injecterStyle() {
    if (document.getElementById("style-carte-csp")) return;
    var s = document.createElement("style");
    s.id = "style-carte-csp";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function motifs(racine) {
    var defs = svg("defs", {});
    var b = svg("pattern", { id: "motif-B", width: 7, height: 7, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
    b.appendChild(svg("rect", { width: 7, height: 7, style: "fill:var(--fond)" }));
    b.appendChild(svg("line", { x1: 0, y1: 0, x2: 0, y2: 7, "class": "motif-trait" }));
    var r = svg("pattern", { id: "motif-R", width: 7, height: 7, patternUnits: "userSpaceOnUse" });
    r.appendChild(svg("rect", { width: 7, height: 7, style: "fill:var(--fond)" }));
    r.appendChild(svg("circle", { cx: 3.5, cy: 3.5, r: 1.5, "class": "motif-point" }));
    defs.appendChild(b); defs.appendChild(r);
    racine.appendChild(defs);
  }

  function Carte(conteneur, opts) {
    injecterStyle();
    this.opts = opts || {};
    this.racine = svg("svg", { viewBox: "0 0 310 215", "class": "carte-csp" + (this.opts.onRegion ? " cliquable" : ""), role: "img", "aria-label": "Carte à 7 régions" });
    motifs(this.racine);
    this.calque = svg("g", {});
    this.racine.appendChild(this.calque);
    conteneur.appendChild(this.racine);
    if (this.opts.legende !== false) {
      var leg = document.createElement("div");
      leg.className = "legende-carte";
      leg.innerHTML =
        "<span><svg viewBox='0 0 16 16'><rect width='16' height='16' fill='url(#motif-B)'/></svg>B = bleu</span>" +
        "<span><svg viewBox='0 0 16 16'><rect width='16' height='16' fill='url(#motif-R)'/></svg>R = rose</span>" +
        "<span><svg viewBox='0 0 16 16'><rect width='16' height='16' style='fill:var(--trait-fort)'/></svg>V = vert</span>";
      conteneur.appendChild(leg);
    }
    this.dessiner({});
  }

  Carte.prototype.dessiner = function (o) {
    var self = this;
    o = o || {};
    var val = o.valeurs || {}, cl = o.classes || {};
    var g = this.calque;
    while (g.firstChild) g.removeChild(g.firstChild);
    Object.keys(REGIONS).forEach(function (k) {
      var R = REGIONS[k];
      var grp = svg("g", { "class": "region" + (val[k] ? " v" + val[k] : "") + (cl[k] ? " " + cl[k] : ""), "data-region": k });
      grp.appendChild(svg("polygon", { points: R.pts }));
      if (self.opts.onRegion) grp.addEventListener("click", function () { self.opts.onRegion(+k); });
      g.appendChild(grp);
    });
    // Étiquettes au-dessus de toutes les régions (la Tasmanie est petite).
    Object.keys(REGIONS).forEach(function (k) {
      var R = REGIONS[k];
      var petit = k === "7" || k === "6";
      var t = svg("text", { x: R.x, y: R.y - (val[k] && !petit ? 6 : 0), "class": "num" });
      t.textContent = "v" + k;
      if (petit) t.setAttribute("style", "font-size:11px");
      g.appendChild(t);
      if (val[k] && !petit) {
        var v = svg("text", { x: R.x, y: R.y + 12, "class": "val" });
        v.textContent = val[k];
        g.appendChild(v);
      }
    });
  };

  Carte.FRONTIERES = FRONTIERES;
  Carte.NOMS = NOMS;
  Carte.voisins = function (a, b) {
    return FRONTIERES.some(function (f) { return (f[0] === a && f[1] === b) || (f[0] === b && f[1] === a); });
  };
  Carte.conflits = function (valeurs) {
    return FRONTIERES.filter(function (f) { return valeurs[f[0]] && valeurs[f[0]] === valeurs[f[1]]; });
  };
  window.Carte = Carte;
})();
