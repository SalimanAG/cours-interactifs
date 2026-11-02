/* vecteurs.js — un plan 2D avec des vecteurs (flèches depuis l'origine) et des
   points, dont certains se déplacent au doigt ou à la souris.
   Sert au produit scalaire, à la norme, au cosinus, aux nuages de mots…

   var plan = new Vecteurs(conteneur, {
     xmin: -1, xmax: 5, ymin: -3, ymax: 3,    // repère
     largeur: 320,                            // (optionnel) largeur du viewBox ; la hauteur suit le repère
     pas: 0.5,                                // (optionnel) aimantation des déplacements (0 = libre)
     grille: 1,                               // (optionnel) espacement des lignes de grille
     axes: ["x₁", "x₂"],                      // (optionnel) noms des axes
     actif: "w",                              // (optionnel) vecteur déplacé quand on touche le fond du plan
     onDeplacer: function (id, x, y) {…}      // appelé à chaque déplacement (coordonnées aimantées)
   });
   plan.dessiner({
     vecteurs: [{ id, x, y, label, classe, deplacable }],   // classe : "courant" (accent : en cours), "pale", "pointille"
     points:   [{ id, x, y, label, classe, deplacable }],   // idem (classe "courant", "pale", "plein")
     angle:    ["x", "w"],                                  // (optionnel) arc de l'angle entre deux vecteurs
     segments: [{ x1, y1, x2, y2, classe }]                 // (optionnel) traits libres (ex. projection)
   });
   plan.position(id) → { x, y } (position courante d'un élément déplaçable)

   Calculs (vecteurs = tableaux de nombres, n'importe quelle dimension) :
     Vecteurs.produit([2, 1], [1, -1]) → 1          Vecteurs.norme([3, 4]) → 5
     Vecteurs.cosinus(a, b) → x·y / (‖x‖ ‖y‖)       Vecteurs.angle(a, b) → degrés
     Vecteurs.fmt(1.23456, 2) → "1,23"              (virgule décimale, -0 → 0)
   La brique injecte son propre CSS, construit avec les variables de theme.css. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function svg(t, a) {
    var e = document.createElementNS(NS, t);
    for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) e.setAttribute(k, a[k]);
    return e;
  }

  var STYLE =
    ".vecteurs{width:100%;height:auto;display:block;touch-action:none;user-select:none;-webkit-user-select:none}" +
    ".vecteurs .grille-v{stroke:var(--trait);stroke-width:.6}" +
    ".vecteurs .axe-v{stroke:var(--trait-fort);stroke-width:1.2}" +
    ".vecteurs .grad-v{fill:var(--encre-3);font-family:var(--mono);font-size:9px}" +
    ".vecteurs .nom-axe{fill:var(--encre-2);font-family:var(--mono);font-size:10px}" +
    ".vecteurs .fleche{stroke:var(--encre);stroke-width:2.4;fill:none}" +
    ".vecteurs .pointe{fill:var(--encre)}" +
    ".vecteurs .v.courant .fleche{stroke:var(--accent);stroke-width:3}" +
    ".vecteurs .v.courant .pointe{fill:var(--accent)}" +
    ".vecteurs .v.pale .fleche{stroke:var(--encre-3);stroke-width:1.6}" +
    ".vecteurs .v.pale .pointe{fill:var(--encre-3)}" +
    ".vecteurs .v.pointille .fleche{stroke-dasharray:5 4}" +
    ".vecteurs .lab-v{fill:var(--encre);font-family:var(--mono);font-size:12px;font-weight:500;paint-order:stroke;stroke:var(--fond);stroke-width:4px;stroke-linejoin:round}" +
    ".vecteurs .v.courant .lab-v{fill:var(--accent)}" +
    ".vecteurs .v.pale .lab-v,.vecteurs .p.pale .lab-v{fill:var(--encre-3)}" +
    ".vecteurs .poignee{fill:var(--fond);stroke:var(--encre);stroke-width:1.5;stroke-dasharray:3 2}" +
    ".vecteurs .v.courant .poignee,.vecteurs .p.courant .poignee{stroke:var(--accent)}" +
    ".vecteurs .cible-v{fill:transparent;cursor:grab}" +
    ".vecteurs .point{fill:var(--fond);stroke:var(--encre);stroke-width:1.5}" +
    ".vecteurs .p.plein .point{fill:var(--encre)}" +
    ".vecteurs .p.courant .point{fill:var(--accent);stroke:var(--accent)}" +
    ".vecteurs .p.pale .point{stroke:var(--encre-3)}" +
    ".vecteurs .arc{fill:none;stroke:var(--encre-2);stroke-width:1.2}" +
    ".vecteurs .lab-arc{fill:var(--encre-2);font-family:var(--mono);font-size:10px}" +
    ".vecteurs .seg{stroke:var(--encre-2);stroke-width:1.2;stroke-dasharray:3 3}" +
    ".vecteurs.glisse .cible-v{cursor:grabbing}";
  function injecterStyle() {
    if (document.getElementById("style-vecteurs")) return;
    var s = document.createElement("style"); s.id = "style-vecteurs"; s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function produit(a, b) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
  function norme(a) { return Math.sqrt(produit(a, a)); }
  function cosinus(a, b) { var n = norme(a) * norme(b); return n ? produit(a, b) / n : NaN; }
  function angle(a, b) { var c = cosinus(a, b); return isNaN(c) ? NaN : Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI; }
  function fmt(v, d) {
    if (d === undefined) d = 2;
    if (isNaN(v)) return "—";
    var r = Number(v.toFixed(d));
    if (r === 0) r = 0;
    return String(r).replace(".", ",").replace("-", "−");
  }

  function Vecteurs(conteneur, opts) {
    injecterStyle();
    this.o = opts || {};
    var o = this.o;
    this.xmin = o.xmin === undefined ? -1 : o.xmin; this.xmax = o.xmax === undefined ? 5 : o.xmax;
    this.ymin = o.ymin === undefined ? -3 : o.ymin; this.ymax = o.ymax === undefined ? 3 : o.ymax;
    this.L = o.largeur || 320;
    this.marge = 14;
    this.u = (this.L - 2 * this.marge) / (this.xmax - this.xmin);   // pixels par unité (repère orthonormé)
    this.H = Math.round((this.ymax - this.ymin) * this.u + 2 * this.marge);
    this.racine = svg("svg", { viewBox: "0 0 " + this.L + " " + this.H, "class": "vecteurs", role: "img" });
    if (o.titre) this.racine.setAttribute("aria-label", o.titre);
    conteneur.appendChild(this.racine);
    this.dernier = null;
    this.pos = {};
    var self = this;
    this.glisse = null;
    this.racine.addEventListener("pointerdown", function (e) {
      var cible = e.target.closest ? e.target.closest("[data-glisse]") : null;
      var id = cible ? cible.getAttribute("data-glisse") : (self.o.actif || null);
      if (!id || !self.pos[id]) return;
      e.preventDefault();
      self.glisse = id;
      self.racine.classList.add("glisse");
      try { self.racine.setPointerCapture(e.pointerId); } catch (x) { /* rien */ }
      self.deplacer(e);
    });
    this.racine.addEventListener("pointermove", function (e) { if (self.glisse) { e.preventDefault(); self.deplacer(e); } });
    function fin() { self.glisse = null; self.racine.classList.remove("glisse"); }
    this.racine.addEventListener("pointerup", fin);
    this.racine.addEventListener("pointercancel", fin);
  }

  Vecteurs.prototype.X = function (x) { return this.marge + (x - this.xmin) * this.u; };
  Vecteurs.prototype.Y = function (y) { return this.marge + (this.ymax - y) * this.u; };

  Vecteurs.prototype.deplacer = function (e) {
    var m = this.racine.getScreenCTM();
    if (!m) return;
    var pt = this.racine.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    var q = pt.matrixTransform(m.inverse());
    var x = this.xmin + (q.x - this.marge) / this.u;
    var y = this.ymax - (q.y - this.marge) / this.u;
    var pas = this.o.pas === undefined ? 0.5 : this.o.pas;
    if (pas) { x = Math.round(x / pas) * pas; y = Math.round(y / pas) * pas; }
    x = Math.max(this.xmin, Math.min(this.xmax, x));
    y = Math.max(this.ymin, Math.min(this.ymax, y));
    x = Number(x.toFixed(6)); y = Number(y.toFixed(6));
    var p = this.pos[this.glisse];
    if (p.x === x && p.y === y) return;
    p.x = x; p.y = y;
    if (this.o.onDeplacer) this.o.onDeplacer(this.glisse, x, y);
  };

  Vecteurs.prototype.position = function (id) { return this.pos[id] ? { x: this.pos[id].x, y: this.pos[id].y } : null; };

  Vecteurs.prototype.dessiner = function (d) {
    var self = this, r = this.racine;
    while (r.firstChild) r.removeChild(r.firstChild);
    var g = this.o.grille === undefined ? 1 : this.o.grille;
    var i, t;
    // Grille et graduations
    if (g) {
      for (i = Math.ceil(this.xmin / g) * g; i <= this.xmax + 1e-9; i += g) {
        r.appendChild(svg("line", { x1: this.X(i), y1: this.Y(this.ymin), x2: this.X(i), y2: this.Y(this.ymax), "class": "grille-v" }));
        if (Math.abs(i) > 1e-9) { t = svg("text", { x: this.X(i), y: this.Y(0) + 11, "class": "grad-v", "text-anchor": "middle" }); t.textContent = fmt(i, 1); r.appendChild(t); }
      }
      for (i = Math.ceil(this.ymin / g) * g; i <= this.ymax + 1e-9; i += g) {
        r.appendChild(svg("line", { x1: this.X(this.xmin), y1: this.Y(i), x2: this.X(this.xmax), y2: this.Y(i), "class": "grille-v" }));
        if (Math.abs(i) > 1e-9) { t = svg("text", { x: this.X(0) - 4, y: this.Y(i) + 3, "class": "grad-v", "text-anchor": "end" }); t.textContent = fmt(i, 1); r.appendChild(t); }
      }
    }
    if (this.ymin <= 0 && this.ymax >= 0) r.appendChild(svg("line", { x1: this.X(this.xmin), y1: this.Y(0), x2: this.X(this.xmax), y2: this.Y(0), "class": "axe-v" }));
    if (this.xmin <= 0 && this.xmax >= 0) r.appendChild(svg("line", { x1: this.X(0), y1: this.Y(this.ymin), x2: this.X(0), y2: this.Y(this.ymax), "class": "axe-v" }));
    if (this.o.axes) {
      t = svg("text", { x: this.X(this.xmax) - 2, y: this.Y(0) - 5, "class": "nom-axe", "text-anchor": "end" }); t.textContent = this.o.axes[0]; r.appendChild(t);
      t = svg("text", { x: this.X(0) + 5, y: this.Y(this.ymax) + 10, "class": "nom-axe" }); t.textContent = this.o.axes[1]; r.appendChild(t);
    }

    (d.segments || []).forEach(function (s) {
      r.appendChild(svg("line", { x1: self.X(s.x1), y1: self.Y(s.y1), x2: self.X(s.x2), y2: self.Y(s.y2), "class": "seg" + (s.classe ? " " + s.classe : "") }));
    });

    var vecs = d.vecteurs || [];
    var parId = {};
    vecs.forEach(function (v) { parId[v.id] = v; });

    // Arc d'angle
    if (d.angle && parId[d.angle[0]] && parId[d.angle[1]]) {
      var a = parId[d.angle[0]], b = parId[d.angle[1]];
      if ((a.x || a.y) && (b.x || b.y)) {
        var ta = Math.atan2(a.y, a.x), tb = Math.atan2(b.y, b.x);
        var diff = tb - ta;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        var R = 22, n = 24, pts = [];
        for (i = 0; i <= n; i++) { var th = ta + diff * i / n; pts.push((this.X(0) + R * Math.cos(th)).toFixed(1) + "," + (this.Y(0) - R * Math.sin(th)).toFixed(1)); }
        r.appendChild(svg("polyline", { points: pts.join(" "), "class": "arc" }));
        var tm = ta + diff / 2;
        t = svg("text", { x: this.X(0) + (R + 12) * Math.cos(tm), y: this.Y(0) - (R + 12) * Math.sin(tm) + 3, "class": "lab-arc", "text-anchor": "middle" });
        t.textContent = fmt(angle([a.x, a.y], [b.x, b.y]), 0) + "°";
        r.appendChild(t);
      }
    }

    var nouv = {};
    vecs.forEach(function (v) {
      var grp = svg("g", { "class": "v" + (v.classe ? " " + v.classe : "") });
      var x0 = self.X(0), y0 = self.Y(0), x1 = self.X(v.x), y1 = self.Y(v.y);
      var dx = x1 - x0, dy = y1 - y0, l = Math.sqrt(dx * dx + dy * dy);
      if (l > 1) {
        var ux = dx / l, uy = dy / l, p = 9;
        grp.appendChild(svg("line", { x1: x0, y1: y0, x2: x1 - ux * p * 0.8, y2: y1 - uy * p * 0.8, "class": "fleche" }));
        grp.appendChild(svg("polygon", {
          points: x1 + "," + y1 + " " + (x1 - ux * p - uy * p * 0.5) + "," + (y1 - uy * p + ux * p * 0.5) + " " + (x1 - ux * p + uy * p * 0.5) + "," + (y1 - uy * p - ux * p * 0.5),
          "class": "pointe"
        }));
      }
      if (v.label) {
        var lx = l > 1 ? x1 + (dx / l) * 10 : x1 + 8, ly = l > 1 ? y1 + (dy / l) * 10 + 4 : y1 - 8;
        t = svg("text", { x: lx, y: ly, "class": "lab-v", "text-anchor": dx < -1 ? "end" : "start" });
        t.textContent = v.label;
        grp.appendChild(t);
      }
      if (v.deplacable) {
        grp.appendChild(svg("circle", { cx: x1, cy: y1, r: 7, "class": "poignee" }));
        grp.appendChild(svg("circle", { cx: x1, cy: y1, r: 20, "class": "cible-v", "data-glisse": v.id }));
        nouv[v.id] = { x: v.x, y: v.y };
      }
      r.appendChild(grp);
    });

    (d.points || []).forEach(function (p) {
      var grp = svg("g", { "class": "p" + (p.classe ? " " + p.classe : "") });
      grp.appendChild(svg("circle", { cx: self.X(p.x), cy: self.Y(p.y), r: 5, "class": "point" }));
      if (p.label) {
        t = svg("text", { x: self.X(p.x) + 8, y: self.Y(p.y) - 6, "class": "lab-v" });
        t.textContent = p.label;
        grp.appendChild(t);
      }
      if (p.deplacable) {
        grp.appendChild(svg("circle", { cx: self.X(p.x), cy: self.Y(p.y), r: 20, "class": "cible-v", "data-glisse": p.id }));
        nouv[p.id] = { x: p.x, y: p.y };
      }
      r.appendChild(grp);
    });
    // Conserver l'objet de position de l'élément en cours de déplacement.
    Object.keys(nouv).forEach(function (id) {
      if (self.pos[id]) { self.pos[id].x = nouv[id].x; self.pos[id].y = nouv[id].y; nouv[id] = self.pos[id]; }
    });
    this.pos = nouv;
  };

  Vecteurs.produit = produit;
  Vecteurs.norme = norme;
  Vecteurs.cosinus = cosinus;
  Vecteurs.angle = angle;
  Vecteurs.fmt = fmt;
  window.Vecteurs = Vecteurs;
})();
