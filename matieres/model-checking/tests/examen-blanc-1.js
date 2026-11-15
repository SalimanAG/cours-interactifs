/* Examen blanc 1 : structures de Kripke, sémantique de CTL*, CTL / LTL, réécriture, labelling, le four.
   Modèles : le système s0, s1, s2 (exercices du 13 octobre) et le four (slide 25). Réponses recalculées par l'algorithme. */
(function () {
  "use strict";
  /* Les bonnes réponses sont écrites en premier ci-dessous ; l'ordre affiché est mélangé (de façon stable). */
  function melanger(t) {
    t.questions.forEach(function (q) {
      var h = 0, i, n = q.options.length, idx = [];
      for (i = 0; i < q.id.length + q.enonce.length; i++) h = (h * 31 + (q.id + q.enonce).charCodeAt(i)) >>> 0;
      for (i = 0; i < n; i++) idx.push(i);
      for (i = n - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; var j = (h >>> 16) % (i + 1), x = idx[i]; idx[i] = idx[j]; idx[j] = x; }
      q.options = idx.map(function (k) { return q.options[k]; });
      q.bonnes = q.bonnes.map(function (b) { return idx.indexOf(b); }).sort();
    });
    return t;
  }
  Tests.enregistrer(melanger({
  matiere: "model-checking", id: "examen-blanc-1", titre: "Examen blanc 1 : Kripke, CTL, labelling",
  notions: {
    kripke: { titre: "Structures de Kripke", lecon: "kripke-chemins" },
    semantique: { titre: "X, F, G, U sur un chemin", lecon: "operateurs-chemin" },
    quantif: { titre: "A, E ; CTL et LTL", lecon: "quantificateurs" },
    reecriture: { titre: "Réécrire dans la base", lecon: "reecrire-base" },
    labelling: { titre: "Labelling : p, ¬, ∨, EX, EU", lecon: "labelling-ex-eu" },
    eg: { titre: "Labelling : EG et SCC", lecon: "labelling-eg" },
    four: { titre: "Le four", lecon: "four" }
  },
  questions: [
    { id: "q1", notion: "kripke", enonce: "Dans M = (S, S₀, R, L), L est…", options: ["une fonction S → 2<sup>AP</sup>", "une relation incluse dans S × S", "l'ensemble des états initiaux", "l'ensemble des propositions atomiques"], bonnes: [0], explication: "L(s) est l'ensemble des propositions atomiques vraies dans s." },
    { id: "q2", notion: "kripke", enonce: "Pourquoi la relation R doit-elle être totale ?", options: ["pour que chaque état ait un successeur, donc que tout chemin puisse être prolongé à l'infini", "pour que le graphe soit connexe", "pour qu'il n'y ait qu'un seul état initial"], bonnes: [0], explication: "Totale : pour tout s, il existe s′ tel que R(s, s′)." },
    { id: "q3", notion: "semantique", enonce: "Système s0, s1, s2 (L(s0) = {p, r}, L(s1) = {q, r}, L(s2) = {p, q}). Sur π = s0 s2 s0 s1 s1 s1 …, lesquelles sont vraies ?", options: ["G(p ∨ q)", "X G q", "F G(q ∧ r)", "p U q"], bonnes: [0, 2, 3], explication: "X G q est fausse : π¹ = s2 s0 s1 … passe par s0 où q est fausse. p U q : p en s0, puis q en s2." },
    { id: "q4", notion: "semantique", enonce: "M, π ⊨ g₁ U g₂ exige…", options: ["que g₂ soit vraie un jour, et g₁ à chaque position avant", "que g₁ soit vraie pour toujours si g₂ n'arrive pas", "que g₁ soit vraie au moins à la première position"], bonnes: [0], explication: "Si g₂ est vraie tout de suite (k = 0), rien n'est exigé de g₁." },
    { id: "q5", notion: "quantif", enonce: "Laquelle est une formule CTL ?", options: ["AGEF p", "AFG p", "A(F p ∨ G q)", "EGF p"], bonnes: [0], explication: "En CTL, chaque X, F, G, U est immédiatement précédé de A ou E." },
    { id: "q6", notion: "quantif", enonce: "Laquelle est une formule LTL ?", options: ["AFG p", "AGEF p", "EF p", "AX EX p"], bonnes: [0], explication: "LTL : A f où f ne contient aucun quantificateur de chemin." },
    { id: "q7", notion: "quantif", enonce: "Système s0, s1, s2 (s0 → s1, s0 → s2, s2 → s0, s2 → s1, s1 → s1). S(AX q) = ?", options: ["{s0, s1}", "{s0, s1, s2}", "{s1}", "{s2}"], bonnes: [0], explication: "s2 a un successeur, s0, où q est fausse." },
    { id: "q8", notion: "reecriture", enonce: "AF f ≡ ?", options: ["¬EG¬f", "¬EF¬f", "EG¬f", "¬AG¬f"], bonnes: [0], explication: "Pas de chemin où f n'arrive jamais. (¬EF¬f, c'est AG f ; ¬AG¬f, c'est EF f.)" },
    { id: "q9", notion: "reecriture", enonce: "AG(p → EX q) dans la base :", options: ["¬E(true U (p ∧ ¬EX q))", "¬E(true U (p ∧ EX¬q))", "E(true U (¬p ∨ EX q))", "¬EG(p ∧ ¬EX q)"], bonnes: [0], explication: "AG f ≡ ¬E(true U ¬f), puis ¬(p → EX q) ≡ p ∧ ¬EX q. Attention : ¬EX q (aucun successeur avec q) ≠ EX¬q (un successeur sans q)." },
    { id: "q10", notion: "labelling", enonce: "Système s0, s1, s2. S(EX¬p) = ?", options: ["{s0, s1, s2}", "{s1}", "{s0, s2}", "∅"], bonnes: [0], explication: "S(¬p) = {s1}, et ses prédécesseurs sont s0, s1 (boucle) et s2." },
    { id: "q11", notion: "labelling", enonce: "Système s0, s1, s2. S(E(q U ¬r)) = ?", options: ["{s2}", "{s0, s2}", "{s1, s2}", "{s0, s1, s2}"], bonnes: [0], explication: "On part de S(¬r) = {s2}. Son seul prédécesseur, s0, n'a pas q : rien à ajouter." },
    { id: "q12", notion: "labelling", enonce: "Pour étiqueter EX g, l'algorithme…", options: ["construit R⁻¹ et étiquette les prédécesseurs des états g", "étiquette les successeurs des états g", "calcule les SCC du graphe restreint à g"], bonnes: [0], explication: "Les SCC, c'est pour EG." },
    { id: "q13", notion: "eg", enonce: "Une SCC formée d'un seul état sans boucle sur lui-même est…", options: ["triviale", "non triviale", "équitable"], bonnes: [0], explication: "Non triviale : plus d'un nœud, ou un nœud avec une auto-boucle." },
    { id: "q14", notion: "eg", enonce: "Système s0, s1, s2. S(EG q) = ?", options: ["{s1, s2}", "{s1}", "{s0, s1, s2}", "∅"], bonnes: [0], explication: "Restreint à {s1, s2} : s2 → s1 et la boucle s1 → s1. SCC non triviale {s1}, que s2 atteint." },
    { id: "q15", notion: "four", enonce: "Le four. S(EG¬Heat) = {1, 2, 3, 5}. Alors S(AF Heat) = ?", options: ["{4, 6, 7}", "{4, 7}", "∅", "{1, …, 7}"], bonnes: [0], explication: "AF Heat ≡ ¬EG¬Heat : le complémentaire." },
    { id: "q16", notion: "four", enonce: "Le four. AG(Error → AF ¬Error) est-elle vraie dans l'état 1 ?", options: ["non : depuis 2, le chemin 2 → 5 → 2 → 5 … reste en Error pour toujours", "oui : reset efface toujours l'erreur", "oui, car l'état 1 n'a pas Error"], bonnes: [0], explication: "Un seul chemin suffit à rendre AF ¬Error fausse dans 2, et 2 est atteignable depuis 1." },
    { id: "q17", notion: "labelling", enonce: "Model checking de LTL :", options: ["PSPACE-complet", "linéaire en le nombre d'états et d'arcs", "indécidable"], bonnes: [0], explication: "C'est CTL qui est linéaire (slide 19)." },
    { id: "q18", notion: "kripke", enonce: "Un modèle Biocham booléen a 8 objets. Combien d'états a sa structure de Kripke ?", options: ["2⁸ = 256", "8", "8² = 64", "8! = 40 320"], bonnes: [0], explication: "Un état = un tuple de booléens (présence ou absence de chaque objet)." }
  ]
}));
})();
