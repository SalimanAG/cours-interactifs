/* Leçon 1.10 : Transformer les variables (cours 1, diapos 44 à 46).
   Fil rouge : deux caractéristiques de clients d'une plateforme de films, l'âge
   (de 18 à 80 ans) et le revenu (de 5 000 à 100 000) — exemple redessiné. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;

  var etapes = [
    {
      titre: "Pourquoi changer l'échelle",
      texte:
        "<p>Le cours (diapo 45) : les caractéristiques à grande plage numérique <b>dominent les distances et les mises à jour du gradient</b>. " +
        "Âge entre 18 et 80, revenu entre 5 000 et 100 000 : deux clients d'âges 20 et 70 mais de revenus 30 000 et 30 100 ont une distance dominée par… le revenu.</p>",
      objectif: "Calculer la distance euclidienne entre ces deux clients.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "distance ≈", attendu: Math.sqrt(2500 + 10000), tolerance: 0.5, placeholder: "ex. 50", indice: "√(50² + 100²).", bravo: "≈ 111,8 : l'écart de 50 ans pèse moins que 100 € de revenu. Après mise à l'échelle, ce serait l'inverse.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Standardiser",
      texte:
        "<div class='formule'>z = (x − μ) / σ</div>" +
        "<p>Centre (moyenne 0) et réduit (écart-type 1). μ et σ sont <b>calculés sur l'ensemble d'entraînement</b>, puis appliqués tels quels à la validation et au test (diapos 44-45). " +
        "Âge : μ = 40, σ = 10 sur le train.</p>",
      objectif: "Standardiser un âge de 55 ans.",
      installer: function (zone, api) {
        Exercices.nombre(zone, { label: "z =", attendu: 1.5, placeholder: "ex. 1", bravo: "z = 1,5 : 1,5 écart-type au-dessus de la moyenne.", surReussite: function () { api.valider("Autres options citées : min-max (ramène dans [0, 1]) et mise à l'échelle robuste (médiane et IQR), moins sensible aux extrêmes."); } });
      }
    },
    {
      titre: "Normaliser : longueur 1",
      texte:
        "<div class='formule'>x′ = x / ‖x‖</div>" +
        "<p>On ne touche pas à une colonne mais à chaque <b>vecteur</b> (une ligne) : il garde sa direction et prend la longueur 1 (diapo 44). " +
        "C'est ce que fait <span class='mono'>TfidfVectorizer</span> par défaut sur chaque document (TP 3).</p>",
      objectif: "Normaliser x = (3 ; 4).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "x′₁ =", attendu: 0.6, placeholder: "ex. 0,5", indice: "‖x‖ = 5.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "x′₂ =", attendu: 0.8, placeholder: "ex. 0,5", surReussite: ok }); }
        ], "Après normalisation, le produit scalaire de deux vecteurs est directement leur cosinus.");
      }
    },
    {
      titre: "log(1 + x) contre l'asymétrie",
      texte:
        "<div class='formule'>x′ = log(1 + x)</div>" +
        "<p>Réduit une forte asymétrie à droite et rend la distribution plus symétrique (diapo 44). Le « + 1 » évite log(0) pour x = 0.</p>",
      objectif: "Transformer 0, 9 et 999 (ln).",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "ln(1 + 9) ≈", attendu: Math.log(10), tolerance: 0.01, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "ln(1 + 999) ≈", attendu: Math.log(1000), tolerance: 0.01, placeholder: "ex. 1", surReussite: ok }); }
        ], "0 → 0 ; 9 → 2,30 ; 999 → 6,91 : un rapport de 1 à 100 devient un rapport de 1 à 3.");
      }
    },
    {
      titre: "Plafonner (clip)",
      texte:
        "<div class='formule'>x′ = clip(x, q_low, q_high)</div>" +
        "<p>Les valeurs sous le quantile bas q_low deviennent q_low, celles au-dessus de q_high deviennent q_high (par exemple les quantiles 1 % et 99 %, calculés sur le train). Limite l'influence des extrêmes.</p>" +
        "<p>Nombre de mots des documents : q_low = 10, q_high = 1 200.</p>",
      objectif: "Plafonner 4 000 et 3.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "clip(4000) =", attendu: 1200, placeholder: "ex. 100", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "clip(3) =", attendu: 10, placeholder: "ex. 100", surReussite: ok }); }
        ], "Les valeurs entre 10 et 1 200 ne changent pas.");
      }
    },
    {
      titre: "Catégories et texte",
      texte:
        "<p>Le cours (diapo 46) : <b>l'encodage définit le voisinage que le modèle verra</b>.</p>" +
        N.tableau(["encodage", "principe", "quand"], [["<b>one-hot</b>", "une colonne 0/1 par catégorie, indépendantes", "peu de catégories ; creux et très grand sinon"], ["<b>embeddings</b>", "vecteurs denses appris avec la tâche", "tokens, catégories nombreuses"], ["<b>tokenisation</b>", "texte → suite de tokens d'un vocabulaire contrôlé (inconnus, padding, troncature)", "texte"]]) +
        "<p>Règle du cours : <b>ne jamais imposer une échelle ordinale arbitraire</b> si l'ordre n'a pas de sens.</p>",
      objectif: "Choisir un encodage pour chaque cas.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["One-hot", "Entiers ordonnés", "Embedding"], items: [
          { texte: "animal ∈ {cat, dog, bird}", bonne: 0, explication: "Coder cat = 1, dog = 2, bird = 3 dirait que dog est « entre » cat et bird." },
          { texte: "taille ∈ {petit, moyen, grand}", bonne: 1, explication: "Ici l'ordre a un sens." },
          { texte: "un mot parmi 20 000", bonne: 2 },
          { texte: "pays ∈ {France, Bénin, Japon, Brésil}", bonne: 0 }
        ], surReussite: function () { api.valider("Dans tous les cas : les paramètres (μ, σ, quantiles, vocabulaire, catégories) sont appris sur le train et appliqués tels quels ailleurs."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "transformer-variables", etapes: etapes,
    fin: { texte: "<ul><li>Standardiser z = (x − μ)/σ ; normaliser x/‖x‖ ; log(1 + x) ; clip aux quantiles.</li><li>Paramètres calculés sur le train, appliqués à validation et test.</li><li>One-hot pour des catégories sans ordre ; embeddings pour beaucoup de catégories ; tokenisation pour le texte.</li></ul>", cartes: "rappels-donnees" }
  });
})();
