/* frise.js — des intervalles de temps sur une frise (sélection d'activités,
   ordonnancement…). Un intervalle par ligne, cliquable.

   var f = new Frise(conteneur, {
     debut: 0, fin: 14,                         // bornes de l'axe
     pas: 2,                                    // (optionnel) graduations
     graduation: function (t) { return (8 + t) + "h"; },   // (optionnel) texte d'une graduation
     onIntervalle: function (id) {…}            // (optionnel) rend les intervalles cliquables
   });
   f.dessiner([{ id: "A", a: 0, b: 10, classe: "choisie" }, …]);
     classe : "choisie" (pleine), "courante" (accent : en cours), "barree" (écartée), "conflit" (tirets)
   Frise.compatibles(x, y)  → vrai si [a, b) ne se chevauchent pas (fin = début autorisé) */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function svg(t, a) {
    var e = document.createElementNS(NS, t);
    for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) e.setAttribute(k, a[k]);
    return e;
  }
  var STYLE =
    ".frise{width:100%;height:auto;display:block;touch-action:manipulation;user-select:none;-webkit-user-select:none}" +
    ".frise .axe{stroke:var(--trait-fort);stroke-width:1}" +
    ".frise .grad{fill:var(--encre-3);font-family:var(--mono);font-size:10px;text-anchor:middle}" +
    ".frise .repere{stroke:var(--trait);stroke-width:1;stroke-dasharray:2 3}" +
    ".frise .barre-i{fill:var(--fond-2);stroke:var(--encre-2);stroke-width:1.5}" +
    ".frise .nom-i{fill:var(--encre);font-family:var(--texte);font-size:13px;font-weight:600;dominant-baseline:central}" +
    ".frise .duree-i{fill:var(--encre-2);font-family:var(--mono);font-size:10px;dominant-baseline:central}" +
    ".frise .i.choisie .barre-i{fill:var(--encre);stroke:var(--encre)}" +
    ".frise .i.courante .barre-i{fill:var(--accent-doux);stroke:var(--accent);stroke-width:3}" +
    ".frise .i.barree .barre-i{fill:none;stroke:var(--encre-3);stroke-dasharray:4 3}" +
    ".frise .i.barree .nom-i{fill:var(--encre-3);text-decoration:line-through}" +
    ".frise .i.conflit .barre-i{stroke:var(--encre);stroke-width:2.5;stroke-dasharray:6 4}" +
    ".frise .cible-i{fill:transparent}" +
    ".frise.cliquable .i{cursor:pointer}" +
    ".frise.cliquable .i:hover .barre-i{stroke:var(--accent)}";
  function injecterStyle() {
    if (document.getElementById("style-frise")) return;
    var s = document.createElement("style"); s.id = "style-frise"; s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function Frise(conteneur, o) {
    injecterStyle();
    this.o = o;
    this.L = 340;
    this.racine = svg("svg", { "class": "frise" + (o.onIntervalle ? " cliquable" : ""), role: "img" });
    conteneur.appendChild(this.racine);
  }

  Frise.prototype.dessiner = function (liste) {
    var o = this.o, r = this.racine, self = this;
    while (r.firstChild) r.removeChild(r.firstChild);
    var g = 30, d = 12, H = 28, haut = 6;
    var W = this.L - g - d;
    var total = haut + liste.length * H + 26;
    r.setAttribute("viewBox", "0 0 " + this.L + " " + total);
    function X(t) { return g + (t - o.debut) / (o.fin - o.debut) * W; }
    var pas = o.pas || 1;
    var yAxe = haut + liste.length * H + 4;
    for (var t = o.debut; t <= o.fin + 1e-9; t += pas) {
      r.appendChild(svg("line", { x1: X(t), y1: haut, x2: X(t), y2: yAxe, "class": "repere" }));
      var tx = svg("text", { x: X(t), y: yAxe + 14, "class": "grad" });
      tx.textContent = o.graduation ? o.graduation(t) : String(t);
      r.appendChild(tx);
    }
    r.appendChild(svg("line", { x1: X(o.debut), y1: yAxe, x2: X(o.fin), y2: yAxe, "class": "axe" }));
    liste.forEach(function (it, i) {
      var y = haut + i * H;
      var grp = svg("g", { "class": "i" + (it.classe ? " " + it.classe : ""), "data-intervalle": it.id });
      grp.appendChild(svg("rect", { x: 0, y: y, width: self.L, height: H, "class": "cible-i" }));
      grp.appendChild(svg("rect", { x: X(it.a), y: y + 6, width: Math.max(2, X(it.b) - X(it.a)), height: H - 12, rx: 3, "class": "barre-i" }));
      var nom = svg("text", { x: 4, y: y + H / 2, "class": "nom-i" });
      nom.textContent = it.id;
      grp.appendChild(nom);
      if (it.texte !== undefined || o.durees !== false) {
        var dt = svg("text", { x: X(it.b) + 4, y: y + H / 2, "class": "duree-i" });
        dt.textContent = it.texte !== undefined ? it.texte : "";
        if (X(it.b) + 40 > self.L) { dt.setAttribute("x", X(it.a) - 4); dt.setAttribute("text-anchor", "end"); }
        grp.appendChild(dt);
      }
      if (o.onIntervalle) grp.addEventListener("click", function () { o.onIntervalle(it.id); });
      r.appendChild(grp);
    });
  };

  Frise.compatibles = function (x, y) { return x.b <= y.a || y.b <= x.a; };
  window.Frise = Frise;
})();
