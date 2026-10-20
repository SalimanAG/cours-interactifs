/* navigation.js — lecture du catalogue, chemins, en-tête, chargement des
   paquets de cartes et calcul des résumés de progression.
   Toutes les pages déclarent leur position par rapport à la racine du site :
     <body data-racine="../../../">   (chaîne vide à la racine)
   Ainsi le site fonctionne en ouvrant index.html directement (file://)
   comme sur GitHub Pages. */
(function () {
  "use strict";

  var racine = (document.body && document.body.getAttribute("data-racine")) || "";

  function url(chemin) { return racine + chemin; }

  function param(nom) {
    var m = new RegExp("[?&]" + nom + "=([^&#]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }

  function matieres() { return (window.CATALOGUE && window.CATALOGUE.matieres) || []; }
  function matiere(id) {
    var l = matieres();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }
  function tousContenus(mat) {
    var r = [];
    (mat.chapitres || []).forEach(function (ch) {
      (ch.contenus || []).forEach(function (c) { r.push({ chapitre: ch, contenu: c }); });
    });
    return r;
  }
  function contenu(idMatiere, idContenu) {
    var mat = matiere(idMatiere);
    if (!mat) return null;
    var l = tousContenus(mat);
    for (var i = 0; i < l.length; i++) {
      if (l[i].contenu.id === idContenu) return { matiere: mat, chapitre: l[i].chapitre, contenu: l[i].contenu };
    }
    return null;
  }
  function disponible(c) { return !!c.fichier; }

  function lienContenu(mat, c) {
    if (c.type === "cartes") return url("revision.html?m=" + encodeURIComponent(mat.id) + "&p=" + encodeURIComponent(c.id));
    if (c.type === "test") return url("test.html?m=" + encodeURIComponent(mat.id) + "&t=" + encodeURIComponent(c.id));
    return url(c.fichier);
  }

  /* ---------- Paquets de cartes ---------- */
  window.PAQUETS = window.PAQUETS || {};
  window.Paquets = {
    enregistrer: function (p) { window.PAQUETS[p.matiere + "/" + p.id] = p; },
    obtenir: function (m, id) { return window.PAQUETS[m + "/" + id] || null; }
  };

  var scriptsCharges = {};
  function chargerScript(src, fini) {
    if (scriptsCharges[src] === true) { fini(true); return; }
    if (Array.isArray(scriptsCharges[src])) { scriptsCharges[src].push(fini); return; }
    scriptsCharges[src] = [fini];
    var s = document.createElement("script");
    s.src = src;
    function terminer(ok) {
      var attente = scriptsCharges[src];
      scriptsCharges[src] = ok ? true : undefined;
      attente.forEach(function (f) { f(ok); });
    }
    s.onload = function () { terminer(true); };
    s.onerror = function () { terminer(false); };
    document.head.appendChild(s);
  }

  /* Charge tous les paquets disponibles des matières données, puis appelle fini(). */
  function chargerPaquets(listeMatieres, fini) {
    var aCharger = [];
    listeMatieres.forEach(function (mat) {
      tousContenus(mat).forEach(function (x) {
        if (x.contenu.type === "cartes" && x.contenu.fichier) aCharger.push(url(x.contenu.fichier));
      });
    });
    var reste = aCharger.length;
    if (!reste) { fini(); return; }
    aCharger.forEach(function (src) {
      chargerScript(src, function () { if (--reste === 0) fini(); });
    });
  }

  /* ---------- Résumés de progression ---------- */
  function resumeContenu(mat, c) {
    if (!c.fichier) return null;
    if (c.type === "cartes") {
      var p = Paquets.obtenir(mat.id, c.id);
      return p ? Progression.resumePaquet(mat.id, p) : null;
    }
    if (c.type === "test") {
      var t = Progression.resultatsTest(mat.id, c.id).tentatives;
      if (!t.length) return { tentatives: 0 };
      var der = t[t.length - 1];
      var meilleur = t.reduce(function (a, x) { return x.score / x.total > a.score / a.total ? x : a; }, t[0]);
      return { tentatives: t.length, dernier: der, meilleur: meilleur };
    }
    var e = Progression.lecon(mat.id, c.id);
    var total = c.etapes || 0;
    var faites = e.faites.filter(function (i) { return i < total; }).length;
    return { faites: faites, total: total };
  }

  function resumeMatiere(mat) {
    var r = { etapesFaites: 0, etapesTotal: 0, cartesTotal: 0, cartesARevoir: 0, cartesMaitrisees: 0, disponibles: 0, prevus: 0 };
    tousContenus(mat).forEach(function (x) {
      var c = x.contenu;
      r.prevus++;
      if (!c.fichier) return;
      r.disponibles++;
      var s = resumeContenu(mat, c);
      if (!s) return;
      if (c.type === "test") return;
      if (c.type === "cartes") {
        r.cartesTotal += s.total; r.cartesARevoir += s.aRevoir; r.cartesMaitrisees += s.maitrisees;
      } else {
        r.etapesFaites += s.faites; r.etapesTotal += s.total;
      }
    });
    return r;
  }

  /* ---------- En-tête commun ----------
     miettes : [{ texte, lien? }, …] après la marque du site. */
  function entete(miettes, droite) {
    var h = document.createElement("header");
    h.className = "entete";
    var a = document.createElement("a");
    a.href = url("index.html");
    a.className = "marque";
    a.textContent = (window.CATALOGUE && window.CATALOGUE.titre) || "Accueil";
    h.appendChild(a);
    (miettes || []).forEach(function (m) {
      var s = document.createElement("span"); s.className = "sep"; s.textContent = "/"; h.appendChild(s);
      var el = document.createElement(m.lien ? "a" : "span");
      if (m.lien) el.href = m.lien;
      el.textContent = m.texte;
      h.appendChild(el);
    });
    if (droite !== undefined && droite !== null) {
      var d = document.createElement("span"); d.className = "droite"; d.textContent = droite;
      h.appendChild(d);
    }
    document.body.insertBefore(h, document.body.firstChild);
    return h;
  }

  var NOMS_TYPES = { lecon: "Leçon", atelier: "Atelier", cartes: "Cartes", test: "Test" };

  function el(tag, classe, texte) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte !== undefined && texte !== null) e.textContent = texte;
    return e;
  }

  function barre(fraction) {
    var b = el("div", "barre");
    var s = el("span");
    s.style.width = Math.round(Math.max(0, Math.min(1, fraction)) * 100) + "%";
    b.appendChild(s);
    return b;
  }

  window.Site = {
    racine: racine,
    url: url,
    param: param,
    matieres: matieres,
    matiere: matiere,
    tousContenus: tousContenus,
    contenu: contenu,
    disponible: disponible,
    lienContenu: lienContenu,
    chargerScript: chargerScript,
    chargerPaquets: chargerPaquets,
    resumeContenu: resumeContenu,
    resumeMatiere: resumeMatiere,
    entete: entete,
    NOMS_TYPES: NOMS_TYPES,
    el: el,
    barre: barre
  };
})();
