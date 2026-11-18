/* convolution.js — une convolution 2D (ou un pooling) pas à pas : grille d'entrée avec padding,
   noyau, fenêtre glissante (couleur d'accent = position en cours), carte de sortie qui se remplit.

   var cv = new Convolution(conteneur, {
     X: [[…], …],                 // entrée (une seule carte, H × W)
     K: [[…], …],                 // noyau k_h × k_w ; null pour un pooling
     mode: "conv",                // "conv" (corrélation croisée, comme les frameworks), "max" ou "moy" (pooling)
     k: 2,                        // taille de la fenêtre de pooling (si K est null)
     b: 0, s: 1, p: 0,            // biais, stride, padding (zéros)
     revele: "jusqua",            // valeurs de sortie affichées : "tout", "jusqua" (jusqu'à la position courante), "aucun"
     editables: { "0,1": true },  // cases de sortie à remplir (champ de saisie)
     surSaisie: function (i, j, texte) {},
     surPosition: function (i, j, valeur) {},
     controles: true              // boutons ◀ ▶ pour déplacer la fenêtre
   });
   cv.aller(i, j)   cv.suivant()   cv.precedent()   cv.Y (sortie calculée)   cv.marquer(i, j, "juste" | "fausse")

   Calculs : Convolution.calculer(X, K, { s, p, b, mode, k }) → Y
             Convolution.taille(n, k, s, p, d) → ⌊(n + 2p − d(k − 1) − 1)/s⌋ + 1
             Convolution.relu(Y), Convolution.fmt(v)
   La brique injecte son propre CSS (variables de theme.css). */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };
  var STYLE =
    ".conv{display:flex;flex-wrap:wrap;gap:.6rem 1rem;justify-content:center;align-items:flex-start}" +
    ".conv-bloc{display:flex;flex-direction:column;align-items:center}" +
    ".conv-bloc .nom{font-size:.8rem;color:var(--encre-2);margin-bottom:.2rem}" +
    ".conv-grille{border-collapse:separate;border-spacing:2px;font-family:var(--mono);font-size:.78rem}" +
    ".conv-grille td{width:1.75rem;height:1.75rem;text-align:center;border:1px solid var(--trait);border-radius:4px;background:var(--fond);color:var(--encre);padding:0}" +
    ".conv-grille td.pad{border-style:dashed;color:var(--encre-3)}" +
    ".conv-grille td.fen{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}" +
    ".conv-grille td.cour{background:var(--accent);color:var(--sur-accent);border-color:var(--accent)}" +
    ".conv-grille td.vide{color:transparent}" +
    ".conv-grille td.juste{font-weight:600;border-color:var(--encre)}" +
    ".conv-grille td.fausse{text-decoration:line-through;color:var(--encre-3)}" +
    ".conv-grille td.clic{cursor:pointer}" +
    ".conv-grille td input{width:1.6rem;font:inherit;text-align:center;border:0;background:transparent;color:inherit;padding:0}" +
    ".conv-grille td.edit{border-style:dashed;border-color:var(--trait-fort)}" +
    ".conv-calcul{font-family:var(--mono);font-size:.8rem;color:var(--encre-2);text-align:center;margin:.4rem 0;overflow-wrap:anywhere}" +
    ".conv-ctrl{display:flex;gap:.4rem;justify-content:center;align-items:center;margin:.3rem 0}";
  function styler() {
    if (document.getElementById("style-conv")) return;
    var s = document.createElement("style"); s.id = "style-conv"; s.textContent = STYLE;
    document.head.appendChild(s);
  }
  function fmt(v) {
    if (typeof v !== "number" || isNaN(v)) return v === undefined || v === null ? "" : String(v);
    var r = Math.round(v * 100) / 100; if (r === 0) r = 0;
    return String(r).replace(".", ",").replace("-", "−");
  }
  function taille(n, k, s, p, d) { d = d || 1; s = s || 1; p = p || 0; return Math.floor((n + 2 * p - d * (k - 1) - 1) / s) + 1; }
  function padder(X, p) {
    var H = X.length, W = X[0].length, R = [];
    for (var i = -p; i < H + p; i++) {
      var l = [];
      for (var j = -p; j < W + p; j++) l.push(i >= 0 && i < H && j >= 0 && j < W ? X[i][j] : 0);
      R.push(l);
    }
    return R;
  }
  function fenetre(XP, i0, j0, kh, kw) {
    var f = [];
    for (var u = 0; u < kh; u++) for (var v = 0; v < kw; v++) f.push(XP[i0 + u][j0 + v]);
    return f;
  }
  function calculer(X, K, o) {
    o = o || {};
    var s = o.s || 1, p = o.p || 0, b = o.b || 0, mode = o.mode || (K ? "conv" : "max");
    var kh = K ? K.length : (o.k || 2), kw = K ? K[0].length : (o.k || 2);
    var XP = padder(X, p);
    var Ho = taille(X.length, kh, s, p), Wo = taille(X[0].length, kw, s, p), Y = [];
    for (var i = 0; i < Ho; i++) {
      var l = [];
      for (var j = 0; j < Wo; j++) {
        var f = fenetre(XP, i * s, j * s, kh, kw), v;
        if (mode === "max") v = Math.max.apply(null, f);
        else if (mode === "moy") v = f.reduce(function (a, c) { return a + c; }, 0) / f.length;
        else { v = b; var kk = []; K.forEach(function (r) { r.forEach(function (c) { kk.push(c); }); }); f.forEach(function (x, t) { v += kk[t] * x; }); }
        l.push(v);
      }
      Y.push(l);
    }
    return Y;
  }
  function relu(Y) { return Y.map(function (l) { return l.map(function (v) { return Math.max(0, v); }); }); }

  function Convolution(conteneur, o) {
    styler();
    var self = this;
    this.o = o;
    this.mode = o.mode || (o.K ? "conv" : "max");
    this.s = o.s || 1; this.p = o.p || 0; this.b = o.b || 0;
    this.kh = o.K ? o.K.length : (o.k || 2); this.kw = o.K ? o.K[0].length : (o.k || 2);
    this.XP = padder(o.X, this.p);
    this.Y = calculer(o.X, o.K, { s: this.s, p: this.p, b: this.b, mode: this.mode, k: o.k });
    this.Ho = this.Y.length; this.Wo = this.Y[0].length;
    this.i = 0; this.j = 0;
    this.marques = {};
    this.champs = {};
    this.boite = el("div");
    conteneur.appendChild(this.boite);
    this.zone = el("div", "conv");
    this.boite.appendChild(this.zone);
    this.bX = this.bloc(o.nomX || ("entrée " + o.X.length + "×" + o.X[0].length + (this.p ? ", padding " + this.p : "")));
    if (o.K) this.bK = this.bloc(o.nomK || "noyau K");
    this.bY = this.bloc(o.nomY || ("sortie " + this.Ho + "×" + this.Wo));
    this.calc = el("p", "conv-calcul");
    this.boite.appendChild(this.calc);
    if (o.controles !== false) {
      var c = el("div", "conv-ctrl");
      var pr = el("button", "btn btn-petit", "◀"); pr.type = "button"; pr.setAttribute("aria-label", "Position précédente");
      var su = el("button", "btn btn-petit", "▶"); su.type = "button"; su.setAttribute("aria-label", "Position suivante");
      this.pos = el("span", "discret petit", "");
      pr.onclick = function () { self.precedent(); };
      su.onclick = function () { self.suivant(); };
      c.appendChild(pr); c.appendChild(this.pos); c.appendChild(su);
      this.boite.appendChild(c);
      this.bPrec = pr; this.bSuiv = su;
    }
    this.vus = { "0,0": true };
    this.dessiner();
  }
  Convolution.prototype.bloc = function (nom) {
    var b = el("div", "conv-bloc");
    b.appendChild(el("span", "nom", nom));
    var t = el("table", "conv-grille");
    b.appendChild(t);
    this.zone.appendChild(b);
    return t;
  };
  Convolution.prototype.aller = function (i, j) {
    this.i = Math.max(0, Math.min(this.Ho - 1, i)); this.j = Math.max(0, Math.min(this.Wo - 1, j));
    this.vus[this.i + "," + this.j] = true;
    this.dessiner();
    if (this.o.surPosition) this.o.surPosition(this.i, this.j, this.Y[this.i][this.j]);
  };
  Convolution.prototype.suivant = function () {
    if (this.j < this.Wo - 1) this.aller(this.i, this.j + 1);
    else if (this.i < this.Ho - 1) this.aller(this.i + 1, 0);
  };
  Convolution.prototype.precedent = function () {
    if (this.j > 0) this.aller(this.i, this.j - 1);
    else if (this.i > 0) this.aller(this.i - 1, this.Wo - 1);
  };
  Convolution.prototype.marquer = function (i, j, c) { this.marques[i + "," + j] = c; this.dessiner(); };
  Convolution.prototype.lire = function (i, j) { var c = this.champs[i + "," + j]; return c ? c.value : null; };
  Convolution.prototype.dessiner = function () {
    var self = this, o = this.o, i0 = this.i * this.s, j0 = this.j * this.s, p = this.p;
    // Entrée
    var t = this.bX; t.innerHTML = "";
    this.XP.forEach(function (l, a) {
      var tr = el("tr");
      l.forEach(function (v, b) {
        var pad = a < p || b < p || a >= self.XP.length - p || b >= l.length - p;
        var dans = a >= i0 && a < i0 + self.kh && b >= j0 && b < j0 + self.kw;
        tr.appendChild(el("td", (pad ? "pad" : "") + (dans ? " fen" : ""), fmt(v)));
      });
      t.appendChild(tr);
    });
    // Noyau
    if (this.bK) {
      this.bK.innerHTML = "";
      o.K.forEach(function (l) { var tr = el("tr"); l.forEach(function (v) { tr.appendChild(el("td", null, fmt(v))); }); self.bK.appendChild(tr); });
    }
    // Sortie
    var anciens = {};
    Object.keys(this.champs).forEach(function (k) { anciens[k] = self.champs[k].value; });
    this.champs = {};
    var ty = this.bY; ty.innerHTML = "";
    var ed = o.editables || {};
    this.Y.forEach(function (l, a) {
      var tr = el("tr");
      l.forEach(function (v, b) {
        var k = a + "," + b, cour = a === self.i && b === self.j;
        var montre = o.revele === "tout" || (o.revele !== "aucun" && (self.vus[k] || (a < self.i || (a === self.i && b <= self.j))));
        var td = el("td", (cour ? "cour" : "") + (self.marques[k] ? " " + self.marques[k] : "") + (o.controles !== false ? " clic" : ""));
        if (ed[k]) {
          td.classList.add("edit");
          var inp = el("input"); inp.type = "text"; inp.inputMode = "decimal"; inp.autocomplete = "off";
          inp.setAttribute("aria-label", "Y[" + a + "," + b + "]");
          inp.value = anciens[k] || "";
          inp.addEventListener("input", function () { if (o.surSaisie) o.surSaisie(a, b, inp.value); });
          inp.addEventListener("focus", function () { if (!(a === self.i && b === self.j)) { self.i = a; self.j = b; self.vus[k] = true; self.dessiner(); var c = self.champs[k]; if (c) { c.focus(); } if (o.surPosition) o.surPosition(a, b, self.Y[a][b]); } });
          self.champs[k] = inp; td.appendChild(inp);
        } else {
          td.textContent = montre ? fmt(v) : "·";
          if (!montre) td.classList.add("vide");
          if (o.controles !== false) td.onclick = function () { self.aller(a, b); };
        }
        tr.appendChild(td);
      });
      ty.appendChild(tr);
    });
    // Calcul affiché
    var f = fenetre(this.XP, i0, j0, this.kh, this.kw), v = this.Y[this.i][this.j];
    var montreCalc = !ed[this.i + "," + this.j] || this.marques[this.i + "," + this.j] === "juste";
    if (this.mode === "conv") {
      var kk = []; o.K.forEach(function (r) { r.forEach(function (c) { kk.push(c); }); });
      var termes = [];
      f.forEach(function (x, q) { if (kk[q] !== 0) termes.push((kk[q] < 0 ? "(" + fmt(kk[q]) + ")" : fmt(kk[q])) + "·" + fmt(x)); });
      this.calc.textContent = "Y[" + this.i + "," + this.j + "] = " + (this.b ? fmt(this.b) + " + " : "") + (termes.join(" + ") || "0") + (montreCalc ? " = " + fmt(v) : " = ?");
    } else {
      this.calc.textContent = "Y[" + this.i + "," + this.j + "] = " + (this.mode === "max" ? "max" : "moyenne") + "(" + f.map(fmt).join(", ") + ")" + (montreCalc ? " = " + fmt(v) : " = ?");
    }
    if (this.pos) {
      this.pos.textContent = "position " + (this.i * this.Wo + this.j + 1) + " / " + (this.Ho * this.Wo);
      this.bPrec.disabled = this.i === 0 && this.j === 0;
      this.bSuiv.disabled = this.i === this.Ho - 1 && this.j === this.Wo - 1;
    }
  };

  Convolution.calculer = calculer;
  Convolution.taille = taille;
  Convolution.relu = relu;
  Convolution.fmt = fmt;
  window.Convolution = Convolution;
})();
