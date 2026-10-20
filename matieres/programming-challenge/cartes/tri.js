/* Cartes : Tri (cours 4). */
Paquets.enregistrer({
  matiere: "programming-challenge",
  id: "tri",
  titre: "Tri",
  cartes: [
    { id: "algos", q: "Les tris cités par le cours ?", r: "Insertion, sélection, à bulles, fusion (merge sort), rapide (quicksort)." },
    { id: "insertion", q: "Principe et coût du tri par insertion ?", r: "On insère chaque élément à sa place dans le début déjà trié (en décalant, ou dans une liste chaînée). O(n²) au pire, O(n) si déjà trié." },
    { id: "fusion-principe", q: "Principe du tri fusion ?", r: "Couper en deux (le cours donne ⌊n/2⌋ éléments à gauche), trier chaque moitié récursivement, fusionner en comparant les têtes. O(n log n)." },
    { id: "fusion-cout", q: "Coût de la fusion de G et D ?", r: "O(|G| + |D|) : chaque élément est placé une fois." },
    { id: "inv-def", q: "Inversion d'un tableau A ?", r: "Une paire (i, j) avec i &lt; j et A[i] &gt; A[j]. 2 3 8 6 1 en a 5." },
    { id: "inv-max", q: "Nombre maximal d'inversions ? Conséquence ?", r: "n(n − 1)/2 (tableau trié à l'envers) ≈ 2 × 10^10 pour n = 200 000 : dépasse un int 32 bits." },
    { id: "inv-cle", q: "Inversions par tri fusion : l'idée clé ?", r: "Quand on prend un élément dans D, il passe devant les éléments <b>restant dans G</b> : on ajoute len(G) − i. Total = inversions de G + de D + celles comptées à la fusion." },
    { id: "inv-egal", q: "Pourquoi <span class='mono'>g[i] &lt;= d[j]</span> (et pas &lt;) dans la fusion qui compte les inversions ?", r: "Deux valeurs égales ne forment pas une inversion (A[i] &gt; A[j] strict) : on prend G d'abord pour ne pas les compter." },
    { id: "murder-fusion", q: "It's a Murder par tri fusion ?", r: "Quand on prend x dans D, on ajoute la somme des éléments de G déjà placés (tous &lt; x). À égalité, on prend D d'abord (strictement plus petits)." },
    { id: "yoda", q: "Yodaness Level : comment se ramener aux inversions ?", r: "Numéroter chaque mot par sa position dans la phrase normale, écrire la phrase de Yoda avec ces numéros, compter les inversions. « much to learn you still have » → 3 4 5 0 1 2 → 9." },
    { id: "candy-regle", q: "Candy Distribution : la règle d'appariement ?", r: "Trier les classes par taille croissante et les prix par ordre décroissant, puis Σ c × p : la plus grande classe reçoit le bonbon le moins cher." },
    { id: "candy-bornes", q: "Candy Distribution : taille maximale de la réponse ?", r: "N × c × p ≤ 10^5 × 10^5 × 10^5 = 10^15 : 64 bits." },
    { id: "candy-ex", q: "Candy : classes 10 80 37 22 109, prix 6 8 8 20 15 ?", r: "c ↑ 10 22 37 80 109, p ↓ 20 15 8 8 6 → 200 + 330 + 296 + 640 + 654 = 2120." }
  ]
});
