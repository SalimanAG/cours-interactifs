/* Leçon : Candy Distribution — trier pour apparier (cours 4 Sort, Exercise 1 ; exo4_1).
   Fil rouge : l'exemple de l'énoncé, classes 10 80 37 22 109 et prix 6 8 8 20 15 (réponse 2120). */
(function () {
  "use strict";
  var el = Site.el;
  var C = [10, 80, 37, 22, 109], P = [6, 8, 8, 20, 15];

  var etapes = [
    {
      titre: "Le problème",
      texte:
        "<p>Alice a N classes ; la classe i a c<sub>i</sub> élèves. Il y a exactement N types de bonbons ; le type j coûte p<sub>j</sub>. " +
        "Tous les élèves d'une même classe reçoivent le même type, et chaque classe a un type différent. Quelle somme minimale Alice dépense-t-elle ?</p>" +
        "<p>Énoncé : 1 ≤ N ≤ 100 000 ; 1 ≤ c<sub>i</sub>, p<sub>i</sub> ≤ 100 000. Le cours : « How great can the solution be ? Are integers big enough ? »</p>",
      objectif: "Majorer la réponse et choisir le type d'entier.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Ordre de grandeur maximal de la somme ?",
          options: ["10^10", "10^15", "10^20"],
          bonne: 1,
          expliquer: ["Non : c'est un seul produit c × p ; il y en a N.", "Exact : N × c × p ≤ 10^5 × 10^5 × 10^5 = 10^15 : trop pour 32 bits (≈ 2 × 10^9), il faut 64 bits (≈ 9 × 10^18).", "Non : trop large."],
          surReussite: function () { api.valider("En C : long long. En Python : aucun souci."); }
        });
      }
    },
    {
      titre: "Qui reçoit le bonbon le moins cher ?",
      texte: "<p>Deux classes (10 et 80 élèves), deux bonbons (6 et 20).</p>",
      objectif: "Trouver la meilleure affectation.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          options: ["80 élèves → 6, 10 élèves → 20", "80 élèves → 20, 10 élèves → 6"],
          bonne: 0,
          expliquer: ["Exact : 80 × 6 + 10 × 20 = 680, contre 80 × 20 + 10 × 6 = 1660.", "Non : 80 × 20 + 10 × 6 = 1660, bien plus que 80 × 6 + 10 × 20 = 680."],
          surReussite: function () {
            PC.html(zone, "Règle : la plus grande classe reçoit le bonbon le moins cher, et ainsi de suite. " +
              "Donc on trie les c dans un sens, les p dans l'autre, et on additionne les produits terme à terme.", "encadre");
            PC.html(zone, "Le cours ne justifie pas cette règle. Justification classique (inégalité de réarrangement) : si une grande classe a un bonbon plus cher qu'une petite, " +
              "échanger leurs bonbons ne fait jamais augmenter le total.", "signalement");
            api.valider();
          }
        });
      }
    },
    {
      titre: "Trier par insertion (solution « maison »)",
      texte: "<p>Solution 1 du cours : trier avec un <b>tri par insertion</b>. On insère chaque nouvel élément à sa place dans le début déjà trié. " +
        "Exemple du cours : <span class='mono'>1 5 3 6 4</span>. Touche la case où doit aller l'élément en couleur.</p>",
      objectif: "Trier 1 5 3 6 4 par insertion.",
      installer: function (zone, api) {
        var t = [1, 5, 3, 6, 4], k = 1;
        var tb = new Tableau(zone, { nom: "A", onCase: function (pos) {
          if (k >= t.length) return;
          var x = t[k], p = 0;
          while (p < k && t[p] <= x) p++;
          if (pos > k) { api.retour("La partie triée est à gauche : choisis une case entre 0 et " + k + ".", false); return; }
          if (pos !== p) { api.retour(x + " doit aller après tous les éléments ≤ " + x + " déjà triés.", false); return; }
          t.splice(k, 1); t.splice(p, 0, x);
          api.retour(x + " inséré en position " + p + (p < k ? " : on a décalé " + (k - p) + " élément" + (k - p > 1 ? "s" : "") + " vers la droite." : " : rien à décaler."), true);
          k++;
          maj();
        } });
        function maj() {
          var cl = {}; for (var i = 0; i < k && i < t.length; i++) cl[i] = "vue"; if (k < t.length) cl[k] = "courante";
          tb.dessiner(t, { classes: cl, pointeurs: k < t.length ? (function () { var o = {}; o[k] = "à insérer"; return o; })() : {} });
          if (k >= t.length) api.valider("Au pire (tableau trié à l'envers), on décale 1 + 2 + … + (n − 1) éléments : O(n²). Avec une liste chaînée, plus de décalage, mais il faut toujours chercher la place : O(n²) aussi.");
        }
        maj();
      }
    },
    {
      titre: "Le tri intégré",
      texte: "<p>Solution 2 du cours : le tri du langage (O(n log n)). Avec N = 100 000, l'insertion coûte jusqu'à ≈ 5 × 10^9 opérations ; " +
        "le tri intégré ≈ 1,7 × 10^6. Remets les classes de l'exemple dans l'ordre croissant :</p>",
      objectif: "Trier les classes, puis calculer la réponse de l'exemple.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Ordre croissant des c :", items: ["10", "22", "37", "80", "109"], separateur: "≤",
          surReussite: function () {
            var t = new Tableau(zone, { nom: "c ↑", indices: false }); t.dessiner([10, 22, 37, 80, 109]);
            var u = new Tableau(zone, { nom: "p ↓", indices: false }); u.dessiner([20, 15, 8, 8, 6]);
            Exercices.nombre(zone, {
              label: "Σ c × p =", attendu: 2120, tolerance: 0, placeholder: "ex. 2000",
              indice: "10 × 20 + 22 × 15 + 37 × 8 + 80 × 8 + 109 × 6.",
              bravo: "Exact : 200 + 330 + 296 + 640 + 654 = 2120 (réponse de l'énoncé).",
              surReussite: function () { api.valider(); }
            });
          }
        });
      }
    },
    {
      titre: "Le programme et les tests du cours",
      texte: "<p>Plusieurs cas de test ; chacun : N, puis les c, puis les p ; un 0 termine l'entrée.</p>",
      objectif: "Écrire la sortie exacte des tests du cours.",
      installer: function (zone, api) {
        PC.code(zone,
          "import sys\n" +
          "data = sys.stdin.buffer.read().split()\n" +
          "pos, sortie = 0, []\n" +
          "while True:\n" +
          "    n = int(data[pos]); pos += 1\n" +
          "    if n == 0:\n" +
          "        break\n" +
          "    c = sorted(map(int, data[pos:pos + n])); pos += n\n" +
          "    p = sorted(map(int, data[pos:pos + n]), reverse=True); pos += n\n" +
          "    sortie.append(str(sum(x * y for x, y in zip(c, p))))\n" +
          "print('\\n'.join(sortie))");
        PC.entree(zone, "4\n1 10 2 1\n1 2 4 2\n5\n10 80 37 22 89\n6 8 8 20 15\n0");
        Exercices.texte(zone, {
          label: "Sortie :", lignes: 2, attendu: "20\n2000",
          indice: "Cas 1 : c triés 1 1 2 10, p triés à l'envers 4 2 2 1. Cas 2 : comme l'exemple, mais 89 au lieu de 109.",
          bravo: "Exact : 20 et 2000.",
          surReussite: function () { api.valider("Coût O(N log N) par cas, dominé par les deux tris."); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "candy",
    etapes: etapes,
    fin: { cartes: "tri", texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul><li>Apparier la plus grande classe et le bonbon le moins cher : trier c ↑ et p ↓, sommer les produits.</li><li>Tri par insertion O(n²) ; tri intégré O(n log n).</li><li>Somme jusqu'à 10^15 : 64 bits.</li></ul></div>" }
  });
})();
