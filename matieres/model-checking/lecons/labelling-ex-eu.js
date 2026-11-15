/* Leçon : l'algorithme de labelling CTL, cas p, ¬, ∨, EX, EU (slides 19 à 22).
   Fil rouge : le système s0, s1, s2 des exercices du 13 octobre. */
(function () {
  "use strict";
  var el = Site.el;
  var S = MC.SYS;
  function sat(f) { return LT.satisfait(S.M, LT.lire(f)); }
  function regle(titre, corps) {
    return "<div class='encadre'><span class='titre-encadre'>" + titre + "</span>" + corps + "</div>";
  }
  var CONSIGNE = "<p class='discret petit'>Touche les états de l'ensemble, puis « Vérifier ».</p>";

  Lecon.demarrer({
    matiere: "model-checking",
    id: "labelling-ex-eu",
    etapes: [

      /* 1 */
      {
        titre: "Le problème, et l'idée de l'algorithme",
        texte:
          regle("Model checking (slide 19)",
            "Étant donné M = (S, S₀, R, L), un état s ∈ S et une formule f, établir si M, s ⊨ f.<br>" +
            "Problème plus général : trouver tous les états qui satisfont f, {s ∈ S | M, s ⊨ f}.") +
          "<p>L'algorithme résout le problème général. Il étiquette avec « fᵢ » tous les états qui satisfont fᵢ ; " +
          "à l'étape i, il traite les sous-formules qui ont i − 1 opérateurs imbriqués (slide 20) : " +
          "<b>des plus petites sous-formules vers la formule entière</b>. On note S(f) l'ensemble des états étiquetés par f " +
          "(notation conseillée en cours).</p>",
        objectif: "Ranger les sous-formules de ¬EX¬q dans l'ordre où l'algorithme les étiquette.",
        installer: function (zone, api) {
          Exercices.ordonner(zone, {
            consigne: "Touche-les dans l'ordre de traitement.",
            items: ["q", "¬q", "EX¬q", "¬EX¬q"],
            separateur: "→",
            surReussite: function () { api.valider("Chaque cas suppose que ses sous-formules sont déjà étiquetées."); }
          });
        }
      },

      /* 2 */
      {
        titre: "Cas p ∈ AP",
        texte:
          regle("Slide 21", "fᵢ ≡ p ∈ AP : on étiquette avec « p » tous les états s tels que p ∈ L(s).") + CONSIGNE,
        objectif: "Trouver S(q).",
        installer: function (zone, api) {
          MC.marquer(zone, api, { sys: S, attendu: sat("q"), nom: "S(q)", indice: "Lis les étiquettes L(s).",
            message: "On lit simplement L : c'est linéaire en le nombre d'états." });
        }
      },

      /* 3 */
      {
        titre: "Cas ¬ et ∨",
        texte:
          regle("Slide 21",
            "fᵢ ≡ ¬g : on étiquette tous les états qui ne sont pas étiquetés avec g.<br>" +
            "fᵢ ≡ g₁ ∨ g₂ : on étiquette tous les états étiquetés avec g₁ ou avec g₂.") +
          "<div class='signalement'>Slide 21 : le cas est écrit « fᵢ ≡ ¬g₁ ∨ g₂ », mais le texte parle bien de g₁ ∨ g₂ (le ¬ est une coquille).</div>" +
          "<p>En pratique : ¬ → complémentaire, ∨ → union, ∧ → intersection. Formule : <span class='mono'>¬q ∨ ¬r</span>.</p>" + CONSIGNE,
        objectif: "Trouver S(¬q ∨ ¬r).",
        installer: function (zone, api) {
          MC.marquer(zone, api, { sys: S, attendu: sat("¬q ∨ ¬r"), nom: "S(¬q ∨ ¬r)",
            indice: "S(¬q) = {s0}, S(¬r) = {s2} : fais l'union.", message: "{s0} ∪ {s2} = {s0, s2}. On le réutilisera pour EG." });
        }
      },

      /* 4 */
      {
        titre: "Remonter les flèches : R⁻¹",
        texte:
          "<p>Pour EX et EU, il faut trouver les <b>prédécesseurs</b> d'un état. Le cours construit la relation inverse : " +
          "(S, R) ⇒ (S, R⁻¹), où s′ →<sub>R⁻¹</sub> s quand s → s′ (slide 22). Avec des listes d'adjacence, on la construit en parcourant chaque liste une fois.</p>",
        objectif: "Trouver les prédécesseurs de s1.",
        installer: function (zone, api) {
          MC.figure(zone, S, {});
          Exercices.cocher(zone, {
            question: "Quels états ont une flèche vers s1 ?",
            options: ["s0", "s1", "s2"],
            bonnes: [0, 1, 2],
            explication: "s0 → s1, s1 → s1 (la boucle compte !) et s2 → s1.",
            surReussite: function () {
              var t = el("table", "tableau");
              t.innerHTML = "<tr><th>état</th><th>successeurs (R)</th><th>prédécesseurs (R⁻¹)</th></tr>" +
                S.M.etats.map(function (s) { return "<tr><td class='mono'>" + s + "</td><td class='mono'>" + S.M.succ[s].join(", ") + "</td><td class='mono'>" + S.M.pred[s].join(", ") + "</td></tr>"; }).join("");
              zone.appendChild(t);
              api.valider("Garde ce tableau en tête pour les deux étapes suivantes.");
            }
          });
        }
      },

      /* 5 */
      {
        titre: "Cas EX g",
        texte:
          regle("Slide 22", "fᵢ ≡ EX g : g est déjà étiquetée. On construit R⁻¹ ; on étiquette avec « fᵢ » tous les états s tels qu'il existe s′ →<sub>R⁻¹</sub> s avec s′ étiqueté par g.") +
          "<p>Autrement dit : S(EX g) = les prédécesseurs des états de S(g). Formule : <span class='mono'>EX¬r</span>.</p>" + CONSIGNE,
        objectif: "Trouver S(EX¬r).",
        installer: function (zone, api) {
          MC.marquer(zone, api, { sys: S, attendu: sat("EX¬r"), nom: "S(EX¬r)",
            indice: "S(¬r) = {s2}. Qui a une flèche vers s2 ?", message: "Seul s0 a s2 pour successeur." });
        }
      },

      /* 6 */
      {
        titre: "Cas E(g₁ U g₂) : propager en arrière",
        texte:
          regle("Slide 22", "On étiquette avec « E(g₁ U g₂) » tous les états étiquetés avec g₂. Si s est étiqueté avec « E(g₁ U g₂) », " +
            "s →<sub>R⁻¹</sub> s′ et s′ est étiqueté avec g₁, alors on étiquette s′ avec « E(g₁ U g₂) ».") +
          "<p>Formule : <span class='mono'>E(p U q)</span>. Les états de S(q) sont déjà remplis. Touche un à un les états à ajouter : " +
          "un état est ajouté s'il satisfait p <b>et</b> a un successeur déjà étiqueté. Arrête quand plus rien ne change.</p>",
        objectif: "Terminer l'étiquetage de E(p U q).",
        installer: function (zone, api) {
          var marque = sat("q").slice(), fini = false;
          var Sp = sat("p"), attendu = sat("E(p U q)");
          var info = el("p", "legende-figure");
          var f = MC.figure(zone, S, {
            onEtat: function (id) {
              if (fini) return;
              if (marque.indexOf(id) >= 0) { api.retour(id + " est déjà étiqueté.", null); return; }
              if (Sp.indexOf(id) < 0) { api.retour(id + " ne satisfait pas p : on ne peut pas l'ajouter.", false); return; }
              var s2 = S.M.succ[id].filter(function (t) { return marque.indexOf(t) >= 0; });
              if (!s2.length) { api.retour(id + " satisfait p mais n'a encore aucun successeur étiqueté.", false); return; }
              marque.push(id); marque = S.M.ordre(marque);
              api.retour(id + " satisfait p et va en " + s2[0] + ", déjà étiqueté : ajouté.", true);
              maj();
            }
          });
          zone.appendChild(info);
          var b = el("button", "btn btn-petit", "Plus rien à ajouter");
          b.type = "button";
          var rang = el("div", "rangee-btn"); rang.appendChild(b); zone.appendChild(rang);
          b.onclick = function () {
            if (marque.length === attendu.length) {
              fini = true;
              api.retour("S(E(p U q)) = " + MC.ens(marque) + ".", true);
              api.valider("Coût : construire R⁻¹ puis un parcours en profondeur, O(|S| + |R|).");
            } else api.retour("Il reste au moins un état qui satisfait p et a un successeur étiqueté.", false);
          };
          function maj() {
            f.maj({ plein: marque });
            info.innerHTML = "<span>S(p) = <span class='mono'>" + MC.ens(Sp) + "</span></span><span>étiquetés E(p U q) : <span class='mono'>" + MC.ens(marque) + "</span></span>";
          }
          maj();
        }
      },

      /* 7 */
      {
        titre: "Combien ça coûte ?",
        texte:
          "<p>Slide 19 : pour CTL, le model checking est <b>linéaire en le nombre d'états et d'arcs</b> du système ; pour LTL, il est PSPACE-complet. " +
          "En cours, le prof a détaillé : chaque cas coûte au plus O(|S| + |R|), et on traite une sous-formule à la fois, " +
          "soit O((|S| + |R|) · |f|) au total, |f| étant le nombre d'opérateurs de la formule.</p>",
        objectif: "Choisir la bonne complexité.",
        installer: function (zone, api) {
          Exercices.choix(zone, MC.melanger({
            question: "Le model checking de CTL (algorithme de labelling) est…",
            options: ["linéaire : O((|S| + |R|) · |f|)", "exponentiel en le nombre d'états", "PSPACE-complet"],
            bonne: 0,
            expliquer: ["Exact.", "Non : l'exponentielle, c'est le nombre d'états lui-même (explosion des états), pas l'algorithme.", "C'est LTL qui est PSPACE-complet."],
            surReussite: function () { api.valider(); }
          }));
        }
      }
    ],
    fin: {
      texte:
        "<ul><li>On étiquette des plus petites sous-formules à la formule entière : S(f) pour chacune.</li>" +
        "<li>p : lire L. ¬ : complémentaire. ∨ : union (∧ : intersection).</li>" +
        "<li>EX g : prédécesseurs de S(g), via R⁻¹.</li>" +
        "<li>E(g₁ U g₂) : partir de S(g₂), puis ajouter tant qu'il y a un état de S(g₁) avec un successeur déjà étiqueté.</li>" +
        "<li>Cas particulier : S(E(true U f)) = les états depuis lesquels on peut atteindre S(f).</li></ul>" +
        "<p>Il reste EG : leçon suivante.</p>",
      cartes: "labelling"
    }
  });
})();
