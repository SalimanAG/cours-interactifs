/* est-arbre.js — modèle du problème « Is it a tree » (cours 5 Tree, exo5_1 ;
   midterm oral). Un graphe = { n, aretes: [[u, v], …], pos?: { u: {x, y} } },
   sommets numérotés de 1 à n, arêtes dans l'ordre de l'entrée.

   EstArbre.LIGNES                  pseudo-code (style Cormen et al., en français)
   EstArbre.EXEMPLE                 fil rouge : l'arbre de la diapo 2 (= 1er cas de test du cours)
   EstArbre.CAS_COURS               les 4 « More test cases » du cours
   EstArbre.texteEntree(g)          l'entrée telle que lue sur stdin
   EstArbre.adjacence(g)            Adj[1..n] (listes de { v, a } où a = indice de l'arête)
   EstArbre.executer(g, opts)       trace d'exécution (états pour le Controleur)
   EstArbre.decider(g)              { reponse: "YES"|"NO", raison: "m"|"connexe"|null, compte, ordre }
   EstArbre.vue(g, etat)            objet pour FigureGraphe.dessiner
   EstArbre.proprietes(g)           { connexe, acyclique, composantes } (graphe quelconque)
   EstArbre.aleatoire(type, n)      graphe tiré au hasard : "arbre", "non-connexe", "m-faux", "piege"
*/
(function () {
  "use strict";

  var LIGNES = [
    "si M ≠ N − 1 alors",
    "    retourner NO",
    "pour u ← 1 à N faire  Adj[u] ← ∅ ;  vu[u] ← FAUX",
    "pour chaque arête (u, v) de l'entrée faire",
    "    ajouter v à Adj[u] ;  ajouter u à Adj[v]",
    "vu[1] ← VRAI ;  compte ← 1 ;  F ← (1)",
    "tant que F n'est pas vide faire",
    "    u ← DÉFILER(F)",
    "    pour chaque v de Adj[u] faire",
    "        si vu[v] = FAUX alors",
    "            vu[v] ← VRAI ;  compte ← compte + 1",
    "            ENFILER(F, v)",
    "si compte = N alors retourner YES",
    "sinon retourner NO"
  ];

  var POS5 = { 1: { x: 120, y: 42 }, 2: { x: 232, y: 42 }, 3: { x: 64, y: 150 }, 4: { x: 176, y: 150 }, 5: { x: 288, y: 150 } };

  var EXEMPLE = { n: 5, aretes: [[1, 3], [1, 4], [4, 2], [2, 5]], pos: POS5 };

  var CAS_COURS = [
    { n: 5, aretes: [[1, 3], [1, 4], [4, 2], [2, 5]], pos: POS5, attendu: "YES" },
    { n: 5, aretes: [[1, 3], [1, 4], [4, 2], [2, 5], [3, 4]], pos: POS5, attendu: "NO" },
    { n: 5, aretes: [[1, 3], [1, 4], [2, 5]], pos: POS5, attendu: "NO" },
    { n: 5, aretes: [[1, 3], [1, 4], [2, 5], [3, 4]], pos: POS5, attendu: "NO" }
  ];

  function texteEntree(g) {
    return [g.n + " " + g.aretes.length].concat(g.aretes.map(function (a) { return a[0] + " " + a[1]; })).join("\n");
  }

  function adjacence(g) {
    var adj = [];
    for (var u = 0; u <= g.n; u++) adj.push([]);
    g.aretes.forEach(function (a, i) {
      adj[a[0]].push({ v: a[1], a: i });
      adj[a[1]].push({ v: a[0], a: i });
    });
    return adj;
  }

  /* Trace complète. opts.forcer : faire le parcours même si M ≠ N − 1
     (pour s'entraîner à la trace) — la ligne 1 est alors montrée mais ignorée. */
  function executer(g, opts) {
    opts = opts || {};
    var n = g.n, m = g.aretes.length;
    var etats = [];
    var vu = [], F = [], ordre = [], compte = 0;
    function noter(ligne, x) {
      x = x || {};
      etats.push({
        ligne: ligne, u: x.u === undefined ? null : x.u, v: x.v === undefined ? null : x.v,
        arete: x.arete === undefined ? null : x.arete, maj: x.maj || null,
        vu: vu.slice(), file: F.slice(), ordre: ordre.slice(), compte: compte,
        fin: x.fin || null, note: x.note || ""
      });
    }
    noter(1, { note: "M = " + m + (m === n - 1 ? " = N − 1 : on continue." : " ≠ N − 1 = " + (n - 1) + (opts.forcer ? " : on devrait répondre NO ; on continue pour l'exercice." : " : NO.")) });
    if (m !== n - 1 && !opts.forcer) {
      noter(2, { fin: "NO", note: "M ≠ N − 1 : ce ne peut pas être un arbre." });
      return etats;
    }
    for (var i = 0; i <= n; i++) vu.push(false);
    var adj = adjacence(g);
    noter(5, { note: "Adj construite (" + 2 * m + " entrées)." });
    vu[1] = true; compte = 1; F.push(1);
    noter(6, { maj: 1, note: "On part du sommet 1." });
    while (F.length) {
      var u = F.shift();
      ordre.push(u);
      noter(8, { u: u, note: "On défile " + u + "." });
      for (var k = 0; k < adj[u].length; k++) {
        var x = adj[u][k];
        if (!vu[x.v]) {
          vu[x.v] = true; compte++; F.push(x.v);
          noter(11, { u: u, v: x.v, arete: x.a, maj: x.v, note: x.v + " n'était pas vu : on le marque et on l'enfile (compte = " + compte + ")." });
        } else {
          noter(10, { u: u, v: x.v, arete: x.a, note: x.v + " est déjà vu : rien à faire." });
        }
      }
    }
    var rep = (m === n - 1 && compte === n) ? "YES" : "NO";
    noter(compte === n ? 13 : 14, { fin: rep, note: "compte = " + compte + (compte === n ? " = N" : " < N = " + n) + (m !== n - 1 ? " (mais M ≠ N − 1)" : "") + " → " + rep + "." });
    return etats;
  }

  function decider(g) {
    var e = executer(g, { forcer: true });
    var der = e[e.length - 1];
    var m = g.aretes.length;
    if (m !== g.n - 1) return { reponse: "NO", raison: "m", compte: der.compte, ordre: der.ordre };
    if (der.compte !== g.n) return { reponse: "NO", raison: "connexe", compte: der.compte, ordre: der.ordre };
    return { reponse: "YES", raison: null, compte: der.compte, ordre: der.ordre };
  }

  /* Propriétés d'un graphe quelconque (union-find). */
  function proprietes(g) {
    var p = [];
    for (var i = 0; i <= g.n; i++) p.push(i);
    function f(x) { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; }
    var cycle = false;
    g.aretes.forEach(function (a) {
      var r = f(a[0]), s = f(a[1]);
      if (r === s) cycle = true; else p[r] = s;
    });
    var c = 0;
    for (var u = 1; u <= g.n; u++) if (f(u) === u) c++;
    return { connexe: c === 1, acyclique: !cycle, composantes: c };
  }

  function positions(n) {
    var pos = {};
    if (n === 1) { pos[1] = { x: 175, y: 100 }; return pos; }
    for (var i = 0; i < n; i++) {
      var t = -Math.PI / 2 + 2 * Math.PI * i / n;
      pos[i + 1] = { x: Math.round(175 + 135 * Math.cos(t)), y: Math.round(100 + 74 * Math.sin(t)) };
    }
    return pos;
  }

  /* Vue pour FigureGraphe. etat (facultatif) : un état de executer(). */
  function vue(g, etat, opts) {
    opts = opts || {};
    var pos = g.pos || positions(g.n);
    var sommets = [];
    for (var u = 1; u <= g.n; u++) {
      var cl = "";
      if (etat && etat.vu.length && etat.vu[u]) cl = "plein";
      if (etat && (etat.u === u)) cl = (cl ? cl + " " : "") + "courant";
      var sous = "";
      if (etat && opts.ordre !== false) {
        var k = etat.ordre.indexOf(u);
        if (k >= 0) sous = "n°" + (k + 1);
      }
      sommets.push({ id: String(u), x: pos[u].x, y: pos[u].y, label: String(u), classe: cl, sous: sous });
    }
    var aretes = [], etiquettes = [];
    g.aretes.forEach(function (a, i) {
      if (a[0] === a[1]) {
        var p = pos[a[0]];
        etiquettes.push({ x: p.x + 16, y: p.y - 18, texte: "↻ boucle" });
        return;
      }
      var cl = "";
      if (etat && etat.arete === i) cl = "courante";
      else if (opts.classeArete) cl = opts.classeArete(i, a) || "";
      aretes.push({ id: "e" + i, u: String(a[0]), v: String(a[1]), classe: cl });
    });
    return { sommets: sommets, aretes: aretes, etiquettes: etiquettes };
  }

  /* ---------- Tirages aléatoires (pour l'atelier) ---------- */
  function entier(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function melanger(t) {
    for (var i = t.length - 1; i > 0; i--) { var j = entier(0, i); var x = t[i]; t[i] = t[j]; t[j] = x; }
    return t;
  }
  function arbreSur(sommets) {
    var r = [];
    for (var i = 1; i < sommets.length; i++) r.push([sommets[entier(0, i - 1)], sommets[i]]);
    return r;
  }
  function finir(n, aretes) {
    // renuméroter au hasard, mélanger l'ordre et le sens des arêtes
    var perm = melanger(range(n));
    var a = aretes.map(function (e) {
      var x = perm[e[0] - 1], y = perm[e[1] - 1];
      return Math.random() < 0.5 ? [x, y] : [y, x];
    });
    return { n: n, aretes: melanger(a) };
  }
  function range(n) { var r = []; for (var i = 1; i <= n; i++) r.push(i); return r; }
  function cle(a) { return Math.min(a[0], a[1]) + "-" + Math.max(a[0], a[1]); }

  function aleatoire(type, n) {
    n = n || entier(5, 7);
    var s = range(n), a, g;
    if (type === "arbre") return finir(n, arbreSur(s));
    if (type === "non-connexe") {
      // M = N − 1 mais non connexe : une composante avec un cycle + le reste en arbre
      var t = entier(3, n - 2);
      var A = s.slice(0, t), B = s.slice(t);
      a = arbreSur(A);
      var deja = {};
      a.forEach(function (e) { deja[cle(e)] = true; });
      var essais = 0, e2;
      do { e2 = [A[entier(0, t - 1)], A[entier(0, t - 1)]]; essais++; } while ((e2[0] === e2[1] || deja[cle(e2)]) && essais < 100);
      a.push(e2);
      a = a.concat(arbreSur(B));
      g = finir(n, a);
      if (proprietes(g).connexe || g.aretes.length !== n - 1) return aleatoire(type, n);
      return g;
    }
    if (type === "m-faux") {
      a = arbreSur(s);
      if (Math.random() < 0.5) {
        a.splice(entier(0, a.length - 1), 1);              // une arête de moins
      } else {
        var vus = {}; a.forEach(function (e) { vus[cle(e)] = true; });
        var e3, k = 0;
        do { e3 = [entier(1, n), entier(1, n)]; k++; } while ((e3[0] === e3[1] || vus[cle(e3)]) && k < 100);
        a.push(e3);                                         // une arête de plus (cycle)
      }
      return finir(n, a);
    }
    if (type === "piege") {
      // M = N − 1, mais une arête répétée ou une boucle → non connexe
      a = arbreSur(s);
      var j = entier(0, a.length - 1);
      if (Math.random() < 0.5) {
        var autre = a[(j + 1) % a.length];
        a[j] = [autre[0], autre[1]];                        // arête répétée
      } else {
        var w = entier(1, n);
        a[j] = [w, w];                                      // boucle
      }
      g = finir(n, a);
      if (proprietes(g).connexe) return aleatoire(type, n);
      return g;
    }
    return finir(n, arbreSur(s));
  }

  window.EstArbre = {
    LIGNES: LIGNES, EXEMPLE: EXEMPLE, CAS_COURS: CAS_COURS, POS5: POS5,
    texteEntree: texteEntree, adjacence: adjacence, executer: executer, decider: decider,
    proprietes: proprietes, positions: positions, vue: vue, aleatoire: aleatoire
  };
})();
