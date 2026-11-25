/* Leçon : Workflow ou agent ? (session 4, parties 3.3 « With several agents »).
   Fil rouge : la question de la démo « A SEV-1 hits the Payments API at 3 a.m. on a Saturday.
   Who gets paged, and when is the first status update due? ». */
(function () {
  "use strict";
  var A = ASD;
  var Q = "A SEV-1 hits the Payments API at 3 a.m. on a Saturday. Who gets paged, and when is the first status update due?";

  var etapes = [
    {
      titre: "Même question, trois systèmes",
      texte: "<p>La démo du cours pose une question dont la réponse est répartie sur <b>deux documents</b> (la politique d'astreinte, puis la réponse aux incidents) :</p><p class='mono'>« " + Q + " »</p>",
      objectif: "Associer chaque comportement à son système, puis dire qui a ouvert le 2e document.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["LLM seul", "pipeline RAG", "agent"],
              items: [
                { texte: "Une réponse plausible, sans source : il ne connaît pas les règles d'Orbitra.", bonne: 0 },
                { texte: "Retrouve les top-k passages une seule fois : souvent la moitié de la réponse.", bonne: 1 },
                { texte: "Cherche, lit, cherche encore dans un 2e document, puis répond avec ses sources.", bonne: 2 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Qui a décidé d'ouvrir le 2e document ?",
              options: ["le modèle, à l'exécution", "le développeur, dans le code", "l'utilisateur"],
              bonne: 0,
              expliquer: ["Oui : « That is what makes it an agent. »", "Non : le code ne prévoit aucune 2e recherche ; il fournit des outils et une boucle.", "Non : il n'a posé qu'une question."],
              surReussite: ok
            });
          }
        ], "Un agent décide de ses étapes ; un pipeline les suit.");
      }
    },
    {
      titre: "Qui écrit le flot de contrôle ?",
      texte: "<p><b>Workflow</b> : des LLM et des outils suivent des chemins prédéfinis que <b>tu</b> écris. <b>Agent</b> : le LLM dirige son propre processus et ses outils, étape par étape.</p>",
      objectif: "Ranger chaque propriété ou exemple.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["workflow", "agent"],
          items: [
            { texte: "prévisible, testable, moins cher", bonne: 0 },
            { texte: "flexible pour les tâches ouvertes, mais plus lent, plus cher, plus dur à tester", bonne: 1 },
            { texte: "ton prompt chaining de la session 1, exécuté à la main", bonne: 0 },
            { texte: "un pipeline RAG classique", bonne: 0 },
            { texte: "Claude Code", bonne: 1 }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Cinq patrons de workflow",
      texte: "<p>Chaque patron tient en quelques dizaines de lignes de code. Le 6e bloc, l'agent autonome, est une boucle avec outils jusqu'à la fin ou l'arrêt.</p>",
      objectif: "Associer chaque exemple du cours à son patron.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["chaining", "routing", "parallelization", "orchestrator-workers", "evaluator-optimizer"],
          items: [
            { texte: "brouillon → vérification → traduction (étapes fixes, contrôles entre elles)", bonne: 0 },
            { texte: "trier les tickets par catégorie, puis chemin spécialisé", bonne: 1 },
            { texte: "réponse et vérification de garde-fou côte à côte", bonne: 2 },
            { texte: "un LLM découpe un changement multi-fichiers à l'exécution et délègue", bonne: 3 },
            { texte: "l'un génère, l'autre critique, en boucle (traduction, relecture)", bonne: 4 }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "La décision de l'architecte",
      texte: "<p>« Start with the simplest thing that works. » Les agents échangent latence et coût contre de la flexibilité : n'ajouter de l'autonomie que si plus simple est <b>mesurablement</b> insuffisant.</p>",
      objectif: "Choisir l'architecture pour quatre besoins d'Orbitra.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["workflow", "agent", "workflow + approbation", "pas d'agent"],
          items: [
            { texte: "Résumer chaque incident puis le traduire : étapes connues d'avance, coût prévisible.", bonne: 0 },
            { texte: "Diagnostiquer une alerte inconnue : nombre d'étapes imprévisible.", bonne: 1 },
            { texte: "Réveiller l'astreinte : une erreur coûteuse et irréversible.", bonne: 2 },
            { texte: "« Quel est le SLO de l'API Payments ? » : un appel au LLM + une recherche suffit.", bonne: 3 }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Plusieurs agents ?",
      texte: "<div class='encadre'><span class='titre-encadre'>Multi-agent system</span>Plusieurs agents, chacun avec ses instructions, ses outils et son contexte, qui se délèguent le travail. Pourquoi : spécialisation, contextes séparés, travail en parallèle.</div>",
      objectif: "Mesurer le coût, puis retenir la règle.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.cocher(b, {
              question: "Ce que coûte le multi-agents, selon la diapo :",
              options: ["tokens × N", "erreurs qui se propagent en cascade", "traces dispersées entre les agents", "plus besoin de garde-fous"],
              bonnes: [0, 1, 2],
              explication: "Chaque agent a son propre contexte, donc ses propres tokens.",
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "La règle du cours :",
              options: ["d'abord donner de meilleurs outils à un seul agent ; découper quand ses instructions ou son contexte ne tiennent plus", "un agent par outil", "toujours un manager au-dessus"],
              bonne: 0,
              surReussite: ok
            });
          }
        ], "« Start with one agent and better tools. »");
      }
    },
    {
      titre: "Handoff ou agent comme outil",
      texte: "<p>Deux façons d'orchestrer plusieurs agents dans l'Agents SDK. Avec un <b>handoff</b>, la conversation passe au spécialiste. Avec <b>as_tool</b>, le spécialiste répond au manager comme une fonction.</p>",
      objectif: "Ranger chaque élément.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["handoff", "agent comme outil"],
          items: [
            { texte: "<span class='mono'>Agent(name=\"Triage\", handoffs=[docs_agent, stats_agent])</span>", bonne: 0 },
            { texte: "<span class='mono'>tools=[docs_agent.as_tool(tool_name=\"ask_docs\", …)]</span>", bonne: 1 },
            { texte: "le spécialiste prend la main et répond à l'utilisateur ; <span class='mono'>result.last_agent</span> est lui", bonne: 0 },
            { texte: "le manager garde le contrôle et reçoit la réponse", bonne: 1 }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Les garde-fous de la boucle",
      texte: "<p>« From production » : six garde-fous, pas optionnels. Le lab en met quatre en place (max turns, traces, coût par question, validation des arguments) ; la session 6 approfondit.</p>",
      objectif: "Associer chaque incident au garde-fou qui l'aurait évité.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["max turns", "timeouts", "tracer chaque appel"],
              items: [
                { texte: "L'agent rappelle sans fin un outil en erreur.", bonne: 0, explication: "Une boucle sans fin, c'est un bug avec une facture." },
                { texte: "Un outil met deux minutes à répondre ; l'utilisateur attend.", bonne: 1, explication: "Par appel d'outil et par question : échouer vite, et le dire." },
                { texte: "La réponse est fausse et personne ne sait quel outil a renvoyé quoi.", bonne: 2 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["coût par question", "valider les arguments", "approbation humaine"],
              items: [
                { texte: "La facture du mois surprend tout le monde.", bonne: 0, explication: "Appels × tokens, mesuré dès le premier jour." },
                { texte: "Le modèle demande un chemin hors de docs/.", bonne: 1, explication: "Le modèle est un appelant non fiable." },
                { texte: "L'agent s'apprête à supprimer une règle d'alerte.", bonne: 2 }
              ],
              surReussite: ok
            });
          }
        ], "Max turns, timeouts, traces, coût, validation, approbation : le principe 6 de la notation du dépôt.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software", id: "workflow-ou-agent", etapes: etapes,
    fin: { texte: "<p>Commencer par le plus simple qui marche : pas d'agent, puis un workflow, puis un agent ; un seul agent avec de meilleurs outils avant plusieurs. Et toujours des garde-fous sur la boucle.</p>", cartes: "s4-agents" }
  });
})();
