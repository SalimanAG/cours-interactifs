/* Leçon : le cas EG de l'algorithme de labelling (slide 22 ; détails vus en cours le 13 octobre).
   Fil rouge : le système s0, s1, s2 des exercices du 13 octobre. */
(function () {
  "use strict";
  var el = Site.el;
  var S = MC.SYS;
  function sat(f) { return LT.satisfait(S.M, LT.lire(f)); }
  function horsDe(liste) { return S.M.etats.filter(function (s) { return liste.indexOf(s) < 0; }); }

  var REGLE = "<div class='encadre'><span class='titre-encadre'>Slide 22</span>" +
    "fᵢ ≡ EG(g) : on construit (S, R) ⇒ (S<sub>g</sub>, R<sub>g</sub>). On calcule les SCC non triviales de (S<sub>g</sub>, R<sub>g</sub>). " +
    "On étiquette avec « EG(g) » (i) tous les états qui appartiennent à une SCC non triviale et (ii) tous les états qui atteignent une SCC non triviale.</div>";

  Lecon.demarrer({
    matiere: "model-checking",
    id: "labelling-eg",
    etapes: [

      /* 1 */
      {
        titre: "Pourquoi des composantes fortement connexes ?",
        texte:
          "<p>EG g demande un chemin <b>infini</b> où g reste toujours vraie. Le graphe, lui, est fini.</p>" +
          "<p>Une SCC (composante fortement connexe) est un ensemble d'états tel que, pour deux états quelconques, " +
          "il existe un chemin du premier au second et du second au premier.</p>",
        objectif: "Comprendre ce que fait forcément un chemin infini dans un graphe fini.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "Dans un graphe fini, un chemin infini…",
            options: ["finit par tourner dans un cycle", "passe forcément par tous les états", "finit dans un état sans successeur"],
            bonne: 0,
            expliquer: [
              "Exact : il repasse une infinité de fois par certains états, donc il reste dans une SCC qui contient un cycle.",
              "Non : s0 s1 s1 s1 … ne passe jamais par s2.",
              "Impossible : R est totale, chaque état a un successeur."
            ],
            surReussite: function () { api.valider("Chercher un chemin infini où g tient, c'est chercher un cycle de g, et les états qui y mènent par g."); }
          }));
        }
      },

      /* 2 */
      {
        titre: "1. Restreindre le graphe à g",
        texte: REGLE +
          "<p>On garde seulement les états de S(g) et les flèches entre eux : S<sub>g</sub> = S(g), " +
          "R<sub>g</sub> = {(s₁, s₂) ∈ R | s₁, s₂ ∈ S<sub>g</sub>}. Formule : <span class='mono'>EG r</span>.</p>",
        objectif: "Trouver S_r, les états du graphe restreint.",
        installer: function (zone, api) {
          var suite = el("div");
          MC.marquer(zone, { retour: api.retour, valider: function () {} }, {
            sys: S, attendu: sat("r"), nom: "S_r", valider: false, indice: "S_r = S(r).",
            surReussite: function () {
              suite.appendChild(el("p", null, "Le graphe restreint (s2 et ses flèches sont estompés) :"));
              MC.figure(suite, S, { estompe: horsDe(sat("r")) });
              api.valider("Il reste s0 → s1 et la boucle s1 → s1.");
            }
          });
          zone.appendChild(suite);
        }
      },

      /* 3 */
      {
        titre: "2. Les SCC non triviales",
        texte:
          "<div class='encadre'><span class='titre-encadre'>SCC non triviale (définition donnée en cours)</span>" +
          "Une SCC est non triviale si elle contient plus d'un nœud, ou un seul nœud avec une boucle sur lui-même.</div>" +
          "<p>Dans le graphe restreint de l'étape précédente, il y a deux SCC : {s0} et {s1}. " +
          "On ajoute une troisième, prise ailleurs.</p>",
        objectif: "Classer chaque SCC.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["non triviale", "triviale"],
            items: [
              { texte: "{s1}, avec la boucle s1 → s1", bonne: 0, explication: "Un seul nœud, mais une auto-boucle : on peut y tourner indéfiniment." },
              { texte: "{s0}, sans boucle (s0 → s1 seulement)", bonne: 1, explication: "On ne peut pas revenir en s0 : aucun chemin infini n'y reste." },
              { texte: "{s0, s2}, avec s0 → s2 et s2 → s0", bonne: 0, explication: "Plus d'un nœud : il y a un cycle." }
            ],
            surReussite: function () { api.valider("Le calcul des SCC se fait en O(|S| + |R|)."); }
          });
        }
      },

      /* 4 */
      {
        titre: "3. Remonter vers les SCC",
        texte:
          "<p>On étiquette les états des SCC non triviales, puis tous les états de S<sub>g</sub> qui peuvent les <b>atteindre</b> " +
          "en restant dans le graphe restreint.</p><p>Dans le graphe restreint à r, la seule SCC non triviale est {s1}.</p>",
        objectif: "Trouver S(EG r).",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: S, attendu: sat("EG r"), nom: "S(EG r)", estompe: horsDe(sat("r")),
            indice: "{s1}, plus les états restés dans S_r qui atteignent s1.",
            message: "s1 (SCC non triviale) et s0 qui l'atteint : S(EG r) = {s0, s1}. Chemin témoin depuis s0 : s0 s1 s1 s1 …"
          });
        }
      },

      /* 5 */
      {
        titre: "À toi : EG(¬q ∨ ¬r)",
        texte:
          "<p>Exercice 4 du 13 octobre. On a déjà S(¬q ∨ ¬r) = {s0, s2}. Restreins, cherche les SCC non triviales, remonte.</p>",
        objectif: "Trouver S(EG(¬q ∨ ¬r)).",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: S, attendu: sat("EG(¬q ∨ ¬r)"), nom: "S(EG(¬q ∨ ¬r))", estompe: horsDe(sat("¬q ∨ ¬r")),
            indice: "Dans le graphe restreint à {s0, s2}, regarde les flèches s0 → s2 et s2 → s0.",
            message: "{s0, s2} est une SCC non triviale (deux nœuds, un cycle) : les deux états sont étiquetés."
          });
        }
      },

      /* 6 */
      {
        titre: "Assembler : EG r ∧ E(p U q)",
        texte:
          "<p>Exercice 3 du 13 octobre : h ≡ EG(r) ∧ E(p U q). Les deux morceaux sont déjà étiquetés : " +
          "S(EG r) = {s0, s1} (étape 4) et S(E(p U q)) = {s0, s1, s2} (leçon précédente).</p>",
        objectif: "Trouver S(h).",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: S, attendu: sat("EG r ∧ E(p U q)"), nom: "S(h)", indice: "∧ : intersection des deux ensembles.",
            message: "S(h) = {s0, s1}. Comme s0 est initial, M ⊨ h. À retenir : pour EG, on fait toutes les étapes (restreindre, SCC, remonter)."
          });
        }
      }
    ],
    fin: {
      texte:
        "<p><b>EG g</b> en trois temps :</p><ol><li>restreindre le graphe à S(g) ;</li>" +
        "<li>trouver les SCC non triviales (plus d'un état, ou un état avec une boucle) ;</li>" +
        "<li>étiqueter leurs états et ceux de S(g) qui les atteignent sans quitter S(g).</li></ol>" +
        "<p>Prochaine étape : l'atelier du four, où tout s'enchaîne sur une vraie formule.</p>",
      cartes: "labelling"
    }
  });
})();
