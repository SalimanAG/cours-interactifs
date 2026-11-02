/* Leçon 1.9 : Nettoyer — doublons, valeurs manquantes, valeurs extrêmes
   (cours 1, diapos 41 à 43 ; TP 1, partie 4).
   Fil rouge : un petit tableau de critiques (id, âge de l'auteur, texte, étiquette), inventé pour la leçon. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var TABLE = N.tableau(["id", "age", "text", "label"], [
    ["1", "25", "Great film", "pos"], ["2", "<b>NaN</b>", "Boring", "neg"], ["3", "34", "Loved it", "pos"],
    ["4", "28", "Great film", "pos"], ["5", "41", "", "neg"], ["6", "220", "Awful ending", "neg"]]);

  var etapes = [
    {
      titre: "Nettoyer est un choix de modélisation",
      texte:
        "<p>Le cours (diapo 41) : <b>chaque règle change la distribution empirique vue par le modèle</b>. Le parcours : brut → valider → dédoublonner → imputer / signaler → revoir, en gardant une <b>trace d'audit</b> (nombre de lignes avant / après chaque règle) " +
        "et en <b>calculant toute statistique d'imputation sur les données d'entraînement uniquement</b>.</p>",
      objectif: "Remettre les étapes dans l'ordre du cours.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, { items: ["brut", "valider", "dédoublonner", "imputer / signaler", "revoir"], separateur: "→", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Doublons",
      texte: TABLE + "<p>Les lignes 1 et 4 ont le même texte et la même étiquette (seuls id et age diffèrent). Le cours : les doublons peuvent être <b>exacts</b> ou <b>quasi-doublons</b> (même texte, petites variantes).</p>",
      objectif: "Dire combien de lignes reste après suppression des doublons de texte.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "lignes restantes =", attendu: 5, placeholder: "ex. 4", bravo: "6 − 1 = 5. Un doublon laissé à la fois dans le train et dans le test gonfle artificiellement les scores.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Valeurs manquantes : trois traitements",
      texte: "<p>Le cours (diapo 42) : d'abord comprendre <b>pourquoi</b> une valeur est absente, puis choisir.</p>",
      objectif: "Associer chaque traitement à sa description.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Supprimer", "Imputer", "Représenter"], items: [
          { texte: "Retirer lignes ou colonnes ; seulement si les manques sont rares et que la suppression ne déforme pas la population", bonne: 0 },
          { texte: "Remplacer par une valeur plausible (moyenne, médiane, plus fréquente, modèle, connaissance du domaine)", bonne: 1 },
          { texte: "Ajouter un indicateur binaire age_missing, ou un modèle qui gère l'absence", bonne: 2 },
          { texte: "Abandonner une caractéristique presque toujours manquante", bonne: 0 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Imputer avec la médiane… du train",
      texte:
        TABLE +
        "<p>Les lignes 1 à 4 sont l'ensemble d'entraînement. On impute l'âge manquant avec la <b>médiane des âges observés du train</b> (TP 1 : <span class='mono'>fillna(median())</span>).</p>",
      objectif: "Calculer la valeur imputée.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "valeur imputée =", attendu: 28, placeholder: "ex. 30", indice: "Âges observés parmi les lignes 1 à 4 : 25, 34, 28 (la ligne 2 est manquante). Trie-les et prends celle du milieu.", bravo: "28. Si on avait pris la médiane de toutes les lignes (y compris celles du test), on aurait utilisé de l'information du test : une fuite.", surReussite: function () { api.valider("TP 1 : l'imputation préserve le nombre de lignes mais réduit la variabilité et traite l'absence comme non informative ; la suppression perd des données et peut biaiser si les manques ne sont pas aléatoires."); } });
      }
    },
    {
      titre: "Quand l'absence est une information",
      texte: "<p>Diapo 42 : un <b>indicateur de valeur manquante</b> est utile quand le fait même de manquer peut porter de l'information (par exemple, une non-réponse).</p>",
      objectif: "Reconnaître ce cas.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Dans une enquête, les personnes aux revenus les plus élevés refusent souvent d'indiquer leur revenu. Que faire ?", options: ["imputer et ajouter une colonne income_missing", "supprimer ces lignes", "remplacer par 0"], bonne: 0, expliquer: ["Exact : on garde l'information « n'a pas répondu ».", "Non : on retirerait surtout les hauts revenus, ce qui biaise la population.", "Non : 0 est une valeur fausse et très extrême."], surReussite: function () { api.valider("Texte manquant ≠ nombre manquant (TP 1) : un document vide ne contient aucune preuve lexicale ; on le retire, on le corrige à la source ou on le signale explicitement."); } });
      }
    },
    {
      titre: "Valeurs extrêmes : enquêter avant de supprimer",
      texte:
        "<p>Le cours (diapo 43) : une valeur extrême peut être une <b>erreur</b>, un <b>cas rare</b> ou une <b>sous-population</b> réelle. Démarche : 1. <b>valider</b> (erreur de mesure, d'unité, doublon ?), 2. <b>traiter</b> (corriger, transformer, plafonner, statistiques robustes — ou garder), " +
        "3. <b>comprendre</b> (cas rare légitime ?), 4. <b>documenter</b> la règle et son effet.</p>" + TABLE,
      objectif: "Juger quatre décisions.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "age = 220 est très probablement une erreur de saisie : on la vérifie et on la corrige ou on la traite comme manquante.", vrai: true },
          { texte: "Toute valeur en dehors de la boîte d'un boxplot doit être supprimée.", vrai: false, explication: "" },
          { texte: "Un document de 20 000 mots peut être valide : on l'inspecte avant de fixer un seuil.", vrai: true },
          { texte: "Il faut noter quelles règles de nettoyage ont été appliquées et combien de lignes elles ont touchées.", vrai: true }
        ], surReussite: function () { api.valider("« Be curious, not hasty » : les valeurs extrêmes renseignent sur la qualité des données et la robustesse du modèle."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "nettoyer", etapes: etapes,
    fin: { texte: "<ul><li>Brut → valider → dédoublonner → imputer / signaler → revoir, avec trace d'audit.</li><li>Manquants : supprimer, imputer, représenter (indicateur) ; statistiques calculées sur le train.</li><li>Extrêmes : valider, traiter, comprendre, documenter.</li></ul>", cartes: "rappels-donnees" }
  });
})();
