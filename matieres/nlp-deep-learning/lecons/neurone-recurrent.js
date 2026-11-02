/* Leçon 3.1 : Le neurone récurrent, déroulé (cours 3, diapos 3 à 18 ; TP 4 : clipnorm).
   Fil rouge : un neurone récurrent scalaire (wx = 0,5 ; wy = 0,8 ; b = 0 ; activation tanh)
   qui lit la séquence x = (1, 0, 2). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var WX = 0.5, WY = 0.8;
  var X = [1, 0, 2], Y = [];
  (function () { var y = 0; X.forEach(function (x) { y = Math.tanh(WX * x + WY * y); Y.push(y); }); })();

  var etapes = [
    {
      titre: "Pourquoi l'ordre et le contexte comptent",
      texte:
        "<p>Cours 3, diapos 3 à 5. « The dog bites the man » / « The man bites the dog » : mêmes comptes de mots, rôles différents. " +
        "« The film seemed promising, but it was disappointing » : « it » renvoie à « the film » ; « but » renverse le jugement.</p>",
      objectif: "Associer chaque représentation à sa limite.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Ordre perdu", "Contexte local seulement", "Contexte lointain exclu"], items: [
          { texte: "Sac de mots / TF-IDF", bonne: 0 },
          { texte: "n-grammes de mots", bonne: 1, explication: "Ordre local ; des n plus grands donnent des caractéristiques plus creuses." },
          { texte: "Réseau neuronal à fenêtre fixe", bonne: 2, explication: "Agrandir la fenêtre agrandit l'entrée." }
        ], surReussite: function () { api.valider("Objectif du cours : représenter des entrées ordonnées avec un état partagé dans le temps."); } });
      }
    },
    {
      titre: "Du neurone classique au neurone récurrent",
      texte:
        "<p>Neurone classique : <span class='mono'>y = σ(Wₓᵀ · X + b)</span>. Neurone <b>récurrent</b> (diapos 8-9) : sa sortie précédente revient en entrée :</p>" +
        "<div class='formule'>y₍ₜ₎ = σ(Wₓᵀ · X₍ₜ₎ + w_y · y₍ₜ₋₁₎ + b)</div>" +
        "<p>w_y, b et y sont des scalaires, Wₓ un vecteur. Fil rouge : entrée scalaire, wₓ = 0,5, w_y = 0,8, b = 0, σ = tanh, y₍₀₎ = 0. Séquence x = (1, 0, 2).</p>",
      objectif: "Calculer y₍₁₎ puis y₍₂₎.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "y₍₁₎ = tanh(0,5 × 1 + 0,8 × 0) ≈", attendu: Y[0], tolerance: 0.01, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "y₍₂₎ = tanh(0,5 × 0 + 0,8 × y₍₁₎) ≈", attendu: Y[1], tolerance: 0.01, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "y₍₂₎ ≈ 0,35 alors que x₍₂₎ = 0 : le neurone se souvient de l'entrée précédente.");
      }
    },
    {
      titre: "Dérouler dans le temps",
      texte: "<p>Diapo 10 : le neurone récurrent équivaut à une chaîne de copies, une par pas de temps. Les copies <b>partagent les mêmes paramètres</b>.</p>",
      objectif: "Dire combien de jeux de paramètres distincts il y a.",
      installer: function (zone, api) {
        Jetons.rangee(zone, [{ nom: "t", valeurs: [1, 2, 3] }, { nom: "x₍ₜ₎", valeurs: X }, { nom: "y₍ₜ₎", valeurs: Y.map(function (v) { return fmt(v, 3); }), classes: { 2: "courante" } }]);
        Exercices.choix(zone, { question: "Pour une séquence de 300 tokens, le neurone déroulé a…", options: ["un seul jeu (wₓ, w_y, b), réutilisé à chaque pas", "300 jeux de paramètres, un par position", "un jeu par mot du vocabulaire"], bonne: 0, expliquer: ["Exact : c'est ce qui permet de traiter des séquences de n'importe quelle longueur.", "Non : les poids sont partagés dans le temps.", "Non."], surReussite: function () { api.valider("y₍₃₎ ≈ " + fmt(Y[2], 3) + " résume toute la séquence : c'est l'état final."); } });
      }
    },
    {
      titre: "La couche récurrente",
      texte:
        "<p>Diapos 11 à 13 : une couche (cellule) de nb_units neurones récurrents. Tout devient vecteur ou tenseur :</p>" +
        "<div class='formule'>Y₍ₜ₎ = Φ(Wₓᵀ · X₍ₜ₎ + W_yᵀ · Y₍ₜ₋₁₎ + b)</div>" +
        "<p>Formes (diapo 13) : Wₓ : (nb_units, taille de X) ; W_y : (nb_units, nb_units) ; b et Y : (nb_units). L'état Y₍ₜ₋₁₎ est la <b>mémoire</b> transmise au pas suivant.</p>" +
        "<p>TP 4 : <span class='mono'>SimpleRNN(64)</span> sur des embeddings de dimension 96.</p>",
      objectif: "Compter les paramètres de SimpleRNN(64) sur des entrées de dimension 96.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "paramètres =", attendu: 64 * 96 + 64 * 64 + 64, placeholder: "ex. 1000", indice: "Wₓ : 64 × 96 ; W_y : 64 × 64 ; b : 64.", bravo: "6 144 + 4 096 + 64 = 10 304 (ce qu'affiche model.summary()).", surReussite: function () { api.valider("Keras range Wₓ sous la forme (96, 64), la transposée de la notation du cours : même nombre de paramètres."); } });
      }
    },
    {
      titre: "Quatre architectures",
      texte: "<p>Diapo 14 : selon ce qu'on lit en entrée et ce qu'on produit en sortie.</p>",
      objectif: "Associer chaque tâche à son architecture.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Série → série", "Série → vecteur", "Vecteur → série", "Encodeur → décodeur"], items: [
          { texte: "Prédire une série temporelle pas à pas", bonne: 0 },
          { texte: "Analyse de sentiment ; classer un document (TP 4, return_sequences=False)", bonne: 1 },
          { texte: "Annoter une image par une phrase", bonne: 2 },
          { texte: "Traduction", bonne: 3 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Les limites du RNN simple",
      texte:
        "<p>Diapo 15 : « The <b>keys</b> to the cabinet near the window <b>are</b> missing » : l'accord dépend du sujet, loin, pas du nom le plus proche. Trois limites : " +
        "1. un <b>état compressé</b> de taille fixe, réécrit à chaque token, où l'information ancienne se dilue ; 2. un <b>long chemin d'apprentissage</b> : en rétropropagation dans le temps, les gradients traversent des transformations répétées et peuvent " +
        "<b>s'évanouir</b> (vanishing) ou <b>exploser</b> ; 3. un <b>parallélisme limité</b> : chaque état dépend du précédent.</p>" +
        "<p>Intuition (complément) : le gradient qui remonte k pas est multiplié environ k fois par un facteur lié à w_y.</p>",
      objectif: "Calculer 0,5¹⁰ puis 1,5¹⁰.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "0,5¹⁰ ≈", attendu: Math.pow(0.5, 10), tolerance: 0.0002, placeholder: "ex. 0,01", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "1,5¹⁰ ≈", attendu: Math.pow(1.5, 10), tolerance: 0.5, placeholder: "ex. 10", surReussite: ok }); }
        ], "≈ 0,001 : le signal venant de 10 tokens plus tôt s'évanouit. ≈ 58 : il explose.");
      }
    },
    {
      titre: "Gradient qui explose : le clipping",
      texte:
        "<p>Diapo 16 : si le gradient devient trop grand, le pas de SGD <span class='mono'>θ_new = θ_old − α∇θJ(θ)</span> est trop grand : mauvaise mise à jour, voire Inf ou NaN. " +
        "Diapo 17, <b>gradient clipping</b> (Pascanu et al., 2013) : si la norme dépasse un seuil, on la ramène au seuil avant la mise à jour :</p>" +
        "<div class='formule'>ĝ ← ∂ℰ/∂θ ;  si ‖ĝ‖ ≥ seuil : ĝ ← (seuil / ‖ĝ‖) · ĝ</div>" +
        "<p>Même direction, pas plus petit. TP 4 : <span class='mono'>Adam(learning_rate=0.001, clipnorm=1.0)</span>.</p>",
      objectif: "Clipper ĝ = (6 ; 8) avec un seuil de 5.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "‖ĝ‖ =", attendu: 10, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "1re coordonnée après clipping =", attendu: 3, placeholder: "ex. 1", indice: "(5 / 10) × 6.", surReussite: ok }); }
        ], "ĝ devient (3 ; 4) : norme 5, même direction. Le cours : penser à clipper est important, et l'explosion est un problème facile à résoudre.");
      }
    },
    {
      titre: "Gradient qui s'évanouit : les remèdes",
      texte: "<p>Diapo 18 : le vrai problème est qu'il est <b>trop difficile pour un RNN d'apprendre à préserver l'information sur de nombreux pas</b>, car l'état caché est constamment réécrit : h⁽ᵗ⁾ = σ(W_h h⁽ᵗ⁻¹⁾ + Wₓ x⁽ᵗ⁾ + b).</p>",
      objectif: "Citer les deux pistes du cours.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Remèdes annoncés :", options: ["une mémoire séparée à laquelle on ajoute (LSTM)", "des connexions plus directes et linéaires (attention, connexions résiduelles)", "un taux d'apprentissage plus grand", "le clipping"], bonnes: [0, 1], explication: "Le clipping traite l'explosion, pas l'évanouissement.", surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "neurone-recurrent", etapes: etapes,
    fin: { texte: "<ul><li>y₍ₜ₎ = σ(Wₓᵀx₍ₜ₎ + w_y y₍ₜ₋₁₎ + b) ; couche : Y₍ₜ₎ = Φ(WₓᵀX₍ₜ₎ + W_yᵀY₍ₜ₋₁₎ + b).</li><li>Paramètres partagés dans le temps ; SimpleRNN(u) : u·d + u·u + u paramètres.</li><li>Série → série / vecteur ; vecteur → série ; encodeur → décodeur.</li><li>Limites : état compressé, gradients qui s'évanouissent ou explosent, peu de parallélisme.</li><li>Clipping : ĝ ← (seuil/‖ĝ‖)ĝ ; évanouissement → LSTM, attention.</li></ul>", cartes: "recurrents" }
  });
})();
