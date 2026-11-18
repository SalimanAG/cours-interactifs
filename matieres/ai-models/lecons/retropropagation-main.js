/* Leçon : La rétropropagation à la main (notes « AIMA : backpropagation »).
   Fil rouge : un réseau 2-2-1 à sigmoïdes, inventé pour la leçon. Entrées x₁, x₂ ; neurones cachés c₁, c₂ ; sortie s.
   c₁ : w = (0,6 ; 0,2), θ = 0,1 — c₂ : w = (−0,3 ; 0,4), θ = −0,2 — s : w = (0,7 ; −0,5), θ = 0,2 — ε = 0,5.
   Exemple d'apprentissage : x = (1, 0), sortie voulue O = 1. Notation des notes : R = ⟨W|x⟩ − θ, S = sigmoïde(R). */
(function () {
  "use strict";
  var A = AIM, el = Site.el, S = Reseau.sigmoide, f = Reseau.fmt;
  var COUCHES = [["x₁", "x₂"], ["c₁", "c₂"], ["s"]];
  var WC = [[0.6, 0.2], [-0.3, 0.4]], TC = [0.1, -0.2], WS = [0.7, -0.5], TS = 0.2, EPS = 0.5;
  function avant(x, wc, ws) {
    wc = wc || WC; ws = ws || WS;
    var rc = wc.map(function (w, k) { return w[0] * x[0] + w[1] * x[1] - TC[k]; }), sc = rc.map(S);
    var rs = ws[0] * sc[0] + ws[1] * sc[1] - TS;
    return { rc: rc, sc: sc, rs: rs, ss: S(rs) };
  }
  var X = [1, 0], O = 1, P = avant(X);
  var DS = (P.ss - O) * P.ss * (1 - P.ss);
  var DC = [0, 1].map(function (k) { return P.sc[k] * (1 - P.sc[k]) * DS * WS[k]; });
  var WS2 = WS.map(function (w, k) { return w - EPS * DS * P.sc[k]; });
  var WC2 = WC.map(function (w, k) { return w.map(function (v, j) { return v - EPS * DC[k] * X[j]; }); });
  var P2 = avant(X, WC2, WS2);

  function figure(zone, neur, cl, ws, wc) {
    var r = new Reseau(A.cadre(zone), { couches: COUCHES, hauteur: 170 });
    r.dessiner({ aretes: Reseau.aretesDepuis([wc || WC, [ws || WS]], cl), neurones: neur || {} });
    return r;
  }
  function n(b, label, attendu, ok, indice, tol) { Exercices.nombre(b, { label: label, attendu: attendu, tolerance: tol === undefined ? 0.002 : tol, placeholder: "ex. 0,25", indice: indice, surReussite: ok }); }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "retropropagation-main",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Les règles de construction",
        texte:
          "<p>La renormalisation a « remarquablement compliqué » la compréhension d'un réseau booléen à seuil ; apprendre sur des réseaux quelconques serait encore plus difficile. " +
          "On impose donc une structure très rigide : les réseaux <b>feed-forward</b> (FFN), en couches d'entrée, cachées et de sortie.</p>" +
          "<div class='encadre'><span class='titre-encadre'>Règles de construction (notes)</span>1 — pas de boucles ; 2 — pas de connexions entre neurones de la même couche ; " +
          "3 — les neurones de la couche i peuvent être connectés <b>seulement</b> à ceux de la couche i + 1.</div>",
        objectif: "Trouver le seul réseau feed-forward, puis la règle violée par chacun des deux autres.",
        installer: function (zone, api) {
          var base = Reseau.aretesDepuis([[[1, 1], [1, 1]], [[1, 1]]]).map(function (a) { a.poids = undefined; return a; });
          var R = {
            A: base.concat([{ de: [1, 0], vers: [1, 1] }]),
            B: base,
            C: base.concat([{ de: [2, 0], vers: [1, 1] }])
          };
          ["A", "B", "C"].forEach(function (k) {
            A.html(zone, "<p class='discret' style='margin:.4rem 0 0'>Réseau " + k + "</p>");
            new Reseau(A.cadre(zone), { couches: COUCHES, hauteur: 150 }).dessiner({ aretes: R[k] });
          });
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "Lequel est feed-forward ?", options: ["A", "B", "C"], bonne: 1, surReussite: ok }); },
            function (b, ok) {
              Exercices.associer(b, { categories: ["règle 1 ou 3", "règle 2"], items: [
                { texte: "Réseau A : arête c₁ → c₂", bonne: 1 },
                { texte: "Réseau C : arête s → c₂ (retour en arrière, crée une boucle)", bonne: 0 }
              ], surReussite: ok });
            }
          ], "Même avec ces contraintes plutôt fortes, on va pouvoir faire de l'apprentissage efficace.");
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Apprendre = minimiser l'EQM",
        texte:
          "<p>Un réseau calcule une fonction f, qu'on change en agissant sur la matrice de connexion et sur le vecteur des seuils. " +
          "<b>Apprendre</b> : trouver W et θ (de taille minimale si possible) tels que f <b>approxime bien</b> une fonction objectif O, connue seulement par des <b>exemples</b> " +
          "(x₁, …, xₙ, y₁, …, yₘ) avec O(x) = y (exemple positif ; négatif si O(x) ≠ y).</p>" +
          "<div class='formule'>EQM(f, O) = ½ Σᵢ ‖fᵢ − Oᵢ‖²</div>" +
          "<p>f approxime bien O si l'EQM est plus petite qu'une précision ε fixée. Voici le fil rouge et deux exemples : " +
          "x = (1, 0), O = 1 donne f = " + f(P.ss) + " ; x = (0, 1), O = 0 donne f = " + f(avant([0, 1]).ss) + ".</p>",
        objectif: "Calculer l'EQM sur ces deux exemples.",
        installer: function (zone, api) {
          figure(zone);
          var e = 0.5 * (Math.pow(P.ss - 1, 2) + Math.pow(avant([0, 1]).ss, 2));
          n(zone, "EQM =", e, function () { api.valider("½ (0,2504 + 0,2127) ≈ 0,232. L'EQM ne dépend que des fᵢ : les Oᵢ sont des constantes connues."); }, "½ ((0,4996 − 1)² + (0,4612 − 0)²).");
          A.note(zone, "Les notes écrivent la somme « pour i ∈ [0, k] » avec k = cardinal de l'ensemble des exemples : cela ferait k + 1 termes. Il faut lire i = 1 … k (un terme par exemple).");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Descendre la pente",
        texte:
          "<p>Idée : après une étape de calcul, modifier la matrice de connexion pour faire un pas vers le minimum de l'EQM, retraiter les mêmes données, et ainsi de suite " +
          "jusqu'à ce que l'EQM soit assez petite. On cherche la direction de descente maximale :</p>" +
          "<div class='formule'>ΔW = − ε · ∂EQM / ∂W</div>" +
          "<p>ε ∈ (0, 1) est le <b>taux d'apprentissage</b> ; le signe − indique qu'on descend.</p>",
        objectif: "Calculer un pas de descente.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "∂EQM/∂w = 0,4 et ε = 0,5 : Δw =", -0.2, ok, "−ε × dérivée.", 1e-9); },
            function (b, ok) { A.choix(b, { question: "Si ∂EQM/∂w < 0, le pas fait…", options: ["augmenter w", "diminuer w", "ne change rien"], bonne: 0, expliquer: ["Exact : l'EQM baisse quand w augmente, on va dans ce sens.", "Non : −ε × (négatif) est positif.", "Non."], surReussite: ok }); }
          ], "On descend toujours à contre-sens du gradient.");
          A.note(zone, "Les notes parlent d'une « fonction concave » alors que leur dessin montre un bol (une fonction <b>convexe</b>, dont on cherche le minimum). " +
            "Elles écrivent aussi ΔW = −ε (∂EQM/∂W) · ½ ; le ½ disparaît ensuite dans le calcul (½ · 2(S − O) = S − O). On suit ici la forme ΔW = −ε ∂EQM/∂W, celle des calculs des notes.");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "La passe avant",
        texte:
          "<p>Notations des notes : indice e pour l'entrée, c pour la couche cachée, s pour la sortie. Pour chaque neurone : " +
          "<span class='mono'>R = ⟨W|x⟩ − θ</span> puis <span class='mono'>S = 1/(1 + e^(−R))</span>. " +
          "Seuils : θ(c₁) = 0,1 ; θ(c₂) = −0,2 ; θ(s) = 0,2. Entrée x = (1, 0).</p>",
        objectif: "Calculer R et S pour c₁, puis S pour la sortie.",
        installer: function (zone, api) {
          var r = figure(zone, { "0,0": { haut: "1" }, "0,1": { haut: "0" } });
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "R(c₁) =", P.rc[0], ok, "0,6·1 + 0,2·0 − 0,1."); },
            function (b, ok) { n(b, "S(c₁) =", P.sc[0], ok, "1/(1 + e^(−0,5))."); },
            function (b, ok) {
              r.dessiner({ aretes: Reseau.aretesDepuis([WC, [WS]]), neurones: { "0,0": { haut: "1" }, "0,1": { haut: "0" }, "1,0": { haut: "S=" + f(P.sc[0]) }, "1,1": { haut: "S=" + f(P.sc[1]) }, "2,0": { classe: "courant" } } });
              A.html(b, "<p>S(c₂) = " + f(P.sc[1]) + " (R = −0,3 + 0,2 = −0,1).</p>");
              n(b, "S(s) =", P.ss, ok, "R(s) = 0,7·S(c₁) − 0,5·S(c₂) − 0,2 ≈ −0,0018.");
            }
          ], "Sortie ≈ 0,4996 pour une cible de 1 : il faut apprendre.");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "La dérivée de la sigmoïde",
        texte:
          "<div class='formule lignes'>∂/∂x (1/(1 + e⁻ˣ)) = e⁻ˣ / (1 + e⁻ˣ)²\n  = 1/(1 + e⁻ˣ) · e⁻ˣ/(1 + e⁻ˣ)\n  = S(1 − S)</div>" +
          "<p>Pratique : la dérivée se calcule à partir de la valeur S déjà obtenue pendant la passe avant.</p>",
        objectif: "Calculer ∂S/∂R pour la sortie, puis la valeur maximale de S(1 − S).",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "S(s)(1 − S(s)) =", P.ss * (1 - P.ss), ok, "S(s) ≈ 0,4996."); },
            function (b, ok) { n(b, "Valeur maximale de S(1 − S) :", 0.25, ok, "Atteinte pour S = 1/2.", 1e-6); }
          ], "S(1 − S) ≤ 1/4 : chaque couche sigmoïde multiplie le gradient par au plus 1/4.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Le δ de la sortie",
        texte:
          "<p>Pour une sortie s et une connexion venant du neurone c de la couche juste en dessous :</p>" +
          "<div class='formule lignes'>ΔW_c^s = −ε · ∂EQM/∂S_s · ∂S_s/∂R_s · ∂R_s/∂W_c^s\n       = −ε (S_s − O_s) S_s(1 − S_s) x_c = −ε δ_s x_c</div>" +
          "<p>avec ∂EQM/∂S_s = ½ · 2 (S_s − O_s) et ∂R_s/∂W_c^s = x_c (ici x_c = S(c), la sortie du neurone caché).</p>",
        objectif: "Calculer δ_s puis ΔW de c₁ vers s.",
        installer: function (zone, api) {
          figure(zone, { "2,0": { haut: "S=" + f(P.ss), classe: "courant" }, "1,0": { haut: "S=" + f(P.sc[0]) } }, { "1,0,0": "courant" });
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "δ_s =", DS, ok, "(0,4996 − 1) × 0,25."); },
            function (b, ok) { n(b, "ΔW_c₁^s =", -EPS * DS * P.sc[0], ok, "−0,5 × δ_s × S(c₁)."); }
          ], "δ_s < 0 (sortie trop basse) : le poids de c₁ vers s augmente, d'environ 0,039.");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Rétropropager δ dans la couche cachée",
        texte:
          "<p>Un neurone caché c n'apparaît pas dans l'EQM ; il y contribue à travers ses successeurs D(S_c) (les neurones de la couche supérieure qui l'ont en entrée) :</p>" +
          "<div class='formule lignes'>∂EQM/∂S_c = Σ_k ∂EQM/∂S_k · ∂S_k/∂S_c\nδ_c = S_c(1 − S_c) · Σ_(k ∈ D(S_c)) δ_k W_c^k\nΔW_j^c = −ε δ_c S_j</div>" +
          "<p>Ici D(c₁) = {s}, et S_j = x_j pour la couche d'entrée.</p>",
        objectif: "Calculer δ_c₁ puis ΔW de x₁ vers c₁.",
        installer: function (zone, api) {
          figure(zone, { "1,0": { haut: "S=" + f(P.sc[0]), classe: "courant" }, "2,0": { bas: "δ=" + f(DS) } }, { "1,0,0": "courant", "0,0,0": "courant" });
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "δ_c₁ =", DC[0], ok, "S(c₁)(1 − S(c₁)) × δ_s × 0,7.", 0.0005); },
            function (b, ok) { n(b, "ΔW_x₁^c₁ =", -EPS * DC[0] * X[0], ok, "−0,5 × δ_c₁ × x₁.", 0.0005); },
            function (b, ok) { n(b, "ΔW_x₂^c₁ =", 0, ok, "x₂ = 0.", 1e-6); }
          ], "Le signal d'erreur remonte en arrière, pondéré par les poids qu'il traverse : d'où le nom de rétropropagation.");
          A.note(zone, "Les notes écrivent δ de trois façons : en sortie δ_s = (S_s − O_s) S_s(1 − S_s) ; dans le calcul caché Σ δ_k S_k(1 − S_k) W (le facteur S_k(1 − S_k) y est compté deux fois) ; " +
            "dans l'encadré « Attention », le δ caché est Σ δ_k S_k(1 − S_k) W_c^k sans le facteur S_c(1 − S_c). On utilise ici la forme cohérente : " +
            "δ_c = S_c(1 − S_c) Σ δ_k W_c^k et ΔW_j^c = −ε δ_c S_j. Les notes ne mettent pas non plus à jour les seuils θ : ils restent fixes dans cette leçon.");
        }
      },

      /* 8 ─────────────────────────────────────────────── */
      {
        titre: "Mettre à jour et vérifier",
        texte:
          "<p>On applique tous les ΔW (ε = 0,5). Nouveaux poids vers s : (" + f(WS2[0]) + " ; " + f(WS2[1]) + ") ; de x₁ vers c₁ : " + f(WC2[0][0]) + ", vers c₂ : " + f(WC2[1][0]) + ".</p>",
        objectif: "Calculer la nouvelle sortie et la nouvelle EQM de l'exemple.",
        installer: function (zone, api) {
          var r = figure(zone, { "2,0": { classe: "courant" } }, null, WS2, WC2);
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Nouvelle sortie S(s) =", P2.ss, ok, "Refais la passe avant avec les nouveaux poids.", 0.002); },
            function (b, ok) { n(b, "Nouvelle EQM (cet exemple) =", 0.5 * Math.pow(P2.ss - 1, 2), ok, "½ (S − 1)².", 0.001); }
          ], "EQM : 0,1252 → 0,1201. Un petit pas dans la bonne direction ; l'algorithme recommence sur tous les exemples jusqu'à la condition d'arrêt.");
          r.dessiner({ aretes: Reseau.aretesDepuis([WC2, [WS2]]), neurones: { "0,0": { haut: "1" }, "0,1": { haut: "0" }, "2,0": { classe: "courant" } } });
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : <span class='mono'>ΔW = −ε ∂EQM/∂W</span> ; sortie : <span class='mono'>δ_s = (S_s − O_s) S_s(1 − S_s)</span> ; " +
        "caché : <span class='mono'>δ_c = S_c(1 − S_c) Σ δ_k W_c^k</span> ; dans les deux cas <span class='mono'>ΔW = −ε δ × (sortie du neurone de départ)</span>.</p>",
      cartes: "retropropagation"
    }
  });
})();
