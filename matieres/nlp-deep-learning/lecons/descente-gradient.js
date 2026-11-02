/* Leçon 1.4 : Descente de gradient (cours 1, diapos 19 à 24).
   Fil rouge : les 5 points de la leçon « Régression linéaire », avec d'abord un
   seul paramètre (droite ŷ = a·x passant par l'origine) pour tout voir sur une courbe. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var PTS = [[1, 2], [2, 3], [3, 5], [4, 4], [5, 6]];
  function L(a) { return PTS.reduce(function (s, p) { var e = a * p[0] - p[1]; return s + e * e; }, 0) / 5; }
  function G(a) { return PTS.reduce(function (s, p) { return s + (a * p[0] - p[1]) * p[0]; }, 0) * 2 / 5; }

  var etapes = [
    {
      titre: "Mesurer, puis bouger",
      texte:
        "<p>Le cours (diapos 19 à 22) décrit un cycle : <b>mesurer</b> la qualité de la position de la droite (la perte), puis <b>bouger</b> la droite pour l'améliorer, et recommencer. " +
        "Chercher itérativement la meilleure position en faisant varier les paramètres Θ s'appelle l'<b>optimisation</b>.</p>" +
        "<p>Pour tout voir sur une courbe, on simplifie : droite ŷ = a·x (b = 0), un seul paramètre a. La perte est MSE(a).</p>",
      objectif: "Remettre le cycle dans l'ordre.",
      installer: function (zone, api) {
        var g = new Courbes(N.cadre(zone), { largeur: 340, hauteur: 180 });
        g.dessiner({ xmin: 0, xmax: 2.5, ymax: 20, nomX: "a", fonctions: [{ label: "MSE(a)", f: L }] });
        Exercices.ordonner(zone, { consigne: "Une itération :", items: ["calculer la perte", "calculer le gradient", "mettre à jour a", "recommencer"], separateur: "→", surReussite: function () { api.valider("Le minimum de la courbe est vers a ≈ 1,25 : c'est ce que l'on cherche, sans le calculer directement."); } });
      }
    },
    {
      titre: "Le gradient de la MSE",
      texte:
        "<p>Le cours (diapo 23) : le <b>gradient</b> = δloss / δθ est la pente que l'on va suivre. En dérivant chaque terme (a·xᵢ − yᵢ)² (leçon « Pente, dérivée, gradient ») :</p>" +
        "<div class='formule'>dMSE/da = (2/n) Σᵢ (a·xᵢ − yᵢ) · xᵢ</div>" +
        "<p>Avec nos points, Σ xᵢ² = 55 et Σ xᵢyᵢ = 69, donc <span class='mono'>dMSE/da = (2/5)(55a − 69)</span>.</p>",
      objectif: "Calculer le gradient au départ, en a = 0.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "dMSE/da (0) =", attendu: G(0), tolerance: 1e-6, placeholder: "ex. 10", indice: "(2/5) × (0 − 69).", bravo: "−27,6 : pente très négative, il faut augmenter a.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Un pas, avec le taux d'apprentissage η",
      texte:
        "<div class='formule'>θ ← θ − η · δloss/δθ</div>" +
        "<p>η (eta) est le <b>taux d'apprentissage</b> (learning rate) : la taille du pas. On part de a = 0 avec η = 0,01.</p>",
      objectif: "Calculer a après un pas.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "a₁ =", attendu: 0.276, tolerance: 1e-6, placeholder: "ex. 0,5", indice: "0 − 0,01 × (−27,6).", bravo: "a₁ = 0,276, et la MSE passe de 18 à " + fmt(L(0.276), 2) + ".", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Itérer jusqu'au fond",
      texte: "<p>Fais des pas. Le tableau garde l'historique comme celui de la diapo 24 (perte, gradient, paramètre).</p>",
      objectif: "Atteindre un gradient de valeur absolue inférieure à 0,1.",
      tester: function (z) { for (var i = 0; i < 4; i++) z.querySelectorAll(".btn")[1].click(); },
      installer: function (zone, api) {
        var eta = 0.02, a = 0, hist = [], fig = N.el("div"), table = N.el("div");
        function pas(n) {
          for (var k = 0; k < n; k++) { var g = G(a); a = a - eta * g; hist.push(a); if (!isFinite(a) || Math.abs(a) > 1e6) break; }
          maj();
        }
        var barre = N.el("div", "rangee-btn");
        [["1 pas", 1], ["10 pas", 10]].forEach(function (x) { var b = N.el("button", "btn btn-petit", x[0]); b.type = "button"; b.onclick = function () { pas(x[1]); }; barre.appendChild(b); });
        var raz = N.el("button", "btn btn-petit", "Recommencer"); raz.type = "button"; raz.onclick = function () { a = 0; hist = []; maj(); }; barre.appendChild(raz);
        N.curseur(zone, { label: "η =", min: 0.005, max: 0.04, pas: 0.005, valeur: eta, format: function (x) { return fmt(x, 3); }, surChange: function (x) { eta = x; } });
        zone.appendChild(barre); zone.appendChild(fig); zone.appendChild(table);
        var g = new Courbes(fig, { largeur: 340, hauteur: 170 });
        function maj() {
          g.dessiner({ xmin: 0, xmax: 2.5, ymax: 20, nomX: "a", fonctions: [{ label: "MSE(a)", f: L }], marque: { x: Math.max(0, Math.min(2.5, a)), texte: "a" } });
          var lignes = [[0, fmt(L(0), 3), fmt(G(0), 3), "0"]];
          var idx = [1, 2, 3, 5, 10, 20, 50, 100].filter(function (k) { return k <= hist.length; });
          if (hist.length && idx.indexOf(hist.length) < 0) idx.push(hist.length);
          idx.forEach(function (k) { var x = hist[k - 1]; lignes.push([k, fmt(L(x), 3), fmt(G(x), 3), fmt(x, 4)]); });
          table.innerHTML = N.tableau(["itération", "perte", "gradient", "a"], lignes);
          if (hist.length && Math.abs(G(a)) < 0.1) { api.retour("Gradient ≈ " + fmt(G(a), 3) + " : on est au fond, a ≈ " + fmt(a, 3) + ".", true); api.valider("Près du minimum, le gradient devient petit, donc les pas aussi : la descente ralentit d'elle-même."); }
        }
        maj();
      }
    },
    {
      titre: "Un pas trop grand",
      texte:
        "<p>Le taux d'apprentissage est un compromis : trop petit, la descente est lente ; trop grand, on <b>saute par-dessus</b> le minimum. " +
        "Le cours 3 le rappelle : si le pas devient trop grand, on atteint une configuration « bizarre », voire Inf ou NaN dans le réseau.</p>" +
        "<p>Voici les premières itérations avec η = 0,1, en partant de a = 0 :</p>" +
        N.tableau(["itération", "a", "MSE"], [[0, "0", fmt(L(0), 1)], [1, "2,76", fmt(L(2.76), 1)], [2, "−0,55", fmt(L(-0.552), 1)], [3, "3,42", fmt(L(3.4224), 1)], [4, "−1,35", fmt(L(-1.3469), 1)]]),
      objectif: "Diagnostiquer ce qui se passe.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Avec η = 0,1…", options: ["a oscille de part et d'autre du minimum en s'en éloignant : la perte explose (divergence)", "la descente converge plus vite", "la descente converge, mais lentement"], bonne: 0, expliquer: ["Exact. Ici il faut η < 0,09 environ pour converger. En pratique on essaie plusieurs valeurs sur l'ensemble de validation.", "Non : regarde la colonne MSE.", "Non : la perte augmente à chaque pas."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Avec plusieurs paramètres : le gradient vectoriel",
      texte:
        "<p>Avec θ = (θ₀, θ₁, …, θₘ), on dérive par rapport à chacun. Le cours (diapo 24) écrit, sous forme matricielle :</p>" +
        "<div class='formule'>∇θ MSE(Θ) = (2/n) · Xᵀ · (X · Θ − Y)        Θ ← Θ − η · ∇θ MSE(Θ)</div>" +
        "<p>n : nombre d'observations ; m : nombre de caractéristiques.</p>" +
        "<div class='signalement'>La diapo écrit ∇ε au lieu de ∇θ dans la mise à jour : coquille.</div>",
      objectif: "Prévoir la forme du gradient.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "X a la forme (n, m + 1) (colonne de 1 incluse), Θ et Y sont des vecteurs. Quelle est la forme de Xᵀ · (X·Θ − Y) ?", options: ["un vecteur de m + 1 nombres : une dérivée partielle par paramètre", "un vecteur de n nombres", "un seul nombre"], bonne: 0, expliquer: ["Exact : (m+1, n)·(n) → (m+1). Le gradient a toujours la forme des paramètres.", "Non : X·Θ − Y a n coordonnées (les erreurs), mais Xᵀ les recombine.", "Non."], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Époques et lots (mini-batches)",
      texte:
        "<p>Le cours calcule le gradient sur toutes les données à chaque pas. Les bibliothèques (Keras, dans le cours 3 et le TP 4) le calculent sur un <b>lot</b> (batch) d'exemples : " +
        "<span class='mono'>batch_size=64</span> → un pas toutes les 64 exemples. Une <b>époque</b> (epoch) = un passage sur tout l'ensemble d'entraînement. " +
        "<span class='mono'>Adam</span> (TP 4) est une variante de la descente de gradient qui adapte la taille des pas (complément : non détaillée dans le cours).</p>",
      objectif: "Compter les mises à jour d'une époque.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "2 000 exemples, batch_size = 64 : pas par époque =", attendu: 32, placeholder: "ex. 10", indice: "2 000 / 64 = 31,25 : le dernier lot, incomplet, compte aussi.", bravo: "32 pas par époque (31 lots pleins + 1 lot de 16).", surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "descente-gradient", etapes: etapes,
    fin: { texte: "<ul><li>Optimisation : mesurer la perte, bouger les paramètres, recommencer.</li><li>Gradient de la MSE : (2/n) Xᵀ(XΘ − Y) ; pas : Θ ← Θ − η∇.</li><li>η trop petit : lent ; trop grand : divergence.</li><li>Époque = un passage sur les données ; batch = exemples utilisés pour un pas.</li></ul>", cartes: "rappels-optimisation" }
  });
})();
