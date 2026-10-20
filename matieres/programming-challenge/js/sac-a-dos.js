/* sac-a-dos.js — fonctions du cours 6 (Dynamic Programming), notations du cours :
   V1(w) : plus grande valeur quand le poids du sac est ÉGAL à w (avec répétition) ;
   V2(w) : plus grande valeur quand le poids est INFÉRIEUR OU ÉGAL à w (avec répétition) ;
   V3(w, k) : poids ≤ w, sous-ensemble des objets 1 à k (sans répétition).
   −∞ est représenté par -Infinity. Les données des exercices du cours sont incluses. */
(function () {
  "use strict";
  var EX1 = { objets: [[8, 1], [5, 1], [3, 1]], W: 17 };                              // [w_i, v_i]
  var EX2 = { objets: [[8, 3], [5, 2], [3, 1]], W: 15 };
  var EX3 = { objets: [[8, 3], [5, 2], [3, 1], [8, 3], [5, 2], [3, 2]], W: 17 };

  function V1(objets, W) {
    var V = [0];
    for (var w = 1; w <= W; w++) {
      var m = -Infinity;
      objets.forEach(function (o) { if (w - o[0] >= 0) m = Math.max(m, o[1] + V[w - o[0]]); });
      V.push(m);
    }
    return V;
  }
  function V2(objets, W) {
    var v1 = V1(objets, W), r = [], m = -Infinity;
    v1.forEach(function (x) { m = Math.max(m, x); r.push(m); });
    return r;
  }
  /* table[k][w] pour k = 0..n */
  function V3(objets, W) {
    var T = [[]];
    for (var w = 0; w <= W; w++) T[0].push(0);
    objets.forEach(function (o, i) {
      var k = i + 1, ligne = [];
      for (var w = 0; w <= W; w++) {
        if (w === 0) { ligne.push(0); continue; }
        var prendre = w - o[0] >= 0 ? T[k - 1][w - o[0]] + o[1] : -Infinity;
        ligne.push(Math.max(prendre, T[k - 1][w]));
      }
      T.push(ligne);
    });
    return T;
  }
  function colonnes(W) { var c = []; for (var w = 0; w <= W; w++) c.push(w); return c; }

  window.SacADos = { EX1: EX1, EX2: EX2, EX3: EX3, V1: V1, V2: V2, V3: V3, colonnes: colonnes };
})();
