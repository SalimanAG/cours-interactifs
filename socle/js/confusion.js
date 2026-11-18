/* confusion.js — matrice de confusion cliquable : zones TP / FN / FP / TN d'une classe, métriques.
   S'appuie sur matrice.js (à charger avant).

   var cf = new Confusion(conteneur, {
     classes: ["A", "B", "C"],
     M: [[18, 2, 0], [3, 14, 3], [1, 2, 7]],   // m[i][j] = nombre d'exemples de vraie classe i prédits j
     choisie: 0,                                // (optionnel) classe dont on montre les zones (null : aucune)
     choisir: true,                             // boutons pour changer de classe (et clic sur la diagonale)
     onCase: function (i, j) {},                // (optionnel) clic sur une case
     surChoix: function (k) {}                  // (optionnel) classe choisie
   });
   cf.choisir(k)   cf.dessiner({ classes: { "1,2": "courante" } })  // classes supplémentaires par case

   Calculs (statiques) :
     Confusion.compte(M, k)  → { tp, fn, fp, tn, total }
     Confusion.metriques(M, k) → { tp, fn, fp, tn, accuracy, precision, recall, specificite, f1 }
     Confusion.globales(M)   → { accuracy, macroF1, weightedF1, microF1, n: [effectifs par classe] }
   Une division par 0 donne NaN (affiché « — »). La brique injecte son propre CSS. */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };
  var STYLE =
    ".matrice td.z-tp{background:var(--encre);color:var(--fond);border-color:var(--encre)}" +
    ".matrice td.z-fn{background:repeating-linear-gradient(135deg,var(--fond-2) 0 4px,var(--fond) 4px 8px);border-color:var(--encre-2)}" +
    ".matrice td.z-fp{background:repeating-linear-gradient(45deg,var(--fond-2) 0 2px,var(--fond) 2px 6px);border-style:dotted;border-color:var(--encre-2)}" +
    ".matrice td.z-tn{color:var(--encre-3)}" +
    ".confusion-legende{display:flex;flex-wrap:wrap;gap:.3rem .9rem;justify-content:center;font-size:.85rem;color:var(--encre-2);margin:.2rem 0 .4rem}" +
    ".confusion-legende .ech{display:inline-block;width:.9rem;height:.9rem;border:1px solid var(--encre-2);border-radius:3px;vertical-align:-2px;margin-right:.25rem}" +
    ".confusion-legende .ech.z-tp{background:var(--encre)}" +
    ".confusion-legende .ech.z-fn{background:repeating-linear-gradient(135deg,var(--fond-2) 0 3px,var(--fond) 3px 6px)}" +
    ".confusion-legende .ech.z-fp{background:repeating-linear-gradient(45deg,var(--fond-2) 0 2px,var(--fond) 2px 5px);border-style:dotted}" +
    ".confusion-legende .ech.z-tn{background:var(--fond);border-color:var(--trait)}";
  function styler() {
    if (document.getElementById("style-confusion")) return;
    var s = document.createElement("style"); s.id = "style-confusion"; s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function somme(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function compte(M, k) {
    var total = somme(M.map(somme));
    var tp = M[k][k];
    var fn = somme(M[k]) - tp;
    var fp = somme(M.map(function (l) { return l[k]; })) - tp;
    return { tp: tp, fn: fn, fp: fp, tn: total - tp - fn - fp, total: total };
  }
  function div(a, b) { return b === 0 ? NaN : a / b; }
  function metriques(M, k) {
    var c = compte(M, k);
    var p = div(c.tp, c.tp + c.fp), r = div(c.tp, c.tp + c.fn);
    c.accuracy = div(c.tp + c.tn, c.total);
    c.precision = p; c.recall = r;
    c.specificite = div(c.tn, c.tn + c.fp);
    c.f1 = div(2 * c.tp, 2 * c.tp + c.fp + c.fn);
    return c;
  }
  function globales(M) {
    var K = M.length, total = somme(M.map(somme)), diag = 0;
    for (var i = 0; i < K; i++) diag += M[i][i];
    var f1 = [], n = [];
    for (var k = 0; k < K; k++) { f1.push(metriques(M, k).f1); n.push(somme(M[k])); }
    return {
      accuracy: div(diag, total),
      macroF1: somme(f1) / K,
      weightedF1: somme(f1.map(function (f, k) { return f * n[k] / total; })),
      microF1: div(diag, total),
      f1: f1, n: n
    };
  }

  function Confusion(conteneur, o) {
    styler();
    this.o = o;
    this.k = o.choisie === undefined ? null : o.choisie;
    var self = this;
    this.boite = el("div", "confusion");
    conteneur.appendChild(this.boite);
    if (o.choisir) {
      this.barre = el("div", "rangee-btn");
      this.barre.style.justifyContent = "center";
      this.boutons = o.classes.map(function (c, k) {
        var b = el("button", "btn btn-petit", "classe " + c); b.type = "button";
        b.onclick = function () { self.choisir(k); };
        self.barre.appendChild(b); return b;
      });
      this.boite.appendChild(this.barre);
    }
    this.mx = new Matrice(this.boite, {
      nom: "vraie ↓ prédite →", lignes: o.classes, colonnes: o.classes,
      onCase: function (i, j) { if (o.onCase) o.onCase(i, j); if (o.choisir && i === j) self.choisir(i); }
    });
    this.leg = el("div", "confusion-legende");
    this.boite.appendChild(this.leg);
    this.dessiner();
  }
  Confusion.prototype.choisir = function (k) {
    this.k = k;
    this.dessiner(this.extra);
    if (this.o.surChoix) this.o.surChoix(k);
  };
  Confusion.prototype.dessiner = function (extra) {
    this.extra = extra || this.extra || {};
    var M = this.o.M, k = this.k, cls = {};
    if (k !== null && k !== undefined) {
      for (var i = 0; i < M.length; i++) for (var j = 0; j < M.length; j++) {
        cls[i + "," + j] = i === k && j === k ? "z-tp" : i === k ? "z-fn" : j === k ? "z-fp" : "z-tn";
      }
    }
    var ex = this.extra.classes || {};
    Object.keys(ex).forEach(function (c) { cls[c] = (cls[c] ? cls[c] + " " : "") + ex[c]; });
    this.mx.dessiner(M, { format: String, classes: cls });
    if (this.boutons) this.boutons.forEach(function (b, i) { b.classList.toggle("btn-plein", i === k); });
    if (k !== null && k !== undefined) {
      var c = this.o.classes[k];
      this.leg.innerHTML = "<span><span class='ech z-tp'></span>TP(" + c + ")</span><span><span class='ech z-fn'></span>FN(" + c + ") : sa ligne</span>" +
        "<span><span class='ech z-fp'></span>FP(" + c + ") : sa colonne</span><span><span class='ech z-tn'></span>TN(" + c + ") : le reste</span>";
    } else this.leg.innerHTML = "";
  };

  Confusion.compte = compte;
  Confusion.metriques = metriques;
  Confusion.globales = globales;
  window.Confusion = Confusion;
})();
