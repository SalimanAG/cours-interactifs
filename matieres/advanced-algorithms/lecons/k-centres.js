/* Leçon : k-centres, une 2-approximation gloutonne (TD2, exercice 3).
   Fil rouge : 10 sites du plan (instance construite pour la leçon), k = 3. */
(function () {
  "use strict";
  var el = Site.el;
  var P = [[40, 45], [75, 40], [55, 85], [85, 75], [230, 40], [270, 45], [255, 90], [120, 170], [165, 195], [180, 160]];
  var n = P.length, K = 3;
  function d(a, b) { return Math.sqrt(Math.pow(P[a][0] - P[b][0], 2) + Math.pow(P[a][1] - P[b][1], 2)); }
  function dC(s, C) { if (!C.length) return Infinity; var m = Infinity; C.forEach(function (c) { m = Math.min(m, d(s, c)); }); return m; }
  function rayon(C) { var r = 0, arg = -1; for (var s = 0; s < n; s++) { var x = dC(s, C); if (x > r) { r = x; arg = s; } } return { r: r, site: arg }; }
  var ROPT = (function () { // meilleur rayon avec 3 centres choisis parmi les sites
    var best = Infinity;
    for (var a = 0; a < n; a++) for (var b = a + 1; b < n; b++) for (var c = b + 1; c < n; c++) best = Math.min(best, rayon([a, b, c]).r);
    return best;
  })();
  function nom(s) { return "s" + (s + 1); }
  function f1(x) { return (Math.round(x * 10) / 10).toString().replace(".", ","); }

  var NS = "http://www.w3.org/2000/svg";
  function svg(tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); return e; }

  /* Plan : dessine les sites, les centres, des disques et un segment. */
  function Plan(zone, onSite) {
    var c = el("div", "cadre-figure"); zone.appendChild(c);
    this.svg = svg("svg", { viewBox: "-35 -30 390 285", "class": "plan" });
    c.appendChild(this.svg);
    this.onSite = onSite;
  }
  /* o : { centres:[], disque: r, double: r2, retires:{}, courant: s, segment:[s, c], etiquettes: fn(s) } */
  Plan.prototype.dessiner = function (o) {
    var s = this.svg, self = this;
    while (s.firstChild) s.removeChild(s.firstChild);
    (o.centres || []).forEach(function (c) {
      if (o.double) s.appendChild(svg("circle", { cx: P[c][0], cy: P[c][1], r: o.double, "class": "disque double" }));
      if (o.disque) s.appendChild(svg("circle", { cx: P[c][0], cy: P[c][1], r: o.disque, "class": "disque" }));
    });
    if (o.segment) s.appendChild(svg("line", { x1: P[o.segment[0]][0], y1: P[o.segment[0]][1], x2: P[o.segment[1]][0], y2: P[o.segment[1]][1], "class": "lien-rayon" }));
    P.forEach(function (p, i) {
      var cl = "site" + ((o.centres || []).indexOf(i) >= 0 ? " centre" : "") + (o.retires && o.retires[i] ? " retire" : "") + (o.courant === i ? " courant" : "");
      s.appendChild(svg("circle", { cx: p[0], cy: p[1], r: 7, "class": cl }));
      var t = svg("text", { x: p[0] + 9, y: p[1] - 7, "class": "nom-site" }); t.textContent = nom(i); s.appendChild(t);
      if (o.etiquettes) { var e = o.etiquettes(i); if (e) { var t2 = svg("text", { x: p[0] + 9, y: p[1] + 13, "class": "nom-site distance" }); t2.textContent = e; s.appendChild(t2); } }
      if (self.onSite) {
        var cible = svg("circle", { cx: p[0], cy: p[1], r: 16, "class": "cible" });
        cible.addEventListener("click", function () { self.onSite(i); });
        s.appendChild(cible);
      }
    });
  };

  var NOTE = "<div class='signalement'>Les sites sont construits pour la leçon. Le TD2 autorise des centres n'importe où dans le plan ; " +
    "ici, pour manipuler, on choisit les centres parmi les sites (c'est d'ailleurs ce que font les deux algorithmes du TD).</div>";

  var etapes = [
    {
      titre: "Le problème des k centres",
      texte: "<p>On donne n sites et on veut placer au plus k centres (des casernes de pompiers) pour protéger au mieux les sites. Le critère à minimiser est le " +
        "<b>rayon de couverture</b> :</p><div class='formule'>r(C) = max_{s∈S} d(s, C)   où d(s, C) = min_{c∈C} d(s, c)</div>" +
        "<p>Touche des sites pour en faire des centres (k = 3). Le disque gris a le rayon r(C) ; le segment en couleur relie le site le plus mal couvert à son centre.</p>" + NOTE,
      objectif: "Placer 3 centres avec un rayon de couverture ≤ 55.",
      installer: function (zone, api) {
        var C = [];
        var plan = new Plan(zone, function (s) {
          var i = C.indexOf(s);
          if (i >= 0) C.splice(i, 1); else if (C.length < K) C.push(s); else { api.retour("Déjà 3 centres : retire-en un d'abord.", false); return; }
          maj();
        });
        var info = el("p", "legende-figure"); zone.appendChild(info);
        function maj() {
          var r = rayon(C);
          var plus = r.site >= 0 && C.length ? C.reduce(function (a, c) { return d(r.site, c) < d(r.site, a) ? c : a; }, C[0]) : null;
          plan.dessiner({ centres: C, disque: C.length ? r.r : 0, segment: plus !== null ? [r.site, plus] : null });
          info.innerHTML = "<span>centres : <span class='mono'>{" + C.map(nom).join(", ") + "}</span></span>" +
            (C.length ? "<span>r(C) = <span class='mono'>" + f1(r.r) + "</span> (atteint en " + nom(r.site) + ")</span>" : "");
          if (C.length === K && r.r <= 55) {
            api.retour("r(C) = " + f1(r.r) + ".", true);
            api.valider("Le meilleur rayon avec 3 centres pris parmi les sites est ≈ " + f1(ROPT) + ". Le problème est NP-difficile : on cherche une 2-approximation.");
          } else if (C.length === K) api.retour("r(C) = " + f1(r.r) + " : déplace le centre le plus mal placé.", null);
          else api.retour("", null);
        }
        maj();
      }
    },

    {
      titre: "Algorithme 1 : on connaît r",
      texte: "<p>Supposons qu'on connaisse le rayon de couverture minimum r. Algorithme du TD2 :</p>" +
        "<div class='formule'>S′ ← S ; C ← ∅ ; tant que S′ ≠ ∅ : choisir s ∈ S′ quelconque ; C ← C ∪ {s} ; retirer de S′ tous les sites à distance ≤ 2r de s. " +
        "Si |C| ≤ k retourner C, sinon « le rayon de couverture minimum est > r ».</div>" +
        "<p>On prend r = " + f1(ROPT) + " (atteignable avec 3 centres). Touche un site encore dans S′ (non grisé) ; le cercle pointillé a le rayon 2r.</p>",
      objectif: "Exécuter l'algorithme 1 jusqu'à S′ = ∅.",
      installer: function (zone, api) {
        var C = [], retires = {};
        var plan = new Plan(zone, function (s) {
          if (retires[s]) { api.retour(nom(s) + " n'est plus dans S′ : il est déjà couvert à moins de 2r.", false); return; }
          C.push(s);
          for (var x = 0; x < n; x++) if (d(x, s) <= 2 * ROPT) retires[x] = true;
          maj();
        });
        var info = el("p", "legende-figure"); zone.appendChild(info);
        var b = el("button", "btn btn-petit", "Recommencer"); b.type = "button";
        b.onclick = function () { C = []; retires = {}; api.retour("", null); maj(); };
        zone.appendChild(b);
        function maj() {
          plan.dessiner({ centres: C, double: 2 * ROPT, retires: retires });
          var reste = 0; for (var x = 0; x < n; x++) if (!retires[x]) reste++;
          info.innerHTML = "<span>|C| = <span class='mono'>" + C.length + "</span></span><span>|S′| = <span class='mono'>" + reste + "</span></span>";
          if (!reste) {
            var r = rayon(C).r;
            api.retour("|C| = " + C.length + " ≤ k = 3, et r(C) = " + f1(r) + " ≤ 2r = " + f1(2 * ROPT) + ".", true);
            api.valider("Ce qui est approximé, c'est le rayon : on garantit au plus 2r, avec au plus k centres. Complexité O(n²) : au plus n tours, chacun scanne S′.");
          }
        }
        maj();
      }
    },

    {
      titre: "Pourquoi |C| ≤ k ?",
      texte: "<p>Soit C* une solution d'au plus k centres de rayon r, et C la solution de l'algorithme 1. Remets dans l'ordre le raisonnement du TD2 (questions c à f).</p>",
      objectif: "Ordonner les étapes de la preuve.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche les étapes dans l'ordre.",
          items: [
            "C ⊆ S, donc chaque c ∈ C a un c* ∈ C* avec d(c, c*) ≤ r",
            "Deux centres c ≠ c′ de C sont à distance > 2r (c′ n'a pas été retiré)",
            "Donc ils ne peuvent pas partager le même c* (inégalité triangulaire)",
            "c ↦ c* est injective : |C| ≤ |C*| ≤ k",
            "Tout site retiré est à ≤ 2r d'un centre : r(C) ≤ 2r"
          ],
          bravo: "Questions c, d, e, f du TD2.",
          surReussite: function () { api.valider("Par contraposée : si l'algorithme termine avec |C| > k, aucun ensemble d'au plus k centres n'a un rayon r."); }
        });
      }
    },

    {
      titre: "Et si r est faux ?",
      texte: "<p>Que retourne l'algorithme si le r fourni n'est pas le rayon minimum ? Fais varier r ; l'algorithme choisit à chaque fois le premier site de S′.</p>",
      objectif: "Obtenir une exécution qui échoue (|C| > k) et une qui réussit.",
      installer: function (zone, api) {
        var lab = el("label"), c = el("input"); c.type = "range"; c.min = 10; c.max = 70; c.value = 20;
        var plan = new Plan(zone, null);
        zone.appendChild(lab); zone.appendChild(c);
        var info = el("p", "legende-figure"); zone.appendChild(info);
        var vu = { echec: false, succes: false };
        function maj() {
          var r = +c.value, C = [], ret = {};
          for (var s = 0; s < n; s++) {
            if (ret[s]) continue;
            C.push(s);
            for (var x = 0; x < n; x++) if (d(x, s) <= 2 * r) ret[x] = true;
          }
          lab.innerHTML = "r fourni = <span class='mono'>" + r + "</span>";
          plan.dessiner({ centres: C, double: 2 * r });
          var ok = C.length <= K;
          vu[ok ? "succes" : "echec"] = true;
          info.innerHTML = "<span>|C| = <span class='mono'>" + C.length + "</span></span><span>" + (ok ? "retourne C, rayon " + f1(rayon(C).r) + " ≤ 2r" : "« le rayon de couverture minimum est > " + r + " »") + "</span>";
          if (vu.echec && vu.succes) api.valider("Si r est trop petit, l'algorithme s'en aperçoit. S'il est trop grand, il ne s'en aperçoit pas : C est une 2-approximation du r fourni, pas forcément du rayon minimum.");
        }
        c.addEventListener("input", maj);
        maj();
      }
    },

    {
      titre: "Sans connaître r : le site le plus éloigné",
      texte: "<p>Idée (questions g, h) : s'il existe un site à distance > 2r de tous les centres déjà choisis, alors le site <b>le plus éloigné</b> des centres en est un. " +
        "On peut donc toujours choisir le plus éloigné, sans connaître r, et s'arrêter après exactement k centres :</p>" +
        "<div class='formule'>C ← ∅ ; tant que |C| < k : choisir s ∈ S tel que d(s, C) est maximum (d(s, ∅) = +∞) ; C ← C ∪ {s} ; retourner C</div>" +
        "<p>Sous chaque site s'affiche d(s, C). Choisis les 3 centres.</p>",
      objectif: "Exécuter l'algorithme 2 (premier centre au choix).",
      installer: function (zone, api) {
        var C = [];
        var plan = new Plan(zone, function (s) {
          if (C.length >= K) return;
          if (C.length) {
            var max = -1; for (var x = 0; x < n; x++) max = Math.max(max, dC(x, C));
            if (dC(s, C) < max - 1e-9) { api.retour("Non : d(" + nom(s) + ", C) = " + f1(dC(s, C)) + " mais le maximum est " + f1(max) + ".", false); return; }
          }
          C.push(s); maj();
        });
        var info = el("p", "legende-figure"); zone.appendChild(info);
        var b = el("button", "btn btn-petit", "Recommencer"); b.type = "button";
        b.onclick = function () { C = []; api.retour("", null); maj(); };
        zone.appendChild(b);
        function maj() {
          var r = rayon(C);
          plan.dessiner({ centres: C, disque: C.length === K ? r.r : 0, etiquettes: function (s) { return C.length && C.indexOf(s) < 0 ? f1(dC(s, C)) : ""; } });
          info.innerHTML = "<span>C = <span class='mono'>{" + C.map(nom).join(", ") + "}</span></span>";
          if (C.length === K) {
            api.retour("r̃ = " + f1(r.r) + " ; meilleur rayon parmi les sites ≈ " + f1(ROPT) + " ; 2 × " + f1(ROPT) + " = " + f1(2 * ROPT) + ".", true);
            api.valider("Ici on est même très proche de l'optimum, mais la seule garantie est le facteur 2.");
          } else api.retour(C.length ? "Choisis le site le plus éloigné des centres." : "Premier centre : n'importe quel site (tous à distance +∞).", null);
        }
        maj();
      }
    },

    {
      titre: "Complexité et garantie",
      texte: "<p>Questions i et j du TD2.</p>",
      objectif: "Donner la complexité de l'algorithme 2 et valider la preuve du facteur 2.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Avec un tableau dist[s] = d(s, C) mis à jour à chaque nouveau centre (dist[s] ← min{dist[s], d(s, c)}), la complexité devient :",
          options: ["O(k²n)", "O(kn)", "O(n²)", "O(n log n)"],
          bonne: 1,
          expliquer: [
            "C'est la version naïve (recalculer d(s, C) pour chaque s et chaque centre). Avec le tableau dist, on fait mieux.",
            "Exact : k tours ; à chaque tour, O(n) pour mettre à jour dist et O(n) pour trouver le maximum.",
            "Non : la boucle fait k tours, pas n.",
            "Non."
          ],
          surReussite: function () {
            Exercices.vraiFaux(zone, {
              items: [
                { texte: "Tant que S′ ≠ ∅, le choix de l'algorithme 2 est aussi un choix valide pour l'algorithme 1.", vrai: true, explication: "Le site le plus éloigné est à > 2r s'il en existe un (question g)." },
                { texte: "Après k′ ≤ k tours, les centres de l'algorithme 2 ont déjà un rayon ≤ 2r.", vrai: true, explication: "Ce sont exactement ceux d'une exécution de l'algorithme 1." },
                { texte: "Les centres ajoutés ensuite peuvent faire augmenter le rayon.", vrai: false, explication: "Ajouter des centres ne peut que diminuer d(s, C)." }
              ],
              surReussite: function () { api.valider("L'algorithme 2 est une 2-approximation du rayon de couverture minimum, sans connaître r."); }
            });
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "k-centres",
    etapes: etapes,
    fin: {
      cartes: "approximation",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir (TD2, exercice 3)</span><ul>" +
        "<li>r(C) = max_s min_c d(s, c) ; on veut au plus k centres de rayon minimum.</li>" +
        "<li>Algorithme 1 (r connu) : choisir un site non couvert, retirer ce qui est à ≤ 2r ; |C| > k prouve que le minimum est > r.</li>" +
        "<li>Algorithme 2 : k fois le site le plus éloigné des centres ; 2-approximation, O(kn) avec un tableau dist.</li></ul></div>"
    }
  });
})();
