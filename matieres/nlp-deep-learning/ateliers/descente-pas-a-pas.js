/* Atelier : la descente de gradient pas à pas, avec deux paramètres (a, b)
   (cours 1, diapo 24 : tableau perte / gradient / theta).
   Mêmes 5 points que la leçon « Régression linéaire » ; départ (a, b) = (0, 0). */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var PTS = [[1, 2], [2, 3], [3, 5], [4, 4], [5, 6]];
  function etat(a, b) {
    var ga = 0, gb = 0, L = 0;
    PTS.forEach(function (p) { var e = a * p[0] + b - p[1]; ga += e * p[0]; gb += e; L += e * e; });
    return { ga: 2 * ga / 5, gb: 2 * gb / 5, L: L / 5 };
  }
  var FORM = "<div class='formule'>∂MSE/∂a = (2/n) Σ (a·xᵢ + b − yᵢ)·xᵢ        ∂MSE/∂b = (2/n) Σ (a·xᵢ + b − yᵢ)</div>";

  var etapes = [
    {
      titre: "Les deux dérivées partielles au départ",
      texte: "<p>Points : (1, 2), (2, 3), (3, 5), (4, 4), (5, 6). Départ a = 0, b = 0 : toutes les prédictions valent 0.</p>" + FORM +
        "<p>Aide : Σ yᵢ = 20 et Σ xᵢyᵢ = 69.</p>",
      objectif: "Calculer le gradient en (0 ; 0).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "∂MSE/∂a =", attendu: -27.6, placeholder: "ex. 1", indice: "(2/5) × (−69).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "∂MSE/∂b =", attendu: -8, placeholder: "ex. 1", indice: "(2/5) × (−20).", surReussite: ok }); }
        ], "∇ = (−27,6 ; −8) : il faut augmenter a et b, surtout a.");
      }
    },
    {
      titre: "Le premier pas",
      texte: "<p>η = 0,02. Applique Θ ← Θ − η·∇ à chaque paramètre.</p>",
      objectif: "Calculer (a₁ ; b₁).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "a₁ =", attendu: 0.552, tolerance: 1e-6, placeholder: "ex. 0,5", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "b₁ =", attendu: 0.16, tolerance: 1e-6, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "MSE : 18 → " + fmt(etat(0.552, 0.16).L, 2) + ".");
      }
    },
    {
      titre: "Laisser tourner",
      texte: "<p>Le tableau reprend la présentation de la diapo 24. L'optimum (équation normale) est a = 0,9, b = 1,3, MSE = 0,38.</p>",
      objectif: "Faire descendre la MSE sous 0,39.",
      tester: function (z) { for (var i = 0; i < 3; i++) z.querySelectorAll(".btn")[2].click(); },
      installer: function (zone, api) {
        var a = 0, b = 0, k = 0, lignes = [], tab = N.el("div");
        function noter() { var e = etat(a, b); lignes.push([k, fmt(e.L, 3), fmt(e.ga, 3), fmt(e.gb, 3), fmt(a, 3), fmt(b, 3)]); }
        function pas(n) {
          for (var i = 0; i < n; i++) { var e = etat(a, b); a -= 0.02 * e.ga; b -= 0.02 * e.gb; k++; }
          noter(); maj();
        }
        var barre = N.el("div", "rangee-btn");
        [["1 pas", 1], ["10 pas", 10], ["100 pas", 100]].forEach(function (x) { var bt = N.el("button", "btn btn-petit", x[0]); bt.type = "button"; bt.onclick = function () { pas(x[1]); }; barre.appendChild(bt); });
        zone.appendChild(barre); zone.appendChild(tab);
        function maj() {
          tab.innerHTML = "<div class='defile-x'>" + N.tableau(["#", "perte", "∂a", "∂b", "a", "b"], lignes.slice(-12)) + "</div>";
          if (etat(a, b).L < 0.39) { api.retour("MSE = " + fmt(etat(a, b).L, 4) + " après " + k + " pas.", true); api.valider("a est trouvé vite, b beaucoup plus lentement : les paramètres n'ont pas tous la même « pente ». C'est une raison d'utiliser des optimiseurs adaptatifs comme Adam."); }
        }
        noter(); maj();
      }
    },
    {
      titre: "Lire le tableau",
      texte: "<p>Questions sur un tableau d'itérations comme celui de la diapo 24.</p>",
      objectif: "Interpréter l'évolution de la perte et du gradient.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Au fil des itérations, la perte diminue et le gradient se rapproche de 0.", vrai: true },
          { texte: "Un gradient nul garantit qu'on a trouvé le meilleur modèle possible sur des données nouvelles.", vrai: false, explication: "" },
          { texte: "Si la perte augmente d'une itération à l'autre en oscillant, il faut essayer un η plus petit.", vrai: true },
          { texte: "Le signe d'une dérivée partielle indique dans quel sens bouger le paramètre.", vrai: true }
        ], surReussite: function () { api.valider("Gradient nul = fond de la perte d'entraînement. La généralisation se juge sur des données de validation."); } });
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "descente-pas-a-pas", etapes: etapes, fin: { texte: "<p>Dérivées partielles, pas Θ ← Θ − η∇, convergence et lecture d'un tableau d'itérations.</p>", cartes: "rappels-optimisation" } });
})();
