/* Leçon : Approcher le sac à dos aussi près qu'on veut (cours 5, schéma d'approximation en temps polynomial).
   Fil rouge : 4 objets (instance construite pour la leçon), W = 10. */
(function () {
  "use strict";
  var el = Site.el;
  var V = [5.0, 2.5, 7.7, 2.0];   // valeurs réelles
  var Wt = [3, 5, 8, 2];          // poids
  var W = 10, n = V.length;
  var VSTAR = Math.max.apply(null, V);

  function fmt(x) { return (Math.round(x * 10000) / 10000).toString().replace(".", ","); }
  function b(eps) { return eps * VSTAR / (2 * n); }
  function chapeau(eps) { var bb = b(eps); return V.map(function (v) { return Math.ceil(v / bb - 1e-9); }); }
  var SOUS = (function () { var r = []; for (var m = 0; m < (1 << n); m++) { var s = []; for (var i = 0; i < n; i++) if (m & (1 << i)) s.push(i); r.push(s); } return r; })();
  function poids(s) { return s.reduce(function (a, i) { return a + Wt[i]; }, 0); }
  function somme(s, vals) { return s.reduce(function (a, i) { return a + vals[i]; }, 0); }
  function meilleurs(vals) {
    var best = -1, arg = [];
    SOUS.forEach(function (s) { if (poids(s) > W) return; var x = somme(s, vals); if (x > best + 1e-9) { best = x; arg = [s]; } else if (Math.abs(x - best) < 1e-9) arg.push(s); });
    return { valeur: best, ensembles: arg };
  }
  var OPT = meilleurs(V);
  function nomEns(s) { return "{" + s.map(function (i) { return i + 1; }).join(", ") + "}"; }

  /* Tableau d'objets cliquables. lignes : [[libellé, fonction(i) → texte], …] */
  function objets(zone, lignes, onObjet) {
    var w = el("div", "defile-x"); var t = el("table", "table-pd"); w.appendChild(t); zone.appendChild(w);
    var choisi = {};
    function dessiner() {
      var h = "<tr><th>objet</th>";
      for (var i = 0; i < n; i++) h += "<th>" + (onObjet ? "<button type='button' class='btn btn-petit" + (choisi[i] ? " btn-plein" : "") + "' data-i='" + i + "'>" + (i + 1) + "</button>" : (i + 1)) + "</th>";
      h += "</tr>";
      lignes.forEach(function (l) {
        h += "<tr><th>" + l[0] + "</th>";
        for (var i = 0; i < n; i++) h += "<td>" + l[1](i) + "</td>";
        h += "</tr>";
      });
      t.innerHTML = h;
      Array.prototype.forEach.call(t.querySelectorAll("button[data-i]"), function (bt) {
        bt.onclick = function () { var i = +bt.dataset.i; choisi[i] = !choisi[i]; dessiner(); onObjet(Object.keys(choisi).filter(function (k) { return choisi[k]; }).map(Number)); };
      });
    }
    dessiner();
    return { redessiner: dessiner };
  }

  var etapes = [
    {
      titre: "Le problème du sac à dos",
      texte: "<div class='encadre'><span class='titre-encadre'>Problème du sac à dos</span>" +
        "<b>Entrée :</b> un poids limite W ∈ ℝ et n objets qui ont une valeur vᵢ ∈ ℝ et un poids wᵢ ∈ ℝ.<br>" +
        "<b>Sortie :</b> un sous-ensemble S ⊆ ⟦1, n⟧ d'objets tel que Σ<sub>i∈S</sub> wᵢ ≤ W et Σ<sub>i∈S</sub> vᵢ est maximum. Difficulté : NP-complet.</div>" +
        "<p>Fil rouge : 4 objets et W = 10. Touche les numéros d'objets pour remplir le sac.</p>" +
        "<div class='signalement'>L'instance est construite pour la leçon ; les définitions, notations et l'algorithme sont ceux du cours 5.</div>",
      objectif: "Remplir le sac avec une valeur maximum.",
      installer: function (zone, api) {
        var info = el("p", "legende-figure");
        objets(zone, [["vᵢ", function (i) { return fmt(V[i]); }], ["wᵢ", function (i) { return Wt[i]; }]], function (s) {
          var p = poids(s), v = somme(s, V);
          info.innerHTML = "<span>S = <span class='mono'>" + nomEns(s) + "</span></span><span>poids " + p + " / " + W + "</span><span>valeur <span class='mono'>" + fmt(v) + "</span></span>";
          if (p > W) api.retour("Trop lourd : " + p + " > " + W + ".", false);
          else if (Math.abs(v - OPT.valeur) < 1e-9) { api.retour("Valeur " + fmt(v) + " : c'est l'optimum.", true); api.valider("Remarque : {1, 2, 4} pèse aussi 10 et vaut 9,5. Les deux solutions sont proches : c'est ce qui rendra l'arrondi intéressant."); }
          else api.retour(s.length ? "Valeur " + fmt(v) + ". On peut faire mieux." : "", null);
        });
        zone.appendChild(info);
      }
    },

    {
      titre: "Ce qu'on vise : un schéma d'approximation",
      texte: "<p>Le cours veut construire un <b>schéma polynomial d'approximation</b>, c'est-à-dire un algorithme A<sub>ε</sub> qui donne une approximation aussi bonne qu'on veut " +
        "(ratio 1 + ε, pour n'importe quel ε > 0), en temps polynomial.</p>" +
        "<p>Outil de départ : l'algo exact du sac à dos <b>à valeurs entières</b> (programmation dynamique sur OPT(i, V), voir l'atelier « Remplir la table OPT(i, V) »), en O(n² v*) avec v* = max vᵢ.</p>" +
        "<div class='signalement'>La diapo « Schéma polynomial d'approximation » du cours est vide dans le PDF (rédigée à la main en séance). Je reprends la phrase de la diapo précédente.</div>",
      objectif: "Dire pourquoi on ne peut pas appliquer directement l'algo exact.",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          question: "Pourquoi ne pas appliquer directement l'algo exact en O(n² v*) ? (plusieurs réponses)",
          options: [
            "Il ne respecte pas la contrainte de poids.",
            "Il demande des valeurs entières, et ici les vᵢ sont réelles.",
            "Il est faux quand les poids sont réels.",
            "Même avec des valeurs entières, O(n² v*) n'est pas polynomial : la taille de la donnée est O(n log v*) et v* = exp(log v*)."
          ],
          bonnes: [1, 3],
          explication: "D'où l'idée du cours : modifier les valeurs pour qu'elles soient entières, que v̂* = O(n) (temps polynomial) et que l'optimum modifié soit une approximation à un facteur 1 + ε de l'optimum initial.",
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Le facteur d'échelle b",
      texte: "<p>L'algo d'approximation : on retire les objets tels que wᵢ > W (ils ne servent à rien), puis on choisit un facteur d'échelle</p>" +
        "<div class='formule'>b = (ε / 2n) · v*     (avec 1/ε entier)</div>" +
        "<p>Ici n = 4 et v* = 7,7 ; aucun objet n'est plus lourd que W.</p>",
      objectif: "Calculer b pour ε = 1.",
      installer: function (zone, api) {
        Exercices.nombre(zone, {
          label: "b (ε = 1) =", attendu: b(1), tolerance: 0.0006, placeholder: "décimal",
          indice: "b = ε · v* / (2n) = 1 × 7,7 / 8.",
          bravo: "b = 7,7 / 8 = 0,9625.",
          surReussite: function () { api.valider("Plus ε est petit, plus b est petit : l'arrondi sera plus fin… et les valeurs entières plus grandes."); }
        });
      }
    },

    {
      titre: "Arrondir les valeurs",
      texte: "<p>On arrondit chaque valeur au multiple de b juste au-dessus, puis on divise par b pour obtenir des entiers :</p>" +
        "<div class='formule'>ṽᵢ = ⌈vᵢ / b⌉ · b        v̂ᵢ = ṽᵢ / b = ⌈vᵢ / b⌉</div>" +
        "<p>Avec ε = 1, b = 0,9625. Calcule les v̂ᵢ.</p>",
      objectif: "Calculer les 4 valeurs arrondies v̂ᵢ.",
      installer: function (zone, api) {
        var vh = chapeau(1);
        var w = el("div", "defile-x"); var t = el("table", "table-pd"); w.appendChild(t); zone.appendChild(w);
        var h = "<tr><th>objet</th>", l1 = "<tr><th>vᵢ</th>", l2 = "<tr><th>vᵢ / b</th>", l3 = "<tr><th>v̂ᵢ</th>";
        for (var i = 0; i < n; i++) {
          h += "<th>" + (i + 1) + "</th>"; l1 += "<td>" + fmt(V[i]) + "</td>"; l2 += "<td>" + fmt(V[i] / b(1)) + "</td>";
          l3 += "<td><input inputmode='numeric' data-i='" + i + "' aria-label='v chapeau " + (i + 1) + "'></td>";
        }
        t.innerHTML = h + "</tr>" + l1 + "</tr>" + l2 + "</tr>" + l3 + "</tr>";
        var inputs = t.querySelectorAll("input");
        Array.prototype.forEach.call(inputs, function (inp) { inp.addEventListener("input", verifier); });
        function verifier() {
          var justes = 0, remplis = 0;
          Array.prototype.forEach.call(inputs, function (inp) {
            var i = +inp.dataset.i, x = parseInt(inp.value, 10);
            if (inp.value !== "") remplis++;
            var ok = x === vh[i];
            if (ok) justes++;
            inp.parentNode.className = inp.value === "" ? "" : ok ? "ok" : "";
          });
          if (justes === n) {
            api.retour("v̂ = (" + vh.join(", ") + ").", true);
            api.valider("v̂* = 8 = 2n/ε : c'est voulu. L'objet 3 (v = v*) tombe juste sur 8 ; les autres sont arrondis vers le haut.");
          } else if (remplis === n) api.retour(justes + " / 4 justes. Arrondis vᵢ / b à l'entier supérieur.", false);
          else api.retour("", null);
        }
      }
    },

    {
      titre: "Résoudre l'instance arrondie",
      texte: "<p>On résout de manière exacte le problème sur les (v̂ᵢ, wᵢ) avec l'algo pour valeurs entières, et on retourne l'ensemble S obtenu. " +
        "Joue le rôle de l'algo exact : choisis les objets qui maximisent Σ v̂ᵢ sous la contrainte de poids.</p>",
      objectif: "Trouver l'ensemble S qui maximise la somme des v̂ᵢ.",
      installer: function (zone, api) {
        var vh = chapeau(1), best = meilleurs(vh);
        var info = el("p", "legende-figure");
        objets(zone, [["vᵢ", function (i) { return fmt(V[i]); }], ["v̂ᵢ (ε = 1)", function (i) { return vh[i]; }], ["wᵢ", function (i) { return Wt[i]; }]], function (s) {
          var p = poids(s), x = somme(s, vh);
          info.innerHTML = "<span>S = <span class='mono'>" + nomEns(s) + "</span></span><span>poids " + p + " / " + W + "</span><span>Σ v̂ = <span class='mono'>" + x + "</span></span><span>Σ v = <span class='mono'>" + fmt(somme(s, V)) + "</span></span>";
          if (p > W) { api.retour("Trop lourd.", false); return; }
          if (x === best.valeur) {
            var r = OPT.valeur / somme(s, V);
            api.retour("Σ v̂ = " + x + " est le maximum : l'algo retourne S = " + nomEns(s) + ", de vraie valeur " + fmt(somme(s, V)) + ".", true);
            api.valider("L'optimum vrai est 9,7 (objets {3, 4}) : rapport OPT/ALG = " + fmt(r) + " ≤ 1 + ε = 2. L'arrondi a favorisé les petits objets 2 et 4 (arrondis de 2,5 → 3 et 2,0 → 3).");
          } else api.retour(s.length ? "Σ v̂ = " + x + " : on peut faire mieux en valeurs arrondies." : "", null);
        });
        zone.appendChild(info);
      }
    },

    {
      titre: "Pourquoi c'est polynomial",
      texte: "<p>L'algo exact appliqué à l'instance modifiée coûte O(n² v̂*). Soit j tel que vⱼ = v* :</p>" +
        "<div class='formule'>v̂* = v̂ⱼ = ⌈vⱼ / b⌉ = ⌈v* / b⌉ = 2n / ε</div>" +
        "<p>Complexité totale : O((1/ε) n³) = O(n³) lorsque ε est fixé.</p>",
      objectif: "Calculer v̂* pour n = 4 et ε = 1/5.",
      installer: function (zone, api) {
        Exercices.nombre(zone, {
          label: "v̂* (n = 4, ε = 1/5) =", attendu: 40, tolerance: 0, placeholder: "entier",
          indice: "v̂* = 2n / ε = 2 × 4 × 5.",
          bravo: "40. La table de programmation dynamique a au plus n · n v̂* = 2n³/ε cases.",
          surReussite: function () { api.valider("v̂* ne dépend plus des valeurs vᵢ, seulement de n et de ε : c'est ce qui rend le temps polynomial."); }
        });
      }
    },

    {
      titre: "Pourquoi le ratio est 1 + ε",
      texte: "<p>Soit S* la solution optimale du problème initial et S la solution retournée. Remets la preuve du cours dans l'ordre " +
        "(clé : la solution optimale ne peut pas être trop bonne).</p>",
      objectif: "Ordonner les étapes de la preuve du ratio.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche les étapes dans l'ordre.",
          items: [
            "S est optimal pour les ṽᵢ : Σ_{S*} ṽᵢ ≤ Σ_S ṽᵢ",
            "vᵢ ≤ ṽᵢ ≤ vᵢ + b : Σ_{S*} vᵢ ≤ Σ_{S*} ṽᵢ ≤ Σ_S ṽᵢ ≤ nb + Σ_S vᵢ",
            "Comme wⱼ ≤ W : Σ_S ṽᵢ ≥ ṽⱼ = (2/ε) nb",
            "Donc Σ_S vᵢ ≥ (2/ε − 1) nb, et pour ε ≤ 1 : nb ≤ ε Σ_S vᵢ",
            "Au final : Σ_{S*} vᵢ ≤ (1 + ε) Σ_S vᵢ"
          ],
          bravo: "C'est la preuve du cours.",
          surReussite: function () { api.valider("Deux idées : l'arrondi coûte au plus b par objet, donc nb en tout ; et nb est petit devant la valeur de S, car S vaut au moins autant que l'objet de valeur v*."); }
        });
      }
    },

    {
      titre: "Faire varier ε",
      texte: "<p>Plus ε est petit, meilleure est la garantie, mais plus les v̂ᵢ sont grands (table plus grande). Fais varier 1/ε.</p>",
      objectif: "Trouver un ε pour lequel l'algorithme retourne forcément l'optimum.",
      installer: function (zone, api) {
        var lab = el("label"), c = el("input"); c.type = "range"; c.min = 1; c.max = 10; c.value = 1;
        var t = el("table", "tableau");
        zone.appendChild(lab); zone.appendChild(c); zone.appendChild(t);
        function maj() {
          var k = +c.value, eps = 1 / k, vh = chapeau(eps), r = meilleurs(vh);
          lab.innerHTML = "1/ε = <span class='mono'>" + k + "</span> (ε = " + (k === 1 ? "1" : "1/" + k) + ")";
          var sorties = r.ensembles.map(function (s) { return nomEns(s) + " → " + fmt(somme(s, V)); }).join(" ou ");
          t.innerHTML = "<tr><th>quantité</th><th class='num'>valeur</th></tr>" +
            "<tr><td>b</td><td class='num'>" + fmt(b(eps)) + "</td></tr>" +
            "<tr><td>v̂</td><td class='num'>(" + vh.join(", ") + ")</td></tr>" +
            "<tr><td>v̂* = 2n/ε</td><td class='num'>" + Math.max.apply(null, vh) + "</td></tr>" +
            "<tr><td>S retourné</td><td class='num'>" + sorties + "</td></tr>" +
            "<tr><td>garantie 1 + ε</td><td class='num'>" + fmt(1 + eps) + "</td></tr>";
          if (r.ensembles.length > 1) api.retour("Égalité en valeurs arrondies : l'algo peut retourner l'un ou l'autre.", null);
          else if (Math.abs(somme(r.ensembles[0], V) - OPT.valeur) < 1e-9) {
            api.retour("Avec ε = 1/" + k + ", l'algo retourne l'optimum {3, 4}.", true);
            api.valider("Ici ε = 1/5 suffit. Mais ce seuil dépend de l'instance : c'est tout le problème de l'étape suivante.");
          } else api.retour("Avec ε = " + (k === 1 ? "1" : "1/" + k) + ", l'algo retourne {1, 2, 4} (9,5).", null);
        }
        c.addEventListener("input", maj);
        maj();
      }
    },

    {
      titre: "Une idée géniale ?",
      texte: "<p>Le cours propose : les valeurs étant entières, l'optimum aussi ; en approximant à 1 + ε près avec ε assez petit, on obtiendrait la solution exacte en temps polynomial " +
        "— et comme le problème est NP-complet, on serait « riche et célèbre ».</p>",
      objectif: "Expliquer pourquoi cela ne marche pas.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Où est le problème ?",
          options: [
            "L'arrondi rend la solution invalide (trop lourde).",
            "L'algorithme exact pour valeurs entières est faux.",
            "ε devrait être fixé assez petit pour toutes les instances ; or 1/ε doit croître exponentiellement avec la taille, et O(n³/ε) devient exponentiel.",
            "Le ratio 1 + ε n'est valable que pour ε > 1."
          ],
          bonne: 2,
          expliquer: [
            "Non : les poids ne sont pas modifiés, S respecte toujours W.",
            "Non.",
            "Exact : c'est la conclusion du cours. Plus l'instance est grande, plus il faut prendre ε petit.",
            "Non : la preuve suppose au contraire ε ≤ 1."
          ],
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "sac-a-dos-ptas",
    etapes: etapes,
    fin: {
      cartes: "fptas",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir (cours 5)</span><ul>" +
        "<li>Schéma polynomial d'approximation : A_ε de ratio 1 + ε pour tout ε > 0.</li>" +
        "<li>b = ε v* / 2n ; ṽᵢ = ⌈vᵢ/b⌉ b ; v̂ᵢ = ⌈vᵢ/b⌉ ; on résout exactement sur (v̂ᵢ, wᵢ).</li>" +
        "<li>v̂* = 2n/ε : complexité O(n² v̂*) = O(n³/ε).</li>" +
        "<li>Ratio : Σ_{S*} v ≤ Σ_S v + nb et nb ≤ ε Σ_S v (ε ≤ 1).</li>" +
        "<li>Pas d'algo exact polynomial pour autant : 1/ε devrait croître exponentiellement avec la taille.</li></ul></div>"
    }
  });
})();
