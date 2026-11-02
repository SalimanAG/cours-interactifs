/* Leçon 1.12 : Visualiser pour décider (cours 1, diapos 39, 40, 49, 52 ;
   TP 1, partie 5 ; cours 2, diapo 41 pour PCA, t-SNE, UMAP). */
(function () {
  "use strict";
  var N = NLP;

  var etapes = [
    {
      titre: "Un graphique répond à une question",
      texte: "<p>TP 1 : <b>formuler l'hypothèse avant de tracer</b>. Le TP demande trois graphiques : histogramme, nuage de points (ou droite de régression), boîte à moustaches.</p>",
      objectif: "Associer chaque question au graphique adapté.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Histogramme", "Nuage de points", "Boîtes par groupe"], items: [
          { texte: "Quelle est la distribution de MedInc ?", bonne: 0 },
          { texte: "AveRooms est-il associé à MedHouseVal ?", bonne: 1 },
          { texte: "MedHouseVal varie-t-il entre les quatre quartiles de revenu (pd.qcut) ?", bonne: 2 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Le nombre de classes d'un histogramme",
      texte: "<p>TP 1 : choisir <b>délibérément</b> le nombre de classes (bins). La largeur des classes change la granularité visuelle, pas les observations.</p>",
      objectif: "Prévoir l'effet du nombre de classes.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Avec 3 classes, on peut manquer une distribution à deux bosses.", vrai: true },
          { texte: "Avec 500 classes sur 1 000 points, l'histogramme devient bruité.", vrai: true },
          { texte: "Changer le nombre de classes modifie les données.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Le sur-tracé (overplotting)",
      texte: "<p>Avec 20 640 points, un nuage de points devient une tache. Le corrigé du TP 1 trace un <b>échantillon</b> (<span class='mono'>df.sample(5000)</span>) avec de la <b>transparence</b> (<span class='mono'>alpha=0.3</span>).</p>",
      objectif: "Choisir les bonnes parades.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Contre le sur-tracé :", options: ["tracer un échantillon aléatoire", "ajouter de la transparence", "supprimer les points extrêmes sans les regarder", "grossir les points"], bonnes: [0, 1], explication: "Supprimer sans inspecter est exclu (diapo 43) ; grossir les points aggrave le problème.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Observation, hypothèse, limite",
      texte: "<p>TP 1 : après chaque graphique, écrire une <b>observation</b> directement soutenue par la figure, une <b>explication plausible</b> qui reste une hypothèse, et une <b>limite</b> (ou facteur de confusion).</p>",
      objectif: "Ranger chaque phrase.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Observation", "Hypothèse", "Limite"], items: [
          { texte: "La médiane de MedHouseVal augmente d'un quartile de revenu au suivant.", bonne: 0 },
          { texte: "Les quartiers aisés sont peut-être plus proches de la côte.", bonne: 1 },
          { texte: "La localisation peut expliquer à la fois revenu et prix : ce n'est pas un effet causal.", bonne: 2 },
          { texte: "La longueur médiane des documents diffère selon le thème.", bonne: 0 },
          { texte: "Un classifieur pourrait utiliser la longueur comme raccourci.", bonne: 1 }
        ], surReussite: function () { api.valider("Cours 1, diapo 52 : chaque transformation doit répondre à un problème observé ou à une hypothèse documentée."); } });
      }
    },
    {
      titre: "Visualiser des représentations : PCA, t-SNE, UMAP",
      texte:
        "<p>Les modèles neuronaux transforment les données en espaces latents de grande dimension ; on les projette en 2D pour les regarder (cours 1, diapo 49 ; cours 2, diapo 41).</p>",
      objectif: "Associer chaque méthode à ce qu'elle préserve.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["PCA", "t-SNE", "UMAP"], items: [
          { texte: "Projection linéaire qui maximise la variance (structure globale)", bonne: 0 },
          { texte: "Préserve les voisinages locaux ; les distances entre groupes et leur taille ne sont pas fiables", bonne: 1 },
          { texte: "Préserve les voisinages locaux et une partie de la structure globale ; souvent plus rapide et stable", bonne: 2 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Ce qu'une projection 2D ne prouve pas",
      texte: "<p>Diapo 49 : <b>ce qu'on peut vérifier</b> (séparation des classes, voisinages, dérive, points atypiques) et <b>ce qu'il ne faut pas affirmer</b>. Diapo du cours 2 : la visualisation est un <b>diagnostic, pas une vérité</b>.</p>",
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Une projection 2D est la géométrie complète de l'espace latent.", vrai: false, explication: "" },
          { texte: "Les distances sur un t-SNE sont exactes.", vrai: false, explication: "" },
          { texte: "Un groupe visible ne prouve pas une structure causale.", vrai: true },
          { texte: "On confirme une impression visuelle par une évaluation quantitative.", vrai: true }
        ], surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "visualiser", etapes: etapes,
    fin: { texte: "<ul><li>Une question → un graphique → une décision.</li><li>Bins choisis, échantillon + transparence contre le sur-tracé.</li><li>Observation ≠ hypothèse ≠ limite.</li><li>PCA (linéaire, variance), t-SNE (local), UMAP (local + un peu de global) : diagnostics, pas vérités.</li></ul>", cartes: "rappels-donnees" }
  });
})();
