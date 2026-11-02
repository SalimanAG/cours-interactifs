/* outils.js — petites aides partagées par les leçons de NLP and Deep Learning. */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };
  function fmt(v, d) {
    if (typeof v !== "number" || isNaN(v)) return "—";
    var r = Number(v.toFixed(d === undefined ? 2 : d)); if (r === 0) r = 0;
    return String(r).replace(".", ",").replace("-", "−");
  }
  function html(zone, contenu, classe) { var d = el("div", classe || ""); d.innerHTML = contenu; zone.appendChild(d); return d; }
  function m(t) { return "<span class='mono'>" + t + "</span>"; }
  /* Enchaîne plusieurs exercices dans une étape : le suivant apparaît après réussite du précédent. */
  function enchainer(zone, api, exos, message) {
    var i = 0;
    function suivant() {
      if (i >= exos.length) { api.valider(message); return; }
      var bloc = el("div");
      if (i > 0) bloc.style.marginTop = "1.2rem";
      zone.appendChild(bloc);
      exos[i++](bloc, suivant);
    }
    suivant();
  }
  /* Curseur (input range) avec sa valeur affichée. */
  function curseur(zone, o) {
    var ligne = el("div", "saisie");
    var lab = el("label", null, o.label || "");
    var r = el("input");
    r.type = "range"; r.min = String(o.min); r.max = String(o.max); r.step = String(o.pas); r.value = String(o.valeur);
    r.style.flex = "1 1 9rem";
    r.id = "c" + Math.random().toString(36).slice(2, 7); lab.htmlFor = r.id;
    var v = el("span", "mono", (o.format || fmt)(o.valeur));
    r.addEventListener("input", function () { var x = Number(r.value); v.textContent = (o.format || fmt)(x); o.surChange(x); });
    ligne.appendChild(lab); ligne.appendChild(r); ligne.appendChild(v);
    zone.appendChild(ligne);
    return r;
  }
  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function legende(zone) { var p = el("p", "legende-figure"); zone.appendChild(p); return p; }
  function tableau(entetes, lignes) {
    return "<table class='tableau'><tr>" + entetes.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" +
      lignes.map(function (l) { return "<tr>" + l.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table>";
  }
  function code(texte) { return "<div class='code'>" + texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/(#[^\n]*)/g, "<span class='com'>$1</span>") + "</div>"; }
  function sigmoide(t) { return 1 / (1 + Math.exp(-t)); }
  function softmax(v) { var mx = Math.max.apply(null, v); var e = v.map(function (x) { return Math.exp(x - mx); }); var s = e.reduce(function (a, b) { return a + b; }, 0); return e.map(function (x) { return x / s; }); }

  /* Nuage de points + courbes, axes à échelles indépendantes (SVG).
     NLP.nuage(zone, { xmin, xmax, ymin, ymax, hauteur, points: [{ x, y, classe: "plein"|"vide" }],
                       courbes: [{ f, classe: "courante"|"ref" }], nomX, nomY }) */
  var NS = "http://www.w3.org/2000/svg";
  function sv(t, a) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); return e; }
  if (!document.getElementById("style-nuage")) {
    var stl = document.createElement("style"); stl.id = "style-nuage";
    stl.textContent = ".nuage{width:100%;height:auto;display:block}.nuage .ax{stroke:var(--trait-fort)}.nuage .gr{fill:var(--encre-3);font-family:var(--mono);font-size:9px}" +
      ".nuage .pt{fill:var(--encre)}.nuage .pt.vide{fill:var(--fond);stroke:var(--encre-2);stroke-width:1.5}.nuage .cb{fill:none;stroke:var(--encre);stroke-width:2}" +
      ".nuage .cb.courante{stroke:var(--accent);stroke-width:2.5}.nuage .cb.ref{stroke:var(--encre-3);stroke-dasharray:4 3}";
    document.head.appendChild(stl);
  }
  function nuage(zone, o) {
    var W = 340, H = o.hauteur || 200, g = { l: 30, r: 10, h: 10, b: 22 };
    var X = function (x) { return g.l + (x - o.xmin) / (o.xmax - o.xmin) * (W - g.l - g.r); };
    var Y = function (y) { return g.h + (o.ymax - y) / (o.ymax - o.ymin) * (H - g.h - g.b); };
    var s = sv("svg", { viewBox: "0 0 " + W + " " + H, "class": "nuage", role: "img" });
    var y0 = Math.max(o.ymin, Math.min(o.ymax, 0));
    s.appendChild(sv("line", { x1: g.l, y1: Y(y0), x2: W - g.r, y2: Y(y0), "class": "ax" }));
    s.appendChild(sv("line", { x1: g.l, y1: g.h, x2: g.l, y2: H - g.b, "class": "ax" }));
    [o.ymin, o.ymax].forEach(function (v) { var t = sv("text", { x: g.l - 4, y: Y(v) + 3, "class": "gr", "text-anchor": "end" }); t.textContent = fmt(v, 1); s.appendChild(t); });
    [o.xmin, o.xmax].forEach(function (v) { var t = sv("text", { x: X(v), y: H - 6, "class": "gr", "text-anchor": "middle" }); t.textContent = fmt(v, 1); s.appendChild(t); });
    if (o.nomX) { var tx = sv("text", { x: W - g.r, y: H - 6, "class": "gr", "text-anchor": "end" }); tx.textContent = o.nomX; s.appendChild(tx); }
    if (o.nomY) { var ty = sv("text", { x: g.l + 4, y: g.h + 8, "class": "gr" }); ty.textContent = o.nomY; s.appendChild(ty); }
    (o.courbes || []).forEach(function (c) {
      var pts = [];
      for (var i = 0; i <= 200; i++) { var x = o.xmin + (o.xmax - o.xmin) * i / 200, y = c.f(x); if (isFinite(y)) pts.push(X(x).toFixed(1) + "," + Y(Math.max(o.ymin, Math.min(o.ymax, y))).toFixed(1)); }
      s.appendChild(sv("polyline", { points: pts.join(" "), "class": "cb" + (c.classe ? " " + c.classe : "") }));
    });
    (o.points || []).forEach(function (p) { s.appendChild(sv("circle", { cx: X(p.x), cy: Y(p.y), r: 4, "class": "pt" + (p.classe ? " " + p.classe : "") })); });
    var cadreEl = cadre(zone);
    cadreEl.style.overflow = "hidden";
    cadreEl.appendChild(s);
    return s;
  }

  window.NLP = { fmt: fmt, html: html, m: m, enchainer: enchainer, curseur: curseur, cadre: cadre, legende: legende, tableau: tableau, code: code, sigmoide: sigmoide, softmax: softmax, nuage: nuage, el: el };
})();
