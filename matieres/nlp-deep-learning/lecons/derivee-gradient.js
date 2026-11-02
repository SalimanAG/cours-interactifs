/* Leçon 0.3 : Pente, dérivée, gradient (prérequis, hors diapos ; liens : cours 1,
   diapos 21 à 24 — optimisation et descente de gradient).
   Fil rouge : une perte en forme de cuvette, L(θ) = (θ − 3)², puis à deux paramètres. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  function L(t) { return (t - 3) * (t - 3); }

  var etapes = [
    {
      titre: "La pente d'une droite",
      texte:
        "<p>La <b>pente</b> d'une droite mesure de combien y monte quand x augmente de 1 :</p>" +
        "<div class='formule'>pente = Δy / Δx = (y₂ − y₁) / (x₂ − x₁)</div>" +
        "<p>Pente positive : la droite monte ; négative : elle descend ; nulle : elle est horizontale.</p>",
      objectif: "Calculer la pente de la droite qui passe par (1 ; 2) et (3 ; 6).",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "pente =", attendu: 2, placeholder: "ex. 1,5", indice: "Δy = 6 − 2, Δx = 3 − 1.", bravo: "4 / 2 = 2 : y monte de 2 quand x augmente de 1.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "La dérivée : la pente en un point",
      texte:
        "<p>Pour une courbe, la pente change d'un point à l'autre. La <b>dérivée</b> f′(θ) est la pente de la courbe au point θ " +
        "(celle de la tangente) : la limite de <span class='mono'>(f(θ + h) − f(θ)) / h</span> quand h devient très petit. C'est le « δloss / δθ » du cours.</p>" +
        "<p>Règles utiles (complément) :</p>" +
        N.tableau(["fonction", "dérivée"], [[m("c (constante)"), m("0")], [m("c·θ"), m("c")], [m("θ²"), m("2θ")], [m("(u(θ))²"), m("2·u(θ)·u′(θ)")], [m("f + g"), m("f′ + g′")]]) +
        "<p>Notre perte : L(θ) = (θ − 3)². Avec la dernière règle (u = θ − 3, u′ = 1) : <span class='mono'>L′(θ) = 2(θ − 3)</span>. Déplace θ pour voir la pente.</p>",
      objectif: "Trouver la valeur de L′(1).",
      installer: function (zone, api) {
        var c = N.cadre(zone), g = new Courbes(c, { largeur: 340, hauteur: 190 }), leg = N.legende(zone);
        function maj(t) {
          var p = 2 * (t - 3);
          g.dessiner({ xmin: 0, xmax: 6, ymax: 10, nomX: "θ", fonctions: [{ label: "L(θ)", f: L }, { label: "tangente", f: function (x) { return L(t) + p * (x - t); }, classe: "ref" }], marque: { x: t, texte: "θ" } });
          leg.innerHTML = "<span>θ = " + m(fmt(t, 1)) + "</span><span>L(θ) = " + m(fmt(L(t))) + "</span><span>pente L′(θ) = " + m(fmt(p)) + "</span>";
        }
        N.curseur(zone, { label: "θ =", min: 0.5, max: 5.5, pas: 0.5, valeur: 4, surChange: maj });
        maj(4);
        Exercices.nombre(zone, { label: "L′(1) =", attendu: -4, placeholder: "ex. 2", indice: "L′(θ) = 2(θ − 3), avec θ = 1.", bravo: "2 × (1 − 3) = −4 : en θ = 1 la courbe descend fortement.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Le signe de la dérivée dit où descendre",
      texte:
        "<p>Si L′(θ) &lt; 0, la perte <b>baisse</b> quand θ augmente ; si L′(θ) &gt; 0, elle baisse quand θ <b>diminue</b>. Au fond de la cuvette, la pente est nulle : L′(θ) = 0.</p>",
      objectif: "Choisir dans quel sens bouger θ, puis trouver le minimum.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "En θ = 1, L′(1) = −4. Pour faire baisser la perte, il faut…", options: ["augmenter θ", "diminuer θ", "ne rien changer"], bonne: 0, expliquer: ["Exact : on va dans le sens opposé à la pente, donc vers la droite.", "Non : la pente est négative, diminuer θ fait remonter la perte.", "Non : la pente n'est pas nulle, on n'est pas au minimum."], surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "θ où L′(θ) = 0 :", attendu: 3, placeholder: "ex. 2", indice: "Résous 2(θ − 3) = 0.", surReussite: ok }); }
        ], "Bouger θ dans le sens <b>opposé</b> à la dérivée : c'est toute l'idée de la descente de gradient.");
      }
    },
    {
      titre: "Plusieurs paramètres : dérivées partielles et gradient",
      texte:
        "<p>Une perte dépend en général de plusieurs paramètres. La <b>dérivée partielle</b> ∂L/∂a est la dérivée par rapport à a, les autres paramètres étant fixés. " +
        "Le <b>gradient</b> ∇L rassemble toutes les dérivées partielles dans un vecteur :</p>" +
        "<div class='formule'>L(a, b) = a² + 3b²        ∇L(a, b) = (∂L/∂a ; ∂L/∂b) = (2a ; 6b)</div>",
      objectif: "Calculer ∇L au point (a ; b) = (1 ; 1).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "∂L/∂a (1 ; 1) =", attendu: 2, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "∂L/∂b (1 ; 1) =", attendu: 6, placeholder: "ex. 1", surReussite: ok }); }
        ], "∇L(1 ; 1) = (2 ; 6). Le gradient pointe dans la direction où L <b>augmente</b> le plus vite ; ici, surtout selon b.");
      }
    },
    {
      titre: "Un pas de descente de gradient",
      texte:
        "<p>Le cours 1 (diapo 24) : <span class='mono'>Θ ← Θ − η · ∇Θ L</span>, où η est le <b>taux d'apprentissage</b> (learning rate). On recule d'un petit pas dans la direction du gradient.</p>" +
        "<p>Depuis (a ; b) = (1 ; 1), avec ∇L = (2 ; 6) et η = 0,1.</p>",
      objectif: "Calculer le nouveau point après un pas.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "nouveau a =", attendu: 0.8, placeholder: "ex. 0,5", indice: "1 − 0,1 × 2.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "nouveau b =", attendu: 0.4, placeholder: "ex. 0,5", indice: "1 − 0,1 × 6.", surReussite: ok }); }
        ], "L passe de 1 + 3 = 4 à 0,64 + 0,48 = 1,12 : un seul pas a fait baisser la perte. On répète jusqu'à ce qu'elle ne baisse plus.");
      }
    },
    {
      titre: "Dériver une erreur au carré",
      texte:
        "<p>Ce calcul revient dans toute la régression : pour un exemple (x, y) et la prédiction ŷ = a·x, l'erreur au carré est ℓ(a) = (a·x − y)². Avec la règle (u²)′ = 2u·u′ et u′ = x :</p>" +
        "<div class='formule'>dℓ/da = 2 (a·x − y) · x</div>",
      objectif: "Calculer dℓ/da pour x = 2, y = 3 et a = 1.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "dℓ/da =", attendu: -4, placeholder: "ex. 1", indice: "2 × (1·2 − 3) × 2.", bravo: "−4 : négatif, donc il faut augmenter a (la prédiction 2 est trop basse par rapport à 3).", surReussite: function () { api.valider("Ces dérivées sont calculées automatiquement par les bibliothèques (rétropropagation), mais il faut savoir ce qu'elles signifient."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "derivee-gradient", etapes: etapes,
    fin: { texte: "<ul><li>Dérivée = pente en un point ; L′ = 0 au fond de la cuvette.</li><li>Pour faire baisser L : aller dans le sens opposé à la dérivée.</li><li>Gradient = vecteur des dérivées partielles ; il pointe vers la plus forte hausse.</li><li>Un pas : Θ ← Θ − η∇L.</li><li>d/da (a·x − y)² = 2(a·x − y)·x.</li></ul>", cartes: "prerequis" }
  });
})();
