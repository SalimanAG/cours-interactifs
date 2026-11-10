/* Leçon : Billet endommagé — recherche par retour arrière.
   Fil rouge : l'exemple 2 de l'énoncé (grille 4 × 2 entièrement effacée,
   l = 1 0 0 1, c = 1 1), qui a deux solutions → NON. */
(function () {
  "use strict";
  var el = Site.el;
  var B = Billet, U = BilletUI;
  var PB = B.EX2;

  /* État après le PROPAGER initial. */
  function racine() { var e = B.etat(PB); B.propager(e, null); return e; }
  /* État après le choix (1,1) ← v et sa propagation (si complet). */
  function apresChoix(v, propager) {
    var e = racine();
    B.poser(e, 0, 0, v);
    if (propager) B.propager(e, null);
    return e;
  }
  function chercherApres(zone, api, e, marques, surFin) {
    return U.chercher(zone, {
      e: e, pb: PB, attendues: U.posesPropagation(e).poses, valeur: null, marques: marques,
      retour: api.retour, surFin: surFin
    });
  }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Quand les déductions ne suffisent plus",
      texte:
        "<p>Exemple 2 de l'énoncé : toute la grille est effacée. Comme pour l'exemple 1, on commence par le PROPAGER initial.</p>",
      objectif: "Poser les cases forcées, puis dire si une règle s'applique encore.",
      installer: function (zone, api) {
        U.entree(zone, PB);
        var e = B.etat(PB);
        var suite = el("div");
        U.chercher(zone, {
          e: e, pb: PB, attendues: U.posesPropagation(e).poses, valeur: null, retour: api.retour,
          surFin: function () {
            api.retour("Lignes 2 et 3 : lm = 0, leurs 4 cases sont des blancs.", true);
            zone.appendChild(suite);
            Exercices.choix(suite, {
              question: "Avec ces compteurs, une règle s'applique-t-elle encore ?",
              options: ["Oui, sur la ligne 1", "Oui, sur la colonne 1", "Non : PROPAGER s'arrête, il faut faire un choix"],
              bonne: 2,
              expliquer: [
                "Non : ligne 1, lm = 1 et lv = 2 — ni 0, ni égal à lv.",
                "Non : colonne 1, cm = 1 et cv = 2.",
                "Exact : chaque ligne et colonne restante attend 1 trait parmi 2 cases. Les déductions sont bloquées."
              ],
              surReussite: function () {
                api.valider("C'est là qu'intervient RECURSIVE : on fait une hypothèse sur une case, on propage, et on revient en arrière si besoin.");
              }
            });
          }
        });
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Numéroter les cases : k",
      texte:
        "<p>RECURSIVE(k) parcourt les cases dans l'ordre de lecture avec un seul entier k. Dans le code, lignes et colonnes sont numérotées <b>à partir de 0</b> :</p>" +
        "<div class='formule'>k = i·C + j &nbsp;&nbsp; ⟺ &nbsp;&nbsp; i = k div C, &nbsp; j = k mod C</div>" +
        "<p>Ici C = 2 : k = 0 est la case en haut à gauche, k = 1 sa voisine de droite, k = 2 le début de la 2e ligne… jusqu'à k = L·C − 1 = 7.</p>",
      objectif: "Calculer deux valeurs de k.",
      installer: function (zone, api) {
        var suite = el("div");
        Exercices.nombre(zone, {
          label: "k de la case ligne 4, colonne 1 (en comptant à partir de 1) =", attendu: 6, tolerance: 0,
          indice: "En comptant à partir de 0 : i = 3, j = 0. Puis k = i·C + j avec C = 2.",
          surReussite: function () {
            zone.appendChild(suite);
            suite.appendChild(el("p", null, "Supposons qu'après le choix sur k = 0, la propagation ait rempli toute la grille. RECURSIVE(1) commence par « tant que k < L·C et case(k) ≠ VIDE faire k ← k + 1 »."));
            Exercices.nombre(suite, {
              label: "Valeur de k à la sortie du « tant que » =", attendu: 8, tolerance: 0,
              indice: "Toutes les cases sont décidées : k avance jusqu'à ce que la condition k < L·C devienne fausse.",
              surReussite: function () {
                PC.code(suite,
                  "while k < L * C and grille[k // C][k % C] is not VIDE:\n" +
                  "    k += 1                           # case déjà décidée\n" +
                  "if k == L * C:                       # plus aucune case vide\n" +
                  "    nb_sol += 1\n" +
                  "    ...\n" +
                  "i, j = k // C, k % C", "Ton code : dans recursive(k)");
                api.valider("k = L·C = 8 veut dire « plus de case vide » : on a une solution (la propagation a déjà tout vérifié).");
              }
            });
          }
        });
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Premier essai : (1,1) ← 0",
      texte:
        "<p>RECURSIVE(0) prend la première case vide, (1,1), et essaie d'abord <span class='mono'>v = 0</span> : POSER(i, j, 0, pile), puis PROPAGER(pile). " +
        "La case du choix est entourée. Touche les cases que la propagation pose.</p>",
      objectif: "Poser les 3 cases forcées par le choix (1,1) ← 0.",
      installer: function (zone, api) {
        chercherApres(zone, api, apresChoix(0, false), [[0, 0]], function () {
          api.retour("Ligne 1 : lm = lv = 1 → (1,2) ← 1. Colonne 1 : cm = cv = 1 → (4,1) ← 1. Colonne 2 : cm = 0 → (4,2) ← 0.", true);
          api.valider("Plus de case vide : RECURSIVE(1) avance jusqu'à k = 8 → solution n° 1, nb_sol = 1. On la copie, puis on revient en arrière.");
        });
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "La pile du choix",
      texte:
        "<p>Chaque appel à POSER fait <span class='mono'>pile.append((i, j, v))</span> : le choix lui-même, puis chaque case posée par PROPAGER, dans l'ordre du code (lignes, puis colonnes).</p>",
      objectif: "Retrouver le contenu de la pile, dans l'ordre d'empilement.",
      installer: function (zone, api) {
        var g = new GrilleComptee(zone, {});
        U.dessinerEtat(g, apresChoix(0, true), PB, { marques: [[0, 0]] });
        var suite = el("div");
        Exercices.ordonner(zone, {
          consigne: "Touche les poses dans l'ordre où elles sont empilées (notation (ligne, colonne) ← v).",
          items: ["(1,1) ← 0", "(1,2) ← 1", "(4,1) ← 1", "(4,2) ← 0"],
          separateur: "·",
          bravo: "Bon ordre : le choix, puis la ligne 1, puis les colonnes 1 et 2.",
          surReussite: function () {
            zone.appendChild(suite);
            Exercices.choix(suite, {
              question: "DÉFAIRE vide la pile avec pile.pop(). Quelle case est remise à VIDE en premier ?",
              options: ["(1,1), le choix", "(4,2), la dernière posée", "Toutes en même temps"],
              bonne: 1,
              expliquer: ["Non : pop() retire le dernier élément empilé.", "Oui : dernier empilé, premier dépilé.", "Non : DÉFAIRE dépile une case à la fois, dans une boucle while pile."],
              surReussite: function () {
                api.valider("La pile ne contient que ce qui a été posé depuis ce choix : DÉFAIRE annule exactement cette branche, ni plus ni moins.");
              }
            });
          }
        });
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "DÉFAIRE : remettre la grille et les compteurs",
      texte:
        "<p>Pour chaque <span class='mono'>(i, j, v)</span> dépilé, DÉFAIRE fait l'inverse de POSER : la case redevient VIDE, lv[i] et cv[j] remontent de 1, et <b>si v = 1</b>, lm[i] et cm[j] aussi.</p>" +
        "<p>Voici la grille après la solution 1. Donne les compteurs une fois les 4 poses défaites.</p>",
      objectif: "Retrouver lm, lv de la ligne 1 et cm, cv des colonnes 1 et 2 après DÉFAIRE.",
      installer: function (zone, api) {
        var g = new GrilleComptee(zone, {});
        U.dessinerEtat(g, apresChoix(0, true), PB, {});
        var e0 = racine();
        var q = [
          { nom: "lm (ligne 1)", att: e0.lm[0] }, { nom: "lv (ligne 1)", att: e0.lv[0] },
          { nom: "cm (colonne 1)", att: e0.cm[0] }, { nom: "cv (colonne 1)", att: e0.cv[0] },
          { nom: "cm (colonne 2)", att: e0.cm[1] }
        ];
        var champs = q.map(function (x, k) {
          var ligne = el("div", "saisie");
          var lab = el("label", null, x.nom + " =");
          var c = el("input");
          c.type = "text"; c.inputMode = "numeric"; c.autocomplete = "off"; c.size = 3; c.id = "dfx" + k; lab.htmlFor = c.id;
          ligne.appendChild(lab); ligne.appendChild(c);
          zone.appendChild(ligne);
          return c;
        });
        var b = el("button", "btn", "Vérifier");
        b.type = "button";
        zone.appendChild(b);
        b.onclick = function () {
          var justes = 0;
          champs.forEach(function (c, k) {
            var ok = c.value.trim() === String(q[k].att);
            c.className = ok ? "bon" : (c.value.trim() ? "faux" : "");
            if (ok) justes++;
          });
          if (justes === q.length) {
            champs.forEach(function (c) { c.disabled = true; });
            b.disabled = true;
            U.dessinerEtat(g, e0, PB, {});
            api.retour("Exact : on retrouve les compteurs d'avant le choix. (1,2) et (4,1) étaient des traits : lm des lignes 1 et 4 et cm des colonnes 1 et 2 remontent.", true);
            PC.code(zone,
              "def defaire(pile):\n" +
              "    while pile:\n" +
              "        i, j, v = pile.pop()\n" +
              "        grille[i][j] = VIDE\n" +
              "        lv[i] += 1\n" +
              "        cv[j] += 1\n" +
              "        if v == 1:\n" +
              "            lm[i] += 1        # oubli dans l'algorithme 2 des indications\n" +
              "            cm[j] += 1", "Ton code : defaire()");
            api.valider("C'est exactement l'état de la racine. On peut essayer l'autre valeur sur (1,1) comme si de rien n'était.");
          } else {
            api.retour(justes + " sur " + q.length + ". Repars des compteurs d'avant le choix : chaque case dépilée « rend » sa case vide, et son trait si v = 1.", false);
          }
        };
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Second essai : (1,1) ← 1",
      texte:
        "<p>La boucle « pour v dans (0, 1) » continue : nouvelle pile vide, POSER(i, j, 1, pile), puis PROPAGER.</p>",
      objectif: "Poser les 3 cases forcées par le choix (1,1) ← 1.",
      installer: function (zone, api) {
        chercherApres(zone, api, apresChoix(1, false), [[0, 0]], function () {
          api.retour("Ligne 1 : lm = 0 → (1,2) ← 0. Colonne 1 : cm = 0 → (4,1) ← 0. Colonne 2 : cm = cv = 1 → (4,2) ← 1.", true);
          api.valider("Encore une grille pleine et juste : solution n° 2. nb_sol = 2.");
        });
      }
    },

    /* 7 ─────────────────────────────────────────────────────────── */
    {
      titre: "nb_sol = 2 : l'arbre et la réponse",
      texte:
        "<p>Voici tout l'arbre de recherche de l'exemple 2 : une racine (après le PROPAGER initial) et un seul nœud de choix, à deux branches.</p>" +
        "<div class='arbre-billet'>" +
        "<div class='noeud'><b>Racine</b><br><span class='mono'>??<br>00<br>00<br>??</span></div>" +
        "<div class='branches'>" +
        "<div class='noeud'><span class='mono'>(1,1) ← 0</span><br><span class='mono'>01<br>00<br>00<br>10</span><br>solution 1</div>" +
        "<div class='noeud'><span class='mono'>(1,1) ← 1</span><br><span class='mono'>10<br>00<br>00<br>01</span><br>solution 2</div>" +
        "</div></div>",
      objectif: "Dire ce que fait le programme après la deuxième solution.",
      installer: function (zone, api) {
        var suite = el("div");
        Exercices.choix(zone, {
          question: "nb_sol vient de passer à 2. Que se passe-t-il ensuite ?",
          options: [
            "RECURSIVE continue pour compter toutes les solutions",
            "RECURSIVE retourne, DÉFAIRE, la boucle sur v est finie ; resoudre renvoie nb_sol = 2 et main affiche NON",
            "Le programme affiche la deuxième solution"
          ],
          bonne: 1,
          expliquer: [
            "Non : seule l'unicité compte. S'il restait des branches, la ligne 1 de RECURSIVE (si nb_sol ≥ 2 alors retourner) les couperait aussitôt.",
            "Exact. Deux solutions → pas unique → NON.",
            "Non : on n'affiche une grille que si nb_sol = 1."
          ],
          surReussite: function () {
            zone.appendChild(suite);
            suite.appendChild(el("h3", null, "Revoir toute l'exécution"));
            var p = U.panneau(suite, { delai: 650 });
            p.charger(PB);
            api.valider("Toute l'exécution tient en 24 états : avance pas à pas pour voir chaque ligne du pseudo-code.");
          }
        });
      }
    },

    /* 8 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le pseudo-code de RECURSIVE",
      texte:
        "<p>Pour finir, remets dans l'ordre les morceaux de RECURSIVE(k), comme sur ta slide (et comme dans ton code).</p>",
      objectif: "Ordonner les 7 morceaux de RECURSIVE.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche les morceaux du premier au dernier.",
          items: [
            "si nb_sol ≥ 2 : retourner",
            "sauter les cases déjà décidées (tant que)",
            "si k = L·C : compter la solution, copier la 1re, retourner",
            "(i, j) ← (k div C, k mod C)",
            "pour v dans (0, 1) :",
            "POSER, puis si PROPAGER : RECURSIVE(k + 1)",
            "DÉFAIRE(pile)"
          ],
          separateur: "↓",
          bravo: "Bon ordre.",
          surReussite: function () {
            new PseudoCode(zone, { titre: "RECURSIVE(k)", lignes: B.RECURSIVE });
            PC.code(zone,
              "def recursive(k):\n" +
              "    nonlocal nb_sol, solution\n" +
              "    if nb_sol >= 2:\n" +
              "        return\n" +
              "    while k < L * C and grille[k // C][k % C] is not VIDE:\n" +
              "        k += 1\n" +
              "    if k == L * C:\n" +
              "        nb_sol += 1\n" +
              "        if nb_sol == 1:\n" +
              "            solution = [ligne[:] for ligne in grille]\n" +
              "        return\n" +
              "    i, j = k // C, k % C\n" +
              "    for v in (0, 1):\n" +
              "        pile = []\n" +
              "        poser(i, j, v, pile)\n" +
              "        if propager(pile):\n" +
              "            recursive(k + 1)\n" +
              "        defaire(pile)", "Ton code : recursive()");
            api.valider("Le test d'arrêt est en tête : c'est lui qui coupe tout dès la 2e solution.");
          }
        });
      }
    }
  ];

  /* L'arbre de l'étape 7 (petit style local). */
  var st = document.createElement("style");
  st.textContent =
    ".arbre-billet{display:flex;flex-direction:column;align-items:center;gap:.6rem;margin:.8rem 0}" +
    ".arbre-billet .branches{display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap}" +
    ".arbre-billet .noeud{border:1px solid var(--trait-fort);border-radius:8px;padding:.4rem .7rem;text-align:center;background:var(--fond-2);font-size:.9rem;line-height:1.35}" +
    ".arbre-billet .branches .noeud{background:var(--fond)}" +
    ".arbre-billet .mono{letter-spacing:.15em}";
  document.head.appendChild(st);

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "billet-recherche",
    etapes: etapes,
    fin: {
      cartes: "oral-billet",
      texte:
        "<div class='encadre'><span class='titre-encadre'>À retenir pour l'oral</span><ul>" +
        "<li>Quand PROPAGER est bloqué, RECURSIVE(k) prend la première case vide (ordre de lecture, k = i·C + j) et essaie 0 puis 1.</li>" +
        "<li>Chaque branche : POSER le choix, PROPAGER ; si pas de contradiction, RECURSIVE(k + 1) ; puis DÉFAIRE.</li>" +
        "<li>La pile garde tout ce qui a été posé depuis le choix ; DÉFAIRE restaure cases <b>et</b> compteurs (lm, cm compris).</li>" +
        "<li>k = L·C : solution (déjà vérifiée par la propagation). On copie la 1re, on s'arrête à la 2e.</li>" +
        "<li>Exemple 2 : un seul nœud de choix, deux solutions → NON.</li></ul></div>" +
        "<p>Prochaine étape : « Du pseudo-code au Python », pour les questions sur ton code.</p>"
    }
  });
})();
