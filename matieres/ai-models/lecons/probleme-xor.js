/* Leçon : Pourquoi un neurone ne fait pas XOR (notes « Neural networks — the XOR problem »).
   Fil rouge : le réseau (N) des notes, 2 entrées x¹, x², une sortie g(x¹, x²) = HS(w¹x¹ + w²x² − θ),
   et sa droite (**) w¹x¹ + w²x² − θ = 0 dessinée dans le plan. */
(function () {
  "use strict";
  var A = AIM;
  var N2 = ["x¹", "x²"];

  Lecon.demarrer({
    matiere: "ai-models",
    id: "probleme-xor",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Apprendre, parfaitement",
        texte:
          "<p>Une boîte noire B a des entrées x₁, …, xₙ et des sorties y₁, …, yₘ. Un algorithme A prend n entrées et rend m valeurs.</p>" +
          "<div class='encadre'><span class='titre-encadre'>Définition (notes)</span>" +
          "A <b>a appris B (parfaitement)</b> ssi pour tout x₁, …, xₙ : <span class='mono'>A(x₁, …, xₙ) = B(x₁, …, xₙ)</span>.</div>",
        objectif: "Dire quand un neurone « a appris » XOR.",
        installer: function (zone, api) {
          Exercices.choix(zone, {
            question: "Le réseau (N) a appris XOR parfaitement si…",
            options: ["il donne la même sortie que XOR sur les 4 entrées", "il donne la bonne sortie sur au moins 3 entrées sur 4", "son erreur moyenne diminue pendant l'entraînement"],
            bonne: 0,
            expliquer: ["Exact : « pour tout » — aucune exception permise.", "Non : 3 sur 4 n'est pas « pour tout x ».", "Non : la définition ne parle que du résultat, pas de l'entraînement."],
            surReussite: function () { api.valider(); }
          });
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Une droite dans le plan",
        texte:
          "<p>Le réseau (N) : <span class='mono'>g(x¹, x²) = HS(w¹x¹ + w²x² − θ)</span>, qui vaut 1 si w¹x¹ + w²x² − θ ≥ 0 et 0 sinon. " +
          "Si x¹, x² ∈ ℝ, l'équation <span class='mono'>w¹x¹ + w²x² − θ = 0</span> (**) est celle d'une <b>droite</b> du plan.</p>" +
          "<p>Le plan montre la droite ; la zone grisée est le côté où g = 1 ; les points pleins sont les entrées qui donnent 1, les points en pointillés ceux qui ne donnent pas la sortie attendue.</p>",
        objectif: "Régler w¹, w², θ pour que la droite sépare les sorties de AND.",
        installer: function (zone, api) {
          new Neurone(A.cadre(zone), {
            noms: N2, nomsPoids: ["w¹", "w²"], poids: [1, 0], seuil: 0, plan: true, table: true, cible: [0, 0, 0, 1], min: -3, max: 3,
            surChange: function (e) {
              if (e.ok) { api.retour("w = (" + A.fmt(e.poids[0]) + ", " + A.fmt(e.poids[1]) + "), θ = " + A.fmt(e.seuil) + ".", true); api.valider("Seul (1, 1) est du côté grisé : la droite sépare le point 1 des trois points 0."); }
              else api.retour("Pas encore : regarde les points en pointillés.", false);
            }
          });
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Cas w² ≠ 0 : pente et ordonnée",
        texte:
          "<p>Si <b>w² ≠ 0</b>, on isole x² dans (**) :</p>" +
          "<div class='formule'>x² = − (w¹/w²) x¹ + θ/w²</div>" +
          "<p>Une droite x² = m·x¹ + q avec m = −w¹/w² et q = θ/w². Et un point (a, b) <b>sur</b> la droite donne " +
          "<span class='mono'>g(a, b) = HS(0) = 1</span>.</p>" +
          "<p>Exemple : <span class='mono'>w¹ = 1, w² = 2, θ = 2</span>.</p>",
        objectif: "Calculer m et q pour l'exemple.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "m =", attendu: -0.5, tolerance: 1e-9, placeholder: "ex. 2/3", indice: "−w¹/w².", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "q =", attendu: 1, placeholder: "ex. 2/3", indice: "θ/w².", surReussite: ok }); }
          ], "x² = −x¹/2 + 1 : la droite passe par (0, 1) et (2, 0).");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Au-dessus ou au-dessous ?",
        texte:
          "<p>Soit A⁺ la région « au-dessus » de (**), A⁻ la région « au-dessous ». Pour (a⁺, b⁺) ∈ A⁺ : " +
          "<span class='mono'>b⁺ &gt; −(w¹/w²)a⁺ + θ/w²</span>. Pour connaître g(a⁺, b⁺), il faut le signe de w² : multiplier l'inégalité par w² " +
          "garde ou retourne le sens.</p>",
        objectif: "Donner la valeur de g dans chaque situation.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["g = 1", "g = 0"],
            items: [
              { texte: "w² > 0, point au-dessus de la droite", bonne: 0 },
              { texte: "w² < 0, point au-dessus de la droite", bonne: 1 },
              { texte: "w² > 0, point au-dessous de la droite", bonne: 1 },
              { texte: "w² < 0, point au-dessous de la droite", bonne: 0 },
              { texte: "point sur la droite (n'importe quel w² ≠ 0)", bonne: 0 }
            ],
            surReussite: function () { api.valider("Dans tous les cas, la droite coupe le plan en deux : un côté donne 1, l'autre 0 (et la droite elle-même donne 1)."); }
          });
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Cas w² = 0 : une droite verticale",
        texte:
          "<p>Si <b>w² = 0</b>, <span class='mono'>g(x¹, x²) = HS(w¹x¹ − θ)</span> et la droite est <span class='mono'>x¹ = θ/w¹</span> (***), verticale. " +
          "À droite (a⁺ &gt; θ/w¹) : g = 1 ; à gauche : g = 0.</p>",
        objectif: "Avec w² = 0, faire réaliser au neurone la fonction g(x¹, x²) = x¹.",
        installer: function (zone, api) {
          new Neurone(A.cadre(zone), {
            noms: N2, nomsPoids: ["w¹", "w²"], poids: [-1, 0], seuil: 0, plan: true, cible: [0, 0, 1, 1], min: -3, max: 3,
            surChange: function (e) {
              if (e.ok && e.poids[1] === 0) { api.retour("Droite x¹ = " + A.fmt(e.seuil / e.poids[0]) + ".", true); api.valider("Une droite verticale entre x¹ = 0 et x¹ = 1 : la sortie ne dépend que de x¹."); }
              else if (e.ok) api.retour("Bonne sortie, mais garde w² = 0.", null);
              else api.retour("Pas encore.", false);
            }
          });
          A.note(zone, "Les notes concluent « à droite g = 1 » sans le dire : cela suppose w¹ &gt; 0. Avec w¹ &lt; 0 les côtés s'échangent, " +
            "et le cas w¹ = w² = 0 (sortie constante) n'est pas traité. Aucun de ces cas ne sauve XOR.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Essayer XOR",
        texte:
          "<p>XOR veut <b>1</b> en (0, 1) et (1, 0), <b>0</b> en (0, 0) et (1, 1). Essaie quelques réglages.</p>",
        objectif: "Après quelques essais, choisir la bonne explication de l'échec.",
        installer: function (zone, api) {
          var essais = 0, q = null;
          new Neurone(A.cadre(zone), {
            noms: N2, nomsPoids: ["w¹", "w²"], poids: [1, 1], seuil: 1, plan: true, cible: [0, 1, 1, 0], min: -3, max: 3,
            surChange: function (e) {
              essais++;
              if (api.estAtteint()) return;
              var faux = e.sorties.filter(function (y, i) { return y !== [0, 1, 1, 0][i]; }).length;
              api.retour(faux + " point(s) mal classé(s).", false);
              if (essais >= 4 && !q) {
                q = Site.el("div"); zone.appendChild(q);
                Exercices.choix(q, {
                  question: "Pourquoi aucun réglage ne marche ?",
                  options: [
                    "(0,1) et (1,0) doivent être d'un côté, (0,0) et (1,1) de l'autre : les deux diagonales du carré se croisent, aucune droite ne les sépare",
                    "les poids sont limités entre −3 et 3",
                    "il faudrait un seuil négatif"
                  ],
                  bonne: 0,
                  expliquer: ["Exact. « By no means the network (N) can learn the XOR-function, since any assignment to w¹, w² produces contradictory outputs. »", "Non : aucune valeur réelle ne marche, la preuve ne dépend pas d'une borne.", "Non : essaie, cela ne change rien."],
                  surReussite: function () { api.valider("Un côté de la droite donne 1, l'autre 0 : XOR n'est pas « linéairement séparable »."); }
                });
              }
            }
          });
          A.note(zone, "Les notes concluent par la figure : le carré, la droite, A⁺ et A⁻. Un argument algébrique équivalent (non présent dans les notes) : " +
            "il faudrait 0 &lt; θ (pour (0,0)), w² ≥ θ et w¹ ≥ θ (pour (0,1) et (1,0)), donc w¹ + w² ≥ 2θ &gt; θ, ce qui contredit w¹ + w² &lt; θ (pour (1,1)).");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Conclusion : il faut une couche de plus",
        texte:
          "<p>Un seul neurone ne peut pas apprendre XOR. Mais la leçon précédente l'a construit avec plusieurs neurones : " +
          "<span class='mono'>h₁ = OR(x¹, x²)</span>, <span class='mono'>h₂ = NOT(AND(x¹, x²))</span>, puis <span class='mono'>y = AND(h₁, h₂)</span>.</p>",
        objectif: "Placer h₂ dans le plan, puis conclure.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) {
              A.html(b, "<p>h₂ = NAND(x¹, x²) est elle-même réalisable par <b>un</b> neurone. Règle-le :</p>");
              new Neurone(A.cadre(b), {
                noms: N2, nomsPoids: ["w¹", "w²"], poids: [1, 1], seuil: 2, plan: true, cible: [1, 1, 1, 0], min: -3, max: 3,
                surChange: function (e) { if (e.ok) ok(); }
              });
            },
            function (b, ok) {
              Exercices.choix(b, {
                question: "Combien de couches de neurones faut-il au minimum pour XOR, avec h₁ et h₂ calculés en parallèle ?",
                options: ["2 : une couche cachée (h₁, h₂) puis le neurone de sortie", "1", "4"],
                bonne: 0,
                expliquer: ["Exact : h₁ et h₂ découpent le plan avec deux droites, la sortie combine (AND).", "Non : c'est exactement ce qu'on vient de prouver impossible.", "Non : on peut calculer h₁ et h₂ en même temps."],
                surReussite: ok
              });
            }
          ], "D'où les réseaux en couches (feed-forward) du chapitre suivant, et la question : comment apprendre leurs poids ?");
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : un neurone à 2 entrées sépare le plan par la droite <span class='mono'>w¹x¹ + w²x² − θ = 0</span> " +
        "(un côté donne 1, l'autre 0). XOR demande de séparer les deux diagonales du carré : impossible avec une droite, donc avec un neurone. " +
        "Il faut une couche cachée.</p>",
      cartes: "booleen-xor"
    }
  });
})();
