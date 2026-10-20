/* grille.js — grille de puzzle cliquable (carré latin, Futoshiki, Binairo, reines…).
   Toucher une case libre fait défiler les valeurs de `cycle` (puis la case vide).

   var g = new Grille(conteneur, {
     lignes: 4, colonnes: 4,
     cycle: [1, 2, 3, 4],                 // valeurs proposées, dans l'ordre
     fixes: { "0,2": 2 },                 // cases données (non modifiables), clé "ligne,colonne"
     signes: [{ a: [0, 0], b: [0, 1], s: ">" }],   // (optionnel) valeur(a) s valeur(b), a et b voisines
     onChange: function (valeurs) {…}     // après chaque modification
   });
   g.valeurs            → tableau lignes × colonnes (null = vide)
   g.dessiner({ classes: { "1,3": "conflit" } })   // "conflit" (tirets), "courante" (accent), "choisie"
   g.verrouiller(true)  → plus de modification
   g.remplir(valeurs)   → impose un état (ex. afficher une solution)

   Vérifications utiles :
     Grille.doublons(valeurs)          → clés des cases en double sur leur ligne ou leur colonne
     Grille.signesFaux(valeurs, signes) → signes non respectés (cases toutes deux remplies)
     Grille.complete(valeurs)          → toutes les cases remplies ? */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  var STYLE =
    ".grille-puzzle{display:grid;gap:0;justify-content:center;margin:.4rem auto;touch-action:manipulation;user-select:none;-webkit-user-select:none}" +
    ".grille-puzzle .gc{width:46px;height:46px;border:1.5px solid var(--encre-2);border-radius:6px;background:var(--fond);color:var(--encre);font-family:var(--mono);font-size:1.15rem;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer}" +
    ".grille-puzzle .gc:hover:not(:disabled){border-color:var(--accent)}" +
    ".grille-puzzle .gc.fixe{background:var(--fond-2);font-weight:600;cursor:default}" +
    ".grille-puzzle .gc:disabled{cursor:default}" +
    ".grille-puzzle .gc.conflit{border:2.5px dashed var(--encre)}" +
    ".grille-puzzle .gc.choisie{background:var(--encre);color:var(--fond)}" +
    ".grille-puzzle .gc.courante{border:3px solid var(--accent)}" +
    ".grille-puzzle .gs{display:flex;align-items:center;justify-content:center;font-family:var(--mono);color:var(--encre-2);font-size:1rem;min-width:18px;min-height:18px}" +
    ".grille-puzzle .gs.faux{color:var(--encre);font-weight:700;text-decoration:underline}" +
    ".grille-puzzle.compacte .gc{width:38px;height:38px;font-size:1rem}";

  function injecterStyle() {
    if (document.getElementById("style-grille")) return;
    var s = document.createElement("style");
    s.id = "style-grille";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function k(r, c) { return r + "," + c; }

  function Grille(conteneur, o) {
    injecterStyle();
    this.o = o;
    this.L = o.lignes; this.C = o.colonnes;
    this.fixes = o.fixes || {};
    this.signes = o.signes || [];
    this.verrou = false;
    this.valeurs = [];
    for (var r = 0; r < this.L; r++) {
      var ligne = [];
      for (var c = 0; c < this.C; c++) ligne.push(this.fixes[k(r, c)] !== undefined ? this.fixes[k(r, c)] : null);
      this.valeurs.push(ligne);
    }
    var avecSignes = this.signes.length > 0;
    this.boite = el("div", "grille-puzzle" + (this.C > 6 ? " compacte" : ""));
    var col = [];
    for (var j = 0; j < this.C; j++) { col.push("auto"); if (avecSignes && j < this.C - 1) col.push("18px"); }
    this.boite.style.gridTemplateColumns = col.join(" ");
    this.avecSignes = avecSignes;
    conteneur.appendChild(this.boite);
    this.dessiner({});
  }

  Grille.prototype.signeEntre = function (r1, c1, r2, c2) {
    for (var i = 0; i < this.signes.length; i++) {
      var s = this.signes[i];
      if (s.a[0] === r1 && s.a[1] === c1 && s.b[0] === r2 && s.b[1] === c2) return { s: s.s, i: i };
      if (s.b[0] === r1 && s.b[1] === c1 && s.a[0] === r2 && s.a[1] === c2) return { s: s.s === ">" ? "<" : ">", i: i };
    }
    return null;
  };

  Grille.prototype.dessiner = function (o) {
    o = o || {};
    this.dernier = o;
    var self = this, cl = o.classes || {};
    var faux = {};
    Grille.signesFaux(this.valeurs, this.signes).forEach(function (s) { faux[self.signes.indexOf(s)] = true; });
    var b = this.boite;
    b.innerHTML = "";
    for (var r = 0; r < this.L; r++) {
      for (var c = 0; c < this.C; c++) {
        (function (r, c) {
          var fixe = self.fixes[k(r, c)] !== undefined;
          var v = self.valeurs[r][c];
          var bt = el("button", "gc" + (fixe ? " fixe" : "") + (cl[k(r, c)] ? " " + cl[k(r, c)] : ""), v === null ? "" : String(v));
          bt.type = "button";
          bt.setAttribute("aria-label", "ligne " + (r + 1) + ", colonne " + (c + 1) + (v === null ? ", vide" : ", " + v));
          bt.disabled = fixe || self.verrou;
          bt.onclick = function () { self.toucher(r, c); };
          b.appendChild(bt);
        })(r, c);
        if (this.avecSignes && c < this.C - 1) {
          var sg = this.signeEntre(r, c, r, c + 1);
          b.appendChild(el("span", "gs" + (sg && faux[sg.i] ? " faux" : ""), sg ? sg.s : ""));
        }
      }
      if (this.avecSignes && r < this.L - 1) {
        for (var c2 = 0; c2 < this.C; c2++) {
          var sv = this.signeEntre(r, c2, r + 1, c2);
          // « > » vertical : la case du haut est plus grande → ∨ (pointe vers la plus petite)
          b.appendChild(el("span", "gs" + (sv && faux[sv.i] ? " faux" : ""), sv ? (sv.s === ">" ? "∨" : "∧") : ""));
          if (c2 < this.C - 1) b.appendChild(el("span", "gs"));
        }
      }
    }
  };

  Grille.prototype.toucher = function (r, c) {
    if (this.verrou || this.fixes[k(r, c)] !== undefined) return;
    var cyc = this.o.cycle.concat([null]);
    var i = cyc.indexOf(this.valeurs[r][c]);
    this.valeurs[r][c] = cyc[(i + 1) % cyc.length];
    if (this.o.onChange) this.o.onChange(this.valeurs);
    else this.dessiner(this.dernier);
  };

  Grille.prototype.verrouiller = function (oui) { this.verrou = !!oui; this.dessiner(this.dernier); };
  Grille.prototype.remplir = function (vals) {
    var self = this;
    vals.forEach(function (l, r) { l.forEach(function (v, c) { self.valeurs[r][c] = v; }); });
    this.dessiner(this.dernier);
  };

  Grille.doublons = function (vals) {
    var res = {};
    var L = vals.length, C = vals[0].length;
    function marquer(cases) {
      var vu = {};
      cases.forEach(function (p) { var v = vals[p[0]][p[1]]; if (v === null) return; (vu[v] = vu[v] || []).push(p); });
      Object.keys(vu).forEach(function (v) { if (vu[v].length > 1) vu[v].forEach(function (p) { res[k(p[0], p[1])] = true; }); });
    }
    for (var r = 0; r < L; r++) { var l = []; for (var c = 0; c < C; c++) l.push([r, c]); marquer(l); }
    for (var c2 = 0; c2 < C; c2++) { var co = []; for (var r2 = 0; r2 < L; r2++) co.push([r2, c2]); marquer(co); }
    return Object.keys(res);
  };
  Grille.signesFaux = function (vals, signes) {
    return (signes || []).filter(function (s) {
      var a = vals[s.a[0]][s.a[1]], b = vals[s.b[0]][s.b[1]];
      if (a === null || b === null) return false;
      return s.s === ">" ? !(a > b) : !(a < b);
    });
  };
  Grille.complete = function (vals) {
    return vals.every(function (l) { return l.every(function (v) { return v !== null; }); });
  };

  window.Grille = Grille;
})();
