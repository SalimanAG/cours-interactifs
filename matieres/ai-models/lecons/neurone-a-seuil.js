/* Leçon : Le neurone à seuil (notes « Neurone de McCulloch-Pitt »).
   Fil rouge : un neurone N à 3 entrées, poids w = (2, 1, −1), seuil θ = 2 (exemple construit pour la leçon). */
(function () {
  "use strict";
  var A = AIM;
  var NOMS = ["x₁", "x₂", "x₃"];
  var W = [2, 1, -1], TH = 2;
  function actives(x) { return x.filter(function (v) { return v === 1; }).length; }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "neurone-a-seuil",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Le neurone biologique",
        texte:
          "<p>Le cours part du neurone physiologique : un <b>noyau</b> (nucleus), des <b>dendrites</b> qui reçoivent, " +
          "un <b>axone</b> qui transporte la décharge, et des <b>synapses</b> au bout des ramifications de l'axone.</p>" +
          "<div class='encadre'><span class='titre-encadre'>Notes, page « Neurones »</span>" +
          "Dendrites = information <b>locale</b> (mauvais conducteur électrique).<br>" +
          "Axones = information <b>à longue distance</b> (très bons conducteurs électriques, vitesse des signaux 120 m/s).</div>",
        objectif: "Rattacher chaque description à la bonne partie du neurone.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["Dendrites", "Axone", "Synapses"],
            items: [
              { texte: "Transporte l'information à longue distance", bonne: 1 },
              { texte: "Mauvais conducteur électrique", bonne: 0 },
              { texte: "Signaux à environ 120 m/s", bonne: 1 },
              { texte: "Information locale, reçue près du noyau", bonne: 0 },
              { texte: "Points de contact au bout des ramifications de l'axone", bonne: 2 }
            ],
            surReussite: function () { api.valider("Les dendrites collectent localement, l'axone transmet loin et vite."); }
          });
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "L'hypothèse de McCulloch-Pitts",
        texte:
          "<p>Le neurone de McCulloch-Pitts est une vision <b>(très) simplifiée</b> d'un neurone physiologique.</p>" +
          "<div class='encadre'><span class='titre-encadre'>Hypothèse</span>" +
          "Le fonctionnement du cerveau consiste intégralement en le passage / échange de signaux électriques dans certaines cellules que nous appelons <b>neurones</b>.</div>" +
          "<p>Conséquences : on ignore complètement le rôle joué par les <b>cellules gliales</b> ; " +
          "le comportement des neurones est <b>constant</b> et dépend exclusivement de leur état électrique et de leurs connexions.</p>",
        objectif: "Classer les quatre affirmations en vrai / faux.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "Dans ce modèle, les cellules gliales jouent un rôle dans le calcul.", vrai: false, explication: "Non : on ignore complètement leur rôle." },
              { texte: "La sortie d'un neurone ne dépend que de son état électrique et de ses connexions.", vrai: true, explication: "C'est la deuxième conséquence de l'hypothèse." },
              { texte: "Un neurone de McCulloch-Pitts peut changer de comportement tout seul au fil du temps.", vrai: false, explication: "Non : son comportement est constant." },
              { texte: "Le modèle suppose que tout le fonctionnement du cerveau est un échange de signaux électriques entre neurones.", vrai: true, explication: "C'est l'hypothèse elle-même." }
            ],
            surReussite: function () { api.valider(); }
          });
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Sommation et seuil critique",
        texte:
          "<p>Des agents chimiques (<b>neurotransmetteurs</b>) activent de petites impulsions électriques dans les dendrites. " +
          "Quand assez de signaux se sont accumulés pendant un court laps de temps (la <b>période de sommation latente</b>), " +
          "une décharge est envoyée le long de l'axone. La quantité de signaux nécessaire est le <b>seuil critique</b> du neurone.</p>" +
          "<p>Voici le neurone N de cette leçon : poids " + A.m("w = (2, 1, −1)") + ", seuil " + A.m("θ = 2") + ". " +
          "Touche une entrée pour l'allumer (1) ou l'éteindre (0). Le neurone plein = il décharge.</p>",
        objectif: "Faire décharger N en n'allumant qu'une seule entrée.",
        installer: function (zone, api) {
          new Neurone(A.cadre(zone), {
            noms: NOMS, poids: W, seuil: TH, reglerPoids: false, reglerSeuil: false,
            surChange: function (e) {
              var k = actives(e.x);
              if (e.y === 1 && k === 1) {
                api.retour("Avec x₁ seule : Σ = 2 ≥ θ = 2.", true);
                api.valider("Une seule impulsion suffit si son poids atteint le seuil : ici w₁ = 2 = θ.");
              } else if (e.y === 1) api.retour("Il décharge, mais avec " + k + " entrées allumées. Peux-tu le faire avec une seule ?", null);
              else if (k) api.retour("Pas de décharge : la somme n'atteint pas le seuil.", false);
            }
          });
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Impulsions déclencheuses et inhibitrices",
        texte:
          "<p>Les impulsions peuvent avoir un effet <b>déclencheur</b> ou <b>inhibiteur</b> : on le représente par des poids " +
          "<b>positifs</b> ou <b>négatifs</b> au niveau des synapses.</p>" +
          "<div class='encadre'><span class='titre-encadre'>La règle</span>" +
          "Un neurone s'active seulement si le poids total des impulsions reçues pendant la période de sommation latente dépasse un seuil.</div>" +
          "<p>Dans N, l'entrée x₃ a un poids négatif.</p>",
        objectif: "Trouver un état où x₁ est allumée mais où N ne décharge pas.",
        installer: function (zone, api) {
          new Neurone(A.cadre(zone), {
            noms: NOMS, poids: W, seuil: TH, reglerPoids: false, reglerSeuil: false, x: [1, 0, 0],
            surChange: function (e) {
              if (e.x[0] === 1 && e.y === 0) {
                api.retour("x₃ = 1 retire 1 : Σ = 2 − 1 = 1 < 2.", true);
                api.valider("x₃ est inhibitrice : son poids négatif empêche la décharge (sauf si x₂ compense : essaie (1, 1, 1)).");
              } else if (e.x[0] === 0) api.retour("Garde x₁ allumée.", false);
              else api.retour("N décharge encore. Quelle entrée peut faire baisser la somme ?", null);
            }
          });
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Le temps et la formule",
        texte:
          "<p>Après la décharge, le neurone entre dans une phase où il ne réagit plus à aucune impulsion : la <b>période réfractaire</b>. " +
          "Le petit retard entre l'arrivée des signaux et la décharge est considéré ici égal à 0.</p>" +
          "<div class='encadre'><span class='titre-encadre'>Formellement (notes)</span>" +
          "<div class='formule'>yᵗ⁺¹ = 1 si Σᵢ₌₁ⁿ wᵢ xᵢᵗ ≥ θ, 0 sinon.</div>" +
          "Les entrées x₁ … xₙ sont pondérées, sommées (⊕), puis on retranche le seuil θ.</div>",
        objectif: "Dire quelle est l'unité de temps, puis calculer yᵗ⁺¹ pour un état.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) {
              A.choix(b, {
                question: "Quelle est l'unité de temps du modèle ?",
                options: ["La longueur de la période réfractaire", "La durée de la période de sommation latente", "Le retard entre signaux et décharge"],
                bonne: 0,
                expliquer: ["Exact : on prend comme unité de temps la longueur de la période réfractaire.", "Non : relis la phrase sur l'unité de temps.", "Non : ce retard est considéré égal à 0."],
                surReussite: ok
              });
            },
            function (b, ok) {
              A.html(b, "<p>À l'instant t, les entrées de N valent " + A.m("xᵗ = (1, 1, 1)") + ". Avec w = (2, 1, −1) et θ = 2 :</p>");
              Exercices.nombre(b, { label: "Σ wᵢxᵢᵗ =", attendu: 2, placeholder: "ex. 3", indice: "2·1 + 1·1 + (−1)·1.", surReussite: ok });
            },
            function (b, ok) {
              Exercices.nombre(b, { label: "yᵗ⁺¹ =", attendu: 1, placeholder: "0 ou 1", indice: "Compare la somme au seuil : l'égalité suffit (≥).", surReussite: ok });
            }
          ], "Σ = 2 ≥ θ = 2 : y = 1. L'égalité compte comme une décharge (≥ dans la formule).");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Régler le seuil",
        texte:
          "<p>Les poids restent " + A.m("(2, 1, −1)") + ", mais tu peux maintenant changer θ. La table liste les 8 états d'entrée ; " +
          "la colonne « attendu » donne le comportement voulu : N doit décharger <b>seulement</b> pour l'état (1, 1, 0).</p>",
        objectif: "Trouver le seuil θ qui donne exactement la colonne « attendu ».",
        installer: function (zone, api) {
          new Neurone(A.cadre(zone), {
            noms: NOMS, poids: W, seuil: 0, reglerPoids: false, pas: 1, min: -3, max: 5, table: true,
            cible: [0, 0, 0, 0, 0, 0, 1, 0],
            surChange: function (e) {
              if (e.ok) {
                api.retour("θ = 3 : seul (1, 1, 0) atteint Σ = 3.", true);
                api.valider("Les sommes possibles vont de −1 à 3 ; (1, 1, 0) est le seul état à Σ = 3, donc θ ∈ ]2, 3]. Avec des seuils entiers : θ = 3.");
              } else {
                var trop = e.sorties.filter(function (y, i) { return y === 1 && i !== 6; }).length;
                api.retour(e.sorties[6] === 0 ? "(1, 1, 0) ne décharge plus : seuil trop haut." : trop + " état(s) de trop déchargent : monte le seuil.", false);
              }
            }
          });
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : un neurone de McCulloch-Pitts calcule <span class='mono'>y = 1 si Σ wᵢxᵢ ≥ θ</span>, 0 sinon. " +
        "Poids positif = impulsion déclencheuse, poids négatif = inhibitrice ; l'unité de temps est la période réfractaire.</p>",
      cartes: "neurone-seuil"
    }
  });
})();
