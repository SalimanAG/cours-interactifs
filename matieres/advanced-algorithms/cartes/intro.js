/* Paquet de cartes : Introduction (cours 1). */
Paquets.enregistrer({
  matiere: "advanced-algorithms",
  id: "intro",
  titre: "Introduction",
  cartes: [
    { id: "objet", q: "De quoi parle le cours d'algorithmique avancée ?", r: "Techniques algorithmiques pour résoudre des problèmes difficiles (NP-difficiles), typiquement d'optimisation combinatoire : la meilleure solution (fonction objectif) parmi un grand nombre fini de solutions possibles." },
    { id: "techniques", q: "Les cinq techniques du cours et le type de solution de chacune ?", r: "Algorithmes polynomiaux : exacte. Probabilistes : souvent optimale. Branching : exacte. Programmation dynamique : exacte. Approximation : proche de l'optimal." },
    { id: "poly-expo", q: "Complexité polynomiale vs exponentielle : quelles instances ?", r: "Polynomiale : traite de grandes instances. Exponentielle : seulement de petites instances." },
    { id: "problemes", q: "Les problèmes d'optimisation cités dans les objectifs du cours ?", r: "Coupe minimum, équilibrage de charges, sac à dos, stable maximum, sélection de k centres, plus proche paire de points, plus longue sous-séquence croissante." },
    { id: "fibo-rec", q: "Fibonacci récursif : récurrence du temps et complexité ?", r: "<code>Tₙ = Tₙ₋₁ + Tₙ₋₂ + 1</code>. Polynôme caractéristique x² − x − 1, plus grande racine (1 + √5)/2, donc <code>Tₙ = Θ(((1+√5)/2)ⁿ)</code>, soit O(1.62ⁿ)." },
    { id: "fibo-pd", q: "Fibonacci par programmation dynamique : algorithme et complexité ?", r: "Tableau T, T[0] ← 0, T[1] ← 1, pour i de 2 à n : T[i] ← T[i−1] + T[i−2]. n − 1 passages en O(1) : <code>O(n)</code>." },
    { id: "fibo-matrice", q: "Quelle matrice pour Fibonacci, et quelle relation ?", r: "A = [[1, 1], [1, 0]] : (fibo(n), fibo(n−1)) = Aⁿ⁻¹ · (fibo(1), fibo(0)). fibo(n) est le coefficient en haut à gauche de Aⁿ⁻¹." },
    { id: "expo-rapide", q: "Principe et complexité de l'exponentiation rapide de aⁿ ?", r: "Écriture binaire n = Σ bᵢ 2ⁱ ; calcul des a^(2ⁱ) par a^(2ⁱ⁺¹) = a^(2ⁱ) · a^(2ⁱ) ; aⁿ = produit des a^(2ⁱ) avec bᵢ = 1. <code>O(log n)</code> multiplications." },
    { id: "comparaison", q: "Les trois complexités pour Fibonacci ?", r: "Récursif O(1.62ⁿ) ; programmation dynamique O(n) ; exponentiation rapide O(log n)." },
    { id: "reussir", q: "Comment réussir l'UE, selon le cours ?", r: "Apprendre les CM par cœur, finir le TP, savoir faire les TD." }
  ]
});
