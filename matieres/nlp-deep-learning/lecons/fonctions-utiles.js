/* Leçon 0.4 : Fonctions utiles — exp, ln, sigmoïde, tanh, softmax, argmax,
   entropie croisée (prérequis, hors diapos ; liens : IDF et PMI au cours 2,
   σ du neurone au cours 1, portes LSTM/GRU au cours 3, softmax de l'attention,
   Dense(softmax) et sparse categorical cross-entropy au TP 4).
   Fil rouge : le neurone de la leçon 0.1 (t = −0,5), puis un classifieur à 3 classes. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;

  var etapes = [
    {
      titre: "Exponentielle et logarithme",
      texte:
        "<p><span class='mono'>exp(x) = eˣ</span> (e ≈ 2,718) est toujours <b>positive</b> et croît très vite. Le <b>logarithme népérien</b> ln est sa réciproque : ln(eˣ) = x.</p>" +
        N.tableau(["propriété", "exemple"], [[m("ln(1) = 0"), "un rapport égal à 1 donne 0"], [m("ln(a·b) = ln a + ln b"), m("ln(6) = ln 2 + ln 3")], [m("ln(a/b) = ln a − ln b"), "négatif si a < b"], [m("ln x > 0 ⇔ x > 1"), m("ln(0,1) ≈ −2,30")]]) +
        "<p>Le cours 2 l'utilise pour l'IDF : <span class='mono'>idf(t) = ln((1 + N) / (1 + df(t))) + 1</span>.</p>",
      objectif: "Calculer ln(6/4), à 0,01 près.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "ln(1,5) ≈", attendu: Math.log(1.5), tolerance: 0.01, placeholder: "ex. 0,7", indice: "Utilise une calculatrice (touche ln) : ln(1,5).", bravo: "≈ 0,405. Avec le + 1 de la formule, c'est l'IDF 1,41 du terme « eats » (N = 5, df = 3) dans le cours 2.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "« log » dans le cours : quelle base ?",
      texte:
        "<p>Les diapos écrivent « log » sans préciser la base. En recalculant leurs exemples (IDF, TF log, PMI), les valeurs correspondent au <b>logarithme népérien</b> ln.</p>" +
        "<div class='signalement'>Base du logarithme non indiquée dans le cours : déduite des valeurs numériques des diapos (par exemple 1 + log(2) = 1,69, qui n'est vrai qu'avec ln).</div>",
      objectif: "Vérifier la base sur un exemple du cours.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "TF log du cours : 1 + log(count) avec count = 2 donne 1,69. Quelle base ?", options: ["ln (base e)", "log₁₀", "log₂"], bonne: 0, expliquer: ["1 + ln 2 = 1 + 0,693 = 1,69.", "1 + log₁₀ 2 = 1,30.", "1 + log₂ 2 = 2."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "La sigmoïde σ",
      texte:
        "<div class='formule'>σ(t) = 1 / (1 + e⁻ᵗ)</div>" +
        "<p>Elle écrase n'importe quel nombre dans l'intervalle <b>(0, 1)</b> : σ(0) = 0,5 ; très positif → proche de 1 ; très négatif → proche de 0. " +
        "C'est la fonction d'activation du neurone du cours 1 (ŷ = σ(t)) et celle des <b>portes</b> des LSTM et GRU (une proportion de 0 à 1).</p>",
      objectif: "Calculer la sortie du neurone de la leçon 0.1 : σ(−0,5).",
      installer: function (zone, api) {
        var c = N.cadre(zone), g = new Courbes(c, { largeur: 340, hauteur: 170 });
        g.dessiner({ xmin: -6, xmax: 6, ymax: 1, nomX: "t", fonctions: [{ label: "σ(t)", f: N.sigmoide }], marque: { x: -0.5, texte: "t = −0,5" } });
        Exercices.nombre(zone, { label: "σ(−0,5) ≈", attendu: N.sigmoide(-0.5), tolerance: 0.01, placeholder: "ex. 0,5", indice: "e^0,5 ≈ 1,649 ; 1 / (1 + 1,649).", bravo: "≈ 0,38 : un peu moins de 0,5, l'avis serait jugé plutôt négatif.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "La tangente hyperbolique tanh",
      texte:
        "<p><span class='mono'>tanh(t) = (eᵗ − e⁻ᵗ) / (eᵗ + e⁻ᵗ)</span> a la même forme en S que σ, mais à valeurs dans <b>(−1, 1)</b>, avec tanh(0) = 0. " +
        "Le cours 3 l'utilise pour le contenu candidat c̃ₜ du LSTM, pour hₜ = oₜ ⊙ tanh(cₜ) et pour le candidat h̃ₜ du GRU : des valeurs qui peuvent être négatives.</p>",
      objectif: "Distinguer σ et tanh.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "σ(0) = 0,5", vrai: true }, { texte: "tanh(0) = 0", vrai: true },
            { texte: "σ peut renvoyer −0,3", vrai: false, explication: "" }, { texte: "tanh peut renvoyer −0,3", vrai: true },
            { texte: "Une porte qui doit dire « quelle proportion garder » utilise naturellement σ", vrai: true }
          ],
          surReussite: function () { api.valider("σ → proportions (portes) ; tanh → contenus centrés sur 0."); }
        });
      }
    },
    {
      titre: "Softmax : des scores aux probabilités",
      texte:
        "<p>Pour choisir parmi K classes, un modèle produit K <b>scores</b> z₁…z_K (n'importe quels réels). La <b>softmax</b> les transforme en probabilités positives qui somment à 1 :</p>" +
        "<div class='formule'>softmax(z)ᵢ = e^zᵢ / Σⱼ e^zⱼ</div>" +
        "<p>Utilisée par la couche <span class='mono'>Dense(4, activation=\"softmax\")</span> du TP 4 et par les poids d'attention du cours 3. Scores d'un avis pour (positif, neutre, négatif) : z = (2 ; 1 ; 0).</p>",
      objectif: "Calculer la probabilité de « positif », à 0,01 près.",
      installer: function (zone, api) {
        var p = N.softmax([2, 1, 0]);
        Exercices.nombre(zone, { label: "softmax(z)₁ ≈", attendu: p[0], tolerance: 0.01, placeholder: "ex. 0,5", indice: "e² ≈ 7,389 ; e¹ ≈ 2,718 ; e⁰ = 1. Divise 7,389 par la somme.", bravo: "≈ 0,665. Les deux autres : 0,245 et 0,090 ; la somme vaut 1.", surReussite: function () { api.valider("Un écart de scores de 1 multiplie le rapport des probabilités par e ≈ 2,7."); } });
      }
    },
    {
      titre: "argmax : la classe prédite",
      texte:
        "<p>La classe prédite est l'indice de la plus grande probabilité : <span class='mono'>argmax</span>. Dans le TP 4 : <span class='mono'>probabilities.argmax(axis=1)</span> donne une classe par document (axis=1 : le long des colonnes, pour chaque ligne).</p>",
      objectif: "Lire la prédiction d'un lot.",
      installer: function (zone, api) {
        N.html(zone, N.code("probs = [[0.10, 0.70, 0.15, 0.05],\n         [0.40, 0.05, 0.05, 0.50]]\nprobs.argmax(axis=1)   # ?"));
        Exercices.choix(zone, { question: "Résultat (indices à partir de 0) ?", options: ["[1, 3]", "[0.70, 0.50]", "[1, 0]", "[2, 4]"], bonne: 0, expliquer: ["Exact : la position du maximum de chaque ligne.", "Non : argmax renvoie la position, pas la valeur (ce serait max).", "Non : dans la 2e ligne, 0,50 > 0,40.", "Non : les indices commencent à 0."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Entropie croisée",
      texte:
        "<p>Le cours cite l'<b>entropie croisée</b> comme perte de classification sans la définir (complément). Pour un exemple dont la vraie classe est k :</p>" +
        "<div class='formule'>ℓ = − ln(p_k)   (p_k : probabilité donnée à la vraie classe)</div>" +
        "<p>Si p_k → 1, ℓ → 0 ; si p_k est petite, ℓ est grande. Le TP 4 utilise <span class='mono'>sparse_categorical_crossentropy</span> : la même perte, quand les étiquettes sont des entiers (0, 1, 2, 3) au lieu de vecteurs one-hot.</p>",
      objectif: "Calculer la perte quand la vraie classe a reçu 0,665.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "−ln(0,665) ≈", attendu: -Math.log(0.665), tolerance: 0.01, placeholder: "ex. 1", bravo: "≈ 0,41. Si le modèle avait donné 0,09 à la vraie classe : −ln(0,09) ≈ 2,41.", surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "fonctions-utiles", etapes: etapes,
    fin: { texte: "<ul><li>ln : réciproque de exp ; ln 1 = 0 ; « log » du cours = ln.</li><li>σ → (0, 1), σ(0) = 0,5 : activations, portes.</li><li>tanh → (−1, 1), tanh(0) = 0 : contenus candidats.</li><li>softmax : scores → probabilités de somme 1 ; argmax : classe prédite.</li><li>Entropie croisée : −ln(probabilité de la vraie classe).</li></ul>", cartes: "prerequis" }
  });
})();
