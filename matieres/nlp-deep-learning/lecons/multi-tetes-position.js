/* Leçon 4.2 : Plusieurs têtes et la position des mots (cours 4, diapos 8 à 13, 20 à 23).
   Fil rouge : « Paul est basketteur. Il a marqué beaucoup de paniers samedi. » (exemple du cours). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;

  var etapes = [
    {
      titre: "Plusieurs types de dépendances",
      texte:
        "<p>Diapo 20 : une tête d'attention capture des dépendances entre les xᵢ, mais <b>il peut exister plusieurs types de dépendances</b>. Dans « Paul est basketteur. Il a marqué beaucoup de paniers samedi. » : " +
        "« Il » ↔ « Paul » (genre), « marqué » ↔ « samedi » (temps), « paniers » ↔ « basketteur » (contexte).</p>" +
        "<p><b>Multi-head</b> : plusieurs têtes d'attention en parallèle, chacune avec ses propres W_q, W_k, W_v. Diapo 22 (exemple hypothétique) : une tête suit les entités, une autre les mots syntaxiquement liés.</p>",
      objectif: "Dire pourquoi plusieurs têtes.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Pourquoi plusieurs têtes plutôt qu'une ?", options: ["chaque tête peut apprendre un type de relation différent", "pour réduire le nombre de paramètres", "pour traiter les tokens un par un"], bonne: 0, expliquer: ["Exact. Ce que capte chaque tête n'est pas fixé à l'avance : il est appris.", "Non.", "Non : les têtes travaillent en parallèle."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Concaténer les têtes",
      texte:
        "<div class='formule'>Y = Concat[Y¹, …, Yʰ] · Wᴼ       avec en général dᵥ = d / h</div>" +
        "<p>Diapo 21 : chaque tête i produit Yⁱ de forme (n, dᵥ). On concatène les h têtes, (n, h·dᵥ), puis on projette par Wᴼ, de forme (h·dᵥ, d), pour revenir à (n, d).</p>",
      objectif: "Calculer dᵥ, puis la forme après concaténation.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "d = 512, h = 8 → dᵥ =", attendu: 64, placeholder: "ex. 32", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "n = 10. Forme de Concat[Y¹, …, Y⁸] ?", options: ["(10, 512)", "(10, 64)", "(8, 512)"], bonne: 0, expliquer: ["8 × 64 = 512 colonnes.", "Non : une seule tête.", "Non."], surReussite: ok }); }
        ], "Avec dᵥ = d/h, le multi-head coûte à peu près autant qu'une seule grande tête.");
      }
    },
    {
      titre: "La langue n'est pas invariante par permutation",
      texte:
        "<p>Diapo 10 : « Jean pense que Pierre a tort » ≠ « Pierre pense que Jean a tort ». Or l'auto-attention seule ne voit pas l'ordre : chaque token regarde un <b>ensemble</b> de tokens.</p>",
      objectif: "Prévoir ce que voit l'auto-attention seule.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Sans information de position, si l'on échange « Jean » et « Pierre »…", options: ["chaque token obtient la même représentation qu'avant (seules les places sont échangées) : l'ordre est perdu", "les représentations changent complètement", "le modèle refuse la phrase"], bonne: 0, expliquer: ["Exact : il faut encoder la position.", "Non : rien dans les scores ne dépend de la place.", "Non."], surReussite: function () { api.valider("D'où le premier concept clé du Transformer (diapo 8) : le positional encoding."); } });
      }
    },
    {
      titre: "L'encodage positionnel",
      texte:
        "<p>Diapos 11 à 13 : un vecteur qui apporte le <b>contexte</b> lié à la <b>position</b> du mot (« dog » en position 2 dans « Ben's dog is cute », en position 5 dans « Ben looks like a dog »). " +
        "Il est <b>additionné</b> à l'embedding : xⱼ = embedding(mot j) + PE(position j) ∈ ℝᵈ.</p>" +
        "<div class='formule'>PE(pos, 2i) = sin(pos / 10000^{2i/d_model})     PE(pos, 2i+1) = cos(pos / 10000^{2i/d_model})</div>" +
        "<p>Coordonnées paires : sinus ; impaires : cosinus ; la fréquence diminue quand i augmente.</p>",
      objectif: "Calculer les premières coordonnées de PE(pos = 0).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "PE(0, 0) = sin(0) =", attendu: 0, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "PE(0, 1) = cos(0) =", attendu: 1, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "embedding (0,32) + PE (0,03) → coordonnée =", attendu: 0.35, tolerance: 0.001, placeholder: "ex. 0,5", indice: "On additionne (diapo 13 : [0,32 ; …] + PE = [0,35 ; …]).", surReussite: ok }); }
        ], "PE(0) = (0, 1, 0, 1, …). La valeur 0,03 est déduite de l'exemple de la diapo 13, qui ne donne pas le vecteur PE lui-même.");
      }
    },
    {
      titre: "Pourquoi sinus et cosinus",
      texte: "<p>Diapo 11 : les contraintes qu'un encodage positionnel doit respecter, toutes satisfaites par la solution sin/cos.</p>",
      objectif: "Cocher les contraintes citées.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Contraintes satisfaites par l'encodage sin/cos :", options: ["un encodage unique par position", "une relation simple entre les encodages de deux positions connues", "une généralisation à des séquences de n'importe quelle longueur", "une généralisation à n'importe quelle dimension", "un encodage déterministe", "un encodage appris pendant l'entraînement"], bonnes: [0, 1, 2, 3, 4], explication: "Il est calculé par une formule, pas appris (déterministe).", surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "multi-tetes-position", etapes: etapes,
    fin: { texte: "<ul><li>Multi-head : h têtes parallèles, chacune ses W_q, W_k, W_v ; Y = Concat[Y¹…Yʰ]Wᴼ ; dᵥ = d/h.</li><li>L'auto-attention seule ignore l'ordre.</li><li>PE(pos, 2i) = sin(pos/10000^{2i/d}), PE(pos, 2i+1) = cos(…) ; additionné à l'embedding.</li></ul>", cartes: "transformers" }
  });
})();
