/* Leçon : Making Book (cours 3 Array, Exercise 1 ; exo3_1).
   Compter les occurrences de chaque chiffre dans les numéros de page de A à B.
   Fil rouge : l'exemple de l'énoncé, pages 10 à 15. */
(function () {
  "use strict";
  var el = Site.el;

  function compter(a, b) {
    if (a > b) { var t = a; a = b; b = t; }
    var c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var p = a; p <= b; p++) String(p).split("").forEach(function (d) { c[+d]++; });
    return c;
  }
  function ligneCase(i, c) { return "Case " + i + ": " + c.map(function (x, d) { return d + ":" + x; }).join(" "); }

  /* Grille de 10 compteurs à remplir. */
  function compteurs(zone, attendu, fini) {
    var g = el("div", "adj compteurs");
    zone.appendChild(g);
    var champs = [];
    for (var d = 0; d <= 9; d++) {
      var lab = el("label", null, "chiffre " + d);
      var c = el("input"); c.type = "text"; c.inputMode = "numeric"; c.autocomplete = "off"; c.id = "cpt" + d; lab.htmlFor = c.id; c.placeholder = "0";
      g.appendChild(lab); g.appendChild(c); champs.push(c);
    }
    var b = el("button", "btn", "Vérifier"); b.type = "button"; zone.appendChild(b);
    var r = el("div", "retour"); zone.appendChild(r);
    b.onclick = function () {
      var j = 0;
      champs.forEach(function (c, d) {
        var v = c.value.trim() === "" ? 0 : +c.value;
        var ok = v === attendu[d];
        c.className = ok ? "bon" : "faux";
        if (ok) j++;
      });
      if (j === 10) { champs.forEach(function (c) { c.disabled = true; }); b.disabled = true; r.className = "retour ok"; r.textContent = "Les 10 compteurs sont justes."; fini(); }
      else { r.className = "retour ko"; r.textContent = j + " / 10 justes. Les compteurs barrés sont faux (une case vide compte pour 0)."; }
    };
  }

  var etapes = [
    {
      titre: "Le problème",
      texte:
        "<p>Un imprimeur doit composer les numéros des pages A à B (incluses) : combien de fois utilise-t-il chaque chiffre 0 à 9 ? " +
        "Plusieurs cas, une ligne « A B » chacun ; un 0 seul termine l'entrée.</p>" +
        "<p>Le cours commence toujours par « <i>What problems can arise ?</i> » : que sait-on de A et B ? Peut-on avoir A &gt; B ? A = B ? Quelle taille ? " +
        "Les entiers suffisent-ils ? Quel type de tableau pour la solution ?</p>",
      objectif: "Répondre aux questions du cours à partir de l'énoncé.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "A peut être plus grand que B.", vrai: true, explication: "L'énoncé ne l'interdit pas et le cours teste « 220 202 » : il faut échanger A et B." },
            { texte: "A peut être égal à B.", vrai: true, explication: "Test du cours « 912 912 » : une seule page." },
            { texte: "Un numéro de page peut avoir 4 chiffres.", vrai: false, explication: "« no page will have more than three digits » : B ≤ 999." },
            { texte: "Un compteur peut dépasser la capacité d'un int 32 bits.", vrai: false, explication: "Au plus 999 pages × 3 chiffres = 2 997 : un int suffit largement." },
            { texte: "La solution tient dans un tableau de 10 entiers.", vrai: true, explication: "Un compteur par chiffre 0..9, indexé par le chiffre lui-même." }
          ],
          surReussite: function () { api.valider("Les bornes (≤ 999) rendent la force brute suffisante : au plus 2 997 chiffres à compter par cas."); }
        });
      }
    },
    {
      titre: "Force brute, à la main",
      texte:
        "<p>Solution 1 du cours : pour chaque page de A à B, pour chaque chiffre de la page, incrémenter la case correspondante. " +
        "Fais-le pour les pages 10, 11, 12, 13, 14, 15.</p>",
      objectif: "Remplir les 10 compteurs pour les pages 10 à 15.",
      installer: function (zone, api) {
        var pc = new Tableau(zone, { nom: "pages" , indices: false });
        pc.dessiner([10, 11, 12, 13, 14, 15]);
        compteurs(zone, compter(10, 15), function () {
          PC.code(zone,
            "def compter(a, b):\n" +
            "    if a > b:\n" +
            "        a, b = b, a\n" +
            "    c = [0] * 10                  # c[d] = occurrences du chiffre d\n" +
            "    for page in range(a, b + 1):\n" +
            "        for ch in str(page):\n" +
            "            c[int(ch)] += 1\n" +
            "    return c", "Solution 1 en Python");
          api.valider("Le chiffre 1 apparaît 7 fois : une fois dans chaque dizaine (10…15) et une fois de plus dans 11.");
        });
      }
    },
    {
      titre: "Le format de sortie, au caractère près",
      texte: "<p>Format de l'exemple : <span class='mono'>Case 1: 0:1 1:7 2:1 …</span> — le numéro du cas, deux-points, puis « chiffre:compte » séparés par des espaces.</p>",
      objectif: "Écrire la sortie exacte de cette entrée.",
      installer: function (zone, api) {
        PC.entree(zone, "912 912\n0");
        Exercices.texte(zone, {
          label: "Sortie :", attendu: ligneCase(1, compter(912, 912)), placeholder: "Case 1: 0:…",
          indice: "Une seule page : 912. Et c'est le cas numéro 1.",
          bravo: "Exact.",
          surReussite: function () {
            PC.code(zone, "print('Case %d: ' % num + ' '.join('%d:%d' % (d, c[d]) for d in range(10)))");
            api.valider("Le juge compare caractère par caractère : un espace en trop après « Case 1: », un « case » sans majuscule, et c'est Wrong Answer.");
          }
        });
      }
    },
    {
      titre: "Échanger A et B",
      texte: "<p>Le test « 220 202 » oblige à échanger A et B. Voici un échange écrit trop vite (une erreur classique) :</p>",
      objectif: "Trouver ce que fait ce code, puis la bonne écriture.",
      installer: function (zone, api) {
        PC.code(zone, "a, b = 220, 202\nif a > b:\n    temp = a\n    b = a\n    a = temp");
        Exercices.choix(zone, {
          question: "Que valent a et b après ce code ?",
          options: ["a = 202, b = 220", "a = 220, b = 220", "a = 202, b = 202"],
          bonne: 1,
          expliquer: ["Non : regarde la ligne b = a — l'ancienne valeur de b est écrasée sans avoir été sauvée.", "Exact : b reçoit a (220), puis a reçoit temp, qui vaut aussi 220. La valeur 202 est perdue.", "Non : temp contient 220, pas 202."],
          surReussite: function () {
            PC.code(zone, "a, b = b, a            # Python : échange en une ligne\n# ou bien : temp = a ; a = b ; b = temp");
            api.valider("Avec l'échange raté, on compterait les pages 220 à 220 au lieu de 202 à 220 : Wrong Answer sur ce seul test.");
          }
        });
      }
    },
    {
      titre: "Solution 2 : par l'arithmétique",
      texte:
        "<p>Le cours esquisse une solution sans parcourir les pages :</p>" +
        "<div class='pseudo'><span class='titre-pseudo'>Solution 2 (cours)</span>" +
        "<div class='ligne'><span class='c'>si A &gt; B alors échanger A et B</span></div>" +
        "<div class='ligne'><span class='c'>diff ← B − A + 1</span></div>" +
        "<div class='ligne'><span class='c'>initialiser chaque compteur à ⌊diff / 10⌋</span></div>" +
        "<div class='ligne'><span class='c'>si diff mod 10 ≠ 0 : traiter les unités restantes</span></div>" +
        "<div class='ligne'><span class='c'>A ← ⌊A / 10⌋ ; B ← ⌊B / 10⌋</span></div>" +
        "<div class='ligne'><span class='c'>traiter les dizaines (et ainsi de suite)</span></div></div>" +
        "<div class='signalement'>Le cours ne détaille pas « deal with the units / tens ». L'idée : sur diff pages consécutives, le chiffre des unités parcourt 0…9 ⌊diff/10⌋ fois en entier, " +
        "le reste se compte à part ; puis on recommence un rang plus haut. Avec B ≤ 999, la force brute suffit : cette solution sert surtout pour de grands intervalles.</div>" +
        "<p>Vérifie l'idée sur le dernier test du cours, pages 900 à 999 (diff = 100) :</p>",
      objectif: "Compter les 9 et les 0 de 900 à 999 sans tout énumérer.",
      installer: function (zone, api) {
        Exercices.nombre(zone, {
          label: "nombre de 0 =", attendu: 20, tolerance: 0, placeholder: "ex. 10",
          indice: "Unités : chaque chiffre 10 fois sur 100 pages. Dizaines : idem. Centaines : toujours 9.",
          bravo: "Exact : 10 (unités) + 10 (dizaines) = 20.",
          surReussite: function () {
            Exercices.nombre(zone, {
              label: "nombre de 9 =", attendu: 120, tolerance: 0, placeholder: "ex. 100",
              indice: "10 aux unités, 10 aux dizaines, et le chiffre des centaines vaut 9 sur les 100 pages.",
              bravo: "Exact : 10 + 10 + 100 = 120 (« Case 5: … 9:120 » dans le cours).",
              surReussite: function () { api.valider(); }
            });
          }
        });
      }
    },
    {
      titre: "Les autres tests du cours",
      texte: "<p>« More test cases » du cours, cas 2 : pages 15 à 104.</p>",
      objectif: "Trouver les compteurs des chiffres 0 et 1.",
      installer: function (zone, api) {
        PC.entree(zone, "10 15\n15 104\n220 202\n912 912\n900 999\n0");
        Exercices.nombre(zone, {
          label: "Case 2, chiffre 0 :", attendu: 14, tolerance: 0, placeholder: "ex. 10",
          indice: "Les 0 des unités : 20, 30, …, 100 (9 nombres, dont 100 qui en a deux), puis 101 à 104.",
          bravo: "Exact : 14.",
          surReussite: function () {
            Exercices.nombre(zone, {
              label: "Case 2, chiffre 1 :", attendu: 19, tolerance: 0, placeholder: "ex. 10",
              indice: "Dizaines 15-19 (5), unités 21, 31, …, 91 (8), puis 100 à 104 (5 centaines + l'unité de 101).",
              bravo: "Exact : 19. Tous les chiffres 1 à 9 valent 19 dans ce cas.",
              surReussite: function () { api.valider("Ce genre de comptage à la main est typique d'une question d'examen sur table."); }
            });
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "making-book",
    etapes: etapes,
    fin: { cartes: "tableaux", texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul><li>Toujours commencer par les bornes : A &gt; B possible, A = B possible, ≤ 3 chiffres.</li><li>Un tableau de 10 compteurs indexé par le chiffre.</li><li>Format de sortie exact : <span class='mono'>Case i: 0:x 1:y …</span></li><li>Échange : <span class='mono'>a, b = b, a</span>.</li></ul></div>" }
  });
})();
