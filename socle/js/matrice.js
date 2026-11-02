/* matrice.js — une matrice (ou un tableau de nombres) avec étiquettes de lignes
   et de colonnes. Cases surlignables, cliquables ou à remplir.
   Sert aux matrices document–terme, de co-occurrence, de confusion, aux
   embeddings, aux lots de séquences avec padding…

   var mx = new Matrice(conteneur, {
     nom: "X",                               // (optionnel) nom affiché en coin
     lignes: ["doc 1", "doc 2"],             // étiquettes de lignes (ou null)
     colonnes: ["cat", "dog"],               // étiquettes de colonnes (ou null)
     onCase: function (i, j) {…},            // (optionnel) cases cliquables
     onSaisie: function (i, j, texte) {…}    // (optionnel) appelé quand une case éditable change
   });
   mx.dessiner(valeurs, {                    // valeurs : tableau de lignes ; null → case vide
     classes: { "0,1": "courante" },         // par case : "courante" (accent : en cours), "choisie" (pleine),
                                             //   "pale", "juste", "fausse", "masque" (barrée en pointillés)
     lignesClasses: { 0: "courante" },       // classe pour toute une ligne
     colonnesClasses: { 1: "courante" },     // classe pour toute une colonne
     editables: { "1,1": true },             // cases à remplir (champ de saisie)
     format: function (v) { return … },      // (optionnel) affichage des nombres
     chaleur: true                           // (optionnel) fond gradué selon la valeur (gris, jamais l'accent)
   });
   mx.lire(i, j) → texte saisi dans une case éditable
   Matrice.fmt(0.4233, 2) → "0,42" */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };
  var STYLE =
    ".matrice-boite{overflow-x:auto;margin:.4rem 0;-webkit-overflow-scrolling:touch}" +
    ".matrice{border-collapse:separate;border-spacing:3px;font-family:var(--mono);font-size:.85rem;margin:0 auto}" +
    ".matrice th{font-weight:500;color:var(--encre-2);padding:0 .3rem;white-space:nowrap;font-size:.8rem}" +
    ".matrice th.lig{text-align:right}" +
    ".matrice td{min-width:2.3rem;height:2.1rem;text-align:center;border:1px solid var(--trait);border-radius:6px;background:var(--fond);color:var(--encre);padding:0 .25rem}" +
    ".matrice td.cliquable{cursor:pointer}" +
    ".matrice td.cliquable:hover{border-color:var(--encre)}" +
    ".matrice td.courante,.matrice tr.courante td,.matrice td.col-courante{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}" +
    ".matrice td.choisie{background:var(--encre);color:var(--fond);border-color:var(--encre)}" +
    ".matrice td.pale{color:var(--encre-3)}" +
    ".matrice td.juste{font-weight:600;border-color:var(--encre)}" +
    ".matrice td.fausse{text-decoration:line-through;color:var(--encre-3)}" +
    ".matrice td.masque{border-style:dashed;color:var(--encre-3)}" +
    ".matrice td input{width:2.2rem;font:inherit;text-align:center;border:0;background:transparent;color:var(--encre);padding:0;min-height:2rem}" +
    ".matrice td.editable{border-style:dashed;border-color:var(--trait-fort)}" +
    ".matrice .coin{color:var(--encre-3);font-style:italic}";
  function injecterStyle() {
    if (document.getElementById("style-matrice")) return;
    var s = document.createElement("style"); s.id = "style-matrice"; s.textContent = STYLE;
    document.head.appendChild(s);
  }
  function fmt(v, d) {
    if (typeof v !== "number") return v === null || v === undefined ? "" : String(v);
    if (d === undefined) d = 2;
    var r = Number(v.toFixed(d)); if (r === 0) r = 0;
    return String(r).replace(".", ",").replace("-", "−");
  }

  function Matrice(conteneur, opts) {
    injecterStyle();
    this.o = opts || {};
    this.boite = el("div", "matrice-boite");
    conteneur.appendChild(this.boite);
    this.champs = {};
  }
  Matrice.prototype.dessiner = function (valeurs, d) {
    d = d || {};
    var self = this, o = this.o;
    var cl = d.classes || {}, lc = d.lignesClasses || {}, cc = d.colonnesClasses || {}, ed = d.editables || {};
    var f = d.format || function (v) { return fmt(v, 2); };
    var max = 0;
    if (d.chaleur) valeurs.forEach(function (l) { l.forEach(function (v) { if (typeof v === "number") max = Math.max(max, Math.abs(v)); }); });
    var anciens = {};
    Object.keys(this.champs).forEach(function (k) { anciens[k] = self.champs[k].value; });
    this.champs = {};
    var t = el("table", "matrice");
    if (o.colonnes) {
      var tr = el("tr");
      tr.appendChild(el("th", "coin", o.nom || ""));
      o.colonnes.forEach(function (c, j) { var th = el("th", null, c); if (cc[j]) th.style.color = "var(--accent)"; tr.appendChild(th); });
      t.appendChild(tr);
    }
    valeurs.forEach(function (ligne, i) {
      var tr = el("tr", lc[i] || "");
      if (o.lignes) tr.appendChild(el("th", "lig", o.lignes[i] === undefined ? "" : o.lignes[i]));
      ligne.forEach(function (v, j) {
        var k = i + "," + j;
        var td = el("td", (cl[k] || "") + (cc[j] ? " col-" + cc[j] : ""));
        if (ed[k]) {
          td.classList.add("editable");
          var inp = el("input");
          inp.type = "text"; inp.inputMode = "decimal"; inp.autocomplete = "off";
          inp.setAttribute("aria-label", (o.lignes ? o.lignes[i] : "ligne " + (i + 1)) + " × " + (o.colonnes ? o.colonnes[j] : "colonne " + (j + 1)));
          inp.value = anciens[k] !== undefined ? anciens[k] : (v === null || v === undefined ? "" : String(v));
          inp.addEventListener("input", function () { if (o.onSaisie) o.onSaisie(i, j, inp.value); });
          self.champs[k] = inp;
          td.appendChild(inp);
        } else {
          td.textContent = f(v);
          if (d.chaleur && typeof v === "number" && max > 0) {
            var a = Math.round(Math.abs(v) / max * 28);
            td.style.background = "color-mix(in srgb, var(--encre) " + a + "%, var(--fond))";
            if (a > 16) td.style.color = "var(--fond)";
          }
        }
        if (o.onCase && !ed[k]) { td.classList.add("cliquable"); td.onclick = function () { o.onCase(i, j); }; }
        tr.appendChild(td);
      });
      t.appendChild(tr);
    });
    this.boite.innerHTML = "";
    this.boite.appendChild(t);
  };
  Matrice.prototype.lire = function (i, j) { var c = this.champs[i + "," + j]; return c ? c.value : null; };
  Matrice.fmt = fmt;
  window.Matrice = Matrice;
})();
