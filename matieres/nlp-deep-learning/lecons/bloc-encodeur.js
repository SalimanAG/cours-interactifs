/* Leçon 4.3 : Le bloc encodeur (cours 4, diapos 8 à 10, 14 à 15, 24 à 29, 32 à 34).
   Fil rouge : « The big red dog » qui traverse un bloc encodeur. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var X = [2, 4, 6, 8], MU = 5, SIG = Math.sqrt(5);

  var etapes = [
    {
      titre: "L'architecture globale",
      texte:
        "<p>Diapos 8-9 : introduit en 2017, le Transformer est un <b>encodeur–décodeur</b> qui traite l'entrée <b>en parallèle</b>. L'<b>encodeur</b> lit et encode globalement l'entrée ; le <b>décodeur</b> génère la sortie (« Welcome to sequence 12. » → « Bienvenue à la séquence 12. »).</p>" +
        "<p>Diapo 10, côté entrée : 1. mot → tokens ; 2. tokens → indices dans le vocabulaire ; 3. embedding + encodage positionnel.</p>",
      objectif: "Remettre dans l'ordre le trajet dans un bloc encodeur.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, { items: ["embeddings d'entrée", "+ encodage positionnel", "multi-head attention", "Add & Norm", "feed forward", "Add & Norm"], separateur: "→", surReussite: function () { api.valider("Ce bloc est répété N fois (« N× » sur le schéma)."); } });
      }
    },
    {
      titre: "Connexions résiduelles",
      texte:
        "<p>Diapo 33 [He et al., 2016] : au lieu de X⁽ⁱ⁾ = Layer(X⁽ⁱ⁻¹⁾), on écrit</p>" +
        "<div class='formule'>X⁽ⁱ⁾ = X⁽ⁱ⁻¹⁾ + Layer(X⁽ⁱ⁻¹⁾)</div>" +
        "<p>La couche n'a plus qu'à apprendre « le résidu » ; le gradient traverse très bien la connexion résiduelle (sa dérivée vaut 1) ; biais vers la fonction identité ; paysage de perte plus lisse.</p>",
      objectif: "Calculer une sortie résiduelle.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "X⁽ⁱ⁻¹⁾ = 0,8 et Layer(X⁽ⁱ⁻¹⁾) = −0,1 → X⁽ⁱ⁾ =", attendu: 0.7, tolerance: 0.001, placeholder: "ex. 1", bravo: "0,7. Si la couche n'apprend rien d'utile (sortie 0), l'entrée passe telle quelle.", surReussite: function () { api.valider("Diapo 24 : résiduel et normalisation améliorent l'efficacité de l'entraînement : Z = LayerNorm(Y + X)."); } });
      }
    },
    {
      titre: "La normalisation de couche (LayerNorm)",
      texte:
        "<p>Diapo 34 [Ba et al., 2016] : réduire la variation non informative en normalisant chaque vecteur à moyenne 0 et écart-type 1 <b>au sein de chaque couche</b>. Pour un vecteur x ∈ ℝᵈ :</p>" +
        "<div class='formule'>μ = (1/d) Σⱼ xⱼ      σ = √((1/d) Σⱼ (xⱼ − μ)²)      sortie = (x − μ)/(σ + ε) · γ + β</div>" +
        "<p>γ et β : gain et biais appris (facultatifs). On prend x = (2 ; 4 ; 6 ; 8), γ = 1, β = 0, ε ≈ 0.</p>" +
        "<div class='signalement'>La diapo 34 écrit √σ + ε au dénominateur alors qu'elle définit σ comme l'écart-type : on divise en fait par l'écart-type (forme usuelle : √(σ² + ε)). La diapo écrit aussi μ = Σ xⱼ sans le 1/d : coquille.</div>",
      objectif: "Calculer μ, σ, puis la 1re coordonnée normalisée.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "μ =", attendu: MU, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "σ ≈", attendu: SIG, tolerance: 0.01, placeholder: "ex. 1", indice: "√((9 + 1 + 1 + 9) / 4).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "1re coordonnée ≈", attendu: (2 - MU) / SIG, tolerance: 0.01, placeholder: "ex. 1", surReussite: ok }); }
        ], "Résultat ≈ (−1,34 ; −0,45 ; 0,45 ; 1,34) : moyenne 0, écart-type 1, à l'intérieur de chaque vecteur (pas sur le lot).");
      }
    },
    {
      titre: "Le feed-forward, appliqué à chaque vecteur",
      texte:
        "<p>Diapos 26-27 : un réseau feed-forward simple (MLP avec ReLU), <b>appliqué à chaque vecteur séparément</b>, pour faciliter l'interopérabilité avec l'encodeur ou le décodeur suivant. Diapo 24 : une tête d'attention ne calcule que des <b>combinaisons linéaires des lignes de X</b> → expressivité limitée → post-traitement par un MLP qui <b>introduit des non-linéarités</b>.</p>",
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Le feed-forward mélange l'information entre les tokens.", vrai: false, explication: "" },
          { texte: "Le même MLP est appliqué à « The », « big », « red » et « dog ».", vrai: true },
          { texte: "Sans MLP, la sortie d'une tête serait une combinaison linéaire des valeurs.", vrai: true },
          { texte: "Le mélange entre tokens se fait dans l'attention.", vrai: true }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Résumé d'une couche Transformer",
      texte:
        "<p>Diapo 28 :</p>" +
        "<div class='formule'>Yⁱ = softmax(QⁱKⁱᵀ/√dₖ)Vⁱ<br>Y = Concat[Y¹…Yʰ]Wᴼ<br>Z = LayerNorm(Y + X)<br>X̃ = LayerNorm(MLP(Z) + Z)</div>" +
        "<p>X, Y, Z, X̃ ont tous la forme (n × d). Les couches sont empilées, <b>sans partage de poids</b> entre elles.</p>",
      objectif: "Vérifier les formes et le partage de poids.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "n = 4 tokens, d = 512. Forme de X̃ en sortie de couche ?", options: ["(4, 512)", "(4, 4)", "(512, 512)"], bonne: 0, expliquer: ["La forme est conservée : on peut empiler les couches.", "Non : c'est la forme des scores d'attention.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Les 6 couches d'un encodeur…", options: ["ont chacune leurs propres poids", "partagent les mêmes poids", "partagent les poids avec le décodeur"], bonne: 0, expliquer: ["« No weight sharing » (diapo 28). Différence avec un RNN, dont les poids sont partagés dans le temps.", "Non.", "Non."], surReussite: ok }); }
        ], "Diapo 14 : l'encodeur capture les relations entre tokens (auto-attention), introduit des non-linéarités (MLP) et utilise des astuces (résiduel, normalisation).");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "bloc-encodeur", etapes: etapes,
    fin: { texte: "<ul><li>Embedding + PE → multi-head attention → Add & Norm → feed-forward → Add & Norm, répété N fois.</li><li>Résiduel X⁽ⁱ⁾ = X⁽ⁱ⁻¹⁾ + Layer(X⁽ⁱ⁻¹⁾).</li><li>LayerNorm : (x − μ)/σ · γ + β, par vecteur.</li><li>MLP par vecteur : non-linéarité.</li><li>Formes (n, d) conservées, pas de partage de poids entre couches.</li></ul>", cartes: "transformers" }
  });
})();
