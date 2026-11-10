/* billet-ui.js — morceaux d'interface partagés par les leçons et l'atelier
   « Billet endommagé » : entrée, recherche des cases forcées, panneau de trace. */
(function () {
  "use strict";
  var el = Site.el;
  var B = window.Billet;

  function entree(zone, pb, titre) {
    var d = el("div", "entree");
    d.appendChild(el("span", "titre-entree", titre || "Entrée (stdin)"));
    d.appendChild(document.createTextNode(B.texteEntree(pb)));
    zone.appendChild(d);
    return d;
  }

  function html(zone, contenu, classe) {
    var d = el("div", classe || "");
    d.innerHTML = contenu;
    zone.appendChild(d);
    return d;
  }

  function dessinerEtat(g, e, pb, o) {
    o = o || {};
    o.pb = pb;
    var v = B.vue(e, o);
    g.dessiner(v.valeurs, v.options);
  }

  /* Trouver à la main les cases que PROPAGER va poser.
     o : { e, pb, attendues: [{ i, j, v, sens, k }], valeur (0/1 imposé) ou null (bouton à choisir),
           retour(texte, ok), surFin(), etape: "ligne" | "colonne" | null (pour expliquer les cases hors étape),
           marques: [[i, j]] cases à entourer dès le départ (ex. la case du choix) } */
  function chercher(zone, o) {
    var e = o.e, pb = o.pb, mode = o.valeur === undefined ? null : o.valeur;
    var restants = o.attendues.slice();
    var marques = (o.marques || []).slice();
    if (mode === null) {
      var barre = el("div", "rangee-btn");
      barre.appendChild(el("span", "discret petit", "Valeur à poser :"));
      var b0 = el("button", "btn btn-petit", "0 (blanc)"), b1 = el("button", "btn btn-petit", "1 (trait)");
      [b0, b1].forEach(function (b, v) {
        b.type = "button";
        b.onclick = function () { mode = v; b0.classList.toggle("choisi", v === 0); b1.classList.toggle("choisi", v === 1); };
        barre.appendChild(b);
      });
      zone.appendChild(barre);
    }
    var g = new GrilleComptee(zone, { onCase: clic });
    function dessiner() { dessinerEtat(g, e, pb, { marques: marques }); }
    function raison(a) {
      return a.sens === "ligne" ?
        "ligne " + (a.k + 1) + " : " + (a.v === 0 ? "lm = 0" : "lm = lv") :
        "colonne " + (a.k + 1) + " : " + (a.v === 0 ? "cm = 0" : "cm = cv");
    }
    function clic(i, j) {
      if (!restants.length) return;
      if (e.g[i][j] !== null) { o.retour("Cette case est déjà décidée.", null); return; }
      var a = null;
      restants.forEach(function (x) { if (x.i === i && x.j === j) a = x; });
      if (!a) {
        var rl = B.regle(e.lm[i], e.lv[i]), rc = B.regle(e.cm[j], e.cv[j]);
        if ((rl === 0 || rl === 1 || rc === 0 || rc === 1) && o.etape) {
          o.retour("Cette case sera bien forcée, mais pas à ce moment : PROPAGER traite d'abord toutes les lignes, puis toutes les colonnes. Ici, on en est aux " + o.etape + "s.", false);
        } else {
          o.retour("Rien ne force la case " + B.lc(i, j) + " : ligne " + (i + 1) + " (lm = " + e.lm[i] + ", lv = " + e.lv[i] + "), colonne " + (j + 1) +
            " (cm = " + e.cm[j] + ", cv = " + e.cv[j] + "). Aucune règle ne s'applique.", false);
        }
        return;
      }
      if (mode === null) { o.retour("Choisis d'abord la valeur à poser (0 ou 1).", null); return; }
      if (mode !== a.v) { o.retour("Bonne case, mauvaise valeur : relis les compteurs de sa ligne et de sa colonne.", false); return; }
      B.poser(e, i, j, a.v);
      marques.push([i, j]);
      restants = restants.filter(function (x) { return x !== a; });
      dessiner();
      if (!restants.length) { g.verrouiller(true); if (o.surFin) o.surFin(); }
      else o.retour(B.lc(i, j) + " ← " + a.v + " (" + raison(a) + "). Encore " + restants.length + " case" + (restants.length > 1 ? "s" : "") + ".", true);
    }
    dessiner();
    return { grille: g, dessiner: dessiner };
  }

  /* Les poses que fera PROPAGER sur une copie de e, groupées par passe et par sens. */
  function posesPropagation(e) {
    var copie = B.cloner(e), poses = [], ok = B.propager(copie, null, function (x) { if (x.type === "pose") poses.push(x); });
    return { poses: poses, ok: ok };
  }

  /* Panneau de trace : grille + compteurs, message, pseudo-codes, contrôleur. */
  function panneau(zone, o) {
    o = o || {};
    var g = new GrilleComptee(zone, {});
    var msg = el("p", "retour");
    msg.setAttribute("aria-live", "polite");
    zone.appendChild(msg);
    var info = el("p", "legende-figure");
    zone.appendChild(info);
    var ctlZone = el("div");
    zone.appendChild(ctlZone);
    var codes = el("div");
    zone.appendChild(codes);
    var pr = new PseudoCode(codes, { titre: "RECURSIVE(k)", lignes: B.RECURSIVE });
    var pp = new PseudoCode(codes, { titre: "PROPAGER(pile)", lignes: B.PROPAGER });
    var etats = [], pb = null;
    var ctl = new Controleur(ctlZone, {
      delai: o.delai || 700,
      afficher: function (i) {
        var s = etats[i];
        dessinerEtat(g, s.e, pb, { cur: s.cur, ligneActive: s.ligneActive, colActive: s.colActive });
        msg.className = "retour" + (s.ko ? " ko" : s.sol || s.fin ? " ok" : "");
        msg.textContent = s.msg;
        info.innerHTML = "<span>nb_sol = <span class='mono'>" + s.nb + "</span></span>" +
          "<span>choix en cours : <span class='mono'>" + (s.choix.length ? s.choix.map(function (c) { return B.lc(c[0], c[1]) + "←" + c[2]; }).join(" · ") : "aucun") + "</span></span>";
        pr.surligner(s.ligne && s.ligne.algo === "R" ? s.ligne.n : null);
        pp.surligner(s.ligne && s.ligne.algo === "P" ? s.ligne.n : null);
      },
      surFin: function () { if (o.surFin) o.surFin(); }
    });
    return {
      charger: function (probleme, opts) {
        pb = probleme;
        var t = B.trace(pb, opts || {});
        etats = t.etats;
        ctl.charger(etats.length);
        if (opts && opts.lecture) ctl.lecture();
        return t;
      },
      stop: function () { ctl.stop(); }
    };
  }

  window.BilletUI = { entree: entree, html: html, dessinerEtat: dessinerEtat, chercher: chercher, posesPropagation: posesPropagation, panneau: panneau };
})();
