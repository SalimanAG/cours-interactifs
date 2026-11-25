/* Leçon : Du prompt vague au prompt vérifiable (session 1, partie 04 « Prompt engineering »).
   Fil rouge : la diapo « Before and after » — « Fix this code. » sur un module d'ops en Python 3.12. */
(function () {
  "use strict";
  var A = ASD;

  var etapes = [
    {
      titre: "« Fix this code. »",
      texte:
        "<p>Fil rouge : on envoie à Claude un module d'ops et ce seul prompt :</p><pre class='code'>Fix this code.\n{code}</pre>" +
        "<p>Résultat raconté par la diapo : Claude réécrit tout le module, renomme deux fonctions et répond « it should work now ».</p>",
      objectif: "Repérer ce qui ne va pas dans ce résultat.",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          question: "Qu'est-ce qui pose problème ?",
          options: ["rien n'est vérifiable : pas de bug nommé, pas de test", "des fonctions publiques ont été renommées", "« it should work now » n'est pas une preuve", "la réponse est trop courte"],
          bonnes: [0, 1, 2],
          explication: "« Nothing you can check. » Le prompt ne disait ni quoi chercher, ni quoi garder, ni quoi rendre.",
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Les critères avant le prompt",
      texte: "<p>Sans critères de réussite et sans test, impossible de savoir si un nouveau prompt est meilleur.</p>",
      objectif: "Ordonner la méthode, puis trier les critères.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.ordonner(b, { items: ["Définir le succès (mesurable)", "Construire un test (dont des cas limites)", "Écrire un premier brouillon, puis itérer"], separateur: "→", surReussite: ok });
          },
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["mesurable", "pas mesurable"],
              items: [
                { texte: "JSON valide", bonne: 0 }, { texte: "le bon label", bonne: 0 }, { texte: "moins de 100 mots", bonne: 0 },
                { texte: "une réponse de qualité", bonne: 1 }, { texte: "un code propre", bonne: 1 }
              ],
              surReussite: ok
            });
          }
        ], "Critères, test, puis prompt.");
      }
    },
    {
      titre: "L'anatomie d'un bon prompt",
      texte: "<p>Six parties ; les balises XML sont la recommandation d'Anthropic pour Claude (tout délimiteur clair fonctionne).</p>",
      objectif: "Associer chaque ligne de l'exemple du cours à sa partie.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["role", "context", "task", "example", "input", "output"],
          items: [
            { texte: "<span class='mono'>You are a senior Python reviewer.</span>", bonne: 0 },
            { texte: "<span class='mono'>This function runs in our CI pipeline on Python 3.12.</span>", bonne: 1 },
            { texte: "<span class='mono'>Find bugs that would fail at runtime.</span>", bonne: 2 },
            { texte: "<span class='mono'>…one input and its expected output…</span>", bonne: 3 },
            { texte: "<span class='mono'>{code}</span>", bonne: 4 },
            { texte: "<span class='mono'>Return only JSON: [{\"line\": int, \"issue\": str, \"fix\": str}]</span>", bonne: 5 }
          ],
          surReussite: function () { api.valider("Rôle, contexte, une tâche avec un verbe d'action, des exemples, l'entrée délimitée, le format de sortie."); }
        });
      }
    },
    {
      titre: "Le test du nouveau collègue",
      texte: "<p>Traite le modèle comme un collègue brillant arrivé ce matin, qui ne sait rien du projet. <b>Règle d'or</b> : montre ton prompt à un collègue sans contexte ; s'il est perdu, le modèle aussi.</p>",
      objectif: "Cocher les conseils du cours.",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          question: "Lesquels font partie de « Be clear and direct » ?",
          options: ["dire à quoi sert la sortie et qui la lira", "dire à quoi ressemble « fini » : longueur, format, niveau de détail", "numéroter les étapes quand l'ordre compte", "séparer les données des instructions", "expliquer pourquoi une règle existe", "écrire le plus court possible"],
          bonnes: [0, 1, 2, 3, 4],
          explication: "« Explain why a rule exists: the model generalises from the reason. »",
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Le prompt « after »",
      texte: "<p>La version réécrite de la diapo :</p>",
      objectif: "Dire ce qui rend ce résultat vérifiable.",
      installer: function (zone, api) {
        A.code(zone, [
          "<context>Ops module, Python 3.12, used by the monthly incident report.</context>",
          "<task>Find bugs that give a wrong number without raising an error.</task>",
          "<constraints>Keep public function names.</constraints>",
          "<output>For each bug: line, root cause, minimal fix, one test.</output>",
          "<code>{code}</code>"
        ]);
        Exercices.choix(zone, {
          question: "Résultat : une courte liste avec numéros de ligne, un correctif de deux lignes et un test par bug. Pourquoi est-ce mieux ?",
          options: ["chaque affirmation peut être vérifiée : ligne, cause, test", "c'est plus long", "le modèle est plus sûr de lui"],
          bonne: 0,
          expliquer: ["Oui : « Every claim can be checked. » Même modèle, prompt différent.", "Non : c'est même plus court.", "Non : l'assurance ne prouve rien (fluent ≠ true)."],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Choisir la technique",
      texte: "<p>Cinq techniques vues en détail : zero-shot, few-shot, chain of thought, ReAct, prompt chaining.</p>",
      objectif: "Associer chaque situation à la technique qui convient.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["zero-shot", "few-shot", "chain of thought", "ReAct", "chaining"],
          items: [
            { texte: "Classer un ticket en INCIDENT, REQUEST ou QUESTION : tâche courante, catégories évidentes.", bonne: 0 },
            { texte: "Extraire des champs d'alerte en JSON : le format est plus facile à montrer qu'à décrire.", bonne: 1 },
            { texte: "Le SLO de 99,9 % est-il tenu avec 46 min de panne ? Logique en plusieurs étapes.", bonne: 2 },
            { texte: "Pourquoi l'export de cette nuit a échoué ? Il faut des données fraîches (statut du job, changements).", bonne: 3 },
            { texte: "Analyser, planifier, exécuter, relire un refactoring, en vérifiant chaque maillon.", bonne: 4 }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Sept familles, un verbe chacune",
      texte: "<p>Le cours range les 13 techniques en 7 familles : Formulate, Show, Reason, Decompose, Act, Contextualise, Verify.</p>",
      objectif: "Ranger sept techniques dans leur famille.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["Formulate", "Show", "Reason", "Decompose"],
              items: [
                { texte: "structured output", bonne: 0 }, { texte: "few-shot", bonne: 1 },
                { texte: "self-consistency", bonne: 2 }, { texte: "least-to-most", bonne: 3 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["Act", "Contextualise", "Verify"],
              items: [
                { texte: "function calling", bonne: 0 }, { texte: "grounding / RAG", bonne: 1 }, { texte: "chain-of-verification", bonne: 2 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Laquelle coûte le plus cher ?",
              options: ["self-consistency (vote sur N exécutions)", "zero-shot", "role / system prompt"], bonne: 0,
              surReussite: ok
            });
          }
        ], "Coût élevé : self-consistency (N×) et tree of thoughts.");
      }
    },
    {
      titre: "Réduire les hallucinations",
      texte: "<p>Aucune technique ne garantit la factualité : elles réduisent le risque et rendent les erreurs plus faciles à attraper. Ensuite, le cours passe du <b>prompt</b> engineering au <b>context</b> engineering.</p>",
      objectif: "Cocher les quatre parades, puis définir le context engineering.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.cocher(b, {
              question: "Les quatre parades du cours :",
              options: ["autoriser « je ne sais pas »", "citer d'abord, répondre ensuite", "restreindre aux documents fournis", "vérifier : sources, plusieurs exécutions", "demander au modèle d'être très sûr de lui"],
              bonnes: [0, 1, 2, 3], surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Le context engineering cherche…",
              options: ["le plus petit ensemble de tokens à fort signal qui produit le comportement voulu", "les mots magiques qui font marcher un prompt", "le plus de contexte possible"],
              bonne: 0,
              expliquer: ["Oui : le contexte est un budget d'attention fini. Les sessions 3 à 5 en sont la pratique.", "Non : « method beats magic words ».", "Non : chaque token est en concurrence pour l'attention."],
              surReussite: ok
            });
          }
        ], "Iterate. Measure. Document.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software", id: "prompt-verifiable", etapes: etapes,
    fin: { texte: "<p>Trois choses à garder : le prompt est le monde du modèle ; la méthode bat les mots magiques ; trust, but verify. Pour le projet : prompts système dans des fichiers versionnés (principe 1).</p>", cartes: "s1-bases-prompts" }
  });
})();
