/* Leçon 3.2 : Une cellule LSTM, porte par porte (cours 3, diapos 19 à 25).
   Fil rouge : « The film seemed promising, but it was disappointing. »
   Un état de cellule à 2 dimensions, la 1re portant (pour l'exemple) l'opinion
   accumulée ; on traite le mot « disappointing ». Valeurs choisies pour la leçon. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var CPREV = [0.8, -0.5], F = [0.1, 0.9], I = [0.9, 0.2], CT = [-0.7, 0.5], O = [1, 0.5];
  var C = [0, 1].map(function (k) { return F[k] * CPREV[k] + I[k] * CT[k]; });
  var H = [0, 1].map(function (k) { return O[k] * Math.tanh(C[k]); });
  function v(a) { return "(" + a.map(function (x) { return fmt(x, 2); }).join(" ; ") + ")"; }

  var etapes = [
    {
      titre: "Deux états : long terme et court terme",
      texte:
        "<p>Diapo 20 (Hochreiter et Schmidhuber, 1997) : la cellule LSTM transporte deux états d'un pas au suivant :</p>" +
        "<ul><li>l'<b>état de cellule</b> cₜ (long term state) : la mémoire interne, transmise avec des modifications minimes ;</li>" +
        "<li>l'<b>état caché</b> hₜ (short term state) : une version filtrée de la cellule, utilisée pour la récurrence et la prédiction (yₜ = hₜ).</li></ul>" +
        "<p>Trois <b>portes</b> (forget, input, output) et un <b>contenu candidat</b> contrôlent ce qui est oublié, écrit et révélé (diapo 21).</p>",
      objectif: "Associer chaque rôle à sa porte.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Forget fₜ", "Input iₜ", "Candidat c̃ₜ", "Output oₜ"], items: [
          { texte: "Que doit-on garder de l'ancienne mémoire ?", bonne: 0 },
          { texte: "Combien du nouveau contenu écrire ?", bonne: 1 },
          { texte: "Quel nouveau contenu est disponible ?", bonne: 2, explication: "Un calcul, pas une quatrième porte (diapo 21)." },
          { texte: "Quelle part de la mémoire révéler dans hₜ ?", bonne: 3 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "La porte d'oubli",
      texte:
        "<div class='formule'>fₜ = σ(W_f [hₜ₋₁ ; xₜ] + b_f)        mémoire retenue = fₜ ⊙ cₜ₋₁</div>" +
        "<p>[hₜ₋₁ ; xₜ] : concaténation de l'état caché précédent et de l'entrée. σ donne une valeur entre 0 et 1 <b>par dimension</b> de la mémoire. ⊙ : multiplication élément par élément. " +
        "Proche de 0 : on supprime ; proche de 1 : on conserve (diapo 22).</p>" +
        "<p>Avant « disappointing » : cₜ₋₁ = " + v(CPREV) + " (1re dimension : l'attente positive née de « promising »). La porte vaut fₜ = " + v(F) + ".</p>",
      objectif: "Calculer la mémoire retenue fₜ ⊙ cₜ₋₁.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "1re coordonnée =", attendu: F[0] * CPREV[0], tolerance: 0.001, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "2e coordonnée =", attendu: F[1] * CPREV[1], tolerance: 0.001, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "L'attente positive est presque effacée (0,08) ; la 2e dimension est presque intacte (−0,45).");
      }
    },
    {
      titre: "La porte d'entrée et le contenu candidat",
      texte:
        "<div class='formule'>iₜ = σ(Wᵢ [hₜ₋₁ ; xₜ] + bᵢ)        c̃ₜ = tanh(W_c [hₜ₋₁ ; xₜ] + b_c)</div>" +
        "<p>Diapo 23 : le candidat c̃ₜ (entre −1 et 1) propose ce qui <i>pourrait</i> être stocké ; la porte iₜ (entre 0 et 1) dit <i>combien</i> en stocker. Contribution : iₜ ⊙ c̃ₜ.</p>" +
        "<p>Pour « disappointing » : c̃ₜ = " + v(CT) + ", iₜ = " + v(I) + ".</p>",
      objectif: "Calculer la nouvelle contribution iₜ ⊙ c̃ₜ.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "1re coordonnée =", attendu: I[0] * CT[0], tolerance: 0.001, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "2e coordonnée =", attendu: I[1] * CT[1], tolerance: 0.001, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "« disappointing » écrit fortement une opinion négative dans la 1re dimension.");
      }
    },
    {
      titre: "La mise à jour de l'état de cellule",
      texte:
        "<div class='formule'>cₜ = fₜ ⊙ cₜ₋₁ + iₜ ⊙ c̃ₜ</div>" +
        "<p>Diapo 24 : la mémoire est mise à jour en <b>retenant sélectivement l'ancien contenu et en ajoutant du nouveau</b>. Les deux portes agissent indépendamment : leurs valeurs n'ont pas à sommer à 1. " +
        "C'est une <b>addition</b>, pas une réécriture complète : c'est ce qui aide l'information (et le gradient) à traverser de nombreux pas.</p>",
      objectif: "Calculer cₜ.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "cₜ (1re) =", attendu: C[0], tolerance: 0.001, placeholder: "ex. 0,5", indice: "0,08 + (−0,63).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "cₜ (2e) =", attendu: C[1], tolerance: 0.001, placeholder: "ex. 0,5", indice: "−0,45 + 0,1.", surReussite: ok }); }
        ], "cₜ = (−0,55 ; −0,35) : l'opinion accumulée est passée du positif au négatif.");
      }
    },
    {
      titre: "La porte de sortie",
      texte:
        "<div class='formule'>oₜ = σ(W_o [hₜ₋₁ ; xₜ] + b_o)        hₜ = oₜ ⊙ tanh(cₜ)</div>" +
        "<p>Diapo 25 : <b>la porte de sortie contrôle ce qui est révélé de la mémoire</b>, tandis que l'état de cellule porte la mémoire vers l'avant. hₜ sert au pas suivant et à la prédiction (couche Dense). oₜ = " + v(O) + ".</p>",
      objectif: "Calculer hₜ.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "hₜ (1re) ≈", attendu: H[0], tolerance: 0.005, placeholder: "ex. 0,5", indice: "1 × tanh(−0,55).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "hₜ (2e) ≈", attendu: H[1], tolerance: 0.005, placeholder: "ex. 0,5", indice: "0,5 × tanh(−0,35).", surReussite: ok }); }
        ], "hₜ ≈ (−0,50 ; −0,17) : la 2e dimension n'est révélée qu'à moitié, mais elle reste intacte dans cₜ.");
      }
    },
    {
      titre: "Régler les portes soi-même",
      texte:
        "<p>Une seule dimension : cₜ₋₁ = 0,8 (attente positive), candidat c̃ₜ = −0,7 (« disappointing »). Règle fₜ et iₜ. Les vraies portes ne sont pas réglées à la main : elles dépendent de l'entrée et sont <b>apprises</b> (diapo 22 : « des filtres souples, pas des règles prédéfinies »).</p>",
      objectif: "Faire passer cₜ sous −0,4 (l'opinion négative l'emporte nettement).",
      tester: function (z) { var r = z.querySelectorAll("input[type=range]"); r[0].value = "0.1"; r[0].dispatchEvent(new Event("input")); r[1].value = "0.9"; r[1].dispatchEvent(new Event("input")); },
      installer: function (zone, api) {
        var f = 1, i = 0, leg;
        function maj() {
          var c = f * 0.8 + i * -0.7;
          leg.innerHTML = "<span>cₜ = " + m(fmt(f, 2) + " × 0,8 + " + fmt(i, 2) + " × (−0,7)") + " = " + m(fmt(c, 3)) + "</span>";
          if (c < -0.4) { api.retour("Oublier l'ancienne attente (f petit) et écrire le nouveau contenu (i grand).", true); api.valider("f = 1, i = 0 : la mémoire est recopiée telle quelle (rien n'est oublié ni écrit)."); }
        }
        N.curseur(zone, { label: "fₜ =", min: 0, max: 1, pas: 0.1, valeur: f, surChange: function (x) { f = x; maj(); } });
        N.curseur(zone, { label: "iₜ =", min: 0, max: 1, pas: 0.1, valeur: i, surChange: function (x) { i = x; maj(); } });
        leg = N.legende(zone);
        maj();
      }
    },
    {
      titre: "Deux notations pour la même cellule",
      texte:
        "<p>La diapo 20 écrit les équations avec des matrices séparées pour l'entrée et l'état caché, <span class='mono'>gₜ</span> pour le candidat et ⊗ pour le produit élément par élément :</p>" +
        "<div class='formule'>f₍ₜ₎ = σ(W_xfᵀ X₍ₜ₎ + W_hfᵀ h₍ₜ₋₁₎ + b_f)   …   c₍ₜ₎ = f₍ₜ₎ ⊗ c₍ₜ₋₁₎ + i₍ₜ₎ ⊗ g₍ₜ₎</div>" +
        "<p>Les diapos 22 à 25 écrivent <span class='mono'>W_f [hₜ₋₁ ; xₜ]</span>, <span class='mono'>c̃ₜ</span> et ⊙.</p>" +
        "<div class='signalement'>Deux notations coexistent dans le cours ; elles décrivent la même cellule : multiplier la concaténation [hₜ₋₁ ; xₜ] par une matrice revient à additionner deux produits par deux blocs de cette matrice.</div>",
      objectif: "Compter les paramètres de LSTM(64) sur des entrées de dimension 96.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "paramètres =", attendu: 4 * (64 * 96 + 64 * 64 + 64), placeholder: "ex. 1000", indice: "4 blocs (f, i, candidat, o), chacun comme un SimpleRNN(64) : 64·96 + 64·64 + 64.", bravo: "4 × 10 304 = 41 216 : quatre fois un SimpleRNN de même taille.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Ce que le LSTM apprend",
      texte: "<p>Diapo 21 : il apprend des paramètres qui contrôlent la circulation de l'information dans la mémoire : exemples → prédictions → perte → rétropropagation dans le temps → mise à jour des poids et biais. Les mêmes paramètres servent à chaque pas.</p>",
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Les valeurs des portes changent avec l'entrée et le contexte ; les paramètres changent pendant l'entraînement.", vrai: true },
          { texte: "fₜ + iₜ = 1 obligatoirement.", vrai: false, explication: "" },
          { texte: "Le LSTM garantit qu'aucune information n'est jamais perdue.", vrai: false, explication: "" },
          { texte: "Chaque porte a ses propres poids et biais.", vrai: true }
        ], surReussite: function () { api.valider("Diapo 46 : les portes aident avec les dépendances longues, sans garantir une mémoire parfaite."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "cellule-lstm", etapes: etapes,
    fin: { texte: "<ul><li>fₜ, iₜ, oₜ = σ(W[hₜ₋₁ ; xₜ] + b) ∈ (0, 1) ; c̃ₜ = tanh(…) ∈ (−1, 1).</li><li>cₜ = fₜ ⊙ cₜ₋₁ + iₜ ⊙ c̃ₜ ; hₜ = oₜ ⊙ tanh(cₜ).</li><li>cₜ porte la mémoire, hₜ en révèle une partie.</li><li>LSTM(u) ≈ 4 × SimpleRNN(u) en paramètres.</li></ul>", cartes: "recurrents" }
  });
})();
