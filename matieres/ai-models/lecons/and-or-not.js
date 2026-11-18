/* Leçon : AND, OR, NOT avec un neurone (notes « NN et fonctions booléennes »).
   Fil rouge : le neurone à 2 entrées booléennes des notes, ⟨1, {0,1}, [1 1], θ⟩, et sa table de vérité. */
(function () {
  "use strict";
  var A = AIM;
  var N2 = ["x₁", "x₂"];

  Lecon.demarrer({
    matiere: "ai-models",
    id: "and-or-not",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Quel calcul fait ce neurone ?",
        texte:
          "<p>Les notes considèrent le réseau <span class='mono'>⟨1, {0,1}, [1 1], 2⟩</span> : états {0, 1}, poids <span class='mono'>W = [1 1]</span>, " +
          "seuil <span class='mono'>θ = 2</span>, et <span class='mono'>y = H([1, 1]·x − 2)</span>. Touche les lignes de la table (ou les entrées) pour suivre le calcul.</p>",
        objectif: "Reconnaître la porte logique réalisée.",
        installer: function (zone, api) {
          new Neurone(A.cadre(zone), { noms: N2, poids: [1, 1], seuil: 2, reglerPoids: false, reglerSeuil: false, table: true });
          A.choix(zone, {
            question: "En comparant entrées et sorties, ce réseau réalise la porte…",
            options: ["AND", "OR", "XOR", "NAND"], bonne: 0,
            expliquer: ["Exact : y = 1 seulement pour (1, 1), car H(2 − 2) = H(0) = 1.", "Non : (1, 0) donne H(−1) = 0.", "Non : (1, 1) donne 1.", "Non : (0, 0) donne 0."],
            surReussite: function () { api.valider(); }
          });
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "OR : changer le seuil",
        texte: "<p>Mêmes poids [1 1]. Règle seulement le seuil pour que le neurone réalise <b>OR</b> (colonne « attendu »).</p>",
        objectif: "Trouver le seuil qui donne OR.",
        installer: function (zone, api) {
          new Neurone(A.cadre(zone), {
            noms: N2, poids: [1, 1], seuil: 2, reglerPoids: false, table: true, cible: [0, 1, 1, 1], min: -2, max: 3,
            surChange: function (e) {
              if (e.ok) { api.retour("θ = 1 : H(x₁ + x₂ − 1).", true); api.valider("Une seule entrée à 1 suffit à atteindre le seuil 1 ; (0, 0) reste en dessous."); }
              else api.retour(e.sorties[0] === 1 ? "(0, 0) décharge : seuil trop bas." : "Il manque des 1 : seuil trop haut.", false);
            }
          });
          A.note(zone, "Les notes écrivent ce réseau ⟨1, {0,1}, [1, 1], −1⟩ puis « θ = 0 » en marge, mais leurs calculs utilisent " +
            "H([1, 1]x − 1), c'est-à-dire <b>θ = 1</b>. C'est la valeur cohérente avec la formule y = H(Σ wᵢxᵢ − θ).");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "NOT : un neurone à une entrée",
        texte: "<p>Une seule entrée x. Règle le poids et le seuil pour obtenir <b>NOT</b> : y = 1 si x = 0, y = 0 si x = 1.</p>",
        objectif: "Réaliser NOT.",
        installer: function (zone, api) {
          new Neurone(A.cadre(zone), {
            noms: ["x"], poids: [1], seuil: 1, table: true, cible: [1, 0], min: -3, max: 3,
            surChange: function (e) {
              if (e.ok) { api.retour("w = " + A.fmt(e.poids[0]) + ", θ = " + A.fmt(e.seuil) + ".", true); api.valider("Les notes prennent w = −1 et θ = 0 : f(0) = H(0) = 1 et f(1) = H(−1) = 0. Il faut un poids négatif (inhibiteur)."); }
              else api.retour("Pas encore NOT.", false);
            }
          });
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Le théorème : toute fonction booléenne",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Théorème (notes)</span>" +
          "On peut simuler n'importe quelle fonction booléenne avec des réseaux linéaires à seuil.<br>" +
          "<i>Démonstration</i> : {AND, OR, NOT} est une base complète pour les fonctions booléennes, et chaque élément de la base est simulable par un réseau linéaire à seuil.</div>" +
          "<p>Conclusion des notes : on pourrait simuler <b>n'importe quel ordinateur</b> avec des réseaux linéaires à seuil !</p>" +
          "<p>Appliquons-le à XOR (y = 1 si exactement une entrée vaut 1).</p>",
        objectif: "Écrire XOR avec AND, OR, NOT, puis compter les neurones.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) {
              A.choix(b, {
                question: "Quelle expression vaut XOR(x₁, x₂) ?",
                options: ["AND(OR(x₁, x₂), NOT(AND(x₁, x₂)))", "OR(AND(x₁, x₂), NOT(OR(x₁, x₂)))", "AND(x₁, NOT(x₂))"],
                bonne: 0,
                expliquer: ["Exact : « au moins une » ET « pas les deux ».", "Non : c'est XNOR (1 quand les deux sont égales).", "Non : (0, 1) donnerait 0."],
                surReussite: ok
              });
            },
            function (b, ok) {
              Exercices.nombre(b, { label: "Un neurone par porte : combien de neurones ?", attendu: 4, placeholder: "ex. 3", indice: "Compte OR, AND, NOT, AND.", surReussite: ok });
            },
            function (b, ok) {
              A.html(b, "<p>Vérifie le réseau obtenu : h₁ = OR(x₁, x₂), h₂ = NOT(AND(x₁, x₂)), y = AND(h₁, h₂). " +
                "Écris les 4 sorties pour (0,0), (0,1), (1,0), (1,1), sans espace (ex. 1001).</p>");
              Exercices.texte(b, { label: "y =", attendu: "0110", mode: "souple", verdict: false, placeholder: "4 chiffres", indice: "(1, 1) : h₁ = 1 mais h₂ = 0.", surReussite: ok });
            }
          ], "XOR est simulable par un réseau à seuil… à condition d'empiler des neurones (ici sur plusieurs couches).");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "La question des 16 fonctions",
        texte: "<p>Une fonction booléenne à 2 entrées associe une sortie 0 ou 1 à chacun des 4 états (0,0), (0,1), (1,0), (1,1).</p>",
        objectif: "Compter les fonctions à 2 entrées, et poser la question de la fin des notes.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Nombre de fonctions booléennes à 2 entrées :", attendu: 16, placeholder: "ex. 8", indice: "4 sorties, chacune 0 ou 1 : 2 × 2 × 2 × 2.", surReussite: ok }); },
            function (b, ok) {
              A.choix(b, {
                question: "Question des notes : les 16 sont-elles toutes simulables par un seul neurone de McCulloch-Pitts ?",
                options: ["Non : XOR (vu à l'étape 4) en a eu besoin de plusieurs, et on va prouver qu'un seul ne suffit pas", "Oui : le théorème le dit"],
                bonne: 0,
                expliquer: ["Exact. « La réponse dans le prochain épisode » : la leçon suivante démontre qu'un neurone seul ne peut pas apprendre XOR.", "Non : le théorème parle de réseaux, pas d'un seul neurone."],
                surReussite: ok
              });
            }
          ], "2^(2²) = 16 fonctions. Suite : pourquoi un neurone ne fait pas XOR.");
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : un seul neurone réalise AND (w = [1 1], θ = 2), OR (θ = 1), NOT (w = −1, θ = 0). " +
        "Comme {AND, OR, NOT} est une base complète, les réseaux à seuil simulent toute fonction booléenne.</p>",
      cartes: "booleen-xor"
    }
  });
})();
