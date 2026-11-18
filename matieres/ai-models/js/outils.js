/* outils.js — petites aides partagées par les leçons de AI Models and Applications. */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  /* Nombre → texte français (virgule, vrai signe moins). */
  function fmt(v, d) {
    if (typeof v !== "number" || isNaN(v)) return "—";
    var r = Number(v.toFixed(d === undefined ? 3 : d)); if (r === 0) r = 0;
    return String(r).replace(".", ",").replace("-", "−");
  }
  /* Nombre → fraction lisible (7/6, −2/3, 5) si un petit dénominateur convient, sinon décimal. */
  function frac(v, dmax) {
    dmax = dmax || 200;
    for (var d = 1; d <= dmax; d++) {
      var n = Math.round(v * d);
      if (Math.abs(n / d - v) < 1e-9) return (n < 0 ? "−" : "") + Math.abs(n) + (d > 1 ? "/" + d : "");
    }
    return fmt(v);
  }
  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function ppcm(a, b) { return a / pgcd(a, b) * b; }

  function html(zone, contenu, classe) { var d = el("div", classe || ""); d.innerHTML = contenu; zone.appendChild(d); return d; }
  /* Note de fidélité placée sous la zone d'exercice (avant l'objectif), quel que soit le contenu ajouté ensuite. */
  function note(zone, contenu) {
    var d = el("div", "signalement"); d.innerHTML = contenu;
    if (zone.parentNode) zone.parentNode.insertBefore(d, zone.nextSibling); else zone.appendChild(d);
    return d;
  }
  function m(t) { return "<span class='mono'>" + t + "</span>"; }
  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function legende(zone) { var p = el("p", "legende-figure"); zone.appendChild(p); return p; }
  function tableau(entetes, lignes) {
    return "<table class='tableau'><tr>" + entetes.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" +
      lignes.map(function (l) { return "<tr>" + l.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table>";
  }
  /* Enchaîne plusieurs exercices dans une étape : le suivant apparaît après réussite du précédent. */
  function enchainer(zone, api, exos, message) {
    var i = 0;
    function suivant() {
      if (i >= exos.length) { api.valider(message); return; }
      var bloc = el("div");
      if (i > 0) bloc.style.marginTop = "1.1rem";
      zone.appendChild(bloc);
      exos[i++](bloc, suivant);
    }
    suivant();
  }

  /* Tracé de fonctions d'une variable, axes à échelles libres (valeurs négatives permises).
     AIM.trace(zone, { xmin, xmax, ymin, ymax, hauteur, nomX,
                       courbes: [{ f, label, classe: "courante"|"ref"|"" , marches: true }],
                       polylignes: [{ points: [[x, y], …], classe }],
                       points: [{ x, y, label }] }) → { redessiner(o) } */
  var NS = "http://www.w3.org/2000/svg";
  function sv(t, a) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); return e; }
  if (!document.getElementById("style-aim")) {
    var stl = document.createElement("style"); stl.id = "style-aim";
    stl.textContent = ".aim-trace{width:100%;height:auto;display:block}.aim-trace .ax{stroke:var(--trait-fort)}" +
      ".aim-trace .gr{fill:var(--encre-3);font-family:var(--mono);font-size:9px}" +
      ".aim-trace .cb{fill:none;stroke:var(--encre);stroke-width:2}.aim-trace .cb.courante{stroke:var(--accent);stroke-width:2.5}" +
      ".aim-trace .cb.ref{stroke:var(--encre-3);stroke-dasharray:4 3}" +
      ".aim-trace .lb{font-family:var(--mono);font-size:10px;fill:var(--encre)}.aim-trace .lb.courante{fill:var(--accent)}.aim-trace .lb.ref{fill:var(--encre-3)}" +
      ".aim-trace .pt{fill:var(--encre)}.aim-trace .pt.courante{fill:var(--accent)}.aim-trace .pt.vide{fill:var(--fond);stroke:var(--encre-2);stroke-width:1.5}" +
      ".vecteurs .seg.plein{stroke:var(--encre);stroke-width:2;stroke-dasharray:none}.vecteurs .seg.courant{stroke:var(--accent);stroke-width:2.2;stroke-dasharray:none}";
    document.head.appendChild(stl);
  }
  function trace(zone, o) {
    var c = cadre(zone);
    var s = sv("svg", { "class": "aim-trace", role: "img" });
    c.appendChild(s);
    function dessiner(o) {
      while (s.firstChild) s.removeChild(s.firstChild);
      var W = 340, H = o.hauteur || 200, g = { l: 30, r: 40, h: 10, b: 20 };
      s.setAttribute("viewBox", "0 0 " + W + " " + H);
      var X = function (x) { return g.l + (x - o.xmin) / (o.xmax - o.xmin) * (W - g.l - g.r); };
      var Y = function (y) { return g.h + (o.ymax - y) / (o.ymax - o.ymin) * (H - g.h - g.b); };
      var y0 = Math.max(o.ymin, Math.min(o.ymax, 0)), x0 = Math.max(o.xmin, Math.min(o.xmax, 0));
      s.appendChild(sv("line", { x1: g.l, y1: Y(y0), x2: W - g.r, y2: Y(y0), "class": "ax" }));
      s.appendChild(sv("line", { x1: X(x0), y1: g.h, x2: X(x0), y2: H - g.b, "class": "ax" }));
      (o.gradY || [o.ymin, o.ymax]).forEach(function (v) { var t = sv("text", { x: g.l - 4, y: Y(v) + 3, "class": "gr", "text-anchor": "end" }); t.textContent = fmt(v, 2); s.appendChild(t); });
      (o.gradX || [o.xmin, o.xmax]).forEach(function (v) { var t = sv("text", { x: X(v), y: H - 6, "class": "gr", "text-anchor": "middle" }); t.textContent = fmt(v, 2); s.appendChild(t); });
      if (o.nomY) { var tyy = sv("text", { x: X(x0) + 4, y: g.h + 8, "class": "gr" }); tyy.textContent = o.nomY; s.appendChild(tyy); }
      if (o.nomX) { var tx = sv("text", { x: W - g.r + 4, y: Y(y0) + 3, "class": "gr" }); tx.textContent = o.nomX; s.appendChild(tx); }
      (o.courbes || []).forEach(function (cb) {
        var pts = [], N = 300, last = null;
        for (var i = 0; i <= N; i++) {
          var x = o.xmin + (o.xmax - o.xmin) * i / N, y = cb.f(x);
          if (!isFinite(y)) continue;
          y = Math.max(o.ymin, Math.min(o.ymax, y));
          if (cb.marches && last !== null && y !== last) pts.push(X(x).toFixed(1) + "," + Y(last).toFixed(1));
          pts.push(X(x).toFixed(1) + "," + Y(y).toFixed(1));
          last = y;
        }
        s.appendChild(sv("polyline", { points: pts.join(" "), "class": "cb" + (cb.classe ? " " + cb.classe : "") }));
        if (cb.label) {
          var xl = cb.labelX === undefined ? o.xmax : cb.labelX;
          var yl = Math.max(o.ymin, Math.min(o.ymax, cb.f(xl)));
          var t = sv("text", { x: cb.labelX === undefined ? W - g.r + 4 : X(xl) + 6, y: Y(yl) + 4 + (cb.decalage || 0), "class": "lb" + (cb.classe ? " " + cb.classe : "") });
          t.textContent = cb.label; s.appendChild(t);
        }
      });
      (o.polylignes || []).forEach(function (pl) {
        s.appendChild(sv("polyline", { points: pl.points.map(function (q) { return X(q[0]).toFixed(1) + "," + Y(q[1]).toFixed(1); }).join(" "), "class": "cb" + (pl.classe ? " " + pl.classe : "") }));
      });
      (o.points || []).forEach(function (p) {
        s.appendChild(sv("circle", { cx: X(p.x), cy: Y(p.y), r: 4, "class": "pt" + (p.classe ? " " + p.classe : "") }));
        if (p.label) { var t = sv("text", { x: X(p.x) + 6, y: Y(p.y) - 6, "class": "lb" }); t.textContent = p.label; s.appendChild(t); }
      });
    }
    dessiner(o);
    return { redessiner: dessiner };
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

  /* Bloc de code (texte brut échappé ; commentaires # en gris). */
  function code(texte) {
    return "<div class='code'>" + texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/(#[^\n]*)/g, "<span class='com'>$1</span>") + "</div>";
  }
  /* Choix et cases à cocher avec options mélangées (ordre fixe pour une question donnée, pour que la bonne réponse
     ne soit pas toujours la première). Mêmes paramètres qu'Exercices.choix / Exercices.cocher. */
  function permutation(cle, n) {
    var h = 2166136261;
    for (var i = 0; i < cle.length; i++) { h ^= cle.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    var p = []; for (var k = 0; k < n; k++) p.push(k);
    for (var j = n - 1; j > 0; j--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; var r = h % (j + 1), t = p[j]; p[j] = p[r]; p[r] = t; }
    return p;
  }
  function choix(zone, o) {
    var p = permutation(o.question || o.options.join("|"), o.options.length);
    var q = {}; for (var k in o) q[k] = o[k];
    q.options = p.map(function (i) { return o.options[i]; });
    if (o.expliquer) q.expliquer = p.map(function (i) { return o.expliquer[i]; });
    q.bonne = p.indexOf(o.bonne);
    return Exercices.choix(zone, q);
  }
  function cocher(zone, o) {
    var p = permutation(o.question || o.options.join("|"), o.options.length);
    var q = {}; for (var k in o) q[k] = o[k];
    q.options = p.map(function (i) { return o.options[i]; });
    q.bonnes = o.bonnes.map(function (b) { return p.indexOf(b); });
    return Exercices.cocher(zone, q);
  }
  function sigmoide(x) { return 1 / (1 + Math.exp(-x)); }
  function sigmoideBip(x) { return (1 - Math.exp(-x)) / (1 + Math.exp(-x)); }

  window.AIM = {
    fmt: fmt, frac: frac, note: note, pgcd: pgcd, ppcm: ppcm, html: html, m: m, cadre: cadre, legende: legende,
    tableau: tableau, code: code, choix: choix, cocher: cocher, enchainer: enchainer, trace: trace, curseur: curseur,
    S: sigmoide, Sb: sigmoideBip,
    H: function (x) { return x >= 0 ? 1 : 0; },
    SG: function (x) { return x >= 0 ? 1 : -1; }
  };
})();
