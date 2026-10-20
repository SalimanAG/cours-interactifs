/* Leçon : Algorithmes gloutons — la sélection d'activités (cours « Greedy Algorithms »).
   Fil rouge : un même jeu de 6 événements dans le gymnase, de 8 h à 22 h.
   (Jeu inventé : le cours donne un contre-exemple différent par stratégie ;
   ici les trois stratégies sont essayées sur les mêmes événements.) */
(function () {
  "use strict";
  var el = Site.el;

  var EV = [
    { id: "A", a: 0, b: 10 }, { id: "B", a: 1, b: 4 }, { id: "C", a: 4, b: 8 },
    { id: "D", a: 7, b: 9 }, { id: "E", a: 8, b: 13 }, { id: "F", a: 13, b: 14 }
  ];
  var OPT = 4;
  function h(t) { return (8 + t) + "h"; }
  function parId(id) { return EV.filter(function (e) { return e.id === id; })[0]; }
  function texte(e) { return h(e.a) + "–" + h(e.b); }
  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function html(zone, contenu, classe) { var d = el("div", classe || ""); d.innerHTML = contenu; zone.appendChild(d); return d; }
  function frise(zone, onI) {
    return new Frise(cadre(zone), { debut: 0, fin: 14, pas: 2, graduation: h, onIntervalle: onI });
  }
  function vue(classes, liste) {
    return (liste || EV).map(function (e) { return { id: e.id, a: e.a, b: e.b, texte: texte(e), classe: classes[e.id] || "" }; });
  }

  /* Trace d'un glouton : on parcourt les événements dans l'ordre de `cle`,
     on garde chacun s'il est compatible avec ceux déjà gardés. */
  function trace(cle) {
    var ordre = EV.slice().sort(function (x, y) { return cle(x) - cle(y); });
    var pris = [], ecartes = [], etats = [{ classes: {}, msg: "Ordre de parcours : " + ordre.map(function (e) { return e.id; }).join(", ") + "." }];
    ordre.forEach(function (e) {
      var ok = pris.every(function (p) { return Frise.compatibles(p, e); });
      if (ok) pris.push(e); else ecartes.push(e);
      var cl = {};
      pris.forEach(function (p) { cl[p.id] = "choisie"; });
      ecartes.forEach(function (p) { cl[p.id] = "barree"; });
      cl[e.id] = "courante";
      etats.push({ classes: cl, msg: e.id + " (" + texte(e) + ") : " + (ok ? "compatible avec ceux déjà pris → on le garde." : "chevauche un événement déjà pris → écarté.") });
    });
    var fin = {};
    pris.forEach(function (p) { fin[p.id] = "choisie"; });
    ecartes.forEach(function (p) { fin[p.id] = "barree"; });
    etats.push({ classes: fin, msg: "Résultat : " + pris.length + " événements (" + pris.map(function (p) { return p.id; }).join(", ") + ")." });
    return { etats: etats, pris: pris };
  }

  /* Étapes 2 et 3 : exécuter une stratégie pas à pas, puis désigner le coupable. */
  function executer(zone, api, cle, coupable, messages) {
    var t = trace(cle);
    var phase = "trace";
    var f = frise(zone, function (id) {
      if (phase !== "coupable") return;
      if (id === coupable) {
        phase = "fini";
        f.dessiner(vue((function () { var c = t.etats[t.etats.length - 1].classes; var d = {}; for (var k in c) d[k] = c[k]; d[coupable] = "conflit"; return d; })()));
        api.retour(messages.bravo, true);
        api.valider(messages.valider);
      } else {
        api.retour(messages.indices[id] || "Ce n'est pas lui qui fait perdre des événements. Regarde ceux que la stratégie a écartés : à cause de qui ?", false);
      }
    });
    var info = el("p", "legende-figure");
    zone.appendChild(info);
    var question = el("p");
    zone.appendChild(question);
    var ctl = new Controleur(zone, {
      afficher: function (i) { f.dessiner(vue(t.etats[i].classes)); info.textContent = t.etats[i].msg; },
      delai: 900,
      surFin: function () {
        if (phase !== "trace") return;
        phase = "coupable";
        question.innerHTML = "La stratégie garde <b>" + t.pris.length + "</b> événements, alors que l'optimum est " + OPT + ". <b>Touche l'événement qui lui fait perdre des places.</b>";
      }
    });
    ctl.charger(t.etats.length);
    return function () { ctl.stop(); };
  }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le problème : un seul gymnase",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Sélection d'activités (cours)</span>" +
        "Un gymnase accueille des événements ; deux événements ne peuvent pas avoir lieu en même temps. L'événement i a un début sᵢ et une fin eᵢ ; " +
        "deux événements sont compatibles si leurs intervalles ne se chevauchent pas. <b>Question :</b> programmer le plus grand nombre d'événements.</div>" +
        "<p>Voici 6 demandes pour la journée. Touche un événement pour le programmer (ou le retirer). Finir à 12 h et commencer à 12 h est compatible.</p>",
      objectif: "Programmer 4 événements compatibles.",
      installer: function (zone, api) {
        var pris = {};
        var f = frise(zone, toucher);
        var info = el("p", "legende-figure"); zone.appendChild(info);
        function maj() {
          var cl = {}; Object.keys(pris).forEach(function (k) { cl[k] = "choisie"; });
          f.dessiner(vue(cl));
          info.innerHTML = "<span>programmés : <span class='mono'>" + Object.keys(pris).length + "</span></span>";
        }
        function toucher(id) {
          if (pris[id]) { delete pris[id]; maj(); api.retour("", null); return; }
          var e = parId(id);
          var gene = Object.keys(pris).filter(function (k) { return !Frise.compatibles(parId(k), e); });
          if (gene.length) { api.retour(id + " chevauche " + gene.join(", ") + " : retire d'abord " + (gene.length > 1 ? "ceux-là" : "celui-là") + ".", false); return; }
          pris[id] = true; maj();
          var n = Object.keys(pris).length;
          if (n === OPT) {
            api.retour("4 événements : " + Object.keys(pris).sort().join(", ") + ".", true);
            api.valider("On ne peut pas faire mieux : A chevauche B, C, D et E ; D chevauche C et E. L'optimum vaut 4.");
          } else api.retour(n === 3 ? "3 événements. On peut en caser un de plus." : "", null);
        }
        maj();
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Stratégie 1 : par début croissant",
      texte:
        "<p>Un <b>algorithme glouton</b> fait à chaque étape le choix localement optimal, <b>sans revenir sur ses décisions</b>, en espérant un résultat globalement optimal.</p>" +
        "<p>Première idée du cours : <b>trier par début croissant</b>, puis garder chaque événement s'il est compatible avec ceux déjà gardés.</p>" +
        "<p>Exécute la stratégie avec ▶ (l'événement examiné est en couleur).</p>",
      objectif: "Exécuter la stratégie, puis trouver l'événement qui la met en échec.",
      installer: function (zone, api) {
        return executer(zone, api, function (e) { return e.a; }, "A", {
          bravo: "A commence le premier mais dure 10 h : il bloque B, C, D et E.",
          valider: "Contre-exemple du cours : un long événement qui commence tôt. Commencer tôt ne veut pas dire libérer tôt.",
          indices: { F: "F est pris, et il ne gêne personne." }
        });
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Stratégie 2 : par durée croissante",
      texte:
        "<p>Deuxième idée : prendre d'abord les <b>événements les plus courts</b>, ils occupent moins le gymnase.</p>",
      objectif: "Exécuter la stratégie, puis trouver l'événement qui la met en échec.",
      installer: function (zone, api) {
        return executer(zone, api, function (e) { return e.b - e.a; }, "D", {
          bravo: "D est court (2 h), mais il est à cheval sur C et E : le prendre en fait perdre deux.",
          valider: "Contre-exemple du cours : un événement court à cheval sur deux autres.",
          indices: { A: "A est écarté, mais à juste titre : il chevauche presque tout.", F: "F est pris et ne gêne personne.", B: "B est pris et ne gêne personne." }
        });
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Stratégie 3 : par fin croissante",
      texte:
        "<p>Troisième idée du cours : <b>trier par fin croissante</b>. L'événement qui finit le plus tôt libère le gymnase le plus tôt.</p>" +
        "<p>C'est toi qui exécutes : touche, à chaque étape, l'événement que choisit le glouton (celui qui <b>finit le plus tôt</b> parmi ceux encore compatibles).</p>",
      objectif: "Exécuter toi-même le glouton par fin croissante.",
      installer: function (zone, api) {
        var ordre = EV.slice().sort(function (x, y) { return x.b - y.b; });
        var pris = [], ecartes = {};
        var f = frise(zone, toucher);
        var info = el("p", "legende-figure"); zone.appendChild(info);
        function attendu() {
          for (var i = 0; i < ordre.length; i++) {
            var e = ordre[i];
            if (pris.indexOf(e) >= 0 || ecartes[e.id]) continue;
            return e;
          }
          return null;
        }
        function maj() {
          var cl = {};
          pris.forEach(function (p) { cl[p.id] = "choisie"; });
          Object.keys(ecartes).forEach(function (k) { cl[k] = "barree"; });
          f.dessiner(vue(cl));
          info.innerHTML = "<span>pris : <span class='mono'>" + (pris.map(function (p) { return p.id; }).join(", ") || "—") + "</span></span>";
        }
        function toucher(id) {
          var att = attendu();
          if (!att) return;
          if (pris.some(function (p) { return p.id === id; }) || ecartes[id]) return;
          if (id !== att.id) {
            api.retour("Le glouton prend " + att.id + " : il finit à " + h(att.b) + ", avant " + id + " (" + h(parId(id).b) + ").", false);
            return;
          }
          pris.push(att);
          EV.forEach(function (e) { if (pris.indexOf(e) < 0 && !Frise.compatibles(e, att)) ecartes[e.id] = true; });
          maj();
          if (!attendu()) {
            api.retour("Pris : " + pris.map(function (p) { return p.id; }).join(", ") + " — " + pris.length + " événements.", true);
            api.valider("Fin croissante atteint l'optimum (4). Le cours prouve que c'est toujours le cas.");
          } else {
            api.retour(att.id + " pris ; les événements qui le chevauchent sont écartés.", true);
          }
        }
        maj();
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Pourquoi c'est toujours optimal",
      texte:
        "<p>Le cours le prouve <b>par récurrence</b>, avec un argument d'<b>échange</b> : on transforme une solution optimale quelconque en une solution optimale qui commence comme le glouton.</p>" +
        "<p>Sur la frise : B finit le premier. Une solution optimale qui commencerait par un autre événement peut le remplacer par B sans rien casser.</p>",
      objectif: "Remettre les étapes de la preuve dans l'ordre.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche les étapes dans l'ordre de la preuve.",
          separateur: "→",
          items: [
            "f₁ = l'événement qui finit le plus tôt",
            "O = fᵢ₁, …, fᵢₖ une solution optimale",
            "si fᵢ₁ ≠ f₁, remplacer fᵢ₁ par f₁",
            "f₁ finit avant fᵢ₁ : il ne chevauche pas fᵢ₂",
            "une solution optimale contient f₁",
            "recommencer sur les événements compatibles avec f₁"
          ],
          bravo: "C'est la preuve du cours : échange, puis récurrence sur les événements restants.",
          surReussite: function () { api.valider("Choix glouton sûr (échange) + même problème plus petit (récurrence) = glouton optimal."); }
        });
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Algorithme optimal ou heuristique ?",
      texte:
        "<p>Le cours : quand un glouton ne donne pas toujours la solution optimale, on parle d'<b>heuristique gloutonne</b>. " +
        "Une heuristique fournit <b>rapidement</b> (en temps polynomial) une solution <b>réalisable</b>, pas forcément optimale.</p>" +
        "<p>Deux façons de l'évaluer : <b>empirique</b> (la comparer aux meilleures solutions connues sur un benchmark) et <b>mathématique</b> (prouver une garantie). Elles peuvent se contredire.</p>",
      objectif: "Classer chaque glouton du cours.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Sélection d'activités par fin croissante : algorithme optimal.", vrai: true, explication: "Prouvé par échange et récurrence." },
            { texte: "Sélection d'activités par durée croissante : algorithme optimal.", vrai: false, explication: "Contre-exemple : un court événement à cheval sur deux autres (D ici)." },
            { texte: "Rendu de monnaie « plus grosse pièce d'abord » avec les pièces (1, 3, 4) : optimal.", vrai: false, explication: "Pour 6 : 4 + 1 + 1, alors que 3 + 3 suffit." },
            { texte: "Sac à dos fractionnaire, par valeur au gramme décroissante : optimal.", vrai: true, explication: "Preuve par échange d'un gramme (cours)." },
            { texte: "Sac à dos 0-1, par valeur au gramme décroissante : heuristique.", vrai: true, explication: "Sans découpe, le problème devient difficile : le même tri ne garantit plus l'optimum." }
          ],
          surReussite: function () { api.valider("Un seul contre-exemple suffit pour dire « pas optimal » ; pour dire « optimal », il faut une preuve."); }
        });
      }
    },

    /* 7 ─────────────────────────────────────────────────────────── */
    {
      titre: "L'exercice du cours : maximiser le temps d'utilisation",
      texte:
        "<p>Le cours finit sur une variante, sans la corriger : on veut maintenant <b>maximiser la durée totale d'utilisation</b> du gymnase (et non plus le nombre d'événements).</p>" +
        "<p>Nouveau jeu de 4 événements. Programme-les pour occuper le gymnase le plus longtemps possible.</p>",
      objectif: "Atteindre la durée totale maximale, puis voir ce que donnent les gloutons.",
      installer: function (zone, api) {
        var EV2 = [{ id: "P", a: 0, b: 6 }, { id: "Q", a: 1, b: 3 }, { id: "R", a: 4, b: 5 }, { id: "S", a: 6, b: 9 }];
        function p2(id) { return EV2.filter(function (e) { return e.id === id; })[0]; }
        var pris = {};
        var fini = false;
        var f = new Frise(cadre(zone), { debut: 0, fin: 10, pas: 2, graduation: h, onIntervalle: toucher });
        var info = el("p", "legende-figure"); zone.appendChild(info);
        var suite = el("div"); zone.appendChild(suite);
        function total() { return Object.keys(pris).reduce(function (s, k) { var e = p2(k); return s + e.b - e.a; }, 0); }
        function maj() {
          var cl = {}; Object.keys(pris).forEach(function (k) { cl[k] = "choisie"; });
          f.dessiner(EV2.map(function (e) { return { id: e.id, a: e.a, b: e.b, texte: (e.b - e.a) + " h", classe: cl[e.id] || "" }; }));
          info.innerHTML = "<span>durée totale : <span class='mono'>" + total() + " h</span></span>";
        }
        function toucher(id) {
          if (fini) return;
          if (pris[id]) { delete pris[id]; maj(); return; }
          var e = p2(id);
          var gene = Object.keys(pris).filter(function (k) { return !Frise.compatibles(p2(k), e); });
          if (gene.length) { api.retour(id + " chevauche " + gene.join(", ") + ".", false); return; }
          pris[id] = true; maj();
          if (total() === 9) {
            fini = true;
            api.retour("P + S = 9 h : c'est le maximum (Q et R ensemble ne font que 3 h, contre 6 h pour P).", true);
            Exercices.choix(suite, {
              question: "Le glouton « fin croissante » (optimal pour compter les événements) donne ici :",
              options: ["Q, R, S : 6 h", "P, S : 9 h", "P seul : 6 h"],
              bonne: 0,
              expliquer: [
                "Exact : Q finit le premier, puis R, puis S → 3 événements mais seulement 6 h. Il maximise le nombre, pas la durée.",
                "Non : Q finit avant P, le glouton prend Q, qui chevauche P.",
                "Non : le glouton commence par Q."
              ],
              surReussite: function () {
                html(suite,
                  "<div class='encadre'><span class='titre-encadre'>Corrigé proposé</span>" +
                  "Aucun des tris gloutons ne marche : fin croissante échoue ci-dessus, et « le plus long d'abord » aussi " +
                  "(événements 0–4, 4–8 et 2–8 : il prend 2–8, soit 6 h, au lieu de 0–4 + 4–8 = 8 h).<br>" +
                  "Méthode exacte : trier par fin croissante, puis calculer T(i) = max(T(i − 1), dᵢ + T(p(i))), " +
                  "où dᵢ est la durée de i et p(i) le dernier événement qui finit avant le début de i. C'est de la <b>programmation dynamique</b>, en O(n log n).</div>" +
                  "<div class='signalement'>Le cours pose cet exercice sans le corriger, et la programmation dynamique n'est pas au programme de Problem Solving " +
                  "(elle est vue en Advanced Algorithms et en Programming Challenge). Le contre-exemple et la méthode sont un corrigé proposé.</div>");
                api.valider("Changer l'objectif peut casser un glouton optimal : il faut refaire la preuve, ou trouver un contre-exemple.");
              }
            });
          } else api.retour("", null);
        }
        maj();
      }
    }
  ];

  Lecon.demarrer({
    matiere: "problem-solving",
    id: "selection-activites",
    etapes: etapes,
    fin: {
      texte:
        "<p>À retenir :</p><ul>" +
        "<li>Glouton : un choix localement optimal à chaque étape, sans retour en arrière.</li>" +
        "<li>Sélection d'activités : début croissant ✗, durée croissante ✗, <b>fin croissante ✓</b>.</li>" +
        "<li>Optimalité : preuve par échange (une solution optimale commence comme le glouton) puis récurrence.</li>" +
        "<li>Non-optimalité : un seul contre-exemple suffit.</li>" +
        "<li>Glouton non optimal = heuristique : rapide, solution réalisable, pas de garantie.</li></ul>",
      cartes: "gloutons"
    }
  });
})();
