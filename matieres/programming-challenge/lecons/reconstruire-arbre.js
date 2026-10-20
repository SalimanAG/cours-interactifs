/* Leçon : reconstruire un arbre binaire à partir de deux parcours (cours 5 Tree ; exo5_2 Tree order).
   Fil rouge : l'arbre à 9 nœuds du cours ; puis les exemples de l'énoncé Tree order. */
(function () {
  "use strict";
  var el = Site.el;
  var PRE = [1, 2, 4, 5, 7, 8, 3, 6, 9], IN = [4, 2, 7, 5, 8, 1, 3, 9, 6], POST = [4, 7, 8, 5, 2, 9, 6, 3, 1];
  var DIM = { largeur: 340, hauteur: 200 };

  /* Reconstruction interactive. mode "pre" (racine = 1er de pre) ou "post" (racine = dernier de post). */
  function reconstruction(zone, seq, ino, mode, fini) {
    var arbre = { racine: null, g: {}, d: {} };
    var taches = [{ s: seq.slice(), i: ino.slice(), parent: null, cote: null }];
    var info = el("div"); zone.appendChild(info);
    var ts = new Tableau(info, { nom: mode === "pre" ? "préfixe" : "postfixe", indices: false, compact: true });
    var ti = new Tableau(info, { nom: "infixe", indices: false, compact: true, onCase: clic });
    var msg = el("p", "legende-figure"); zone.appendChild(msg);
    var cadre = el("div", "cadre-figure"); zone.appendChild(cadre);
    var fig = new FigureGraphe(cadre, { largeur: DIM.largeur, hauteur: DIM.hauteur });
    var tache = null, offset = 0;
    function prochaine() {
      while (taches.length && !taches[taches.length - 1].s.length) taches.pop();
      tache = taches.length ? taches.pop() : null;
    }
    function racineAttendue() { return mode === "pre" ? tache.s[0] : tache.s[tache.s.length - 1]; }
    function dessiner() {
      var noeuds = arbre.racine === null ? [] : ArbreBinaire.infixe(arbre);
      if (noeuds.length) fig.dessiner(ArbreBinaire.vue(arbre, { largeur: DIM.largeur, hauteur: DIM.hauteur }));
      else fig.dessiner({ sommets: [], aretes: [], etiquettes: [{ x: 110, y: 100, texte: "(arbre vide)" }] });
      if (!tache) {
        ts.dessiner(seq); ti.dessiner(ino);
        msg.innerHTML = "<span>arbre reconstruit</span>";
        return;
      }
      // surligner le segment en cours dans les deux séquences complètes
      var cs = {}, ci = {};
      seq.forEach(function (x, k) { if (tache.s.indexOf(x) < 0) cs[k] = "vue"; });
      ino.forEach(function (x, k) { if (tache.i.indexOf(x) < 0) ci[k] = "vue"; });
      var r = racineAttendue();
      cs[seq.indexOf(r)] = "courante";
      ts.dessiner(seq, { classes: cs });
      ti.dessiner(ino, { classes: ci });
      msg.innerHTML = "<span>sous-arbre : <span class='mono'>{" + tache.i.join(" ") + "}</span></span>" +
        (tache.parent !== null ? "<span>" + (tache.cote === "g" ? "enfant gauche" : "enfant droit") + " de <span class='mono'>" + tache.parent + "</span></span>" : "<span>racine de l'arbre</span>");
    }
    function clic(k) {
      if (!tache) return;
      var x = ino[k], r = racineAttendue();
      if (tache.i.indexOf(x) < 0) { msg.innerHTML = "<span>Cette valeur n'est pas dans le sous-arbre en cours (cases non grisées).</span>"; return; }
      if (x !== r) { msg.innerHTML = "<span>La racine de ce sous-arbre est le " + (mode === "pre" ? "premier" : "dernier") + " élément de son segment " + (mode === "pre" ? "préfixe" : "postfixe") + " (en couleur) ; repère-le dans l'infixe.</span>"; return; }
      if (tache.parent === null) arbre.racine = r; else arbre[tache.cote][tache.parent] = r;
      var p = tache.i.indexOf(r);
      var gi = tache.i.slice(0, p), di = tache.i.slice(p + 1);
      var gs, ds;
      if (mode === "pre") { gs = tache.s.slice(1, 1 + gi.length); ds = tache.s.slice(1 + gi.length); }
      else { gs = tache.s.slice(0, gi.length); ds = tache.s.slice(gi.length, tache.s.length - 1); }
      taches.push({ s: ds, i: di, parent: r, cote: "d" });
      taches.push({ s: gs, i: gi, parent: r, cote: "g" });
      prochaine();
      dessiner();
      if (!tache) fini(arbre);
    }
    prochaine();
    dessiner();
  }

  var etapes = [
    {
      titre: "Où est la racine ?",
      texte: "<p>Arbre du cours : préfixe <span class='mono'>1 2 4 5 7 8 3 6 9</span>, infixe <span class='mono'>4 2 7 5 8 1 3 9 6</span>, postfixe <span class='mono'>4 7 8 5 2 9 6 3 1</span>.</p>",
      objectif: "Repérer la racine et ses deux sous-arbres dans les parcours.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "La racine est le premier élément du préfixe.", vrai: true, explication: "NLR : le nœud est affiché avant ses sous-arbres." },
            { texte: "La racine est le premier élément de l'infixe.", vrai: false, explication: "LNR : le sous-arbre gauche passe avant (sauf si la racine n'a pas d'enfant gauche)." },
            { texte: "La racine est le dernier élément du postfixe.", vrai: true, explication: "LRN : le nœud est affiché après ses sous-arbres." },
            { texte: "Dans l'infixe, ce qui est à gauche de la racine (4 2 7 5 8) forme son sous-arbre gauche.", vrai: true, explication: "C'est ce qui rend l'infixe indispensable : il sépare gauche et droite." }
          ],
          surReussite: function () { api.valider("Préfixe ou postfixe donnent la racine ; l'infixe dit qui va à gauche et qui va à droite. On recommence dans chaque sous-arbre."); }
        });
      }
    },
    {
      titre: "Préfixe + infixe",
      texte: "<p>À chaque étape, la racine du sous-arbre en cours est en couleur dans le préfixe. Touche-la dans l'infixe : elle coupe le segment en sous-arbre gauche et droit. " +
        "On traite le gauche avant le droit.</p>",
      objectif: "Reconstruire l'arbre du cours.",
      installer: function (zone, api) {
        reconstruction(zone, PRE, IN, "pre", function (a) {
          api.retour("Postfixe de l'arbre obtenu : " + ArbreBinaire.postfixe(a).join(" ") + " — c'est bien celui du cours.", true);
          api.valider("Préfixe + infixe déterminent l'arbre de façon unique (si les valeurs sont distinctes).");
        });
      }
    },
    {
      titre: "Postfixe + infixe",
      texte: "<p>Même méthode, mais la racine est le <b>dernier</b> élément du segment postfixe. Exemple de l'énoncé Tree order (6 nœuds).</p>",
      objectif: "Reconstruire l'arbre de l'énoncé.",
      installer: function (zone, api) {
        reconstruction(zone, [4, 5, 2, 6, 3, 1], [4, 2, 5, 1, 3, 6], "post", function (a) {
          api.retour("Préfixe de l'arbre obtenu : " + ArbreBinaire.prefixe(a).join(" ") + ".", true);
          api.valider("C'est l'arbre dessiné dans l'énoncé : 1 (2 (4, 5), 3 (−, 6)).");
        });
      }
    },
    {
      titre: "Préfixe + postfixe : ambigu",
      texte:
        "<p>Le cours : préfixe et infixe ✓, postfixe et infixe ✓, <b>préfixe et postfixe ✗</b>. Sur l'arbre du cours, en suivant préfixe <span class='mono'>1 2 4 5 7 8 3 6 9</span> " +
        "et postfixe <span class='mono'>4 7 8 5 2 9 6 3 1</span>, on arrive au nœud 3 : son seul descendant direct est 6… mais rien ne dit si 6 est à gauche ou à droite.</p>",
      objectif: "Expliquer l'ambiguïté et compter les arbres possibles.",
      installer: function (zone, api) {
        var cadres = el("div", "deux-figures"); zone.appendChild(cadres);
        [["d", "g"], ["g", "g"]].forEach(function (c) {
          var f = el("div", "cadre-figure"); cadres.appendChild(f);
          var a = ArbreBinaire.creer(1, [[1, "g", 2], [1, "d", 3], [2, "g", 4], [2, "d", 5], [5, "g", 7], [5, "d", 8], [3, c[0], 6], [6, c[1], 9]]);
          new FigureGraphe(f, { largeur: 340, hauteur: 200 }).dessiner(ArbreBinaire.vue(a, { largeur: 340, hauteur: 200, classes: { 6: "courant" } }));
        });
        Exercices.choix(zone, {
          question: "Ces deux arbres ont-ils les mêmes parcours préfixe et postfixe ?",
          options: ["Oui", "Non"], bonne: 0,
          expliquer: ["Exact : seul l'infixe les distingue (1 3 9 6 contre 1 9 6 3 à la fin).", "Non : refais-les ; préfixe et postfixe ne voient pas la différence gauche/droite d'un enfant unique."],
          surReussite: function () {
            Exercices.nombre(zone, {
              label: "nombre d'arbres ayant ces préfixe et postfixe =", attendu: 4, tolerance: 0, placeholder: "ex. 2",
              indice: "Deux nœuds ont un seul enfant (3 et 6) ; chacun peut le placer à gauche ou à droite.",
              bravo: "Exact : 2 × 2 = 4.",
              surReussite: function () { api.valider("Préfixe + postfixe ne suffisent que si aucun nœud n'a exactement un enfant (arbre « plein »)."); }
            });
          }
        });
      }
    },
    {
      titre: "Tree order",
      texte:
        "<p>Exo5_2 : on donne préfixe, postfixe et infixe ; peuvent-ils être ceux d'un <b>même</b> arbre binaire ? Solution 1 du cours : " +
        "reconstruire l'arbre avec deux parcours, générer le troisième, comparer.</p>",
      objectif: "Décider les trois entrées.",
      installer: function (zone, api) {
        var cas = [
          { n: 6, pre: "1 2 4 5 3 6", post: "4 5 2 6 3 1", ino: "4 2 5 1 3 6" },
          { n: 6, pre: "1 2 4 5 3 6", post: "4 5 2 6 1 3", ino: "4 2 5 1 6 3" },
          { n: 9, pre: "1 2 4 5 7 8 3 6 9", post: "4 7 5 8 2 9 6 3 1", ino: "4 2 7 5 8 1 3 9 6" }
        ];
        function decider(c) {
          var a = ArbreBinaire.depuisPreIn(c.pre.split(" ").map(Number), c.ino.split(" ").map(Number));
          return a && ArbreBinaire.postfixe(a).join(" ") === c.post ? "yes" : "no";
        }
        var k = 0;
        var z = el("div"); zone.appendChild(z);
        function suivant() {
          if (k >= cas.length) { api.valider("La comparaison finale suffit : si préfixe et infixe sont incohérents, la reconstruction échoue (segments qui ne contiennent pas les mêmes valeurs) → no."); return; }
          var c = cas[k];
          PC.entree(z, c.n + "\n" + c.pre + "\n" + c.post + "\n" + c.ino, "Entrée " + (k + 1) + " (préfixe, postfixe, infixe)");
          var r = decider(c);
          Exercices.choix(z, {
            options: ["yes", "no"], bonne: r === "yes" ? 0 : 1,
            expliquer: [
              r === "yes" ? "Exact : préfixe + infixe donnent un arbre dont le postfixe est bien celui donné." : "Non : reconstruis avec préfixe + infixe et calcule le postfixe.",
              r === "no" ? "Exact : l'arbre obtenu avec préfixe + infixe n'a pas ce postfixe." : "Non : le postfixe de l'arbre reconstruit correspond."
            ],
            surReussite: function () { k++; suivant(); }
          });
        }
        suivant();
      }
    },
    {
      titre: "Coût de la reconstruction",
      texte: "<p>Énoncé : N ≤ 8000. À chaque nœud, il faut trouver la racine dans le segment infixe.</p>",
      objectif: "Comparer les deux façons de trouver la racine dans l'infixe.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "En cherchant la racine par un parcours du segment (index), le pire cas coûte…",
          options: ["O(N)", "O(N log N)", "O(N²)"],
          bonne: 2,
          expliquer: ["Non : la recherche elle-même coûte jusqu'à O(N), et on la fait N fois.", "Non : seulement si l'arbre est équilibré.", "Exact : un arbre « peigne » donne N + (N−1) + … : ≈ 3,2 × 10^7 pour N = 8000. Avec un tableau pos[valeur] = indice dans l'infixe, chaque recherche est O(1) → O(N)."],
          surReussite: function () {
            PC.code(zone,
              "import sys\n" +
              "sys.setrecursionlimit(20000)\n\n" +
              "def postfixe_depuis(pre, ino):\n" +
              "    pos = {v: i for i, v in enumerate(ino)}      # O(1) pour trouver la racine\n" +
              "    res, k = [], 0                               # k : prochain élément de pre\n" +
              "    def construire(a, b):                        # segment ino[a..b-1]\n" +
              "        nonlocal k\n" +
              "        if a >= b:\n" +
              "            return\n" +
              "        r = pre[k]; k += 1\n" +
              "        construire(a, pos[r])                     # sous-arbre gauche\n" +
              "        construire(pos[r] + 1, b)                 # sous-arbre droit\n" +
              "        res.append(r)                             # LRN : racine en dernier\n" +
              "    construire(0, len(ino))\n" +
              "    return res\n\n" +
              "# réponse : 'yes' si postfixe_depuis(pre, ino) == post, sinon 'no'\n" +
              "# (vérifier aussi que pre et ino contiennent les mêmes valeurs, et que pos[r] est dans [a, b))");
            PC.html(zone, "Le cours propose aussi une « Solution 2 : vérifier les trois parcours en même temps » sans la détailler : je ne la développe pas ici.", "signalement");
            api.valider();
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "reconstruire-arbre",
    etapes: etapes,
    fin: { cartes: "arbres", texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul><li>Racine : 1er du préfixe, dernier du postfixe ; l'infixe sépare gauche et droite.</li>" +
      "<li>Préfixe + infixe ✓, postfixe + infixe ✓, préfixe + postfixe ✗ (enfant unique : gauche ou droite ?).</li>" +
      "<li>Tree order : reconstruire avec deux parcours, générer le troisième, comparer. O(N) avec pos[] ; attention à la récursion (N ≤ 8000).</li></ul></div>" }
  });
})();
