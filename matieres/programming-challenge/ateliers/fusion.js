/* Atelier : la fusion pas à pas, avec le compteur (cours 4 Sort ; exo4_2, exo3_2).
   Tableaux tirés au hasard à chaque essai. */
(function () {
  "use strict";
  var el = Site.el;

  function triee(n, max) { var t = []; for (var i = 0; i < n; i++) t.push(PC.entier(1, max)); return t.sort(function (a, b) { return a - b; }); }
  function distincts(n, max) {
    var vus = {}, t = [];
    while (t.length < n) { var x = PC.entier(1, max); if (!vus[x]) { vus[x] = true; t.push(x); } }
    return t;
  }

  /* Une étape qui relance un exercice à la demande. */
  function relancable(zone, api, lancer, message) {
    var barre = el("div", "rangee-btn");
    var b = el("button", "btn btn-petit", "Nouveau tableau"); b.type = "button";
    barre.appendChild(b);
    zone.appendChild(barre);
    var scene = el("div"); zone.appendChild(scene);
    var reussis = 0;
    function go() {
      scene.innerHTML = ""; api.retour("", null);
      lancer(scene, function (txt) {
        reussis++;
        api.retour(txt, true);
        api.valider(message + (reussis > 1 ? " (" + reussis + " réussis)" : ""));
      });
    }
    b.onclick = go;
    go();
  }

  var etapes = [
    {
      titre: "Fusionner",
      texte: "<p>Deux tableaux triés au hasard. Touche à chaque fois la tête à prendre (la plus petite ; G d'abord à égalité).</p>",
      objectif: "Réussir une fusion.",
      installer: function (zone, api) {
        relancable(zone, api, function (scene, ok) {
          var G = triee(PC.entier(3, 4), 30), D = triee(PC.entier(3, 4), 30);
          Fusion.widget(scene, G, D, { mode: "simple", surFin: function (r) { ok("Résultat : " + r.join(" ")); } });
        }, "Fusion réussie. Tire un nouveau tableau pour t'entraîner, ou passe à la suite.");
      }
    },
    {
      titre: "Fusionner en comptant les inversions",
      texte: "<p>Chaque fois que tu prends dans D, indique devant combien d'éléments de G il passe (ceux qui ne sont pas encore placés).</p>",
      objectif: "Réussir une fusion avec le compteur.",
      installer: function (zone, api) {
        relancable(zone, api, function (scene, ok) {
          var G = triee(PC.entier(3, 4), 30), D = triee(PC.entier(3, 4), 30);
          Fusion.widget(scene, G, D, { mode: "inversions", surFin: function (r, c) { ok("Inversions entre G et D : " + c + "."); } });
        }, "Compteur maîtrisé.");
      }
    },
    {
      titre: "Le tri complet",
      texte: "<p>Un tableau de 6 entiers distincts. Fais toutes les fusions du tri fusion, en comptant les inversions à chaque prise dans D. " +
        "Le journal récapitule les fusions et leurs contributions.</p>",
      objectif: "Trier un tableau en comptant toutes ses inversions.",
      installer: function (zone, api) {
        relancable(zone, api, function (scene, ok) {
          var t = distincts(6, 40);
          var tb = new Tableau(scene, { nom: "A" });
          tb.dessiner(t);
          Fusion.triComplet(scene, t, { mode: "inversions", surFin: function (s, total) {
            ok("Total : " + total + " inversions (force brute : " + Fusion.total(t, "inversions") + ").");
          } });
        }, "Le total des fusions est bien le nombre d'inversions.");
      }
    },
    {
      titre: "It's a Murder par la fusion",
      texte: "<p>Même tri, mais quand tu prends x dans D, ajoute la <b>somme</b> des éléments de G déjà placés (tous &lt; x). À égalité, prends D d'abord.</p>",
      objectif: "Calculer la somme « Murder » d'un tableau par fusions.",
      installer: function (zone, api) {
        relancable(zone, api, function (scene, ok) {
          var t = distincts(5, 12);
          var tb = new Tableau(scene, { nom: "A" });
          tb.dessiner(t);
          PC.entree(scene, "1\n" + t.length + "\n" + t.join(" "));
          Fusion.triComplet(scene, t, { mode: "murder", surFin: function (s, total) {
            ok("Sortie : " + total + " (force brute : " + Fusion.total(t, "murder") + ").");
          } });
        }, "Même schéma que les inversions, avec une somme au lieu d'un compte.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "fusion",
    etapes: etapes,
    fin: { cartes: "tri", texte: "<p>Fusionner = comparer les têtes ; compter = regarder ce qui reste (inversions) ou ce qui est déjà passé (Murder) dans G quand on prend dans D.</p>" }
  });
})();
