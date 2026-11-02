/* Leçon 2.2 : Du sac de mots au TF-IDF, puis le cosinus (cours 2, diapos 11 à 27 ;
   TP 3, parties 2 et 3). Fil rouge : le corpus de la diapo 22 :
   D1 the cat eats food · D2 the dog eats food · D3 the cat sleeps · D4 the dog barks · D5 the animal eats */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var DOCS = ["the cat eats food", "the dog eats food", "the cat sleeps", "the dog barks", "the animal eats"];
  var VOC = ["the", "eats", "cat", "dog", "food", "sleeps", "barks", "animal"];
  var C = DOCS.map(function (d) { var t = d.split(" "); return VOC.map(function (v) { return t.filter(function (x) { return x === v; }).length; }); });
  var DF = VOC.map(function (v, j) { return C.filter(function (l) { return l[j] > 0; }).length; });
  var IDF = DF.map(function (df) { return Math.log(6 / (1 + df)) + 1; });
  function tfidf(i) { var len = DOCS[i].split(" ").length; return C[i].map(function (c, j) { return c / len * IDF[j]; }); }
  function cos(a, b) { return Vecteurs.cosinus(a, b); }
  var LIGNES = ["D1", "D2", "D3", "D4", "D5"];
  function corpus() { return N.tableau(["", "document"], DOCS.map(function (d, i) { return [LIGNES[i], d]; })); }

  var etapes = [
    {
      titre: "La matrice document–terme",
      texte:
        "<p>Le cours (diapo 12) : l'objet creux central. <b>Lignes = documents, colonnes = termes</b> (le vocabulaire), <b>valeurs = comptes</b> (nombre d'occurrences du terme dans le document).</p>" + corpus(),
      objectif: "Compléter la ligne de D5.",
      tester: function (z) { var c = z.querySelectorAll(".matrice input"); var v = [1, 1, 0, 0, 0, 0, 0, 1]; for (var i = 0; i < c.length; i++) { c[i].value = String(v[i]); c[i].dispatchEvent(new Event("input")); } },
      installer: function (zone, api) {
        var ed = {}; VOC.forEach(function (v, j) { ed["4," + j] = true; });
        var mx = new Matrice(zone, { lignes: LIGNES, colonnes: VOC, onSaisie: function () {
          var ok = VOC.every(function (v, j) { return Exercices.lireNombre(mx.lire(4, j) || "0") === C[4][j] && (mx.lire(4, j) || "").trim() !== ""; });
          if (ok) { api.retour("D5 = (1, 1, 0, 0, 0, 0, 0, 1).", true); api.valider("La plupart des cases valent 0 : la matrice est creuse. Avec un vrai vocabulaire (10⁵ à 10⁶ termes), plus de 99 % des cases sont nulles."); }
        } });
        mx.dessiner(C.map(function (l, i) { return i === 4 ? l.map(function () { return null; }) : l; }), { editables: ed, format: String });
      }
    },
    {
      titre: "Le sac de mots ignore l'ordre",
      texte:
        "<p>Bag-of-words (diapos 13-14) : chaque élément du vocabulaire est une dimension ; <b>l'ordre des mots est écarté</b>. Exemple du cours : « dog bites man » et « man bites dog » ont le même vecteur [1, 1, 1]. " +
        "Atout : <b>chaque axe a un sens lexical explicite</b> (interprétable, simple, efficace).</p>",
      objectif: "Écrire une autre phrase qui a exactement le même vecteur que D1.",
      installer: function (zone, api) {
        var mots = ["the", "cat", "eats", "food"], perms = [];
        (function p(pref, reste) { if (!reste.length) { perms.push(pref.join(" ")); return; } reste.forEach(function (w, i) { p(pref.concat([w]), reste.slice(0, i).concat(reste.slice(i + 1))); }); })([], mots);
        Exercices.texte(zone, { label: "phrase :", attendu: perms.filter(function (s) { return s !== "the cat eats food"; }), mode: "souple", verdict: false, placeholder: "4 mots", indice: "Les mêmes 4 mots, chacun une fois, dans un autre ordre.", bravo: "Même vecteur, sens différent (« food eats the cat » !). C'est la limite principale du sac de mots.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Binaire ou comptes",
      texte:
        "<p>Diapo 15 : les deux utilisent le même vocabulaire mais répondent à des questions différentes. <b>Binaire</b> : le terme apparaît-il ? (réduit l'effet des répétitions). " +
        "<b>Comptes</b> : combien de fois ? (garde la fréquence). TP 3 : <span class='mono'>CountVectorizer(binary=True)</span> contre <span class='mono'>CountVectorizer()</span>.</p>" +
        "<p>Document : « the cat eats eats food », sur les colonnes (the, eats, cat, food).</p>",
      objectif: "Donner les deux vecteurs.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.texte(b, { label: "binaire :", attendu: ["1 1 1 1", "1,1,1,1", "1, 1, 1, 1", "[1, 1, 1, 1]"], mode: "souple", verdict: false, placeholder: "ex. 1 0 1 1", surReussite: ok }); },
          function (b, ok) { Exercices.texte(b, { label: "comptes :", attendu: ["1 2 1 1", "1,2,1,1", "1, 2, 1, 1", "[1, 2, 1, 1]"], mode: "souple", verdict: false, placeholder: "ex. 1 0 1 1", surReussite: ok }); }
        ], "Diapo 16 : binaire souvent fort pour les textes courts et le sentiment ; comptes utiles pour les textes longs, mais peuvent surpondérer la répétition.");
      }
    },
    {
      titre: "Les n-grammes rendent un peu d'ordre",
      texte:
        "<p>Diapos 16-18 : un <b>n-gramme</b> est une suite contiguë de n tokens (unigramme n = 1, bigramme n = 2, trigramme n = 3). Les bigrammes distinguent « not good » de « good ». " +
        "Les <b>n-grammes de caractères</b> (« unbelievable » → unb, nbe, bel, …) sont robustes aux fautes et à la morphologie et très efficaces pour identifier une langue ; les n-grammes de mots sont plus interprétables. " +
        "TP 4 : <span class='mono'>ngram_range=(1, 2)</span> = unigrammes et bigrammes.</p>",
      objectif: "Cocher les bigrammes de D1 « the cat eats food ».",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Bigrammes de D1 :", options: ["the cat", "cat eats", "eats food", "the food", "eats cat", "cat food"], bonnes: [0, 1, 2], explication: "3 bigrammes pour 4 tokens (n − 1 en général). « eats cat » n'existe pas : l'ordre local est conservé.", surReussite: function () { api.valider("Plus de contexte, mais aussi beaucoup plus de colonnes : les n-grammes rendent la matrice encore plus grande et plus creuse."); } });
      }
    },
    {
      titre: "Stocker une matrice creuse (CSR)",
      texte:
        "<p>Diapo 19 : une matrice <b>creuse</b> ne stocke que les valeurs non nulles. Format <b>CSR</b> (Compressed Sparse Row) : <span class='mono'>data</span> (valeurs non nulles, ligne par ligne), " +
        "<span class='mono'>indices</span> (leurs colonnes), <span class='mono'>indptr</span> (où commence chaque ligne) ; la ligne i occupe les positions indptr[i] à indptr[i+1] − 1. " +
        "C'est ce que renvoie <span class='mono'>fit_transform</span> de scikit-learn (d'où le <span class='mono'>.toarray()</span> du TP 3 pour l'afficher).</p>" +
        "<p>Les lignes D1, D2, D3 de la matrice ont 4, 4 et 3 valeurs non nulles.</p>",
      objectif: "Écrire indptr pour D1, D2, D3.",
      installer: function (zone, api) {
        Exercices.texte(zone, { label: "indptr :", attendu: ["0 4 8 11", "0,4,8,11", "0, 4, 8, 11", "[0, 4, 8, 11]"], mode: "souple", verdict: false, placeholder: "ex. 0 2 4", indice: "On commence à 0 et on ajoute le nombre de non-nuls de chaque ligne.", bravo: "[0, 4, 8, 11] : 11 valeurs stockées au lieu de 24.", surReussite: function () { api.valider("Diapo 19 aussi : élaguer le vocabulaire (garder les termes fréquents ou informatifs) et ajuster le vectoriseur sur le train seulement."); } });
      }
    },
    {
      titre: "TF : l'importance dans le document",
      texte:
        "<p>Diapo 21, variantes de la fréquence du terme t dans le document d :</p>" +
        N.tableau(["variante", "définition"], [["TF brute", m("count(t, d)")], ["TF binaire", "1 si t apparaît, 0 sinon"], ["TF normalisée", m("count(t, d) / longueur(d)")], ["TF log", m("1 + log(count(t, d))")]]),
      objectif: "Calculer la TF normalisée de « cat » dans D1.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "TF(cat, D1) =", attendu: 0.25, placeholder: "ex. 0,5", indice: "1 occurrence, 4 tokens.", bravo: "1/4 = 0,25 (c'est la TF du tableau de la diapo 23).", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "df et IDF lissé",
      texte:
        "<p>Diapo 22 : la <b>fréquence documentaire</b> df(t) = nombre de documents qui contiennent t. L'IDF donne un poids faible aux termes présents partout et fort aux termes spécifiques. Forme lissée du cours (N = nombre de documents) :</p>" +
        "<div class='formule'>idf(t) = ln( (1 + N) / (1 + df(t)) ) + 1</div>" + corpus(),
      objectif: "Trouver df(eats), puis idf(eats).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.cocher(b, { question: "Documents qui contiennent « eats » :", options: LIGNES, bonnes: [0, 1, 4], explication: "df(eats) = 3.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "idf(eats) ≈", attendu: IDF[1], tolerance: 0.01, placeholder: "ex. 1,5", indice: "ln(6/4) + 1.", bravo: "≈ 1,41, comme sur la diapo. idf(the) = ln(6/6) + 1 = 1 ; idf(sleeps) = ln(6/2) + 1 ≈ 2,10.", surReussite: ok }); }
        ], "« the » est dans tous les documents : poids minimal. Les termes présents dans un seul document : poids maximal.");
      }
    },
    {
      titre: "TF × IDF",
      texte:
        "<div class='formule'>w(t, d) = TF(t, d) × IDF(t)</div>" +
        "<p>Diapo 23 : élevé pour les termes <b>fréquents dans le document mais rares dans le corpus</b>.</p>" +
        N.tableau(["terme de D1", "TF", "IDF", "TF × IDF"], [["the", "0,25", "1,00", "0,25"], ["eats", "0,25", "1,41", "0,35"], ["cat", "0,25", "1,69", "?"], ["food", "0,25", "1,69", "0,42"]]) +
        "<div class='signalement'>La diapo 23 annonce un corpus de 3 documents mais reprend les IDF du corpus à 5 documents de la diapo 22 (1,69 ; 1,41 ; 2,10). Avec N = 3, on aurait 1,29 pour cat, eats, food et 1,69 pour sleeps. " +
        "Cette leçon utilise donc le corpus à 5 documents, avec lequel les valeurs sont cohérentes.</div>",
      objectif: "Calculer w(cat, D1), à 0,01 près.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "w(cat, D1) ≈", attendu: tfidf(0)[2], tolerance: 0.01, placeholder: "ex. 0,5", bravo: "0,25 × 1,69 ≈ 0,42 : « cat » et « food » sont les termes les plus distinctifs de D1.", surReussite: function () { api.valider("Diapo 24 : TF-IDF change l'importance des caractéristiques ; il ne crée pas de sémantique (« weights, not meaning »)."); } });
      }
    },
    {
      titre: "Le cosinus compare des directions",
      texte:
        "<div class='formule'>cos(x, y) = x · y / (‖x‖ ‖y‖)</div>" +
        "<p>Diapos 25-26 : il dépend de l'angle, pas de la longueur ; entre −1 et 1, en pratique entre 0 et 1 pour du texte. Applications : recherche d'information, plus proches voisins, exploration d'un corpus. " +
        "Le document « the cat eats food the cat eats food » (D1 répété) a des comptes deux fois plus grands que D1.</p>",
      objectif: "Donner cos(D1, D1 répété) sur les comptes.",
      installer: function (zone, api) {
        var v = new Vecteurs(N.cadre(zone), { xmin: -0.5, xmax: 2.5, ymin: -0.5, ymax: 2.5, axes: ["cat", "food"], grille: 1 });
        v.dessiner({ vecteurs: [{ id: "a", x: 2, y: 2, label: "D1 répété", classe: "pale" }, { id: "b", x: 1, y: 1, label: "D1", classe: "courant" }] });
        N.html(zone, "<p class='legende-figure'>Projection sur les axes cat et food.</p>");
        Exercices.nombre(zone, { label: "cos =", attendu: 1, placeholder: "ex. 0,5", bravo: "Même direction : un document plus long, au contenu proportionnellement identique, reste parfaitement similaire.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Cosinus sur comptes, puis sur TF-IDF",
      texte:
        "<p>D1 et D2 partagent « the », « eats », « food » ; ils diffèrent par cat / dog. Sur les <b>comptes</b>, chaque vecteur a 4 composantes égales à 1 (‖D1‖ = ‖D2‖ = 2).</p>",
      objectif: "Calculer cos(D1, D2) sur les comptes, puis expliquer l'effet de TF-IDF.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "cos(D1, D2) (comptes) =", attendu: 0.75, placeholder: "ex. 0,5", indice: "3 termes communs : D1 · D2 = 3 ; divise par 2 × 2.", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Avec les poids TF-IDF, cos(D1, D2) ≈ " + fmt(cos(tfidf(0), tfidf(1)), 2) + ". Pourquoi plus bas ?", options: ["les termes partagés (the, eats) sont fréquents dans le corpus : TF-IDF les affaiblit, la différence cat / dog pèse davantage", "TF-IDF ignore les termes partagés", "le cosinus dépend de la longueur des documents"], bonne: 0, expliquer: ["Exact.", "Non : ils sont affaiblis, pas ignorés (« the » garde un poids de 0,25).", "Non : justement pas."], surReussite: ok }); }
        ], "TP 3 : TfidfVectorizer normalise en plus chaque ligne à la longueur 1 (norm=\"l2\" par défaut) ; le tableau du cours ne le fait pas, mais le cosinus est le même dans les deux cas.");
      }
    },
    {
      titre: "D'excellentes bases… mais pas du sens",
      texte:
        "<p>Diapo 27 : <b>forces</b> — rapides à construire, interprétables, solides avec peu de données, efficaces avec des modèles linéaires (SVM, régression logistique). " +
        "<b>Limites</b> — pas de partage entre synonymes, ordre lointain ignoré, espaces de caractéristiques énormes (10⁴ à 10⁶ dimensions), indépendants du contexte. Dans le TP 4, TF-IDF + régression logistique sert de référence (baseline) face aux réseaux récurrents.</p>",
      objectif: "Juger quatre affirmations sur le fil rouge.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "TF-IDF voit que « cat » (D1) et « animal » (D5) sont liés.", vrai: false, explication: "" },
          { texte: "Chaque dimension d'un vecteur TF-IDF correspond à un mot (ou n-gramme) identifiable.", vrai: true },
          { texte: "Le mot « bank » a le même poids-colonne qu'il s'agisse d'une rive ou d'une banque.", vrai: true },
          { texte: "Un modèle neuronal bat toujours TF-IDF + régression logistique en classification par thème.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider("TP 4 : des mots de thème très discriminants peuvent rendre la baseline TF-IDF très forte."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "tf-idf-cosinus", etapes: etapes,
    fin: { texte: "<ul><li>Matrice document–terme : lignes documents, colonnes termes, valeurs comptes ; creuse (CSR).</li><li>Sac de mots : ordre perdu ; binaire vs comptes ; n-grammes de mots / caractères.</li><li>TF (brute, binaire, normalisée, log) ; idf = ln((1+N)/(1+df)) + 1 ; w = TF × IDF.</li><li>cos = x·y/(‖x‖‖y‖) : direction, pas longueur.</li><li>Bases fortes et interprétables, mais sans sémantique ni contexte.</li></ul>", cartes: "pipeline-creux" }
  });
})();
