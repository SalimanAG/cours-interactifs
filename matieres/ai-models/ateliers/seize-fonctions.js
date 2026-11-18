/* Atelier : lesquelles des 16 fonctions booléennes à 2 entrées un seul neurone sait-il calculer ?
   (prolonge les notes « NN et fonctions booléennes » et « The XOR problem »). */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var N2 = ["x₁", "x₂"];
  // Sorties dans l'ordre (0,0), (0,1), (1,0), (1,1).
  function serie(zone, api, cibles, conclusion) {
    var k = 0;
    var titre = A.html(zone, "");
    var suivi = el("p", "discret"); zone.appendChild(suivi);
    var nr = null;
    function afficher() {
      var c = cibles[k];
      titre.innerHTML = "<p>Fonction " + (k + 1) + " sur " + cibles.length + " : <b>" + c.nom + "</b> — sorties attendues <span class='mono'>" + c.y.join("") + "</span>.</p>";
      if (nr) { nr.o.cible = c.y; nr.maj(); }
    }
    afficher();
    nr = new Neurone(A.cadre(zone), {
      noms: N2, poids: [0, 0], seuil: 0, plan: true, table: true, cible: cibles[0].y, min: -3, max: 3,
      surChange: function (e) {
        if (!e.ok || k >= cibles.length) return;
        var c = cibles[k];
        suivi.innerHTML += (suivi.innerHTML ? "<br>" : "") + "✓ " + c.nom + " : <span class='mono'>w = (" + A.fmt(e.poids[0]) + ", " + A.fmt(e.poids[1]) + "), θ = " + A.fmt(e.seuil) + "</span>";
        k++;
        if (k < cibles.length) { setTimeout(afficher, 0); api.retour("Réussi. Fonction suivante.", true); }
        else { api.retour("Les " + cibles.length + " sont réalisées.", true); api.valider(conclusion); }
      }
    });
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "seize-fonctions",
    etapes: [
      {
        titre: "Constantes et entrées seules",
        texte: "<p>Les 16 fonctions sont codées par leurs 4 sorties, dans l'ordre (0,0), (0,1), (1,0), (1,1). On commence par celles qui n'utilisent qu'une entrée, ou aucune.</p>",
        objectif: "Réaliser successivement les 6 fonctions avec un seul neurone.",
        installer: function (zone, api) {
          serie(zone, api, [
            { nom: "toujours 0", y: [0, 0, 0, 0] }, { nom: "toujours 1", y: [1, 1, 1, 1] },
            { nom: "x₁", y: [0, 0, 1, 1] }, { nom: "x₂", y: [0, 1, 0, 1] },
            { nom: "NOT x₁", y: [1, 1, 0, 0] }, { nom: "NOT x₂", y: [1, 0, 1, 0] }
          ], "Constantes : poids nuls, seuil > 0 (toujours 0) ou ≤ 0 (toujours 1). Une seule entrée : droite verticale ou horizontale.");
        }
      },
      {
        titre: "Les portes à deux entrées",
        texte: "<p>AND et OR (vues dans les notes), puis leurs négations NAND et NOR.</p>",
        objectif: "Réaliser AND, OR, NAND, NOR.",
        installer: function (zone, api) {
          serie(zone, api, [
            { nom: "AND", y: [0, 0, 0, 1] }, { nom: "OR", y: [0, 1, 1, 1] },
            { nom: "NAND", y: [1, 1, 1, 0] }, { nom: "NOR", y: [1, 0, 0, 0] }
          ], "Nier une fonction : changer le signe des poids et du seuil (et décaler un peu le seuil, à cause de H(0) = 1).");
        }
      },
      {
        titre: "Les « un mais pas l'autre » et les implications",
        texte: "<p>Quatre fonctions de plus : un point seul, ou tous sauf un.</p>",
        objectif: "Réaliser les 4 fonctions.",
        installer: function (zone, api) {
          serie(zone, api, [
            { nom: "x₁ AND NOT x₂", y: [0, 0, 1, 0] }, { nom: "NOT x₁ AND x₂", y: [0, 1, 0, 0] },
            { nom: "x₁ → x₂ (NOT x₁ OR x₂)", y: [1, 1, 0, 1] }, { nom: "x₂ → x₁ (x₁ OR NOT x₂)", y: [1, 0, 1, 1] }
          ], "Un poids positif, un poids négatif : la droite isole un coin du carré.");
        }
      },
      {
        titre: "Le compte final",
        texte:
          "<p>On a réalisé 6 + 4 + 4 = 14 fonctions. Il en reste 2 sur 16 : 0110 et 1001.</p>",
        objectif: "Identifier les deux fonctions impossibles et dire pourquoi.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) {
              Exercices.cocher(b, {
                question: "Quelles fonctions un seul neurone ne peut-il pas calculer ?",
                options: ["XOR (0110)", "XNOR, l'égalité (1001)", "NAND (1110)", "x₁ AND NOT x₂ (0010)"],
                bonnes: [0, 1],
                explication: "XOR et XNOR : leurs 1 sont sur une diagonale du carré, leurs 0 sur l'autre.",
                surReussite: ok
              });
            },
            function (b, ok) {
              Exercices.choix(b, {
                question: "Pourquoi XNOR est impossible, sachant que XOR l'est ?",
                options: ["Si un neurone (w, θ) faisait XNOR, le neurone (−w, −θ) ferait (presque) XOR : même droite, côtés échangés", "Parce que XNOR a plus de 1 que XOR", "Parce qu'il faudrait un poids nul"],
                bonne: 0,
                expliquer: ["Exact : la même droite séparerait aussi les diagonales, ce qui est impossible.", "Non : XNOR et XOR ont tous deux deux 1.", "Non : relis l'argument des diagonales."],
                surReussite: ok
              });
            }
          ], "14 fonctions sur 16 sont linéairement séparables ; XOR et XNOR ne le sont pas.");
          A.note(zone, "Les notes répondent à la question des 16 fonctions par la seule preuve du XOR. Le décompte « 14 sur 16 » et le cas XNOR sont un complément de l'atelier.");
        }
      }
    ],
    fin: {
      texte: "<p>Un neurone à 2 entrées = une droite : il calcule exactement les fonctions dont les 1 et les 0 sont séparables par une droite, soit 14 des 16 fonctions.</p>",
      cartes: "booleen-xor"
    }
  });
})();
