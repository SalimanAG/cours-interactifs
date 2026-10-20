/* graphe.js — figure SVG d'un (multi)graphe non orienté, réutilisable.

   var fig = new FigureGraphe(conteneur, {
     largeur: 320, hauteur: 180,          // repère des coordonnées (viewBox)
     onArete: function (idArete) {…},     // rend les arêtes cliquables
     onSommet: function (idSommet) {…}    // rend les sommets cliquables
   });
   fig.dessiner({
     sommets: [{ id, x, y, label, sous?, classe? }],   // classe : "plein", "courant"
     aretes:  [{ id, u, v, classe? }],                 // classe : "traverse", "courante", "estompee"
     etiquettes: [{ x, y, texte }]                      // (optionnel) textes libres
   });

   Les arêtes parallèles (même paire de sommets) sont dessinées en arcs
   écartés les uns des autres. Chaque arête a une zone de clic élargie
   (utile au doigt sur téléphone). */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  function svg(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    return e;
  }

  function rayon(s) {
    var n = String(s.label || "").length;
    return 17 + Math.max(0, n - 1) * 4.5;
  }

  function FigureGraphe(conteneur, opts) {
    this.opts = opts || {};
    this.L = this.opts.largeur || 320;
    this.H = this.opts.hauteur || 180;
    this.racine = svg("svg", { viewBox: "0 0 " + this.L + " " + this.H, "class": "figure-graphe", role: "img" });
    if (this.opts.titre) this.racine.setAttribute("aria-label", this.opts.titre);
    if (this.opts.onArete) this.racine.classList.add("cliquable-aretes");
    if (this.opts.onSommet) this.racine.classList.add("cliquable-sommets");
    conteneur.appendChild(this.racine);
  }

  FigureGraphe.prototype.activerAretes = function (oui) {
    this.racine.classList.toggle("cliquable-aretes", !!oui && !!this.opts.onArete);
    this.aretesActives = !!oui;
  };

  FigureGraphe.prototype.dessiner = function (g) {
    var self = this;
    var r = this.racine;
    while (r.firstChild) r.removeChild(r.firstChild);
    var pos = {};
    g.sommets.forEach(function (s) { pos[s.id] = s; });

    // Regrouper les arêtes parallèles.
    var paires = {};
    g.aretes.forEach(function (a) {
      var k = a.u < a.v ? a.u + "|" + a.v : a.v + "|" + a.u;
      (paires[k] = paires[k] || []).push(a);
    });

    var calqueAretes = svg("g", {});
    r.appendChild(calqueAretes);
    Object.keys(paires).forEach(function (k) {
      var l = paires[k];
      l.forEach(function (a, i) {
        var p = pos[a.u], q = pos[a.v];
        if (!p || !q) return;
        // Toujours orienter le calcul de la même façon pour que les arcs ne se croisent pas.
        var A = a.u < a.v ? p : q, B = a.u < a.v ? q : p;
        var dx = B.x - A.x, dy = B.y - A.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var ecart = (i - (l.length - 1) / 2) * 22;
        var mx = (A.x + B.x) / 2 - dy / d * ecart, my = (A.y + B.y) / 2 + dx / d * ecart;
        var chemin = "M" + A.x + " " + A.y + " Q" + mx + " " + my + " " + B.x + " " + B.y;
        var grp = svg("g", { "class": "lien", "data-arete": a.id });
        grp.appendChild(svg("path", { d: chemin, "class": "arete" + (a.classe ? " " + a.classe : "") }));
        var cible = svg("path", { d: chemin, "class": "arete-cible" });
        grp.appendChild(cible);
        if (self.opts.onArete) {
          grp.addEventListener("click", function () {
            if (self.aretesActives === false) return;
            self.opts.onArete(a.id);
          });
        }
        calqueAretes.appendChild(grp);
      });
    });

    g.sommets.forEach(function (s) {
      var grp = svg("g", { "class": "sommet" + (s.classe ? " " + s.classe : ""), "data-sommet": s.id, transform: "translate(" + s.x + " " + s.y + ")" });
      var R = rayon(s);
      grp.appendChild(svg("circle", { r: R }));
      var t = svg("text", { x: 0, y: 0 });
      t.textContent = s.label;
      grp.appendChild(t);
      if (s.sous) {
        var st = svg("text", { x: 0, y: R + 12, "class": "sous" });
        st.textContent = s.sous;
        grp.appendChild(st);
      }
      if (self.opts.onSommet) {
        grp.addEventListener("click", function () { self.opts.onSommet(s.id); });
      }
      r.appendChild(grp);
    });

    (g.etiquettes || []).forEach(function (e) {
      var t = svg("text", { x: e.x, y: e.y, "class": "etiquette-graphe" });
      t.textContent = e.texte;
      r.appendChild(t);
    });
  };

  window.FigureGraphe = FigureGraphe;
})();
