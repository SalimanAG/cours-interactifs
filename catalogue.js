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
    {
      id: "ai-models",
      titre: "AI Models and Applications",
      dossier: "AI Models and Applications",
      description: "Réseaux de neurones, de la théorie (neurone à seuil, théorèmes de structure, XOR, rétropropagation) aux architectures (CNN, RNN, GNN), plus les SVM ; évaluer un classifieur et régler son ajustement. Format d'examen non communiqué : les tests mêlent QCM, calculs et preuves à remettre en ordre.",
      chapitres: [
        {
          id: "neurone-seuil",
          titre: "Neurone de McCulloch-Pitts et réseaux à seuil",
          source: "Notes 3 (McCulloch-Pitts) puis 1 (réseaux à seuil)",
          priorite: 3,
          resume: "Neurone biologique, seuil critique, période réfractaire ; y = H(Σ wᵢxᵢ − θ) ; réseau ⟨n, S, W, θ⟩, poids w_i^J ; ensembles d'états et fonctions de renormalisation S, S̲, H, SG.",
          contenus: [
            { type: "lecon", id: "neurone-a-seuil", titre: "Le neurone à seuil", fichier: "matieres/ai-models/lecons/neurone-a-seuil.html", etapes: 6 },
            { type: "lecon", id: "reseau-renormalisation", titre: "Un réseau à seuil et ses renormalisations", fichier: "matieres/ai-models/lecons/reseau-renormalisation.html", etapes: 8 },
            { type: "cartes", id: "neurone-seuil", titre: "Neurone et réseaux à seuil", fichier: "matieres/ai-models/cartes/neurone-seuil.js" }
          ]
        },
        {
          id: "structure",
          titre: "Conjugaison topologique et théorèmes de structure",
          source: "Notes 4 (conjugaison, booléen ↔ bipolaire, strictement séparateur) puis 2 (R → Q → Z)",
          priorite: 3,
          resume: "Homéomorphisme et φ∘f = g∘φ ; passer d'un réseau booléen à un réseau bipolaire et retour ; réseau strictement séparateur ; remplacer des poids réels par des rationnels, puis par des entiers.",
          contenus: [
            { type: "lecon", id: "booleen-bipolaire", titre: "Booléen ou bipolaire : la conjugaison topologique", fichier: "matieres/ai-models/lecons/booleen-bipolaire.html", etapes: 7 },
            { type: "lecon", id: "poids-entiers", titre: "Des poids réels aux poids entiers", fichier: "matieres/ai-models/lecons/poids-entiers.html", etapes: 7 },
            { type: "atelier", id: "preuves-en-ordre", titre: "Remettre les preuves en ordre", fichier: "matieres/ai-models/ateliers/preuves-en-ordre.html", etapes: 4 },
            { type: "cartes", id: "structure", titre: "Théorèmes de structure", fichier: "matieres/ai-models/cartes/structure.js" }
          ]
        },
        {
          id: "booleen-xor",
          titre: "Fonctions booléennes et problème du XOR",
          source: "Notes 5 (NN et fonctions booléennes) · NN-xor-problem",
          priorite: 3,
          resume: "AND, OR, NOT avec un seul neurone ; {AND, OR, NOT} est une base complète ; 16 fonctions à 2 entrées ; un neurone ne peut pas apprendre XOR (preuve par la droite).",
          contenus: [
            { type: "lecon", id: "and-or-not", titre: "AND, OR, NOT avec un neurone", fichier: "matieres/ai-models/lecons/and-or-not.html", etapes: 5 },
            { type: "lecon", id: "probleme-xor", titre: "Pourquoi un neurone ne fait pas XOR", fichier: "matieres/ai-models/lecons/probleme-xor.html", etapes: 7 },
            { type: "atelier", id: "seize-fonctions", titre: "Lesquelles des 16 fonctions ?", fichier: "matieres/ai-models/ateliers/seize-fonctions.html", etapes: 4 },
            { type: "cartes", id: "booleen-xor", titre: "Fonctions booléennes et XOR", fichier: "matieres/ai-models/cartes/booleen-xor.js" }
          ]
        },
        {
          id: "retropropagation",
          titre: "Réseaux feed-forward et rétropropagation",
          source: "Notes 6 (backpropagation) · TP vin",
          priorite: 3,
          resume: "Règles de construction en couches ; apprendre = trouver W et θ ; EQM ; ΔW = −ε ∂EQM/∂W ; S′ = S(1 − S) ; δ de sortie et δ caché ; condition d'arrêt ; split, fit, predict.",
          contenus: [
            { type: "lecon", id: "retropropagation-main", titre: "La rétropropagation à la main", fichier: null },
            { type: "atelier", id: "passe-avant-arriere", titre: "Une passe avant / arrière pas à pas", fichier: null },
            { type: "atelier", id: "code-tp-vin", titre: "Code du TP vin : scikit-learn et MLPClassifier", fichier: null },
            { type: "cartes", id: "retropropagation", titre: "Rétropropagation", fichier: null },
            { type: "test", id: "test-retropropagation", titre: "Test : neurones, structure, XOR, rétropropagation", fichier: null }
          ]
        },
        {
          id: "evaluation",
          titre: "Évaluer un classifieur",
          source: "Fiche 10 (matrice de confusion) · page 9 (Google, justesse / rappel / précision) · TP vin",
          priorite: 3,
          resume: "Matrice m_ij (ligne = vraie classe) ; TP, FN, FP, TN par classe ; accuracy, precision, recall, spécificité, F1 ; seuil, ROC et AUC, courbe PR ; macro, micro, pondéré ; déséquilibre ; calibration (ECE) ; intervalle de confiance.",
          contenus: [
            { type: "lecon", id: "matrice-confusion", titre: "Lire une matrice de confusion", fichier: "matieres/ai-models/lecons/matrice-confusion.html", etapes: 7 },
            { type: "lecon", id: "seuil-roc-pr", titre: "Seuil, courbe ROC et courbe PR", fichier: "matieres/ai-models/lecons/seuil-roc-pr.html", etapes: 7 },
            { type: "atelier", id: "exercices-metriques", titre: "Les 10 exercices de la fiche, corrigés", fichier: "matieres/ai-models/ateliers/exercices-metriques.html", etapes: 10 },
            { type: "cartes", id: "evaluation", titre: "Évaluer un classifieur", fichier: "matieres/ai-models/cartes/evaluation.js" },
            { type: "test", id: "test-evaluation", titre: "Test : métriques", fichier: "matieres/ai-models/tests/test-evaluation.js" }
          ]
        },
        {
          id: "ajustement",
          titre: "Sous-apprentissage, sur-apprentissage, régularisation",
          source: "Cours 5 (Overfitting and Underfitting)",
          priorite: 2,
          resume: "Erreurs d'entraînement et de validation ; biais² et variance ; fuite de données ; remèdes ; L1, L2, alpha et C ; train / validation / test, validation croisée.",
          contenus: [
            { type: "lecon", id: "diagnostiquer-ajustement", titre: "Diagnostiquer avec train et validation", fichier: null },
            { type: "cartes", id: "ajustement", titre: "Ajustement et régularisation", fichier: null },
            { type: "test", id: "test-ajustement", titre: "Test : ajustement", fichier: null }
          ]
        },
        {
          id: "cnn",
          titre: "Réseaux convolutifs (CNN)",
          source: "Cours CNN · étude de cas CIFAR-10",
          priorite: 3,
          resume: "Convolution et corrélation croisée ; canaux ; taille de sortie, stride, padding, dilatation ; champ récepteur ; pooling et GAP ; paramètres, FLOPs, mémoire ; ResNet ; le CNN CIFAR-10 (122 570 paramètres).",
          contenus: [
            { type: "lecon", id: "convolution-pas-a-pas", titre: "La convolution pas à pas", fichier: "matieres/ai-models/lecons/convolution-pas-a-pas.html", etapes: 8 },
            { type: "lecon", id: "formes-parametres", titre: "Formes, paramètres, coût", fichier: "matieres/ai-models/lecons/formes-parametres.html", etapes: 7 },
            { type: "atelier", id: "champ-recepteur", titre: "Calculer un champ récepteur", fichier: "matieres/ai-models/ateliers/champ-recepteur.html", etapes: 4 },
            { type: "atelier", id: "cnn-cifar10", titre: "Le CNN CIFAR-10 couche par couche", fichier: "matieres/ai-models/ateliers/cnn-cifar10.html", etapes: 5 },
            { type: "cartes", id: "cnn", titre: "CNN", fichier: "matieres/ai-models/cartes/cnn.js" },
            { type: "test", id: "test-cnn", titre: "Test : CNN", fichier: "matieres/ai-models/tests/test-cnn.js" }
          ]
        },
        {
          id: "rnn",
          titre: "Réseaux récurrents (RNN)",
          source: "Cours 5 (Recurrent Neural Networks)",
          priorite: 2,
          resume: "État caché, dépliage, poids partagés ; schémas entrée / sortie ; BPTT ; gradient qui s'évanouit ou explose ; LSTM, GRU, bidirectionnel ; code PyTorch.",
          contenus: [
            { type: "lecon", id: "rnn-a-la-main", titre: "Un RNN à la main", fichier: null },
            { type: "atelier", id: "code-rnn-pytorch", titre: "Code PyTorch : formes et sorties", fichier: null },
            { type: "cartes", id: "rnn", titre: "RNN", fichier: null }
          ]
        },
        {
          id: "gnn",
          titre: "Réseaux de neurones sur graphes (GNN)",
          source: "Cours 6 (GNN) · fiche GCN Cora · lab Cora",
          priorite: 3,
          resume: "Matrice d'adjacence, degrés, X ; tâches nœud, arête, graphe ; équivariance ; passage de messages ; Â = D̃^(−1/2) Ã D̃^(−1/2) et couche GCN ; GAT, GraphSAGE, GIN ; Cora, MLP contre GCN.",
          contenus: [
            { type: "lecon", id: "passage-messages", titre: "Le passage de messages", fichier: null },
            { type: "lecon", id: "normalisation-gcn", titre: "Construire Â et une couche GCN", fichier: null },
            { type: "atelier", id: "lab-cora", titre: "Le lab Cora : MLP contre GCN", fichier: null },
            { type: "cartes", id: "gnn", titre: "GNN", fichier: null },
            { type: "test", id: "test-gnn", titre: "Test : GNN", fichier: null }
          ]
        },
        {
          id: "svm",
          titre: "Machines à vecteurs de support (SVM)",
          source: "Cours 7 (SVM) · article « Face Recognition by SVMs »",
          priorite: 3,
          resume: "Hyperplan wᵀx + θ = 0 ; marge 2/‖w‖ ; vecteurs de support ; astuce du noyau ; noyaux linéaire, polynomial, RBF ; pipeline scikit-learn ; reconnaissance de visages par arbre binaire.",
          contenus: [
            { type: "lecon", id: "marge-maximale", titre: "La marge maximale", fichier: null },
            { type: "lecon", id: "noyaux", titre: "Noyaux et données non séparables", fichier: null },
            { type: "atelier", id: "tournoi-visages", titre: "Le tournoi de l'article (visages)", fichier: null },
            { type: "cartes", id: "svm", titre: "SVM", fichier: null },
            { type: "test", id: "test-svm", titre: "Test : SVM", fichier: null }
          ]
        },
        {
          id: "revision",
          titre: "Révision examen",
          source: "Tout le cours",
          priorite: 3,
          resume: "À faire après les chapitres. Deux examens blancs avec score par notion ; revoir les leçons des notions ratées.",
          contenus: [
            { type: "test", id: "examen-blanc-1", titre: "Examen blanc 1", fichier: null },
            { type: "test", id: "examen-blanc-2", titre: "Examen blanc 2", fichier: null }
          ]
        }
      ]
    },
    { id: "distributed-computing", titre: "Distributed Computing and Learning", dossier: "Distributed Computing and Learning" },
    { id: "gestion-de-projet", titre: "Gestion de projet", dossier: "Gestion de projet" },
    {
      id: "model-checking",
      titre: "Model Checking for AI",
      dossier: "Model_checking_for_AI",
      description: "Vérifier automatiquement qu'un système (structure de Kripke) satisfait une propriété de logique temporelle (CTL, LTL, PCTL). Examen écrit le 17 novembre, puis présentations d'articles.",
      chapitres: [
        {
          id: "kripke",
          titre: "Introduction et structures de Kripke",
          source: "Slides 3 à 9",
          priorite: 2,
          resume: "Pourquoi le model checking ; M = (S, S₀, R, L), relation totale, chemins infinis ; explosion des états ; Biocham.",
          contenus: [
            { type: "lecon", id: "kripke-chemins", titre: "Une structure de Kripke et ses chemins", fichier: "matieres/model-checking/lecons/kripke-chemins.html", etapes: 6 },
            { type: "atelier", id: "biocham-graphe", titre: "Du modèle Biocham au graphe", fichier: null },
            { type: "cartes", id: "kripke", titre: "Introduction et Kripke", fichier: "matieres/model-checking/cartes/kripke.js" }
          ]
        },
        {
          id: "logiques",
          titre: "CTL*, CTL et LTL",
          source: "Slides 10 à 15",
          priorite: 3,
          resume: "Opérateurs X, F, G, U sur un chemin ; quantificateurs A et E ; formules d'état et de chemin ; CTL, LTL et ce qui les sépare ; PLTL.",
          contenus: [
            { type: "lecon", id: "operateurs-chemin", titre: "X, F, G, U le long d'un chemin", fichier: "matieres/model-checking/lecons/operateurs-chemin.html", etapes: 7 },
            { type: "lecon", id: "quantificateurs", titre: "A et E : les formules d'état", fichier: "matieres/model-checking/lecons/quantificateurs.html", etapes: 6 },
            { type: "lecon", id: "ctl-ltl", titre: "CTL, LTL ou CTL* ?", fichier: "matieres/model-checking/lecons/ctl-ltl.html", etapes: 5 },
            { type: "lecon", id: "pltl", titre: "PLTL : regarder en arrière", fichier: null },
            { type: "cartes", id: "logiques", titre: "Logiques temporelles", fichier: "matieres/model-checking/cartes/logiques.js" }
          ]
        },
        {
          id: "proprietes",
          titre: "Écrire des propriétés",
          source: "Slides 16 à 18",
          priorite: 3,
          resume: "Atteignabilité, chemins, stabilité, oscillations ; la cascade MAPK ; attention aux parenthèses.",
          contenus: [
            { type: "lecon", id: "questions-formules", titre: "Des questions biologiques aux formules", fichier: "matieres/model-checking/lecons/questions-formules.html", etapes: 7 },
            { type: "cartes", id: "proprietes", titre: "Propriétés", fichier: "matieres/model-checking/cartes/proprietes.js" }
          ]
        },
        {
          id: "labelling",
          titre: "L'algorithme de labelling CTL",
          source: "Slides 19 à 22 · exercices du 13 octobre",
          priorite: 3,
          resume: "Problème du model checking ; réécrire avec ¬, ∨, EX, EU, EG ; étiqueter des plus petites sous-formules à la formule entière ; EG par les composantes fortement connexes ; complexité.",
          contenus: [
            { type: "lecon", id: "reecrire-base", titre: "Réécrire avec ¬, ∨, EX, EU, EG", fichier: "matieres/model-checking/lecons/reecrire-base.html", etapes: 6 },
            { type: "lecon", id: "labelling-ex-eu", titre: "Étiqueter : p, ¬, ∨, EX, EU", fichier: "matieres/model-checking/lecons/labelling-ex-eu.html", etapes: 7 },
            { type: "lecon", id: "labelling-eg", titre: "EG : restreindre, SCC, remonter", fichier: "matieres/model-checking/lecons/labelling-eg.html", etapes: 6 },
            { type: "atelier", id: "labelling-libre", titre: "Labelling pas à pas sur ta formule", fichier: "matieres/model-checking/ateliers/labelling-libre.html", etapes: 3 },
            { type: "cartes", id: "labelling", titre: "Labelling CTL", fichier: "matieres/model-checking/cartes/labelling.js" }
          ]
        },
        {
          id: "exemples",
          titre: "Exemples : le four et l'exclusion mutuelle",
          source: "Slides 23 à 25",
          priorite: 3,
          resume: "Le four : AG(Start → AF Heat) est fausse, avec un contre-exemple. L'exclusion mutuelle : construire les 14 états d'un programme SPL, puis vérifier ¬EF(CR₀ ∧ CR₁).",
          contenus: [
            { type: "atelier", id: "four", titre: "Le four : AG(Start → AF Heat)", fichier: "matieres/model-checking/ateliers/four.html", etapes: 5 },
            { type: "atelier", id: "exclusion-mutuelle", titre: "Exclusion mutuelle : construire puis vérifier", fichier: "matieres/model-checking/ateliers/exclusion-mutuelle.html", etapes: 5 }
          ]
        },
        {
          id: "equite",
          titre: "Contraintes d'équité",
          source: "Cours oral du 3 novembre (absent des slides)",
          priorite: 3,
          resume: "Chemins équitables, structure de Kripke équitable, SCC équitables, proposition fair ; le four devient correct avec F = {{6, 7}}.",
          contenus: [
            { type: "lecon", id: "equite", titre: "Chemins équitables et labelling équitable", fichier: "matieres/model-checking/lecons/equite.html", etapes: 7 },
            { type: "atelier", id: "sans-avec-equite", titre: "Sans puis avec équité (sujet d'examen)", fichier: "matieres/model-checking/ateliers/sans-avec-equite.html", etapes: 4 },
            { type: "cartes", id: "equite", titre: "Équité", fichier: "matieres/model-checking/cartes/equite.js" }
          ]
        },
        {
          id: "revision",
          titre: "Examen du 17 novembre — révision",
          source: "Toutes les slides · exercices faits en cours",
          priorite: 3,
          resume: "À faire après les chapitres ci-dessus. Examen blanc 1 : Kripke, X F G U, A et E, réécriture, labelling, le four. Examen blanc 2 : propriétés, CTL/LTL, exclusion mutuelle, équité. Revoir les leçons des notions ratées (lien dans le score par notion).",
          contenus: [
            { type: "test", id: "examen-blanc-1", titre: "Examen blanc 1 : Kripke, CTL, labelling", fichier: "matieres/model-checking/tests/examen-blanc-1.js" },
            { type: "test", id: "examen-blanc-2", titre: "Examen blanc 2 : propriétés, CTL/LTL, exclusion mutuelle, équité", fichier: "matieres/model-checking/tests/examen-blanc-2.js" }
          ]
        },
        {
          id: "probabiliste",
          titre: "Model checking probabiliste",
          source: "Slides 26 à 33",
          priorite: 2,
          resume: "PCTL, chaînes de Markov à temps discret, mesure d'un préfixe, leads-to, algorithme de l'until borné, protocole de Parrow, PRISM.",
          contenus: [
            { type: "lecon", id: "dtmc-pctl", titre: "DTMC et PCTL", fichier: null },
            { type: "atelier", id: "parrow", titre: "Remplir P(i, s) : le protocole de Parrow", fichier: null },
            { type: "cartes", id: "probabiliste", titre: "Probabiliste", fichier: null }
          ]
        }
      ]
    },
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
          source: "Cours 3 (RNNs, LSTMs and GRUs) · TP 4 (RNN, LSTM, GRU sur 20 Newsgroups)",
          priorite: 3,
          resume: "Neurone et couche récurrents, gradient qui s'évanouit ou explose, portes du LSTM et du GRU, bidirectionnel et empilé, formes Keras, préparation des séquences, encodeur-décodeur et attention.",
          contenus: [
            { type: "lecon", id: "neurone-recurrent", titre: "Le neurone récurrent, déroulé", fichier: "matieres/nlp-deep-learning/lecons/neurone-recurrent.html", etapes: 8 },
            { type: "lecon", id: "cellule-lstm", titre: "Une cellule LSTM, porte par porte", fichier: "matieres/nlp-deep-learning/lecons/cellule-lstm.html", etapes: 8 },
            { type: "lecon", id: "gru", titre: "GRU : deux portes, un état", fichier: "matieres/nlp-deep-learning/lecons/gru.html", etapes: 6 },
            { type: "atelier", id: "formes-keras", titre: "Suivre les formes en Keras", fichier: "matieres/nlp-deep-learning/ateliers/formes-keras.html", etapes: 5 },
            { type: "atelier", id: "preparer-sequence", titre: "Préparer une séquence", fichier: "matieres/nlp-deep-learning/ateliers/preparer-sequence.html", etapes: 4 },
            { type: "atelier", id: "code-tp4", titre: "Code du TP 4 : RNN, LSTM, GRU sur 20 Newsgroups", fichier: "matieres/nlp-deep-learning/ateliers/code-tp4.html", etapes: 7 },
            { type: "lecon", id: "encodeur-attention", titre: "De l'encodeur-décodeur à l'attention", fichier: "matieres/nlp-deep-learning/lecons/encodeur-attention.html", etapes: 6 },
            { type: "cartes", id: "recurrents", titre: "RNN, LSTM, GRU", fichier: "matieres/nlp-deep-learning/cartes/recurrents.js" },
            { type: "cartes", id: "attention", titre: "Encodeur-décodeur et attention", fichier: "matieres/nlp-deep-learning/cartes/attention.js" },
            { type: "test", id: "test-recurrents", titre: "Test : réseaux récurrents", fichier: "matieres/nlp-deep-learning/tests/test-recurrents.js" }
          ]
        },
        {
          id: "quiz-9-novembre",
          titre: "Quiz du 9 novembre — révision express",
          source: "Annonce du quiz : Introduction, Text Encoding, RNNs/LSTMs/GRUs · 20 questions, 30 min, sur papier, sans document",
          priorite: 3,
          resume: "Sans calculatrice, 1 min 30 par question. Ordre conseillé : les cartes « l'essentiel », le quiz blanc 1, revoir les leçons des notions ratées, le quiz blanc 2, puis les tests des chapitres 1, 2 et 3.",
          contenus: [
            { type: "cartes", id: "quiz-essentiel", titre: "L'essentiel des 3 cours (34 cartes)", fichier: "matieres/nlp-deep-learning/cartes/quiz-essentiel.js" },
            { type: "test", id: "quiz-blanc-1", titre: "Quiz blanc 1 (20 questions, 30 min)", fichier: "matieres/nlp-deep-learning/tests/quiz-blanc-1.js" },
            { type: "test", id: "quiz-blanc-2", titre: "Quiz blanc 2 (20 questions, 30 min)", fichier: "matieres/nlp-deep-learning/tests/quiz-blanc-2.js" }
          ]
        },
        {
          id: "transformers",
          titre: "Transformers et self-attention",
          source: "Cours 4 (Transformers) · TD Hugging Face Transformers · Lab Transformers (features gelées vs LoRA)",
          priorite: 2,
          resume: "Requêtes, clés, valeurs ; softmax(QKᵀ/√dₖ)V ; multi-head ; encodage positionnel ; bloc encodeur (résiduel, LayerNorm, feed-forward) ; décodeur masqué et cross-attention ; coût quadratique ; Hugging Face : tokenizer, Trainer, features gelées, LoRA.",
          contenus: [
            { type: "lecon", id: "auto-attention", titre: "L'auto-attention : requêtes, clés, valeurs", fichier: "matieres/nlp-deep-learning/lecons/auto-attention.html", etapes: 7 },
            { type: "lecon", id: "multi-tetes-position", titre: "Plusieurs têtes et la position des mots", fichier: "matieres/nlp-deep-learning/lecons/multi-tetes-position.html", etapes: 5 },
            { type: "lecon", id: "bloc-encodeur", titre: "Le bloc encodeur", fichier: "matieres/nlp-deep-learning/lecons/bloc-encodeur.html", etapes: 5 },
            { type: "lecon", id: "decodeur-transformer", titre: "Le décodeur", fichier: "matieres/nlp-deep-learning/lecons/decodeur-transformer.html", etapes: 6 },
            { type: "lecon", id: "transformers-limites", titre: "Forces et limites", fichier: "matieres/nlp-deep-learning/lecons/transformers-limites.html", etapes: 4 },
            { type: "atelier", id: "attention-main", titre: "L'attention à la main", fichier: "matieres/nlp-deep-learning/ateliers/attention-main.html", etapes: 6 },
            { type: "atelier", id: "code-td-hugging-face", titre: "Code du TD Hugging Face (DistilBERT)", fichier: "matieres/nlp-deep-learning/ateliers/code-td-hugging-face.html", etapes: 6 },
            { type: "atelier", id: "code-lab-lora", titre: "Code du Lab : features gelées vs LoRA", fichier: "matieres/nlp-deep-learning/ateliers/code-lab-lora.html", etapes: 6 },
            { type: "cartes", id: "transformers", titre: "Transformers et auto-attention", fichier: "matieres/nlp-deep-learning/cartes/transformers.js" },
            { type: "cartes", id: "transformers-pratique", titre: "Transformers en pratique (Hugging Face)", fichier: "matieres/nlp-deep-learning/cartes/transformers-pratique.js" },
            { type: "test", id: "test-transformers", titre: "Test : Transformers (20 questions)", fichier: "matieres/nlp-deep-learning/tests/test-transformers.js" }
          ]
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
    {
      id: "agentic-software",
      titre: "Agentic Software Development",
      dossier: "agentic_software_development",
      description: "Mineure (8 sessions, un projet fil rouge : Orbitra Ops Copilot) : prompt engineering, modèles locaux et API, RAG, agents et outils. Évaluation : deux QCM (12 novembre et session 7, ensemble 1/3 de la note), dépôt du projet, présentation finale le 3 décembre.",
      chapitres: [
        {
          id: "qcm-12-novembre",
          titre: "QCM du 12 novembre — révision express",
          source: "Annonce : QCM individuel de 15 min en cours, sessions 1 à 4 · 1er de 2 QCM (sessions 5 et 7)",
          priorite: 3,
          resume: "Ordre conseillé : cartes de la session 4 puis de la session 3, QCM blanc 1, revoir les cartes des sessions ratées (lien dans le score par notion), QCM blanc 2, puis cartes des sessions 1 et 2.",
          contenus: [
            { type: "test", id: "qcm-blanc-1", titre: "QCM blanc 1 (16 questions, 15 min)", fichier: "matieres/agentic-software/tests/qcm-blanc-1.js" },
            { type: "test", id: "qcm-blanc-2", titre: "QCM blanc 2 (16 questions, 15 min)", fichier: "matieres/agentic-software/tests/qcm-blanc-2.js" }
          ]
        },
        {
          id: "session-4",
          titre: "Session 4 — agents et agentic coding",
          source: "Session 4 (5 novembre) · lab Agent V1",
          priorite: 3,
          resume: "Anatomie d'un agent, boucle ReAct en code, outils et function calling, sécurité des outils, MCP, OpenAI Agents SDK (guardrails, approbation, sessions, traces), workflow ou agent, multi-agents, évaluation.",
          contenus: [
            { type: "lecon", id: "boucle-agent", titre: "La boucle d'agent à la main", fichier: null },
            { type: "lecon", id: "concevoir-outil", titre: "Concevoir un outil qu'on peut confier à un modèle", fichier: null },
            { type: "lecon", id: "workflow-ou-agent", titre: "Workflow ou agent ?", fichier: null },
            { type: "atelier", id: "boucle-vers-sdk", titre: "De la boucle au Runner (Agents SDK)", fichier: null },
            { type: "atelier", id: "evaluer-agent", titre: "Évaluer l'agent sur 7 questions", fichier: null },
            { type: "cartes", id: "s4-agents", titre: "Session 4 — agents", fichier: "matieres/agentic-software/cartes/s4-agents.js" }
          ]
        },
        {
          id: "session-3",
          titre: "Session 3 — RAG : un assistant documentaire",
          source: "Session 3 (22 octobre) · Langflow, workbook",
          priorite: 3,
          resume: "Requête, format, exactitude ; grounding ; embeddings, chunks, top k, budget de contexte ; les quatre jugements ; localiser la panne ; reranking ; reproductibilité.",
          contenus: [
            { type: "lecon", id: "pipeline-rag", titre: "Le pipeline RAG pas à pas", fichier: null },
            { type: "atelier", id: "ou-preuve-disparue", titre: "Où la preuve a-t-elle disparu ?", fichier: null },
            { type: "cartes", id: "s3-rag", titre: "Session 3 — RAG", fichier: "matieres/agentic-software/cartes/s3-rag.js" }
          ]
        },
        {
          id: "session-1",
          titre: "Session 1 — bases de l'IA et prompt engineering",
          source: "Session 1 (8 octobre) · lab Legacy rescue",
          priorite: 2,
          resume: "Histoire et paradigmes de l'IA, fabrication d'un LLM, tokens, attention, fenêtre de contexte ; critères de réussite, anatomie d'un prompt, techniques (zero-shot, few-shot, CoT, ReAct, chaining), hallucinations, context engineering.",
          contenus: [
            { type: "lecon", id: "prompt-verifiable", titre: "Du prompt vague au prompt vérifiable", fichier: null },
            { type: "lecon", id: "comment-llm-repond", titre: "Comment un LLM répond", fichier: null },
            { type: "atelier", id: "legacy-rescue", titre: "Legacy rescue : le bug silencieux", fichier: null },
            { type: "cartes", id: "s1-bases-prompts", titre: "Session 1 — bases et prompts", fichier: "matieres/agentic-software/cartes/s1-bases-prompts.js" }
          ]
        },
        {
          id: "session-2",
          titre: "Session 2 — modèles locaux et API",
          source: "Session 2 (15 octobre) · benchmark local / hébergé",
          priorite: 2,
          resume: "Modèle, runtime, interface ; génération autorégressive, tokens, masque causal ; mémoire des poids, quantification, distillation ; latence et débit ; benchmark contrôlé et validation stricte.",
          contenus: [
            { type: "lecon", id: "comparer-modeles", titre: "Comparer deux modèles honnêtement", fichier: null },
            { type: "cartes", id: "s2-modeles", titre: "Session 2 — modèles", fichier: "matieres/agentic-software/cartes/s2-modeles.js" }
          ]
        }
      ]
    },
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
          id: "final",
          titre: "Final — Billet endommagé (BACKTRACK)",
          source: "Sujet du final, document d'indications, ta solution · oral du 10/11",
          priorite: 3,
          resume: "Inconnues 0/1, compteurs lm, lv, cm, cv ; trois règles et PROPAGER au point fixe ; RECURSIVE avec pile d'annulation, arrêt à 2 solutions. Trois leçons, une trace pas à pas, des cartes d'oral.",
          contenus: [
            { type: "lecon", id: "billet-modeliser", titre: "Modéliser et déduire (exemple 1)", fichier: "matieres/programming-challenge/lecons/billet-modeliser.html", etapes: 8 },
            { type: "lecon", id: "billet-recherche", titre: "Recherche et retour arrière (exemple 2)", fichier: "matieres/programming-challenge/lecons/billet-recherche.html", etapes: 8 },
            { type: "lecon", id: "billet-python", titre: "Du pseudo-code au Python", fichier: "matieres/programming-challenge/lecons/billet-python.html", etapes: 6 },
            { type: "atelier", id: "trace-billet", titre: "Trace pas à pas sur tes grilles", fichier: "matieres/programming-challenge/ateliers/trace-billet.html", etapes: 3 },
            { type: "cartes", id: "oral-billet", titre: "Billet endommagé — questions d'oral", fichier: "matieres/programming-challenge/cartes/oral-billet.js" }
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
