/* Leçon 0.2 : Matrices — produit, transposée, formes (prérequis, hors diapos ;
   liens : régression Y = X·θ + N, cours 1 diapo 16 ; lookup d'embedding, cours 2 diapo 44).
   Fil rouge : 3 avis décrits par (nombre de « great », nombre de « bad ») empilés
   dans une matrice X, et le vecteur de poids w = (1 ; −1). */
(function () {
  "use strict";
  var N = NLP, el = N.el, fmt = N.fmt, m = N.m;
  var X = [[2, 1], [0, 2], [1, 0]];
  var AVIS = ["A", "B", "C"];
  var w = [1, -1];

  var etapes = [
    {
      titre: "Une matrice : un tableau de nombres",
      texte:
        "<p>Une <b>matrice</b> de forme <span class='mono'>(m, n)</span> est un tableau de m lignes et n colonnes. On note <span class='mono'>X[i, j]</span> (ou Xᵢⱼ) le nombre de la ligne i, colonne j. " +
        "En ML, une ligne = un exemple, une colonne = une caractéristique.</p>" +
        "<p>On empile trois avis : A « great great bad », B « bad bad », C « great ».</p>",
      objectif: "Toucher la case X[2, 1] (ligne 2, colonne 1, en comptant à partir de 1).",
      tester: function (z) { z.querySelectorAll(".matrice td")[2].click(); },
      installer: function (zone, api) {
        var mx = new Matrice(zone, {
          nom: "X", lignes: AVIS, colonnes: ["great", "bad"],
          onCase: function (i, j) {
            dessiner({ [i + "," + j]: i === 1 && j === 0 ? "choisie" : "fausse" });
            if (i === 1 && j === 0) {
              api.retour("X[2, 1] = 0 : l'avis B contient 0 fois « great ».", true);
              api.valider("Forme de X : (3, 2) — 3 exemples, 2 caractéristiques. On écrit toujours (lignes, colonnes).");
            } else api.retour("Tu as touché X[" + (i + 1) + ", " + (j + 1) + "] : le premier indice est la ligne.", false);
          }
        });
        function dessiner(cl) { mx.dessiner(X, { classes: cl || {} }); }
        dessiner();
      }
    },
    {
      titre: "Produit d'une matrice par un vecteur",
      texte:
        "<p><span class='mono'>X · w</span> fait le <b>produit scalaire de chaque ligne</b> de X avec w. Résultat : un vecteur avec un nombre par ligne (ici un score par avis).</p>" +
        "<div class='formule'>(X · w)ᵢ = Σⱼ X[i, j] · wⱼ        avec w = (1 ; −1)</div>" +
        "<p>Remplis le vecteur des scores.</p>",
      objectif: "Calculer les 3 coordonnées de X · w.",
      tester: function (z) { var c = z.querySelectorAll(".matrice input"); ["1", "-2", "1"].forEach(function (v, i) { c[i].value = v; c[i].dispatchEvent(new Event("input")); }); },
      installer: function (zone, api) {
        N.html(zone, "<p class='discret'>X = " + m("[[2, 1], [0, 2], [1, 0]]") + "</p>");
        var attendu = X.map(function (l) { return l[0] * w[0] + l[1] * w[1]; });
        var mx = new Matrice(zone, {
          nom: "X·w", lignes: AVIS, colonnes: ["score"],
          onSaisie: function () {
            var ok = attendu.every(function (v, i) { return Exercices.lireNombre(mx.lire(i, 0)) === v; });
            if (ok) { api.retour("X · w = (2 − 1 ; 0 − 2 ; 1 − 0) = (1 ; −2 ; 1).", true); api.valider("Un produit matrice-vecteur = autant de produits scalaires que de lignes. C'est ce que fait une couche de neurones sur un lot d'exemples."); }
          }
        });
        mx.dessiner([[null], [null], [null]], { editables: { "0,0": true, "1,0": true, "2,0": true } });
      }
    },
    {
      titre: "La transposée",
      texte:
        "<p>La <b>transposée</b> Xᵀ échange lignes et colonnes : <span class='mono'>Xᵀ[j, i] = X[i, j]</span>. Si X a la forme (3, 2), Xᵀ a la forme (2, 3). " +
        "Le cours l'utilise partout : <span class='mono'>Wₓᵀ · X</span> dans les neurones récurrents, <span class='mono'>(XᵀX)⁻¹XᵀY</span> pour la régression.</p>" +
        "<p>Un vecteur colonne transposé devient un vecteur ligne : <span class='mono'>wᵀ · x</span> est une autre écriture du produit scalaire w · x.</p>",
      objectif: "Reconnaître Xᵀ.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "X = [[2, 1], [0, 2], [1, 0]]. Que vaut Xᵀ ?",
          options: ["[[2, 0, 1], [1, 2, 0]]", "[[1, 2], [2, 0], [0, 1]]", "[[2, 1, 0], [2, 1, 0]]"],
          bonne: 0,
          expliquer: ["Exact : la 1re ligne de Xᵀ est la 1re colonne de X (les « great »), la 2e est la colonne des « bad ».", "Non : ici on a échangé les nombres dans chaque ligne, pas les lignes et les colonnes.", "Non : relis la colonne 1 de X de haut en bas."],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Produit de deux matrices et formes compatibles",
      texte:
        "<p>Le produit <span class='mono'>A · B</span> n'existe que si le nombre de <b>colonnes de A</b> égale le nombre de <b>lignes de B</b> :</p>" +
        "<div class='formule'>(m, n) · (n, p) → (m, p)</div>" +
        "<p>La case (i, k) du résultat est le produit scalaire de la ligne i de A et de la colonne k de B.</p>",
      objectif: "Prévoir la forme de deux produits.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "X a la forme (3, 2), W la forme (2, 4). Forme de X · W ?", options: ["(3, 4)", "(2, 2)", "(4, 3)", "impossible"], bonne: 0, expliquer: ["(3, 2)·(2, 4) → (3, 4) : 3 exemples, 4 sorties chacun.", "Non.", "Non : l'ordre compte.", "Non : 2 = 2, c'est compatible."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Et X · X, avec X de forme (3, 2) ?", options: ["impossible", "(3, 3)", "(2, 2)"], bonne: 0, expliquer: ["Exact : 2 colonnes ≠ 3 lignes. En revanche Xᵀ · X, de forme (2, 3)·(3, 2) → (2, 2), existe.", "Non : il faudrait X · Xᵀ.", "Non : ce serait Xᵀ · X."], surReussite: ok }); }
        ], "En deep learning, la majorité des bugs de forme viennent de cette règle : vérifier (m, n) · (n, p).");
      }
    },
    {
      titre: "Une table de lookup est un produit de matrices",
      texte:
        "<p>Le cours 2 (diapo 44) : chercher l'embedding du token d'identifiant i revient à multiplier un <b>vecteur one-hot</b> eᵢ (que des 0, un 1 en position i) par la matrice d'embeddings E de forme (|V|, d) :</p>" +
        "<div class='formule'>eᵢᵀ · E = xᵢ   (la ligne i de E)</div>" +
        "<p>Petit exemple : vocabulaire de 3 mots, d = 2, E = [[0,1 ; 0,5], [0,4 ; −0,2], [0,9 ; 0,3]]. Token d'identifiant 1 (on compte à partir de 0) → e₁ = (0, 1, 0).</p>",
      objectif: "Calculer e₁ᵀ · E.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "1re coordonnée =", attendu: 0.4, placeholder: "ex. 0,1", indice: "0·0,1 + 1·0,4 + 0·0,9.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "2e coordonnée =", attendu: -0.2, placeholder: "ex. 0,1", indice: "0·0,5 + 1·(−0,2) + 0·0,3.", surReussite: ok }); }
        ], "Résultat (0,4 ; −0,2) : exactement la ligne 1 de E. Le one-hot « sélectionne » une ligne ; en pratique on lit directement la ligne, sans multiplier.");
      }
    },
    {
      titre: "Écrire une régression avec des matrices",
      texte:
        "<p>Le cours 1 (diapo 16) écrit la régression linéaire <span class='mono'>Y = X · θ + N</span> (N : bruit), où chaque prédiction est <span class='mono'>ŷ = a·x + b</span>. " +
        "Astuce : on ajoute à chaque exemple une colonne de 1, pour que le biais b soit un paramètre comme les autres :</p>" +
        "<div class='formule'>[x  1] · [a ; b] = a·x + b</div>",
      objectif: "Calculer une prédiction sous forme matricielle.",
      installer: function (zone, api) {
        Exercices.nombre(zone, {
          label: "x = 3, θ = (a ; b) = (2 ; 0,5) → ŷ =", attendu: 6.5, placeholder: "ex. 1,5",
          indice: "[3  1] · [2 ; 0,5] = 3·2 + 1·0,5.",
          bravo: "ŷ = 6,5. Pour n exemples, X a la forme (n, 2) et X · θ donne les n prédictions d'un coup.",
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "matrices", etapes: etapes,
    fin: { texte: "<ul><li>Forme (m, n) : m lignes (exemples), n colonnes (caractéristiques).</li><li>X · w : un produit scalaire par ligne.</li><li>Xᵀ échange lignes et colonnes.</li><li>(m, n) · (n, p) → (m, p), sinon impossible.</li><li>Lookup d'embedding = one-hot × E.</li><li>Régression : Y = X · θ + bruit, avec une colonne de 1 pour le biais.</li></ul>", cartes: "prerequis" }
  });
})();
