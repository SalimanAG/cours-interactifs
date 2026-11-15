/* Atelier : le four des slides (p. 25), vérifier g ≡ AG(Start → AF Heat).
   Correction faite en cours le 20 octobre ; toutes les valeurs sont recalculées ici par l'algorithme. */
(function () {
  "use strict";
  var el = Site.el;
  var F = MC.FOUR;
  function sat(f) { return LT.satisfait(F.M, LT.lire(f)); }
  function horsDe(l) { return F.M.etats.filter(function (s) { return l.indexOf(s) < 0; }); }

  Lecon.demarrer({
    matiere: "model-checking",
    id: "four",
    etapes: [

      /* 1 */
      {
        titre: "Le modèle du four",
        texte:
          "<p>Quatre propositions atomiques : <b>Start</b> (phase de démarrage), <b>Close</b> (porte fermée), <b>Heat</b> (le four chauffe), " +
          "<b>Error</b> (erreur). L'état 1 est initial. Sur la slide, chaque flèche porte aussi une action " +
          "(start oven, open door, close door, reset, warmup, start cooking, cook, done) ; elle aide à lire le modèle, " +
          "mais ne compte pas pour la vérification.</p>" +
          "<p>Sous chaque état : les propositions vraies (les autres sont fausses).</p>",
        objectif: "Trouver S(Start).",
        installer: function (zone, api) {
          MC.marquer(zone, api, { sys: F, attendu: sat("Start"), nom: "S(Start)", indice: "Lis les étiquettes.",
            message: "Piège : l'état 3 n'a pas Start (après reset, la phase de démarrage est terminée)." });
        }
      },

      /* 2 */
      {
        titre: "Réécrire la formule",
        texte:
          "<p>g ≡ AG(Start → AF Heat) : « chaque fois que le four est en phase de démarrage, il finira par chauffer, quoi qu'il arrive ».</p>" +
          "<p>Règles : AG f ≡ ¬EF¬f ; ¬(a → b) ≡ a ∧ ¬b ; ¬AF h ≡ EG¬h ; EF f ≡ E(true U f).</p>",
        objectif: "Choisir la forme de base de g.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "g ≡ ?",
            options: ["¬E(true U (Start ∧ EG¬Heat))", "¬E(true U (Start ∧ ¬EG Heat))", "E(true U (Start ∧ EG¬Heat))", "¬E(Start U EG¬Heat)"],
            bonne: 0,
            expliquer: [
              "Exact : AG(…) ≡ ¬EF(Start ∧ ¬AF Heat) ≡ ¬EF(Start ∧ EG¬Heat) ≡ ¬E(true U (Start ∧ EG¬Heat)).",
              "¬AF Heat ≡ EG¬Heat (il existe un chemin où Heat n'arrive jamais), pas ¬EG Heat.",
              "Il manque la négation de tête venue de AG f ≡ ¬EF¬f.",
              "EF se traduit par E(true U …), pas par un U sur Start."
            ],
            surReussite: function () { api.valider("On étiquettera dans l'ordre : Start, Heat, ¬Heat, EG¬Heat, Start ∧ EG¬Heat, E(true U …), puis la négation."); }
          }));
        }
      },

      /* 3 */
      {
        titre: "EG¬Heat",
        texte:
          "<p>S(Heat) = {4, 7}, donc S(¬Heat) = {1, 2, 3, 5, 6}. Le graphe restreint à ¬Heat est affiché (4 et 7 estompés). " +
          "Cherche les SCC non triviales, puis remonte.</p>",
        objectif: "Trouver S(EG¬Heat).",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: F, attendu: sat("EG¬Heat"), nom: "S(EG¬Heat)", estompe: horsDe(sat("¬Heat")),
            indice: function (trop) {
              return trop.indexOf("6") >= 0 ? "Dans le graphe restreint, 6 n'a plus de successeur (6 → 7 a disparu) : SCC triviale, et 6 n'atteint aucune SCC." : "Cherche le cycle 1 → 2 → 5 → 3 → 1.";
            },
            message: "SCC non triviale {1, 2, 3, 5} grâce au cycle 1 → 2 → 5 → 3 → 1 ; 6, seul et sans boucle, est une SCC triviale."
          });
        }
      },

      /* 4 */
      {
        titre: "Start ∧ EG¬Heat, puis E(true U …)",
        texte:
          "<p>S(Start ∧ EG¬Heat) = {2, 5, 6, 7} ∩ {1, 2, 3, 5} = <b>{2, 5}</b> (remplis). " +
          "E(true U f) : les états depuis lesquels on peut atteindre S(f). Touche les états à ajouter en remontant les flèches.</p>",
        objectif: "Trouver S(E(true U (Start ∧ EG¬Heat))).",
        installer: function (zone, api) {
          var marque = sat("Start ∧ EG¬Heat").slice(), fini = false;
          var attendu = sat("E(true U (Start ∧ EG¬Heat))");
          var info = el("p", "legende-figure");
          var f = MC.figure(zone, F, {
            onEtat: function (id) {
              if (fini) return;
              if (marque.indexOf(id) >= 0) { api.retour(id + " est déjà étiqueté.", null); return; }
              var s2 = F.M.succ[id].filter(function (t) { return marque.indexOf(t) >= 0; });
              if (!s2.length) { api.retour(id + " n'a encore aucun successeur étiqueté.", false); return; }
              marque.push(id); marque = F.M.ordre(marque);
              api.retour(id + " → " + s2[0] + " : ajouté.", true);
              maj();
              if (marque.length === attendu.length) {
                fini = true;
                api.valider("Tous les états : de partout, on peut atteindre 2 ou 5.");
              }
            }
          });
          zone.appendChild(info);
          function maj() {
            f.maj({ plein: marque });
            info.innerHTML = "<span>étiquetés : <span class='mono'>" + MC.ens(marque) + "</span></span>";
          }
          maj();
        }
      },

      /* 5 */
      {
        titre: "Conclusion et contre-exemple",
        texte:
          "<p>S(g) = complémentaire de {1, …, 7} = <b>∅</b> : g n'est vraie dans aucun état, même pas dans l'état initial 1. " +
          "<b>La propriété est fausse.</b></p>" +
          "<p>Le model checker donne alors un contre-exemple : un chemin depuis 1 où Start devient vraie, puis Heat n'arrive jamais. " +
          "Construis-le (touche un état déjà dans le chemin pour fermer la boucle).</p>",
        objectif: "Construire un chemin depuis 1 qui satisfait F(Start ∧ G¬Heat).",
        installer: function (zone, api) {
          var temoin = LT.lire("F(Start ∧ G¬Heat)");
          MC.constructeurChemin(zone, {
            sys: F, depart: "1",
            surRefus: function (m) { api.retour(m, false); },
            surChange: function () { api.retour("", null); },
            surFerme: function (ch) {
              if (LT.surChemin(F.M, ch, temoin)[0]) {
                api.retour("Contre-exemple : Start est vraie, puis Heat ne l'est plus jamais.", true);
                api.valider("Celui du cours : 1 → 2 → 5 → 2 → 5 … : on ouvre et ferme la porte sans fin. Un seul chemin suffit à rendre AF Heat fausse. " +
                  "Ce chemin « irréaliste » motive les contraintes d'équité (chapitre suivant).");
              } else api.retour("Sur ce chemin, Heat finit par arriver après Start (ou Start n'arrive jamais). « Recommencer ».", false);
            }
          });
        }
      }
    ],
    fin: {
      texte:
        "<table class='tableau'><tr><th>Sous-formule</th><th>S(…)</th></tr>" +
        "<tr><td class='mono'>Start</td><td class='mono'>{2, 5, 6, 7}</td></tr>" +
        "<tr><td class='mono'>¬Heat</td><td class='mono'>{1, 2, 3, 5, 6}</td></tr>" +
        "<tr><td class='mono'>EG¬Heat</td><td class='mono'>{1, 2, 3, 5}</td></tr>" +
        "<tr><td class='mono'>Start ∧ EG¬Heat</td><td class='mono'>{2, 5}</td></tr>" +
        "<tr><td class='mono'>E(true U (Start ∧ EG¬Heat))</td><td class='mono'>{1, …, 7}</td></tr>" +
        "<tr><td class='mono'>g</td><td class='mono'>∅</td></tr></table>" +
        "<p>Méthode d'examen : réécrire, puis une ligne S(…) par sous-formule, des plus petites à g.</p>",
      cartes: "labelling"
    }
  });
})();
