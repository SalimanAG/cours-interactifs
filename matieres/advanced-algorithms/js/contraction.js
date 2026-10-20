/* contraction.js — modèle de l'algorithme de Contraction Aléatoire (cours 2).
   Partagé par la leçon « coupe minimum » et le futur atelier du TP1.

   Notations du cours : contracter l'arête uv supprime u et rattache ses arêtes
   à v (G/uv), puis S(v) ← S(v) ∪ S(u). On représente le multigraphe contracté
   sans le reconstruire : chaque sommet d'origine connaît son groupe (le sommet
   v qui le représente) et une arête existe encore ssi ses deux extrémités sont
   dans des groupes différents — c'est l'idée de l'implémentation du TP1. */
(function () {
  "use strict";

  /* Graphe « Exemple » du cours 2 (diapo « Exemple ») : n = 6, m = 7. */
  var EXEMPLE = {
    sommets: [
      { id: "a", x: 40, y: 92 },
      { id: "b", x: 120, y: 40 },
      { id: "c", x: 120, y: 144 },
      { id: "d", x: 200, y: 92 },
      { id: "f", x: 280, y: 40 },
      { id: "e", x: 280, y: 144 }
    ],
    aretes: [
      { id: "ab", u: "a", v: "b" },
      { id: "ac", u: "a", v: "c" },
      { id: "bd", u: "b", v: "d" },
      { id: "cd", u: "c", v: "d" },
      { id: "df", u: "d", v: "f" },
      { id: "de", u: "d", v: "e" },
      { id: "ef", u: "e", v: "f" }
    ]
  };

  function Contraction(graphe) {
    this.g = graphe;
    this.pos = {};
    var self = this;
    graphe.sommets.forEach(function (s) { self.pos[s.id] = s; });
    this.reinitialiser();
  }

  Contraction.prototype.reinitialiser = function () {
    var self = this;
    this.groupe = {};
    this.S = {};
    this.historique = [];
    this.g.sommets.forEach(function (s) { self.groupe[s.id] = s.id; self.S[s.id] = [s.id]; });
  };

  Contraction.prototype.instantane = function () {
    return { groupe: JSON.parse(JSON.stringify(this.groupe)), S: JSON.parse(JSON.stringify(this.S)) };
  };
  Contraction.prototype.restaurer = function (snap) {
    this.groupe = JSON.parse(JSON.stringify(snap.groupe));
    this.S = JSON.parse(JSON.stringify(snap.S));
  };

  Contraction.prototype.arete = function (id) {
    for (var i = 0; i < this.g.aretes.length; i++) if (this.g.aretes[i].id === id) return this.g.aretes[i];
    return null;
  };

  /* Arêtes du multigraphe courant : celles qui relient deux groupes différents. */
  Contraction.prototype.aretesCourantes = function () {
    var gr = this.groupe;
    return this.g.aretes.filter(function (a) { return gr[a.u] !== gr[a.v]; });
  };
  Contraction.prototype.existe = function (id) {
    var a = this.arete(id);
    return !!a && this.groupe[a.u] !== this.groupe[a.v];
  };

  Contraction.prototype.nbSommets = function () { return Object.keys(this.S).length; };

  /* G ← G/uv puis S(v) ← S(v) ∪ S(u). Renvoie { u, v } (représentants). */
  Contraction.prototype.contracter = function (id) {
    var a = this.arete(id);
    if (!a || !this.existe(id)) return null;
    this.historique.push(this.instantane());
    var u = this.groupe[a.u], v = this.groupe[a.v];
    var self = this;
    this.S[u].forEach(function (x) { self.groupe[x] = v; });
    this.S[v] = this.S[v].concat(this.S[u]);
    delete this.S[u];
    return { u: u, v: v };
  };

  Contraction.prototype.annuler = function () {
    if (!this.historique.length) return false;
    this.restaurer(this.historique.pop());
    return true;
  };

  /* Arête choisie uniformément au hasard parmi les arêtes courantes. */
  Contraction.prototype.tirer = function (alea) {
    var l = this.aretesCourantes();
    if (!l.length) return null;
    return l[Math.floor((alea || Math.random)() * l.length)];
  };

  /* La coupe (S(x), S(y)) quand il reste 2 sommets. */
  Contraction.prototype.coupe = function () {
    var reps = Object.keys(this.S);
    if (reps.length !== 2) return null;
    return { X: this.S[reps[0]].slice().sort(), Y: this.S[reps[1]].slice().sort(), valeur: this.aretesCourantes().length };
  };

  /* Données pour FigureGraphe. classeArete(a) et classeSommet(rep) optionnels. */
  Contraction.prototype.vue = function (classeArete, classeSommet) {
    var self = this;
    var sommets = Object.keys(this.S).map(function (rep) {
      var membres = self.S[rep];
      var x = 0, y = 0;
      membres.forEach(function (m) { x += self.pos[m].x; y += self.pos[m].y; });
      return {
        id: rep,
        x: x / membres.length,
        y: y / membres.length,
        label: rep,
        sous: membres.length > 1 ? "{" + membres.slice().sort().join(",") + "}" : "",
        classe: classeSommet ? classeSommet(rep) : ""
      };
    });
    var aretes = this.aretesCourantes().map(function (a) {
      return { id: a.id, u: self.groupe[a.u], v: self.groupe[a.v], classe: classeArete ? classeArete(a) : "" };
    });
    return { sommets: sommets, aretes: aretes };
  };

  /* Nombre d'arêtes entre deux représentants (multiplicité). */
  Contraction.prototype.multipliciteMax = function () {
    var c = {}, max = 0, gr = this.groupe;
    this.aretesCourantes().forEach(function (a) {
      var x = gr[a.u], y = gr[a.v];
      var k = x < y ? x + "|" + y : y + "|" + x;
      c[k] = (c[k] || 0) + 1;
      if (c[k] > max) max = c[k];
    });
    return max;
  };

  /* Une exécution complète, enregistrée comme une trace d'états pour le
     contrôleur pas à pas. Chaque état : { snap, choisie, ligne }. */
  Contraction.prototype.trace = function (alea) {
    this.reinitialiser();
    var etats = [{ snap: this.instantane(), choisie: null, ligne: 2 }];
    while (this.nbSommets() > 2) {
      etats.push({ snap: this.instantane(), choisie: null, ligne: 4 });
      var a = this.tirer(alea);
      etats.push({ snap: this.instantane(), choisie: a.id, ligne: 5 });
      this.contracter(a.id);
      etats.push({ snap: this.instantane(), choisie: null, ligne: 7 });
    }
    etats.push({ snap: this.instantane(), choisie: null, ligne: 9 });
    return etats;
  };

  /* Exécution rapide sans trace : renvoie la coupe obtenue. */
  Contraction.prototype.executer = function (alea) {
    this.reinitialiser();
    while (this.nbSommets() > 2) this.contracter(this.tirer(alea).id);
    return this.coupe();
  };

  function memeCoupe(c, partie) {
    var p = partie.slice().sort().join(",");
    return c.X.join(",") === p || c.Y.join(",") === p;
  }
  function texteCoupe(c) {
    return "{" + c.X.join(", ") + "} | {" + c.Y.join(", ") + "}";
  }

  window.Contraction = Contraction;
  window.Contraction.EXEMPLE = EXEMPLE;
  window.Contraction.memeCoupe = memeCoupe;
  window.Contraction.texteCoupe = texteCoupe;
})();
