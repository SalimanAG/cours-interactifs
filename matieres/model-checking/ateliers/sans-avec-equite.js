/* Atelier : sans puis avec équité, sur le système de l'exercice du 3 novembre
   (s0 ⇄ s1 ⇄ s2, F = {{s0}, {s2}}) ; la formule g est un sujet d'examen d'une année précédente. */
(function () {
  "use strict";
  var el = Site.el;
  var S = MC.EQ;
  var EQUITE = [["s0"], ["s2"]];
  function sat(f, eq) { return LT.etiqueter(S.M, LT.versBase(LT.lire(f)), eq ? { equite: EQUITE } : {}).S; }
  function trace(f, eq) {
    var r = LT.etiqueter(S.M, LT.versBase(LT.lire(f)), eq ? { equite: EQUITE } : {});
    return "<table class='tableau'><tr><th>sous-formule</th><th>" + (eq ? "S_F(…)" : "S(…)") + "</th></tr>" +
      r.etapes.map(function (e) {
        var t = e.cas === "fair" ? "fair ≡ EG true" : e.texte;
        var note = e.cas === "EG" ? " — SCC : " + e.detail.sccs.map(function (c) {
          return MC.ens(c.etats) + (c.nonTriviale ? (eq ? (c.equitable ? " équitable" : " non triviale mais NOT FAIR") : " non triviale") : " triviale");
        }).join(", ") : "";
        return "<tr><td class='mono'>" + t + "</td><td class='mono'>" + MC.ens(e.S) + "<span class='discret petit'>" + note + "</span></td></tr>";
      }).join("") + "</table>";
  }
  function exo(zone, api, f, eq, indice, message) {
    var corr = el("div");
    MC.marquer(zone, { retour: api.retour, valider: function () {} }, {
      sys: S, attendu: sat(f, eq), nom: (eq ? "S_F(" : "S(") + f + ")", valider: false, indice: indice,
      surReussite: function () {
        corr.innerHTML = "<p class='petit discret'>Correction ligne par ligne :</p>" + trace(f, eq);
        api.valider(message);
      }
    });
    zone.appendChild(corr);
  }

  Lecon.demarrer({
    matiere: "model-checking",
    id: "sans-avec-equite",
    etapes: [
      {
        titre: "f ≡ EG q ∨ EX¬p, sans équité",
        texte: "<p>Le système de l'exercice d'équité (s0 initial). Commence <b>sans</b> contrainte d'équité. " +
          "Fais le calcul sur papier (une ligne S(…) par sous-formule), puis touche les états de S(f).</p>" +
          "<div class='signalement'>Système et formules dictés en cours le 3 novembre (absents des slides).</div>",
        objectif: "Trouver S(f).",
        installer: function (zone, api) {
          exo(zone, api, "EG q ∨ EX¬p", false, "EG q : restreins à S(q) = {s0, s1}. EX¬p : prédécesseurs de S(¬p) = {s0}.",
            "s2 ne satisfait ni EG q (il n'a pas q) ni EX¬p (son seul successeur, s1, a p).");
        }
      },
      {
        titre: "La même formule, avec F = {{s0}, {s2}}",
        texte: "<p>Un chemin équitable passe une infinité de fois par s0 <b>et</b> une infinité de fois par s2. " +
          "Commence par S(fair) = S(EG true), puis applique la méthode équitable.</p>",
        objectif: "Trouver S_F(f).",
        installer: function (zone, api) {
          exo(zone, api, "EG q ∨ EX¬p", true, "Pour EG q : la SCC {s0, s1} contient-elle un état de chaque Pᵢ, donc aussi de {s2} ?",
            "On a perdu s0 : une SCC équitable doit contenir un état de chaque Pᵢ, pas seulement d'un des deux.");
        }
      },
      {
        titre: "Sujet d'examen : g, sans équité",
        texte: "<p>g ≡ E(q U r) ∧ EX(p ∧ q) ∧ EG p, d'abord sans équité.</p>",
        objectif: "Trouver S(g).",
        installer: function (zone, api) {
          exo(zone, api, "E(q U r) ∧ EX(p ∧ q) ∧ EG p", false, "Trois ensembles à calculer, puis leur intersection. EG p : restreins à S(p) = {s1, s2}.",
            "Une conjonction : l'intersection des trois ensembles.");
        }
      },
      {
        titre: "Sujet d'examen : g, avec F = {{s0}, {s2}}",
        texte: "<p>Même formule, avec la contrainte d'équité. (Si aucun état ne convient, ne touche rien et vérifie.)</p>",
        objectif: "Trouver S_F(g).",
        installer: function (zone, api) {
          exo(zone, api, "E(q U r) ∧ EX(p ∧ q) ∧ EG p", true, "Pour EG p : la SCC {s1, s2} contient-elle un état de {s0} ?",
            "S_F(EG p) = ∅ (SCC {s1, s2} NOT FAIR), donc la conjonction est vide.");
        }
      }
    ],
    fin: {
      texte: "<p>Méthode : (1) S(fair) ; (2) propositions : S(p) ∩ S(fair) ; (3) EX(f ∧ fair), E(f₁ U (f₂ ∧ fair)) ; " +
        "(4) EG : SCC non triviales qui touchent <b>chaque</b> Pᵢ ; (5) ¬ : complémentaire.</p>",
      cartes: "equite"
    }
  });
})();
