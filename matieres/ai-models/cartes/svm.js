/* Paquet de cartes : SVM (cours 7, parties 1 à 3, et article « Face recognition by SVMs »). */
Paquets.enregistrer({
  matiere: "ai-models", id: "svm", titre: "SVM",
  cartes: [
    { id: "hyperplan", q: "Hyperplan séparateur d'un SVM ?", r: "<span class='mono'>wᵀx + θ = 0</span> ; le signe de wᵀx + θ donne le côté prédit." },
    { id: "principe", q: "Principe des SVM ?", r: "Parmi les hyperplans séparateurs (souvent une infinité), choisir celui qui maximise la marge entre les deux classes." },
    { id: "support", q: "Vecteurs de support ?", r: "Les points d'apprentissage les plus proches de l'hyperplan, sur les bords <span class='mono'>wᵀx + θ = ±1</span>." },
    { id: "contraintes", q: "Contraintes de séparation (étiquettes ±1) ?", r: "<span class='mono'>yᵢ (wᵀxᵢ + θ) ≥ 1</span>, yᵢ ∈ {+1, −1}." },
    { id: "marge", q: "Largeur de la marge ?", r: "<span class='mono'>2 / ‖w‖</span>." },
    { id: "objectif", q: "Problème d'optimisation (données séparables) ?", r: "Minimiser <span class='mono'>½‖w‖²</span> sous <span class='mono'>yᵢ (wᵀxᵢ + θ) ≥ 1</span>." },
    { id: "astuce", q: "Astuce du noyau ?", r: "Utiliser un noyau qui mesure des similarités dans un espace de caractéristiques où les données deviennent peut-être linéairement séparables (ex. XOR)." },
    { id: "lineaire-poly", q: "Noyaux linéaire et polynomial ?", r: "<span class='mono'>K = xᵢᵀxⱼ</span> ; <span class='mono'>K = (xᵢᵀxⱼ + c)^d</span>, c constante, d degré." },
    { id: "rbf", q: "Noyau RBF et rôle de γ ?", r: "<span class='mono'>K = exp(−γ‖xᵢ − xⱼ‖²)</span> ; petit γ : influence large, frontière lisse ; grand γ : influence locale, risque de sur-apprentissage." },
    { id: "C", q: "Rôle de C dans SVC ?", r: "Pénalité des erreurs d'entraînement : grand C ajuste plus strictement les points d'entraînement." },
    { id: "pipeline", q: "Pourquoi make_pipeline(StandardScaler(), SVC(…)) ?", r: "Les SVM ont besoin de caractéristiques à la même échelle ; le pipeline estime la mise à l'échelle sur l'entraînement seulement (pas de fuite du test)." },
    { id: "choix", q: "Quand essayer un SVM ?", r: "Jeux petits à moyens à caractéristiques structurées, texte creux en grande dimension (linéaire), motifs non linéaires sur petit jeu (RBF), anomalies (One-Class SVM)." },
    { id: "limites", q: "Limites des SVM ?", r: "Coût des noyaux quand n grandit, mise à l'échelle nécessaire, réglage noyau / régularisation, probabilités à calibrer, moins bons que le deep learning sur médias bruts." },
    { id: "multi", q: "Multi-classe dans l'article des visages ?", r: "Un contre un (un contre tous est souvent ambigu) : c(c − 1)/2 SVM linéaires, puis tournoi en arbre binaire ascendant, c − 1 comparaisons par requête." },
    { id: "resultats", q: "Résultat principal de l'article ?", r: "Sur les mêmes eigenfaces, SVM bien meilleur que le plus proche centre : ORL 3,0 % contre 5,25 % d'erreur ; base composite 8,79 % contre 15,14 %." }
  ]
});
