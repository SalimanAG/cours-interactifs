/* reseau.js — un réseau de neurones en couches (graphe orienté, de gauche à droite) : neurones avec leur valeur,
   arêtes avec leur poids, éléments « en cours » en couleur d'accent. Sert aux réseaux feed-forward, à la
   rétropropagation, et (avec des arêtes arbitraires) à montrer des réseaux qui ne sont pas feed-forward.

   var r = new Reseau(conteneur, { couches: [["x₁", "x₂"], ["c₁", "c₂"], ["s"]], largeur: 320, hauteur: 180, titre: "…" });
   r.dessiner({
     aretes: Reseau.aretesDepuis(W),          // ou une liste [{ de: [l, i], vers: [l2, i2], poids, classe }]
                                               //   classe : "courant" (accent), "pale" ; poids affiché si défini
     neurones: { "1,0": { haut: "S = 0,62", bas: "δ = …", classe: "courant" | "plein" | "pale" } }
   });
   Reseau.aretesDepuis(W)  : W[l][k][j] = poids du neurone j de la couche l vers le neurone k de la couche l + 1
                             (chaque matrice W[l] a une ligne par neurone d'arrivée, comme W^J dans le cours).
   Une arête vers la même couche est dessinée en arc, une arête vers soi-même en boucle, une arête vers une
   couche précédente en arc par-dessous. La brique injecte son propre CSS (variables de theme.css). */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function sv(t, a) { var e = document.createElementNS(NS, t); for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) e.setAttribute(k, a[k]); return e; }
  var STYLE =
    ".reseau-fig{width:100%;height:auto;display:block;max-width:380px;margin:0 auto}" +
    ".reseau-fig .ar{stroke:var(--trait-fort);stroke-width:1.5;fill:none}" +
    ".reseau-fig .ar.courant{stroke:var(--accent);stroke-width:2.4}" +
    ".reseau-fig .ar.pale{stroke:var(--trait);stroke-dasharray:3 3}" +
    ".reseau-fig .pd{font-family:var(--mono);font-size:10px;fill:var(--encre-2);paint-order:stroke;stroke:var(--fond);stroke-width:3px}" +
    ".reseau-fig .pd.courant{fill:var(--accent)}" +
    ".reseau-fig .nr circle{fill:var(--fond);stroke:var(--encre);stroke-width:1.8}" +
    ".reseau-fig .nr.plein circle{fill:var(--encre)}.reseau-fig .nr.plein .nm{fill:var(--fond)}" +
    ".reseau-fig .nr.courant circle{stroke:var(--accent);stroke-width:3}" +
    ".reseau-fig .nr.pale circle{stroke:var(--trait-fort)}" +
    ".reseau-fig .nm{font-family:var(--texte);font-size:12px;fill:var(--encre);text-anchor:middle;dominant-baseline:central}" +
    ".reseau-fig .vl{font-family:var(--mono);font-size:10px;fill:var(--encre);text-anchor:middle;paint-order:stroke;stroke:var(--fond);stroke-width:3px}" +
    ".reseau-fig .vl.courant{fill:var(--accent)}" +
    ".reseau-fig .flc{fill:var(--trait-fort)}.reseau-fig .flc-c{fill:var(--accent)}";
  function styler() {
    if (document.getElementById("style-reseau")) return;
    var s = document.createElement("style"); s.id = "style-reseau"; s.textContent = STYLE;
    document.head.appendChild(s);
  }
  var compteur = 0;
  function fmt(v) {
    if (typeof v !== "number") return v === undefined || v === null ? "" : String(v);
    var r = Math.round(v * 1000) / 1000; if (r === 0) r = 0;
    return String(r).replace(".", ",").replace("-", "−");
  }

  function Reseau(conteneur, o) {
    styler();
    this.o = o;
    this.L = o.largeur || 320;
    var maxN = Math.max.apply(null, o.couches.map(function (c) { return c.length; }));
    this.H = o.hauteur || Math.max(140, 70 * maxN + 20);
    this.R = 17;
    this.id = "rs" + (++compteur);
    this.svg = sv("svg", { viewBox: "0 0 " + this.L + " " + this.H, "class": "reseau-fig", role: "img", "aria-label": o.titre || "Réseau de neurones" });
    conteneur.appendChild(this.svg);
  }
  Reseau.prototype.pos = function (l, i) {
    var nC = this.o.couches.length, n = this.o.couches[l].length;
    var x = 30 + (nC === 1 ? 0 : l * (this.L - 60) / (nC - 1));
    var y = (i + 0.5) * this.H / n;
    return { x: x, y: y };
  };
  Reseau.prototype.dessiner = function (d) {
    d = d || {};
    var self = this, s = this.svg, R = this.R;
    while (s.firstChild) s.removeChild(s.firstChild);
    var defs = sv("defs", {});
    ["", "-c"].forEach(function (suf) {
      var m = sv("marker", { id: self.id + "f" + suf, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" });
      m.appendChild(sv("path", { d: "M0 0 L10 5 L0 10 z", "class": suf ? "flc-c" : "flc" }));
      defs.appendChild(m);
    });
    s.appendChild(defs);
    var labels = [];
    (d.aretes || []).forEach(function (a) {
      var A = self.pos(a.de[0], a.de[1]), B = self.pos(a.vers[0], a.vers[1]);
      var c = a.classe === "courant", chemin, lx, ly;
      if (a.de[0] === a.vers[0] && a.de[1] === a.vers[1]) {
        chemin = "M" + (A.x - 8) + " " + (A.y - R + 2) + " C" + (A.x - 30) + " " + (A.y - R - 34) + " " + (A.x + 30) + " " + (A.y - R - 34) + " " + (A.x + 8) + " " + (A.y - R + 2);
        lx = A.x; ly = A.y - R - 28;
      } else {
        var dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
        var ux = dx / L, uy = dy / L;
        var x1 = A.x + ux * R, y1 = A.y + uy * R, x2 = B.x - ux * (R + 2), y2 = B.y - uy * (R + 2);
        if (a.de[0] === a.vers[0] || a.vers[0] < a.de[0]) {
          var bomb = a.vers[0] < a.de[0] ? 40 : 28;
          var mx = (x1 + x2) / 2 - uy * bomb, my = (y1 + y2) / 2 + ux * bomb;
          if (a.vers[0] < a.de[0]) { my = Math.max(y1, y2) + 34; }
          chemin = "M" + x1 + " " + y1 + " Q" + mx + " " + my + " " + x2 + " " + y2;
          lx = (x1 + 2 * mx + x2) / 4; ly = (y1 + 2 * my + y2) / 4;
        } else {
          chemin = "M" + x1 + " " + y1 + " L" + x2 + " " + y2;
          var t = a.position === undefined ? 0.3 : a.position;
          lx = x1 + (x2 - x1) * t; ly = y1 + (y2 - y1) * t - 4;
        }
      }
      s.appendChild(sv("path", { d: chemin, "class": "ar" + (a.classe ? " " + a.classe : ""), "marker-end": "url(#" + self.id + "f" + (c ? "-c" : "") + ")" }));
      if (a.poids !== undefined && a.poids !== null) labels.push({ x: lx, y: ly, t: fmt(a.poids), c: c });
    });
    labels.forEach(function (lb) { var t = sv("text", { x: lb.x, y: lb.y, "class": "pd" + (lb.c ? " courant" : ""), "text-anchor": "middle" }); t.textContent = lb.t; s.appendChild(t); });
    var neur = d.neurones || {};
    this.o.couches.forEach(function (c, l) {
      c.forEach(function (nom, i) {
        var P = self.pos(l, i), info = neur[l + "," + i] || {};
        var g = sv("g", { "class": "nr" + (info.classe ? " " + info.classe : ""), transform: "translate(" + P.x + " " + P.y + ")" });
        g.appendChild(sv("circle", { r: R }));
        var t = sv("text", { "class": "nm" }); t.textContent = nom; g.appendChild(t);
        if (info.haut !== undefined) { var h = sv("text", { y: -R - 5, "class": "vl" + (info.classe === "courant" ? " courant" : "") }); h.textContent = info.haut; g.appendChild(h); }
        if (info.bas !== undefined) { var b = sv("text", { y: R + 13, "class": "vl" + (info.classe === "courant" ? " courant" : "") }); b.textContent = info.bas; g.appendChild(b); }
        if (self.o.onNeurone) { g.style.cursor = "pointer"; g.addEventListener("click", function () { self.o.onNeurone(l, i); }); }
        s.appendChild(g);
      });
    });
  };
  Reseau.aretesDepuis = function (W, classes) {
    var r = [];
    W.forEach(function (M, l) {
      M.forEach(function (ligne, k) {
        ligne.forEach(function (w, j) {
          r.push({ de: [l, j], vers: [l + 1, k], poids: w, classe: classes ? classes[l + "," + k + "," + j] : undefined, position: j === k ? 0.3 : 0.22 });
        });
      });
    });
    return r;
  };
  Reseau.fmt = fmt;
  Reseau.sigmoide = function (r) { return 1 / (1 + Math.exp(-r)); };
  window.Reseau = Reseau;
})();
