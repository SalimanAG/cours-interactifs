/* grille-comptee.js — une grille L × C avec des compteurs au bout de chaque
   ligne et sous chaque colonne (nonogrammes, grilles à totaux, « Billet endommagé »…).
   Différente de grille.js (puzzle à valeurs cycliques) : ici la leçon décide
   de ce que fait un toucher, et dessine elle-même chaque état.

   var g = new GrilleComptee(conteneur, {
     onCase: function (i, j) {…},     // (optionnel) cases cliquables ; i, j à partir de 0
     debut: 1                          // numéros de ligne / colonne affichés (null = aucun)
   });
   g.dessiner(valeurs, {               // valeurs[i][j] : nombre, texte court, ou null (case vide)
     classes: { "0,2": "courante" },   // par case : "courante" (accent : en cours), "plein",
                                       //   "pale", "barree" ; une case null est en pointillés
     droite: { titres: ["lm", "lv"], valeurs: [[1, 3], …], classes: { 2: "courante" } },
                                       // une colonne par titre, valeurs[i] = compteurs de la ligne i
     bas:    { titres: ["cm", "cv"], valeurs: [[1, 0, …], [3, 3, …]], classes: { 4: "courante" } }
                                       // une rangée par titre, valeurs[r][j] = compteur r de la colonne j
   });
   g.verrouiller(true)                 // plus de clic */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  var STYLE =
    ".grille-comptee{overflow-x:auto;margin:.6rem 0;max-width:100%}" +
    ".grille-comptee table{border-collapse:separate;border-spacing:3px;width:auto;margin:0;border:none}" +
    ".grille-comptee th,.grille-comptee td{padding:0;border:none;background:none;text-align:center;vertical-align:middle}" +
    ".grille-comptee th.num{font-family:var(--mono);font-size:.68rem;font-weight:400;color:var(--encre-3);min-width:1rem;height:1rem}" +
    ".grille-comptee .cg{width:2.25rem;height:2.25rem;border:1.5px solid var(--trait-fort);border-radius:6px;background:var(--fond);color:var(--encre);" +
      "font-family:var(--mono);font-size:.95rem;display:flex;align-items:center;justify-content:center;padding:0;margin:0}" +
    ".grille-comptee button.cg{cursor:pointer;touch-action:manipulation}" +
    ".grille-comptee button.cg:hover:not(:disabled){border-color:var(--encre-2)}" +
    ".grille-comptee button.cg:disabled{cursor:default}" +
    ".grille-comptee .cg.vide{border-style:dashed;color:var(--encre-3)}" +
    ".grille-comptee .cg.plein{background:var(--encre);border-color:var(--encre);color:var(--fond)}" +
    ".grille-comptee .cg.pale{background:var(--fond-2);color:var(--encre-3)}" +
    ".grille-comptee .cg.barree{text-decoration:line-through;color:var(--encre-3)}" +
    ".grille-comptee .cg.courante{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent)}" +
    ".grille-comptee .an{font-family:var(--mono);font-size:.8rem;color:var(--encre-2);min-width:1.7rem;padding:0 .1rem}" +
    ".grille-comptee th.an{font-size:.68rem;font-weight:400;color:var(--encre-3)}" +
    ".grille-comptee td.an.courante{color:var(--accent);font-weight:600}" +
    ".grille-comptee .sep{min-width:.35rem}" +
    ".grille-comptee.compacte .cg{width:1.8rem;height:1.8rem;font-size:.8rem}";

  function injecterStyle() {
    if (document.getElementById("style-grille-comptee")) return;
    var s = document.createElement("style");
    s.id = "style-grille-comptee";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function GrilleComptee(conteneur, opts) {
    injecterStyle();
    this.opts = opts || {};
    this.verrou = false;
    this.boite = el("div", "grille-comptee");
    conteneur.appendChild(this.boite);
  }

  GrilleComptee.prototype.dessiner = function (valeurs, o) {
    this.dernier = [valeurs, o];
    o = o || {};
    var self = this, opts = this.opts;
    var debut = opts.debut === undefined ? 1 : opts.debut;
    var L = valeurs.length, C = L ? valeurs[0].length : 0;
    var cl = o.classes || {}, dr = o.droite, bas = o.bas;
    this.boite.classList.toggle("compacte", C + (dr ? dr.titres.length : 0) > 9);
    var t = el("table");
    if (debut !== null) {
      var tr = el("tr");
      tr.appendChild(el("th"));
      for (var j = 0; j < C; j++) tr.appendChild(el("th", "num", String(j + debut)));
      if (dr) { tr.appendChild(el("th", "sep")); dr.titres.forEach(function (x) { tr.appendChild(el("th", "an", x)); }); }
      t.appendChild(tr);
    }
    for (var i = 0; i < L; i++) {
      var r = el("tr");
      if (debut !== null) r.appendChild(el("th", "num", String(i + debut)));
      for (var j2 = 0; j2 < C; j2++) {
        (function (i, j) {
          var v = valeurs[i][j];
          var td = el("td");
          var c = el(opts.onCase ? "button" : "span",
            "cg" + (v === null || v === undefined ? " vide" : "") + (cl[i + "," + j] ? " " + cl[i + "," + j] : ""),
            v === null || v === undefined ? "" : String(v));
          c.setAttribute("aria-label", "ligne " + (i + 1) + ", colonne " + (j + 1) + (v === null ? ", vide" : ", " + v));
          if (opts.onCase) {
            c.type = "button";
            c.disabled = self.verrou;
            c.onclick = function () { opts.onCase(i, j); };
          }
          td.appendChild(c);
          r.appendChild(td);
        })(i, j2);
      }
      if (dr) {
        r.appendChild(el("td", "sep"));
        (dr.valeurs[i] || []).forEach(function (x) {
          r.appendChild(el("td", "an" + (dr.classes && dr.classes[i] ? " " + dr.classes[i] : ""), x === null || x === undefined ? "" : String(x)));
        });
      }
      t.appendChild(r);
    }
    if (bas) {
      bas.titres.forEach(function (titre, k) {
        var rb = el("tr");
        rb.appendChild(el("th", "an", titre));
        for (var j = 0; j < C; j++) {
          var x = bas.valeurs[k] ? bas.valeurs[k][j] : "";
          rb.appendChild(el("td", "an" + (bas.classes && bas.classes[j] ? " " + bas.classes[j] : ""), x === null || x === undefined ? "" : String(x)));
        }
        t.appendChild(rb);
      });
    }
    this.boite.innerHTML = "";
    this.boite.appendChild(t);
  };

  GrilleComptee.prototype.verrouiller = function (oui) {
    this.verrou = !!oui;
    if (this.dernier) this.dessiner(this.dernier[0], this.dernier[1]);
  };

  window.GrilleComptee = GrilleComptee;
})();
