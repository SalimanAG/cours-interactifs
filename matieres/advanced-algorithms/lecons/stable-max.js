/* Leçon : Branching pour le stable maximum (cours 4).
   Fil rouge : le graphe de la diapo « Branching » du cours 4 (sommets x, a, b, c, d, e, f, g ; 11 arêtes). */
(function () {
  "use strict";
  var el = Site.el;
  var G = Stable.EXEMPLE;
  var N = Stable.voisins(G);
  var TOUS = G.sommets.map(function (s) { return s.id; });
  var ARBRE = Stable.arbre(G);
  var ALPHA = ARBRE.alpha;

  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function figure(zone, opts) {
    var o = { largeur: 270, hauteur: 190 };
    for (var k in opts) o[k] = opts[k];
    return new FigureGraphe(cadre(zone), o);
  }
  /* classeS(v), sousS(v), classeA(a) facultatifs */
  function vue(classeS, sousS, classeA) {
    return {
      sommets: G.sommets.map(function (s) { return { id: s.id, x: s.x, y: s.y, label: s.id, classe: classeS ? classeS(s.id) : "", sous: sousS ? sousS(s.id) : "" }; }),
      aretes: G.aretes.map(function (a) { return { id: a.id, u: a.u, v: a.v, classe: classeA ? classeA(a) : "" }; })
    };
  }
  function ens(l) { return "{" + l.slice().sort().join(", ") + "}"; }
  function degre(v, presents) { return N[v].filter(function (w) { return presents.indexOf(w) >= 0; }).length; }

  var etapes = [
    {
      titre: "Stable maximum ou stable maximal ?",
      texte: "<div class='encadre'><span class='titre-encadre'>Définition (cadre : graphes simples, non orientés, sans boucle)</span>" +
        "Un <b>stable</b> dans un graphe G = (V, E) est un sous-ensemble S ⊆ V de sommets deux à deux non adjacents (aucune arête entre les sommets de S). " +
        "Un <b>stable maximum</b> est un stable S dont le nombre de sommets |S| est maximum (parmi tous les stables de G).</div>" +
        "<p>Remarque du cours : stable maximum ≠ stable maximal. Un stable est <b>maximal</b> si on ne peut plus lui ajouter aucun sommet. " +
        "Touche les sommets pour construire S (les arêtes en conflit passent en couleur).</p>",
      objectif: "Trouver un stable maximal qui n'est pas maximum, puis un stable maximum.",
      installer: function (zone, api) {
        var S = {}, vuMaximal = false, vuMaximum = false;
        var fig = figure(zone, { onSommet: function (v) { S[v] = !S[v]; maj(); } });
        var info = el("p", "legende-figure"); zone.appendChild(info);
        function maj() {
          var l = TOUS.filter(function (v) { return S[v]; });
          var conflits = G.aretes.filter(function (a) { return S[a.u] && S[a.v]; });
          fig.dessiner(vue(function (v) { return S[v] ? "plein" : ""; }, null, function (a) { return S[a.u] && S[a.v] ? "courante" : ""; }));
          var stable = !conflits.length;
          var ajoutables = TOUS.filter(function (v) { return !S[v] && N[v].every(function (w) { return !S[w]; }); });
          var maximal = stable && l.length && !ajoutables.length;
          info.innerHTML = "<span>S = <span class='mono'>" + ens(l) + "</span></span><span>|S| = <span class='mono'>" + l.length + "</span></span>" +
            "<span>" + (!stable ? "pas un stable" : maximal ? "stable maximal" : l.length ? "stable, on peut encore ajouter " + ens(ajoutables) : "") + "</span>";
          if (!stable) { api.retour("Deux sommets de S sont adjacents.", false); return; }
          if (maximal && l.length < ALPHA && !vuMaximal) { vuMaximal = true; api.retour("Stable maximal de taille " + l.length + " : on ne peut plus rien ajouter… mais il existe un stable plus grand.", true); }
          else if (maximal && l.length === ALPHA) { vuMaximum = true; api.retour("Stable maximum : |S| = " + ALPHA + ".", true); }
          else api.retour(vuMaximal ? "Stable maximal non maximum trouvé ; cherche maintenant un stable de taille " + ALPHA + "." : "", null);
          if (vuMaximal && vuMaximum) api.valider("Un stable maximum est toujours maximal, mais pas l'inverse : {b, d} est maximal (tous les autres sommets touchent b ou d) et pourtant de taille 2 < 3.");
        }
        maj();
      }
    },

    {
      titre: "Un problème difficile, une recherche exhaustive",
      texte: "<p>Problème classique : les arêtes représentent des incompatibilités et on veut un ensemble maximum d'entités compatibles " +
        "(exemple du cours : le nombre maximum de séances de CM/TD/TP qu'un étudiant peut suivre dans la semaine, avec une arête entre deux séances qui se chevauchent). " +
        "Difficulté de calcul : <b>NP-complet</b>.</p>" +
        "<div class='encadre'><span class='titre-encadre'>Algo brute force</span>On considère un par un tous les sous-ensembles de sommets ; pour chacun, on teste si c'est un stable ; on en garde un de taille maximum.</div>",
      objectif: "Donner la complexité de la recherche exhaustive, puis le gain du branching.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Complexité de l'algo brute force ?",
          options: ["O(n + m)", "O(n²)", "O((n + m) · 2ⁿ)", "O(1,45ⁿ)"],
          bonne: 2,
          expliquer: [
            "Non : c'est le coût du test d'UN sous-ensemble.",
            "Non : il y a un nombre exponentiel de sous-ensembles.",
            "Exact : 2ⁿ sous-ensembles, chacun testé en O(n + m). On écrit aussi O*(2ⁿ) (on cache les facteurs polynomiaux).",
            "Non : c'est la complexité du branching qu'on va construire."
          ],
          surReussite: function () {
            Exercices.choix(zone, {
              question: "Le branching sera en O(1,45ⁿ). Pour n = 100, que vaut à peu près 2ⁿ / 1,45ⁿ ?",
              options: ["≈ 10²", "≈ 10⁷", "≈ 10¹⁴", "≈ 10³⁰"],
              bonne: 2,
              expliquer: [
                "Non : (2/1,45)¹⁰⁰ = 1,38¹⁰⁰.",
                "Non : 1,38¹⁰ ≈ 25, donc 1,38¹⁰⁰ ≈ 25¹⁰.",
                "Exact : (2/1,45)¹⁰⁰ ≈ 1,38¹⁰⁰ ≈ 9 × 10¹³. Toujours exponentiel, mais cent mille milliards de fois plus rapide.",
                "Non : trop grand ; 1,38¹⁰⁰ ≈ 9 × 10¹³."
              ],
              surReussite: function () { api.valider(); }
            });
          }
        });
      }
    },

    {
      titre: "Deux propriétés simples",
      texte: "<div class='encadre'><span class='titre-encadre'>Propriétés</span>" +
        "<b>P1.</b> Si S est un stable et x ∈ S alors S ∩ N(x) = ∅.<br>" +
        "<b>P2.</b> Si S est un stable maximum (donc maximal) et x ∈ V alors S ∩ ({x} ∪ N(x)) ≠ ∅.</div>" +
        "<p>Ici S = {a, c, f} est un stable maximum (sommets pleins). Touche des sommets x : leur voisinage fermé {x} ∪ N(x) est encadré, et on regarde ce qu'il a en commun avec S.</p>",
      objectif: "Vérifier P2 sur trois sommets x différents.",
      installer: function (zone, api) {
        var S = ["a", "c", "f"], testes = {};
        var x = null;
        var fig = figure(zone, { onSommet: function (v) { x = v; testes[v] = true; maj(); } });
        var info = el("p", "legende-figure"); zone.appendChild(info);
        function maj() {
          var ferme = x ? [x].concat(N[x]) : [];
          fig.dessiner(vue(function (v) { return (S.indexOf(v) >= 0 ? "plein" : "") + (ferme.indexOf(v) >= 0 ? " courant" : ""); }, null,
            function (a) { return x && (a.u === x || a.v === x) ? "traverse" : ""; }));
          if (!x) { info.innerHTML = ""; return; }
          var inter = ferme.filter(function (v) { return S.indexOf(v) >= 0; });
          info.innerHTML = "<span>{" + x + "} ∪ N(" + x + ") = <span class='mono'>" + ens(ferme) + "</span></span><span>∩ S = <span class='mono'>" + ens(inter) + "</span></span>";
          var nb = Object.keys(testes).length;
          api.retour(inter.length ? "Intersection non vide (" + nb + " sommet" + (nb > 1 ? "s" : "") + " testé" + (nb > 1 ? "s" : "") + ")." : "Intersection vide ?!", inter.length > 0);
          if (nb >= 3) api.valider("Si l'intersection était vide, on pourrait ajouter x à S : S ne serait pas maximal. Donc tout stable maximum contient x ou l'un de ses voisins — c'est la disjonction de cas du branching.");
        }
        maj();
      }
    },

    {
      titre: "Brancher sur un sommet",
      texte: "<div class='encadre'><span class='titre-encadre'>Branching pour le stable maximum</span>" +
        "Pour un sommet x, on fait un cas pour chaque sommet y ∈ {x} ∪ N(x) : on met y dans le stable solution S, on retire y et N(y) de G pour obtenir G̃<sub>y</sub>, " +
        "on résout le problème sur G̃<sub>y</sub>. Pour G on prend la meilleure solution obtenue sur les G̃<sub>y</sub>. " +
        "On choisit bien le sommet x : <b>un sommet de degré minimum</b>.</div>" +
        "<p>Touche d'abord un sommet de degré minimum (les degrés sont affichés), puis chacun des cas y.</p>",
      objectif: "Choisir un sommet de degré minimum et explorer tous ses cas.",
      installer: function (zone, api) {
        var x = null, y = null, vus = {};
        var dmin = Math.min.apply(null, TOUS.map(function (v) { return N[v].length; }));
        var fig = figure(zone, { onSommet: function (v) {
          if (!x) {
            if (N[v].length !== dmin) { api.retour("d(" + v + ") = " + N[v].length + " : ce n'est pas un degré minimum (" + dmin + ").", false); return; }
            x = v; api.retour("x = " + v + " : " + (N[v].length + 1) + " cas, y ∈ " + ens([v].concat(N[v])) + ".", null); maj(); return;
          }
          var cas = [x].concat(N[x]);
          if (cas.indexOf(v) < 0) { api.retour(v + " n'est pas dans {" + x + "} ∪ N(" + x + ").", false); return; }
          y = v; vus[v] = true; maj();
          if (Object.keys(vus).length === cas.length) {
            api.retour("Les " + cas.length + " cas sont explorés.", true);
            api.valider("Avec x de degré d, on obtient d + 1 sous-problèmes. Choisir x de degré minimum, c'est réduire le nombre de branches.");
          }
        } });
        var info = el("p", "legende-figure"); zone.appendChild(info);
        var b = el("button", "btn btn-petit", "Changer de sommet x"); b.type = "button";
        b.onclick = function () { x = null; y = null; vus = {}; api.retour("", null); maj(); };
        zone.appendChild(b);
        function maj() {
          var retires = y ? [y].concat(N[y]) : [];
          var cas = x ? [x].concat(N[x]) : [];
          fig.dessiner(vue(function (v) {
            if (y) return v === y ? "plein" : retires.indexOf(v) >= 0 ? "retire" : "";
            return v === x ? "courant" : "";
          }, function (v) { return y ? "" : "d=" + N[v].length; }, function (a) {
            return y && (retires.indexOf(a.u) >= 0 || retires.indexOf(a.v) >= 0) ? "estompee" : "";
          }));
          var restants = TOUS.filter(function (v) { return retires.indexOf(v) < 0; });
          info.innerHTML = x ? "<span>x = " + x + "</span><span>cas : <span class='mono'>" + cas.map(function (c) { return vus[c] ? c + "✓" : c; }).join(" ") + "</span></span>" +
            (y ? "<span>G̃<sub>" + y + "</sub> = <span class='mono'>" + ens(restants) + "</span> (" + restants.length + " sommets)</span>" : "") : "<span>degré minimum = " + dmin + "</span>";
        }
        maj();
      }
    },

    {
      titre: "L'arbre de récursion",
      texte: "<p>L'algorithme s'appelle récursivement sur chaque G̃<sub>y</sub>, qui est plus petit. Le truc essentiel : une <b>structure arborescente</b>. " +
        "Déroule-le sur le graphe (x de degré minimum ; à égalité, le premier dans l'ordre x, a, b, e, d, f, c, g). En haut l'arbre, en bas le graphe courant : S en plein, sommets retirés en pointillés.</p>",
      objectif: "Dérouler tout l'arbre de récursion.",
      installer: function (zone, api) {
        var arbreFig = new FigureGraphe(cadre(zone), { largeur: 340, hauteur: 150 });
        var fig = figure(zone, {});
        var info = el("p", "legende-figure"); zone.appendChild(info);
        var pos = Stable.disposer(ARBRE.noeuds, 340, 150);
        var ctl = new Controleur(zone, {
          delai: 700,
          afficher: function (k) {
            var n = ARBRE.noeuds[k];
            arbreFig.dessiner({
              sommets: ARBRE.noeuds.filter(function (m) { return m.id <= k; }).map(function (m) {
                var cl = "petit" + (m.id === k ? " courant" : "") + (m.feuille && m.S.length === ALPHA ? " plein" : "");
                return { id: "n" + m.id, x: pos[m.id].x, y: pos[m.id].y, label: m.y || "G", classe: cl };
              }),
              aretes: ARBRE.noeuds.filter(function (m) { return m.id <= k && m.parent !== null; }).map(function (m) {
                return { id: "e" + m.id, u: "n" + m.parent, v: "n" + m.id };
              })
            });
            fig.dessiner(vue(function (v) { return n.S.indexOf(v) >= 0 ? "plein" : n.presents.indexOf(v) < 0 ? "retire" : v === n.x ? "courant" : ""; }, null,
              function (a) { return n.presents.indexOf(a.u) < 0 || n.presents.indexOf(a.v) < 0 ? "estompee" : ""; }));
            info.innerHTML = "<span>nœud " + (k + 1) + "</span><span>S = <span class='mono'>" + ens(n.S) + "</span></span>" +
              (n.feuille ? "<span>graphe vide : stable de taille " + n.S.length + "</span>" : "<span>on branche sur x = " + n.x + " (degré " + degre(n.x, n.presents) + ")</span>");
          },
          surFin: function () {
            var f = ARBRE.noeuds.filter(function (m) { return m.feuille; }).length;
            api.retour(ARBRE.noeuds.length + " nœuds, " + f + " feuilles ; meilleur stable : " + ens(ARBRE.meilleur.S) + ", de taille " + ALPHA + ".", true);
            api.valider("Correction : OK car on couvre tous les cas (P2). Complexité : O(n + m) par nœud, donc O((n + m) · T(n)) où T(n) est le nombre de nœuds de l'arbre dans le pire des cas.");
          }
        });
        ctl.charger(ARBRE.noeuds.length);
        return function () { ctl.stop(); };
      }
    },

    {
      titre: "Majorer T(n)",
      texte: "<p>On branche sur x de degré d, avec N(x) = {y₁, …, y<sub>d</sub>} : on obtient des graphes à n − d − 1, n − d(y₁) − 1, …, n − d(y<sub>d</sub>) − 1 sommets. " +
        "Remets la démonstration du cours dans l'ordre.</p>",
      objectif: "Ordonner les étapes de la majoration de T(n).",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche les étapes dans l'ordre.",
          items: [
            "x est de degré minimum : d(yᵢ) ≥ d pour tout i",
            "T est croissante : T(n − d(yᵢ) − 1) ≤ T(n − d − 1)",
            "T(n) ≤ 1 + (d + 1) T(n − (d + 1)), soit T(n) ≤ 1 + s T(n − s) avec s = d + 1",
            "En déroulant : T(n) ≤ 1 + s + s² + … + s^(n/s) = O(s^(n/s))"
          ],
          bravo: "C'est la majoration du cours.",
          surReussite: function () { api.valider("Il reste à savoir quel s est le pire : c'est l'étape suivante."); }
        });
      }
    },

    {
      titre: "Le pire cas : s = 3",
      texte: "<p>O(s<sup>n/s</sup>) = O((s<sup>1/s</sup>)ⁿ). Le pire cas est le s qui maximise s<sup>1/s</sup> parmi les entiers. Fais varier s.</p>" +
        "<div class='signalement'>Le cours écrit « ça reste vrai dans le cas général car on a choisi le “pire” d = 3 ». Avec s = d + 1, le maximum s = 3 correspond à d = 2 : " +
        "il s'agit sans doute de s = 3. À vérifier avec ton enseignant.</div>",
      objectif: "Trouver l'entier s qui maximise s^(1/s).",
      installer: function (zone, api) {
        var lab = el("label"), c = el("input"); c.type = "range"; c.min = 1; c.max = 8; c.value = 2;
        var t = el("table", "tableau");
        zone.appendChild(lab); zone.appendChild(c); zone.appendChild(t);
        function maj() {
          var s = +c.value;
          lab.innerHTML = "s = <span class='mono'>" + s + "</span> (degré d = " + (s - 1) + ")";
          t.innerHTML = "<tr><th>s</th><th class='num'>s^(1/s)</th></tr>" + [1, 2, 3, 4, 5, 6, 7, 8].map(function (k) {
            return "<tr" + (k === s ? " style='font-weight:600'" : "") + "><td class='mono'>" + k + "</td><td class='num'>" + Math.pow(k, 1 / k).toFixed(4) + "</td></tr>";
          }).join("");
        }
        c.addEventListener("input", maj);
        maj();
        Exercices.nombre(zone, {
          label: "s maximisant s^(1/s) :", attendu: 3, tolerance: 0, placeholder: "entier",
          indice: "Compare 2^(1/2), 3^(1/3) et 4^(1/4) dans le tableau.",
          bravo: "s = 3 : 3^(1/3) ≈ 1,442. D'où T(n) = O(3^(n/3)) = O(1,45ⁿ), et l'algo est en O((n + m) · 1,45ⁿ) = O*(1,45ⁿ).",
          surReussite: function () { api.valider("Attention : ce calcul suppose qu'on branche toujours sur des sommets de même degré ; le cadre général de l'étape suivante règle le cas mixte."); }
        });
      }
    },

    {
      titre: "Vecteur et facteur de branchement",
      texte: "<div class='encadre'><span class='titre-encadre'>Cadre général</span>" +
        "<b>Branching vector.</b> Si le branchement sur un graphe à n sommets produit des graphes à n − t₁, n − t₂, …, n − t<sub>r</sub> sommets, " +
        "le branching vector de la règle est (t₁, t₂, …, t<sub>r</sub>).<br>" +
        "<b>Branching factor.</b> On a alors T(n) ≤ αⁿ où α est l'unique racine réelle (> 1) du polynôme xⁿ − x<sup>n−t₁</sup> − … − x<sup>n−t<sub>r</sub></sup> ; α est noté τ(t₁, …, t<sub>r</sub>). " +
        "Avec plusieurs règles, T(n) ≤ αⁿ avec α le plus grand (le pire) des branching factors.</div>" +
        "<p>Calcule des τ, puis compare les branchements notés à la main sur la diapo du cours : le meilleur est celui de plus petit τ.</p>",
      objectif: "Dire, pour chaque paire, quel branchement est le plus efficace.",
      installer: function (zone, api) {
        var ligne = el("div", "saisie");
        var lab = el("label", null, "vecteur :");
        var inp = el("input"); inp.type = "text"; inp.value = "3, 3, 3"; inp.style.width = "10rem";
        var out = el("span", "mono");
        ligne.appendChild(lab); ligne.appendChild(inp); ligne.appendChild(out);
        zone.appendChild(ligne);
        function calc() {
          var t = inp.value.split(/[,; ]+/).map(Number).filter(function (x) { return x > 0; });
          out.textContent = t.length ? "τ = " + Stable.tau(t).toFixed(4) : "";
        }
        inp.addEventListener("input", calc); calc();
        Exercices.associer(zone, {
          consigne: "Pour chaque paire, lequel est le plus efficace ?",
          categories: ["le premier", "le second"],
          items: [
            { texte: "(2, 2, 2) ou (3, 3, 3)", bonne: 1, explication: "τ(2,2,2) ≈ 1,732 ; τ(3,3,3) ≈ 1,442 (c'est la règle du cours avec d = 2)." },
            { texte: "(2, 2) ou (2, 2, 2, 2)", bonne: 0, explication: "τ(2,2) ≈ 1,414 ; τ(2,2,2,2) = 2." },
            { texte: "(3, 3, 3, 3) ou (2, 2, 2)", bonne: 0, explication: "τ(3,3,3,3) ≈ 1,587 ; τ(2,2,2) ≈ 1,732." },
            { texte: "(1, 2) ou (2, 2, 2)", bonne: 0, explication: "τ(1,2) ≈ 1,618 (le nombre d'or) ; τ(2,2,2) ≈ 1,732." }
          ],
          surReussite: function () { api.valider("Plus de branches et des réductions plus petites font grandir τ. Notre règle sur un sommet de degré d a pour vecteur (d+1, …, d+1), d + 1 fois."); }
        });
      }
    },

    {
      titre: "Remarques finales",
      texte: "<p>Le cours pose une question : <b>pourquoi gagne-t-on du temps par rapport à l'algo brute force ?</b> " +
        "et fait une remarque : avec cet algo, on a en fait tous les stables maximum… par contre on les a plusieurs fois chacun.</p>" +
        "<div class='signalement'>La réponse à la question n'est pas écrite dans le cours. Piste (de moi) : la brute force examine les 2ⁿ sous-ensembles, " +
        "y compris ceux qui contiennent deux sommets adjacents ; le branching n'explore que des stables, et seulement en ajoutant un sommet de chaque voisinage fermé — " +
        "d'après P2, aucun stable maximum n'est perdu.</div>",
      objectif: "Classer chaque affirmation en vrai ou faux.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "L'algorithme est correct car il couvre tous les cas.", vrai: true, explication: "Par P2, tout stable maximum contient un sommet de {x} ∪ N(x)." },
            { texte: "Chaque nœud de l'arbre se traite en O(n + m).", vrai: true, explication: "Retirer y et N(y), choisir un sommet de degré minimum." },
            { texte: "L'algorithme trouve tous les stables maximum.", vrai: true, explication: "Remarque du cours." },
            { texte: "Chaque stable maximum est trouvé exactement une fois.", vrai: false, explication: "On les a plusieurs fois chacun (voir l'atelier du TP2 sur l'hexagone)." },
            { texte: "On choisit x de degré minimum pour réduire le nombre de branches.", vrai: true, explication: "d + 1 branches pour un sommet de degré d." }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "stable-max",
    etapes: etapes,
    fin: {
      cartes: "branching",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir (cours 4)</span><ul>" +
        "<li>Stable : sommets deux à deux non adjacents ; maximum ≠ maximal ; NP-complet.</li>" +
        "<li>Brute force O((n + m) · 2ⁿ) = O*(2ⁿ).</li>" +
        "<li>P1 : x ∈ S ⇒ S ∩ N(x) = ∅. P2 : S maximum ⇒ S ∩ ({x} ∪ N(x)) ≠ ∅.</li>" +
        "<li>Branching sur x de degré minimum, un cas par y ∈ {x} ∪ N(x) ; T(n) ≤ 1 + s T(n − s), s = d + 1 ; pire s = 3 : O(3^(n/3)) = O(1,45ⁿ).</li>" +
        "<li>Vecteur (t₁, …, t<sub>r</sub>) ; facteur τ = racine de xⁿ − Σ x^(n−tᵢ) ; T(n) ≤ τⁿ.</li></ul></div>" +
        "<p>Pour l'implémentation : l'atelier « Implémentation du TP2 ».</p>"
    }
  });
})();
