/* Atelier : Trace pas à pas — Billet endommagé (examen final, BACKTRACK).
   L'algorithme de ta solution exécuté état par état : grille et compteurs,
   ligne du pseudo-code des slides, choix en cours, nb_sol. */
(function () {
  "use strict";
  var el = Site.el;
  var B = Billet, U = BilletUI;

  function bouton(parent, texte, action, plein) {
    var b = el("button", "btn btn-petit" + (plein ? " btn-plein" : ""), texte);
    b.type = "button";
    b.onclick = action;
    parent.appendChild(b);
    return b;
  }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Dérouler un exemple",
      texte:
        "<p>Choisis un exemple et avance avec ▶. À chaque état : la grille (1 = trait, 0 = blanc, pointillés = vide) et ses compteurs, " +
        "la ligne du pseudo-code exécutée, les choix en cours et nb_sol. La case ou la ligne concernée est entourée.</p>",
      objectif: "Aller jusqu'au dernier état d'un exemple.",
      installer: function (zone, api) {
        var exemples = [["Exemple 1 (énoncé)", B.EX1], ["Exemple 2 (énoncé)", B.EX2], ["Indications (2 × 4)", B.EX_IND]];
        var barre = el("div", "rangee-btn");
        zone.appendChild(barre);
        var ent = el("div");
        zone.appendChild(ent);
        var corps = el("div");
        zone.appendChild(corps);
        var p = U.panneau(corps, {
          delai: 650,
          surFin: function () { api.valider("Tu as vu une exécution complète. Essaie les deux autres exemples : l'exemple 2 est le seul qui fait des choix."); }
        });
        var boutons = exemples.map(function (x, k) {
          return bouton(barre, x[0], function () { charger(k); });
        });
        function charger(k) {
          boutons.forEach(function (b, i) { b.classList.toggle("choisi", i === k); });
          ent.innerHTML = "";
          U.entree(ent, exemples[k][1]);
          p.charger(exemples[k][1]);
        }
        charger(1);
        return function () { p.stop(); };
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Prédire la sortie",
      texte:
        "<p>Une grille tirée au hasard. Fais tourner l'algorithme à la main (PROPAGER, puis les choix), comme au tableau, et écris la sortie du programme. " +
        "Ensuite, vérifie avec la trace.</p>",
      objectif: "Prédire correctement la sortie d'au moins une grille.",
      installer: function (zone, api) {
        var types = ["plusieurs", "unique", "aucune"];
        var n = 0, reussis = 0, panneau = null;
        var barre = el("div", "rangee-btn");
        zone.appendChild(barre);
        bouton(barre, "Nouvelle grille", lancer);
        var corps = el("div");
        zone.appendChild(corps);
        function lancer() {
          if (panneau) panneau.stop();
          panneau = null;
          corps.innerHTML = "";
          api.retour("", null);
          var pb = B.aleatoire(3, 3 + (n % 2), types[n % 3]);
          n++;
          U.entree(corps, pb);
          var r = B.resoudre(pb);
          var zt = el("div");
          function trace() {
            if (panneau) return;
            corps.appendChild(zt);
            zt.appendChild(el("h3", null, "La trace"));
            panneau = U.panneau(zt, { delai: 600 });
            panneau.charger(pb);
          }
          Exercices.texte(corps, {
            label: "Sortie (stdout) :", lignes: pb.L, mode: "juge",
            attendu: B.sortie(pb),
            indice: "Une grille de « - » et « * » si la solution est unique, sinon une seule ligne NON. Utilise « Voir la trace » si tu bloques.",
            surReussite: function () {
              reussis++;
              api.retour("Juste : nb_sol = " + r.nb + (r.nb === 1 ? "." : r.nb === 0 ? ", aucune solution." : ", plusieurs solutions.") + " Vérifie le déroulé avec la trace.", true);
              trace();
              api.valider(reussis > 1 ? reussis + " grilles réussies." : "Réussi. Tire une nouvelle grille pour t'entraîner encore (les types alternent : plusieurs, unique, aucune solution).");
            }
          });
          var aide = el("div", "rangee-btn");
          corps.appendChild(aide);
          bouton(aide, "Voir la trace", trace);
        }
        lancer();
        return function () { if (panneau) panneau.stop(); };
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Ta propre grille",
      texte:
        "<p>Tape une entrée au format de l'énoncé (L et C jusqu'à 6 ici) : par exemple un cas qu'on pourrait te demander à l'oral, ou un cas limite (grille déjà complète, trop de traits, 1 × 1…).</p>",
      objectif: "Lancer la trace d'une entrée de ton choix jusqu'au bout.",
      installer: function (zone, api) {
        var t = el("textarea");
        t.rows = 7; t.spellcheck = false; t.autocomplete = "off";
        t.style.width = "100%"; t.style.fontFamily = "var(--mono)";
        t.setAttribute("aria-label", "Entrée");
        t.value = "3 3\n-**\n***\n**-\n2 1 2\n2 1 2";
        zone.appendChild(t);
        var barre = el("div", "rangee-btn");
        zone.appendChild(barre);
        var sortie = el("div");
        var corps = el("div");
        zone.appendChild(sortie);
        zone.appendChild(corps);
        var p = null;
        bouton(barre, "Lancer la trace", function () {
          var r = B.lireEntree(t.value);
          if (r.erreur) { api.retour(r.erreur, false); return; }
          api.retour("", null);
          sortie.innerHTML = "";
          PC.sortie(sortie, B.sortie(r.pb));
          if (!p) p = U.panneau(corps, { delai: 550, surFin: function () { api.valider("Trace complète. Change l'entrée pour tester d'autres cas."); } });
          var tr = p.charger(r.pb);
          if (tr.coupe) api.retour("Trace limitée aux " + tr.etats.length + " premiers états (la sortie affichée, elle, est complète).", null);
        }, true);
        return function () { if (p) p.stop(); };
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "trace-billet",
    etapes: etapes,
    fin: {
      cartes: "oral-billet",
      texte: "<p>Tu sais dérouler l'algorithme sur n'importe quelle petite grille. Dernière révision avant l'oral : les cartes de questions.</p>"
    }
  });
})();
