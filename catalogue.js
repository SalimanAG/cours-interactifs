/* ==========================================================================
   catalogue.js — LA liste centrale du site.
   C'est le seul fichier partagé à modifier pour ajouter du contenu :
     - une matière  → ajouter un objet dans `matieres`
     - une leçon, un atelier ou un paquet de cartes → l'ajouter dans
       `contenus` du bon chapitre, avec son `fichier`.
   Un contenu dont `fichier` vaut null s'affiche « à venir ».
   Une matière sans `chapitres` s'affiche « à venir » sur l'accueil.

   Types de contenu :
     "lecon"   : page HTML de leçon (lecteur d'étapes). Indiquer `etapes`
                 (nombre d'étapes) pour que l'accueil calcule la progression.
     "atelier" : page HTML d'atelier (algorithme pas à pas). `etapes` aussi.
     "cartes"  : fichier JS de données d'un paquet de cartes de révision.
     "test"    : fichier JS de données d'un test noté (QCM, score par notion).
   Les chemins `fichier` sont relatifs à la racine du site.
   ========================================================================== */
window.CATALOGUE = {
  titre: "Cours interactifs",
  sousTitre: "M1 Informatique · Université Côte d'Azur — réviser en manipulant",

  matieres: [
    {
      id: "advanced-algorithms",
      titre: "Advanced Algorithms",
      dossier: "advenced_algorithm",
      description: "Algorithmique pour problèmes NP-difficiles : probabiliste, approximation, branching, programmation dynamique.",
      chapitres: [
        {
          id: "prerequis",
          titre: "Prérequis — mise à niveau",
          source: "Test d'autopositionnement",
          priorite: 2,
          resume: "Notations O/Ω/Θ, graphes et parcours, tableaux et listes, borne inférieure du tri. Faire les leçons, puis le test de contrôle.",
          contenus: [
            { type: "lecon", id: "notations-asymptotiques", titre: "Notations O, Ω, Θ", fichier: "matieres/advanced-algorithms/lecons/notations-asymptotiques.html", etapes: 7 },
            { type: "lecon", id: "graphes-parcours", titre: "Graphes, BFS et DFS", fichier: "matieres/advanced-algorithms/lecons/graphes-parcours.html", etapes: 8 },
            { type: "atelier", id: "bfs-dfs", titre: "BFS et DFS sur ton propre graphe", fichier: "matieres/advanced-algorithms/ateliers/bfs-dfs.html", etapes: 4 },
            { type: "lecon", id: "tableaux-listes", titre: "Tableau ou liste chaînée : combien coûte un accès ?", fichier: "matieres/advanced-algorithms/lecons/tableaux-listes.html", etapes: 4 },
            { type: "lecon", id: "tri-borne-inferieure", titre: "Pourquoi trier coûte Ω(n log n) comparaisons", fichier: "matieres/advanced-algorithms/lecons/tri-borne-inferieure.html", etapes: 5 },
            { type: "cartes", id: "prerequis", titre: "Prérequis", fichier: "matieres/advanced-algorithms/cartes/prerequis.js" },
            { type: "test", id: "controle-prerequis", titre: "Test de contrôle des prérequis", fichier: "matieres/advanced-algorithms/tests/controle-prerequis.js" }
          ]
        },
        {
          id: "intro",
          titre: "Introduction — Fibonacci de trois façons",
          source: "Cours 1",
          priorite: 1,
          resume: "Optimisation combinatoire ; récursif Θ(φⁿ), programmation dynamique O(n), exponentiation rapide O(log n).",
          contenus: [
            { type: "lecon", id: "fibonacci", titre: "Fibonacci : trois algorithmes, trois complexités", fichier: "matieres/advanced-algorithms/lecons/fibonacci.html", etapes: 6 },
            { type: "cartes", id: "intro", titre: "Introduction", fichier: "matieres/advanced-algorithms/cartes/intro.js" }
          ]
        },
        {
          id: "prog-dyn",
          titre: "Programmation dynamique",
          source: "TD1",
          priorite: 3,
          resume: "Restaurants sur l'autoroute, sac à dos à valeurs entières, complexité pseudo-polynomiale.",
          contenus: [
            { type: "lecon", id: "restaurants", titre: "Sur l'autoroute du profit", fichier: "matieres/advanced-algorithms/lecons/restaurants.html", etapes: 6 },
            { type: "atelier", id: "table-sac-a-dos", titre: "Remplir la table OPT(i, V) du sac à dos", fichier: "matieres/advanced-algorithms/ateliers/table-sac-a-dos.html", etapes: 4 },
            { type: "cartes", id: "prog-dyn", titre: "Programmation dynamique", fichier: "matieres/advanced-algorithms/cartes/prog-dyn.js" }
          ]
        },
        {
          id: "coupe-min",
          titre: "Algorithmes probabilistes — coupe minimum",
          source: "Cours 2 · TP1",
          priorite: 3,
          resume: "Contraction d'arête, algorithme de contraction aléatoire, probabilité de succès, nombre d'essais.",
          contenus: [
            {
              type: "lecon",
              id: "coupe-min-contraction",
              titre: "Coupe minimum par contraction aléatoire",
              fichier: "matieres/advanced-algorithms/lecons/coupe-min-contraction.html",
              etapes: 10
            },
            { type: "atelier", id: "contraction-tp", titre: "Contraction pas à pas et implémentation du TP1", fichier: "matieres/advanced-algorithms/ateliers/contraction-tp.html", etapes: 4 },
            {
              type: "cartes",
              id: "coupe-min",
              titre: "Coupe minimum",
              fichier: "matieres/advanced-algorithms/cartes/coupe-min.js"
            }
          ]
        },
        {
          id: "equilibrage",
          titre: "Approximation — équilibrage de charges",
          source: "Cours 3 · TD2",
          priorite: 3,
          resume: "Ratio d'approximation, makespan, List Scheduling (ratio 2), Longest Processing (3/2), k-centres.",
          contenus: [
            { type: "lecon", id: "list-scheduling", titre: "List Scheduling et la preuve du ratio 2", fichier: "matieres/advanced-algorithms/lecons/list-scheduling.html", etapes: 8 },
            { type: "atelier", id: "ls-lpt", titre: "List Scheduling vs Longest Processing sur les listes du TD2", fichier: "matieres/advanced-algorithms/ateliers/ls-lpt.html", etapes: 4 },
            { type: "lecon", id: "k-centres", titre: "k-centres : une 2-approximation gloutonne", fichier: "matieres/advanced-algorithms/lecons/k-centres.html", etapes: 6 },
            { type: "cartes", id: "approximation", titre: "Approximation", fichier: "matieres/advanced-algorithms/cartes/approximation.js" }
          ]
        },
        {
          id: "branching",
          titre: "Branching — stable maximum",
          source: "Cours 4 · TP2",
          priorite: 3,
          resume: "Stable maximum, branchement sur un sommet de degré minimum, O(1,45ⁿ), vecteur et facteur de branchement.",
          contenus: [
            { type: "lecon", id: "stable-max", titre: "Branching pour le stable maximum", fichier: null },
            { type: "atelier", id: "arbre-branching", titre: "L'arbre de récursion pas à pas", fichier: null },
            { type: "cartes", id: "branching", titre: "Branching", fichier: null }
          ]
        },
        {
          id: "fptas",
          titre: "Schéma d'approximation — sac à dos",
          source: "Cours 5",
          priorite: 3,
          resume: "Arrondi des valeurs, facteur d'échelle b, complexité O(n³/ε), ratio 1 + ε.",
          contenus: [
            { type: "lecon", id: "sac-a-dos-ptas", titre: "Approcher le sac à dos aussi près qu'on veut", fichier: null },
            { type: "cartes", id: "fptas", titre: "Schéma d'approximation", fichier: null }
          ]
        }
      ]
    },
    { id: "ai-models", titre: "AI Models and Applications", dossier: "AI Models and Applications" },
    { id: "distributed-computing", titre: "Distributed Computing and Learning", dossier: "Distributed Computing and Learning" },
    { id: "gestion-de-projet", titre: "Gestion de projet", dossier: "Gestion de projet" },
    { id: "model-checking", titre: "Model Checking for AI", dossier: "Model_checking_for_AI" },
    {
      id: "nlp-deep-learning",
      titre: "NLP and Deep Learning",
      dossier: "NLP_and_deep_learning",
      description: "Neural Language Processing : rappels ML/DL, encodage du texte (sac de mots, TF-IDF, embeddings), réseaux récurrents (RNN, LSTM, GRU) et attention. Évaluation : examen écrit (sur les TP et le code), TP déposés chaque semaine, projet personnel.",
      chapitres: [
        {
          id: "prerequis",
          titre: "Prérequis — mise à niveau (hors diapos)",
          source: "Prérequis annoncés sur Moodle : algèbre linéaire, probabilités, statistiques",
          priorite: 3,
          resume: "Vecteurs, produit scalaire, norme et cosinus ; matrices ; dérivée et gradient ; exp, ln, sigmoïde, tanh, softmax ; probabilités jointes et indépendance. Ce qui sert ensuite dans tout le cours.",
          contenus: [
            { type: "lecon", id: "vecteurs-produit-scalaire", titre: "Vecteurs, produit scalaire, norme, cosinus", fichier: "matieres/nlp-deep-learning/lecons/vecteurs-produit-scalaire.html", etapes: 7 },
            { type: "lecon", id: "matrices", titre: "Matrices : produit, transposée, formes", fichier: "matieres/nlp-deep-learning/lecons/matrices.html", etapes: 6 },
            { type: "lecon", id: "derivee-gradient", titre: "Pente, dérivée, gradient", fichier: "matieres/nlp-deep-learning/lecons/derivee-gradient.html", etapes: 6 },
            { type: "lecon", id: "fonctions-utiles", titre: "Fonctions utiles : exp, ln, sigmoïde, tanh, softmax", fichier: "matieres/nlp-deep-learning/lecons/fonctions-utiles.html", etapes: 7 },
            { type: "lecon", id: "probabilites", titre: "Probabilités de base : jointe, indépendance", fichier: "matieres/nlp-deep-learning/lecons/probabilites.html", etapes: 5 },
            { type: "cartes", id: "prerequis", titre: "Prérequis", fichier: "matieres/nlp-deep-learning/cartes/prerequis.js" },
            { type: "test", id: "test-positionnement", titre: "Test de positionnement", fichier: "matieres/nlp-deep-learning/tests/test-positionnement.js" }
          ]
        },
        {
          id: "rappels",
          titre: "Rappels Machine Learning et Deep Learning",
          source: "Cours 1 (Refresher) · TP Exploratory Data Analysis",
          priorite: 3,
          resume: "IA, ML, DL et paradigmes ; problème d'apprentissage et perte ; régression linéaire et descente de gradient ; sur-apprentissage et régularisation ; neurone et réseau ; métriques ; audit, nettoyage, transformation des données ; déséquilibre et fuite ; visualisation ; code du TP.",
          contenus: [
            { type: "lecon", id: "ia-ml-dl-paradigmes", titre: "IA, ML, DL et paradigmes", fichier: "matieres/nlp-deep-learning/lecons/ia-ml-dl-paradigmes.html", etapes: 7 },
            { type: "lecon", id: "probleme-apprentissage", titre: "Le problème d'apprentissage", fichier: "matieres/nlp-deep-learning/lecons/probleme-apprentissage.html", etapes: 7 },
            { type: "cartes", id: "rappels-fondements", titre: "Rappels ML/DL — fondements", fichier: "matieres/nlp-deep-learning/cartes/rappels-fondements.js" },
            { type: "lecon", id: "regression-lineaire", titre: "Régression linéaire, MSE, RMSE", fichier: "matieres/nlp-deep-learning/lecons/regression-lineaire.html", etapes: 6 },
            { type: "lecon", id: "descente-gradient", titre: "Descente de gradient", fichier: "matieres/nlp-deep-learning/lecons/descente-gradient.html", etapes: 7 },
            { type: "atelier", id: "descente-pas-a-pas", titre: "La descente pas à pas", fichier: "matieres/nlp-deep-learning/ateliers/descente-pas-a-pas.html", etapes: 4 },
            { type: "lecon", id: "sur-apprentissage", titre: "Sous-apprentissage, sur-apprentissage, régularisation", fichier: "matieres/nlp-deep-learning/lecons/sur-apprentissage.html", etapes: 6 },
            { type: "lecon", id: "neurone-reseau", titre: "Le neurone et le réseau multicouche", fichier: "matieres/nlp-deep-learning/lecons/neurone-reseau.html", etapes: 7 },
            { type: "cartes", id: "rappels-optimisation", titre: "Rappels ML/DL — optimisation et réseaux", fichier: "matieres/nlp-deep-learning/cartes/rappels-optimisation.js" },
            { type: "lecon", id: "mesurer-performance", titre: "Mesurer la performance", fichier: "matieres/nlp-deep-learning/lecons/mesurer-performance.html", etapes: 7 },
            { type: "atelier", id: "matrice-confusion", titre: "De la matrice de confusion aux métriques", fichier: "matieres/nlp-deep-learning/ateliers/matrice-confusion.html", etapes: 4 },
            { type: "lecon", id: "auditer-explorer", titre: "Auditer et explorer les données", fichier: "matieres/nlp-deep-learning/lecons/auditer-explorer.html", etapes: 7 },
            { type: "lecon", id: "nettoyer", titre: "Nettoyer : doublons, valeurs manquantes, valeurs extrêmes", fichier: "matieres/nlp-deep-learning/lecons/nettoyer.html", etapes: 6 },
            { type: "lecon", id: "transformer-variables", titre: "Transformer les variables", fichier: "matieres/nlp-deep-learning/lecons/transformer-variables.html", etapes: 6 },
            { type: "lecon", id: "desequilibre-fuite", titre: "Déséquilibre des classes et fuite de données", fichier: "matieres/nlp-deep-learning/lecons/desequilibre-fuite.html", etapes: 6 },
            { type: "lecon", id: "visualiser", titre: "Visualiser pour décider", fichier: "matieres/nlp-deep-learning/lecons/visualiser.html", etapes: 6 },
            { type: "atelier", id: "code-tp1", titre: "Code du TP 1 : prédire la sortie", fichier: "matieres/nlp-deep-learning/ateliers/code-tp1.html", etapes: 6 },
            { type: "cartes", id: "rappels-donnees", titre: "Rappels ML/DL — données et métriques", fichier: "matieres/nlp-deep-learning/cartes/rappels-donnees.js" },
            { type: "test", id: "test-rappels", titre: "Test : rappels ML/DL", fichier: "matieres/nlp-deep-learning/tests/test-rappels.js" }
          ]
        },
        {
          id: "encodage",
          titre: "Encodage et représentation du texte",
          source: "Cours 2 (Text Encoding) · TP Text Preprocessing · TP Text Data Encoding and Embeddings",
          priorite: 3,
          resume: "Tokenisation, vocabulaire et tokens spéciaux, padding et masque ; sac de mots, n-grammes, TF-IDF, cosinus ; co-occurrence, PPMI, SVD ; embeddings, Word2Vec, statique vs contextuel.",
          contenus: [
            { type: "lecon", id: "texte-identifiants", titre: "Du texte aux identifiants", fichier: "matieres/nlp-deep-learning/lecons/texte-identifiants.html", etapes: 8 },
            { type: "atelier", id: "pretraiter-sens", titre: "Prétraiter sans casser le sens", fichier: "matieres/nlp-deep-learning/ateliers/pretraiter-sens.html", etapes: 5 },
            { type: "lecon", id: "tf-idf-cosinus", titre: "Du sac de mots au TF-IDF, puis le cosinus", fichier: "matieres/nlp-deep-learning/lecons/tf-idf-cosinus.html", etapes: 11 },
            { type: "atelier", id: "tf-idf-main", titre: "TF-IDF à la main", fichier: "matieres/nlp-deep-learning/ateliers/tf-idf-main.html", etapes: 4 },
            { type: "lecon", id: "cooccurrence-ppmi-svd", titre: "Co-occurrence, PPMI, SVD", fichier: "matieres/nlp-deep-learning/lecons/cooccurrence-ppmi-svd.html", etapes: 7 },
            { type: "lecon", id: "embeddings-word2vec", titre: "Embeddings appris : de la table de lookup à Word2Vec", fichier: "matieres/nlp-deep-learning/lecons/embeddings-word2vec.html", etapes: 7 },
            { type: "lecon", id: "choisir-representation", titre: "Choisir et évaluer une représentation", fichier: "matieres/nlp-deep-learning/lecons/choisir-representation.html", etapes: 5 },
            { type: "atelier", id: "code-tp3", titre: "Code du TP 3 : scikit-learn et gensim", fichier: "matieres/nlp-deep-learning/ateliers/code-tp3.html", etapes: 6 },
            { type: "cartes", id: "pipeline-creux", titre: "Pipeline d'entrée et représentations creuses", fichier: "matieres/nlp-deep-learning/cartes/pipeline-creux.js" },
            { type: "cartes", id: "distributionnel", titre: "Sémantique distributionnelle et SVD", fichier: "matieres/nlp-deep-learning/cartes/distributionnel.js" },
            { type: "cartes", id: "embeddings", titre: "Embeddings appris", fichier: "matieres/nlp-deep-learning/cartes/embeddings.js" },
            { type: "test", id: "test-encodage", titre: "Test : encodage du texte", fichier: "matieres/nlp-deep-learning/tests/test-encodage.js" }
          ]
        },
        {
          id: "recurrents",
          titre: "RNN, LSTM et GRU",
          source: "Cours 3 (RNNs, LSTMs and GRUs)",
          priorite: 3,
          resume: "Neurone et couche récurrents, gradient qui s'évanouit ou explose, portes du LSTM et du GRU, bidirectionnel et empilé, formes Keras, préparation des séquences, encodeur-décodeur et attention.",
          contenus: [
            { type: "lecon", id: "neurone-recurrent", titre: "Le neurone récurrent, déroulé", fichier: null },
            { type: "lecon", id: "cellule-lstm", titre: "Une cellule LSTM, porte par porte", fichier: null },
            { type: "lecon", id: "gru", titre: "GRU : deux portes, un état", fichier: null },
            { type: "atelier", id: "formes-keras", titre: "Suivre les formes en Keras", fichier: null },
            { type: "atelier", id: "preparer-sequence", titre: "Préparer une séquence", fichier: null },
            { type: "lecon", id: "encodeur-attention", titre: "De l'encodeur-décodeur à l'attention", fichier: null },
            { type: "cartes", id: "recurrents", titre: "RNN, LSTM, GRU", fichier: null },
            { type: "cartes", id: "attention", titre: "Encodeur-décodeur et attention", fichier: null },
            { type: "test", id: "test-recurrents", titre: "Test : réseaux récurrents", fichier: null }
          ]
        },
        {
          id: "transformers",
          titre: "Transformers et self-attention",
          source: "Cours pas encore publié sur Moodle",
          priorite: 2,
          resume: "À venir : sera construit quand le cours sera disponible.",
          contenus: []
        },
        {
          id: "llms",
          titre: "LLMs",
          source: "Cours pas encore publié sur Moodle",
          priorite: 2,
          resume: "À venir : sera construit quand le cours sera disponible.",
          contenus: []
        }
      ]
    },
    { id: "agentic-software", titre: "Agentic Software Development", dossier: "agentic_software_development" },
    {
      id: "problem-solving",
      titre: "Problem Solving",
      dossier: "problem_solving",
      description: "Formaliser et résoudre des problèmes fortement combinatoires : modélisation CSP, gloutons, recherche locale, programmation par contraintes. Midterm le 20/10, examen final le 8/12 (2 h, tous documents).",
      chapitres: [
        {
          id: "intro",
          titre: "Introduction — problèmes faciles et difficiles",
          source: "Introduction",
          priorite: 2,
          resume: "Problème et instance, décision et optimisation, preuve d'optimalité, P vs NP, explosion combinatoire (2ⁿ interrupteurs, coloration).",
          contenus: [
            { type: "lecon", id: "decision-optimisation", titre: "Décision, optimisation et explosion combinatoire", fichier: null },
            { type: "cartes", id: "intro", titre: "Introduction", fichier: "matieres/problem-solving/cartes/intro.js" }
          ]
        },
        {
          id: "modelisation",
          titre: "Modélisation (CSP)",
          source: "Modélisation · annales 2018–2019",
          priorite: 3,
          resume: "Variables V, domaines D, contraintes C ; coloriage de carte, Send More Money, Zebra, n-reines, carré latin ; espace de recherche.",
          contenus: [
            { type: "lecon", id: "modeliser-csp", titre: "Modéliser un problème en CSP (coloriage de carte)", fichier: "matieres/problem-solving/lecons/modeliser-csp.html", etapes: 8 },
            { type: "atelier", id: "modeliser-examen", titre: "Modéliser comme à l'examen : 4 grilles", fichier: "matieres/problem-solving/ateliers/modeliser-examen.html", etapes: 4 },
            { type: "cartes", id: "modelisation", titre: "Modélisation", fichier: "matieres/problem-solving/cartes/modelisation.js" }
          ]
        },
        {
          id: "gloutons",
          titre: "Algorithmes gloutons",
          source: "Greedy Algorithms",
          priorite: 3,
          resume: "Choix localement optimal, heuristique ; rendu de monnaie, sac à dos fractionnaire et 0-1, sélection d'activités (fin croissante, preuve par échange).",
          contenus: [
            { type: "lecon", id: "selection-activites", titre: "Gloutons : la sélection d'activités", fichier: "matieres/problem-solving/lecons/selection-activites.html", etapes: 7 },
            { type: "atelier", id: "gloutons-atelier", titre: "Monnaie, sac à dos, faire le plein", fichier: null },
            { type: "cartes", id: "gloutons", titre: "Algorithmes gloutons", fichier: "matieres/problem-solving/cartes/gloutons.js" }
          ]
        },
        {
          id: "recherche-locale",
          titre: "Recherche locale",
          source: "Local Search",
          priorite: 2,
          resume: "Solution initiale, voisinage, marche aléatoire, descente et minima locaux, redémarrages, tabou, recherche locale par contraintes (n-reines).",
          contenus: [
            { type: "lecon", id: "cbls-reines", titre: "Recherche locale sur les n-reines", fichier: null },
            { type: "cartes", id: "recherche-locale", titre: "Recherche locale", fichier: "matieres/problem-solving/cartes/recherche-locale.js" }
          ]
        },
        {
          id: "ppc",
          titre: "Programmation par contraintes",
          source: "Constraint Programming (slides mises à jour en cours de semestre)",
          priorite: 3,
          resume: "Générer et tester, forward checking, propagation + exploration, support, BC et GAC, heuristiques dom/deg, alldifferent (couplage, intervalle de Hall), gcc.",
          contenus: [
            { type: "lecon", id: "filtrage-exploration", titre: "Filtrer puis explorer", fichier: null },
            { type: "lecon", id: "alldifferent", titre: "La contrainte alldifferent", fichier: null },
            { type: "atelier", id: "propagation-main", titre: "Propager à la main", fichier: null },
            { type: "cartes", id: "ppc", titre: "Programmation par contraintes", fichier: null }
          ]
        },
        {
          id: "hashcode",
          titre: "Hash Code",
          source: "Hash Code 2017 et 2018",
          priorite: 1,
          resume: "Self-driving rides (glouton puis recherche locale tabou) ; Streaming videos (glouton par requêtes, par regret).",
          contenus: [
            { type: "atelier", id: "self-driving", titre: "Self-driving rides : glouton puis tabou", fichier: null },
            { type: "atelier", id: "streaming", titre: "Streaming videos : glouton et regret", fichier: null }
          ]
        },
        {
          id: "entrainement",
          titre: "Entraînement — midterm",
          source: "Introduction · Modélisation · Gloutons · Recherche locale",
          priorite: 3,
          resume: "Test noté sur les quatre premiers cours, score par notion.",
          contenus: [
            { type: "test", id: "test-midterm", titre: "Test d'entraînement au midterm", fichier: "matieres/problem-solving/tests/test-midterm.js" }
          ]
        }
      ]
    },
    {
      id: "programming-challenge",
      titre: "Programming Challenge",
      dossier: "programming_challenge",
      description: "Résoudre des problèmes de concours : lire l'énoncé, choisir la structure, prouver le coût. Midterm oral le 20/10 (Is it a tree), examen final sur table.",
      chapitres: [
        {
          id: "midterm",
          titre: "Midterm oral — Is it a tree",
          source: "Cours 5 Tree, Exercise 1 · exo5_1 · oral du 20/10",
          priorite: 3,
          resume: "Arbre = non orienté, acyclique, connexe ; M = N − 1 puis BFS depuis 1 ; O(N + M). Leçon, puis trace au tableau, puis cartes de questions d'oral.",
          contenus: [
            { type: "lecon", id: "est-un-arbre", titre: "Is it a tree : de la définition au BFS", fichier: "matieres/programming-challenge/lecons/est-un-arbre.html", etapes: 8 },
            { type: "atelier", id: "trace-est-un-arbre", titre: "Trace au tableau sur des entrées inédites", fichier: "matieres/programming-challenge/ateliers/trace-est-un-arbre.html", etapes: 4 },
            { type: "cartes", id: "oral-est-un-arbre", titre: "Is it a tree — questions d'oral", fichier: "matieres/programming-challenge/cartes/oral-est-un-arbre.js" }
          ]
        },
        {
          id: "demarrer-es",
          titre: "Démarrer, entrées / sorties",
          source: "Cours 0 et 1 · exo1_1 à exo1_3",
          priorite: 2,
          resume: "Lire stdin, résoudre, écrire stdout ; verdicts du juge (AC, WA, TLE…) ; ASCII ; représentations des chaînes ; HELLOKIT, LC-Display.",
          contenus: [
            { type: "lecon", id: "stdin-verdict", titre: "Du stdin au verdict (HELLOKIT)", fichier: "matieres/programming-challenge/lecons/stdin-verdict.html", etapes: 7 },
            { type: "atelier", id: "lc-display", titre: "LC-Display : la grille de 2s + 3 lignes", fichier: "matieres/programming-challenge/ateliers/lc-display.html", etapes: 4 },
            { type: "cartes", id: "demarrer-es", titre: "Entrées / sorties", fichier: "matieres/programming-challenge/cartes/demarrer-es.js" }
          ]
        },
        {
          id: "nombres",
          titre: "Nombres",
          source: "Cours 2 · exo2_1 à exo2_3",
          priorite: 2,
          resume: "Complément à deux, IEEE 754, débordement ; addition de grands nombres (GILNUM) ; miroir de bits (MIRROR).",
          contenus: [
            { type: "lecon", id: "grands-nombres", titre: "Quand l'entier ne suffit plus (GILNUM)", fichier: "matieres/programming-challenge/lecons/grands-nombres.html", etapes: 7 },
            { type: "atelier", id: "miroir-bits", titre: "Miroir des n bits de poids faible (MIRROR)", fichier: "matieres/programming-challenge/ateliers/miroir-bits.html", etapes: 4 },
            { type: "cartes", id: "nombres", titre: "Nombres", fichier: "matieres/programming-challenge/cartes/nombres.js" }
          ]
        },
        {
          id: "tableaux",
          titre: "Tableaux",
          source: "Cours 3 · exo3_1 à exo3_3",
          priorite: 3,
          resume: "« What problems can arise ? » ; Making Book (force brute, arithmétique) ; It's a Murder ; plus longue sous-séquence avec au plus k uns.",
          contenus: [
            { type: "lecon", id: "making-book", titre: "Making Book : compter les chiffres", fichier: "matieres/programming-challenge/lecons/making-book.html", etapes: 6 },
            { type: "lecon", id: "sous-sequence", titre: "Plus longue sous-séquence connexe (tableau creux)", fichier: "matieres/programming-challenge/lecons/sous-sequence.html", etapes: 6 },
            { type: "cartes", id: "tableaux", titre: "Tableaux", fichier: "matieres/programming-challenge/cartes/tableaux.js" }
          ]
        },
        {
          id: "tri",
          titre: "Tri",
          source: "Cours 4 · exo4_1 à exo4_3",
          priorite: 3,
          resume: "Tri par insertion, tri fusion ; Candy Distribution ; compter les inversions en fusionnant ; It's a Murder, Yodaness Level.",
          contenus: [
            { type: "lecon", id: "candy", titre: "Candy Distribution : trier pour apparier", fichier: "matieres/programming-challenge/lecons/candy.html", etapes: 5 },
            { type: "lecon", id: "inversions", titre: "Compter les inversions en fusionnant (et Murder, Yodaness)", fichier: "matieres/programming-challenge/lecons/inversions.html", etapes: 7 },
            { type: "atelier", id: "fusion", titre: "La fusion pas à pas, avec le compteur", fichier: "matieres/programming-challenge/ateliers/fusion.html", etapes: 4 },
            { type: "cartes", id: "tri", titre: "Tri", fichier: "matieres/programming-challenge/cartes/tri.js" }
          ]
        },
        {
          id: "arbres",
          titre: "Arbres",
          source: "Cours 5 · exo5_2",
          priorite: 3,
          resume: "Parcours préfixe (NLR), infixe (LNR), postfixe (LRN) ; reconstruire un arbre à partir de deux parcours ; Tree order.",
          contenus: [
            { type: "lecon", id: "parcours-arbre", titre: "Les parcours d'un arbre binaire", fichier: "matieres/programming-challenge/lecons/parcours-arbre.html", etapes: 6 },
            { type: "lecon", id: "reconstruire-arbre", titre: "Reconstruire l'arbre depuis deux parcours (Tree order)", fichier: "matieres/programming-challenge/lecons/reconstruire-arbre.html", etapes: 6 },
            { type: "cartes", id: "arbres", titre: "Arbres", fichier: "matieres/programming-challenge/cartes/arbres.js" }
          ]
        },
        {
          id: "prog-dyn",
          titre: "Programmation dynamique",
          source: "Cours 6",
          priorite: 3,
          resume: "Sous-problèmes et DAG implicite ; sac à dos avec répétition V₁, V₂ ; sans répétition V₃(w, k).",
          contenus: [
            { type: "lecon", id: "sac-a-dos-repetition", titre: "Sac à dos avec répétition : de V₁ à V₂", fichier: "matieres/programming-challenge/lecons/sac-a-dos-repetition.html", etapes: 8 },
            { type: "atelier", id: "table-v3", titre: "Sans répétition : remplir la table V₃", fichier: "matieres/programming-challenge/ateliers/table-v3.html", etapes: 4 },
            { type: "cartes", id: "prog-dyn", titre: "Programmation dynamique", fichier: "matieres/programming-challenge/cartes/prog-dyn.js" }
          ]
        },
        {
          id: "automates",
          titre: "Machines à états",
          source: "Cours 7 (fichier « String Processing ») · exo7_1, exo7_2",
          priorite: 2,
          resume: "Automate fini ; Mealy et Moore ; décodeur de code préfixe ; goto, variable d'état, matrice de transitions ; filtre à rebonds, plaques.",
          contenus: [
            { type: "lecon", id: "mealy", titre: "Mealy : de la parité au filtre à rebonds", fichier: null },
            { type: "atelier", id: "plaques", titre: "Construire l'automate des plaques", fichier: null },
            { type: "cartes", id: "automates", titre: "Machines à états", fichier: null }
          ]
        },
        {
          id: "graphes",
          titre: "Graphes",
          source: "Cours 8 · exo8_1 à exo8_3",
          priorite: 2,
          resume: "Dettes entre banques (ANARC08G) : règle de réduction transitive, point fixe.",
          contenus: [
            { type: "lecon", id: "dettes-banques", titre: "Réduire les dettes entre banques", fichier: null },
            { type: "cartes", id: "graphes", titre: "Graphes", fichier: null }
          ]
        }
      ]
    },
    { id: "software-engineering", titre: "Software Engineering", dossier: "software_engineering" }
  ]
};
