/* Atelier : remplir la table OPT(i, V) du sac à dos à valeurs entières.
   Algorithme du cours 5 (= TD1, exercice 2). Fil rouge : l'exemple de la diapo
   « Exemple » du cours 5 : v = (4, 1, 3, 5, 2), w = (2, 3, 5, 4, 1). */
(function () {
  "use strict";
  var el = Site.el;
  var v = [4, 1, 3, 5, 2], w = [2, 3, 5, 4, 1];
  var n = v.length;
  var W = 7;
  var Smax = v.reduce(function (a, b) { return a + b; }, 0);
  function S(i) { var s = 0; for (var j = 0; j < i; j++) s += v[j]; return s; }

  // OPT[i][V] (undefined si V > S(i))
  var OPT = [];
  for (var i = 0; i <= n; i++) { OPT.push([]); OPT[i][0] = 0; }
  var ORDRE = []; // cellules dans l'ordre de l'algorithme : { i, V, cas, deps: [[i,V],…] }
  for (i = 1; i <= n; i++) {
    for (var V = 1; V <= S(i); V++) {
      var r = Math.max(0, V - v[i - 1]);
      var prend = w[i - 1] + OPT[i - 1][r];
      if (V > S(i - 1)) { OPT[i][V] = prend; ORDRE.push({ i: i, V: V, cas: 1, deps: [[i - 1, r]] }); }
      else { OPT[i][V] = Math.min(OPT[i - 1][V], prend); ORDRE.push({ i: i, V: V, cas: 2, deps: [[i - 1, V], [i - 1, r]] }); }
    }
  }
  function reponse() { var best = 0; for (var V = 0; V <= Smax; V++) if (OPT[n][V] <= W) best = V; return best; }

  /* Dessine la table. etat(i, V) → "ok" | "courante" | "dep" | "vide" | "saisie" | "cachee" */
  function Table(zone) {
    var wrap = el("div", "defile-x");
    this.t = el("table", "table-pd");
    wrap.appendChild(this.t); zone.appendChild(wrap);
  }
  Table.prototype.dessiner = function (etat) {
    var h = "<tr><th>i</th><th>vᵢ</th><th>wᵢ</th>";
    for (var V = 0; V <= Smax; V++) h += "<th>V=" + V + "</th>";
    h += "</tr>";
    for (var i = 1; i <= n; i++) {
      h += "<tr><th>" + i + "</th><th>" + v[i - 1] + "</th><th>" + w[i - 1] + "</th>";
      for (V = 0; V <= Smax; V++) {
        if (V > S(i)) { h += "<td class='vide'></td>"; continue; }
        var e = etat(i, V);
        if (e === "saisie") h += "<td class='courante'><input inputmode='numeric' data-i='" + i + "' data-v='" + V + "' aria-label='OPT(" + i + "," + V + ")'></td>";
        else if (e === "cachee") h += "<td class='vide'>·</td>";
        else h += "<td class='" + e + "'>" + OPT[i][V] + "</td>";
      }
      h += "</tr>";
    }
    this.t.innerHTML = h;
  };

  var DEF = "<div class='encadre'><span class='titre-encadre'>Définition (cours 5)</span>" +
    "OPT(i, V) est le poids minimum W d'un sac à dos de valeur au moins V qui n'utilise que les objets {1, 2, …, i}.<br>" +
    "• si V > Σ<sub>j&lt;i</sub> vⱼ : OPT(i, V) = wᵢ + OPT(i − 1, max{0, V − vᵢ}) (on est obligé de prendre i)<br>" +
    "• sinon : OPT(i, V) = min{ OPT(i − 1, V), wᵢ + OPT(i − 1, max{0, V − vᵢ}) }<br>avec OPT(i, 0) = 0.</div>";

  var etapes = [
    {
      titre: "Les deux premières lignes",
      texte: "<p>Les valeurs vᵢ sont entières (les poids peuvent être réels). On ne cherche pas directement la meilleure valeur : on calcule, " +
        "pour chaque valeur V, le <b>poids minimum</b> qui permet de l'atteindre.</p>" + DEF +
        "<p>Tape les cases de la ligne 1 puis de la ligne 2 (chaque case vaut… le poids minimum pour une valeur ≥ V).</p>",
      objectif: "Remplir les lignes i = 1 et i = 2 de la table.",
      installer: function (zone, api) {
        var table = new Table(zone);
        var k = 0; // index dans ORDRE
        var nb = S(1) + S(2);
        function dessiner() {
          table.dessiner(function (i, V) {
            if (V === 0) return "ok";
            var idx = indexDe(i, V);
            if (idx < k) return "ok";
            if (idx === k && k < nb) return "saisie";
            return "cachee";
          });
          var inp = table.t.querySelector("input");
          if (inp) {
            inp.addEventListener("keydown", function (e) { if (e.key === "Enter") verif(inp); });
            inp.addEventListener("change", function () { verif(inp); });
          }
        }
        function verif(inp) {
          if (inp.dataset.fait || k >= nb) return;
          var c = ORDRE[k], x = parseFloat(inp.value);
          if (isNaN(x)) return;
          if (x === OPT[c.i][c.V]) {
            inp.dataset.fait = "1";
            api.retour("OPT(" + c.i + ", " + c.V + ") = " + x + (c.cas === 1 ? " (obligé de prendre l'objet " + c.i + ")." : "."), true);
            k++; dessiner();
            if (k === nb) api.valider("Ligne 2, V = 5 : on dépasse Σ v₁ = 4, donc l'objet 2 est obligatoire : w₂ + OPT(1, 4) = 3 + 2 = 5.");
          } else {
            api.retour(c.cas === 1 ? "V = " + c.V + " > " + S(c.i - 1) + " : il faut prendre l'objet " + c.i + ", donc w" + c.i + " + OPT(" + (c.i - 1) + ", max{0, " + c.V + " − " + v[c.i - 1] + "})." :
              "Compare OPT(" + (c.i - 1) + ", " + c.V + ") (sans l'objet " + c.i + ") et w" + c.i + " + OPT(" + (c.i - 1) + ", max{0, " + c.V + " − " + v[c.i - 1] + "}) (avec).", false);
          }
        }
        dessiner();
      }
    },

    {
      titre: "Toute la table, pas à pas",
      texte: "<p>L'algorithme parcourt i de 1 à n, et pour chaque i, V de 1 à Σ<sub>j≤i</sub> vⱼ. La case calculée est en couleur, les cases dont elle dépend sont encadrées.</p>",
      objectif: "Dérouler l'algorithme jusqu'à la dernière case.",
      installer: function (zone, api) {
        var table = new Table(zone);
        var info = el("p", "legende-figure");
        zone.appendChild(info);
        var ctl = new Controleur(zone, {
          delai: 350,
          afficher: function (k) {
            var c = ORDRE[k];
            table.dessiner(function (i, V) {
              if (V === 0) return "ok";
              var idx = indexDe(i, V);
              if (idx === k) return "courante";
              if (c.deps.some(function (d) { return d[0] === i && d[1] === V; })) return "dep";
              return idx < k ? "ok" : "cachee";
            });
            var r = Math.max(0, c.V - v[c.i - 1]);
            info.innerHTML = c.cas === 1 ?
              "<span>OPT(" + c.i + ", " + c.V + ") : V > " + S(c.i - 1) + ", donc w" + c.i + " + OPT(" + (c.i - 1) + ", " + r + ") = " + w[c.i - 1] + " + " + OPT[c.i - 1][r] + " = <span class='mono'>" + OPT[c.i][c.V] + "</span></span>" :
              "<span>OPT(" + c.i + ", " + c.V + ") = min{ OPT(" + (c.i - 1) + ", " + c.V + "), w" + c.i + " + OPT(" + (c.i - 1) + ", " + r + ") } = min{ " + OPT[c.i - 1][c.V] + ", " + (w[c.i - 1] + OPT[c.i - 1][r]) + " } = <span class='mono'>" + OPT[c.i][c.V] + "</span></span>";
          },
          surFin: function () { api.valider(ORDRE.length + " cases calculées, chacune en O(1)."); }
        });
        ctl.charger(ORDRE.length);
        return function () { ctl.stop(); };
      }
    },

    {
      titre: "Les questions de la diapo",
      texte: "<p>La diapo « Exemple » du cours 5 pose trois questions sur cette table. Lis-les dans la table complète.</p>",
      objectif: "Donner OPT(4, 3), OPT(4, 8) et OPT(4, 10).",
      installer: function (zone, api) {
        var table = new Table(zone);
        table.dessiner(function (i, V) { return i === 4 && (V === 3 || V === 8 || V === 10) ? "dep" : "ok"; });
        var reussies = 0;
        [[3, "OPT(4, 3) ="], [8, "OPT(4, 8) ="], [10, "OPT(4, 10) ="]].forEach(function (q) {
          Exercices.nombre(zone, {
            label: q[1], attendu: OPT[4][q[0]], tolerance: 0, placeholder: "poids",
            indice: "Ligne i = 4, colonne V = " + q[0] + ".",
            bravo: q[0] === 3 ? "2 : l'objet 1 seul (v = 4 ≥ 3, w = 2)." : q[0] === 8 ? "6 : objets {1, 4} (v = 9, w = 6)." : "9 : objets {1, 2, 4} (v = 10, w = 9).",
            surReussite: function () { if (++reussies === 3) api.valider(); }
          });
        });
      }
    },

    {
      titre: "Lire la réponse, et sa complexité",
      texte: "<p>La dernière ligne n'impose plus rien sur les objets : c'est le problème initial. On retourne <b>le V maximum tel que OPT(n, V) ≤ W</b>.</p>" +
        "<div class='signalement'>La diapo ne fixe pas lisiblement le poids limite W de cet exemple ; je prends W = " + W + ".</div>",
      objectif: "Trouver la valeur optimale pour W = 7, puis la complexité de l'algorithme.",
      installer: function (zone, api) {
        var table = new Table(zone);
        table.dessiner(function (i, V) { return i === n ? (OPT[n][V] <= W ? "dep" : "ok") : "ok"; });
        Exercices.nombre(zone, {
          label: "valeur optimale (W = 7) =", attendu: reponse(), tolerance: 0, placeholder: "V",
          indice: "Dans la ligne 5, cherche la colonne V la plus à droite dont le poids est ≤ 7.",
          bravo: "11 : par exemple les objets {1, 4, 5}, valeur 4 + 5 + 2 = 11, poids 2 + 4 + 1 = 7.",
          surReussite: function () {
            Exercices.choix(zone, {
              question: "Avec v* = max vᵢ, la complexité O(n² v*) de l'algorithme est-elle polynomiale ?",
              options: [
                "Oui : c'est un produit de puissances de n et v*.",
                "Non : la taille de l'entrée est O(n log v*), et v* est exponentiel en log v*.",
                "Oui, si les poids sont entiers."
              ],
              bonne: 1,
              expliquer: [
                "Piège classique : v* n'est pas la taille de l'entrée. Les nombres sont codés en binaire, sur log v* bits.",
                "Exact. Le cours : « cette complexité n'est pas polynomiale mais exponentielle ». Le TD1 parle d'algorithme pseudo-polynomial : polynomial si les nombres étaient codés en unaire. Le cours 5 s'en sert pour le schéma d'approximation, en rendant v* = O(n).",
                "Non : c'est la taille des valeurs vᵢ qui pose problème, pas les poids."
              ],
              surReussite: function () { api.valider(); }
            });
          }
        });
      }
    }
  ];

  var INDEX = {};
  ORDRE.forEach(function (c, k) { INDEX[c.i + "," + c.V] = k; });
  function indexDe(i, V) { return INDEX[i + "," + V]; }

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "table-sac-a-dos",
    etapes: etapes,
    fin: {
      cartes: "prog-dyn",
      texte: "<p>Tu as rempli la table OPT(i, V) du cours 5 / TD1. Elle resservira dans le chapitre « Schéma d'approximation », où l'on arrondit les valeurs pour rendre v* petit.</p>"
    }
  });
})();
