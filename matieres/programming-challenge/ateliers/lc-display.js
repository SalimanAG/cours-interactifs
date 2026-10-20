/* Atelier : LC-Display (cours 1 Input/Output, exo1_3 « 706 - LC-Display »).
   Afficher un nombre en chiffres « 7 segments » de taille s : chaque chiffre occupe
   s + 2 colonnes et 2s + 3 lignes, une colonne blanche entre deux chiffres. */
(function () {
  "use strict";
  var el = Site.el;
  var NS = "http://www.w3.org/2000/svg";

  // segments : a haut, b haut-droite, c bas-droite, d bas, e bas-gauche, f haut-gauche, g milieu
  var SEG = {
    0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc",
    5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg"
  };
  var NOMS = { a: "haut", b: "haut droite", c: "bas droite", d: "bas", e: "bas gauche", f: "haut gauche", g: "milieu" };

  /* Rendu exact du problème : tableau de 2s + 3 lignes. */
  function rendu(nombre, s) {
    var chiffres = String(nombre).split("").map(Number);
    var lignes = [];
    for (var r = 0; r < 2 * s + 3; r++) {
      var morceaux = chiffres.map(function (d) {
        var on = SEG[d];
        var h = function (x) { return " " + new Array(s + 1).join(on.indexOf(x) >= 0 ? "-" : " ") + " "; };
        var v = function (x, y) { return (on.indexOf(x) >= 0 ? "|" : " ") + new Array(s + 1).join(" ") + (on.indexOf(y) >= 0 ? "|" : " "); };
        if (r === 0) return h("a");
        if (r <= s) return v("f", "b");
        if (r === s + 1) return h("g");
        if (r <= 2 * s + 1) return v("e", "c");
        return h("d");
      });
      lignes.push(morceaux.join(" "));
    }
    return lignes;
  }
  function partie(r, s) {
    if (r === 0) return 0;
    if (r <= s) return 1;
    if (r === s + 1) return 2;
    if (r <= 2 * s + 1) return 3;
    return 4;
  }

  /* Un chiffre 7 segments cliquable (SVG). */
  function afficheur(zone, surClic) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 80 130");
    svg.setAttribute("class", "afficheur");
    var formes = {
      a: [14, 6, 52, 10], g: [14, 60, 52, 10], d: [14, 114, 52, 10],
      f: [4, 16, 10, 44], b: [66, 16, 10, 44], e: [4, 70, 10, 44], c: [66, 70, 10, 44]
    };
    var rects = {};
    Object.keys(formes).forEach(function (k) {
      var f = formes[k];
      var r = document.createElementNS(NS, "rect");
      r.setAttribute("x", f[0]); r.setAttribute("y", f[1]); r.setAttribute("width", f[2]); r.setAttribute("height", f[3]); r.setAttribute("rx", 3);
      r.setAttribute("class", "segment");
      var t = document.createElementNS(NS, "title"); t.textContent = NOMS[k]; r.appendChild(t);
      r.addEventListener("click", function () { surClic(k); });
      svg.appendChild(r);
      rects[k] = r;
    });
    zone.appendChild(svg);
    return function (allumes) {
      Object.keys(rects).forEach(function (k) { rects[k].setAttribute("class", "segment" + (allumes[k] ? " allume" : "")); });
    };
  }

  var etapes = [
    {
      titre: "Les sept segments",
      texte: "<p>Chaque chiffre est dessiné avec des segments horizontaux (<span class='mono'>-</span>) et verticaux (<span class='mono'>|</span>). " +
        "Allume les segments (touche-les) pour former le chiffre demandé. Trois chiffres réussis débloquent la suite.</p>",
      objectif: "Former correctement trois chiffres.",
      installer: function (zone, api) {
        var cible, allumes, reussis = 0;
        var consigne = el("p", "legende-figure");
        zone.appendChild(consigne);
        var cadre = el("div", "cadre-figure centre-figure");
        zone.appendChild(cadre);
        var maj = afficheur(cadre, function (k) { allumes[k] = !allumes[k]; maj(allumes); });
        var barre = el("div", "rangee-btn");
        zone.appendChild(barre);
        PC.bouton(barre, "Vérifier", function () {
          var mien = Object.keys(allumes).filter(function (k) { return allumes[k]; }).sort().join("");
          var attendu = SEG[cible].split("").sort().join("");
          if (mien === attendu) {
            reussis++;
            api.retour("Exact : " + cible + " allume " + SEG[cible].length + " segments.", true);
            if (reussis >= 3) api.valider("Le cours code chaque chiffre de taille 1 dans une table de 5 lignes × 3 caractères (lookupTable) : c'est la même information.");
            nouveau();
          } else {
            api.retour("Pas tout à fait : compare avec un afficheur de calculatrice.", false);
          }
        }, true);
        function nouveau() {
          var c; do { c = PC.entier(0, 9); } while (c === cible);
          cible = c; allumes = {};
          maj(allumes);
          consigne.innerHTML = "<span>Chiffre à former : <span class='mono'>" + cible + "</span></span><span>réussis : <span class='mono'>" + reussis + " / 3</span></span>";
        }
        nouveau();
      }
    },
    {
      titre: "Les dimensions",
      texte: "<p>Pour une taille s, chaque chiffre occupe exactement <b>s + 2 colonnes</b> et <b>2s + 3 lignes</b> ; " +
        "une colonne de blancs sépare deux chiffres ; une ligne vide suit chaque nombre.</p>",
      objectif: "Calculer les dimensions de l'affichage demandé.",
      installer: function (zone, api) {
        var s = PC.entier(2, 5), n = String(PC.entier(100, 99999));
        var d = n.length;
        PC.entree(zone, s + " " + n + "\n0 0");
        Exercices.nombre(zone, {
          label: "nombre de lignes (sans la ligne vide) =", attendu: 2 * s + 3, tolerance: 0, placeholder: "ex. 9",
          indice: "2s + 3 avec s = " + s + ".",
          surReussite: function () {
            Exercices.nombre(zone, {
              label: "largeur d'une ligne (caractères) =", attendu: d * (s + 2) + (d - 1), tolerance: 0, placeholder: "ex. 29",
              indice: d + " chiffres de s + 2 = " + (s + 2) + " colonnes, plus une colonne blanche entre deux chiffres (" + (d - 1) + ").",
              bravo: "Exact : " + d + " × " + (s + 2) + " + " + (d - 1) + " = " + (d * (s + 2) + d - 1) + ".",
              surReussite: function () {
                PC.html(zone, "<div class='code'>" + rendu(n, s).join("\n").replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</div>");
                api.valider("Attention : chaque ligne doit être complète, y compris les blancs (« Be sure to fill all the white space »).");
              }
            });
          }
        });
      }
    },
    {
      titre: "Quelle partie pour la ligne r ?",
      texte: "<p>L'algorithme du cours parcourt les lignes à l'extérieur et les chiffres à l'intérieur :</p>" +
        "<div class='pseudo'><span class='titre-pseudo'>LC-DISPLAY(n, s)</span>" +
        "<div class='ligne'><span class='n'>1</span><span class='c'>pour r ← 0 à 2s + 2 faire</span></div>" +
        "<div class='ligne'><span class='n'>2</span><span class='c'>    pour chaque chiffre c de n faire</span></div>" +
        "<div class='ligne'><span class='n'>3</span><span class='c'>        afficher la ligne r du chiffre c (taille s)</span></div>" +
        "<div class='ligne'><span class='n'>4</span><span class='c'>        si c n'est pas le dernier chiffre : afficher un blanc</span></div>" +
        "<div class='ligne'><span class='n'>5</span><span class='c'>    passer à la ligne</span></div></div>" +
        "<div class='signalement'>Le cours numérote les lignes de 1 à 2s + 3 et nomme la taille « w » dans les données puis « s » dans le corps : j'utilise s partout et je compte les lignes à partir de 0.</div>" +
        "<p>Pour la ligne r, quelle partie du chiffre dessine-t-on ? Trois bonnes réponses d'affilée.</p>",
      objectif: "Identifier la partie pour trois lignes d'affilée.",
      installer: function (zone, api) {
        var noms = ["segment du haut", "verticales du haut", "segment du milieu", "verticales du bas", "segment du bas"];
        var serie = 0;
        var q = el("div");
        zone.appendChild(q);
        function nouveau() {
          q.innerHTML = "";
          var s = PC.entier(1, 4), r = PC.entier(0, 2 * s + 2);
          var bonne = partie(r, s);
          q.appendChild(el("p", "mono", "s = " + s + ", r = " + r + "   (lignes 0 à " + (2 * s + 2) + ")"));
          Exercices.choix(q, {
            options: noms, bonne: bonne,
            expliquer: noms.map(function (x, i) {
              return i === bonne ? "Exact. Haut : r = 0 ; verticales du haut : 1 ≤ r ≤ s ; milieu : r = s + 1 ; verticales du bas : s + 2 ≤ r ≤ 2s + 1 ; bas : r = 2s + 2." :
                "Non. Repère d'abord le milieu : r = s + 1 = " + (s + 1) + ".";
            }),
            surReussite: function () {
              serie++;
              api.retour("Série : " + serie + " / 3", serie >= 3 ? true : null);
              if (serie >= 3) api.valider();
              var b = PC.bouton(q, "Ligne suivante →", nouveau, true);
              b.style.marginTop = ".5rem";
            }
          });
          q.querySelectorAll(".choix button").forEach(function (b) {
            b.addEventListener("click", function () { if (b.classList.contains("faux")) serie = 0; });
          });
        }
        nouveau();
      }
    },
    {
      titre: "Écrire la sortie",
      texte: "<p>À toi d'être le programme. Écris la sortie exacte pour l'entrée ci-dessous (les blancs de fin de ligne sont ignorés, comme par la plupart des juges ; " +
        "les blancs du début comptent).</p>",
      objectif: "Produire la sortie exacte d'un chiffre.",
      installer: function (zone, api) {
        var d = [2, 3, 4, 5, 6, 7, 9][PC.entier(0, 6)];
        PC.entree(zone, "1 " + d + "\n0 0");
        var att = rendu(d, 1).join("\n");
        Exercices.texte(zone, {
          label: "Sortie :", lignes: 6, attendu: att,
          indice: "5 lignes de 3 caractères : ' - ' pour un segment horizontal allumé, '|' en colonne 0 ou 2 pour un vertical.",
          bravo: "Exact.",
          surReussite: function () {
            PC.code(zone,
              "SEG = {0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc',\n" +
              "       5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg'}\n\n" +
              "def ligne(c, r, s):\n" +
              "    on = SEG[c]\n" +
              "    h = lambda x: ' ' + ('-' if x in on else ' ') * s + ' '\n" +
              "    v = lambda x, y: ('|' if x in on else ' ') + ' ' * s + ('|' if y in on else ' ')\n" +
              "    if r == 0: return h('a')\n" +
              "    if r <= s: return v('f', 'b')\n" +
              "    if r == s + 1: return h('g')\n" +
              "    if r <= 2 * s + 1: return v('e', 'c')\n" +
              "    return h('d')\n\n" +
              "def afficher(n, s):\n" +
              "    for r in range(2 * s + 3):\n" +
              "        print(' '.join(ligne(int(c), r, s) for c in n))\n" +
              "    print()                      # ligne vide après chaque nombre", "Une solution en Python");
            api.valider("Les lignes sont construites de gauche à droite, chiffre par chiffre : impossible d'afficher un chiffre entier puis le suivant.");
          }
        });
        var aide = el("details");
        aide.appendChild(el("summary", null, "Voir le chiffre en taille 2 (aide visuelle)"));
        aide.appendChild(el("div", "code", rendu(d, 2).join("\n")));
        zone.appendChild(aide);
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "lc-display",
    etapes: etapes,
    fin: {
      cartes: "demarrer-es",
      texte: "<p>LC-Display est un exercice d'<b>organisation de la sortie</b> : on calcule les lignes une à une (boucle externe sur r, interne sur les chiffres), " +
        "avec une table qui dit quels segments chaque chiffre allume.</p>"
    }
  });
})();
