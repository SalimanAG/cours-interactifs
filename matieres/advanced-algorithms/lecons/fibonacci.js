/* Leçon : Fibonacci — trois algorithmes, trois complexités (cours 1, Introduction).
   Fil rouge : fibo(n), avec fibo(0) = 0, fibo(1) = 1, fibo(n) = fibo(n−1) + fibo(n−2). */
(function () {
  "use strict";
  var el = Site.el;
  var PHI = (1 + Math.sqrt(5)) / 2;
  function fib(n) { var a = 0, b = 1; for (var i = 0; i < n; i++) { var t = a + b; a = b; b = t; } return a; }
  function appels(n) { return n < 2 ? 1 : appels(n - 1) + appels(n - 2) + 1; }
  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function curseur(zone, min, max, val) {
    var l = el("label"), c = el("input"); c.type = "range"; c.min = min; c.max = max; c.value = val;
    zone.appendChild(l); zone.appendChild(c);
    return { lab: l, c: c };
  }

  var etapes = [
    {
      titre: "Des problèmes difficiles",
      texte: "<p>Le cours porte sur des <b>techniques algorithmiques pour résoudre des problèmes difficiles (NP-difficiles)</b>, typiquement des problèmes " +
        "d'<b>optimisation combinatoire</b> : chercher la meilleure solution (fonction objectif) parmi un grand nombre (fini) de solutions possibles. " +
        "Exemples du cours : placer k hôpitaux, répartir des tâches sur des postes de travail.</p>" +
        "<p>Complexité polynomiale : traite de grandes instances. Complexité exponentielle : traite seulement de petites instances.</p>",
      objectif: "Associer chaque technique du cours au type de solution qu'elle donne.",
      installer: function (zone, api) {
        var options = ["?", "solution exacte", "solution souvent optimale", "solution proche de l'optimal"];
        var q = [
          ["algorithmes polynomiaux", "solution exacte"],
          ["algorithmes probabilistes", "solution souvent optimale"],
          ["branching", "solution exacte"],
          ["programmation dynamique", "solution exacte"],
          ["algorithmes d'approximation", "solution proche de l'optimal"]
        ];
        var sels = q.map(function (x) {
          var l = el("div", "saisie"); l.style.margin = ".3rem 0";
          var lab = el("label", null, x[0]); lab.style.flex = "1 1 12rem";
          var s = el("select");
          options.forEach(function (o) { var op = el("option", null, o); op.value = o; s.appendChild(op); });
          s.addEventListener("change", verifier);
          l.appendChild(lab); l.appendChild(s); zone.appendChild(l);
          return s;
        });
        function verifier() {
          var j = 0, r = 0;
          sels.forEach(function (s, i) { if (s.value !== "?") r++; if (s.value === q[i][1]) j++; });
          if (j === q.length) {
            api.retour("C'est le tableau « Objectifs du cours ».", true);
            api.valider("Ces techniques reviennent dans chaque chapitre : probabiliste (coupe minimum), approximation (équilibrage de charges, sac à dos), branching (stable maximum), programmation dynamique (sac à dos, TD1).");
          } else if (r === q.length) api.retour(j + " / 5 justes.", false);
          else api.retour("", null);
        }
      }
    },

    {
      titre: "Fibonacci récursif : l'arbre des appels",
      texte: "<p>« Bien implémenter et avoir des machines puissantes, ça suffit ? » Le cours répond avec un exemple basique.</p>" +
        "<div class='formule'>fibo(n) : si n = 0 retourner 0 ; si n = 1 retourner 1 ; sinon retourner fibo(n−1) + fibo(n−2)</div>" +
        "<p>Chaque appel en lance deux autres. Fais varier n et regarde l'arbre des appels grossir.</p>",
      objectif: "Compter le nombre d'appels de fibo(5).",
      installer: function (zone, api) {
        var fig = new FigureGraphe(cadre(zone), { largeur: 340, hauteur: 190 });
        var s = curseur(zone, 2, 6, 4);
        function maj() {
          var n = +s.c.value;
          s.lab.innerHTML = "n = <span class='mono'>" + n + "</span> · appels : <span class='mono'>" + appels(n) + "</span>";
          var S = [], A = [], feuille = 0, prof = 0, id = 0;
          (function profondeur(k, d) { prof = Math.max(prof, d); if (k >= 2) { profondeur(k - 1, d + 1); profondeur(k - 2, d + 1); } })(n, 0);
          var nbFeuilles = fib(n + 1);
          function poser(k, d) {
            var mon = "n" + (id++), x;
            if (k < 2) { x = 12 + (feuille + 0.5) * 316 / nbFeuilles; feuille++; }
            else {
              var g = poser(k - 1, d + 1), dr = poser(k - 2, d + 1);
              x = (g.x + dr.x) / 2;
              A.push({ id: "a" + g.id, u: mon, v: g.id }, { id: "a" + dr.id, u: mon, v: dr.id });
            }
            var noeud = { id: mon, x: x, y: 14 + d * (162 / Math.max(1, prof)), label: String(k), classe: k < 2 ? "plein" : "" };
            S.push(noeud);
            return noeud;
          }
          poser(n, 0);
          fig.dessiner({ sommets: S, aretes: A });
          var r = nbFeuilles > 8 ? 8 : 11;
          Array.prototype.forEach.call(fig.racine.querySelectorAll("circle"), function (c) { c.setAttribute("r", r); });
          Array.prototype.forEach.call(fig.racine.querySelectorAll(".sommet text"), function (t) { t.style.fontSize = (r + 2) + "px"; });
        }
        s.c.addEventListener("input", maj);
        maj();
        Exercices.nombre(zone, {
          label: "appels pour fibo(5) =", attendu: 15, tolerance: 0, placeholder: "ex. 9",
          indice: "Mets n = 5 et compte les nœuds, ou utilise appels(n) = appels(n−1) + appels(n−2) + 1 avec appels(0) = appels(1) = 1.",
          bravo: "15 appels — et fibo(3) est recalculé 2 fois, fibo(2) 3 fois : on refait sans cesse le même travail.",
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Analyse : Tₙ = Θ(φⁿ)",
      texte: "<p>Analyse de complexité du cours, avec T<sub>n</sub> le temps de calcul de fibo(n) :</p>" +
        "<div class='formule'>Tₙ = Tₙ₋₁ + Tₙ₋₂ + 1</div>" +
        "<p>Résolution par le polynôme caractéristique x² − x − 1 : 2 racines (1 + √5)/2 et (1 − √5)/2 ; la plus grande en valeur absolue est (1 + √5)/2, " +
        "donc T<sub>n</sub> = Θ(((1 + √5)/2)ⁿ). Vérifie-le : le rapport T<sub>n</sub>/T<sub>n−1</sub> se stabilise.</p>",
      objectif: "Donner la valeur de la plus grande racine (à 0,01 près).",
      installer: function (zone, api) {
        var s = curseur(zone, 3, 40, 10);
        var t = el("table", "tableau");
        zone.appendChild(t);
        function maj() {
          var n = +s.c.value;
          var T = [1, 1];
          for (var i = 2; i <= n; i++) T.push(T[i - 1] + T[i - 2] + 1);
          s.lab.innerHTML = "n = <span class='mono'>" + n + "</span>";
          t.innerHTML = "<tr><th>quantité</th><th class='num'>valeur</th></tr>" +
            "<tr><td>Tₙ (appels)</td><td class='num'>" + T[n].toLocaleString("fr-FR") + "</td></tr>" +
            "<tr><td>Tₙ / Tₙ₋₁</td><td class='num'>" + (T[n] / T[n - 1]).toFixed(5) + "</td></tr>";
        }
        s.c.addEventListener("input", maj);
        maj();
        Exercices.nombre(zone, {
          label: "(1 + √5)/2 ≈", attendu: PHI, tolerance: 0.01, placeholder: "ex. 1,5",
          indice: "√5 ≈ 2,236. Ou lis la limite du rapport dans le tableau, pour n grand.",
          bravo: "φ = (1 + √5)/2 ≈ 1,618 : le temps est multiplié par environ 1,62 à chaque fois que n augmente de 1. Le cours écrit O(1.62ⁿ).",
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Programmation dynamique : un tableau",
      texte: "<p>Au lieu de recalculer, on mémorise : on réserve un tableau T, on pose T[0] ← 0 ; T[1] ← 1, puis pour i de 2 à n : T[i] ← T[i − 1] + T[i − 2]. " +
        "Remplis le tableau toi-même, case par case.</p>",
      objectif: "Remplir le tableau jusqu'à T[10].",
      installer: function (zone, api) {
        var N = 10, k = 2;
        var wrap = el("div", "defile-x");
        var t = el("table", "table-pd");
        wrap.appendChild(t); zone.appendChild(wrap);
        var info = el("p", "legende-figure");
        zone.appendChild(info);
        function dessiner() {
          var h = "<tr><th>i</th>", v = "<tr><th>T[i]</th>";
          for (var i = 0; i <= N; i++) {
            h += "<th>" + i + "</th>";
            if (i < k) v += "<td class='" + (i === k - 1 || i === k - 2 ? "dep" : "ok") + "'>" + fib(i) + "</td>";
            else if (i === k) v += "<td class='courante'><input inputmode='numeric' aria-label='T[" + i + "]'></td>";
            else v += "<td class='vide'>·</td>";
          }
          t.innerHTML = h + "</tr>" + v + "</tr>";
          var inp = t.querySelector("input");
          if (inp) {
            inp.addEventListener("keydown", function (e) { if (e.key === "Enter") verifier(inp); });
            inp.addEventListener("change", function () { verifier(inp); });
            inp.focus({ preventScroll: true });
          }
          info.innerHTML = "<span>passages dans la boucle : <span class='mono'>" + (k - 2) + "</span></span>";
        }
        function verifier(inp) {
          if (inp.dataset.fait || k > N) return;
          var v = parseInt(inp.value, 10);
          if (isNaN(v)) return;
          if (v === fib(k)) {
            inp.dataset.fait = "1";
            api.retour("T[" + k + "] = T[" + (k - 1) + "] + T[" + (k - 2) + "] = " + fib(k - 1) + " + " + fib(k - 2) + " = " + v + ".", true);
            k++;
            if (k > N) {
              k = N + 1;
              dessiner();
              api.valider("Chaque passage dans la boucle prend un temps O(1) et il y a n − 1 passages : total O(n). Ici 9 passages pour n = 10, au lieu de 177 appels en récursif.");
            } else dessiner();
          } else {
            api.retour("Non : T[" + k + "] = T[" + (k - 1) + "] + T[" + (k - 2) + "] (les deux cases encadrées).", false);
          }
        }
        dessiner();
      }
    },

    {
      titre: "Exponentiation rapide de matrice",
      texte: "<p>On remarque que, pour n ≥ 2 :</p>" +
        "<div class='formule'>(fibo(n), fibo(n−1)) = A · (fibo(n−1), fibo(n−2))   avec A = [[1, 1], [1, 0]]</div>" +
        "<p>d'où (fibo(n), fibo(n−1)) = Aⁿ⁻¹ · (fibo(1), fibo(0)) : fibo(n) est le coefficient en haut à gauche de Aⁿ⁻¹. " +
        "L'<b>exponentiation rapide</b> calcule Aᵏ avec l'écriture binaire de k = Σ bᵢ 2ⁱ : on calcule les A^(2ⁱ) par carrés successifs " +
        "(A^(2ⁱ⁺¹) = A^(2ⁱ) · A^(2ⁱ)), puis on multiplie ceux pour lesquels bᵢ = 1.</p>" +
        "<p>Pour fibo(13), il faut A¹² ; et 12 s'écrit 1100 en binaire.</p>",
      objectif: "Choisir les puissances A^(2ⁱ) à multiplier pour obtenir A¹².",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          question: "A¹² = produit de :",
          options: ["A¹", "A²", "A⁴", "A⁸"],
          bonnes: [2, 3],
          explication: "12 = 8 + 4 = 1100₂, donc A¹² = A⁴ · A⁸ = [[233, 144], [144, 89]] et fibo(13) = 233. " +
            "Il a fallu 3 carrés (A², A⁴, A⁸) et 1 produit : la multiplication de matrices 2 × 2 est en O(1), l'exponentiation rapide en O(log n). Total O(log n).",
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Comparaison des trois méthodes",
      texte: "<p>Complexités temporelles du cours : récursif O(1.62ⁿ), programmation dynamique O(n), exponentiation rapide O(log n). " +
        "Ordre de grandeur du nombre d'opérations, et du temps à 10⁹ opérations par seconde :</p>" +
        "<div class='signalement'>L'« application numérique » du cours est faite à la main sur la diapo et n'est pas lisible dans le PDF. " +
        "Les temps ci-dessous sont mes propres calculs, avec l'hypothèse de 10⁹ opérations par seconde.</div>",
      objectif: "Dire quelles méthodes calculent fibo(100) en moins d'une seconde.",
      installer: function (zone, api) {
        var s = curseur(zone, 10, 100, 40);
        var t = el("table", "tableau");
        zone.appendChild(t);
        function duree(op) {
          var sec = op / 1e9;
          if (sec < 1e-3) return "< 1 ms";
          if (sec < 1) return Math.round(sec * 1000) + " ms";
          if (sec < 3600) return Math.round(sec) + " s";
          if (sec < 86400 * 365) return Math.round(sec / 3600) + " h";
          var ans = sec / (86400 * 365);
          return ans < 1e6 ? Math.round(ans).toLocaleString("fr-FR") + " ans" : ans.toExponential(1).replace("e+", " × 10^") + " ans";
        }
        function maj() {
          var n = +s.c.value;
          s.lab.innerHTML = "n = <span class='mono'>" + n + "</span>";
          var r = Math.pow(1.62, n), d = n, e = Math.log(n) / Math.LN2;
          t.innerHTML = "<tr><th>méthode</th><th class='num'>opérations</th><th class='num'>temps</th></tr>" +
            "<tr><td>récursif</td><td class='num'>" + r.toExponential(1).replace("e+", "·10^") + "</td><td class='num'>" + duree(r) + "</td></tr>" +
            "<tr><td>prog. dynamique</td><td class='num'>" + d + "</td><td class='num'>" + duree(d) + "</td></tr>" +
            "<tr><td>exponentiation rapide</td><td class='num'>" + e.toFixed(1) + "</td><td class='num'>" + duree(e) + "</td></tr>";
        }
        s.c.addEventListener("input", maj);
        maj();
        Exercices.cocher(zone, {
          question: "Pour n = 100, lesquelles répondent en moins d'une seconde ?",
          options: ["récursif", "programmation dynamique", "exponentiation rapide"],
          bonnes: [1, 2],
          explication: "1,62¹⁰⁰ ≈ 10²¹ opérations : environ 30 000 ans à 10⁹ op/s. Une machine plus puissante n'y change rien ; c'est l'algorithme qui compte.",
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "fibonacci",
    etapes: etapes,
    fin: {
      cartes: "intro",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul>" +
        "<li>Récursif : Tₙ = Tₙ₋₁ + Tₙ₋₂ + 1, donc Θ(((1+√5)/2)ⁿ) ≈ O(1.62ⁿ).</li>" +
        "<li>Programmation dynamique : un tableau, n − 1 passages en O(1), donc O(n).</li>" +
        "<li>Exponentiation rapide de A = [[1,1],[1,0]] : O(log n).</li>" +
        "<li>Bien implémenter et avoir une machine puissante ne suffit pas : l'algorithme compte.</li></ul></div>"
    }
  });
})();
