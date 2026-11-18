/* Paquet de cartes : réseaux feed-forward et rétropropagation (notes 6, TP vin). */
Paquets.enregistrer({
  matiere: "ai-models", id: "retropropagation", titre: "Rétropropagation",
  cartes: [
    { id: "ffn-regles", q: "Les 3 règles de construction d'un réseau feed-forward ?", r: "1 — pas de boucles ; 2 — pas de connexions entre neurones de la même couche ; 3 — la couche i n'est connectée qu'à la couche i + 1." },
    { id: "pourquoi-rigide", q: "Pourquoi imposer une structure aussi rigide ?", r: "La renormalisation complique déjà beaucoup le comportement d'un réseau booléen à seuil ; il faut maîtriser la complexité pour pouvoir apprendre." },
    { id: "apprendre", q: "Apprendre, avec un réseau de neurones ?", r: "Trouver une matrice de connexion et un vecteur de seuils (de taille minimale si possible) tels que f approxime bien la fonction objectif O, connue par des exemples." },
    { id: "exemple", q: "Exemple positif, exemple négatif ?", r: "(x₁ … xₙ, y₁ … yₘ) avec O(x) = y : positif ; O(x) ≠ y : négatif." },
    { id: "eqm", q: "EQM, et quand f approxime-t-elle bien O ?", r: "<span class='mono'>EQM = ½ Σᵢ ‖fᵢ − Oᵢ‖²</span> sur les exemples ; quand elle est plus petite qu'une précision ε fixée." },
    { id: "descente", q: "Règle de mise à jour de la rétropropagation ?", r: "<span class='mono'>ΔW = −ε ∂EQM/∂W</span>, ε ∈ (0, 1) taux d'apprentissage ; le signe − pour descendre." },
    { id: "derivee-sig", q: "Dérivée de la sigmoïde ?", r: "<span class='mono'>S′ = S(1 − S)</span>, au plus 1/4 (en S = 1/2)." },
    { id: "delta-sortie", q: "δ d'un neurone de sortie, et mise à jour ?", r: "<span class='mono'>δ_s = (S_s − O_s) S_s(1 − S_s)</span> ; <span class='mono'>ΔW_c^s = −ε δ_s x_c</span> (x_c = sortie du neurone c)." },
    { id: "delta-cache", q: "δ d'un neurone caché ?", r: "<span class='mono'>δ_c = S_c(1 − S_c) Σ_(k ∈ D(S_c)) δ_k W_c^k</span>, D(S_c) = neurones de la couche supérieure qui ont c en entrée ; <span class='mono'>ΔW_j^c = −ε δ_c S_j</span>." },
    { id: "chaine", q: "Quelle règle mathématique fonde le calcul de ∂EQM/∂S_c ?", r: "La dérivation des fonctions composées : ∂EQM/∂S_c = Σ_k ∂EQM/∂S_k · ∂S_k/∂S_c." },
    { id: "ordre", q: "Dans quel ordre calcule-t-on dans une passe ?", r: "Passe avant (toutes les sorties), puis tous les δ de la sortie vers l'entrée (avec les anciens poids), puis toutes les mises à jour." },
    { id: "arret", q: "Condition de terminaison, valeurs courantes ?", r: "|EQM(t + 1) − EQM(t)| < δ, ou t > C (époques) ; δ = 10⁻³, C = 500, paramétrables dans scikit-learn." },
    { id: "plateau", q: "Piège du critère |ΔEQM| < δ ?", r: "Sur un plateau (souvent au début), l'EQM change peu : l'algorithme peut s'arrêter avant d'avoir appris." },
    { id: "sklearn-phases", q: "Les trois phases de scikit-learn ?", r: "SPLIT (préparation des données), FIT (entraînement), PREDICT (prédiction et contrôle)." },
    { id: "tp-vin", q: "Le TP vin : découpage, normalisation, modèle ?", r: "test_size = 1/3 ; StandardScaler ajusté sur le train puis transform sur train et test ; MLPClassifier(hidden_layer_sizes=(13, 13, 13), max_iter=500)." },
    { id: "pourquoi-scaler", q: "Pourquoi normaliser pour un MLP ?", r: "Il est sensible à l'échelle : une variable de plusieurs ordres de grandeur plus grande influence trop la fonction objectif." }
  ]
});
