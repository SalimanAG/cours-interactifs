/* stable.js — modèle de l'algorithme de branching pour le stable maximum (cours 4, TP2).

   Stable.EXEMPLE : le graphe de la diapo « Branching » du cours 4 (sommets x, a…g).
   Stable.HEXAGONE : le graphe de la diapo « Problème du stable maximum » (cycle a…f).

   Stable.voisins(g)                       → { v: [voisins triés] }
   Stable.estStable(g, S)                  → booléen
   Stable.arbre(g, { coupe: bool, enumerer: bool })
       → { noeuds: [{ id, parent, y, S, presents, x, profondeur, enfants, feuille, coupe }], meilleur, alpha, stables }
         Exécution de l'algorithme du cours : sur le graphe courant, choisir x de degré minimum
         (à égalité : le premier dans l'ordre de déclaration des sommets), puis une branche par y ∈ {x} ∪ N(x) : y dans S,
         on retire y et N(y). Feuille = graphe vide. coupe : condition d'arrêt du TP2 (question 5).
   Stable.disposer(noeuds, largeur, hauteur) → positions { id: { x, y } } pour dessiner l'arbre
   Stable.tau([t1, …, tr])                 → branching factor (racine réelle > 1 de 1 = Σ x^(−ti)) */
(function () {
  "use strict";

  var EXEMPLE = {
    sommets: [
      { id: "x", x: 30, y: 112 }, { id: "a", x: 95, y: 64 }, { id: "b", x: 95, y: 162 },
      { id: "e", x: 165, y: 28 }, { id: "d", x: 165, y: 100 }, { id: "f", x: 238, y: 64 },
      { id: "c", x: 165, y: 162 }, { id: "g", x: 238, y: 162 }
    ],
    aretes: [
      ["x", "a"], ["x", "b"], ["a", "b"], ["a", "e"], ["a", "d"], ["e", "d"],
      ["e", "f"], ["d", "f"], ["b", "c"], ["c", "g"], ["b", "g"]
    ].map(function (p) { return { id: p[0] + p[1], u: p[0], v: p[1] }; })
  };
  var HEXAGONE = {
    sommets: [
      { id: "a", x: 115, y: 36 }, { id: "b", x: 205, y: 36 }, { id: "c", x: 255, y: 100 },
      { id: "d", x: 205, y: 164 }, { id: "e", x: 115, y: 164 }, { id: "f", x: 65, y: 100 }
    ],
    aretes: [["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"], ["e", "f"], ["f", "a"]]
      .map(function (p) { return { id: p[0] + p[1], u: p[0], v: p[1] }; })
  };

  function voisins(g) {
    var N = {};
    g.sommets.forEach(function (s) { N[s.id] = []; });
    g.aretes.forEach(function (a) { N[a.u].push(a.v); N[a.v].push(a.u); });
    Object.keys(N).forEach(function (k) { N[k].sort(); });
    return N;
  }
  function estStable(g, S) {
    var N = voisins(g);
    return S.every(function (u) { return N[u].every(function (v) { return S.indexOf(v) < 0; }); });
  }
  function degres(N, presents) {
    var d = {};
    presents.forEach(function (v) { d[v] = N[v].filter(function (w) { return presents.indexOf(w) >= 0; }).length; });
    return d;
  }
  function choisirX(N, presents) {
    var d = degres(N, presents), best = null;
    presents.forEach(function (v) { if (best === null || d[v] < d[best]) best = v; });
    return best;
  }

  function arbre(g, opts) {
    opts = opts || {};
    var N = voisins(g);
    var noeuds = [], meilleur = { taille: 0, S: [] }, stables = [];
    var tous = g.sommets.map(function (s) { return s.id; });
    function rec(parent, y, S, presents, prof) {
      var n = { id: noeuds.length, parent: parent, y: y, S: S.slice(), presents: presents.slice(), profondeur: prof, enfants: [], feuille: false, coupe: false, x: null };
      noeuds.push(n);
      if (parent !== null) noeuds[parent].enfants.push(n.id);
      if (!presents.length) {
        n.feuille = true;
        stables.push(S.slice().sort());
        if (S.length > meilleur.taille) meilleur = { taille: S.length, S: S.slice().sort() };
        return;
      }
      if (opts.coupe && S.length + presents.length <= meilleur.taille) { n.coupe = true; return; }
      var x = choisirX(N, presents);
      n.x = x;
      var cas = [x].concat(N[x].filter(function (w) { return presents.indexOf(w) >= 0; })).sort();
      cas.forEach(function (yy) {
        var retires = [yy].concat(N[yy]);
        rec(n.id, yy, S.concat([yy]), presents.filter(function (v) { return retires.indexOf(v) < 0; }), prof + 1);
      });
    }
    rec(null, null, [], tous, 0);
    var alpha = meilleur.taille;
    return { noeuds: noeuds, meilleur: meilleur, alpha: alpha, stables: stables };
  }

  function disposer(noeuds, L, H) {
    var pos = {}, feuilles = 0, profMax = 0;
    noeuds.forEach(function (n) { if (!n.enfants.length) feuilles++; profMax = Math.max(profMax, n.profondeur); });
    var k = 0;
    (function placer(id) {
      var n = noeuds[id];
      var y = 14 + n.profondeur * ((H - 28) / Math.max(1, profMax));
      if (!n.enfants.length) { pos[id] = { x: 12 + (k + 0.5) * (L - 24) / feuilles, y: y }; k++; return; }
      n.enfants.forEach(placer);
      var xs = n.enfants.map(function (e) { return pos[e].x; });
      pos[id] = { x: (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, y: y };
    })(0);
    return pos;
  }

  function tau(t) {
    // f(x) = 1 − Σ x^(−ti) est croissante sur ]1, +∞[ ; racine par dichotomie.
    if (!t.length) return 1;
    if (t.length === 1) return 1;
    function f(x) { var s = 0; t.forEach(function (ti) { s += Math.pow(x, -ti); }); return 1 - s; }
    var lo = 1, hi = t.length + 1;
    for (var i = 0; i < 80; i++) { var mid = (lo + hi) / 2; if (f(mid) > 0) hi = mid; else lo = mid; }
    return (lo + hi) / 2;
  }

  window.Stable = { EXEMPLE: EXEMPLE, HEXAGONE: HEXAGONE, voisins: voisins, estStable: estStable, degres: degres, choisirX: choisirX, arbre: arbre, disposer: disposer, tau: tau };
})();
