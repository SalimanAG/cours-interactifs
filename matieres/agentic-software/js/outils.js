/* outils.js — petites aides partagées par les ateliers d'Agentic Software Development. */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };
  function html(zone, contenu, classe) { var d = el("div", classe || ""); d.innerHTML = contenu; zone.appendChild(d); return d; }
  function m(t) { return "<span class='mono'>" + t + "</span>"; }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  /* Bloc de code (texte brut, échappé). Les lignes qui commencent par « # » sont des commentaires. */
  function code(zone, lignes, titre) {
    var d = el("pre", "code");
    d.style.whiteSpace = "pre-wrap"; d.style.overflowWrap = "anywhere";
    d.innerHTML = (titre ? "<span class='com'>" + esc(titre) + "</span>\n" : "") +
      lignes.map(function (l) { return /^\s*#/.test(l) ? "<span class='com'>" + esc(l) + "</span>" : esc(l); }).join("\n");
    zone.appendChild(d);
    return d;
  }
  /* Note de fidélité placée sous la zone d'exercice. */
  function note(zone, contenu) {
    var d = el("div", "signalement"); d.innerHTML = contenu;
    if (zone.parentNode) zone.parentNode.insertBefore(d, zone.nextSibling); else zone.appendChild(d);
    return d;
  }
  /* Enchaîne plusieurs exercices dans une étape : le suivant apparaît après réussite du précédent. */
  function enchainer(zone, api, exos, message) {
    var i = 0;
    function suivant() {
      if (i >= exos.length) { api.valider(message); return; }
      var bloc = el("div");
      if (i > 0) bloc.style.marginTop = "1.1rem";
      zone.appendChild(bloc);
      exos[i++](bloc, suivant);
    }
    suivant();
  }
  /* Rangée de boutons ; chaque bouton appelle action(indice). Renvoie la liste des boutons. */
  function boutons(zone, textes, action) {
    var r = el("div", "rangee-btn");
    var bs = textes.map(function (t, i) {
      var b = el("button", "btn btn-petit", t); b.type = "button";
      b.onclick = function () { action(i, b); };
      r.appendChild(b); return b;
    });
    zone.appendChild(r);
    return bs;
  }
  window.ASD = { html: html, m: m, esc: esc, code: code, note: note, enchainer: enchainer, boutons: boutons };
})();
