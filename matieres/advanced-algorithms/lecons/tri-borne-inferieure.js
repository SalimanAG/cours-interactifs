/* Leçon : Pourquoi trier coûte Ω(n log n) comparaisons (prérequis — questions 4 et 10 du test).
   Fil rouge : trier trois valeurs x, y, z en ne faisant que des comparaisons. */
(function () {
  "use strict";
  var el = Site.el;
  var NOTE_SOURCE = "<div class='signalement'>Notion de prérequis absente de tes documents d'Advanced Algorithms : " +
    "c'est le résultat classique sur les tris par comparaisons (Cormen, chapitre « tri en temps linéaire »).</div>";

  /* Arbre de décision pour 3 éléments (style tri par insertion). */
  var ARBRE = {
    sommets: [
      { id: "r", x: 190, y: 24, label: "x:y" },
      { id: "A", x: 95, y: 88, label: "y:z" },
      { id: "B", x: 285, y: 88, label: "x:z" },
      { id: "xyz", x: 40, y: 152, label: "xyz" },
      { id: "C", x: 150, y: 152, label: "x:z" },
      { id: "yxz", x: 230, y: 152, label: "yxz" },
      { id: "D", x: 340, y: 152, label: "y:z" },
      { id: "xzy", x: 110, y: 214, label: "xzy" },
      { id: "zxy", x: 190, y: 214, label: "zxy" },
      { id: "yzx", x: 300, y: 214, label: "yzx" },
      { id: "zyx", x: 370, y: 214, label: "zyx" }
    ],
    aretes: [
      { id: "rA", u: "r", v: "A", l: "<" }, { id: "rB", u: "r", v: "B", l: ">" },
      { id: "Axyz", u: "A", v: "xyz", l: "<" }, { id: "AC", u: "A", v: "C", l: ">" },
      { id: "Cxzy", u: "C", v: "xzy", l: "<" }, { id: "Czxy", u: "C", v: "zxy", l: ">" },
      { id: "Byxz", u: "B", v: "yxz", l: "<" }, { id: "BD", u: "B", v: "D", l: ">" },
      { id: "Dyzx", u: "D", v: "yzx", l: "<" }, { id: "Dzyx", u: "D", v: "zyx", l: ">" }
    ]
  };
  function enfants(id) { return ARBRE.aretes.filter(function (a) { return a.u === id; }); }
  function pos(id) { for (var i = 0; i < ARBRE.sommets.length; i++) if (ARBRE.sommets[i].id === id) return ARBRE.sommets[i]; }
  function etiquettesAretes() {
    return ARBRE.aretes.map(function (a) {
      var p = pos(a.u), q = pos(a.v);
      return { x: (p.x + q.x) / 2 + (a.l === "<" ? -14 : 6), y: (p.y + q.y) / 2, texte: a.l };
    });
  }
  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function lg(x) { return Math.log(x) / Math.LN2; }
  function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }

  var etapes = [
    {
      titre: "Trier en ne faisant que comparer",
      texte: "<p>x, y et z cachent trois valeurs différentes. Tu n'as le droit qu'à des <b>comparaisons</b> deux à deux. " +
        "Trouve l'ordre croissant en posant le moins de questions possible.</p>" + NOTE_SOURCE,
      objectif: "Trouver l'ordre croissant de x, y, z.",
      installer: function (zone, api) {
        var vals = [3, 7, 12].sort(function () { return Math.random() - 0.5; });
        var X = { x: vals[0], y: vals[1], z: vals[2] };
        var faites = 0;
        var journal = el("div", "memoire");
        var rang = el("div", "rangee-btn");
        [["x", "y"], ["y", "z"], ["x", "z"]].forEach(function (p) {
          var b = el("button", "btn btn-petit mono", p[0] + " < " + p[1] + " ?");
          b.type = "button";
          b.onclick = function () {
            b.disabled = true; faites++;
            journal.appendChild(el("span", "elt", p[0] + (X[p[0]] < X[p[1]] ? " < " : " > ") + p[1]));
          };
          rang.appendChild(b);
        });
        zone.appendChild(rang);
        journal.appendChild(el("span", "nom-memoire", "réponses :"));
        zone.appendChild(journal);
        var ligne = el("div", "saisie");
        var s = el("select");
        ["?", "x < y < z", "x < z < y", "y < x < z", "y < z < x", "z < x < y", "z < y < x"].forEach(function (o) {
          var op = el("option", null, o); op.value = o; s.appendChild(op);
        });
        var lab = el("label", null, "Ordre croissant :");
        ligne.appendChild(lab); ligne.appendChild(s);
        zone.appendChild(ligne);
        s.addEventListener("change", function () {
          var bon = ["x", "y", "z"].sort(function (a, b) { return X[a] - X[b]; }).join(" < ");
          if (s.value === "?") return;
          if (faites < 2) { api.retour("Tu ne peux pas encore le savoir : pose des questions d'abord.", false); s.value = "?"; return; }
          if (s.value === bon) {
            api.retour("Exact : " + bon + " (x = " + X.x + ", y = " + X.y + ", z = " + X.z + "), en " + faites + " comparaison" + (faites > 1 ? "s" : "") + ".", true);
            api.valider("Selon les réponses, 2 comparaisons suffisent parfois, mais dans le pire cas il en faut 3. Pourquoi pas moins ? C'est l'objet des étapes suivantes.");
          } else {
            api.retour("Non, cet ordre contredit une des réponses obtenues.", false);
          }
        });
      }
    },

    {
      titre: "L'arbre de décision",
      texte: "<p>Tout algorithme de tri par comparaisons se représente par un <b>arbre de décision</b> : chaque nœud interne est une comparaison (x:y), " +
        "chaque feuille un ordre final. Une exécution = un chemin de la racine à une feuille ; son nombre de comparaisons = la longueur du chemin.</p>" +
        "<p>Avec x = 5, y = 2, z = 8 : touche les nœuds du chemin suivi, depuis la racine.</p>",
      objectif: "Suivre le chemin de l'exécution jusqu'à sa feuille.",
      installer: function (zone, api) {
        var V = { x: 5, y: 2, z: 8 };
        var chemin = ["r"];
        var fig = new FigureGraphe(cadre(zone), { largeur: 395, hauteur: 238, onSommet: function (id) { clic(id); } });
        function attendu() {
          var cur = chemin[chemin.length - 1];
          var ch = enfants(cur);
          if (!ch.length) return null;
          var lab = pos(cur).label.split(":");
          var inf = V[lab[0]] < V[lab[1]];
          return ch.filter(function (a) { return a.l === (inf ? "<" : ">"); })[0].v;
        }
        function maj() {
          fig.dessiner({
            sommets: ARBRE.sommets.map(function (s) {
              var dernier = chemin[chemin.length - 1] === s.id;
              return { id: s.id, x: s.x, y: s.y, label: s.label, classe: dernier ? "courant" : chemin.indexOf(s.id) >= 0 ? "plein" : "" };
            }),
            aretes: ARBRE.aretes.map(function (a) {
              return { id: a.id, u: a.u, v: a.v, classe: chemin.indexOf(a.u) >= 0 && chemin.indexOf(a.v) >= 0 ? "traverse" : "" };
            }),
            etiquettes: etiquettesAretes()
          });
        }
        function clic(id) {
          var att = attendu();
          if (!att) return;
          if (id === att) {
            chemin.push(id);
            maj();
            if (!enfants(id).length) {
              api.retour("Feuille " + pos(id).label + " : y < x < z, en " + (chemin.length - 1) + " comparaisons.", true);
              api.valider("Cet arbre a 6 feuilles — une par ordre possible, 3! = 6 — et sa profondeur 3 est le nombre de comparaisons dans le pire cas.");
            } else {
              var lab = pos(id).label.split(":");
              api.retour("On compare " + lab[0] + " = " + V[lab[0]] + " et " + lab[1] + " = " + V[lab[1]] + ".", null);
            }
          } else if (chemin.indexOf(id) < 0) {
            var cur = pos(chemin[chemin.length - 1]).label.split(":");
            api.retour("Non : au nœud " + cur.join(":") + ", " + cur[0] + " = " + V[cur[0]] + " et " + cur[1] + " = " + V[cur[1]] + ". Quelle branche (< ou >) ?", false);
          }
        }
        maj();
        api.retour("La racine compare x = 5 et y = 2.", null);
      }
    },

    {
      titre: "Profondeur k ⇒ au plus 2ᵏ feuilles",
      texte: "<p>Dans un arbre binaire, chaque niveau a au plus deux fois plus de nœuds que le précédent : " +
        "un arbre binaire de profondeur k a <b>au plus 2ᵏ feuilles</b> (c'est la bonne réponse « n ≤ 2ᵏ » de la question 10). Fais varier k.</p>" +
        "<div class='signalement'>La correction de la question 10 donne aussi « n > k + 1 » comme toujours vrai. Ce n'est pas le cas : un arbre binaire en « peigne » " +
        "de profondeur k, dont chaque nœud interne a deux fils, a exactement k + 1 feuilles ; et si un nœud peut n'avoir qu'un fils, un arbre de profondeur k peut n'avoir qu'une feuille. " +
        "On a seulement n ≥ k + 1 pour un arbre où chaque nœud interne a deux fils. À vérifier avec ton enseignant.</div>",
      objectif: "Trouver la profondeur minimale d'un arbre binaire à 6 feuilles.",
      installer: function (zone, api) {
        var fig = new FigureGraphe(cadre(zone), { largeur: 340, hauteur: 170 });
        var lab = el("label"), c = el("input"); c.type = "range"; c.min = 0; c.max = 5; c.value = 2;
        zone.appendChild(lab); zone.appendChild(c);
        function maj() {
          var k = +c.value;
          lab.innerHTML = "k = <span class='mono'>" + k + "</span> → au plus <span class='mono'>2^" + k + " = " + Math.pow(2, k) + "</span> feuilles";
          var S = [], A = [];
          for (var p = 0; p <= k; p++) {
            var nb = Math.pow(2, p);
            for (var i = 0; i < nb; i++) {
              var id = p + "_" + i;
              S.push({ id: id, x: 10 + (i + 0.5) * 320 / nb, y: 16 + p * (140 / Math.max(1, k)), label: "", classe: p === k ? "plein" : "" });
              if (p > 0) A.push({ id: "a" + id, u: (p - 1) + "_" + Math.floor(i / 2), v: id });
            }
          }
          if (k === 0) S[0].y = 80;
          fig.dessiner({ sommets: S, aretes: A });
          Array.prototype.forEach.call(fig.racine.querySelectorAll("circle"), function (ci) { ci.setAttribute("r", k >= 4 ? 4 : 7); });
        }
        c.addEventListener("input", maj);
        maj();
        Exercices.nombre(zone, {
          label: "6 feuilles ⇒ profondeur ≥", attendu: 3, tolerance: 0, placeholder: "ex. 4",
          indice: "Il faut 2ᵏ ≥ 6.",
          bravo: "Exact : 2² = 4 < 6 ≤ 8 = 2³. Donc tout tri de 3 éléments par comparaisons fait au moins 3 comparaisons dans le pire cas.",
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Donc Ω(n log n) comparaisons",
      texte: "<p>Pour n éléments, l'arbre doit avoir au moins n! feuilles (un ordre par permutation). Sa profondeur k vérifie 2ᵏ ≥ n!, donc</p>" +
        "<div class='formule'>k ≥ log₂(n!) ≥ log₂((n/2)^(n/2)) = (n/2)·log₂(n/2) = Ω(n log n)</div>" +
        "<p>(car n! contient au moins n/2 facteurs ≥ n/2). Compare avec des nombres :</p>",
      objectif: "Répondre de nouveau à la question 4 du test.",
      installer: function (zone, api) {
        var lab = el("label"), c = el("input"); c.type = "range"; c.min = 2; c.max = 20; c.value = 3;
        var t = el("table", "tableau");
        zone.appendChild(lab); zone.appendChild(c); zone.appendChild(t);
        function maj() {
          var n = +c.value;
          lab.innerHTML = "n = <span class='mono'>" + n + "</span>";
          t.innerHTML = "<tr><th>quantité</th><th class='num'>valeur</th></tr>" +
            "<tr><td>n! (feuilles nécessaires)</td><td class='num'>" + fact(n).toLocaleString("fr-FR") + "</td></tr>" +
            "<tr><td>⌈log₂ n!⌉ (comparaisons minimum, pire cas)</td><td class='num'>" + Math.ceil(lg(fact(n)) - 1e-9) + "</td></tr>" +
            "<tr><td>n log₂ n</td><td class='num'>" + Math.round(n * lg(n)) + "</td></tr>" +
            "<tr><td>n(n − 1)/2 (tri par insertion, pire cas)</td><td class='num'>" + n * (n - 1) / 2 + "</td></tr>";
        }
        c.addEventListener("input", maj);
        maj();
        Exercices.choix(zone, {
          question: "Nombre minimum de comparaisons nécessaire dans le pire des cas pour trier un tableau de n nombres ?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"],
          bonne: 3,
          expliquer: [
            "Non.",
            "Non : il faut au moins regarder chaque élément.",
            "Non : log₂(n!) grandit plus vite que n.",
            "Exact : aucun tri par comparaisons ne fait mieux que log₂(n!) = Θ(n log n) dans le pire cas, et le tri fusion atteint O(n log n).",
            "C'est ta réponse au test. Certains tris font bien Θ(n²) comparaisons (insertion, sélection), mais la question demande le minimum nécessaire : on fait mieux avec le tri fusion."
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Le bilan sur les tris",
      texte: "<p>La borne inférieure dit « on ne peut pas faire mieux » ; le tri fusion dit « on y arrive ». Ensemble : trier par comparaisons coûte <b>Θ(n log n)</b> dans le pire cas.</p>",
      objectif: "Classer chaque affirmation en vrai ou faux.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Le tri par insertion fait Θ(n²) comparaisons dans le pire cas.", vrai: true, explication: "Tableau trié à l'envers : 1 + 2 + … + (n − 1)." },
            { texte: "Le tri fusion fait O(n log n) comparaisons.", vrai: true, explication: "log₂ n niveaux de fusion, O(n) comparaisons par niveau." },
            { texte: "Un tri par comparaisons peut faire O(n) comparaisons dans le pire cas.", vrai: false, explication: "Contredit la borne log₂(n!) = Ω(n log n)." },
            { texte: "Un arbre binaire de profondeur 4 a au plus 16 feuilles.", vrai: true, explication: "2⁴ = 16." },
            { texte: "Pour trier 4 éléments, 4 comparaisons suffisent toujours.", vrai: false, explication: "4! = 24 feuilles, et 2⁴ = 16 < 24 : il en faut au moins 5 dans le pire cas." }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "tri-borne-inferieure",
    etapes: etapes,
    fin: {
      cartes: "prerequis",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul>" +
        "<li>Tri par comparaisons = arbre de décision ; pire cas = profondeur.</li>" +
        "<li>Arbre binaire de profondeur k : au plus 2ᵏ feuilles.</li>" +
        "<li>n! feuilles ⇒ profondeur ≥ log₂(n!) = Ω(n log n).</li>" +
        "<li>Le tri fusion atteint O(n log n) : c'est optimal, Θ(n log n).</li></ul></div>"
    }
  });
})();
