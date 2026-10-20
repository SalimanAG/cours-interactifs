/* Atelier : Miroir des n bits de poids faible (cours 2 Numbers, « Bit Reverse » ; exo2_3 MIRROR).
   Entrée : x en base 16 et n en base 10. Sortie : x (en base 16) dont les n bits de poids faible
   sont inversés (b(n−1)…b0 devient b0…b(n−1)) ; x inchangé si n ∉ [2, 32]. */
(function () {
  "use strict";
  var el = Site.el;

  function miroir(x, n) {
    if (n < 2 || n > 32) return x >>> 0;
    var bas = n === 32 ? x >>> 0 : (x & ((1 << n) - 1)) >>> 0;   // n bits de poids faible
    var r = 0;
    for (var i = 0; i < n; i++) r = (r * 2) + ((bas >>> i) & 1);
    var haut = n === 32 ? 0 : (x >>> n) * Math.pow(2, n);
    return (haut + r) >>> 0;
  }
  function hex(x) { return "0x" + (x >>> 0).toString(16).toUpperCase(); }
  function lireHex(s) { s = s.trim().replace(/^0x/i, ""); return /^[0-9a-f]+$/i.test(s) ? parseInt(s, 16) : NaN; }

  /* Affichage des k bits de poids faible, la zone des n bits en gris. */
  function bits(zone, x, k, n, titre) {
    var d = el("div");
    if (titre) d.appendChild(el("span", "discret petit", titre));
    var b = el("div", "bits");
    for (var i = k - 1; i >= 0; i--) {
      var c = el("span", "bit" + (i < n ? " zone-n" : ""));
      c.appendChild(el("span", "p", String(i)));
      c.appendChild(document.createTextNode(String(Math.floor(x / Math.pow(2, i)) % 2)));
      b.appendChild(c);
      if (i % 4 === 0 && i) b.appendChild(el("span", "sep4"));
    }
    d.appendChild(b);
    zone.appendChild(d);
    return d;
  }
  function saisieHex(zone, attendu, fini, indice) {
    var ligne = el("div", "saisie");
    var lab = el("label", null, "Sortie :");
    var champ = el("input"); champ.type = "text"; champ.className = "mono"; champ.placeholder = "ex. 0x3CF"; champ.autocomplete = "off";
    champ.setAttribute("autocapitalize", "off");
    var b = el("button", "btn", "Vérifier"); b.type = "button";
    var r = el("div", "retour");
    ligne.appendChild(lab); ligne.appendChild(champ); ligne.appendChild(b);
    zone.appendChild(ligne); zone.appendChild(r);
    function v() {
      var x = lireHex(champ.value);
      if (isNaN(x)) { r.className = "retour ko"; r.textContent = "Écris un nombre en base 16 (ex. 0x3CF)."; return; }
      if ((x >>> 0) === (attendu >>> 0)) {
        r.className = "retour ok"; r.textContent = "Exact : " + hex(attendu) + ".";
        champ.disabled = true; b.disabled = true; fini();
      } else { r.className = "retour ko"; r.textContent = indice || "Non."; }
    }
    b.onclick = v;
    champ.addEventListener("keydown", function (e) { if (e.key === "Enter") v(); });
  }

  var etapes = [
    {
      titre: "Du binaire au miroir",
      texte: "<p>L'effet miroir sur les n bits de poids faible : avec n = 3, <span class='mono'>b31…b3 001</span> devient <span class='mono'>b31…b3 100</span>, " +
        "<span class='mono'>011</span> devient <span class='mono'>110</span>, <span class='mono'>010</span> reste <span class='mono'>010</span>. Les bits de poids fort ne bougent pas.</p>" +
        "<p>Premier exemple de l'énoncé : <span class='mono'>0x701 3</span>. Les bits en gris sont les n = 3 bits concernés.</p>",
      objectif: "Calculer le miroir de 0x701 sur 3 bits.",
      installer: function (zone, api) {
        bits(zone, 0x701, 12, 3, "x = 0x701");
        saisieHex(zone, miroir(0x701, 3), function () {
          bits(zone, miroir(0x701, 3), 12, 3, "résultat = 0x704");
          api.valider("001 → 100 : la partie basse passe de 1 à 4, d'où 0x701 → 0x704.");
        }, "Les 3 derniers bits 001 deviennent 100 ; le reste ne change pas.");
      }
    },
    {
      titre: "Les exemples de l'énoncé",
      texte: "<p>Même travail sur d'autres lignes de l'exemple de l'énoncé. Pense par groupes de 4 bits (un chiffre hexadécimal).</p>",
      objectif: "Réussir les deux exemples.",
      installer: function (zone, api) {
        var ex = [[0x3117, 5], [0x3F3, 8]];
        var k = 0;
        function suivant() {
          if (k >= ex.length) { api.valider("0x3117 → 0x311D et 0x3F3 → 0x3CF : seuls les derniers chiffres hexadécimaux bougent."); return; }
          var x = ex[k][0], n = ex[k][1];
          var d = el("div"); zone.appendChild(d);
          PC.entree(d, hex(x) + " " + n);
          bits(d, x, 16, n);
          saisieHex(d, miroir(x, n), function () { k++; suivant(); }, "Inverse uniquement les " + n + " bits gris (lis-les de droite à gauche).");
        }
        suivant();
      }
    },
    {
      titre: "Les cas limites",
      texte: "<p>Si n ∉ [2, 32], le nombre n'est pas modifié. Avec n = 32, tout le mot de 32 bits est retourné.</p>",
      objectif: "Juger les cas limites.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "<span class='mono'>0x40C7A7C 0</span> → <span class='mono'>0x40C7A7C</span>", vrai: true, explication: "n = 0 ∉ [2, 32] : inchangé (exemple de l'énoncé)." },
            { texte: "<span class='mono'>0x1 32</span> → <span class='mono'>0x1</span>", vrai: false, explication: "Le bit 0 passe en bit 31 : 0x80000000 (exemple de l'énoncé)." },
            { texte: "<span class='mono'>0x14 30</span> → <span class='mono'>0xA000000</span>", vrai: true, explication: "Les bits 2 et 4 vont en 27 et 25 : 2^27 + 2^25 = 0xA000000." },
            { texte: "<span class='mono'>0x5 1</span> → <span class='mono'>0x5</span>", vrai: true, explication: "n = 1 ∉ [2, 32] : inchangé (et le miroir d'un seul bit ne change rien de toute façon)." }
          ],
          surReussite: function () {
            PC.html(zone, "Sur 32 bits, 0x80000000 est négatif pour un int signé : en C il faut un unsigned. En Python, pas de souci (entiers non bornés), mais il faut masquer avec & 0xFFFFFFFF si l'on travaille sur des valeurs négatives.", "encadre");
            api.valider();
          }
        });
      }
    },
    {
      titre: "L'algorithme, puis l'entraînement",
      texte: "<p>Avec des opérations sur les bits : isoler les n bits bas, les inverser un par un, recoller la partie haute.</p>",
      objectif: "Réussir trois miroirs tirés au hasard.",
      installer: function (zone, api) {
        PC.code(zone,
          "def miroir(x, n):\n" +
          "    if not 2 <= n <= 32:\n" +
          "        return x\n" +
          "    bas = x & ((1 << n) - 1)          # les n bits de poids faible\n" +
          "    r = 0\n" +
          "    for i in range(n):                # bit i de bas → bit n-1-i de r\n" +
          "        r = (r << 1) | ((bas >> i) & 1)\n" +
          "    return (x >> n << n) | r          # partie haute inchangée\n\n" +
          "# lecture : x, n = ligne.split() ; x = int(x, 16) ; n = int(n)\n" +
          "# écriture : print('0x%X' % miroir(x, n))");
        var reussis = 0;
        var z = el("div"); zone.appendChild(z);
        function nouveau() {
          z.innerHTML = "";
          var x = PC.entier(0x10, 0xFFFF), n = [3, 4, 5, 6, 8][PC.entier(0, 4)];
          PC.entree(z, hex(x) + " " + n);
          bits(z, x, 16, n);
          saisieHex(z, miroir(x, n), function () {
            reussis++;
            api.retour("Réussis : " + reussis + " / 3", reussis >= 3 ? true : null);
            if (reussis >= 3) api.valider("Coût O(n) par nombre, n ≤ 32 : négligeable.");
            else PC.bouton(z, "Suivant →", nouveau, true);
          }, "Inverse les n bits gris ; regroupe ensuite par 4 pour revenir en hexadécimal.");
        }
        nouveau();
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "miroir-bits",
    etapes: etapes,
    fin: { cartes: "nombres", texte: "<p>MIRROR : masque <span class='mono'>(1 &lt;&lt; n) − 1</span> pour isoler les bits bas, boucle d'inversion, recollage avec la partie haute ; x inchangé si n ∉ [2, 32].</p>" }
  });
})();
