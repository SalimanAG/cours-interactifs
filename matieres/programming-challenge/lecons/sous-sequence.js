/* Leçon : Longest Connected Subsequence (cours 3 Array, Exercise 3 ; exo3_3).
   Plus longue sous-séquence connexe (= facteur, cases consécutives) contenant au plus k uns.
   Fil rouge : l'exemple du cours, 0101000001 avec k = 1 (réponse 7). */
(function () {
  "use strict";
  var el = Site.el;
  var SEQ = "0101000001", K = 1;
  var T = SEQ.split("").map(Number);

  function positions(s) { var p = []; s.split("").forEach(function (c, i) { if (c === "1") p.push(i); }); return p; }
  function meilleur(s, k) {
    var p = positions(s);
    if (p.length <= k) return s.length;
    var P = [-1].concat(p, [s.length]), m = 0;
    for (var i = 0; i + k + 1 < P.length; i++) m = Math.max(m, P[i + k + 1] - P[i] - 1);
    return m;
  }

  var etapes = [
    {
      titre: "Sous-séquence connexe",
      texte:
        "<p>Une sous-séquence <b>connexe</b> est une suite de termes <b>consécutifs</b> (dans « lambdacalculusisfun », « lusis » en est une). " +
        "Étant donné une séquence binaire et k &gt; 0, quelle est la longueur de la plus longue sous-séquence connexe contenant <b>au plus k uns</b> ?</p>" +
        "<p>Exemple du cours : <span class='mono'>0101000001</span>, k = 1. Touche une première case (début) puis une seconde (fin) pour choisir une fenêtre.</p>",
      objectif: "Trouver une fenêtre de longueur 7 avec au plus 1 un.",
      installer: function (zone, api) {
        var debut = null, fin = null;
        var t = new Tableau(zone, {
          nom: "s", onCase: function (i) {
            if (debut === null || fin !== null) { debut = i; fin = null; }
            else { fin = i; if (fin < debut) { var x = debut; debut = fin; fin = x; } }
            maj();
          }
        });
        var info = el("p", "legende-figure");
        zone.appendChild(info);
        function maj() {
          var cl = {}, pl = null;
          if (debut !== null && fin === null) cl[debut] = "courante";
          if (fin !== null) pl = [debut, fin];
          t.dessiner(T, { classes: cl, plage: pl });
          if (fin === null) { info.textContent = debut === null ? "Touche la case de début." : "Touche la case de fin."; return; }
          var uns = 0; for (var i = debut; i <= fin; i++) uns += T[i];
          var L = fin - debut + 1;
          info.innerHTML = "<span>fenêtre <span class='mono'>[" + debut + ", " + fin + "]</span></span><span>longueur <span class='mono'>" + L + "</span></span><span>uns <span class='mono'>" + uns + "</span></span>";
          if (uns > K) api.retour("Trop de uns : au plus k = 1.", false);
          else if (L === 7) { api.retour("Longueur 7 avec " + uns + " un : c'est le maximum.", true); api.valider("La fenêtre [2, 8] (0100000) : on ne peut pas l'étendre sans englober un deuxième 1."); }
          else api.retour("Valide, longueur " + L + ". Peut-on faire plus long ?", null);
        }
        maj();
      }
    },
    {
      titre: "Pourquoi pas toutes les fenêtres ?",
      texte: "<p>L'énoncé (exo3_3) : la séquence a une longueur ≤ 500 000 et k ≤ 10 000. Le cours pose : que sait-on de k ? quelle taille pour la séquence ? les entiers suffisent-ils ?</p>",
      objectif: "Évaluer la force brute.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Tester toutes les fenêtres [i, j] (en comptant les uns au fur et à mesure), c'est environ…",
          options: ["n = 5 × 10^5 opérations", "n² / 2 ≈ 1,25 × 10^11 opérations", "n log n ≈ 10^7 opérations"],
          bonne: 1,
          expliquer: ["Non : il y a n(n+1)/2 fenêtres.", "Exact : beaucoup trop (≈ 10^8 opérations simples par seconde en C, bien moins en Python) → TLE.", "Non : pas de tri ni de dichotomie ici."],
          surReussite: function () { api.valider("Il faut une idée en O(n) : ne regarder que les positions des uns."); }
        });
      }
    },
    {
      titre: "Le tableau creux",
      texte:
        "<p>Le cours représente la séquence par un tableau « creux » : seulement les <b>positions des uns</b>, encadrées par deux bornes s<sub>b</sub> (début) et s<sub>e</sub> (fin). " +
        "Touche les uns de la séquence, dans l'ordre, pour remplir le tableau.</p>",
      objectif: "Construire le tableau creux de 0101000001.",
      installer: function (zone, api) {
        var P = [];
        var cible = positions(SEQ);
        var t = new Tableau(zone, { nom: "s", onCase: function (i) {
          if (P.length >= cible.length) return;
          if (i === cible[P.length]) { P.push(i); api.retour("", null); maj(); }
          else api.retour(T[i] ? "C'est un 1, mais pas le suivant : on les prend de gauche à droite." : "Ce n'est pas un 1.", false);
        } });
        var c = new Tableau(zone, { nom: "P", indices: true });
        function maj() {
          var cl = {}; P.forEach(function (i) { cl[i] = "choisie"; });
          t.dessiner(T, { classes: cl });
          c.dessiner(["sb"].concat(P, P.length === cible.length ? ["se"] : []));
          if (P.length === cible.length) etape2();
        }
        var fait = false;
        function etape2() {
          if (fait) return; fait = true;
          PC.html(zone,
            "Le cours ne donne pas les valeurs de s<sub>b</sub> et s<sub>e</sub>. Le choix qui rend les calculs simples (c'est une interprétation) : " +
            "s<sub>b</sub> = −1 (juste avant la première case) et s<sub>e</sub> = n (juste après la dernière).", "signalement");
          Exercices.nombre(zone, {
            label: "s_e pour n = 10 :", attendu: 10, tolerance: 0, placeholder: "ex. 9",
            indice: "Les cases vont de 0 à 9 ; s_e est « juste après la dernière ».",
            bravo: "Exact : P = [−1, 1, 3, 9, 10].",
            surReussite: function () { c.dessiner([-1, 1, 3, 9, 10]); api.valider("Entre deux uns consécutifs de P, il n'y a que des 0 : P résume toute la séquence."); }
          });
        }
        maj();
      }
    },
    {
      titre: "Fenêtres de k + 1 uns",
      texte:
        "<p>La meilleure fenêtre s'étend de juste après un 1 jusqu'à juste avant le (k + 1)-ème 1 suivant : entre P[i] et P[i + k + 1], <b>exclus</b>. " +
        "Le cours appelle ce décalage <i>offset</i> (= k + 1) :</p>" +
        "<div class='formule'>longueur(i) = P[i + offset] − P[i] − 1</div>" +
        "<p>Pour k = 1 (offset = 2), calcule chaque longueur. La fenêtre correspondante s'affiche sur la séquence.</p>",
      objectif: "Calculer les trois longueurs et le maximum.",
      installer: function (zone, api) {
        var P = [-1, 1, 3, 9, 10];
        var t = new Tableau(zone, { nom: "s" });
        var c = new Tableau(zone, { nom: "P" });
        var i = 0;
        var z = el("div"); zone.appendChild(z);
        function montrer(i) {
          t.dessiner(T, { plage: [P[i] + 1, P[i + 2] - 1], classes: (function () { var o = {}; if (P[i] >= 0) o[P[i]] = "barree"; if (P[i + 2] < 10) o[P[i + 2]] = "barree"; return o; })() });
          var cl = {}; cl[i] = "courante"; cl[i + 2] = "courante";
          c.dessiner(P, { classes: cl, pointeurs: (function () { var o = {}; o[i] = "i"; o[i + 2] = "i+2"; return o; })() });
        }
        function suivant() {
          if (i > 2) {
            Exercices.nombre(z, {
              label: "maximum =", attendu: 7, tolerance: 0, placeholder: "ex. 5",
              bravo: "Exact : 7, comme à la main.",
              surReussite: function () { api.valider("On ne regarde que m − k fenêtres (m = nombre de uns), au lieu de n²/2."); }
            });
            return;
          }
          montrer(i);
          var att = P[i + 2] - P[i] - 1;
          Exercices.nombre(z, {
            label: "i = " + i + " : P[" + (i + 2) + "] − P[" + i + "] − 1 =", attendu: att, tolerance: 0, placeholder: "ex. 4",
            bravo: "Exact : " + P[i + 2] + " − (" + P[i] + ") − 1 = " + att + ".",
            surReussite: function () { i++; suivant(); }
          });
        }
        suivant();
        PC.html(zone, "Le pseudo-code du cours écrit <span class='mono'>max ← array[i + offset] − array[i]</span>, sans le −1, et fait varier i de 0 à n − offset (n = longueur de la séquence, alors que P n'a que m + 2 cases). " +
          "Avec les bornes s<sub>b</sub> = −1, s<sub>e</sub> = n, il faut le −1 (sans lui on trouve 8 au lieu de 7) et i va de 0 à m + 1 − offset. Quelle que soit la convention, vérifie sur l'exemple : la réponse doit être 7.", "signalement");
      }
    },
    {
      titre: "Les tests du cours",
      texte: "<p>« More test cases » du cours. Attention au cas où la séquence contient <b>au plus k uns</b> : alors toute la séquence convient.</p>",
      objectif: "Écrire la sortie exacte.",
      installer: function (zone, api) {
        PC.entree(zone, "3\n3 1\n000\n4 2\n1111\n5 3\n01110");
        Exercices.texte(zone, {
          label: "Sortie :", lignes: 3, attendu: [meilleur("000", 1), meilleur("1111", 2), meilleur("01110", 3)].join("\n"),
          indice: "Cas 1 : aucun 1. Cas 2 : on ne peut garder que deux 1 consécutifs. Cas 3 : trois uns, k = 3.",
          bravo: "Exact : 3, 2, 5.",
          surReussite: function () { api.valider("Cas 1 et 3 : m ≤ k, la réponse est n — il faut ce test avant la boucle (sinon P[i + k + 1] sort du tableau)."); }
        });
      }
    },
    {
      titre: "Le programme",
      texte: "<p>Coût : O(n) pour construire P, O(m) pour la boucle. Les valeurs restent ≤ 500 000 : pas de problème d'entier.</p>",
      objectif: "Compléter l'instruction clé.",
      installer: function (zone, api) {
        PC.code(zone,
          "def plus_longue(s, k):\n" +
          "    n = len(s)\n" +
          "    P = [-1] + [i for i, c in enumerate(s) if c == '1'] + [n]\n" +
          "    m = len(P) - 2                  # nombre de uns\n" +
          "    if m <= k:\n" +
          "        return n\n" +
          "    return max(P[i + k + 1] - P[i] - 1 for i in range(m + 1 - k))");
        Exercices.nombre(zone, {
          label: "plus_longue('010110101001', 2) =", attendu: meilleur("010110101001", 2), tolerance: 0, placeholder: "ex. 5",
          indice: "P = [−1, 1, 3, 4, 6, 8, 11, 12] ; calcule P[i + 3] − P[i] − 1.",
          bravo: "Exact : 6 — la fenêtre 010100 (positions 5 à 10), exemple de l'énoncé.",
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "sous-sequence",
    etapes: etapes,
    fin: { cartes: "tableaux", texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul><li>Représenter la séquence par les positions des uns, bornées par −1 et n.</li><li>Longueur maximale = max P[i + k + 1] − P[i] − 1 ; si m ≤ k, la réponse est n.</li><li>O(n) au lieu de O(n²).</li></ul></div>" }
  });
})();
