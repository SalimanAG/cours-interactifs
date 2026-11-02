/* Leçon 3.3 : GRU, deux portes, un état (cours 3, diapos 29 à 35 ; TP 4, exercice 4).
   Fil rouge : un état caché à 2 dimensions et le même mot « disappointing ». */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;

  var etapes = [
    {
      titre: "Un GRU simplifie le LSTM",
      texte: "<p>Diapo 30 : un GRU <b>fusionne l'état de cellule et l'état caché</b> en un seul état hₜ et utilise <b>deux portes au lieu de trois</b>. Le but est le même : préserver l'information utile et éviter de réécrire tout l'état à chaque pas.</p>",
      objectif: "Compter états et portes.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["LSTM", "GRU"], items: [
          { texte: "Deux états (cₜ et hₜ)", bonne: 0 }, { texte: "Un seul état hₜ", bonne: 1 },
          { texte: "Portes forget, input, output", bonne: 0 }, { texte: "Portes reset et update", bonne: 1 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "La porte de réinitialisation (reset)",
      texte:
        "<div class='formule'>rₜ = σ(W_r [hₜ₋₁ ; xₜ] + b_r)        h̃ₜ = tanh(W_h [rₜ ⊙ hₜ₋₁ ; xₜ] + b_h)</div>" +
        "<p>Diapo 32 : rₜ dit <b>combien du passé entre dans la construction du candidat</b> h̃ₜ. rₜ proche de 0 : l'entrée courante domine ; proche de 1 : le passé contribue. " +
        "<b>Elle filtre le passé pour le candidat ; elle n'efface pas directement l'état stocké.</b></p>" +
        "<p>hₜ₋₁ = (0,6 ; −0,4), rₜ = (0 ; 1).</p>",
      objectif: "Calculer le passé filtré rₜ ⊙ hₜ₋₁.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "1re coordonnée =", attendu: 0, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "2e coordonnée =", attendu: -0.4, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "La 1re dimension du passé est ignorée pour construire le candidat.");
      }
    },
    {
      titre: "La porte de mise à jour (update)",
      texte:
        "<div class='formule'>zₜ = σ(W_z [hₜ₋₁ ; xₜ] + b_z)        hₜ = zₜ ⊙ hₜ₋₁ + (1 − zₜ) ⊙ h̃ₜ</div>" +
        "<p>Diapo 33 : zₜ proche de 1 : on garde surtout le passé ; proche de 0 : on prend surtout le candidat ; entre les deux : un mélange. " +
        "Elle couple rétention et écriture par des poids complémentaires (rôle proche des portes forget et input du LSTM).</p>" +
        "<div class='signalement'>Le cours prévient lui-même : certaines références utilisent la convention inverse pour zₜ (hₜ = (1 − zₜ) ⊙ hₜ₋₁ + zₜ ⊙ h̃ₜ). Cette leçon suit la convention du cours.</div>" +
        "<p>1re dimension : hₜ₋₁ = 0,6, h̃ₜ = −0,5, zₜ = 0,8.</p>",
      objectif: "Calculer hₜ (1re dimension).",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "hₜ =", attendu: 0.8 * 0.6 + 0.2 * -0.5, tolerance: 0.001, placeholder: "ex. 0,5", indice: "0,8 × 0,6 + 0,2 × (−0,5).", bravo: "0,48 − 0,1 = 0,38 : le passé domine encore.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Régler zₜ",
      texte: "<p>Même dimension : hₜ₋₁ = 0,6 (opinion positive), h̃ₜ = −0,5 (candidat négatif).</p>",
      objectif: "Faire devenir hₜ négatif.",
      tester: function (z) { var r = z.querySelector("input[type=range]"); r.value = "0.3"; r.dispatchEvent(new Event("input")); },
      installer: function (zone, api) {
        var leg;
        function maj(zv) {
          var h = zv * 0.6 + (1 - zv) * -0.5;
          leg.innerHTML = "<span>hₜ = " + m(fmt(zv, 1) + " × 0,6 + " + fmt(1 - zv, 1) + " × (−0,5)") + " = " + m(fmt(h, 3)) + "</span>";
          if (h < 0) { api.retour("z petit : le candidat l'emporte.", true); api.valider("Un seul curseur règle à la fois l'oubli (zₜ faible) et l'écriture (1 − zₜ forte)."); }
        }
        N.curseur(zone, { label: "zₜ =", min: 0, max: 1, pas: 0.1, valeur: 0.8, surChange: maj });
        leg = N.legende(zone);
        maj(0.8);
      }
    },
    {
      titre: "LSTM ou GRU",
      texte: "<p>Diapo 35 : <b>aucune des deux architectures n'est toujours supérieure</b> ; on choisit selon la tâche, les données, la longueur des séquences, le budget et les résultats expérimentaux.</p>",
      objectif: "Ranger chaque propriété.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["LSTM", "GRU"], items: [
          { texte: "Filtre l'ancien état de cellule et ajoute du contenu candidat filtré", bonne: 0 },
          { texte: "Mélange l'ancien état caché avec le contenu candidat", bonne: 1 },
          { texte: "Généralement plus de paramètres, à taille d'entrée et d'état égales", bonne: 0 },
          { texte: "Économies possibles de mémoire et de calcul", bonne: 1 }
        ], surReussite: function () { api.valider("Ce que l'architecture dit : des différences structurelles (portes, états). Ce que les expériences doivent dire : accuracy, temps d'entraînement, latence, mémoire, sur le même découpage (la vitesse dépend aussi du matériel et de l'implémentation)."); } });
      }
    },
    {
      titre: "La comparaison du TP 4",
      texte: "<p>TP 4, exercice 4 : on remplace seulement la couche récurrente (SimpleRNN → LSTM → GRU), tout le reste identique (vectorisation, embedding de 96, état de 64, dropout, classifieur, compilation).</p>",
      objectif: "Juger quatre affirmations sur cette comparaison.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Même taille d'état caché ⇒ même nombre de paramètres.", vrai: false, explication: "" },
          { texte: "Un seul entraînement avec une graine fixée ne suffit pas à classer les architectures sur tous les jeux de données.", vrai: true },
          { texte: "Le TF-IDF voit les documents entiers et des bigrammes ; les réseaux ne voient que les 300 premiers tokens.", vrai: true },
          { texte: "On choisit l'architecture finale sur le macro-F1 de validation, pas de test.", vrai: true }
        ], surReussite: function () { api.valider("Ordres de grandeur (Keras, entrée 96, état 64) : SimpleRNN 10 304, GRU 31 104 (Keras ajoute un second vecteur de biais par défaut), LSTM 41 216 — sans compter l'embedding."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "gru", etapes: etapes,
    fin: { texte: "<ul><li>Un état hₜ, deux portes.</li><li>rₜ filtre le passé pour le candidat h̃ₜ = tanh(W[rₜ ⊙ hₜ₋₁ ; xₜ] + b).</li><li>hₜ = zₜ ⊙ hₜ₋₁ + (1 − zₜ) ⊙ h̃ₜ (convention du cours).</li><li>Ni LSTM ni GRU n'est toujours meilleur : on compare sur la validation.</li></ul>", cartes: "recurrents" }
  });
})();
