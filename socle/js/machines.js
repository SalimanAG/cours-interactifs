/* machines.js — affectation de tâches à des machines (équilibrage de charges).

   Affichage :
     var vue = new Machines(conteneur, { m: 3, onMachine: function (i) {…} });
     vue.dessiner(affectation, { echelle: 20, courante: i, marques: [{ x: 6, texte: "L*" }], attente: [5, 4] });
       affectation : tableau de m listes de durées, ex. [[2, 3], [4], [5]]
       echelle     : charge correspondant à toute la largeur
       courante    : indice de machine mise en couleur (ou null)
       attente     : tâches pas encore affectées (affichées au-dessus, la 1re en couleur)

   Calculs :
     Machines.charges(aff)               → [L1, …, Lm]
     Machines.makespan(aff)              → max Li
     Machines.listScheduling(liste, m)   → { aff, pas: [{ tache, machine, charges }] } (égalité → plus petit indice)
     Machines.lpt(liste, m)              → idem sur la liste triée par durées décroissantes
     Machines.optimum(durees, m)         → { makespan, aff } par recherche exhaustive (petites instances)
     Machines.moinsChargees(aff)         → indices des machines de charge minimum */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  function charges(aff) { return aff.map(function (l) { return l.reduce(function (a, b) { return a + b; }, 0); }); }
  function makespan(aff) { return Math.max.apply(null, charges(aff)); }
  function moinsChargees(aff) {
    var c = charges(aff), min = Math.min.apply(null, c), r = [];
    c.forEach(function (x, i) { if (x === min) r.push(i); });
    return r;
  }
  function vide(m) { var a = []; for (var i = 0; i < m; i++) a.push([]); return a; }

  function listScheduling(liste, m) {
    var aff = vide(m), pas = [];
    liste.forEach(function (t) {
      var i = moinsChargees(aff)[0];
      aff[i].push(t);
      pas.push({ tache: t, machine: i, charges: charges(aff) });
    });
    return { aff: aff, pas: pas };
  }
  function lpt(liste, m) {
    return listScheduling(liste.slice().sort(function (a, b) { return b - a; }), m);
  }

  function optimum(durees, m) {
    var t = durees.slice().sort(function (a, b) { return b - a; });
    var total = t.reduce(function (a, b) { return a + b; }, 0);
    var borne = Math.max(t[0] || 0, total / m);
    var meilleur = lpt(durees, m);
    var best = makespan(meilleur.aff), bestAff = meilleur.aff;
    var L = []; for (var i = 0; i < m; i++) L.push(0);
    var A = vide(m);
    function rec(k) {
      if (best <= borne + 1e-9) return;
      if (k === t.length) {
        var ms = Math.max.apply(null, L);
        if (ms < best) { best = ms; bestAff = A.map(function (x) { return x.slice(); }); }
        return;
      }
      var vus = {};
      for (var i = 0; i < m; i++) {
        if (vus[L[i]]) continue; // machines de même charge : symétrie
        vus[L[i]] = true;
        if (L[i] + t[k] >= best) continue;
        L[i] += t[k]; A[i].push(t[k]);
        rec(k + 1);
        L[i] -= t[k]; A[i].pop();
      }
    }
    rec(0);
    return { makespan: best, aff: bestAff };
  }

  function Machines(conteneur, opts) {
    this.opts = opts || {};
    this.boite = el("div", "machines");
    conteneur.appendChild(this.boite);
  }
  Machines.prototype.dessiner = function (aff, o) {
    o = o || {};
    var self = this;
    var b = this.boite;
    b.innerHTML = "";
    var c = charges(aff);
    var echelle = o.echelle || Math.max.apply(null, c.concat([1]));
    if (o.attente) {
      var att = el("div", "attente");
      att.appendChild(el("span", "nom-memoire", o.attente.length ? "à affecter :" : "toutes les tâches sont affectées"));
      o.attente.forEach(function (d, i) { att.appendChild(el("span", "elt" + (i === 0 ? " tete-file" : ""), String(d))); });
      b.appendChild(att);
    }
    var ms = Math.max.apply(null, c);
    aff.forEach(function (l, i) {
      var ligne = el(self.opts.onMachine ? "button" : "div", "machine" + (o.courante === i ? " courante" : ""));
      if (self.opts.onMachine) { ligne.type = "button"; ligne.onclick = function () { self.opts.onMachine(i); }; }
      var nom = el("span", "nom-machine", "M" + (i + 1));
      ligne.appendChild(nom);
      var piste = el("span", "piste");
      l.forEach(function (d) {
        var blk = el("span", "tache", String(d));
        blk.style.width = (d / echelle * 100) + "%";
        piste.appendChild(blk);
      });
      (o.marques || []).forEach(function (mq) {
        var t = el("span", "marque-piste");
        t.style.left = Math.min(100, mq.x / echelle * 100) + "%";
        piste.appendChild(t);
      });
      ligne.appendChild(piste);
      ligne.appendChild(el("span", "charge" + (c[i] === ms && ms > 0 ? " max" : ""), String(c[i])));
      b.appendChild(ligne);
    });
    if (o.marques && o.marques.length) {
      var leg = el("div", "legende-figure");
      o.marques.forEach(function (mq) { leg.appendChild(el("span", null, "┊ " + mq.texte + " = " + mq.x)); });
      b.appendChild(leg);
    }
  };

  Machines.charges = charges;
  Machines.makespan = makespan;
  Machines.moinsChargees = moinsChargees;
  Machines.listScheduling = listScheduling;
  Machines.lpt = lpt;
  Machines.optimum = optimum;
  Machines.vide = vide;
  window.Machines = Machines;
})();
