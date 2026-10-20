/* parcours.js — BFS et DFS enregistrés comme traces d'exécution (pour le
   contrôleur pas à pas), sur un graphe { sommets: [{id,x,y}], aretes: [{id,u,v}] }.
   Les voisins sont toujours parcourus dans l'ordre alphabétique. */
(function () {
  "use strict";

  /* Graphe fil rouge des prérequis : n = 7, m = 9. */
  var EXEMPLE = {
    sommets: [
      { id: "a", x: 34, y: 100 },
      { id: "b", x: 110, y: 40 },
      { id: "c", x: 110, y: 160 },
      { id: "d", x: 195, y: 40 },
      { id: "e", x: 195, y: 160 },
      { id: "f", x: 260, y: 100 },
      { id: "g", x: 318, y: 40 }
    ],
    aretes: [
      { id: "ab", u: "a", v: "b" }, { id: "ac", u: "a", v: "c" }, { id: "bc", u: "b", v: "c" },
      { id: "bd", u: "b", v: "d" }, { id: "ce", u: "c", v: "e" }, { id: "de", u: "d", v: "e" },
      { id: "df", u: "d", v: "f" }, { id: "ef", u: "e", v: "f" }, { id: "fg", u: "f", v: "g" }
    ]
  };

  var BFS_LIGNES = [
    "pour tout v ∈ V : dist(v) ← ∞",
    "dist(s) ← 0 ; F ← (s)",
    "tant que F n'est pas vide faire",
    "    u ← défiler(F)",
    "    pour tout v ∈ N(u) faire",
    "        si dist(v) = ∞ alors",
    "            dist(v) ← dist(u) + 1 ; enfiler(F, v)",
    "fin"
  ];
  var DFS_LIGNES = [
    "DFS(u) :",
    "    marquer u",
    "    pour tout v ∈ N(u) faire",
    "        si v n'est pas marqué alors",
    "            DFS(v)",
    "fin"
  ];

  function voisins(g) {
    var N = {};
    g.sommets.forEach(function (s) { N[s.id] = []; });
    g.aretes.forEach(function (a) {
      N[a.u].push({ v: a.v, arete: a.id });
      N[a.v].push({ v: a.u, arete: a.id });
    });
    Object.keys(N).forEach(function (k) { N[k].sort(function (x, y) { return x.v < y.v ? -1 : 1; }); });
    return N;
  }

  function bfs(g, s) {
    var N = voisins(g);
    var dist = {}, F = [], ordre = [], etats = [];
    var examinees = 0;
    function noter(ligne, courant, arete) {
      etats.push({ ligne: ligne, courant: courant, arete: arete || null, dist: JSON.parse(JSON.stringify(dist)),
        structure: F.slice(), ordre: ordre.slice(), examinees: examinees });
    }
    dist[s] = 0; F.push(s);
    noter(2, null);
    while (F.length) {
      var u = F.shift();
      ordre.push(u);
      noter(4, u);
      N[u].forEach(function (x) {
        examinees++;
        if (dist[x.v] === undefined) {
          dist[x.v] = dist[u] + 1;
          F.push(x.v);
          noter(7, u, x.arete);
        } else {
          noter(6, u, x.arete);
        }
      });
    }
    noter(8, null);
    return etats;
  }

  function dfs(g, s) {
    var N = voisins(g);
    var marque = {}, pile = [], ordre = [], etats = [];
    var examinees = 0;
    function noter(ligne, courant, arete) {
      var d = {};
      ordre.forEach(function (v) { d[v] = true; });
      etats.push({ ligne: ligne, courant: courant, arete: arete || null, marques: d,
        structure: pile.slice(), ordre: ordre.slice(), examinees: examinees });
    }
    function visiter(u) {
      pile.push(u);
      marque[u] = true; ordre.push(u);
      noter(2, u);
      N[u].forEach(function (x) {
        examinees++;
        if (!marque[x.v]) {
          noter(5, u, x.arete);
          visiter(x.v);
        } else {
          noter(4, u, x.arete);
        }
      });
      pile.pop();
      noter(6, pile.length ? pile[pile.length - 1] : null);
    }
    visiter(s);
    return etats;
  }

  window.Parcours = { EXEMPLE: EXEMPLE, BFS_LIGNES: BFS_LIGNES, DFS_LIGNES: DFS_LIGNES, voisins: voisins, bfs: bfs, dfs: dfs };
})();
