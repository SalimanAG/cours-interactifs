/* Leçon : Coupe minimum par contraction aléatoire (cours 2, Algorithmes probabilistes).
   Fil rouge : le graphe « Exemple » du cours 2 (a, b, c, d, e, f ; 7 arêtes). */
(function () {
  "use strict";
  var el = Site.el;
  var G = Contraction.EXEMPLE;
  var N = G.sommets.length;            // 6
  var TOUS = G.sommets.map(function (s) { return s.id; });
  var C_PARTIE = ["a", "b", "c"];      // coupe minimum fixée pour l'analyse
  var C_TRAVERSE = { bd: true, cd: true };

  var ALGO = {
    titre: "Algorithme 1 : Contraction Aléatoire",
    lignes: [
      "pour tout v ∈ V faire",
      "    S(v) ← {v}",
      "fin",
      "tant que |V| > 2 faire",
      "    choisir une arête uv de G uniformément aléatoirement",
      "    G ← G/uv",
      "    S(v) ← S(v) ∪ S(u)",
      "fin",
      "retourner la coupe (S(x), S(y))   (où {x, y} = V)"
    ]
  };

  /* ---------- petits utilitaires ---------- */
  function cadre(zone) {
    var c = el("div", "cadre-figure");
    zone.appendChild(c);
    return c;
  }
  function ligneInfo(zone) {
    var p = el("p", "legende-figure");
    zone.appendChild(p);
    return p;
  }
  function ens(l) { return "{" + l.slice().sort().join(", ") + "}"; }
  function bouton(parent, texte, action, plein) {
    var b = el("button", "btn btn-petit" + (plein ? " btn-plein" : ""), texte);
    b.type = "button";
    b.onclick = action;
    parent.appendChild(b);
    return b;
  }
  function html(zone, contenu, classe) {
    var d = el("div", classe || "");
    d.innerHTML = contenu;
    zone.appendChild(d);
    return d;
  }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Couper un graphe en deux",
      texte:
        "<p>Le problème du cours :</p>" +
        "<div class='encadre'><span class='titre-encadre'>Coupe minimum</span>" +
        "<b>Entrée :</b> un multigraphe non orienté (arêtes multiples possibles pour un couple de sommets).<br>" +
        "<b>Sortie :</b> une coupe (U, U′) de G (= bipartition de V(G)) ayant le nombre minimum d'arêtes qui traversent.</div>" +
        "<p>Touche les sommets pour les mettre dans <b>U</b> (sommets pleins). Les arêtes qui traversent la coupe sont en pointillés.</p>",
      objectif: "Trouver une coupe que seulement 2 arêtes traversent.",
      installer: function (zone, api) {
        var U = {};
        var fig = new FigureGraphe(cadre(zone), {
          largeur: 320, hauteur: 185, titre: "Graphe exemple du cours",
          onSommet: function (id) { U[id] = !U[id]; maj(); }
        });
        var info = ligneInfo(zone);
        function maj() {
          var dans = TOUS.filter(function (v) { return U[v]; });
          var hors = TOUS.filter(function (v) { return !U[v]; });
          var traverse = G.aretes.filter(function (a) { return !!U[a.u] !== !!U[a.v]; });
          fig.dessiner({
            sommets: G.sommets.map(function (s) { return { id: s.id, x: s.x, y: s.y, label: s.id, classe: U[s.id] ? "plein" : "" }; }),
            aretes: G.aretes.map(function (a) { return { id: a.id, u: a.u, v: a.v, classe: traverse.indexOf(a) >= 0 ? "traverse" : "" }; })
          });
          info.innerHTML = "<span>U = <span class='mono'>" + ens(dans) + "</span></span>" +
            "<span>U′ = <span class='mono'>" + ens(hors) + "</span></span>" +
            "<span>arêtes qui traversent : <span class='mono'>" + traverse.length + "</span></span>";
          if (!dans.length || !hors.length) {
            api.retour(dans.length ? "U′ est vide : ce n'est pas une bipartition. Retire un sommet de U." : "", dans.length ? false : null);
          } else if (traverse.length === 2) {
            api.retour("Coupe de valeur 2 : " + ens(dans) + " | " + ens(hors) + ".", true);
            api.valider("On ne peut pas faire moins sur ce graphe : la coupe minimum a k = 2 arêtes. Plusieurs coupes l'atteignent (essaie-en d'autres).");
          } else {
            api.retour(traverse.length + " arêtes traversent. Peux-tu faire moins ?", false);
          }
        }
        maj();
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Pourquoi un algorithme probabiliste ?",
      texte:
        "<p>Le cours compare deux façons de résoudre ce problème :</p>" +
        "<table class='tableau'><tr><th>Approche</th><th class='num'>Complexité</th></tr>" +
        "<tr><td>n(n − 1)/2 fois l'algo d'Edmonds-Karp, avec toutes les paires {source, puits} possibles</td><td class='num'>O(n³m²)</td></tr>" +
        "<tr><td>Algo probabiliste de ce cours</td><td class='num'>O(n⁴ log n)</td></tr>" +
        "<tr><td class='discret'>Meilleur algo probabiliste connu (cité)</td><td class='num discret'>O(n² log³ n)</td></tr></table>" +
        "<p>Un algo probabiliste <b>fait des choix de manière aléatoire</b> — aléatoire ≠ quelconque : souvent uniformément " +
        "(pas toujours : par ex. choisir un sommet proportionnellement à son degré).</p>" +
        "<div class='signalement'>Le cours renvoie à une version « précédente » de la coupe minimum (avec source et puits, résolue par flot). " +
        "Ce chapitre sur les flots n'est pas dans tes documents : je n'en dis pas plus ici.</div>",
      objectif: "Dire ce qu'on perd et ce qu'on gagne avec un algorithme probabiliste.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Qu'est-ce qu'on perd ?",
          options: [
            "On n'obtient pas toujours l'optimum.",
            "La complexité augmente.",
            "Le résultat n'est pas toujours une coupe."
          ],
          bonne: 0,
          expliquer: [
            "Exact. Et ce qu'on gagne : la complexité baisse (ici O(n³m²) → O(n⁴ log n)). Tout dépend de la probabilité d'obtenir l'optimum : il ne faut pas qu'elle soit trop faible.",
            "Non : c'est justement ce qu'on gagne, la complexité baisse.",
            "Non : l'algorithme renvoie toujours une coupe, mais pas forcément une coupe minimum."
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Contracter une arête",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Définition (contraction d'arête)</span>" +
        "Soit G = (V, E) un multigraphe sans boucle et uv une arête de G. Le graphe contracté de G selon l'arête uv, noté G/uv, est défini par" +
        "<div class='formule'>G/uv = (V \\ {u}, E \\ ⦃ux | x ∈ N(u)⦄ ∪ ⦃vx | ux ∈ E et x ≠ v⦄)</div></div>" +
        "<p>Autrement dit : u disparaît, ses arêtes sont rattachées à v, et les arêtes entre u et v disparaissent (on ne crée pas de boucle). " +
        "Sous chaque sommet, on note l'ensemble S(v) des sommets d'origine qu'il regroupe.</p>" +
        "<p>Touche une arête pour la contracter.</p>",
      objectif: "Faire apparaître une arête multiple (deux arêtes entre les mêmes sommets).",
      installer: function (zone, api) {
        var M = new Contraction(G);
        var fig = new FigureGraphe(cadre(zone), {
          largeur: 320, hauteur: 185,
          onArete: function (id) {
            var r = M.contracter(id);
            if (!r) return;
            api.retour("Contraction de " + r.u + r.v + " : " + r.u + " disparaît, S(" + r.v + ") = " + ens(M.S[r.v]) + ".", null);
            maj();
          }
        });
        var info = ligneInfo(zone);
        var barre = el("div", "rangee-btn");
        zone.appendChild(barre);
        bouton(barre, "Annuler", function () { M.annuler(); api.retour("", null); maj(); });
        bouton(barre, "Recommencer", function () { M.reinitialiser(); api.retour("", null); maj(); });
        function maj() {
          fig.dessiner(M.vue());
          var mult = M.multipliciteMax();
          info.innerHTML = "<span>sommets : <span class='mono'>" + M.nbSommets() + "</span></span>" +
            "<span>arêtes : <span class='mono'>" + M.aretesCourantes().length + "</span></span>" +
            (mult > 1 ? "<span>arête de multiplicité <span class='mono'>" + mult + "</span></span>" : "");
          fig.activerAretes(M.nbSommets() > 2);
          if (mult > 1) api.valider("Voilà pourquoi l'entrée est un multigraphe : contracter crée des arêtes multiples, et chacune compte dans la valeur d'une coupe.");
        }
        maj();
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "L'algorithme, avec toi comme hasard",
      texte:
        "<p>L'algorithme contracte des arêtes jusqu'à ce qu'il ne reste que 2 sommets, puis renvoie la coupe (S(x), S(y)). " +
        "Ici, c'est toi qui joues le rôle du tirage aléatoire de la ligne 5.</p>",
      objectif: "Exécuter l'algorithme jusqu'au bout et lire la coupe renvoyée.",
      installer: function (zone, api) {
        var M = new Contraction(G);
        var grille = el("div", "cote-a-cote");
        zone.appendChild(grille);
        var gauche = el("div"), droite = el("div");
        grille.appendChild(gauche); grille.appendChild(droite);
        var pc = new PseudoCode(droite, ALGO);
        var minuteur = null;
        var fig = new FigureGraphe(cadre(gauche), {
          largeur: 320, hauteur: 185,
          onArete: function (id) {
            if (M.nbSommets() <= 2 || minuteur) return;
            M.contracter(id);
            pc.surligner(7);
            maj(false);
            minuteur = setTimeout(function () { minuteur = null; maj(true); }, 450);
          }
        });
        var info = ligneInfo(gauche);
        var barre = el("div", "rangee-btn");
        gauche.appendChild(barre);
        bouton(barre, "Recommencer", function () { M.reinitialiser(); api.retour("", null); maj(true); });
        function maj(surlignerSuite) {
          fig.dessiner(M.vue());
          var faites = N - M.nbSommets();
          info.innerHTML = "<span>|V| = <span class='mono'>" + M.nbSommets() + "</span></span>" +
            "<span>contractions : <span class='mono'>" + faites + " / n − 2 = " + (N - 2) + "</span></span>";
          var fini = M.nbSommets() === 2;
          fig.activerAretes(!fini);
          if (!surlignerSuite) return;
          if (fini) {
            pc.surligner(9);
            var c = M.coupe();
            api.retour("Coupe renvoyée : " + Contraction.texteCoupe(c) + ", traversée par " + c.valeur + " arête" + (c.valeur > 1 ? "s" : "") + ".", true);
            api.valider("L'algo fait toujours n − 2 = 4 contractions. La valeur de la coupe = le nombre d'arêtes (avec multiplicité) entre les 2 sommets restants.");
          } else {
            pc.surligner(5);
          }
        }
        maj(true);
        return function () { if (minuteur) clearTimeout(minuteur); };
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le hasard choisit",
      texte:
        "<p>Maintenant le tirage est vraiment uniforme. Un algo probabiliste ⇒ deux exécutions ne donnent pas forcément le même résultat. " +
        "Lance des exécutions et regarde-les pas à pas (◀ ▶) ou en lecture automatique. L'arête tirée est en couleur.</p>",
      objectif: "Obtenir deux exécutions qui renvoient deux coupes différentes.",
      installer: function (zone, api) {
        var M = new Contraction(G);
        var grille = el("div", "cote-a-cote");
        zone.appendChild(grille);
        var gauche = el("div"), droite = el("div");
        grille.appendChild(gauche); grille.appendChild(droite);
        var fig = new FigureGraphe(cadre(gauche), { largeur: 320, hauteur: 185 });
        var pc = new PseudoCode(droite, ALGO);
        var trace = [];
        var resultats = {};
        var nbExec = 0;
        var journal = el("div", "journal");
        var ctl = new Controleur(gauche, {
          delai: 650,
          afficher: function (i) {
            var e = trace[i];
            M.restaurer(e.snap);
            fig.dessiner(M.vue(function (a) { return a.id === e.choisie ? "courante" : ""; }));
            pc.surligner(e.ligne);
          },
          surFin: function () {
            var c = M.coupe();
            var cle = Contraction.texteCoupe(c);
            if (!trace.compte) {
              trace.compte = true;
              nbExec++;
              resultats[cle] = true;
              var ligne = el("div", null, "exécution " + nbExec + " : " + cle + " — valeur " + c.valeur);
              journal.appendChild(ligne);
              journal.scrollTop = journal.scrollHeight;
            }
            if (Object.keys(resultats).length >= 2) {
              api.retour("Deux exécutions, deux coupes différentes.", true);
              api.valider("Remarque : sur ce petit graphe, toutes les coupes renvoyées valent 2 — il a plusieurs coupes minimum. L'analyse va fixer UNE coupe minimum C et calculer la probabilité de renvoyer exactement celle-là.");
            }
          }
        });
        var barre = el("div", "rangee-btn");
        gauche.appendChild(barre);
        function nouvelle(direct) {
          trace = M.trace();
          ctl.charger(trace.length);
          if (direct) ctl.aller(trace.length - 1); else ctl.lecture();
        }
        bouton(barre, "Nouvelle exécution", function () { nouvelle(false); }, true);
        bouton(barre, "Résultat direct", function () { nouvelle(true); });
        gauche.appendChild(journal);
        fig.dessiner(M.vue());
        pc.surligner(null);
        return function () { ctl.stop(); };
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Quand l'algorithme renvoie-t-il C ?",
      texte:
        "<p>Pour l'analyse, on note k la taille d'une coupe minimum de G et on <b>fixe</b> une coupe minimum C = (X, Y). " +
        "Ici : <span class='mono'>k = 2</span>, <span class='mono'>X = {a, b, c}</span>, <span class='mono'>Y = {d, e, f}</span> ; les 2 arêtes qui traversent C sont en pointillés.</p>" +
        "<div class='encadre'><b>Rq.</b> L'algo retourne C ssi il ne contracte aucune arête traversant C.</div>" +
        "<p>Vérifie-le : contracte des arêtes pour finir exactement sur C.</p>",
      objectif: "Terminer l'algorithme sur la coupe C = ({a, b, c}, {d, e, f}).",
      installer: function (zone, api) {
        var M = new Contraction(G);
        var perdue = false;
        var fig = new FigureGraphe(cadre(zone), {
          largeur: 320, hauteur: 185,
          onArete: function (id) {
            if (perdue || M.nbSommets() <= 2) return;
            if (C_TRAVERSE[id]) {
              perdue = true;
              M.contracter(id);
              maj();
              api.retour("Tu as contracté " + id + ", qui traverse C : ses deux extrémités (une dans X, une dans Y) sont maintenant dans le même sommet, C ne peut plus être renvoyée. Recommence.", false);
              return;
            }
            M.contracter(id);
            maj();
          }
        });
        var info = ligneInfo(zone);
        var barre = el("div", "rangee-btn");
        zone.appendChild(barre);
        bouton(barre, "Recommencer", function () { M.reinitialiser(); perdue = false; api.retour("", null); maj(); });
        function maj() {
          fig.dessiner(M.vue(function (a) { return C_TRAVERSE[a.id] ? "traverse" : ""; }));
          fig.activerAretes(!perdue && M.nbSommets() > 2);
          info.innerHTML = "<span>|V| = <span class='mono'>" + M.nbSommets() + "</span></span>";
          if (M.nbSommets() === 2 && !perdue) {
            var c = M.coupe();
            if (Contraction.memeCoupe(c, C_PARTIE)) {
              api.retour("Coupe renvoyée : " + Contraction.texteCoupe(c) + " = C.", true);
              api.valider("Les deux arêtes de C ont survécu jusqu'au bout : c'est l'événement dont on va calculer la probabilité.");
            }
          }
        }
        maj();
      }
    },

    /* 7 ─────────────────────────────────────────────────────────── */
    {
      titre: "Première contraction : la probabilité de survivre",
      texte:
        "<p>À la première contraction, l'arête tirée l'est uniformément parmi les m arêtes. " +
        "La probabilité p de choisir une arête <b>ne traversant pas</b> C est</p>" +
        "<div class='formule'>p = 1 − k/m</div>" +
        "<p>Sur le graphe exemple (n = 6, m = 7, k = 2) :</p>",
      objectif: "Calculer la probabilité que la première arête tirée traverse C.",
      installer: function (zone, api) {
        var fig = new FigureGraphe(cadre(zone), { largeur: 320, hauteur: 185 });
        fig.dessiner(new Contraction(G).vue(function (a) { return C_TRAVERSE[a.id] ? "traverse" : ""; }));
        Exercices.nombre(zone, {
          label: "Pr[la 1re arête traverse C] =",
          attendu: 2 / 7, tolerance: 0.003,
          indice: "Combien d'arêtes traversent C, et combien d'arêtes y a-t-il en tout ?",
          bravo: "Exact : k/m = 2/7, donc p = 1 − 2/7 = 5/7.",
          surReussite: function () {
            html(zone,
              "<span class='titre-encadre'>Le cas général</span>" +
              "On ne connaît pas m dans un graphe quelconque, mais on peut le minorer : la coupe minimum a taille k, " +
              "donc le degré minimum est au moins k, et donc G a au moins kn/2 arêtes. D'où " +
              "<div class='formule'>k/m ≤ k/(kn/2) = 2/n</div>" +
              "Ici : m = 7 ≥ kn/2 = 6, et bien 2/7 ≤ 2/6.", "encadre");
            api.valider();
          }
        });
      }
    },

    /* 8 ─────────────────────────────────────────────────────────── */
    {
      titre: "Toutes les contractions : un produit",
      texte:
        "<p>On note E<sub>j</sub> l'événement « à la j-ème itération de la boucle principale, l'arête uv sélectionnée ne traverse pas C », " +
        "et G<sub>j</sub> le graphe avant l'itération j, dans l'événement E<sub>1</sub> ∩ … ∩ E<sub>j−1</sub>. " +
        "G<sub>j</sub> a exactement n − j + 1 sommets et sa coupe minimum a taille k, donc comme à l'étape précédente :</p>" +
        "<div class='formule'>p_j = Pr[E_j | E_1 ∩ … ∩ E_(j−1)] ≥ 1 − 2/(n − j + 1) = (n − j − 1)/(n − j + 1)</div>" +
        "<p>Comme Pr[A ∩ B] = Pr[A | B] × Pr[B], la probabilité de renvoyer C est le produit des p<sub>j</sub>, pour j = 1 … n − 2. Pour n = 6 :</p>",
      objectif: "Calculer la borne sur la probabilité d'obtenir C pour n = 6.",
      installer: function (zone, api) {
        var t = el("table", "tableau");
        t.innerHTML = "<tr><th>j</th><th class='num'>sommets n − j + 1</th><th class='num'>borne de p_j</th></tr>" +
          [1, 2, 3, 4].map(function (j) {
            return "<tr><td class='mono'>" + j + "</td><td class='num'>" + (N - j + 1) + "</td><td class='num'>" + (N - j - 1) + "/" + (N - j + 1) + "</td></tr>";
          }).join("");
        zone.appendChild(t);
        Exercices.nombre(zone, {
          label: "p ≥",
          attendu: 1 / 15, tolerance: 0.0015,
          indice: "Multiplie les 4 bornes : beaucoup de facteurs se simplifient.",
          bravo: "Exact : 4/6 × 3/5 × 2/4 × 1/3 = 1/15.",
          surReussite: function () {
            html(zone,
              "<span class='titre-encadre'>En général</span>" +
              "<div class='formule'>p ≥ (n−2)/n × (n−3)/(n−1) × (n−4)/(n−2) × … × 2/4 × 1/3 = 2/(n(n − 1))</div>" +
              "Le produit est télescopique : il ne reste que 2 au numérateur et n(n − 1) au dénominateur. Pour n = 6 : 2/30 = 1/15.", "encadre");
            api.valider("Une seule exécution trouve C avec une probabilité au moins 2/(n(n−1)) : faible, mais pas exponentiellement faible.");
          }
        });
      }
    },

    /* 9 ─────────────────────────────────────────────────────────── */
    {
      titre: "Répéter t fois",
      texte:
        "<p>On fait t exécutions indépendantes et on garde la meilleure coupe. La probabilité de ne trouver C dans <b>aucune</b> est</p>" +
        "<div class='formule'>p_echec = (1 − p)^t        et (maths) (1 − p)^(1/p) ≤ 1/e</div>" +
        "<p>Avec t = 1/p exécutions, p_echec ≤ 1/e (une constante). Avec t = (1/p)·log n, p_echec ≤ 1/n → 0. " +
        "Fais varier t pour le graphe exemple (p = 1/15).</p>" +
        "<div class='signalement'>Le cours écrit « log » sans préciser la base ; avec la borne 1/e, c'est le logarithme népérien (ln) qui donne exactement (1/e)^(log n) = 1/n.</div>",
      objectif: "Choisir t pour que p_echec ≤ 1/1000.",
      installer: function (zone, api) {
        var p = 1 / 15;
        var lab = el("label", null);
        var curseur = el("input");
        curseur.type = "range"; curseur.min = 1; curseur.max = 200; curseur.value = 15;
        var aff = el("div", "legende-figure");
        zone.appendChild(lab); zone.appendChild(curseur); zone.appendChild(aff);
        function maj() {
          var t = +curseur.value;
          var echec = Math.pow(1 - p, t);
          lab.innerHTML = "t = <span class='mono'>" + t + "</span> exécutions";
          aff.innerHTML = "<span>p_echec = (14/15)^" + t + " = <span class='mono'>" + echec.toFixed(4) + "</span></span>" +
            "<span>succès ≥ <span class='mono'>" + (1 - echec).toFixed(4) + "</span></span>";
          if (echec <= 0.001) {
            api.retour("Avec t = " + t + ", p_echec ≤ 1/1000.", true);
            api.valider("Le cours : faire t = log(1000)·n(n−1)/2 exécutions donne p ≥ 1 − 1/1000 (ici 15 × ln 1000 ≈ 104), toujours en O(n⁴) — la constante log 1000 est cachée dans le O.");
          } else {
            api.retour(t >= 15 && t < 16 ? "t = 1/p = 15 : p_echec ≤ 1/e ≈ 0,37. Encore trop." : "", null);
          }
        }
        curseur.addEventListener("input", maj);
        maj();

        var sim = el("div", "encadre");
        sim.innerHTML = "<span class='titre-encadre'>Et en vrai ?</span>La borne 1/15 est une garantie, pas la vraie probabilité. Estime-la en simulant.";
        var r = el("div", "mono petit");
        var b = el("button", "btn btn-petit", "Simuler 5000 exécutions");
        b.type = "button";
        b.onclick = function () {
          var M = new Contraction(G), ok = 0;
          for (var i = 0; i < 5000; i++) if (Contraction.memeCoupe(M.executer(), C_PARTIE)) ok++;
          r.textContent = "C obtenue dans " + ok + " exécutions sur 5000 ≈ " + (ok / 5000).toFixed(3) + " (borne : 0,067)";
        };
        sim.appendChild(el("div", "rangee-btn")).appendChild(b);
        sim.appendChild(r);
        zone.appendChild(sim);
      }
    },

    /* 10 ────────────────────────────────────────────────────────── */
    {
      titre: "Complexité totale",
      texte:
        "<p>Soit f(n) la complexité de l'algo de contraction. On l'exécute n(n − 1)/2 · log n fois, " +
        "donc la complexité totale de l'algo probabiliste pour la coupe minimum est O(f(n) · n² log n).</p>" +
        "<p>Complexité de Contraction ? La boucle principale s'exécute O(n) fois. Donne le coût de chaque ligne :</p>",
      objectif: "Retrouver le coût des lignes 5 à 7 et la complexité totale.",
      installer: function (zone, api) {
        var pc = new PseudoCode(zone, ALGO);
        pc.surligner(null);
        var choixCout = ["?", "O(1)", "O(log n)", "O(n)", "O(n²)", "O(m)"];
        var questions = [
          { label: "ligne 5 (choisir une arête)", bonne: "O(1)", ligne: 5 },
          { label: "ligne 6 (G ← G/uv)", bonne: "O(n)", ligne: 6 },
          { label: "ligne 7 (S(v) ← S(v) ∪ S(u))", bonne: "O(n)", ligne: 7 },
          { label: "Contraction, au total", bonne: "O(n²)", ligne: null },
          { label: "algo complet (× n² log n)", bonne: "O(n⁴ log n)", ligne: null, options: ["?", "O(n² log n)", "O(n³ log n)", "O(n⁴ log n)", "O(n⁵)"] }
        ];
        var selects = [];
        questions.forEach(function (q) {
          var ligne = el("div", "saisie");
          ligne.style.margin = ".35rem 0";
          var lab = el("label", null, q.label);
          lab.style.flex = "1 1 12rem";
          var s = el("select");
          (q.options || choixCout).forEach(function (o) { var op = el("option", null, o); op.value = o; s.appendChild(op); });
          s.addEventListener("focus", function () { pc.surligner(q.ligne); });
          s.addEventListener("change", verifier);
          ligne.appendChild(lab); ligne.appendChild(s);
          zone.appendChild(ligne);
          selects.push(s);
        });
        var note = el("div", "signalement",
          "Le cours donne O(1) pour la ligne 5 sans dire quelle structure permet de tirer une arête en temps constant. " +
          "Le TP1 contourne la question : on fixe à l'avance un ordre aléatoire des arêtes et on rejette celles qui ont disparu.");
        zone.appendChild(note);
        function verifier() {
          var justes = 0, remplies = 0;
          selects.forEach(function (s, i) {
            if (s.value !== "?") remplies++;
            if (s.value === questions[i].bonne) justes++;
          });
          if (justes === questions.length) {
            api.retour("Tout est juste : O(n) itérations × O(n) = O(n²), puis O(n²) × n² log n = O(n⁴ log n).", true);
            api.valider();
          } else if (remplies === questions.length) {
            api.retour(justes + " réponse" + (justes > 1 ? "s" : "") + " juste" + (justes > 1 ? "s" : "") + " sur " + questions.length + ". Corrige les autres.", false);
          } else {
            api.retour("", null);
          }
        }
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "coupe-min-contraction",
    etapes: etapes,
    fin: {
      cartes: "coupe-min",
      texte:
        "<div class='encadre'><span class='titre-encadre'>À retenir (conclusion du cours)</span><ul>" +
        "<li>Une exécution de Contraction trouve une coupe minimum C fixée avec probabilité ≥ 2/(n(n − 1)).</li>" +
        "<li>Avec n(n−1)/2 · log n exécutions : succès ≥ 1 − 1/n, complexité O(n⁴ log n).</li>" +
        "<li>Avec n(n−1)/2 exécutions : succès ≥ 1 − 1/e, complexité O(n⁴).</li>" +
        "<li>Avec n · n(n−1)/2 exécutions : succès ≥ 1 − 1/eⁿ, complexité O(n⁵).</li></ul></div>" +
        "<p><b>Questions subsidiaires du cours</b> (à chercher) : montrer qu'il y a au plus O(n²) coupes minimum dans un graphe ; " +
        "montrer qu'il peut y avoir Ω(2ⁿ) s,t-coupes minimum.</p>" +
        "<div class='signalement'>Deux diapos du cours n'ont qu'un titre et des notes manuscrites : « Cas des graphes non connexes » et " +
        "« Une autre implémentation de l'algo (dite péridurale) », celle du TP1. Elles ne sont pas couvertes ici ; l'implémentation du TP fera l'objet d'un atelier.</div>"
    }
  });
})();
