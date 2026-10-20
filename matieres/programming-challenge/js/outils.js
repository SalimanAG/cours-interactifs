/* outils.js — petits utilitaires d'affichage partagés par les leçons de
   Programming Challenge.
     PC.html(zone, contenuHTML, classe?)        → div ajoutée
     PC.entree(zone, texte, titre?)             → bloc « stdin » (texte brut)
     PC.code(zone, texte, titre?)               → bloc de code Python (texte brut, # commentaires grisés)
     PC.bouton(parent, texte, action, plein?)   → bouton
     PC.sortie(zone, texte, titre?)             → bloc « stdout »
     PC.melanger(tableau)                       → copie mélangée
     PC.entier(a, b)                            → entier aléatoire dans [a, b] */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  function html(zone, contenu, classe) {
    var d = el("div", classe || "");
    d.innerHTML = contenu;
    zone.appendChild(d);
    return d;
  }
  function bloc(zone, texte, titre, classeTitre) {
    var d = el("div", "entree");
    if (titre) d.appendChild(el("span", "titre-entree", titre));
    d.appendChild(document.createTextNode(texte));
    zone.appendChild(d);
    return d;
  }
  function entree(zone, texte, titre) { return bloc(zone, texte, titre === undefined ? "Entrée (stdin)" : titre); }
  function sortie(zone, texte, titre) { return bloc(zone, texte, titre === undefined ? "Sortie (stdout)" : titre); }
  function code(zone, texte, titre) {
    var d = el("div", "code");
    if (titre) { var t = el("span", "titre-entree", titre); d.appendChild(t); d.appendChild(document.createTextNode("\n")); }
    texte.split("\n").forEach(function (ligne, i) {
      if (i) d.appendChild(document.createTextNode("\n"));
      var k = ligne.indexOf("#");
      if (k >= 0 && !/["'][^"']*#/.test(ligne.slice(0, k + 1))) {
        d.appendChild(document.createTextNode(ligne.slice(0, k)));
        d.appendChild(el("span", "com", ligne.slice(k)));
      } else {
        d.appendChild(document.createTextNode(ligne));
      }
    });
    zone.appendChild(d);
    return d;
  }
  function bouton(parent, texte, action, plein) {
    var b = el("button", "btn btn-petit" + (plein ? " btn-plein" : ""), texte);
    b.type = "button";
    b.onclick = action;
    parent.appendChild(b);
    return b;
  }
  function entier(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function melanger(t) {
    t = t.slice();
    for (var i = t.length - 1; i > 0; i--) { var j = entier(0, i); var x = t[i]; t[i] = t[j]; t[j] = x; }
    return t;
  }

  window.PC = { html: html, entree: entree, sortie: sortie, code: code, bouton: bouton, entier: entier, melanger: melanger };
})();
