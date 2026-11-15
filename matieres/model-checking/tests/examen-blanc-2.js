/* Examen blanc 2 : écrire des propriétés, CTL / LTL, exclusion mutuelle, équité.
   Réponses de calcul recalculées par l'algorithme (logique-temporelle.js). */
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
    matiere: "model-checking", id: "examen-blanc-2", titre: "Examen blanc 2 : propriétés, CTL/LTL, exclusion mutuelle, équité",
    notions: {
      proprietes: { titre: "Écrire des propriétés", lecon: "questions-formules" },
      ctlltl: { titre: "CTL, LTL, CTL*", lecon: "ctl-ltl" },
      mutex: { titre: "Exclusion mutuelle", lecon: "exclusion-mutuelle" },
      equite: { titre: "Équité : définitions", lecon: "equite" },
      equitecalc: { titre: "Équité : calculs", lecon: "sans-avec-equite" }
    },
    questions: [
      { id: "q1", notion: "proprietes", enonce: "« Est-il possible de synthétiser P sans utiliser la protéine Q ? »", options: ["E(¬Q U P)", "EF(P ∧ ¬Q)", "E(P U ¬Q)", "AG(Q → ¬P)"], bonnes: [0], explication: "Un chemin ¬Q, ¬Q, …, P." },
      { id: "q2", notion: "proprietes", enonce: "« L'état s est-il stable ? »", options: ["s ⇒ AG(s)", "s ⇒ EG(s)", "AG(s)", "s ⇒ AF(s)"], bonnes: [0], explication: "Stable : sur tous les chemins on reste en s. EG : stationnaire (steady)." },
      { id: "q3", notion: "proprietes", enonce: "« P peut-il osciller de façon cyclique ? »", options: ["EG((P ⇒ EF¬P) ∧ (¬P ⇒ EF P))", "EG((P ⇒ EG¬P) ∧ (¬P ⇒ EG P))", "EG(P ⇒ EF¬P)", "AF P ∧ AF¬P"], bonnes: [0], explication: "Les deux sens, une possibilité de changer (EF), tout le temps (EG)." },
      { id: "q4", notion: "proprietes", enonce: "« Atteindre s₂ après être passée par s₁ » :", options: ["EF(s₁ ∧ EF s₂)", "EF s₁ ∧ EF s₂", "E(s₁ U s₂)"], bonnes: [0], explication: "EF s₁ ∧ EF s₂ n'impose pas l'ordre ; E(s₁ U s₂) impose s₁ à chaque pas avant s₂." },
      { id: "q5", notion: "proprietes", enonce: "« L'activation de A est-elle nécessaire pour produire B ? »", options: ["¬E(¬A U B)", "E(¬A U B)", "AF A", "EF(A ∧ B)"], bonnes: [0], explication: "Aucun chemin ne produit B sans A (cascade MAPK, slide 16)." },
      { id: "q6", notion: "proprietes", enonce: "« La cellule peut-elle toujours produire P ? »", options: ["AGEF P", "AG P", "EF P", "EGEF P"], bonnes: [0], explication: "Slide 17." },
      { id: "q7", notion: "ctlltl", enonce: "Laquelle est une formule LTL qui n'est pas CTL ?", options: ["AFG p", "AGEF p", "AG p", "EGF p"], bonnes: [0], explication: "AG p est les deux ; EGF p n'est ni l'un ni l'autre." },
      { id: "q8", notion: "ctlltl", enonce: "Lesquelles sont des formules CTL ?", options: ["AGEF p", "AXEF p", "AG p", "AFG p"], bonnes: [0, 1, 2], explication: "AFG p : F et G se suivent sans quantificateur." },
      { id: "q9", notion: "ctlltl", enonce: "Pourquoi AGEF p n'est-elle pas exprimable en LTL ?", options: ["une formule LTL regarde les chemins un par un ; « il est toujours possible d'atteindre p » dépend des branches", "parce que LTL n'a pas d'opérateur F", "parce que le model checking de LTL est PSPACE-complet"], bonnes: [0], explication: "Preuve par M et M′ : le chemin s s s … est dans les deux modèles." },
      { id: "q10", notion: "mutex", enonce: "Exclusion mutuelle : turn n'est pas initialisé. Les états initiaux sont…", options: ["(0, ⊥, ⊥) et (1, ⊥, ⊥)", "(0, ℓ₀, ℓ₁) seulement", "(0, ⊥, ⊥) seulement"], bonnes: [0], explication: "Un état initial par valeur possible de la variable non initialisée." },
      { id: "q11", notion: "mutex", enonce: "Depuis (1, NC₀, ℓ₁), si P0 avance :", options: ["on reste en (1, NC₀, ℓ₁) (wait bloqué : boucle)", "(1, CR₀, ℓ₁)", "(0, CR₀, ℓ₁)"], bonnes: [0], explication: "turn = 1 : P0 attend." },
      { id: "q12", notion: "mutex", enonce: "Résultat du labelling de g ≡ ¬EF(CR₀ ∧ CR₁) :", options: ["les 14 états", "aucun état", "seulement les états initiaux"], bonnes: [0], explication: "S(CR₀ ∧ CR₁) = ∅, donc S(EF …) = ∅, donc S(g) = tout." },
      { id: "q13", notion: "equite", enonce: "Un chemin π est équitable pour F = {P₁, …, Pₖ} si…", options: ["pour chaque Pᵢ, inf(π) ∩ Pᵢ ≠ ∅", "π passe au moins une fois par chaque Pᵢ", "inf(π) touche au moins un des Pᵢ"], bonnes: [0], explication: "Une infinité de fois, et pour chaque Pᵢ." },
      { id: "q14", notion: "equite", enonce: "Avec équité, M, s ⊨_F EX f₁ se vérifie par :", options: ["M, s ⊨ EX(f₁ ∧ fair)", "M, s ⊨ EX f₁ ∧ fair", "M, s ⊨ EX f₁"], bonnes: [0], explication: "fair va à l'intérieur." },
      { id: "q15", notion: "equite", enonce: "La proposition fair se calcule comme…", options: ["EG true, avec la procédure équitable", "AG true", "EF true, avec la procédure classique"], bonnes: [0], explication: "Un chemin équitable part de s ⟺ EG true au sens équitable." },
      { id: "q16", notion: "equitecalc", enonce: "s0 ⇄ s1 ⇄ s2, F = {{s0}, {s2}}, S(p) = {s1, s2}. S_F(EG p) = ?", options: ["∅", "{s1, s2}", "{s2}", "{s0, s1, s2}"], bonnes: [0], explication: "La SCC {s1, s2} ne contient pas s0 : NOT FAIR." },
      { id: "q17", notion: "equitecalc", enonce: "Le four avec F = {{6, 7}} : S_F(AG(Start → AF Heat)) = ?", options: ["{1, …, 7}", "∅", "{4, 6, 7}"], bonnes: [0], explication: "La SCC {1, 2, 3, 5} de ¬Heat n'est pas équitable : S_F(EG¬Heat) = ∅, puis négation." },
      { id: "q18", notion: "equitecalc", enonce: "Même système s0 ⇄ s1 ⇄ s2, F = {{s0}, {s2}}, L(s0) = {q, r}, L(s1) = {p, q}, L(s2) = {p, r}. S_F(EX(p ∧ q)) = ?", options: ["{s0, s2}", "{s1}", "∅", "{s0, s1, s2}"], bonnes: [0], explication: "Tous les états sont fair (une seule SCC qui touche s0 et s2) ; les prédécesseurs de s1 sont s0 et s2." }
    ]
  }));
})();
