/* Leçon : des questions biologiques aux formules CTL (slides 16 à 18).
   Fil rouge : les questions du cours sur la cellule et une protéine P. */
(function () {
  "use strict";
  var el = Site.el;

  function q(zone, api, o, message) {
    Exercices.choix(zone, MC.melanger({
      question: o.question, options: o.options, bonne: 0, expliquer: o.expliquer,
      surReussite: function () { api.valider(message); }
    }));
  }

  Lecon.demarrer({
    matiere: "model-checking",
    id: "questions-formules",
    etapes: [

      /* 1 */
      {
        titre: "Atteignabilité : la cellule peut-elle… ?",
        texte:
          "<p>« Peut-elle » = <b>il existe</b> un chemin (E) ; « un jour » = F. La cellule peut-elle produire la protéine P ? " +
          "<span class='mono'>EF P</span> (slide 17).</p>",
        objectif: "Traduire : « la cellule peut-elle produire P, Q, et pas R ? »",
        installer: function (zone, api) {
          q(zone, api, {
            question: "La cellule peut-elle produire P, Q, et pas R ?",
            options: ["EF(P ∧ Q ∧ ¬R)", "EF P ∧ EF Q ∧ ¬EF R", "AG(P ∧ Q ∧ ¬R)", "EF(P ∧ Q) ∧ ¬R"],
            expliquer: [
              "Exact (slide 17) : un même état atteignable où P et Q sont présentes et R absente.",
              "Ici P et Q peuvent être produites dans des états différents, et ¬EF R interdit R partout.",
              "AG impose cela dans tous les états atteignables : bien trop fort.",
              "Le ¬R est évalué dans l'état de départ, pas dans l'état atteint."
            ]
          }, "Toute la condition se place à l'intérieur du EF : elle doit tenir dans un même état.");
        }
      },

      /* 2 */
      {
        titre: "Toujours pouvoir",
        texte: "<p>« Peut-elle <b>toujours</b> produire P ? » : quel que soit l'endroit où l'on arrive, il reste possible de produire P.</p>",
        objectif: "Choisir la formule du cours.",
        installer: function (zone, api) {
          q(zone, api, {
            question: "La cellule peut-elle toujours produire P ?",
            options: ["AGEF P", "AG P", "EF P", "EGEF P"],
            expliquer: [
              "Exact (slide 17) : sur tous les chemins, dans tous les états (AG), il existe un chemin vers P (EF).",
              "AG P : P est présente partout, ce n'est pas « peut produire ».",
              "EF P : seulement depuis l'état de départ.",
              "EG demande un seul chemin où c'est toujours possible, pas tous."
            ]
          }, "AGEF P est une formule CTL qu'aucune formule LTL n'exprime (prochaine leçon).");
        }
      },

      /* 3 */
      {
        titre: "Chemins : l'ordre et les parenthèses",
        texte:
          "<p>« La cellule peut-elle atteindre un état s₂ <b>après</b> être passée par un état s₁ ? » (slide 17)</p>" +
          "<p>Attention : deux formules qui se ressemblent ne sont pas équivalentes si les parenthèses changent (remarque faite en cours).</p>",
        objectif: "Choisir la formule qui impose l'ordre s₁ puis s₂.",
        installer: function (zone, api) {
          q(zone, api, {
            question: "s₂ après s₁ :",
            options: ["EF(s₁ ∧ EF s₂)", "EF s₁ ∧ EF s₂", "EF(s₂ ∧ EF s₁)"],
            expliquer: [
              "Exact : on atteint s₁, et depuis cet état on peut encore atteindre s₂.",
              "Deux chemins peut-être différents : rien n'empêche s₂ d'arriver avant s₁.",
              "C'est l'ordre inverse : s₂ d'abord."
            ]
          }, "EF(s₁ ∧ EF s₂) ≠ EF s₁ ∧ EF s₂.");
        }
      },

      /* 4 */
      {
        titre: "Sans passer par… : U",
        texte: "<p>« Est-il possible de synthétiser P sans utiliser la protéine Q ? » (slide 17) : il existe un chemin ¬Q, ¬Q, …, ¬Q, P.</p>",
        objectif: "Choisir la formule.",
        installer: function (zone, api) {
          q(zone, api, {
            question: "Synthétiser P sans utiliser Q :",
            options: ["E(¬Q U P)", "EF(P ∧ ¬Q)", "E(P U ¬Q)", "EG ¬Q ∧ EF P"],
            expliquer: [
              "Exact : Q est absente à chaque pas jusqu'à ce que P apparaisse.",
              "Q pourrait avoir été utilisée avant d'arriver dans cet état.",
              "C'est l'inverse : P jusqu'à l'absence de Q.",
              "Deux conditions sans lien : le chemin sans Q n'est pas forcément celui qui produit P."
            ]
          }, "Même idée pour la nécessité dans la cascade MAPK (étape 7).");
        }
      },

      /* 5 */
      {
        titre: "Stable ou stationnaire",
        texte:
          "<p>Slide 18 : l'état s est-il <b>stable</b> ? <span class='mono'>s ⇒ AG(s)</span>. " +
          "Est-il <b>stationnaire</b> (steady) ? <span class='mono'>s ⇒ EG(s)</span>.</p>",
        objectif: "Associer chaque phrase à la bonne notion.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["stable (AG)", "stationnaire (EG)"],
            items: [
              { texte: "Si je suis en s, quoi que je fasse, je reste en s.", bonne: 0, explication: "Une certitude : tous les chemins." },
              { texte: "Si je suis en s, il existe un chemin où je reste en s pour toujours.", bonne: 1, explication: "Une possibilité : un chemin." },
              { texte: "s a une boucle sur lui-même, et d'autres flèches sortantes.", bonne: 1, explication: "Rester est possible (la boucle), mais on peut aussi partir." },
              { texte: "La seule flèche qui sort de s est une boucle sur s.", bonne: 0, explication: "On ne peut pas en sortir." }
            ],
            surReussite: function () { api.valider("Stable ⇒ stationnaire, mais pas l'inverse."); }
          });
        }
      },

      /* 6 */
      {
        titre: "Oscillation",
        texte:
          "<p>« P peut-il osciller de façon cyclique ? » (slide 18). Construction expliquée en cours : " +
          "« peut-il » → une possibilité, E ; « de façon cyclique » → tout le temps, G ; " +
          "si P est présente, on doit pouvoir aller vers ¬P ; et dans l'autre sens.</p>",
        objectif: "Choisir la formule d'oscillation.",
        installer: function (zone, api) {
          q(zone, api, {
            question: "P peut-il osciller de façon cyclique ?",
            options: ["EG((P ⇒ EF¬P) ∧ (¬P ⇒ EF P))", "EG((P ⇒ EG¬P) ∧ (¬P ⇒ EG P))", "EG(P ⇒ EF¬P)", "EF((P ⇒ EF¬P) ∧ (¬P ⇒ EF P))"],
            expliquer: [
              "Exact (slide 18).",
              "Erreur fréquente signalée en cours : on veut une possibilité de changer (EF), pas rester absent pour toujours (EG).",
              "Erreur fréquente : un seul des deux sens.",
              "EF : la condition ne tiendrait qu'à un moment ; il faut G, tout le temps, le long du chemin."
            ]
          }, "Les deux sens, avec EF à l'intérieur, et EG à l'extérieur.");
        }
      },

      /* 7 */
      {
        titre: "Nécessité : la cascade MAPK",
        texte:
          "<p>La cascade MAPK active successivement trois kinases dans le cytosol : RAF, MEK, MAPK (slide 16). " +
          "Question : l'activation de MEK~{p1} est-elle <b>nécessaire</b> à la production de MAPK~{p1,p2} ?</p>" +
          "<p>Nécessaire = on ne peut pas produire MAPK~{p1,p2} sans être passé par MEK~{p1}.</p>",
        objectif: "Choisir la formule utilisée dans le cours.",
        installer: function (zone, api) {
          q(zone, api, {
            question: "MEK~{p1} est nécessaire pour produire MAPK~{p1,p2} :",
            options: ["¬E(¬MEK~{p1} U MAPK~{p1,p2})", "E(¬MEK~{p1} U MAPK~{p1,p2})", "AF MEK~{p1}", "EF(MEK~{p1} ∧ MAPK~{p1,p2})"],
            expliquer: [
              "Exact (slide 16) : aucun chemin ne produit MAPK~{p1,p2} sans MEK~{p1}. Le model checker répond : vrai.",
              "C'est la négation : « on peut produire MAPK sans MEK ».",
              "Cela ne parle pas de MAPK.",
              "Possible ensemble ne veut pas dire nécessaire."
            ]
          }, "Pour le complexe MEK~{p1}-MEKPH, la même formule est fausse : le model checker donne un contre-exemple, un chemin où ¬(MEK~{p1}-MEKPH) U MAPK~{p1,p2}.");
        }
      }
    ],
    fin: {
      texte:
        "<table class='tableau'><tr><th>Question</th><th>Formule</th></tr>" +
        "<tr><td>peut produire P</td><td class='mono'>EF P</td></tr>" +
        "<tr><td>peut produire P, Q et pas R</td><td class='mono'>EF(P ∧ Q ∧ ¬R)</td></tr>" +
        "<tr><td>peut toujours produire P</td><td class='mono'>AGEF P</td></tr>" +
        "<tr><td>s₂ après s₁</td><td class='mono'>EF(s₁ ∧ EF s₂)</td></tr>" +
        "<tr><td>P sans Q</td><td class='mono'>E(¬Q U P)</td></tr>" +
        "<tr><td>s stable / stationnaire</td><td class='mono'>s ⇒ AG(s) / s ⇒ EG(s)</td></tr>" +
        "<tr><td>P oscille</td><td class='mono'>EG((P ⇒ EF¬P) ∧ (¬P ⇒ EF P))</td></tr>" +
        "<tr><td>A nécessaire pour B</td><td class='mono'>¬E(¬A U B)</td></tr></table>",
      cartes: "proprietes"
    }
  });
})();
