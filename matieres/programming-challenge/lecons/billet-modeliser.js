/* Leçon : Billet endommagé (examen final, problème BACKTRACK) — modéliser et déduire.
   Fil rouge : l'exemple 1 de l'énoncé (grille 4 × 5), résolu par les seules déductions.
   L'algorithme suit la solution rendue (BACKTRACK_billet_endommage.py) et la présentation. */
(function () {
  "use strict";
  var el = Site.el;
  var B = Billet, U = BilletUI;
  var PB = B.EX1;

  /* Toutes les poses du PROPAGER initial, dans l'ordre du code. */
  var POSES = [];
  B.propager(B.etat(PB), null, function (x) { if (x.type === "pose") POSES.push(x); });

  /* État après les n premières poses. */
  function etatApres(n) {
    var e = B.etat(PB);
    POSES.slice(0, n).forEach(function (p) { B.poser(e, p.i, p.j, p.v); });
    return e;
  }
  function selection(f) { return POSES.filter(f); }
  function avant(f) { var i = 0; while (i < POSES.length && !f(POSES[i])) i++; return i; }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Lire l'entrée",
      texte:
        "<p>Le billet est une grille de <b>L</b> lignes et <b>C</b> colonnes (L, C ≤ 20). Un <span class='mono'>-</span> est un trait encore lisible, " +
        "une <span class='mono'>*</span> une case effacée : on ne sait pas si elle contenait un trait. On connaît le nombre de traits de chaque ligne (l) et de chaque colonne (c).</p>" +
        "<p>Voici l'exemple 1 de l'énoncé. Lis-le comme le programme le lira.</p>",
      objectif: "Compter les cases effacées, puis trouver le nombre de traits attendu dans la colonne 4.",
      installer: function (zone, api) {
        U.entree(zone, PB);
        var suite = el("div");
        Exercices.nombre(zone, {
          label: "Nombre de cases effacées (*) =", attendu: 16, tolerance: 0,
          indice: "Compte les * ligne par ligne : 3, puis 4, 4 et 5.",
          surReussite: function () {
            zone.appendChild(suite);
            Exercices.nombre(suite, {
              label: "Traits attendus dans la colonne 4 =", attendu: 2, tolerance: 0,
              indice: "Après les 4 lignes de grille viennent les L = 4 nombres l, puis les C = 5 nombres c. Le 4e nombre de la dernière ligne.",
              surReussite: function () {
                PC.code(suite,
                  "def lire():\n" +
                  "    data = sys.stdin.read().split()\n" +
                  "    L, C = int(data[0]), int(data[1])\n" +
                  "    lignes = data[2:2 + L]          # les L lignes de la grille\n" +
                  "    k = 2 + L\n" +
                  "    l = [int(x) for x in data[k:k + L]]\n" +
                  "    c = [int(x) for x in data[k + L:k + L + C]]\n" +
                  "    return L, C, lignes, l, c", "Ton code : lire()");
                api.valider("16 cases inconnues : une recherche naïve essaierait 2¹⁶ = 65 536 grilles. Sur 20 × 20, jusqu'à 2⁴⁰⁰ : il faudra être plus malin.");
              }
            });
          }
        });
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Modéliser : des inconnues binaires",
      texte:
        "<p>On code chaque case par <span class='mono'>1</span> (trait), <span class='mono'>0</span> (blanc) ou <b>VIDE</b> (pas encore décidée). " +
        "Au départ, les <span class='mono'>-</span> valent 1 et les <span class='mono'>*</span> sont VIDE.</p>" +
        "<p>Une <b>solution</b>, c'est une valeur 0 ou 1 pour chaque case VIDE telle que chaque ligne i ait exactement l[i] traits et chaque colonne j exactement c[j].</p>",
      objectif: "Juger correctement les 5 affirmations sur la modélisation.",
      installer: function (zone, api) {
        var g = new GrilleComptee(zone, {});
        U.dessinerEtat(g, B.etat(PB), PB, { sansCompteurs: true });
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Un <span class='mono'>-</span> de l'entrée peut devenir un blanc dans la solution.", vrai: false,
              explication: "Un trait lisible est sûr : il reste 1. Seules les cases effacées sont inconnues." },
            { texte: "Dans la grille <b>affichée</b> en sortie, <span class='mono'>*</span> veut dire « blanc ».", vrai: true,
              explication: "En sortie, toutes les cases sont décidées : <span class='mono'>-</span> = trait, <span class='mono'>*</span> = pas de trait." },
            { texte: "S'il y a deux solutions, on affiche la première trouvée.", vrai: false,
              explication: "On affiche la grille seulement si la solution est <b>unique</b> ; sinon (0 ou plusieurs solutions) on affiche <span class='mono'>NON</span>." },
            { texte: "On ne peut pas coder VIDE par 0.", vrai: true,
              explication: "0 est une vraie valeur (blanc). Dans le code, VIDE = None, et on teste <span class='mono'>grille[i][j] is VIDE</span>." },
            { texte: "Le problème revient à trouver des valeurs 0/1 dont les sommes par ligne et par colonne sont imposées.", vrai: true,
              explication: "C'est un problème de satisfaction de contraintes : inconnues binaires, une contrainte de somme par ligne et par colonne." }
          ],
          surReussite: function () {
            PC.code(zone,
              "VIDE = None                       # case '*' pas encore décidée\n" +
              "grille = [[1 if lignes[i][j] == '-' else VIDE for j in range(C)]\n" +
              "          for i in range(L)]", "Ton code : la grille");
            api.valider("Le modèle est posé : des inconnues binaires et des contraintes de somme. Reste à décider vite, avec des compteurs.");
          }
        });
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Les quatre compteurs",
      texte:
        "<p>Pour tester les contraintes sans recompter, on tient à jour, pour chaque ligne i :</p>" +
        "<div class='encadre'><b>lm[i]</b> = traits encore <b>manquants</b> = l[i] − traits déjà posés<br>" +
        "<b>lv[i]</b> = cases encore <b>vides</b> sur la ligne</div>" +
        "<p>Et de même <b>cm[j]</b>, <b>cv[j]</b> pour chaque colonne j. Calcule-les pour les 4 lignes de l'exemple (la colonne l rappelle les totaux).</p>",
      objectif: "Remplir lm et lv pour les 4 lignes.",
      installer: function (zone, api) {
        var e = B.etat(PB);
        var g = new GrilleComptee(zone, {});
        U.dessinerEtat(g, e, PB, { masquer: { lm: true, lv: true, cm: true, cv: true } });
        var t = el("table", "tableau-saisie");
        var tr = el("tr");
        ["ligne", "lm", "lv"].forEach(function (x) { tr.appendChild(el("th", null, x)); });
        t.appendChild(tr);
        var champs = [];
        for (var i = 0; i < PB.L; i++) {
          var r = el("tr");
          r.appendChild(el("td", "mono", String(i + 1)));
          ["lm", "lv"].forEach(function (nom) {
            var td = el("td"), c = el("input");
            c.type = "text"; c.inputMode = "numeric"; c.autocomplete = "off"; c.size = 3;
            c.setAttribute("aria-label", nom + " de la ligne " + (i + 1));
            c.dataset.att = String(nom === "lm" ? e.lm[i] : e.lv[i]);
            td.appendChild(c); r.appendChild(td); champs.push(c);
          });
          t.appendChild(r);
        }
        zone.appendChild(t);
        var b = el("button", "btn", "Vérifier");
        b.type = "button";
        zone.appendChild(b);
        b.onclick = function () {
          var justes = 0;
          champs.forEach(function (c) {
            var ok = c.value.trim() === c.dataset.att;
            c.className = ok ? "bon" : (c.value.trim() ? "faux" : "");
            if (ok) justes++;
          });
          if (justes === champs.length) {
            champs.forEach(function (c) { c.disabled = true; });
            b.disabled = true;
            U.dessinerEtat(g, e, PB, {});
            api.retour("Juste. La grille montre maintenant tous les compteurs, colonnes comprises : par exemple la colonne 3 a cm = 0 (aucun trait attendu).", true);
            PC.code(zone,
              "lm = [l[i] - sum(1 for j in range(C) if grille[i][j] == 1) for i in range(L)]\n" +
              "lv = [sum(1 for j in range(C) if grille[i][j] is VIDE) for i in range(L)]\n" +
              "# cm et cv : la même chose sur les colonnes", "Ton code : les compteurs initiaux");
            api.valider("Ligne 1 : il manque 1 trait à placer dans 3 cases vides. Ces compteurs changent en O(1) à chaque case posée.");
          } else {
            api.retour(justes + " sur " + champs.length + ". lm = l − (traits « - » de la ligne) ; lv = nombre de « * » de la ligne.", false);
          }
        };
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Trois règles de déduction",
      texte:
        "<p>Les compteurs d'une ligne (ou d'une colonne) suffisent parfois à conclure :</p>" +
        "<div class='encadre'>" +
        "<b>lm &lt; 0 ou lm &gt; lv</b> → contradiction : on abandonne.<br>" +
        "<b>lm = 0</b> (et lv &gt; 0) → toutes les cases vides valent 0.<br>" +
        "<b>lm = lv</b> (et lv &gt; 0) → toutes les cases vides valent 1.</div>" +
        "<p>Classe chacune de ces situations.</p>",
      objectif: "Associer chaque ligne de compteurs à la bonne conclusion.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["Contradiction", "Vides → 0", "Vides → 1", "Rien"],
          items: [
            { texte: "<span class='mono'>lm = 2, lv = 1</span>", bonne: 0, explication: "2 traits à placer, 1 seule case : impossible." },
            { texte: "<span class='mono'>lm = 0, lv = 4</span>", bonne: 1, explication: "Lignes 2 et 3 de l'exemple : leur trait est déjà là." },
            { texte: "<span class='mono'>lm = 3, lv = 3</span>", bonne: 2, explication: "Autant de traits que de cases : elles sont toutes des traits." },
            { texte: "<span class='mono'>lm = 1, lv = 3</span>", bonne: 3, explication: "Ligne 1 de l'exemple : on ne sait pas encore où est le trait." },
            { texte: "<span class='mono'>lm = −1, lv = 2</span>", bonne: 0, explication: "On a déjà posé un trait de trop." },
            { texte: "<span class='mono'>lm = 0, lv = 0</span>", bonne: 3, explication: "Ligne complète et juste : rien à faire (c'est pour ça que les règles demandent lv &gt; 0)." }
          ],
          surReussite: function () {
            api.valider("Une règle sur une ligne pose des cases… qui changent les compteurs de leurs colonnes. C'est ce qu'on va dérouler.");
          }
        });
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "PROPAGER, passe 1 : les lignes",
      texte:
        "<p>PROPAGER parcourt d'abord <b>toutes les lignes</b>, de haut en bas, et applique les règles. Choisis la valeur, puis touche chaque case que la passe sur les lignes va poser.</p>",
      objectif: "Poser les 8 cases forcées par les lignes.",
      installer: function (zone, api) {
        var att = selection(function (p) { return p.passe === 1 && p.sens === "ligne"; });
        U.chercher(zone, {
          e: etatApres(0), pb: PB, attendues: att, valeur: null, etape: "ligne", retour: api.retour,
          surFin: function () {
            api.retour("Les lignes 2 et 3 ont lm = 0 : leurs 8 cases vides sont des blancs. Les lignes 1 et 4 ne permettent encore rien.", true);
            api.valider("Regarde les colonnes maintenant : leurs compteurs cv ont baissé.");
          }
        });
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Passe 1 : les colonnes",
      texte:
        "<p>Toujours dans la même passe, PROPAGER traite ensuite <b>toutes les colonnes</b>, de gauche à droite. Les compteurs ont été mis à jour par les poses précédentes.</p>",
      objectif: "Poser les 6 cases forcées par les colonnes.",
      installer: function (zone, api) {
        var n = avant(function (p) { return p.sens === "colonne"; });
        var att = selection(function (p) { return p.passe === 1 && p.sens === "colonne"; });
        U.chercher(zone, {
          e: etatApres(n), pb: PB, attendues: att, valeur: null, etape: "colonne", retour: api.retour,
          surFin: function () {
            api.retour("Colonnes 2 et 3 : cm = 0, leurs cases vides sont des blancs. Colonnes 1 et 5 : il reste 1 trait et 1 case vide (en ligne 4). La colonne 4 hésite encore.", true);
            api.valider("Cette passe a posé des cases (changé = vrai) : PROPAGER recommence une passe.");
          }
        });
      }
    },

    /* 7 ─────────────────────────────────────────────────────────── */
    {
      titre: "Passe 2, puis le point fixe",
      texte:
        "<p>Deuxième passe, lignes puis colonnes. Les poses de la passe 1 ont débloqué des lignes.</p>",
      objectif: "Poser les 2 dernières cases, puis dire combien de passes fait PROPAGER.",
      installer: function (zone, api) {
        var n = avant(function (p) { return p.passe === 2; });
        var att = selection(function (p) { return p.passe === 2; });
        var suite = el("div");
        U.chercher(zone, {
          e: etatApres(n), pb: PB, attendues: att, valeur: null, retour: api.retour,
          surFin: function () {
            api.retour("Ligne 1 : lm = lv = 1, le trait va en colonne 4. Ligne 4 : lm = 0, sa dernière case est un blanc. La grille est pleine.", true);
            zone.appendChild(suite);
            Exercices.choix(suite, {
              question: "Combien de passes la boucle « tant que changé » fait-elle en tout ?",
              options: ["2", "3", "4"], bonne: 1,
              expliquer: ["Non : la passe 2 a posé des cases, donc changé = vrai et la boucle refait une passe.", "", "Non : la passe 3 ne pose rien, changé reste faux, on sort."],
              surReussite: function () {
                PC.code(suite,
                  "def propager(pile):\n" +
                  "    change = True\n" +
                  "    while change:\n" +
                  "        change = False\n" +
                  "        for i in range(L):                    # les lignes\n" +
                  "            if lm[i] < 0 or lm[i] > lv[i]:\n" +
                  "                return False\n" +
                  "            if lv[i] > 0 and (lm[i] == 0 or lm[i] == lv[i]):\n" +
                  "                v = 0 if lm[i] == 0 else 1\n" +
                  "                for j in range(C):\n" +
                  "                    if grille[i][j] is VIDE:\n" +
                  "                        poser(i, j, v, pile)\n" +
                  "                change = True\n" +
                  "        for j in range(C):                    # les colonnes\n" +
                  "            ...                                # idem avec cm, cv\n" +
                  "    return True", "Ton code : propager()");
                api.valider("3 passes : la 3e vérifie que plus rien ne bouge (point fixe). 16 cases posées sans aucun choix.");
              }
            });
          }
        });
      }
    },

    /* 8 ─────────────────────────────────────────────────────────── */
    {
      titre: "Écrire la sortie",
      texte:
        "<p>Après PROPAGER, RECURSIVE(0) ne trouve aucune case vide : k atteint L·C, c'est une solution, la seule. Le programme affiche la grille : <span class='mono'>-</span> pour 1, <span class='mono'>*</span> pour 0.</p>",
      objectif: "Écrire exactement la sortie attendue.",
      installer: function (zone, api) {
        var g = new GrilleComptee(zone, {});
        U.dessinerEtat(g, etatApres(POSES.length), PB, {});
        Exercices.texte(zone, {
          label: "Sortie (stdout) :", lignes: 4, mode: "juge",
          attendu: B.sortie(PB),
          indice: "Une ligne par ligne de grille, sans espace : « - » pour un trait, « * » pour un blanc.",
          bravo: "C'est la sortie de l'énoncé.",
          surReussite: function () {
            PC.code(zone,
              "nb_sol, solution = resoudre(L, C, lignes, l, c)\n" +
              "if nb_sol == 1:\n" +
              "    print(\"\\n\".join(\"\".join('-' if x == 1 else '*' for x in ligne)\n" +
              "                    for ligne in solution))\n" +
              "else:\n" +
              "    print(\"NON\")", "Ton code : main()");
            api.valider("Les déductions ne suffisent pas toujours : sur l'exemple 2, il faudra faire des choix et revenir en arrière. C'est la leçon suivante.");
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "billet-modeliser",
    etapes: etapes,
    fin: {
      cartes: "oral-billet",
      texte:
        "<div class='encadre'><span class='titre-encadre'>À retenir pour l'oral</span><ul>" +
        "<li>Modèle : chaque <span class='mono'>*</span> est une inconnue 0/1 ; la ligne i doit avoir l[i] traits, la colonne j c[j].</li>" +
        "<li>Compteurs : lm/cm = traits manquants, lv/cv = cases vides, mis à jour en O(1).</li>" +
        "<li>Règles : lm &lt; 0 ou lm &gt; lv → contradiction ; lm = 0 → vides à 0 ; lm = lv → vides à 1.</li>" +
        "<li>PROPAGER : lignes puis colonnes, jusqu'à une passe sans changement (exemple 1 : 3 passes, 16 cases).</li>" +
        "<li>Sortie : la grille si nb_sol = 1, sinon NON.</li></ul></div>" +
        "<p>Prochaine étape : « Recherche et retour arrière », sur l'exemple 2.</p>"
    }
  });
})();
