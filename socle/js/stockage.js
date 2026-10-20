/* stockage.js — accès à localStorage, toujours protégé par try/catch.
   Si le stockage est indisponible (navigation privée, fichier ouvert dans
   certains navigateurs, quota plein…), le site fonctionne quand même :
   la progression repart simplement de zéro. */
(function () {
  "use strict";
  var PREFIXE = "ci:";
  var memoire = {}; // repli en mémoire si localStorage est inaccessible

  function disponible() {
    try {
      var k = PREFIXE + "__test";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }
  var ok = disponible();

  function lire(cle, defaut) {
    var brut = null;
    try {
      brut = ok ? window.localStorage.getItem(PREFIXE + cle) : (memoire[cle] || null);
    } catch (e) {
      brut = memoire[cle] || null;
    }
    if (brut === null || brut === undefined) return defaut;
    try {
      return JSON.parse(brut);
    } catch (e) {
      return defaut;
    }
  }

  function ecrire(cle, valeur) {
    var brut;
    try { brut = JSON.stringify(valeur); } catch (e) { return false; }
    memoire[cle] = brut;
    try {
      if (ok) window.localStorage.setItem(PREFIXE + cle, brut);
      return true;
    } catch (e) {
      return false;
    }
  }

  function effacer(cle) {
    delete memoire[cle];
    try { if (ok) window.localStorage.removeItem(PREFIXE + cle); } catch (e) { /* rien */ }
  }

  window.Stockage = { lire: lire, ecrire: ecrire, effacer: effacer, disponible: ok };
})();
