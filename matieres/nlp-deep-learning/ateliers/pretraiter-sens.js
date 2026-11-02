/* Atelier : Prétraiter sans casser le sens (TP 2 « Text Preprocessing » ; TP 3,
   checkpoint 1). Les phrases sont redessinées pour l'atelier. */
(function () {
  "use strict";
  var N = NLP, m = N.m;

  var etapes = [
    {
      titre: "split() contre un tokeniseur linguistique",
      texte:
        "<p>TP 2, expérience 1 : <span class='mono'>text.split()</span> coupe seulement aux espaces ; le tokeniseur anglais de spaCy sépare la ponctuation et les contractions (« He's » → « He » + « 's », « isn't » → « is » + « n't »).</p>" +
        "<p>Reproduis le découpage de spaCy.</p>",
      objectif: "Obtenir [He] ['s] [sure] [the] [film] [is] [n't] [bad] [.]",
      tester: function (z) { [2, 21, 28].forEach(function (p) { z.querySelector(".fente[data-pos='" + p + "']").click(); }); },
      installer: function (zone, api) {
        Jetons.decouper(zone, { texte: "He's sure the film isn't bad.", cible: ["He", "'s", "sure", "the", "film", "is", "n't", "bad", "."], surReussite: function () { api.retour("9 tokens (split() en donnerait 6).", true); api.valider("La négation « n't » devient un token à part : important pour l'analyse de sentiment. Un découpage par espaces peut suffire quand le texte est déjà propre (mots séparés, peu de ponctuation)."); } });
      }
    },
    {
      titre: "Racine (stemming) ou lemme",
      texte:
        "<p>TP 2, expérience 2 : les deux réduisent la variation morphologique. Le <b>stemming</b> (SnowballStemmer) applique des règles de troncature et peut produire des formes qui ne sont pas des mots ; " +
        "la <b>lemmatisation</b> (spaCy, <span class='mono'>token.lemma_</span>) renvoie la forme du dictionnaire, grâce à l'analyse linguistique.</p>",
      objectif: "Attribuer chaque sortie à sa méthode.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Stemming", "Lemmatisation"], items: [
          { texte: "studies → <span class='mono'>studi</span>", bonne: 0 },
          { texte: "studies → <span class='mono'>study</span>", bonne: 1 },
          { texte: "was → <span class='mono'>be</span>", bonne: 1, explication: "Il faut savoir que « was » est une forme de « be » : de la connaissance linguistique." },
          { texte: "was → <span class='mono'>was</span>", bonne: 0 }
        ], surReussite: function () { api.valider("Le lemme est plus lisible pour un humain. Les deux réduisent la taille du vocabulaire… mais le plus petit vocabulaire n'est pas forcément le meilleur : on fusionne parfois des formes qui portaient de l'information (temps, nombre)."); } });
      }
    },
    {
      titre: "Mots vides et négation",
      texte:
        "<p>TP 2, expérience 3 : les <b>mots vides</b> (stop words) sont des mots-outils fréquents. Les retirer raccourcit les documents… et peut changer le sens. Pipeline : minuscules, mots alphabétiques, lemmes.</p>" +
        N.tableau(["phrase", "tous les mots", "sans mots vides"], [["I liked the film.", m("i like the film"), m("like film")], ["I did not like the film.", m("i do not like the film"), "?"]]),
      objectif: "Prévoir le résultat sans mots vides, puis la parade.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "« I did not like the film. » sans mots vides donne…", options: [m("like film") + " : identique à la phrase positive", m("not like film"), m("did like film")], bonne: 0, expliquer: ["Exact : « not » est dans la liste de mots vides de spaCy. Un classifieur de sentiment ne peut plus distinguer les deux phrases.", "Non : c'est ce qu'on obtient seulement si l'on préserve la négation.", "Non : « did » (lemme « do ») est aussi un mot vide."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Le TP propose preserve_negation : garder « no », « not », « never » même si ce sont des mots vides. Avec cette option…", options: [m("not like film"), m("like film")], bonne: 0, expliquer: ["Exact : le contraste positif / négatif est préservé.", "Non."], surReussite: ok }); }
        ], "Pour une classification par thème, retirer les mots vides est beaucoup moins risqué : le thème tient aux mots de contenu.");
      }
    },
    {
      titre: "Préserver la négation ne suffit pas toujours",
      texte: "<p>TP 2, question 3.3 : la liste {no, not, never} règle-t-elle tous les problèmes ? Rappel : le pipeline ne garde que les tokens alphabétiques (<span class='mono'>token.is_alpha</span>).</p>",
      objectif: "Juger quatre cas.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "« The film isn't good » : le token « n't » est gardé par le filtre is_alpha.", vrai: false, explication: "" },
          { texte: "« hardly enjoyable » exprime une négation que la liste {no, not, never} ne voit pas.", vrai: true },
          { texte: "spaCy et NLTK ont des listes de mots vides différentes (extension du TP 2).", vrai: true },
          { texte: "Une liste de mots vides plus longue donne toujours une meilleure représentation.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider("« n't » contient une apostrophe : il est rejeté par is_alpha, et la négation disparaît quand même."); } });
      }
    },
    {
      titre: "Choisir le prétraitement selon la tâche",
      texte:
        "<p>TP 2, expérience 4 : trois configurations — tokens en minuscules ; lemmes ; lemmes sans mots vides. Conclusion du TP : <b>il n'existe pas de pipeline de prétraitement universellement optimal</b>.</p>" +
        "<p>TP 3, checkpoint 1 : mettre en minuscules et retirer la ponctuation fait perdre l'emphase de « I LOVE cats! » par rapport à « I love cats. ».</p>",
      objectif: "Associer chaque question à la bonne opération ou représentation.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Retirer les mots vides", "Lemmatiser", "Lemmes sans mots vides", "Lemmes avec mots vides"], items: [
          { texte: "Quelle opération raccourcit les séquences ?", bonne: 0 },
          { texte: "Laquelle réduit la variation du vocabulaire sans forcément raccourcir les séquences ?", bonne: 1 },
          { texte: "Première représentation à tester pour une classification par thème ?", bonne: 2 },
          { texte: "Première représentation à tester pour le sentiment ou l'émotion ?", bonne: 3, explication: "On garde la négation et les mots-outils porteurs d'émotion." }
        ], surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "pretraiter-sens", etapes: etapes, fin: { texte: "<ul><li>split() vs tokeniseur linguistique (ponctuation, contractions).</li><li>Stemming (troncature) vs lemmatisation (forme du dictionnaire).</li><li>Retirer les mots vides peut supprimer la négation ; « n't » est rejeté par is_alpha.</li><li>Le bon prétraitement dépend de la tâche.</li></ul>", cartes: "pipeline-creux" } });
})();
