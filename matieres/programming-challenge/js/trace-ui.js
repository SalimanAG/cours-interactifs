/* trace-ui.js — panneau « trace au tableau » pour Is it a tree :
   figure du graphe + file F + tableau vu[1..N] + compte + pseudo-code
   avec la ligne en cours, piloté par le Controleur (⏮ ◀ ▶ ⏵).

   var p = TraceArbre.panneau(zone, { delai: 650, surFin: function (dernierEtat) {…} });
   p.charger(g, { forcer: false, lecture: true });   // calcule la trace et l'affiche
   p.stop();                                          // à appeler au nettoyage de l'étape */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  function panneau(zone, opts) {
    opts = opts || {};
    var grille = el("div", "cote-a-cote");
    zone.appendChild(grille);
    var gauche = el("div"), droite = el("div");
    grille.appendChild(gauche); grille.appendChild(droite);

    var cadre = el("div", "cadre-figure");
    gauche.appendChild(cadre);
    var fig = new FigureGraphe(cadre, { largeur: 350, hauteur: 195, titre: "Graphe de l'entrée" });
    var mem = el("div", "memoire");
    gauche.appendChild(mem);
    var vuEl = el("div", "vu");
    gauche.appendChild(vuEl);
    var note = el("p", "legende-figure");
    gauche.appendChild(note);

    var g = null, trace = [];
    var ctl = new Controleur(gauche, {
      delai: opts.delai || 650,
      afficher: function (i) { afficher(trace[i]); },
      surFin: function () { if (opts.surFin) opts.surFin(trace[trace.length - 1], g); }
    });
    var pc = new PseudoCode(droite, { titre: "EST-UN-ARBRE(N, M, arêtes)", lignes: EstArbre.LIGNES });

    function afficher(e) {
      fig.dessiner(EstArbre.vue(g, e, { ordre: opts.ordre }));
      pc.surligner(e.ligne);
      mem.innerHTML = "";
      mem.appendChild(el("span", "nom-memoire", "F ="));
      if (!e.vu.length) mem.appendChild(el("span", "vide", "(pas encore créée)"));
      else if (!e.file.length) mem.appendChild(el("span", "vide", "(vide)"));
      e.file.forEach(function (x, i) { mem.appendChild(el("span", "elt" + (i === 0 ? " tete-file" : ""), String(x))); });
      mem.appendChild(el("span", "nom-memoire", " · compte = "));
      mem.appendChild(el("span", "mono", e.vu.length ? String(e.compte) : "—"));
      if (e.ordre.length) mem.appendChild(el("span", "nom-memoire", " · défilés : " + e.ordre.join(", ")));
      vuEl.innerHTML = "";
      if (e.vu.length) {
        vuEl.appendChild(el("span", "nom-vu", "vu"));
        for (var u = 1; u <= g.n; u++) {
          var c = el("span", "cellule-vu" + (e.vu[u] ? " oui" : "") + (e.maj === u ? " maj" : ""));
          c.appendChild(el("span", "i", String(u)));
          c.appendChild(el("span", "v", e.vu[u] ? "V" : "F"));
          vuEl.appendChild(c);
        }
      }
      note.textContent = e.note + (e.fin ? "  Sortie : " + e.fin : "");
    }

    function charger(graphe, o) {
      o = o || {};
      g = graphe;
      trace = EstArbre.executer(g, { forcer: !!o.forcer });
      ctl.charger(trace.length);
      if (o.lecture) ctl.lecture();
    }
    function dessinerSeul(graphe) {
      g = graphe; trace = [];
      ctl.charger(0);
      fig.dessiner(EstArbre.vue(g, null));
      pc.surligner(null);
      mem.innerHTML = ""; vuEl.innerHTML = ""; note.textContent = "";
    }

    return {
      charger: charger,
      dessinerSeul: dessinerSeul,
      stop: function () { ctl.stop(); },
      controleur: ctl,
      trace: function () { return trace; }
    };
  }

  window.TraceArbre = { panneau: panneau };
})();
