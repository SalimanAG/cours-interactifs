/* lecon.js — lecteur de leçon (et d'atelier) en étapes.
   Principe : une idée par écran, une action à faire, un objectif à atteindre
   avant de débloquer « Continuer ». La progression est enregistrée à chaque
   étape réussie (Progression.marquerEtape).

   Utilisation dans une page de leçon :
     Lecon.demarrer({
       matiere: "advanced-algorithms",
       id: "coupe-min-contraction",          // doit exister dans catalogue.js
       etapes: [
         {
           titre: "…",
           texte: "<p>…</p>",                // HTML
           objectif: "Trouver une coupe …",  // phrase affichée dans l'encadré
           installer: function (zone, api) {  // construit l'interaction
             …  api.valider("message");       // objectif atteint
             …  api.retour("texte", true|false|null);
             return function () { … };        // (optionnel) nettoyage
           }
         }, …
       ],
       fin: { texte: "<p>…</p>", cartes: "coupe-min" }   // écran final
     });
*/
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  function demarrer(cfg) {
    var info = Site.contenu(cfg.matiere, cfg.id);
    var mat = info ? info.matiere : { id: cfg.matiere, titre: cfg.matiere };
    var titre = info ? info.contenu.titre : cfg.id;
    var total = cfg.etapes.length;
    if (info && info.contenu.etapes !== total && window.console) {
      console.warn("catalogue.js annonce " + info.contenu.etapes + " étapes, la leçon en a " + total + ".");
    }
    document.title = titre + " · " + ((window.CATALOGUE && CATALOGUE.titre) || "");

    var lienMatiere = Site.url("matiere.html?m=" + encodeURIComponent(mat.id));
    var enteteEl = Site.entete([{ texte: mat.titre, lien: lienMatiere }, { texte: (info && Site.NOMS_TYPES[info.contenu.type]) || "Leçon" }], "");
    var compteur = enteteEl.querySelector(".droite");

    var page = document.getElementById("lecon") || document.body.appendChild(el("main", "page"));
    page.innerHTML = "";
    var h1 = el("h1", null, titre);
    h1.style.marginTop = "1rem";
    page.appendChild(h1);
    var rail = el("nav", "rail");
    rail.setAttribute("aria-label", "Étapes");
    page.appendChild(rail);
    var scene = el("div");
    page.appendChild(scene);

    var nettoyage = null;
    var courante = 0;

    function etat() { return Progression.lecon(mat.id, cfg.id); }
    function estFaite(i) { return etat().faites.indexOf(i) >= 0; }
    function accessible(i) { return i === 0 || estFaite(i - 1) || estFaite(i); }

    function dessinerRail() {
      rail.innerHTML = "";
      for (var i = 0; i < total; i++) {
        (function (i) {
          var b = el("button");
          b.type = "button";
          b.title = (i + 1) + ". " + cfg.etapes[i].titre;
          b.setAttribute("aria-label", b.title);
          if (estFaite(i)) b.classList.add("faite");
          if (i === courante) { b.classList.add("courante"); b.setAttribute("aria-current", "step"); }
          b.disabled = !accessible(i);
          b.onclick = function () { aller(i); };
          rail.appendChild(b);
        })(i);
      }
      compteur.textContent = (courante < total ? (courante + 1) : total) + " / " + total;
    }

    function aller(i) {
      if (nettoyage) { try { nettoyage(); } catch (e) { /* rien */ } nettoyage = null; }
      courante = i;
      Progression.definirCourante(mat.id, cfg.id, i);
      Progression.noterActivite({ matiere: mat.id, id: cfg.id, type: "lecon" });
      if (i >= total) { finale(); dessinerRail(); return; }
      afficherEtape(i);
      dessinerRail();
      window.scrollTo(0, 0);
    }

    function afficherEtape(i) {
      var e = cfg.etapes[i];
      scene.innerHTML = "";
      var art = el("article", "etape");
      art.appendChild(el("span", "num", "Étape " + (i + 1) + " sur " + total));
      art.appendChild(el("h2", null, e.titre));
      var texte = el("div", "texte");
      texte.innerHTML = e.texte || "";
      art.appendChild(texte);

      var zone = el("div", "zone");
      art.appendChild(zone);

      var obj = el("div", "objectif");
      var puce = el("span", "puce", "○");
      var corps = el("div");
      corps.appendChild(el("span", null, "Objectif : " + (e.objectif || "lire puis continuer.")));
      var statut = el("span", "statut");
      corps.appendChild(statut);
      obj.appendChild(puce); obj.appendChild(corps);
      art.appendChild(obj);

      var retourEl = el("div", "retour");
      retourEl.setAttribute("aria-live", "polite");
      art.appendChild(retourEl);

      var nav = el("div", "nav-etape");
      var prec = el("button", "btn", "← Précédent");
      prec.type = "button";
      prec.disabled = i === 0;
      prec.onclick = function () { aller(i - 1); };
      var suiv = el("button", "btn btn-plein", i === total - 1 ? "Terminer →" : "Continuer →");
      suiv.type = "button";
      suiv.onclick = function () { aller(i + 1); };
      nav.appendChild(prec); nav.appendChild(suiv);
      art.appendChild(nav);
      scene.appendChild(art);

      var atteint = false;
      function marquerAtteint(message) {
        atteint = true;
        obj.classList.add("atteint");
        puce.textContent = "✓";
        statut.textContent = message || "Objectif atteint.";
        suiv.disabled = false;
      }
      if (estFaite(i)) {
        marquerAtteint("Déjà atteint lors d'un passage précédent — tu peux refaire l'exercice.");
      } else {
        suiv.disabled = true;
      }

      var api = {
        dejaFaite: estFaite(i),
        valider: function (message) {
          if (!estFaite(i)) {
            Progression.marquerEtape(mat.id, cfg.id, i);
            dessinerRail();
          }
          marquerAtteint(message);
        },
        retour: function (texte, ok) {
          retourEl.className = "retour" + (ok === true ? " ok" : ok === false ? " ko" : "");
          retourEl.innerHTML = texte || "";
        },
        estAtteint: function () { return atteint; }
      };
      if (typeof e.installer === "function") {
        var r = e.installer(zone, api);
        if (typeof r === "function") nettoyage = r;
      }
    }

    function finale() {
      scene.innerHTML = "";
      var art = el("article", "etape fin-lecon");
      art.appendChild(el("span", "num", "Fin"));
      art.appendChild(el("h2", null, "Leçon terminée"));
      var faites = etat().faites.filter(function (i) { return i < total; }).length;
      art.appendChild(el("p", "discret", faites + " étape" + (faites > 1 ? "s" : "") + " réussie" + (faites > 1 ? "s" : "") + " sur " + total + "."));
      var t = el("div");
      t.innerHTML = (cfg.fin && cfg.fin.texte) || "";
      art.appendChild(t);
      var actions = el("div", "rangee-btn");
      if (cfg.fin && cfg.fin.cartes) {
        var a = el("a", "btn btn-plein", "Réviser les cartes →");
        a.href = Site.url("revision.html?m=" + encodeURIComponent(mat.id) + "&p=" + encodeURIComponent(cfg.fin.cartes));
        actions.appendChild(a);
      }
      var r = el("a", "btn", "Retour à " + mat.titre);
      r.href = lienMatiere;
      actions.appendChild(r);
      var raz = el("button", "btn btn-petit", "Recommencer de zéro");
      raz.type = "button";
      var confirme = false;
      raz.onclick = function () {
        if (!confirme) { confirme = true; raz.textContent = "Confirmer : effacer la progression de cette leçon"; return; }
        Progression.reinitialiserLecon(mat.id, cfg.id);
        aller(0);
      };
      actions.appendChild(raz);
      art.appendChild(actions);
      scene.appendChild(art);
      window.scrollTo(0, 0);
    }

    // Reprise : on revient à l'étape où on s'était arrêté (si elle est accessible).
    var depart = etat().courante || 0;
    if (depart > total) depart = total;
    while (depart > 0 && depart < total && !accessible(depart)) depart--;
    aller(depart);
  }

  window.Lecon = { demarrer: demarrer };
})();
