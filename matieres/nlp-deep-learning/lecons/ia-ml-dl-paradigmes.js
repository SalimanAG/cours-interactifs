/* Leçon 1.1 : IA, ML, DL et paradigmes d'apprentissage (cours 1, diapos 6 à 12).
   Fil rouge : classer des avis de film en positif / négatif (exemple de la diapo 12). */
(function () {
  "use strict";
  var el = Site.el;
  function html(zone, contenu, classe) { var d = el("div", classe || ""); d.innerHTML = contenu; zone.appendChild(d); return d; }
  /* Enchaîne plusieurs exercices dans la même étape : le suivant n'apparaît qu'après réussite du précédent. */
  function enchainer(zone, api, exos, message) {
    var i = 0;
    function suivant() {
      if (i >= exos.length) { api.valider(message); return; }
      var bloc = el("div");
      if (i > 0) bloc.style.marginTop = "1.2rem";
      zone.appendChild(bloc);
      exos[i++](bloc, suivant);
    }
    suivant();
  }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "IA : des règles écrites ou un apprentissage",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Intelligence artificielle (cours 1)</span>" +
        "La capacité des machines à réaliser des tâches qui demandent habituellement l'intelligence humaine : résoudre des problèmes, raisonner, décider, comprendre le langage. " +
        "Une IA peut être <b>à base de règles</b> (explicitement programmée) ou <b>fondée sur l'apprentissage</b> (adaptative).</div>" +
        "<p>Notre fil rouge : un système qui dit si un avis de film est <b>positif</b> ou <b>négatif</b>.</p>",
      objectif: "Ranger chaque système dans la bonne famille d'IA.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["À base de règles", "Par apprentissage"],
          items: [
            { texte: "Un programmeur écrit : « si l'avis contient <i>great</i> et pas <i>bad</i>, alors positif ».", bonne: 0, explication: "La règle est écrite à la main : rien n'est appris." },
            { texte: "Un modèle ajuste ses paramètres en voyant 10 000 avis déjà étiquetés.", bonne: 1, explication: "Le comportement vient des données." },
            { texte: "Le même modèle, réentraîné avec des avis plus récents, change ses prédictions.", bonne: 1, explication: "Adaptatif : il suffit de changer les données." },
            { texte: "Une liste de 200 mots positifs et 200 mots négatifs choisis par un expert, et on compte.", bonne: 0, explication: "Les listes sont fixées par un humain." }
          ],
          surReussite: function () { api.valider("Le cours se concentre sur la seconde famille : l'IA par apprentissage."); }
        });
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le Machine Learning selon Mitchell",
      texte:
        "<p>Trois définitions citées par le cours (via Géron, 2019) :</p>" +
        "<ul><li>« la science (et l'art) de programmer les ordinateurs pour qu'ils <b>apprennent à partir de données</b> » (Géron) ;</li>" +
        "<li>« le domaine qui donne aux ordinateurs la capacité d'apprendre <b>sans être explicitement programmés</b> » (Arthur Samuel, 1959) ;</li>" +
        "<li>« Étant donné une <b>tâche T</b> et une <b>mesure de performance P</b>, un programme apprend de l'<b>expérience E</b> si sa performance sur T, mesurée par P, s'améliore avec E » (Tom Mitchell, 1997).</li></ul>" +
        "<p>Applique la définition de Mitchell à notre classifieur d'avis.</p>",
      objectif: "Associer chaque élément à T, P ou E.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["T (tâche)", "P (performance)", "E (expérience)"],
          items: [
            { texte: "Dire si un avis est positif ou négatif.", bonne: 0 },
            { texte: "La proportion d'avis correctement classés.", bonne: 1, explication: "C'est l'accuracy : une mesure de performance." },
            { texte: "Une collection de 10 000 avis déjà étiquetés.", bonne: 2, explication: "Les données d'entraînement constituent l'expérience." },
            { texte: "Le pourcentage de bonnes réponses mesuré sur 1 000 avis jamais vus.", bonne: 1 }
          ],
          surReussite: function () { api.valider("Le programme « apprend » si P s'améliore quand E grandit : plus d'avis étiquetés → plus de bonnes réponses."); }
        });
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le Deep Learning : des couches de représentations",
      texte:
        "<p>Deux citations du cours :</p>" +
        "<ul><li>« Le deep learning est un sous-domaine du machine learning fondé sur des <b>réseaux de neurones artificiels</b> composés de <b>plusieurs couches</b> de traitement. »</li>" +
        "<li>« Il permet à des modèles à plusieurs couches d'apprendre des <b>représentations</b> des données à <b>plusieurs niveaux d'abstraction</b>. » (LeCun, Bengio et Hinton, 2015) " +
        "— les niveaux les plus hauts représentent des concepts de plus en plus abstraits (Bengio, 2013).</li></ul>" +
        "<p>Le cours dessine trois cercles emboîtés.</p>",
      objectif: "Ordonner les trois domaines, puis dire ce qui caractérise le DL.",
      installer: function (zone, api) {
        enchainer(zone, api, [
          function (bloc, ok) {
            Exercices.ordonner(bloc, {
              consigne: "Du plus large au plus restreint :",
              items: ["IA", "ML", "DL"], separateur: "⊃",
              bravo: "IA ⊃ ML ⊃ DL : tout DL est du ML, tout ML est de l'IA. L'inverse est faux.",
              surReussite: ok
            });
          },
          function (bloc, ok) {
            Exercices.choix(bloc, {
              question: "Qu'est-ce qui distingue le deep learning du reste du ML ?",
              options: [
                "Des réseaux de neurones à plusieurs couches, qui apprennent eux-mêmes des représentations de plus en plus abstraites.",
                "Il n'a pas besoin de données.",
                "Il est programmé avec des règles explicites.",
                "Il ne traite que des images."
              ],
              bonne: 0,
              expliquer: [
                "Exact. Pour un avis : les premières couches pourraient capter des mots, les suivantes des tournures (« not good »), puis une opinion. (Illustration : ce que capte chaque couche n'est pas fixé à l'avance.)",
                "Non : le DL est du ML, il apprend à partir de données (souvent beaucoup).",
                "Non : c'est l'IA à base de règles.",
                "Non : ce cours applique le DL au langage."
              ],
              surReussite: ok
            });
          }
        ], "Dans ce cours, « neural language processing » = traiter le langage avec du deep learning.");
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Apprentissage supervisé",
      texte:
        "<p>Le cours : <b>le type de retour disponible pendant l'entraînement détermine ce que le modèle peut apprendre</b>.</p>" +
        "<div class='encadre'><span class='titre-encadre'>Supervisé</span>" +
        "Apprendre <span class='mono'>x → y</span> à partir d'<b>exemples étiquetés</b> : chaque entrée x (ici un texte) est fournie avec sa <b>cible</b> y (son étiquette). " +
        "Le modèle <span class='mono'>f_θ</span> apprend à produire y à partir de x.</div>",
      objectif: "Reconnaître l'entrée x et la cible y dans des données étiquetées.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["Entrée x", "Cible y"],
          items: [
            { texte: "« I love this movie! »", bonne: 0 },
            { texte: "Positive", bonne: 1 },
            { texte: "« This is terrible. »", bonne: 0 },
            { texte: "Negative", bonne: 1 },
            { texte: "Le nombre d'étoiles (de 1 à 5) donné par l'auteur de l'avis", bonne: 1, explication: "Une cible peut aussi être un nombre : c'est alors une régression (étape 6)." }
          ],
          surReussite: function () { api.valider("Sans les cibles y, pas d'apprentissage supervisé : quelqu'un (ou quelque chose) doit avoir étiqueté les exemples."); }
        });
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Apprentissage non supervisé",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Non supervisé</span>" +
        "<b>Découvrir une structure sans étiquettes cibles</b>. Le modèle ne reçoit que des entrées x (par exemple « The cat sits… », « A dog plays… », « Quantum physics… ») " +
        "et en dégage une structure, par exemple des groupes.</div>" +
        "<p>Tu as 50 000 avis de film <b>sans aucune étiquette</b>.</p>",
      objectif: "Cocher ce qu'on peut obtenir sans étiquettes.",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          question: "Avec ces seuls avis non étiquetés, on peut…",
          options: [
            "regrouper les avis qui se ressemblent (par exemple ceux qui parlent de la musique) ;",
            "représenter chaque avis par 2 nombres pour dessiner l'ensemble sur un plan ;",
            "repérer les avis très différents de tous les autres (spam, autre langue) ;",
            "apprendre à prédire « positif » ou « négatif » et vérifier que c'est juste."
          ],
          bonnes: [0, 1, 2],
          explication: "Ce sont les trois tâches typiques citées : <b>clustering</b> (regroupement), <b>réduction de dimension</b>, <b>détection d'anomalies</b>. Prédire « positif / négatif » et le vérifier demande des étiquettes.",
          surReussite: function () { api.valider("Un groupe trouvé sans étiquette n'a pas de nom : c'est à nous de l'interpréter."); }
        });
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Ranger les tâches",
      texte:
        "<p>Le cours liste les tâches typiques de chaque paradigme sans les définir. En une ligne chacune (complément) :</p>" +
        "<table class='tableau'>" +
        "<tr><td><b>Classification</b></td><td>prédire une <b>catégorie</b> parmi un ensemble fini (positif / négatif ; sport / politique…)</td></tr>" +
        "<tr><td><b>Régression</b></td><td>prédire un <b>nombre</b> (une note, un prix)</td></tr>" +
        "<tr><td><b>Étiquetage de séquence</b></td><td>prédire une étiquette <b>pour chaque élément</b> d'une séquence (chaque mot)</td></tr>" +
        "<tr><td><b>Clustering</b></td><td>regrouper des exemples semblables, sans étiquettes</td></tr>" +
        "<tr><td><b>Réduction de dimension</b></td><td>décrire chaque exemple avec moins de nombres en gardant l'essentiel</td></tr>" +
        "<tr><td><b>Détection d'anomalies</b></td><td>repérer les exemples atypiques</td></tr></table>",
      objectif: "Ranger chaque problème concret dans son paradigme.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["Supervisé", "Non supervisé"],
          items: [
            { texte: "Prédire la note (1 à 5 étoiles) d'un avis, à partir d'avis notés.", bonne: 0, explication: "Régression : la cible est un nombre." },
            { texte: "Pour chaque mot d'un avis, dire s'il s'agit d'un nom d'acteur.", bonne: 0, explication: "Étiquetage de séquence : une étiquette par mot." },
            { texte: "Former 5 groupes d'avis qui se ressemblent.", bonne: 1, explication: "Clustering." },
            { texte: "Classer un avis en positif ou négatif.", bonne: 0, explication: "Classification." },
            { texte: "Passer de 10 000 nombres par avis à 2 pour les afficher.", bonne: 1, explication: "Réduction de dimension (PCA, t-SNE, UMAP : vus plus loin)." },
            { texte: "Repérer des avis générés automatiquement qui ne ressemblent à aucun autre.", bonne: 1, explication: "Détection d'anomalies." }
          ],
          surReussite: function () { api.valider("Indice fiable : y a-t-il une cible y fournie pour chaque exemple d'entraînement ?"); }
        });
      }
    },

    /* 7 ─────────────────────────────────────────────────────────── */
    {
      titre: "Auto-supervisé, puis adaptation supervisée",
      texte:
        "<p>Le cours insiste : <b>le NLP neuronal repose largement sur un pré-entraînement auto-supervisé, suivi d'une adaptation supervisée.</b></p>" +
        "<ol><li><b>Pré-entraînement auto-supervisé</b> : sur de grands corpus de texte <i>non étiqueté</i>, on fabrique les cibles à partir du texte lui-même " +
        "(par exemple, on cache un mot et on demande de le retrouver). Le modèle apprend des représentations générales de la langue.</li>" +
        "<li><b>Adaptation supervisée</b> (fine-tuning) : on transfère ces connaissances et on ajuste le modèle sur une tâche précise, avec des données étiquetées " +
        "(classification de textes, étiquetage de séquence, extraction d'information…).</li></ol>",
      objectif: "Fabriquer une cible auto-supervisée, puis situer le fine-tuning.",
      installer: function (zone, api) {
        enchainer(zone, api, [
          function (bloc, ok) {
            html(bloc, "<p>Phrase d'origine : « I love this movie! ». On cache un mot : <span class='mono'>I love this [MASK]!</span></p>");
            Exercices.texte(bloc, {
              label: "Cible à prédire :", attendu: "movie", mode: "souple", verdict: false,
              indice: "Quel mot a été caché ? Il suffit de relire la phrase d'origine.",
              bravo: "La cible « movie » vient du texte lui-même : aucun humain n'a étiqueté quoi que ce soit. D'où « auto-supervisé ».",
              surReussite: ok
            });
          },
          function (bloc, ok) {
            Exercices.choix(bloc, {
              question: "Après ce pré-entraînement, on veut un classifieur d'avis positif / négatif. Que fait-on ?",
              options: [
                "On ajuste (fine-tune) le modèle pré-entraîné sur un jeu d'avis étiquetés positif / négatif.",
                "On recommence l'entraînement de zéro sur les avis étiquetés.",
                "Rien : le modèle pré-entraîné sait déjà classer les avis."
              ],
              bonne: 0,
              expliquer: [
                "Exact : c'est l'adaptation supervisée. Elle demande en général bien moins d'exemples étiquetés que partir de zéro.",
                "Non : on perdrait tout ce qui a été appris pendant le pré-entraînement.",
                "Non : il a appris à prédire des mots cachés, pas des étiquettes « positif / négatif »."
              ],
              surReussite: ok
            });
          }
        ], "Ce schéma (pré-entraînement, puis adaptation) reviendra avec les embeddings contextuels, BERT et les LLMs.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning",
    id: "ia-ml-dl-paradigmes",
    etapes: etapes,
    fin: {
      texte:
        "<ul><li>IA ⊃ ML ⊃ DL. L'IA peut être à base de règles ou par apprentissage.</li>" +
        "<li>Mitchell : un programme apprend si sa performance P sur la tâche T s'améliore avec l'expérience E.</li>" +
        "<li>DL : réseaux à plusieurs couches qui apprennent des représentations à plusieurs niveaux d'abstraction.</li>" +
        "<li>Supervisé : x → y à partir d'exemples étiquetés (classification, régression, étiquetage de séquence).</li>" +
        "<li>Non supervisé : structure sans étiquettes (clustering, réduction de dimension, détection d'anomalies).</li>" +
        "<li>NLP neuronal : pré-entraînement auto-supervisé, puis adaptation supervisée.</li></ul>",
      cartes: "rappels-fondements"
    }
  });
})();
