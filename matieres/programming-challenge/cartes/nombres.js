/* Cartes : Nombres (cours 2). */
Paquets.enregistrer({
  matiere: "programming-challenge",
  id: "nombres",
  titre: "Nombres",
  cartes: [
    { id: "2n", q: "Combien de valeurs sur n bits ? Ordres de grandeur de 2^32 et 2^64 ?", r: "2^n valeurs. 2^32 ≈ 4,29 × 10^9 ; 2^64 ≈ 1,84 × 10^19." },
    { id: "fact", q: "Plus grande factorielle sur 32 bits ? sur 64 bits (non signé) ?", r: "12! ≈ 4,8 × 10^8 (13! déborde) ; 20! ≈ 2,4 × 10^18 (21! ≈ 5,1 × 10^19 déborde)." },
    { id: "c2", q: "Formule du complément à deux sur n bits ?", r: "x = −b(n−1)·2^(n−1) + Σ(i < n−1) b(i)·2^i. Plage : −2^(n−1) à 2^(n−1) − 1." },
    { id: "c2-ex", q: "−5 sur 8 bits ? Et 12 − 5 ?", r: "−5 = 1111 1011. 12 − 5 = 0000 1100 + 1111 1011 = 0000 0111 = 7 (la retenue sortante est perdue)." },
    { id: "ieee", q: "IEEE 754 simple précision : formule et tailles ?", r: "x = (−1)^s × 1.m × 2^(e − bias) ; s : 1 bit, m (mantisse) : 23 bits, e (exposant) : 8 bits. Plage ≈ 1,18 × 10^−38 à 3,40 × 10^38." },
    { id: "bignum", q: "Comment sont stockés les grands nombres, et que coûtent-ils ?", r: "Dans des tableaux de chiffres de longueur variable. Plus de débordement simple, résultats identiques sur toutes les machines, mais performances réduites." },
    { id: "bignum-lang", q: "Quels langages ont des grands nombres intégrés ?", r: "Lisp, Python, Perl, Haskell, Ruby. C, C++ et Java passent par des bibliothèques (ex. BigInteger en Java)." },
    { id: "gilnum-algo", q: "GILNUM sans grands nombres : l'algorithme ?", r: "Addition posée de droite à gauche : chiffre de a + chiffre de b + retenue ; on écrit x mod 10, retenue = x div 10 ; on continue tant qu'il reste des chiffres ou une retenue. O(longueur)." },
    { id: "gilnum-valide", q: "GILNUM : quand afficher « ? » ?", r: "Si l'une des deux chaînes de la paire est vide ou contient un caractère qui n'est pas un chiffre 0-9." },
    { id: "gilnum-lecture", q: "GILNUM : pourquoi ne pas lire avec <span class='mono'>sys.stdin.read().split()</span> ?", r: "split() sans argument supprime les lignes vides : les paires (lignes 2i−1, 2i) seraient décalées. Il faut découper sur '\\n'." },
    { id: "gilnum-zeros", q: "GILNUM : sortie de <span class='mono'>00930261 + 4</span> ? de <span class='mono'>0000 + 0</span> ?", r: "930265 (zéros non significatifs retirés) ; 0 (on garde au moins un chiffre — cas non précisé par l'énoncé)." },
    { id: "mirror", q: "MIRROR : que fait l'effet miroir sur n bits ?", r: "Inverse l'ordre des n bits de poids faible (b(n−1)…b0 → b0…b(n−1)) sans toucher aux autres ; si n ∉ [2, 32], x n'est pas modifié. Ex. 0x701 3 → 0x704." },
    { id: "mirror-masque", q: "Comment isoler les n bits de poids faible de x ?", r: "<span class='mono'>x & ((1 &lt;&lt; n) − 1)</span>. Et la partie haute : <span class='mono'>x &gt;&gt; n &lt;&lt; n</span>." }
  ]
});
