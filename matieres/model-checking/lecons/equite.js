/* Leçon : contraintes d'équité (cours oral du 3 novembre ; absent des slides).
   Fil rouge : le four (slide 25) avec F = {{6, 7}}. */
(function () {
  "use strict";
  var el = Site.el;
  var F = MC.FOUR;
  var EQUITE = [["6", "7"]];
  function satF(f) { return LT.etiqueter(F.M, LT.versBase(LT.lire(f)), { equite: EQUITE }).S; }
  function regle(titre, corps) { return "<div class='encadre'><span class='titre-encadre'>" + titre + "</span>" + corps + "</div>"; }
  var ORAL = "<div class='signalement'>Cette notion a été vue au tableau le 3 novembre ; elle n'est pas dans les slides. Définitions et notations reprises du cours oral.</div>";

  Lecon.demarrer({
    matiere: "model-checking",
    id: "equite",
    etapes: [

      /* 1 */
      {
        titre: "Un contre-exemple irréaliste",
        texte:
          "<p>Dans l'atelier du four, AG(Start → AF Heat) était fausse à cause du chemin 1 → 2 → 5 → 2 → 5 … : " +
          "on ouvre et ferme la porte sans fin. Personne n'utilise un four comme ça.</p>" +
          "<p>Une <b>contrainte d'équité</b> (fairness) dit quels états un chemin doit visiter une infinité de fois. " +
          "Les chemins qui ne la respectent pas sont simplement <b>ignorés</b>.</p>" + ORAL,
        objectif: "Dire ce que change une contrainte d'équité.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "Avec une contrainte d'équité, le model checker…",
            options: ["ne considère que les chemins équitables", "supprime des états du modèle", "ajoute des transitions au modèle"],
            bonne: 0,
            expliquer: ["Exact : le modèle ne change pas, seuls les chemins pris en compte changent.", "Non : les états restent ; ce sont les chemins non équitables qui sont ignorés.", "Non : le modèle ne change pas."],
            surReussite: function () { api.valider(); }
          }));
        }
      },

      /* 2 */
      {
        titre: "Chemin équitable",
        texte:
          regle("Structure de Kripke équitable (cours du 3 novembre)",
            "M = (S, S₀, R, L, F) où F ⊆ 2<sup>S</sup> est un ensemble de contraintes d'équité : F = {P₁, …, Pₖ}, chaque Pᵢ est un ensemble d'états.<br>" +
            "Pour un chemin π : inf(π) = {s | s = sᵢ pour une infinité de i} (les états visités une infinité de fois).<br>" +
            "π est <b>équitable</b> ⟺ pour chaque P ∈ F, inf(π) ∩ P ≠ ∅.") +
          "<p>Pour le four, une seule contrainte : P = {6, 7} (les états où Start ∧ Close ∧ ¬Error). " +
          "Un chemin équitable repasse une infinité de fois par 6 ou par 7.</p>",
        objectif: "Classer chaque chemin du four.",
        installer: function (zone, api) {
          MC.figure(zone, F, { plein: ["6", "7"] });
          zone.appendChild(el("p", "legende-figure", "États remplis : la contrainte P = {6, 7}."));
          Exercices.associer(zone, {
            categories: ["équitable", "pas équitable"],
            items: [
              { texte: "1 2 5 2 5 2 5 …", bonne: 1, explication: "inf(π) = {2, 5} ne touche pas {6, 7}." },
              { texte: "1 3 6 7 4 4 4 … (cuisson sans fin)", bonne: 1, explication: "inf(π) = {4} : on ne passe par 6 et 7 qu'une fois." },
              { texte: "1 3 6 7 4 3 6 7 4 3 …", bonne: 0, explication: "inf(π) = {3, 6, 7, 4} contient 6 et 7." },
              { texte: "1 3 1 3 1 3 …", bonne: 1, explication: "inf(π) = {1, 3}." }
            ],
            surReussite: function () { api.valider("Seul compte ce qui se répète à l'infini : un passage fini par 6 ou 7 ne suffit pas."); }
          });
        }
      },

      /* 3 */
      {
        titre: "La sémantique équitable ⊨_F",
        texte:
          "<p>On note M, s ⊨<sub>F</sub> f : « s satisfait f de façon équitable ». Par rapport à la sémantique de CTL*, seules trois règles changent :</p>" +
          "<table class='tableau'><tr><th>Règle</th><th>Définition</th></tr>" +
          "<tr><td>1. M, s ⊨<sub>F</sub> p</td><td>il y a un chemin équitable à partir de s et p ∈ L(s)</td></tr>" +
          "<tr><td>5. M, s ⊨<sub>F</sub> E g₁</td><td>il y a un chemin équitable π à partir de s tel que π ⊨<sub>F</sub> g₁</td></tr>" +
          "<tr><td>6. M, s ⊨<sub>F</sub> A g₁</td><td>pour chaque chemin équitable π à partir de s, π ⊨<sub>F</sub> g₁</td></tr></table>",
        objectif: "Repérer le piège de la règle 1.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "Un état s a p ∈ L(s), mais aucun chemin équitable ne part de s. Alors…",
            options: ["M, s ⊭_F p", "M, s ⊨_F p", "ça dépend de la formule"],
            bonne: 0,
            expliquer: ["Exact : pour une proposition atomique, il ne suffit plus que s soit étiqueté par p ; il faut aussi un chemin équitable depuis s.",
              "Non : la règle 1 demande en plus un chemin équitable à partir de s.", "Non : c'est la règle 1, pour toute proposition atomique."],
            surReussite: function () { api.valider(); }
          }));
        }
      },

      /* 4 */
      {
        titre: "La proposition fair",
        texte:
          regle("Pré-traitement (cours du 3 novembre)",
            "On introduit une proposition fair, vraie dans s si et seulement si un chemin équitable part de s : <b>fair ≡ EG true</b> (avec la procédure équitable).") +
          regle("SCC équitable", "Une SCC C est équitable par rapport à F si et seulement si, pour chaque Pᵢ ∈ F, il y a un état tᵢ ∈ C ∩ Pᵢ.") +
          "<p>Calcul de S(fair) : tout le graphe (true est vraie partout), ses SCC non triviales <b>et équitables</b>, puis les états qui les atteignent.</p>",
        objectif: "Trouver S(fair) pour le four avec F = {{6, 7}}.",
        installer: function (zone, api) {
          var fair = LT.etiqueter(F.M, { op: "vrai" }, { equite: EQUITE }).fair;
          MC.marquer(zone, api, {
            sys: F, attendu: fair, nom: "S(fair)",
            indice: "Cherche un cycle qui passe par tous les états.",
            message: "Le cycle 1 → 2 → 5 → 3 → 6 → 7 → 4 → 1 passe par tous les états : une seule SCC, qui contient 6 et 7. Tous les états sont fair."
          });
        }
      },

      /* 5 */
      {
        titre: "EG équitable : des SCC équitables",
        texte:
          regle("Cas EG g₁ équitable (cours du 3 novembre)",
            "1. Restreindre (S, R) → (S<sub>g₁</sub>, R<sub>g₁</sub>).<br>2. Chercher les SCC non triviales <b>et équitables</b>.<br>" +
            "3. S(EG g₁) = les états de ces SCC, plus ceux de S<sub>g₁</sub> qui les atteignent sans sortir de S<sub>g₁</sub>.") +
          "<p>Le graphe restreint à ¬Heat est affiché. Sans équité, S(EG¬Heat) = {1, 2, 3, 5}. Et avec F = {{6, 7}} ? " +
          "(Si aucun état ne convient, ne touche rien et vérifie.)</p>",
        objectif: "Trouver S_F(EG¬Heat).",
        installer: function (zone, api) {
          var nh = LT.satisfait(F.M, LT.lire("¬Heat"));
          MC.marquer(zone, api, {
            sys: F, attendu: satF("EG¬Heat"), nom: "S_F(EG¬Heat)",
            estompe: F.M.etats.filter(function (s) { return nh.indexOf(s) < 0; }),
            indice: "La seule SCC non triviale est {1, 2, 3, 5}. Contient-elle un état de P = {6, 7} ?",
            message: "{1, 2, 3, 5} ne contient ni 6 ni 7 : elle n'est pas équitable. Aucune SCC équitable : S_F(EG¬Heat) = ∅."
          });
        }
      },

      /* 6 */
      {
        titre: "Les autres cas, avec fair",
        texte:
          "<p>Les autres cas se ramènent à l'algorithme classique (cours du 3 novembre) :</p>" +
          "<table class='tableau'><tr><th>Pour savoir si…</th><th>on vérifie (classique) si…</th></tr>" +
          "<tr><td class='mono'>M, s ⊨_F p</td><td class='mono'>M, s ⊨ p ∧ fair</td></tr>" +
          "<tr><td class='mono'>M, s ⊨_F EX f₁</td><td class='mono'>M, s ⊨ EX(f₁ ∧ fair)</td></tr>" +
          "<tr><td class='mono'>M, s ⊨_F E(f₁ U f₂)</td><td class='mono'>M, s ⊨ E(f₁ U (f₂ ∧ fair))</td></tr>" +
          "<tr><td class='mono'>M, s ⊨_F EG g₁</td><td>SCC équitables (étape précédente)</td></tr></table>" +
          "<p>Une négation prend toujours le complémentaire.</p>",
        objectif: "Placer fair au bon endroit.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "Pour M, s ⊨_F EX f₁, on vérifie…",
            options: ["M, s ⊨ EX(f₁ ∧ fair)", "M, s ⊨ EX f₁ ∧ fair", "M, s ⊨ EX f₁"],
            bonne: 0,
            expliquer: ["Exact : fair va à l'intérieur, avec f₁ (le successeur doit avoir un chemin équitable devant lui).",
              "Piège signalé en cours : fair va à l'intérieur du EX, pas à côté.", "Il manque la contrainte d'équité."],
            surReussite: function () { api.valider("Pour EU, fair va avec f₂ : E(f₁ U (f₂ ∧ fair))."); }
          }));
        }
      },

      /* 7 */
      {
        titre: "Le four devient correct",
        texte:
          "<p>Même formule : g ≡ AG(Start → AF Heat) ≡ ¬E(true U (Start ∧ EG¬Heat)), avec F = {{6, 7}}. " +
          "S_F(EG¬Heat) = ∅, donc S_F(Start ∧ EG¬Heat) = ∅, donc S_F(E(true U …)) = ∅ (aucun état de départ). Reste la négation.</p>",
        objectif: "Trouver S_F(g).",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: F, attendu: satF("AG(Start → AF Heat)"), nom: "S_F(g)",
            indice: "La négation prend le complémentaire de ∅.",
            message: "Tous les états : avec l'équité, la propriété est vraie. Tout chemin équitable repasse par 6 ou 7 ; depuis 6, on va forcément en 7 où Heat est vraie."
          });
          var c = el("div", "encadre");
          c.innerHTML = "<span class='titre-encadre'>Complexité (cours du 3 novembre)</span>O(|f| · (|S| + |R|) · |F|) : en pratique |f| et |F| sont petits, l'algorithme reste linéaire en |S| + |R|.";
          zone.appendChild(c);
        }
      }
    ],
    fin: {
      texte:
        "<ul><li>π équitable ⟺ inf(π) touche chaque Pᵢ ∈ F.</li>" +
        "<li>fair ≡ EG true ; un état non fair ne satisfait de façon équitable aucune formule p, EX, EU, EG.</li>" +
        "<li>p ∧ fair ; EX(f₁ ∧ fair) ; E(f₁ U (f₂ ∧ fair)) ; EG : SCC non triviales <b>et</b> équitables.</li>" +
        "<li>Ajouter l'équité ne fait pas toujours basculer le résultat de « aucun état » à « tous les états », mais en général il change.</li></ul>",
      cartes: "equite"
    }
  });
})();
