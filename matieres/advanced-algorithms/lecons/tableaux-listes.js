/* Leçon : Tableau ou liste chaînée (prérequis — questions 2 et 3 du test).
   Fil rouge : la suite 7, 3, 9, 4, 8, 1 rangée dans un tableau puis dans une liste. */
(function () {
  "use strict";
  var el = Site.el;
  var V = [7, 3, 9, 4, 8, 1];
  var NOTE_SOURCE = "<div class='signalement'>Notions de prérequis absentes de tes documents d'Advanced Algorithms : présentation standard (Cormen). " +
    "Les positions sont numérotées à partir de 1, comme dans le test (« la i-ème cellule »).</div>";

  function tableau(zone, onCase) {
    var d = el("div", "structure");
    var cases = V.map(function (v, i) {
      var c = el("button", "case");
      c.type = "button";
      c.appendChild(el("span", "indice", String(i + 1)));
      c.appendChild(document.createTextNode(String(v)));
      if (onCase) c.onclick = function () { onCase(i); }; else c.tabIndex = -1;
      d.appendChild(c);
      return c;
    });
    d.style.marginTop = "1.4rem";
    zone.appendChild(d);
    return cases;
  }
  function liste(zone) {
    var d = el("div", "structure");
    d.appendChild(el("span", "tete", "tête →"));
    var cases = V.map(function (v, i) {
      var cel = el("span", "cellule");
      var c = el("span", "case");
      c.appendChild(document.createTextNode(String(v)));
      cel.appendChild(c);
      cel.appendChild(el("span", "ptr", "●"));
      cel.appendChild(el("span", "fleche", i < V.length - 1 ? "→" : "→ ∅"));
      d.appendChild(cel);
      return c;
    });
    zone.appendChild(d);
    return cases;
  }

  var etapes = [
    {
      titre: "Accéder à une case d'un tableau",
      texte: "<p>Un tableau occupe une zone mémoire <b>contiguë</b> : la case i est à l'adresse <span class='mono'>début + (i − 1) × taille d'une case</span>. " +
        "Un seul calcul, quelle que soit la case. Touche la case d'indice 4.</p>" + NOTE_SOURCE,
      objectif: "Accéder à T[4] puis donner le coût d'un accès.",
      installer: function (zone, api) {
        var info = el("p", "legende-figure");
        var cases = tableau(zone, function (i) {
          cases.forEach(function (c, j) { c.classList.toggle("courante", i === j); });
          info.innerHTML = "<span>T[" + (i + 1) + "] = <span class='mono'>" + V[i] + "</span></span><span>adresse = début + " + i + " × taille</span><span>opérations : <span class='mono'>1</span></span>";
          if (i === 3 && !question) {
            question = true;
            Exercices.choix(zone, {
              question: "Temps pour accéder à la case d'indice i d'un tableau de taille n ?",
              options: ["O(1)", "O(i)", "O(n)", "O(log n)"],
              bonne: 0,
              expliquer: ["Exact (et tu l'avais réussie dans le test) : un calcul d'adresse, indépendant de i et de n.",
                "Non : on ne parcourt pas les cases précédentes, on calcule directement l'adresse.",
                "Non : la taille du tableau n'intervient pas dans le calcul d'adresse.",
                "Non : pas de recherche, un calcul direct."],
              surReussite: function () { api.valider(); }
            });
          }
        });
        var question = false;
        zone.appendChild(info);
      }
    },

    {
      titre: "Accéder à une cellule d'une liste chaînée",
      texte: "<p>Une liste <b>simplement chaînée</b> est une suite de cellules dispersées en mémoire : chacune contient une valeur et un pointeur vers la suivante. " +
        "On ne connaît que la tête. Pour atteindre une cellule, il faut suivre les pointeurs un par un — et on ne peut pas revenir en arrière.</p>",
      objectif: "Amener le curseur p sur la 4e cellule.",
      installer: function (zone, api) {
        var p = 0, sauts = 0;
        var cases = liste(zone);
        var info = el("p", "legende-figure");
        var rang = el("div", "rangee-btn");
        var b = el("button", "btn", "p ← p.suivant"); b.type = "button";
        var r = el("button", "btn btn-petit", "Recommencer depuis la tête"); r.type = "button";
        rang.appendChild(b); rang.appendChild(r);
        zone.appendChild(rang); zone.appendChild(info);
        function maj() {
          cases.forEach(function (c, j) { c.classList.toggle("courante", j === p); c.classList.toggle("vue", j < p); });
          info.innerHTML = "<span>p est sur la cellule <span class='mono'>" + (p + 1) + "</span> (valeur " + V[p] + ")</span><span>sauts : <span class='mono'>" + sauts + "</span></span>";
          b.disabled = p >= V.length - 1;
        }
        b.onclick = function () {
          p++; sauts++; maj();
          if (p === 3) {
            api.retour("4e cellule atteinte en 3 sauts depuis la tête.", true);
            api.valider("Pour la i-ème cellule : i − 1 sauts.");
          } else if (p > 3) {
            api.retour("Trop loin ! Impossible de reculer dans une liste simplement chaînée : il faut repartir de la tête.", false);
          }
        };
        r.onclick = function () { p = 0; sauts = 0; api.retour("", null); maj(); };
        maj();
      }
    },

    {
      titre: "O(i), pas O(n)",
      texte: "<p>Le coût dépend de la position visée, pas de la longueur de la liste : on s'arrête dès qu'on a atteint la cellule. " +
        "Fais varier i et n.</p>",
      objectif: "Répondre de nouveau à la question 2 du test.",
      installer: function (zone, api) {
        var li = el("label"), ci = el("input"); ci.type = "range"; ci.min = 1; ci.max = 50; ci.value = 4;
        var ln = el("label"), cn = el("input"); cn.type = "range"; cn.min = 1; cn.max = 1000; cn.value = 6;
        var info = el("p", "legende-figure");
        [li, ci, ln, cn, info].forEach(function (x) { zone.appendChild(x); });
        function maj() {
          var n = +cn.value, i = Math.min(+ci.value, n);
          li.innerHTML = "i = <span class='mono'>" + i + "</span>";
          ln.innerHTML = "n = <span class='mono'>" + n + "</span>";
          info.innerHTML = "<span>sauts pour la i-ème cellule : <span class='mono'>" + (i - 1) + "</span></span><span>cellules non visitées : <span class='mono'>" + (n - i) + "</span></span>";
        }
        ci.addEventListener("input", maj); cn.addEventListener("input", maj);
        maj();
        Exercices.choix(zone, {
          question: "Temps nécessaire pour accéder au contenu de la i-ème cellule d'une liste simplement chaînée de taille n ?",
          options: ["O(1)", "O(i)", "O(n)", "O(log n)", "O(n log n)"],
          bonne: 1,
          expliquer: [
            "Non : il faut suivre i − 1 pointeurs.",
            "Exact : i − 1 sauts, puis la lecture. On s'arrête à la i-ème cellule, la fin de la liste ne coûte rien.",
            "C'est ta réponse au test. O(n) est une borne vraie (i ≤ n) mais moins précise : la question demande le coût en fonction de i, et pour i = 2 dans une liste d'un million de cellules, l'accès est immédiat.",
            "Non : pas de dichotomie possible, on ne peut pas sauter au milieu.",
            "Non."
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Insérer, chercher : le bilan",
      texte: "<p>Le tableau gagne pour l'accès direct ; la liste gagne pour insérer ou supprimer en tête (on change un pointeur, sans décaler les autres). " +
        "Dans le TP1, la bibliothèque <code>nodelist.h</code> utilise des listes <b>doublement</b> chaînées avec un pointeur sur la tête (<code>prem</code>) et sur la queue (<code>dern</code>).</p>",
      objectif: "Classer chaque affirmation en vrai ou faux.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Insérer en tête d'une liste chaînée : O(1)", vrai: true, explication: "Une nouvelle cellule qui pointe vers l'ancienne tête." },
            { texte: "Insérer au début d'un tableau plein de n éléments (en décalant) : O(n)", vrai: true, explication: "Il faut décaler les n éléments." },
            { texte: "Chercher une valeur dans une liste non triée : O(n)", vrai: true, explication: "Dans le pire cas on la parcourt entièrement." },
            { texte: "Accéder au dernier élément d'une liste simplement chaînée sans pointeur de queue : O(1)", vrai: false, explication: "Il faut n − 1 sauts. Avec un pointeur de queue (comme dern dans le TP1), c'est O(1)." },
            { texte: "Chercher une valeur dans un tableau trié, par dichotomie : O(log n)", vrai: true, explication: "On divise la zone de recherche par 2 à chaque comparaison, grâce à l'accès direct." }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "tableaux-listes",
    etapes: etapes,
    fin: {
      cartes: "prerequis",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul>" +
        "<li>Tableau : accès à la case i en O(1) (calcul d'adresse).</li>" +
        "<li>Liste simplement chaînée : accès à la i-ème cellule en O(i) ; insertion en tête en O(1).</li>" +
        "<li>Donner le coût avec le paramètre le plus précis : O(i) plutôt que O(n).</li></ul></div>"
    }
  });
})();
