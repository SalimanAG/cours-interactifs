/* Leçon : Billet endommagé — du pseudo-code au Python.
   Prépare les questions sur le code à l'oral : chaque morceau de
   BACKTRACK_billet_endommage.py relié au pseudo-code des slides.
   Fil rouge : l'exemple 2 (4 × 2), comme dans la leçon précédente. */
(function () {
  "use strict";
  var el = Site.el;
  var B = Billet, U = BilletUI;
  var PB = B.EX2;

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Quel morceau de code pour quelle fonction ?",
      texte:
        "<p>Ton programme a quatre fonctions imbriquées dans <span class='mono'>resoudre</span> : <span class='mono'>poser</span>, <span class='mono'>defaire</span>, " +
        "<span class='mono'>propager</span> et <span class='mono'>recursive</span>, une par bloc du pseudo-code. À l'oral, on peut te montrer une ligne et te demander où elle se trouve.</p>",
      objectif: "Rattacher les 8 lignes de Python à leur fonction.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["POSER", "DÉFAIRE", "PROPAGER", "RECURSIVE"],
          items: [
            { texte: "<span class='mono'>pile.append((i, j, v))</span>", bonne: 0, explication: "Chaque case posée est empilée pour pouvoir l'annuler." },
            { texte: "<span class='mono'>i, j, v = pile.pop()</span>", bonne: 1, explication: "On dépile dans l'ordre inverse des poses." },
            { texte: "<span class='mono'>if lm[i] &lt; 0 or lm[i] &gt; lv[i]: return False</span>", bonne: 2, explication: "La règle de contradiction (ligne 5 du pseudo-code)." },
            { texte: "<span class='mono'>if nb_sol &gt;= 2: return</span>", bonne: 3, explication: "Ligne 1 de RECURSIVE : arrêt dès la 2e solution." },
            { texte: "<span class='mono'>v = 0 if lm[i] == 0 else 1</span>", bonne: 2, explication: "Lignes 6-7 : lm = 0 → 0, lm = lv → 1." },
            { texte: "<span class='mono'>grille[i][j] = VIDE</span>", bonne: 1, explication: "La case redevient « pas décidée »." },
            { texte: "<span class='mono'>for v in (0, 1):</span>", bonne: 3, explication: "Les deux essais sur la case choisie." },
            { texte: "<span class='mono'>lv[i] -= 1; cv[j] -= 1</span>", bonne: 0, explication: "Une case vide de moins sur sa ligne et sa colonne." }
          ],
          surReussite: function () {
            PC.code(zone,
              "def poser(i, j, v, pile):\n" +
              "    grille[i][j] = v\n" +
              "    lv[i] -= 1\n" +
              "    cv[j] -= 1\n" +
              "    if v == 1:\n" +
              "        lm[i] -= 1\n" +
              "        cm[j] -= 1\n" +
              "    pile.append((i, j, v))   # pour pouvoir défaire ce choix", "Ton code : poser()");
            api.valider("poser et defaire sont exactement symétriques : c'est ce qui garantit que la grille et les compteurs reviennent à l'identique.");
          }
        });
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "VIDE = None et « is VIDE »",
      texte:
        "<p>Une case vaut 1, 0 ou <span class='mono'>VIDE = None</span>. Le code teste <span class='mono'>grille[i][j] is VIDE</span> et <span class='mono'>is not VIDE</span>.</p>",
      objectif: "Juger les 4 affirmations sur VIDE.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Avec VIDE = 0, on ne distinguerait plus une case blanche d'une case non décidée.", vrai: true,
              explication: "0 est une valeur de la solution : il faut une troisième valeur." },
            { texte: "<span class='mono'>if not grille[i][j]:</span> est un bon test de « case vide ».", vrai: false,
              explication: "<span class='mono'>not 0</span> vaut aussi True : une case blanche serait prise pour vide." },
            { texte: "<span class='mono'>x is None</span> est la façon idiomatique de tester None en Python.", vrai: true,
              explication: "None est un objet unique : on compare l'identité avec <span class='mono'>is</span>." },
            { texte: "<span class='mono'>grille[i][j] == 1</span> reconnaît bien un trait, même si la case peut valoir None.", vrai: true,
              explication: "<span class='mono'>None == 1</span> vaut False : pas d'erreur, pas de confusion." }
          ],
          surReussite: function () {
            api.valider("Trois états, trois valeurs distinctes : 1, 0, None.");
          }
        });
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "nonlocal nb_sol, solution",
      texte:
        "<p><span class='mono'>recursive</span> est définie <b>dans</b> <span class='mono'>resoudre</span>, qui contient <span class='mono'>nb_sol = 0</span> et <span class='mono'>solution = None</span>. " +
        "Sa première ligne est <span class='mono'>nonlocal nb_sol, solution</span>.</p>",
      objectif: "Dire ce qui se passe sans nonlocal, puis quelles variables en ont besoin.",
      installer: function (zone, api) {
        var suite = el("div");
        Exercices.choix(zone, {
          question: "Sans la ligne nonlocal, que fait nb_sol += 1 dans recursive ?",
          options: [
            "Il augmente le nb_sol de resoudre, comme prévu",
            "Erreur UnboundLocalError à l'exécution",
            "Il crée une variable globale nb_sol"
          ],
          bonne: 1,
          expliquer: [
            "Non : une affectation dans une fonction rend la variable locale à cette fonction.",
            "Exact : nb_sol += 1 est une affectation, donc Python considère nb_sol comme locale à recursive… et la lit avant de lui avoir donné une valeur.",
            "Non : il faudrait « global », et ce ne serait pas la variable de resoudre."
          ],
          surReussite: function () {
            zone.appendChild(suite);
            Exercices.cocher(suite, {
              question: "Lesquelles ont besoin d'être déclarées nonlocal dans recursive ?",
              options: ["nb_sol", "solution", "grille", "lm", "pile"],
              bonnes: [0, 1],
              explication: "Seules les variables <b>réaffectées</b> (nb_sol += 1, solution = …) en ont besoin. grille et lm sont seulement <b>modifiées</b> (grille[i][j] = v, lm[i] -= 1) : la variable désigne toujours la même liste. pile est locale à chaque appel.",
              surReussite: function () {
                api.valider("Règle à citer : nonlocal pour réaffecter une variable de la fonction englobante ; pas besoin pour modifier le contenu d'une liste.");
              }
            });
          }
        });
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "k // C et k % C",
      texte:
        "<p>Dans <span class='mono'>i, j = k // C, k % C</span>, <span class='mono'>//</span> est la division entière et <span class='mono'>%</span> le reste. " +
        "Prends l'exemple 1 (L = 4, C = 5) et k = 13, en numérotation du code (à partir de 0).</p>",
      objectif: "Calculer i et j pour k = 13.",
      installer: function (zone, api) {
        var suite = el("div");
        Exercices.nombre(zone, {
          label: "i = 13 // 5 =", attendu: 2, tolerance: 0, indice: "Combien de fois 5 tient dans 13 ?",
          surReussite: function () {
            zone.appendChild(suite);
            Exercices.nombre(suite, {
              label: "j = 13 % 5 =", attendu: 3, tolerance: 0, indice: "Le reste de la division de 13 par 5.",
              surReussite: function () {
                suite.appendChild(el("p", null, "Donc k = 13 est la case (i, j) = (2, 3) du code, soit la ligne 3, colonne 4 en comptant à partir de 1. Vérification : 2 × 5 + 3 = 13."));
                api.valider("Un seul entier k suffit : RECURSIVE(k + 1) passe à la case suivante, et k = L·C signale la fin de la grille.");
              }
            });
          }
        });
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Copier la solution : ligne[:]",
      texte:
        "<p>À la première solution, le code fait <span class='mono'>solution = [ligne[:] for ligne in grille]</span>. Ensuite, les DÉFAIRE remettent les cases de <span class='mono'>grille</span> à VIDE.</p>",
      objectif: "Dire ce qui se passe avec une copie trop légère, puis cocher les copies sûres.",
      installer: function (zone, api) {
        var suite = el("div");
        Exercices.choix(zone, {
          question: "Avec solution = grille, sur une grille dont l'unique solution est trouvée après un choix, qu'affiche le programme ?",
          options: ["La bonne grille", "Des * à la place de toutes les cases posées depuis le premier choix", "NON"],
          bonne: 1,
          expliquer: [
            "Non : solution et grille désignent la même liste ; en remontant, les DÉFAIRE remettent des cases à VIDE.",
            "Exact : à l'affichage, les cases défaites valent None, et « '-' if x == 1 else '*' » écrit * pour elles. (Sur l'exemple 1, aucun choix, rien n'est défait : le bug passerait inaperçu. D'où l'intérêt de tests avec branchement.)",
            "Non : nb_sol vaut bien 1, c'est le contenu affiché qui est faux."
          ],
          surReussite: function () {
            zone.appendChild(suite);
            Exercices.cocher(suite, {
              question: "Quelles instructions gardent une copie indépendante de la grille ?",
              options: [
                "<span class='mono'>[ligne[:] for ligne in grille]</span>",
                "<span class='mono'>copy.deepcopy(grille)</span>",
                "<span class='mono'>grille[:]</span>",
                "<span class='mono'>[list(l) for l in grille]</span>",
                "<span class='mono'>grille</span>"
              ],
              bonnes: [0, 1, 3],
              explication: "<span class='mono'>grille[:]</span> copie seulement la liste extérieure : les lignes sont partagées, donc modifiées par DÉFAIRE. Il faut copier chaque ligne.",
              surReussite: function () {
                api.valider("La grille est une liste de listes : il faut copier les deux niveaux.");
              }
            });
          }
        });
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le bug de l'algorithme 2 des indications",
      texte:
        "<p>Dans l'algorithme 2 du document d'indications, le retour arrière ne restaure pas lm et cm. Que donnerait cette version sur l'exemple 2 ? " +
        "Après la solution 1, DÉFAIRE vide les cases mais laisse lm[1] = 0 (ligne 1).</p>",
      objectif: "Prédire la sortie de la version des indications, puis vérifier avec la trace.",
      installer: function (zone, api) {
        U.entree(zone, PB);
        var suite = el("div");
        var juste = B.sortie(PB, { sansM: true });
        Exercices.choix(zone, {
          question: "Que répond la version sans restauration de lm et cm ?",
          options: ["NON, comme ta version", "La grille *- / ** / ** / -* (la solution 1)", "La grille -* / ** / ** / *- (la solution 2)"],
          bonne: juste === "NON" ? 0 : 1,
          expliquer: [
            "Non : regarde la branche (1,1) ← 1 avec lm[1] resté à 0.",
            "Exact : dans la branche (1,1) ← 1, lm de la ligne 1 passe à −1 → contradiction. La solution 2 n'est jamais trouvée, nb_sol = 1 : la grille est affichée à tort.",
            "Non : la solution 2 n'est jamais atteinte."
          ],
          surReussite: function () {
            zone.appendChild(suite);
            suite.appendChild(el("h3", null, "La trace de la version des indications"));
            var p = U.panneau(suite, { delai: 650 });
            p.charger(PB, { sansM: true });
            api.valider("Une seule ligne oubliée (lm[i] += 1, cm[j] += 1) et la réponse change. À dire à l'oral : c'est pour ça que ton DÉFAIRE est le symétrique exact de POSER.");
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "billet-python",
    etapes: etapes,
    fin: {
      cartes: "oral-billet",
      texte:
        "<div class='encadre'><span class='titre-encadre'>À retenir pour l'oral</span><ul>" +
        "<li>poser / defaire / propager / recursive : un bloc du pseudo-code chacun ; poser et defaire sont symétriques.</li>" +
        "<li>VIDE = None, testé avec <span class='mono'>is</span> : 0 est une vraie valeur.</li>" +
        "<li>nonlocal pour nb_sol et solution (réaffectées), pas pour grille ni les compteurs (modifiés sur place).</li>" +
        "<li>k → (k // C, k % C) ; k = L·C : plus de case vide.</li>" +
        "<li>Copie de la solution sur deux niveaux : <span class='mono'>[ligne[:] for ligne in grille]</span>.</li>" +
        "<li>Sans restaurer lm et cm (indications), l'exemple 2 affiche une grille au lieu de NON.</li></ul></div>" +
        "<p>Pour t'entraîner sur des grilles nouvelles : l'atelier « Trace pas à pas ».</p>"
    }
  });
})();
