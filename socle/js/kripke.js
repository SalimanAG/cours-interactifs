/* kripke.js — figure SVG d'une structure de Kripke (graphe ORIENTÉ, avec
   auto-boucles, état initial, étiquettes L(s)) et vue d'un chemin infini
   en « lasso » (préfixe puis boucle). Injecte son propre CSS (variables de
   theme.css uniquement). Sert aussi pour les automates et les DTMC.

   var fig = new FigureKripke(conteneur, {
     largeur: 320, hauteur: 200,            // repère des coordonnées (viewBox)
     titre: "…",                            // (optionnel) texte pour lecteur d'écran
     onEtat: function (id) {…}              // (optionnel) rend les états cliquables
   });
   fig.dessiner({
     etats: [{ id: "s0", x: 60, y: 50,
               label: "s0",                 // (défaut : id)
               sous: "p, r",                // (optionnel) texte sous l'état : L(s) ; "\n" pour plusieurs lignes
               sousDessus: true,            // (optionnel) le placer au-dessus
               sousPos: { dx: 22, dy: 0, ancre: "start" },   // (optionnel) ou à une position libre (centré verticalement)
               classe: "plein",             // "plein" (dans l'ensemble), "courant" (accent : en cours),
                                            // "estompe" (hors du graphe restreint), "" (normal)
               initial: 180,                // (optionnel) état initial : angle (degrés) de la flèche entrante
               boucle: -90 }],              // (optionnel) angle de l'auto-boucle (défaut -90 : au-dessus)
     transitions: [{ de: "s0", vers: "s1",
                     classe: "courante",    // "courante" (accent), "chemin" (épaisse), "estompee"
                     label: "0.9",          // (optionnel) texte sur la flèche
                     courbe: 20 }],         // (optionnel) courbure ; par défaut ±16 si l'arc inverse existe
     etiquettes: [{ x, y, texte }]          // (optionnel) textes libres
   });

   var vue = new VueChemin(conteneur, { onPosition: function (i) {…} });   // onPosition optionnel
   vue.dessiner({
     etats: ["s0", "s2", "s0", "s1"],       // π = s0 s2 s0 s1 …
     boucle: 3,                             // après le dernier, on revient en position 3 (π est infini)
                                            // null : chemin pas encore fermé (affiche « … ? »)
     sous: { s0: "p, r", … },               // (optionnel) étiquettes par état
     classes: { 0: "plein", 2: "courant" }  // (optionnel) classe par position
   });
   VueChemin.succ(chemin, i) → position qui suit i dans le lasso. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var compteur = 0;

  function svg(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    return e;
  }

  var STYLE =
    ".fk{width:100%;height:auto;display:block;touch-action:manipulation;user-select:none;-webkit-user-select:none}" +
    ".fk .tr{stroke:var(--encre-2);stroke-width:1.6;fill:none}" +
    ".fk .tr.courante{stroke:var(--accent);stroke-width:2.6}" +
    ".fk .tr.chemin{stroke:var(--encre);stroke-width:3}" +
    ".fk .tr.estompee{stroke:var(--trait);stroke-dasharray:4 3}" +
    ".fk .pointe{fill:var(--encre-2)}.fk .pointe.courante{fill:var(--accent)}.fk .pointe.chemin{fill:var(--encre)}.fk .pointe.estompee{fill:var(--trait-fort)}" +
    ".fk .lab-tr{fill:var(--encre-2);font-family:var(--mono);font-size:10px;text-anchor:middle;dominant-baseline:central;paint-order:stroke;stroke:var(--fond);stroke-width:3px}" +
    ".fk .lab-tr.estompee{fill:var(--encre-3)}" +
    ".fk .etat circle.disque{fill:var(--fond);stroke:var(--encre-2);stroke-width:1.6}" +
    ".fk .etat text.nom{fill:var(--encre);font-family:var(--mono);font-size:12px;text-anchor:middle;dominant-baseline:central}" +
    ".fk .etat text.sous{fill:var(--encre-2);font-family:var(--mono);font-size:10px;text-anchor:middle;dominant-baseline:central}" +
    ".fk .etat.plein circle.disque{fill:var(--encre);stroke:var(--encre)}.fk .etat.plein text.nom{fill:var(--fond);font-weight:600}" +
    ".fk .etat.courant circle.disque{fill:var(--accent-doux);stroke:var(--accent);stroke-width:3}" +
    ".fk .etat.estompe circle.disque{stroke:var(--trait);stroke-dasharray:3 3}.fk .etat.estompe text{fill:var(--encre-3)}" +
    ".fk .cible{fill:transparent}" +
    ".fk.cliquable .etat{cursor:pointer}.fk.cliquable .etat:hover circle.disque{stroke:var(--accent)}" +
    ".fk .init{stroke:var(--encre-2);stroke-width:1.6}" +
    ".fk .etiq{fill:var(--encre-2);font-family:var(--texte);font-size:11px;text-anchor:middle}" +
    ".vue-chemin{display:flex;flex-wrap:wrap;gap:0;align-items:stretch;margin:.5rem 0;font-family:var(--mono);font-size:.82rem;padding-left:1px}" +
    ".vue-chemin .pos{border:1px solid var(--trait-fort);margin-left:-1px;min-width:3rem;text-align:center;display:flex;flex-direction:column;background:var(--fond)}" +
    ".vue-chemin .pos .i{color:var(--encre-3);border-bottom:1px solid var(--trait);font-size:.7rem;padding:.05rem .2rem}" +
    ".vue-chemin .pos .s{padding:.15rem .3rem;font-weight:500}" +
    ".vue-chemin .pos .l{color:var(--encre-2);font-size:.7rem;padding:0 .2rem .15rem;min-height:1.1em}" +
    ".vue-chemin .pos.plein{background:var(--encre);border-color:var(--encre)}.vue-chemin .pos.plein .s,.vue-chemin .pos.plein .l,.vue-chemin .pos.plein .i{color:var(--fond)}" +
    ".vue-chemin .pos.courant{background:var(--accent-doux);border-color:var(--accent);position:relative;z-index:1}" +
    ".vue-chemin .pos.boucle .i::after{content:' ↺'}" +
    ".vue-chemin.cliquable .pos{cursor:pointer}.vue-chemin.cliquable .pos:hover{border-color:var(--accent);position:relative;z-index:2}" +
    ".vue-chemin .suite{align-self:center;color:var(--encre-2);padding:0 .5rem;font-size:.78rem;font-family:var(--texte)}";

  function injecterStyle() {
    if (document.getElementById("style-kripke")) return;
    var s = document.createElement("style");
    s.id = "style-kripke";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function rayon(s) {
    var n = String(s.label != null ? s.label : s.id).length;
    return 15 + Math.max(0, n - 2) * 3.5;
  }
  function rad(d) { return d * Math.PI / 180; }

  function FigureKripke(conteneur, opts) {
    injecterStyle();
    this.opts = opts || {};
    this.L = this.opts.largeur || 320;
    this.H = this.opts.hauteur || 200;
    this.uid = "fk" + (++compteur);
    this.racine = svg("svg", { viewBox: "0 0 " + this.L + " " + this.H, "class": "fk", role: "img" });
    if (this.opts.titre) this.racine.setAttribute("aria-label", this.opts.titre);
    if (this.opts.onEtat) this.racine.classList.add("cliquable");
    conteneur.appendChild(this.racine);
  }

  FigureKripke.prototype.dessiner = function (g) {
    var self = this, r = this.racine, uid = this.uid;
    while (r.firstChild) r.removeChild(r.firstChild);

    var defs = svg("defs", {});
    ["", "courante", "chemin", "estompee"].forEach(function (c) {
      var m = svg("marker", { id: uid + "-p" + c, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse", markerUnits: "userSpaceOnUse" });
      m.setAttribute("markerWidth", 9); m.setAttribute("markerHeight", 9);
      m.appendChild(svg("path", { d: "M0 0 L10 5 L0 10 z", "class": "pointe" + (c ? " " + c : "") }));
      defs.appendChild(m);
    });
    r.appendChild(defs);

    var pos = {};
    g.etats.forEach(function (s) { pos[s.id] = s; });
    var existe = {};
    g.transitions.forEach(function (t) { existe[t.de + "→" + t.vers] = true; });

    var calque = svg("g", {});
    r.appendChild(calque);
    var calqueLab = svg("g", {});

    g.transitions.forEach(function (t) {
      var A = pos[t.de], B = pos[t.vers];
      if (!A || !B) return;
      var c = t.classe || "";
      var d, lx, ly;
      if (t.de === t.vers) {
        var RA = rayon(A), th = rad(A.boucle != null ? A.boucle : -90);
        var a1 = th - rad(32), a2 = th + rad(32), k = RA + 34;
        var p1x = A.x + RA * Math.cos(a1), p1y = A.y + RA * Math.sin(a1);
        var p2x = A.x + (RA + 3) * Math.cos(a2), p2y = A.y + (RA + 3) * Math.sin(a2);
        var c1x = A.x + k * Math.cos(th - rad(58)), c1y = A.y + k * Math.sin(th - rad(58));
        var c2x = A.x + k * Math.cos(th + rad(58)), c2y = A.y + k * Math.sin(th + rad(58));
        d = "M" + p1x.toFixed(1) + " " + p1y.toFixed(1) + " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + p2x.toFixed(1) + " " + p2y.toFixed(1);
        lx = A.x + (RA + 36) * Math.cos(th); ly = A.y + (RA + 36) * Math.sin(th);
      } else {
        var dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
        var courbe = t.courbe != null ? t.courbe : (existe[t.vers + "→" + t.de] ? 16 : 0);
        var mx = (A.x + B.x) / 2 - dy / L * courbe, my = (A.y + B.y) / 2 + dx / L * courbe;
        var ux = mx - A.x, uy = my - A.y, ul = Math.sqrt(ux * ux + uy * uy) || 1;
        var vx = mx - B.x, vy = my - B.y, vl = Math.sqrt(vx * vx + vy * vy) || 1;
        var RA2 = rayon(A), RB = rayon(B) + 2;
        var sx = A.x + ux / ul * RA2, sy = A.y + uy / ul * RA2;
        var ex = B.x + vx / vl * RB, ey = B.y + vy / vl * RB;
        d = "M" + sx.toFixed(1) + " " + sy.toFixed(1) + " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + ex.toFixed(1) + " " + ey.toFixed(1);
        lx = 0.25 * sx + 0.5 * mx + 0.25 * ex; ly = 0.25 * sy + 0.5 * my + 0.25 * ey;
      }
      var p = svg("path", { d: d, "class": "tr" + (c ? " " + c : ""), "marker-end": "url(#" + uid + "-p" + c + ")" });
      calque.appendChild(p);
      if (t.label) {
        var tx = svg("text", { x: lx.toFixed(1), y: ly.toFixed(1), "class": "lab-tr" + (c === "estompee" ? " estompee" : "") });
        tx.textContent = t.label;
        calqueLab.appendChild(tx);
      }
    });
    r.appendChild(calqueLab);

    g.etats.forEach(function (s) {
      var R = rayon(s);
      if (s.initial != null && s.initial !== false) {
        var a = rad(s.initial === true ? 180 : s.initial);
        var x1 = s.x + (R + 18) * Math.cos(a), y1 = s.y + (R + 18) * Math.sin(a);
        var x2 = s.x + (R + 2) * Math.cos(a), y2 = s.y + (R + 2) * Math.sin(a);
        r.appendChild(svg("line", { x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1), "class": "init", "marker-end": "url(#" + uid + "-p)" }));
      }
      var grp = svg("g", { "class": "etat" + (s.classe ? " " + s.classe : ""), "data-etat": s.id, transform: "translate(" + s.x + " " + s.y + ")" });
      grp.appendChild(svg("circle", { r: R + 6, "class": "cible" }));
      grp.appendChild(svg("circle", { r: R, "class": "disque" }));
      var t = svg("text", { x: 0, y: 0, "class": "nom" });
      t.textContent = s.label != null ? s.label : s.id;
      grp.appendChild(t);
      if (s.sous) {
        var lignes = String(s.sous).split("\n");
        var sp = s.sousPos || null;
        var dx = sp ? sp.dx || 0 : 0;
        var dy = sp ? (sp.dy || 0) - (lignes.length - 1) * 5.5 : s.sousDessus ? -(R + 9 + (lignes.length - 1) * 11) : R + 10;
        lignes.forEach(function (l, i) {
          var st = svg("text", { x: dx, y: dy + i * 11, "class": "sous" });
          if (sp && sp.ancre) st.style.textAnchor = sp.ancre;
          st.textContent = l;
          grp.appendChild(st);
        });
      }
      if (self.opts.onEtat) grp.addEventListener("click", function () { self.opts.onEtat(s.id); });
      r.appendChild(grp);
    });

    (g.etiquettes || []).forEach(function (e) {
      var t = svg("text", { x: e.x, y: e.y, "class": "etiq" });
      t.textContent = e.texte;
      r.appendChild(t);
    });
  };

  /* ---------- Vue d'un chemin en lasso ---------- */
  function VueChemin(conteneur, opts) {
    injecterStyle();
    this.opts = opts || {};
    this.boite = document.createElement("div");
    this.boite.className = "vue-chemin" + (this.opts.onPosition ? " cliquable" : "");
    conteneur.appendChild(this.boite);
  }
  VueChemin.prototype.dessiner = function (c) {
    var self = this, b = this.boite;
    b.innerHTML = "";
    var classes = c.classes || {};
    c.etats.forEach(function (s, i) {
      var d = document.createElement("div");
      d.className = "pos" + (classes[i] ? " " + classes[i] : "") + (c.boucle === i ? " boucle" : "");
      d.innerHTML = "<span class='i'>" + i + "</span><span class='s'>" + s + "</span><span class='l'>" + ((c.sous && c.sous[s]) || "") + "</span>";
      d.title = "position " + i + " : état " + s;
      if (self.opts.onPosition) d.addEventListener("click", function () { self.opts.onPosition(i); });
      b.appendChild(d);
    });
    var suite = document.createElement("span");
    suite.className = "suite";
    if (c.boucle == null) suite.textContent = c.etats.length ? "… ?" : "";
    else suite.textContent = "puis retour en position " + c.boucle + " ↺ (pour toujours)";
    b.appendChild(suite);
  };
  VueChemin.succ = function (c, i) { return i + 1 < c.etats.length ? i + 1 : c.boucle; };

  window.FigureKripke = FigureKripke;
  window.VueChemin = VueChemin;
})();
