/* Atelier : l'algorithme de labelling CTL, pas à pas, sur la formule de ton choix.
   Modèles : le système s0, s1, s2 (exercices du 13 octobre) et le four (slide 25). */
(function () {
  "use strict";
  var el = Site.el;
  var MODELES = { sys: MC.SYS, four: MC.FOUR };
  var choix = { m: "sys", texte: "EX(AG p → E(p U q))" };
  try {
    var sv = JSON.parse(localStorage.getItem("mc-labelling-libre") || "null");
    if (sv && MODELES[sv.m] && typeof sv.texte === "string") choix = sv;
  } catch (e) { /* stockage indisponible */ }
  function garder() { try { localStorage.setItem("mc-labelling-libre", JSON.stringify(choix)); } catch (e) { /* rien */ } }

  function calcul() {
    var S = MODELES[choix.m];
    var f = LT.lire(choix.texte, { props: S.M.props() });
    var b = LT.versBase(f);
    return { S: S, f: f, b: b, r: LT.etiqueter(S.M, b) };
  }

  function expliquer(e, S) {
    var d = e.detail, ens = MC.ens;
    switch (e.cas) {
      case "ap": return "Cas p ∈ AP : les états dont l'étiquette contient " + e.texte + ".";
      case "const": return e.texte === "true" ? "true est vraie dans tous les états." : "false n'est vraie nulle part.";
      case "non": return "Cas ¬ : le complémentaire de S(" + LT.texte(e.f.f) + ").";
      case "et": return "Cas ∧ : l'intersection de S(" + LT.texte(e.f.a) + ") et S(" + LT.texte(e.f.b) + ").";
      case "ou": return "Cas ∨ : l'union de S(" + LT.texte(e.f.a) + ") et S(" + LT.texte(e.f.b) + ").";
      case "EX": return "Cas EX : les prédécesseurs (via R⁻¹) des états de S(" + LT.texte(e.f.f.f) + ") = " + ens(d.cible) + ".";
      case "EU": {
        var t = "Cas EU : on part de S(" + LT.texte(e.f.f.b) + ") = " + ens(d.couches[0]) + ".";
        for (var i = 1; i < d.couches.length; i++) t += " Tour " + i + " : + " + ens(d.couches[i]) + ".";
        if (d.couches.length === 1) t += " Aucun état de S(" + LT.texte(e.f.f.a) + ") n'a de successeur étiqueté : rien à ajouter.";
        return t;
      }
      case "EG": {
        var g = "Cas EG : on restreint à S(" + LT.texte(e.f.f.f) + ") = " + ens(d.Sg) + ". SCC : " +
          (d.sccs.length ? d.sccs.map(function (c) { return ens(c.etats) + (c.nonTriviale ? " non triviale" : " triviale"); }).join(", ") : "aucune") + ".";
        if (!d.noyau.length) return g + " Aucune SCC non triviale : S(EG …) = ∅.";
        g += " On étiquette " + ens(d.noyau);
        for (var j = 1; j < d.couches.length; j++) g += ", puis + " + ens(d.couches[j]);
        return g + " (états qui atteignent la SCC sans quitter le graphe restreint).";
      }
    }
    return "";
  }

  Lecon.demarrer({
    matiere: "model-checking",
    id: "labelling-libre",
    etapes: [

      /* 1 */
      {
        titre: "Choisis un modèle et une formule",
        texte:
          "<p>Écris une formule CTL. Propositions : <span class='mono'>p, q, r</span> pour le système s0, s1, s2 ; " +
          "<span class='mono'>Start, Close, Heat, Error</span> pour le four. " +
          "Symboles : touches ci-dessous, ou au clavier <span class='mono'>! & | -&gt;</span>.</p>",
        objectif: "Valider une formule CTL (et voir sa forme de base).",
        installer: function (zone, api) {
          var rang = el("div", "rangee-btn");
          var res = el("div");
          var boutons = {};
          ["sys", "four"].forEach(function (m) {
            var b = el("button", "btn btn-petit", m === "sys" ? "Système s0, s1, s2" : "Le four");
            b.type = "button";
            b.onclick = function () { choix.m = m; dessinerChoix(); };
            boutons[m] = b; rang.appendChild(b);
          });
          zone.appendChild(rang);
          var cadreFig = el("div");
          zone.appendChild(cadreFig);
          function dessinerChoix() {
            Object.keys(boutons).forEach(function (m) { boutons[m].className = "btn btn-petit" + (m === choix.m ? " btn-plein" : ""); });
            cadreFig.innerHTML = "";
            MC.figure(cadreFig, MODELES[choix.m], {});
          }
          dessinerChoix();
          var c = MC.champFormule(zone, {
            label: "Formule :", valeur: choix.texte, bouton: "Analyser",
            surValider: function (f, texte) {
              var S = MODELES[choix.m], props = S.M.props();
              f = LT.lire(texte, { props: props });
              var inconnues = [];
              (function chercher(g) {
                if (!g) return;
                if (g.op === "ap" && props.indexOf(g.n) < 0 && inconnues.indexOf(g.n) < 0) inconnues.push(g.n);
                chercher(g.f); chercher(g.a); chercher(g.b);
              })(f);
              if (!LT.estCTL(f)) { c.message("Ce n'est pas une formule CTL : chaque X, F, G, U doit être immédiatement précédé de A ou E (et inversement).", false); return; }
              var b;
              try { b = LT.versBase(f); } catch (e) { c.message(e.message, false); return; }
              choix.texte = texte; garder();
              c.message("Formule CTL lue : " + MC.formule(LT.texte(f)) + (inconnues.length ? " — attention, " + inconnues.join(", ") + " n'apparaît dans aucun état (toujours fausse)." : "") +
                "<br>Forme de base : " + MC.formule(LT.texte(b)), true);
              var r = LT.etiqueter(S.M, b);
              res.innerHTML = "<p>" + r.etapes.length + " sous-formules à étiqueter. Résultat : S = <span class='mono'>" + MC.ens(r.S) + "</span> ; " +
                (S.M.init.every(function (s) { return r.S.indexOf(s) >= 0; }) ? "l'état initial la satisfait : M ⊨ f." : "l'état initial ne la satisfait pas : M ⊭ f.") +
                " Continue pour le détail pas à pas.</p>";
              api.valider();
            }
          });
          zone.appendChild(res);
        }
      },

      /* 2 */
      {
        titre: "Pas à pas",
        texte: "<p>Une ligne par sous-formule, des plus petites à la formule entière, comme sur ta copie. " +
          "En couleur : les états étiquetés à cette ligne.</p>",
        objectif: "Aller jusqu'à la dernière ligne.",
        installer: function (zone, api) {
          var c;
          try { c = calcul(); } catch (e) { zone.appendChild(el("p", null, "Reviens à l'étape 1 pour choisir une formule valide.")); return; }
          zone.appendChild(el("p", "mono", "f ≡ " + LT.texte(c.b)));
          var fig = MC.figure(zone, c.S, {});
          var expl = el("div", "encadre");
          var table = el("table", "tableau");
          var ctl = new Controleur(zone, {
            delai: 1400,
            afficher: function (i) {
              var e = c.r.etapes[i], cour = [], est = [];
              if (e.cas === "EG") est = c.S.M.etats.filter(function (s) { return e.detail.Sg.indexOf(s) < 0; });
              fig.maj({ courant: cour, plein: e.S, estompe: est });
              expl.innerHTML = "<span class='titre-encadre mono'>S(" + e.texte + ") = " + MC.ens(e.S) + "</span>" + expliquer(e, c.S);
              table.innerHTML = "<tr><th>sous-formule</th><th>S(…)</th></tr>" + c.r.etapes.slice(0, i + 1).map(function (x, k) {
                return "<tr" + (k === i ? " style='font-weight:600'" : "") + "><td class='mono'>" + x.texte + "</td><td class='mono'>" + MC.ens(x.S) + "</td></tr>";
              }).join("");
            },
            surFin: function () {
              var ok = c.S.M.init.every(function (s) { return c.r.S.indexOf(s) >= 0; });
              api.valider(ok ? "L'état initial est étiqueté : la propriété est vraie." : "L'état initial n'est pas étiqueté : la propriété est fausse.");
            }
          });
          zone.appendChild(expl);
          zone.appendChild(table);
          ctl.charger(c.r.etapes.length);
        }
      },

      /* 3 */
      {
        titre: "À toi : quatre formules d'examen",
        texte: "<p>Pour chaque formule, trouve S(f) sur le modèle affiché. Fais les calculs sur papier, comme à l'examen, puis touche les états.</p>",
        objectif: "Réussir les quatre formules.",
        installer: function (zone, api) {
          var liste = [
            { m: "sys", f: "AX p ∨ AX q", aide: "¬EX¬p ∨ ¬EX¬q (exercice 2 du 13 octobre)." },
            { m: "sys", f: "EX p ∧ EX q", aide: "EX p : prédécesseurs de S(p) = {s0, s2} ; EX q : prédécesseurs de S(q) = {s1, s2} ; puis l'intersection." },
            { m: "four", f: "AF Heat", aide: "¬EG¬Heat : complémentaire de S(EG¬Heat), calculé dans l'atelier du four." },
            { m: "four", f: "E(¬Heat U (Close ∧ Start))", aide: "Pars de S(Close ∧ Start) = {5, 6, 7} et remonte par les états sans Heat." }
          ];
          var k = 0;
          var titre = el("p");
          var boite = el("div");
          zone.appendChild(titre); zone.appendChild(boite);
          function suivante() {
            boite.innerHTML = "";
            if (k >= liste.length) { titre.innerHTML = ""; api.valider("Les quatre sont justes."); return; }
            var q = liste[k], S = MODELES[q.m];
            titre.innerHTML = "<b>" + (k + 1) + " / " + liste.length + "</b> — " + (q.m === "sys" ? "système s0, s1, s2" : "le four") +
              " : <span class='mono'>" + q.f + "</span>";
            var essais = 0;
            MC.marquer(boite, {
              retour: function (t, ok) {
                if (ok === false) { essais++; if (essais >= 1) t += " Indice : " + q.aide; }
                api.retour(t, ok);
              },
              valider: function () {}
            }, {
              sys: S, attendu: LT.satisfait(S.M, LT.lire(q.f)), nom: "S(" + q.f + ")", valider: false,
              surReussite: function () {
                var b = el("button", "btn btn-plein btn-petit", k + 1 < liste.length ? "Formule suivante →" : "Terminer");
                b.type = "button";
                b.onclick = function () { k++; api.retour("", null); suivante(); };
                boite.appendChild(b);
              }
            });
          }
          suivante();
        }
      }
    ],
    fin: {
      texte: "<p>Tu peux revenir à l'étape 1 pour tester d'autres formules : par exemple <span class='mono'>AG(Start → AF Heat)</span> sur le four, " +
        "ou <span class='mono'>EG(¬q ∨ ¬r)</span> sur le système s0, s1, s2.</p>",
      cartes: "labelling"
    }
  });
})();
