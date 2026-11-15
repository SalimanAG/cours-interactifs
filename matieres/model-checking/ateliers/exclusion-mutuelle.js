/* Atelier : exclusion mutuelle en SPL (slides 23-24) — construire le système de transitions,
   puis vérifier g ≡ ¬EF(CR₀ ∧ CR₁). Construction par entrelacement, comme fait en cours le 20 octobre. */
(function () {
  "use strict";
  var el = Site.el;
  var MX = MC.MUTEX;
  function sat(f) { return LT.satisfait(MX.M, LT.lire(f)); }
  function triplet(t, a, b) { return "(" + t + ", " + a + ", " + b + ")"; }
  var PROG =
    "<div class='code'>P = m: cobegin P0 || P1 coend m′\n\n" +
    "P0 ::  l0: while True do\n          NC0: wait (turn=0);\n          CR0: turn:= 1;\n        endwhile\n        l0′\n\n" +
    "P1 ::  l1: while True do\n          NC1: wait (turn=1);\n          CR1: turn:= 0;\n        endwhile\n        l1′</div>";

  Lecon.demarrer({
    matiere: "model-checking",
    id: "exclusion-mutuelle",
    etapes: [

      /* 1 */
      {
        titre: "Le programme et ses états",
        texte:
          "<p>Deux processus partagent la variable turn (slide 23) :</p>" + PROG +
          "<p>NC = région non critique (on attend son tour), CR = région critique. " +
          "Un état du système est un triplet <b>(turn, pc₀, pc₁)</b> : pc₀ ∈ {ℓ₀, NC₀, CR₀, ℓ₀′, ⊥} dit où en est P0 (⊥ : pas encore démarré), de même pour pc₁.</p>" +
          "<div class='signalement'>La méthode de construction (compteurs de programme, ⊥, entrelacement, boucle quand un wait est bloqué) a été donnée au tableau le 20 octobre ; les slides montrent seulement le programme et le graphe.</div>",
        objectif: "Trouver le nombre d'états initiaux.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "turn n'est initialisé nulle part. Combien d'états initiaux ?",
            options: ["2 : (0, ⊥, ⊥) et (1, ⊥, ⊥)", "1 : (0, ⊥, ⊥)", "4 : toutes les combinaisons de turn et des ⊥"],
            bonne: 0,
            expliquer: ["Exact : un état initial par valeur possible de la variable non initialisée.", "turn peut valoir 0 ou 1 au départ.", "Au départ, les deux processus sont à ⊥ : seul turn varie."],
            surReussite: function () { api.valider(); }
          }));
        }
      },

      /* 2 */
      {
        titre: "Avancer un processus à la fois",
        texte:
          "<p>Hypothèse : <b>entrelacement</b> (asynchrone) — à chaque pas, un seul processus fait une transition. " +
          "Depuis chaque état, on se demande : « et si P0 avance ? », puis « et si P1 avance ? ».</p>" +
          "<table class='tableau'><tr><th>instruction</th><th>quand le processus avance</th></tr>" +
          "<tr><td>cobegin</td><td>(⊥, ⊥) → (ℓ₀, ℓ₁)</td></tr><tr><td>ℓᵢ : while true</td><td>vers NCᵢ</td></tr>" +
          "<tr><td>NCᵢ : wait (turn = i)</td><td>si turn = i : vers CRᵢ ; sinon bloqué (boucle sur l'état)</td></tr>" +
          "<tr><td>CRᵢ : turn := 1 − i</td><td>turn change, retour en ℓᵢ</td></tr></table>",
        objectif: "Trouver le bon successeur dans trois situations.",
        installer: function (zone, api) {
          var qs = [
            { q: "Depuis (0, NC₀, ℓ₁), P0 avance :", o: ["(0, CR₀, ℓ₁)", "(0, NC₀, ℓ₁) (bloqué)", "(1, NC₀, ℓ₁)"], e: "turn = 0 : le wait de P0 passe." },
            { q: "Depuis (0, ℓ₀, NC₁), P1 avance :", o: ["(0, ℓ₀, NC₁) (bloqué : boucle)", "(0, ℓ₀, CR₁)", "(1, ℓ₀, CR₁)"], e: "turn = 0 ≠ 1 : P1 attend, on dessine une boucle." },
            { q: "Depuis (0, CR₀, NC₁), P0 avance :", o: ["(1, ℓ₀, NC₁)", "(0, ℓ₀, NC₁)", "(1, CR₀, NC₁)"], e: "En sortant de CR₀, P0 passe la main : turn := 1, et revient en ℓ₀." }
          ];
          var k = 0, boite = el("div");
          zone.appendChild(boite);
          function suivante() {
            boite.innerHTML = "";
            if (k >= qs.length) { api.valider("Chaque état a au plus deux flèches sortantes : une par processus."); return; }
            var x = qs[k];
            Exercices.choix(boite, MC.melanger({
              question: (k + 1) + " / 3 — " + x.q, options: x.o, bonne: 0,
              expliquer: x.o.map(function (o, i) { return i ? "Non. " + x.e : "Exact. " + x.e; }),
              surReussite: function () { k++; setTimeout(suivante, 900); }
            }));
          }
          suivante();
        }
      },

      /* 3 */
      {
        titre: "Le système complet",
        texte:
          "<p>En partant des deux états initiaux et en appliquant ces règles, on obtient <b>14 états</b> " +
          "(à gauche turn = 0, à droite turn = 1). C'est le graphe de la slide 24, redessiné ; le tableau donne le triplet de chaque état.</p>",
        objectif: "Toucher les états où P0 est en région critique, S(CR₀).",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: MX, attendu: sat("CR0"), nom: "S(CR₀)", sansSous: true, indice: "Cherche CR0 dans le tableau.",
            message: "{6, 7} : tous deux du côté turn = 0. Avec turn = 0, seul P0 passe son wait."
          });
          MX.tableau(zone);
        }
      },

      /* 4 */
      {
        titre: "Vérifier g ≡ ¬EF(CR₀ ∧ CR₁)",
        texte:
          "<p>« Il n'existe aucun chemin qui mène un jour à un état où CR₀ et CR₁ sont vraies ensemble. » " +
          "Dans la base : g ≡ ¬E(true U (CR₀ ∧ CR₁)).</p>" +
          "<p>S(CR₀) = {6, 7}, S(CR₁) = {13, 14}, donc S(CR₀ ∧ CR₁) = ∅ ; E(true U …) n'a aucun état de départ : ∅. Reste la négation.</p>",
        objectif: "Trouver S(g).",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: MX, attendu: sat("¬EF(CR0 ∧ CR1)"), nom: "S(g)", sansSous: true, indice: "Complémentaire de ∅.",
            message: "Tous les états, en particulier les initiaux 1 et 8 : l'exclusion mutuelle est vérifiée. (On a aussi g ≡ AG¬(CR₀ ∧ CR₁).)"
          });
        }
      },

      /* 5 */
      {
        titre: "Pourquoi ça marche",
        texte: "<p>Un dernier regard sur le graphe : turn ne change qu'en sortant d'une région critique.</p>",
        objectif: "Expliquer l'exclusion mutuelle.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "Pourquoi P0 et P1 ne sont-ils jamais ensemble en région critique ?",
            options: [
              "Pour entrer en CRᵢ il faut turn = i, et turn ne change qu'en sortant d'une région critique",
              "Parce que les processus ne s'exécutent jamais en parallèle",
              "Parce que la relation de transition n'est pas totale"
            ],
            bonne: 0,
            expliquer: ["Exact.", "Ils s'exécutent en parallèle (entrelacement) : c'est justement ce qui rend la vérification utile.", "Elle est totale : un wait bloqué donne une boucle."],
            surReussite: function () { api.valider("À l'examen : variables d'état, états initiaux, « si P0 avance / si P1 avance », boucles des wait bloqués, puis labelling."); }
          }));
        }
      }
    ],
    fin: { texte: "<ul><li>Un état = valeurs des variables partagées + un compteur de programme par processus (⊥ : pas le contrôle).</li>" +
      "<li>Variable non initialisée ⇒ plusieurs états initiaux.</li><li>Entrelacement : un seul processus avance à la fois ; un wait bloqué est une boucle.</li>" +
      "<li>g ≡ ¬EF(CR₀ ∧ CR₁) est vraie dans les 14 états.</li></ul>", cartes: "labelling" }
  });
})();
