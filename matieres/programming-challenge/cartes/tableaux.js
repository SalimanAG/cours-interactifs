/* Cartes : Tableaux (cours 3). */
Paquets.enregistrer({
  matiere: "programming-challenge",
  id: "tableaux",
  titre: "Tableaux",
  cartes: [
    { id: "tableau", q: "Définition d'un tableau (cours 3) ?", r: "Une collection d'éléments de même type stockés à des emplacements mémoire <b>contigus</b> : accès au i-ème élément en O(1)." },
    { id: "questions", q: "Les questions « What problems can arise ? » à se poser avant de coder ?", r: "Que sait-on des données (bornes, ordre, égalités) ? Quelle taille peuvent-elles atteindre ? Les entiers sont-ils assez grands pour la solution ? Quel type de tableau pour la solution ?" },
    { id: "mb-pieges", q: "Making Book : les deux pièges de l'entrée ?", r: "A peut être &gt; B (test « 220 202 » : échanger) et A peut être égal à B (« 912 912 »). Les pages ont au plus 3 chiffres." },
    { id: "mb-brute", q: "Making Book : la force brute ?", r: "Un tableau c[0..9] ; pour chaque page de A à B, pour chaque chiffre d de la page, c[d] += 1. Au plus 999 × 3 opérations par cas." },
    { id: "mb-format", q: "Making Book : format exact d'une ligne de sortie ?", r: "<span class='mono'>Case 1: 0:1 1:7 2:1 3:1 4:1 5:1 6:0 7:0 8:0 9:0</span> (pages 10 à 15)." },
    { id: "mb-900", q: "Making Book : combien de 9 de 900 à 999 ? de 0 ?", r: "9 : 10 (unités) + 10 (dizaines) + 100 (centaines) = 120. 0 : 10 + 10 = 20." },
    { id: "echange", q: "Pourquoi <span class='mono'>temp = a ; b = a ; a = temp</span> est-il faux ?", r: "b est écrasé par a avant d'avoir été sauvé : les deux variables finissent égales à l'ancien a. Correct : <span class='mono'>a, b = b, a</span> (ou temp = a ; a = b ; b = temp)." },
    { id: "murder-def", q: "It's a Murder : que calcule-t-on ?", r: "Pour chaque nombre, la somme des nombres <b>précédents strictement plus petits</b> ; on additionne le tout. 1 5 3 6 4 → 0 + 1 + 1 + 9 + 4 = 15." },
    { id: "murder-bornes", q: "It's a Murder : coût de la force brute et type du résultat ?", r: "O(N²) avec N ≤ 10^5 → ≈ 5 × 10^9 : trop lent (d'où le tri fusion, cours 4). La somme peut dépasser 2^31 : 64 bits." },
    { id: "lcs-def", q: "Sous-séquence connexe ?", r: "Une suite de termes <b>consécutifs</b> (un facteur). Ex. « lusis » dans « lambdacalculusisfun »." },
    { id: "lcs-creux", q: "Longest Connected Subsequence : le tableau creux ?", r: "P = positions des 1, encadrées par s<sub>b</sub> = −1 et s<sub>e</sub> = n (bornes à choisir : le cours ne les fixe pas). 0101000001 → P = [−1, 1, 3, 9, 10]." },
    { id: "lcs-formule", q: "Longest Connected Subsequence : la formule ?", r: "Si m (nombre de uns) ≤ k : n. Sinon max sur i de P[i + k + 1] − P[i] − 1. Exemple k = 1 : max(3, 7, 6) = 7. O(n)." },
    { id: "lcs-bornes", q: "Longest Connected Subsequence : pourquoi pas la force brute ?", r: "n ≤ 500 000 : n²/2 ≈ 1,25 × 10^11 fenêtres → TLE." }
  ]
});
