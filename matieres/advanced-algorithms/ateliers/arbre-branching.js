/* Atelier : implémentation du TP2 (branching pour le stable maximum).
   Fil rouge : le cycle à 6 sommets de la diapo « Problème du stable maximum » du cours 4. */
(function () {
  "use strict";
  var el = Site.el;
  var G = Stable.HEXAGONE;
  var N = Stable.voisins(G);
  var IDS = G.sommets.map(function (s) { return s.id; });

  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function vue(classeS, sousS, classeA) {
    return {
      sommets: G.sommets.map(function (s) { return { id: s.id, x: s.x, y: s.y, label: s.id, classe: classeS ? classeS(s.id) : "", sous: sousS ? sousS(s.id) : "" }; }),
      aretes: G.aretes.map(function (a) { return { id: a.id, u: a.u, v: a.v, classe: classeA ? classeA(a) : "" }; })
    };
  }
  function ens(l) { return "{" + l.slice().sort().join(", ") + "}"; }
  function tableauEtat(zone) {
    var w = el("div", "defile-x"); var t = el("table", "table-pd"); w.appendChild(t); zone.appendChild(w);
    return function (presence, degre, surligne) {
      var h = "<tr><th>sommet</th>", p = "<tr><th>presence</th>", d = "<tr><th>degre_courant</th>";
      IDS.forEach(function (v) {
        h += "<th>" + v + "</th>";
        var cl = surligne && surligne.indexOf(v) >= 0 ? "courante" : "";
        p += "<td class='" + cl + "'>" + (presence[v] ? "vrai" : "faux") + "</td>";
        d += "<td class='" + (presence[v] ? cl : "vide") + "'>" + (presence[v] ? degre[v] : "·") + "</td>";
      });
      t.innerHTML = h + "</tr>" + p + "</tr>" + d + "</tr>";
    };
  }

  var etapes = [
    {
      titre: "Deux tableaux au lieu d'un graphe",
      texte: "<p>Dans le TP2, on ne construit jamais le graphe induit courant G̃ : le graphe G n'est pas modifié. On utilise deux tableaux indicés par les sommets : " +
        "<code>presence</code> (vrai si le sommet est encore dans G̃) et <code>degre_courant</code> (son degré dans G̃). Ce dernier sert à trouver un sommet de degré minimum " +
        "sans parcourir toutes les listes d'adjacence (questions 1 et 2).</p>" +
        "<p>Touche un sommet x pour le placer dans le stable : x et ses voisins courants deviennent absents, les degrés des autres sont mis à jour. " +
        "Puis touche le sommet que choisirait la fonction de la question 2 : un sommet présent de degré courant minimum.</p>",
      objectif: "Placer un sommet, puis désigner un sommet présent de degré courant minimum.",
      installer: function (zone, api) {
        var presence = {}, degre = {}, S = [], phase = 0, modifies = [];
        function init() { IDS.forEach(function (v) { presence[v] = true; degre[v] = N[v].length; }); S = []; phase = 0; modifies = []; }
        init();
        var fig = new FigureGraphe(cadre(zone), { largeur: 320, hauteur: 200, onSommet: function (v) {
          if (!presence[v]) { api.retour(v + " n'est plus présent.", false); return; }
          if (phase === 0) {
            S.push(v);
            var L = [v].concat(N[v].filter(function (w) { return presence[w]; }));
            L.forEach(function (w) { presence[w] = false; });
            modifies = [];
            L.forEach(function (w) { N[w].forEach(function (z) { if (presence[z]) { degre[z]--; if (modifies.indexOf(z) < 0) modifies.push(z); } }); });
            phase = 1;
            api.retour("x = " + v + " placé ; L = " + ens(L.slice(1)) + " ; degrés mis à jour : " + ens(modifies) + ".", null);
            maj(modifies.concat(L));
          } else {
            var pres = IDS.filter(function (w) { return presence[w]; });
            var min = Math.min.apply(null, pres.map(function (w) { return degre[w]; }));
            if (degre[v] === min) {
              api.retour(v + " a le degré courant minimum (" + min + ").", true);
              api.valider("Pour trouver ce sommet, on parcourt seulement le tableau degre_courant : O(n), sans regarder les listes d'adjacence.");
            } else api.retour("degre_courant[" + v + "] = " + degre[v] + " ; le minimum parmi les présents est " + min + ".", false);
          }
        } });
        var afficher = tableauEtat(zone);
        var b = el("button", "btn btn-petit", "Recommencer"); b.type = "button";
        b.onclick = function () { init(); api.retour("", null); maj([]); };
        zone.appendChild(b);
        function maj(sur) {
          fig.dessiner(vue(function (v) { return S.indexOf(v) >= 0 ? "plein" : !presence[v] ? "retire" : ""; },
            function (v) { return presence[v] ? "d=" + degre[v] : ""; },
            function (a) { return !presence[a.u] || !presence[a.v] ? "estompee" : ""; }));
          afficher(presence, degre, sur);
        }
        maj([]);
      }
    },

    {
      titre: "Tout défaire en sortant",
      texte: "<p>La profondeur de récursion peut être de l'ordre de n : impossible de copier les tableaux à chaque appel. Tous les appels à <code>calcule_stable_max</code> " +
        "travaillent sur les <b>mêmes</b> tableaux globaux, et chaque appel doit les remettre exactement dans l'état où il les a trouvés. " +
        "Remets dans l'ordre les étapes de l'indication de la question 3.</p>",
      objectif: "Ordonner les 9 étapes de calcule_stable_max.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche les étapes dans l'ordre.",
          items: [
            "placer x dans le stable courant",
            "retenir la liste L des voisins courants de x",
            "presence de x et de L à faux",
            "actualiser le degré courant des sommets restants",
            "choisir y de degré courant minimum",
            "appels récursifs pour chaque z parmi y et ses voisins",
            "défaire l'actualisation des degrés (avec L)",
            "remettre la presence de x et de L (avec L)",
            "retirer x du stable courant"
          ],
          bravo: "On défait dans l'ordre inverse de ce qu'on a fait.",
          surReussite: function () { api.valider("La liste L sert deux fois : pour défaire les degrés et la présence. Sans elle, on ne saurait plus quels voisins étaient présents."); }
        });
      }
    },

    {
      titre: "Cas terminal et condition d'arrêt",
      texte: "<p>Question 4 : le cas terminal est le graphe courant vide ; on compare alors la taille du stable courant au meilleur trouvé. " +
        "Question 5 : on peut s'arrêter plus tôt. Compare l'arbre sans et avec la condition d'arrêt.</p>",
      objectif: "Trouver la condition d'arrêt de la question 5.",
      installer: function (zone, api) {
        var coupe = false;
        var arbreFig = new FigureGraphe(cadre(zone), { largeur: 340, hauteur: 140 });
        var info = el("p", "legende-figure");
        var rang = el("div", "rangee-btn");
        var b1 = el("button", "btn btn-petit", "Sans condition d'arrêt"), b2 = el("button", "btn btn-petit", "Avec condition d'arrêt");
        b1.type = b2.type = "button";
        rang.appendChild(b1); rang.appendChild(b2);
        zone.appendChild(rang); zone.appendChild(info);
        function dessiner() {
          var A = Stable.arbre(G, { coupe: coupe });
          var pos = Stable.disposer(A.noeuds, 340, 140);
          arbreFig.dessiner({
            sommets: A.noeuds.map(function (m) {
              return { id: "n" + m.id, x: pos[m.id].x, y: pos[m.id].y, label: m.y || "G", classe: "petit" + (m.coupe ? " retire" : m.feuille && m.S.length === A.alpha ? " plein" : "") };
            }),
            aretes: A.noeuds.filter(function (m) { return m.parent !== null; }).map(function (m) { return { id: "e" + m.id, u: "n" + m.parent, v: "n" + m.id }; })
          });
          info.innerHTML = "<span>" + (coupe ? "avec" : "sans") + " condition : <span class='mono'>" + A.noeuds.length + "</span> nœuds</span>" +
            "<span>branches coupées : <span class='mono'>" + A.noeuds.filter(function (m) { return m.coupe; }).length + "</span> (pointillés)</span>";
          b1.classList.toggle("btn-plein", !coupe); b2.classList.toggle("btn-plein", coupe);
        }
        b1.onclick = function () { coupe = false; dessiner(); };
        b2.onclick = function () { coupe = true; dessiner(); };
        dessiner();
        Exercices.choix(zone, {
          question: "On a trouvé un stable de taille « meilleur ». Quand peut-on abandonner la branche courante ?",
          options: [
            "quand |S courant| ≤ meilleur",
            "quand |G̃| ≤ meilleur",
            "quand |S courant| + |G̃| ≤ meilleur",
            "quand le sommet choisi est de degré 0"
          ],
          bonne: 2,
          expliquer: [
            "Non : on pourrait encore ajouter des sommets de G̃.",
            "Non : il faut compter aussi ce qui est déjà dans S.",
            "Exact : au mieux on ajoutera tous les sommets restants à S ; si même cela ne dépasse pas le meilleur, la branche est inutile.",
            "Non : un sommet de degré 0 doit au contraire être ajouté."
          ],
          surReussite: function () { api.valider("Sur l'hexagone, la condition coupe 2 branches (13 → 11 nœuds). Elle est « plus faible » que le graphe vide : elle est satisfaite plus souvent."); }
        });
      }
    },

    {
      titre: "Lister tous les stables maximum",
      texte: "<p>Questions 9 à 11 : en deux passes, on calcule d'abord la taille maximum α, puis on relance la même fonction en <b>mode énumération</b> " +
        "et on écrit chaque stable de taille α rencontré. Lance l'énumération sur l'hexagone.</p>",
      objectif: "Expliquer pourquoi un stable maximum peut apparaître plusieurs fois.",
      installer: function (zone, api) {
        var A = Stable.arbre(G);
        var fig = new FigureGraphe(cadre(zone), { largeur: 320, hauteur: 200 });
        var sortie = el("div", "journal");
        var b = el("button", "btn btn-petit btn-plein", "Lancer l'énumération"); b.type = "button";
        zone.appendChild(b); zone.appendChild(sortie);
        fig.dessiner(vue());
        var lance = false;
        b.onclick = function () {
          sortie.innerHTML = "";
          A.stables.filter(function (s) { return s.length === A.alpha; }).forEach(function (s) { sortie.appendChild(el("div", null, s.join(" "))); });
          if (!lance) {
            lance = true;
            Exercices.choix(zone, {
              question: "Pourquoi {b, d, f} est-il écrit deux fois ?",
              options: [
                "Parce que l'algorithme a une erreur.",
                "Parce qu'il est atteint par deux chemins différents de l'arbre : b puis d puis f, et f puis b puis d.",
                "Parce que la condition d'arrêt a été mal écrite."
              ],
              bonne: 1,
              expliquer: [
                "Non : chaque stable écrit est bien un stable maximum.",
                "Exact : la branche « y = b » et la branche « y = f » mènent toutes deux à {b, d, f}. C'est la remarque du cours : on a tous les stables maximum, mais plusieurs fois chacun.",
                "Non : sans condition d'arrêt, le doublon apparaît aussi."
              ],
              surReussite: function () { api.valider(); }
            });
          }
        };
        zone.appendChild(el("div", "signalement",
          "Deux points non tranchés par le TP : (1) en mode énumération, la condition d'arrêt doit être stricte (|S| + |G̃| < α), sinon on coupe des branches qui mènent à un stable de taille α ; " +
          "(2) la question 11 demande si on peut éviter les doublons, sans donner de méthode. À voir avec ton enseignant."));
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "arbre-branching",
    etapes: etapes,
    fin: {
      cartes: "branching",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir (TP2)</span><ul>" +
        "<li>presence[] et degre_courant[] représentent G̃ sans le construire ; trouver un sommet de degré minimum coûte O(n).</li>" +
        "<li>Tableaux et stable courant globaux : chaque appel défait ce qu'il a fait, grâce à la liste L des voisins retirés.</li>" +
        "<li>Cas terminal : graphe vide. Condition d'arrêt : |S courant| + |G̃| ≤ meilleur.</li>" +
        "<li>Énumération en deux passes ; chaque stable maximum peut sortir plusieurs fois.</li></ul></div>"
    }
  });
})();
