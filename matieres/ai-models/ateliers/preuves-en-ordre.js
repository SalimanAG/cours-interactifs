/* Atelier : remettre les preuves des théorèmes de structure dans l'ordre (notes 4 puis 2). */
(function () {
  "use strict";
  var A = AIM;
  function etape(titre, enonce, lignes, conclusion, note) {
    return {
      titre: titre,
      texte: "<div class='encadre'><span class='titre-encadre'>Énoncé</span>" + enonce + "</div>",
      objectif: "Remettre les étapes de la preuve dans l'ordre.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche les étapes dans l'ordre de la preuve.",
          separateur: "",
          items: lignes,
          surReussite: function () { api.valider(conclusion); }
        });
        if (note) A.note(zone, "" + note + "");
      }
    };
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "preuves-en-ordre",
    etapes: [
      etape("Booléen → bipolaire",
        "⟨n, {0,1}, W, θ⟩ est topologiquement conjugué à ⟨n, {−1,+1}, ½W, θ − ½W·1⟩ via φ(x) = 2x − 1.",
        [
          "Supposer la mise à jour synchrone (la preuve séquentielle est similaire)",
          "φ(fᵢ(x)) = 2·H(Σⱼ wⱼⁱxⱼ − θᵢ) − 1, par définition de φ",
          "= SG(Σⱼ wⱼⁱxⱼ − θᵢ), car SG = 2H − 1",
          "= SG(Σⱼ ½wⱼⁱ(2xⱼ − 1) − (θᵢ − ½Σⱼ wⱼⁱ)), en développant",
          "= SG(Σⱼ w̃ⱼⁱ φ(x)ⱼ − θ̃ᵢ) = gᵢ(φ(x))"
        ],
        "On a montré φ ∘ f = g ∘ φ composante par composante. La preuve bipolaire → booléen est « très similaire » (W̃ = 2W, θ̃ = θ + W·1, φ(x) = ½(x + 1))."),
      etape("Rendre un réseau strictement séparateur",
        "Pour un réseau ⟨n, E, W, θ⟩ non strictement séparateur, ⟨n, E, W, θ − γ⟩ est strictement séparateur et conjugué via φ(x) = x.",
        [
          "Traiter E = {−1,+1} (le cas booléen s'en déduit par conjugaison)",
          "Fixer un processeur i et poser K₀ = { y : ⟨Wⁱ|y⟩ = θᵢ }",
          "Si K₀ est vide, ne pas changer Wⁱ, θᵢ",
          "Sinon kⁱ = min |⟨Wⁱ|y⟩ − θᵢ| hors de K₀, qui est > 0 (ensemble fini)",
          "Choisir 0 < γᵢ < kⁱ",
          "y ∈ K₀ : SG(0) = 1 = SG(γᵢ)",
          "Somme > 0 : ajouter γᵢ > 0 la garde > 0",
          "Somme < 0 : elle est ≤ −kⁱ < −γᵢ, donc + γᵢ reste < 0"
        ],
        "Dans les trois cas SG(⟨Wⁱ|x⟩ − θᵢ) = SG(⟨Wⁱ|x⟩ − θᵢ + γᵢ) : le nouveau seuil est θᵢ − γᵢ.",
        "Les notes ajoutent γᵢ dans les calculs (⟨Wⁱ|y⟩ − θᵢ + γᵢ) : c'est bien le réseau de seuil θ − γ de l'énoncé."),
      etape("De ℚ à ℤ",
        "Si wᵢᴶ ∈ ℚ et θ_J ∈ ℚ, il existe un réseau conjugué via l'identité avec ŵᵢᴶ ∈ ℤ, θ̂_J ∈ ℤ.",
        [
          "Écrire wᵢᴶ = pᵢᴶ/qᵢᴶ et θ_J = r_J/s_J, avec des entiers",
          "Poser d = ppcm des dénominateurs qᵢᴶ, s_J différents de 1",
          "Poser Ŵ = d·W et θ̂ = d·θ : ce sont des entiers",
          "Il faut montrer φ ∘ A = Â ∘ φ avec φ l'identité",
          "SG(Wx − θ) = SG(d·(Wx − θ)), car d > 0",
          "= SG(Ŵx − θ̂) ∎"
        ],
        "Un seul ingrédient : multiplier par d > 0 ne change aucun signe."),
      etape("De ℝ à ℚ",
        "Si wᵢᴶ ∈ ℝ et θ_J ∈ ℝ, il existe un réseau conjugué via l'identité avec ŵᵢᴶ ∈ ℚ, θ̂_J ∈ ℚ.",
        [
          "Se ramener à un réseau strictement séparateur",
          "δ = min |⟨Wᴶ, x⟩ − θ_J| sur tous les J et tous les états : δ > 0",
          "Par densité de ℚ : |wᵢᴶ − ŵᵢᴶ| < δ/(n+1) et |θ_J − θ̂_J| < δ/(n+1)",
          "L'écart entre ⟨Ŵᴶ|x⟩ − θ̂_J et ⟨Wᴶ|x⟩ − θ_J est < n·δ/(n+1) + δ/(n+1) = δ",
          "Comme |⟨Wᴶ|x⟩ − θ_J| ≥ δ, les deux quantités ont le même signe",
          "Donc SG(⟨Wᴶ|x⟩ − θ_J) = SG(⟨Ŵᴶ|x⟩ − θ̂_J) ∎"
        ],
        "Enchaîné avec ℚ → ℤ : tout réseau à seuil a un équivalent à poids entiers.",
        "La majoration des notes multiplie ŵᵢ < wᵢ + δ/(n+1) par xᵢ sans tenir compte du cas xᵢ = −1 ; la ligne « écart < δ » ci-dessus utilise |xᵢ| = 1 (voir la leçon « Des poids réels aux poids entiers », étape 6).")
    ],
    fin: {
      texte: "<p>Les quatre preuves tiennent sur deux idées : un changement de variable (φ(x) = 2x − 1) et la conservation du signe " +
        "(multiplier par d > 0, perturber de moins que la marge δ, ajouter γ plus petit que kⁱ).</p>",
      cartes: "structure"
    }
  });
})();
