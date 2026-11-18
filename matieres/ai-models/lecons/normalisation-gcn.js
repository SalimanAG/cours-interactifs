/* Leçon : Construire Â et une couche GCN (cours 6 « Graph Neural Networks », diapos 11 à 20).
   Fil rouge : le graphe à 4 nœuds de la leçon précédente (arêtes 1–2, 1–3, 1–4, 2–3, 3–4), h = (1, 2, 4, 3). */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var ADJ = [[0, 1, 1, 1], [1, 0, 1, 0], [1, 1, 0, 1], [1, 0, 1, 0]];
  var AT = ADJ.map(function (l, i) { return l.map(function (v, j) { return v + (i === j ? 1 : 0); }); });
  var DT = AT.map(function (l) { return l.reduce(function (a, b) { return a + b; }, 0); }); // 4, 3, 4, 3
  var AH = AT.map(function (l, i) { return l.map(function (v, j) { return v / Math.sqrt(DT[i] * DT[j]); }); });
  var H0 = [1, 2, 4, 3];
  var H1 = AH.map(function (l) { return l.reduce(function (s, v, j) { return s + v * H0[j]; }, 0); });
  var NOMS = ["1", "2", "3", "4"];
  function mat(zone, nom, M, d) { var mx = new Matrice(A.cadre(zone), { nom: nom, lignes: NOMS, colonnes: NOMS, onSaisie: d && d.onSaisie }); mx.dessiner(M, { format: d && d.format || String, editables: d && d.editables, classes: d && d.classes }); return mx; }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "normalisation-gcn",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Ajouter les boucles : Ã = A + I",
        texte: "<p>Pour un graphe non orienté, A = Aᵀ. Un nœud doit pouvoir garder sa propre information : on ajoute une boucle sur chaque nœud, <span class='mono'>Ã = A + I</span>, " +
          "et le nouveau degré est <span class='mono'>D̃_ii = Σⱼ Ã_ij</span>.</p>",
        objectif: "Compléter la diagonale de Ã, puis donner les degrés d̃.",
        installer: function (zone, api) {
          var fait = false;
          var vals = AT.map(function (l, i) { return l.map(function (v, j) { return i === j ? "" : v; }); });
          var ed = {}; [0, 1, 2, 3].forEach(function (i) { ed[i + "," + i] = true; });
          var mx = mat(zone, "Ã", vals, { editables: ed, onSaisie: function () {
            if (!fait && [0, 1, 2, 3].every(function (i) { return Exercices.lireNombre(mx.lire(i, i)) === 1; })) { fait = true; suite(); }
          } });
          function suite() {
            var b = el("div"); zone.appendChild(b);
            Exercices.texte(b, { label: "(d̃₁, d̃₂, d̃₃, d̃₄) =", attendu: ["(4, 3, 4, 3)", "(4,3,4,3)", "4, 3, 4, 3", "4,3,4,3"], mode: "souple", verdict: false, placeholder: "(a, b, c, d)", indice: "Les degrés d'avant (3, 2, 3, 2), plus 1.", surReussite: function () {
              api.valider("Question du cours : un nœud à 100 voisins et un nœud à 2 voisins ; la somme ÃX donne des agrégats d'échelles très différentes. D'où la normalisation.");
            } });
          }
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Normaliser par les degrés",
        texte: "<div class='formule'>Â = D̃^(−1/2) Ã D̃^(−1/2),   Â_ij = Ã_ij / √(d̃ᵢ d̃ⱼ)</div>" +
          "<p>La contribution de chaque arête est divisée selon les degrés de <b>ses deux extrémités</b> : on contrôle l'échelle, et l'opérateur reste symétrique.</p>",
        objectif: "Calculer quatre cases de Â.",
        installer: function (zone, api) {
          mat(zone, "Ã", AT);
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Â₁₁ =", attendu: AH[0][0], tolerance: 0.002, placeholder: "ex. 1/3", indice: "1 / √(4·4).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Â₁₂ ≈", attendu: AH[0][1], tolerance: 0.002, placeholder: "ex. 0,3", indice: "1 / √(4·3).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Â₂₂ =", attendu: AH[1][1], tolerance: 0.002, placeholder: "ex. 1/3", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Â₂₄ =", attendu: 0, tolerance: 1e-9, placeholder: "ex. 1/3", indice: "Pas d'arête entre 2 et 4.", surReussite: ok }); },
            function (b, ok) { mat(b, "Â", AH, { format: function (v) { return A.fmt(v, 2); } }); ok(); }
          ], "Â est symétrique, et ses cases nulles restent nulles : le mélange suit les arêtes.");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Une couche GCN",
        texte: "<div class='formule lignes'>H^(ℓ+1) = σ(Â H^(ℓ) W^(ℓ))\nH⁽¹⁾ = ReLU(Â X W⁽⁰⁾)\nZ = softmax(Â H⁽¹⁾ W⁽¹⁾)</div>" +
          "<p>ÂH : mélange des représentations voisines selon le graphe ; W : transformation apprise des caractéristiques ; σ : non-linéarité. " +
          "Ici une seule caractéristique h = (1, 2, 4, 3) et W = 1.</p>",
        objectif: "Calculer (ÂH)₁ et (ÂH)₂, puis l'effet de ReLU avec W = −1.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "(ÂH)₁ ≈", attendu: H1[0], tolerance: 0.005, placeholder: "ex. 2,5", indice: "¼·1 + 0,289·2 + ¼·4 + 0,289·3.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "(ÂH)₂ ≈", attendu: H1[1], tolerance: 0.005, placeholder: "ex. 2,5", indice: "0,289·1 + ⅓·2 + 0,289·4.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Avec W = −1 : ReLU((ÂH)₁ · W) =", attendu: 0, placeholder: "ex. 2,5", surReussite: ok }); }
          ], "Toutes les valeurs ÂH sont positives ; avec W = −1 la ReLU les met toutes à 0. W est appris : c'est lui qui donne un sens aux caractéristiques mélangées.");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "GCN, GAT, GraphSAGE, GIN",
        texte: "<p>Le passage de messages est un modèle général ; ces architectures l'instancient différemment.</p>",
        objectif: "Rattacher chaque idée à son architecture.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["GCN", "GAT", "GraphSAGE", "GIN"],
            items: [
              { texte: "Poids des voisins fixés par les degrés", bonne: 0 },
              { texte: "Poids des voisins appris par attention : h′ᵢ = σ(Σ αᵢⱼ W hⱼ)", bonne: 1 },
              { texte: "Échantillonne un voisinage borné ; peut traiter des nœuds jamais vus (inductif)", bonne: 2 },
              { texte: "h_v = MLP((1 + ε) h_v + Σ_u h_u), lié au test de Weisfeiler–Leman", bonne: 3 }
            ],
            surReussite: function () { api.valider("Plus expressif ne veut pas dire meilleur sur toutes les tâches ; les poids d'attention ne sont pas automatiquement des explications fidèles."); }
          });
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Somme ou moyenne ?",
        texte: "<p>Le cours : la somme peut préserver une information de <b>multiplicité</b> que la moyenne perd. Deux nœuds : le premier a deux voisins de caractéristique 1, le second un seul voisin de caractéristique 1.</p>",
        objectif: "Comparer les agrégations, puis choisir un readout.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.texte(b, { label: "Moyennes (nœud 1, nœud 2) :", attendu: ["(1, 1)", "(1,1)", "1, 1", "1,1"], mode: "souple", verdict: false, placeholder: "(a, b)", surReussite: ok }); },
            function (b, ok) { Exercices.texte(b, { label: "Sommes (nœud 1, nœud 2) :", attendu: ["(2, 1)", "(2,1)", "2, 1", "2,1"], mode: "souple", verdict: false, placeholder: "(a, b)", surReussite: ok }); },
            function (b, ok) {
              A.html(b, "<p>Niveau graphe : <span class='mono'>h_G = READOUT({h_v})</span> transforme un ensemble de taille variable en un vecteur de taille fixe.</p>");
              Exercices.associer(b, { categories: ["somme", "moyenne", "max"], items: [
                { texte: "préserve la taille du graphe / la multiplicité", bonne: 0 },
                { texte: "normalise par le nombre de nœuds", bonne: 1 },
                { texte: "détecte la présence d'une caractéristique", bonne: 2 }
              ], surReussite: ok });
            }
          ], "La moyenne ne distingue pas ces deux voisinages ; la somme, si. Choisir le readout selon la tâche.");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "Vérifier l'exemple du cours",
        texte: "<p>Le cours normalise le chemin 1 − 2 − 3 avec boucles : <span class='mono'>D̃ = diag(2, 3, 2)</span>.</p>",
        objectif: "Retrouver trois valeurs de Â du cours.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Â₁₁ =", attendu: 0.5, tolerance: 0.002, placeholder: "ex. 1/3", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Â₁₂ ≈", attendu: 1 / Math.sqrt(6), tolerance: 0.002, placeholder: "ex. 0,4", indice: "1/√(2·3).", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Â₂₂ =", attendu: 1 / 3, tolerance: 0.002, placeholder: "ex. 1/3", surReussite: ok }); }
          ], "On retrouve la matrice du cours : (1/2, 1/√6, 0 ; 1/√6, 1/3, 1/√6 ; 0, 1/√6, 1/2). Le nœud 2 a trois entrées dans son voisinage avec boucle : ses contributions sont réduites.");
        }
      }
    ],
    fin: { texte: "<p>À retenir : <span class='mono'>Ã = A + I</span>, <span class='mono'>Â = D̃^(−1/2) Ã D̃^(−1/2)</span>, <span class='mono'>H^(ℓ+1) = σ(Â H^(ℓ) W^(ℓ))</span> ; GCN = poids fixés par les degrés, GAT = poids appris, GraphSAGE = échantillonnage, GIN = somme + MLP.</p>", cartes: "gnn" }
  });
})();
