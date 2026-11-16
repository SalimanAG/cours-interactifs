/* Atelier : l'attention à la main (cours 4, diapos 7, 19, 21, 37).
   Fil rouge : « Le chat dort », d_k = 4 ; on calcule la représentation de « chat ».
   Valeurs inventées pour l'atelier. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var TOK = ["Le", "chat", "dort"];
  var q = [1, 1, 0, 0];
  var K = [[1, 0, 0, 0], [1, 1, 1, 1], [0, 1, 1, 0]];
  var V = [[1, 0], [0, 1], [1, 1]];
  var S = K.map(function (k) { return k.reduce(function (s, x, i) { return s + x * q[i]; }, 0); });
  var Sc = S.map(function (s) { return s / 2; });
  var A = N.softmax(Sc);
  var O = [0, 1].map(function (d) { return A.reduce(function (s, a, j) { return s + a * V[j][d]; }, 0); });
  var AM = N.softmax(Sc.slice(0, 2));
  function v(a) { return "(" + a.map(function (x) { return fmt(x, 3); }).join(" ; ") + ")"; }
  var TAB = N.tableau(["token", "clé k", "valeur v"], TOK.map(function (t, j) { return [t, m(v(K[j])), m(v(V[j]))]; }));

  var etapes = [
    {
      titre: "Les scores de « chat »",
      texte: "<p>Requête de « chat » : q = " + m(v(q)) + ", dₖ = 4.</p>" + TAB,
      objectif: "Calculer qᵀk pour les trois tokens.",
      installer: function (zone, api) {
        N.enchainer(zone, api, TOK.map(function (t, j) {
          return function (b, ok) { Exercices.nombre(b, { label: "score(chat, " + t + ") =", attendu: S[j], placeholder: "ex. 1", surReussite: ok }); };
        }), "Scores (1 ; 2 ; 1).");
      }
    },
    {
      titre: "Diviser par √dₖ",
      texte: "<div class='formule'>softmax( QKᵀ / √dₖ )</div><p>Scores (1 ; 2 ; 1), dₖ = 4.</p>",
      objectif: "Calculer les scores mis à l'échelle.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "√dₖ =", attendu: 2, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "score mis à l'échelle de « chat » sur lui-même =", attendu: 1, placeholder: "ex. 1", surReussite: ok }); }
        ], "Scores mis à l'échelle : (0,5 ; 1 ; 0,5).");
      }
    },
    {
      titre: "Les poids d'attention",
      texte: "<p>Softmax de (0,5 ; 1 ; 0,5). Aide : e^0,5 ≈ 1,649 et e¹ ≈ 2,718.</p>",
      objectif: "Calculer le poids de « chat » sur lui-même, à 0,01 près.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "α(chat, chat) ≈", attendu: A[1], tolerance: 0.01, placeholder: "ex. 0,3", indice: "2,718 / (1,649 + 2,718 + 1,649).", bravo: "≈ 0,45 ; « Le » et « dort » ont chacun ≈ 0,27. Somme : 1.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "La sortie de « chat »",
      texte: "<div class='formule'>o = Σⱼ αⱼ vⱼ</div><p>Poids (0,274 ; 0,452 ; 0,274).</p>" + TAB,
      objectif: "Calculer les deux coordonnées de o.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "1re coordonnée ≈", attendu: O[0], tolerance: 0.01, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "2e coordonnée ≈", attendu: O[1], tolerance: 0.01, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "o ≈ (0,55 ; 0,73). La sortie a la dimension des valeurs, pas celle des clés.");
      }
    },
    {
      titre: "La même chose, masquée",
      texte: "<p>Dans un décodeur, « chat » n'a pas le droit de voir « dort » : on ajoute −∞ à ce score avant la softmax (diapo 37). Scores mis à l'échelle : (0,5 ; 1 ; −∞).</p>",
      objectif: "Recalculer le poids de « chat » sur lui-même.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "α(chat, chat) masqué ≈", attendu: AM[1], tolerance: 0.01, placeholder: "ex. 0,5", indice: "2,718 / (1,649 + 2,718) ; exp(−∞) = 0.", bravo: "≈ 0,62 (et 0,38 sur « Le », 0 sur « dort »).", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Les formes, en multi-head",
      texte: "<p>Même phrase (n = 3), d = 8, h = 2 têtes, dₖ = dᵥ = d/h.</p>",
      objectif: "Donner les formes d'une tête et de la sortie.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "Forme de Qⁱ pour une tête ?", options: ["(3, 4)", "(3, 8)", "(8, 4)", "(3, 3)"], bonne: 0, expliquer: ["n lignes, dₖ = 8/2 = 4 colonnes.", "Non : c'est X.", "Non : c'est W_qⁱ.", "Non : ce sont les scores."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Forme de la sortie Concat[Y¹, Y²]Wᴼ ?", options: ["(3, 8)", "(3, 4)", "(6, 8)"], bonne: 0, expliquer: ["Retour à (n, d) : on peut ajouter X (résiduel).", "Non.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "nombre de scores calculés (2 têtes, 3 × 3 chacune) =", attendu: 18, placeholder: "ex. 9", surReussite: ok }); }
        ], "h × n² scores par couche : le coût quadratique en n.");
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "attention-main", etapes: etapes, fin: { texte: "<p>Scores qᵀk → ÷√dₖ → (masque) → softmax → somme pondérée des valeurs. Formes : Qⁱ (n, d/h), scores (n, n), sortie (n, d).</p>", cartes: "transformers" } });
})();
