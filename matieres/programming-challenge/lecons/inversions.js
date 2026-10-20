/* Leçon : Compter les inversions en fusionnant (cours 4 Sort, Exercise 2 ; exo4_2).
   Fil rouge : le tableau du cours 2 3 8 6 1 (5 inversions). Prolongements : It's a Murder, Yodaness Level. */
(function () {
  "use strict";
  var el = Site.el;
  var A = [2, 3, 8, 6, 1];

  var etapes = [

    /* 1 */
    {
      titre: "Qu'est-ce qu'une inversion ?",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Définition (cours)</span>Soit A un tableau d'entiers. Si i &lt; j et A[i] &gt; A[j], la paire (i, j) est une <b>inversion</b> de A. " +
        "Il faut compter les inversions de A.</div>" +
        "<p>Touche deux cases pour former une paire. Trouve toutes les inversions de <span class='mono'>2 3 8 6 1</span>.</p>",
      objectif: "Trouver les 5 inversions.",
      installer: function (zone, api) {
        var premier = null, trouvees = {};
        var t = new Tableau(zone, { nom: "A", onCase: function (k) {
          if (premier === null) { premier = k; maj(); return; }
          if (premier === k) { premier = null; maj(); return; }
          var i = Math.min(premier, k), j = Math.max(premier, k);
          premier = null;
          if (A[i] > A[j]) {
            trouvees[i + "," + j] = true;
            api.retour("(" + i + ", " + j + ") : A[" + i + "] = " + A[i] + " > A[" + j + "] = " + A[j] + ". Inversion.", true);
          } else api.retour("(" + i + ", " + j + ") : " + A[i] + " < " + A[j] + ", dans le bon ordre : pas une inversion.", false);
          maj();
        } });
        var liste = el("p", "legende-figure");
        zone.appendChild(liste);
        function maj() {
          var cl = {}; if (premier !== null) cl[premier] = "courante";
          t.dessiner(A, { classes: cl });
          var k = Object.keys(trouvees);
          liste.innerHTML = "<span>trouvées : <span class='mono'>" + k.length + " / 5</span></span><span class='mono'>" + k.map(function (x) { return "(" + x + ")"; }).join(" ") + "</span>";
          if (k.length === 5) api.valider("Une inversion = une paire « mal rangée ». Un tableau trié n'en a aucune ; trié à l'envers, il en a n(n − 1)/2.");
        }
        maj();
      }
    },

    /* 2 */
    {
      titre: "La force brute, et ses limites",
      texte: "<p>Solution 1 du cours : tester toutes les paires.</p>",
      objectif: "Évaluer le coût et la taille du résultat.",
      installer: function (zone, api) {
        var pc = new PseudoCode(zone, { titre: "INVERSIONS-NAÏF(A[0..n−1])", lignes: [
          "résultat ← 0",
          "pour i ← 0 à n − 2 faire",
          "    pour j ← i + 1 à n − 1 faire",
          "        si A[i] > A[j] alors",
          "            résultat ← résultat + 1",
          "retourner résultat"
        ] });
        pc.surligner(null);
        PC.html(zone, "Énoncé (exo4_2) : n ≤ 200 000, valeurs ≤ 10^7.", "encadre");
        Exercices.choix(zone, {
          question: "Combien de comparaisons (ligne 4) pour n = 200 000 ?",
          options: ["≈ 2 × 10^5", "≈ 3,5 × 10^6", "≈ 2 × 10^10"],
          bonne: 2,
          expliquer: ["Non : il y a deux boucles imbriquées.", "Non : c'est n log n.", "Exact : n(n − 1)/2 ≈ 2 × 10^10 → Time Limit Exceeded."],
          surReussite: function () {
            Exercices.choix(zone, {
              question: "Le résultat tient-il dans un int 32 bits signé (max ≈ 2,1 × 10^9) ?",
              options: ["Oui, toujours", "Non : il peut atteindre ≈ 2 × 10^10"],
              bonne: 1,
              expliquer: ["Non : un tableau trié à l'envers a n(n − 1)/2 inversions.", "Exact : en C, il faut un long long. En Python, pas de problème."],
              surReussite: function () { api.valider("Il faut un algorithme en O(n log n) : le tri fusion, qui « voit » les inversions en fusionnant."); }
            });
          }
        });
      }
    },

    /* 3 */
    {
      titre: "Fusionner deux tableaux triés",
      texte: "<p>Le cours (Merge sort) : pour fusionner deux tableaux triés, on compare leurs têtes et on prend la plus petite, jusqu'à épuisement. " +
        "Fais-le sur l'exemple du cours : touche la tête à prendre.</p>",
      objectif: "Fusionner [1 3 5] et [2 7 9].",
      installer: function (zone, api) {
        Fusion.widget(zone, [1, 3, 5], [2, 7, 9], { mode: "simple", surFin: function () {
          api.valider("Chaque élément est déplacé une fois : fusionner coûte O(|G| + |D|).");
        } });
      }
    },

    /* 4 */
    {
      titre: "L'idée clé : compter pendant la fusion",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Idée du cours</span>S'il n'y a aucune inversion, pendant la fusion tous les éléments du tableau de gauche passent avant ceux de droite.</div>" +
        "<p>Donc, quand on prend un élément <b>dans D</b>, il passe devant tous les éléments <b>restant dans G</b>, qui étaient avant lui dans le tableau et sont plus grands : " +
        "ce sont autant d'inversions. Dernière fusion du cours : <span class='mono'>[2 3]</span> et <span class='mono'>[1 6 8]</span>.</p>",
      objectif: "Fusionner en comptant les inversions.",
      installer: function (zone, api) {
        Fusion.widget(zone, [2, 3], [1, 6, 8], { mode: "inversions", surFin: function (r, c) {
          api.valider("+2 quand 1 passe devant 2 et 3 ; ensuite 6 et 8 arrivent quand G est vide : +0. Total de cette fusion : " + c + ".");
        } });
      }
    },

    /* 5 */
    {
      titre: "Le tri fusion complet",
      texte:
        "<p>Le tableau est coupé en deux (moitié gauche : ⌊n/2⌋ éléments, comme dans le cours), chaque moitié est triée récursivement, puis fusionnée. " +
        "Les inversions <b>internes</b> à chaque moitié sont comptées dans les appels récursifs ; celles <b>entre</b> les deux moitiés, pendant la fusion. " +
        "Fais toutes les fusions de <span class='mono'>2 3 8 6 1</span>, dans l'ordre d'exécution.</p>",
      objectif: "Terminer le tri et retrouver le total de 5.",
      installer: function (zone, api) {
        Fusion.triComplet(zone, A, { mode: "inversions", surFin: function (t, total) {
          api.retour("Total : " + total + " inversions — comme à l'étape 1.", total === 5);
          api.valider("Dans le cours : +1 ([6] + [1]), +1 +1 ([8] + [1 6]), +2 ([2 3] + [1 6 8]) = 5.");
        } });
      }
    },

    /* 6 */
    {
      titre: "Coût et programme",
      texte: "<p>Le tri fusion a log₂ n niveaux de récursion ; chaque niveau fusionne n éléments en tout.</p>",
      objectif: "Donner la complexité, puis lire le programme.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Complexité du comptage par tri fusion ?",
          options: ["O(n)", "O(n log n)", "O(n²)"],
          bonne: 1,
          expliquer: ["Non : il faut trier.", "Exact : n par niveau, log n niveaux. Pour n = 200 000 : ≈ 3,5 × 10^6 opérations.", "Non : c'est la force brute."],
          surReussite: function () {
            PC.code(zone,
              "def trier(a):                      # renvoie (a trié, nombre d'inversions)\n" +
              "    if len(a) <= 1:\n" +
              "        return a, 0\n" +
              "    k = len(a) // 2\n" +
              "    g, cg = trier(a[:k])\n" +
              "    d, cd = trier(a[k:])\n" +
              "    res, i, j, inv = [], 0, 0, cg + cd\n" +
              "    while i < len(g) and j < len(d):\n" +
              "        if g[i] <= d[j]:\n" +
              "            res.append(g[i]); i += 1\n" +
              "        else:\n" +
              "            res.append(d[j]); j += 1\n" +
              "            inv += len(g) - i       # d[j] passe devant les restants de g\n" +
              "    res += g[i:] + d[j:]\n" +
              "    return res, inv");
            PC.html(zone, "Profondeur de récursion ≈ log₂ 200 000 ≈ 18 : pas de problème de limite de récursion ici. " +
              "Avec <span class='mono'>g[i] &lt;= d[j]</span>, deux valeurs égales ne comptent pas comme une inversion (A[i] &gt; A[j] strict). " +
              "Le cours a d'ailleurs un test avec des doublons (5 1 4 2 6 2 6 2 → 11) alors que l'énoncé annonce des entiers distincts.", "signalement");
            api.valider();
          }
        });
      }
    },

    /* 7 */
    {
      titre: "Même idée : Murder et Yodaness",
      texte:
        "<p><b>It's a Murder</b> (exo3_2, cours 3 et 4) : pour chaque nombre, additionner les nombres <b>précédents strictement plus petits</b>, puis sommer le tout. " +
        "Le cours fait d'abord la force brute sur <span class='mono'>1 5 3 6 4</span> :</p>",
      objectif: "Calculer la somme du cours, puis le niveau de Yodaness.",
      installer: function (zone, api) {
        var t = new Tableau(zone, { nom: "A" });
        t.dessiner([1, 5, 3, 6, 4]);
        var parts = [0, 1, 1, 9, 4];
        var k = 0;
        var z = el("div"); zone.appendChild(z);
        function suivant() {
          if (k >= 5) {
            Exercices.nombre(z, {
              label: "somme totale =", attendu: 15, tolerance: 0, placeholder: "ex. 10",
              bravo: "Exact : 0 + 1 + 1 + 9 + 4 = 15.",
              surReussite: yoda
            });
            return;
          }
          var cl = {}; cl[k] = "courante"; for (var x = 0; x < k; x++) if ([1, 5, 3, 6, 4][x] < [1, 5, 3, 6, 4][k]) cl[x] = "choisie";
          Exercices.nombre(z, {
            label: "pour A[" + k + "] = " + [1, 5, 3, 6, 4][k] + " :", attendu: parts[k], tolerance: 0, placeholder: "0",
            indice: "Somme des éléments avant lui et strictement plus petits.",
            bravo: "Exact : " + parts[k] + ".",
            surReussite: function () { t.dessiner([1, 5, 3, 6, 4], { classes: cl }); k++; suivant(); }
          });
        }
        suivant();
        function yoda() {
          PC.html(z,
            "<span class='titre-encadre'>Solution « élégante » du cours : le tri fusion</span>" +
            "Quand on prend x dans D, tous les éléments de G <b>déjà placés</b> sont avant x et plus petits : on ajoute leur somme. " +
            "À égalité, on prend D d'abord (un élément égal n'est pas strictement plus petit). L'atelier « fusion » te le fait pratiquer. " +
            "N ≤ 10^5 et valeurs ≤ 10^6 : la somme peut dépasser 2^31, comme pour les inversions.", "encadre");
          z.appendChild(el("p", null, "Yodaness Level (exo4_3) : combien de paires de mots ont changé d'ordre entre la phrase de Yoda et la phrase normale ? " +
            "On numérote les mots par leur position dans la phrase normale, puis on compte les inversions de la phrase de Yoda."));
          PC.entree(z, "1\n6\nmuch to learn you still have\nyou still have much to learn");
          Exercices.nombre(z, {
            label: "niveau de Yodaness =", attendu: 9, tolerance: 0, placeholder: "ex. 6",
            indice: "Positions dans la phrase normale : much → 3, to → 4, learn → 5, you → 0, still → 1, have → 2. Compte les inversions de 3 4 5 0 1 2.",
            bravo: "Exact : 3 4 5 0 1 2 a 9 inversions (chacun de 3, 4, 5 est devant 0, 1, 2).",
            surReussite: function () { api.valider("Trois problèmes, une seule technique : compter pendant la fusion."); }
          });
        }
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "inversions",
    etapes: etapes,
    fin: { cartes: "tri", texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul><li>Inversion : i &lt; j et A[i] &gt; A[j].</li><li>Force brute O(n²) ; tri fusion O(n log n) : en prenant dans D, ajouter le nombre d'éléments restant dans G.</li><li>Résultat jusqu'à n(n−1)/2 : 64 bits en C.</li><li>Murder : ajouter la somme des éléments de G déjà placés ; Yodaness : positions puis inversions.</li></ul></div>" }
  });
})();
