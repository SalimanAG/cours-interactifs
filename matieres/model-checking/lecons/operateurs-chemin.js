/* Leçon : X, F, G, U le long d'un chemin (sémantique de CTL*, slides 12 et 13).
   Fil rouge : le chemin π = s0 s2 s0 s1 s1 … du système s0, s1, s2 (exercices du 13 octobre). */
(function () {
  "use strict";
  var el = Site.el;
  var S = MC.SYS;
  var PI = { etats: ["s0", "s2", "s0", "s1"], boucle: 3 };

  function positions(f) {
    var v = LT.surChemin(S.M, PI, LT.lire(f));
    return v.map(function (b, i) { return b ? i : -1; }).filter(function (i) { return i >= 0; });
  }
  function regle(titre, corps) {
    return "<div class='encadre'><span class='titre-encadre'>" + titre + "</span>" + corps + "</div>";
  }
  var RAPPEL = "<p class='discret petit'>π = s0 s2 s0 s1 s1 s1 … Touche les positions i où la formule est vraie sur le suffixe πⁱ, puis « Vérifier ». " +
    "Après la position 3, tout se répète : la position 3 vaut pour toutes les suivantes.</p>";

  Lecon.demarrer({
    matiere: "model-checking",
    id: "operateurs-chemin",
    etapes: [

      /* 1 */
      {
        titre: "Une proposition, sur un chemin",
        texte:
          "<p>Les formules de chemin sont vraies ou fausses <b>sur un chemin</b>. Le cas de base : une formule d'état, comme une proposition q, " +
          "est vraie sur π si elle est vraie dans le <b>premier état</b> de π.</p>" +
          regle("Règle 7 (slide 12)", "M, π ⊨ f₁ ⟺ s est le premier état de π et M, s ⊨ f₁") +
          "<p>Donc πⁱ ⊨ q quand q ∈ L(sᵢ).</p>" + RAPPEL,
        objectif: "Marquer toutes les positions i où πⁱ ⊨ q.",
        installer: function (zone, api) {
          MC.marquerPositions(zone, api, { sys: S, chemin: PI, attendu: positions("q"), nom: "πⁱ ⊨ q pour i ∈",
            indice: "Regarde si q est dans l'étiquette de chaque case.", message: "q est vraie en s2 et s1 : positions 1 et 3 (et toutes les suivantes)." });
        }
      },

      /* 2 */
      {
        titre: "X : l'état suivant",
        texte:
          regle("Règle 11 (slide 13)", "M, π ⊨ X g₁ ⟺ M, π¹ ⊨ g₁") +
          "<p>X q est vraie en position i si q est vraie en position i + 1.</p>" + RAPPEL,
        objectif: "Marquer les positions où πⁱ ⊨ X q.",
        installer: function (zone, api) {
          MC.marquerPositions(zone, api, { sys: S, chemin: PI, attendu: positions("X q"), nom: "πⁱ ⊨ X q pour i ∈",
            indice: "Pour chaque case, regarde la case suivante (après la 3, c'est encore la 3).", message: "C'est q décalé d'un cran vers la gauche." });
        }
      },

      /* 3 */
      {
        titre: "F : un jour",
        texte:
          regle("Règle 12 (slide 13)", "M, π ⊨ F g₁ ⟺ il existe un k ≥ 0 tel que M, πᵏ ⊨ g₁") +
          "<p>k = 0 est permis : si g₁ est vraie tout de suite, F g₁ est vraie. Formule : <span class='mono'>F(p ∧ q)</span>.</p>" + RAPPEL,
        objectif: "Marquer les positions où πⁱ ⊨ F(p ∧ q).",
        installer: function (zone, api) {
          MC.marquerPositions(zone, api, { sys: S, chemin: PI, attendu: positions("F(p ∧ q)"), nom: "πⁱ ⊨ F(p ∧ q) pour i ∈",
            indice: "p ∧ q n'est vraie qu'en s2 (position 1). Depuis quelles positions la rencontre-t-on encore devant soi ?",
            message: "Après la position 1, on ne revient jamais en s2 : F(p ∧ q) devient fausse pour toujours." });
        }
      },

      /* 4 */
      {
        titre: "G : toujours",
        texte:
          regle("Règle 13 (slide 13)", "M, π ⊨ G g₁ ⟺ pour chaque i ≥ 0, M, πⁱ ⊨ g₁") +
          "<p>Formule : <span class='mono'>G r</span>. Une seule position sans r devant soi suffit à la rendre fausse.</p>" + RAPPEL,
        objectif: "Marquer les positions où πⁱ ⊨ G r.",
        installer: function (zone, api) {
          MC.marquerPositions(zone, api, { sys: S, chemin: PI, attendu: positions("G r"), nom: "πⁱ ⊨ G r pour i ∈",
            indice: "r est fausse en s2 (position 1). Depuis où ne la rencontre-t-on plus ?",
            message: "Depuis les positions 0 et 1, on passe par s2, où r est fausse." });
        }
      },

      /* 5 */
      {
        titre: "U : jusqu'à",
        texte:
          regle("Règle 14 (slide 13)", "M, π ⊨ g₁ U g₂ ⟺ il existe un k ≥ 0 tel que M, πᵏ ⊨ g₂ et pour chaque 0 ≤ j < k, M, πʲ ⊨ g₁") +
          "<p>g₂ doit <b>arriver un jour</b> ; avant, g₁ doit tenir à chaque pas. Si g₂ est vraie tout de suite (k = 0), " +
          "rien n'est demandé à g₁. Formule : <span class='mono'>p U ¬r</span>.</p>" + RAPPEL,
        objectif: "Marquer les positions où πⁱ ⊨ p U ¬r.",
        installer: function (zone, api) {
          MC.marquerPositions(zone, api, { sys: S, chemin: PI, attendu: positions("p U ¬r"), nom: "πⁱ ⊨ p U ¬r pour i ∈",
            indice: "¬r n'est vraie qu'en position 1. Il faut l'atteindre en ne passant que par des positions où p est vraie.",
            message: "Depuis la position 2, ¬r n'arrive jamais : p U ¬r est fausse, même si p est vraie en 2." });
        }
      },

      /* 6 */
      {
        titre: "Combiner les opérateurs",
        texte:
          "<p>Les opérateurs s'emboîtent : on lit de l'extérieur vers l'intérieur. Par exemple, <span class='mono'>F G q</span> : " +
          "« un jour, q sera vraie pour toujours ». On regarde ici le chemin entier, π = π⁰.</p>",
        objectif: "Dire si chaque formule est vraie sur π.",
        installer: function (zone, api) {
          function v(f) { return LT.surChemin(S.M, PI, LT.lire(f))[0]; }
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "π ⊨ F G q", vrai: v("F G q"), explication: "À partir de la position 3, on reste en s1 où q est vraie." },
              { texte: "π ⊨ G F p", vrai: v("G F p"), explication: "« p infiniment souvent » : après la position 2, p n'est plus jamais vraie." },
              { texte: "π ⊨ X X p", vrai: v("X X p"), explication: "π² commence en s0, où p est vraie." },
              { texte: "π ⊨ q U r", vrai: v("q U r"), explication: "r est vraie tout de suite (s0) : k = 0." }
            ],
            surReussite: function () { api.valider("G F : infiniment souvent ; F G : un jour, et pour toujours."); }
          });
        }
      },

      /* 7 */
      {
        titre: "G et F sont liés par la négation",
        texte:
          "<p>« r est toujours vraie » revient à « il n'arrivera jamais un moment où r est fausse ». Compare les positions où chaque formule est vraie :</p>",
        objectif: "Trouver la formule qui a exactement les mêmes positions vraies que G r.",
        installer: function (zone, api) {
          var t = el("table", "tableau");
          var lignes = ["G r", "¬F¬r", "F¬r", "¬G¬r"];
          var h = "<tr><th>formule</th><th class='num'>positions vraies</th></tr>";
          lignes.forEach(function (f, i) {
            h += "<tr><td class='mono'>" + (i === 0 ? f : "?") + "</td><td class='num'>" + (i === 0 ? positions(f).join(", ") : "") + "</td></tr>";
          });
          t.innerHTML = h;
          zone.appendChild(t);
          Exercices.choix(zone, MC.melanger({
            question: "Quelle formule est équivalente à G r ?",
            options: ["¬F¬r", "F¬r", "¬G¬r"],
            bonne: 0,
            expliquer: [
              "Exact : G g ≡ ¬F¬g. Et de même F g ≡ ¬G¬g.",
              "C'est le contraire : F¬r est vraie exactement là où G r est fausse (positions " + positions("F¬r").join(", ") + ").",
              "¬G¬r veut dire « r sera vraie au moins une fois » : vrai partout ici (positions " + positions("¬G¬r").join(", ") + ")."
            ],
            surReussite: function () {
              var tr = t.querySelectorAll("tr");
              lignes.forEach(function (f, i) {
                if (i) { tr[i + 1].children[0].textContent = f; tr[i + 1].children[1].textContent = positions(f).join(", ") || "aucune"; }
              });
              api.valider("G g ≡ ¬F¬g : ces dualités serviront pour réécrire les formules avant l'algorithme de labelling.");
            }
          }));
        }
      }
    ],
    fin: {
      texte:
        "<ul><li>X g : g au pas suivant (π¹).</li><li>F g : g un jour (k ≥ 0, maintenant compris).</li>" +
        "<li>G g : g à chaque pas.</li><li>g₁ U g₂ : g₂ arrive un jour, et g₁ tient à chaque pas avant.</li>" +
        "<li>G g ≡ ¬F¬g.</li></ul><p>Prochaine leçon : les quantificateurs A et E, qui parlent de <b>tous</b> les chemins ou d'<b>au moins un</b>.</p>",
      cartes: "logiques"
    }
  });
})();
