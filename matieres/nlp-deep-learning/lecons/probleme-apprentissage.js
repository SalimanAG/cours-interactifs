/* Leçon 1.2 : Le problème d'apprentissage (cours 1, diapos 13 à 15 ; découpage
   entraînement / évaluation : diapos 32 à 34).
   Fil rouge : 6 avis d'entraînement et 3 avis de validation, un modèle à un
   seul paramètre θ. Le modèle est volontairement minuscule (simplification
   pédagogique, signalée dans la leçon). */
(function () {
  "use strict";
  var el = Site.el;
  var fmt = function (v, d) { var r = Number(v.toFixed(d === undefined ? 2 : d)); if (r === 0) r = 0; return String(r).replace(".", ",").replace("-", "−"); };
  function html(zone, contenu, classe) { var d = el("div", classe || ""); d.innerHTML = contenu; zone.appendChild(d); return d; }
  function enchainer(zone, api, exos, message) {
    var i = 0;
    function suivant() {
      if (i >= exos.length) { api.valider(message); return; }
      var bloc = el("div");
      if (i > 0) bloc.style.marginTop = "1.2rem";
      zone.appendChild(bloc);
      exos[i++](bloc, suivant);
    }
    suivant();
  }

  var POS = ["love", "great", "amazing", "good"];
  var NEG = ["terrible", "bad", "boring", "awful"];
  var TRAIN = [
    { t: "I love this movie!", y: 1 },
    { t: "This is terrible.", y: 0 },
    { t: "An amazing experience!", y: 1 },
    { t: "Great cast, great music.", y: 1 },
    { t: "Boring and bad.", y: 0 },
    { t: "Good idea, awful ending.", y: 0 }
  ];
  var VALID = [
    { t: "Amazing and great!", y: 1 },
    { t: "Bad acting, boring plot.", y: 0 },
    { t: "I love the music.", y: 1 }
  ];
  function mots(t) { return t.toLowerCase().match(/[a-z]+/g) || []; }
  function score(t) {
    var s = 0;
    mots(t).forEach(function (m) { if (POS.indexOf(m) >= 0) s++; if (NEG.indexOf(m) >= 0) s--; });
    return s;
  }
  function predire(theta, s) { return Math.max(0, Math.min(1, 0.5 + theta * s)); }
  function perte(theta, data) {
    var L = 0;
    data.forEach(function (a) { var e = predire(theta, score(a.t)) - a.y; L += e * e; });
    return L / data.length;
  }
  function souligner(t) {
    return t.replace(/[A-Za-z]+/g, function (m) {
      var l = m.toLowerCase();
      if (POS.indexOf(l) >= 0) return "<b>" + m + "</b><sup>+</sup>";
      if (NEG.indexOf(l) >= 0) return "<b>" + m + "</b><sup>−</sup>";
      return m;
    });
  }
  function etiquette(y) { return y ? "positif (1)" : "négatif (0)"; }
  var MODELE =
    "<div class='encadre'><span class='titre-encadre'>Notre modèle (fil rouge)</span>" +
    "Représentation : <span class='mono'>s</span> = (nombre de mots positifs) − (nombre de mots négatifs), avec les listes " +
    "<span class='mono'>+ {love, great, amazing, good}</span> et <span class='mono'>− {terrible, bad, boring, awful}</span>.<br>" +
    "Modèle : <span class='mono'>ŷ = f_θ(s) = 0,5 + θ·s</span>, ramené entre 0 et 1. ŷ proche de 1 → « positif », proche de 0 → « négatif ».</div>";

  function curseur(zone, valeur, surChange) {
    var ligne = el("div", "saisie");
    var lab = el("label", null, "θ =");
    var r = el("input");
    r.type = "range"; r.min = "0"; r.max = "1"; r.step = "0.05"; r.value = String(valeur);
    r.style.flex = "1 1 10rem";
    r.id = "theta" + Math.random().toString(36).slice(2, 7); lab.htmlFor = r.id;
    var v = el("span", "mono", fmt(valeur));
    r.addEventListener("input", function () { var x = Number(r.value); v.textContent = fmt(x); surChange(x); });
    ligne.appendChild(lab); ligne.appendChild(r); ligne.appendChild(v);
    zone.appendChild(ligne);
    return r;
  }
  function tablePredictions(zone) {
    var t = el("table", "tableau");
    zone.appendChild(t);
    return function (theta, avecPerte) {
      var h = "<tr><th>Avis</th><th class='num'>s</th><th class='num'>ŷ</th><th class='num'>y</th>" + (avecPerte ? "<th class='num'>ℓ</th>" : "") + "</tr>";
      TRAIN.forEach(function (a) {
        var s = score(a.t), p = predire(theta, s);
        h += "<tr><td>" + a.t + "</td><td class='num'>" + fmt(s, 0) + "</td><td class='num'>" + fmt(p) + "</td><td class='num'>" + a.y + "</td>" +
          (avecPerte ? "<td class='num'>" + fmt((p - a.y) * (p - a.y), 3) + "</td>" : "") + "</tr>";
      });
      t.innerHTML = h;
    };
  }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Quatre briques",
      texte:
        "<p>Le cours : <b>un modèle est une fonction paramétrée, ajustée à partir d'exemples, pas une source de vérité.</b> Le problème d'apprentissage assemble quatre briques :</p>" +
        "<ul><li><b>Données</b> : des exemples (et leurs étiquettes, quand il y en a) ;</li>" +
        "<li><b>Représentation</b> : le texte devient des nombres ou des tenseurs (identifiants de tokens, embeddings) ;</li>" +
        "<li><b>Modèle</b> <span class='mono'>f_θ(x)</span> : une fonction de paramètres θ qui transforme une entrée x en prédiction ŷ ;</li>" +
        "<li><b>Perte</b> <span class='mono'>ℒ(ŷ, y)</span> : à quel point la prédiction se trompe (par exemple entropie croisée, MSE).</li></ul>",
      objectif: "Remettre les briques dans l'ordre où les données les traversent.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          consigne: "Touche les briques dans l'ordre :",
          items: ["Données", "Représentation", "Modèle f_θ", "Perte ℒ"], separateur: "→",
          bravo: "Données → représentation → modèle → perte. La perte compare ŷ à la vraie étiquette y.",
          surReussite: function () { api.valider("On va construire chaque brique sur un exemple minuscule."); }
        });
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Représenter : du texte aux nombres",
      texte:
        "<p>Voici nos <b>données d'entraînement</b> : six avis étiquetés (1 = positif, 0 = négatif).</p>" +
        "<table class='tableau'>" + TRAIN.map(function (a) { return "<tr><td>" + souligner(a.t) + "</td><td>" + etiquette(a.y) + "</td></tr>"; }).join("") + "</table>" +
        MODELE +
        "<div class='signalement'>Le cours représente le texte par des identifiants de tokens puis des embeddings (diapo 15). " +
        "Le score s est une simplification de cette leçon, pour pouvoir tout calculer à la main ; les vraies représentations viennent au chapitre 2.</div>",
      objectif: "Calculer la représentation s de deux avis.",
      installer: function (zone, api) {
        enchainer(zone, api, [
          function (bloc, ok) {
            Exercices.nombre(bloc, { label: "s(« Great cast, great music. ») =", attendu: 2, placeholder: "ex. 1", indice: "Compte les mots de la liste + (chaque occurrence compte), retire ceux de la liste −.", bravo: "Deux fois « great », aucun mot négatif : s = 2.", surReussite: ok });
          },
          function (bloc, ok) {
            Exercices.nombre(bloc, { label: "s(« Good idea, awful ending. ») =", attendu: 0, placeholder: "ex. 1", indice: "Un mot positif, un mot négatif.", bravo: "1 − 1 = 0 : cette représentation ne voit aucune différence avec un avis neutre, alors que l'avis est négatif.", surReussite: ok });
          }
        ], "La représentation fixe ce que le modèle peut voir : ici, ni l'ordre des mots ni « but », ni le reste du vocabulaire.");
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Un modèle paramétré",
      texte:
        "<p>Le même modèle <span class='mono'>ŷ = 0,5 + θ·s</span> donne des prédictions différentes selon la valeur de son <b>paramètre</b> θ. " +
        "Avec θ = 0, il répond 0,5 à tout : il n'a rien appris.</p>",
      objectif: "Régler θ pour que ŷ(« I love this movie! ») = 0,8.",
      tester: function (z) { var r = z.querySelector("input[type=range]"); r.value = "0.3"; r.dispatchEvent(new Event("input")); },
      installer: function (zone, api) {
        var maj = null;
        curseur(zone, 0, function (th) { maj(th); });
        var dessiner = tablePredictions(zone);
        maj = function (th) {
          dessiner(th, false);
          var p = predire(th, 1);
          if (Math.abs(p - 0.8) < 1e-9) {
            api.retour("θ = 0,3 : ŷ = 0,5 + 0,3 × 1 = 0,8.", true);
            api.valider("Apprendre, c'est trouver automatiquement une bonne valeur des paramètres. Ici il y en a un seul ; un réseau de neurones en a des millions.");
          } else api.retour("ŷ(« I love this movie! ») = " + fmt(p), null);
        };
        maj(0);
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "La perte",
      texte:
        "<p>La <b>fonction de perte</b> mesure l'écart entre prédictions et cibles. C'est un objectif <b>différentiable</b> qu'on minimise pendant l'entraînement :</p>" +
        "<div class='formule'>ℒ(θ) = (1/N) Σᵢ ℓ(ŷᵢ, yᵢ)</div>" +
        "<p>On prend ici l'erreur au carré, <span class='mono'>ℓ(ŷ, y) = (ŷ − y)²</span> (moyennée, c'est la MSE). Voici les prédictions pour θ = 0,5.</p>",
      objectif: "Calculer ℒ(0,5) sur les 6 avis, à 0,001 près.",
      installer: function (zone, api) {
        tablePredictions(zone)(0.5, false);
        Exercices.nombre(zone, {
          label: "ℒ(0,5) =", attendu: perte(0.5, TRAIN), tolerance: 0.001, placeholder: "ex. 0,1",
          indice: "Calcule (ŷ − y)² pour chaque ligne : la plupart valent 0. Additionne, puis divise par N = 6.",
          bravo: "Seul « Good idea, awful ending. » est mal prédit : (0,5 − 0)² = 0,25. ℒ = 0,25 / 6 ≈ 0,042.",
          surReussite: function () { api.valider("Plus la perte est basse, mieux le modèle colle aux données d'entraînement."); }
        });
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Apprendre = réduire la perte",
      texte:
        "<p>Entraîner, c'est <b>ajuster les paramètres pour faire baisser la perte</b> sur les données d'entraînement. " +
        "Ici on le fait à la main ; la descente de gradient le fera automatiquement (leçon « Descente de gradient »).</p>" +
        "<p>La courbe montre ℒ(θ) pour toutes les valeurs de θ entre 0 et 1.</p>",
      objectif: "Trouver un θ qui donne la perte d'entraînement minimale.",
      tester: function (z) { var r = z.querySelector("input[type=range]"); r.value = "0.6"; r.dispatchEvent(new Event("input")); },
      installer: function (zone, api) {
        var c = el("div", "cadre-figure");
        zone.appendChild(c);
        var g = new Courbes(c, { largeur: 340, hauteur: 200 });
        var info = el("p", "legende-figure");
        zone.appendChild(info);
        var min = perte(0.5, TRAIN);
        function maj(th) {
          g.dessiner({
            xmin: 0, xmax: 1, ymax: 0.4, nomX: "θ",
            fonctions: [{ label: "ℒ(θ)", f: function (t) { return perte(t, TRAIN); } }],
            marque: { x: th, texte: "θ" }
          });
          var L = perte(th, TRAIN);
          info.innerHTML = "<span>θ = <span class='mono'>" + fmt(th) + "</span></span><span>ℒ(θ) = <span class='mono'>" + fmt(L, 4) + "</span></span>";
          if (Math.abs(L - min) < 1e-9) {
            api.retour("ℒ = " + fmt(L, 4) + " : c'est le minimum.", true);
            api.valider("Dès θ = 0,5, tous les avis sauf un sont parfaitement prédits : la perte atteint son minimum, 0,25 / 6. Plusieurs θ donnent ce minimum.");
          } else api.retour("", null);
        }
        curseur(zone, 0, maj);
        maj(0);
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "La perte d'entraînement n'est pas la performance",
      texte:
        "<p>Un second modèle, <b>« Mémoire »</b>, apprend par cœur : si l'avis est exactement un avis d'entraînement, il renvoie son étiquette ; sinon il répond 0,5. " +
        "Sa perte d'entraînement est <b>nulle</b>, plus basse que celle de notre modèle (θ = 0,5).</p>" +
        "<p>Le cours : <b>l'objectif est une performance fiable sur des données jamais vues, pas la perte d'entraînement la plus basse possible.</b> " +
        "On évalue donc sur un ensemble séparé. Trois avis de <b>validation</b>, jamais vus pendant l'entraînement :</p>" +
        "<table class='tableau'>" + VALID.map(function (a) { return "<tr><td>" + souligner(a.t) + "</td><td>" + etiquette(a.y) + "</td></tr>"; }).join("") + "</table>",
      objectif: "Calculer la perte de validation de « Mémoire », puis choisir le modèle à garder.",
      installer: function (zone, api) {
        enchainer(zone, api, [
          function (bloc, ok) {
            Exercices.nombre(bloc, {
              label: "ℒ_validation(Mémoire) =", attendu: 0.25, tolerance: 0.001, placeholder: "ex. 0,1",
              indice: "« Mémoire » n'a vu aucun de ces 3 avis : il répond 0,5 à chacun. Calcule (0,5 − y)² puis la moyenne.",
              bravo: "(0,25 + 0,25 + 0,25) / 3 = 0,25. Et notre modèle à θ = 0,5 ? s = 2, −2, 1 → ŷ = 1, 0, 1 : perte de validation 0.",
              surReussite: ok
            });
          },
          function (bloc, ok) {
            html(bloc, "<table class='tableau'><tr><th>Modèle</th><th class='num'>ℒ entraînement</th><th class='num'>ℒ validation</th></tr>" +
              "<tr><td>Mémoire</td><td class='num'>0</td><td class='num'>0,25</td></tr>" +
              "<tr><td>θ = 0,5</td><td class='num'>" + fmt(perte(0.5, TRAIN), 3) + "</td><td class='num'>" + fmt(perte(0.5, VALID), 3) + "</td></tr></table>");
            Exercices.choix(bloc, {
              question: "Quel modèle garder ?",
              options: ["θ = 0,5 : il généralise aux avis jamais vus.", "Mémoire : sa perte d'entraînement est la plus basse."],
              bonne: 0,
              expliquer: ["Exact. « Mémoire » a mémorisé l'ensemble d'entraînement au lieu d'apprendre une règle générale : c'est le sur-apprentissage poussé à l'extrême.", "Non : une perte d'entraînement basse ne garantit rien sur des données nouvelles."],
              surReussite: ok
            });
          }
        ], "Apprendre = choisir les paramètres qui réduisent l'erreur attendue sur des données jamais vues. L'ensemble d'entraînement sert à ajuster θ ; un ensemble séparé (validation / test) sert à estimer la performance. Le cours découpe par exemple 80 % pour apprendre, 20 % pour évaluer.");
      }
    },

    /* 7 ─────────────────────────────────────────────────────────── */
    {
      titre: "Choisir la métrique avant de voir les résultats",
      texte:
        "<p>Une <b>métrique</b> traduit le comportement du modèle en une quantité qu'on peut comparer. La perte sert à <i>optimiser</i>, la métrique à <i>évaluer</i> : " +
        "« optimisation et évaluation répondent à des questions différentes ». Le cours donne un tableau selon le type de tâche ; les métriques seront définies dans la leçon « Mesurer la performance ».</p>" +
        "<p class='discret'>Règle du cours : choisir la métrique selon l'objectif d'apprentissage — pas après avoir vu les résultats.</p>",
      objectif: "Associer chaque famille de métriques à son type de tâche.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["Classification", "Régression", "Non supervisé", "Génération"],
          items: [
            { texte: "Accuracy · précision · rappel · F1", bonne: 0, explication: "On mesure les bonnes décisions et les erreurs par classe." },
            { texte: "MAE · MSE · RMSE · R²", bonne: 1, explication: "On mesure la distance entre prédictions et cibles numériques." },
            { texte: "Silhouette · inertie · erreur de reconstruction", bonne: 2, explication: "On mesure la qualité d'une structure (cohésion des groupes, reconstruction)." },
            { texte: "Perplexité · métriques de tâche · évaluation humaine", bonne: 3, explication: "On mesure la qualité des séquences produites." }
          ],
          surReussite: function () { api.valider("Notre classifieur d'avis est une classification : on l'évaluerait avec l'accuracy, la précision, le rappel ou le F1, même si on l'entraîne avec une perte comme la MSE ou l'entropie croisée."); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning",
    id: "probleme-apprentissage",
    etapes: etapes,
    fin: {
      texte:
        "<ul><li>Quatre briques : données → représentation → modèle <span class='mono'>f_θ</span> → perte <span class='mono'>ℒ(ŷ, y)</span>.</li>" +
        "<li><span class='mono'>ℒ(θ) = (1/N) Σ ℓ(ŷᵢ, yᵢ)</span> ; entraîner = ajuster θ pour la faire baisser.</li>" +
        "<li>Une perte d'entraînement basse ne garantit pas une bonne performance : on évalue sur des données séparées (validation / test).</li>" +
        "<li>La perte sert à optimiser, la métrique à évaluer ; on choisit la métrique selon la tâche, avant de voir les résultats.</li></ul>",
      cartes: "rappels-fondements"
    }
  });
})();
