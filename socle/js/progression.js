/* progression.js — un seul endroit pour lire/écrire la progression.
   Accueil, page matière, leçons et révision passent tous par ici, donc ils
   affichent toujours le même état.

   Clés utilisées (préfixées « ci: » par Stockage) :
     lecon:<matiere>/<id>   → { faites: [indices d'étapes], courante: n }
     cartes:<matiere>/<id>  → { <idCarte>: { boite: 1..5, du: timestamp } }
     test:<matiere>/<id>    → { tentatives: [{ quand, score, total, parNotion }] }
     derniere               → { matiere, id, type, titre, fichier, quand }
*/
(function () {
  "use strict";
  var JOUR = 24 * 3600 * 1000;
  // Système de boîtes (Leitner) : délai avant de revoir une carte, par boîte.
  var INTERVALLES = [0, 1, 3, 7, 15]; // en jours, boîtes 1 à 5

  function cleLecon(m, id) { return "lecon:" + m + "/" + id; }
  function cleCartes(m, id) { return "cartes:" + m + "/" + id; }

  /* ---------- Leçons et ateliers ---------- */
  function lecon(m, id) {
    var e = Stockage.lire(cleLecon(m, id), null);
    if (!e || !Array.isArray(e.faites)) e = { faites: [], courante: 0 };
    return e;
  }
  function marquerEtape(m, id, i) {
    var e = lecon(m, id);
    if (e.faites.indexOf(i) < 0) e.faites.push(i);
    Stockage.ecrire(cleLecon(m, id), e);
    return e;
  }
  function definirCourante(m, id, i) {
    var e = lecon(m, id);
    e.courante = i;
    Stockage.ecrire(cleLecon(m, id), e);
  }
  function reinitialiserLecon(m, id) { Stockage.effacer(cleLecon(m, id)); }

  /* ---------- Cartes ---------- */
  function etatsCartes(m, id) { return Stockage.lire(cleCartes(m, id), {}) || {}; }
  function noterCarte(m, id, idCarte, reussie) {
    var etats = etatsCartes(m, id);
    var e = etats[idCarte] || { boite: 1, du: 0 };
    e.boite = reussie ? Math.min(5, e.boite + 1) : 1;
    e.du = Date.now() + INTERVALLES[e.boite - 1] * JOUR;
    // Une carte ratée revient dans la même séance (du = maintenant).
    if (!reussie) e.du = Date.now();
    etats[idCarte] = e;
    Stockage.ecrire(cleCartes(m, id), etats);
    return e;
  }
  function reinitialiserCartes(m, id) { Stockage.effacer(cleCartes(m, id)); }

  /* Résumé d'un paquet : nécessite la liste des cartes (données du paquet). */
  function resumePaquet(m, paquet) {
    var etats = etatsCartes(m, paquet.id);
    var maintenant = Date.now();
    var r = { total: paquet.cartes.length, aRevoir: 0, nouvelles: 0, maitrisees: 0, parBoite: [0, 0, 0, 0, 0] };
    paquet.cartes.forEach(function (c) {
      var e = etats[c.id];
      if (!e) { r.nouvelles++; r.aRevoir++; return; }
      r.parBoite[e.boite - 1]++;
      if (e.boite === 5) r.maitrisees++;
      if (e.du <= maintenant) r.aRevoir++;
    });
    return r;
  }

  /* ---------- Tests notés ----------
     test:<matiere>/<id> → { tentatives: [{ quand, score, total, parNotion: { cle: [justes, total] } }] } */
  function resultatsTest(m, id) {
    var r = Stockage.lire("test:" + m + "/" + id, null);
    if (!r || !Array.isArray(r.tentatives)) r = { tentatives: [] };
    return r;
  }
  function ajouterTentative(m, id, tentative) {
    var r = resultatsTest(m, id);
    tentative.quand = Date.now();
    r.tentatives.push(tentative);
    if (r.tentatives.length > 20) r.tentatives = r.tentatives.slice(-20);
    Stockage.ecrire("test:" + m + "/" + id, r);
    return r;
  }
  function reinitialiserTest(m, id) { Stockage.effacer("test:" + m + "/" + id); }

  /* ---------- Dernière activité (pour « Reprendre ») ---------- */
  function noterActivite(info) {
    info.quand = Date.now();
    Stockage.ecrire("derniere", info);
  }
  function derniereActivite() { return Stockage.lire("derniere", null); }

  window.Progression = {
    INTERVALLES: INTERVALLES,
    lecon: lecon,
    marquerEtape: marquerEtape,
    definirCourante: definirCourante,
    reinitialiserLecon: reinitialiserLecon,
    etatsCartes: etatsCartes,
    noterCarte: noterCarte,
    reinitialiserCartes: reinitialiserCartes,
    resumePaquet: resumePaquet,
    resultatsTest: resultatsTest,
    ajouterTentative: ajouterTentative,
    reinitialiserTest: reinitialiserTest,
    noterActivite: noterActivite,
    derniereActivite: derniereActivite
  };
})();
