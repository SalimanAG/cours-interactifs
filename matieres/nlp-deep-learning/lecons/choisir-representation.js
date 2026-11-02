/* Leçon 2.5 : Choisir et évaluer une représentation (cours 2, diapos 50 à 58). */
(function () {
  "use strict";
  var N = NLP;

  var etapes = [
    {
      titre: "Partir de la tâche, commencer simple",
      texte: "<p>Diapo 50 : <b>il n'y a pas de meilleure représentation dans l'absolu</b>. On part de la tâche, des données et des contraintes, on établit une base simple, et on monte en puissance si besoin.</p>",
      objectif: "Remettre la démarche dans l'ordre.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, { items: ["tâche", "données", "budget", "baseline TF-IDF + modèle linéaire", "représentations apprises si besoin"], separateur: "→", surReussite: function () { api.valider("Budget : latence (temps réel ou non), mémoire (appareil ou serveur), puissance de calcul, énergie et coût."); } });
      }
    },
    {
      titre: "Le guide de choix",
      texte: "<p>Diapo 51 : <b>caractéristiques creuses</b> (simples, interprétables, souvent très efficaces) ou <b>représentations neuronales</b> (plus expressives, pour une compréhension plus complexe).</p>",
      objectif: "Ranger chaque situation.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Creux (BoW, TF-IDF)", "Neuronal (embeddings, BERT)"], items: [
          { texte: "Besoin d'interprétabilité (caractéristiques lisibles)", bonne: 0 },
          { texte: "Peu de données étiquetées", bonne: 0, explication: "Le cours les classe ainsi ; un modèle pré-entraîné peut aussi aider (transfert)." },
          { texte: "Inférence rapide sur CPU", bonne: 0 },
          { texte: "Signal lexical fort : les mots exacts suffisent", bonne: 0 },
          { texte: "Transfert sémantique : généraliser entre domaines ou contextes proches", bonne: 1 },
          { texte: "Le contexte compte : ordre des mots, polysémie, dépendances longues", bonne: 1 },
          { texte: "Assez de puissance de calcul (GPU)", bonne: 1 }
        ], surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Évaluer la représentation, pas le hasard",
      texte: "<p>Diapo 52 : pour comparer des représentations, <b>garder le dispositif fixe</b>, évaluer plusieurs aspects et analyser les erreurs.</p>",
      objectif: "Cocher ce qu'il faut garder identique d'une représentation à l'autre.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Pour une comparaison équitable :", options: ["les mêmes découpages train / dev / test (ex. 70 / 15 / 15)", "le même prétraitement, vocabulaire ajusté sur le train seulement", "un test différent pour chaque représentation", "plusieurs métriques : qualité, coût d'entraînement, latence, mémoire"], bonnes: [0, 1, 3], explication: "Puis inspecter les erreurs (synonymes, négation, changement de domaine) pour savoir si elles viennent de la représentation ou du classifieur.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "La check-list de bout en bout",
      texte: "<p>Diapo 53 : un déroulé pratique pour construire et évaluer des représentations de texte.</p>",
      objectif: "Ordonner les cinq étapes.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, { items: ["unité et vocabulaire", "pipeline d'encodage ajusté sur le train", "baseline creuse", "représentations denses ou contextuelles", "évaluer qualité, coût, robustesse, biais"], separateur: "→", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Les bibliothèques",
      texte: "<p>Diapo 57 : de quoi passer du texte aux vecteurs en Python.</p>",
      objectif: "Associer chaque outil à son usage.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["scikit-learn", "gensim", "Hugging Face", "sentence-transformers"], items: [
          { texte: "CountVectorizer, TfidfVectorizer, n-grammes", bonne: 0 },
          { texte: "Word2Vec, embeddings pré-entraînés GloVe (TP 3)", bonne: 1 },
          { texte: "Encodeurs Transformer pré-entraînés (BERT, RoBERTa…)", bonne: 2 },
          { texte: "Un vecteur par phrase ou document, pour la similarité sémantique", bonne: 3 }
        ], surReussite: function () { api.valider("À retenir (diapo 58) : l'encodage est un goulot d'information ; les bases creuses restent précieuses ; les vecteurs denses échangent de l'interprétabilité contre du transfert ; le pré-entraînement contextuel rend les représentations réutilisables."); } });
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "choisir-representation", etapes: etapes, fin: { texte: "<ul><li>Tâche → données → budget → baseline → monter en puissance.</li><li>Creux : interprétable, peu de données, CPU, signal lexical. Neuronal : transfert, contexte, GPU.</li><li>Comparer à dispositif fixe, plusieurs métriques, analyse d'erreurs.</li></ul>", cartes: "embeddings" } });
})();
