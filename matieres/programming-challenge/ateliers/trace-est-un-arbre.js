/* Atelier : Trace au tableau — Is it a tree.
   Prépare la partie « Trace (5 min) » du midterm oral : une entrée jamais vue,
   à exécuter à la main (ordre de défilement, compte, sortie), puis vérification
   avec la trace pas à pas. Les entrées sont tirées au hasard à chaque essai. */
(function () {
  "use strict";
  var el = Site.el;

  function entree(zone, g) {
    var d = el("div", "entree");
    d.appendChild(el("span", "titre-entree", "Entrée (stdin)"));
    d.appendChild(document.createTextNode(EstArbre.texteEntree(g)));
    zone.appendChild(d);
  }
  function variantes(liste) {
    return [liste.join(" "), liste.join(", "), liste.join(","), liste.join(" → "), liste.join("→")];
  }

  /* Une étape d'atelier. cfg : { type, demanderOrdre, demanderCompte, choixLigne } */
  function etape(cfg) {
    return function (zone, api) {
      var corps = el("div");
      var barre = el("div", "rangee-btn");
      var nouveau = el("button", "btn btn-petit", "Nouvelle entrée");
      nouveau.type = "button";
      barre.appendChild(nouveau);
      zone.appendChild(barre);
      zone.appendChild(corps);
      var panneau = null;
      var reussis = 0;

      function lancer() {
        if (panneau) panneau.stop();
        panneau = null;
        corps.innerHTML = "";
        api.retour("", null);
        var g = EstArbre.aleatoire(cfg.type);
        var d = EstArbre.decider(g);
        var traceForcee = EstArbre.executer(g, { forcer: true });
        var fin = traceForcee[traceForcee.length - 1];
        entree(corps, g);
        var zq = el("div");
        corps.appendChild(zq);
        var zt = el("div");
        corps.appendChild(zt);

        function montrerTrace(forcer) {
          if (!panneau) {
            zt.appendChild(el("h3", null, "Vérifie avec la trace"));
            panneau = TraceArbre.panneau(zt, { delai: 600 });
          }
          panneau.charger(g, { forcer: !!forcer, lecture: true });
        }
        function gagne(message) {
          reussis++;
          api.retour(message, true);
          api.valider(reussis > 1 ? reussis + " entrées réussies. Continue tant que tu hésites, ou passe à la suite." :
            "Réussi. Tire une nouvelle entrée pour t'entraîner encore, ou passe à la suite.");
        }

        var questions = [];
        if (cfg.choixLigne) {
          questions.push(function (suite) {
            var opts = ["YES", "NO — dès la ligne 1 : M ≠ N − 1", "NO — après le BFS : compte < N"];
            var b = d.reponse === "YES" ? 0 : d.raison === "m" ? 1 : 2;
            Exercices.choix(zq, {
              question: "Que répond l'algorithme, et où conclut-il ?",
              options: opts, bonne: b,
              expliquer: opts.map(function (o, i) {
                return i === b ? "Exact : N = " + g.n + ", M = " + g.aretes.length + ", N − 1 = " + (g.n - 1) + "." :
                  "Non. Compare d'abord M et N − 1.";
              }),
              surReussite: suite
            });
          });
        }
        if (cfg.demanderOrdre) {
          questions.push(function (suite) {
            zq.appendChild(el("p", null, "Fais le BFS depuis 1 (voisins dans l'ordre de lecture des arêtes). Dans quel ordre les sommets sont-ils défilés ?"));
            Exercices.texte(zq, {
              label: "Défilés :", placeholder: "ex. 1 4 2",
              attendu: variantes(fin.ordre), mode: "souple", verdict: false,
              indice: "Ce n'est pas l'ordre du BFS. Construis Adj sur ton brouillon (chaque arête dans les deux listes, dans l'ordre de lecture), puis simule la file.",
              bravo: "Bon ordre : " + fin.ordre.join(", ") + ".",
              surReussite: suite
            });
          });
        }
        if (cfg.demanderCompte) {
          questions.push(function (suite) {
            Exercices.nombre(zq, {
              label: "compte à la fin =", attendu: fin.compte, tolerance: 0, placeholder: "ex. 5",
              indice: "compte = nombre de sommets marqués vu, c'est-à-dire atteints depuis 1.",
              bravo: "Exact : compte = " + fin.compte + (fin.compte === g.n ? " = N." : " < N = " + g.n + "."),
              surReussite: suite
            });
          });
        }
        if (!cfg.choixLigne) {
          questions.push(function (suite) {
            Exercices.choix(zq, {
              question: "Sortie du programme :",
              options: ["YES", "NO"], bonne: d.reponse === "YES" ? 0 : 1,
              expliquer: [
                d.reponse === "YES" ? "Exact : M = N − 1 et compte = N." : "Non : regarde compte et N, et M et N − 1.",
                d.reponse === "NO" ? "Exact : " + (d.raison === "m" ? "M ≠ N − 1." : "compte = " + d.compte + " < N = " + g.n + ", le graphe n'est pas connexe.") : "Non : M = N − 1 et tous les sommets sont atteints."
              ],
              surReussite: suite
            });
          });
        }
        var i = 0;
        function suivante() {
          if (i < questions.length) { questions[i++](suivante); return; }
          montrerTrace(cfg.forcerTrace);
          if (cfg.apres) cfg.apres(zt, g, d, montrerTrace);
          gagne(cfg.message ? cfg.message(g, d) : "Sortie : " + d.reponse + ".");
        }
        suivante();
      }
      nouveau.onclick = lancer;
      lancer();
      return function () { if (panneau) panneau.stop(); };
    };
  }

  var etapes = [
    {
      titre: "Un arbre",
      texte: "<p>Comme à l'oral : tu reçois une entrée, tu exécutes l'algorithme au tableau. Prépare sur papier Adj, la file F, vu[] et compte, " +
        "puis donne l'ordre de défilement et la sortie. L'entrée change à chaque « Nouvelle entrée ».</p>",
      objectif: "Réussir la trace d'une entrée (ordre de défilement, puis sortie).",
      installer: etape({ type: "arbre", demanderOrdre: true })
    },
    {
      titre: "M = N − 1, et pourtant…",
      texte: "<p>Cette fois, M = N − 1 mais le graphe cache un cycle : une partie des sommets ne sera jamais atteinte depuis 1. " +
        "C'est le cas 4 du cours, en version inédite.</p>",
      objectif: "Réussir une entrée : ordre de défilement, compte, puis sortie.",
      installer: etape({ type: "non-connexe", demanderOrdre: true, demanderCompte: true })
    },
    {
      titre: "Le raccourci de la ligne 1",
      texte: "<p>Ici, le nombre d'arêtes trahit tout de suite la réponse. Repère-le avant de te lancer dans un parcours. " +
        "(Si l'examinateur te demande quand même le BFS, le bouton sous la trace le fait.)</p>",
      objectif: "Décider une entrée en citant la ligne où l'algorithme conclut.",
      installer: etape({
        type: "m-faux", choixLigne: true,
        apres: function (zt, g, d, montrer) {
          var b = el("button", "btn btn-petit", "Faire quand même le BFS");
          b.type = "button";
          b.onclick = function () { montrer(true); };
          zt.appendChild(b);
        },
        message: function (g) { return "NO dès la ligne 1 : M = " + g.aretes.length + " ≠ N − 1 = " + (g.n - 1) + ". Aucun parcours nécessaire."; }
      })
    },
    {
      titre: "Entrées pièges",
      texte: "<p>Une arête répétée ou une boucle (u = v) : l'énoncé ne les interdit pas. M = N − 1, donc la ligne 1 laisse passer. " +
        "Le BFS, lui, ne s'y trompe pas. Une boucle est notée ↻ sur la figure, une arête répétée est dessinée deux fois.</p>",
      objectif: "Réussir une entrée piège : ordre de défilement, compte, sortie.",
      installer: etape({ type: "piege", demanderOrdre: true, demanderCompte: true })
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "trace-est-un-arbre",
    etapes: etapes,
    fin: {
      cartes: "oral-est-un-arbre",
      texte: "<p>Pour la partie « Trace » de l'oral : écris Adj d'abord, puis fais évoluer la file F et vu[] ligne par ligne, et annonce compte et la sortie. " +
        "Dis à voix haute la ligne du pseudo-code que tu exécutes : c'est ce que l'examinateur veut entendre.</p>"
    }
  });
})();
