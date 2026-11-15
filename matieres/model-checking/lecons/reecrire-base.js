/* Leçon : Réécrire une formule CTL avec ¬, ∨, EX, EU, EG (slides 20 et 22 ; règles de traduction vues en cours).
   Fil rouge : le système s0, s1, s2 et la formule de l'exercice 1 du 13 octobre, EX(AG p → E(p U q)). */
(function () {
  "use strict";
  var el = Site.el;
  var S = MC.SYS;
  var PROPS = ["p", "q", "r"];

  function sansDoubleNeg(f) {
    if (!f || typeof f !== "object") return f;
    if (f.op === "non" && f.f.op === "non") return sansDoubleNeg(f.f.f);
    var g = {};
    for (var k in f) g[k] = (k === "f" || k === "a" || k === "b") ? sansDoubleNeg(f[k]) : f[k];
    return g;
  }
  function forme(f) { return LT.texte(sansDoubleNeg(f)); }

  function exerciceSaisie(zone, api, o) {
    var c = MC.champFormule(zone, {
      label: o.label, props: PROPS, exemple: o.exemple,
      surValider: function (f) {
        if (!LT.estBase(f)) {
          c.message("Cette formule utilise encore autre chose que p, true, ¬, ∧, ∨, EX, EU, EG : " + MC.formule(LT.texte(f)) + ".", false);
          return;
        }
        if (o.attendus.indexOf(forme(f)) >= 0) {
          c.message("Exact : " + MC.formule(LT.texte(f)) + ".", true);
          api.valider(o.message);
        } else {
          var memeS = LT.satisfait(S.M, f).join() === LT.satisfait(S.M, LT.lire(o.depart)).join();
          c.message(memeS
            ? "Sur ce système, ta formule donne le même ensemble d'états, mais ce n'est pas la traduction par les règles du cours. " + o.indice
            : "Pas équivalent. " + o.indice, false);
        }
      }
    });
  }

  Lecon.demarrer({
    matiere: "model-checking",
    id: "reecrire-base",
    etapes: [

      /* 1 */
      {
        titre: "Cinq opérateurs suffisent",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Algorithme CTL : préliminaires (slide 20)</span>" +
          "Toutes les formules CTL peuvent s'exprimer avec ¬, ∨, EX, EU, EG. L'algorithme étiquette avec « fᵢ » tous les états s tels que M, s ⊨ fᵢ.</div>" +
          "<p>L'algorithme n'a donc qu'un cas par opérateur de base. Avant de l'appliquer, on <b>réécrit</b> la formule. " +
          "∧ est permis aussi : f ∧ g ≡ ¬(¬f ∨ ¬g), et les exercices du cours l'utilisent directement.</p>",
        objectif: "Repérer l'opérateur que l'algorithme ne traite pas directement.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "Lequel faut-il réécrire avant de lancer l'algorithme ?",
            options: ["AG", "EX", "EU (c'est-à-dire E(· U ·))", "EG", "¬"],
            bonne: 0,
            expliquer: ["Exact : tout ce qui commence par A, ainsi que EF, se réécrit avec E et ¬.", "EX est dans la base.", "EU est dans la base.", "EG est dans la base.", "¬ est dans la base."],
            surReussite: function () { api.valider(); }
          }));
        }
      },

      /* 2 */
      {
        titre: "EF f ≡ E(true U f)",
        texte:
          "<p>« Un jour f » = « true jusqu'à f » : true est vraie dans tous les états, donc la seule exigence de U qui reste est que f arrive. " +
          "Cette règle a été donnée en cours (les slides ne l'écrivent pas).</p>",
        objectif: "Réécrire EF(p ∧ q) dans la base.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "EF(p ∧ q) ≡ ?",
            options: ["E(true U (p ∧ q))", "E((p ∧ q) U true)", "EX(p ∧ q)", "¬EG(p ∧ q)"],
            bonne: 0,
            expliquer: [
              "Exact. Sur notre système, S(EF(p ∧ q)) = " + MC.ens(LT.satisfait(S.M, LT.lire("EF(p ∧ q)"))) + ".",
              "(p ∧ q) U true est vraie dès le premier état (true arrive tout de suite) : ce n'est pas EF.",
              "EX regarde seulement l'état suivant.",
              "¬EG… est la forme de AF, pas de EF."
            ],
            surReussite: function () { api.valider(); }
          }));
        }
      },

      /* 3 */
      {
        titre: "AX f ≡ ¬EX¬f",
        texte:
          "<p>« Tous les successeurs ont f » = « aucun successeur n'a ¬f ». Vérifions sur le système : " +
          "S(EX ¬q) = {s2} (leçon précédente), puis on prend le complémentaire.</p>",
        objectif: "Trouver S(¬EX¬q) et constater que c'est S(AX q).",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: S, attendu: LT.satisfait(S.M, LT.lire("¬EX¬q")), nom: "S(¬EX¬q)",
            indice: "Le complémentaire de {s2} dans {s0, s1, s2}.",
            message: "{s0, s1} : exactement S(AX q). La négation prend toujours le complémentaire."
          });
        }
      },

      /* 4 */
      {
        titre: "AG f ≡ ¬EF¬f ≡ ¬E(true U ¬f)",
        texte:
          "<p>« Toujours f sur tous les chemins » = « on ne peut pas atteindre un état où f est fausse ». " +
          "Puis EF se réécrit avec EU. Tape la forme de base de <span class='mono'>AG r</span> " +
          "(au clavier : <span class='mono'>!</span> pour ¬, ou utilise les touches).</p>",
        objectif: "Écrire AG r avec seulement ¬, EU et true.",
        installer: function (zone, api) {
          exerciceSaisie(zone, api, {
            depart: "AG r", attendus: ["¬E(true U ¬r)"], exemple: "¬E(true U …)",
            indice: "Applique AG f ≡ ¬EF¬f, puis EF g ≡ E(true U g).",
            message: "Vérifie : S(E(true U ¬r)) = {s0, s2} (on peut atteindre s2), donc S(AG r) = {s1}."
          });
        }
      },

      /* 5 */
      {
        titre: "AF f ≡ ¬EG¬f",
        texte:
          "<p>« Sur tous les chemins, f arrive un jour » est faux exactement quand « il existe un chemin où f n'arrive jamais », " +
          "c'est-à-dire EG¬f. Donc AF f ≡ ¬EG¬f. Tape la forme de base de <span class='mono'>AF ¬q</span> " +
          "(simplifie ¬¬q en q).</p>",
        objectif: "Écrire AF ¬q avec seulement ¬ et EG.",
        installer: function (zone, api) {
          exerciceSaisie(zone, api, {
            depart: "AF ¬q", attendus: ["¬EG q"], exemple: "¬EG …",
            indice: "AF f ≡ ¬EG¬f avec f = ¬q.",
            message: "S(EG q) = {s1, s2}, donc S(AF ¬q) = {s0} : c'est ce qu'on avait trouvé à la main."
          });
        }
      },

      /* 6 */
      {
        titre: "Une formule entière",
        texte:
          "<p>Exercice 1 du 13 octobre : f ≡ EX(AG p → E(p U q)). On ajoute la règle de l'implication : a → b ≡ ¬a ∨ b, " +
          "et ¬AG p ≡ EF¬p (leçon précédente).</p>",
        objectif: "Remettre les étapes de la traduction dans l'ordre.",
        installer: function (zone, api) {
          Exercices.ordonner(zone, {
            consigne: "Touche les formules dans l'ordre, de la formule de départ à la forme de base.",
            items: ["EX(AG p → E(p U q))", "EX(¬AG p ∨ E(p U q))", "EX(EF¬p ∨ E(p U q))", "EX(E(true U ¬p) ∨ E(p U q))"],
            separateur: "≡",
            surReussite: function () {
              var r = LT.satisfait(S.M, LT.lire("EX(AG p → E(p U q))"));
              api.valider("Il ne reste que EX, ∨, EU, ¬ et true. Résultat du labelling : S(f) = " + MC.ens(r) + " (leçon suivante).");
            }
          });
          var n = el("div", "signalement");
          n.innerHTML = "La place des parenthèses de cet exercice n'est pas certaine : EX(AG p → E(p U q)) et EX AG(p → E(p U q)) sont deux formules différentes. " +
            "Sur ce système, les deux donnent tous les états ; à l'examen, lis bien les parenthèses du sujet.";
          zone.appendChild(n);
        }
      }
    ],
    fin: {
      texte:
        "<table class='tableau'><tr><th>Formule</th><th>Forme de base</th></tr>" +
        "<tr><td class='mono'>EF f</td><td class='mono'>E(true U f)</td></tr>" +
        "<tr><td class='mono'>AX f</td><td class='mono'>¬EX¬f</td></tr>" +
        "<tr><td class='mono'>AG f</td><td class='mono'>¬EF¬f ≡ ¬E(true U ¬f)</td></tr>" +
        "<tr><td class='mono'>AF f</td><td class='mono'>¬EG¬f</td></tr>" +
        "<tr><td class='mono'>a → b</td><td class='mono'>¬a ∨ b</td></tr>" +
        "<tr><td class='mono'>¬(a → b)</td><td class='mono'>a ∧ ¬b</td></tr></table>" +
        "<div class='signalement'>Ni les slides ni les notes ne donnent la réécriture de A(f U g) : elle n'est pas utilisée ici.</div>",
      cartes: "labelling"
    }
  });
})();
