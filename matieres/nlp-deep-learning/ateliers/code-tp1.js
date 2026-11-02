/* Atelier : code du TP 1 (EDA) — prédire la sortie d'extraits pandas / re.
   Les extraits sont réécrits pour l'atelier (dans l'esprit du TP, sur de petites données). */
(function () {
  "use strict";
  var N = NLP;

  var etapes = [
    {
      titre: "Moyenne, médiane et valeur extrême",
      texte: N.code("age = pd.Series([10, 20, 20, 30, 40])\nage_ext = pd.concat([age, pd.Series([1000])])\nprint(age.median(), age_ext.median())"),
      objectif: "Prévoir les deux médianes.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "age.median() =", attendu: 20, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "age_ext.median() =", attendu: 25, placeholder: "ex. 1", surReussite: ok }); }
        ], "pd.concat met les deux séries bout à bout (6 valeurs).");
      }
    },
    {
      titre: "std et ddof",
      texte: N.code("s = pd.Series([2, 4, 4, 4, 5, 5, 7, 9])\nprint(s.std(ddof=0), s.std())"),
      objectif: "Prévoir les deux valeurs.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Sortie ?", options: ["2.0 2.138…", "2.0 2.0", "2.138… 2.0", "4.0 4.571…"], bonne: 0, expliquer: ["Exact : s.std() utilise ddof=1 par défaut.", "Non : le défaut de pandas est ddof=1.", "Non : ordre inversé.", "Non : ce sont les variances."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Proportions de classes",
      texte: N.code("y = pd.Series([\"sport\", \"space\", \"sport\", \"politics\", \"sport\"])\ncounts = y.value_counts()\nprops = y.value_counts(normalize=True)\nprint(counts[\"sport\"], props[\"sport\"], counts.max() / counts.min())"),
      objectif: "Prévoir les trois nombres.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "counts[\"sport\"] =", attendu: 3, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "props[\"sport\"] =", attendu: 0.6, placeholder: "ex. 0,1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "ratio de déséquilibre =", attendu: 3, placeholder: "ex. 1", surReussite: ok }); }
        ], "normalize=True renvoie des proportions de somme 1.");
      }
    },
    {
      titre: "Imputer ou supprimer",
      texte: N.code("df = pd.DataFrame({\"MedInc\": [3.0, np.nan, 5.0, 4.0],\n                   \"AveRooms\": [5.0, 6.0, np.nan, 7.0]})\nimputed = df.fillna(df.median())\nremoved = df.dropna()\nprint(imputed.loc[1, \"MedInc\"], len(removed), len(df))"),
      objectif: "Prévoir les trois valeurs.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "imputed.loc[1, \"MedInc\"] =", attendu: 4, placeholder: "ex. 1", indice: "Médiane de 3, 5, 4 (NaN ignoré).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "len(removed) =", attendu: 2, placeholder: "ex. 1", indice: "dropna retire toute ligne qui contient au moins un NaN.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "len(df) =", attendu: 4, placeholder: "ex. 1", indice: "fillna et dropna renvoient de nouveaux DataFrames : df n'est pas modifié (le TP demande de le vérifier).", surReussite: ok }); }
        ], "Corrigé du TP 1 : l'imputation garde les lignes mais réduit la variabilité ; la suppression perd des données.");
      }
    },
    {
      titre: "Quartiles avec qcut",
      texte: N.code("revenus = pd.Series([1, 2, 3, 4, 5, 6, 7, 8])\ngroupes = pd.qcut(revenus, q=4, labels=[\"Q1\", \"Q2\", \"Q3\", \"Q4\"])\nprint(groupes.value_counts()[\"Q1\"], groupes[7])"),
      objectif: "Prévoir l'effectif de Q1 et le groupe de la dernière valeur.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "effectif de Q1 =", attendu: 2, placeholder: "ex. 1", indice: "qcut coupe aux quantiles : 4 groupes de même effectif.", surReussite: ok }); },
          function (b, ok) { Exercices.texte(b, { label: "groupes[7] =", attendu: "Q4", mode: "souple", verdict: false, surReussite: ok }); }
        ], "qcut (quantiles, effectifs égaux) ≠ cut (intervalles de même largeur).");
      }
    },
    {
      titre: "Compter des tokens, avec et sans mots vides",
      texte: N.code("text = \"This movie is not good, it is NOT great either\"\ntokens = re.findall(r\"[a-z]+\", text.lower())\nprint(len(tokens))\nprint(Counter(tokens).most_common(1))\nclean = [t for t in tokens if t not in ENGLISH_STOP_WORDS]"),
      objectif: "Prévoir le nombre de tokens, le plus fréquent, et le sort de « not ».",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "len(tokens) =", attendu: 10, placeholder: "ex. 1", indice: "La regex garde les suites de lettres minuscules ; la virgule disparaît.", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Counter(tokens).most_common(1) ?", options: ["[('is', 2)] ou [('not', 2)] (égalité : le premier rencontré)", "[('movie', 1)]", "[('NOT', 1)]"], bonne: 0, expliquer: ["« is » et « not » apparaissent 2 fois (après lower) ; most_common garde l'ordre de première apparition en cas d'égalité : [('is', 2)].", "Non.", "Non : le texte a été mis en minuscules."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "« not » est-il encore dans clean ?", options: ["non : la liste de mots vides de scikit-learn contient « not »", "oui"], bonne: 0, expliquer: ["Exact : on perd la négation (TP 1, exercice 3.3, et TP 2).", "Non."], surReussite: ok }); }
        ], "Corrigé du TP 1 : la liste brute est dominée par des mots grammaticaux ; retirer les mots vides n'est pas neutre (négation).");
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "code-tp1", etapes: etapes, fin: { texte: "<p>median, std(ddof), value_counts(normalize), fillna / dropna, qcut, re.findall + Counter, mots vides.</p>", cartes: "rappels-donnees" } });
})();
