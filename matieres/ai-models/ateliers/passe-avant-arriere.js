/* Atelier : une passe avant / arrière pas à pas (notes « AIMA : backpropagation », l'algorithme et la condition de terminaison).
   Étapes 2 : le fil rouge de la leçon (réseau 2-2-1, x = (1, 0), O = 1). Étapes 3-4 : le même réseau appris sur XOR. */
(function () {
  "use strict";
  var A = AIM, el = Site.el, S = Reseau.sigmoide, f = Reseau.fmt;
  var COUCHES = [["x₁", "x₂"], ["c₁", "c₂"], ["s"]];
  var ALGO = [
    "Soit T un ensemble d'exemples, ε ∈ (0, 1) le taux d'apprentissage",
    "Initialiser chaque poids avec un nombre aléatoire proche de 0",
    "Répéter jusqu'à la condition de terminaison :",
    "  pour chaque (x, O) ∈ T :",
    "    calculer les sorties S de tous les neurones (passe avant)",
    "    calculer δ pour chaque neurone (de la sortie vers l'entrée)",
    "    W ← W − ε · δ(arrivée) · S(départ), pour chaque connexion"
  ];

  /* Réseau 2-2-1 : un pas de rétropropagation sur un exemple (les seuils peuvent aussi apprendre). */
  function pas(net, x, o, eps, seuils) {
    var sc = [0, 1].map(function (k) { return S(net.wc[k][0] * x[0] + net.wc[k][1] * x[1] - net.tc[k]); });
    var ss = S(net.ws[0] * sc[0] + net.ws[1] * sc[1] - net.ts);
    var ds = (ss - o) * ss * (1 - ss);
    var dc = [0, 1].map(function (k) { return sc[k] * (1 - sc[k]) * ds * net.ws[k]; });
    for (var k = 0; k < 2; k++) {
      net.ws[k] -= eps * ds * sc[k];
      for (var j = 0; j < 2; j++) net.wc[k][j] -= eps * dc[k] * x[j];
      if (seuils) net.tc[k] += eps * dc[k];
    }
    if (seuils) net.ts += eps * ds;
  }
  function sorties(net, x) {
    var sc = [0, 1].map(function (k) { return S(net.wc[k][0] * x[0] + net.wc[k][1] * x[1] - net.tc[k]); });
    return { sc: sc, ss: S(net.ws[0] * sc[0] + net.ws[1] * sc[1] - net.ts) };
  }
  var XOR = [[[0, 0], 0], [[0, 1], 1], [[1, 0], 1], [[1, 1], 0]];
  function eqm(net) { return XOR.reduce(function (e, d) { return e + 0.5 * Math.pow(sorties(net, d[0]).ss - d[1], 2); }, 0); }
  function initial() { return { wc: [[0.5, -0.4], [0.3, 0.6]], tc: [0.1, -0.2], ws: [0.7, -0.5], ts: 0.2 }; }
  /* Entraînement XOR (ε = 1, mise à jour après chaque exemple) : historique de l'EQM, réseaux enregistrés. */
  var HIST = [], NETS = [], net = initial();
  for (var t = 0; t < 4000; t++) {
    XOR.forEach(function (d) { pas(net, d[0], d[1], 1, true); });
    HIST.push(eqm(net));
    NETS.push(JSON.parse(JSON.stringify(net)));
  }
  function arret(delta, C) {
    for (var i = 1; i < HIST.length; i++) { if (Math.abs(HIST[i] - HIST[i - 1]) < delta) return { t: i, par: "δ" }; if (i + 1 > C) return { t: i, par: "C" }; }
    return { t: HIST.length - 1, par: "C" };
  }
  function xorAppris(n) { return XOR.every(function (d) { return Math.round(sorties(n, d[0]).ss) === d[1]; }); }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "passe-avant-arriere",
    etapes: [
      {
        titre: "L'algorithme des notes",
        texte: "<p>« L'algorithme (enfin !) » : remets ses lignes dans l'ordre.</p>",
        objectif: "Reconstituer l'algorithme de rétropropagation.",
        installer: function (zone, api) {
          Exercices.ordonner(zone, { consigne: "Touche les lignes dans l'ordre.", separateur: "", items: ALGO.map(function (l) { return l.trim(); }), surReussite: function () {
            api.valider("Deux boucles : sur les époques (jusqu'à la condition d'arrêt) et sur les exemples ; dans chaque passage, avant puis arrière puis mise à jour.");
          } });
          A.note(zone, "Dans les notes, la dernière ligne est W_i^J = μ W_i^J − ε δ_J S_J(1 − S_J) x_i : μ n'est pas défini, le facteur S_J(1 − S_J) est déjà dans δ, " +
            "et le taux d'apprentissage est déclaré α puis écrit ε. On écrit ici la mise à jour cohérente avec la leçon : W ← W − ε · δ(arrivée) · S(départ).");
        }
      },
      {
        titre: "Une passe, neurone par neurone",
        texte: "<p>Le fil rouge de la leçon : réseau 2-2-1, exemple x = (1, 0), O = 1, ε = 0,5. Avance avec ▶.</p>",
        objectif: "Parcourir la passe jusqu'au bout, puis répondre à la question.",
        installer: function (zone, api) {
          var n0 = { wc: [[0.6, 0.2], [-0.3, 0.4]], tc: [0.1, -0.2], ws: [0.7, -0.5], ts: 0.2 };
          var so = sorties(n0, [1, 0]), ds = (so.ss - 1) * so.ss * (1 - so.ss);
          var dc = [0, 1].map(function (k) { return so.sc[k] * (1 - so.sc[k]) * ds * n0.ws[k]; });
          var n1 = JSON.parse(JSON.stringify(n0)); pas(n1, [1, 0], 1, 0.5, false);
          var etats = [
            { l: 5, txt: "Entrée x = (1, 0).", ne: { "0,0": { haut: "1", classe: "courant" }, "0,1": { haut: "0", classe: "courant" } } },
            { l: 5, txt: "c₁ : R = 0,6 − 0,1 = 0,5 ; S = " + f(so.sc[0]), ne: { "1,0": { haut: "S=" + f(so.sc[0]), classe: "courant" } }, ar: { "0,0,0": "courant", "0,0,1": "courant" } },
            { l: 5, txt: "c₂ : R = −0,3 + 0,2 = −0,1 ; S = " + f(so.sc[1]), ne: { "1,1": { haut: "S=" + f(so.sc[1]), classe: "courant" } }, ar: { "0,1,0": "courant", "0,1,1": "courant" } },
            { l: 5, txt: "s : R = 0,7·S(c₁) − 0,5·S(c₂) − 0,2 ; S = " + f(so.ss), ne: { "2,0": { haut: "S=" + f(so.ss), classe: "courant" } }, ar: { "1,0,0": "courant", "1,0,1": "courant" } },
            { l: 6, txt: "δ_s = (S − O) S(1 − S) = " + f(ds), ne: { "2,0": { bas: "δ=" + f(ds), classe: "courant" } } },
            { l: 6, txt: "δ_c₁ = S(c₁)(1 − S(c₁)) · δ_s · 0,7 = " + f(dc[0]), ne: { "1,0": { bas: "δ=" + f(dc[0]), classe: "courant" } }, ar: { "1,0,0": "courant" } },
            { l: 6, txt: "δ_c₂ = S(c₂)(1 − S(c₂)) · δ_s · (−0,5) = " + f(dc[1]), ne: { "1,1": { bas: "δ=" + f(dc[1]), classe: "courant" } }, ar: { "1,0,1": "courant" } },
            { l: 7, txt: "Poids vers s : (" + f(n1.ws[0]) + " ; " + f(n1.ws[1]) + ")", ne: {}, ar: { "1,0,0": "courant", "1,0,1": "courant" }, nouv: true },
            { l: 7, txt: "Poids depuis x₁ : " + f(n1.wc[0][0]) + " vers c₁, " + f(n1.wc[1][0]) + " vers c₂ ; depuis x₂ : inchangés (x₂ = 0).", ne: {}, ar: { "0,0,0": "courant", "0,1,0": "courant" }, nouv: true }
          ];
          var pc = new PseudoCode(A.cadre(zone), { titre: "Rétropropagation", lignes: ALGO });
          var fig = new Reseau(A.cadre(zone), { couches: COUCHES, hauteur: 170 });
          var info = A.legende(zone);
          var question = false;
          var ctl = new Controleur(zone, {
            afficher: function (i) {
              var e = etats[i], cumul = {};
              for (var k = 0; k <= i; k++) Object.keys(etats[k].ne).forEach(function (c) { cumul[c] = { haut: etats[k].ne[c].haut || (cumul[c] || {}).haut, bas: etats[k].ne[c].bas || (cumul[c] || {}).bas }; });
              Object.keys(e.ne).forEach(function (c) { cumul[c].classe = "courant"; });
              var n = e.nouv ? n1 : n0;
              fig.dessiner({ aretes: Reseau.aretesDepuis([n.wc, [n.ws]], e.ar), neurones: cumul });
              pc.surligner(e.l);
              info.textContent = e.txt;
            },
            delai: 1200,
            surFin: function () {
              if (question) return; question = true;
              var b = el("div"); zone.appendChild(b);
              A.choix(b, {
                question: "Pourquoi calcule-t-on tous les δ avant de modifier les poids ?",
                options: ["δ_c utilise le poids W_c^s : il faut l'ancienne valeur, celle de la passe avant", "pour économiser de la mémoire", "l'ordre n'a aucune importance"],
                bonne: 0, surReussite: function () { api.valider("Passe avant, puis tous les δ (sortie → entrée), puis toutes les mises à jour."); }
              });
            }
          });
          ctl.charger(etats.length);
        }
      },
      {
        titre: "La condition de terminaison",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Notes</span>La condition d'arrêt a en général deux parties : " +
          "1) |EQM(t + 1) − EQM(t)| &lt; δ (précision fixée a priori) ; 2) t &gt; C (nombre d'itérations, ou « epochs », fixé a priori). " +
          "Valeurs assez courantes : δ = 10⁻³, C = 500 ; elles sont paramétrables dans scikit-learn.</div>" +
          "<p>Le même réseau 2-2-1 apprend maintenant <b>XOR</b> (4 exemples, ε = 1). La courbe montre l'EQM à chaque époque ; le trait vertical marque l'arrêt.</p>",
        objectif: "Trouver un réglage de δ et C pour lequel le réseau s'arrête en ayant appris XOR.",
        installer: function (zone, api) {
          var DELTAS = [1e-3, 1e-4, 1e-5, 1e-6], CS = [500, 1000, 2000, 4000];
          var d = 0, c = 0;
          var tr = A.trace(zone, { xmin: 0, xmax: 4000, ymin: 0, ymax: 0.55, gradX: [0, 2000, 4000], gradY: [0, 0.5], nomX: "époque", nomY: "EQM", hauteur: 200, courbes: [] });
          var info = A.legende(zone);
          function ligne(lab, vals, fmtv, get, set) {
            var r = el("div", "rangee-btn"); r.appendChild(el("span", "discret", lab));
            var bts = vals.map(function (v, i) { var b = el("button", "btn btn-petit", fmtv(v)); b.type = "button"; b.onclick = function () { set(i); maj(); }; r.appendChild(b); return b; });
            zone.appendChild(r);
            return function () { bts.forEach(function (b, i) { b.classList.toggle("btn-plein", i === get()); }); };
          }
          var m1 = ligne("δ =", DELTAS, function (v) { return "10" + ["⁻³", "⁻⁴", "⁻⁵", "⁻⁶"][DELTAS.indexOf(v)]; }, function () { return d; }, function (i) { d = i; });
          var m2 = ligne("C =", CS, String, function () { return c; }, function (i) { c = i; });
          function maj() {
            m1(); m2();
            var a = arret(DELTAS[d], CS[c]);
            var pts = HIST.slice(0, a.t + 1).map(function (e, i) { return [i, e]; }).filter(function (p, i) { return i % 10 === 0 || i === a.t; });
            tr.redessiner({ xmin: 0, xmax: 4000, ymin: 0, ymax: 0.55, gradX: [0, 2000, 4000], gradY: [0, 0.5], nomX: "époque", nomY: "EQM", hauteur: 200,
              polylignes: [{ points: pts }, { points: [[a.t, 0], [a.t, 0.55]], classe: "courante" }] });
            var ok = xorAppris(NETS[a.t]);
            info.innerHTML = "<span>arrêt à l'époque <span class='mono'>" + a.t + "</span> (critère " + a.par + ")</span><span>EQM = <span class='mono'>" + f(HIST[a.t]) + "</span></span><span>" + (ok ? "XOR appris" : "XOR pas appris") + "</span>";
            if (ok) { api.retour("Réglage valable.", true); api.valider("Piège : au début l'EQM stagne sur un plateau (≈ 0,5) ; avec δ = 10⁻³ ou 10⁻⁴, l'algorithme s'arrête dès les premières époques. Et C = 500 coupe l'apprentissage trop tôt."); }
            else api.retour(a.par === "δ" && a.t < 50 ? "Arrêt sur le plateau du début : δ est trop grand." : "Pas encore appris à l'arrêt.", false);
          }
          maj();
        }
      },
      {
        titre: "XOR, appris avec une couche cachée",
        texte: "<p>Après 4 000 époques, voici les sorties du réseau (arrondies) et celles de ses deux neurones cachés.</p>",
        objectif: "Reconnaître ce que calcule chaque neurone caché.",
        installer: function (zone, api) {
          var n = NETS[NETS.length - 1];
          A.html(zone, A.tableau(["x", "c₁", "c₂", "s", "XOR"], XOR.map(function (d) {
            var so = sorties(n, d[0]);
            return ["(" + d[0].join(", ") + ")", String(Math.round(so.sc[0])), String(Math.round(so.sc[1])), f(so.ss), String(d[1])];
          })));
          var fig = new Reseau(A.cadre(zone), { couches: COUCHES, hauteur: 170 });
          fig.dessiner({ aretes: Reseau.aretesDepuis([n.wc.map(function (r) { return r.map(function (v) { return Math.round(v * 10) / 10; }); }), [n.ws.map(function (v) { return Math.round(v * 10) / 10; })]]) });
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "c₁ (arrondi) calcule…", options: ["x₁ AND NOT x₂", "x₁ OR x₂", "x₁ AND x₂", "NOT x₁"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Le réseau a appris XOR alors qu'un seul neurone ne le peut pas, car…", options: ["la couche cachée découpe le plan avec deux droites, que la sortie combine", "la sigmoïde n'est pas linéaire, donc un seul neurone suffit", "4 000 époques suffisent toujours"], bonne: 0, surReussite: ok }); }
          ], "Le réseau a trouvé seul une décomposition de XOR en portes séparables, comme au chapitre 3.");
          A.note(zone, "Pour apprendre XOR, cette simulation fait aussi évoluer les seuils θ (comme des poids sur une entrée constante −1 : Δθ = +ε δ). " +
            "Les notes ne traitent que la matrice de connexion.");
        }
      }
    ],
    fin: { texte: "<p>Rétropropagation = passe avant, δ de la sortie vers l'entrée, mises à jour ; on recommence jusqu'à |ΔEQM| &lt; δ ou t &gt; C — attention aux plateaux du début.</p>", cartes: "retropropagation" }
  });
})();
