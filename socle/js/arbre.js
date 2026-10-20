/* arbre.js — arbres binaires : représentation, parcours, reconstruction, dessin.

   Un arbre binaire = { racine: id | null, g: { id: id }, d: { id: id } }
   (g = enfant gauche, d = enfant droit ; ids = nombres ou textes courts).

   ArbreBinaire.creer(racine, [[parent, "g"|"d", enfant], …])
   ArbreBinaire.prefixe(a)  → [ids] (NLR)     ArbreBinaire.infixe(a) → (LNR)
   ArbreBinaire.postfixe(a) → (LRN)           ArbreBinaire.largeur(a) → par niveaux
   ArbreBinaire.depuisPreIn(pre, ino)   → arbre ou null si incohérent
   ArbreBinaire.depuisPostIn(post, ino) → arbre ou null
   ArbreBinaire.noeuds(a) → [ids]  ;  ArbreBinaire.profondeur(a, id)
   ArbreBinaire.vue(a, { largeur, hauteur, classes: {id: "plein"|"courant"}, sous: {id: "texte"}, fantomes: [...] })
     → objet pour FigureGraphe.dessiner : x selon le rang infixe, y selon la profondeur.
   ArbreBinaire.etapesParcours(a, "pre"|"in"|"post")
     → [{ appel: [pile d'appels], visite: id | null, ordre: [...] }] pour une trace pas à pas. */
(function () {
  "use strict";

  function creer(racine, liens) {
    var a = { racine: racine, g: {}, d: {} };
    (liens || []).forEach(function (l) { a[l[1]][l[0]] = l[2]; });
    return a;
  }
  function a_(x) { return x !== undefined && x !== null; }

  function prefixe(a) { var r = []; (function f(v) { if (!a_(v)) return; r.push(v); f(a.g[v]); f(a.d[v]); })(a.racine); return r; }
  function infixe(a) { var r = []; (function f(v) { if (!a_(v)) return; f(a.g[v]); r.push(v); f(a.d[v]); })(a.racine); return r; }
  function postfixe(a) { var r = []; (function f(v) { if (!a_(v)) return; f(a.g[v]); f(a.d[v]); r.push(v); })(a.racine); return r; }
  function largeur(a) {
    var r = [], F = a_(a.racine) ? [a.racine] : [];
    while (F.length) { var v = F.shift(); r.push(v); if (a_(a.g[v])) F.push(a.g[v]); if (a_(a.d[v])) F.push(a.d[v]); }
    return r;
  }
  function noeuds(a) { return prefixe(a); }
  function profondeur(a, id) {
    var p = 0, parent = {};
    Object.keys(a.g).forEach(function (k) { parent[a.g[k]] = k; });
    Object.keys(a.d).forEach(function (k) { parent[a.d[k]] = k; });
    var x = String(id);
    while (String(a.racine) !== x && parent[x] !== undefined) { x = String(parent[x]); p++; }
    return p;
  }

  function memeEnsemble(x, y) {
    if (x.length !== y.length) return false;
    var s = x.map(String).sort().join("|"), t = y.map(String).sort().join("|");
    return s === t;
  }
  function depuisPreIn(pre, ino) {
    var a = { racine: null, g: {}, d: {} }, ok = true;
    function f(p, q) {               // p : segment de pre, q : segment d'ino (mêmes éléments)
      if (!p.length) return null;
      if (!memeEnsemble(p, q)) { ok = false; return null; }
      var r = p[0], k = q.indexOf(r);
      var gq = q.slice(0, k), dq = q.slice(k + 1);
      var gp = p.slice(1, 1 + gq.length), dp = p.slice(1 + gq.length);
      var gr = f(gp, gq), dr = f(dp, dq);
      if (a_(gr)) a.g[r] = gr;
      if (a_(dr)) a.d[r] = dr;
      return r;
    }
    a.racine = f(pre.slice(), ino.slice());
    return ok ? a : null;
  }
  function depuisPostIn(post, ino) {
    var a = { racine: null, g: {}, d: {} }, ok = true;
    function f(p, q) {
      if (!p.length) return null;
      if (!memeEnsemble(p, q)) { ok = false; return null; }
      var r = p[p.length - 1], k = q.indexOf(r);
      var gq = q.slice(0, k), dq = q.slice(k + 1);
      var gp = p.slice(0, gq.length), dp = p.slice(gq.length, p.length - 1);
      var gr = f(gp, gq), dr = f(dp, dq);
      if (a_(gr)) a.g[r] = gr;
      if (a_(dr)) a.d[r] = dr;
      return r;
    }
    a.racine = f(post.slice(), ino.slice());
    return ok ? a : null;
  }

  function vue(a, o) {
    o = o || {};
    var L = o.largeur || 340, H = o.hauteur || 200;
    var ino = infixe(a);
    var prof = {}, maxP = 0;
    ino.forEach(function (v) { prof[v] = profondeur(a, v); if (prof[v] > maxP) maxP = prof[v]; });
    var n = ino.length;
    var marge = 24;
    var dx = n > 1 ? (L - 2 * marge) / (n - 1) : 0;
    var dy = maxP > 0 ? Math.min(52, (H - 2 * marge) / maxP) : 0;
    var pos = {};
    ino.forEach(function (v, i) { pos[v] = { x: n > 1 ? marge + i * dx : L / 2, y: marge + prof[v] * dy }; });
    var classes = o.classes || {}, sous = o.sous || {};
    var sommets = ino.map(function (v) {
      return { id: String(v), x: Math.round(pos[v].x), y: Math.round(pos[v].y), label: String(v), classe: classes[v] || "", sous: sous[v] || "" };
    });
    var aretes = [];
    ino.forEach(function (v) {
      ["g", "d"].forEach(function (c) {
        if (a_(a[c][v])) aretes.push({ id: v + c, u: String(v), v: String(a[c][v]), classe: (o.classesAretes && o.classesAretes[v + c]) || "" });
      });
    });
    return { sommets: sommets, aretes: aretes, etiquettes: o.etiquettes || [] };
  }

  /* Trace d'un parcours en profondeur : un état par appel / visite. */
  function etapesParcours(a, type) {
    var etats = [], pile = [], ordre = [];
    function noter(visite, ligne) { etats.push({ appel: pile.slice(), visite: a_(visite) ? visite : null, ordre: ordre.slice(), ligne: ligne }); }
    function f(v) {
      if (!a_(v)) return;
      pile.push(v);
      noter(null, 0);
      if (type === "pre") { ordre.push(v); noter(v, 1); }
      f(a.g[v]);
      if (type === "in") { ordre.push(v); noter(v, 2); }
      f(a.d[v]);
      if (type === "post") { ordre.push(v); noter(v, 3); }
      pile.pop();
    }
    f(a.racine);
    noter(null, -1);
    return etats;
  }

  window.ArbreBinaire = {
    creer: creer, prefixe: prefixe, infixe: infixe, postfixe: postfixe, largeur: largeur,
    noeuds: noeuds, profondeur: profondeur, depuisPreIn: depuisPreIn, depuisPostIn: depuisPostIn,
    vue: vue, etapesParcours: etapesParcours
  };
})();
