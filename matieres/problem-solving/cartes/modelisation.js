/* Cartes : Modélisation (CSP). */
Paquets.enregistrer({
  matiere: "problem-solving",
  id: "modelisation",
  titre: "Modélisation",
  cartes: [
    { id: "vdc", q: "Les trois ingrédients d'un modèle (CSP) ?", r: "<span class='mono'>V = {v₁, …, vₙ}</span> les variables, <span class='mono'>D = {D₁, …, Dₙ}</span> les domaines, <span class='mono'>C = {C₁, …, Cₚ}</span> les contraintes." },
    { id: "questions", q: "Les deux questions à se poser pour trouver V et D ?", r: "« Quelles sont les inconnues ? » → les variables. « Quelles sont les valeurs possibles ? » → les domaines." },
    { id: "carte", q: "Coloriage de carte (7 régions, 3 couleurs) : V, D, C ?", r: "V = {v₁, …, v₇} (couleur de chaque région) ; D₁ = … = D₇ = {bleu, rose, vert} ; une contrainte vᵢ ≠ vⱼ pour chaque paire de régions voisines (10 dans le cours)." },
    { id: "smm-1", q: "SEND + MORE = MONEY, premier modèle : variables et domaines ?", r: "8 variables {s, e, n, d, m, o, r, y}. D<sub>s</sub> = D<sub>m</sub> = [1, 9] (premières lettres non nulles), les autres [0, 9]. Contraintes : l'addition complète en une seule équation + toutes les lettres différentes deux à deux." },
    { id: "smm-2", q: "SEND + MORE = MONEY, second modèle : qu'ajoute-t-il ?", r: "Les <b>retenues</b> r₁…r₄ ∈ {0, 1}, et une équation par colonne : d + e = y + 10·r₁, r₁ + n + r = e + 10·r₂, r₂ + e + o = n + 10·r₃, r₃ + s + m = o + 10·r₄, r₄ = m." },
    { id: "zebra", q: "Zebra : quel est le choix de modélisation du cours ?", r: "Une variable par attribut (chaque couleur, nationalité, animal, boisson, marque) dont la valeur est le <b>numéro de la maison</b> : ∀v ∈ V, D<sub>v</sub> = {1, 2, 3, 4, 5}. 25 variables." },
    { id: "reines", q: "n-reines : la formulation du cours (recherche locale) ?", r: "lᵢ = colonne de la reine de la ligne i. Contraintes : lᵢ ≠ lⱼ, lᵢ + i ≠ lⱼ + j (diagonale montante), lᵢ − i ≠ lⱼ − j (diagonale descendante)." },
    { id: "latin", q: "Carré latin d'ordre n : la définition ?", r: "Un carré n × n colorié avec n couleurs : toutes les cellules sont coloriées, chaque couleur apparaît exactement une fois sur chaque ligne et sur chaque colonne." },
    { id: "magique", q: "Carré magique : la définition ?", r: "Placer tous les nombres de 1 à n² dans un carré n × n de sorte que chaque ligne, chaque colonne et les deux diagonales aient la même somme (65 pour n = 5)." },
    { id: "espace", q: "Espace de recherche d'un CSP ? <i>(question d'examen)</i>", r: "Le nombre d'affectations possibles = <b>produit des tailles des domaines</b> |D₁| × … × |Dₙ|. Ex. carte : 3⁷ = 2 187. <i>Le cours ne le définit pas explicitement : c'est la lecture de ses exemples (2ⁿ interrupteurs, 9²·10⁶ feuilles pour SEND + MORE).</i>" },
    { id: "smm-feuilles", q: "Générer et tester sur SEND + MORE : combien de feuilles avec chaque modèle ?", r: "9² × 10⁶ = 81 000 000 avec le premier ; 2⁴ × 9² × 10⁶ = 1 296 000 000 avec le second (4 retenues binaires en plus)." },
    { id: "ordonnancement", q: "Modéliser des étapes de recette avec précédences ? <i>(annales)</i>", r: "Variable tₓ = date de début de l'étape x, domaine [0, H]. « a avant b » : t<sub>a</sub> + durée<sub>a</sub> ≤ t<sub>b</sub>. Fin = max(tₓ + durée<sub>x</sub>). <i>Corrigé proposé, absent des slides.</i>" }
  ]
});
