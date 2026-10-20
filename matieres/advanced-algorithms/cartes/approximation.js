/* Paquet de cartes : Approximation — équilibrage de charges et k-centres (cours 3, TD2). */
Paquets.enregistrer({
  matiere: "advanced-algorithms",
  id: "approximation",
  titre: "Approximation",
  cartes: [
    { id: "probleme", q: "Équilibrage de charges : entrée, contraintes, sortie ?", r: "Entrée : m machines, n tâches de durées tᵢ > 0. Contraintes : tâches insécables, une tâche à la fois par machine. Sortie : une affectation où la machine qui termine en dernier termine le plus tôt possible. NP-complet." },
    { id: "ratio-def", q: "Définition d'un algorithme d'approximation de ratio ρ ?", r: "ρ ≥ 1 ; minimisation : ∀I, ALG(I)/OPT(I) ≤ ρ ; maximisation : ∀I, OPT(I)/ALG(I) ≤ ρ." },
    { id: "ratio-exemple", q: "On observe ALG/OPT = 6/3, 12/8, 8/6 sur trois instances. Ratio ?", r: "On peut seulement dire ρ ≥ 2 : ρ doit majorer tous les rapports, et des exemples ne prouvent pas de majoration." },
    { id: "charge-makespan", q: "Charge Lᵢ, makespan, L* ?", r: "Lᵢ = Σ_{j∈J(i)} tⱼ ; makespan = charge maximum d'une machine (à minimiser) ; L* = makespan minimum sur toutes les affectations." },
    { id: "lemmes", q: "Les deux minorations de L* ?", r: "<code>L* ≥ max tᵢ</code> et <code>L* ≥ (Σ tᵢ)/m</code>." },
    { id: "conseil", q: "Conseil général du cours pour prouver un ratio d'approximation ?", r: "Montrer que la solution optimale ne peut pas être trop bonne : ici, minorer L*." },
    { id: "ls-algo", q: "Algorithme List Scheduling ?", r: "Considérer les tâches une par une dans un ordre quelconque ; affecter chacune à la machine la moins chargée. Marche aussi en online." },
    { id: "ls-preuve", q: "Preuve du ratio 2 de List Scheduling ?", r: "i machine la plus chargée, j sa dernière tâche : Lᵢ − tⱼ ≤ Lₖ pour tout k, donc Lᵢ − tⱼ ≤ (1/m)Σtᵢ ≤ L* ; et tⱼ ≤ L*. Donc Lᵢ ≤ L* + tⱼ ≤ 2L*." },
    { id: "ls-serre", q: "Exemple montrant que le ratio 2 de List Scheduling est atteint à la limite ?", r: "m machines, m(m − 1) tâches de durée 1 puis une de durée m en dernier : ALG = 2m − 1, OPT = m, rapport 2 − 1/m → 2." },
    { id: "lpt-algo", q: "Longest Processing ?", r: "List Scheduling avec les tâches par ordre décroissant de durée." },
    { id: "lpt-preuve", q: "Pourquoi Longest Processing a-t-il un ratio ≤ 3/2 ?", r: "Si n > m : une machine reçoit deux des m + 1 plus longues tâches, donc L* ≥ tₘ + tₘ₊₁ ≥ 2tₘ₊₁. Si la dernière tâche j de la machine la plus chargée vérifie j ≥ m + 1, tⱼ ≤ L*/2 et Lᵢ ≤ L* + tⱼ ≤ 3L*/2 ; si j ≤ m, l'algo est optimal." },
    { id: "lpt-43", q: "Meilleur ratio connu pour Longest Processing (cours) et exemple ?", r: "ρ ≤ 4/3, et c'est le mieux possible : m machines, 2m + 1 tâches (une de durée m, deux de chaque durée m + 1, …, 2m) ; LPT = 4m + 1, OPT = 3m + 2." },
    { id: "td2-pigeon", q: "TD2, L4 = (1, 7, 8, 7, 2, 8), 3 machines : pourquoi 14 est-il optimal ?", r: "4 tâches de durée ≥ 7 sur 3 machines : une machine en reçoit deux, donc makespan ≥ 14 ; et LPT atteint 14." },
    { id: "td2-ft", q: "TD2 : borne sur le makespan M de List Scheduling en fonction de t (dernière tâche de la machine la plus chargée) ?", r: "<code>M ≤ f(t) = t + (S − t)/m</code>, avec S la somme des durées ; f est croissante en t." },
    { id: "td2-profil", q: "TD2 ex. 2 : existe-t-il toujours une liste pour laquelle List Scheduling est optimal ?", r: "Oui : prendre une affectation A de profil minimum (ordre lexicographique, donc de makespan minimum) et construire la liste tâche par tâche, en donnant toujours une tâche de A à une machine de charge minimum qui n'a pas encore toutes ses tâches." },
    { id: "td2-listes", q: "Essayer toutes les listes en entrée de List Scheduling : efficace ?", r: "Non : n! listes. Mieux que la force brute O(mⁿ) seulement si m est de l'ordre de n." },
    { id: "kc-def", q: "k-centres : rayon de couverture ?", r: "<code>r(C) = max_{s∈S} d(s, C)</code> avec <code>d(s, C) = min_{c∈C} d(s, c)</code> ; on cherche au plus k centres minimisant r(C)." },
    { id: "kc-algo1", q: "k-centres, algorithme 1 (r connu) ?", r: "Tant que S′ ≠ ∅ : choisir s ∈ S′, l'ajouter à C, retirer de S′ les sites à ≤ 2r de s. Si |C| ≤ k retourner C (rayon ≤ 2r), sinon « rayon minimum > r ». O(n²)." },
    { id: "kc-preuve", q: "Pourquoi l'algorithme 1 termine-t-il avec |C| ≤ k si r est atteignable ?", r: "Chaque c ∈ C a un c* ∈ C* à distance ≤ r ; deux centres de C sont à > 2r, donc ne partagent pas le même c* : application injective, |C| ≤ |C*| ≤ k." },
    { id: "kc-algo2", q: "k-centres sans connaître r : algorithme et complexité ?", r: "k fois : choisir le site le plus éloigné des centres déjà choisis. 2-approximation ; O(kn) avec un tableau dist mis à jour." }
  ]
});
