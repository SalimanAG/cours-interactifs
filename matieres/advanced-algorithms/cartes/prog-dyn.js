/* Paquet de cartes : Programmation dynamique (TD1, cours 5). */
Paquets.enregistrer({
  matiere: "advanced-algorithms",
  id: "prog-dyn",
  titre: "Programmation dynamique",
  cartes: [
    { id: "p-def", q: "Restaurants (TD1) : définition de p(i) ?", r: "Le numéro de l'aire la plus proche de i, située avant i et à au moins 50 km de i ; p(i) = 0 s'il n'y en a pas." },
    { id: "p-calcul", q: "Comment calculer tous les p(i) en O(n) ?", r: "<code>p ← 0 ; pour i de 1 à n : tant que x[i] − x[p+1] ≥ 50 : p ← p + 1 ; p[i] ← p</code>. p ne fait qu'augmenter : au plus n tours de « tant que » au total." },
    { id: "restau-b", q: "Si on place un restaurant en i, sur quelles aires j < i peut-on en placer un autre ?", r: "Précisément sur les aires j ≤ p(i)." },
    { id: "restau-rec", q: "Récurrence de OPT(j) pour les restaurants ?", r: "<code>OPT(j) = max{ OPT(j − 1), rⱼ + OPT(p(j)) }</code>, OPT(0) = 0. Selon que j est dans la solution optimale de Restau(j) ou non." },
    { id: "restau-sans", q: "Restau(j), j ∉ S*ⱼ : que vaut r(S*ⱼ) et pourquoi ?", r: "OPT(j − 1) : S*ⱼ n'utilise que des aires ≤ j − 1, c'est donc une solution optimale de Restau(j − 1)." },
    { id: "restau-avec", q: "Restau(j), j ∈ S*ⱼ : que vaut r(S*ⱼ) et pourquoi ?", r: "rⱼ + OPT(p(j)) : les autres aires de S*ⱼ sont ≤ p(j) (contrainte des 50 km) et forment une solution optimale de Restau(p(j))." },
    { id: "restau-prem", q: "À quoi sert le tableau prem dans la correction du TD1 ?", r: "prem[j] = aire de plus grand indice utilisée dans la solution optimale de Restau(j). Reconstruction : k ← prem[n], puis tant que p[k] > 0 : k ← prem[p[k]]. O(n)." },
    { id: "sac-def", q: "Sac à dos à valeurs entières : définition de OPT(i, V) ?", r: "Le poids minimum d'un sac de valeur au moins V qui n'utilise que les objets {1, …, i}." },
    { id: "sac-rec1", q: "OPT(i, V) quand V > v₁ + … + vᵢ₋₁ ?", r: "On est obligé de prendre i : <code>OPT(i, V) = wᵢ + OPT(i − 1, max{0, V − vᵢ})</code>." },
    { id: "sac-rec2", q: "OPT(i, V) quand V ≤ v₁ + … + vᵢ₋₁ ?", r: "<code>OPT(i, V) = min{ OPT(i − 1, V), wᵢ + OPT(i − 1, max{0, V − vᵢ}) }</code> (sans i, ou avec i)." },
    { id: "sac-max", q: "Pourquoi « max{0, V − vᵢ} » dans la formule ?", r: "Si vᵢ ≥ V, l'objet i suffit seul : OPT(i − 1, 0) = 0 et OPT(i, V) = wᵢ. Sinon il reste V − vᵢ à atteindre avec les objets avant i (TD1, question c)." },
    { id: "sac-reponse", q: "Comment lire la valeur optimale du sac à dos dans la table ?", r: "Le V maximum tel que OPT(n, V) ≤ W." },
    { id: "sac-complexite", q: "Complexité de l'algorithme exact du sac à dos à valeurs entières ?", r: "<code>O(n² v*)</code> avec v* = max vᵢ : boucle sur i (n fois) × boucle sur V (au plus n v* fois)." },
    { id: "pseudo-poly", q: "Pourquoi O(n² v*) n'est-il pas polynomial ?", r: "La taille de l'entrée est t = O(n (log v* + log w*)) : v* est exponentiel en t. L'algorithme est pseudo-polynomial (polynomial si les nombres étaient codés en unaire)." }
  ]
});
