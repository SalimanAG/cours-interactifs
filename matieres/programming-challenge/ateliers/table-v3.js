/* Atelier : remplir la table V3 (cours 6, sac à dos sans répétition, exercice 3).
   V3(w, k) = max(V3(w − w_k, k − 1) + v_k, V3(w, k − 1))   si w > 0 et k > 0
            = −∞                                           si w < 0 ou k < 0
            = 0                                            sinon. */
(function () {
  "use strict";
  var el = Site.el;
  var E = SacADos.EX3;
  var T = SacADos.V3(E.objets, E.W);
  var COLS = SacADos.colonnes(E.W);

  function donnees(zone) {
    var tb = el("table", "tableau");
    tb.innerHTML = "<tr><th>k</th>" + E.objets.map(function (o, i) { return "<th class='num'>" + (i + 1) + "</th>"; }).join("") + "</tr>" +
      "<tr><td>w<sub>k</sub></td>" + E.objets.map(function (o) { return "<td class='num'>" + o[0] + "</td>"; }).join("") + "</tr>" +
      "<tr><td>v<sub>k</sub></td>" + E.objets.map(function (o) { return "<td class='num'>" + o[1] + "</td>"; }).join("") + "</tr>";
    zone.appendChild(tb);
  }
  function lignes(jusqua, aRemplir) {
    var L = [];
    for (var k = 0; k <= jusqua; k++) {
      L.push({ nom: "k=" + k, valeurs: T[k], remplir: k === aRemplir ? COLS.slice(1).map(function (c) { return c; }) : false });
    }
    return L;
  }
  function deps(l, c) {
    var k = l, wk = E.objets[k - 1][0];
    var d = [[l - 1, c]];
    if (c - wk >= 0) d.push([l - 1, c - wk]);
    return d;
  }
  function aide(l, c) {
    var k = l, wk = E.objets[k - 1][0], vk = E.objets[k - 1][1];
    var sans = T[k - 1][c];
    if (c - wk < 0) return "w = " + c + " < w_" + k + " = " + wk + " : l'objet " + k + " ne rentre pas → V3(" + c + ", " + (k - 1) + ") = " + sans + ".";
    return "max(V3(" + (c - wk) + ", " + (k - 1) + ") + " + vk + " = " + (T[k - 1][c - wk] + vk) + " ; V3(" + c + ", " + (k - 1) + ") = " + sans + ").";
  }
  function etapeLigne(k, message) {
    return function (zone, api) {
      donnees(zone);
      new TablePD(zone, {
        colonnes: COLS, coin: "k\\w", lignes: lignes(k, k), deps: deps, aide: aide,
        surFin: function () { api.valider(message); }
      });
      PC.html(zone, "La colonne w = 0 vaut toujours 0 (cas « sinon »). Les deux cases encadrées sont celles dont dépend la case en cours : « sans l'objet k » (juste au-dessus) et « avec l'objet k » (au-dessus, w_k colonnes à gauche).", "discret petit");
    };
  }

  var etapes = [
    {
      titre: "Ligne k = 1",
      texte: "<p>V3(w, k) = meilleure valeur avec un poids ≤ w en n'utilisant <b>qu'un sous-ensemble des objets 1 à k</b>, chacun au plus une fois. " +
        "La ligne k = 0 (aucun objet) vaut 0 partout. Remplis la ligne k = 1 (objet 1 : poids 8, valeur 3).</p>",
      objectif: "Remplir V3(·, 1).",
      installer: etapeLigne(1, "Avec le seul objet 1 : 0 tant que w < 8, puis 3.")
    },
    {
      titre: "Ligne k = 2",
      texte: "<p>Objet 2 : poids 5, valeur 2. Pour chaque w : le prendre (V3(w − 5, 1) + 2) ou non (V3(w, 1)).</p>",
      objectif: "Remplir V3(·, 2).",
      installer: etapeLigne(2, "À partir de w = 13, on peut prendre les objets 1 et 2 ensemble : 3 + 2 = 5.")
    },
    {
      titre: "Ligne k = 3",
      texte: "<p>Objet 3 : poids 3, valeur 1.</p>",
      objectif: "Remplir V3(·, 3).",
      installer: etapeLigne(3, "V3(16, 3) = 6 : les trois objets ensemble (8 + 5 + 3 = 16, valeur 6).")
    },
    {
      titre: "La table complète et la solution",
      texte: "<p>Les lignes 4 à 6 se remplissent de la même façon (table du cours). Lis la valeur optimale, puis retrouve <b>un</b> ensemble d'objets qui l'atteint " +
        "(en remontant : si V3(w, k) ≠ V3(w, k − 1), l'objet k est pris).</p>",
      objectif: "Donner la valeur optimale et un ensemble d'objets optimal.",
      installer: function (zone, api) {
        donnees(zone);
        var L = []; for (var k = 0; k <= 6; k++) L.push({ nom: "k=" + k, valeurs: T[k], remplir: false });
        new TablePD(zone, { colonnes: COLS, coin: "k\\w", lignes: L });
        Exercices.nombre(zone, {
          label: "valeur optimale V3(17, 6) =", attendu: T[6][17], tolerance: 0, placeholder: "ex. 6",
          bravo: "Exact : 7.",
          surReussite: function () {
            var lab = el("p", null, "Coche un ensemble d'objets de poids total ≤ 17 et de valeur 7 :");
            zone.appendChild(lab);
            var box = el("div", "cocher"); zone.appendChild(box);
            var cases = E.objets.map(function (o, i) {
              var l = el("label"); var c = el("input"); c.type = "checkbox";
              l.appendChild(c); l.appendChild(el("span", "mono", "objet " + (i + 1) + "  (w = " + o[0] + ", v = " + o[1] + ")"));
              box.appendChild(l); return c;
            });
            var b = el("button", "btn", "Vérifier"); b.type = "button"; zone.appendChild(b);
            var r = el("div", "retour"); zone.appendChild(r);
            b.onclick = function () {
              var w = 0, v = 0, liste = [];
              cases.forEach(function (c, i) { if (c.checked) { w += E.objets[i][0]; v += E.objets[i][1]; liste.push(i + 1); } });
              if (w <= E.W && v === T[6][17]) {
                r.className = "retour ok"; r.textContent = "Objets " + liste.join(", ") + " : poids " + w + ", valeur " + v + ".";
                b.disabled = true; cases.forEach(function (c) { c.disabled = true; });
                api.valider("Par exemple 6 (3, 2) + 2 (5, 2) + 1 (8, 3) : poids 16, valeur 7. En remontant la table : V3(17, 6) = 7 ≠ V3(17, 5) = 6, donc l'objet 6 est pris ; on continue depuis V3(14, 5)…");
              } else {
                r.className = "retour ko"; r.textContent = "Poids " + w + (w > E.W ? " > 17" : "") + ", valeur " + v + (v !== 7 ? " ≠ 7" : "") + ".";
              }
            };
          }
        });
        PC.code(zone,
          "def v3(objets, W):                      # sans répétition\n" +
          "    n = len(objets)\n" +
          "    T = [[0] * (W + 1) for _ in range(n + 1)]   # T[k][w], ligne k = 0 à 0\n" +
          "    for k in range(1, n + 1):\n" +
          "        wk, vk = objets[k - 1]\n" +
          "        for w in range(1, W + 1):\n" +
          "            T[k][w] = T[k - 1][w]                     # sans l'objet k\n" +
          "            if wk <= w:\n" +
          "                T[k][w] = max(T[k][w], T[k - 1][w - wk] + vk)   # avec\n" +
          "    return T[n][W]                       # O(n × W)");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "table-v3",
    etapes: etapes,
    fin: { cartes: "prog-dyn", texte: "<p>Sans répétition, chaque objet est examiné une seule fois : la ligne k ne dépend que de la ligne k − 1. Avec répétition (V1), on pouvait réutiliser un objet : une seule dimension suffisait.</p>" }
  });
})();
