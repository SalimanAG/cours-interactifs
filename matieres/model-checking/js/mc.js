/* mc.js — modèles et petits outils propres à Model Checking for AI.
   Dépend de : navigation.js (Site.el), kripke.js, logique-temporelle.js.

   MC.SYS   : le système s0, s1, s2 des exercices faits en cours le 13 octobre
              (s0 initial ; s0 → s1, s0 → s2, s2 → s0, s2 → s1, s1 → s1 ;
               L(s0) = {p, r}, L(s1) = {q, r}, L(s2) = {p, q}).
   MC.FOUR  : le four des slides (p. 25), états 1 à 7, propositions Start, Close, Heat, Error.

   MC.figure(conteneur, sys, { onEtat, plein: [...], courant: [...], estompe: [...],
                               transitions: { "s0→s1": "courante" }, sansSous: bool })
       → { fig, maj(o) }   (maj redessine avec de nouvelles classes)
   MC.marquer(zone, api, { sys, attendu: [...], consigne, bravo, valider: true, avant: [...] })
       Exercice : toucher les états d'un ensemble S(f), puis « Vérifier ».
       Renvoie { reinitialiser() }.
   MC.ens(liste) → "{s0, s2}" ; MC.formule(texte) → HTML en police à chasse fixe. */
(function () {
  "use strict";
  var el = Site.el;

  function sys(def) {
    var M = LT.modele(def);
    return { M: M, pos: def.pos, largeur: def.largeur, hauteur: def.hauteur, nom: def.nom, sous: def.sous };
  }

  var SYS = sys({
    nom: "le système s0, s1, s2",
    etats: ["s0", "s1", "s2"], init: ["s0"],
    R: [["s0", "s1"], ["s0", "s2"], ["s2", "s0"], ["s2", "s1"], ["s1", "s1"]],
    L: { s0: ["p", "r"], s1: ["q", "r"], s2: ["p", "q"] },
    pos: { s0: { x: 70, y: 52, sousDessus: true }, s1: { x: 250, y: 52, boucle: 0, sousDessus: true },
           s2: { x: 160, y: 140, boucle: 90, sousPos: { dx: 22, dy: 4, ancre: "start" } } },
    largeur: 320, hauteur: 185,
    sous: function (s, M) { return "{" + M.L[s].join(", ") + "}"; }
  });

  var FOUR = sys({
    nom: "le four",
    etats: ["1", "2", "3", "4", "5", "6", "7"], init: ["1"],
    R: [["1", "2"], ["1", "3"], ["3", "1"], ["4", "1"], ["4", "4"], ["2", "5"], ["5", "2"], ["5", "3"],
        ["3", "6"], ["6", "7"], ["7", "4"], ["4", "3"]],
    L: { "1": [], "2": ["Start", "Error"], "3": ["Close"], "4": ["Close", "Heat"],
         "5": ["Start", "Close", "Error"], "6": ["Start", "Close"], "7": ["Start", "Close", "Heat"] },
    pos: { "1": { x: 200, y: 30, sousPos: { dx: 22, dy: 4, ancre: "start" } },
           "2": { x: 100, y: 115, sousPos: { dx: -22, dy: 4, ancre: "end" } },
           "3": { x: 200, y: 115, sousPos: { dx: 20, dy: 26, ancre: "start" } },
           "4": { x: 300, y: 115, boucle: -60, sousPos: { dx: 22, dy: 12, ancre: "start" } },
           "5": { x: 100, y: 215, sousPos: { dx: -22, dy: 4, ancre: "end" } },
           "6": { x: 200, y: 215 }, "7": { x: 300, y: 215 } },
    largeur: 360, hauteur: 268,
    sous: function (s, M) { return M.L[s].length ? M.L[s].join("\n") : "∅"; }
  });

  /* MC.EQ : le système de l'exercice d'équité (cours du 3 novembre ; sujet d'une année précédente) :
     s0 ⇄ s1 ⇄ s2, s0 initial, L(s0) = {q, r}, L(s1) = {p, q}, L(s2) = {p, r}. */
  var EQ = sys({
    nom: "le système de l'exercice d'équité",
    etats: ["s0", "s1", "s2"], init: ["s0"],
    R: [["s0", "s1"], ["s1", "s0"], ["s1", "s2"], ["s2", "s1"]],
    L: { s0: ["q", "r"], s1: ["p", "q"], s2: ["p", "r"] },
    pos: { s0: { x: 70, y: 45 }, s1: { x: 180, y: 45 }, s2: { x: 290, y: 45 } },
    largeur: 360, hauteur: 95,
    sous: function (s, M) { return "{" + M.L[s].join(", ") + "}"; }
  });

  /* MC.MUTEX : l'exclusion mutuelle en SPL (slides 23-24). États (turn, pc0, pc1), numérotés 1 à 14 ;
     propositions : CR0, CR1. Transitions construites par entrelacement (un processus avance à la fois). */
  var MUTEX = (function () {
    var noms = [
      ["1", "0", "⊥", "⊥"], ["2", "0", "ℓ0", "ℓ1"], ["3", "0", "ℓ0", "NC1"], ["4", "0", "NC0", "ℓ1"], ["5", "0", "NC0", "NC1"], ["6", "0", "CR0", "ℓ1"], ["7", "0", "CR0", "NC1"],
      ["8", "1", "⊥", "⊥"], ["9", "1", "ℓ0", "ℓ1"], ["10", "1", "NC0", "ℓ1"], ["11", "1", "ℓ0", "NC1"], ["12", "1", "NC0", "NC1"], ["13", "1", "ℓ0", "CR1"], ["14", "1", "NC0", "CR1"]
    ];
    var parTriplet = {}, info = {};
    noms.forEach(function (n) { parTriplet[n[1] + "|" + n[2] + "|" + n[3]] = n[0]; info[n[0]] = { turn: n[1], pc0: n[2], pc1: n[3] }; });
    function avance(t, a, b, proc) { // renvoie [t, a, b] après un pas du processus proc
      if (a === "⊥") return [t, "ℓ0", "ℓ1"];
      if (proc === 0) {
        if (a === "ℓ0") return [t, "NC0", b];
        if (a === "NC0") return t === "0" ? [t, "CR0", b] : [t, a, b];
        return ["1", "ℓ0", b];
      }
      if (b === "ℓ1") return [t, a, "NC1"];
      if (b === "NC1") return t === "1" ? [t, a, "CR1"] : [t, a, b];
      return ["0", a, "ℓ1"];
    }
    var R = [], L = {};
    noms.forEach(function (n) {
      var id = n[0];
      L[id] = [n[2], n[3]].filter(function (x) { return x === "CR0" || x === "CR1"; });
      [0, 1].forEach(function (p) {
        var s = avance(n[1], n[2], n[3], p), cible = parTriplet[s.join("|")];
        if (cible) R.push([id, cible]);
      });
    });
    var S = sys({
      nom: "l'exclusion mutuelle", etats: noms.map(function (n) { return n[0]; }), init: ["1", "8"], R: R, L: L,
      pos: {
        "1": { x: 90, y: 30 }, "2": { x: 90, y: 82 }, "3": { x: 38, y: 135, boucle: 180 }, "4": { x: 132, y: 135 },
        "5": { x: 62, y: 192, boucle: 180 }, "6": { x: 150, y: 192 }, "7": { x: 98, y: 248, boucle: 135 },
        "8": { x: 270, y: 30 }, "9": { x: 270, y: 82 }, "11": { x: 228, y: 135 }, "10": { x: 322, y: 135, boucle: 0 },
        "13": { x: 210, y: 192 }, "12": { x: 298, y: 192, boucle: 0 }, "14": { x: 262, y: 248, boucle: 45 }
      },
      largeur: 360, hauteur: 285,
      sous: function (s) { var i = info[s]; return i.pc0 + " " + i.pc1; }
    });
    S.info = info;
    /* Tableau numéro → (turn, pc0, pc1), en deux colonnes (turn = 0 | turn = 1). */
    S.tableau = function (conteneur) {
      var t = document.createElement("table");
      t.className = "tableau";
      var h = "<tr><th class='num'>n°</th><th>turn = 0</th><th class='num'>n°</th><th>turn = 1</th></tr>";
      for (var i = 1; i <= 7; i++) {
        var a = info[String(i)], b = info[String(i + 7)];
        h += "<tr><td class='num'>" + i + "</td><td class='mono'>(0, " + a.pc0 + ", " + a.pc1 + ")</td><td class='num'>" + (i + 7) +
             "</td><td class='mono'>(1, " + b.pc0 + ", " + b.pc1 + ")</td></tr>";
      }
      t.innerHTML = h;
      conteneur.appendChild(t);
      return t;
    };
    S.avance = avance;
    S.parTriplet = parTriplet;
    return S;
  })();

  function ens(l) { return l.length ? "{" + l.join(", ") + "}" : "∅"; }
  function formule(t) { return "<span class='mono'>" + t + "</span>"; }

  function figure(conteneur, S, o) {
    o = o || {};
    var cadre = el("div", "cadre-figure");
    conteneur.appendChild(cadre);
    var fig = new FigureKripke(cadre, { largeur: S.largeur, hauteur: S.hauteur, titre: S.nom, onEtat: o.onEtat });
    function maj(n) {
      n = n || {};
      var plein = n.plein || [], courant = n.courant || [], estompe = n.estompe || [];
      var trc = n.transitions || {};
      fig.dessiner({
        etats: S.M.etats.map(function (s) {
          var p = S.pos[s];
          var c = courant.indexOf(s) >= 0 ? "courant" : plein.indexOf(s) >= 0 ? "plein" : estompe.indexOf(s) >= 0 ? "estompe" : "";
          return { id: s, x: p.x, y: p.y, classe: c, boucle: p.boucle, sousDessus: p.sousDessus, sousPos: p.sousPos,
                   sous: n.sansSous ? null : S.sous(s, S.M), initial: S.M.init.indexOf(s) >= 0 ? 180 : null };
        }),
        transitions: [].concat.apply([], S.M.etats.map(function (s) {
          return S.M.succ[s].map(function (t) {
            var k = s + "→" + t;
            var cl = trc[k] || ((estompe.indexOf(s) >= 0 || estompe.indexOf(t) >= 0) ? "estompee" : "");
            return { de: s, vers: t, classe: cl };
          });
        }))
      });
    }
    maj(o);
    return { fig: fig, maj: maj, cadre: cadre };
  }

  function marquer(zone, api, o) {
    var S = o.sys, choisis = {}, fini = false;
    if (o.consigne) zone.appendChild(el("p", null, o.consigne));
    var f = figure(zone, S, {
      onEtat: function (id) {
        if (fini) return;
        choisis[id] = !choisis[id];
        dessiner();
        api.retour("", null);
      }
    });
    var info = el("p", "legende-figure");
    zone.appendChild(info);
    function liste() { return S.M.etats.filter(function (s) { return choisis[s]; }); }
    function dessiner() {
      var l = liste();
      f.maj({ plein: l, estompe: o.estompe || [], courant: [], transitions: o.transitions, sansSous: o.sansSous });
      info.innerHTML = "<span>" + (o.nom || "Ta sélection") + " = <span class='mono'>" + ens(l) + "</span></span>";
    }
    var rang = el("div", "rangee-btn");
    var b = el("button", "btn btn-plein btn-petit", "Vérifier");
    b.type = "button";
    rang.appendChild(b);
    zone.appendChild(rang);
    b.onclick = function () {
      var l = liste();
      var att = o.attendu;
      var manque = att.filter(function (s) { return l.indexOf(s) < 0; });
      var trop = l.filter(function (s) { return att.indexOf(s) < 0; });
      if (!manque.length && !trop.length) {
        fini = true;
        api.retour(o.bravo || ("Exact : " + ens(att) + "."), true);
        if (o.valider !== false) api.valider(o.message);
        if (o.surReussite) o.surReussite();
      } else {
        var m = [];
        if (trop.length) m.push(trop.length + " état" + (trop.length > 1 ? "s" : "") + " en trop");
        if (manque.length) m.push(manque.length + " état" + (manque.length > 1 ? "s" : "") + " manquant" + (manque.length > 1 ? "s" : ""));
        var ind = o.indice ? (typeof o.indice === "function" ? o.indice(trop, manque) : o.indice) : "";
        api.retour("Pas encore : " + m.join(", ") + ". " + ind, false);
      }
    };
    dessiner();
    return {
      reinitialiser: function () { choisis = {}; fini = false; dessiner(); },
      figure: f
    };
  }

  /* MC.marquerPositions(zone, api, { sys, chemin: { etats, boucle }, attendu: [positions], nom, indice })
     Exercice : toucher les positions i du chemin où π^i ⊨ f. */
  function marquerPositions(zone, api, o) {
    var S = o.sys, choisis = {}, fini = false;
    var sous = {};
    S.M.etats.forEach(function (s) { sous[s] = S.sous(s, S.M).replace(/\n/g, ", "); });
    var vue = new VueChemin(zone, {
      onPosition: function (i) { if (fini) return; choisis[i] = !choisis[i]; dessiner(); api.retour("", null); }
    });
    var info = el("p", "legende-figure");
    zone.appendChild(info);
    function liste() { return o.chemin.etats.map(function (s, i) { return i; }).filter(function (i) { return choisis[i]; }); }
    function dessiner() {
      var cl = {};
      liste().forEach(function (i) { cl[i] = "plein"; });
      vue.dessiner({ etats: o.chemin.etats, boucle: o.chemin.boucle, sous: sous, classes: cl });
      info.innerHTML = "<span>" + (o.nom || "positions choisies") + " : <span class='mono'>" + (liste().join(", ") || "aucune") + "</span></span>";
    }
    var b = el("button", "btn btn-plein btn-petit", "Vérifier");
    b.type = "button";
    var rang = el("div", "rangee-btn"); rang.appendChild(b); zone.appendChild(rang);
    b.onclick = function () {
      var l = liste(), att = o.attendu;
      var manque = att.filter(function (i) { return l.indexOf(i) < 0; });
      var trop = l.filter(function (i) { return att.indexOf(i) < 0; });
      if (!manque.length && !trop.length) {
        fini = true;
        api.retour(o.bravo || "Exact.", true);
        api.valider(o.message);
      } else {
        var m = [];
        if (trop.length) m.push("position" + (trop.length > 1 ? "s " : " ") + trop.join(", ") + " : faux à cet endroit");
        if (manque.length) m.push(manque.length + " position" + (manque.length > 1 ? "s" : "") + " oubliée" + (manque.length > 1 ? "s" : ""));
        api.retour(m.join(" ; ") + ". " + (o.indice || ""), false);
      }
    };
    dessiner();
  }

  /* MC.constructeurChemin(zone, { sys, depart, surChange(chemin), surFerme(chemin) })
     On touche un successeur du dernier état pour prolonger le chemin. Toucher un état
     déjà présent dans le chemin ferme la boucle : π repasse alors indéfiniment par
     le même cycle (chemin infini en « lasso »). */
  function constructeurChemin(zone, o) {
    var S = o.sys, ch = { etats: [o.depart], boucle: null };
    var sous = {};
    S.M.etats.forEach(function (s) { sous[s] = S.sous(s, S.M).replace(/\n/g, ", "); });
    var f = figure(zone, S, { onEtat: toucher });
    var vue = new VueChemin(zone, {});
    var rang = el("div", "rangee-btn");
    var raz = el("button", "btn btn-petit", "Recommencer");
    raz.type = "button";
    raz.onclick = function () { ch = { etats: [o.depart], boucle: null }; dessiner(); if (o.surChange) o.surChange(ch); };
    rang.appendChild(raz); zone.appendChild(rang);
    function dernier() { return ch.etats[ch.etats.length - 1]; }
    function toucher(id) {
      if (ch.boucle != null) { if (o.surRefus) o.surRefus("Le chemin est déjà infini (boucle fermée). « Recommencer » pour en construire un autre."); return; }
      var d = dernier();
      if (S.M.succ[d].indexOf(id) < 0) {
        if (o.surRefus) o.surRefus("Pas de flèche " + d + " → " + id + " : un chemin suit les transitions de R.");
        return;
      }
      var j = ch.etats.indexOf(id);
      if (j >= 0) ch.boucle = j; else ch.etats.push(id);
      dessiner();
      if (o.surChange) o.surChange(ch);
      if (ch.boucle != null && o.surFerme) o.surFerme(ch);
    }
    function dessiner() {
      var trc = {};
      for (var i = 0; i + 1 < ch.etats.length; i++) trc[ch.etats[i] + "→" + ch.etats[i + 1]] = "chemin";
      if (ch.boucle != null) trc[dernier() + "→" + ch.etats[ch.boucle]] = "chemin";
      f.maj({ courant: ch.boucle == null ? [dernier()] : [], plein: [], transitions: trc });
      vue.dessiner({ etats: ch.etats, boucle: ch.boucle, sous: sous });
    }
    dessiner();
    return { chemin: function () { return ch; } };
  }

  /* MC.champFormule(zone, { label, props, valeur, surValider(f, texte), bouton }) : champ de saisie
     d'une formule, avec des touches pour les symboles (utile sur téléphone). surValider reçoit la
     formule lue (ou lève l'erreur de lecture, affichée sous le champ). Renvoie { champ, message(t, ok) }. */
  function champFormule(zone, o) {
    var bloc = el("div", "saisie saisie-bloc");
    if (o.label) bloc.appendChild(el("label", "petit discret", o.label));
    var champ = el("input", "mono");
    champ.type = "text"; champ.value = o.valeur || "";
    champ.setAttribute("autocapitalize", "off"); champ.setAttribute("autocorrect", "off"); champ.setAttribute("spellcheck", "false");
    champ.placeholder = o.exemple || "ex. AG(p → AF q)";
    bloc.appendChild(champ);
    var touches = el("div", "rangee-btn");
    ["¬", "∧", "∨", "→", "(", ")", "E", "A", "X", "F", "G", "U", "true"].forEach(function (t) {
      var b = el("button", "btn btn-petit mono", t);
      b.type = "button";
      b.onclick = function () {
        var d = champ.selectionStart != null ? champ.selectionStart : champ.value.length;
        var f = champ.selectionEnd != null ? champ.selectionEnd : d;
        var ins = (t === "U" || t === "∧" || t === "∨" || t === "→") ? " " + t + " " : t;
        champ.value = champ.value.slice(0, d) + ins + champ.value.slice(f);
        champ.focus();
        var c = d + ins.length;
        try { champ.setSelectionRange(c, c); } catch (e) { /* rien */ }
      };
      touches.appendChild(b);
    });
    var effacer = el("button", "btn btn-petit", "⌫");
    effacer.type = "button";
    effacer.onclick = function () { champ.value = champ.value.replace(/\s*\S\s*$/, ""); champ.focus(); };
    touches.appendChild(effacer);
    bloc.appendChild(touches);
    var ok = el("button", "btn btn-plein btn-petit", o.bouton || "Valider");
    ok.type = "button";
    bloc.appendChild(ok);
    var msg = el("div", "retour");
    zone.appendChild(bloc);
    zone.appendChild(msg);
    function message(t, bon) { msg.className = "retour" + (bon === true ? " ok" : bon === false ? " ko" : ""); msg.innerHTML = t || ""; }
    function valider() {
      var f;
      try { f = LT.lire(champ.value, { props: o.props }); }
      catch (e) { message(e.lt ? e.message : "Formule illisible.", false); return; }
      message("", null);
      o.surValider(f, champ.value);
    }
    ok.onclick = valider;
    champ.addEventListener("keydown", function (e) { if (e.key === "Enter") valider(); });
    return { champ: champ, message: message, bouton: ok };
  }

  /* MC.melanger(o) : mélange (de façon stable, selon le texte de la question) les options d'un
     Exercices.choix — o.options, o.expliquer, o.bonne — pour que la bonne réponse ne soit pas toujours la première. */
  function permutation(n, graine) {
    var h = 0, i;
    for (i = 0; i < graine.length; i++) h = (h * 31 + graine.charCodeAt(i)) >>> 0;
    var idx = []; for (i = 0; i < n; i++) idx.push(i);
    for (i = n - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; var j = (h >>> 16) % (i + 1); var t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    return idx;
  }
  function melanger(o) {
    var perm = permutation(o.options.length, (o.question || "") + o.options.join("|"));
    var r = {};
    for (var k in o) r[k] = o[k];
    r.options = perm.map(function (i) { return o.options[i]; });
    if (o.expliquer) r.expliquer = perm.map(function (i) { return o.expliquer[i]; });
    r.bonne = perm.indexOf(o.bonne);
    return r;
  }

  window.MC = { SYS: SYS, FOUR: FOUR, EQ: EQ, MUTEX: MUTEX, melanger: melanger, figure: figure, marquer: marquer, marquerPositions: marquerPositions,
                constructeurChemin: constructeurChemin, champFormule: champFormule, ens: ens, formule: formule };
})();
