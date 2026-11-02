/* courbes.js — graphique SVG de fonctions de n (comparaison de croissances).

   var g = new Courbes(conteneur, { largeur: 340, hauteur: 220 });
   g.dessiner({
     xmax: 20, ymax: 400,                       // bornes des axes (xmin = ymin = 0 … ou xmin)
     xmin: 1,
     fonctions: [{ label: "n²", f: function (n) { return n * n; }, classe: "" }],
                                                // classe : "courante" (accent), "ref" (pointillés), "pale"
     zone: { de: 12 }                            // (optionnel) grise la partie n < de
     marque: { x: 12, texte: "n₀" },             // (optionnel) trait vertical
     nomX: "θ"                                   // (optionnel) nom de l'axe horizontal (défaut : n)
   });
   Les courbes qui sortent par le haut sont coupées ; leur étiquette est
   placée au dernier point visible. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function svg(tag, a) {
    var e = document.createElementNS(NS, tag);
    for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) e.setAttribute(k, a[k]);
    return e;
  }
  function fmt(v) {
    if (v >= 1e6) return v.toExponential(0).replace("+", "");
    if (v >= 1000) return Math.round(v / 1000) + "k";
    return String(Math.round(v * 10) / 10);
  }

  function Courbes(conteneur, opts) {
    this.L = (opts && opts.largeur) || 340;
    this.H = (opts && opts.hauteur) || 220;
    this.racine = svg("svg", { viewBox: "0 0 " + this.L + " " + this.H, "class": "courbes", role: "img" });
    conteneur.appendChild(this.racine);
  }

  Courbes.prototype.dessiner = function (o) {
    var r = this.racine;
    while (r.firstChild) r.removeChild(r.firstChild);
    var g = { l: 38, r: 62, h: 10, b: 24 };
    var W = this.L - g.l - g.r, H = this.H - g.h - g.b;
    var xmin = o.xmin || 0, xmax = o.xmax, ymax = o.ymax;
    function X(x) { return g.l + (x - xmin) / (xmax - xmin) * W; }
    function Y(y) { return g.h + H - y / ymax * H; }

    if (o.zone && o.zone.de > xmin) {
      r.appendChild(svg("rect", { x: g.l, y: g.h, width: Math.max(0, X(Math.min(o.zone.de, xmax)) - g.l), height: H, "class": "zone-exclue" }));
    }
    // Axes
    r.appendChild(svg("line", { x1: g.l, y1: g.h + H, x2: g.l + W, y2: g.h + H, "class": "axe" }));
    r.appendChild(svg("line", { x1: g.l, y1: g.h, x2: g.l, y2: g.h + H, "class": "axe" }));
    var t;
    [xmin, (xmin + xmax) / 2, xmax].forEach(function (x) {
      t = svg("text", { x: X(x), y: g.h + H + 15, "class": "graduation", "text-anchor": "middle" });
      t.textContent = fmt(x); r.appendChild(t);
    });
    [0, ymax / 2, ymax].forEach(function (y) {
      t = svg("text", { x: g.l - 5, y: Y(y) + 4, "class": "graduation", "text-anchor": "end" });
      t.textContent = fmt(y); r.appendChild(t);
    });
    t = svg("text", { x: g.l + W + 4, y: g.h + H + 4, "class": "graduation" });
    t.textContent = o.nomX || "n"; r.appendChild(t);

    if (o.marque) {
      r.appendChild(svg("line", { x1: X(o.marque.x), y1: g.h, x2: X(o.marque.x), y2: g.h + H, "class": "marque" }));
      t = svg("text", { x: X(o.marque.x) + 3, y: g.h + 10, "class": "graduation" });
      t.textContent = o.marque.texte || ""; r.appendChild(t);
    }

    var pas = (xmax - xmin) / 160;
    o.fonctions.forEach(function (fn) {
      var pts = [], dernier = null;
      for (var x = xmin; x <= xmax + 1e-9; x += pas) {
        var y = fn.f(x);
        if (!isFinite(y)) continue;
        if (y > ymax) {
          // couper au bord haut
          if (dernier) pts.push(X(x).toFixed(1) + "," + Y(ymax).toFixed(1));
          dernier = { x: x, y: ymax };
          break;
        }
        pts.push(X(x).toFixed(1) + "," + Y(Math.max(0, y)).toFixed(1));
        dernier = { x: x, y: Math.max(0, y) };
      }
      if (pts.length > 1) {
        r.appendChild(svg("polyline", { points: pts.join(" "), "class": "courbe" + (fn.classe ? " " + fn.classe : "") }));
      }
      if (dernier) {
        var lab = svg("text", { x: X(dernier.x) + 4, y: Math.max(g.h + 8, Y(dernier.y) + 4), "class": "etiquette-courbe" + (fn.classe ? " " + fn.classe : "") });
        lab.textContent = fn.label;
        r.appendChild(lab);
      }
    });
  };

  window.Courbes = Courbes;
})();
