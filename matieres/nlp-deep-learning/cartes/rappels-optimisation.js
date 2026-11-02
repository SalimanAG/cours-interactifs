/* Paquet de cartes : Rappels ML/DL — optimisation et réseaux (cours 1, diapos 16 à 34 ; TP 4). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning", id: "rappels-optimisation", titre: "Rappels ML/DL — optimisation et réseaux",
  cartes: [
    { id: "regression-modele", q: "Modèle de régression linéaire du cours ?", r: "<code>Y = X·θ + N</code> (N : bruit) ; pour un x : <code>ŷ = a·x + b</code>." },
    { id: "mse-def", q: "Définition de la MSE ?", r: "<code>MSE(X, h_θ) = (1/n) Σ [h_θ(x⁽ⁱ⁾) − y⁽ⁱ⁾]²</code> : moyenne du carré des erreurs (diapo 20)." },
    { id: "rmse-def", q: "RMSE : définition et intérêt ?", r: "<code>√MSE</code>, dans l'unité de y." },
    { id: "mae-r2", q: "MAE et R² ?", r: "MAE = moyenne des |ŷ − y| ; R² = 1 − Σ(ŷ − y)² / Σ(y − ȳ)² (1 parfait, 0 = prédire la moyenne). Compléments : le cours les cite seulement." },
    { id: "equation-normale", q: "Solution directe de la régression et son défaut ?", r: "<code>θ̂ = (XᵀX)⁻¹XᵀY</code> ; complexité en n³ (inversion). La diapo écrit X⁻ᵀ : coquille." },
    { id: "optimisation-def", q: "Qu'appelle-t-on optimisation (cours 1) ?", r: "Chercher itérativement la meilleure position de la droite en faisant varier ses paramètres Θ : mesurer la perte, bouger, recommencer." },
    { id: "gradient-mse", q: "Gradient de la MSE (forme matricielle) ?", r: "<code>∇θ MSE(Θ) = (2/n) Xᵀ(XΘ − Y)</code> (diapo 24)." },
    { id: "maj-gradient", q: "Mise à jour de la descente de gradient ?", r: "<code>Θ ← Θ − η·∇θ MSE(Θ)</code>, η : taux d'apprentissage." },
    { id: "eta-trop-grand", q: "Que se passe-t-il si η est trop grand ? trop petit ?", r: "Trop grand : on saute par-dessus le minimum, la perte oscille et explose (voire Inf/NaN). Trop petit : convergence très lente." },
    { id: "epoque-batch", q: "Époque et batch ?", r: "Époque : un passage sur tout l'ensemble d'entraînement. Batch : les exemples utilisés pour un pas de gradient (batch_size=64 → ⌈N/64⌉ pas par époque)." },
    { id: "underfit-overfit", q: "Sous- et sur-apprentissage : symptômes ?", r: "Sous : erreurs d'entraînement et de validation hautes (modèle trop simple). Sur : entraînement bas, validation haute (le modèle mémorise)." },
    { id: "courbes", q: "Que montrent les courbes d'apprentissage ?", r: "Perte (ou accuracy) d'entraînement et de validation par époque ; quand la validation se dégrade alors que l'entraînement s'améliore, le sur-apprentissage commence." },
    { id: "regularisation-5", q: "Les 5 techniques de régularisation du cours ?", r: "Weight decay (L2), dropout, early stopping, data augmentation (paraphrases, bruit, back-translation), modèle plus petit." },
    { id: "early-stopping-tp4", q: "EarlyStopping(monitor=\"val_loss\", patience=2, restore_best_weights=True) ?", r: "Arrête après 2 époques sans amélioration de val_loss et restaure les poids de la meilleure époque." },
    { id: "weight-decay-formule", q: "Weight decay en formule ?", r: "<code>ℒ + λ Σ θⱼ²</code> ; λ grand → poids proches de 0, risque de sous-apprentissage (complément)." },
    { id: "neurone-formule", q: "Formule du neurone ?", r: "<code>t = Σ xᵢwᵢ + b</code>, <code>ŷ = σ(t)</code> (diapo 28)." },
    { id: "params-dense", q: "Nombre de paramètres d'une couche Dense ?", r: "entrées × neurones + neurones (un biais par neurone)." },
    { id: "sortie-tache", q: "Couche de sortie selon la tâche ?", r: "Régression : pas d'activation. 2 classes : Dense(1, sigmoid). K classes : Dense(K, softmax)." },
    { id: "non-linearite", q: "Pourquoi des activations non linéaires entre les couches ?", r: "Sinon l'empilement de couches linéaires reste linéaire (complément)." },
    { id: "boucle-entrainement", q: "Boucle d'entraînement (chats / lapins) ?", r: "Données 80 % apprentissage / 20 % évaluation ; prédictions → erreurs → corrections → itérations ; on surveille train et validation à chaque époque." }
  ]
});
