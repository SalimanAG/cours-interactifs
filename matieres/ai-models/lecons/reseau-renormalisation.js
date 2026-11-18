/* Leçon : Un réseau à seuil et ses renormalisations (notes « réseaux linéaires à seuil »).
   Fil rouge : l'exemple des notes, n = 3, W = (1/2 0 −2/3 ; −1 1 0 ; −1/5 2 0), θ = (−1, 5, −2), x = (−1, 1, −1). */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var W = [[1 / 2, 0, -2 / 3], [-1, 1, 0], [-1 / 5, 2, 0]];
  var TH = [-1, 5, -2];
  var X = [-1, 1, -1];
  function ps(w, x) { return w.reduce(function (s, v, i) { return s + v * x[i]; }, 0); }
  function f(x) { return W.map(function (w, j) { return ps(w, x) - TH[j]; }); }
  var FX = f(X); // (7/6, −3, 21/5)
  /* Écritures acceptées d'un vecteur : avec ou sans parenthèses, espaces, signe − ou -, +1. */
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

  function matriceW(zone, onCase, classes) {
    var mx = new Matrice(A.cadre(zone), { nom: "W", lignes: ["W¹", "W²", "W³"], colonnes: ["i = 1", "i = 2", "i = 3"], onCase: onCase });
    var vals = W.map(function (l) { return l.map(function (v) { return A.frac(v); }); });
    mx.dessiner(vals, { format: String, classes: classes || {} });
    return { mx: mx, vals: vals };
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "reseau-renormalisation",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Un réseau à seuil, formellement",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Réseau à seuil (notes)</span>" +
          "<div class='formule'>⟨ n, ℝ, W, θ ⟩</div>" +
          "n = nombre de processeurs ; ℝ = ensemble des états des processeurs ; W ∈ ℝ<sup>n×n</sup> = matrice des connexions ; " +
          "θ ∈ ℝⁿ = vecteur des seuils (bias).</div>" +
          "<p>L'exemple des notes, que l'on suit toute la leçon :</p>" +
          "<div class='formule'>W = ( 1/2  0  −2/3 ; −1  1  0 ; −1/5  2  0 )    θ = (−1, 5, −2)</div>",
        objectif: "Rattacher chaque composante à son rôle, puis donner n pour l'exemple.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) {
              Exercices.associer(b, {
                categories: ["n", "ℝ", "W", "θ"],
                items: [
                  { texte: "Vecteur des seuils (bias)", bonne: 3 },
                  { texte: "Nombre de processeurs", bonne: 0 },
                  { texte: "Matrice des connexions", bonne: 2 },
                  { texte: "Ensemble des états des processeurs", bonne: 1 }
                ],
                surReussite: ok
              });
            },
            function (b, ok) {
              Exercices.nombre(b, { label: "Dans l'exemple, n =", attendu: 3, placeholder: "ex. 2", indice: "W est carrée n × n, θ a n composantes.", surReussite: ok });
            }
          ], "W est 3 × 3 et θ a 3 composantes : 3 processeurs.");
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Qui est connecté à qui : wᵢᴶ",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Notation</span>" +
          "w<sub>i</sub><sup>J</sup> = poids de la connexion <b>du processeur i vers le processeur J</b>. " +
          "La ligne J de W, notée W<sup>J</sup>, regroupe tout ce qui arrive sur J : W = (W¹ ; W² ; … ; Wⁿ).</div>",
        objectif: "Toucher w₃¹, puis le poids de la connexion de 2 vers 3.",
        installer: function (zone, api) {
          var phase = 0;
          var q = A.html(zone, "<p>Touche <b>w₃¹</b> (de 3 vers 1).</p>");
          var obj = matriceW(zone, function (i, j) {
            if (phase === 0) {
              if (i === 0 && j === 2) {
                phase = 1;
                obj.mx.dessiner(obj.vals, { format: String, classes: { "0,2": "choisie" } });
                api.retour("w₃¹ = −2/3 : ligne W¹ (vers 1), colonne i = 3 (depuis 3).", true);
                q.innerHTML = "<p>Touche maintenant le poids de la connexion <b>de 2 vers 3</b>.</p>";
              } else api.retour("Non : l'exposant J = 1 donne la ligne W¹, l'indice i = 3 donne la colonne.", false);
            } else if (phase === 1) {
              if (i === 2 && j === 1) {
                phase = 2;
                obj.mx.dessiner(obj.vals, { format: String, classes: { "0,2": "choisie", "2,1": "choisie" } });
                api.retour("w₂³ = 2.", true);
                api.valider("Ligne = processeur d'arrivée J, colonne = processeur de départ i.");
              } else api.retour("Arrivée en 3 → ligne W³ ; départ de 2 → colonne i = 2.", false);
            }
          });
          A.note(zone, "Les notes « Structural Theorems » (partie 2) écrivent w<sub>J</sub><sup>i</sup>, « J-ième élément de la i-ème ligne » : " +
            "les lettres i et J y sont échangées, mais la convention est la même : l'exposant donne la ligne (le processeur d'arrivée), l'indice la colonne (le processeur de départ).");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "La fonction de mise à jour",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Fonction de mise à jour</span>" +
          "Pour x ∈ ℝⁿ : <span class='mono'>f(x) = W x − θ</span>, c'est-à-dire " +
          "<div class='formule'>f_J(x) = ( Σᵢ₌₁ⁿ w_i^J xᵢ ) − θ_J = ⟨W^J | x⟩ − θ_J</div></div>" +
          "<p>Calcule la première composante pour <span class='mono'>x = (−1, 1, −1)</span>. Tu peux écrire une fraction (ex. 5/6).</p>",
        objectif: "Calculer ⟨W¹|x⟩ puis f₁(x).",
        installer: function (zone, api) {
          matriceW(zone, null, { "0,0": "courante", "0,1": "courante", "0,2": "courante" });
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "⟨W¹|x⟩ =", attendu: 1 / 6, tolerance: 1e-6, placeholder: "ex. 5/6", indice: "(1/2)(−1) + 0·1 + (−2/3)(−1).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "f₁(x) = ⟨W¹|x⟩ − θ₁ =", attendu: 7 / 6, tolerance: 1e-6, placeholder: "ex. 5/6", indice: "θ₁ = −1 : on retranche −1, donc on ajoute 1.", surReussite: ok }); }
          ], "f₁(x) = 1/6 + 1 = 7/6.");
          A.note(zone, "Les notes écrivent ⟨W¹|x⟩ + 1 = 1/6 : c'est ⟨W¹|x⟩ seul qui vaut 1/6. " +
            "Avec le « + 1 » (car θ₁ = −1), on obtient 7/6.");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Les deux autres composantes",
        texte: "<p>Même calcul pour J = 2 et J = 3, avec θ₂ = 5 et θ₃ = −2.</p>",
        objectif: "Calculer f₂(x) et f₃(x), puis dire ce qui pose problème.",
        installer: function (zone, api) {
          matriceW(zone, null, { "1,0": "pale", "1,1": "pale", "1,2": "pale" });
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "f₂(x) =", attendu: -3, tolerance: 1e-6, placeholder: "ex. 2", indice: "(−1)(−1) + 1·1 + 0 − 5.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "f₃(x) =", attendu: 21 / 5, tolerance: 1e-6, placeholder: "ex. 2/5", indice: "(−1/5)(−1) = +1/5 ; puis + 2·1 ; puis − θ₃ = + 2.", surReussite: ok }); },
            function (b, ok) {
              A.html(b, "<div class='signalement'>Les notes donnent 19/5 pour la troisième composante : le produit (−1/5)(−1) y est compté −1/5. " +
                "Le bon résultat est 1/5 + 2 + 2 = 21/5.</div>");
              A.choix(b, {
                question: "x ∈ {−1, 1}³, et f(x) = (7/6, −3, 21/5). Que remarque-t-on ?",
                options: ["f(x) n'est plus dans {−1, 1}³", "f(x) est encore un état bipolaire", "f n'est pas définie en x"],
                bonne: 0,
                expliquer: ["Exact : c'est la remarque des notes, x ∈ {−1,1}³ ⊂ ℝ³ mais f(x) ∉ {−1,1}³.", "Non : 7/6 ou 21/5 ne valent ni −1 ni 1.", "Non : f est définie sur tout ℝⁿ."],
                surReussite: ok
              });
            }
          ], "Le réseau sort de l'ensemble d'états : il faut une fonction pour l'y ramener.");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Ensembles d'états et renormalisation",
        texte:
          "<p><b>Attention</b> : on veut choisir un ensemble d'états <b>restreint</b> par rapport à ℝⁿ. Exemples : " +
          A.m("[0, 1]") + ", " + A.m("[−1, +1]") + ", " + A.m("{0, 1}") + " (booléen), " + A.m("{−1, +1}") + " (bipolaire).</p>" +
          "<div class='encadre'><span class='titre-encadre'>Requête</span>Si x ∈ Sⁿ alors f(x) ∈ Sⁿ, avec Sⁿ ⊂ ℝⁿ ⇒ <b>fonctions de renormalisation</b>.</div>" +
          "<p>Chaque S a sa propre fonction de renormalisation :</p>" +
          "<div class='formule'>S(x) = 1/(1 + e⁻ˣ)    S̲(x) = (1 − e⁻ˣ)/(1 + e⁻ˣ)\nH(x) = 1 si x ≥ 0, 0 sinon    SG(x) = +1 si x ≥ 0, −1 sinon</div>",
        objectif: "Rattacher chaque ensemble d'états à sa fonction de renormalisation.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["S", "S̲", "H", "SG"],
            items: [
              { texte: "{−1, +1} (bipolaire)", bonne: 3 },
              { texte: "[0, 1]", bonne: 0 },
              { texte: "{0, 1} (booléen)", bonne: 2 },
              { texte: "[−1, +1]", bonne: 1 }
            ],
            surReussite: function () { api.valider("Intervalles → fonctions continues (S, S̲) ; ensembles à 2 valeurs → marches (H, SG)."); }
          });
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Lire les quatre fonctions",
        texte: "<p>Choisis une fonction : elle passe en couleur, les autres restent en gris. Déplace le curseur pour lire les valeurs.</p>",
        objectif: "Donner S(0) et S̲(0), puis la valeur de SG en 0.",
        installer: function (zone, api) {
          var t = 0, cour = 0;
          var F = [{ f: A.S, n: "S" }, { f: A.Sb, n: "S̲" }, { f: A.H, n: "H", m: true }, { f: A.SG, n: "SG", m: true }];
          var choixF = Site.el("div", "rangee-btn");
          zone.appendChild(choixF);
          var bts = F.map(function (fn, k) {
            var b = Site.el("button", "btn btn-petit", fn.n); b.type = "button";
            b.onclick = function () { cour = k; maj(); };
            choixF.appendChild(b); return b;
          });
          var opts = function () {
            return {
              xmin: -6, xmax: 6, ymin: -1.2, ymax: 1.2, gradY: [-1, 0, 1], gradX: [-6, 0, 6], nomX: "x", hauteur: 210,
              courbes: F.map(function (fn, k) { return { f: fn.f, marches: fn.m, classe: k === cour ? "courante" : "ref" }; })
                .filter(function (c, k) { return k !== cour; })
                .concat([{ f: F[cour].f, marches: F[cour].m, classe: "courante", label: F[cour].n, labelX: 1.5, decalage: -8 }]),
              points: [{ x: t, y: F[cour].f(t), classe: "courante" }]
            };
          };
          var tr = A.trace(zone, opts());
          var info = A.legende(zone);
          function maj() {
            bts.forEach(function (b, k) { b.classList.toggle("btn-plein", k === cour); });
            info.innerHTML = "<span>x = <span class='mono'>" + A.fmt(t, 1) + "</span></span><span>S = <span class='mono'>" + A.fmt(A.S(t)) +
              "</span></span><span>S̲ = <span class='mono'>" + A.fmt(A.Sb(t)) + "</span></span><span>H = <span class='mono'>" + A.H(t) +
              "</span></span><span>SG = <span class='mono'>" + A.fmt(A.SG(t)) + "</span></span>";
            tr.redessiner(opts());
          }
          A.curseur(zone, { label: "x", min: -6, max: 6, pas: 0.5, valeur: 0, format: function (v) { return A.fmt(v, 1); }, surChange: function (v) { t = v; maj(); } });
          maj();
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "S(0) =", attendu: 0.5, tolerance: 1e-6, placeholder: "ex. 1/3", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "S̲(0) =", attendu: 0, tolerance: 1e-6, placeholder: "ex. 1/3", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "SG(0) =", attendu: 1, placeholder: "−1 ou 1", indice: "La condition est x ≥ 0 : 0 en fait partie.", surReussite: ok }); }
          ], "S va de 0 à 1 (S(0) = 1/2), S̲ de −1 à 1 (S̲(0) = 0) ; H(0) = 1 et SG(0) = +1 car la condition est x ≥ 0.");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Relations entre fonctions de renormalisation",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Notes</span>" +
          "S̲(x) = 2·S(x) − 1, en effet 2/(1 + e⁻ˣ) − 1 = (2 − 1 − e⁻ˣ)/(1 + e⁻ˣ) = (1 − e⁻ˣ)/(1 + e⁻ˣ).<br>" +
          "SG(x) = 2H(x) − 1, en effet 2·1 − 1 = 1 si x ≥ 0 et 2·0 − 1 = −1 si x &lt; 0.</div>" +
          "<p>« À partir de ces relations il est facile de trouver les relations inverses. » À toi.</p>",
        objectif: "Exprimer S en fonction de S̲, puis H en fonction de SG.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) {
              A.choix(b, {
                question: "S(x) = ?", options: ["(S̲(x) + 1) / 2", "2·S̲(x) − 1", "(1 − S̲(x)) / 2"], bonne: 0,
                expliquer: ["Exact : on isole S dans S̲ = 2S − 1.", "Non : c'est la relation directe appliquée à S̲.", "Non : quand x est grand, S̲ → 1 et cela donnerait S → 0, alors que S → 1."],
                surReussite: ok
              });
            },
            function (b, ok) {
              A.choix(b, {
                question: "H(x) = ?", options: ["2·SG(x) − 1", "(SG(x) + 1) / 2", "1 − SG(x)"], bonne: 1,
                expliquer: ["Non : cela donnerait 3 ou −3.", "Exact : (1 + 1)/2 = 1 et (−1 + 1)/2 = 0.", "Non : SG(x) = 1 donnerait H(x) = 0."],
                surReussite: ok
              });
            }
          ], "Passer de [0, 1] à [−1, 1] : y ↦ 2y − 1 ; et retour : y ↦ (y + 1)/2. On retrouvera exactement ce changement de variable dans les théorèmes de structure.");
        }
      },

      /* 8 ─────────────────────────────────────────────── */
      {
        titre: "Un pas du réseau",
        texte:
          "<p>Pour rester dans {−1, +1}³, on renormalise par SG : l'état suivant est <span class='mono'>SG(W x − θ)</span>, composante par composante " +
          "(c'est la forme utilisée dans les théorèmes de structure).</p>" +
          "<p>On part de x = (−1, 1, −1), avec f(x) = (7/6, −3, 21/5).</p>",
        objectif: "Donner l'état suivant, puis l'état d'après.",
        installer: function (zone, api) {
          var x1 = FX.map(A.SG); // (1, −1, 1)
          var x2 = f(x1).map(A.SG); // (1, −1, −1)
          A.enchainer(zone, api, [
            function (b, ok) {
              A.html(b, "<p>État suivant, sous la forme <span class='mono'>(a, b, c)</span> :</p>");
              Exercices.texte(b, { label: "x(t+1) =", attendu: variantes([1, -1, 1]), mode: "souple", verdict: false, indice: "SG garde le signe : 7/6 > 0, −3 < 0, 21/5 > 0.", surReussite: ok });
            },
            function (b, ok) {
              A.html(b, "<p>Refais le calcul depuis (1, −1, 1) : ⟨W¹|x⟩ − θ₁ = 1/2 − 2/3 + 1 = 5/6, puis les deux autres composantes.</p>");
              Exercices.texte(b, { label: "x(t+2) =", attendu: variantes([1, -1, -1]), mode: "souple", verdict: false, indice: "f₂ = −1 − 1 − 5 = −7 ; f₃ = −1/5 − 2 + 2 = −1/5.", surReussite: ok });
            }
          ], "Le réseau évolue dans {−1, 1}³ : " + x1.join(", ").replace(/-/g, "−") + " puis " + x2.join(", ").replace(/-/g, "−") + ".");
          A.note(zone, "Les notes s'arrêtent au calcul de f(x) et à la remarque f(x) ∉ {−1, 1}³. " +
            "Appliquer SG pour obtenir l'état suivant est ce que fait la « requête » (rester dans Sⁿ) ; l'itération est ajoutée ici pour s'entraîner.");
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : <span class='mono'>⟨n, S, W, θ⟩</span>, w_i^J de i vers J (ligne J), " +
        "<span class='mono'>f(x) = Wx − θ</span>, puis une fonction de renormalisation (S, S̲, H, SG) pour rester dans l'ensemble d'états ; " +
        "<span class='mono'>S̲ = 2S − 1</span>, <span class='mono'>SG = 2H − 1</span>.</p>",
      cartes: "neurone-seuil"
    }
  });
})();
