/* Leçon : La convolution pas à pas (cours « Convolutional Neural Networks », diapos 4 à 25).
   Fil rouge : une image 6×6 en niveaux de gris avec un bord vertical (inventée), et le filtre de bord du cours
   K = (−1 0 1 ; −1 0 1 ; −1 0 1). */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var X = [[1, 1, 2, 8, 9, 9], [0, 1, 1, 9, 9, 8], [1, 0, 1, 8, 9, 9], [0, 1, 2, 9, 8, 9], [1, 1, 1, 9, 9, 9], [0, 0, 1, 8, 9, 8]];
  var K = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
  var Y = Convolution.calculer(X, K);                          // 4×4
  var YP = Convolution.calculer(X, K, { p: 1 });               // 6×6
  function lire(t) { return Exercices.lireNombre(String(t).replace("−", "-")); }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "convolution-pas-a-pas",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Une image est un tenseur",
        texte:
          "<p>Une image RGB est un élément <span class='mono'>X ∈ ℝ^(H×W×C)</span>, C = 3 : H, W dimensions spatiales, C canaux ; un pixel est un vecteur de ℝ^C. " +
          "En lot : souvent <span class='mono'>N×C×H×W</span> (NCHW) ou <span class='mono'>N×H×W×C</span> (NHWC).</p>" +
          "<p>Un CNN ne « voit » pas l'image : il opère sur des tenseurs qui ont une structure géométrique.</p>",
        objectif: "Compter les entrées d'une couche dense sur une image 224×224×3, puis dire ce que la convolution impose.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Valeurs d'une image 224 × 224 × 3 :", attendu: 150528, placeholder: "ex. 3072", surReussite: ok }); },
            function (b, ok) {
              A.cocher(b, {
                question: "Une couche dense sur l'image aplatie : qu'est-ce qui manque ? (plusieurs réponses)",
                options: ["la localité (chaque unité dépend d'une petite région)", "le partage des poids dans l'espace", "la structure 2D, perdue à l'aplatissement", "la non-linéarité"],
                bonnes: [0, 1, 2],
                explication: "Un neurone dense a 150 528 poids. La convolution impose un biais inductif : les corrélations locales comptent, et un motif utile à un endroit l'est ailleurs.",
                surReussite: ok
              });
            }
          ], "Localité + partage des poids : le nombre de paramètres ne dépend plus de H et W.");
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Une fenêtre, un produit scalaire",
        texte:
          "<div class='encadre'><span class='titre-encadre'>Convolution 2D (cours)</span>" +
          "<div class='formule'>Y_i,j = b + Σᵤ Σᵥ K_u,v · X_i+u, j+v</div>" +
          "K ∈ ℝ^(k_h×k_w) : paramètres appris ; b : biais. Chaque position (i, j) donne un scalaire ; l'ensemble des sorties est une <b>carte de caractéristiques</b> (feature map).</div>" +
          "<p>Ici b = 0. La fenêtre en couleur est la première position. Écris Y[0,0] dans la case de sortie.</p>",
        objectif: "Calculer Y[0,0].",
        installer: function (zone, api) {
          new Convolution(A.cadre(zone), {
            X: X, K: K, revele: "aucun", controles: false, editables: { "0,0": true },
            surSaisie: function (i, j, t) {
              if (lire(t) === Y[0][0]) { this.ok = true; api.retour("(−1)(1 + 0 + 1) + 1·(2 + 1 + 1) = −2 + 4 = 2.", true); api.valider("Le produit scalaire du noyau avec la fenêtre : colonne de droite moins colonne de gauche."); }
              else if (t) api.retour("Somme des 9 produits K·X (les poids 0 annulent la colonne du milieu).", false);
            }
          });
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Faire glisser la fenêtre",
        texte:
          "<p>Avec un stride 1 et sans padding, la fenêtre 3×3 prend 4 × 4 positions. Touche une case de sortie ou utilise ◀ ▶ pour déplacer la fenêtre ; " +
          "remplis la première ligne de la carte.</p>",
        objectif: "Remplir Y[0,1], Y[0,2] et Y[0,3].",
        installer: function (zone, api) {
          var bons = {};
          var cv = new Convolution(A.cadre(zone), {
            X: X, K: K, revele: "jusqua", editables: { "0,1": true, "0,2": true, "0,3": true },
            surSaisie: function (i, j, t) {
              var k = i + "," + j;
              if (lire(t) === Y[i][j]) { bons[k] = true; cv.marquer(i, j, "juste"); var c = cv.champs[k]; if (c) c.focus(); }
              else delete bons[k];
              if (Object.keys(bons).length === 3) { api.retour("Première ligne : 2, 23, 23, 1.", true); api.valider("Fais défiler la suite : chaque ligne ressemble à la première, car le bord est vertical sur toute la hauteur."); }
            }
          });
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Pourquoi ce filtre voit un bord",
        texte:
          "<p>Le produit scalaire mesure la <b>corrélation</b> entre la fenêtre et le motif codé par K : ici « plus clair à droite qu'à gauche ».</p>",
        objectif: "Repérer où la réponse est la plus forte, puis corriger une idée reçue.",
        installer: function (zone, api) {
          new Convolution(A.cadre(zone), { X: X, K: K, revele: "tout" });
          A.enchainer(zone, api, [
            function (b, ok) {
              A.choix(b, {
                question: "Les plus grandes valeurs de Y (22 à 24) apparaissent quand la fenêtre…",
                options: ["chevauche le passage sombre → clair (colonnes 2 à 4 de l'image)", "est entièrement dans la zone claire", "est entièrement dans la zone sombre"],
                bonne: 0,
                expliquer: ["Exact : colonne de droite claire, colonne de gauche sombre.", "Non : à droite comme à gauche c'est clair, la différence est proche de 0.", "Non : même raison, la différence est proche de 0."],
                surReussite: ok
              });
            },
            function (b, ok) {
              A.choix(b, {
                question: "Pendant l'entraînement, impose-t-on qu'un filtre soit un détecteur de bord ?",
                options: ["Non : le filtre apprend une direction utile pour minimiser la perte", "Oui : on choisit les noyaux à la main"],
                bonne: 0,
                expliquer: ["Exact : c'est l'« interprétation correcte » du cours.", "Non : les noyaux sont des paramètres appris."],
                surReussite: ok
              });
            }
          ], "Un filtre répond fort là où le motif local ressemble à son noyau.");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Convolution ou corrélation croisée ?",
        texte:
          "<div class='formule lignes'>convolution        : (K ∗ X)ᵢⱼ = Σᵤᵥ K_u,v X_i−u, j−v\ncorrélation croisée : (K ⋆ X)ᵢⱼ = Σᵤᵥ K_u,v X_i+u, j+v</div>" +
          "<p>Mathématiquement, la convolution retourne le noyau. Les frameworks calculent en général la corrélation croisée (c'est ce que fait cette leçon).</p>",
        objectif: "Classer les affirmations.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "Ce n'est pas un problème, car les noyaux sont appris : le retournement est absorbé par les paramètres.", vrai: true },
              { texte: "Avec la vraie convolution, notre filtre (−1 0 1) répondrait −23 au lieu de 23 sur le bord.", vrai: true, explication: "Retourner (−1 0 1) donne (1 0 −1) : le signe s'inverse." },
              { texte: "Le nombre de paramètres d'une couche de convolution dépend de la taille H × W de l'image.", vrai: false, explication: "Non : il ne dépend que de C_in, C_out, k_h, k_w." },
              { texte: "Le même noyau est appliqué à toutes les positions.", vrai: true, explication: "C'est le partage des poids." }
            ],
            surReussite: function () { api.valider("« Convolution » est le nom conventionnel ; les frameworks font une corrélation croisée."); }
          });
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Padding : garder la taille",
        texte:
          "<div class='formule'>n_out = ⌊(n_in + 2p − d(k − 1) − 1) / s⌋ + 1</div>" +
          "<p>k : taille du noyau, s : stride, p : padding, d : dilatation (d = 1 : formule standard). Avec le padding p, on ajoute des valeurs (en général des zéros) autour du bord.</p>",
        objectif: "Donner la taille de sortie avec p = 1, puis distinguer « same » et « valid ».",
        installer: function (zone, api) {
          new Convolution(A.cadre(zone), { X: X, K: K, p: 1, revele: "tout" });
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "n_out pour n = 6, k = 3, s = 1, p = 1 :", attendu: 6, placeholder: "ex. 4", indice: "(6 + 2 − 2 − 1)/1 + 1.", surReussite: ok }); },
            function (b, ok) {
              Exercices.associer(b, {
                categories: ["valid", "same"],
                items: [
                  { texte: "p = 0, la carte rétrécit (6 → 4 ici)", bonne: 0 },
                  { texte: "avec s = 1, padding choisi pour garder H′ = H, W′ = W", bonne: 1 },
                  { texte: "k = 3, s = 1, p = 1", bonne: 1 }
                ],
                surReussite: ok
              });
            }
          ], "« Same » est une convention de forme : avec un stride, un noyau pair ou un padding asymétrique, les frameworks ne se comportent pas forcément pareil.");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Stride : sous-échantillonner",
        texte:
          "<p>Avec s &gt; 1, la fenêtre saute de s cases : moins de positions, donc moins de sorties et moins de FLOPs ; le champ récepteur grandit plus vite ; on perd du détail spatial.</p>",
        objectif: "Donner la taille de sortie avec s = 2 (sans padding), puis lire Y[1,1].",
        installer: function (zone, api) {
          var Y2 = Convolution.calculer(X, K, { s: 2 });
          new Convolution(A.cadre(zone), { X: X, K: K, s: 2, revele: "jusqua" });
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "n_out pour n = 6, k = 3, s = 2, p = 0 :", attendu: 2, placeholder: "ex. 4", indice: "⌊(6 − 2 − 1)/2⌋ + 1 = ⌊1,5⌋ + 1.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Y[1,1] =", attendu: Y2[1][1], placeholder: "ex. 4", indice: "La fenêtre commence ligne 2, colonne 2 de l'image (positions espacées de 2).", surReussite: ok }); },
            function (b, ok) {
              A.choix(b, {
                question: "« Un stride plus grand capture des caractéristiques plus globales » : qu'en dit le cours ?",
                options: ["Pas tout à fait : le stride change surtout l'échantillonnage, donc la géométrie de la représentation", "C'est exactement la définition du stride"],
                bonne: 0, surReussite: ok
              });
            }
          ], "Avec s = 2, une colonne sur deux est sautée : avec n = 6, la dernière colonne de l'image n'est jamais lue (fenêtres sur les colonnes 0–2 et 2–4).");
        }
      },

      /* 8 ─────────────────────────────────────────────── */
      {
        titre: "ReLU puis max pooling",
        texte:
          "<p>Sans non-linéarité, empiler des couches linéaires ne sert à rien : W₃(W₂(W₁x)) = (W₃W₂W₁)x. " +
          "On applique donc <span class='mono'>ReLU(z) = max(0, z)</span>, puis un <b>max pooling</b> 2×2 de stride 2 " +
          "(<span class='mono'>Y = max sur la fenêtre</span>, par canal, sans paramètre appris).</p>" +
          "<p>On part de la carte 6×6 obtenue avec p = 1 (elle contient des valeurs négatives : −18, −27…), après ReLU :</p>",
        objectif: "Remplir deux cases de la carte réduite, puis donner le nombre de paramètres du pooling.",
        installer: function (zone, api) {
          var R = Convolution.relu(YP);
          var PL = Convolution.calculer(R, null, { mode: "max", k: 2, s: 2 });
          var bons = {};
          var cv = new Convolution(A.cadre(zone), {
            X: R, K: null, mode: "max", k: 2, s: 2, nomX: "ReLU(Y), 6×6", nomY: "max pooling 2×2, s = 2",
            revele: "jusqua", editables: { "1,1": true, "0,2": true },
            surSaisie: function (i, j, t) {
              var k = i + "," + j;
              if (lire(t) === PL[i][j]) { bons[k] = true; cv.marquer(i, j, "juste"); var c = cv.champs[k]; if (c) c.focus(); } else delete bons[k];
              if (Object.keys(bons).length === 2 && !suite) { suite = true; fin(); }
            }
          });
          var suite = false;
          function fin() {
            var b = el("div"); zone.appendChild(b);
            Exercices.nombre(b, { label: "Paramètres appris d'un max pooling :", attendu: 0, placeholder: "ex. 4", surReussite: function () {
              api.valider("La ReLU a mis à 0 la colonne négative ; le pooling divise H et W par 2 et tolère de petites translations. Pooling et stride sont deux mécanismes de sous-échantillonnage, pas des synonymes.");
            } });
          }
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : <span class='mono'>Y_ij = b + Σ K_uv X_i+u,j+v</span> (corrélation croisée) ; un noyau partagé glisse sur l'image ; " +
        "<span class='mono'>n_out = ⌊(n + 2p − d(k−1) − 1)/s⌋ + 1</span> ; ReLU casse la linéarité ; le pooling sous-échantillonne sans paramètre.</p>",
      cartes: "cnn"
    }
  });
})();
