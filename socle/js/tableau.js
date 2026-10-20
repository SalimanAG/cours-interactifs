/* tableau.js — un tableau de cases indexées, cliquables, avec des pointeurs.
   Sert aux tris, aux fenêtres glissantes, aux tableaux creux, etc.

   var t = new Tableau(conteneur, {
     nom: "A",                     // (optionnel) nom affiché devant le tableau
     debut: 0,                     // premier indice affiché (0 ou 1)
     indices: true,                // afficher les indices au-dessus
     compact: false,               // cases plus étroites (longues séquences)
     onCase: function (i) {…}      // (optionnel) rend les cases cliquables
   });
   t.dessiner(valeurs, {
     classes: { 2: "courante", 3: "choisie" },   // par indice (0-based dans `valeurs`)
                                                  // "courante" (accent : en cours), "choisie" (pleine),
                                                  // "vue" (grisée), "barree", "vide"
     pointeurs: { 0: "i", 4: "j" },              // étiquettes sous les cases
     plage: [2, 5]                                // (optionnel) encadre les cases 2..5 incluses
   });
   Les valeurs sont des nombres ou des textes courts ; null → case vide. */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  function Tableau(conteneur, opts) {
    this.opts = opts || {};
    this.boite = el("div", "tableau-cases" + (this.opts.compact ? " compact" : ""));
    conteneur.appendChild(this.boite);
  }

  Tableau.prototype.dessiner = function (valeurs, o) {
    o = o || {};
    var self = this, op = this.opts;
    var b = this.boite;
    b.innerHTML = "";
    b.classList.toggle("compact", !!op.compact || valeurs.length > 8);
    b.classList.toggle("sans-indices", op.indices === false);
    if (op.nom) b.appendChild(el("span", "nom-tableau", op.nom));
    var rangee = el("div", "rangee-cases");
    b.appendChild(rangee);
    var debut = op.debut || 0;
    var classes = o.classes || {}, pointeurs = o.pointeurs || {};
    valeurs.forEach(function (v, i) {
      var col = el("div", "col-case");
      var c = el(op.onCase ? "button" : "span", "case" + (classes[i] ? " " + classes[i] : ""));
      if (op.onCase) { c.type = "button"; c.onclick = function () { op.onCase(i); }; }
      if (op.indices !== false) c.appendChild(el("span", "indice", String(i + debut)));
      c.appendChild(document.createTextNode(v === null || v === undefined ? "" : String(v)));
      if (o.plage && i >= o.plage[0] && i <= o.plage[1]) {
        col.classList.add("dans-plage");
        if (i === o.plage[0]) col.classList.add("plage-debut");
        if (i === o.plage[1]) col.classList.add("plage-fin");
      }
      col.appendChild(c);
      col.appendChild(el("span", "ptr-sous", pointeurs[i] || ""));
      rangee.appendChild(col);
    });
  };

  window.Tableau = Tableau;
})();
