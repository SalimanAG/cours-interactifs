/* Leçon 1.5 : Sous-apprentissage, sur-apprentissage, régularisation (cours 1,
   diapos 14, 25, 26, 34 ; early stopping et dropout du TP 4).
   Fil rouge : 8 points d'entraînement et 8 de validation (données inventées pour
   la leçon), ajustés par des polynômes de degré 0 à 7. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;
  var XT = [0.1, 0.35, 0.6, 0.85, 1.1, 1.35, 1.6, 1.85], YT = [1.05, 1.17, 1.62, 0.76, 0.54, -0.39, -0.2, -0.42];
  var XV = [0.22, 0.47, 0.72, 0.97, 1.22, 1.47, 1.72, 1.97], YV = [1.21, 1.34, 1.53, 0.53, 0.05, -0.2, -0.7, 0.29];
  function ajuster(d) {
    var n = d + 1, A = [], B = [], i, j, k, r;
    for (i = 0; i < n; i++) { A.push([]); B.push(0); for (j = 0; j < n; j++) A[i].push(0); }
    for (k = 0; k < XT.length; k++) for (i = 0; i < n; i++) { B[i] += YT[k] * Math.pow(XT[k], i); for (j = 0; j < n; j++) A[i][j] += Math.pow(XT[k], i + j); }
    for (i = 0; i < n; i++) {
      var p = i; for (r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
      var t = A[i]; A[i] = A[p]; A[p] = t; t = B[i]; B[i] = B[p]; B[p] = t;
      for (r = 0; r < n; r++) { if (r === i) continue; var f = A[r][i] / A[i][i]; for (var c = i; c < n; c++) A[r][c] -= f * A[i][c]; B[r] -= f * B[i]; }
    }
    var co = B.map(function (b, i) { return b / A[i][i]; });
    return function (x) { return co.reduce(function (s, a, i) { return s + a * Math.pow(x, i); }, 0); };
  }
  function erreur(f, xs, ys) { return xs.reduce(function (s, x, i) { var e = f(x) - ys[i]; return s + e * e; }, 0) / xs.length; }
  var MODELES = [0, 1, 2, 3, 4, 5, 6, 7].map(function (d) { var f = ajuster(d); return { f: f, tr: erreur(f, XT, YT), va: erreur(f, XV, YV) }; });

  var etapes = [
    {
      titre: "Trois diagnostics",
      texte:
        "<p>Le cours (diapos 25-26) distingue :</p>" +
        N.tableau(["", "erreur d'entraînement", "erreur de validation", "cause"], [["<b>Sous-apprentissage</b> (underfit)", "haute", "haute", "modèle trop simple (pas assez de capacité)"], ["<b>Bon ajustement</b>", "basse", "basse, écart faible", "capacité équilibrée, régularisation"], ["<b>Sur-apprentissage</b> (overfit)", "basse", "haute", "modèle trop complexe : il mémorise l'ensemble d'entraînement"]]) +
        "<p>L'écart entre les deux erreurs est l'<b>écart de généralisation</b>.</p>",
      objectif: "Diagnostiquer trois situations.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Sous-appr.", "Bon", "Sur-appr."], items: [
          { texte: "Train 0,02 ; validation 0,45", bonne: 2 }, { texte: "Train 0,50 ; validation 0,53", bonne: 0 }, { texte: "Train 0,04 ; validation 0,06", bonne: 1 },
          { texte: "Une droite pour des points qui dessinent une vague", bonne: 0 }, { texte: "Une courbe qui passe exactement par tous les points d'entraînement en zigzaguant", bonne: 2 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Faire varier la capacité",
      texte:
        "<p>Points pleins : entraînement ; points creux : validation. Le modèle est un polynôme de degré d (d + 1 paramètres), ajusté sur les points pleins seulement. Augmente d.</p>",
      objectif: "Trouver le degré qui minimise l'erreur de validation.",
      tester: function (z) { var r = z.querySelector("input[type=range]"); r.value = "3"; r.dispatchEvent(new Event("input")); },
      installer: function (zone, api) {
        var boite = N.el("div"), d = 1, vus = {};
        N.curseur(zone, { label: "degré d =", min: 0, max: 7, pas: 1, valeur: d, format: function (x) { return String(x); }, surChange: function (x) { d = x; maj(); } });
        zone.appendChild(boite);
        function maj() {
          boite.innerHTML = "";
          var mo = MODELES[d]; vus[d] = true;
          N.nuage(boite, { xmin: 0, xmax: 2.1, ymin: -1.5, ymax: 2.5, nomX: "x", nomY: "y", courbes: [{ f: mo.f, classe: "courante" }],
            points: XT.map(function (x, i) { return { x: x, y: YT[i] }; }).concat(XV.map(function (x, i) { return { x: x, y: YV[i], classe: "vide" }; })) });
          N.html(boite, N.tableau(["d", "MSE entraînement", "MSE validation"], Object.keys(vus).sort().map(function (k) { return [k, fmt(MODELES[k].tr, 3), fmt(MODELES[k].va, 3)]; })));
          if (d === 3) { api.retour("d = 3 : erreur de validation minimale (" + fmt(mo.va, 3) + ").", true); api.valider("d = 7 passe par les 8 points d'entraînement (erreur 0) mais se trompe énormément en validation : sur-apprentissage. d = 0 ou 1 : sous-apprentissage."); }
          else api.retour("", null);
        }
        maj();
      }
    },
    {
      titre: "Lire des courbes d'apprentissage",
      texte:
        "<p>En deep learning, la capacité « utilisée » augmente au fil des <b>époques</b>. On suit la perte d'entraînement et la perte de validation (diapos 14 et 34) :</p>" +
        N.tableau(["époque", "1", "2", "3", "4", "5", "6"], [["perte entraînement", "0,90", "0,60", "0,45", "0,35", "0,27", "0,20"], ["perte validation", "0,95", "0,70", "0,58", "0,61", "0,68", "0,77"]]),
      objectif: "Repérer le moment où le sur-apprentissage commence.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "meilleure époque (validation) :", attendu: 3, placeholder: "ex. 2", bravo: "Après l'époque 3, la perte d'entraînement continue de baisser mais celle de validation remonte : le modèle commence à mémoriser.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Cinq techniques de régularisation",
      texte: "<p>Le cours (diapo 26) : la régularisation <b>limite la complexité du modèle et améliore la généralisation</b>.</p>",
      objectif: "Associer chaque technique à sa description.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Weight decay", "Dropout", "Early stopping", "Data augm.", "Modèle + petit"], items: [
          { texte: "Pénaliser les grands poids (régularisation L2)", bonne: 0 },
          { texte: "Désactiver aléatoirement des neurones pendant l'entraînement", bonne: 1 },
          { texte: "Arrêter l'entraînement quand la performance de validation cesse de s'améliorer", bonne: 2 },
          { texte: "Créer de nouveaux exemples (paraphrases, bruit, back-translation)", bonne: 3 },
          { texte: "Utiliser un modèle de plus faible capacité", bonne: 4 }
        ], surReussite: function () { api.valider("Le TP 4 utilise Dropout(0.3) après la couche récurrente et EarlyStopping."); } });
      }
    },
    {
      titre: "Early stopping dans le TP 4",
      texte:
        N.code("keras.callbacks.EarlyStopping(monitor=\"val_loss\", patience=2,\n                              restore_best_weights=True)") +
        "<p><span class='mono'>patience=2</span> : on s'arrête après 2 époques sans amélioration de val_loss ; <span class='mono'>restore_best_weights=True</span> : on revient aux poids de la meilleure époque. " +
        "Pertes de validation obtenues : époque 1 : 0,80 ; 2 : 0,62 ; 3 : 0,58 ; 4 : 0,60 ; 5 : 0,63 ; (6 : non exécutée).</p>",
      objectif: "Dire combien d'époques tournent et quels poids sont gardés.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "époques exécutées :", attendu: 5, placeholder: "ex. 6", indice: "La meilleure est la 3 ; on tolère encore 2 époques sans amélioration.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "poids restaurés : ceux de l'époque", attendu: 3, placeholder: "ex. 6", surReussite: ok }); }
        ], "Remarque du TP : l'early stopping choisit selon la perte de validation, pas forcément l'époque de meilleure accuracy de validation.");
      }
    },
    {
      titre: "Le weight decay en formule",
      texte:
        "<p>Complément (le cours dit seulement « pénaliser les grands poids, régularisation L2 ») : on minimise</p>" +
        "<div class='formule'>ℒ_régularisée(θ) = ℒ(θ) + λ · Σⱼ θⱼ²</div>" +
        "<p>λ ≥ 0 règle la force de la pénalité.</p>",
      objectif: "Prévoir l'effet de λ.",
      installer: function (zone, api) {
        Exercices.choix(zone, { question: "Si on augmente beaucoup λ…", options: ["les poids sont poussés vers 0 : le modèle devient plus simple, au risque de sous-apprendre", "le modèle mémorise mieux l'entraînement", "rien ne change"], bonne: 0, expliquer: ["Exact : λ trop grand → sous-apprentissage ; λ = 0 → pas de régularisation. On règle λ sur la validation.", "Non : c'est l'inverse.", "Non."], surReussite: function () { api.valider(); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "sur-apprentissage", etapes: etapes,
    fin: { texte: "<ul><li>Sous-apprentissage : erreurs hautes partout ; sur-apprentissage : train bas, validation haute.</li><li>On choisit la capacité (degré, époques…) sur la validation.</li><li>Régularisation : weight decay (L2), dropout, early stopping, data augmentation, modèle plus petit.</li><li>EarlyStopping(patience, restore_best_weights).</li></ul>", cartes: "rappels-optimisation" }
  });
})();
