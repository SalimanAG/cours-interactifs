/* Leçon : Un RNN à la main (cours 5 « Recurrent Neural Networks »).
   Fil rouge : le RNN scalaire du cours, h_t = tanh(0,5·h_(t−1) + x_t), h₀ = 0, ŷ_t = h_t, entrées 1, 0, −1 (recalculé). */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var XS = [1, 0, -1], H = [0];
  XS.forEach(function (x) { H.push(Math.tanh(0.5 * H[H.length - 1] + x)); });
  function deplie(zone, t, vals) {
    var r = new Reseau(A.cadre(zone), { couches: [["h₁", "x₁"], ["h₂", "x₂"], ["h₃", "x₃"]], hauteur: 150, titre: "RNN déplié dans le temps" });
    var ar = [];
    for (var k = 0; k < 3; k++) {
      ar.push({ de: [k, 1], vers: [k, 0], poids: "1", classe: k + 1 === t ? "courant" : "" });
      if (k < 2) ar.push({ de: [k, 0], vers: [k + 1, 0], poids: "0,5", classe: k + 2 === t ? "courant" : "" });
    }
    var ne = {};
    for (var j = 0; j < 3; j++) {
      ne[j + ",1"] = { bas: "x=" + Reseau.fmt(XS[j]) };
      if (vals && j < vals) ne[j + ",0"] = { haut: "h=" + Reseau.fmt(H[j + 1]), classe: j + 1 === t ? "courant" : "" };
      else if (j + 1 === t) ne[j + ",0"] = { classe: "courant" };
    }
    r.dessiner({ aretes: ar, neurones: ne });
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "rnn-a-la-main",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "L'ordre compte",
        texte: "<p>« Dog bites person » et « Person bites dog » : mêmes mots, ordre différent, sens différent. Le temps porte aussi de l'information : " +
          "la température d'aujourd'hui, les ventes d'hier ou les mots précédents aident à prédire la suite.</p>",
        objectif: "Dire ce qu'un modèle de séquence doit savoir faire.",
        installer: function (zone, api) {
          A.choix(zone, {
            question: "Un modèle qui ne regarde que l'ensemble des mots (sans leur ordre) peut-il distinguer ces deux phrases ?",
            options: ["Non : il faut tenir compte de l'ordre des observations", "Oui : les mots suffisent", "Oui, si la phrase est courte"],
            bonne: 0, surReussite: function () { api.valider("Un modèle de séquence lit x₁, x₂, …, x_t dans l'ordre et en garde un contexte."); }
          });
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Feed-forward ou récurrent",
        texte: "<p>Un réseau feed-forward traite une représentation d'entrée fixe, sans état transmis d'un pas de la séquence au suivant. " +
          "Un réseau <b>récurrent</b> transporte un <b>état caché</b> d'un pas au suivant, avec le même calcul réutilisé à chaque pas : un résumé courant du passé.</p>",
        objectif: "Rattacher chaque propriété au bon type de réseau.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["feed-forward", "récurrent"],
            items: [
              { texte: "Entrée de taille fixe, pas d'état d'un pas à l'autre", bonne: 0 },
              { texte: "État caché hₜ passé au pas suivant", bonne: 1 },
              { texte: "Le même calcul est réutilisé à chaque pas de temps", bonne: 1 },
              { texte: "Un MLP de scikit-learn", bonne: 0 }
            ],
            surReussite: function () { api.valider("L'état caché est un résumé appris, de dimension fixe : pas un stockage parfait de tout l'historique."); }
          });
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Les équations du RNN « vanilla »",
        texte: "<div class='formule lignes'>hₜ = tanh(W_xh xₜ + W_hh hₜ₋₁ + b_h)\nŷₜ = g(W_hy hₜ + b_y)</div>" +
          "<p>Certaines sources écrivent U, W, V au lieu de W_xh, W_hh, W_hy : les rôles sont les mêmes.</p>",
        objectif: "Donner le rôle de chaque élément.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["entrée → caché", "récurrent", "caché → sortie", "activation de sortie"],
            items: [
              { texte: "W_hh", bonne: 1 }, { texte: "W_xh", bonne: 0 }, { texte: "W_hy", bonne: 2 },
              { texte: "g : softmax pour des classes, identité pour une régression", bonne: 3 }
            ],
            surReussite: function () { api.valider("hₜ₋₁ : état précédent ; xₜ : entrée courante ; hₜ : état mis à jour."); }
          });
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Calculer les états cachés",
        texte: "<p>Le RNN scalaire du cours : <span class='mono'>hₜ = tanh(0,5·hₜ₋₁ + xₜ)</span>, h₀ = 0, ŷₜ = hₜ, avec x₁ = 1, x₂ = 0, x₃ = −1. " +
          "Le dépliage montre le même calcul à chaque pas (poids partagés) ; ce n'est pas trois modèles indépendants.</p>",
        objectif: "Calculer h₁, h₂ et h₃ (3 décimales).",
        installer: function (zone, api) {
          var box = el("div"); zone.appendChild(box);
          deplie(box, 1, 0);
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "h₁ = tanh(1) ≈", attendu: H[1], tolerance: 0.001, placeholder: "ex. 0,5", surReussite: function () { box.innerHTML = ""; deplie(box, 2, 1); ok(); } }); },
            function (b, ok) { Exercices.nombre(b, { label: "h₂ ≈", attendu: H[2], tolerance: 0.001, placeholder: "ex. 0,5", indice: "tanh(0,5 × 0,762 + 0).", surReussite: function () { box.innerHTML = ""; deplie(box, 3, 2); ok(); } }); },
            function (b, ok) { Exercices.nombre(b, { label: "h₃ ≈", attendu: H[3], tolerance: 0.001, placeholder: "ex. 0,5", indice: "tanh(0,5 × 0,363 − 1) = tanh(−0,818).", surReussite: function () { box.innerHTML = ""; deplie(box, 0, 3); ok(); } }); }
          ], "h₂ n'est pas nul alors que x₂ = 0 : l'état précédent compte. L'entrée négative x₃ change fortement l'état.");
          A.note(zone, "Le cours donne h₃ = tanh(0,5 × 0,364 − 1) ≈ −0,797. Or 0,5 × 0,364 − 1 = −0,818 et tanh(−0,818) ≈ <b>−0,674</b> " +
            "(−0,797 correspondrait à tanh(−1,09)).");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Poids partagés et schémas entrée / sortie",
        texte: "<p>W_xh et W_hh ne sont pas recopiés pour chaque t : moins de paramètres, et le même modèle traite des séquences de longueurs variables. " +
          "Contrepartie : le calcul est séquentiel (hₜ attend hₜ₋₁), ce qui limite le parallélisme.</p>",
        objectif: "Associer chaque tâche à son schéma d'entrée / sortie.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["un → un", "un → plusieurs", "plusieurs → un", "plusieurs → plusieurs"],
            items: [
              { texte: "Classer le sentiment d'une phrase", bonne: 2 },
              { texte: "Étiqueter chaque mot (entités nommées : « Paris » → LOC)", bonne: 3 },
              { texte: "Générer une légende à partir d'une image", bonne: 1 },
              { texte: "Classifieur ordinaire (pas intrinsèquement récurrent)", bonne: 0 },
              { texte: "Traduction (souvent encodeur-décodeur)", bonne: 3 }
            ],
            surReussite: function () { api.valider("Plusieurs → un : on prédit à partir de l'état final hₜ (ou d'états mis en commun)."); }
          });
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "BPTT : le gradient s'évanouit ou explose",
        texte: "<p>On apprend en dépliant la récurrence et en appliquant la règle de dérivation en chaîne des pertes tardives vers les états anciens (<b>Backpropagation Through Time</b>) ; " +
          "les poids étant partagés, on additionne les contributions de chaque pas. Pour une dépendance lointaine :</p>" +
          "<div class='formule'>∂hₜ/∂hₖ = Π_(j = k+1 … t) ∂hⱼ/∂hⱼ₋₁</div>" +
          "<p>Dans le RNN scalaire hⱼ = tanh(w·hⱼ₋₁ + xⱼ), chaque facteur vaut <span class='mono'>w·(1 − hⱼ²)</span>.</p>",
        objectif: "Calculer le produit sur 10 pas dans deux situations.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "w = 0,5 et hⱼ ≈ 0,5 : un facteur vaut", attendu: 0.375, tolerance: 1e-6, placeholder: "ex. 0,5", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Produit sur 10 pas ≈ (écris par ex. 5e-5)", attendu: Math.pow(0.375, 10), tolerance: 3e-6, placeholder: "ex. 1e-3", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "w = 3 et hⱼ ≈ 0 : produit sur 10 pas =", attendu: 59049, tolerance: 0.5, placeholder: "ex. 1000", surReussite: ok }); }
          ], "≈ 5,5·10⁻⁵ : les premiers pas ne reçoivent presque aucun signal (gradient évanescent). 3¹⁰ = 59 049 : mises à jour instables (gradient explosif).");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Remèdes et idées reçues",
        texte: "<p>Remèdes du cours : <b>gradient clipping</b> (limite la norme, ne corrige pas l'évanouissement), <b>LSTM / GRU</b> (mises à jour à portes), une bonne initialisation, " +
          "la normalisation, la <b>BPTT tronquée</b> (fenêtre limitée). LSTM : état de cellule cₜ et portes d'oubli, d'entrée, de sortie. GRU : portes de mise à jour et de remise à zéro, souvent moins de paramètres. " +
          "RNN <b>bidirectionnel</b> : un état lit le contexte gauche, l'autre le contexte droit.</p>",
        objectif: "Corriger les idées reçues listées par le cours.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "L'état caché se souvient de tout.", vrai: false, explication: "C'est un résumé appris de dimension finie." },
              { texte: "Chaque pas de temps déplié a ses propres poids.", vrai: false, explication: "Les paramètres sont partagés dans le temps." },
              { texte: "BPTT est un optimiseur différent de SGD ou Adam.", vrai: false, explication: "C'est la façon de calculer le gradient ; SGD / Adam font la mise à jour." },
              { texte: "Les LSTM atténuent le problème du gradient évanescent sans le résoudre complètement.", vrai: true },
              { texte: "Un RNN bidirectionnel convient à une prédiction strictement en temps réel.", vrai: false, explication: "Il lui faut les entrées futures." }
            ],
            surReussite: function () { api.valider("Cinq idées : l'ordre compte ; l'état caché porte le contexte ; les paramètres sont partagés ; BPTT entraîne à travers le temps ; les RNN à portes aident sans tout résoudre."); }
          });
        }
      }
    ],
    fin: { texte: "<p>À retenir : <span class='mono'>hₜ = tanh(W_xh xₜ + W_hh hₜ₋₁ + b_h)</span> ; poids partagés dans le temps ; BPTT = produit de jacobiennes, d'où gradients qui s'évanouissent ou explosent ; clipping, LSTM / GRU comme remèdes partiels.</p>", cartes: "rnn" }
  });
})();
