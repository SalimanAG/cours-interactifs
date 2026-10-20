/* Leçon : Quand l'entier ne suffit plus (cours 2 Numbers ; exo2_1 / exo2_2 GILNUM).
   Fil rouge : GILNUM — additionner deux grands entiers non signés lus comme des chaînes. */
(function () {
  "use strict";
  var el = Site.el;

  /* Addition posée interactive : on tape les chiffres du résultat de droite à gauche. */
  function addition(zone, a, b, fini) {
    var somme = ajouter(a, b);
    var L = somme.length;
    var pa = pad(a, L), pb = pad(b, L);
    var ret = [];         // retenue entrant dans chaque colonne (depuis la droite)
    var c = 0;
    for (var k = 0; k < L; k++) {
      ret.push(c);
      var x = (+pa[L - 1 - k] || 0) + (+pb[L - 1 - k] || 0) + c;
      c = x >= 10 ? 1 : 0;
    }
    var k = 0, res = [];
    var boite = el("div", "addition");
    zone.appendChild(boite);
    var msg = el("p", "legende-figure");
    zone.appendChild(msg);
    var clavier = el("div", "clavier");
    zone.appendChild(clavier);
    for (var d = 0; d <= 9; d++) (function (d) {
      var bt = el("button", "btn btn-petit", String(d));
      bt.type = "button";
      bt.onclick = function () { taper(d); };
      clavier.appendChild(bt);
    })(d);
    function rangee(cl, chars, courante) {
      var r = el("div", "rang " + cl);
      chars.forEach(function (ch, i) { r.appendChild(el("span", "ch" + (courante === i ? " courante" : ""), ch)); });
      return r;
    }
    function dessiner() {
      boite.innerHTML = "";
      var rr = [];
      for (var i = 0; i < L; i++) { var kk = L - 1 - i; rr.push(kk <= k && kk > 0 && ret[kk] ? "1" : ""); }
      var r1 = rangee("ret", rr); r1.querySelectorAll(".ch").forEach(function (x) { x.classList.add("ret"); });
      boite.appendChild(r1);
      boite.appendChild(rangee("", pa.split("").map(function (x, i) { return i < L - a.length ? "" : x; })));
      var lb = pb.split("").map(function (x, i) { return i < L - b.length ? "" : x; });
      var rb = rangee("", lb);
      rb.insertBefore(el("span", "ch", "+"), rb.firstChild);
      boite.appendChild(rb);
      boite.appendChild(el("div", "trait"));
      var lr = [];
      for (var j = 0; j < L; j++) { var kj = L - 1 - j; lr.push(kj < k ? somme[j] : ""); }
      boite.appendChild(rangee("res", lr, k < L ? L - 1 - k : -1));
    }
    function taper(d) {
      if (k >= L) return;
      var att = +somme[L - 1 - k];
      if (d === att) {
        k++;
        var x = (+pa[L - k] || 0) + (+pb[L - k] || 0) + ret[k - 1];
        msg.textContent = (+pa[L - k] || 0) + " + " + (+pb[L - k] || 0) + (ret[k - 1] ? " + 1 (retenue)" : "") + " = " + x +
          " → on écrit " + (x % 10) + (x >= 10 ? ", retenue 1" : "") + ".";
        dessiner();
        if (k === L) {
          clavier.querySelectorAll("button").forEach(function (bt) { bt.disabled = true; });
          fini(somme);
        }
      } else {
        msg.textContent = "Non : additionne les deux chiffres de la colonne, sans oublier la retenue éventuelle.";
      }
    }
    dessiner();
  }
  function pad(s, L) { return new Array(L - s.length + 1).join("0") + s; }
  function ajouter(a, b) {
    var i = a.length - 1, j = b.length - 1, c = 0, r = "";
    while (i >= 0 || j >= 0 || c) {
      var x = (i >= 0 ? +a[i] : 0) + (j >= 0 ? +b[j] : 0) + c;
      r = (x % 10) + r; c = x >= 10 ? 1 : 0; i--; j--;
    }
    return r.replace(/^0+(?=\d)/, "");
  }

  var etapes = [

    /* 1 */
    {
      titre: "Un mot machine est fini",
      texte:
        "<p>Les nombres machine sont des abstractions des nombres mathématiques, stockés dans des mots de n bits : on ne représente que 2<sup>n</sup> valeurs. " +
        "Le cours (« The range problem ») donne :</p>" +
        "<div class='deux-figures'><table class='tableau'><tr><th>mot</th><th class='num'>valeurs</th></tr>" +
        "<tr><td class='mono'>2^32</td><td class='num'>≈ 4,29 × 10^9</td></tr>" +
        "<tr><td class='mono'>2^64</td><td class='num'>≈ 1,84 × 10^19</td></tr>" +
        "<tr><td class='mono'>2^128</td><td class='num'>≈ 3,40 × 10^38</td></tr></table>" +
        "<table class='tableau'><tr><th>n</th><th class='num'>n!</th></tr>" +
        "<tr><td class='mono'>12!</td><td class='num'>≈ 4,79 × 10^8</td></tr><tr><td class='mono'>13!</td><td class='num'>≈ 6,23 × 10^9</td></tr>" +
        "<tr><td class='mono'>20!</td><td class='num'>≈ 2,43 × 10^18</td></tr><tr><td class='mono'>21!</td><td class='num'>≈ 5,11 × 10^19</td></tr></table></div>" +
        "<p>C'est au programmeur de garantir qu'aucun calcul ne déborde.</p>",
      objectif: "Trouver la plus grande factorielle qui tient dans un entier non signé de 64 bits.",
      installer: function (zone, api) {
        Exercices.nombre(zone, {
          label: "plus grand n tel que n! < 2^64 : n =", attendu: 20, tolerance: 0, placeholder: "ex. 12",
          indice: "Compare les factorielles du tableau avec 2^64 ≈ 1,844 × 10^19.",
          bravo: "Exact : 20! ≈ 2,4 × 10^18 tient, 21! ≈ 5,1 × 10^19 déborde.",
          surReussite: function () {
            Exercices.nombre(zone, {
              label: "et sur 32 bits (n! < 2^32) : n =", attendu: 12, tolerance: 0, placeholder: "ex. 12",
              indice: "12! ≈ 4,79 × 10^8 et 13! ≈ 6,2 × 10^9.",
              bravo: "Exact : 12. Un int 32 bits déborde dès 13!.",
              surReussite: function () { api.valider("Réflexe « What problems can arise ? » : estimer la plus grande valeur possible du résultat avant de choisir le type."); }
            });
          }
        });
      }
    },

    /* 2 */
    {
      titre: "Le complément à deux",
      texte:
        "<p>Les entiers signés sont codés en complément à deux sur n bits :</p>" +
        "<div class='formule'>x = − b(n−1) · 2^(n−1) + Σ (i &lt; n−1) b(i) · 2^i</div>" +
        "<p>On représente ainsi de −2^(n−1) à 2^(n−1) − 1. Le cours montre que la soustraction devient une addition : " +
        "<span class='mono'>12 − 5 = 12 + (−5)</span> : <span class='mono'>0000 1100 + 1111 1011 = 0000 0111</span> (7, la retenue sortante est perdue).</p>",
      objectif: "Coder −3 sur 8 bits, puis décoder un octet.",
      installer: function (zone, api) {
        Exercices.texte(zone, {
          label: "−3 sur 8 bits :", attendu: ["11111101", "1111 1101"], mode: "exact", placeholder: "8 chiffres 0/1",
          indice: "−3 = −128 + 125 : le bit de poids 7 vaut 1, les 7 autres codent 125 = 1111101.",
          bravo: "Exact : 1111 1101 (= −128 + 64 + 32 + 16 + 8 + 4 + 1).",
          surReussite: function () {
            Exercices.nombre(zone, {
              label: "valeur de 1111 0100 :", attendu: -12, tolerance: 0, placeholder: "ex. -7",
              indice: "−128 + 64 + 32 + 16 + 4.",
              bravo: "Exact : −12.",
              surReussite: function () { api.valider("Sur 8 bits : de −128 à 127. 127 + 1 donne −128 : c'est un débordement silencieux."); }
            });
          }
        });
        PC.html(zone, "Le cours montre aussi le format des flottants IEEE 754 (x = (−1)^s × 1.m × 2^(e − bias), s sur 1 bit, m sur 23 bits, e sur 8 bits) sans exercice : il est dans les cartes.", "discret petit");
      }
    },

    /* 3 */
    {
      titre: "Les grands nombres (bignums)",
      texte:
        "<p>Plusieurs langages ont des grands nombres intégrés : Lisp, <b>Python</b>, Perl, Haskell, Ruby. C, C++ et Java ont des bibliothèques. " +
        "Au lieu d'un nombre fixe de bits, ces implémentations stockent des <b>tableaux de chiffres de longueur variable</b>.</p>",
      objectif: "Dire ce que les grands nombres apportent et coûtent.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Ils suppriment les débordements simples.", vrai: true, explication: "« Eliminates simple overflow »." },
            { texte: "Ils sont aussi rapides que les entiers machine.", vrai: false, explication: "« Reduces performances » : une opération coûte en fonction du nombre de chiffres." },
            { texte: "Ils donnent le même résultat sur toutes les machines.", vrai: true, explication: "« Guarantees the results on all machines »." },
            { texte: "En Python, <span class='mono'>int('3333311111111111') + int('44422222221111')</span> est exact.", vrai: true, explication: "Les int de Python sont des grands nombres : c'est la « Solution 1 » du cours." }
          ],
          surReussite: function () { api.valider("En Python, la difficulté de GILNUM n'est donc pas le calcul, mais la lecture et la validation de l'entrée. Mais il faut savoir faire l'addition sans bignum (Solution 2 du cours) : c'est l'étape suivante."); }
        });
      }
    },

    /* 4 */
    {
      titre: "L'addition posée, chiffre par chiffre",
      texte:
        "<p>Solution 2 du cours, sans grands nombres : additionner les deux chaînes comme à la main, <b>de droite à gauche</b>, avec une retenue. " +
        "Tape les chiffres du résultat en commençant par les unités.</p>",
      objectif: "Terminer l'addition.",
      installer: function (zone, api) {
        var a, b;
        do { a = String(PC.entier(10000, 999999)); b = String(PC.entier(100, 99999)); } while (ajouter(a, b).length <= a.length);
        addition(zone, a, b, function (s) {
          api.retour(a + " + " + b + " = " + s, true);
          PC.code(zone,
            "def ajouter(a, b):                 # a, b : chaînes de chiffres\n" +
            "    i, j, retenue = len(a) - 1, len(b) - 1, 0\n" +
            "    res = []\n" +
            "    while i >= 0 or j >= 0 or retenue:\n" +
            "        x = retenue\n" +
            "        if i >= 0: x += ord(a[i]) - ord('0')\n" +
            "        if j >= 0: x += ord(b[j]) - ord('0')\n" +
            "        res.append(chr(ord('0') + x % 10))\n" +
            "        retenue = x // 10\n" +
            "        i -= 1; j -= 1\n" +
            "    return ''.join(reversed(res))", "Solution 2 en Python");
          api.valider("Coût O(max(|a|, |b|)) : au plus 236 chiffres ici. La boucle continue tant qu'il reste une retenue : le résultat peut avoir un chiffre de plus.");
        });
      }
    },

    /* 5 */
    {
      titre: "Entrée valide ou « ? »",
      texte:
        "<p>GILNUM : chaque ligne contient une chaîne représentant un grand nombre (au plus 235 chiffres). La chaîne peut <b>ne pas être un nombre valide</b> " +
        "(une lettre n'est pas un chiffre, ou la chaîne est vide) et peut avoir des <b>zéros non significatifs</b>. La ligne i de la sortie est la somme des lignes 2i − 1 et 2i, " +
        "sans zéros non significatifs, ou <span class='mono'>?</span> si l'une des deux n'est pas valide.</p>",
      objectif: "Prévoir la sortie pour chaque paire de lignes.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "<span class='mono'>(ligne vide) + 43</span> → <span class='mono'>43</span>", vrai: false, explication: "La chaîne vide n'est pas un nombre valide : ?" },
            { texte: "<span class='mono'>1x + 1234</span> → <span class='mono'>?</span>", vrai: true, explication: "« x » n'est pas un chiffre." },
            { texte: "<span class='mono'>00930261 + 4</span> → <span class='mono'>930265</span>", vrai: true, explication: "Les zéros non significatifs sont acceptés en entrée et retirés en sortie." },
            { texte: "<span class='mono'>L33T + 12</span> → <span class='mono'>?</span>", vrai: true, explication: "Le L et le T ne sont pas des chiffres." }
          ],
          surReussite: function () {
            PC.html(zone, "L'énoncé ne dit pas quoi afficher pour une somme nulle (<span class='mono'>000 + 0</span>) ; la sortie naturelle est <span class='mono'>0</span> (on retire les zéros non significatifs, pas le dernier chiffre).", "signalement");
            api.valider("Valide = non vide et uniquement des caractères 0 à 9.");
          }
        });
      }
    },

    /* 6 */
    {
      titre: "Lire les lignes sans en perdre",
      texte:
        "<p>Les nombres vont <b>par paires de lignes</b>, et une ligne peut être <b>vide</b>. La façon de lire l'entrée devient décisive.</p>",
      objectif: "Choisir la lecture correcte, puis le bon test de validité.",
      installer: function (zone, api) {
        PC.entree(zone, "3333311111111111\n44422222221111\n\n43\n1x\n1234");
        Exercices.choix(zone, {
          question: "Quelle lecture garde l'appariement des lignes ?",
          options: [
            "sys.stdin.read().split()",
            "sys.stdin.read().split('\\n') (en retirant le dernier élément vide s'il y en a un)"
          ],
          bonne: 1,
          expliquer: [
            "Non : split() sans argument jette les lignes vides. Ici « (vide) + 43 » deviendrait « 43 + 1x » : tout est décalé.",
            "Exact : chaque ligne, même vide, garde sa place."
          ],
          surReussite: function () {
            Exercices.choix(zone, {
              question: "Quel test de validité est sûr ?",
              options: [
                "s.isdigit()",
                "s != '' and all(c in '0123456789' for c in s)"
              ],
              bonne: 1,
              expliquer: [
                "Presque : ''.isdigit() vaut bien False, mais '²'.isdigit() vaut True (exposant Unicode). Le test explicite est plus sûr.",
                "Exact : non vide et seulement les dix chiffres ASCII."
              ],
              surReussite: function () {
                PC.code(zone,
                  "import sys\n" +
                  "lignes = sys.stdin.read().split('\\n')\n" +
                  "if lignes and lignes[-1] == '':\n" +
                  "    lignes.pop()                  # le dernier '\\n' crée un élément vide\n" +
                  "valide = lambda s: s != '' and all(c in '0123456789' for c in s)\n" +
                  "for i in range(0, len(lignes) - 1, 2):\n" +
                  "    a, b = lignes[i].strip('\\r'), lignes[i + 1].strip('\\r')\n" +
                  "    print(ajouter(a, b) if valide(a) and valide(b) else '?')");
                api.valider("Le strip('\\r') protège contre les fins de ligne Windows (13 puis 10), que le cours cite comme « l'une des plaies » des fichiers texte.");
              }
            });
          }
        });
      }
    },

    /* 7 */
    {
      titre: "Sans zéros non significatifs",
      texte: "<p>Dernier détail du format de sortie : retirer les zéros de tête, mais garder un chiffre.</p>",
      objectif: "Écrire la sortie exacte de deux additions.",
      installer: function (zone, api) {
        PC.entree(zone, "000999\n0001\n0000\n0");
        Exercices.texte(zone, {
          label: "Sortie :", lignes: 2, attendu: "1000\n0",
          indice: "999 + 1, puis 0 + 0 : une ligne par paire.",
          bravo: "Exact.",
          surReussite: function () {
            PC.code(zone, "res = res.lstrip('0') or '0'     # « 0000 » → « 0 »");
            api.valider("En Python, str(int(a) + int(b)) fait tout cela d'un coup (Solution 1), une fois la validité vérifiée.");
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "grands-nombres",
    etapes: etapes,
    fin: {
      cartes: "nombres",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul>" +
        "<li>n bits → 2^n valeurs ; 20! tient sur 64 bits non signés, 21! non ; 12! sur 32 bits.</li>" +
        "<li>Complément à deux : −2^(n−1) à 2^(n−1) − 1 ; soustraire = additionner l'opposé.</li>" +
        "<li>Grands nombres = tableaux de chiffres : plus de débordement, mais plus lents.</li>" +
        "<li>GILNUM : addition de droite à gauche avec retenue ; valider (non vide, chiffres 0-9) ; lire ligne à ligne sans perdre les lignes vides ; retirer les zéros de tête.</li></ul></div>"
    }
  });
})();
