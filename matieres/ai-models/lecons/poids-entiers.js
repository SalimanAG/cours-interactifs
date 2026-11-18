/* Leçon : Des poids réels aux poids entiers (notes « réseaux à seuil, W ∈ ℝⁿ → ℚⁿ → … »).
   Fil rouge : un processeur bipolaire à 2 entrées, poids réels w = (√2, −π/4), seuil θ = 1/2 (construit pour la leçon),
   ramené à des poids rationnels puis entiers. Échauffement ℚ → ℤ : w = (1/2, −2/3), θ = 1/4. */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var WR = [Math.SQRT2, -Math.PI / 4], TR = 0.5;
  var ETATS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  function z(w, t, y) { return w[0] * y[0] + w[1] * y[1] - t; }
  var DELTA = Math.min.apply(null, ETATS.map(function (y) { return Math.abs(z(WR, TR, y)); })); // √2 − π/4 − 1/2 ≈ 0,1288
  var BORNE = DELTA / 3; // δ/(n+1), n = 2
  function vec(v) { return "(" + v.map(function (a) { return A.fmt(a); }).join(", ") + ")"; }
  function tableSignes(w, t, w2, t2, nom2) {
    return A.tableau(["y", "⟨W|y⟩ − θ", "SG"].concat(w2 ? [nom2, "SG"] : []), ETATS.map(function (y) {
      var a = z(w, t, y), l = [vec(y), "<span class='mono'>" + A.fmt(a) + "</span>", "<span class='mono'>" + A.fmt(A.SG(a)) + "</span>"];
      if (w2) { var b = z(w2, t2, y); l.push("<span class='mono'>" + A.fmt(b) + "</span>", "<span class='mono'>" + A.fmt(A.SG(b)) + "</span>"); }
      return l;
    }));
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "poids-entiers",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "L'objectif : des poids entiers",
        texte:
          "<p>Les notes s'ouvrent sur la chaîne <span class='mono'>W ∈ ℝ → ℚ → ℤ</span> : deux théorèmes montrent qu'un réseau booléen à seuil " +
          "(états {−1, +1}) à poids <b>réels</b> peut être remplacé par un réseau à poids <b>rationnels</b>, puis à poids <b>entiers</b>, " +
          "<b>topologiquement conjugué via l'identité</b> : exactement le même comportement, état par état.</p>" +
          "<p>Fil rouge : un processeur bipolaire à 2 entrées, <span class='mono'>w = (√2, −π/4)</span>, <span class='mono'>θ = 1/2</span>.</p>",
        objectif: "Dire dans quel ordre appliquer les deux théorèmes, et ce que « conjugué via l'identité » garantit.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) {
              Exercices.choix(b, {
                question: "Pour passer de poids réels à des poids entiers :",
                options: ["d'abord ℝ → ℚ, puis ℚ → ℤ", "d'abord ℚ → ℤ, puis ℝ → ℚ", "directement ℝ → ℤ en arrondissant"],
                bonne: 0,
                expliquer: ["Exact : on ne sait multiplier par un dénominateur commun que si les poids sont déjà des fractions.", "Non : ℚ → ℤ demande des poids déjà rationnels.", "Non : un arrondi grossier peut changer des signes ; les notes passent par ℚ."],
                surReussite: ok
              });
            },
            function (b, ok) {
              Exercices.choix(b, {
                question: "« Conjugué via l'identité φ(x) = x » signifie que…",
                options: ["pour tout état, les deux réseaux donnent le même état suivant", "les deux réseaux ont les mêmes poids", "les deux réseaux ont le même nombre d'états fixes, mais pas forcément les mêmes"],
                bonne: 0,
                expliquer: ["Exact : φ ∘ A = Â ∘ φ avec φ = id donne A = Â comme fonctions.", "Non : justement, les poids changent.", "Non : c'est bien plus fort, ils coïncident état par état."],
                surReussite: ok
              });
            }
          ], "On cherche Ŵ, θ̂ tels que SG(Wx − θ) = SG(Ŵx − θ̂) pour tout état x.");
          A.note(zone, "Le titre des notes écrit ℝⁿ → ℚⁿ → <b>ℕ</b>ⁿ, mais le théorème démontré donne des poids dans <b>ℤ</b> (ils peuvent être négatifs).");
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "De ℚ à ℤ : multiplier par le ppcm",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Théorème (notes)</span>" +
          "Soit A = ⟨n, {−1,+1}, W, θ⟩ avec wᵢᴶ ∈ ℚ et θ_J ∈ ℚ. Il existe Â = ⟨n, {−1,+1}, Ŵ, θ̂⟩, topologiquement conjugué via l'identité, avec ŵᵢᴶ ∈ ℤ et θ̂ ∈ ℤ.</div>" +
          "<p>Preuve : wᵢᴶ = pᵢᴶ/qᵢᴶ, θ_J = r_J/s_J ; <span class='mono'>d = ppcm(qᵢᴶ, s_J)</span> (pour les dénominateurs ≠ 1) ; " +
          "<span class='mono'>Ŵ = d·W, θ̂ = d·θ</span>.</p>" +
          "<p>Échauffement : <span class='mono'>w = (1/2, −2/3)</span>, <span class='mono'>θ = 1/4</span>.</p>",
        objectif: "Calculer d, puis le poids et le seuil entiers.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "d =", attendu: 12, placeholder: "ex. 6", indice: "ppcm(2, 3, 4).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "ŵ₂ = d × (−2/3) =", attendu: -8, placeholder: "ex. 6", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "θ̂ =", attendu: 3, placeholder: "ex. 6", surReussite: ok }); }
          ], "Ŵ = (6, −8), θ̂ = 3 : tout est entier.");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Pourquoi le comportement ne change pas",
        texte:
          "<p>La preuve tient en une ligne : on doit montrer φ ∘ A = Â ∘ φ avec φ = identité, donc</p>" +
          "<div class='formule'>SG(Wx − θ) = SG(d·(Wx − θ)) = SG(dWx − dθ) = SG(Ŵx − θ̂)</div>",
        objectif: "Classer les affirmations sur ce calcul.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "SG(12 z) = SG(z) pour tout réel z.", vrai: true, explication: "Multiplier par un nombre > 0 ne change pas le signe (ni le cas z = 0)." },
              { texte: "Le calcul resterait vrai avec d = −12.", vrai: false, explication: "Non : un facteur négatif inverse les signes." },
              { texte: "N'importe quel multiple commun positif des dénominateurs conviendrait, pas seulement le ppcm.", vrai: true, explication: "Oui : il suffit que d > 0 et que d·W, d·θ soient entiers ; le ppcm donne les plus petits entiers." },
              { texte: "Il faut supposer le réseau strictement séparateur pour ce théorème.", vrai: false, explication: "Non : cette hypothèse ne sert qu'au passage ℝ → ℚ." }
            ],
            surReussite: function () { api.valider("Le point clé : d > 0."); }
          });
          A.note(zone, "Les notes écrivent d = ppcm(qᵢᴶ, s_J) « pour tout qᵢᴶ ≠ 1 et s_J ≠ 1 » sans dire que d > 0 ; " +
            "c'est ce qui rend l'égalité SG(z) = SG(d·z) vraie (un ppcm de dénominateurs positifs est positif).");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "De ℝ à ℚ : la marge δ",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Théorème (notes)</span>" +
          "Même énoncé avec wᵢᴶ ∈ ℝ, θ_J ∈ ℝ : il existe un réseau conjugué via l'identité à poids et seuils dans ℚ.</div>" +
          "<p>On suppose A <b>strictement séparateur</b> (sinon on le remplace par un réseau équivalent qui l'est). On calcule</p>" +
          "<div class='formule'>δ = min { |⟨Wᴶ, x⟩ − θ_J| : J ∈ {1,…,n}, x ∈ {−1,+1}ⁿ }</div>" +
          "<p>Comme A est strictement séparateur et que l'espace des états est fini, <b>δ &gt; 0</b>. Voici les valeurs pour le fil rouge :</p>",
        objectif: "Lire δ dans la table (3 décimales).",
        installer: function (zone, api) {
          A.html(zone, tableSignes(WR, TR));
          Exercices.nombre(zone, { label: "δ ≈", attendu: DELTA, tolerance: 0.0015, placeholder: "ex. 0,5", indice: "Le plus petit écart au seuil, en valeur absolue.", surReussite: function () {
            api.valider("δ ≈ 0,129, atteint pour y = (1, 1) : c'est l'état le plus proche du seuil.");
          } });
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Approcher par des rationnels",
        texte:
          "<p>ℚ est dense dans ℝ : pour chaque poids et chaque seuil il existe un rationnel à moins de <span class='mono'>δ/(n+1)</span>. Ici n = 2, " +
          "donc il faut <span class='mono'>|wᵢ − ŵᵢ| &lt; δ/3 ≈ " + A.fmt(BORNE) + "</span>.</p>" +
          "<p>Remarques des notes : si un poids est déjà rationnel, on le garde (ici θ = 1/2) ; si |wᵢ| &lt; δ/(n+1), on peut prendre ŵᵢ = 0.</p>",
        objectif: "Proposer un rationnel pour √2, puis pour −π/4 (une décimale suffit).",
        installer: function (zone, api) {
          var w1 = null;
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "ŵ₁ ≈ √2 :", attendu: WR[0], tolerance: BORNE - 1e-9, placeholder: "ex. 7/5", indice: "√2 ≈ 1,414 ; il faut rester à moins de 0,043.", surReussite: function (v) { w1 = v; ok(); } }); },
            function (b, ok) { Exercices.nombre(b, { label: "ŵ₂ ≈ −π/4 :", attendu: WR[1], tolerance: BORNE - 1e-9, placeholder: "ex. −4/5", indice: "π/4 ≈ 0,785.", surReussite: function (v) {
              A.html(b, "<p>Comparaison sur les 4 états (θ̂ = θ = 1/2) :</p>" + tableSignes(WR, TR, [w1, v], TR, "⟨Ŵ|y⟩ − θ̂"));
              ok();
            } }); }
          ], "Tous les signes sont conservés : SG ne voit pas la différence.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "L'inégalité clé",
        texte:
          "<p>But : <span class='mono'>⟨Wᴶ|x⟩ − θ_J − δ &lt; ⟨Ŵᴶ|x⟩ − θ̂_J &lt; ⟨Wᴶ|x⟩ − θ_J + δ</span>. " +
          "On majore l'écart entre les deux quantités, en utilisant |xᵢ| = 1.</p>",
        objectif: "Remettre les lignes du calcul dans l'ordre.",
        installer: function (zone, api) {
          Exercices.ordonner(zone, {
            consigne: "Touche les lignes dans l'ordre du calcul.",
            separateur: "",
            items: [
              "|(⟨Ŵ|x⟩ − θ̂) − (⟨W|x⟩ − θ)|",
              "= |Σᵢ (ŵᵢ − wᵢ)xᵢ − (θ̂ − θ)|",
              "≤ Σᵢ |ŵᵢ − wᵢ|·|xᵢ| + |θ̂ − θ|",
              "< n·δ/(n+1) + δ/(n+1)",
              "= δ"
            ],
            surReussite: function () { api.valider("Les n poids et le seuil contribuent chacun moins de δ/(n+1) : d'où le choix de n + 1 au dénominateur."); }
          });
          A.note(zone, "Les notes majorent directement Σ ŵᵢxᵢ par Σ (wᵢ + δ/(n+1))xᵢ, puis utilisent xᵢ ≤ 1. " +
            "Quand xᵢ = −1, multiplier l'inégalité ŵᵢ &lt; wᵢ + δ/(n+1) par xᵢ en change le sens : l'argument correct passe par les valeurs absolues, comme ci-dessus. " +
            "La conclusion des notes est juste.");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Les deux cas, puis jusqu'aux entiers",
        texte:
          "<p>On sait que pour chaque processeur et chaque état, <span class='mono'>|⟨Wᴶ|x⟩ − θ_J| ≥ δ &gt; 0</span>. Deux cas possibles :</p>",
        objectif: "Conclure les deux cas, puis rendre entiers les poids du fil rouge.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) {
              Exercices.associer(b, {
                consigne: "Pour chaque hypothèse, que peut-on conclure sur ⟨Ŵᴶ|x⟩ − θ̂_J ?",
                categories: ["< 0", "> 0"],
                items: [
                  { texte: "⟨Wᴶ|x⟩ − θ_J &lt; 0, donc ≤ −δ ; et ⟨Ŵᴶ|x⟩ − θ̂_J &lt; ⟨Wᴶ|x⟩ − θ_J + δ", bonne: 0 },
                  { texte: "⟨Wᴶ|x⟩ − θ_J &gt; 0, donc ≥ δ ; et ⟨Ŵᴶ|x⟩ − θ̂_J &gt; ⟨Wᴶ|x⟩ − θ_J − δ", bonne: 1 }
                ],
                surReussite: ok
              });
            },
            function (b, ok) {
              A.html(b, "<p>Donc <span class='mono'>SG(⟨Wᴶ|x⟩ − θ_J) = SG(⟨Ŵᴶ|x⟩ − θ̂_J)</span> ∎. Enchaînons avec ℚ → ℤ sur le fil rouge : " +
                "<span class='mono'>ŵ = (7/5, −4/5)</span>, <span class='mono'>θ̂ = 1/2</span>.</p>");
              Exercices.nombre(b, { label: "d = ppcm(5, 5, 2) =", attendu: 10, placeholder: "ex. 6", surReussite: ok });
            },
            function (b, ok) {
              Exercices.texte(b, { label: "Poids entiers (a, b) :", attendu: ["(14, -8)", "(14,-8)", "14, -8", "14,-8", "(14, −8)", "(14,−8)", "14, −8", "14,−8"], mode: "souple", verdict: false, placeholder: "(a, b)", indice: "10 × 7/5 et 10 × (−4/5).", surReussite: ok });
            }
          ], "Le processeur w = (√2, −π/4), θ = 1/2 se comporte exactement comme w = (14, −8), θ = 5.");
          A.note(zone, "Dans les notes, le cas 1 est écrit « ⟨Wᴶ|x⟩ &lt; 0 » et le cas 2 « ⟨Wᴶ|x⟩ &gt; 0 » : il faut lire ⟨Wᴶ|x⟩ − θ_J, " +
            "comme dans les lignes de calcul qui suivent.");
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : ℝ → ℚ en approchant chaque poids et seuil à moins de <span class='mono'>δ/(n+1)</span> " +
        "(δ = plus petit écart au seuil, &gt; 0 si le réseau est strictement séparateur) ; ℚ → ℤ en multipliant par <span class='mono'>d = ppcm des dénominateurs &gt; 0</span>. " +
        "Dans les deux cas, SG ne change sur aucun état.</p>",
      cartes: "structure"
    }
  });
})();
