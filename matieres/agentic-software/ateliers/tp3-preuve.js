/* Atelier : TP 3 — l'assistant documentaire (Langflow) et ses pannes : grounding, sélection, chunks,
   packing dans un budget, doublons, localisation de la panne, quatre jugements, reranking.
   Fil rouge : un mini-corpus INVENTÉ pour l'atelier (service fictif « Nébula ») ; le TP utilise le corpus
   synthétique Atlas (D01 à D12), qui n'est pas recopié ici. Les règles appliquées sont celles du workbook. */
(function () {
  "use strict";
  var el = Site.el, A = ASD;
  var QUESTION = "Un envoi de 50 MiB échoue avec HTTP 413 en API 3.0. Que dois-je changer ?";
  var CORPUS = [
    { id: "N01", titre: "Limites d'envoi", version: "3.0", statut: "courant", fiable: true },
    { id: "N02", titre: "Politique de relance", version: "3.0", statut: "courant", fiable: true },
    { id: "N03", titre: "Jetons d'accès", version: "3.0", statut: "courant", fiable: true },
    { id: "N04", titre: "Limites d'envoi", version: "2.0", statut: "archivé", fiable: true },
    { id: "N05", titre: "Note de dépannage (tiers)", version: "3.0", statut: "courant", fiable: false }
  ];

  function tableCorpus() {
    return "<table class='tableau'><tr><th>doc</th><th>titre</th><th>version</th><th>statut</th><th>fiable</th></tr>" +
      CORPUS.map(function (d) { return "<tr><td class='mono'>" + d.id + "</td><td>" + d.titre + "</td><td class='num'>" + d.version + "</td><td>" + d.statut + "</td><td>" + (d.fiable ? "oui" : "non") + "</td></tr>"; }).join("") + "</table>";
  }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Grounding : seules les preuves changent",
      texte:
        "<p>Activité 02 du workbook : on pose la même question deux fois, d'abord avec le champ preuves à <span class='mono'>(none)</span>, puis en collant le document utile dans le prompt.</p>" +
        "<p class='mono'>« " + QUESTION + " »</p>" +
        "<p>Le prompt demande de répondre <b>UNKNOWN</b> quand les preuves ne permettent pas de répondre.</p>",
      objectif: "Prévoir les deux réponses, puis dire ce qui a changé entre elles.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.choix(b, {
              question: "Sans preuve, quelle réponse est la bonne ?",
              options: ["UNKNOWN, en disant ce qui manque", "« Réduis l'envoi sous 32 MiB » (une limite plausible)", "Une erreur HTTP"],
              bonne: 0,
              expliquer: ["Oui : une abstention est la bonne réponse ici. Une réponse confiante inventée est un échec à noter.", "Non : c'est une invention plausible — exactement ce que le grounding doit empêcher.", "Non : la requête réussit ; c'est le contenu de la réponse qu'on juge."],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Avec le document collé dans le prompt, la réponse devient correcte. Qu'est-ce qui a changé ?",
              options: ["Seulement les preuves dans le prompt", "Les poids du modèle, qui a appris le document", "L'index vectoriel"],
              bonne: 0,
              expliquer: ["Oui : « supplying a document in the prompt is grounding, not training ».", "Non : aucun entraînement n'a eu lieu, les poids sont identiques.", "Non : à cette activité, il n'y a pas encore d'index — le document est collé à la main."],
              surReussite: ok
            });
          }
        ], "Grounding = preuves dans le prompt. Modèle identique, réponse différente.");
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Indexer : sélection et chunks",
      texte:
        "<p>Activité 03 : la branche d'indexation filtre les documents, les découpe en <b>chunks</b>, calcule leurs embeddings et les écrit dans une collection Chroma.</p>" +
        "<p>Corpus de l'atelier (inventé) :</p>" + tableCorpus(),
      objectif: "Choisir les documents indexés, puis lire un identifiant de chunk.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.cocher(b, {
              question: "Règle de la baseline : <b>courants et fiables seulement</b>. Quels documents sont indexés ?",
              options: ["N01", "N02", "N03", "N04", "N05"],
              bonnes: [0, 1, 2],
              explication: "N04 est archivé (version 2.0, ancienne limite), N05 n'est pas fiable. Dans le TP : D01–D10 gardés, D11 (archivé) et D12 (non fiable) exclus.",
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Que signifie l'identifiant N01-c600-o80-01 ?",
              options: [
                "2e chunk de N01, découpé en morceaux de 600 caractères avec 80 caractères de chevauchement",
                "chunk de 600 tokens, score 80 %",
                "600e chunk de la collection, version 0.80"
              ],
              bonne: 0,
              expliquer: ["Oui : l'ID nomme la source et la configuration de découpage. Les tailles comptent des caractères, pas des mots ni des tokens.", "Non : ni tokens ni score dans l'ID.", "Non."],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.cocher(b, {
              question: "Quels changements imposent d'indexer dans une <b>nouvelle collection</b> ?",
              options: ["passer de chunks de 600 à 200 caractères", "inclure les documents archivés", "passer de top k 3 à top k 1", "passer d'un budget de 4000 à 600 caractères"],
              bonnes: [0, 1],
              explication: "Découpage ou sélection → nouvelle collection nommée. Top k et budget agissent à la requête : pas de réindexation. Et le même modèle d'embedding pour documents et questions.",
              surReussite: ok
            });
          }
        ], "Sélection et découpage fixent la collection ; top k et budget se règlent à la requête.");
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Packing : des chunks entiers dans un budget",
      texte:
        "<p>Activité 04 puis 06 : la recherche renvoie les candidats (top k = 3), puis <b>Evidence Context</b> les met dans le prompt. Règle du packer : on parcourt les candidats dans l'ordre, " +
        "un bloc n'entre que s'il tient <b>en entier</b> dans le budget restant (2 caractères de séparation entre deux blocs), sinon il est écarté et on passe au suivant.</p>" +
        "<p>Le budget passe de 4000 à <b>600 caractères</b>. Touche les lignes que le packer gardera, puis vérifie.</p>",
      objectif: "Prédire exactement les blocs packés avec un budget de 600.",
      installer: function (zone, api) {
        var cand = [
          { id: "N01-c600-o80-00", titre: "Limites d'envoi", version: "3.0", taille: 640 },
          { id: "N02-c600-o80-00", titre: "Politique de relance", version: "3.0", taille: 520 },
          { id: "N03-c600-o80-00", titre: "Jetons d'accès", version: "3.0", taille: 410 }
        ];
        var budget = 600, choisis = {};
        var pr = new PipelineRag(zone, { titre: "candidats renvoyés par la recherche (taille du bloc étiqueté, en caractères)" });
        var verif = A.boutons(zone, ["Vérifier ma prédiction"], verifier)[0];
        function dessiner(resultat) {
          pr.dessiner({ candidats: cand, budget: budget, resultat: resultat, clic: resultat ? null : function (i) { choisis[i] = !choisis[i]; api.retour("Prédits : " + (Object.keys(choisis).filter(function (k) { return choisis[k]; }).map(function (k) { return cand[k].id; }).join(", ") || "aucun"), null); dessiner(); } });
          if (!resultat) pr.boite.querySelectorAll("tr.clic").forEach(function (tr, i) { if (choisis[i]) tr.classList.add("courant"); });
        }
        function verifier() {
          var r = PipelineRag.packer(cand, budget);
          var predits = cand.map(function (c, i) { return !!choisis[i]; });
          var juste = predits.every(function (v, i) { return v === (r.gardes.indexOf(i) >= 0); });
          if (!juste) { api.retour("Pas encore. Rappel : un bloc trop long est écarté, mais on continue avec les suivants. Et le séparateur compte entre deux blocs.", false); return; }
          dessiner(r); verif.disabled = true;
          api.retour("N01 (640) ne tient pas dans 600 : écarté, même s'il a été retrouvé en 1er. N02 (520) entre. N03 : 520 + 2 + 410 = 932 > 600, écarté.", true);
          api.valider("C'est la panne « source retrouvée mais absente du prompt » : le document qui répond (N01) a disparu au packing.");
        }
        dessiner();
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Supprimer les doublons",
      texte:
        "<p>Activité 07 (le petit changement de code Python) : la recherche renvoie deux fois le même chunk. Sans suppression des doublons, la copie prend la place d'une autre source. " +
        "Le correctif du workbook ajoute trois lignes au début de la boucle de <span class='mono'>pack</span> :</p>" +
        "<pre class='code'>if chunk_id in seen:\n    continue\nseen.add(chunk_id)</pre>" +
        "<p>Budget fixe : <b>1400 caractères</b>. Candidats : N02 (590), N02 (590), N03 (650).</p>",
      objectif: "Calculer les caractères packés avant et après le correctif.",
      installer: function (zone, api) {
        var cand = [
          { id: "N02-c600-o80-00", titre: "Politique de relance", version: "3.0", taille: 590 },
          { id: "N02-c600-o80-00", titre: "Politique de relance", version: "3.0", taille: 590 },
          { id: "N03-c600-o80-00", titre: "Jetons d'accès", version: "3.0", taille: 650 }
        ];
        var avant = PipelineRag.packer(cand, 1400, { dedoublonner: false });
        var apres = PipelineRag.packer(cand, 1400);
        var pr = new PipelineRag(zone, { titre: "même recherche, même budget" });
        pr.dessiner({ candidats: cand, budget: 1400 });
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.nombre(b, { label: "Avant le correctif, caractères packés :", attendu: avant.utilise, placeholder: "ex. 1000",
              indice: "590, puis 2 + 590 ; N03 ne tient plus (il faudrait 2 + 650).", surReussite: function () { pr.dessiner({ candidats: cand, budget: 1400, resultat: avant }); ok(); } });
          },
          function (b, ok) {
            Exercices.nombre(b, { label: "Après le correctif, caractères packés :", attendu: apres.utilise, placeholder: "ex. 1000",
              indice: "La 2e copie de N02 est ignorée : 590 + 2 + 650.", surReussite: function () { pr.dessiner({ candidats: cand, budget: 1400, resultat: apres }); ok(); } });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Moins de caractères, et pourtant meilleur contexte. Pourquoi ?",
              options: ["Deux sources distinctes au lieu d'une source répétée", "Le modèle lit plus vite un texte court", "Le correctif améliore la recherche"],
              bonne: 0,
              expliquer: ["Oui : plus d'information distincte dans le même budget. Dans le TP : 1312 → 1246 caractères, et D05 (la politique de relance) entre enfin.", "Non : ce n'est pas l'argument du workbook.", "Non : la recherche est identique ; seul le packing change."],
              surReussite: ok
            });
          }
        ], "Le correctif change le packing, pas la recherche ni le modèle.");
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Localiser la panne",
      texte:
        "<p>Activité 06 : quand une réponse est fausse, il faut trouver <b>où la preuve a disparu</b>, en inspectant dans l'ordre : tableau retrouvé, preuves packées, prompt final, réponse.</p>" +
        "<table class='tableau'><tr><th>Constat</th><th>Panne</th></tr>" +
        "<tr><td>source absente de l'index</td><td>sélection / indexation</td></tr>" +
        "<tr><td>dans l'index, mais pas renvoyée</td><td>retrieval</td></tr>" +
        "<tr><td>renvoyée, mais absente du prompt</td><td>packing</td></tr>" +
        "<tr><td>bonne preuve dans le prompt, mauvaise réponse</td><td>génération</td></tr></table>",
      objectif: "Diagnostiquer quatre cas.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["indexation", "retrieval", "packing", "génération"],
          items: [
            { texte: "N01 est dans le tableau renvoyé par Chroma, mais pas dans « Packed evidence ».", bonne: 2 },
            { texte: "On a indexé une collection sans N02 : la question sur les relances ne trouve jamais N02.", bonne: 0, explication: "Démo du workbook : la collection noD05 exclut la politique de relance." },
            { texte: "N01 est dans le prompt final, mais la réponse annonce 32 MiB au lieu de la valeur de N01.", bonne: 3 },
            { texte: "N01 est bien dans la collection, mais la question en français ne le fait pas remonter dans le top 3.", bonne: 1, explication: "Cas E09 : ne pas supposer que la recherche est multilingue parce que le générateur parle français." }
          ],
          surReussite: function () { api.valider("Chaque diagnostic s'appuie sur un résultat intermédiaire qui écarte les autres explications."); }
        });
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Juger une réponse, et ce que le reranking ne rattrape pas",
      texte:
        "<p>Activité 05 : pour chaque réponse, quatre jugements <b>séparés</b> — source requise retrouvée ? packée ? faits soutenus ? citation valide (l'ID appartient aux preuves) ?</p>" +
        "<p>Réponse à juger : « Réduis l'envoi à 20 MiB ou découpe-le [N01-c600-o80-00]. » Les preuves packées contiennent bien N01, mais N01 donne une autre limite que 20 MiB.</p>",
      objectif: "Dire ce qui est établi, puis les limites du reranking.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["oui", "non"],
              items: [
                { texte: "La source requise a été retrouvée.", bonne: 0 },
                { texte: "Elle a été packée.", bonne: 0 },
                { texte: "La citation est valide (l'ID est dans les preuves).", bonne: 0 },
                { texte: "L'affirmation « 20 MiB » est soutenue.", bonne: 1, explication: "Une citation valide ne prouve pas le support : il faut lire le passage." }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.cocher(b, {
              question: "Activité 09 — le reranking (un appel modèle de plus qui réordonne les candidats)…",
              options: [
                "change l'ordre des candidats déjà retrouvés",
                "ajoute de la latence et consomme du quota",
                "peut faire réapparaître un document absent de la liste des candidats",
                "en cas de sortie invalide (un ID inventé), garde l'ordre d'origine et signale l'erreur"
              ],
              bonnes: [0, 1, 3],
              explication: "Pour récupérer un document manquant, il faut agir plus tôt : plus de candidats, reformuler la requête, corriger l'indexation.",
              surReussite: ok
            });
          }
        ], "Retrouvé, packé, soutenu, cité : quatre questions, quatre réponses indépendantes.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software",
    id: "tp3-preuve",
    etapes: etapes,
    fin: {
      texte: "<p>À retenir du TP 3 :</p><ul>" +
        "<li>Grounding ≠ entraînement ; UNKNOWN quand les preuves manquent.</li>" +
        "<li>Sélection et découpage → nouvelle collection ; top k et budget → à la requête.</li>" +
        "<li>Le packer garde des chunks entiers : un bloc trop long disparaît ; les doublons volent de la place.</li>" +
        "<li>Localiser la panne : indexation, retrieval, packing ou génération — preuve intermédiaire à l'appui.</li></ul>" +
        "<p>Pour le projet, le RAG passe par l'outil <span class='mono'>rag_search</span> de l'agent, puis par Elasticsearch (session 6) : les mêmes questions de diagnostic s'y appliquent.</p>",
      cartes: "s3-rag"
    }
  });
})();
