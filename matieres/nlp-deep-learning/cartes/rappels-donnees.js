/* Paquet de cartes : Rappels ML/DL — données et métriques (cours 1, diapos 13, 36 à 53 ; TP 1 ; TP 4). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning", id: "rappels-donnees", titre: "Rappels ML/DL — données et métriques",
  cartes: [
    { id: "confusion-lecture", q: "Matrice de confusion : que sont les lignes et les colonnes ?", r: "Lignes : classes vraies ; colonnes : classes prédites (TP 4). Diagonale : bonnes réponses." },
    { id: "accuracy", q: "Accuracy ?", r: "Somme de la diagonale / total." },
    { id: "precision", q: "Précision de la classe k ?", r: "Bien prédits k / tous les prédits k (colonne k). « Quand il dit k, a-t-il raison ? »" },
    { id: "rappel", q: "Rappel de la classe k ?", r: "Bien prédits k / tous les vrais k (ligne k). « Retrouve-t-il les k ? »" },
    { id: "f1", q: "F1 ?", r: "<code>2PR / (P + R)</code>, moyenne harmonique de précision et rappel." },
    { id: "macro-f1", q: "Macro-F1 et pourquoi ?", r: "Moyenne simple des F1 des classes : chaque classe compte autant, même rare (f1_score(average=\"macro\"))." },
    { id: "majorite-82", q: "Toujours prédire A (A 82 %, B 11 %, C 7 %) : accuracy et macro-F1 ?", r: "Accuracy 0,82 ; macro-F1 ≈ 0,30 (diapo 47 : 0,27). Échec total sur B et C." },
    { id: "audit-4", q: "Les 4 axes de l'audit des données ?", r: "Sémantique (que représente une ligne ?), schéma (types, unités, plages), qualité (manquants, doublons, extrêmes, bruit d'étiquettes), provenance (source, licence, période, population)." },
    { id: "unite-analyse", q: "Unité d'analyse de California Housing ?", r: "Un groupe de blocs du recensement (quartier), pas une maison : associations au niveau du quartier." },
    { id: "types-variables", q: "Les 4 sous-types de variables ?", r: "Numérique continue / discrète ; catégorielle nominale / ordinale. Un entier peut coder une catégorie." },
    { id: "moyenne-mediane", q: "Moyenne ou médiane face à une valeur extrême ?", r: "La médiane est robuste ; la moyenne est tirée vers l'extrême." },
    { id: "ddof", q: "ddof=0 vs ddof=1 ?", r: "Division par n (population observée) vs n − 1 (estimateur d'échantillon). pandas Series.std() : ddof=1 par défaut." },
    { id: "iqr-skew", q: "IQR et asymétrie ?", r: "IQR = Q3 − Q1 (moitié centrale, robuste). Asymétrie positive : longue queue à droite, moyenne > médiane." },
    { id: "eda-4", q: "Les 4 axes de l'EDA (diapo 38) ?", r: "Structure, distributions, relations, qualité." },
    { id: "nettoyage-etapes", q: "Étapes de nettoyage du cours ?", r: "Brut → valider → dédoublonner → imputer / signaler → revoir ; trace d'audit ; statistiques d'imputation sur le train seulement." },
    { id: "manquants-3", q: "Trois traitements des valeurs manquantes ?", r: "Supprimer (si rares et sans biais), imputer (moyenne, médiane, modèle…), représenter (indicateur de manque)." },
    { id: "extremes-4", q: "Démarche face à une valeur extrême ?", r: "Valider, traiter, comprendre, documenter : ne pas supprimer automatiquement." },
    { id: "transformations", q: "Les 4 transformations numériques de la diapo 44 ?", r: "Standardiser <code>(x − μ)/σ</code> ; normaliser <code>x/‖x‖</code> ; <code>log(1 + x)</code> ; <code>clip(x, q_low, q_high)</code>." },
    { id: "categoriel", q: "Encoder une variable catégorielle ?", r: "One-hot (peu de catégories), embeddings (beaucoup), tokenisation (texte). Jamais d'ordre arbitraire si l'ordre n'a pas de sens." },
    { id: "strategies-desequilibre", q: "Stratégies contre le déséquilibre ?", r: "Évaluer : découpages stratifiés, métriques par classe, macro-F1. Entraîner : poids de classes, sur/sous-échantillonnage (SMOTE), collecte ciblée, réglage des seuils." },
    { id: "fuite", q: "Qu'est-ce qu'une fuite de données ?", r: "Utiliser de l'information de validation/test pour ajuster quelque chose (vocabulaire, μ/σ, imputation, choix de modèle). Règle : tout fit sur le train, transform ailleurs ; pipelines." },
    { id: "roles-splits", q: "Rôles de train, validation, test (TP 4) ?", r: "Train : ajuster vocabulaire, IDF, paramètres. Validation : surveiller, choisir. Test : évaluation finale une fois les choix figés." },
    { id: "pca-tsne-umap", q: "PCA, t-SNE, UMAP ?", r: "PCA : linéaire, variance maximale. t-SNE : voisinages locaux. UMAP : local + un peu de global. Projections = diagnostics, pas vérités." },
    { id: "trois-idees", q: "Les trois idées finales du cours 1 ?", r: "Partir de la frontière d'évaluation (découper avant d'apprendre les transformations) ; la profondeur ne remplace pas le diagnostic ; la visualisation doit déclencher une action." }
  ]
});
