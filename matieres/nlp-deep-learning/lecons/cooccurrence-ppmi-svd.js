/* Leçon 2.3 : Co-occurrence, PPMI, SVD (cours 2, diapos 28 à 41 ; TP 3, partie 4).
   Fil rouge : la matrice de co-occurrence des diapos 32 et 34
   (cat, dog, model × eats, food, trains, data ; N = 51). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var X = [[8, 7, 0, 0], [6, 9, 0, 0], [0, 0, 11, 10]], W = ["cat", "dog", "model"], CX = ["eats", "food", "trains", "data"];
  var TOT = 51, RL = [15, 15, 21], CL = [14, 16, 11, 10];
  function ppmi(i, j) { return X[i][j] ? Math.max(0, Math.log(X[i][j] * TOT / (RL[i] * CL[j]))) : 0; }
  function figure(zone, d) { var mx = new Matrice(zone, { nom: "count", lignes: W, colonnes: CX }); mx.dessiner(X, d || { format: String }); return mx; }

  var etapes = [
    {
      titre: "L'hypothèse distributionnelle",
      texte:
        "<p>Diapo 29 : <b>le sens se reflète dans les usages</b> ; des mots qui apparaissent dans des contextes semblables ont des sens semblables. Diapo 30, deux relations :</p>" +
        "<ul><li><b>co-occurrence directe</b> (1er ordre) : les mots apparaissent ensemble dans la même fenêtre (« cat » ↔ « eats ») ;</li>" +
        "<li><b>co-occurrence indirecte</b> (2e ordre) : les mots partagent les mêmes voisins, même s'ils apparaissent rarement ensemble (« cat » ↔ « dog », tous deux avec « eats », « its », « food »).</li></ul>",
      objectif: "Classer chaque paire.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Directe (1er ordre)", "Indirecte (2e ordre)"], items: [
          { texte: "« the cat eats its food » : cat ↔ eats", bonne: 0 },
          { texte: "cat ↔ dog (contextes partagés : eats, sleeps, food)", bonne: 1 },
          { texte: "king ↔ queen (contextes partagés : royal, throne, crown)", bonne: 1 },
          { texte: "« model trains on data » : model ↔ data", bonne: 0 }
        ], surReussite: function () { api.valider("Objectif géométrique (diapo 30) : placer près les uns des autres les mots aux contextes semblables."); } });
      }
    },
    {
      titre: "Le contexte : un document ou une fenêtre",
      texte:
        "<p>Diapo 31 : <b>terme–document</b> (colonnes = documents) capte une similarité <i>thématique</i>, contextes larges, utile pour LSA ; " +
        "<b>mot–contexte</b> (colonnes = mots voisins dans une fenêtre, ex. ±5) capte une similarité <i>lexicale</i>, utile pour des vecteurs de mots (Word2Vec, GloVe).</p>" +
        "<p>Diapo 33 : <b>la fenêtre contrôle ce que « similaire » veut dire</b>. Petite fenêtre : similarité fonctionnelle ou syntaxique (eats → walks, runs). Grande fenêtre : similarité thématique (eats → food, meal, hungry). " +
        "Fenêtre symétrique : autant à gauche qu'à droite. Pondération par la distance : les voisins proches comptent plus.</p>" +
        "<p>Phrase : « the cat eats its food ».</p>",
      objectif: "Trouver les contextes de « eats » avec une fenêtre symétrique ±1, puis ±2.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.cocher(b, { question: "Fenêtre ±1 :", options: ["the", "cat", "its", "food"], bonnes: [1, 2], surReussite: ok }); },
          function (b, ok) { Exercices.cocher(b, { question: "Fenêtre ±2 :", options: ["the", "cat", "its", "food"], bonnes: [0, 1, 2, 3], explication: "4 mots de contexte (2 à gauche, 2 à droite).", surReussite: ok }); }
        ], "Chaque paire (mot, contexte) rencontrée ajoute 1 dans la case correspondante de la matrice.");
      }
    },
    {
      titre: "Lire la matrice de co-occurrence",
      texte: "<p>Diapo 32 : chaque case compte combien de fois un mot cible (ligne) apparaît avec un mot de contexte (colonne). Deux mots sont proches si leurs <b>lignes</b> se ressemblent.</p>",
      objectif: "Calculer cos(cat, dog) entre les lignes, à 0,01 près.",
      installer: function (zone, api) {
        figure(zone, { lignesClasses: { 0: "courante", 1: "courante" }, format: String });
        Exercices.nombre(zone, { label: "cos(cat, dog) ≈", attendu: Vecteurs.cosinus(X[0], X[1]), tolerance: 0.01, placeholder: "ex. 0,5", indice: "cat = (8, 7, 0, 0), dog = (6, 9, 0, 0). Produit : 48 + 63.", bravo: "≈ 0,97 : contextes très semblables. cos(cat, model) = 0 : aucun contexte commun.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "PMI et PPMI",
      texte:
        "<p>Diapos 34-35 : les comptes bruts favorisent les mots fréquents. La <b>PMI</b> compare la co-occurrence observée à celle attendue si les mots étaient indépendants (leçon « Probabilités de base ») :</p>" +
        "<div class='formule'>PMI(w, c) = log( P(w, c) / (P(w) P(c)) )        PPMI(w, c) = max(PMI(w, c), 0)</div>" +
        "<p>PMI &gt; 0 : plus souvent que le hasard ; = 0 : comme sous indépendance ; &lt; 0 : moins souvent (mis à 0 dans la PPMI). P(w, c) = count/N, P(w) = count(w, ·)/N, P(c) = count(·, c)/N, avec N = 51.</p>",
      objectif: "Calculer PPMI(model, data), puis PPMI(cat, trains).",
      installer: function (zone, api) {
        figure(zone, { classes: { "2,3": "courante" }, format: String });
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "PPMI(model, data) ≈", attendu: ppmi(2, 3), tolerance: 0.01, placeholder: "ex. 1", indice: "ln(10 × 51 / (21 × 10)).", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "PPMI(cat, trains) ?", options: ["0 : jamais observés ensemble (PMI = −∞, ramenée à 0)", "1", "on ne peut pas la calculer"], bonne: 0, expliquer: ["Exact.", "Non.", "Non : la PPMI la ramène à 0."], surReussite: ok }); }
        ], "PPMI (matrice entière, ln) : cat (0,66 ; 0,40 ; 0 ; 0), dog (0,38 ; 0,65 ; 0 ; 0), model (0 ; 0 ; 0,89 ; 0,89).");
        N.html(zone, "<div class='signalement'>La diapo 34 affiche une PPMI arrondie (1,92 ; 1,22 ; 1,51 ; 1,74 ; 1,91 ; 1,46) qui ne découle pas de son tableau de comptes, quelle que soit la base du logarithme. " +
          "Les valeurs ci-dessus sont recalculées avec ln, la base qui reproduit les exemples de la diapo 35 (1,39 ; −2,30 ; 1,79).</div>");
      }
    },
    {
      titre: "Précautions avec la PMI",
      texte: "<p>Diapo 34, considérations pratiques : la PPMI met en avant les associations significatives ; <b>les paires rares peuvent être instables</b> (petits comptes → PMI élevées : on applique des seuils de fréquence ou un lissage) ; " +
        "elle <b>améliore souvent les représentations</b> et sert couramment avant une réduction de dimension (SVD / LSA).</p>",
      objectif: "Repérer le risque des paires rares.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Deux mots très rares apparaissent une seule fois, ensemble. Leur PMI…", options: ["est très élevée alors qu'on n'a qu'une observation : peu fiable", "est nulle", "est négative"], bonne: 0, expliquer: ["Exact : P(w)P(c) est minuscule, le rapport explose. D'où les seuils de fréquence.", "Non.", "Non."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "SVD : factoriser la matrice",
      texte:
        "<p>Diapo 37 : la décomposition en valeurs singulières écrit X (m × n) comme un produit de trois matrices :</p>" +
        "<div class='formule'>X = U · Σ · Vᵀ</div>" +
        "<p><b>U</b> (m × k) : directions des lignes (vecteurs singuliers à gauche, pour les mots) ; <b>Σ</b> (k × k) : diagonale des <b>valeurs singulières</b>, force de chaque composante ; <b>Vᵀ</b> (k × n) : directions des colonnes (contextes). " +
        "Diapo 38, <b>SVD tronquée</b> : on garde les k plus grandes valeurs singulières, X ≈ Uₖ Σₖ Vₖᵀ, avec k ≪ min(m, n).</p>" +
        "<p>Pour notre matrice, Σ = diag(15,03 ; 14,87 ; 2,00). Avec k = 2, chaque mot est décrit par une ligne de Uₖ Σₖ.</p>" +
        "<div class='signalement'>La diapo 37 affiche Σ = diag(15,8 ; 7,2) et des valeurs de U et Vᵀ qui ne correspondent pas exactement à la SVD de la matrice dessinée ; les valeurs ci-dessus sont calculées. L'idée de la diapo est inchangée.</div>",
      objectif: "Prévoir les formes de la SVD tronquée.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "Vocabulaire de 10 000 mots × 10 000 contextes, k = 100 : forme de Uₖ ?", options: ["(10 000, 100)", "(100, 10 000)", "(100, 100)", "(10 000, 10 000)"], bonne: 0, expliquer: ["Exact : un vecteur dense de 100 nombres par mot.", "Non : c'est Vₖᵀ.", "Non : c'est Σₖ.", "Non : c'est la matrice de départ."], surReussite: ok }); },
          function (b, ok) { Exercices.cocher(b, { question: "Pourquoi tronquer (diapo 38) ?", options: ["représentation compacte, dense, bien plus petite que le vocabulaire", "filtre le bruit (événements rares, corrélations redondantes)", "garde la structure principale (dimensions latentes informatives)", "rend chaque dimension plus facile à interpréter"], bonnes: [0, 1, 2], explication: "Le choix de k est un choix de modélisation, validé sur la performance en aval. L'interprétabilité, elle, diminue (diapo 39).", surReussite: ok }); }
        ], "Dans notre exemple, les deux premières composantes séparent exactement le bloc animaux / nourriture (cat, dog) du bloc apprentissage (model).");
      }
    },
    {
      titre: "LSA : relier des documents sans mots communs",
      texte:
        "<p>Diapo 39 : la <b>Latent Semantic Analysis</b> applique la SVD à la matrice terme–document. Les dimensions latentes capturent des thèmes (ex. « machine learning / neural models », « language / text / tokens ») : " +
        "des documents peuvent devenir proches <b>sans partager de mot exact</b>. Compromis : les dimensions latentes sont plus difficiles à interpréter que les mots. " +
        "Diapo 40 : la réduction change la géométrie — d'un espace creux, une dimension par terme, à un espace dense de k dimensions apprises. " +
        "TP 3 : <span class='mono'>TruncatedSVD(n_components=2).fit_transform(X_tfidf)</span> ; <span class='mono'>svd.components_</span> donne le poids de chaque mot dans chaque dimension.</p>",
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Après LSA, deux documents sans mot commun peuvent avoir un cosinus élevé.", vrai: true },
          { texte: "Chaque dimension latente correspond à un mot du vocabulaire.", vrai: false, explication: "" },
          { texte: "PCA centre les vecteurs avant de projeter ; TruncatedSVD ne le fait pas (TP 3).", vrai: true },
          { texte: "Une projection en 2 dimensions préserve parfaitement la géométrie de départ.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "cooccurrence-ppmi-svd", etapes: etapes,
    fin: { texte: "<ul><li>Hypothèse distributionnelle ; co-occurrence directe vs indirecte.</li><li>Contexte = document (thématique, LSA) ou fenêtre (lexical) ; la taille de fenêtre change la similarité.</li><li>PMI = log(P(w,c)/(P(w)P(c))) ; PPMI = max(PMI, 0) ; attention aux paires rares.</li><li>SVD X = UΣVᵀ ; tronquée : k composantes → vecteurs denses.</li><li>LSA : proximité sans mots communs, au prix de l'interprétabilité.</li></ul>", cartes: "distributionnel" }
  });
})();
