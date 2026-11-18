/* Leçon : Booléen ou bipolaire — la conjugaison topologique (notes « Topological conjugacy & structure theorems »).
   Fil rouge : le réseau booléen B = ⟨2, {0,1}, W, θ⟩, W = (2 2 ; −2 2), θ = (2, 1) (construit pour la leçon :
   sa version bipolaire a pour première ligne exactement l'exemple des notes, W = (1, 1), θ = 0). */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var WB = [[2, 2], [-2, 2]], TB = [2, 1];            // réseau booléen
  var WP = [[1, 1], [-1, 1]], TP = [0, 1];            // réseau bipolaire conjugué
  function ps(w, x) { return w.reduce(function (s, v, i) { return s + v * x[i]; }, 0); }
  function f(x) { return WB.map(function (w, i) { return A.H(ps(w, x) - TB[i]); }); }
  function g(y) { return WP.map(function (w, i) { return A.SG(ps(w, y) - TP[i]); }); }
  function phi(x) { return x.map(function (v) { return 2 * v - 1; }); }
  function vec(v) { return "(" + v.map(function (a) { return A.fmt(a); }).join(", ") + ")"; }
  var ETATS = [[0, 0], [0, 1], [1, 0], [1, 1]];
  function variantes(v) {
    var r = [];
    ["-", "−"].forEach(function (moins) {
      [false, true].forEach(function (plus) {
        var t = v.map(function (a) { return a < 0 ? moins + (-a) : (plus ? "+" : "") + a; });
        [", ", ","].forEach(function (sep) { var c = t.join(sep); r.push(c, "(" + c + ")"); });
      });
    });
    return r;
  }
  function matrice(zone, nom, M, cls) {
    var mx = new Matrice(A.cadre(zone), { nom: nom, lignes: ["ligne 1", "ligne 2"], colonnes: ["x₁", "x₂"] });
    mx.dessiner(M.map(function (l) { return l.map(function (v) { return A.frac(v); }); }), { format: String, classes: cls || {} });
    return mx;
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "booleen-bipolaire",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Deux systèmes qui se comportent pareil",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Rappel (notes)</span>" +
          "Un système ⟨X, f⟩ est <b>topologiquement conjugué</b> à ⟨Y, g⟩ s'il existe un <b>homéomorphisme</b> φ : X → Y tel que le diagramme commute :" +
          "<div class='formule lignes'>X  ──f──▶  X\n│φ        │φ\n▼         ▼\nY  ──g──▶  Y</div></div>" +
          "<p>Partir en haut à gauche, on peut aller à droite puis descendre, ou descendre puis aller à droite : on doit arriver au même point.</p>",
        objectif: "Choisir l'égalité qui dit que le diagramme commute.",
        installer: function (zone, api) {
          Exercices.choix(zone, {
            question: "Le diagramme commute si et seulement si…",
            options: ["φ ∘ f = g ∘ φ", "f ∘ φ = φ ∘ g", "g ∘ f = φ", "φ ∘ f ∘ φ = g"],
            bonne: 0,
            expliquer: [
              "Exact : f puis φ (en haut puis à droite) = φ puis g. La conjugaison est une notion d'équivalence : ⟨X, f⟩ a le même comportement que ⟨Y, g⟩.",
              "Non : f agit sur X, on ne peut pas l'appliquer après φ (qui arrive dans Y).",
              "Non : φ n'est pas une composition des deux dynamiques.",
              "Non : relis les deux chemins du diagramme."
            ],
            surReussite: function () { api.valider(); }
          });
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "L'homéomorphisme",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Définition (notes)</span>" +
          "Un homéomorphisme est une fonction φ : X → Y <b>bijective</b>, <b>continue</b>, et dont l'<b>inverse est continue</b>.</div>" +
          "<p>Ici X et Y seront les ensembles d'états {0, 1}ⁿ (booléen) et {−1, +1}ⁿ (bipolaire).</p>",
        objectif: "Classer les quatre affirmations.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "φ(x) = 2x − 1 (composante par composante) est une bijection de {0, 1}ⁿ sur {−1, +1}ⁿ.", vrai: true, explication: "0 ↦ −1, 1 ↦ +1 ; son inverse est y ↦ ½(y + 1)." },
              { texte: "La fonction constante φ(x) = (1, …, 1) est un homéomorphisme.", vrai: false, explication: "Non : elle n'est pas injective, donc pas bijective." },
              { texte: "Si ⟨X, f⟩ est conjugué à ⟨Y, g⟩, alors ⟨X, f⟩ a le même comportement que ⟨Y, g⟩.", vrai: true, explication: "C'est le sens donné dans les notes : une notion d'équivalence entre systèmes." },
              { texte: "Une bijection continue suffit toujours : l'inverse continue n'est pas demandée.", vrai: false, explication: "Non : la définition exige aussi que l'inverse soit continue." }
            ],
            surReussite: function () { api.valider("Sur des ensembles finis comme {0,1}ⁿ, la continuité ne pose pas de difficulté : ce qui compte en pratique, c'est la bijection."); }
          });
          A.note(zone, "Les notes ne précisent pas la topologie utilisée sur {0,1}ⁿ et {−1,+1}ⁿ. Avec la topologie discrète " +
            "(la topologie naturelle d'un ensemble fini), toute fonction est continue : la remarque ci-dessus est une précision ajoutée.");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Du booléen au bipolaire",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Théorème (notes)</span>" +
          "Le réseau booléen à seuil ⟨n, {0,1}, W, θ⟩ est topologiquement conjugué au réseau bipolaire ⟨n, {−1,+1}, W̃, θ̃⟩ avec" +
          "<div class='formule'>W̃ = ½ W     θ̃ = θ − ½ · W · (1, …, 1)ᵀ</div>" +
          "via l'homéomorphisme <span class='mono'>φ(x) = 2x − (1, …, 1)</span>.</div>" +
          "<p>Fil rouge : le réseau booléen <b>B</b>, avec W ci-dessous et <span class='mono'>θ = (2, 1)</span>. W · (1, 1)ᵀ = somme de chaque ligne.</p>",
        objectif: "Calculer W̃ (une case) puis les deux composantes de θ̃.",
        installer: function (zone, api) {
          matrice(zone, "W", WB);
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "W̃, ligne 2, colonne 1 =", attendu: -1, placeholder: "ex. 3", indice: "½ × (−2).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "θ̃₁ =", attendu: 0, placeholder: "ex. 3", indice: "θ₁ − ½ (2 + 2).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "θ̃₂ =", attendu: 1, placeholder: "ex. 3", indice: "θ₂ − ½ (−2 + 2).", surReussite: ok }); },
            function (b, ok) { matrice(b, "W̃", WP); A.html(b, "<p class='discret'>θ̃ = (0, 1). Le réseau bipolaire est g(y) = SG(W̃y − θ̃).</p>"); ok(); }
          ], "W̃ = (1 1 ; −1 1), θ̃ = (0, 1).");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Vérifier que le diagramme commute",
        texte:
          "<p>La preuve des notes, pour chaque processeur i (mise à jour synchrone) :</p>" +
          "<div class='formule lignes'>φ(fᵢ(x)) = 2·H(Σⱼ wⱼⁱxⱼ − θᵢ) − 1\n" +
          "  = SG(Σⱼ wⱼⁱxⱼ − θᵢ)\n" +
          "  = SG(Σⱼ ½wⱼⁱ(2xⱼ − 1)\n" +
          "       − (θᵢ − ½Σⱼ wⱼⁱ))\n" +
          "  = SG(Σⱼ w̃ⱼⁱ φ(x)ⱼ − θ̃ᵢ)\n" +
          "  = gᵢ(φ(x))</div>" +
          "<p class='discret'>1ʳᵉ ligne : définition de φ ; 2ᵉ : SG = 2H − 1 ; 3ᵉ : on développe, les termes ½Σⱼ wⱼⁱ se compensent ; 4ᵉ : définition de W̃ et θ̃.</p>" +
          "<p>Vérifions-le sur B. Calcule d'abord toi-même pour <span class='mono'>x = (1, 1)</span>.</p>",
        objectif: "Calculer g(φ(1, 1)), puis vérifier les 4 états.",
        installer: function (zone, api) {
          var vus = {};
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.texte(b, { label: "g(φ(1, 1)) =", attendu: variantes(g(phi([1, 1]))), mode: "souple", verdict: false, placeholder: "(a, b)", indice: "φ(1, 1) = (1, 1). Ligne 1 : SG(1 + 1 − 0) ; ligne 2 : SG(−1 + 1 − 1).", surReussite: ok }); },
            function (b, ok) {
              A.html(b, "<p>φ(f(1, 1)) = φ(1, 0) = (1, −1) : même résultat. Touche maintenant chaque état booléen.</p>");
              var r = el("div", "rangee-btn"); b.appendChild(r);
              var out = el("div"); b.appendChild(out);
              ETATS.forEach(function (x) {
                var bt = el("button", "btn btn-petit", vec(x)); bt.type = "button";
                bt.onclick = function () {
                  vus[x.join()] = true; bt.classList.add("btn-plein");
                  var fx = f(x), y = phi(x);
                  out.innerHTML = A.tableau(["chemin", "calcul", "résultat"], [
                    ["f puis φ", "f" + vec(x) + " = " + vec(fx) + " ; φ" + vec(fx), "<span class='mono'>" + vec(phi(fx)) + "</span>"],
                    ["φ puis g", "φ" + vec(x) + " = " + vec(y) + " ; g" + vec(y), "<span class='mono'>" + vec(g(y)) + "</span>"]
                  ]);
                  if (Object.keys(vus).length === 4) ok();
                };
                r.appendChild(bt);
              });
            }
          ], "Les deux chemins donnent toujours le même état : B et sa version bipolaire ont le même comportement.");
          A.note(zone, "Dans la preuve des notes, le seuil est écrit θ<sub>J</sub> à l'intérieur de la somme sur J ; " +
            "il s'agit du seuil du processeur i (θᵢ), qui ne dépend pas de l'indice de sommation. Les notes écrivent aussi la dernière ligne avec φ(x<sub>J</sub>) : c'est la J-ième composante de φ(x).");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Le sens inverse",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Théorème (notes)</span>" +
          "Un réseau bipolaire ⟨n, {−1,+1}, W, θ⟩ est topologiquement conjugué au réseau booléen ⟨n, {0,1}, W̃, θ̃⟩ où" +
          "<div class='formule'>W̃ = 2W     θ̃ = θ + W · (1, …, 1)ᵀ</div>" +
          "via l'homéomorphisme <span class='mono'>φ(x) = ½ (x + (1, …, 1))</span>. Preuve : très similaire à la précédente.</div>" +
          "<p>Applique-le à la version bipolaire de B : W = (1 1 ; −1 1), θ = (0, 1).</p>",
        objectif: "Calculer le nouveau seuil et reconnaître le réseau obtenu.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "θ̃₁ =", attendu: 2, placeholder: "ex. 3", indice: "0 + (1 + 1).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "θ̃₂ =", attendu: 1, placeholder: "ex. 3", indice: "1 + (−1 + 1).", surReussite: ok }); },
            function (b, ok) {
              Exercices.choix(b, {
                question: "Avec W̃ = 2W = (2 2 ; −2 2) et θ̃ = (2, 1), on obtient…",
                options: ["exactement le réseau B de départ", "un réseau booléen différent de B", "un réseau qui n'est plus à seuil"],
                bonne: 0,
                expliquer: ["Exact : les deux transformations sont inverses l'une de l'autre (½ puis 2, −½W·1 puis +W·1).", "Non : compare avec W et θ de l'étape 3.", "Non : c'est encore H(W̃x − θ̃)."],
                surReussite: ok
              });
            }
          ], "Booléen et bipolaire, c'est le même modèle : on peut toujours passer de l'un à l'autre.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Réseau strictement séparateur",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Définition (notes)</span>" +
          "Un réseau (booléen ou bipolaire) est <b>strictement séparateur</b> ssi pour tout processeur i = 1 … n et tout état y :" +
          "<div class='formule'>⟨Wⁱ|y⟩ − θᵢ = Σⱼ wⱼⁱ yⱼ − θᵢ ≠ 0</div></div>" +
          "<p>Autrement dit, aucun état ne tombe pile sur le seuil. Regarde la ligne 1 de la version bipolaire de B : " +
          "<span class='mono'>y₁ + y₂ − 0</span>.</p>",
        objectif: "Cocher les états où la ligne 1 vaut exactement 0.",
        installer: function (zone, api) {
          Exercices.cocher(zone, {
            question: "États y ∈ {−1, +1}² tels que y₁ + y₂ − 0 = 0 :",
            options: ["(−1, −1)", "(−1, 1)", "(1, −1)", "(1, 1)"],
            bonnes: [1, 2],
            explication: "y₁ + y₂ = 0 pour (−1, 1) et (1, −1) : le réseau n'est pas strictement séparateur. C'est exactement l'exemple des notes : W = (1, 1), θ = 0.",
            surReussite: function () { api.valider(); }
          });
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Le rendre strictement séparateur",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Théorème (notes)</span>" +
          "Étant donné un réseau ⟨n, E, W, θ⟩ non strictement séparateur, il existe un réseau ⟨n, E, W, θ − γ⟩ " +
          "topologiquement conjugué au précédent (via φ(x) = x) et strictement séparateur.</div>" +
          "<p>Pour un processeur i : <span class='mono'>K₀ = { y | ⟨Wⁱ|y⟩ = θᵢ }</span>. Si K₀ est vide on ne change rien ; sinon " +
          "<span class='mono'>kⁱ = min { |⟨Wⁱ|y⟩ − θᵢ| : y ∉ K₀ } &gt; 0</span> et on choisit <span class='mono'>0 &lt; γᵢ &lt; kⁱ</span>.</p>",
        objectif: "Calculer k¹, puis le nouveau seuil pour γ₁ = 1.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "k¹ =", attendu: 2, placeholder: "ex. 3", indice: "Hors de K₀ il reste (−1, −1) et (1, 1) : |−2| et |2|.", surReussite: ok }); },
            function (b, ok) { A.html(b, "<p>On peut donc prendre γ₁ = 1 (0 &lt; 1 &lt; 2). Pour la ligne 2, K₀ est vide (valeurs −1, 1, −3, −1) : on ne la change pas.</p>");
              Exercices.nombre(b, { label: "nouveau seuil θ₁ − γ₁ =", attendu: -1, placeholder: "ex. 3", indice: "0 − 1.", surReussite: ok }); },
            function (b, ok) {
              Exercices.choix(b, {
                question: "Pour y = (−1, 1), que vaut SG(y₁ + y₂ − (−1)) ?",
                options: ["+1, comme SG(0) avant", "−1, le comportement change"],
                bonne: 0,
                expliquer: ["Exact : SG(1) = 1 = SG(0). Ajouter γ > 0 ne change aucun signe, et les états qui valaient 0 passent à γ > 0.", "Non : SG(0) = +1 et SG(1) = +1."],
                surReussite: ok
              });
            }
          ], "Nouveau réseau : W = (1, 1), seuil −1 ; strictement séparateur et conjugué via l'identité.");
          A.note(zone, "Dans l'exemple des notes, le réseau obtenu est écrit ⟨1, {−1,1}², (1 1), (1)⟩. " +
            "D'après le théorème, le seuil est θ − γ = 0 − 1 = <b>−1</b> : avec +1, l'état (−1, 1) donnerait SG(−1) = −1 au lieu de +1. " +
            "La notation ⟨1, {−1,1}², …⟩ (un processeur, deux entrées) est aussi celle des notes.");
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : booléen → bipolaire avec <span class='mono'>W̃ = ½W, θ̃ = θ − ½W·1, φ(x) = 2x − 1</span> ; " +
        "bipolaire → booléen avec <span class='mono'>W̃ = 2W, θ̃ = θ + W·1, φ(x) = ½(x + 1)</span>. " +
        "Tout réseau peut être rendu strictement séparateur en retranchant 0 &lt; γᵢ &lt; kⁱ au seuil.</p>",
      cartes: "structure"
    }
  });
})();
