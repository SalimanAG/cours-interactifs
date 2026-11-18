/* neurone.js — un neurone à seuil (McCulloch-Pitts) réglable.
   Entrées cliquables, poids et seuil réglables, calcul affiché, et en option
   la table de vérité et (pour 2 entrées) le plan avec la droite de séparation.

   var nr = new Neurone(conteneur, {
     noms: ["x₁", "x₂"],              // une entrée par nom
     poids: [1, 1], seuil: 2,
     etats: [0, 1],                   // valeurs des entrées : [0, 1] (booléen) ou [-1, 1] (bipolaire)
     fonction: "H",                   // "H" (sortie 0/1) ou "SG" (sortie −1/+1) ; défaut selon etats
     x: [0, 0],                       // (optionnel) état initial des entrées
     reglerPoids: true, reglerSeuil: true, reglerEntrees: true,
     nomsPoids: ["w¹", "w²"],         // (optionnel) noms des poids dans les réglages (défaut w₁, w₂…)
     pas: 1, min: -4, max: 4,         // réglage des poids et du seuil
     table: false,                    // table de vérité (toutes les combinaisons, x₁ = bit de poids fort)
     cible: [0, 0, 0, 1],             // (optionnel) sorties attendues, dans l'ordre de la table
     plan: false,                     // (2 entrées) plan : points, droite w₁x₁ + w₂x₂ − θ = 0, demi-plan y = 1 grisé
     surChange: function (e) {}       // e = { x, poids, seuil, somme, y, sorties, ok }
   });
   nr.regler({ poids, seuil, x });    nr.etat() → même objet que surChange

   Règle (cours) : y = 1 si Σ wᵢxᵢ ≥ θ, 0 sinon  (H(z) = 1 si z ≥ 0 ; SG(z) = +1 si z ≥ 0, −1 sinon).
   Calculs : Neurone.H(z), Neurone.SG(z), Neurone.combinaisons(n, etats),
             Neurone.sorties(poids, seuil, etats, fonction), Neurone.fmt(v).
   La brique injecte son propre CSS (variables de theme.css). */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function sv(t, a) { var e = document.createElementNS(NS, t); for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) e.setAttribute(k, a[k]); return e; }
  var el = function (t, c, x) { return Site.el(t, c, x); };

  var STYLE =
    ".neurone-fig{width:100%;height:auto;display:block;max-width:360px;margin:0 auto}" +
    ".neurone-fig .arete{stroke:var(--trait-fort);stroke-width:1.6;fill:none}" +
    ".neurone-fig .arete.active{stroke:var(--encre);stroke-width:2.2}" +
    ".neurone-fig .poids{font-family:var(--mono);font-size:11px;fill:var(--encre-2)}" +
    ".neurone-fig .entree circle{fill:var(--fond);stroke:var(--encre-2);stroke-width:1.5}" +
    ".neurone-fig .entree.on circle{fill:var(--encre);stroke:var(--encre)}" +
    ".neurone-fig .entree text{font-family:var(--mono);font-size:12px;fill:var(--encre);text-anchor:middle;dominant-baseline:central}" +
    ".neurone-fig .entree.on text{fill:var(--fond)}" +
    ".neurone-fig .entree.cliquable{cursor:pointer}" +
    ".neurone-fig .nom{font-family:var(--texte);font-size:13px;fill:var(--encre-2);text-anchor:end;dominant-baseline:central}" +
    ".neurone-fig .corps{fill:var(--fond);stroke:var(--encre);stroke-width:2}" +
    ".neurone-fig .corps.decharge{fill:var(--encre)}" +
    ".neurone-fig .dans{font-family:var(--mono);font-size:12px;fill:var(--encre);text-anchor:middle;dominant-baseline:central}" +
    ".neurone-fig .corps.decharge + .dans,.neurone-fig .dans.inv{fill:var(--fond)}" +
    ".neurone-fig .sortie{font-family:var(--mono);font-size:13px;fill:var(--encre);dominant-baseline:central}" +
    ".neurone-reglages{display:flex;flex-wrap:wrap;gap:.4rem .9rem;justify-content:center;margin:.5rem 0}" +
    ".neurone-reglages .reglage{display:flex;align-items:center;gap:.25rem}" +
    ".neurone-reglages .reglage .v{font-family:var(--mono);min-width:2.6rem;text-align:center}" +
    ".neurone-reglages .reglage .n{color:var(--encre-2)}" +
    ".neurone-calcul{font-family:var(--mono);font-size:.85rem;text-align:center;color:var(--encre-2);margin:.3rem 0;overflow-wrap:anywhere}" +
    ".neurone-table{margin:.5rem auto;border-collapse:collapse;font-family:var(--mono);font-size:.85rem}" +
    ".neurone-table th,.neurone-table td{padding:.2rem .55rem;text-align:center;border-bottom:1px solid var(--trait)}" +
    ".neurone-table th{font-family:var(--texte);font-weight:500;color:var(--encre-2)}" +
    ".neurone-table tr.cliquable{cursor:pointer}" +
    ".neurone-table tr.courante td{box-shadow:inset 0 -2px 0 var(--accent);color:var(--accent)}" +
    ".neurone-table td.ko{text-decoration:line-through;color:var(--encre-3)}" +
    ".neurone-plan{width:100%;height:auto;display:block;max-width:260px;margin:.4rem auto}" +
    ".neurone-plan .axe{stroke:var(--trait-fort);stroke-width:1}" +
    ".neurone-plan .grad{font-family:var(--mono);font-size:9px;fill:var(--encre-3)}" +
    ".neurone-plan .zone1{fill:var(--fond-2);stroke:none}" +
    ".neurone-plan .droite{stroke:var(--encre);stroke-width:2}" +
    ".neurone-plan .pt{stroke:var(--encre);stroke-width:1.6;fill:var(--fond);cursor:pointer}" +
    ".neurone-plan .pt.un{fill:var(--encre)}" +
    ".neurone-plan .pt.faux{stroke-dasharray:3 2}" +
    ".neurone-plan .anneau{fill:none;stroke:var(--accent);stroke-width:2}" +
    ".neurone-plan .lbl{font-family:var(--mono);font-size:9px;fill:var(--encre-2)}" +
    ".neurone-plan .legende{font-family:var(--texte);font-size:10px;fill:var(--encre-2)}";
  function styler() {
    if (document.getElementById("style-neurone")) return;
    var s = document.createElement("style"); s.id = "style-neurone"; s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function H(z) { return z >= 0 ? 1 : 0; }
  function SG(z) { return z >= 0 ? 1 : -1; }
  function fmt(v) {
    if (typeof v !== "number" || isNaN(v)) return "—";
    var r = Math.round(v * 1000) / 1000; if (r === 0) r = 0;
    return String(r).replace(".", ",").replace("-", "−");
  }
  function combinaisons(n, etats) {
    var r = [], k = etats.length, total = Math.pow(k, n);
    for (var c = 0; c < total; c++) {
      var x = [], q = c;
      for (var i = n - 1; i >= 0; i--) { x[i] = etats[q % k]; q = Math.floor(q / k); }
      r.push(x);
    }
    return r;
  }
  function somme(p, x) { var s = 0; for (var i = 0; i < p.length; i++) s += p[i] * x[i]; return s; }
  function sorties(poids, seuil, etats, fonction) {
    var f = fonction === "SG" ? SG : H;
    return combinaisons(poids.length, etats).map(function (x) { return f(somme(poids, x) - seuil); });
  }

  function Neurone(conteneur, o) {
    styler();
    this.o = o;
    this.n = o.noms.length;
    this.etats = o.etats || [0, 1];
    this.fonction = o.fonction || (this.etats[0] < 0 ? "SG" : "H");
    this.poids = (o.poids || []).slice();
    while (this.poids.length < this.n) this.poids.push(0);
    this.seuil = o.seuil === undefined ? 0 : o.seuil;
    this.x = (o.x || []).slice();
    while (this.x.length < this.n) this.x.push(this.etats[0]);
    this.boite = el("div", "neurone");
    conteneur.appendChild(this.boite);
    this.construire();
    this.maj();
  }

  Neurone.prototype.construire = function () {
    var self = this, o = this.o, n = this.n;
    var L = 320, Hh = Math.max(110, 50 + n * 46);
    this.L = L; this.Hh = Hh;
    this.svg = sv("svg", { viewBox: "0 0 " + L + " " + Hh, "class": "neurone-fig", role: "img", "aria-label": "Neurone à seuil" });
    this.boite.appendChild(this.svg);
    this.calcul = el("p", "neurone-calcul");
    this.boite.appendChild(this.calcul);

    var reglables = (o.reglerPoids !== false) || (o.reglerSeuil !== false);
    if (reglables) {
      var r = el("div", "neurone-reglages");
      this.vals = {};
      var pas = o.pas || 1, min = o.min === undefined ? -4 : o.min, max = o.max === undefined ? 4 : o.max;
      var ajouter = function (cle, nom, lire, ecrire) {
        var g = el("div", "reglage");
        g.appendChild(el("span", "n", nom));
        var m = el("button", "btn btn-petit", "−"); m.type = "button"; m.setAttribute("aria-label", nom + " moins " + fmt(pas));
        var v = el("span", "v", "");
        var p = el("button", "btn btn-petit", "+"); p.type = "button"; p.setAttribute("aria-label", nom + " plus " + fmt(pas));
        m.onclick = function () { var nv = Math.round((lire() - pas) * 1000) / 1000; if (nv >= min - 1e-9) { ecrire(nv); self.maj(); } };
        p.onclick = function () { var nv = Math.round((lire() + pas) * 1000) / 1000; if (nv <= max + 1e-9) { ecrire(nv); self.maj(); } };
        g.appendChild(m); g.appendChild(v); g.appendChild(p);
        r.appendChild(g);
        self.vals[cle] = v;
      };
      if (o.reglerPoids !== false) {
        for (var i = 0; i < n; i++) (function (i) {
          ajouter("w" + i, (o.nomsPoids && o.nomsPoids[i]) || ("w" + indice(i + 1)), function () { return self.poids[i]; }, function (v) { self.poids[i] = v; });
        })(i);
      }
      if (o.reglerSeuil !== false) ajouter("t", "θ", function () { return self.seuil; }, function (v) { self.seuil = v; });
      this.boite.appendChild(r);
    }
    if (o.table) {
      this.table = el("table", "neurone-table");
      this.boite.appendChild(this.table);
    }
    if (o.plan && n === 2) {
      this.plan = sv("svg", { viewBox: "0 0 260 260", "class": "neurone-plan", role: "img", "aria-label": "Plan (x₁, x₂)" });
      this.boite.appendChild(this.plan);
    }
  };

  function indice(k) { return String(k).replace(/\d/g, function (d) { return "₀₁₂₃₄₅₆₇₈₉"[+d]; }); }

  Neurone.prototype.basculer = function (i) {
    var e = this.etats;
    this.x[i] = this.x[i] === e[0] ? e[1] : e[0];
    this.maj();
  };

  Neurone.prototype.etat = function () {
    var s = somme(this.poids, this.x);
    var f = this.fonction === "SG" ? SG : H;
    var so = sorties(this.poids, this.seuil, this.etats, this.fonction);
    var ok = null;
    if (this.o.cible) ok = this.o.cible.every(function (c, i) { return c === so[i]; });
    return { x: this.x.slice(), poids: this.poids.slice(), seuil: this.seuil, somme: s, y: f(s - this.seuil), sorties: so, ok: ok };
  };

  Neurone.prototype.regler = function (r) {
    if (r.poids) this.poids = r.poids.slice();
    if (r.seuil !== undefined) this.seuil = r.seuil;
    if (r.x) this.x = r.x.slice();
    this.maj();
  };

  Neurone.prototype.maj = function () {
    var self = this, o = this.o, n = this.n, e = this.etat();
    // Figure
    var s = this.svg; while (s.firstChild) s.removeChild(s.firstChild);
    var cx = 200, cy = this.Hh / 2, R = 30;
    for (var i = 0; i < n; i++) (function (i) {
      var y = n === 1 ? cy : 25 + i * (self.Hh - 50) / (n - 1);
      var actif = self.x[i] !== 0 && self.poids[i] !== 0;
      s.appendChild(sv("line", { x1: 70, y1: y, x2: cx - R, y2: cy + (y - cy) * 0.25, "class": "arete" + (actif ? " active" : "") }));
      var mx = 70 + (cx - R - 70) * 0.55, my = y + (cy + (y - cy) * 0.25 - y) * 0.55;
      var t = sv("text", { x: mx, y: my - 6, "class": "poids", "text-anchor": "middle" });
      t.textContent = fmt(self.poids[i]);
      s.appendChild(t);
      var on = self.x[i] === self.etats[1];
      var g = sv("g", { "class": "entree" + (on ? " on" : "") + (o.reglerEntrees !== false ? " cliquable" : ""), transform: "translate(55 " + y + ")" });
      g.appendChild(sv("circle", { r: 15 }));
      var tv = sv("text", {}); tv.textContent = fmt(self.x[i]); g.appendChild(tv);
      if (o.reglerEntrees !== false) {
        g.setAttribute("role", "button"); g.setAttribute("tabindex", "0");
        g.setAttribute("aria-label", "Basculer " + o.noms[i]);
        g.addEventListener("click", function () { self.basculer(i); });
        g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); self.basculer(i); } });
      }
      s.appendChild(g);
      var nm = sv("text", { x: 34, y: y, "class": "nom" }); nm.textContent = o.noms[i]; s.appendChild(nm);
    })(i);
    var dech = e.y === 1;
    s.appendChild(sv("circle", { cx: cx, cy: cy, r: R, "class": "corps" + (dech ? " decharge" : "") }));
    var t1 = sv("text", { x: cx, y: cy - 7, "class": "dans" + (dech ? " inv" : "") }); t1.textContent = "Σ"; s.appendChild(t1);
    var t2 = sv("text", { x: cx, y: cy + 9, "class": "dans" + (dech ? " inv" : "") }); t2.textContent = "θ=" + fmt(this.seuil); s.appendChild(t2);
    s.appendChild(sv("line", { x1: cx + R, y1: cy, x2: 262, y2: cy, "class": "arete active" }));
    var ty = sv("text", { x: 268, y: cy, "class": "sortie" }); ty.textContent = "y=" + fmt(e.y); s.appendChild(ty);

    // Calcul
    var termes = [];
    for (var j = 0; j < n; j++) {
      var w = this.poids[j];
      termes.push((w < 0 ? "(" + fmt(w) + ")" : fmt(w)) + "·" + (this.x[j] < 0 ? "(" + fmt(this.x[j]) + ")" : fmt(this.x[j])));
    }
    var nomF = this.fonction;
    this.calcul.textContent = "Σ wᵢxᵢ = " + termes.join(" + ") + " = " + fmt(e.somme) +
      " ; " + fmt(e.somme) + (e.somme >= this.seuil ? " ≥ " : " < ") + "θ = " + fmt(this.seuil) + " ⇒ y = " + nomF + "(" + fmt(e.somme - this.seuil) + ") = " + fmt(e.y);

    if (this.vals) {
      for (var k = 0; k < n; k++) if (this.vals["w" + k]) this.vals["w" + k].textContent = fmt(this.poids[k]);
      if (this.vals.t) this.vals.t.textContent = fmt(this.seuil);
    }
    if (this.table) this.dessinerTable(e);
    if (this.plan) this.dessinerPlan(e);
    if (o.surChange) o.surChange(e);
  };

  Neurone.prototype.dessinerTable = function (e) {
    var self = this, o = this.o, t = this.table;
    t.innerHTML = "";
    var tr = el("tr");
    o.noms.forEach(function (nm) { tr.appendChild(el("th", null, nm)); });
    tr.appendChild(el("th", null, "Σ − θ"));
    tr.appendChild(el("th", null, "y"));
    if (o.cible) tr.appendChild(el("th", null, "attendu"));
    t.appendChild(tr);
    combinaisons(this.n, this.etats).forEach(function (x, r) {
      var l = el("tr", "cliquable");
      if (x.join() === self.x.join()) l.classList.add("courante");
      x.forEach(function (v) { l.appendChild(el("td", null, fmt(v))); });
      l.appendChild(el("td", null, fmt(somme(self.poids, x) - self.seuil)));
      var y = e.sorties[r];
      var td = el("td", null, fmt(y));
      if (o.cible && o.cible[r] !== y) td.className = "ko";
      l.appendChild(td);
      if (o.cible) l.appendChild(el("td", null, fmt(o.cible[r])));
      l.onclick = function () { self.regler({ x: x }); };
      t.appendChild(l);
    });
  };

  Neurone.prototype.dessinerPlan = function (e) {
    var self = this, p = this.plan;
    while (p.firstChild) p.removeChild(p.firstChild);
    var bip = this.etats[0] < 0;
    var a = bip ? -1.7 : -0.7, b = bip ? 1.7 : 1.7;
    var X = function (v) { return 20 + (v - a) / (b - a) * 230; };
    var Y = function (v) { return 240 - (v - a) / (b - a) * 230; };
    var w1 = this.poids[0], w2 = this.poids[1], th = this.seuil;
    // Demi-plan w₁x₁ + w₂x₂ − θ ≥ 0 (grisé), découpé dans le carré [a, b]².
    var poly = [[a, a], [b, a], [b, b], [a, b]];
    var dedans = function (q) { return w1 * q[0] + w2 * q[1] - th >= 0; };
    var res = [];
    for (var i = 0; i < 4; i++) {
      var P = poly[i], Q = poly[(i + 1) % 4], dp = dedans(P), dq = dedans(Q);
      if (dp) res.push(P);
      if (dp !== dq) {
        var fp = w1 * P[0] + w2 * P[1] - th, fq = w1 * Q[0] + w2 * Q[1] - th, tt = fp / (fp - fq);
        res.push([P[0] + (Q[0] - P[0]) * tt, P[1] + (Q[1] - P[1]) * tt]);
      }
    }
    if (res.length > 2) p.appendChild(sv("polygon", { points: res.map(function (q) { return X(q[0]).toFixed(1) + "," + Y(q[1]).toFixed(1); }).join(" "), "class": "zone1" }));
    p.appendChild(sv("line", { x1: X(a), y1: Y(0), x2: X(b), y2: Y(0), "class": "axe" }));
    p.appendChild(sv("line", { x1: X(0), y1: Y(a), x2: X(0), y2: Y(b), "class": "axe" }));
    var lx = sv("text", { x: X(b) - 2, y: Y(0) - 4, "class": "grad", "text-anchor": "end" }); lx.textContent = this.o.noms[0]; p.appendChild(lx);
    var ly = sv("text", { x: X(0) + 4, y: Y(b) + 9, "class": "grad" }); ly.textContent = this.o.noms[1]; p.appendChild(ly);
    // Droite w₁x₁ + w₂x₂ = θ
    if (Math.abs(w1) > 1e-12 || Math.abs(w2) > 1e-12) {
      var pts = [];
      if (Math.abs(w2) > 1e-12) { pts = [[a, (th - w1 * a) / w2], [b, (th - w1 * b) / w2]]; }
      else { pts = [[th / w1, a], [th / w1, b]]; }
      var g = sv("g", {});
      var cp = sv("clipPath", { id: "cp-plan-" + (this.id || (this.id = Math.random().toString(36).slice(2, 7))) });
      cp.appendChild(sv("rect", { x: X(a), y: Y(b), width: X(b) - X(a), height: Y(a) - Y(b) }));
      g.appendChild(cp);
      g.appendChild(sv("line", { x1: X(pts[0][0]), y1: Y(pts[0][1]), x2: X(pts[1][0]), y2: Y(pts[1][1]), "class": "droite", "clip-path": "url(#cp-plan-" + this.id + ")" }));
      p.appendChild(g);
    }
    combinaisons(2, this.etats).forEach(function (x, r) {
      var y = e.sorties[r];
      var cls = "pt" + (y === 1 ? " un" : "") + (self.o.cible && self.o.cible[r] !== y ? " faux" : "");
      if (x.join() === self.x.join()) p.appendChild(sv("circle", { cx: X(x[0]), cy: Y(x[1]), r: 12, "class": "anneau" }));
      var c = sv("circle", { cx: X(x[0]), cy: Y(x[1]), r: 7, "class": cls });
      c.addEventListener("click", function () { self.regler({ x: x }); });
      p.appendChild(c);
      var t = sv("text", { x: X(x[0]) + 10, y: Y(x[1]) + 16, "class": "lbl" });
      t.textContent = "(" + fmt(x[0]) + "," + fmt(x[1]) + ")";
      p.appendChild(t);
    });
    var lg = sv("text", { x: 20, y: 256, "class": "legende" });
    lg.textContent = "grisé : Σ wᵢxᵢ − θ ≥ 0 ; plein : y = " + (this.fonction === "SG" ? "+1" : "1") + (this.o.cible ? " ; pointillé : ≠ attendu" : "");
    p.appendChild(lg);
  };

  Neurone.H = H;
  Neurone.SG = SG;
  Neurone.fmt = fmt;
  Neurone.combinaisons = combinaisons;
  Neurone.sorties = sorties;
  window.Neurone = Neurone;
})();
