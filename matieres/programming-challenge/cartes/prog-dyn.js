/* Cartes : Programmation dynamique (cours 6). */
Paquets.enregistrer({
  matiere: "programming-challenge",
  id: "prog-dyn",
  titre: "Programmation dynamique",
  cartes: [
    { id: "def", q: "Programmation dynamique : définition du cours ?", r: "Technique qui évite de calculer plusieurs fois le même sous-problème d'un algorithme récursif : on résout les sous-problèmes du plus petit au plus grand, en réutilisant les réponses." },
    { id: "dag", q: "Lien avec les graphes ?", r: "Le DAG est implicite : sommets = sous-problèmes, arc A → B si B a besoin de la réponse de A (A plus petit)." },
    { id: "sac", q: "Énoncé du sac à dos ?", r: "Objets i (poids w_i, valeur v_i), capacité W : maximiser Σ v_i x_i sous Σ w_i x_i ≤ W." },
    { id: "variantes", q: "Avec répétition, sans répétition, subset sum ?", r: "x_i ∈ ℕ ; x_i ∈ {0, 1} ; v_i = w_i." },
    { id: "np", q: "Complexité du sac à dos ?", r: "Version décision (valeur ≥ V sans dépasser W ?) NP-complète (un des 21 problèmes de Karp) ; optimisation NP-difficile ; algorithme pseudo-polynomial par programmation dynamique." },
    { id: "v1", q: "Définition de V1(w) (avec répétition) ?", r: "Plus grande valeur quand le poids du sac est <b>égal</b> à w : V1(w) = max_i v_i + V1(w − w_i) si w &gt; 0 ; V1(0) = 0 ; −∞ si w &lt; 0." },
    { id: "v1-opt", q: "Valeur optimale avec V1 ?", r: "Le maximum de V1 sur [0, W] (le sac n'a pas besoin d'être plein). Ex. 1 du cours : 5." },
    { id: "v2", q: "Définition de V2(w) ?", r: "Plus grande valeur quand le poids est <b>≤ w</b> : V2(w) = max(V1(w), V2(w − 1)) si w ≥ 0 ; −∞ si w &lt; 0. Optimum = V2(W)." },
    { id: "v3", q: "Définition de V3(w, k) (sans répétition) ?", r: "Poids ≤ w, objets parmi 1..k : max(V3(w − w_k, k − 1) + v_k, V3(w, k − 1)) si w &gt; 0 et k &gt; 0 ; −∞ si w &lt; 0 ou k &lt; 0 ; 0 sinon." },
    { id: "v3-res", q: "Exercice 3 du cours : V3(17, 6) ?", r: "7 (par exemple objets 1, 2 et 6 : poids 16, valeur 3 + 2 + 2)." },
    { id: "cout", q: "Coût des tables V1 / V3 ?", r: "O(n × W) : W + 1 cases × n objets (V1), ou (n + 1)(W + 1) cases en O(1) (V3)." },
    { id: "pseudo", q: "Pourquoi « pseudo-polynomial » ?", r: "O(nW) est polynomial en la <i>valeur</i> W mais exponentiel en sa <i>taille</i> (W sur b bits peut valoir 2^b)." },
    { id: "ex2", q: "Erreur dans les diapos (exercice 2) ?", r: "La ligne V1 imprimée est identique à V2 ; d'après la définition, V1(1), V1(2), V1(4), V1(7) valent −∞ (poids 8, 5, 3). V2(15) = 6 reste juste." }
  ]
});
