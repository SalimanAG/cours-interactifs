/* Leçon : CTL, LTL ou CTL* ? (slide 14 ; preuve et exemples vus en cours le 29 septembre).
   Fil rouge : la formule AGEF p, et le système s0, s1, s2 pour les chemins. */
(function () {
  "use strict";
  var el = Site.el;
  var S = MC.SYS;
  function petit(R, nom) {
    return {
      M: LT.modele({ etats: R.etats, init: ["s"], R: R.R, L: { s: [], t: ["p"] } }),
      pos: { s: { x: 90, y: 50, boucle: 180 }, t: { x: 230, y: 50 } },
      largeur: 320, hauteur: 100, nom: nom,
      sous: function (s, M) { return M.L[s].length ? "{p}" : "{} (¬p)"; }
    };
  }
  var M1 = petit({ etats: ["s", "t"], R: [["s", "s"], ["s", "t"], ["t", "s"]] }, "M");

  Lecon.demarrer({
    matiere: "model-checking",
    id: "ctl-ltl",
    etapes: [

      /* 1 */
      {
        titre: "Deux sous-logiques de CTL*",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Slide 14</span>" +
          "<b>LTL</b> décrit ce qui se passe le long d'un seul chemin : formules de la forme A f, où f ne contient aucun quantificateur de chemin.<br>" +
          "<b>CTL</b> : chaque opérateur temporel (X, F, G, U) est immédiatement précédé d'un quantificateur de chemin (A, E).</div>" +
          "<p>Les deux logiques ont une partie commune, et chacune exprime des choses que l'autre ne peut pas exprimer (dit en cours).</p>",
        objectif: "Classer chaque formule.",
        installer: function (zone, api) {
          var cats = ["CTL seulement", "LTL seulement", "CTL et LTL", "ni l'un ni l'autre"];
          var EX = {
            "AGEF p": "Chaque opérateur temporel a son quantificateur juste devant ; mais il y a un E à l'intérieur, interdit en LTL.",
            "AFG p": "Un seul A, rien à l'intérieur : LTL. Mais G suit F sans quantificateur : pas CTL.",
            "AG p": "Un seul A, et G juste après : les deux à la fois.",
            "AXEF p": "Exemple CTL du cours : chaque opérateur a son A ou E ; le E interdit LTL.",
            "A(F p ∨ G q)": "Un seul A devant une formule sans quantificateur : LTL. Mais F et G n'ont pas chacun leur A ou E : pas CTL.",
            "EGF p": "Commence par E : pas LTL ; F sans quantificateur : pas CTL.",
            "AGEF p ∧ AFG p": "Une conjonction d'une formule CTL et d'une formule LTL : ni l'un ni l'autre."
          };
          var items = Object.keys(EX).map(function (f) {
            var g = LT.lire(f), c = LT.estCTL(g), l = LT.estLTL(g);
            return { texte: f, bonne: c && l ? 2 : c ? 0 : l ? 1 : 3, explication: EX[f] };
          });
          Exercices.associer(zone, { categories: cats, items: items, surReussite: function () {
            api.valider("AGEF p ∧ AFG p (exemple donné en cours) est dans CTL*, mais ni dans CTL ni dans LTL.");
          } });
        }
      },

      /* 2 */
      {
        titre: "LTL raisonne chemin par chemin",
        texte:
          "<p>M, s ⊨ A f en LTL : <b>chaque</b> chemin depuis s satisfait f. Pour montrer que c'est faux, il suffit d'un chemin. " +
          "Formule : <span class='mono'>A F G q</span> sur le système s0, s1, s2, depuis s0.</p>",
        objectif: "Construire un chemin depuis s0 qui ne satisfait pas F G q.",
        installer: function (zone, api) {
          var f = LT.lire("F G q");
          MC.constructeurChemin(zone, {
            sys: S, depart: "s0",
            surRefus: function (m) { api.retour(m, false); },
            surChange: function () { api.retour("", null); },
            surFerme: function (ch) {
              if (!LT.surChemin(S.M, ch, f)[0]) {
                api.retour("Sur ce chemin, ¬q revient sans cesse : F G q est fausse.", true);
                api.valider("Donc M, s0 ⊭ A F G q, même si le chemin s0 s1 s1 … satisfait F G q.");
              } else api.retour("Ce chemin satisfait F G q (à partir d'un moment, q reste vraie). Cherche un chemin qui repasse sans fin par s0.", false);
            }
          });
        }
      },

      /* 3 */
      {
        titre: "AGEF p : vrai dans M",
        texte:
          "<p>Preuve vue en cours : AGEF p n'est pas exprimable en LTL. On utilise deux petits modèles. " +
          "D'abord M : s (où p est fausse) a une boucle et une flèche vers t (où p est vraie), et t revient en s.</p>",
        objectif: "Trouver S(AGEF p) dans M.",
        installer: function (zone, api) {
          MC.marquer(zone, api, {
            sys: M1, attendu: LT.satisfait(M1.M, LT.lire("AGEF p")), nom: "S(AGEF p)",
            indice: "Depuis chaque état, peut-on encore atteindre t ?",
            message: "Depuis tout état on peut toujours atteindre t : M, s ⊨ AGEF p."
          });
        }
      },

      /* 4 */
      {
        titre: "La preuve par l'absurde",
        texte:
          "<p>Supposons que AGEF p soit exprimable en LTL : il existe φ sans quantificateur telle que A φ ≡ AGEF p. " +
          "Soit M′ le modèle qui ne garde que la boucle sur s.</p>",
        objectif: "Remettre les étapes de la preuve dans l'ordre.",
        installer: function (zone, api) {
          var M2 = petit({ etats: ["s"], R: [["s", "s"]] }, "M′");
          M2.pos = { s: { x: 160, y: 50, boucle: 0 } };
          MC.figure(zone, M2, {});
          zone.appendChild(el("p", "legende-figure", "M′ : seulement s et sa boucle."));
          Exercices.ordonner(zone, {
            consigne: "Touche les phrases dans l'ordre de la preuve.",
            items: [
              "M, s ⊨ AGEF p, donc M, s ⊨ A φ : tous les chemins de M depuis s satisfont φ.",
              "L'unique chemin de M′, s s s …, est aussi un chemin de M : il satisfait φ, donc M′, s ⊨ A φ.",
              "Mais dans M′ on ne peut jamais atteindre p : M′, s ⊭ AGEF p.",
              "Contradiction : AGEF p n'est pas exprimable en LTL."
            ],
            separateur: "⇒",
            surReussite: function () {
              api.valider("Idée à retenir : une formule LTL regarde les chemins un par un ; elle ne peut pas dire « il existe toujours une possibilité », qui dépend des branches.");
            }
          });
        }
      },

      /* 5 */
      {
        titre: "Récapituler",
        texte: "<p>Dernière vérification.</p>",
        objectif: "Dire si chaque affirmation est vraie.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "EG A (« il y a un chemin où A est toujours présent ») est une formule LTL.", vrai: false, explication: "LTL n'autorise pas E : c'est une formule CTL." },
              { texte: "AG B est à la fois une formule CTL et une formule LTL.", vrai: true, explication: "Un seul A, et G juste après." },
              { texte: "AFG p est une formule CTL.", vrai: false, explication: "F et G se suivent sans quantificateur entre eux." },
              { texte: "Le model checking de LTL est plus coûteux que celui de CTL.", vrai: true, explication: "LTL : PSPACE-complet ; CTL : linéaire (slide 19)." }
            ],
            surReussite: function () { api.valider(); }
          });
        }
      }
    ],
    fin: {
      texte:
        "<ul><li>LTL : A f, sans autre quantificateur dans f. CTL : chaque X, F, G, U immédiatement précédé de A ou E.</li>" +
        "<li>AGEF p : CTL, pas LTL (preuve par M et M′). AFG p : LTL, pas CTL (énoncé en cours, sans preuve).</li>" +
        "<li>AGEF p ∧ AFG p : CTL*, ni CTL ni LTL.</li></ul>",
      cartes: "logiques"
    }
  });
})();
