/* Leçon : Une structure de Kripke et ses chemins (slides 3 à 9).
   Fil rouge : le système s0, s1, s2 des exercices faits en cours le 13 octobre. */
(function () {
  "use strict";
  var el = Site.el;
  var S = MC.SYS;
  var PI = { etats: ["s0", "s2", "s0", "s1"], boucle: 3 };

  Lecon.demarrer({
    matiere: "model-checking",
    id: "kripke-chemins",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Vérifier un système, automatiquement",
        texte:
          "<p>Le model checking a été introduit au début des années 80 par Clarke, Emerson, Queille et Sifakis, " +
          "pour vérifier des systèmes matériels et logiciels où <b>une panne est inacceptable</b> " +
          "(exemples du cours : la fusée Ariane V en 1996, le Boeing 737 max en 2018 et 2019). " +
          "Les autres techniques de validation : la simulation et le test, la vérification déductive.</p>" +
          "<div class='encadre'><span class='titre-encadre'>Ce qu'il faut (slide 6)</span>" +
          "1. un système S : une <b>structure de Kripke</b> M ;<br>2. une spécification : une <b>formule de logique temporelle</b> φ ;<br>" +
          "3. un <b>algorithme de model checking</b> : M, φ ⇒ M ⊨ φ ?</div>" +
          "<p>Le model checking est <b>décidable</b> : Clarke, Emerson, Queille et Sifakis ont défini une classe de systèmes et une logique " +
          "temporelle telles que vérifier si un système de la classe satisfait une formule de la logique est décidable.</p>",
        objectif: "Classer les quatre affirmations en vrai / faux.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "Si le système ne satisfait pas la formule, on obtient un contre-exemple.", vrai: true, explication: "C'est l'un des deux avantages cités." },
              { texte: "Il faut guider l'outil à la main, comme une preuve.", vrai: false, explication: "Non : c'est une technique complètement automatique (l'autre avantage)." },
              { texte: "Le principal inconvénient est l'explosion du nombre d'états.", vrai: true, explication: "Réponses citées : model checking symbolique et à la volée (on-the-fly)." },
              { texte: "Le model checking peut ne jamais répondre, car il est indécidable.", vrai: false, explication: "Non : pour la classe de systèmes et la logique définies, il est décidable." }
            ],
            surReussite: function () { api.valider("Retiens le trio : M (Kripke), φ (logique temporelle), un algorithme qui répond M ⊨ φ, ou donne un contre-exemple."); }
          });
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "M = (S, S₀, R, L)",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Définition : structure de Kripke (slide 7)</span>" +
          "Soit AP un ensemble de propositions atomiques. Une structure de Kripke sur AP est un 4-uplet M = (S, S₀, R, L) où" +
          "<ul><li>S est un ensemble fini d'états ;</li><li>S₀ ⊆ S est l'ensemble des états initiaux ;</li>" +
          "<li>R ⊆ S × S est une relation de transition qui doit être <b>totale</b> ;</li>" +
          "<li>L : S → 2<sup>AP</sup> étiquette chaque état avec l'ensemble des propositions atomiques vraies dans cet état.</li></ul></div>" +
          "<p>Voici le système des exercices faits en cours le 13 octobre (AP = {p, q, r}). " +
          "Sous chaque état, son étiquette L(s). La petite flèche entrante marque l'état initial : S₀ = {s0}.</p>",
        objectif: "Toucher l'état s tel que L(s) = {p, q}, puis vérifier.",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: S, attendu: ["s2"], nom: "état choisi",
            indice: "Lis l'étiquette écrite à côté de chaque état.",
            message: "Dans s2, p et q sont vraies, r est fausse (r ∉ L(s2))."
          });
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Une relation totale",
        texte:
          "<p>R doit être <b>totale</b> : pour chaque état s ∈ S, il existe un état s′ ∈ S tel que R(s, s′). " +
          "Autrement dit, chaque état a au moins un successeur.</p>" +
          "<p>Voici une variante du système à laquelle on a retiré une flèche.</p>",
        objectif: "Toucher l'état qui empêche R d'être totale.",
        installer: function (zone, api) {
          var V = {
            M: LT.modele({ etats: ["s0", "s1", "s2"], init: ["s0"], R: [["s0", "s1"], ["s0", "s2"], ["s2", "s0"], ["s2", "s1"]], L: S.M.L }),
            pos: S.pos, largeur: S.largeur, hauteur: S.hauteur, nom: "variante sans la boucle sur s1", sous: S.sous
          };
          MC.marquer(zone, api, {
            sys: V, attendu: ["s1"], nom: "état choisi",
            indice: "Cherche un état d'où ne part aucune flèche.",
            message: "s1 n'a aucun successeur. Dans le vrai système, la boucle s1 → s1 rend R totale : depuis chaque état on peut toujours avancer."
          });
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Un chemin est infini",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Chemin (slide 7)</span>" +
          "Un chemin de M partant d'un état s est une suite <b>infinie</b> d'états π = s₀ s₁ s₂ … telle que s₀ = s et R(sᵢ, sᵢ₊₁) pour chaque i ≥ 0.</div>" +
          "<p>Construis un chemin depuis s0 : touche un successeur de l'état en couleur pour avancer. " +
          "Le graphe est fini, donc un chemin infini finit par repasser par un état déjà vu : " +
          "touche un état déjà dans le chemin pour fermer la boucle.</p>",
        objectif: "Construire un chemin depuis s0 qui passe par s2 puis reste pour toujours en s1.",
        installer: function (zone, api) {
          MC.constructeurChemin(zone, {
            sys: S, depart: "s0",
            surRefus: function (m) { api.retour(m, false); },
            surChange: function () { api.retour("", null); },
            surFerme: function (ch) {
              var ok = ch.etats.indexOf("s2") >= 0 && ch.etats[ch.boucle] === "s1" && ch.boucle === ch.etats.length - 1;
              if (ok) {
                api.retour("π = " + ch.etats.join(" ") + " s1 s1 … : un chemin infini.", true);
                api.valider("Grâce à la totalité de R, on peut toujours prolonger un chemin : ici par la boucle s1 → s1.");
              } else {
                api.retour("C'est bien un chemin infini, mais pas celui demandé (passer par s2, puis rester en s1). « Recommencer ».", false);
              }
            }
          });
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Les suffixes πⁱ",
        texte:
          "<p>Pour parler du futur le long d'un chemin, le cours note <b>πⁱ</b> le suffixe de π qui commence à sᵢ (slide 12) : " +
          "π⁰ = π, π¹ = s₁ s₂ …, et ainsi de suite.</p>" +
          "<p>On garde ce chemin pour la suite : π = s0 s2 s0 s1 s1 s1 … " +
          "(après la position 3, on reste en s1).</p>",
        objectif: "Toucher la case où commence π².",
        installer: function (zone, api) {
          var sous = {};
          S.M.etats.forEach(function (s) { sous[s] = S.sous(s, S.M); });
          var choix = null;
          var vue = new VueChemin(zone, {
            onPosition: function (i) {
              choix = i;
              var cl = {}; cl[i] = i === 2 ? "plein" : "courant";
              vue.dessiner({ etats: PI.etats, boucle: PI.boucle, sous: sous, classes: cl });
              if (i === 2) {
                api.retour("π² = s0 s1 s1 s1 … (on compte les positions à partir de 0).", true);
                api.valider("Attention : π² commence à la position 2, c'est-à-dire au 3ᵉ état du chemin.");
              } else api.retour("π" + "⁰¹²³"[i] + " commence ici. Les positions sont numérotées à partir de 0.", false);
            }
          });
          vue.dessiner({ etats: PI.etats, boucle: PI.boucle, sous: sous });
          void choix;
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "L'explosion des états",
        texte:
          "<p>Pour un modèle Biocham booléen, le cours associe une structure de Kripke dont les états sont <b>tous les tuples de " +
          "valeurs booléennes</b> indiquant la présence ou l'absence de chaque objet du modèle (slide 9).</p>",
        objectif: "Calculer le nombre de tels tuples pour 10 objets.",
        installer: function (zone, api) {
          Exercices.nombre(zone, {
            label: "Nombre d'états pour 10 objets :", attendu: 1024, tolerance: 0,
            indice: "Chaque objet est présent ou absent : 2 choix par objet.",
            surReussite: function () {
              api.retour("2¹⁰ = 1024. Avec 30 objets, plus d'un milliard.", true);
              api.valider("C'est le problème d'explosion des états. Les slides citent deux réponses : le model checking symbolique et le model checking à la volée (on-the-fly).");
            }
          });
          var n = el("div", "signalement");
          n.innerHTML = "Les slides ne font que nommer le model checking symbolique et à la volée, sans les détailler : ils ne sont pas développés ici.";
          zone.appendChild(n);
        }
      }
    ],
    fin: {
      texte:
        "<ul><li>M = (S, S₀, R, L) : S fini, S₀ ⊆ S, R ⊆ S × S <b>totale</b>, L : S → 2<sup>AP</sup>.</li>" +
        "<li>Un chemin est une suite <b>infinie</b> d'états reliés par R ; πⁱ est son suffixe à partir de sᵢ.</li>" +
        "<li>Model checking : automatique, contre-exemple si c'est faux ; inconvénient : l'explosion des états.</li></ul>",
      cartes: "kripke"
    }
  });
})();
