/* Atelier : List Scheduling vs Longest Processing sur les listes du TD2 (exercice 1). */
(function () {
  "use strict";
  var el = Site.el;
  var LISTES = {
    L1: { t: [5, 9, 4, 12, 4, 7, 5], m: 3 },
    L2: { t: [4, 4, 5, 5, 7, 9, 12], m: 3 },
    L3: { t: [3, 5, 2, 4], m: 2 },
    L4: { t: [1, 7, 8, 7, 2, 8], m: 3 }
  };

  /* Exécution guidée : l'étudiant affecte chaque tâche ; si regle, seulement à une machine la moins chargée. */
  function execution(zone, liste, m, regle, retour, surFin, echelle) {
    var aff = Machines.vide(m), k = 0;
    var vue = new Machines(zone, { onMachine: function (i) {
      if (k >= liste.length) return;
      var mins = Machines.moinsChargees(aff);
      if (regle && mins.indexOf(i) < 0) {
        retour("Non : la moins chargée est M" + (mins[0] + 1) + " (charge " + Machines.charges(aff)[mins[0]] + ").", false);
        return;
      }
      aff[i].push(liste[k]); k++; retour("", null);
      dessiner();
      if (k === liste.length) surFin(aff);
    } });
    function dessiner() { vue.dessiner(aff, { echelle: echelle, attente: liste.slice(k) }); }
    dessiner();
    return { recommencer: function () { aff = Machines.vide(m); k = 0; dessiner(); } };
  }

  var etapes = [
    {
      titre: "Appliquer List Scheduling (TD2, question a)",
      texte: "<p>Applique l'algo List Scheduling aux quatre listes du TD2. Choisis une liste, puis affecte chaque tâche à une machine la moins chargée.</p>",
      objectif: "Exécuter List Scheduling sur L1, L2, L3 et L4.",
      installer: function (zone, api) {
        var faites = {};
        var choix = el("div", "rangee-btn"); zone.appendChild(choix);
        var info = el("p", "discret petit"); zone.appendChild(info);
        var scene = el("div"); zone.appendChild(scene);
        var resultats = el("div", "historique"); zone.appendChild(resultats);
        function lancer(nom) {
          scene.innerHTML = "";
          var L = LISTES[nom];
          info.textContent = nom + " = (" + L.t.join(", ") + ") et " + L.m + " machines.";
          execution(scene, L.t, L.m, true, api.retour, function (aff) {
            var ms = Machines.makespan(aff);
            faites[nom] = ms;
            api.retour(nom + " : makespan " + ms + " — " + aff.map(function (l, i) { return "M" + (i + 1) + "(" + Machines.charges(aff)[i] + ") : [" + l.join(", ") + "]"; }).join(", "), true);
            resultats.textContent = "Terminées : " + Object.keys(faites).sort().map(function (k) { return k + " → " + faites[k]; }).join(" · ");
            if (Object.keys(faites).length === 4) api.valider("Makespans : L1 → 16, L2 → 21, L3 → 9, L4 → 16. En cas d'égalité de charges, ton affectation peut différer de la correction, mais pas le makespan ici.");
          }, 24);
        }
        Object.keys(LISTES).forEach(function (nom) {
          var b = el("button", "btn btn-petit", nom); b.type = "button";
          b.onclick = function () { lancer(nom); };
          choix.appendChild(b);
        });
        lancer("L1");
      }
    },

    {
      titre: "Optimale ou pas ? (question b)",
      texte: "<p>Pour chaque solution obtenue, est-elle optimale ? Rappel des bornes : L* ≥ max tᵢ, L* ≥ Σtᵢ/m — et parfois un argument plus fin.</p>",
      objectif: "Dire, pour chaque liste, si la solution de List Scheduling est optimale.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "L1 (makespan 16) est optimale.", vrai: true, explication: "Moyenne 46/3 > 15 : aucun makespan ne peut être inférieur à 16." },
            { texte: "L2 (makespan 21) est optimale.", vrai: false, explication: "Mêmes durées que L1, même m : on sait faire 16. Ratio 21/16." },
            { texte: "L3 (makespan 9) est optimale.", vrai: false, explication: "M1(7) : [4, 3], M2(7) : [5, 2] atteint la moyenne 7. Ratio 9/7." },
            { texte: "L4 (makespan 16) est optimale.", vrai: false, explication: "Longest Processing donne 14 ; et 14 est optimal : 4 tâches de durée ≥ 7 sur 3 machines, l'une en reçoit deux (principe des tiroirs). Ratio 16/14." }
          ],
          surReussite: function () { api.valider("Pour L4, la borne de la moyenne (11) ne suffit pas : il faut l'argument des tiroirs pour prouver 14."); }
        });
      }
    },

    {
      titre: "La pire et la meilleure liste (questions c et d)",
      texte: "<p>Π₁ : durées {5, 9, 4, 12, 4, 7, 5}, 3 machines. Compose une liste en touchant les durées dans l'ordre voulu : List Scheduling s'exécute dès que la liste est complète " +
        "(en cas d'égalité, la machine de plus petit indice).</p>" +
        "<div class='encadre'><span class='titre-encadre'>Borne de la correction</span>Si t est la durée de la dernière tâche reçue par la machine la plus chargée et S la somme des durées, " +
        "le makespan vérifie M ≤ f(t) = t + (S − t)/m, croissante en t. Ici f(12) = 23 + 1/3 : le pire possible est 22 ou 23, et la correction montre que 23 est impossible.</div>",
      objectif: "Trouver une liste qui donne 16 (le meilleur) et une qui donne 22 (le pire).",
      installer: function (zone, api) {
        var T = [5, 9, 4, 12, 4, 7, 5], m = 3;
        var liste = [], utilises = {};
        var vus = {};
        var seq = el("div", "jetons sequence"); var reserve = el("div", "jetons");
        zone.appendChild(seq); zone.appendChild(reserve);
        var raz = el("button", "btn btn-petit", "Effacer la liste"); raz.type = "button"; zone.appendChild(raz);
        var scene = el("div"); zone.appendChild(scene);
        var vue = new Machines(scene, {});
        var trouves = el("p", "historique"); zone.appendChild(trouves);
        var boutons = T.map(function (d, i) {
          var b = el("button", "jeton", String(d)); b.type = "button";
          b.onclick = function () { b.disabled = true; liste.push(d); maj(); };
          reserve.appendChild(b); return b;
        });
        raz.onclick = function () { liste = []; boutons.forEach(function (b) { b.disabled = false; }); maj(); };
        function maj() {
          seq.innerHTML = liste.length ? liste.map(function (d) { return "<span class='jeton'>" + d + "</span>"; }).join("") : "<span class='tres-discret petit'>liste vide</span>";
          if (liste.length === T.length) {
            var r = Machines.listScheduling(liste, m), ms = Machines.makespan(r.aff);
            vue.dessiner(r.aff, { echelle: 24 });
            vus[ms] = "(" + liste.join(", ") + ")";
            trouves.textContent = "Makespans obtenus : " + Object.keys(vus).sort(function (a, b) { return a - b; }).map(function (k) { return k + " avec " + vus[k]; }).join(" · ");
            api.retour("Liste (" + liste.join(", ") + ") : makespan " + ms + ".", ms === 16 || ms === 22 ? true : null);
            if (vus[16] && vus[22]) api.valider("16 = optimum (atteint par la liste triée par durées décroissantes, par exemple) ; 22 = pire cas, avec le 12 en dernier sur une machine déjà chargée à 10.");
          } else vue.dessiner(Machines.vide(m), { echelle: 24 });
        }
        maj();
      }
    },

    {
      titre: "LPT n'est pas toujours optimal (question f)",
      texte: "<p>Π : durées {6, 5, 4, 4, 3} et 2 machines. Longest Processing (liste décroissante) donne :</p>",
      objectif: "Trouver à la main une affectation de makespan 11.",
      installer: function (zone, api) {
        var T = [6, 5, 4, 4, 3];
        var v = new Machines(zone, {});
        v.dessiner(Machines.lpt(T, 2).aff, { echelle: 14 });
        zone.appendChild(el("p", "discret petit", "Makespan 12. À toi : affecte les tâches pour faire mieux (touche une machine)."));
        var ex = execution(zone, T, 2, false, api.retour, function (aff) {
          var ms = Machines.makespan(aff);
          if (ms === 11) {
            api.retour("Makespan 11 : M(11) = [6, 5] et M(11) = [4, 4, 3].", true);
            api.valider("LPT met un 4 avec le 5 (9), l'autre 4 avec le 6 (10), puis le 3 sur la machine à 9 : 12. Il ne peut pas « voir » que {6, 5} et {4, 4, 3} s'équilibrent parfaitement.");
          } else api.retour("Makespan " + ms + ". Recommence (bouton ci-dessous).", false);
        }, 14);
        var b = el("button", "btn btn-petit", "Recommencer"); b.type = "button";
        b.onclick = function () { ex.recommencer(); api.retour("", null); };
        zone.appendChild(b);
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "ls-lpt",
    etapes: etapes,
    fin: {
      cartes: "approximation",
      texte: "<p>Questions a à f de l'exercice 1 du TD2 (le plus important du TD selon l'énoncé). L'exercice 2 (il existe toujours une liste optimale, via le profil lexicographique) est résumé dans les cartes « Approximation ».</p>"
    }
  });
})();
