/* Leçon : A et E, les formules d'état (syntaxe et sémantique de CTL*, slides 10 à 13).
   Fil rouge : le système s0, s1, s2 des exercices du 13 octobre. */
(function () {
  "use strict";
  var el = Site.el;
  var S = MC.SYS;
  function sat(f) { return LT.satisfait(S.M, LT.lire(f)); }
  function regle(titre, corps) {
    return "<div class='encadre'><span class='titre-encadre'>" + titre + "</span>" + corps + "</div>";
  }
  var CONSIGNE = "<p class='discret petit'>Touche les états qui satisfont la formule (ils se remplissent), puis « Vérifier ».</p>";

  Lecon.demarrer({
    matiere: "model-checking",
    id: "quantificateurs",
    etapes: [

      /* 1 */
      {
        titre: "Formules d'état, formules de chemin",
        texte:
          "<p>CTL* utilise des <b>quantificateurs de chemin</b> : A (pour tous les chemins) et E (il existe un chemin), " +
          "et les opérateurs X, G, F, U, que les slides appellent quantificateurs d'état (slide 10).</p>" +
          regle("Syntaxe de CTL* (slide 11)",
            "1. Si p ∈ AP, p est une formule d'état.<br>2. Si f et g sont des formules d'état, ¬f, f ∨ g, f ∧ g sont des formules d'état.<br>" +
            "3. Si f est une formule de chemin, E f et A f sont des formules d'état.<br>4. Si f est une formule d'état, f est aussi une formule de chemin.<br>" +
            "5. Si f et g sont des formules de chemin, ¬f, f ∨ g, f ∧ g, X f, F f, G f et f U g sont des formules de chemin.") +
          "<div class='signalement'>Slide 11, règle 5 : il est écrit « Xf, Gf, Gf » ; le second Gf est une coquille pour Ff (F est bien défini par la sémantique, slide 13).</div>" +
          "<p>Une formule d'état est vraie ou fausse <b>dans un état</b> ; c'est ce que vérifie le model checking (M, s ⊨ f).</p>",
        objectif: "Classer chaque formule.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["formule d'état", "formule de chemin (seulement)"],
            items: [
              { texte: "p", bonne: 0, explication: "Règle 1 (et, par la règle 4, aussi une formule de chemin)." },
              { texte: "X p", bonne: 1, explication: "Règle 5 : il faut un chemin pour parler de l'état suivant." },
              { texte: "EX p", bonne: 0, explication: "Règle 3 : E devant une formule de chemin." },
              { texte: "G q", bonne: 1, explication: "Règle 5." },
              { texte: "AG q", bonne: 0, explication: "Règle 3." },
              { texte: "p ∧ EF q", bonne: 0, explication: "Règle 2 : ∧ entre deux formules d'état." },
              { texte: "F p ∨ G q", bonne: 1, explication: "Règle 5 : ∨ entre deux formules de chemin." }
            ],
            surReussite: function () { api.valider("Pour obtenir une formule d'état à partir d'un X, F, G ou U, il faut un A ou un E devant."); }
          });
        }
      },

      /* 2 */
      {
        titre: "E : il existe un chemin",
        texte:
          regle("Règle 5 (slide 12)", "M, s ⊨ E g₁ ⟺ il existe un chemin π partant de s tel que M, π ⊨ g₁") +
          "<p>Formule : <span class='mono'>EX ¬q</span> — il existe un chemin dont le 2ᵉ état n'a pas q, " +
          "c'est-à-dire : <b>au moins un successeur</b> satisfait ¬q.</p>" + CONSIGNE,
        objectif: "Trouver S(EX ¬q), l'ensemble des états qui satisfont EX ¬q.",
        installer: function (zone, api) {
          MC.marquer(zone, api, { sys: S, attendu: sat("EX ¬q"), nom: "S(EX ¬q)",
            indice: "¬q n'est vraie qu'en s0. Quels états ont une flèche vers s0 ?",
            message: "Seul s2 a un successeur (s0) où q est fausse." });
        }
      },

      /* 3 */
      {
        titre: "A : pour tous les chemins",
        texte:
          regle("Règle 6 (slide 12)", "M, s ⊨ A g₁ ⟺ pour chaque chemin π partant de s, M, π ⊨ g₁") +
          "<p>Formule : <span class='mono'>AX q</span> — <b>tous les successeurs</b> satisfont q.</p>" + CONSIGNE,
        objectif: "Trouver S(AX q).",
        installer: function (zone, api) {
          MC.marquer(zone, api, { sys: S, attendu: sat("AX q"), nom: "S(AX q)",
            indice: "Pour chaque état, regarde tous ses successeurs : un seul successeur sans q suffit à exclure l'état.",
            message: "s2 est exclu : il a un successeur, s0, où q est fausse." });
        }
      },

      /* 4 */
      {
        titre: "EF et AF : un jour, sur un chemin ou sur tous",
        texte:
          "<p><span class='mono'>EF ¬q</span> : il existe un chemin où ¬q arrive un jour (un état sans q est <b>atteignable</b>, l'état de départ compris). " +
          "<span class='mono'>AF ¬q</span> : sur <b>tous</b> les chemins, ¬q arrive un jour.</p>" + CONSIGNE,
        objectif: "Trouver S(EF ¬q), puis S(AF ¬q).",
        installer: function (zone, api) {
          var suite = el("div");
          MC.marquer(zone, { retour: api.retour, valider: function () {} }, {
            sys: S, attendu: sat("EF ¬q"), nom: "S(EF ¬q)", valider: false,
            indice: "Depuis quels états peut-on atteindre s0 (s0 compris) ?",
            surReussite: function () {
              api.retour("S(EF ¬q) = {s0, s2} : depuis s1, on reste en s1 pour toujours, s0 est inatteignable.", true);
              Exercices.choix(suite, MC.melanger({
                question: "Et S(AF ¬q) ?",
                options: ["{s0}", "{s0, s2}", "{s0, s1, s2}"],
                bonne: 0,
                expliquer: [
                  "Exact. Depuis s2, le chemin s2 s1 s1 s1 … ne rencontre jamais ¬q : un seul chemin suffit à rendre AF ¬q fausse.",
                  "Depuis s2, le chemin s2 s1 s1 … ne passe jamais par s0 : AF ¬q y est fausse.",
                  "Depuis s1, on reste en s1 où q est vraie."
                ],
                surReussite: function () { api.valider("EF : il suffit d'un chemin. AF : il faut tous les chemins."); }
              }));
            }
          });
          zone.appendChild(suite);
        }
      },

      /* 5 */
      {
        titre: "EG et AG : toujours",
        texte:
          "<p><span class='mono'>EG r</span> : il existe un chemin où r est vraie <b>à chaque pas</b>. " +
          "<span class='mono'>AG r</span> : sur tous les chemins, r est toujours vraie.</p>" + CONSIGNE,
        objectif: "Trouver S(EG r).",
        installer: function (zone, api) {
          MC.marquer(zone, api, { sys: S, attendu: sat("EG r"), nom: "S(EG r)",
            indice: "Cherche un chemin infini qui ne passe jamais par s2 (le seul état sans r).",
            message: "Depuis s0 : s0 s1 s1 s1 … ; depuis s1 : s1 s1 … En revanche S(AG r) = {s1} : depuis s0, le chemin s0 s2 … rencontre ¬r." });
        }
      },

      /* 6 */
      {
        titre: "Nier A et E",
        texte:
          "<p>Nier « sur tous les chemins, toujours f » donne « il existe un chemin où, un jour, f est fausse ». " +
          "Le A devient E, le G devient F, et la négation passe à l'intérieur.</p>",
        objectif: "Trouver la négation de AG f.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "¬AG f ≡ ?",
            options: ["EF ¬f", "AF ¬f", "EG ¬f", "¬EG f"],
            bonne: 0,
            expliquer: [
              "Exact. De même ¬AX f ≡ EX ¬f et ¬AF f ≡ EG ¬f.",
              "Pour contredire « tous les chemins », un seul chemin suffit : E, pas A.",
              "Pour contredire « toujours f », il suffit que f soit fausse une fois : F, pas G.",
              "¬EG f dit « aucun chemin où f est toujours vraie » : ce n'est pas la même chose."
            ],
            surReussite: function () { api.valider("Ces règles servent à réécrire les formules avant l'algorithme (leçon suivante de ce chapitre)."); }
          }));
        }
      }
    ],
    fin: {
      texte:
        "<ul><li>E g : il existe un chemin depuis s qui satisfait g. A g : tous les chemins depuis s.</li>" +
        "<li>EX : un successeur ; AX : tous les successeurs.</li><li>EF : atteignable ; AG : vrai partout où l'on peut aller.</li>" +
        "<li>¬AG f ≡ EF ¬f, ¬AX f ≡ EX ¬f, ¬AF f ≡ EG ¬f.</li></ul>",
      cartes: "logiques"
    }
  });
})();
