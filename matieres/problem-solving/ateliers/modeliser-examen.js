/* Atelier : Modéliser comme à l'examen.
   Quatre grilles INVENTÉES (aucun sujet recopié), de la même famille que les
   exercices des annales 2018–2019 : carré latin, grille à inégalités, recette
   à étapes, surveillants aux portes. Pour chacune : résoudre, modéliser,
   donner l'espace de recherche. Les corrigés sont proposés par moi. */
(function () {
  "use strict";
  var el = Site.el;

  function html(zone, contenu, classe) { var d = el("div", classe || ""); d.innerHTML = contenu; zone.appendChild(d); return d; }
  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  /* Enchaîne des exercices : chacun reçoit (zone, suivant) et appelle suivant() quand il est réussi. */
  function enchainer(zone, liste, fin) {
    var i = 0;
    function suivant() {
      if (i >= liste.length) { fin(); return; }
      var bloc = el("div");
      bloc.style.marginTop = "1.2rem";
      zone.appendChild(bloc);
      liste[i++](bloc, suivant);
    }
    suivant();
  }
  /* Exercices.choix affiche du texte brut : on convertit x<sub>1,2</sub> en x₁,₂ et les entités. */
  var IND = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", i: "ᵢ", j: "ⱼ", k: "ₖ", p: "ₚ", s: "ₛ", x: "ₓ" };
  function brut(t) {
    return t.replace(/<sub>(.*?)<\/sub>/g, function (m, x) { return x.split("").map(function (c) { return IND[c] || c; }).join(""); })
      .replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/<[^>]+>/g, "");
  }
  function choix(z, o) {
    if (o.question) o.question = brut(o.question);
    o.options = o.options.map(brut);
    if (o.expliquer) o.expliquer = o.expliquer.map(brut);
    return Exercices.choix(z, o);
  }
  var NOTE_CORRIGE = "<div class='signalement'>Grille inventée pour l'atelier, dans le style des annales. Le cours ne corrige pas ces exercices : le modèle et les réponses ci-dessus sont un corrigé proposé.</div>";

  var etapes = [

    /* 1 ─────────────────────────────── Carré latin ─────────────── */
    {
      titre: "Carré latin d'ordre 3",
      texte:
        "<p>Rappel du cours : avec n couleurs (ici les chiffres 1, 2, 3), chaque couleur apparaît <b>exactement une fois</b> sur chaque ligne et sur chaque colonne.</p>" +
        "<p>Touche une case pour faire défiler 1 → 2 → 3 → vide. Les cases grisées sont données. Les doublons s'entourent de tirets.</p>",
      objectif: "Compléter la grille, choisir le modèle, puis donner l'espace de recherche.",
      installer: function (zone, api) {
        enchainer(zone, [
          function (z, ok) {
            var g = new Grille(z, {
              lignes: 3, colonnes: 3, cycle: [1, 2, 3], fixes: { "0,0": 1, "2,1": 3 },
              onChange: maj
            });
            var r = el("div", "retour"); z.appendChild(r);
            function maj(v) {
              var d = Grille.doublons(v), cl = {};
              d.forEach(function (x) { cl[x] = "conflit"; });
              g.dessiner({ classes: cl });
              if (Grille.complete(v) && !d.length) {
                g.verrouiller(true);
                r.className = "retour ok"; r.textContent = "Carré latin complet (c'est la seule solution avec ces deux cases données).";
                ok();
              } else { r.className = "retour"; r.textContent = d.length ? "Un chiffre apparaît deux fois sur une ligne ou une colonne." : ""; }
            }
          },
          function (z, ok) {
            choix(z, {
              question: "Quel modèle ? (x<sub>i,j</sub> = chiffre de la case ligne i, colonne j)",
              options: [
                "x<sub>i,j</sub> ∈ {1, 2, 3} ; x<sub>i,j</sub> ≠ x<sub>i,k</sub> (j ≠ k) ; x<sub>i,j</sub> ≠ x<sub>k,j</sub> (i ≠ k) ; x<sub>1,1</sub> = 1, x<sub>3,2</sub> = 3",
                "x<sub>i,j</sub> ∈ {1, 2, 3} ; toutes les cases différentes deux à deux",
                "une variable par chiffre, de domaine les 9 cases",
                "x<sub>i,j</sub> ∈ {1, 2, 3} ; la somme de chaque ligne vaut 6"
              ],
              bonne: 0,
              expliquer: [
                "Exact. Avec les contraintes globales du cours, on peut aussi écrire alldifferent(ligne i) et alldifferent(colonne j) pour chaque i, j.",
                "Trop fort : 9 cases ne peuvent pas être toutes différentes avec 3 valeurs. Seules les cases d'une même ligne ou colonne doivent différer.",
                "Un chiffre occupe 3 cases, pas une : la variable devrait être un ensemble. Le modèle « une variable par case » est plus simple.",
                "Insuffisant : 1 + 1 + 4 n'existe pas, mais 2 + 2 + 2 = 6 passerait alors qu'il y a des doublons."
              ],
              surReussite: ok
            });
          },
          function (z, ok) {
            Exercices.nombre(z, {
              label: "Espace de recherche (une variable par case, cases données comprises) =",
              attendu: 19683, placeholder: "un entier",
              indice: "9 variables, domaine de taille 3 chacune.",
              bravo: "3⁹ = 19 683. Si l'on remplace les 2 cases données par des constantes, il reste 7 variables : 3⁷ = 2 187. Dis lequel tu comptes.",
              surReussite: ok
            });
          }
        ], function () {
          html(zone, NOTE_CORRIGE);
          api.valider("Pour un carré latin d'ordre n : n² variables, domaine {1, …, n}, espace n^(n²).");
        });
      }
    },

    /* 2 ─────────────────────────────── Grille à inégalités ────── */
    {
      titre: "Grille à inégalités (style Futoshiki)",
      texte:
        "<p>Grille 4 × 4 : chaque chiffre de 1 à 4 une fois par ligne et par colonne, et les signes entre deux cases doivent être respectés " +
        "(<span class='mono'>&gt;</span> : la case de gauche est plus grande ; <span class='mono'>∨</span> : la case du haut est plus grande).</p>" +
        "<p>Un signe non respecté est souligné.</p>",
      objectif: "Résoudre la grille, puis la modéliser.",
      installer: function (zone, api) {
        var SIGNES = [
          { a: [0, 0], b: [0, 1], s: ">" }, { a: [1, 2], b: [1, 1], s: ">" },
          { a: [2, 0], b: [3, 0], s: ">" }, { a: [3, 3], b: [3, 2], s: ">" },
          { a: [1, 3], b: [2, 3], s: ">" }
        ];
        enchainer(zone, [
          function (z, ok) {
            var g = new Grille(z, { lignes: 4, colonnes: 4, cycle: [1, 2, 3, 4], fixes: { "0,2": 2, "2,2": 4 }, signes: SIGNES, onChange: maj });
            var r = el("div", "retour"); z.appendChild(r);
            html(z, "<p class='discret petit'>Piste : la ligne 1 contient 2 en colonne 3, et x<sub>1,1</sub> &gt; x<sub>1,2</sub>…</p>");
            function maj(v) {
              var d = Grille.doublons(v), cl = {};
              d.forEach(function (x) { cl[x] = "conflit"; });
              g.dessiner({ classes: cl });
              var sf = Grille.signesFaux(v, SIGNES);
              if (Grille.complete(v) && !d.length && !sf.length) {
                g.verrouiller(true);
                r.className = "retour ok"; r.textContent = "Grille résolue (solution unique).";
                ok();
              } else { r.className = "retour"; r.textContent = d.length ? "Doublon sur une ligne ou une colonne." : (sf.length ? "Un signe n'est pas respecté." : ""); }
            }
          },
          function (z, ok) {
            choix(z, {
              question: "Le signe entre la case (1, 1) et la case (1, 2) devient la contrainte :",
              options: ["x<sub>1,1</sub> ≠ x<sub>1,2</sub>", "x<sub>1,1</sub> &gt; x<sub>1,2</sub>", "x<sub>1,1</sub> = x<sub>1,2</sub> + 1", "x<sub>1,1</sub> ≥ x<sub>1,2</sub>"],
              bonne: 1,
              expliquer: [
                "Trop faible : la contrainte de ligne l'impose déjà, mais le signe dit plus.",
                "Exact. (La différence est d'ailleurs impliquée : x &gt; y entraîne x ≠ y.)",
                "Trop fort : 4 &gt; 2 est permis par le signe.",
                "≥ autoriserait l'égalité, que la ligne interdit de toute façon ; le signe du jeu est strict."
              ],
              surReussite: ok
            });
          },
          function (z, ok) {
            Exercices.cocher(z, {
              question: "Quelles contraintes forment le modèle complet ?",
              options: [
                "x<sub>i,j</sub> ≠ x<sub>i,k</sub> pour j ≠ k (lignes)",
                "x<sub>i,j</sub> ≠ x<sub>k,j</sub> pour i ≠ k (colonnes)",
                "x<sub>1,3</sub> = 2 et x<sub>3,3</sub> = 4 (cases données)",
                "les 5 inégalités des signes",
                "toutes les cases de la grille différentes deux à deux"
              ],
              bonnes: [0, 1, 2, 3],
              explication: "V = {x<sub>i,j</sub>}, 16 variables ; D = {1, 2, 3, 4} ; C = lignes + colonnes (ou alldifferent par ligne et par colonne) + cases données + signes. Toutes les cases différentes est impossible avec 4 valeurs pour 16 cases.",
              surReussite: ok
            });
          },
          function (z, ok) {
            Exercices.nombre(z, {
              label: "Espace de recherche (16 variables, domaine {1, 2, 3, 4}) =",
              attendu: Math.pow(4, 16), placeholder: "un entier",
              indice: "4 × 4 × … × 4, seize fois.",
              bravo: "4¹⁶ = 4 294 967 296 (environ 4,3 milliards).",
              surReussite: ok
            });
          }
        ], function () {
          html(zone, NOTE_CORRIGE);
          api.valider("Chaque règle du jeu devient une famille de contraintes : lignes, colonnes, données, signes.");
        });
      }
    },

    /* 3 ─────────────────────────────── Recette ─────────────────── */
    {
      titre: "Recette à étapes : peut-on servir à temps ?",
      texte:
        "<p>Des crêpes, en 7 étapes (durées en secondes) :</p>" +
        "<table class='tableau'><tr><th>Étape</th><th class='num'>Durée</th><th>Après</th></tr>" +
        "<tr><td>a) peser farine et sucre</td><td class='num'>60</td><td>—</td></tr>" +
        "<tr><td>b) mélanger farine, œufs, lait</td><td class='num'>180</td><td>a</td></tr>" +
        "<tr><td>c) laisser reposer la pâte</td><td class='num'>600</td><td>b</td></tr>" +
        "<tr><td>d) chauffer la poêle</td><td class='num'>120</td><td>—</td></tr>" +
        "<tr><td>e) cuire les crêpes</td><td class='num'>480</td><td>c, d</td></tr>" +
        "<tr><td>f) préparer la garniture</td><td class='num'>240</td><td>—</td></tr>" +
        "<tr><td>g) garnir et servir</td><td class='num'>60</td><td>e, f</td></tr></table>" +
        "<p>Variables : t<sub>x</sub> = date de début de l'étape x, domaine [0, H] (H = horizon).</p>",
      objectif: "Écrire les contraintes, puis répondre : peut-on servir 20 minutes après avoir commencé ?",
      installer: function (zone, api) {
        enchainer(zone, [
          function (z, ok) {
            Exercices.cocher(z, {
              question: "Quelles contraintes sont justes ?",
              options: [
                "t<sub>a</sub> + 60 ≤ t<sub>b</sub>",
                "t<sub>b</sub> &lt; t<sub>c</sub>",
                "t<sub>c</sub> + 600 ≤ t<sub>e</sub>",
                "t<sub>d</sub> + 120 ≤ t<sub>e</sub>",
                "t<sub>e</sub> + 480 ≤ t<sub>g</sub> et t<sub>f</sub> + 240 ≤ t<sub>g</sub>",
                "t<sub>b</sub> + 180 ≤ t<sub>a</sub>"
              ],
              bonnes: [0, 2, 3, 4],
              explication: "« x avant y » s'écrit t<sub>x</sub> + durée<sub>x</sub> ≤ t<sub>y</sub>. t<sub>b</sub> &lt; t<sub>c</sub> laisserait la pâte reposer avant d'être mélangée ; la dernière inverse l'ordre.",
              surReussite: ok
            });
          },
          function (z, ok) {
            html(z, "<p>Au plus tôt : chaque étape commence dès que toutes celles qui la précèdent sont finies.</p>");
            Exercices.nombre(z, {
              label: "Date de fin de g au plus tôt (s) =",
              attendu: 1380, placeholder: "en secondes",
              indice: "a finit à 60, b à 240, c à 840 ; d finit à 120 : e commence à max(840, 120)…",
              bravo: "e commence à 840 et finit à 1 320 ; f finit à 240 ; g commence à 1 320 et finit à 1 380 s = 23 min. Le chemin a → b → c → e → g fixe la durée.",
              surReussite: ok
            });
          },
          function (z, ok) {
            choix(z, {
              question: "Peut-on servir 20 minutes (1 200 s) après avoir commencé ?",
              options: ["Oui", "Non"],
              bonne: 1,
              expliquer: [
                "Il faudrait t<sub>g</sub> + 60 ≤ 1 200, or t<sub>g</sub> ≥ 1 320 quelles que soient les autres valeurs.",
                "Exact : avec H = 1 200, le CSP n'a pas de solution, car a + b + c + e + g = 60 + 180 + 600 + 480 + 60 = 1 380 &gt; 1 200."
              ],
              surReussite: ok
            });
          }
        ], function () {
          html(zone, NOTE_CORRIGE +
            "<div class='signalement'>Hypothèse de ce corrigé : des étapes indépendantes peuvent avoir lieu en même temps (la pâte repose pendant qu'on prépare la garniture). " +
            "Les annales ne le précisent pas ; si une seule personne fait tout à la suite, il faut ajouter des contraintes de non-chevauchement (t<sub>x</sub> + durée<sub>x</sub> ≤ t<sub>y</sub> ou t<sub>y</sub> + durée<sub>y</sub> ≤ t<sub>x</sub>). Écris ton hypothèse sur ta copie.</div>");
          api.valider("Précédence : t(x) + durée(x) ≤ t(y). « Fini avant H ? » = le CSP avec domaines [0, H] a-t-il une solution ?");
        });
      }
    },

    /* 4 ─────────────────────────────── Surveillants ────────────── */
    {
      titre: "Surveillants aux portes",
      texte:
        "<p>Un musée de 7 salles (A à G) reliées par 9 portes (p1 à p9). Un surveillant se place <b>dans une porte</b> et surveille les deux salles qu'elle relie. " +
        "On veut que chaque salle soit surveillée, avec le moins de surveillants possible.</p>" +
        "<p>Touche une porte (un trait) pour y placer ou retirer un surveillant (trait épais en tirets). Les salles surveillées se remplissent.</p>",
      objectif: "Surveiller les 7 salles avec le minimum de surveillants, puis modéliser.",
      installer: function (zone, api) {
        var S = [
          { id: "A", x: 45, y: 35 }, { id: "B", x: 160, y: 35 }, { id: "C", x: 275, y: 35 },
          { id: "D", x: 45, y: 120 }, { id: "E", x: 160, y: 120 }, { id: "F", x: 275, y: 120 },
          { id: "G", x: 218, y: 185 }
        ];
        var P = [["A", "B"], ["B", "C"], ["A", "D"], ["B", "E"], ["C", "F"], ["D", "E"], ["E", "F"], ["F", "G"], ["E", "G"]];
        var pos = {}; S.forEach(function (s) { pos[s.id] = s; });
        enchainer(zone, [
          function (z, ok) {
            var garde = {};
            var fini = false;
            var fig = new FigureGraphe(cadre(z), { largeur: 320, hauteur: 210, titre: "Plan du musée", onArete: function (id) {
              if (fini) return;
              garde[id] = !garde[id]; maj();
            } });
            var info = el("p", "legende-figure"); z.appendChild(info);
            var r = el("div", "retour"); z.appendChild(r);
            function maj() {
              var couvertes = {};
              var n = 0;
              P.forEach(function (p, i) { if (garde["p" + (i + 1)]) { n++; couvertes[p[0]] = couvertes[p[1]] = true; } });
              fig.dessiner({
                sommets: S.map(function (s) { return { id: s.id, x: s.x, y: s.y, label: s.id, classe: couvertes[s.id] ? "plein" : "" }; }),
                aretes: P.map(function (p, i) { return { id: "p" + (i + 1), u: p[0], v: p[1], classe: garde["p" + (i + 1)] ? "traverse" : "" }; }),
                etiquettes: P.map(function (p, i) {
                  var a = pos[p[0]], b = pos[p[1]];
                  var dx = b.x - a.x, dy = b.y - a.y;
                  return { x: (a.x + b.x) / 2 + (dy ? 6 : -8), y: (a.y + b.y) / 2 + (dy ? 0 : -7), texte: "p" + (i + 1) };
                })
              });
              var nc = Object.keys(couvertes).length;
              info.innerHTML = "<span>surveillants : <span class='mono'>" + n + "</span></span><span>salles surveillées : <span class='mono'>" + nc + " / 7</span></span>";
              if (nc === 7 && n === 4) {
                fini = true;
                r.className = "retour ok";
                r.innerHTML = "4 surveillants. On ne peut pas faire moins : un surveillant couvre au plus 2 salles, donc il en faut au moins ⌈7 / 2⌉ = 4.";
                ok();
              } else if (nc === 7) {
                r.className = "retour ko"; r.textContent = "Toutes les salles sont surveillées avec " + n + " surveillants. Peut-on faire moins ?";
              } else { r.className = "retour"; r.textContent = ""; }
            }
            maj();
          },
          function (z, ok) {
            choix(z, {
              question: "Quelles variables ?",
              options: [
                "x<sub>p</sub> ∈ {0, 1} pour chaque porte p (1 = un surveillant dans la porte)",
                "une variable 0/1 par salle A…G (la salle est surveillée)",
                "un entier k = nombre de surveillants",
                "y<sub>s</sub> ∈ {p1, …, p9} : la porte du surveillant de la salle s"
              ],
              bonne: 0,
              expliquer: [
                "Exact : les inconnues sont les portes occupées. 9 variables binaires, comme les xᵢ du sac à dos.",
                "Que la salle soit surveillée est une conséquence, pas un choix : on doit avoir 1 partout.",
                "k est la valeur de l'objectif, pas une décision suffisante pour savoir où placer les surveillants.",
                "Ce modèle est possible mais plus compliqué : deux salles peuvent partager un surveillant, il faut alors relier leurs y. Le modèle par portes est plus direct."
              ],
              surReussite: ok
            });
          },
          function (z, ok) {
            choix(z, {
              question: "Pour la salle E (portes p4, p6, p7, p9), la contrainte est :",
              options: ["x<sub>p4</sub> + x<sub>p6</sub> + x<sub>p7</sub> + x<sub>p9</sub> ≥ 1", "x<sub>p4</sub> + x<sub>p6</sub> + x<sub>p7</sub> + x<sub>p9</sub> = 1", "x<sub>p4</sub> = x<sub>p6</sub> = x<sub>p7</sub> = x<sub>p9</sub> = 1", "alldifferent(x<sub>p4</sub>, x<sub>p6</sub>, x<sub>p7</sub>, x<sub>p9</sub>)"],
              bonne: 0,
              expliquer: [
                "Exact : au moins un surveillant dans une porte de la salle. Une contrainte par salle, et l'objectif min Σ x<sub>p</sub>.",
                "« Exactement un » interdirait des solutions valables (deux surveillants peuvent toucher E).",
                "Il suffit d'un surveillant, pas de quatre.",
                "Avec un domaine {0, 1}, 4 variables ne peuvent pas être toutes différentes."
              ],
              surReussite: ok
            });
          },
          function (z, ok) {
            Exercices.nombre(z, {
              label: "Espace de recherche =",
              attendu: 512, placeholder: "un entier",
              indice: "9 portes, 2 valeurs chacune : 2⁹.",
              bravo: "2⁹ = 512, comme les 2ⁿ interrupteurs du cours d'introduction : c'est le même problème de couverture (hitting set).",
              surReussite: ok
            });
          }
        ], function () {
          html(zone, "<div class='encadre'><span class='titre-encadre'>Corrigé complet</span>" +
            "V = {x<sub>p1</sub>, …, x<sub>p9</sub>}, D = {0, 1}.<br>C : pour chaque salle s, Σ<sub>p porte de s</sub> x<sub>p</sub> ≥ 1 (7 contraintes).<br>" +
            "Objectif : minimiser Σ x<sub>p</sub>. Optimum 4, par exemple p1, p5, p6, p9 ; preuve : 7 salles, 2 par surveillant.</div>" + NOTE_CORRIGE);
          api.valider("Couverture : variables 0/1 sur les choix, « au moins un » par élément à couvrir, minimiser la somme.");
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "problem-solving",
    id: "modeliser-examen",
    etapes: etapes,
    fin: {
      texte:
        "<p>La méthode, pour chaque exercice de modélisation :</p><ul>" +
        "<li>Les <b>inconnues</b> → V ; leurs <b>valeurs possibles</b> → D.</li>" +
        "<li>Chaque règle de l'énoncé → une famille de contraintes (sans oublier les cases données).</li>" +
        "<li>Espace de recherche = produit des |Dᵢ| ; dire si l'on compte les cases données.</li>" +
        "<li>Optimisation : ajouter l'objectif, et si possible une borne pour prouver l'optimum.</li></ul>",
      cartes: "modelisation"
    }
  });
})();
