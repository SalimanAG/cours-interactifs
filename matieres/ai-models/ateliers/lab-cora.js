/* Atelier : le lab Cora, MLP contre GCN (cours 6, fiche « Two-layer GCN for Cora », script gnn_cora_lab.py). */
(function () {
  "use strict";
  var A = AIM;
  function n(b, label, attendu, ok, indice) { Exercices.nombre(b, { label: label, attendu: attendu, placeholder: "ex. 100", indice: indice, surReussite: ok }); }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "lab-cora",
    etapes: [
      {
        titre: "Les données de Cora",
        texte: "<p>Cora : 2 708 articles scientifiques (nœuds), 1 433 indicateurs binaires de mots par article (caractéristiques), 5 429 liens de citation, 7 thèmes de recherche. " +
          "Découpage classique : 140 nœuds étiquetés pour l'entraînement, 500 pour la validation, 1 000 pour le test.</p>",
        objectif: "Donner la forme de X et le rôle de chaque masque.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.texte(b, { label: "X.shape =", attendu: ["(2708, 1433)", "(2708,1433)", "2708, 1433", "2708,1433", "(2 708, 1 433)"], mode: "souple", verdict: false, placeholder: "(a, b)", surReussite: ok }); },
            function (b, ok) {
              Exercices.associer(b, { categories: ["train_mask", "val_mask", "test_mask"], items: [
                { texte: "140 nœuds : optimiser θ", bonne: 0 }, { texte: "500 nœuds : sélection du modèle, arrêt précoce", bonne: 1 }, { texte: "1 000 nœuds : évaluation finale seulement", bonne: 2 }
              ], surReussite: ok });
            },
            function (b, ok) { A.choix(b, { question: "Protocole transductif : pendant l'entraînement, le modèle voit…", options: ["tout le graphe et toutes les caractéristiques, mais seulement les étiquettes du train", "seulement les 140 nœuds du train et leurs arêtes", "toutes les étiquettes"], bonne: 0, surReussite: ok }); }
          ], "La perte n'utilise que les 140 étiquettes du train (cross-entropy masquée), mais le passage de messages traverse tout le graphe.");
          A.note(zone, "Le script affiche data.num_edges. Avec Planetoid (PyTorch Geometric), chaque citation est stockée dans les deux sens : le nombre affiché diffère des 5 429 liens du cours " +
            "(précision issue de la documentation de PyTorch Geometric, pas du cours). Le cours demande justement de décider si l'on garde le sens des citations ou si l'on ajoute les arêtes inverses.");
        }
      },
      {
        titre: "L'architecture et ses paramètres",
        texte: "<p>Fiche du cours : <span class='mono'>GCNConv(1433 → 16)</span>, ReLU, dropout p = 0,5, <span class='mono'>GCNConv(16 → 7)</span>, log-softmax ; " +
          "<span class='mono'>H⁽¹⁾ = σ(ÂXW⁽⁰⁾)</span>, <span class='mono'>Z = ÂH⁽¹⁾W⁽¹⁾</span>, prédiction <span class='mono'>ŷᵢ = argmax_c Ŷ_i,c</span>.</p>",
        objectif: "Compter les paramètres de la fiche, puis ceux du script.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { n(b, "GCNConv(1433 → 16) : poids + biais =", 22944, ok, "1433 × 16 + 16."); },
            function (b, ok) { n(b, "GCNConv(16 → 7) :", 119, ok, "16 × 7 + 7."); },
            function (b, ok) { n(b, "Script (64 neurones cachés) : total des deux couches GCN =", 92231, ok, "1433 × 64 + 64 + 64 × 7 + 7."); },
            function (b, ok) { A.choix(b, { question: "Le MLP du script (Linear 1433 → 64 → 7) a combien de paramètres de plus que le GCN ?", options: ["aucun : le même nombre", "beaucoup plus", "beaucoup moins"], bonne: 0, surReussite: ok }); }
          ], "Même nombre de paramètres : la seule différence est le mélange Â par le graphe. C'est ce qui rend la comparaison intéressante.");
          A.note(zone, "La fiche « Two-layer GCN for Cora » utilise 16 neurones cachés, le script gnn_cora_lab.py en utilise 64 (hidden_channels=64 pour le MLP comme pour le GCN).");
        }
      },
      {
        titre: "La boucle d'entraînement",
        texte: A.code("optimizer = torch.optim.Adam(model.parameters(), lr=0.01, weight_decay=5e-4)\nfor epoch in range(1, epochs + 1):\n    model.train(); optimizer.zero_grad()\n    logits = model(data.x, data.edge_index)\n    loss = F.cross_entropy(logits[data.train_mask], data.y[data.train_mask])\n    loss.backward(); optimizer.step()\n    # validation : si val_acc s'améliore, on garde une copie des poids, sinon stale += 1\n    if stale >= patience:   # patience = 30\n        break\nmodel.load_state_dict(best_state)   # puis accuracy sur test_mask"),
        objectif: "Expliquer les choix de la boucle.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "weight_decay=5e-4 est…", options: ["une régularisation L2 des poids", "le taux d'apprentissage", "la probabilité de dropout"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "La perte est calculée sur…", options: ["logits[train_mask] seulement", "tous les nœuds", "le masque de test"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "patience = 30 signifie…", options: ["on arrête si la validation ne s'améliore pas pendant 30 époques", "on attend 30 époques avant de commencer", "on fait exactement 30 époques"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Pourquoi recharger best_state avant le test ?", options: ["évaluer le modèle choisi sur la validation, pas le dernier", "accélérer le test", "réinitialiser le dropout"], bonne: 0, surReussite: ok }); }
          ], "Arrêt précoce, weight decay et dropout : trois remèdes au sur-apprentissage vus au chapitre 6.");
        }
      },
      {
        titre: "MLP contre GCN",
        texte: "<p>Le lab compare un modèle de base qui ne voit que les mots (MLP) à un GCN qui voit aussi les citations, avec le même découpage et un réglage comparable.</p>",
        objectif: "Tirer les bonnes conclusions d'une comparaison.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "Il ne faut pas supposer que le GNN gagne : il faut le mesurer.", vrai: true },
              { texte: "Un seul run avec une graine fixe suffit pour conclure.", vrai: false, explication: "Le script le dit : répéter avec plusieurs graines avant de conclure." },
              { texte: "Si le GNN fait moins bien que le MLP, il faut vérifier les arêtes, leur sens, l'alignement des caractéristiques avec les identifiants, et chercher une fuite.", vrai: true },
              { texte: "Trop de couches, over-smoothing ou hétérophilie peuvent expliquer un GNN faible.", vrai: true }
            ],
            surReussite: function () { api.valider("Rapporter le découpage exact, comparer à une baseline sans graphe, suivre train et validation, rapporter l'accuracy de test et des métriques par classe, répéter les graines."); }
          });
        }
      },
      {
        titre: "Exercice A du cours : la solubilité",
        texte: "<p>En binôme dans le cours : concevoir un GNN qui prédit si une petite molécule est soluble dans l'eau.</p>",
        objectif: "Répondre aux choix de conception.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "Nœuds et arêtes ?", options: ["atomes et liaisons", "molécules et réactions", "pixels et voisins"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Niveau de prédiction ?", options: ["graphe (passage de messages + readout + MLP)", "nœud", "arête"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Découpage ?", options: ["par squelette moléculaire (scaffold), avec une baseline sans graphe", "aléatoire par atome", "aucun, on évalue sur l'entraînement"], bonne: 0, surReussite: ok }); }
          ], "Perte : cross-entropy (classification) ou MAE / MSE (régression). Un score de test élevé peut tromper si des molécules presque identiques sont dans le train et le test.");
        }
      }
    ],
    fin: { texte: "<p>Cora : 2 708 nœuds, 1 433 caractéristiques, 7 classes, 140 / 500 / 1 000 ; GCN à 2 couches, Adam, weight decay, dropout, arrêt précoce sur la validation ; toujours comparer à un MLP.</p>", cartes: "gnn" }
  });
})();
