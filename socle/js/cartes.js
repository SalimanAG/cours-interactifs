/* cartes.js — séance de révision en répétition espacée (boîtes de Leitner).
   Un paquet (fichier de données) appelle :
     Paquets.enregistrer({ matiere, id, titre, cartes: [{ id, q, r }, …] })
   q et r sont du HTML court (écrit par nous, jamais saisi par l'utilisateur).

   Règles : une carte nouvelle est en boîte 1. « Je savais » → boîte suivante
   (revue dans 1, 3, 7, 15 jours). « À revoir » → retour en boîte 1, et la carte
   revient à la fin de la séance en cours. */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  function demarrer(conteneur, matiere, paquet) {
    var mode = "normal"; // "normal" ou "entrainement" (tout le paquet, sans changer les boîtes)
    var file = [];
    var vues = 0;

    function cartesDues() {
      var etats = Progression.etatsCartes(matiere.id, paquet.id);
      var now = Date.now();
      var dues = paquet.cartes.filter(function (c) {
        var e = etats[c.id];
        return !e || e.du <= now;
      });
      // Les cartes des petites boîtes d'abord, puis les nouvelles.
      dues.sort(function (a, b) {
        var ea = etats[a.id], eb = etats[b.id];
        var ba = ea ? ea.boite : 0.5, bb = eb ? eb.boite : 0.5;
        return ba - bb;
      });
      return dues;
    }

    function boites() {
      var r = Progression.resumePaquet(matiere.id, paquet);
      var b = el("div", "boites");
      r.parBoite.forEach(function (n, i) {
        var d = el("div", "boite");
        d.appendChild(el("b", null, String(n)));
        d.appendChild(el("span", null, "boîte " + (i + 1)));
        d.title = i === 0 ? "revue à chaque séance" : "revue après " + Progression.INTERVALLES[i] + " j";
        b.appendChild(d);
      });
      var info = el("p", "discret petit",
        r.total + " cartes · " + r.nouvelles + " jamais vues · " + r.aRevoir + " à revoir maintenant");
      var w = el("div");
      w.appendChild(b);
      w.appendChild(info);
      return w;
    }

    function rendu() {
      conteneur.innerHTML = "";
      conteneur.appendChild(boites());
      if (!file.length) { finSeance(); return; }
      var carte = file[0];
      var c = el("div", "carte-rev");
      c.appendChild(el("div", "compte", (mode === "entrainement" ? "entraînement · " : "") + "reste " + file.length));
      var q = el("div", "face-q"); q.innerHTML = carte.q; c.appendChild(q);
      var actions = el("div", "actions rangee-btn");
      var voir = el("button", "btn btn-plein", "Voir la réponse");
      voir.type = "button";
      voir.onclick = function () {
        var r = el("div", "face-r"); r.innerHTML = carte.r;
        c.insertBefore(r, actions);
        actions.innerHTML = "";
        var oui = el("button", "btn btn-plein", "Je savais");
        var non = el("button", "btn", "À revoir");
        oui.type = non.type = "button";
        oui.onclick = function () { repondre(carte, true); };
        non.onclick = function () { repondre(carte, false); };
        actions.appendChild(oui); actions.appendChild(non);
        oui.focus();
      };
      actions.appendChild(voir);
      c.appendChild(actions);
      conteneur.appendChild(c);
    }

    function repondre(carte, ok) {
      file.shift();
      vues++;
      if (mode === "normal") {
        Progression.noterCarte(matiere.id, paquet.id, carte.id, ok);
        Progression.noterActivite({ matiere: matiere.id, id: paquet.id, type: "cartes" });
      }
      if (!ok) file.push(carte); // revient en fin de séance
      rendu();
    }

    function finSeance() {
      var f = el("div", "carte-rev");
      f.appendChild(el("div", "face-q", vues ? "Séance terminée." : "Rien à revoir pour l'instant."));
      var etats = Progression.etatsCartes(matiere.id, paquet.id);
      var prochaine = null;
      paquet.cartes.forEach(function (c) {
        var e = etats[c.id];
        if (e && e.du > Date.now() && (prochaine === null || e.du < prochaine)) prochaine = e.du;
      });
      if (prochaine) {
        f.appendChild(el("p", "discret", "Prochaine carte à revoir : " +
          new Date(prochaine).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) + "."));
      }
      var act = el("div", "actions rangee-btn");
      var entr = el("button", "btn", "S'entraîner sur tout le paquet");
      entr.type = "button";
      entr.title = "Sans modifier les boîtes";
      entr.onclick = function () { mode = "entrainement"; vues = 0; file = paquet.cartes.slice(); rendu(); };
      var raz = el("button", "btn btn-petit", "Réinitialiser le paquet");
      raz.type = "button";
      var confirme = false;
      raz.onclick = function () {
        if (!confirme) { confirme = true; raz.textContent = "Confirmer la réinitialisation"; return; }
        Progression.reinitialiserCartes(matiere.id, paquet.id);
        mode = "normal"; vues = 0; file = cartesDues(); rendu();
      };
      act.appendChild(entr); act.appendChild(raz);
      f.appendChild(act);
      conteneur.appendChild(f);
    }

    file = cartesDues();
    rendu();
  }

  window.Revision = { demarrer: demarrer };
})();
