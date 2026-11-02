/* Leçon 2.1 : Du texte aux identifiants (cours 2, diapos 3 à 10 ; TP 4,
   partie 3 : TextVectorization, ID 0 = padding, ID 1 = inconnu).
   Fil rouge : « The cat sat on the mat. » (exemple des diapos 7 et 9). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var VOCAB = [["&lt;PAD&gt;", 0], ["&lt;UNK&gt;", 1], ["&lt;BOS&gt;", 2], ["&lt;EOS&gt;", 3], ["the", 4], ["cat", 5], ["sat", 6], ["on", 7], ["mat", 8], ["a", 9], ["dog", 10], ["barked", 11]];
  function tableVocab() { return "<div class='defile-x'>" + N.tableau(["token"].concat(VOCAB.map(function (v) { return v[0]; })), [["ID"].concat(VOCAB.map(function (v) { return v[1]; }))]) + "</div>"; }

  var etapes = [
    {
      titre: "Le texte est discret, le modèle veut des vecteurs",
      texte:
        "<p>Le cours 2 (diapos 5-6) : le langage arrive sous forme de <b>symboles discrets</b>, de longueur variable, ambigus, avec un vocabulaire ouvert et un sens qui dépend du contexte ; " +
        "les modèles attendent des <b>vecteurs de taille fixe</b>, comparables, groupables en lots, sur lesquels on peut dériver. " +
        "<b>La façon de représenter le texte détermine ce que le modèle peut voir, comparer et apprendre</b> : la représentation est un choix de modélisation.</p>" +
        "<p>Le pipeline d'entrée sépare <b>quatre décisions</b> (diapo 7).</p>",
      objectif: "Remettre les quatre décisions dans l'ordre.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, { items: ["segmenter (unités)", "indexer (IDs)", "représenter (comptes ou vecteurs)", "mettre en lots (padding, masque)"], separateur: "→", surReussite: function () { api.valider("Chaque décision change l'information disponible pour le modèle."); } });
      }
    },
    {
      titre: "Segmenter en tokens",
      texte:
        "<p><b>Tokeniser</b> = découper le texte en unités, les <b>tokens</b>. Ici, des mots ; la ponctuation est un token à part. Chaque espace est déjà une frontière : touche la fente où il manque une coupure.</p>",
      objectif: "Obtenir les 7 tokens [The] [cat] [sat] [on] [the] [mat] [.]",
      tester: function (z) { var f = z.querySelectorAll(".fente"); f[f.length - 1].click(); },
      installer: function (zone, api) {
        Jetons.decouper(zone, { texte: "The cat sat on the mat.", cible: ["The", "cat", "sat", "on", "the", "mat", "."], surReussite: function () { api.retour("7 tokens.", true); api.valider("Le TP 2 compare split() (espaces seulement : « mat. » reste collé) à spaCy, qui sépare ponctuation et contractions (« isn't » → « is » + « n't »)."); } });
      }
    },
    {
      titre: "Mots, sous-mots, caractères",
      texte:
        "<p>Le cours (diapo 8) : <b>choisir l'unité avant de choisir le modèle</b>.</p>" +
        N.tableau(["", "tokens mots", "sous-mots / caractères (ex. BPE)"], [["vocabulaire", "grand (un ID par mot)", "petit"], ["séquences", "courtes", "plus longues"], ["mots inconnus", "risque élevé (mots rares, nouveaux)", "vocabulaire ouvert : tout mot se décompose"], ["morphologie", "play, playing, played : 3 IDs sans lien", "partagent « play »"], ["lisibilité", "directe", "moins directe (« ##ing »)"]]) +
        "<p>Variante du fil rouge : « The cats sat ». Avec des sous-mots, « cats » devient « cat » + « ##s » (« ## » : suite d'un mot).</p>",
      objectif: "Découper « cats » en deux sous-mots.",
      tester: function (z) { z.querySelector(".fente[data-pos='7']").click(); },
      installer: function (zone, api) {
        Jetons.decouper(zone, { texte: "The cats sat", cible: ["The", "cat", "s", "sat"], surReussite: function () { api.retour("[cat] [##s] : le modèle reconnaît « cat » même s'il n'a jamais vu « cats ».", true); api.valider("TP 4 : TextVectorization découpe sur les espaces, sans sous-mots (« It does not use subword tokenization »)."); } });
      }
    },
    {
      titre: "Un vocabulaire construit sur le train",
      texte:
        "<p>Le <b>vocabulaire</b> associe à chaque token un <b>identifiant entier stable</b> (diapo 9). Il est construit sur les <b>données d'entraînement uniquement</b> (sinon fuite), et réserve des <b>tokens spéciaux</b> :</p>" +
        N.tableau(["token", "rôle"], [[m("&lt;PAD&gt;"), "remplissage pour donner la même longueur aux séquences"], [m("&lt;UNK&gt;"), "mot hors vocabulaire"], [m("&lt;BOS&gt; / &lt;EOS&gt;"), "début / fin de séquence (optionnels, pour la génération)"], [m("&lt;MASK&gt;"), "autre symbole possible selon le modèle (ex. pré-entraînement masqué)"]]) +
        "<p>Train : « The cat sat on the mat. » et « A dog barked. », en minuscules, sans ponctuation, IDs par ordre d'apparition :</p>" + tableVocab() +
        "<div class='signalement'>La diapo 7 donne le même ID à « The » et « the » : cela suppose une mise en minuscules que les diapos ne mentionnent pas (le TextVectorization du TP 4 le fait : lower_and_strip_punctuation).</div>",
      objectif: "Dire où est construit le vocabulaire.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Sur quelles données construit-on (fit / adapt) le vocabulaire ?", options: ["le train seulement", "train + validation", "toutes les données, test compris"], bonne: 0, expliquer: ["Exact (diapo 9 et TP 4 : « adapt() learns the vocabulary from training text only »).", "Non : la validation sert à choisir, elle ne doit pas influencer le prétraitement.", "Non : fuite de données."], surReussite: function () { api.valider("Le vocabulaire est ensuite sauvegardé avec le modèle (vocab.json) pour une inférence reproductible."); } });
      }
    },
    {
      titre: "Indexer, avec les mots inconnus",
      texte: tableVocab() + "<p>Nouvelle phrase, vue après l'entraînement : <b>« The dog sat on the rug. »</b> (minuscules, ponctuation retirée).</p>",
      objectif: "Écrire la suite d'IDs (séparés par des espaces).",
      installer: function (zone, api) {
        Exercices.texte(zone, { label: "IDs :", attendu: ["4 10 6 7 4 1", "4, 10, 6, 7, 4, 1", "[4, 10, 6, 7, 4, 1]", "4,10,6,7,4,1"], mode: "souple", verdict: false, placeholder: "ex. 4 5 6", indice: "« rug » n'est pas dans le vocabulaire.", bravo: "4 10 6 7 4 1 : « rug » → 1 (&lt;UNK&gt;). Le token inconnu reste dans la séquence : il dit « il y avait un mot ici ».", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Limiter la taille du vocabulaire",
      texte:
        "<p>Stratégies du cours (diapo 9) : <b>fréquence minimale</b> (garder les tokens vus au moins k fois, ex. k = 5), <b>budget fixe</b> (les K plus fréquents, ex. K = 30 000), autres filtres (longueur, lettres seulement). " +
        "<b>Un vocabulaire plus petit réduit la mémoire et accélère l'entraînement, mais augmente le nombre de &lt;UNK&gt;.</b> TP 4 : <span class='mono'>max_tokens=20_000</span>, spéciaux compris.</p>" +
        "<p>Dans notre petit train, « the » apparaît 2 fois, tous les autres mots 1 fois.</p>",
      objectif: "Prévoir l'effet de k = 2.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "Avec une fréquence minimale k = 2, que contient le vocabulaire ?", options: ["les 4 spéciaux + « the »", "les 4 spéciaux seulement", "tous les mots"], bonne: 0, expliquer: ["Exact : tout le reste deviendra &lt;UNK&gt;. Sur un si petit corpus, k = 2 est bien trop strict.", "Non : « the » apparaît 2 fois.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.texte(b, { label: "« The cat sat » devient :", attendu: ["4 1 1", "4, 1, 1", "[4, 1, 1]"], mode: "souple", verdict: false, placeholder: "ex. 4 5 6", surReussite: ok }); }
        ], "Compromis : vocabulaire petit = modèle léger mais beaucoup d'inconnus.");
      }
    },
    {
      titre: "Mettre en lots : padding et troncature",
      texte:
        "<p>Pour traiter plusieurs phrases ensemble, elles doivent avoir la <b>même longueur</b> : on complète les plus courtes avec l'ID 0 (&lt;PAD&gt;), en fin de séquence (diapo 10 ; TP 4). " +
        "Les plus longues sont <b>tronquées</b> (TP 4 : <span class='mono'>output_sequence_length=300</span> : au-delà de 300 tokens, le texte est perdu pour le modèle).</p>",
      objectif: "Compléter le lot à la longueur 6.",
      tester: function (z) { var c = z.querySelectorAll(".matrice input"); for (var i = 0; i < c.length; i++) { c[i].value = "0"; c[i].dispatchEvent(new Event("input")); } },
      installer: function (zone, api) {
        var L = [[4, 5, 6, 7, 4, 8], [9, 10, 11], [4, 10, 6, 7, 4]];
        var ed = {}; L.forEach(function (l, i) { for (var j = l.length; j < 6; j++) ed[i + "," + j] = true; });
        var mx = new Matrice(zone, { nom: "IDs", lignes: ["phrase 1", "phrase 2", "phrase 3"], colonnes: ["1", "2", "3", "4", "5", "6"], onSaisie: verif });
        mx.dessiner(L.map(function (l) { var r = l.slice(); while (r.length < 6) r.push(null); return r; }), { editables: ed, format: String });
        function verif() {
          var ok = Object.keys(ed).every(function (k) { var p = k.split(","); return mx.lire(+p[0], +p[1]).trim() === "0"; });
          if (ok) { api.retour("4 positions de padding.", true); api.valider("Forme du lot : (3, 6) = (batch, longueur). Dans le TP 4 : (B, 300)."); }
        }
      }
    },
    {
      titre: "Le masque d'attention",
      texte:
        "<p>Le cours (diapo 10) : <b>le padding n'est pas du contenu</b>. Un <b>masque</b> (1 = token réel, 0 = padding) dit au modèle quoi ignorer. " +
        "En Keras : <span class='mono'>Embedding(..., mask_zero=True)</span> crée ce masque à partir de l'ID 0 (cours 3, diapo 26 ; TP 4).</p>",
      objectif: "Écrire le masque de la phrase 2 (9 10 11 0 0 0).",
      installer: function (zone, api) {
        Jetons.rangee(zone, [{ nom: "IDs", valeurs: [9, 10, 11, 0, 0, 0], classes: { 3: "masque", 4: "masque", 5: "masque" } }]);
        Exercices.texte(zone, { label: "masque :", attendu: ["1 1 1 0 0 0", "1,1,1,0,0,0", "1, 1, 1, 0, 0, 0", "111000", "[1, 1, 1, 0, 0, 0]"], mode: "souple", verdict: false, placeholder: "ex. 1 0 1", surReussite: function () { api.valider("ID 0 (padding) est masqué ; ID 1 (inconnu) ne l'est pas : c'est un vrai mot, simplement inconnu (TP 4, Q7)."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "texte-identifiants", etapes: etapes,
    fin: { texte: "<ul><li>Pipeline : segmenter → indexer → représenter → mettre en lots.</li><li>Mots (grand vocabulaire, inconnus) vs sous-mots (vocabulaire ouvert, séquences longues).</li><li>Vocabulaire construit sur le train ; &lt;PAD&gt; 0, &lt;UNK&gt; 1, &lt;BOS&gt;, &lt;EOS&gt;.</li><li>Fréquence minimale / budget fixe : plus petit = plus de &lt;UNK&gt;.</li><li>Padding (0) + troncature → forme (B, T) ; masque 1/0 ; mask_zero=True.</li></ul>", cartes: "pipeline-creux" }
  });
})();
