/* Leçon : Formes, paramètres, coût (cours « Convolutional Neural Networks », diapos 13 à 43).
   Fil rouge : un petit CNN inventé pour la leçon, entrée 28 × 28 × 1 :
   Conv 5×5, 16 filtres (s = 1, p = 0) → MaxPool 2×2 → Conv 3×3, 32 filtres (s = 1, p = 1) → MaxPool 2×2 → Flatten → Dense 10. */
(function () {
  "use strict";
  var A = AIM;
  var COUCHES = [
    ["Entrée", "28 × 28 × 1", "0"],
    ["Conv 5×5, 16", "24 × 24 × 16", "416"],
    ["MaxPool 2×2", "12 × 12 × 16", "0"],
    ["Conv 3×3, 32, p = 1", "12 × 12 × 32", "4 640"],
    ["MaxPool 2×2", "6 × 6 × 32", "0"],
    ["Flatten", "1 152", "0"],
    ["Dense 10", "10", "11 530"]
  ];
  function table(zone, connues) {
    return A.html(zone, A.tableau(["couche", "sortie", "paramètres"], COUCHES.map(function (c, i) {
      return [c[0], connues[i] >= 1 ? "<span class='mono'>" + c[1] + "</span>" : "?", connues[i] >= 2 ? "<span class='mono'>" + c[2] + "</span>" : "?"];
    })));
  }
  function n(b, label, attendu, ok, indice, tol) { Exercices.nombre(b, { label: label, attendu: attendu, tolerance: tol || 0, placeholder: "ex. 12", indice: indice, surReussite: ok }); }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "formes-parametres",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "La taille de sortie",
        texte:
          "<div class='formule'>n_out = ⌊(n_in + 2p − d(k − 1) − 1) / s⌋ + 1</div>" +
          "<p>Le fil rouge de la leçon :</p>",
        objectif: "Calculer la taille spatiale après chaque convolution, puis la taille effective d'un noyau dilaté.",
        installer: function (zone, api) {
          table(zone, [1, 0, 0, 0, 0, 0, 0]);
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Après Conv 5×5 (s = 1, p = 0) : n =", 24, ok, "(28 − 4 − 1)/1 + 1."); },
            function (b, ok) { n(b, "Après le 1ᵉʳ MaxPool 2×2 (s = 2) : n =", 12, ok, "Un pooling 2×2 de stride 2 divise par 2."); },
            function (b, ok) { n(b, "Après Conv 3×3, p = 1 : n =", 12, ok, "Padding « same »."); },
            function (b, ok) { n(b, "Taille effective d'un noyau k = 3 avec dilatation d = 2 : k_eff =", 5, ok, "k_eff = d(k − 1) + 1."); }
          ], "24, 12, 12, puis 6 après le second pooling ; un noyau 3×3 dilaté (d = 2) couvre 5×5 sans paramètre supplémentaire.");
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Un filtre voit tous les canaux",
        texte:
          "<p>Avec C_in canaux d'entrée et C_out filtres : <span class='mono'>W ∈ ℝ^(C_out × C_in × k_h × k_w)</span> et " +
          "<span class='mono'>Y_m,i,j = b_m + Σ_c,u,v W_m,c,u,v X_c,i+u,j+v</span>. Le filtre m voit <b>tous</b> les canaux d'entrée.</p>" +
          "<p>« Profondeur » ou « canaux » ne veut pas forcément dire « couleur » : après une couche de 16 filtres, il y a 16 cartes de caractéristiques.</p>",
        objectif: "Compter les poids d'un filtre dans deux situations.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Filtre 3×3 sur une image RGB : poids (sans biais) =", 27, ok, "3 · 3 · 3 : l'erreur fréquente est de répondre 9."); },
            function (b, ok) { n(b, "Filtre 3×3 de la 2ᵉ convolution du fil rouge : poids =", 144, ok, "Son entrée a 16 canaux."); }
          ], "27 et 144 poids par filtre (plus un biais chacun).");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Compter les paramètres",
        texte: "<div class='formule'>N_params = C_out · (C_in · k_h · k_w + 1)</div><p>Un biais par filtre. Le nombre de paramètres ne dépend pas de H, W.</p>",
        objectif: "Calculer les paramètres des deux convolutions.",
        installer: function (zone, api) {
          table(zone, [1, 1, 1, 1, 1, 1, 1]);
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Conv 5×5, 16 filtres, sur 1 canal :", 416, ok, "16 · (1·5·5 + 1)."); },
            function (b, ok) { n(b, "Conv 3×3, 32 filtres, sur 16 canaux :", 4640, ok, "32 · (16·3·3 + 1)."); }
          ], "416 et 4 640. Exemple du cours : C_in = 3, C_out = 64, k = 3 → 64·(27 + 1) = 1 792.");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "La couche dense domine",
        texte:
          "<p>Après le second pooling : 6 × 6 × 32. <b>Flatten</b> donne un vecteur, puis une couche dense vers 10 classes. " +
          "Alternative : <b>Global Average Pooling</b>, <span class='mono'>z_c = (1/HW) Σᵢⱼ X_ijc</span> (H × W × C → C).</p>",
        objectif: "Comparer les paramètres de la tête Flatten + Dense et GAP + Dense.",
        installer: function (zone, api) {
          table(zone, [1, 1, 1, 1, 1, 1, 0]);
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Taille du vecteur après Flatten :", 1152, ok, "6 · 6 · 32."); },
            function (b, ok) { n(b, "Paramètres de Dense(10) après Flatten :", 11530, ok, "1152 · 10 + 10."); },
            function (b, ok) { n(b, "Paramètres de Dense(10) après GAP :", 330, ok, "GAP donne 32 valeurs : 32 · 10 + 10."); },
            function (b, ok) {
              A.choix(b, {
                question: "Le compromis Flatten / GAP selon le cours :",
                options: ["Flatten garde l'information spatiale explicite ; GAP impose un résumé spatial fort et réduit les paramètres", "GAP garde plus d'information spatiale que Flatten", "Les deux ont le même nombre de paramètres"],
                bonne: 0, surReussite: ok
              });
            }
          ], "11 530 paramètres sur 16 586 au total sont dans la seule couche dense : c'est une raison de l'usage du GAP dans les architectures modernes.");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Le coût de calcul et la mémoire",
        texte:
          "<div class='formule'>FLOPs ≈ 2 · H′ · W′ · C_out · C_in · k_h · k_w</div>" +
          "<p>(une multiplication + une addition = 2 FLOPs). Le coût croît avec la résolution, le nombre de canaux et l'aire du noyau.</p>",
        objectif: "Calculer les FLOPs des deux convolutions et dire laquelle domine.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "FLOPs de Conv 5×5 (sortie 24×24×16, entrée 1 canal) :", 460800, ok, "2 · 24 · 24 · 16 · 1 · 25."); },
            function (b, ok) { n(b, "FLOPs de Conv 3×3 (sortie 12×12×32, entrée 16 canaux) :", 1327104, ok, "2 · 12 · 12 · 32 · 16 · 9."); },
            function (b, ok) {
              Exercices.vraiFaux(b, {
                items: [
                  { texte: "La 2ᵉ convolution coûte plus cher alors que sa résolution est 4 fois plus petite.", vrai: true, explication: "Ses canaux (16 → 32) l'emportent." },
                  { texte: "Une couche avec peu de paramètres peut quand même demander beaucoup de mémoire à l'entraînement.", vrai: true, explication: "Il faut garder ses activations (grande carte de sortie) pour la rétropropagation." },
                  { texte: "Paramètres, FLOPs et mémoire sont trois contraintes distinctes.", vrai: true }
                ],
                surReussite: ok
              });
            }
          ], "Mémoire à l'entraînement : paramètres, gradients, états de l'optimiseur, activations intermédiaires, lots d'entrée.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Deux 3×3 ou un 5×5 ?",
        texte: "<p>Pourquoi tant de noyaux 3×3 (VGG) ? Deux convolutions 3×3 empilées ont un champ récepteur effectif 5×5, avec deux non-linéarités intermédiaires.</p>",
        objectif: "Comparer les paramètres, pour un seul canal.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Poids de deux noyaux 3×3 :", 18, ok, "2 · 3²."); },
            function (b, ok) { n(b, "Poids d'un noyau 5×5 :", 25, ok); },
            function (b, ok) { n(b, "Champ récepteur de deux 3×3 (stride 1) :", 5, ok, "3 + (3 − 1)."); }
          ], "18 contre 25 : plus de profondeur non linéaire, même champ récepteur, moins de paramètres.");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Convolution séparable en profondeur",
        texte:
          "<div class='formule lignes'>standard   : H·W·C_in·C_out·k²\nséparable  : H·W·C_in·k² + H·W·C_in·C_out</div>" +
          "<p>(en multiplications). Le premier terme filtre chaque canal séparément (depthwise), le second mélange les canaux par une convolution 1×1. " +
          "C'est la base d'architectures efficaces comme MobileNet.</p>",
        objectif: "Calculer le gain pour la 2ᵉ convolution du fil rouge (H = W = 12, C_in = 16, C_out = 32, k = 3).",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "Multiplications, version standard :", 663552, ok, "144 · 16 · 32 · 9."); },
            function (b, ok) { n(b, "Multiplications, version séparable :", 94464, ok, "144 · 16 · 9 + 144 · 16 · 32."); },
            function (b, ok) { n(b, "Rapport standard / séparable (≈, une décimale) :", 663552 / 94464, ok, "", 0.06); }
          ], "Environ 7 fois moins de multiplications. Autres idées du cours : BatchNorm (Conv → BN → ReLU), connexions résiduelles y = F(x) + x (ResNet).");
        }
      }
    ],
    fin: {
      texte: "<p>À retenir : <span class='mono'>N = C_out(C_in·k_h·k_w + 1)</span>, indépendant de H, W ; <span class='mono'>FLOPs ≈ 2H′W′C_out C_in k_h k_w</span> ; " +
        "la tête dense peut dominer les paramètres (GAP la réduit) ; deux 3×3 = champ 5×5 avec 18 poids au lieu de 25 ; la convolution séparable réduit fortement le coût.</p>",
      cartes: "cnn"
    }
  });
})();
