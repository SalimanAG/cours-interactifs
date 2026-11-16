/* Leçon 4.1 : L'auto-attention — requêtes, clés, valeurs (cours 4, diapos 3 à 7, 16 à 19).
   Fil rouge : « big red dog » ; on construit la représentation de « dog ».
   Vecteurs à 2 dimensions choisis pour la leçon (déjà projetés par Q, K, V). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var TOK = ["big", "red", "dog"];
  var Kv = [[1, 0], [0, 1], [1, 1]], Vv = [[2, 0], [0, 2], [1, 1]], q = [1, 0];
  var E = Kv.map(function (k) { return q[0] * k[0] + q[1] * k[1]; });
  var A = N.softmax(E);
  var O = [0, 1].map(function (d) { return A.reduce(function (s, a, j) { return s + a * Vv[j][d]; }, 0); });
  var Es = E.map(function (e) { return e / Math.SQRT2; }), As = N.softmax(Es);
  function v(a) { return "(" + a.map(function (x) { return fmt(x, 2); }).join(" ; ") + ")"; }
  var TABLE = N.tableau(["token j", "clé kⱼ", "valeur vⱼ"], TOK.map(function (t, j) { return [t, m(v(Kv[j])), m(v(Vv[j]))]; }));

  var etapes = [
    {
      titre: "A-t-on encore besoin de la récurrence ?",
      texte:
        "<p>Cours 4, diapos 3-4 : l'attention est une façon de <b>faire passer de l'information d'une séquence vers un réseau</b> — exactement le rôle des RNN. Peut-on se débarrasser complètement du RNN ?</p>" +
        "<ul><li><b>Cross-attention</b> (cours 3) : le décodeur regarde l'entrée x pour générer yₜ.</li>" +
        "<li><b>Self-attention</b> (auto-attention) : pour générer yₜ, on regarde la séquence elle-même (y&lt;ₜ) ; chaque token construit sa représentation en regardant les autres tokens de la <b>même</b> séquence.</li></ul>",
      objectif: "Distinguer les deux attentions.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Cross-attention", "Self-attention"], items: [
          { texte: "Requêtes et clés viennent de la même séquence", bonne: 1 },
          { texte: "Le décodeur interroge les états de l'encodeur", bonne: 0 },
          { texte: "« dog » regarde « big » et « red » dans la même phrase", bonne: 1 },
          { texte: "Traduire en regardant la phrase source", bonne: 0 }
        ], surReussite: function () { api.valider("Le Transformer (2017) remplace la récurrence par de l'auto-attention : traitement en parallèle de toute l'entrée."); } });
      }
    },
    {
      titre: "Requête, clé, valeur : l'intuition",
      texte:
        "<p>Diapos 5-6 : on cherche un film. Ce qu'on veut (« une comédie de 2023 de 2 h ») est la <b>requête</b> ; chaque film offre une description (genre, date, durée) : la <b>clé</b> ; ce qu'on obtient au final, le film lui-même : la <b>valeur</b>.</p>" +
        "<p>Pour chaque token : <b>Query</b> — quelle information ce token cherche-t-il ? <b>Key</b> — quelle information chaque autre token peut-il offrir ? <b>Value</b> — quel contenu transmettre ? <b>Poids d'attention</b> — à quel point chaque token est-il pertinent pour le token courant ?</p>",
      objectif: "Associer chaque rôle.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Query", "Key", "Value", "Poids"], items: [
          { texte: "Ce que « dog » cherche dans la phrase", bonne: 0 },
          { texte: "Ce que « red » annonce pouvoir offrir", bonne: 1 },
          { texte: "Le contenu que « red » transmet s'il est jugé pertinent", bonne: 2 },
          { texte: "La pertinence de « red » pour « dog »", bonne: 3 }
        ], surReussite: function () { api.valider("Idée clé (diapo 6) : l'auto-attention apprend quelles parties de la séquence comptent pour comprendre chaque token."); } });
      }
    },
    {
      titre: "Trois projections du même vecteur",
      texte:
        "<p>Diapo 7 : soit w₁:ₙ une suite de mots ; chaque mot a un embedding xᵢ = E wᵢ, avec E ∈ ℝ^{d×|V|}. On transforme chaque embedding par trois matrices de poids <b>apprises</b> Q, K, V ∈ ℝ^{d×d} :</p>" +
        "<div class='formule'>qᵢ = Q xᵢ (requête)    kᵢ = K xᵢ (clé)    vᵢ = V xᵢ (valeur)</div>" +
        "<p>Diapo 18 : sans ces matrices (Y = softmax(XXᵀ)X), il n'y aurait <b>rien à apprendre</b>.</p>",
      objectif: "Prévoir une forme.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "d = 512. xᵢ a 512 coordonnées et Q ∈ ℝ^{512×512}. Combien de coordonnées a qᵢ ?", options: ["512", "1", "512 × 512", "n (longueur de la phrase)"], bonne: 0, expliquer: ["Exact : un vecteur requête par token, de même dimension.", "Non.", "Non : c'est la taille de Q.", "Non."], surReussite: function () { api.valider("Les trois vecteurs viennent du même token : d'où « keys, queries, values from the same sequence »."); } });
      }
    },
    {
      titre: "Les scores : produits scalaires requête–clés",
      texte:
        "<div class='formule'>eᵢⱼ = qᵢᵀ kⱼ</div>" +
        "<p>Diapo 7, étape 2 : la similarité entre la requête du token i et la clé de chaque token j (un produit scalaire). On construit la représentation de <b>dog</b>, de requête q = (1 ; 0).</p>" + TABLE,
      objectif: "Calculer les trois scores de « dog ».",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "e(dog, big) =", attendu: E[0], placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "e(dog, red) =", attendu: E[1], placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "e(dog, dog) =", attendu: E[2], placeholder: "ex. 1", surReussite: ok }); }
        ], "Scores (1 ; 0 ; 1) : « dog » trouve « big » et lui-même pertinents, « red » beaucoup moins (dans cet exemple inventé).");
      }
    },
    {
      titre: "Softmax : des scores aux poids",
      texte:
        "<div class='formule'>αᵢⱼ = exp(eᵢⱼ) / Σⱼ′ exp(eᵢⱼ′)</div>" +
        "<p>Diapo 17 : les poids sont positifs (αᵢₖ ≥ 0) et somment à 1 (Σₖ αᵢₖ = 1). Scores de « dog » : (1 ; 0 ; 1). Aide : e ≈ 2,72.</p>" +
        "<div class='signalement'>La diapo 17 écrit le poids avec une exponentielle au numérateur mais pas au dénominateur (Σ xⱼᵀxᵢ) : coquille ; la diapo 7 donne la forme correcte, avec exp en haut et en bas.</div>",
      objectif: "Calculer α(dog, red), à 0,01 près.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "α(dog, red) ≈", attendu: A[1], tolerance: 0.01, placeholder: "ex. 0,3", indice: "e⁰ / (e¹ + e⁰ + e¹) = 1 / (2 × 2,72 + 1).", bravo: "≈ 0,16 ; les deux autres valent ≈ 0,42 chacun.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "La sortie : une somme pondérée des valeurs",
      texte:
        "<div class='formule'>oᵢ = Σⱼ αᵢⱼ vⱼ</div>" +
        "<p>Diapo 7, étape 3. Poids de « dog » : (0,42 ; 0,16 ; 0,42).</p>" + TABLE,
      objectif: "Calculer o(dog).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "1re coordonnée ≈", attendu: O[0], tolerance: 0.02, placeholder: "ex. 1", indice: "0,42 × 2 + 0,16 × 0 + 0,42 × 1.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "2e coordonnée ≈", attendu: O[1], tolerance: 0.02, placeholder: "ex. 1", indice: "0,42 × 0 + 0,16 × 2 + 0,42 × 1.", surReussite: ok }); }
        ], "o(dog) ≈ (1,27 ; 0,73) : une représentation de « dog » qui contient maintenant de l'information de « big ». C'est une représentation contextuelle.");
      }
    },
    {
      titre: "Tout en une formule matricielle",
      texte:
        "<p>Diapo 19 : on empile les n tokens dans X (n × d). Q = XW_q, K = XW_k, V = XW_v, puis, pour toute la séquence d'un coup :</p>" +
        "<div class='formule'>Y = softmax( QKᵀ / √dₖ ) V</div>" +
        "<p>QKᵀ contient tous les scores (n × n) ; la softmax s'applique ligne par ligne. Le cours écrit d'abord softmax(QKᵀ)V puis ajoute la division par √dₖ. " +
        "Complément : cette division évite que les scores deviennent très grands quand dₖ grandit, ce qui écraserait la softmax sur un seul token.</p>",
      objectif: "Prévoir les formes et l'effet de √dₖ.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "n = 10 tokens, dₖ = 64. Forme de QKᵀ ?", options: ["(10, 10)", "(64, 64)", "(10, 64)"], bonne: 0, expliquer: ["Un score par paire de tokens.", "Non.", "Non : c'est la forme de Q."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Avec dₖ = 2, les scores de « dog » (1 ; 0 ; 1) deviennent (0,71 ; 0 ; 0,71) ; les poids passent de (0,42 ; 0,16 ; 0,42) à " + v(As) + ". La division par √dₖ…", options: ["adoucit la distribution des poids", "la rend plus tranchée", "ne change rien"], bonne: 0, expliquer: ["Exact.", "Non.", "Non."], surReussite: ok }); }
        ], "Une tête d'attention = ce calcul avec ses propres W_q, W_k, W_v (diapo 19).");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "auto-attention", etapes: etapes,
    fin: { texte: "<ul><li>Self-attention : chaque token regarde les tokens de la même séquence.</li><li>qᵢ = Qxᵢ, kᵢ = Kxᵢ, vᵢ = Vxᵢ (matrices apprises).</li><li>eᵢⱼ = qᵢᵀkⱼ ; αᵢⱼ = softmax ; oᵢ = Σ αᵢⱼ vⱼ.</li><li>Y = softmax(QKᵀ/√dₖ)V, QKᵀ de forme (n, n).</li></ul>", cartes: "transformers" }
  });
})();
