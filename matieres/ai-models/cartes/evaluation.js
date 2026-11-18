/* Paquet de cartes : évaluer un classifieur (fiche 10, page 9, TP vin). */
Paquets.enregistrer({
  matiere: "ai-models", id: "evaluation", titre: "Évaluer un classifieur",
  cartes: [
    { id: "mij", q: "Que compte m<sub>i,j</sub> dans une matrice de confusion ?", r: "Le nombre d'exemples de vraie classe i prédits dans la classe j (calculé sur le jeu de test)." },
    { id: "zones", q: "TP, FN, FP, TN de la classe i ?", r: "TP = m<sub>i,i</sub> ; FN = reste de la ligne i ; FP = reste de la colonne i ; TN = Total − TP − FN − FP." },
    { id: "accuracy", q: "Accuracy ?", r: "<span class='mono'>(TP + TN) / (TP + TN + FP + FN)</span> : fraction de prédictions correctes (diagonale / total). Trompeuse si les classes sont déséquilibrées." },
    { id: "precision", q: "Precision, et la question à laquelle elle répond ?", r: "<span class='mono'>TP / (TP + FP)</span> : parmi les prédits positifs, combien le sont vraiment ?" },
    { id: "recall", q: "Recall, ses autres noms, sa question ?", r: "<span class='mono'>TP / (TP + FN)</span> = sensibilité = TPR : parmi les vrais positifs, combien sont détectés ?" },
    { id: "specificite", q: "Spécificité ?", r: "<span class='mono'>TN / (TN + FP)</span> : capacité à rejeter correctement les négatifs." },
    { id: "f1", q: "F1 (deux formes) ?", r: "<span class='mono'>2PR/(P + R) = 2TP/(2TP + FP + FN)</span> : moyenne harmonique, élevée seulement si P et R le sont." },
    { id: "piege-precision", q: "Piège de traduction de la page Google ?", r: "Elle titre « Précision » sa section sur l'accuracy (« justesse »). Precision = TP/(TP + FP), ce n'est pas l'accuracy." },
    { id: "f1-tp", q: "Erreur dans la formule F1 du sujet de TP vin ?", r: "Il écrit Accuracy au lieu de Precision : F1 = 2·P·R/(P + R)." },
    { id: "seuil", q: "Effet d'une baisse du seuil t (ŷ = 1 si p̂ ≥ t) ?", r: "Plus de prédictions positives : typiquement recall ↑ et precision ↓ (l'inverse si t monte)." },
    { id: "roc", q: "Courbe ROC ?", r: "TPR = TP/(TP + FN) en fonction de FPR = FP/(FP + TN) ; chaque seuil donne un point." },
    { id: "auc", q: "AUC ROC : définition et interprétation ?", r: "<span class='mono'>∫₀¹ TPR d(FPR) = P(s(x⁺) > s(x⁻))</span> : qualité du classement, indépendamment d'un seuil." },
    { id: "pr", q: "Pourquoi la courbe PR sous fort déséquilibre ?", r: "La precision compte les faux positifs par rapport aux prédits positifs ; le FPR, dilué par les nombreux négatifs, paraît trop bon." },
    { id: "moyennes", q: "Macro-F1, F1 pondéré, micro-F1 ?", r: "Macro : moyenne simple des F1 par classe ; pondéré : par nₖ/N ; micro : comptes agrégés, = accuracy en mono-étiquette." },
    { id: "desequilibre", q: "99 % de négatifs, classifieur « toujours négatif » ?", r: "Accuracy 99 %, recall 0 : une accuracy élevée n'implique pas une classification utile." },
    { id: "calibration", q: "Classifieur parfaitement calibré ? ECE ?", r: "P(Y = 1 | p̂ = p) = p. <span class='mono'>ECE = Σₘ |Bₘ|/N · |acc(Bₘ) − conf(Bₘ)|</span>." },
    { id: "ic", q: "Erreur type et IC à 95 % d'une accuracy p̂ sur N exemples ?", r: "<span class='mono'>SE = √(p̂(1 − p̂)/N)</span> ; IC ≈ p̂ ± 1,96·SE. Pour F1 ou AUC : bootstrap." },
    { id: "sklearn", q: "scikit-learn : matrice et rapport ?", r: "<span class='mono'>confusion_matrix(y_test, predictions)</span> et <span class='mono'>classification_report(y_test, predictions)</span> (precision, recall, F1, support, moyennes)." }
  ]
});
