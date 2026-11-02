/* Leçon 1.8 : Auditer et explorer les données (cours 1, diapos 36 à 40 ;
   TP 1 « Exploratory Data Analysis », parties 1 et 2).
   Fil rouge : un petit jeu de données de critiques de films (inventé pour la
   leçon), puis la colonne HouseAge du TP 1 réduite à quelques valeurs. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;

  var etapes = [
    {
      titre: "Le modèle n'apprend que ce que contiennent les données",
      texte:
        "<p>Le cours (diapo 36) : <b>collecte</b> (qui et quoi est représenté ?), <b>qualité</b> (valeurs fiables et complètes ?), <b>représentation</b> (quelle structure le modèle voit-il ?), <b>modèle</b> (quels motifs peuvent être appris ?). " +
        "Un modèle plus complexe ne peut pas retrouver une information manquante, biaisée ou mal encodée.</p>" +
        "<p>Avant de transformer quoi que ce soit, on fait un <b>audit</b> en quatre axes (diapo 37).</p>",
      objectif: "Ranger chaque question d'audit dans son axe.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Sémantique", "Schéma", "Qualité", "Provenance"], items: [
          { texte: "Que représente une ligne ? Que veut dire l'étiquette « positive » ?", bonne: 0 },
          { texte: "Quels types, unités, plages de valeurs, nombre de classes ?", bonne: 1 },
          { texte: "Valeurs manquantes, doublons, valeurs aberrantes, étiquettes bruitées ?", bonne: 2 },
          { texte: "D'où viennent les données, sous quelle licence, à quelle période, quelle population ?", bonne: 3 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "L'unité d'analyse",
      texte:
        "<p>TP 1 : avant tout calcul, déterminer <b>ce que représente une ligne</b>. Dans California Housing, une ligne est un <b>groupe de blocs du recensement</b> (un petit quartier), pas une maison : " +
        "MedInc est un revenu <i>médian</i>, HouseAge un âge <i>médian</i>, AveRooms une <i>moyenne</i>.</p>",
      objectif: "Interpréter correctement une association.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "On observe : plus MedInc est élevé, plus MedHouseVal est élevé. On peut conclure…", options: ["que les quartiers à revenu médian plus élevé ont tendance à avoir des logements plus chers (association au niveau du quartier)", "qu'augmenter le revenu d'une personne augmente la valeur de sa maison", "que chaque maison chère appartient à quelqu'un de riche"], bonne: 0, expliquer: ["Exact : une association entre quartiers, ni individuelle ni causale.", "Non : c'est une interprétation causale et individuelle, non justifiée.", "Non : on ne voit pas les maisons individuelles."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Types de variables",
      texte:
        "<p>TP 1 : une variable est <b>numérique</b> (<i>continue</i> : une mesure ; <i>discrète</i> : un compte) ou <b>catégorielle</b> (<i>nominale</i> : sans ordre ; <i>ordinale</i> : avec ordre). " +
        "<b>Un type entier (int) ne veut pas dire numérique</b> : on encode souvent des catégories par des entiers.</p>",
      objectif: "Classer chaque variable.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Continue", "Discrète", "Nominale", "Ordinale"], items: [
          { texte: "MedInc (revenu médian du quartier)", bonne: 0 },
          { texte: "Population (nombre d'habitants)", bonne: 1 },
          { texte: "target de 20 Newsgroups (0 à 19, un entier par thème)", bonne: 2, explication: "Des entiers, mais aucun ordre ni distance entre thèmes." },
          { texte: "Note d'un avis : « mauvais », « moyen », « bon »", bonne: 3 },
          { texte: "Nombre de mots d'un document", bonne: 1 }
        ], surReussite: function () { api.valider("Le premier exercice du TP 1 est un dictionnaire de données : signification, type, sous-type, rôle (entrée ou cible) de chaque colonne."); } });
      }
    },
    {
      titre: "Moyenne et médiane : laquelle est robuste ?",
      texte:
        "<p>Âges médians de 5 quartiers : 10, 20, 20, 30, 40. Moyenne = 24, médiane = 20, mode = 20. Le TP 1 ajoute une valeur extrême artificielle (1 000) à une copie de la série.</p>",
      objectif: "Recalculer moyenne et médiane avec la valeur 1 000.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "moyenne ≈", attendu: 1120 / 6, tolerance: 0.01, placeholder: "ex. 30", indice: "(10 + 20 + 20 + 30 + 40 + 1000) / 6.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "médiane =", attendu: 25, placeholder: "ex. 30", indice: "6 valeurs triées : 10, 20, 20, 30, 40, 1000 → moyenne des 3e et 4e.", surReussite: ok }); }
        ], "Moyenne 24 → 186,7 ; médiane 20 → 25. La médiane est robuste aux valeurs extrêmes ; la moyenne est tirée vers elles.");
      }
    },
    {
      titre: "Écart-type et ddof",
      texte:
        "<p>Variance = moyenne des carrés des écarts à la moyenne ; écart-type = sa racine. TP 1 : avec <span class='mono'>ddof=0</span> on divise par n (dispersion de la population observée) ; " +
        "avec <span class='mono'>ddof=1</span> par n − 1 (estimateur usuel à partir d'un échantillon). <b>pandas utilise ddof=1 par défaut</b> pour <span class='mono'>Series.std()</span> (NumPy : ddof=0).</p>" +
        "<p>Série : 2, 4, 4, 4, 5, 5, 7, 9 (moyenne 5 ; somme des carrés des écarts = 32).</p>",
      objectif: "Calculer les deux écarts-types.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "std(ddof=0) =", attendu: 2, tolerance: 0.001, placeholder: "ex. 1", indice: "√(32 / 8).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "std(ddof=1) ≈", attendu: Math.sqrt(32 / 7), tolerance: 0.005, placeholder: "ex. 1", indice: "√(32 / 7).", surReussite: ok }); }
        ], "2 contre 2,14 : l'écart diminue quand n grandit.");
      }
    },
    {
      titre: "Quartiles, IQR, asymétrie",
      texte:
        "<p>Q1 et Q3 sont les quantiles 25 % et 75 % ; l'<b>IQR</b> = Q3 − Q1 mesure la dispersion de la moitié centrale, sans être influencé par les extrêmes. " +
        "L'<b>asymétrie</b> (skewness, <span class='mono'>df.skew()</span>) est positive quand la distribution a une longue queue à droite ; la moyenne est alors tirée au-dessus de la médiane.</p>" +
        "<p>Série : 1, 2, 3, 4, 5, 6, 7, 8, 9 ; Q1 = 3, Q3 = 7.</p>",
      objectif: "Calculer l'IQR, puis reconnaître une asymétrie.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "IQR =", attendu: 4, placeholder: "ex. 2", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Longueur des documents de 20 Newsgroups (TP 1) : moyenne bien au-dessus de la médiane, quelques documents très longs. La distribution est…", options: ["asymétrique à droite : médiane et IQR la décrivent mieux que la moyenne", "symétrique", "asymétrique à gauche"], bonne: 0, expliquer: ["Exact (corrigé du TP 1).", "Non : moyenne ≠ médiane.", "Non : la queue est du côté des grandes valeurs."], surReussite: ok }); }
        ], "df.describe() donne d'un coup count, mean, std, min, 25 %, 50 %, 75 %, max.");
      }
    },
    {
      titre: "L'EDA transforme les hypothèses en questions",
      texte:
        "<p>Le cours (diapo 38) : explorer avant de choisir les transformations ou le modèle, selon quatre axes : <b>structure</b>, <b>distributions</b>, <b>relations</b>, <b>qualité</b>. " +
        "Diapos 39-40 : un graphique est utile s'il peut <b>changer la prochaine décision de modélisation</b>.</p>",
      objectif: "Associer chaque question au bon outil.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Histogramme", "Barres des classes", "Nuage de points", "Matrice de confusion"], items: [
          { texte: "Les longueurs de texte sont-elles très étalées ?", bonne: 0 },
          { texte: "Les classes minoritaires sont-elles assez représentées ?", bonne: 1 },
          { texte: "Deux caractéristiques séparent-elles les classes ?", bonne: 2 },
          { texte: "Quelles classes le modèle confond-il ?", bonne: 3 }
        ], surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "auditer-explorer", etapes: etapes,
    fin: { texte: "<ul><li>Audit : sémantique, schéma, qualité, provenance ; unité d'analyse d'abord.</li><li>Continue / discrète / nominale / ordinale ; un int n'est pas forcément numérique.</li><li>Médiane et IQR robustes ; moyenne sensible aux extrêmes.</li><li>std : ddof=0 (n) ou ddof=1 (n − 1, défaut pandas).</li><li>EDA : structure, distributions, relations, qualité.</li></ul>", cartes: "rappels-donnees" }
  });
})();
