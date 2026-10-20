/* Leçon : Sur l'autoroute du profit (TD1, exercice 1 — programmation dynamique).
   Fil rouge : 7 aires de repos (instance construite pour la leçon, pas celle du TD). */
(function () {
  "use strict";
  var el = Site.el;
  var X = [10, 35, 70, 95, 130, 150, 190];   // positions (km)
  var R = [5, 8, 6, 4, 9, 3, 7];             // revenus
  var n = X.length;
  var D = 50;

  // p(i), OPT(j), prem(j) — indices de 1 à n, 0 = « aucune aire »
  var P = [0], OPT = [0], PREM = [0];
  (function () {
    var p = 0;
    for (var i = 1; i <= n; i++) {
      while (p + 1 < i && X[i - 1] - X[p] >= D) p++;
      P.push(p);
    }
    for (var j = 1; j <= n; j++) {
      if (OPT[j - 1] >= R[j - 1] + OPT[P[j]]) { OPT.push(OPT[j - 1]); PREM.push(PREM[j - 1]); }
      else { OPT.push(R[j - 1] + OPT[P[j]]); PREM.push(j); }
    }
  })();
  var SOLUTION = (function () { var k = PREM[n], s = [k]; while (P[k] > 0) { k = PREM[P[k]]; s.push(k); } return s; })();

  var NS = "http://www.w3.org/2000/svg";
  function svg(tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); return e; }
  function px(km) { return 22 + km / 200 * 300; }

  /* Dessine l'autoroute. classe(i) → classe de l'aire i (1..n) ; zone50 : aire dont on grise les 50 km avant. */
  function Autoroute(zone, onAire) {
    var c = el("div", "cadre-figure");
    zone.appendChild(c);
    this.svg = svg("svg", { viewBox: "0 0 344 100", "class": "autoroute" });
    c.appendChild(this.svg);
    this.onAire = onAire;
  }
  Autoroute.prototype.dessiner = function (classe, zone50) {
    var s = this.svg, self = this;
    while (s.firstChild) s.removeChild(s.firstChild);
    if (zone50) {
      var x2 = px(X[zone50 - 1]), x1 = px(Math.max(0, X[zone50 - 1] - D));
      s.appendChild(svg("rect", { x: x1, y: 38, width: x2 - x1, height: 24, "class": "zone50" }));
    }
    s.appendChild(svg("line", { x1: 14, y1: 50, x2: 332, y2: 50, "class": "route" }));
    X.forEach(function (x, k) {
      var i = k + 1;
      var t = svg("text", { x: px(x), y: 22, "class": "txt rev" }); t.textContent = "r=" + R[k]; s.appendChild(t);
      var c = svg("circle", { cx: px(x), cy: 50, r: 10, "class": "aire " + (classe ? classe(i) : "") });
      if (self.onAire) { c.addEventListener("click", function () { self.onAire(i); }); }
      s.appendChild(c);
      var t2 = svg("text", { x: px(x), y: 54, "class": "txt" }); t2.textContent = i;
      t2.style.pointerEvents = "none";
      if (classe && /choisie/.test(classe(i))) t2.style.fill = "var(--fond)";
      s.appendChild(t2);
      var t3 = svg("text", { x: px(x), y: k % 2 ? 92 : 78, "class": "txt" }); t3.textContent = x + " km"; s.appendChild(t3);
    });
  };

  function tableau(zone, lignes) {
    var w = el("div", "defile-x"); var t = el("table", "table-pd"); w.appendChild(t); zone.appendChild(w);
    return t;
  }

  var etapes = [
    {
      titre: "Le problème",
      texte: "<p>Tu places une chaîne de restaurants sur les aires d'une autoroute. L'aire i est à x<sub>i</sub> km et rapporte r<sub>i</sub>. " +
        "Contrainte de l'AFN : deux restaurants de la chaîne doivent être espacés d'<b>au moins 50 km</b>. On cherche un placement de revenu maximum, OPT.</p>" +
        "<p>Touche les aires pour y placer un restaurant. Les aires en conflit (à moins de 50 km) sont entourées en couleur.</p>" +
        "<div class='signalement'>L'instance (7 aires) est construite pour la leçon ; l'énoncé, les notations et la méthode sont ceux du TD1.</div>",
      objectif: "Trouver un placement valide de revenu maximum.",
      installer: function (zone, api) {
        var choisi = {};
        var route = new Autoroute(zone, function (i) { choisi[i] = !choisi[i]; maj(); });
        var info = el("p", "legende-figure"); zone.appendChild(info);
        function maj() {
          var sel = Object.keys(choisi).filter(function (k) { return choisi[k]; }).map(Number).sort(function (a, b) { return a - b; });
          var conflit = {};
          sel.forEach(function (a) { sel.forEach(function (b) { if (a < b && X[b - 1] - X[a - 1] < D) { conflit[a] = conflit[b] = true; } }); });
          route.dessiner(function (i) { return (choisi[i] ? "choisie" : "") + (conflit[i] ? " conflit" : ""); });
          var rev = sel.reduce(function (s, i) { return s + R[i - 1]; }, 0);
          var nbConf = Object.keys(conflit).length;
          info.innerHTML = "<span>aires : <span class='mono'>{" + sel.join(", ") + "}</span></span><span>revenu : <span class='mono'>" + rev + "</span></span>" +
            (nbConf ? "<span>non valide</span>" : "");
          if (!nbConf && rev === OPT[n]) {
            api.retour("Revenu " + rev + " : c'est l'optimum.", true);
            api.valider("Trouvé à la main sur 7 aires… mais il y a 2ⁿ placements possibles. La programmation dynamique va le trouver en O(n).");
          } else if (!nbConf && sel.length) {
            api.retour("Placement valide, revenu " + rev + ". On peut faire mieux.", null);
          } else if (nbConf) {
            api.retour("Deux restaurants sont à moins de 50 km.", false);
          } else api.retour("", null);
        }
        maj();
      }
    },

    {
      titre: "La fonction p(i)",
      texte: "<p>On note <b>p(i)</b> le numéro de l'aire la plus proche de i qui est située avant i (x<sub>p(i)</sub> &lt; x<sub>i</sub>) et à au moins 50 km de i, " +
        "avec p(i) = 0 s'il n'y en a pas. Si on place un restaurant en i, on peut en placer un autre sur une aire j &lt; i <b>précisément quand j ≤ p(i)</b>. " +
        "Touche une aire pour voir ses 50 km d'exclusion, puis complète le tableau.</p>",
      objectif: "Calculer p(i) pour les 7 aires.",
      installer: function (zone, api) {
        var vue = 0;
        var route = new Autoroute(zone, function (i) { vue = i; route.dessiner(function (k) { return k === vue ? "courante" : ""; }, vue); });
        route.dessiner(null, 0);
        var t = tableau(zone);
        var h = "<tr><th>i</th>", x = "<tr><th>xᵢ</th>", p = "<tr><th>p(i)</th>";
        for (var i = 1; i <= n; i++) {
          h += "<th>" + i + "</th>"; x += "<td>" + X[i - 1] + "</td>";
          var opts = "<option value=''>?</option>";
          for (var k = 0; k < i; k++) opts += "<option>" + k + "</option>";
          p += "<td><select data-i='" + i + "' aria-label='p(" + i + ")' style='font:inherit;border:0;background:transparent;color:inherit'>" + opts + "</select></td>";
        }
        t.innerHTML = h + "</tr>" + x + "</tr>" + p + "</tr>";
        var sels = t.querySelectorAll("select");
        Array.prototype.forEach.call(sels, function (s) { s.addEventListener("change", verifier); });
        function verifier() {
          var j = 0, r = 0;
          Array.prototype.forEach.call(sels, function (s) {
            var i = +s.dataset.i;
            if (s.value !== "") r++;
            var ok = s.value !== "" && +s.value === P[i];
            if (ok) j++;
            s.parentNode.className = s.value === "" ? "" : ok ? "ok" : "";
          });
          if (j === n) {
            api.retour("p = (" + P.slice(1).join(", ") + ").", true);
            Site.el && zone.appendChild(Object.assign(el("div", "encadre"), { innerHTML:
              "<span class='titre-encadre'>Calcul en O(n) (correction du TD1)</span>" +
              "<div class='formule'>p ← 0 ; pour i de 1 à n : tant que x[i] − x[p+1] ≥ 50 : p ← p + 1 ; p[i] ← p</div>" +
              "p ne fait qu'augmenter, et de 1 à chaque tour de « tant que » : au plus n tours au total, plus n tests négatifs. Total O(n)." }));
            api.valider();
          } else if (r === n) api.retour(j + " / 7 justes. p(i) est la plus PROCHE des aires situées à 50 km ou plus avant i.", false);
          else api.retour("", null);
        }
      }
    },

    {
      titre: "Deux cas pour la dernière aire",
      texte: "<p>Sous-problème <b>Restau(j)</b> : on ne place des restaurants que sur les aires 1 … j ; OPT(j) est le revenu maximum, avec OPT(0) = 0. " +
        "Soit S*<sub>j</sub> une solution optimale de Restau(j). Soit elle contient j, soit non.</p>",
      objectif: "Exprimer r(S*ⱼ) dans les deux cas.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Si j ∉ S*ⱼ, alors r(S*ⱼ) = ?",
          options: ["OPT(j − 1)", "rⱼ + OPT(j − 1)", "OPT(p(j))", "rⱼ + OPT(p(j))"],
          bonne: 0,
          expliquer: [
            "Exact : S*ⱼ n'utilise que des aires ≤ j − 1, c'est donc une solution — et la meilleure — de Restau(j − 1).",
            "Non : j n'est pas dans la solution, son revenu ne compte pas.",
            "Non : sans restaurant en j, rien n'interdit d'utiliser les aires entre p(j) + 1 et j − 1.",
            "Non : c'est le cas où j est dans la solution."
          ],
          surReussite: function () {
            Exercices.choix(zone, {
              question: "Si j ∈ S*ⱼ, alors r(S*ⱼ) = ?",
              options: ["OPT(j − 1)", "rⱼ + OPT(j − 1)", "rⱼ + OPT(p(j))", "rⱼ + OPT(j − 2)"],
              bonne: 2,
              expliquer: [
                "Non : j est dans la solution, il rapporte rⱼ.",
                "Non : les aires entre p(j) + 1 et j − 1 sont à moins de 50 km de j, interdites.",
                "Exact : les autres aires de S*ⱼ vérifient j′ ≤ p(j) et forment une solution optimale de Restau(p(j)).",
                "Non : l'aire j − 1 peut être à 50 km de j ou pas ; c'est p(j) qui dit où l'on peut reprendre."
              ],
              surReussite: function () {
                zone.appendChild(Object.assign(el("div", "formule"), { textContent: "OPT(j) = max{ OPT(j − 1), rⱼ + OPT(p(j)) }" }));
                api.valider("Toute solution optimale contient j ou ne le contient pas : c'est la formule de récurrence (question e).");
              }
            });
          }
        });
      }
    },

    {
      titre: "Remplir la table OPT",
      texte: "<p>On calcule OPT[j] pour j = 0, 1, …, n dans l'ordre, avec OPT(j) = max{OPT(j − 1), r<sub>j</sub> + OPT(p(j))}. " +
        "Les deux cases utilisées sont encadrées. Tape chaque valeur.</p>",
      objectif: "Remplir OPT[1] à OPT[7].",
      installer: function (zone, api) {
        var j = 1;
        var t = tableau(zone);
        var info = el("p", "legende-figure"); zone.appendChild(info);
        function dessiner() {
          var h = "<tr><th>j</th>", rr = "<tr><th>rⱼ</th>", pp = "<tr><th>p(j)</th>", o = "<tr><th>OPT</th>";
          for (var k = 0; k <= n; k++) {
            h += "<th>" + k + "</th>";
            rr += "<td>" + (k ? R[k - 1] : "") + "</td>";
            pp += "<td>" + (k ? P[k] : "") + "</td>";
            var dep = j <= n && (k === j - 1 || k === P[j]);
            if (k < j) o += "<td class='" + (dep ? "dep" : "ok") + "'>" + OPT[k] + "</td>";
            else if (k === j) o += "<td class='courante'><input inputmode='numeric' aria-label='OPT[" + k + "]'></td>";
            else o += "<td class='vide'>·</td>";
          }
          t.innerHTML = h + "</tr>" + rr + "</tr>" + pp + "</tr>" + o + "</tr>";
          if (j <= n) {
            info.innerHTML = "<span>OPT(" + j + ") = max{ OPT(" + (j - 1) + "), r" + j + " + OPT(p(" + j + ")) } = max{ " + OPT[j - 1] + ", " + R[j - 1] + " + OPT(" + P[j] + ") }</span>";
            var inp = t.querySelector("input");
            inp.addEventListener("keydown", function (e) { if (e.key === "Enter") verif(inp); });
            inp.addEventListener("change", function () { verif(inp); });
          } else info.innerHTML = "<span>OPT = OPT[n] = <span class='mono'>" + OPT[n] + "</span></span>";
        }
        function verif(inp) {
          if (inp.dataset.fait || j > n) return;
          var v = parseInt(inp.value, 10);
          if (isNaN(v)) return;
          if (v === OPT[j]) {
            inp.dataset.fait = "1";
            api.retour("OPT[" + j + "] = " + v + (OPT[j] === OPT[j - 1] ? " (on ne prend pas l'aire " + j + ")." : " (on prend l'aire " + j + ")."), true);
            j++; dessiner();
            if (j > n) api.valider("OPT = " + OPT[n] + " : le même revenu qu'à l'étape 1.");
          } else api.retour("Non. Calcule " + R[j - 1] + " + OPT(" + P[j] + ") = " + (R[j - 1] + OPT[P[j]]) + " et compare à OPT(" + (j - 1) + ").", false);
        }
        dessiner();
      }
    },

    {
      titre: "Retrouver le placement",
      texte: "<p>La table donne la valeur OPT, pas le placement. La correction du TD1 utilise un tableau <b>prem</b> : prem[j] est l'aire de plus grand indice " +
        "utilisée dans la solution optimale de Restau(j). On part de k = prem[n], puis tant que p[k] > 0 : k ← prem[p[k]].</p>",
      objectif: "Toucher les aires du placement optimal, dans l'ordre de la reconstruction.",
      installer: function (zone, api) {
        var t = tableau(zone);
        var h = "<tr><th>j</th>", pp = "<tr><th>p(j)</th>", o = "<tr><th>OPT</th>", pr = "<tr><th>prem</th>";
        for (var k = 1; k <= n; k++) { h += "<th>" + k + "</th>"; pp += "<td>" + P[k] + "</td>"; o += "<td>" + OPT[k] + "</td>"; pr += "<td>" + PREM[k] + "</td>"; }
        t.innerHTML = h + "</tr>" + pp + "</tr>" + o + "</tr>" + pr + "</tr>";
        var faits = [];
        var route = new Autoroute(zone, function (i) {
          if (faits.length >= SOLUTION.length) return;
          var att = SOLUTION[faits.length];
          if (i === att) {
            faits.push(i); maj();
            if (faits.length === SOLUTION.length) {
              api.retour("S = (" + SOLUTION.join(", ") + ") : revenu " + SOLUTION.reduce(function (s, a) { return s + R[a - 1]; }, 0) + ".", true);
              api.valider("Les aires sortent dans l'ordre décroissant des indices, comme dans la correction.");
            } else api.retour("Aire " + i + " ; p(" + i + ") = " + P[i] + ", donc la suivante est prem[" + P[i] + "].", null);
          } else {
            var msg = faits.length ? "Non : la suivante est prem[p(" + faits[faits.length - 1] + ")] = prem[" + P[faits[faits.length - 1]] + "]." : "Non : on commence par k = prem[n] = prem[7].";
            api.retour(msg, false);
          }
        });
        function maj() { route.dessiner(function (i) { return faits.indexOf(i) >= 0 ? "choisie" : ""; }); }
        maj();
      }
    },

    {
      titre: "Complexité",
      texte: "<p>Bilan de la correction du TD1 : le calcul des p(i), la boucle sur j et la reconstruction.</p>",
      objectif: "Classer chaque affirmation en vrai ou faux.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Le calcul de tous les p(i) se fait en O(n).", vrai: true, explication: "p ne fait qu'augmenter, d'au plus n en tout." },
            { texte: "La boucle qui calcule OPT[1..n] est en O(n).", vrai: true, explication: "n passages, chacun en O(1) grâce aux tableaux p et OPT." },
            { texte: "La reconstruction du placement peut coûter O(n²).", vrai: false, explication: "O(n) : p[k] < k, donc k décroît strictement à chaque tour." },
            { texte: "Essayer tous les placements coûterait 2ⁿ essais.", vrai: true, explication: "Chaque aire est prise ou non." },
            { texte: "OPT(j) se calcule à partir de OPT(j − 1) et OPT(p(j)) seulement.", vrai: true, explication: "C'est ce qui rend la programmation dynamique possible : des sous-problèmes plus petits, déjà calculés." }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "restaurants",
    etapes: etapes,
    fin: {
      cartes: "prog-dyn",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir (TD1, exercice 1)</span><ul>" +
        "<li>p(i) : aire la plus proche avant i et à au moins 50 km ; calcul en O(n).</li>" +
        "<li>Restau(j) : OPT(j) = max{ OPT(j − 1), rⱼ + OPT(p(j)) }, OPT(0) = 0.</li>" +
        "<li>Table remplie en O(n) ; placement retrouvé avec prem en O(n).</li></ul></div>" +
        "<p>Méthode générale : définir un sous-problème, discuter sur le dernier élément (pris ou non), écrire la récurrence, remplir la table dans le bon ordre.</p>"
    }
  });
})();
