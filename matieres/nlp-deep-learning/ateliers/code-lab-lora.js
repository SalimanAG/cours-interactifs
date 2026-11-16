/* Atelier : code du Lab Transformers (DistilCamemBERT, articles de presse en français) :
   features gelées vs LoRA. Extraits réécrits pour l'atelier. */
(function () {
  "use strict";
  var N = NLP;

  var etapes = [
    {
      titre: "Tokenizer et longueur maximale",
      texte: N.code("tok = AutoTokenizer.from_pretrained(MODEL_NAME)\nMAX_LENGTH = 256\nenc = tok(texts, truncation=True, max_length=MAX_LENGTH)"),
      objectif: "Juger trois affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "On peut utiliser le tokenizer d'un autre modèle tant que la langue est la même.", vrai: false, explication: "" },
          { texte: "MAX_LENGTH = 256 compte aussi les tokens spéciaux.", vrai: true },
          { texte: "L'identifiant de padding vaut toujours 0.", vrai: false, explication: "" }
        ], surReussite: function () { api.valider("Le tokenizer doit correspondre au checkpoint ; l'id de padding se lit dans tok.pad_token_id."); } });
      }
    },
    {
      titre: "Le masque n'efface pas le padding",
      texte: "<p>L'attention_mask empêche les tokens réels de regarder le padding, mais le modèle produit quand même un vecteur de sortie pour chaque position de padding. Pour résumer une phrase par une moyenne, il faut une <b>moyenne masquée</b> :</p>" +
        N.code("m = mask.unsqueeze(-1)             # (B, L, 1)\nmean = (h * m).sum(1) / m.sum(1)   # (B, H)") +
        "<p>Exemple sur une seule coordonnée : sorties (2 ; 4 ; 9), masque (1 ; 1 ; 0).</p>",
      objectif: "Comparer moyenne naïve et moyenne masquée.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "moyenne naïve =", attendu: 5, placeholder: "ex. 1", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "moyenne masquée =", attendu: 3, placeholder: "ex. 1", surReussite: ok }); }
        ], "La moyenne naïve est faussée par la position de padding.");
      }
    },
    {
      titre: "Le coût de la longueur",
      texte: "<p>Pour un lot de B séquences de longueur L, chaque tête de chaque couche calcule une matrice de scores de forme (B, L, L).</p>",
      objectif: "Compter les scores.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "B = 2, L = 128 → B·L² =", attendu: 32768, placeholder: "ex. 1000", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "B = 2, L = 256 → B·L² =", attendu: 131072, placeholder: "ex. 1000", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "facteur entre les deux =", attendu: 4, placeholder: "ex. 2", surReussite: ok }); }
        ], "Doubler L multiplie par 4 la taille des scores : c'est le coût quadratique du cours 4.");
      }
    },
    {
      titre: "Stratégie A : features gelées",
      texte: N.code("enc_model = AutoModel.from_pretrained(MODEL_NAME)\nenc_model.eval()\nenc_model.requires_grad_(False)\nwith torch.no_grad():\n    out = enc_model(**batch)\n    feats = out.last_hidden_state[:, 0, :]\nclf = LogisticRegression(max_iter=1000).fit(X_feats, y)"),
      objectif: "Donner la forme des features, puis le rôle de chaque ligne.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "last_hidden_state a la forme (B, L, 768). Forme de feats ?", options: ["(B, 768)", "(B, L)", "(L, 768)"], bonne: 0, expliquer: ["On garde le vecteur du premier token (position 0) de chaque séquence.", "Non.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.associer(b, { categories: [".eval()", "requires_grad_(False)", "torch.no_grad()"], items: [
            { texte: "désactive le dropout", bonne: 0 },
            { texte: "gèle les paramètres (aucune mise à jour)", bonne: 1 },
            { texte: "ne construit pas le graphe de calcul : moins de mémoire", bonne: 2 }
          ], surReussite: ok }); }
        ], "Seule la régression logistique apprend : rapide, peu coûteux, mais l'encodeur ne s'adapte pas à la tâche.");
      }
    },
    {
      titre: "Stratégie B : LoRA",
      texte: "<div class='formule'>W_eff = W₀ + (α / r) · B A<br>A : (r, d_in)    B : (d_out, r)</div>" +
        "<p>W₀ reste gelée ; on n'entraîne que A et B, soit r·(d_in + d_out) paramètres par matrice adaptée.</p>" +
        N.code("cfg = LoraConfig(r=4, lora_alpha=16,\n    lora_dropout=0.1,\n    target_modules=[\"query\", \"value\"],\n    modules_to_save=[\"classifier\"])\nmodel = get_peft_model(base, cfg)\nmodel.print_trainable_parameters()"),
      objectif: "Compter les paramètres LoRA d'une matrice 768 × 768.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "paramètres de W₀ (768 × 768) =", attendu: 589824, placeholder: "ex. 1000", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "paramètres LoRA, r = 4 =", attendu: 6144, placeholder: "ex. 1000", indice: "4 × (768 + 768).", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "facteur d'échelle α / r =", attendu: 4, placeholder: "ex. 1", surReussite: ok }); }
        ], "Environ 1 % des paramètres de la matrice. modules_to_save : la tête de classification, neuve, est entraînée entièrement.");
      }
    },
    {
      titre: "Comparer honnêtement",
      texte: "<p>Le Lab compare A et B sur le même découpage, avec accuracy, macro-F1 et matrice de confusion normalisée par ligne.</p>",
      objectif: "Juger quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "Normalisée par ligne (vraies classes), la diagonale donne le rappel de chaque classe.", vrai: true },
          { texte: "LoRA adapte les représentations de l'encodeur, pas les features gelées.", vrai: true },
          { texte: "Un écart d'un point sur un petit jeu de test suffit à conclure.", vrai: false, explication: "" },
          { texte: "Les deux stratégies doivent être évaluées sur le même jeu de test.", vrai: true }
        ], surReussite: function () { api.valider("Il faut aussi tenir compte du coût (temps, mémoire, paramètres entraînés), pas seulement du score."); } });
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "code-lab-lora", etapes: etapes, fin: { texte: "<p>Tokenizer du checkpoint ; moyenne masquée ; scores (B, L, L) ; features gelées : last_hidden_state[:, 0, :] + régression logistique ; LoRA : W₀ + (α/r)BA, r(d_in + d_out) paramètres.</p>", cartes: "transformers-pratique" } });
})();
