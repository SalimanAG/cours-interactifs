/* Leçon : La boucle d'agent (session 4, partie 01 « Anatomy of an agent »).
   Fil rouge : la question du lab « The alert shows ORB-4031. What should I do? ».
   Les mécanismes de code (schémas, tool_call_id, read_file) sont dans l'atelier TP 4 step 1 ;
   ici : ce qu'est un agent, de quoi il est fait, comment il décide et se souvient. */
(function () {
  "use strict";
  var A = ASD;
  var Q = "The alert shows ORB-4031. What should I do?";

  var etapes = [
    {
      titre: "Pipeline ou agent ?",
      texte:
        "<p>Le fil rouge de la leçon : <span class='mono'>« " + Q + " »</span>.</p>" +
        "<p>En session 3, la recherche était un <b>pipeline</b> : retrieve → augment → generate, les mêmes étapes dans le même ordre pour chaque question. " +
        "En session 4, c'est un <b>agent</b> : un système qui <b>décide</b>.</p>",
      objectif: "Ranger chaque description du côté pipeline ou du côté agent.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["pipeline", "agent"],
          items: [
            { texte: "<span class='mono'>answer = llm(question + top_k(question))</span>", bonne: 0 },
            { texte: "<span class='mono'>while not done: think → act → observe</span>", bonne: 1 },
            { texte: "Les mêmes étapes, dans le même ordre, pour chaque question.", bonne: 0 },
            { texte: "Choisit quel outil appeler, avec quels arguments, combien de fois, et quand s'arrêter.", bonne: 1 }
          ],
          surReussite: function () { api.valider("La recherche RAG et le module de la session 1 deviennent des outils, et c'est le modèle qui décide quand s'en servir."); }
        });
      }
    },
    {
      titre: "Définition d'un agent",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Agent (diapo « What is an agent? »)</span>Une application qui poursuit un <b>but</b> en <b>observant</b> son environnement et en <b>agissant</b> dessus avec les <b>outils</b> à sa disposition.</div>",
      objectif: "Cocher les trois traits que le cours donne à un agent.",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          question: "Quels traits le cours associe-t-il à un agent ?",
          options: ["autonome : agit sans humain à chaque étape, une fois le but donné", "proactif : raisonne sur la suite, même sans instruction explicite", "utilise des outils : va au-delà de ce que sait le modèle", "déterministe : même entrée, même trace", "toujours composé de plusieurs agents"],
          bonnes: [0, 1, 2],
          explication: "Autonomous, proactive, tool-using. Un agent n'est pas déterministe (d'où l'évaluation sur deux exécutions), et un seul agent suffit souvent.",
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Trois composants : modèle, outils, orchestration",
      texte: "<p>L'architecture cognitive du cours a trois blocs. Le <b>modèle</b> est le décideur central ; les <b>outils</b> le relient au monde ; l'<b>orchestration</b> porte tout le reste.</p>",
      objectif: "Placer chaque pièce de l'agent du lab dans son bloc.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["modèle", "outils", "orchestration"],
          items: [
            { texte: "le décideur central", bonne: 0 },
            { texte: "search_files, read_file, rag_search, incident_stats", bonne: 1 },
            { texte: "le profil, les objectifs et les instructions (le prompt système)", bonne: 2 },
            { texte: "la mémoire, court et long terme", bonne: 2 },
            { texte: "le raisonnement et la planification (ReAct…)", bonne: 2 }
          ],
          surReussite: function () { api.valider("Un agent = un modèle + ce qui l'entoure."); }
        });
      }
    },
    {
      titre: "Un modèle seul, ou un agent ?",
      texte: "<p>Sans outils, le modèle ne connaît rien d'Orbitra : face à ORB-4031, il ne peut produire qu'une réponse plausible, sans source.</p>",
      objectif: "Associer chaque ligne du tableau « Models vs agents » à sa colonne.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["modèle", "agent"],
          items: [
            { texte: "Connaissance limitée aux données d'entraînement.", bonne: 0 },
            { texte: "Connaissance étendue par les outils, à l'exécution.", bonne: 1 },
            { texte: "Une inférence par requête, pas de session.", bonne: 0 },
            { texte: "Gère l'historique sur plusieurs tours.", bonne: 1 },
            { texte: "Logique : ce qu'on met dans le prompt.", bonne: 0 },
            { texte: "Logique : une boucle de raisonnement (ReAct, CoT…) dans l'orchestration.", bonne: 1 }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Planifier : CoT, ReAct, ToT",
      texte: "<p>La planification, c'est la façon dont l'agent choisit sa prochaine étape. En session 1, tu l'as fait faire par prompt ; ici, elle tourne en boucle. Voici la trace de notre question :</p>",
      objectif: "Reconnaître le style de chaque trace, puis dire où vit la planification.",
      installer: function (zone, api) {
        var t = new TraceAgent(zone, { titre: "trace illustrative (diapo « ReAct: you prompted it, now you code it »)" });
        t.dessiner([
          { role: "user", texte: Q },
          { role: "assistant", texte: "Thought: an error code, exact search first.", appels: [{ nom: "search_files", args: { query: "ORB-4031" } }] },
          { role: "tool", texte: "runbook-payments-api.md:5: ## Error ORB-4031 …" },
          { role: "assistant", appels: [{ nom: "read_file", args: { path: "runbook-payments-api.md" } }] },
          { role: "tool", texte: "# Runbook — Payments API …" },
          { role: "final", texte: "Payment provider timeout: check the provider status, then fail over … Sources: runbook-payments-api.md" }
        ], { resume: false });
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["Chain-of-Thought", "ReAct", "Tree-of-Thoughts"],
              items: [
                { texte: "La trace ci-dessus : pensée, action, observation, puis réponse.", bonne: 1 },
                { texte: "« 1. 43 200 min. 2. Budget 43,2 min. 3. Panne 46 min. 4. SLO manqué. » — sans outil.", bonne: 0 },
                { texte: "« Piste A… piste B… on évalue, on abandonne B, on revient à A. » — coûteux.", bonne: 2 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Où vit la planification ?",
              options: ["dans l'orchestration : le modèle propose, la logique de boucle décide (continuer ou s'arrêter)", "dans les poids du modèle", "dans les outils"],
              bonne: 0,
              expliquer: ["Oui (diapo « Planning »).", "Non : le modèle propose seulement l'étape suivante.", "Non : les outils exécutent, ils ne décident pas."],
              surReussite: ok
            });
          }
        ], "CoT : raisonner avant de répondre. ReAct : raisonnement entrecoupé d'actions. ToT : plusieurs branches.");
      }
    },
    {
      titre: "Le modèle propose, la boucle décide",
      texte: "<p>À chaque tour, le modèle renvoie soit une demande d'outil, soit du texte. C'est le code de la boucle qui tranche. La boucle du lab a <span class='mono'>MAX_ITERATIONS = 8</span>.</p>",
      objectif: "Dire ce que fait la boucle pour chaque proposition.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["exécuter, continuer", "refuser l'appel", "s'arrêter : réponse", "s'arrêter : limite"],
          items: [
            { texte: "Tour 2 : le modèle demande <span class='mono'>read_file(\"runbook-payments-api.md\")</span>.", bonne: 0 },
            { texte: "Le modèle demande <span class='mono'>read_file(\"../.env\")</span>.", bonne: 1, explication: "L'outil renvoie une erreur : le chemin sort de docs/." },
            { texte: "Le modèle répond par du texte, sans demande d'outil.", bonne: 2 },
            { texte: "8e tour terminé, toujours pas de réponse.", bonne: 3, explication: "« An agent that never stops is a bug that costs money. »" }
          ],
          surReussite: function () { api.valider("Le modèle choisit quoi faire ; ton code contrôle si ça s'exécute et quand ça s'arrête."); }
        });
      }
    },
    {
      titre: "La mémoire, c'est ce qu'on remet dans le contexte",
      texte: "<div class='encadre'><span class='titre-encadre'>Memory</span>L'information que l'application renvoie au modèle pour qu'il utilise les tours précédents ou des connaissances stockées. <b>Le modèle lui-même ne se souvient de rien.</b></div>",
      objectif: "Ranger chaque élément en mémoire à court ou à long terme.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["court terme", "long terme"],
          items: [
            { texte: "<span class='mono'>messages.append(...)</span> : la liste renvoyée à chaque tour", bonne: 0 },
            { texte: "<span class='mono'>rag_search(query)</span>", bonne: 1, explication: "Ton rag_search est de la mémoire à long terme… et c'est un outil." },
            { texte: "Grandit à chaque tour : coût et latence augmentent ; tronquer ou résumer.", bonne: 0 },
            { texte: "Un store externe : documents, sessions passées, préférences.", bonne: 1 }
          ],
          surReussite: function () { api.valider("Session 1 l'appelait context engineering : ce qui entre dans la fenêtre, c'est ton travail."); }
        });
      }
    },
    {
      titre: "Trois idées à garder",
      texte: "<p>Dernier écran de la session 4 : « an agent is a loop », « the model proposes », « guard the loop ». Et en session 5 : Claude Code a la même anatomie que ton agent.</p>",
      objectif: "Vérifier les idées clés.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Un agent, c'est un modèle, des outils et une boucle qui décide : ça tient sur un écran.", vrai: true },
            { texte: "Le modèle exécute lui-même les outils qu'il choisit.", vrai: false, explication: "Il propose ; ton code exécute. Chaque outil est une capacité que tu accordes." },
            { texte: "Max turns, approbations, traces et coût se mettent en place dès le premier jour.", vrai: true },
            { texte: "Claude Code est un agent : modèle, outils (Read, Grep, Edit, Bash, MCP…), boucle et garde-fous (permissions).", vrai: true }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software", id: "boucle-agent", etapes: etapes,
    fin: { texte: "<p>Pour le code de la boucle (schémas, tool_call_id, read_file confiné), fais l'atelier <b>TP 4 · La boucle d'agent à la main</b>.</p>", cartes: "s4-agents" }
  });
})();
