/* Paquet de cartes : sous-apprentissage, sur-apprentissage, régularisation (cours 5). */
Paquets.enregistrer({
  matiere: "ai-models", id: "ajustement", titre: "Ajustement et régularisation",
  cartes: [
    { id: "sous", q: "Sous-apprentissage : signe et causes ?", r: "Erreur d'entraînement déjà haute (validation aussi) ; modèle trop simple ou pas assez entraîné : biais élevé." },
    { id: "sur", q: "Sur-apprentissage : signe et cause ?", r: "Erreur d'entraînement basse, validation bien plus haute ; le modèle apprend le bruit de l'échantillon : variance élevée." },
    { id: "instable", q: "Erreur de validation très variable d'un découpage à l'autre ?", r: "Estimation instable : petit échantillon ou différences de distribution." },
    { id: "biais", q: "Biais, et pourquoi on l'élève au carré ?", r: "<span class='mono'>Bias(x) = E[f̂(x)] − f(x)</span> ; au carré pour pénaliser les écarts dans les deux sens (+3 et −3 → 9)." },
    { id: "compromis", q: "Compromis biais–variance quand la complexité augmente ?", r: "Le biais² baisse souvent, la variance monte souvent ; on cherche le meilleur compromis (plus le bruit irréductible). Illustration conceptuelle, pas une loi universelle." },
    { id: "verifier-donnees", q: "Que vérifier avant de changer d'algorithme ?", r: "Étiquettes, valeurs manquantes, doublons, fuite, prétraitement ; une baseline simple ; un découpage adapté (aléatoire, groupé, temporel) ; métriques sur la même échelle ; représentativité." },
    { id: "fuite", q: "Fuite de données (définition) et ses 3 scénarios ?", r: "Une information non disponible au moment de la prédiction influence l'entraînement, le prétraitement ou la sélection. Scénarios : information future, prétraitement sur tout le jeu, doublons entre train et test." },
    { id: "prevenir-fuite", q: "Comment éviter la fuite ?", r: "Découper d'abord ; ajuster scalers, imputers, sélections sur le train seulement ; tester une fois sur un test intact ; respecter temps et groupes." },
    { id: "remedes-sous", q: "Remèdes au sous-apprentissage ?", r: "Plus de capacité utile (modèle plus riche, variables non linéaires, interactions), meilleures entrées, moins de régularisation, entraînement plus long ou mieux optimisé." },
    { id: "remedes-sur", q: "Remèdes au sur-apprentissage ?", r: "Régularisation, modèle plus simple, sélection de variables, élagage ; arrêt précoce, dropout, augmentation de données, plus de données représentatives, ensembles." },
    { id: "ridge-lasso", q: "Ridge et Lasso ?", r: "Ridge : MSE + α Σ w² (rétrécit, garde les variables). Lasso : MSE + α Σ |w| (peut annuler des coefficients : sélection). α grand = régularisation forte." },
    { id: "c-logreg", q: "LogisticRegression : C = 0,01 ou C = 100, lequel régularise le plus ?", r: "C = 0,01 : plus C est petit, plus la régularisation est forte." },
    { id: "trois-jeux", q: "Rôles de train, validation, test ?", r: "Train : ajuster les paramètres ; validation (ou validation croisée) : choisir modèle et réglages ; test : évaluation finale, intact jusque-là." },
    { id: "cv", q: "Ce que la validation croisée fait et ne fait pas ?", r: "Elle estime la performance sur plusieurs découpages et aide à comparer / régler. Elle ne régularise pas le modèle, ne corrige ni fuite ni changement de distribution, ne garantit rien sur le futur." },
    { id: "outliers", q: "Supprimer automatiquement les valeurs extrêmes ?", r: "Non : ce peuvent être des erreurs, ou des cas rares valides et importants. Les examiner." }
  ]
});
