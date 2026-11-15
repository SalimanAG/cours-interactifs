/* logique-temporelle.js — formules de CTL* / CTL / LTL : lecture, écriture,
   évaluation sur un chemin, algorithme de labelling CTL (avec ou sans
   contraintes d'équité), et until borné de PCTL. Aucune interface ici
   (voir kripke.js pour les figures).

   Notations acceptées (clavier ou symboles) :
     ¬ ! ~   ∧ & /\   ∨ | \/   → -> =>   ( )   true false (vrai faux)
     A E X F G (préfixes, collés ou non : AG p, AGEF p, EX¬p)   U (infixe : E(p U q))
   Les propositions atomiques sont les autres mots (p, q, Start, CR0…).

   LT.lire(texte, { props: ["p", "q"] }) → formule (arbre) ; lève une Error lisible.
       Avec props, « EFp » est compris comme EF p.
   LT.texte(f)          → chaîne dans la notation du cours (EX¬p, E(p U q), AGEF p…)
   LT.versBase(f)       → formule équivalente avec seulement p, true, ¬, ∧, ∨, EX, EU, EG
                          (règles : EF f ≡ E(true U f), AG f ≡ ¬EF¬f, AF f ≡ ¬EG¬f, AX f ≡ ¬EX¬f,
                           ¬(a → b) ≡ a ∧ ¬b, ¬¬f ≡ f). A(f U g) n'est pas réécrit (absent du cours).
   LT.estCTL(f), LT.estLTL(f), LT.estBase(f)

   Structures de Kripke :
   LT.modele({ etats: ["s0", …], init: ["s0"], R: [["s0", "s1"], …], L: { s0: ["p", "r"], … } })
       → M avec M.succ[s], M.pred[s] ; M.totale() → liste des états sans successeur.
   LT.etiqueter(M, f, { equite: [["6", "7"]] })   f doit être dans la base (sinon versBase d'abord)
       → { S: [états satisfaisant f], etapes: [{ f, texte, S, cas, detail }] }
         (une étape par sous-formule, des plus petites à la formule entière)
         cas : "ap", "const", "non", "et", "ou", "EX", "EU", "EG", "fair"
         detail EX : { cible }  EU : { couches: [[…], […], …] }
         detail EG : { Sg, sccs: [{ etats, nonTriviale, equitable }], noyau, couches }
   LT.satisfait(M, f, opts) → états satisfaisant f (réécrit en base si besoin)
   LT.sccs(etats, succ) → composantes fortement connexes (Tarjan), chacune triée

   Chemins (lasso : π = etats[0] etats[1] … puis retour en position boucle) :
   LT.surChemin(M, { etats, boucle }, f) → tableau de booléens : π^i ⊨ f pour chaque position i
       (les sous-formules d'état A…/E… sont évaluées par labelling)

   PCTL (slides 30-31) :
   LT.jusquaBorne({ etats, P: { s: { s2: proba } }, L }, f1, f2, t)
       f1, f2 : nom de proposition ou fonction(état) → booléen
       → tableau de t + 1 lignes : P[i][s], calculé exactement comme l'algorithme du cours */
(function () {
  "use strict";

  var OPS_TEMP = { A: 1, E: 1, X: 1, F: 1, G: 1 };

  /* ---------------- Lecture ---------------- */
  function erreur(msg) { var e = new Error(msg); e.lt = true; return e; }

  function decouper(texte, props) {
    var t = [], i = 0, s = String(texte);
    var connus = {};
    (props || []).forEach(function (p) { connus[p] = true; });
    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      var deux = s.substr(i, 2), trois = s.substr(i, 3);
      if (c === "(" || c === ")") { t.push({ k: c }); i++; continue; }
      if (c === "¬" || c === "!" || c === "~") { t.push({ k: "non" }); i++; continue; }
      if (c === "∧" || c === "&") { t.push({ k: "et" }); i += (deux === "&&" ? 2 : 1); continue; }
      if (deux === "/\\") { t.push({ k: "et" }); i += 2; continue; }
      if (c === "∨" || c === "|") { t.push({ k: "ou" }); i += (deux === "||" ? 2 : 1); continue; }
      if (deux === "\\/") { t.push({ k: "ou" }); i += 2; continue; }
      if (c === "→" || c === "⇒") { t.push({ k: "imp" }); i++; continue; }
      if (deux === "->" || deux === "=>") { t.push({ k: "imp" }); i += 2; continue; }
      if (trois === "-->") { t.push({ k: "imp" }); i += 3; continue; }
      var m = /^[A-Za-z_][A-Za-z0-9_']*/.exec(s.slice(i));
      if (m) {
        var w = m[0];
        i += w.length;
        if (w === "U") { t.push({ k: "U" }); continue; }
        if (w === "true" || w === "vrai" || w === "True" || w === "TRUE") { t.push({ k: "cst", v: true }); continue; }
        if (w === "false" || w === "faux" || w === "False" || w === "FALSE") { t.push({ k: "cst", v: false }); continue; }
        if (!connus[w] && /^[AEXFG]+$/.test(w)) { w.split("").forEach(function (o) { t.push({ k: "op", v: o }); }); continue; }
        if (!connus[w] && props) {
          var mm = /^([AEXFG]+)(.+)$/.exec(w);
          if (mm && (connus[mm[2]] || mm[2] === "true" || mm[2] === "false")) {
            mm[1].split("").forEach(function (o) { t.push({ k: "op", v: o }); });
            if (mm[2] === "true" || mm[2] === "false") t.push({ k: "cst", v: mm[2] === "true" });
            else t.push({ k: "ap", v: mm[2] });
            continue;
          }
        }
        t.push({ k: "ap", v: w });
        continue;
      }
      throw erreur("Caractère inattendu : « " + c + " » (position " + (i + 1) + ").");
    }
    return t;
  }

  function lire(texte, opts) {
    var toks = decouper(texte, opts && opts.props), p = 0;
    if (!toks.length) throw erreur("La formule est vide.");
    function voir() { return toks[p]; }
    function prendre(k) { var x = toks[p]; if (!x || x.k !== k) return null; p++; return x; }
    function imp() {
      var a = unt();
      if (prendre("imp")) return { op: "imp", a: a, b: imp() };
      return a;
    }
    function unt() {
      var a = ou();
      if (prendre("U")) return { op: "U", a: a, b: ou() };
      return a;
    }
    function ou() {
      var a = et();
      while (prendre("ou")) a = { op: "ou", a: a, b: et() };
      return a;
    }
    function et() {
      var a = un();
      while (prendre("et")) a = { op: "et", a: a, b: un() };
      return a;
    }
    function un() {
      var x = voir();
      if (!x) throw erreur("La formule s'arrête trop tôt : il manque un opérande.");
      if (x.k === "non") { p++; return { op: "non", f: un() }; }
      if (x.k === "op") { p++; return { op: x.v, f: un() }; }
      return atome();
    }
    function atome() {
      var x = voir();
      if (!x) throw erreur("La formule s'arrête trop tôt.");
      if (x.k === "(") {
        p++;
        var f = imp();
        if (!prendre(")")) throw erreur("Il manque une parenthèse fermante « ) ».");
        return f;
      }
      if (x.k === "ap") { p++; return { op: "ap", n: x.v }; }
      if (x.k === "cst") { p++; return { op: x.v ? "vrai" : "faux" }; }
      if (x.k === ")") throw erreur("Parenthèse « ) » en trop, ou opérande manquant avant.");
      if (x.k === "U") throw erreur("« U » doit avoir une formule de chaque côté, par exemple E(p U q).");
      throw erreur("Opérande manquant avant « " + ({ et: "∧", ou: "∨", imp: "→" })[x.k] + " ».");
    }
    var f = imp();
    if (p < toks.length) {
      var r = toks[p];
      throw erreur(r.k === ")" ? "Parenthèse « ) » en trop." : "Je ne comprends pas la suite de la formule (à partir du symbole n° " + (p + 1) + ").");
    }
    return f;
  }

  /* ---------------- Écriture ---------------- */
  var PREC = { imp: 1, U: 2, ou: 3, et: 4 };
  function prec(f) {
    if (PREC[f.op]) return PREC[f.op];
    return 5;
  }
  function estUnaire(f) { return f.op === "non" || OPS_TEMP[f.op]; }
  function texte(f) {
    switch (f.op) {
      case "ap": return f.n;
      case "vrai": return "true";
      case "faux": return "false";
      case "non":
        return "¬" + (prec(f.f) < 5 ? "(" + texte(f.f) + ")" : texte(f.f));
      case "et": case "ou": case "imp": case "U": {
        var sym = { et: " ∧ ", ou: " ∨ ", imp: " → ", U: " U " }[f.op];
        // Une sous-formule binaire est parenthésée, sauf si c'est le même ∧ / ∨ (associatif).
        function g(x) {
          var bin = prec(x) < 5;
          if (!bin || ((f.op === "et" || f.op === "ou") && x.op === f.op)) return texte(x);
          return "(" + texte(x) + ")";
        }
        return g(f.a) + sym + g(f.b);
      }
      default: { // A E X F G
        var c = f.f;
        if ((f.op === "A" || f.op === "E") && c.op === "U") return f.op + "(" + texte(c) + ")";
        if (c.op === "ap" || c.op === "vrai" || c.op === "faux") return f.op + " " + texte(c);
        if (estUnaire(c)) return f.op + texte(c);
        return f.op + "(" + texte(c) + ")";
      }
    }
  }

  /* ---------------- Classes de formules ---------------- */
  function estEtatCTL(f) {
    switch (f.op) {
      case "ap": case "vrai": case "faux": return true;
      case "non": return estEtatCTL(f.f);
      case "et": case "ou": case "imp": return estEtatCTL(f.a) && estEtatCTL(f.b);
      case "A": case "E": {
        var c = f.f;
        if (c.op === "X" || c.op === "F" || c.op === "G") return estEtatCTL(c.f);
        if (c.op === "U") return estEtatCTL(c.a) && estEtatCTL(c.b);
        return false;
      }
      default: return false;
    }
  }
  function sansQuantif(f) {
    switch (f.op) {
      case "ap": case "vrai": case "faux": return true;
      case "A": case "E": return false;
      case "non": case "X": case "F": case "G": return sansQuantif(f.f);
      default: return sansQuantif(f.a) && sansQuantif(f.b);
    }
  }
  function estLTL(f) { return f.op === "A" && sansQuantif(f.f); }
  function estBase(f) {
    switch (f.op) {
      case "ap": case "vrai": case "faux": return true;
      case "non": return estBase(f.f);
      case "et": case "ou": return estBase(f.a) && estBase(f.b);
      case "E": {
        var c = f.f;
        if (c.op === "X" || c.op === "G") return estBase(c.f);
        if (c.op === "U") return estBase(c.a) && estBase(c.b);
        return false;
      }
      default: return false;
    }
  }

  /* ---------------- Réécriture dans la base ---------------- */
  function N(f) { return { op: "non", f: f }; }
  function E(f) { return { op: "E", f: f }; }
  function versBase(f) {
    // r(f) : f réécrite ; rn(f) : ¬f réécrite (en poussant la négation quand le cours le fait)
    function r(f) {
      switch (f.op) {
        case "ap": case "vrai": case "faux": return f;
        case "non": return rn(f.f);
        case "et": case "ou": return { op: f.op, a: r(f.a), b: r(f.b) };
        case "imp": return { op: "ou", a: rn(f.a), b: r(f.b) };
        case "E": {
          var c = f.f;
          if (c.op === "X" || c.op === "G") return E({ op: c.op, f: r(c.f) });
          if (c.op === "F") return E({ op: "U", a: { op: "vrai" }, b: r(c.f) });
          if (c.op === "U") return E({ op: "U", a: r(c.a), b: r(c.b) });
          throw erreur("E doit être suivi de X, F, G ou U pour une formule CTL : " + texte(f));
        }
        case "A": {
          var d = f.f;
          if (d.op === "X") return N(E({ op: "X", f: rn(d.f) }));
          if (d.op === "G") return N(E({ op: "U", a: { op: "vrai" }, b: rn(d.f) }));
          if (d.op === "F") return N(E({ op: "G", f: rn(d.f) }));
          if (d.op === "U") throw erreur("A(f U g) : le cours ne donne pas sa réécriture dans la base ; utilise une autre formule.");
          throw erreur("A doit être suivi de X, F, G ou U pour une formule CTL : " + texte(f));
        }
        default:
          throw erreur("« " + texte(f) + " » n'est pas une formule CTL : chaque X, F, G, U doit être précédé de A ou E.");
      }
    }
    function rn(f) {
      switch (f.op) {
        case "non": return r(f.f);
        case "imp": return { op: "et", a: r(f.a), b: rn(f.b) };
        case "A": {
          var d = f.f;
          if (d.op === "F") return E({ op: "G", f: rn(d.f) });
          if (d.op === "X") return E({ op: "X", f: rn(d.f) });
          if (d.op === "G") return E({ op: "U", a: { op: "vrai" }, b: rn(d.f) });
          return N(r(f));
        }
        default: return N(r(f));
      }
    }
    return r(f);
  }

  /* ---------------- Modèle ---------------- */
  function modele(o) {
    var M = { etats: o.etats.slice(), init: (o.init || []).slice(), L: {}, succ: {}, pred: {} };
    M.etats.forEach(function (s) { M.L[s] = ((o.L && o.L[s]) || []).slice(); M.succ[s] = []; M.pred[s] = []; });
    (o.R || []).forEach(function (t) {
      if (M.succ[t[0]].indexOf(t[1]) < 0) M.succ[t[0]].push(t[1]);
      if (M.pred[t[1]].indexOf(t[0]) < 0) M.pred[t[1]].push(t[0]);
    });
    M.totale = function () { return M.etats.filter(function (s) { return !M.succ[s].length; }); };
    M.props = function () {
      var v = {};
      M.etats.forEach(function (s) { M.L[s].forEach(function (p) { v[p] = true; }); });
      return Object.keys(v);
    };
    M.ordre = function (liste) { return M.etats.filter(function (s) { return liste.indexOf(s) >= 0; }); };
    return M;
  }

  function sccs(etats, succ) {
    var index = 0, pile = [], sur = {}, idx = {}, low = {}, res = [];
    function visiter(v) {
      idx[v] = low[v] = index++;
      pile.push(v); sur[v] = true;
      (succ[v] || []).forEach(function (w) {
        if (idx[w] === undefined) { visiter(w); low[v] = Math.min(low[v], low[w]); }
        else if (sur[w]) low[v] = Math.min(low[v], idx[w]);
      });
      if (low[v] === idx[v]) {
        var c = [], w;
        do { w = pile.pop(); sur[w] = false; c.push(w); } while (w !== v);
        res.push(c);
      }
    }
    etats.forEach(function (v) { if (idx[v] === undefined) visiter(v); });
    return res.map(function (c) { return etats.filter(function (s) { return c.indexOf(s) >= 0; }); });
  }

  /* ---------------- Labelling ---------------- */
  function etiqueter(M, f, opts) {
    opts = opts || {};
    var equite = opts.equite || null;
    var memo = {}, etapes = [];
    var tous = M.etats.slice();
    function dans(S) { var o = {}; S.forEach(function (s) { o[s] = true; }); return o; }
    function ordre(o) { return M.etats.filter(function (s) { return o[s]; }); }

    function procEG(Sg) { // Sg : liste ; renvoie { S, detail }
      var inG = dans(Sg);
      var succG = {};
      Sg.forEach(function (s) { succG[s] = M.succ[s].filter(function (t) { return inG[t]; }); });
      var comps = sccs(Sg, succG).map(function (c) {
        var nt = c.length > 1 || succG[c[0]].indexOf(c[0]) >= 0;
        var eq = !equite || equite.every(function (P) { return c.some(function (s) { return P.indexOf(s) >= 0; }); });
        return { etats: c, nonTriviale: nt, equitable: eq };
      });
      var noyau = {};
      comps.forEach(function (c) { if (c.nonTriviale && c.equitable) c.etats.forEach(function (s) { noyau[s] = true; }); });
      var marque = Object.assign({}, noyau), couches = [ordre(noyau)], front = ordre(noyau);
      while (front.length) {
        var nouv = {};
        front.forEach(function (t) {
          M.pred[t].forEach(function (s) { if (inG[s] && !marque[s]) nouv[s] = true; });
        });
        var l = ordre(nouv);
        l.forEach(function (s) { marque[s] = true; });
        if (l.length) couches.push(l);
        front = l;
      }
      return { S: ordre(marque), detail: { Sg: Sg.slice(), sccs: comps, noyau: ordre(noyau), couches: couches } };
    }

    var fair = null;
    if (equite) {
      var rf = procEG(tous);
      fair = dans(rf.S);
      etapes.push({ f: { op: "ap", n: "fair" }, texte: "fair ≡ EG true", S: rf.S, cas: "fair", detail: rf.detail });
    }
    function avecFair(S) { return fair ? S.filter(function (s) { return fair[s]; }) : S; }

    function lab(f) {
      var k = texte(f);
      if (memo[k]) return memo[k];
      var S, cas, detail = null;
      switch (f.op) {
        case "ap": cas = "ap"; S = avecFair(tous.filter(function (s) { return M.L[s].indexOf(f.n) >= 0; })); break;
        case "vrai": cas = "const"; S = avecFair(tous.slice()); break;
        case "faux": cas = "const"; S = []; break;
        case "non": { var a = dans(lab(f.f)); cas = "non"; S = tous.filter(function (s) { return !a[s]; }); break; }
        case "et": { var x = dans(lab(f.a)), y = dans(lab(f.b)); cas = "et"; S = tous.filter(function (s) { return x[s] && y[s]; }); break; }
        case "ou": { var u = dans(lab(f.a)), v = dans(lab(f.b)); cas = "ou"; S = tous.filter(function (s) { return u[s] || v[s]; }); break; }
        case "E": {
          var c = f.f;
          if (c.op === "X") {
            cas = "EX";
            var cible = avecFair(lab(c.f)), ci = dans(cible), o = {};
            cible.forEach(function (t) { M.pred[t].forEach(function (s) { o[s] = true; }); });
            S = ordre(o); detail = { cible: cible };
            void ci;
          } else if (c.op === "U") {
            cas = "EU";
            var g1 = dans(lab(c.a)), g2 = avecFair(lab(c.b));
            var marque = dans(g2), couches = [g2.slice()], front = g2.slice();
            while (front.length) {
              var nouv = {};
              front.forEach(function (t) { M.pred[t].forEach(function (s) { if (g1[s] && !marque[s]) nouv[s] = true; }); });
              var l = ordre(nouv);
              l.forEach(function (s) { marque[s] = true; });
              if (l.length) couches.push(l);
              front = l;
            }
            S = ordre(marque); detail = { couches: couches };
          } else if (c.op === "G") {
            cas = "EG";
            var rg = procEG(lab(c.f));
            S = rg.S; detail = rg.detail;
          } else throw erreur("Pas dans la base : " + k);
          break;
        }
        default: throw erreur("Pas dans la base (réécris d'abord avec ¬, ∨, EX, EU, EG) : " + k);
      }
      memo[k] = S;
      etapes.push({ f: f, texte: k, S: S, cas: cas, detail: detail });
      return S;
    }
    var S = lab(f);
    return { S: S, etapes: etapes, fair: fair ? ordre(fair) : null };
  }

  function satisfait(M, f, opts) {
    return etiqueter(M, estBase(f) ? f : versBase(f), opts).S;
  }

  /* ---------------- Chemins ---------------- */
  function surChemin(M, ch, f) {
    var n = ch.etats.length;
    function suiv(i) { return i + 1 < n ? i + 1 : ch.boucle; }
    function ev(f) {
      var v = [], i, k;
      switch (f.op) {
        case "ap": return ch.etats.map(function (s) { return M.L[s].indexOf(f.n) >= 0; });
        case "vrai": return ch.etats.map(function () { return true; });
        case "faux": return ch.etats.map(function () { return false; });
        case "non": return ev(f.f).map(function (b) { return !b; });
        case "et": { var a = ev(f.a), b = ev(f.b); return a.map(function (x, j) { return x && b[j]; }); }
        case "ou": { var c = ev(f.a), d = ev(f.b); return c.map(function (x, j) { return x || d[j]; }); }
        case "imp": { var e = ev(f.a), g = ev(f.b); return e.map(function (x, j) { return !x || g[j]; }); }
        case "X": { var h = ev(f.f); for (i = 0; i < n; i++) v.push(h[suiv(i)]); return v; }
        case "F": case "G": case "U": {
          var pa = f.op === "U" ? ev(f.a) : null, pb = f.op === "U" ? ev(f.b) : ev(f.f);
          var init = f.op === "G";
          for (i = 0; i < n; i++) v.push(init);
          for (k = 0; k <= n + 1; k++) {
            for (i = n - 1; i >= 0; i--) {
              if (f.op === "F") v[i] = pb[i] || v[suiv(i)];
              else if (f.op === "G") v[i] = pb[i] && v[suiv(i)];
              else v[i] = pb[i] || (pa[i] && v[suiv(i)]);
            }
          }
          return v;
        }
        case "A": case "E": {
          if (!estEtatCTL(f)) throw erreur("Sous-formule d'état non CTL : " + texte(f));
          var S = satisfait(M, f);
          return ch.etats.map(function (s) { return S.indexOf(s) >= 0; });
        }
      }
      throw erreur("Opérateur inconnu.");
    }
    return ev(f);
  }

  /* ---------------- PCTL : until borné ---------------- */
  function jusquaBorne(D, f1, f2, t) {
    function test(f) {
      if (typeof f === "function") return f;
      return function (s) { return (D.L[s] || []).indexOf(f) >= 0; };
    }
    var a = test(f1), b = test(f2), P = [];
    for (var i = 0; i <= t; i++) {
      var ligne = {};
      D.etats.forEach(function (s) {
        if (b(s)) { ligne[s] = 1; return; }
        var v = 0;
        if (a(s) && i !== 0) {
          var ps = D.P[s] || {};
          D.etats.forEach(function (s2) { v += (ps[s2] || 0) * P[i - 1][s2]; });
        }
        ligne[s] = v;
      });
      P.push(ligne);
    }
    return P;
  }

  window.LT = {
    lire: lire, texte: texte, versBase: versBase,
    estCTL: estEtatCTL, estLTL: estLTL, estBase: estBase,
    modele: modele, sccs: sccs, etiqueter: etiqueter, satisfait: satisfait,
    surChemin: surChemin, jusquaBorne: jusquaBorne
  };
})();
