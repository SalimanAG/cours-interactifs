/* billet.js — modèle du problème BACKTRACK « Billet endommagé » (examen final).
   Même algorithme que la solution Python (BACKTRACK_billet_endommage.py) :
   compteurs lm/cm (traits manquants) et lv/cv (cases vides), PROPAGER jusqu'au
   point fixe, RECURSIVE dans l'ordre de lecture, arrêt à 2 solutions, pile
   d'annulation pour DÉFAIRE.
   Cases : 1 = trait, 0 = blanc, null = vide (pas encore décidée).
   Indices internes à partir de 0 ; affichage « (ligne, colonne) » à partir de 1. */
(function () {
  "use strict";

  /* Les deux exemples de l'énoncé et celui du document d'indications. */
  var EX1 = { L: 4, C: 5, lignes: ["-***-", "***-*", "*-***", "*****"], l: [3, 1, 1, 2], c: [2, 1, 0, 2, 2] };
  var EX2 = { L: 4, C: 2, lignes: ["**", "**", "**", "**"], l: [1, 0, 0, 1], c: [1, 1] };
  var EX_IND = { L: 2, C: 4, lignes: ["-***", "****"], l: [1, 3], c: [1, 1, 1, 1] };

  function texteEntree(pb) {
    return pb.L + " " + pb.C + "\n" + pb.lignes.join("\n") + "\n" + pb.l.join(" ") + "\n" + pb.c.join(" ");
  }

  /* Lit un texte d'entrée ; renvoie { pb } ou { erreur }. */
  function lireEntree(txt) {
    var d = String(txt || "").trim().split(/\s+/);
    if (d.length < 2) return { erreur: "Il faut au moins « L C » sur la première ligne." };
    var L = parseInt(d[0], 10), C = parseInt(d[1], 10);
    if (!(L >= 1 && L <= 6 && C >= 1 && C <= 6)) return { erreur: "Ici, L et C doivent être entre 1 et 6 (l'énoncé va jusqu'à 20, mais la trace serait illisible)." };
    if (d.length !== 2 + L + L + C) return { erreur: "Attendu : " + L + " lignes de grille, puis " + L + " nombres l, puis " + C + " nombres c." };
    var lignes = d.slice(2, 2 + L);
    for (var i = 0; i < L; i++) {
      if (lignes[i].length !== C || /[^*-]/.test(lignes[i])) return { erreur: "La ligne " + (i + 1) + " de la grille doit faire " + C + " caractères « - » ou « * »." };
    }
    var nb = d.slice(2 + L).map(function (x) { return parseInt(x, 10); });
    if (nb.some(function (x) { return !(x >= 0); })) return { erreur: "Les nombres l et c doivent être des entiers positifs ou nuls." };
    return { pb: { L: L, C: C, lignes: lignes, l: nb.slice(0, L), c: nb.slice(L) } };
  }

  function etat(pb) {
    var e = { L: pb.L, C: pb.C, g: [], lm: [], cm: [], lv: [], cv: [] };
    var i, j;
    for (i = 0; i < pb.L; i++) {
      e.g.push([]);
      for (j = 0; j < pb.C; j++) e.g[i].push(pb.lignes[i][j] === "-" ? 1 : null);
    }
    for (i = 0; i < pb.L; i++) {
      var t = 0, v = 0;
      for (j = 0; j < pb.C; j++) { if (e.g[i][j] === 1) t++; if (e.g[i][j] === null) v++; }
      e.lm.push(pb.l[i] - t); e.lv.push(v);
    }
    for (j = 0; j < pb.C; j++) {
      var t2 = 0, v2 = 0;
      for (i = 0; i < pb.L; i++) { if (e.g[i][j] === 1) t2++; if (e.g[i][j] === null) v2++; }
      e.cm.push(pb.c[j] - t2); e.cv.push(v2);
    }
    return e;
  }

  function cloner(e) {
    return { L: e.L, C: e.C, g: e.g.map(function (l) { return l.slice(); }),
      lm: e.lm.slice(), cm: e.cm.slice(), lv: e.lv.slice(), cv: e.cv.slice() };
  }

  function poser(e, i, j, v, pile) {
    e.g[i][j] = v;
    e.lv[i]--; e.cv[j]--;
    if (v === 1) { e.lm[i]--; e.cm[j]--; }
    if (pile) pile.push([i, j, v]);
  }

  /* opts.sansM : version du document d'indications, qui ne restaure pas lm / cm. */
  function defaire(e, pile, opts) {
    while (pile.length) {
      var x = pile.pop();
      e.g[x[0]][x[1]] = null;
      e.lv[x[0]]++; e.cv[x[1]]++;
      if (x[2] === 1 && !(opts && opts.sansM)) { e.lm[x[0]]++; e.cm[x[1]]++; }
    }
  }

  /* Règle applicable à une ligne / colonne : "contradiction", 0, 1 ou null. */
  function regle(m, v) {
    if (m < 0 || m > v) return "contradiction";
    if (v > 0 && m === 0) return 0;
    if (v > 0 && m === v) return 1;
    return null;
  }

  /* PROPAGER(pile), exactement comme dans le code : passes successives sur
     les lignes puis les colonnes, jusqu'à une passe sans changement.
     journal(evt) reçoit : { type: "pose", i, j, v, sens, k, passe }
     { type: "contradiction", sens, k, passe }, { type: "stable", passe }. */
  function propager(e, pile, journal) {
    var change = true, passe = 0, i, j, r;
    while (change) {
      change = false; passe++;
      for (i = 0; i < e.L; i++) {
        r = regle(e.lm[i], e.lv[i]);
        if (r === "contradiction") { if (journal) journal({ type: "contradiction", sens: "ligne", k: i, passe: passe }); return false; }
        if (r !== null) {
          for (j = 0; j < e.C; j++) if (e.g[i][j] === null) {
            poser(e, i, j, r, pile);
            if (journal) journal({ type: "pose", i: i, j: j, v: r, sens: "ligne", k: i, passe: passe });
          }
          change = true;
        }
      }
      for (j = 0; j < e.C; j++) {
        r = regle(e.cm[j], e.cv[j]);
        if (r === "contradiction") { if (journal) journal({ type: "contradiction", sens: "colonne", k: j, passe: passe }); return false; }
        if (r !== null) {
          for (i = 0; i < e.L; i++) if (e.g[i][j] === null) {
            poser(e, i, j, r, pile);
            if (journal) journal({ type: "pose", i: i, j: j, v: r, sens: "colonne", k: j, passe: passe });
          }
          change = true;
        }
      }
    }
    if (journal) journal({ type: "stable", passe: passe });
    return true;
  }

  /* RÉSOUDRE : renvoie { nb, solution, noeuds }. opts : journal, sansM, maxEvenements. */
  function resoudre(pb, opts) {
    opts = opts || {};
    var e = etat(pb), nb = 0, sol = null, noeuds = 0, J = opts.journal;
    var L = e.L, C = e.C;
    function rec(k) {
      if (nb >= 2) { if (J) J({ type: "arret", e: e }); return; }
      var k0 = k;
      while (k < L * C && e.g[Math.floor(k / C)][k % C] !== null) k++;
      if (J) J({ type: "appel", k0: k0, k: k, e: e });
      if (k === L * C) {
        nb++;
        if (nb === 1) sol = e.g.map(function (l) { return l.slice(); });
        if (J) J({ type: "solution", n: nb, e: e });
        return;
      }
      var i = Math.floor(k / C), j = k % C;
      noeuds++;
      for (var v = 0; v < 2; v++) {
        var pile = [];
        poser(e, i, j, v, pile);
        if (J) J({ type: "choix", i: i, j: j, v: v, e: e });
        var ok = propager(e, pile, J ? function (x) { x.e = e; J(x); } : null);
        if (ok) rec(k + 1);
        var n = pile.length;
        defaire(e, pile, opts);
        if (J) J({ type: "defaire", i: i, j: j, v: v, n: n, e: e });
      }
    }
    var p0 = [];
    if (J) J({ type: "debut", e: e });
    var ok0 = propager(e, p0, J ? function (x) { x.e = e; J(x); } : null);
    if (ok0) rec(0);
    if (J) J({ type: "fin", nb: nb, e: e });
    return { nb: nb, solution: sol, noeuds: noeuds };
  }

  function sortie(pb, opts) {
    var r = resoudre(pb, opts);
    if (r.nb !== 1) return "NON";
    return r.solution.map(function (l) { return l.map(function (x) { return x === 1 ? "-" : "*"; }).join(""); }).join("\n");
  }

  function lc(i, j) { return "(" + (i + 1) + "," + (j + 1) + ")"; }
  function nomLC(sens, k) { return (sens === "ligne" ? "ligne " : "colonne ") + (k + 1); }

  /* Trace pas à pas : une liste d'états prêts à dessiner.
     ligne = { algo: "R" | "P", n } : ligne du pseudo-code (numérotation des slides). */
  function trace(pb, opts) {
    opts = opts || {};
    var etats = [], choix = [], nb = 0, max = opts.max || 600, coupe = false;
    function ajouter(x, msg, algo, n, extra) {
      if (etats.length >= max) { coupe = true; return; }
      var s = { e: cloner(x.e), msg: msg, ligne: algo ? { algo: algo, n: n } : null,
        choix: choix.map(function (c) { return c.slice(); }), nb: nb };
      if (extra) for (var c in extra) s[c] = extra[c];
      etats.push(s);
    }
    var C = pb.C;
    resoudre(pb, {
      sansM: opts.sansM,
      journal: function (x) {
        switch (x.type) {
          case "debut":
            ajouter(x, "Lecture de l'entrée : grille et compteurs initiaux. Puis PROPAGER (déductions initiales).", null, 0);
            break;
          case "pose":
            ajouter(x, "PROPAGER, passe " + x.passe + " : " + nomLC(x.sens, x.k) + " a " + (x.v === 0 ? (x.sens === "ligne" ? "lm" : "cm") + " = 0" : (x.sens === "ligne" ? "lm = lv" : "cm = cv")) +
              " → " + lc(x.i, x.j) + " ← " + x.v + ".", "P", x.sens === "ligne" ? 8 : 10, { cur: [x.i, x.j], ligneActive: x.sens === "ligne" ? x.k : null, colActive: x.sens === "colonne" ? x.k : null });
            break;
          case "contradiction":
            ajouter(x, "PROPAGER : contradiction sur la " + nomLC(x.sens, x.k) + " (" +
              (x.sens === "ligne" ? "lm = " + x.e.lm[x.k] + ", lv = " + x.e.lv[x.k] : "cm = " + x.e.cm[x.k] + ", cv = " + x.e.cv[x.k]) +
              ") → FAUX : on abandonne cette branche.", "P", x.sens === "ligne" ? 5 : 10, { ligneActive: x.sens === "ligne" ? x.k : null, colActive: x.sens === "colonne" ? x.k : null, ko: true });
            break;
          case "stable":
            ajouter(x, "PROPAGER : la passe " + x.passe + " ne change rien, point fixe → VRAI.", "P", 11);
            break;
          case "appel":
            ajouter(x, "RECURSIVE(" + x.k0 + ") : " + (x.k === pb.L * C ? "plus aucune case vide (k = L·C = " + x.k + ")." :
              (x.k > x.k0 ? "on saute les cases déjà décidées, k = " + x.k + " : case " : "case vide k = " + x.k + " : ") + lc(Math.floor(x.k / C), x.k % C) + "."),
              "R", 2, x.k < pb.L * C ? { cur: [Math.floor(x.k / C), x.k % C] } : null);
            break;
          case "solution":
            nb = x.n;
            ajouter(x, "Solution n° " + x.n + (x.n === 1 ? " : on la copie." : " : la solution n'est pas unique."), "R", x.n === 1 ? 5 : 4, { sol: true });
            break;
          case "arret":
            ajouter(x, "RECURSIVE : nb_sol ≥ 2, on ne cherche plus.", "R", 1);
            break;
          case "choix":
            choix.push([x.i, x.j, x.v]);
            ajouter(x, "Choix : " + lc(x.i, x.j) + " ← " + x.v + (x.v === 0 ? " (premier essai)." : " (second essai)."), "R", 9, { cur: [x.i, x.j] });
            break;
          case "defaire":
            choix.pop();
            ajouter(x, "DÉFAIRE : " + x.n + " case" + (x.n > 1 ? "s" : "") + " remise" + (x.n > 1 ? "s" : "") + " à vide depuis le choix " + lc(x.i, x.j) + " ← " + x.v +
              (opts.sansM ? " (lm et cm NON restaurés, comme dans les indications)." : ", compteurs rétablis."), "R", 11, { cur: [x.i, x.j] });
            break;
          case "fin":
            ajouter(x, "Fin : nb_sol = " + x.nb + " → sortie " + (x.nb === 1 ? "la grille." : "NON."), null, 0, { fin: true });
            break;
        }
      }
    });
    return { etats: etats, coupe: coupe };
  }

  /* Ce qu'il faut passer à GrilleComptee.dessiner pour un état e. */
  function vue(e, o) {
    o = o || {};
    var classes = {};
    var valeurs = e.g.map(function (l, i) {
      return l.map(function (x, j) {
        if (x === 1) classes[i + "," + j] = "plein";
        else if (x === 0) classes[i + "," + j] = "pale";
        return x === null ? null : x;
      });
    });
    (o.marques || []).forEach(function (p) { classes[p[0] + "," + p[1]] = (classes[p[0] + "," + p[1]] ? classes[p[0] + "," + p[1]] + " " : "") + "courante"; });
    if (o.cur) classes[o.cur[0] + "," + o.cur[1]] = (classes[o.cur[0] + "," + o.cur[1]] ? classes[o.cur[0] + "," + o.cur[1]] + " " : "") + "courante";
    var dc = {}, bc = {};
    if (o.ligneActive !== null && o.ligneActive !== undefined) dc[o.ligneActive] = "courante";
    if (o.colActive !== null && o.colActive !== undefined) bc[o.colActive] = "courante";
    var res = { classes: classes };
    if (!o.sansCompteurs) {
      var cache = o.masquer || {};
      res.droite = { titres: o.avecTotaux === false ? ["lm", "lv"] : ["l", "lm", "lv"], classes: dc,
        valeurs: e.lm.map(function (m, i) {
          var r = [cache.lm ? "?" : m, cache.lv ? "?" : e.lv[i]];
          if (o.avecTotaux !== false) r.unshift(o.pb ? o.pb.l[i] : "");
          return r;
        }) };
      var rangs = [cache.cm ? e.cm.map(function () { return "?"; }) : e.cm, cache.cv ? e.cv.map(function () { return "?"; }) : e.cv];
      if (o.avecTotaux !== false) rangs.unshift(o.pb ? o.pb.c : e.cm.map(function () { return ""; }));
      res.bas = { titres: o.avecTotaux === false ? ["cm", "cv"] : ["c", "cm", "cv"], classes: bc, valeurs: rangs };
    }
    return { valeurs: valeurs, options: res };
  }

  /* Grille aléatoire L × C. type : "unique" | "plusieurs" | "aucune" | null (au hasard).
     Renvoie un problème dont la trace reste courte. */
  function aleatoire(L, C, type) {
    for (var essai = 0; essai < 400; essai++) {
      var sol = [], i, j;
      for (i = 0; i < L; i++) { sol.push([]); for (j = 0; j < C; j++) sol[i].push(Math.random() < 0.45 ? 1 : 0); }
      var lignes = sol.map(function (l) { return l.map(function (x) { return x === 1 && Math.random() < 0.3 ? "-" : "*"; }).join(""); });
      var l = sol.map(function (r) { return r.reduce(function (a, b) { return a + b; }, 0); });
      var c = [];
      for (j = 0; j < C; j++) { var s = 0; for (i = 0; i < L; i++) s += sol[i][j]; c.push(s); }
      if (type === "aucune") {
        var a = Math.floor(Math.random() * C);
        c[a] = c[a] + (c[a] < L ? 1 : -1);
      }
      var pb = { L: L, C: C, lignes: lignes, l: l, c: c };
      var r = resoudre(pb);
      var t = r.nb === 0 ? "aucune" : r.nb === 1 ? "unique" : "plusieurs";
      if (type && t !== type) continue;
      if (r.noeuds < 1 && type !== "aucune" && Math.random() < 0.7) continue;   // on préfère au moins un choix
      if (trace(pb, { max: 120 }).coupe) continue;
      return pb;
    }
    return EX2;
  }

  window.Billet = {
    EX1: EX1, EX2: EX2, EX_IND: EX_IND,
    texteEntree: texteEntree, lireEntree: lireEntree,
    etat: etat, cloner: cloner, poser: poser, defaire: defaire, regle: regle,
    propager: propager, resoudre: resoudre, sortie: sortie, trace: trace, vue: vue,
    aleatoire: aleatoire, lc: lc,
    /* Pseudo-code des slides, ligne pour ligne avec le code Python. */
    RECURSIVE: [
      "si nb_sol ≥ 2 alors retourner",
      "tant que k < L·C et case(k) ≠ VIDE faire k ← k + 1",
      "si k = L·C alors",
      "    nb_sol ← nb_sol + 1",
      "    si nb_sol = 1 alors solution ← copie(grille)",
      "    retourner",
      "(i, j) ← (k div C, k mod C)",
      "pour v dans (0, 1) faire",
      "    pile ← ∅ ; POSER(i, j, v, pile)",
      "    si PROPAGER(pile) alors RECURSIVE(k + 1)",
      "    DÉFAIRE(pile)"
    ],
    PROPAGER: [
      "changé ← vrai",
      "tant que changé faire",
      "    changé ← faux",
      "    pour i ← 1 à L faire",
      "        si lm[i] < 0 ou lm[i] > lv[i] alors retourner FAUX",
      "        si lv[i] > 0 et (lm[i] = 0 ou lm[i] = lv[i]) alors",
      "            v ← 0 si lm[i] = 0, sinon 1",
      "            POSER(i, j, v, pile) pour chaque case vide (i, j)",
      "            changé ← vrai",
      "    même boucle sur les colonnes j, avec cm[j] et cv[j]",
      "retourner VRAI"
    ]
  };
})();
