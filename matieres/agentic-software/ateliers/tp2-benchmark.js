/* Atelier : TP 2 — comparer un modèle local et un modèle hébergé sur trois tâches (benchmark.py, workbook).
   Fil rouge : les trois tâches du workbook (classification, extraction, disponibilité).
   Les mesures et sorties montrées sont INVENTÉES pour l'exercice (aucun résultat personnel). */
(function () {
  "use strict";
  var A = ASD;

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Avant que le modèle réponde",
      texte:
        "<p>Le workbook commence par écrire, <b>indépendamment du modèle</b>, le format attendu et la bonne réponse de chaque tâche.</p>" +
        "<div class='encadre'><span class='titre-encadre'>Tâche C · Disponibilité</span>SLO de 99,9 % sur exactement 30 jours. Pannes sans chevauchement : 25 + 12 + 9 minutes. " +
        "Renvoyer un JSON avec <span class='mono'>downtime_minutes</span>, <span class='mono'>budget_minutes</span> et <span class='mono'>met_slo</span> (booléen).</div>",
      objectif: "Calculer la référence de la tâche C, puis celle de la tâche A.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "downtime_minutes =", attendu: 46, placeholder: "ex. 30", indice: "25 + 12 + 9.", surReussite: ok }); },
          function (b, ok) { Exercices.nombre(b, { label: "budget_minutes =", attendu: 43.2, tolerance: 0.001, placeholder: "ex. 10,5", indice: "30 × 24 × 60 = 43 200 minutes ; 0,1 % de 43 200.", surReussite: ok }); },
          function (b, ok) {
            Exercices.choix(b, {
              question: "met_slo = ?", options: ["false", "true"], bonne: 0,
              expliquer: ["Oui : 46 > 43,2. Référence : 46 / 43,2 / false.", "Non : 46 minutes de panne dépassent le budget de 43,2."], surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Tâche A — « Since this morning's deploy, the export button works but the CSV is empty for every customer. Not urgent for me, but probably for finance. » Label attendu ?",
              options: ["INCIDENT", "REQUEST", "QUESTION"], bonne: 0,
              expliquer: ["Oui : le service est dégradé pour tous les clients. Le piège « not urgent for me » tire vers une autre classe : type de ticket et urgence ne sont pas la même chose.", "Non : personne ne demande une nouvelle fonctionnalité ; quelque chose est cassé.", "Non : c'est un signalement de panne, pas une question."],
              surReussite: ok
            });
          }
        ], "Une référence écrite avant d'appeler le modèle : sans elle, impossible de juger la réponse.");
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Juger le format et les faits séparément",
      texte:
        "<p>Tâche B : « Return only a JSON object with keys service, severity, metric, region. severity is lowercase; metric uses snake_case. Alert: CRITICAL api-gateway p95 latency 2.4s &gt; 800ms (eu-west). »</p>" +
        "<p>Référence : <span class='mono'>{\"service\": \"api-gateway\", \"severity\": \"critical\", \"metric\": \"p95_latency\", \"region\": \"eu-west\"}</span>. " +
        "Le format se vérifie comme le ferait l'application : <span class='mono'>json.loads(response_text)</span>.</p>",
      objectif: "Classer quatre sorties brutes (inventées) : format, puis faits.",
      installer: function (zone, api) {
        var sorties = [
          "{\"service\": \"api-gateway\", \"severity\": \"critical\", \"metric\": \"p95_latency\", \"region\": \"eu-west\"}",
          "```json\n{\"service\": \"api-gateway\", \"severity\": \"critical\", \"metric\": \"p95_latency\", \"region\": \"eu-west\"}\n```",
          "{\"service\": \"api-gateway\", \"severity\": \"critical\", \"metric\": \"p95_latency\", \"region\": null}",
          "Service: api-gateway, severity: critical, metric: p95_latency, region: eu-west."
        ];
        sorties.forEach(function (s, i) { A.code(zone, [s], "# sortie " + (i + 1)); });
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              consigne: "json.loads réussit-il ?",
              categories: ["format valide", "format invalide"],
              items: [
                { texte: "sortie 1", bonne: 0 },
                { texte: "sortie 2", bonne: 1, explication: "Les balises Markdown cassent le parseur strict." },
                { texte: "sortie 3", bonne: 0, explication: "null est du JSON valide." },
                { texte: "sortie 4", bonne: 1 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.associer(b, {
              consigne: "Les valeurs sont-elles correctes ?",
              categories: ["faits corrects", "faits faux"],
              items: [
                { texte: "sortie 1", bonne: 0 },
                { texte: "sortie 2", bonne: 0, explication: "Faits corrects, contrat de l'application violé : les deux jugements sont indépendants." },
                { texte: "sortie 3", bonne: 1, explication: "La région est dans l'alerte (eu-west)." },
                { texte: "sortie 4", bonne: 0 }
              ],
              surReussite: ok
            });
          }
        ], "« Read each response before marking format and facts separately. » Une seule colonne « correct » mélangerait deux problèmes différents.");
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Une comparaison contrôlée",
      texte:
        "<p>Le workbook fait tourner 3 tâches × 2 répétitions sur chaque backend : <b>6 requêtes mesurées par backend, 12 résultats</b>. Mais une comparaison n'est honnête que si elle est contrôlée.</p>",
      objectif: "Cocher les règles du protocole.",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          question: "Lesquelles font partie du protocole du workbook ?",
          options: [
            "noter matériel, identifiant du modèle, température et limite de sortie",
            "lancer les requêtes une par une, un backend à la fois",
            "mettre à part la première requête (chargement, warm-up)",
            "garder les prompts fournis inchangés",
            "enregistrer les échecs au lieu de les remplacer en silence",
            "relancer automatiquement une requête ratée jusqu'à ce qu'elle passe",
            "lancer les deux backends en parallèle pour gagner du temps"
          ],
          bonnes: [0, 1, 2, 3, 4],
          explication: "Une relance est une nouvelle requête, avec un coût et un délai : on la note. En parallèle, les mesures de temps se perturbent.",
          surReussite: function () { api.valider("Mêmes prompts, une chose à la fois, tout noter — y compris les échecs."); }
        });
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Lire les temps",
      texte:
        "<p>Mesures inventées pour l'exercice (secondes, tâche de classification) :</p>" +
        "<table class='tableau'><tr><th>backend</th><th class='num'>warm-up</th><th class='num'>mesure 1</th><th class='num'>mesure 2</th></tr>" +
        "<tr><td>local (petit modèle)</td><td class='num'>4,2</td><td class='num'>0,9</td><td class='num'>0,8</td></tr>" +
        "<tr><td>hébergé</td><td class='num'>0,5</td><td class='num'>0,3</td><td class='num'>0,3</td></tr></table>",
      objectif: "Interpréter le warm-up et choisir la bonne mesure de vitesse.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.choix(b, {
              question: "Pourquoi le warm-up local prend-il 4,2 s ?",
              options: ["Il inclut le chargement du modèle et l'initialisation du runtime", "Le modèle réfléchit plus longtemps la première fois", "Le réseau est lent au premier appel"],
              bonne: 0,
              expliquer: ["Oui : « cold loading vs warm requests ». On le garde à part et on compare les requêtes chaudes.", "Non : la génération elle-même ne change pas.", "Non : un modèle local n'utilise pas le réseau pour générer."],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.associer(b, {
              consigne: "Quelle mesure répond à quelle question ?",
              categories: ["elapsed seconds", "output tokens / s", "time to first token"],
              items: [
                { texte: "Combien de temps l'utilisateur attend-il cette réponse complète ?", bonne: 0 },
                { texte: "À quelle vitesse le modèle génère-t-il ?", bonne: 1 },
                { texte: "Combien de temps avant que le texte commence à s'afficher (streaming) ?", bonne: 2 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.vraiFaux(b, {
              items: [
                { texte: "Le temps de bout en bout du modèle hébergé inclut le réseau et l'attente chez le fournisseur.", vrai: true },
                { texte: "On peut comparer directement les nombres de tokens de deux modèles qui ont des tokenizers différents.", vrai: false, explication: "« Token counts from different tokenizers are not interchangeable. »" }
              ],
              surReussite: ok
            });
          }
        ], "Comparer les requêtes chaudes, et dire quelle question chaque mesure éclaire.");
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Changer un seul réglage",
      texte:
        "<p>Dernière partie du workbook : choisir une tâche, <b>prédire</b> l'effet d'une limite de sortie plus petite, puis relancer deux fois avec <span class='mono'>--max-output 256</span>, modèle et prompt fixes. " +
        "On inspecte la durée, le <b>finish reason</b> et la sortie réelle.</p>",
      objectif: "Interpréter un finish reason, puis justifier la règle « un seul changement ».",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.choix(b, {
              question: "Une sortie se termine par finish_reason = \"length\" et le JSON s'arrête au milieu. Que s'est-il passé ?",
              options: ["La génération a été coupée par la limite de sortie : réponse incomplète, format invalide", "Le modèle a fini normalement", "Le fournisseur a refusé la requête"],
              bonne: 0,
              expliquer: ["Oui : la limite a coupé la sortie. Une réponse fluide mais tronquée ne passe pas json.loads.", "Non : une fin normale donne « stop ».", "Non : la requête a réussi, c'est la sortie qui est tronquée."],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Pourquoi ne pas changer le prompt en même temps que la limite ?",
              options: ["On ne saurait plus lequel des deux changements explique l'effet observé", "Le script l'interdit", "Ça coûte plus de tokens"],
              bonne: 0,
              expliquer: ["Oui : un facteur à la fois, sinon l'effet n'est pas attribuable.", "Non : techniquement on peut ; c'est une règle de méthode.", "Non : ce n'est pas la raison."],
              surReussite: ok
            });
          }
        ], "Prédire, changer un seul facteur, regarder finish reason et sortie réelle.");
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Défendre une recommandation",
      texte:
        "<p>Le workbook finit par une décision : « My recommended backend for this task », avec la <b>preuve</b> et la <b>limite</b> de la conclusion. " +
        "C'est aussi le principe 2 de la notation du dépôt : <b>choix du modèle justifié et configurable</b> (coût, latence, qualité, dans le README).</p>",
      objectif: "Choisir la limite honnête d'une conclusion tirée d'un petit benchmark.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.cocher(b, {
              question: "Pour Orbitra, quels compromis le workbook demande-t-il de peser entre local et hébergé ?",
              options: ["contrôle local des données", "temps d'attente", "ressources de la machine", "quota du fournisseur", "maintenance", "la couleur de l'interface"],
              bonnes: [0, 1, 2, 3, 4],
              explication: "« local control, waiting time, resources, quota and maintenance ».",
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Quelle phrase décrit honnêtement la portée de ta conclusion ?",
              options: [
                "« Sur cette tâche, avec ces modèles et cette machine, le backend X est le meilleur compromis ; ce n'est pas un classement général. »",
                "« Le modèle hébergé est meilleur que les modèles locaux. »",
                "« Le petit modèle est mauvais. »"
              ],
              bonne: 0,
              expliquer: ["Oui : « a tiny experiment supports a task-specific decision, not a universal ranking ». Et la taille et l'entraînement des modèles diffèrent : la comparaison n'isole pas le matériel seul.", "Trop général pour 12 mesures.", "Trop général, et sans preuve."],
              surReussite: ok
            });
          }
        ], "Recommandation + preuve + limite : c'est ce que le README du projet devra contenir pour le choix du modèle.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software",
    id: "tp2-benchmark",
    etapes: etapes,
    fin: {
      texte: "<p>À retenir du TP 2 :</p><ul>" +
        "<li>Une référence écrite avant le modèle ; format et faits jugés séparément.</li>" +
        "<li>Protocole contrôlé : prompts fixes, séquentiel, warm-up à part, échecs enregistrés, un seul facteur changé.</li>" +
        "<li>Trois mesures de vitesse, trois questions ; tokens non comparables entre tokenizers.</li>" +
        "<li>Une petite expérience soutient une décision pour une tâche — à écrire dans le README du projet.</li></ul>" +
        "<p>Sur ta machine : les trois tâches, deux fois, sur chaque backend (<span class='mono'>benchmark.py ollama</span> puis <span class='mono'>groq</span>), puis une tâche avec <span class='mono'>--max-output 256</span>.</p>",
      cartes: "s2-modeles"
    }
  });
})();
