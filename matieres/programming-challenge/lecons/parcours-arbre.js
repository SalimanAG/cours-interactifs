/* Leçon : les parcours d'un arbre binaire (cours 5 Tree, « Search » et « Depth-first search »).
   Fil rouge : l'arbre à 9 nœuds du cours — 1 (2 (4, 5 (7, 8)), 3 (−, 6 (9, −))). */
(function () {
  "use strict";
  var el = Site.el;
  var T = ArbreBinaire.creer(1, [[1, "g", 2], [1, "d", 3], [2, "g", 4], [2, "d", 5], [5, "g", 7], [5, "d", 8], [3, "d", 6], [6, "g", 9]]);
  var DIM = { largeur: 340, hauteur: 200 };

  /* Toucher les nœuds dans l'ordre d'un parcours. */
  function ordreAuClic(zone, attendu, nom, fini) {
    var faits = [];
    var cadre = el("div", "cadre-figure");
    zone.appendChild(cadre);
    var fig = new FigureGraphe(cadre, { largeur: DIM.largeur, hauteur: DIM.hauteur, titre: "Arbre du cours", onSommet: function (id) {
      if (faits.length >= attendu.length) return;
      if (+id === attendu[faits.length]) { faits.push(+id); dessiner(); if (faits.length === attendu.length) fini(); }
      else msg.textContent = id + " n'est pas le suivant. " + (faits.length ? "Dernier visité : " + faits[faits.length - 1] + "." : "");
    } });
    var seq = el("p", "legende-figure");
    zone.appendChild(seq);
    var msg = el("p", "discret petit");
    zone.appendChild(msg);
    function dessiner() {
      var cl = {}, sous = {};
      faits.forEach(function (v, i) { cl[v] = "plein"; sous[v] = "n°" + (i + 1); });
      fig.dessiner(ArbreBinaire.vue(T, { largeur: DIM.largeur, hauteur: DIM.hauteur, classes: cl, sous: sous }));
      seq.innerHTML = "<span>" + nom + " : <span class='mono'>" + (faits.join(" ") || "—") + "</span></span>";
      msg.textContent = "";
    }
    dessiner();
  }

  function etapeParcours(type, nom, lignes, expl) {
    return function (zone, api) {
      var pc = new PseudoCode(zone, { titre: nom, lignes: lignes });
      pc.surligner(null);
      var attendu = type === "pre" ? ArbreBinaire.prefixe(T) : type === "in" ? ArbreBinaire.infixe(T) : ArbreBinaire.postfixe(T);
      ordreAuClic(zone, attendu, nom.split("(")[0].trim(), function () {
        api.retour(nom + " : " + attendu.join(" "), true);
        api.valider(expl);
      });
    };
  }

  var etapes = [
    {
      titre: "Arbre binaire",
      texte:
        "<p>Un <b>arbre binaire</b> est un arbre dont chaque nœud a un enfant gauche, un enfant droit, les deux, ou aucun. " +
        "Gauche et droite <b>comptent</b> : un enfant unique est soit à gauche, soit à droite.</p>" +
        "<p>Voici l'arbre du cours. Touche les nœuds qui ont <b>exactement un</b> enfant.</p>",
      objectif: "Trouver les nœuds à un seul enfant.",
      installer: function (zone, api) {
        var choisis = {};
        var cadre = el("div", "cadre-figure"); zone.appendChild(cadre);
        var fig = new FigureGraphe(cadre, { largeur: DIM.largeur, hauteur: DIM.hauteur, onSommet: function (id) {
          var v = +id;
          var n = (T.g[v] !== undefined ? 1 : 0) + (T.d[v] !== undefined ? 1 : 0);
          if (n === 1) { choisis[v] = true; api.retour(v + " : un seul enfant (" + (T.g[v] !== undefined ? T.g[v] + " à gauche" : T.d[v] + " à droite") + ").", true); }
          else api.retour(v + " a " + (n === 0 ? "aucun enfant (c'est une feuille)." : "deux enfants."), false);
          dessiner();
        } });
        function dessiner() {
          var cl = {}; Object.keys(choisis).forEach(function (k) { cl[k] = "plein"; });
          fig.dessiner(ArbreBinaire.vue(T, { largeur: DIM.largeur, hauteur: DIM.hauteur, classes: cl }));
          if (Object.keys(choisis).length === 2) api.valider("3 a un enfant droit (6), 6 a un enfant gauche (9). Ces deux nœuds rendront la reconstruction « préfixe + postfixe » ambiguë.");
        }
        dessiner();
      }
    },
    {
      titre: "Le parcours en largeur",
      texte:
        "<p>Le cours liste deux familles de parcours : en <b>largeur</b> (BFS) et en <b>profondeur</b> (DFS : préfixe, infixe, postfixe). " +
        "En largeur, on visite niveau par niveau, de gauche à droite (avec une file, comme pour « Is it a tree »). Touche les nœuds dans cet ordre.</p>",
      objectif: "Donner l'ordre du parcours en largeur.",
      installer: function (zone, api) {
        ordreAuClic(zone, ArbreBinaire.largeur(T), "largeur", function () {
          api.retour("Largeur : " + ArbreBinaire.largeur(T).join(" "), true);
          api.valider("Sur cet arbre, l'ordre en largeur est 1 à 9 : le cours a numéroté les nœuds par niveaux.");
        });
        PC.html(zone, "Le cours cite le parcours en largeur sans le dérouler sur un arbre binaire ; c'est le BFS habituel avec une file, enfant gauche avant enfant droit.", "signalement");
      }
    },
    {
      titre: "Préfixe (NLR)",
      texte: "<p>Trois étapes en profondeur : (L) visiter le sous-arbre gauche, (R) le sous-arbre droit, (N) le nœud. En <b>préfixe</b>, le nœud d'abord : N, L, R.</p>",
      objectif: "Toucher les nœuds dans l'ordre préfixe.",
      installer: etapeParcours("pre", "Préfixe(v)  [NLR]", ["si v existe :", "    afficher v", "    Préfixe(enfant gauche de v)", "    Préfixe(enfant droit de v)"],
        "Préfixe : 1 2 4 5 7 8 3 6 9. La racine est toujours le premier élément.")
    },
    {
      titre: "Infixe (LNR)",
      texte: "<p>En <b>infixe</b>, le nœud au milieu : tout le sous-arbre gauche, puis le nœud, puis le sous-arbre droit.</p>",
      objectif: "Toucher les nœuds dans l'ordre infixe.",
      installer: etapeParcours("in", "Infixe(v)  [LNR]", ["si v existe :", "    Infixe(enfant gauche de v)", "    afficher v", "    Infixe(enfant droit de v)"],
        "Infixe : 4 2 7 5 8 1 3 9 6. La racine sépare le sous-arbre gauche (à sa gauche) du droit (à sa droite).")
    },
    {
      titre: "Postfixe (LRN)",
      texte: "<p>En <b>postfixe</b>, le nœud en dernier : sous-arbre gauche, sous-arbre droit, puis le nœud.</p>",
      objectif: "Toucher les nœuds dans l'ordre postfixe.",
      installer: etapeParcours("post", "Postfixe(v)  [LRN]", ["si v existe :", "    Postfixe(enfant gauche de v)", "    Postfixe(enfant droit de v)", "    afficher v"],
        "Postfixe : 4 7 8 5 2 9 6 3 1. La racine est toujours le dernier élément.")
    },
    {
      titre: "La pile d'appels",
      texte: "<p>Ces parcours sont récursifs : à chaque instant, la pile contient le chemin de la racine au nœud en cours. Déroule le parcours infixe pas à pas.</p>",
      objectif: "Trouver la hauteur maximale de la pile d'appels.",
      installer: function (zone, api) {
        var cadre = el("div", "cadre-figure"); zone.appendChild(cadre);
        var fig = new FigureGraphe(cadre, { largeur: DIM.largeur, hauteur: DIM.hauteur });
        var pile = el("div", "memoire"); zone.appendChild(pile);
        var trace = ArbreBinaire.etapesParcours(T, "in");
        var ctl = new Controleur(zone, { delai: 600, afficher: function (i) {
          var e = trace[i], cl = {}, sous = {};
          e.ordre.forEach(function (v, k) { cl[v] = "plein"; sous[v] = "n°" + (k + 1); });
          if (e.appel.length) cl[e.appel[e.appel.length - 1]] = (cl[e.appel[e.appel.length - 1]] ? "plein " : "") + "courant";
          fig.dessiner(ArbreBinaire.vue(T, { largeur: DIM.largeur, hauteur: DIM.hauteur, classes: cl, sous: sous }));
          pile.innerHTML = "";
          pile.appendChild(el("span", "nom-memoire", "pile ="));
          if (!e.appel.length) pile.appendChild(el("span", "vide", "(vide)"));
          e.appel.forEach(function (v, k) { pile.appendChild(el("span", "elt" + (k === e.appel.length - 1 ? " tete-file" : ""), "Infixe(" + v + ")")); });
        } });
        ctl.charger(trace.length);
        Exercices.nombre(zone, {
          label: "taille maximale de la pile =", attendu: 4, tolerance: 0, placeholder: "ex. 3",
          indice: "Le plus long chemin depuis la racine : 1 → 2 → 5 → 7 (ou 1 → 3 → 6 → 9).",
          bravo: "Exact : 4 = hauteur de l'arbre + 1.",
          surReussite: function () {
            PC.code(zone,
              "import sys\n" +
              "sys.setrecursionlimit(20000)      # un arbre « peigne » de N nœuds → N appels imbriqués\n\n" +
              "gauche = {1: 2, 2: 4, 5: 7, 6: 9}\n" +
              "droite = {1: 3, 2: 5, 5: 8, 3: 6}\n\n" +
              "def infixe(v, res):\n" +
              "    if v is None:\n" +
              "        return\n" +
              "    infixe(gauche.get(v), res)\n" +
              "    res.append(v)\n" +
              "    infixe(droite.get(v), res)", "En Python");
            api.valider("Pour Tree order (N ≤ 8000), un arbre dégénéré dépasse la limite de récursion par défaut de Python (1000) : il faut l'augmenter, ou parcourir avec une pile explicite.");
          }
        });
        return function () { ctl.stop(); };
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "parcours-arbre",
    etapes: etapes,
    fin: { cartes: "arbres", texte: "<div class='encadre'><span class='titre-encadre'>À retenir (arbre du cours)</span><ul>" +
      "<li>Préfixe NLR : 1 2 4 5 7 8 3 6 9 — racine en premier.</li><li>Infixe LNR : 4 2 7 5 8 1 3 9 6 — racine au milieu, sépare gauche et droite.</li>" +
      "<li>Postfixe LRN : 4 7 8 5 2 9 6 3 1 — racine en dernier.</li><li>Largeur : niveau par niveau, avec une file.</li></ul></div>" }
  });
})();
