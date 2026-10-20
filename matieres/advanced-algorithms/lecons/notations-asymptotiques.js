/* Leçon : Notations O, Ω, Θ (prérequis — question 1 du test d'autopositionnement).
   Fil rouge : les fonctions du test, n, 4n, n log n, n², 2ⁿ (log en base 2). */
(function () {
  "use strict";
  var el = Site.el;
  function lg(x) { return Math.log(x) / Math.LN2; }
  var F = {
    n: { label: "n", f: function (x) { return x; } },
    nlogn: { label: "n log n", f: function (x) { return x <= 0 ? 0 : x * lg(x); } },
    n2: { label: "n²", f: function (x) { return x * x; } },
    exp: { label: "2ⁿ", f: function (x) { return Math.pow(2, x); } }
  };
  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function curseur(zone, label, min, max, val) {
    var l = el("label", null);
    var c = el("input"); c.type = "range"; c.min = min; c.max = max; c.value = val; c.step = 1;
    zone.appendChild(l); zone.appendChild(c);
    return { lab: l, c: c, label: label };
  }
  var NOTE_SOURCE = "<div class='signalement'>Ces notions ne sont pas dans tes documents d'Advanced Algorithms : " +
    "j'utilise les définitions standard de l'<i>Introduction à l'algorithmique</i> (Cormen et al.), le livre que ton prof recommande. " +
    "On écrit f = O(g) par abus de notation : O(g) est un ensemble de fonctions, et « = » se lit « est dans ».</div>";

  var etapes = [
    {
      titre: "Qui finit au-dessus ?",
      texte: "<p>En algorithmique, on compare des temps de calcul quand <b>n devient grand</b>. " +
        "Fais varier n et regarde le tableau : pour les petites valeurs, l'ordre change ; à partir d'un certain rang, il ne bouge plus.</p>" + NOTE_SOURCE,
      objectif: "Trouver à partir de quel n on a 2ⁿ > n² pour toujours.",
      installer: function (zone, api) {
        var g = new Courbes(cadre(zone), { largeur: 340, hauteur: 210 });
        var s = curseur(zone, "n", 1, 12, 3);
        var t = el("table", "tableau");
        zone.appendChild(t);
        function maj() {
          var n = +s.c.value;
          s.lab.innerHTML = "n = <span class='mono'>" + n + "</span>";
          var xmax = Math.max(n, 6);
          g.dessiner({
            xmin: 1, xmax: xmax, ymax: Math.max(F.n2.f(xmax), 8) * 1.25,
            fonctions: [
              { label: "n", f: F.n.f, classe: "pale" },
              { label: "n log n", f: F.nlogn.f, classe: "pale" },
              { label: "n²", f: F.n2.f, classe: "ref" },
              { label: "2ⁿ", f: F.exp.f, classe: "courante" }
            ],
            marque: { x: n, texte: "n=" + n }
          });
          var a = F.exp.f(n), b = F.n2.f(n);
          t.innerHTML = "<tr><th>pour n = " + n + "</th><th class='num'>valeur</th></tr>" +
            "<tr><td>n log n</td><td class='num'>" + (Math.round(F.nlogn.f(n) * 10) / 10) + "</td></tr>" +
            "<tr><td>n²</td><td class='num'>" + b + "</td></tr>" +
            "<tr><td>2ⁿ</td><td class='num'>" + a + "</td></tr>" +
            "<tr><td>comparaison</td><td class='num'>" + (a > b ? "2ⁿ > n²" : a === b ? "2ⁿ = n²" : "2ⁿ < n²") + "</td></tr>";
        }
        s.c.addEventListener("input", maj);
        maj();
        Exercices.nombre(zone, {
          label: "2ⁿ > n² pour tout n ≥",
          attendu: 5, tolerance: 0,
          placeholder: "ex. 7",
          indice: "Regarde les valeurs n = 2, 3, 4, 5 : l'ordre change plusieurs fois avant de se fixer.",
          bravo: "Exact : n = 2 et n = 4 donnent l'égalité, n = 3 donne 2ⁿ < n², et à partir de 5, 2ⁿ reste au-dessus.",
          surReussite: function () { api.valider("C'est l'idée de « à partir d'un certain rang n₀ » : les petits n ne comptent pas."); }
        });
      }
    },

    {
      titre: "La définition de O",
      texte: "<div class='encadre'><span class='titre-encadre'>Définition</span>" +
        "f(n) = O(g(n)) s'il existe une constante c > 0 et un rang n₀ tels que, pour tout n ≥ n₀, f(n) ≤ c · g(n).</div>" +
        "<p>O donne une <b>borne supérieure</b> à une constante près. Prenons f(n) = 4n + 12 et g(n) = n. " +
        "Règle c et n₀ pour que la courbe de f (en couleur) reste sous c · n (pointillés) partout à droite de n₀.</p>",
      objectif: "Trouver un couple (c, n₀) qui prouve que 4n + 12 = O(n).",
      installer: function (zone, api) {
        var g = new Courbes(cadre(zone), { largeur: 340, hauteur: 210 });
        var sc = curseur(zone, "c", 1, 10, 3);
        var sn = curseur(zone, "n₀", 1, 30, 1);
        var info = el("p", "legende-figure");
        zone.appendChild(info);
        function f(n) { return 4 * n + 12; }
        function maj() {
          var c = +sc.c.value, n0 = +sn.c.value;
          sc.lab.innerHTML = "c = <span class='mono'>" + c + "</span>";
          sn.lab.innerHTML = "n₀ = <span class='mono'>" + n0 + "</span>";
          g.dessiner({
            xmin: 0, xmax: 40, ymax: 250,
            zone: { de: n0 }, marque: { x: n0, texte: "n₀" },
            fonctions: [
              { label: "4n+12", f: f, classe: "courante" },
              { label: c + "·n", f: function (n) { return c * n; }, classe: "ref" }
            ]
          });
          var echec = null;
          for (var n = n0; n <= 2000; n++) if (f(n) > c * n) { echec = n; break; }
          if (echec === null) {
            info.innerHTML = "<span>Pour tout n ≥ " + n0 + " : 4n + 12 ≤ " + c + "n ✓</span>";
            api.retour("c = " + c + " et n₀ = " + n0 + " conviennent.", true);
            api.valider("Il suffit d'UN couple (c, n₀). Ici (c − 4)·n ≥ 12 : il faut c > 4, puis n₀ ≥ 12/(c − 4). Et pour 4n = O(n) (question du test), c = 4 et n₀ = 1 suffisent.");
          } else {
            info.innerHTML = "<span>Contre-exemple : n = <span class='mono'>" + echec + "</span>, 4n + 12 = " + f(echec) + " > " + (c * echec) + "</span>";
            api.retour("", null);
          }
        }
        sc.c.addEventListener("input", maj);
        sn.c.addEventListener("input", maj);
        maj();
      }
    },

    {
      titre: "O n'est pas symétrique",
      texte: "<p>Question du test : « n log n = O(n) » ? Il faudrait une constante c telle que n log n ≤ c · n pour tous les grands n, " +
        "c'est-à-dire log n ≤ c. Essaie des valeurs de c de plus en plus grandes.</p>",
      objectif: "Conclure sur n log n = O(n) et sur n = O(n log n).",
      installer: function (zone, api) {
        var g = new Courbes(cadre(zone), { largeur: 340, hauteur: 210 });
        var sc = curseur(zone, "c", 1, 10, 2);
        var info = el("p", "legende-figure");
        zone.appendChild(info);
        function maj() {
          var c = +sc.c.value;
          sc.lab.innerHTML = "c = <span class='mono'>" + c + "</span>";
          var seuil = Math.pow(2, c);
          var xmax = seuil * 2.5;
          g.dessiner({
            xmin: 1, xmax: xmax, ymax: F.nlogn.f(xmax) * 1.1,
            marque: { x: seuil, texte: "2^" + c },
            fonctions: [
              { label: "n log n", f: F.nlogn.f, classe: "courante" },
              { label: c + "·n", f: function (n) { return c * n; }, classe: "ref" }
            ]
          });
          info.innerHTML = "<span>Pour c = " + c + " : n log n > " + c + "·n dès que n > 2<sup>" + c + "</sup> = <span class='mono'>" + seuil + "</span></span>";
        }
        sc.c.addEventListener("input", maj);
        maj();
        Exercices.choix(zone, {
          question: "Conclusion ?",
          options: [
            "n log n = O(n) est faux, mais n = O(n log n) est vrai.",
            "n log n = O(n) est vrai, il suffit de prendre c assez grand.",
            "Les deux sont vrais : log n grandit très lentement."
          ],
          bonne: 0,
          expliquer: [
            "Exact. Quel que soit c, n log n dépasse c·n dès que n > 2^c : aucune constante ne marche. À l'inverse n ≤ 1 · n log n pour n ≥ 2, donc n = O(n log n). O est une inégalité « ≤ », pas une égalité.",
            "Non : chaque c finit par être dépassé (dès n > 2^c). Une constante fixée ne suffit jamais.",
            "Lentement, mais sans limite : log n dépasse n'importe quelle constante c."
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Les constantes ne comptent pas",
      texte: "<p>Comme la définition autorise un facteur c, multiplier par une constante ne change pas la classe : " +
        "4n et n sont « de même taille à une constante multiplicative près » (c'est la correction du test). " +
        "De même, les termes d'ordre inférieur disparaissent : 3n² + 5n ≤ 8n² pour n ≥ 1.</p>",
      objectif: "Classer chaque affirmation en vrai ou faux.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "4n = O(n)", vrai: true, explication: "c = 4." },
            { texte: "n = O(4n)", vrai: true, explication: "c = 1 (et même c = 1/4)." },
            { texte: "n² = O(n)", vrai: false, explication: "n² ≤ c·n voudrait dire n ≤ c pour tous les grands n : impossible." },
            { texte: "100 = O(1)", vrai: true, explication: "Une constante est O(1), quelle que soit sa valeur." },
            { texte: "3n² + 5n = O(n²)", vrai: true, explication: "3n² + 5n ≤ 8n² pour n ≥ 1." }
          ],
          surReussite: function () { api.valider("Retiens : on garde le terme dominant et on oublie sa constante."); }
        });
      }
    },

    {
      titre: "L'échelle des croissances",
      texte: "<p>Les classes qui reviennent tout le temps en algorithmique se rangent sur une échelle : chacune est O de la suivante, mais pas l'inverse.</p>",
      objectif: "Ranger les six fonctions de la plus lente à la plus rapide.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche-les de la plus lente à la plus rapide.",
          items: ["1", "log n", "n", "n log n", "n²", "2ⁿ"],
          bravo: "1 < log n < n < n log n < n² < 2ⁿ.",
          surReussite: function () {
            api.valider("Conséquence : n = O(2ⁿ) et n log n = O(n²) sont vraies (on monte l'échelle), n² = O(n) est fausse (on la descend).");
          }
        });
      }
    },

    {
      titre: "Ω et Θ",
      texte: "<div class='encadre'><span class='titre-encadre'>Définitions</span>" +
        "f(n) = Ω(g(n)) s'il existe c > 0 et n₀ tels que pour tout n ≥ n₀, f(n) ≥ c · g(n) : une <b>borne inférieure</b>. " +
        "Autrement dit f = Ω(g) ⇔ g = O(f).<br>f(n) = Θ(g(n)) si f = O(g) <b>et</b> f = Ω(g) : f est encadrée, « du même ordre » que g.</div>" +
        "<p>Exemple du cours 1 : le Fibonacci récursif prend un temps T<sub>n</sub> = Θ(((1+√5)/2)ⁿ).</p>",
      objectif: "Classer chaque affirmation en vrai ou faux.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "n log n = Ω(n)", vrai: true, explication: "Car n = O(n log n)." },
            { texte: "n = Θ(4n)", vrai: true, explication: "n = O(4n) et 4n = O(n)." },
            { texte: "n² = Θ(n log n)", vrai: false, explication: "n² = Ω(n log n) oui, mais n² ≠ O(n log n)." },
            { texte: "2ⁿ = Ω(n²)", vrai: true, explication: "2ⁿ ≥ n² dès n ≥ 5 (étape 1)." },
            { texte: "n = Ω(n²)", vrai: false, explication: "Il faudrait n ≥ c·n², donc 1 ≥ c·n : faux pour n grand." }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Refaire la question 1 du test",
      texte: "<p>La même question que dans le test d'autopositionnement. Tu avais coché « n log n = O(n) » et laissé passer trois relations vraies.</p>",
      objectif: "Cocher exactement les relations vraies.",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          question: "Parmi les relations suivantes, lesquelles sont vraies ?",
          options: ["n log n = O(n²)", "n = O(n log n)", "n log n = O(n)", "n = O(4n)", "n = O(2ⁿ)", "4n = O(n)", "n² = O(n)"],
          bonnes: [0, 1, 3, 4, 5],
          explication: "Cinq vraies : on peut toujours monter l'échelle 1 < log n < n < n log n < n² < 2ⁿ, et les constantes ne comptent pas. Les deux fausses descendent l'échelle.",
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "notations-asymptotiques",
    etapes: etapes,
    fin: {
      cartes: "prerequis",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul>" +
        "<li>f = O(g) : ∃ c > 0, n₀, ∀ n ≥ n₀, f(n) ≤ c·g(n). Borne supérieure.</li>" +
        "<li>f = Ω(g) ⇔ g = O(f). Borne inférieure. f = Θ(g) : les deux.</li>" +
        "<li>On garde le terme dominant, on oublie les constantes.</li>" +
        "<li>1 < log n < n < n log n < n² < 2ⁿ.</li></ul></div>"
    }
  });
})();
