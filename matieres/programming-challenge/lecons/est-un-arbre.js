/* Leçon : Is it a tree (cours 5 Tree, Exercise 1 ; exercice exo5_1 ; sujet du midterm oral).
   Fil rouge : l'arbre de la diapo 2 du cours — 5 sommets, arêtes 1-3, 1-4, 4-2, 2-5 —
   qui est aussi le 1er des « More test cases ». */
(function () {
  "use strict";
  var el = Site.el;
  var G = EstArbre.EXEMPLE;

  /* ---------- petits utilitaires ---------- */
  function html(zone, contenu, classe) {
    var d = el("div", classe || "");
    d.innerHTML = contenu;
    zone.appendChild(d);
    return d;
  }
  function entree(zone, g, titre) {
    var d = el("div", "entree");
    if (titre) d.appendChild(el("span", "titre-entree", titre));
    d.appendChild(document.createTextNode(EstArbre.texteEntree(g)));
    zone.appendChild(d);
    return d;
  }
  function bouton(parent, texte, action, plein) {
    var b = el("button", "btn btn-petit" + (plein ? " btn-plein" : ""), texte);
    b.type = "button";
    b.onclick = action;
    parent.appendChild(b);
    return b;
  }
  function copie(g) { return { n: g.n, aretes: g.aretes.map(function (a) { return a.slice(); }), pos: g.pos }; }
  function cle(u, v) { return Math.min(u, v) + "-" + Math.max(u, v); }
  function oui(b) { return b ? "oui" : "non"; }

  /* Éditeur : toucher deux sommets ajoute ou retire l'arête entre eux.
     surChangement(g, props) est appelé après chaque modification. */
  function editeur(zone, surChangement) {
    var g = copie(G);
    var premier = null;
    zone.appendChild(el("p", "discret petit", "Touche deux sommets pour ajouter ou retirer l'arête entre eux."));
    var cadre = el("div", "cadre-figure");
    zone.appendChild(cadre);
    var fig = new FigureGraphe(cadre, {
      largeur: 350, hauteur: 195, titre: "Graphe à 5 sommets",
      onSommet: function (id) {
        var u = +id;
        if (premier === null) { premier = u; maj(false); return; }
        if (premier === u) { premier = null; maj(false); return; }
        var k = cle(premier, u);
        var avant = g.aretes.length;
        g.aretes = g.aretes.filter(function (a) { return cle(a[0], a[1]) !== k; });
        if (g.aretes.length === avant) g.aretes.push([Math.min(premier, u), Math.max(premier, u)]);
        premier = null;
        maj(true);
      }
    });
    var info = el("p", "legende-figure");
    zone.appendChild(info);
    var barre = el("div", "rangee-btn");
    zone.appendChild(barre);
    bouton(barre, "Revenir à l'arbre du cours", function () { g = copie(G); premier = null; maj(true); });
    function maj(change) {
      var v = EstArbre.vue(g, null);
      if (premier !== null) v.sommets[premier - 1].classe = "courant";
      fig.dessiner(v);
      var p = EstArbre.proprietes(g);
      var arbre = p.connexe && p.acyclique;
      info.innerHTML = "<span>n = <span class='mono'>5</span></span>" +
        "<span>arêtes = <span class='mono'>" + g.aretes.length + "</span></span>" +
        "<span>connexe : <span class='mono'>" + oui(p.connexe) + "</span></span>" +
        "<span>acyclique : <span class='mono'>" + oui(p.acyclique) + "</span></span>" +
        "<span>arbre : <span class='mono'>" + oui(arbre) + "</span></span>";
      if (change && surChangement) surChangement(g, p, arbre);
    }
    maj(false);
    return { graphe: function () { return g; } };
  }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Qu'est-ce qu'un arbre ?",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Définition (cours 5)</span>" +
        "En théorie des graphes, un arbre est un graphe <b>non orienté</b>, <b>acyclique</b> et <b>connexe</b>.</div>" +
        "<p>Le problème « Is it a tree » : on te donne N sommets et M arêtes d'un graphe non orienté, non pondéré ; " +
        "tu dois afficher <span class='mono'>YES</span> si c'est un arbre, <span class='mono'>NO</span> sinon.</p>" +
        "<p>Voici l'arbre de la diapo 2. Casse-le de deux façons différentes : une fois en créant un cycle, une fois en le coupant en morceaux.</p>",
      objectif: "Obtenir un graphe avec un cycle, puis un graphe non connexe (dans l'ordre que tu veux).",
      installer: function (zone, api) {
        var vuCycle = false, vuCoupe = false;
        editeur(zone, function (g, p) {
          if (!p.acyclique) vuCycle = true;
          if (!p.connexe) vuCoupe = true;
          if (!p.acyclique && !p.connexe) api.retour("Les deux à la fois : un cycle et plusieurs morceaux.", null);
          else if (!p.acyclique) api.retour("Un cycle : on peut tourner en rond. Ce n'est plus un arbre." + (vuCoupe ? "" : " Essaie maintenant de couper le graphe."), null);
          else if (!p.connexe) api.retour(p.composantes + " morceaux (composantes connexes) : ce n'est plus un arbre." + (vuCycle ? "" : " Essaie maintenant de créer un cycle."), null);
          else api.retour("Connexe et acyclique : c'est un arbre.", null);
          if (vuCycle && vuCoupe) api.valider("Les deux conditions sont indépendantes : il faut vérifier les deux. L'algorithme devra donc détecter « pas connexe » et « un cycle ».");
        });
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "N − 1 arêtes : nécessaire, pas suffisant",
      texte:
        "<p>Le cours le note sous les figures de la diapo 2 :</p>" +
        "<div class='formule'>Arbre ⟹ n sommets, n − 1 arêtes</div>" +
        "<p>La flèche ne va que dans un sens. Vérifie-le : garde <b>exactement 4 arêtes</b> sur les 5 sommets, mais fais en sorte que ce ne soit <b>pas</b> un arbre.</p>",
      objectif: "Construire un graphe à 5 sommets et 4 arêtes qui n'est pas un arbre.",
      installer: function (zone, api) {
        editeur(zone, function (g, p, arbre) {
          var m = g.aretes.length;
          if (m === 4 && !arbre) {
            api.retour("4 arêtes, et pourtant " + (!p.acyclique ? "un cycle" : "") + (!p.acyclique && !p.connexe ? " et " : "") + (!p.connexe ? p.composantes + " morceaux" : "") + ".", true);
            html(zone,
              "<span class='titre-encadre'>Ce qu'il faut retenir pour l'algorithme</span>" +
              "Compter les arêtes ne suffit pas : il faut <b>M = N − 1</b> <i>et</i> que le graphe soit <b>connexe</b>. " +
              "Avec ces deux conditions, il n'y a plus de cycle possible.", "encadre");
            html(zone,
              "Le cours n'énonce que le sens « arbre ⟹ n − 1 arêtes ». La propriété utilisée ici est classique : " +
              "pour un graphe à n sommets, deux des trois conditions <i>connexe</i>, <i>acyclique</i>, <i>n − 1 arêtes</i> entraînent la troisième. " +
              "Si on te demande à l'oral pourquoi « M = N − 1 et connexe » suffit, c'est elle qu'il faut citer.", "signalement");
            api.valider("C'est exactement le 4e cas de test du cours (arêtes 1-3, 1-4, 2-5, 3-4) : 4 arêtes, réponse NO.");
          } else if (m === 4) {
            api.retour("4 arêtes, et c'est un arbre. Déplace une arête sans changer leur nombre.", null);
          } else {
            api.retour(m + " arête" + (m > 1 ? "s" : "") + " : il en faut exactement 4.", null);
          }
        });
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "« What problems can arise ? »",
      texte:
        "<p>Le cours pose deux questions avant de coder : <i>What do we know of N ? Of M ?</i> L'énoncé (exo5_1) répond :</p>" +
        "<div class='encadre'><span class='mono'>0 &lt; N ≤ 10000</span>, <span class='mono'>0 ≤ M ≤ 20000</span>, " +
        "chaque arête est une paire <span class='mono'>u v</span> avec <span class='mono'>1 ≤ u, v ≤ N</span>.</div>" +
        "<p>Ce sont les cas limites qu'on te posera à l'oral. Pour chaque entrée, la sortie annoncée est-elle la bonne ?</p>",
      objectif: "Juger correctement les 5 affirmations sur les cas limites.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "<span class='mono'>1 0</span> (un sommet, aucune arête) → <span class='mono'>YES</span>", vrai: true,
              explication: "Un seul sommet : connexe, sans cycle, et M = 0 = N − 1. C'est un arbre." },
            { texte: "<span class='mono'>4 0</span> → <span class='mono'>YES</span>", vrai: false,
              explication: "4 sommets isolés : pas connexe (et M = 0 ≠ 3)." },
            { texte: "N = 10000, M = 20000 : on peut répondre <span class='mono'>NO</span> sans regarder les arêtes.", vrai: true,
              explication: "M ≠ N − 1 suffit pour conclure NO. C'est aussi ce qui rend la ligne 1 de l'algorithme utile." },
            { texte: "<span class='mono'>3 2 · 1 2 · 1 2</span> (la même arête deux fois) → <span class='mono'>YES</span>", vrai: false,
              explication: "M = N − 1, mais le sommet 3 n'est relié à rien : pas connexe. (Et 1-2 / 1-2 forment un cycle de longueur 2.)" },
            { texte: "<span class='mono'>2 1 · 2 2</span> (une boucle sur 2) → <span class='mono'>YES</span>", vrai: false,
              explication: "M = N − 1, mais l'arête 2-2 ne relie pas 1 à 2 : pas connexe." }
          ],
          surReussite: function () {
            html(zone,
              "L'énoncé ne dit pas si une arête peut apparaître deux fois ou relier un sommet à lui-même. " +
              "L'algorithme de la suite répond juste dans ces deux cas sans les traiter à part (une boucle ou un doublon « gaspille » une arête, " +
              "donc avec M = N − 1 le graphe ne peut plus être connexe).", "signalement");
            api.valider("Retiens les trois réflexes : M = N − 1 ? graphe connexe ? cas N = 1.");
          }
        });
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Lire l'entrée et construire Adj",
      texte:
        "<p>Solution 1 du cours : <i>« Build the graph with the list of edges »</i>. On le représente par des <b>listes d'adjacence</b> : " +
        "Adj[u] contient les voisins de u. Le graphe est non orienté, donc chaque arête <span class='mono'>u v</span> est ajoutée <b>dans les deux listes</b> (lignes 4-5 du pseudo-code).</p>" +
        "<p>Remplis Adj pour l'entrée du fil rouge, dans l'ordre où les arêtes sont lues (sépare les voisins par des espaces).</p>",
      objectif: "Remplir Adj[1] à Adj[5] correctement.",
      installer: function (zone, api) {
        entree(zone, G, "Entrée (stdin)");
        var adj = EstArbre.adjacence(G);
        var grille = el("div", "adj");
        zone.appendChild(grille);
        var champs = [];
        for (var u = 1; u <= G.n; u++) {
          var lab = el("label", null, "Adj[" + u + "] =");
          var c = el("input");
          c.type = "text"; c.autocomplete = "off"; c.placeholder = "ex. 3 4";
          c.id = "adj" + u; lab.htmlFor = c.id;
          grille.appendChild(lab); grille.appendChild(c);
          champs.push(c);
        }
        var b = el("button", "btn", "Vérifier");
        b.type = "button";
        zone.appendChild(b);
        function lire(s) { return s.trim().split(/[\s,;]+/).filter(Boolean).map(Number); }
        b.onclick = function () {
          var justes = 0, ordreOk = true;
          champs.forEach(function (c, i) {
            var att = adj[i + 1].map(function (x) { return x.v; });
            var val = lire(c.value);
            var memeEnsemble = val.slice().sort().join() === att.slice().sort().join();
            c.className = memeEnsemble ? "bon" : (c.value.trim() ? "faux" : "");
            if (memeEnsemble) justes++;
            if (memeEnsemble && val.join() !== att.join()) ordreOk = false;
          });
          if (justes === G.n) {
            champs.forEach(function (c) { c.disabled = true; });
            b.disabled = true;
            api.retour(ordreOk ? "Exact, et dans l'ordre de lecture." :
              "Exact. (Dans l'ordre de lecture, Adj[4] = 1 2 et Adj[2] = 4 5 : c'est cet ordre que suivra la trace.)", true);
            html(zone,
              "<span class='titre-encadre'>En Python</span>" +
              "<div class='code'>import sys\n" +
              "<span class='com'># toute l'entrée d'un coup</span>\n" +
              "data = sys.stdin.buffer.read().split()\n" +
              "n, m = int(data[0]), int(data[1])\n" +
              "<span class='com'># Adj[1..n] ; la case 0 ne sert pas</span>\n" +
              "adj = [[] for _ in range(n + 1)]\n" +
              "for i in range(m):\n" +
              "    u = int(data[2 + 2*i])\n" +
              "    v = int(data[3 + 2*i])\n" +
              "    adj[u].append(v)\n" +
              "    adj[v].append(u)  <span class='com'># dans les 2 sens</span></div>" +
              "Total des longueurs des listes : 2M = 8. Une matrice d'adjacence N × N coûterait N² cases : 10<sup>8</sup> pour N = 10 000.", "encadre");
            api.valider("Chaque arête apparaît deux fois dans Adj : c'est pour ça que le parcours examinera 2M voisins.");
          } else {
            api.retour(justes + " liste" + (justes > 1 ? "s" : "") + " juste" + (justes > 1 ? "s" : "") + " sur 5. Les listes barrées sont fausses : n'oublie pas que 4 2 met 2 dans Adj[4] et 4 dans Adj[2].", false);
          }
        };
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le parcours en largeur (BFS), pas à pas",
      texte:
        "<p>Solution 1, suite : <i>« Check using BFS that all the nodes are visited once »</i>. On part du sommet 1 avec une file F ; " +
        "chaque sommet est marqué dans vu[] au moment où on l'enfile, donc enfilé <b>une seule fois</b> ; compte = nombre de sommets marqués.</p>" +
        "<p><b>Prédis</b> d'abord l'ordre dans lequel les sommets sont défilés (les voisins sont pris dans l'ordre d'Adj), puis vérifie avec la trace en dessous.</p>",
      objectif: "Donner l'ordre de défilement du BFS depuis 1.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche les sommets dans l'ordre où ils sortent de la file.",
          items: ["1", "3", "4", "2", "5"],
          separateur: "→",
          bravo: "Bon ordre : 1, 3, 4, 2, 5.",
          surReussite: function () {
            api.valider("Le BFS avance par « niveaux » : d'abord les voisins de 1 (3 et 4), puis les voisins de ceux-ci (2), etc. À la fin, compte = 5 = N.");
          }
        });
        zone.appendChild(el("h3", null, "La trace"));
        var p = TraceArbre.panneau(zone, { delai: 750 });
        p.charger(G);
        return function () { p.stop(); };
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "La décision, sur les 4 cas du cours",
      texte:
        "<p>Ligne 1 : si M ≠ N − 1, on répond NO tout de suite. Sinon on fait le BFS et on répond YES si et seulement si <b>compte = N</b> (tous les sommets atteints depuis 1 : le graphe est connexe).</p>" +
        "<p>Voici les « More test cases » du cours. Pour chacun, donne la sortie et à quelle ligne l'algorithme conclut — comme à l'oral, à partir du texte de l'entrée.</p>",
      objectif: "Décider correctement les 4 cas.",
      installer: function (zone, api) {
        var cas = EstArbre.CAS_COURS;
        var k = 0;
        var haut = el("div");
        zone.appendChild(haut);
        var bas = el("div");
        zone.appendChild(bas);
        var p = null;
        var options = ["YES", "NO — dès la ligne 1 : M ≠ N − 1", "NO — après le BFS : compte < N"];
        function bonne(c) {
          var d = EstArbre.decider(c);
          return d.reponse === "YES" ? 0 : d.raison === "m" ? 1 : 2;
        }
        var expl = [
          "YES : M = 4 = N − 1, et le BFS atteint les 5 sommets (c'est le fil rouge).",
          "NO dès la ligne 1 : M = 5 ≠ 4. (Il y a d'ailleurs un cycle 1-3-4.)",
          "NO dès la ligne 1 : M = 3 ≠ 4. (Le graphe n'est pas connexe non plus.)",
          "NO après le BFS : M = 4 = N − 1, mais depuis 1 on n'atteint que 1, 3, 4 → compte = 3 < 5. Le cycle 1-3-4 « vole » une arête, et {2, 5} reste à part."
        ];
        function suivant() {
          haut.innerHTML = "";
          if (k >= cas.length) {
            api.valider("Deux façons d'échouer : le nombre d'arêtes (ligne 1) ou la connexité (compte < N). Le cas 4 est le piège classique.");
            return;
          }
          entree(haut, cas[k], "Cas " + (k + 1) + " sur 4");
          var b = bonne(cas[k]);
          Exercices.choix(haut, {
            options: options, bonne: b,
            expliquer: options.map(function (o, i) { return i === b ? expl[k] : "Non. Recalcule M et N − 1, puis regarde quels sommets on atteint depuis 1."; }),
            surReussite: function () {
              if (!p) { bas.appendChild(el("h3", null, "Trace du cas")); p = TraceArbre.panneau(bas, { delai: 550 }); }
              p.charger(cas[k], { forcer: false });
              var suite = el("div", "rangee-btn");
              haut.appendChild(suite);
              k++;
              bouton(suite, k < cas.length ? "Cas suivant →" : "Terminer", suivant, true);
            }
          });
        }
        suivant();
        return function () { if (p) p.stop(); };
      }
    },

    /* 7 ─────────────────────────────────────────────────────────── */
    {
      titre: "Coût et choix d'implémentation",
      texte:
        "<p>Partie « Code » de l'oral : il faut justifier la performance. Donne le coût de chaque morceau du pseudo-code.</p>",
      objectif: "Retrouver le coût de chaque partie, puis choisir les bonnes options Python.",
      installer: function (zone, api) {
        var pc = new PseudoCode(zone, { titre: "EST-UN-ARBRE(N, M, arêtes)", lignes: EstArbre.LIGNES });
        pc.surligner(null);
        var choixCout = ["?", "O(1)", "O(N)", "O(M)", "O(N + M)", "O(N × M)", "O(N²)"];
        var questions = [
          { label: "lignes 1-2 (test sur M)", bonne: "O(1)", l: 1 },
          { label: "ligne 3 (initialiser Adj et vu)", bonne: "O(N)", l: 3 },
          { label: "lignes 4-5 (remplir Adj)", bonne: "O(M)", l: 4 },
          { label: "lignes 6-12 (BFS)", bonne: "O(N + M)", l: 7 },
          { label: "algorithme complet", bonne: "O(N + M)", l: null }
        ];
        var selects = [];
        questions.forEach(function (q) {
          var ligne = el("div", "saisie");
          ligne.style.margin = ".35rem 0";
          var lab = el("label", null, q.label);
          lab.style.flex = "1 1 12rem";
          var s = el("select");
          choixCout.forEach(function (o) { var op = el("option", null, o); op.value = o; s.appendChild(op); });
          s.addEventListener("focus", function () { pc.surligner(q.l); });
          s.addEventListener("change", verifier);
          ligne.appendChild(lab); ligne.appendChild(s);
          zone.appendChild(ligne);
          selects.push(s);
        });
        var suite = el("div");
        zone.appendChild(suite);
        var fait = false;
        function verifier() {
          var justes = 0, remplies = 0;
          selects.forEach(function (s, i) { if (s.value !== "?") remplies++; if (s.value === questions[i].bonne) justes++; });
          if (justes === questions.length && !fait) {
            fait = true;
            selects.forEach(function (s) { s.disabled = true; });
            api.retour("Juste. Le BFS : chaque sommet est enfilé et défilé au plus une fois (N), chaque liste Adj[u] est parcourue une fois, soit 2M voisins examinés.", true);
            html(suite,
              "Après la ligne 1, on sait que M = N − 1 : le BFS coûte donc O(N). Avec N ≤ 10 000, c'est quelques dizaines de milliers d'opérations : instantané.", "encadre");
            seconde();
          } else if (!fait && remplies === questions.length) {
            api.retour(justes + " sur " + questions.length + ". Corrige les autres (le BFS regarde chaque sommet et chaque liste d'adjacence).", false);
          }
        }
        function seconde() {
          suite.appendChild(el("h3", null, "Et en Python ?"));
          Exercices.cocher(suite, {
            question: "Quels choix évitent un <i>Time Limit Exceeded</i> ou un <i>Runtime Error</i> ?",
            options: [
              "La file avec <span class='mono'>collections.deque</span> : <span class='mono'>append</span> / <span class='mono'>popleft</span>",
              "La file avec une liste : <span class='mono'>append</span> / <span class='mono'>pop(0)</span>",
              "Lire toute l'entrée d'un coup : <span class='mono'>sys.stdin.buffer.read().split()</span>",
              "Un DFS récursif, sans autre précaution",
              "Répondre <span class='mono'>NO</span> dès que M ≠ N − 1"
            ],
            bonnes: [0, 2, 4],
            explication:
              "<span class='mono'>pop(0)</span> décale toute la liste : O(longueur) à chaque défilement, O(N²) au pire. " +
              "Un DFS récursif sur une « chaîne » de 10 000 sommets dépasse la limite de récursion de Python (1000 par défaut) : <i>RecursionError</i>, donc Runtime Error. " +
              "Le BFS itératif avec <span class='mono'>deque</span> n'a aucun de ces problèmes.",
            surReussite: function () {
              html(suite,
                "<div class='code'>from collections import deque\n" +
                "F = deque([1])\n" +
                "u = F.popleft()    <span class='com'># O(1)</span>\n" +
                "F.append(v)        <span class='com'># O(1)</span></div>", "");
              api.valider("Tu as les arguments de la partie « Code » : O(N + M), deque, lecture d'un bloc, pas de récursion.");
            }
          });
        }
      }
    },

    /* 8 ─────────────────────────────────────────────────────────── */
    {
      titre: "La « Solution 2 » du cours",
      texte:
        "<p>Le cours propose une seconde solution, sans construire le graphe :</p>" +
        "<div class='pseudo'><span class='titre-pseudo'>Solution 2: Check on the list (diapo 7)</span>" +
        "<div class='ligne'><span class='c'>if it can be a tree then</span></div>" +
        "<div class='ligne'><span class='c'>    Maintain a visit array</span></div>" +
        "<div class='ligne'><span class='c'>    Check that all the nodes are visited exactly once</span></div></div>" +
        "<div class='signalement'>La diapo n'en dit pas plus : ni ce que veut dire « visited », ni comment on parcourt la liste. " +
        "Ce qui suit est une interprétation, pas le contenu du cours.</div>" +
        "<p>Lecture naïve : « si M = N − 1, marquer les deux extrémités de chaque arête de la liste, puis vérifier que tous les sommets sont marqués ». " +
        "Parmi les 4 cas du cours, lequel la met en défaut ?</p>",
      objectif: "Trouver le cas où la lecture naïve répond faux.",
      installer: function (zone, api) {
        var d = el("div", "entrees");
        zone.appendChild(d);
        EstArbre.CAS_COURS.forEach(function (c, i) { entree(d, c, "Cas " + (i + 1)); });
        Exercices.choix(zone, {
          question: "La lecture naïve se trompe sur le…",
          options: ["Cas 1", "Cas 2", "Cas 3", "Cas 4"],
          bonne: 3,
          expliquer: [
            "Non : le cas 1 est un arbre, et la lecture naïve répond bien YES.",
            "Non : M = 5 ≠ 4, la lecture naïve répond NO, c'est juste.",
            "Non : M = 3 ≠ 4, NO, c'est juste.",
            "Oui : M = 4 = N − 1 et les sommets 1 à 5 apparaissent tous dans la liste, donc la lecture naïve dit YES. Or le graphe a un cycle 1-3-4 et n'est pas connexe : NO."
          ],
          surReussite: function () {
            html(zone,
              "<span class='titre-encadre'>Une vraie vérification « sur la liste » : union-find (hors cours)</span>" +
              "On lit les arêtes une à une en maintenant des groupes de sommets déjà reliés. Pour l'arête u v : si u et v sont déjà dans le même groupe, " +
              "cette arête ferme un <b>cycle</b> → NO ; sinon on fusionne leurs groupes. Avec M = N − 1 et aucun cycle, c'est un arbre. " +
              "Coût presque linéaire en M. À ne citer à l'oral que comme alternative : ta solution reste le BFS.", "encadre");
            api.valider("La « visite » doit suivre les arêtes (BFS, ou groupes d'union-find) : regarder seulement quels sommets apparaissent ne suffit pas.");
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "est-un-arbre",
    etapes: etapes,
    fin: {
      cartes: "oral-est-un-arbre",
      texte:
        "<div class='encadre'><span class='titre-encadre'>À retenir pour l'oral</span><ul>" +
        "<li>Arbre = graphe non orienté, acyclique, connexe. Arbre ⟹ N − 1 arêtes, mais pas l'inverse (cas 4 du cours).</li>" +
        "<li>Algorithme : si M ≠ N − 1 → NO ; sinon BFS depuis 1 avec vu[] et compte ; YES ssi compte = N.</li>" +
        "<li>Coût O(N + M) en temps et en mémoire (listes d'adjacence, 2M entrées).</li>" +
        "<li>Python : <span class='mono'>deque</span>, lecture d'un bloc, pas de DFS récursif (limite de récursion).</li>" +
        "<li>Cas limites : N = 1 (YES), M = 0, arête répétée, boucle.</li></ul></div>" +
        "<p>Prochaine étape : l'atelier « Trace au tableau », pour t'entraîner sur des entrées que tu n'as jamais vues.</p>"
    }
  });
})();
