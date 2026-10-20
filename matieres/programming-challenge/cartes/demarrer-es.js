/* Cartes : Démarrer, entrées / sorties (cours 0 et 1). */
Paquets.enregistrer({
  matiere: "programming-challenge",
  id: "demarrer-es",
  titre: "Entrées / sorties",
  cartes: [
    { id: "solution", q: "Qu'est-ce qu'une solution, selon le cours ?", r: "Un programme (n'importe quel langage) qui lit les cas sur l'<b>entrée standard</b>, les résout et écrit les résultats sur la <b>sortie standard</b> — sans thread, sans bibliothèque externe, sans fichier ni réseau." },
    { id: "repl", q: "Quel nom le cours donne-t-il au schéma lire / résoudre / écrire ?", r: "La boucle <i>Read-Eval-Print</i> (les étapes peuvent être imbriquées : lire un cas, l'afficher, lire le suivant)." },
    { id: "verdicts-courants", q: "Les trois verdicts courants du juge ?", r: "<b>AC</b> Accepted, <b>WA</b> Wrong Answer (mauvaise réponse sur au moins un test secret), <b>TLE</b> Time Limit Exceeded (trop lent sur au moins un test)." },
    { id: "verdicts-rares", q: "Les quatre verdicts « évitables » ?", r: "<b>CE</b> erreur de compilation (les warnings sont ignorés), <b>RE</b> erreur à l'exécution (segfault, exception flottante…), <b>MLE</b> trop de mémoire, <b>OLE</b> trop de sortie (souvent une boucle infinie qui affiche)." },
    { id: "score-acm", q: "Comment est classé une équipe au concours ACM ICPC ?", r: "Au nombre de problèmes résolus (en ~4 h) ; à égalité, au temps cumulé des soumissions correctes, avec pénalité pour chaque soumission incorrecte d'un problème finalement résolu. Équipes de 3, 1 ou 2 ordinateurs." },
    { id: "ascii", q: "ASCII : combien de caractères, et quelle propriété utile ?", r: "2^7 = 128 caractères sur un octet (bit de poids fort à 0). Lettres majuscules, minuscules et chiffres sont <b>consécutifs</b> : on peut boucler de 'a' à 'z' et calculer un rang par soustraction." },
    { id: "rang", q: "Rang de 'I' (en partant de 'A' = 0) et minuscule de 'C' ?", r: "<span class='mono'>ord('I') − ord('A') = 8</span> ; <span class='mono'>chr(ord('C') − ord('A') + ord('a')) = 'c'</span>." },
    { id: "tri-codes", q: "Trier « alphabétiquement » des chaînes, c'est trier selon quoi ?", r: "Selon les codes des caractères : toutes les majuscules (65-90) passent avant les minuscules (97-122). Un autre ordre demande une fonction de comparaison (en Python, une clé)." },
    { id: "fin-ligne", q: "Codes de fin de ligne, et le piège ?", r: "10 (nouvelle ligne) et 13 (retour chariot). Windows écrit 13 puis 10, Unix seulement 10 : penser à retirer le '\\r' en lisant." },
    { id: "unicode", q: "ASCII et Unicode ?", r: "Unicode utilise 2 ou 3 octets par symbole et couvre presque toutes les langues ; ASCII y est inclus. En C/C++, char = 8 bits ; en Java, char = 16 bits (Unicode)." },
    { id: "chaines", q: "Trois représentations d'une chaîne et leurs défauts ?", r: "<b>Terminée par un nul</b> (C) : ne peut pas contenir '\\0', longueur en O(n). <b>Tableau + longueur</b> : accès et test de bornes en O(1). <b>Liste chaînée</b> : insertion facile mais un pointeur par caractère (coûteux en mémoire), accès en O(i)." },
    { id: "io-bound", q: "Qu'est-ce qu'un programme « I/O bound » ?", r: "Un programme dont le temps est surtout passé à attendre les entrées/sorties. Le CPU attend les données (goulot de von Neumann : débit limité entre CPU et mémoire). D'où l'intérêt de lire l'entrée en un bloc." },
    { id: "hellokit", q: "HELLOKIT : ligne pour i (de |w| à 1) ?", r: "Les i dernières lettres de w, puis w répété n − 1 fois, puis les |w| − i premières lettres (le cours écrit « i − 1 » : coquille). En Python : <span class='mono'>w[len(w)-i:] + w*(n-1) + w[:len(w)-i]</span>." },
    { id: "lc-dim", q: "LC-Display : dimensions d'un chiffre de taille s ?", r: "s + 2 colonnes et 2s + 3 lignes ; une colonne blanche entre deux chiffres ; une ligne vide après chaque nombre. On produit la sortie ligne par ligne (boucle externe sur les lignes, interne sur les chiffres)." }
  ]
});
