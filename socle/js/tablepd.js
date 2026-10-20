/* tablepd.js — table de programmation dynamique à remplir case par case.
   Les cases à remplir le sont dans l'ordre (ligne par ligne, de gauche à droite) ;
   la case en cours est en couleur, ses dépendances sont encadrées.

   var t = new TablePD(conteneur, {
     colonnes: [0, 1, …],                  // en-têtes de colonnes
     coin: "w",                            // texte de la case en haut à gauche
     lignes: [{ nom: "V1(w)", valeurs: [...], remplir: [indices de colonnes] | true | false }],
     deps: function (l, c) { return [[l2, c2], …]; },     // cases dont dépend (l, c)
     aide: function (l, c) { return "texte"; },           // message si la valeur est fausse
     surCase: function (l, c) {…},                        // (optionnel) après chaque case juste
     surFin: function () {…}
   });
   t.reveler(l)   // affiche toute la ligne l sans saisie
   Valeurs : nombres, ou -Infinity affiché « – » (saisie acceptée : -, –, −, x, -inf). */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };
  var MOINS = ["-", "–", "−", "x", "-inf", "−∞", "-∞", "∞"];

  function txt(v) { return v === -Infinity ? "–" : String(v); }
  function lire(s) {
    s = String(s).trim().toLowerCase();
    if (MOINS.indexOf(s) >= 0) return -Infinity;
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    return NaN;
  }

  function TablePD(conteneur, o) {
    this.o = o;
    var self = this;
    var wrap = el("div", "defile-x");
    conteneur.appendChild(wrap);
    var table = el("table", "table-pd");
    wrap.appendChild(table);
    this.msg = el("div", "retour");
    conteneur.appendChild(this.msg);
    var tr = el("tr");
    tr.appendChild(el("th", null, o.coin || ""));
    o.colonnes.forEach(function (c) { tr.appendChild(el("th", null, String(c))); });
    table.appendChild(tr);
    this.cellules = [];
    this.ordre = [];
    o.lignes.forEach(function (L, l) {
      var r = el("tr");
      r.appendChild(el("th", null, L.nom));
      var ligne = [];
      o.colonnes.forEach(function (c, k) {
        var td = el("td");
        var aRemplir = L.remplir === true || (Array.isArray(L.remplir) && L.remplir.indexOf(k) >= 0);
        if (aRemplir) { self.ordre.push([l, k]); td.className = "vide"; }
        else td.textContent = L.valeurs[k] === null || L.valeurs[k] === undefined ? "" : txt(L.valeurs[k]);
        r.appendChild(td);
        ligne.push(td);
      });
      table.appendChild(r);
      self.cellules.push(ligne);
    });
    this.pos = 0;
    this.activer();
  }

  TablePD.prototype.nettoyer = function () {
    this.cellules.forEach(function (l) { l.forEach(function (td) { td.classList.remove("dep"); td.classList.remove("courante"); }); });
  };

  TablePD.prototype.activer = function () {
    var self = this, o = this.o;
    this.nettoyer();
    if (this.pos >= this.ordre.length) { if (o.surFin) o.surFin(); return; }
    var lc = this.ordre[this.pos], l = lc[0], k = lc[1];
    var td = this.cellules[l][k];
    td.textContent = "";
    td.className = "courante";
    (o.deps ? o.deps(l, k) : []).forEach(function (d) {
      var x = self.cellules[d[0]] && self.cellules[d[0]][d[1]];
      if (x) x.classList.add("dep");
    });
    var inp = el("input");
    inp.type = "text"; inp.autocomplete = "off"; inp.setAttribute("aria-label", o.lignes[l].nom + " colonne " + o.colonnes[k]);
    td.appendChild(inp);
    var fait = false;
    function valider() {
      if (fait) return;                    // « change » peut suivre « Entrée » quand la case disparaît
      var v = lire(inp.value);
      if (isNaN(v)) { self.msg.className = "retour ko"; self.msg.textContent = "Écris un entier, ou « – » pour −∞."; return; }
      var att = o.lignes[l].valeurs[k];
      if (v === att) {
        fait = true;
        td.innerHTML = ""; td.textContent = txt(att); td.className = "ok";
        self.msg.className = "retour"; self.msg.textContent = "";
        self.pos++;
        if (o.surCase) o.surCase(l, k);
        self.activer();
      } else {
        self.msg.className = "retour ko";
        self.msg.textContent = (o.aide ? o.aide(l, k) : "Non.");
      }
    }
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); valider(); } });
    inp.addEventListener("change", valider);
    try { inp.focus({ preventScroll: true }); } catch (e) { /* rien */ }
  };

  TablePD.prototype.reveler = function (l) {
    var self = this;
    this.cellules[l].forEach(function (td, k) { td.innerHTML = ""; td.className = "ok"; td.textContent = txt(self.o.lignes[l].valeurs[k]); });
    this.ordre = this.ordre.filter(function (x, i) { return i < self.pos || x[0] !== l; });
    this.activer();
  };

  window.TablePD = TablePD;
  window.TablePD.lire = lire;
  window.TablePD.texte = txt;
})();
