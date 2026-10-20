/* pasapas.js — deux briques pour exécuter un algorithme pas à pas.

   1) PseudoCode : affiche un algorithme numéroté et surligne la ligne en cours.
        var pc = new PseudoCode(conteneur, { titre: "Algorithme 1 : …", lignes: ["pour tout v …", "  S(v) ← {v}", …] });
        pc.surligner(5);      // numéro de ligne (à partir de 1), ou null

   2) Controleur : boutons ⏮ ◀ ▶ ⏵ pour parcourir une suite d'états
      pré-calculée (une « trace » d'exécution).
        var ctl = new Controleur(conteneur, {
          afficher: function (i) { … },  // dessine l'état i
          delai: 700,                     // ms entre deux états en lecture auto
          surFin: function () { … }       // appelé quand on atteint le dernier état
        });
        ctl.charger(nombreEtats);         // nouvelle trace, revient à l'état 0
*/
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  function PseudoCode(conteneur, opts) {
    this.boite = el("div", "pseudo");
    if (opts.titre) this.boite.appendChild(el("span", "titre-pseudo", opts.titre));
    this.lignes = [];
    var self = this;
    opts.lignes.forEach(function (texte, i) {
      var l = el("div", "ligne");
      l.appendChild(el("span", "n", String(i + 1)));
      l.appendChild(el("span", "c", texte));
      self.boite.appendChild(l);
      self.lignes.push(l);
    });
    conteneur.appendChild(this.boite);
  }
  PseudoCode.prototype.surligner = function (n) {
    this.lignes.forEach(function (l, i) { l.classList.toggle("active", i + 1 === n); });
  };

  function Controleur(conteneur, opts) {
    this.opts = opts;
    this.n = 0;
    this.i = 0;
    this.minuteur = null;
    var self = this;
    var barre = el("div", "controle");
    function bouton(texte, titre, action) {
      var b = el("button", "btn btn-petit", texte);
      b.type = "button"; b.title = titre; b.setAttribute("aria-label", titre);
      b.onclick = action;
      barre.appendChild(b);
      return b;
    }
    this.bDebut = bouton("⏮", "Revenir au début", function () { self.stop(); self.aller(0); });
    this.bPrec = bouton("◀", "État précédent", function () { self.stop(); self.aller(self.i - 1); });
    this.bSuiv = bouton("▶", "État suivant", function () { self.stop(); self.aller(self.i + 1); });
    this.bLecture = bouton("⏵ Lecture", "Lecture automatique", function () {
      if (self.minuteur) self.stop(); else self.lecture();
    });
    this.compteur = el("span", "compteur", "");
    barre.appendChild(this.compteur);
    conteneur.appendChild(barre);
    this.maj();
  }
  Controleur.prototype.charger = function (n) {
    this.stop();
    this.n = n;
    this.i = -1;
    this.aller(0);
  };
  Controleur.prototype.aller = function (i) {
    if (!this.n) { this.maj(); return; }
    i = Math.max(0, Math.min(this.n - 1, i));
    var avant = this.i;
    this.i = i;
    this.opts.afficher(i);
    this.maj();
    if (i === this.n - 1 && avant !== i && this.opts.surFin) this.opts.surFin();
  };
  Controleur.prototype.lecture = function () {
    var self = this;
    if (this.i >= this.n - 1) this.aller(0);
    this.bLecture.textContent = "⏸ Pause";
    this.minuteur = setInterval(function () {
      if (self.i >= self.n - 1) { self.stop(); return; }
      self.aller(self.i + 1);
    }, this.opts.delai || 700);
  };
  Controleur.prototype.stop = function () {
    if (this.minuteur) clearInterval(this.minuteur);
    this.minuteur = null;
    this.bLecture.textContent = "⏵ Lecture";
  };
  Controleur.prototype.maj = function () {
    this.compteur.textContent = this.n ? (this.i + 1) + " / " + this.n : "";
    this.bDebut.disabled = this.bPrec.disabled = !this.n || this.i === 0;
    this.bSuiv.disabled = !this.n || this.i >= this.n - 1;
    this.bLecture.disabled = !this.n;
  };

  window.PseudoCode = PseudoCode;
  window.Controleur = Controleur;
})();
