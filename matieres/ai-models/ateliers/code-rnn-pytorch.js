/* Atelier : Code PyTorch d'un RNN « vanilla » (cours 5, partie « Data preparation and evaluation with scikit-learn ; recurrent model with PyTorch »).
   Tâche du cours : classer une séquence de 10 nombres (classe 1 si la somme est positive). */
(function () {
  "use strict";
  var A = AIM;
  function n(b, label, attendu, ok, indice) { Exercices.nombre(b, { label: label, attendu: attendu, placeholder: "ex. 12", indice: indice, surReussite: ok }); }
  function t(b, label, attendu, ok, indice) { Exercices.texte(b, { label: label, attendu: attendu, mode: "souple", verdict: false, placeholder: "(a, b, c)", indice: indice, surReussite: ok }); }
  function formes(v) { var s = v.join(", "), c = v.join(","); return ["(" + s + ")", "(" + c + ")", s, c, "(" + s + ",)", "[" + s + "]"]; }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "code-rnn-pytorch",
    etapes: [
      {
        titre: "Les données et leurs formes",
        texte: A.code("X = np.random.randn(2000, 10, 1).astype(np.float32)   # (échantillons, pas de temps, variables)\n" +
          "y = (X.sum(axis=1).ravel() > 0).astype(np.int64)\n\n" +
          "X_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42, stratify=y)"),
        objectif: "Donner les formes des données d'entraînement et le rôle de stratify.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { t(b, "X_train.shape =", formes([1600, 10, 1]), ok, "80 % des 2 000 séquences, 10 pas, 1 variable."); },
            function (b, ok) { A.choix(b, { question: "stratify=y sert à…", options: ["garder les mêmes proportions de classes dans le train et le test", "mélanger les pas de temps", "normaliser X"], bonne: 0, surReussite: ok }); }
          ], "Pour un RNN « batch-first », les entrées ont la forme (batch, pas de temps, variables).");
        }
      },
      {
        titre: "Le modèle",
        texte: A.code("class VanillaRNN(nn.Module):\n    def __init__(self, input_size=1, hidden_size=16):\n        super().__init__()\n" +
          "        self.rnn = nn.RNN(input_size, hidden_size,\n                          nonlinearity=\"tanh\", batch_first=True)\n        self.fc = nn.Linear(hidden_size, 2)\n\n" +
          "    def forward(self, x):\n        output, hidden = self.rnn(x)\n        return self.fc(hidden[-1])   # état caché final"),
        objectif: "Suivre les formes dans forward pour un lot de 32 séquences.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { t(b, "hidden[-1].shape =", formes([32, 16]), ok, "Un état caché de taille 16 par séquence du lot."); },
            function (b, ok) { t(b, "self.fc(hidden[-1]).shape =", formes([32, 2]), ok, "Deux scores de classe (logits)."); },
            function (b, ok) { n(b, "Nombre de paramètres de self.fc :", 34, ok, "16 × 2 + 2."); }
          ], "La couche linéaire transforme l'état caché final en deux logits : c'est un schéma « plusieurs → un ».");
        }
      },
      {
        titre: "La boucle d'entraînement",
        texte: A.code("criterion = nn.CrossEntropyLoss()\noptimizer = torch.optim.Adam(model.parameters(), lr=0.01)\nfor epoch in range(20):\n    for xb, yb in train_loader:   # lots de 32, mélangés\n        ...") +
          "<p>Remets dans l'ordre le corps de la boucle sur les lots.</p>",
        objectif: "Ordonner les 5 instructions d'un pas d'entraînement.",
        installer: function (zone, api) {
          Exercices.ordonner(zone, { consigne: "Touche les instructions dans l'ordre.", separateur: "", items: ["optimizer.zero_grad()", "logits = model(xb)", "loss = criterion(logits, yb)", "loss.backward()", "optimizer.step()"], surReussite: function () {
            api.valider("zero_grad (sinon les gradients s'accumulent), passe avant, perte, backward (BPTT : le gradient remonte le temps), step (Adam met à jour les paramètres partagés).");
          } });
        }
      },
      {
        titre: "Évaluer, et qui fait quoi",
        texte: A.code("model.eval()\nwith torch.no_grad():\n    logits = model(torch.from_numpy(X_test))\n    y_pred = logits.argmax(dim=1).numpy()\nprint(\"Test accuracy:\", accuracy_score(y_test, y_pred))"),
        objectif: "Expliquer l'évaluation et le partage des rôles.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "argmax(dim=1) donne…", options: ["pour chaque séquence, l'indice de la classe au plus grand logit", "le plus grand logit du lot", "la probabilité de la classe 1"], bonne: 0, surReussite: ok }); },
            function (b, ok) {
              Exercices.associer(b, { categories: ["scikit-learn", "PyTorch"], items: [
                { texte: "train_test_split", bonne: 0 }, { texte: "définir la couche récurrente", bonne: 1 },
                { texte: "accuracy_score", bonne: 0 }, { texte: "calculer les gradients à travers le temps", bonne: 1 }
              ], surReussite: ok });
            },
            function (b, ok) { A.choix(b, { question: "Pourquoi pas un MLPClassifier de scikit-learn ?", options: ["scikit-learn n'a pas de RNN standard ; un MLP n'a pas d'état caché récurrent", "un MLP ne peut pas classer en 2 classes", "PyTorch est plus rapide"], bonne: 0, surReussite: ok }); }
          ], "La précision dépend de l'entraînement : c'est une tâche synthétique volontairement simple.");
        }
      },
      {
        titre: "Exercice de conception du cours",
        texte: "<p>On dispose de la demande d'électricité horaire et de mesures météo ; on veut prévoir la demande de l'heure suivante.</p>",
        objectif: "Répondre aux quatre questions du mini-exercice.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { A.cocher(b, { question: "Que peut contenir le vecteur xₜ d'un pas ? (plusieurs réponses)", options: ["la demande récente", "la température et l'humidité", "des variables de calendrier (heure, jour)", "la demande de l'heure à prédire"], bonnes: [0, 1, 2], explication: "La dernière serait une fuite : c'est la cible.", surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Pour prévoir seulement l'heure suivante :", options: ["plusieurs → un", "un → plusieurs", "bidirectionnel"], bonne: 0, expliquer: ["Exact ; plusieurs → plusieurs permettrait de prévoir un horizon de plusieurs heures.", "Non.", "Non : en prévision, les entrées futures ne sont pas disponibles."], surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Comment découper train / validation / test ?", options: ["chronologiquement", "aléatoirement", "par ordre de demande croissante"], bonne: 0, surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Le RNN vanilla échoue sur les dépendances longues. Une réponse du cours :", options: ["essayer un LSTM / GRU, comparer à des baselines simples, couper les gradients explosifs", "supprimer la tanh", "mélanger les heures"], bonne: 0, surReussite: ok }); }
          ], "Utiliser un RNN quand un état séquentiel est utile et compatible avec les contraintes de latence, de données et de calcul — pas seulement parce que les données ont un axe temporel.");
        }
      }
    ],
    fin: { texte: "<p>(échantillons, pas, variables) → nn.RNN(batch_first=True) → état final hidden[-1] → Linear → logits ; CrossEntropyLoss, Adam ; argmax pour prédire.</p>", cartes: "rnn" }
  });
})();
