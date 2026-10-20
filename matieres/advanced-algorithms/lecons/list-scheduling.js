/* Leçon : List Scheduling et la preuve du ratio 2 (cours 3, équilibrage de charges).
   Fil rouge : l'exemple de la diapo 2 du cours : m = 3 machines, n = 5 tâches,
   t = (2, 3, 4, 3, 5). */
(function () {
  "use strict";
  var el = Site.el;
  var T = [2, 3, 4, 3, 5], M = 3;
  var OPT = Machines.optimum(T, M).makespan;   // 6
  var LS = Machines.listScheduling(T, M);      // makespan 8
  var LPT = Machines.lpt(T, M);                // makespan 6
  var somme = T.reduce(function (a, b) { return a + b; }, 0);

  /* Exécution manuelle d'un algorithme de liste : l'étudiant choisit la machine. */
  function executionManuelle(zone, api, liste, regle, surFin) {
    var aff = Machines.vide(M), k = 0;
    var vue = new Machines(zone, { onMachine: function (i) {
      if (k >= liste.length) return;
      var mins = Machines.moinsChargees(aff);
      if (regle && mins.indexOf(i) < 0) {
        api.retour("Non : M" + (i + 1) + " a une charge " + Machines.charges(aff)[i] + " ; la moins chargée est M" + (mins[0] + 1) + " (" + Machines.charges(aff)[mins[0]] + ").", false);
        return;
      }
      aff[i].push(liste[k]); k++;
      dessiner();
      if (k === liste.length) surFin(aff);
      else api.retour("", null);
    } });
    var b = el("button", "btn btn-petit", "Recommencer"); b.type = "button";
    b.onclick = function () { aff = Machines.vide(M); k = 0; api.retour("", null); dessiner(); };
    zone.appendChild(b);
    function dessiner() {
      var mins = k < liste.length && regle ? null : null;
      vue.dessiner(aff, { echelle: 10, attente: liste.slice(k) });
    }
    dessiner();
  }

  var etapes = [
    {
      titre: "Le problème",
      texte: "<div class='encadre'><span class='titre-encadre'>Équilibrage de charges</span>" +
        "<b>Entrée :</b> m machines, n tâches avec chacune un temps d'exécution tᵢ ∈ ℝ*₊.<br>" +
        "<b>Contraintes :</b> tâches insécables (effectuées entièrement sur une machine) ; une machine ne fait qu'une tâche à la fois.<br>" +
        "<b>Sortie :</b> une affectation des tâches aux m machines telle que la machine qui termine en dernier termine le plus tôt possible.</div>" +
        "<p>Exemple du cours : m = 3, n = 5, t = (2, 3, 4, 3, 5). Affecte toi-même les tâches (touche une machine pour lui donner la tâche en couleur).</p>",
      objectif: "Trouver une affectation où la dernière machine termine au temps 6.",
      installer: function (zone, api) {
        executionManuelle(zone, api, T, false, function (aff) {
          var ms = Machines.makespan(aff);
          if (ms === OPT) {
            api.retour("Makespan " + ms + " : c'est l'optimum.", true);
            api.valider("Difficulté de calcul : NP-complet. On va faire un algorithme polynomial qui donne une solution approchée garantie.");
          } else api.retour("La dernière machine termine à " + ms + ". On peut faire 6 : recommence.", false);
        });
      }
    },

    {
      titre: "Ratio d'approximation",
      texte: "<p>On note I l'instance, OPT(I) la valeur optimale et ALG(I) la valeur retournée par l'algorithme.</p>" +
        "<div class='encadre'><span class='titre-encadre'>Définition</span>" +
        "Minimisation : un algorithme d'approximation de ratio ρ ≥ 1 vérifie, pour toute instance I, ALG(I)/OPT(I) ≤ ρ.<br>" +
        "Maximisation : pour toute instance I, OPT(I)/ALG(I) ≤ ρ.</div>" +
        "<p>Exemple du cours : un problème de minimisation et un algorithme ; sur trois instances on observe " +
        "OPT(I) = 3 et ALG(I) = 6 ; OPT(I′) = 8 et ALG(I′) = 12 ; OPT(I″) = 6 et ALG(I″) = 8.</p>",
      objectif: "Dire ce qu'on peut conclure sur le ratio de cet algorithme.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Quel est le ratio d'approximation de cet algorithme ?",
          options: ["ρ = 2", "ρ ≥ 2", "ρ = 1,5", "ρ = 4/3"],
          bonne: 1,
          expliquer: [
            "Trop affirmatif : 3 instances ne disent rien des autres. On sait seulement que ρ ne peut pas être plus petit que 6/3 = 2.",
            "Exact : les rapports sont 2, 1,5 et 4/3 ; ρ doit majorer tous les rapports, donc ρ ≥ 2. Pour connaître ρ il faut une preuve valable pour toute instance.",
            "Non : ρ doit majorer TOUS les rapports, y compris 6/3 = 2.",
            "Non : ρ doit majorer tous les rapports, pas le plus petit."
          ],
          surReussite: function () { api.valider("L'objectif ici : un algorithme polynomial avec ALG(I) ≤ 2·OPT(I) pour toute I, c'est-à-dire de ratio 2."); }
        });
      }
    },

    {
      titre: "List Scheduling",
      texte: "<div class='encadre'><span class='titre-encadre'>Premier algorithme — List Scheduling</span>" +
        "Considérer les tâches une par une dans un ordre quelconque ; pour chaque tâche, l'affecter à la machine la moins chargée.</div>" +
        "<p>Exécute-le sur l'exemple, dans l'ordre de la liste (2, 3, 4, 3, 5). En cas d'égalité, n'importe quelle machine la moins chargée convient. " +
        "« Le pompon : en online ça marche aussi ! » — on n'a pas besoin de connaître les tâches suivantes.</p>",
      objectif: "Exécuter List Scheduling sur l'exemple.",
      installer: function (zone, api) {
        executionManuelle(zone, api, T, true, function (aff) {
          var ms = Machines.makespan(aff);
          api.retour("Makespan " + ms + " alors que OPT = " + OPT + " : rapport " + ms + "/" + OPT + " = 4/3.", true);
          api.valider("Le 5 arrive en dernier, sur une machine déjà chargée à 3. Pas optimal, mais on va prouver qu'on ne fait jamais pire que 2 × OPT.");
        });
      }
    },

    {
      titre: "Minorer L*",
      texte: "<p>Pour 1 ≤ i ≤ m, J(i) est l'ensemble des tâches affectées à la machine i ; sa <b>charge</b> est Lᵢ = Σ<sub>j∈J(i)</sub> tⱼ. " +
        "Le <b>makespan</b> d'une affectation est la charge maximum d'une machine ; le makespan minimum est noté <b>L*</b>.</p>" +
        "<p>Conseil général du cours pour prouver un ratio : montrer que la solution optimale ne peut pas être trop bonne. Ici, il faut <b>minorer L*</b> :</p>" +
        "<div class='formule'>Lemme 1 : L* ≥ max tᵢ        Lemme 2 : L* ≥ (Σ tᵢ) / m</div>",
      objectif: "Calculer la meilleure des deux bornes sur l'exemple.",
      installer: function (zone, api) {
        var vue = new Machines(zone, {});
        vue.dessiner(LS.aff, { echelle: 10, marques: [{ x: Math.max.apply(null, T), texte: "max tᵢ" }, { x: Math.round(somme / M * 100) / 100, texte: "Σtᵢ/m" }] });
        Exercices.nombre(zone, {
          label: "max{ max tᵢ, Σtᵢ/m } =", attendu: somme / M, tolerance: 0.02, placeholder: "ex. 9/2",
          indice: "max tᵢ = 5 ; Σ tᵢ = 2 + 3 + 4 + 3 + 5. Divise par m = 3, puis prends la plus grande des deux bornes.",
          bravo: "17/3 ≈ 5,67. Les durées étant entières, L* ≥ 6 : l'affectation de l'étape 1 est donc bien optimale.",
          surReussite: function () { api.valider("Lemme 1 : la plus longue tâche est entière sur une machine. Lemme 2 : la plus chargée porte au moins la moyenne."); }
        });
      }
    },

    {
      titre: "Preuve du ratio 2",
      texte: "<p><b>Théorème.</b> L'algo List Scheduling a un ratio d'approximation 2.</p>" +
        "<p>Remets la démonstration du cours dans l'ordre. Sur l'exemple : la machine la plus chargée est celle qui a reçu le 5 en dernier, avec Lᵢ − tⱼ = 3.</p>",
      objectif: "Ordonner les étapes de la démonstration.",
      installer: function (zone, api) {
        var vue = new Machines(zone, {});
        vue.dessiner(LS.aff, { echelle: 10, marques: [{ x: 3, texte: "Lᵢ − tⱼ" }] });
        Exercices.ordonner(zone, {
          consigne: "Touche les étapes dans l'ordre de la preuve.",
          items: [
            "Soit i la machine de plus grande charge, j la dernière tâche reçue",
            "Quand j est affectée, i est la moins chargée : Lᵢ − tⱼ ≤ Lₖ pour tout k",
            "On somme sur k : Lᵢ − tⱼ ≤ (1/m) Σ tᵢ ≤ L*",
            "tⱼ ≤ max tᵢ ≤ L*",
            "Donc Lᵢ ≤ L* + tⱼ ≤ 2L*"
          ],
          bravo: "C'est la démonstration du cours.",
          surReussite: function () { api.valider("Les deux lemmes servent chacun une fois : Σtᵢ/m pour Lᵢ − tⱼ, max tᵢ pour tⱼ."); }
        });
      }
    },

    {
      titre: "A-t-on prouvé le meilleur ratio ?",
      texte: "<p>On a prouvé ρ ≤ 2 ; a-t-on ρ &lt; 2 ? Il faut trouver un exemple où l'algo donne 2, ou s'en approche autant qu'on veut. " +
        "Exemple du cours : m machines, m(m − 1) tâches de durée 1 et une tâche de durée m, qui vient en dernier dans l'ordre considéré.</p>",
      objectif: "Choisir m pour que le rapport ALG/OPT atteigne au moins 1,9.",
      installer: function (zone, api) {
        var lab = el("label"), c = el("input"); c.type = "range"; c.min = 2; c.max = 12; c.value = 3;
        zone.appendChild(lab); zone.appendChild(c);
        var conteneur = el("div"); zone.appendChild(conteneur);
        var vue = new Machines(conteneur, {});
        var info = el("p", "legende-figure"); zone.appendChild(info);
        function maj() {
          var m = +c.value;
          var liste = []; for (var i = 0; i < m * (m - 1); i++) liste.push(1); liste.push(m);
          var r = Machines.listScheduling(liste, m);
          var alg = Machines.makespan(r.aff);
          lab.innerHTML = "m = <span class='mono'>" + m + "</span>";
          vue.dessiner(r.aff, { echelle: 2 * m });
          info.innerHTML = "<span>ALG = <span class='mono'>" + alg + "</span> (= 2m − 1)</span><span>OPT = <span class='mono'>" + m + "</span></span>" +
            "<span>rapport = <span class='mono'>" + (alg / m).toFixed(3) + "</span></span>";
          if (alg / m >= 1.9 - 1e-9) {
            api.retour("Avec m = " + m + ", le rapport vaut " + (alg / m).toFixed(3) + ".", true);
            api.valider("(2m − 1)/m = 2 − 1/m → 2 quand m → +∞ : le ratio de List Scheduling est exactement 2. Optimum : les m − 1 tâches de 1 sur chaque machine sauf une, qui reçoit la tâche m.");
          }
        }
        c.addEventListener("input", maj);
        maj();
      }
    },

    {
      titre: "Longest Processing",
      texte: "<div class='encadre'><span class='titre-encadre'>Deuxième algorithme — Longest Processing</span>" +
        "Même algo que List Scheduling, mais avec un ordre d'arrivée bien choisi : par ordre décroissant des durées.</div>" +
        "<p>Sur l'exemple, L = (5, 4, 3, 3, 2) donne directement l'optimum :</p>",
      objectif: "Valider les étapes de la preuve du ratio 3/2.",
      installer: function (zone, api) {
        var vue = new Machines(zone, {});
        vue.dessiner(LPT.aff, { echelle: 10 });
        zone.appendChild(el("p", "discret petit", "Analyse du cours, avec t₁ ≥ t₂ ≥ … ≥ tₙ :"));
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "On peut supposer n > m, sinon l'algo trouve toujours l'optimal L*.", vrai: true, explication: "Une tâche par machine : L* = t₁." },
            { texte: "Dans toute affectation, une machine a une charge d'au moins tₘ + tₘ₊₁, d'où L* ≥ 2tₘ₊₁.", vrai: true, explication: "Les m + 1 plus longues tâches sur m machines : deux sur la même (principe des tiroirs)." },
            { texte: "Si j ≥ m + 1, alors tⱼ ≤ tₘ₊₁ ≤ L*/2 et Lᵢ ≤ L* + tⱼ ≤ 3/2 · L*.", vrai: true, explication: "Avec Lᵢ ≤ L* + tⱼ, montré pour List Scheduling." },
            { texte: "Si j ≤ m, la machine i n'a qu'une tâche, t₁, et l'algo trouve L* = t₁.", vrai: true, explication: "Les m premières tâches vont sur m machines différentes." },
            { texte: "Le ratio de Longest Processing est exactement 3/2.", vrai: false, explication: "On a prouvé ρ ≤ 3/2, mais on peut montrer ρ ≤ 4/3 (étape suivante)." }
          ],
          surReussite: function () { api.valider("Conclusion du cours : ρ ≤ 3/2 ; et en fait ρ ≤ 4/3."); }
        });
      }
    },

    {
      titre: "Le 4/3, et l'exemple qui l'atteint",
      texte: "<p>Le cours : « On peut montrer ρ ≤ 4/3. Et c'est le mieux qu'on puisse montrer : m machines, n = 2m + 1 tâches, " +
        "2 tâches de durée m + 1, m + 2, …, 2m et une de durée m. » Fais varier m : l'optimum est calculé par recherche exhaustive.</p>" +
        "<div class='signalement'>La preuve de ρ ≤ 4/3 n'est pas dans le cours. Les valeurs LPT = 4m + 1 et OPT = 3m + 2 viennent des notes manuscrites de la diapo ; je les ai vérifiées par calcul pour m = 2 à 6.</div>",
      objectif: "Calculer le rapport LPT/OPT pour m = 2.",
      installer: function (zone, api) {
        var lab = el("label"), c = el("input"); c.type = "range"; c.min = 2; c.max = 6; c.value = 3;
        zone.appendChild(lab); zone.appendChild(c);
        var titre1 = el("p", "discret petit", "Longest Processing :"); zone.appendChild(titre1);
        var v1 = new Machines(zone, {});
        var titre2 = el("p", "discret petit", "Une affectation optimale :"); zone.appendChild(titre2);
        var v2 = new Machines(zone, {});
        var info = el("p", "legende-figure"); zone.appendChild(info);
        function maj() {
          var m = +c.value;
          var t = [m]; for (var d = m + 1; d <= 2 * m; d++) t.push(d, d);
          var a = Machines.lpt(t, m), o = Machines.optimum(t, m);
          var la = Machines.makespan(a.aff);
          lab.innerHTML = "m = <span class='mono'>" + m + "</span> · tâches : <span class='mono'>" + t.slice().sort(function (x, y) { return y - x; }).join(", ") + "</span>";
          v1.dessiner(a.aff, { echelle: 4 * m + 2 });
          v2.dessiner(o.aff, { echelle: 4 * m + 2 });
          info.innerHTML = "<span>LPT = <span class='mono'>" + la + "</span></span><span>OPT = <span class='mono'>" + o.makespan + "</span></span>" +
            "<span>rapport = <span class='mono'>" + (la / o.makespan).toFixed(3) + "</span> (4/3 ≈ 1,333)</span>";
        }
        c.addEventListener("input", maj);
        maj();
        Exercices.nombre(zone, {
          label: "LPT/OPT pour m = 2 :", attendu: 9 / 8, tolerance: 0.005, placeholder: "fraction",
          indice: "Mets m = 2 et lis LPT et OPT.",
          bravo: "9/8. En général (4m + 1)/(3m + 2) → 4/3 quand m → +∞.",
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "list-scheduling",
    etapes: etapes,
    fin: {
      cartes: "approximation",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir (cours 3)</span><ul>" +
        "<li>Ratio ρ (minimisation) : ∀I, ALG(I)/OPT(I) ≤ ρ.</li>" +
        "<li>L* ≥ max tᵢ et L* ≥ Σtᵢ/m.</li>" +
        "<li>List Scheduling : Lᵢ ≤ L* + tⱼ ≤ 2L*, ratio exactement 2 (exemple : m(m − 1) tâches de 1 puis une de m).</li>" +
        "<li>Longest Processing (ordre décroissant) : L* ≥ 2tₘ₊₁, ρ ≤ 3/2, et même ρ ≤ 4/3.</li></ul></div>" +
        "<p>Pour t'entraîner sur les listes du TD2 : l'atelier « List Scheduling vs Longest Processing ».</p>"
    }
  });
})();
