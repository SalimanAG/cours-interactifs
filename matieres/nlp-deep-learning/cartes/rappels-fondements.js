/* Paquet de cartes : Rappels ML/DL — fondements (cours 1, diapos 6 à 15 et 32 à 34). */
Paquets.enregistrer({
  matiere: "nlp-deep-learning",
  id: "rappels-fondements",
  titre: "Rappels ML/DL — fondements",
  cartes: [
    { id: "ia-def", q: "Définition de l'IA donnée par le cours, et ses deux familles ?", r: "Capacité des machines à réaliser des tâches demandant habituellement l'intelligence humaine (résoudre, raisonner, décider, comprendre le langage). IA <b>à base de règles</b> (explicitement programmée) ou <b>par apprentissage</b> (adaptative)." },
    { id: "ml-samuel", q: "Définition du ML d'Arthur Samuel (1959) ?", r: "Le domaine qui donne aux ordinateurs la capacité d'apprendre <b>sans être explicitement programmés</b>." },
    { id: "ml-mitchell", q: "Définition du ML de Tom Mitchell (1997) ?", r: "Étant donné une tâche T et une mesure de performance P, un programme apprend de l'expérience E si sa performance sur T, mesurée par P, s'améliore avec E." },
    { id: "mitchell-exemple", q: "Classifieur d'avis positif / négatif : qui sont T, P, E ?", r: "T : classer un avis. P : par exemple la proportion d'avis bien classés. E : les avis étiquetés d'entraînement." },
    { id: "dl-def", q: "Qu'est-ce que le deep learning ?", r: "Un sous-domaine du ML fondé sur des réseaux de neurones à <b>plusieurs couches</b>, qui apprennent des <b>représentations</b> à plusieurs niveaux d'abstraction (LeCun, Bengio, Hinton 2015). IA ⊃ ML ⊃ DL." },
    { id: "supervise", q: "Apprentissage supervisé : principe et tâches typiques ?", r: "Apprendre <code>x → y</code> à partir d'exemples étiquetés. Classification, régression, étiquetage de séquence." },
    { id: "non-supervise", q: "Apprentissage non supervisé : principe et tâches typiques ?", r: "Découvrir une structure sans étiquettes cibles. Clustering, réduction de dimension, détection d'anomalies." },
    { id: "taches-def", q: "Classification, régression, étiquetage de séquence : différence ?", r: "Classification : une catégorie parmi un ensemble fini. Régression : un nombre. Étiquetage de séquence : une étiquette pour chaque élément (chaque mot)." },
    { id: "auto-supervise", q: "Sur quel schéma repose largement le NLP neuronal ?", r: "<b>Pré-entraînement auto-supervisé</b> sur de grands corpus non étiquetés (les cibles viennent du texte lui-même, ex. mot masqué), puis <b>adaptation supervisée</b> (fine-tuning) sur une tâche avec des données étiquetées." },
    { id: "auto-supervise-cible", q: "« I love this [MASK]! » : d'où vient la cible, et pourquoi parle-t-on d'auto-supervision ?", r: "La cible (« movie ») est le mot caché, tiré du texte lui-même : aucune annotation humaine." },
    { id: "quatre-briques", q: "Les quatre briques du problème d'apprentissage ?", r: "Données (exemples + étiquettes) → représentation (nombres / tenseurs) → modèle <code>f_θ(x)</code> → perte <code>ℒ(ŷ, y)</code>." },
    { id: "modele-def", q: "Qu'est-ce qu'un modèle, selon le cours ?", r: "Une fonction <b>paramétrée</b> <code>f_θ</code>, ajustée à partir d'exemples, qui transforme une entrée en prédiction — pas une source de vérité." },
    { id: "perte-formule", q: "Formule de la perte d'entraînement moyenne ?", r: "<code>ℒ(θ) = (1/N) Σᵢ ℓ(ŷᵢ, yᵢ)</code>, objectif différentiable minimisé pendant l'entraînement (ex. entropie croisée, MSE)." },
    { id: "apprendre-def", q: "« Apprendre », selon le cours ?", r: "Choisir les paramètres qui réduisent l'<b>erreur attendue sur des données jamais vues</b>. On ajuste sur l'ensemble d'entraînement, on évalue sur un ensemble séparé (validation / test)." },
    { id: "perte-vs-perf", q: "Pourquoi une perte d'entraînement nulle n'est-elle pas forcément une bonne nouvelle ?", r: "Le modèle peut avoir mémorisé l'ensemble d'entraînement sans généraliser (sur-apprentissage). Seule l'évaluation sur des données jamais vues le dit." },
    { id: "decoupage-80-20", q: "Découpage utilisé dans l'exemple chats / lapins du cours ?", r: "80 % des données pour l'apprentissage, 20 % pour l'évaluation." },
    { id: "metriques-taches", q: "Quelles métriques pour : classification, régression, non supervisé, génération ?", r: "Classification : accuracy, précision, rappel, F1. Régression : MAE, MSE, RMSE, R². Non supervisé : silhouette, inertie, erreur de reconstruction. Génération : perplexité, métriques de tâche, évaluation humaine." },
    { id: "metrique-quand", q: "Quand choisir la métrique d'évaluation ?", r: "Selon l'objectif d'apprentissage, <b>avant</b> de voir les résultats. La perte sert à optimiser, la métrique à évaluer." }
  ]
});
