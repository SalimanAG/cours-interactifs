/* Quiz blanc 2 (même format : 20 questions, 30 minutes, sans calculatrice). */
Tests.enregistrer({
  matiere: "nlp-deep-learning", id: "quiz-blanc-2", titre: "Quiz blanc 2 (20 questions, 30 min)",
  notions: {
    intro: { titre: "Cours 1 — Introduction", lecon: "mesurer-performance" },
    encodage: { titre: "Cours 2 — Text Encoding", lecon: "texte-identifiants" },
    rnn: { titre: "Cours 3 — RNN, LSTM, GRU", lecon: "neurone-recurrent" }
  },
  questions: [
    { id: "q1", notion: "intro", enonce: "IA, ML et DL :", options: ["IA ⊃ ML ⊃ DL", "DL ⊃ ML ⊃ IA", "ML ⊃ IA ⊃ DL"], bonnes: [0], explication: "" },
    { id: "q2", notion: "intro", enonce: "Le NLP neuronal repose largement sur…", options: ["un pré-entraînement auto-supervisé puis une adaptation supervisée", "des règles écrites à la main", "un apprentissage uniquement non supervisé"], bonnes: [0], explication: "" },
    { id: "q3", notion: "intro", enonce: "Matrice de confusion [[8, 2], [2, 8]] (lignes = vraies classes). Accuracy ?", options: ["0,8", "0,5", "0,2", "1"], bonnes: [0], explication: "16 / 20." },
    { id: "q4", notion: "intro", enonce: "Même matrice. Rappel de la classe 0 ?", options: ["0,8", "0,2", "1", "0,5"], bonnes: [0], explication: "Ligne 0 : 8 / (8 + 2)." },
    { id: "q5", notion: "intro", enonce: "Pourquoi rapporter le macro-F1 en plus de l'accuracy ?", options: ["chaque classe compte autant, même rare", "il est toujours plus élevé", "il ne dépend pas des erreurs"], bonnes: [0], explication: "" },
    { id: "q6", notion: "intro", enonce: "Standardisation avec μ = 10, σ = 2 (calculés sur le train). z pour x = 14 ?", options: ["2", "4", "7", "0,5"], bonnes: [0], explication: "(14 − 10) / 2." },
    { id: "q7", notion: "intro", enonce: "Couche de sortie d'une régression (cours 1) :", options: ["pas de fonction d'activation", "softmax", "sigmoïde"], bonnes: [0], explication: "" },
    { id: "q8", notion: "intro", enonce: "Si le taux d'apprentissage η est trop grand…", options: ["la descente peut osciller et diverger", "la convergence est seulement plus lente", "le gradient devient nul"], bonnes: [0], explication: "" },
    { id: "q9", notion: "encodage", enonce: "Les 4 décisions du pipeline d'entrée, dans l'ordre :", options: ["segmenter, indexer, représenter, mettre en lots", "représenter, segmenter, indexer, mettre en lots", "indexer, segmenter, mettre en lots, représenter"], bonnes: [0], explication: "" },
    { id: "q10", notion: "encodage", enonce: "Avantage des tokens sous-mots (BPE) sur les tokens mots ?", options: ["moins de mots inconnus (vocabulaire ouvert)", "séquences plus courtes", "plus lisibles"], bonnes: [0], explication: "En contrepartie, les séquences sont plus longues." },
    { id: "q11", notion: "encodage", enonce: "Vocabulaire : &lt;PAD&gt; 0, &lt;UNK&gt; 1, the 2, cat 3. « the dog » devient…", options: ["2 1", "2 0", "2 3", "2"], bonnes: [0], explication: "« dog » est inconnu." },
    { id: "q12", notion: "encodage", enonce: "Réduire la taille du vocabulaire (fréquence minimale plus haute)…", options: ["augmente le nombre de &lt;UNK&gt;", "supprime le padding", "augmente la mémoire nécessaire"], bonnes: [0], explication: "" },
    { id: "q13", notion: "encodage", enonce: "TF-IDF donne un poids élevé à un terme…", options: ["fréquent dans le document et rare dans le corpus", "rare dans le document et fréquent dans le corpus", "présent dans tous les documents"], bonnes: [0], explication: "" },
    { id: "q14", notion: "encodage", enonce: "Hypothèse distributionnelle :", options: ["des mots aux contextes semblables ont des sens semblables", "les mots fréquents sont les plus informatifs", "l'ordre des mots ne compte pas"], bonnes: [0], explication: "" },
    { id: "q15", notion: "encodage", enonce: "Une petite fenêtre de contexte capte surtout une similarité…", options: ["syntaxique / fonctionnelle", "thématique", "orthographique"], bonnes: [0], explication: "" },
    { id: "q16", notion: "encodage", enonce: "Lesquelles sont vraies pour une embedding statique (Word2Vec) ?", options: ["un seul vecteur par mot, quel que soit le contexte", "« bank » (rive) et « bank » (banque) ont le même vecteur", "un vecteur différent pour chaque occurrence"], bonnes: [0, 1], explication: "Le 3e cas décrit une représentation contextuelle (BERT)." },
    { id: "q17", notion: "rnn", enonce: "Dans un RNN déroulé sur 50 pas de temps, les paramètres sont…", options: ["les mêmes à chaque pas", "différents à chaque pas", "réinitialisés à chaque pas"], bonnes: [0], explication: "" },
    { id: "q18", notion: "rnn", enonce: "Dans un LSTM, la porte d'oubli fₜ…", options: ["dit quelle part de cₜ₋₁ garder", "dit quelle part de cₜ révéler dans hₜ", "propose le contenu candidat"], bonnes: [0], explication: "Révéler : porte de sortie ; candidat : c̃ₜ (tanh)." },
    { id: "q19", notion: "rnn", enonce: "Différences GRU / LSTM :", options: ["le GRU a 2 portes et un seul état", "le GRU a généralement moins de paramètres", "le GRU est toujours plus précis"], bonnes: [0, 1], explication: "Aucun n'est toujours meilleur." },
    { id: "q20", notion: "rnn", enonce: "Bidirectional(LSTM(64)) : taille de la représentation, et tâche pour laquelle il ne convient pas ?", options: ["128 ; prédire le token suivant", "64 ; classer un document", "128 ; classer un document"], bonnes: [0], explication: "Les tokens futurs ne sont pas disponibles en génération causale." }
  ]
});
