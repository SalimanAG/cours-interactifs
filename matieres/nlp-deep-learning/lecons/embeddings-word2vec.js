/* Leçon 2.4 : Embeddings appris — de la table de lookup à Word2Vec, puis les
   représentations contextuelles (cours 2, diapos 42 à 49 ; TP 3, parties 5 à 7 ;
   TP 4 : Embedding(VOCAB_SIZE, 96, mask_zero=True)).
   Fil rouge : « the cat sits on the mat ». */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt, m = N.m;

  var etapes = [
    {
      titre: "Une couche d'embedding est une table apprise",
      texte:
        "<p>Diapo 43 : 1. tokeniser (« the cat sits » → IDs 892, 3187, 421) ; 2. chaque ID <b>sélectionne une ligne</b> de la matrice d'embeddings E ∈ ℝ^{|V| × d} ; " +
        "3. on obtient une séquence de vecteurs denses X ∈ ℝ^{n × d} ; 4. les lignes sélectionnées sont <b>mises à jour par rétropropagation</b> selon l'objectif d'entraînement. d vaut par exemple 100, 300 ou 768.</p>",
      objectif: "Prévoir la forme de la sortie, puis le nombre de paramètres.",
      installer: function (zone, api) {
        Jetons.rangee(zone, [{ nom: "tokens", valeurs: ["the", "cat", "sits"] }, { nom: "IDs", valeurs: [892, 3187, 421] }, { nom: "ligne de E", valeurs: ["E[892]", "E[3187]", "E[421]"] }]);
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "Avec d = 4, la sortie pour « the cat sits » a la forme…", options: ["(3, 4)", "(4, 3)", "(|V|, 4)", "(3,)"], bonne: 0, expliquer: ["Exact : n tokens × d dimensions. Pour un lot : (B, T, d), comme (B, 300, 96) dans le TP 4.", "Non : une ligne par token.", "Non : c'est la forme de E.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "paramètres de Embedding(20 000, 96) =", attendu: 1920000, placeholder: "ex. 1000", indice: "|V| × d (pas de biais).", surReussite: ok }); }
        ], "Lookup = one-hot × E (diapo 44) : on lit directement la ligne, sans faire le produit.");
      }
    },
    {
      titre: "Word2Vec : deux tâches de prédiction",
      texte:
        "<p>Diapo 45 : les deux variantes apprennent des embeddings en <b>prédisant des mots à partir de leur contexte</b>, dans des sens opposés.</p>" +
        N.tableau(["", "CBOW (Continuous Bag-of-Words)", "Skip-gram"], [["prédit", "le mot central à partir des mots du contexte", "les mots du contexte à partir du mot central"], ["exemple", "the cat _ on the mat → « sits »", "« sits » → the, cat, on, the"]]),
      objectif: "Associer chaque propriété à sa variante.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["CBOW", "Skip-gram"], items: [
          { texte: "Moyenne des embeddings du contexte, puis prédiction du mot central", bonne: 0 },
          { texte: "Plusieurs sorties à prédire par mot central (plus de paires d'entraînement)", bonne: 1 },
          { texte: "Entraînement efficace et régulier, bon pour les mots fréquents", bonne: 0 },
          { texte: "Bon pour les mots rares, capte des relations sémantiques fines", bonne: 1 }
        ], surReussite: function () { api.valider("TP 3 : Word2Vec(..., sg=1) = skip-gram ; sg=0 = CBOW."); } });
      }
    },
    {
      titre: "Fabriquer les paires d'entraînement (skip-gram)",
      texte: "<p>Phrase : « the cat sits on the mat ». Mot central : <b>sits</b>, fenêtre ±2. Chaque mot de la fenêtre donne une paire positive (sits, contexte).</p>",
      objectif: "Cocher les mots de contexte, puis compter les paires.",
      installer: function (zone, api) {
        Jetons.rangee(zone, [{ nom: "", valeurs: ["the", "cat", "sits", "on", "the", "mat"], classes: { 2: "courante" } }]);
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.cocher(b, { question: "Contextes de « sits » (±2) :", options: ["the (position 1)", "cat", "on", "the (position 5)", "mat"], bonnes: [0, 1, 2, 3], surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "paires positives pour « sits » :", attendu: 4, placeholder: "ex. 2", surReussite: ok }); }
        ], "Ces paires sont créées à partir du texte brut : c'est de l'apprentissage auto-supervisé.");
      }
    },
    {
      titre: "L'échantillonnage négatif",
      texte:
        "<p>Diapo 46 : avec un <b>softmax complet</b>, chaque paire (w, c) demande un score pour <b>chaque mot du vocabulaire</b> : précis mais très coûteux, le coût croît avec |V|. " +
        "Avec l'<b>échantillonnage négatif</b>, on compare la paire observée à quelques mots de bruit tirés au hasard (typiquement 5 à 20), selon une distribution comme unigramme^{3/4} :</p>" +
        "<div class='formule'>paire positive : σ(u_w · v_c) → rapprocher        paire négative : σ(−u_w · v_n) → éloigner</div>" +
        "<p>u_w = (1 ; 0,5) pour « sits », v_c = (2 ; −1) pour le contexte « cat ».</p>",
      objectif: "Calculer le score de la paire positive.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "σ(u_w · v_c) ≈", attendu: N.sigmoide(1.5), tolerance: 0.01, placeholder: "ex. 0,5", indice: "u_w · v_c = 2 − 0,5 = 1,5.", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "|V| = 10 000 et 5 négatifs : combien de scores calcule-t-on pour une paire ?", options: ["6 au lieu de 10 000", "5 au lieu de 10 000", "10 000 dans les deux cas"], bonne: 0, expliquer: ["1 positif + 5 négatifs.", "Non : il faut aussi le score de la paire positive.", "Non."], surReussite: ok }); }
        ], "L'entraînement déplace les vecteurs : paires observées rapprochées, paires tirées au hasard éloignées.");
      }
    },
    {
      titre: "La géométrie des embeddings",
      texte:
        "<p>Diapo 47 : des mots de sens proche tendent à être proches dans l'espace (king → queen, prince, monarch ; Paris → France, London, Berlin). " +
        "<b>Attention</b> : les voisins reflètent le corpus d'entraînement, y compris ses biais (stéréotypes, déséquilibres culturels ou historiques). " +
        "TP 3 : <span class='mono'>model.wv.most_similar(\"emma\", topn=5)</span> classe par similarité cosinus, qui reflète le contexte appris, pas forcément des synonymes.</p>",
      objectif: "Juger quatre affirmations du TP 3.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Réentraîner avec window=10 au lieu de window=2 rend la similarité plus thématique.", vrai: true },
          { texte: "Les voisins les plus proches sont toujours des synonymes.", vrai: false, explication: "" },
          { texte: "On peut calculer le cosinus entre un vecteur Word2Vec (entraîné sur Emma) et un vecteur GloVe de même dimension.", vrai: false, explication: "" },
          { texte: "Une proximité sur un graphique PCA se vérifie avec most_similar avant de conclure.", vrai: true }
        ], surReussite: function () { api.valider("Deux modèles entraînés séparément ont des coordonnées qui ne se correspondent pas : on compare leurs listes de voisins, pas leurs vecteurs (TP 3, partie 7)."); } });
      }
    },
    {
      titre: "Statique ou contextuel",
      texte:
        "<p>Diapo 48 : une embedding <b>statique</b> (Word2Vec, GloVe) donne <b>un seul vecteur par type de mot</b>, quel que soit le contexte : compacte, réutilisable, mais elle moyenne les sens. " +
        "Une représentation <b>contextuelle</b> (BERT…) produit <b>un vecteur par occurrence</b>, conditionné par la phrase : elle gère la polysémie, mais elle est moins compacte.</p>" +
        "<p>« I sat on the <b>bank</b> of the river » / « I want to go to the <b>bank</b> to withdraw money ».</p>",
      objectif: "Comparer les deux familles sur « bank ».",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Statique", "Contextuelle"], items: [
          { texte: "Le même vecteur pour les deux « bank »", bonne: 0 },
          { texte: "Deux vecteurs différents (rive / banque)", bonne: 1 },
          { texte: "Une table de |V| × d, lue par lookup", bonne: 0 },
          { texte: "Un modèle (encodeur) doit lire toute la phrase pour produire le vecteur", bonne: 1 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Le pré-entraînement rend les représentations réutilisables",
      texte:
        "<p>Diapo 49 : 1. texte brut (livres, articles, pages web, forums) ; 2. <b>pré-entraînement auto-supervisé</b> qui crée ses étiquettes à partir du texte : " +
        "<b>tokens masqués</b> (BERT : « The cat sat on the [MASK] » → mat) ou <b>token suivant</b> (GPT : « The cat sat on the » → mat) ; 3. un modèle pré-entraîné aux représentations générales ; " +
        "4. <b>adaptation</b> à des tâches.</p>",
      objectif: "Associer chaque mode d'adaptation à sa description.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Fine-tuning", "Prompting", "Param.-efficient"], items: [
          { texte: "Continuer l'entraînement sur un jeu étiqueté de la tâche", bonne: 0 },
          { texte: "Donner une description de la tâche et quelques exemples dans l'entrée, sans entraînement (in-context learning)", bonne: 1 },
          { texte: "N'ajuster qu'un petit nombre de paramètres (LoRA, adapters), le reste du modèle étant gelé", bonne: 2 }
        ], surReussite: function () { api.valider("Ce schéma sera repris dans les chapitres Transformers et LLMs."); } });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "nlp-deep-learning", id: "embeddings-word2vec", etapes: etapes,
    fin: { texte: "<ul><li>Embedding = table |V| × d apprise ; lookup = one-hot × E ; sortie (B, T, d).</li><li>Word2Vec : CBOW (contexte → centre), skip-gram (centre → contexte).</li><li>Échantillonnage négatif : 1 paire positive + k négatives (5–20), σ(u·v).</li><li>Voisins = contexte appris (et biais du corpus).</li><li>Statique (un vecteur par mot) vs contextuel (un vecteur par occurrence).</li><li>Pré-entraînement (masqué / token suivant) puis fine-tuning, prompting ou LoRA.</li></ul>", cartes: "embeddings" }
  });
})();
