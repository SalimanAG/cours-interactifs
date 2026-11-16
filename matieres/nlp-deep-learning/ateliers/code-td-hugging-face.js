/* Atelier : code du TD Hugging Face (DistilBERT, sentiment IMDb).
   Extraits réécrits pour l'atelier ; prédire ce que fait le code. */
(function () {
  "use strict";
  var N = NLP, fmt = N.fmt;
  var P = N.softmax([2, 0]);

  var etapes = [
    {
      titre: "Un pipeline prêt à l'emploi",
      texte: N.code("from transformers import pipeline\nclf = pipeline(\"sentiment-analysis\")\nclf([\"I loved this movie.\", \"Not bad at all.\"])\n# [{'label': 'POSITIVE', 'score': 0.99...}, {'label': ..., 'score': ...}]") +
        "<p>Le pipeline enchaîne tokenizer, modèle et post-traitement (softmax, nom de l'étiquette).</p>",
      objectif: "Interpréter le score.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, { items: [
          { texte: "score est la probabilité donnée à l'étiquette prédite.", vrai: true },
          { texte: "Un score de 0,99 prouve que la prédiction est correcte.", vrai: false, explication: "" },
          { texte: "« Not bad at all » (négation) est un cas classique de piège.", vrai: true }
        ], surReussite: function () { api.valider("Une forte confiance n'est pas une preuve : on vérifie sur des données étiquetées."); } });
      }
    },
    {
      titre: "Le tokenizer",
      texte: N.code("tok = AutoTokenizer.from_pretrained(\"distilbert-base-uncased\")\nenc = tok([\"Great film!\", \"A long and boring story\"],\n          padding=True, truncation=True, max_length=24,\n          return_tensors=\"pt\")\nenc.keys()   # input_ids, attention_mask") +
        "<p>Le tokenizer ajoute des tokens spéciaux ([CLS] au début, [SEP] à la fin) et découpe les mots rares en sous-mots (préfixe ##).</p>",
      objectif: "Prévoir input_ids et attention_mask.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "padding=True : la phrase courte est complétée…", options: ["jusqu'à la longueur de la plus longue phrase du lot", "jusqu'à 24 dans tous les cas", "pas du tout"], bonne: 0, expliquer: ["Exact. max_length=24 ne sert qu'à tronquer (truncation=True).", "Non : il faudrait padding=\"max_length\".", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "attention_mask vaut 0…", options: ["sur les tokens de padding", "sur les tokens spéciaux", "sur les sous-mots"], bonne: 0, expliquer: ["Exact : le modèle ne doit pas regarder le padding.", "Non : [CLS] et [SEP] ont un masque à 1.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "« great film » donne 2 tokens de mots ; avec [CLS] et [SEP], longueur =", attendu: 4, placeholder: "ex. 2", surReussite: ok }); }
        ], "Un tokenizer doit toujours correspondre au checkpoint du modèle.");
      }
    },
    {
      titre: "Des logits à l'étiquette",
      texte: N.code("model = AutoModelForSequenceClassification.from_pretrained(ckpt)\nwith torch.no_grad():\n    logits = model(**enc).logits        # (B, 2)\nprobs = logits.softmax(dim=-1)\npred = probs.argmax(dim=-1)\n[model.config.id2label[int(i)] for i in pred]"),
      objectif: "Calculer une probabilité depuis des logits.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "logits (2 ; 0) → p(classe 0) ≈", attendu: P[0], tolerance: 0.01, placeholder: "ex. 0,5", indice: "e² / (e² + e⁰) ≈ 7,39 / 8,39.", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Rôle de id2label ?", options: ["traduire l'indice de classe en nom lisible", "convertir des tokens en indices", "calculer la softmax"], bonne: 0, expliquer: ["Exact (0 → NEGATIVE, 1 → POSITIVE par ex.).", "Non : c'est le tokenizer.", "Non."], surReussite: ok }); }
        ], "Les logits ne sont pas des probabilités : il faut la softmax.");
      }
    },
    {
      titre: "Préparer IMDb",
      texte: N.code("train = imdb[\"train\"].shuffle(seed=42).select(range(1000))\ntest  = imdb[\"test\"].shuffle(seed=42).select(range(400))\ndef tokenize(batch):\n    return tok(batch[\"text\"], truncation=True, max_length=128)\ntrain = train.map(tokenize, batched=True)\ncollator = DataCollatorWithPadding(tokenizer=tok)"),
      objectif: "Comprendre troncature et padding dynamique.",
      installer: function (zone, api) {
        Exercices.cocher(zone, { question: "Affirmations vraies :", options: ["une critique de 600 tokens est coupée à 128 tokens", "le padding est ajouté lot par lot, à la longueur du plus long exemple du lot", "toutes les séquences du jeu sont complétées à 128 dès map", "la troncature peut faire perdre la conclusion d'une critique"], bonnes: [0, 1, 3], explication: "map ne complète pas (pas de padding=) : c'est le collator qui le fait par lot.", surReussite: function () { api.valider(); } });
      }
    },
    {
      titre: "Fine-tuner avec Trainer",
      texte: N.code("args = TrainingArguments(output_dir=\"out\", learning_rate=2e-5,\n    per_device_train_batch_size=16, num_train_epochs=1,\n    weight_decay=0.01)\ntrainer = Trainer(model=model, args=args, train_dataset=train,\n    eval_dataset=test, data_collator=collator,\n    compute_metrics=compute_metrics)\ntrainer.evaluate()   # avant\ntrainer.train()\ntrainer.evaluate()   # après") +
        "<p>Le modèle part de distilbert-base-uncased (pré-entraîné) avec une tête de classification neuve, initialisée au hasard.</p>",
      objectif: "Prévoir l'évaluation avant entraînement et le nombre de pas.",
      installer: function (zone, api) {
        N.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "Accuracy attendue avant entraînement (2 classes équilibrées) ?", options: ["≈ 0,5 (hasard)", "≈ 0,9", "0"], bonne: 0, expliquer: ["La tête est aléatoire.", "Non.", "Non."], surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "1 000 exemples, lots de 16, 1 époque → nombre de pas =", attendu: 63, placeholder: "ex. 50", indice: "1 000 / 16 = 62,5 : le dernier lot est incomplet.", surReussite: ok }); },
          function (b, ok) { Exercices.choix(b, { question: "Pendant trainer.train(), quels poids sont mis à jour ?", options: ["tout le modèle : encodeur et tête", "la tête seulement", "aucun"], bonne: 0, expliquer: ["Fine-tuning complet (d'où un petit taux d'apprentissage, 2e-5).", "Non : ce serait des features gelées (voir le Lab).", "Non."], surReussite: ok }); }
        ], "Toujours comparer à l'évaluation de départ.");
      }
    },
    {
      titre: "Analyser les erreurs",
      texte: "<p>Le TD demande de classer les erreurs du modèle.</p>",
      objectif: "Associer chaque critique à sa catégorie d'erreur.",
      installer: function (zone, api) {
        Exercices.associer(zone, { categories: ["Négation", "Ironie", "Avis mitigé", "Troncature"], items: [
          { texte: "« Not good, not good at all. »", bonne: 0 },
          { texte: "« Oh great, another two hours I'll never get back. »", bonne: 1 },
          { texte: "« Superb actors, but a dull script. »", bonne: 2 },
          { texte: "Une longue critique dont le verdict est dans la dernière phrase", bonne: 3 }
        ], surReussite: function () { api.valider("Autres catégories du TD : dépendances à longue distance, erreurs d'annotation."); } });
      }
    }
  ];

  Lecon.demarrer({ matiere: "nlp-deep-learning", id: "code-td-hugging-face", etapes: etapes, fin: { texte: "<p>pipeline → tokenizer (input_ids, attention_mask, tokens spéciaux) → logits → softmax → argmax → id2label ; map + DataCollatorWithPadding ; Trainer ; évaluer avant et après ; analyser les erreurs.</p>", cartes: "transformers-pratique" } });
})();
