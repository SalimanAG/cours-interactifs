/* Leçon : Graphes, BFS et DFS (prérequis — questions 5 à 9 du test).
   Fil rouge : un graphe de 7 sommets (a … g) et 9 arêtes. */
(function () {
  "use strict";
  var el = Site.el;
  var G = Parcours.EXEMPLE;
  var N = Parcours.voisins(G);
  var n = G.sommets.length, m = G.aretes.length;

  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function figure(zone, opts) {
    var o = { largeur: 350, hauteur: 200 };
    for (var k in opts) o[k] = opts[k];
    return new FigureGraphe(cadre(zone), o);
  }
  /* classeS(id) → classe d'un sommet ; sousS(id) → texte sous le sommet ; classeA(a) → classe d'une arête */
  function vue(classeS, sousS, classeA) {
    return {
      sommets: G.sommets.map(function (s) {
        return { id: s.id, x: s.x, y: s.y, label: s.id, classe: classeS ? classeS(s.id) : "", sous: sousS ? sousS(s.id) : "" };
      }),
      aretes: G.aretes.map(function (a) { return { id: a.id, u: a.u, v: a.v, classe: classeA ? classeA(a) : "" }; })
    };
  }
  function memoire(zone, nom) {
    var d = el("div", "memoire");
    zone.appendChild(d);
    return function (contenu, teteEnCouleur) {
      d.innerHTML = "";
      d.appendChild(el("span", "nom-memoire", nom));
      if (!contenu.length) { d.appendChild(el("span", "vide", "(vide)")); return; }
      contenu.forEach(function (x, i) {
        d.appendChild(el("span", "elt" + (teteEnCouleur && i === 0 ? " tete-file" : ""), x));
      });
    };
  }
  var NOTE_SOURCE = "<div class='signalement'>Ces notions ne sont pas dans tes documents d'Advanced Algorithms : " +
    "définitions standard du Cormen, avec les notations du cours (n sommets, m arêtes, N(u) le voisinage). " +
    "Dans toute la leçon, les voisins sont parcourus dans l'ordre alphabétique.</div>";

  /* Ordre de défilement du BFS et ordre de marquage du DFS depuis a. */
  var traceBFS = Parcours.bfs(G, "a");
  var traceDFS = Parcours.dfs(G, "a");
  var ordreBFS = traceBFS[traceBFS.length - 1].ordre;
  var ordreDFS = traceDFS[traceDFS.length - 1].ordre;
  var distFinale = traceBFS[traceBFS.length - 1].dist;

  var etapes = [
    {
      titre: "Le voisinage d'un sommet",
      texte: "<div class='encadre'><span class='titre-encadre'>Définition</span>" +
        "Le voisinage N(u) d'un sommet u est l'ensemble des <b>sommets</b> reliés à u par une arête. " +
        "Le degré d(u) = |N(u)| (dans un graphe simple).</div>" +
        "<p>Dans le test, tu avais aussi coché « les sommets proches de u » : « proche » ne veut rien dire en graphe, seul compte « relié par une arête ». " +
        "Sélectionne N(d) (d est en couleur).</p>" + NOTE_SOURCE,
      objectif: "Sélectionner exactement N(d).",
      installer: function (zone, api) {
        var choisis = {};
        var fig = figure(zone, {
          onSommet: function (id) { if (id === "d") return; choisis[id] = !choisis[id]; maj(); }
        });
        var b = el("button", "btn", "Valider");
        b.type = "button";
        zone.appendChild(b);
        function maj() {
          fig.dessiner(vue(function (id) { return id === "d" ? "courant" : choisis[id] ? "plein" : ""; }));
        }
        b.onclick = function () {
          var sel = Object.keys(choisis).filter(function (k) { return choisis[k]; }).sort().join(",");
          var attendu = N.d.map(function (x) { return x.v; }).join(",");
          if (sel === attendu) {
            api.retour("N(d) = {b, e, f} et d(d) = 3.", true);
            api.valider("c est à distance 2 de d (par b ou e) : il est « proche » mais ce n'est pas un voisin.");
          } else {
            api.retour("Pas tout à fait : tu as choisi {" + sel.split(",").filter(Boolean).join(", ") + "}. Garde uniquement les sommets reliés à d par une arête.", false);
          }
        };
        maj();
      }
    },

    {
      titre: "Somme des degrés = 2m",
      texte: "<p>Touche chaque arête une fois pour la compter. Sous chaque sommet s'affiche son degré au fur et à mesure.</p>",
      objectif: "Compter les 9 arêtes et observer la somme des degrés.",
      installer: function (zone, api) {
        var comptee = {};
        var fig = figure(zone, { onArete: function (id) { if (!comptee[id]) { comptee[id] = true; maj(); } } });
        var info = el("p", "legende-figure");
        zone.appendChild(info);
        function maj() {
          var deg = {};
          G.sommets.forEach(function (s) { deg[s.id] = 0; });
          var k = 0;
          G.aretes.forEach(function (a) { if (comptee[a.id]) { deg[a.u]++; deg[a.v]++; k++; } });
          var somme = 0;
          Object.keys(deg).forEach(function (s) { somme += deg[s]; });
          fig.dessiner(vue(null, function (id) { return "d=" + deg[id]; }, function (a) { return comptee[a.id] ? "traverse" : ""; }));
          info.innerHTML = "<span>arêtes comptées : <span class='mono'>" + k + "</span></span><span>somme des degrés : <span class='mono'>" + somme + "</span></span>";
          if (k === m) {
            api.retour("m = 9 arêtes, somme des degrés = 18.", true);
            api.valider("Chaque arête uv ajoute 1 au degré de u et 1 au degré de v : Σ d(u) = 2m. C'est ce qui donne « au moins kn/2 arêtes » dans l'analyse de la coupe minimum (cours 2).");
          }
        }
        maj();
      }
    },

    {
      titre: "Une paire de sommets au hasard",
      texte: "<p>Question 6 du test (que tu avais réussie) : on tire uniformément une paire {x, y} de sommets distincts. " +
        "Il y a n(n − 1)/2 paires, dont m sont des arêtes, donc</p>" +
        "<div class='formule'>Pr[x et y reliés] = m / (n(n − 1)/2) = 2m / (n(n − 1))</div>" +
        "<p>Sur notre graphe (n = 7, m = 9) :</p>",
      objectif: "Calculer cette probabilité pour le graphe fil rouge.",
      installer: function (zone, api) {
        var paire = null, tirages = 0, reliees = 0;
        var fig = figure(zone, {});
        var info = el("p", "legende-figure");
        var rang = el("div", "rangee-btn");
        var b = el("button", "btn btn-petit", "Tirer 1 paire"); b.type = "button";
        var b2 = el("button", "btn btn-petit", "Tirer 1000 paires"); b2.type = "button";
        rang.appendChild(b); rang.appendChild(b2);
        zone.appendChild(rang); zone.appendChild(info);
        var ids = G.sommets.map(function (s) { return s.id; });
        function tirer() {
          var i = Math.floor(Math.random() * n), j = Math.floor(Math.random() * (n - 1));
          if (j >= i) j++;
          var x = ids[i], y = ids[j];
          var ok = N[x].some(function (z) { return z.v === y; });
          tirages++; if (ok) reliees++;
          paire = { x: x, y: y, ok: ok };
        }
        function maj() {
          fig.dessiner(vue(function (id) { return paire && (id === paire.x || id === paire.y) ? "courant" : ""; }));
          info.innerHTML = paire ? "<span>{" + paire.x + ", " + paire.y + "} : " + (paire.ok ? "reliés" : "non reliés") + "</span>" +
            "<span>fréquence : <span class='mono'>" + reliees + "/" + tirages + " ≈ " + (reliees / tirages).toFixed(3) + "</span></span>" : "";
        }
        b.onclick = function () { tirer(); maj(); };
        b2.onclick = function () { for (var k = 0; k < 1000; k++) tirer(); maj(); };
        maj();
        Exercices.nombre(zone, {
          label: "Pr =", attendu: 3 / 7, tolerance: 0.003,
          indice: "Combien de paires avec n = 7 ? Combien d'entre elles sont des arêtes ?",
          bravo: "Exact : 21 paires, 9 arêtes, 9/21 = 2·9/(7·6) = 3/7 ≈ 0,43.",
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Le parcours en largeur (BFS)",
      texte: "<p>Le BFS part d'une source s et visite les sommets <b>par distance croissante</b>, grâce à une <b>file</b> F (premier entré, premier sorti). " +
        "Exécute-le toi-même depuis a : touche les sommets dans l'ordre où ils sont <b>défilés</b> (ligne 4).</p>",
      objectif: "Donner l'ordre de défilement du BFS depuis a.",
      installer: function (zone, api) {
        var k = 0;
        var fig = figure(zone, { onSommet: function (id) { clic(id); } });
        var affF = memoire(zone, "F =");
        var pc = new PseudoCode(zone, { titre: "BFS(G, s)", lignes: Parcours.BFS_LIGNES });
        // état affiché après avoir traité les k premiers sommets défilés
        function etatApres(k) {
          var vu = 0;
          for (var i = 0; i < traceBFS.length; i++) {
            if (traceBFS[i].ligne === 4) { vu++; if (vu === k + 1) return traceBFS[i - 1]; }
          }
          return traceBFS[traceBFS.length - 1];
        }
        function maj() {
          var e = etatApres(k);
          var defiles = ordreBFS.slice(0, k);
          fig.dessiner(vue(function (id) { return defiles.indexOf(id) >= 0 ? "plein" : ""; },
            function (id) { return e.dist[id] !== undefined ? "dist " + e.dist[id] : ""; }));
          affF(e.structure, true);
          pc.surligner(k < n ? 4 : 8);
        }
        function clic(id) {
          if (k >= n) return;
          if (id === ordreBFS[k]) {
            k++;
            api.retour(k < n ? "Bien : on défile " + id + " et on enfile ses voisins pas encore vus." : "Ordre de défilement : " + ordreBFS.join(", ") + ".", true);
            maj();
            if (k === n) api.valider("Remarque : d est défilé avant e, car b (qui a découvert d) était devant c dans la file.");
          } else {
            var e = etatApres(k);
            api.retour("Non : on défile toujours la tête de la file, ici " + e.structure[0] + ".", false);
          }
        }
        maj();
      }
    },

    {
      titre: "Les niveaux du BFS sont les distances",
      texte: "<p>Le BFS donne dist(v) = le nombre minimum d'arêtes entre s et v : chaque sommet est découvert depuis un sommet du niveau précédent. " +
        "Par exemple dist(a, g) = 4.</p>",
      objectif: "Retrouver les algorithmes qui calculent les distances dans un graphe non pondéré (question 8 du test).",
      installer: function (zone, api) {
        var fig = figure(zone, {});
        fig.dessiner(vue(function (id) { return id === "a" ? "plein" : ""; }, function (id) { return "dist " + distFinale[id]; }));
        Exercices.cocher(zone, {
          question: "Lesquels de ces algorithmes permettent de calculer les distances dans un graphe non pondéré ?",
          options: ["DFS", "BFS", "Prim", "Dijkstra", "Kruskal"],
          bonnes: [1, 3],
          explication: "BFS et Dijkstra. Dijkstra calcule les plus courts chemins avec des poids positifs : avec tous les poids à 1, ce sont les distances. Le DFS ne donne pas les distances (il a atteint e par a → b → c → e, longueur 3, alors que dist(a, e) = 2). Prim et Kruskal construisent un arbre couvrant de poids minimum, pas des distances.",
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Pourquoi le BFS coûte O(n + m)",
      texte: "<p>Rejoue le BFS pas à pas et regarde les deux compteurs : combien de fois un sommet est défilé (ligne 4), " +
        "combien de fois une arête est examinée (ligne 5). L'arête examinée est en couleur.</p>",
      objectif: "Donner la complexité du BFS (question 7 du test).",
      installer: function (zone, api) {
        var fig = figure(zone, {});
        var info = el("p", "legende-figure");
        var affF = memoire(zone, "F =");
        var ctl = new Controleur(zone, {
          delai: 450,
          afficher: function (i) {
            var e = traceBFS[i];
            fig.dessiner(vue(function (id) { return id === e.courant ? "courant" : e.ordre.indexOf(id) >= 0 ? "plein" : ""; },
              function (id) { return e.dist[id] !== undefined ? "dist " + e.dist[id] : ""; },
              function (a) { return a.id === e.arete ? "courante" : ""; }));
            affF(e.structure, true);
            info.innerHTML = "<span>sommets défilés : <span class='mono'>" + e.ordre.length + "</span></span>" +
              "<span>arêtes examinées : <span class='mono'>" + e.examinees + "</span></span>";
          }
        });
        zone.insertBefore(info, zone.querySelector(".memoire"));
        ctl.charger(traceBFS.length);
        Exercices.choix(zone, {
          question: "Avec des listes d'adjacence, quelle est la complexité du BFS sur un graphe à n sommets et m arêtes ?",
          options: ["O(nm)", "O(n + m)", "O(n)", "O(n²)"],
          bonne: 1,
          expliquer: [
            "Non : on ne parcourt pas toutes les arêtes pour chaque sommet, seulement celles du sommet défilé.",
            "Exact : chaque sommet est défilé une fois (n), chaque liste N(u) est parcourue une fois, soit Σ d(u) = 2m examens. Total O(n + m). Ici : 7 et 18.",
            "Non : il faut aussi compter les arêtes examinées, jusqu'à 2m.",
            "C'est la réponse que tu avais donnée : c'est le coût avec une matrice d'adjacence (on teste n cases pour chaque sommet). Avec des listes d'adjacence, c'est O(n + m), qui est meilleur quand le graphe a peu d'arêtes."
          ],
          surReussite: function () { api.valider(); }
        });
        return function () { ctl.stop(); };
      }
    },

    {
      titre: "Le parcours en profondeur (DFS)",
      texte: "<p>Le DFS s'enfonce le plus loin possible avant de revenir en arrière. Il s'écrit naturellement de façon <b>récursive</b> ; " +
        "la pile des appels joue le rôle de la file du BFS. Exécute-le depuis a : touche les sommets dans l'ordre où ils sont <b>marqués</b>.</p>",
      objectif: "Donner l'ordre de marquage du DFS depuis a.",
      installer: function (zone, api) {
        var k = 1;
        var fig = figure(zone, { onSommet: function (id) { clic(id); } });
        var affP = memoire(zone, "pile d'appels =");
        var pc = new PseudoCode(zone, { titre: "DFS récursif", lignes: Parcours.DFS_LIGNES });
        function etatMarquage(k) {
          var vu = 0;
          for (var i = 0; i < traceDFS.length; i++) {
            if (traceDFS[i].ligne === 2) { vu++; if (vu === k) return traceDFS[i]; }
          }
          return traceDFS[traceDFS.length - 1];
        }
        function maj() {
          var e = etatMarquage(k);
          fig.dessiner(vue(function (id) { return id === e.courant ? "courant" : e.ordre.indexOf(id) >= 0 ? "plein" : ""; },
            function (id) { var p = e.ordre.indexOf(id); return p >= 0 ? "n°" + (p + 1) : ""; }));
          affP(e.structure.map(function (x) { return "DFS(" + x + ")"; }), false);
          pc.surligner(2);
        }
        function clic(id) {
          if (k >= n) return;
          if (id === ordreDFS[k]) {
            k++;
            maj();
            api.retour(k < n ? "Bien." : "Ordre de marquage : " + ordreDFS.join(", ") + ".", true);
            if (k === n) api.valider("Compare avec le BFS (a, b, c, d, e, f, g) : le DFS va en e avant d, en s'enfonçant par c. Il coûte aussi O(n + m) : chaque sommet est marqué une fois, chaque liste N(u) parcourue une fois.");
          } else {
            var e = etatMarquage(k);
            api.retour("Non : depuis le sommet en haut de la pile (" + e.structure[e.structure.length - 1] + "), le DFS va vers son premier voisin non marqué ; s'il n'y en a pas, il revient en arrière.", false);
          }
        }
        maj();
        api.retour("a est déjà marqué : DFS(a) est le premier appel.", null);
      }
    },

    {
      titre: "Quelle technique ?",
      texte: "<p>Question 9 du test : associe chaque algorithme à la technique qu'il utilise.</p>" +
        "<div class='signalement'>Ces associations sont celles de la correction du test. Ce sont des tendances, pas des règles : " +
        "un DFS peut aussi s'écrire de façon itérative avec une pile explicite.</div>",
      objectif: "Associer BFS, DFS et Prim à leur technique.",
      installer: function (zone, api) {
        var options = ["?", "itératif", "récursif", "glouton", "programmation dynamique", "diviser pour régner"];
        var q = [
          { label: "BFS", bonne: "itératif", pourquoi: "une boucle « tant que F n'est pas vide » sur une file" },
          { label: "DFS", bonne: "récursif", pourquoi: "DFS(u) appelle DFS(v)" },
          { label: "Prim", bonne: "glouton", pourquoi: "à chaque étape, on ajoute l'arête de poids minimum qui sort de l'arbre, sans revenir sur ce choix" }
        ];
        var sels = q.map(function (x) {
          var ligne = el("div", "saisie");
          ligne.style.margin = ".35rem 0";
          var lab = el("label", null, x.label);
          lab.style.flex = "0 0 4rem";
          var s = el("select");
          options.forEach(function (o) { var op = el("option", null, o); op.value = o; s.appendChild(op); });
          s.addEventListener("change", verifier);
          ligne.appendChild(lab); ligne.appendChild(s);
          zone.appendChild(ligne);
          return s;
        });
        function verifier() {
          var justes = 0, remplis = 0;
          sels.forEach(function (s, i) { if (s.value !== "?") remplis++; if (s.value === q[i].bonne) justes++; });
          if (justes === q.length) {
            api.retour(q.map(function (x) { return x.label + " → " + x.bonne + " : " + x.pourquoi; }).join(" ; ") + ".", true);
            api.valider();
          } else if (remplis === q.length) {
            api.retour(justes + " / 3 justes.", false);
          } else api.retour("", null);
        }
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "graphes-parcours",
    etapes: etapes,
    fin: {
      cartes: "prerequis",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul>" +
        "<li>N(u) = sommets reliés à u par une arête ; Σ d(u) = 2m.</li>" +
        "<li>Paire tirée au hasard reliée avec probabilité 2m/(n(n − 1)).</li>" +
        "<li>BFS : file, itératif, distances en nombre d'arêtes, O(n + m) avec listes d'adjacence.</li>" +
        "<li>DFS : récursif (pile d'appels), O(n + m), ne donne pas les distances.</li>" +
        "<li>Distances avec poids positifs : Dijkstra. Prim : glouton (arbre couvrant minimum).</li></ul></div>" +
        "<p>Pour expérimenter sur un graphe que tu modifies : l'atelier « BFS et DFS sur ton propre graphe ».</p>"
    }
  });
})();
