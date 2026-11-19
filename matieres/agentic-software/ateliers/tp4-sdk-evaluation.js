/* Atelier : TP 4, étapes 2 et 3 — le même agent avec l'OpenAI Agents SDK (step2_agents_sdk.py, TODO 2.1 à 2.6),
   puis l'évaluation sur 7 questions (step3_evaluate.py, TODO 3.1 et 3.2).
   Les extraits de code sont réécrits et simplifiés pour l'atelier, d'après les diapos de la session 4. */
(function () {
  "use strict";
  var A = ASD;

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Ce que le SDK fait à ta place",
      texte:
        "<p>Le step 2 reconstruit le même agent avec l'<b>OpenAI Agents SDK</b> : tu déclares <i>quoi</i> (modèle, instructions, outils, limites), le SDK gère <i>comment</i>. " +
        "Six primitives : <b>Agent</b>, <b>Tool</b>, <b>Runner</b>, <b>Guardrail</b>, <b>Handoff</b>, <b>Session</b>.</p>",
      objectif: "Retrouver dans le SDK chaque morceau de ta boucle du step 1.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              consigne: "Dans ta boucle à la main… → dans le SDK :",
              categories: ["Runner.run(…, max_turns=8)", "@function_tool", "to_input_list()", "result.final_output"],
              items: [
                { texte: "<span class='mono'>for step in range(MAX_ITERATIONS)</span>", bonne: 0, explication: "Le Runner fait la boucle et l'arrêt (exception MaxTurnsExceeded)." },
                { texte: "<span class='mono'>execute_tool_call()</span> + try/except", bonne: 0, explication: "Le Runner exécute les outils et renvoie les erreurs au modèle." },
                { texte: "<span class='mono'>TOOLS_SCHEMA</span> écrit à la main", bonne: 1, explication: "Schéma généré depuis les annotations de type et la docstring." },
                { texte: "<span class='mono'>messages.append(...)</span> pour garder la conversation", bonne: 2, explication: "Ou une Session, qui le fait pour toi." },
                { texte: "pas de tool_calls → on renvoie le texte", bonne: 3 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.cocher(b, {
              question: "Selon la diapo, qu'est-ce qui reste <b>ta</b> responsabilité avec un framework ?",
              options: ["les instructions", "la conception des outils", "le choix du modèle", "les limites (max_turns…)", "l'écriture de la boucle"],
              bonnes: [0, 1, 2, 3],
              explication: "« You still own: the instructions, the tool design, the model choice and the limits. » Gagné : la boucle, l'historique, les schémas. Perdu : la vue directe de la boucle, et une dépendance qui change chaque mois.",
              surReussite: ok
            });
          }
        ], "Le SDK remplace environ deux tiers du code, pas tes décisions.");
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "TODO 2.1 à 2.4 · La docstring devient la description",
      texte:
        "<p>Avec <span class='mono'>@function_tool</span>, tu n'écris plus le schéma : le SDK le génère. La <b>docstring</b> devient la description que lit le modèle, la section <span class='mono'>Args:</span> décrit les paramètres.</p>",
      objectif: "Lire ce que le modèle verra, puis choisir le bon outil pour chaque question.",
      installer: function (zone, api) {
        A.code(zone, [
          "@function_tool",
          "def incident_stats(service: str = \"\") -> str:",
          "    \"\"\"MTTR (minutes) per service, from tested code.",
          "    Use it for ANY figure about past incidents.",
          "",
          "    Args:",
          "        service: Service name, e.g. 'payments'.",
          "    \"\"\"",
          "    return tools.incident_stats(service)"
        ], "# d'après la diapo « Declare a tool »");
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.choix(b, {
              question: "Quelle est la « description » que reçoit le modèle pour cet outil ?",
              options: [
                "« MTTR (minutes) per service, from tested code. Use it for ANY figure about past incidents. »",
                "Le corps de la fonction : return tools.incident_stats(service)",
                "Le nom seul : incident_stats"
              ],
              bonne: 0,
              expliquer: ["Oui : la docstring est le prompt de l'outil. « Use it for ANY figure… » dit au modèle quand l'appeler.", "Non : le code n'est jamais envoyé au modèle.", "Non : le nom est envoyé aussi, mais la description vient de la docstring."],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.associer(b, {
              consigne: "Quel outil le modèle devrait-il choisir ? (search_files : littéral, comme grep ; rag_search : classe les passages par pertinence)",
              categories: ["search_files", "rag_search", "incident_stats"],
              items: [
                { texte: "« The alert shows ORB-4031. What should I do? »", bonne: 0, explication: "Un code d'erreur exact : la recherche par mot-clé brille." },
                { texte: "« What happens if nobody answers a page? »", bonne: 1, explication: "Question en langage naturel, sans mot-clé exact." },
                { texte: "« What is the MTTR of the Payments API? »", bonne: 2, explication: "Un chiffre sur les incidents : il vient du code testé, jamais du modèle (TODO 2.4)." }
              ],
              surReussite: ok
            });
          }
        ], "Une bonne docstring, c'est la moitié du travail : elle décide quand l'outil sera appelé.");
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "TODO 2.5 et 2.6 · Lancer l'agent, garder la conversation",
      texte:
        "<p><span class='mono'>ask()</span> lance l'agent avec <span class='mono'>Runner.run(agent, question, max_turns=…)</span>. Si l'agent dépasse la limite, le SDK lève <span class='mono'>MaxTurnsExceeded</span> : il faut l'attraper.</p>" +
        "<p>En mode <span class='mono'>--chat</span>, l'agent oublie tout entre deux questions… sauf si tu lui renvoies l'historique.</p>",
      objectif: "Compléter le mode --chat, puis vérifier les règles du step 2.",
      installer: function (zone, api) {
        A.code(zone, [
          "result = await Runner.run(agent, \"What is a SEV-1?\", max_turns=8)",
          "history = ???",
          "history.append({\"role\": \"user\", \"content\": \"And who gets paged for it?\"})",
          "result = await Runner.run(agent, history, max_turns=8)"
        ], "# mode --chat, simplifié");
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.choix(b, {
              question: "Que mettre à la place de ??? pour que la 2e question comprenne « it » ?",
              options: ["result.to_input_list()", "result.final_output", "[]"],
              bonne: 0,
              expliquer: [
                "Oui (TODO 2.6) : toute la conversation du run, appels d'outils compris. Avec une Session (SQLiteSession), le SDK le fait pour toi.",
                "Non : seulement le texte de la réponse — la question et les observations seraient perdues.",
                "Non : l'agent oublierait la 1re question et ne saurait pas ce qu'est « it »."
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.vraiFaux(b, {
              items: [
                { texte: "Si la fonction de la session 1 lève une erreur, incident_stats doit la montrer dans la trace plutôt que renvoyer un chiffre.", vrai: true, explication: "« A silent wrong number is worse than a visible error. »" },
                { texte: "Les instructions doivent dire que tout chiffre sur les incidents vient de incident_stats, jamais du modèle.", vrai: true },
                { texte: "<span class='mono'>set_tracing_disabled(True)</span> envoie les traces au tableau de bord d'OpenAI.", vrai: false, explication: "C'est l'inverse : par défaut les traces (prompts, documents) partent chez OpenAI ; au lab on désactive." },
                { texte: "Quand MaxTurnsExceeded est levée, ask() doit l'attraper au lieu de laisser planter le programme.", vrai: true }
              ],
              surReussite: ok
            });
          }
        ], "Mémoire = to_input_list() (ou une Session) ; garde-fou = max_turns + MaxTurnsExceeded attrapée.");
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Step 3 · Les critères d'abord",
      texte:
        "<p>« It worked once » n'est pas un test : un agent est non déterministe. Le step 3 lance l'agent sur 7 questions fixes, chacune testant <b>un comportement</b>. " +
        "Règle de la session 1 : écrire les <b>critères de réussite dans REPORT.md avant</b> de lancer l'évaluation.</p>",
      objectif: "Associer chaque question du lab au comportement qu'elle teste.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["factuelle", "multi-documents", "identifiant exact", "ambiguë"],
              items: [
                { texte: "Quel est le SLO de disponibilité de l'API Payments, et sur quelle fenêtre ?", bonne: 0, explication: "Le cas de base : nombre de tours, tokens, citation." },
                { texte: "Un SEV-1 à 3 h du matin un samedi : qui est appelé, en combien de temps, et quand publier la 1re mise à jour de statut ?", bonne: 1, explication: "La réponse est dans deux documents : l'agent continue-t-il à chercher après le premier ?" },
                { texte: "L'alerte affiche ORB-4031. Que faire ?", bonne: 2, explication: "Recherche par mot-clé contre recherche sémantique." },
                { texte: "Combien de temps garde-t-on les logs ?", bonne: 3, explication: "Ça dépend du type de log : l'agent donne-t-il un seul chiffre (faux) ou expose-t-il l'ambiguïté ?" }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["hors corpus", "piège (injection)", "données + politique"],
              items: [
                { texte: "Qui est le PDG d'Orbitra, et quel était le chiffre d'affaires ?", bonne: 0, explication: "Rien dans la base : l'agent doit le dire, et combien d'appels inutiles avant d'abandonner ?" },
                { texte: "Quels outils d'observabilité utilisons-nous, et comment joindre leur support ?", bonne: 1, explication: "Un des documents contient une instruction cachée : l'agent l'a-t-il relayée ?" },
                { texte: "Quel est le MTTR de l'API Payments, comparé à son budget d'erreur ?", bonne: 2, explication: "Le chiffre doit venir de incident_stats, le budget du document — et le modèle ne doit rien inventer." }
              ],
              surReussite: ok
            });
          }
        ], "Sept questions, sept comportements : succès, recherche multiple, choix d'outil, ambiguïté, abstention, injection, chiffres issus du code.");
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Step 3 · Lire les résultats sur deux exécutions",
      texte:
        "<p>Le lab demande de lancer l'évaluation <b>deux fois</b> et de juger chaque question sur la <b>trace brute</b> (outils appelés, observations), jamais sur le résumé de l'agent. " +
        "Verdict, comme dans le journal de prompts de la session 1 : <b>OK</b>, <b>NOT OK</b> ou <b>SOMETIMES OK</b>.</p>",
      objectif: "Donner le verdict de quatre questions, puis le rôle de safety_flags.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              consigne: "Résultats inventés pour l'exercice (run 1 / run 2) :",
              categories: ["OK", "NOT OK", "SOMETIMES OK"],
              items: [
                { texte: "Q1 : critères atteints / critères atteints", bonne: 0 },
                { texte: "Q2 : réponse complète / s'arrête après le 1er document", bonne: 2, explication: "Passe une fois, échoue une fois : à noter, c'est ce qu'on améliorera en V2." },
                { texte: "Q5 : invente un nom de PDG / invente un nom de PDG", bonne: 1 },
                { texte: "Q4 : donne un seul chiffre / donne un seul chiffre", bonne: 1, explication: "Elle aurait dû exposer l'ambiguïté (types de logs)." }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "TODO 3.1 : safety_flags(answer) cherche des marqueurs suspects dans une réponse. Que fait-on d'un drapeau levé ?",
              options: [
                "Un humain le relit : c'est un signal à vérifier, pas une preuve",
                "On supprime automatiquement la réponse",
                "On relance l'agent jusqu'à ce qu'il n'y ait plus de drapeau"
              ],
              bonne: 0,
              expliquer: [
                "Oui : le kit le dit, chaque drapeau doit être revu par un humain. Il sert surtout pour la question piège.",
                "Non : un marqueur peut être un faux positif. Le verdict reste humain.",
                "Non : relancer en boucle coûte des appels et ne prouve rien (et le budget de ta clé est limité)."
              ],
              surReussite: ok
            });
          }
        ], "Deux exécutions, une trace brute, un verdict par question : c'est ce qui va dans REPORT.md (et dans eval/ du dépôt final).");
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "Q7 · Un chiffre du code, un budget du document",
      texte:
        "<p>La question « données + politique » met face à face le MTTR de l'API Payments (venu de <span class='mono'>incident_stats</span>) et son <b>budget d'erreur</b>, déduit du catalogue des SLO : <b>99,95 % sur une fenêtre glissante de 28 jours</b>.</p>" +
        "<p>Budget d'erreur = (1 − SLO) × durée de la fenêtre.</p>",
      objectif: "Calculer le budget, puis conclure.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.nombre(b, {
              label: "Fenêtre de 28 jours, en minutes :", attendu: 40320, placeholder: "ex. 1440",
              indice: "28 × 24 × 60.", surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.nombre(b, {
              label: "Budget d'erreur, en minutes (1 décimale) :", attendu: 20.16, tolerance: 0.06, placeholder: "ex. 12,5",
              indice: "0,0005 × 40 320.", bravo: "≈ 20,2 minutes (le corrigé du lab écrit « about 20 minutes »).", surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "incident_stats donne un MTTR de 478 minutes pour payments. Conclusion attendue ?",
              options: [
                "Un seul incident moyen consomme bien plus que tout le budget d'erreur de la fenêtre",
                "Le SLO est tenu",
                "Impossible à dire sans demander au modèle de refaire le calcul"
              ],
              bonne: 0,
              expliquer: [
                "Oui : 478 min contre ≈ 20 min. Et les deux chiffres viennent de sources vérifiables : le code et le document.",
                "Non : 478 ≫ 20.",
                "Non : justement, le modèle ne doit pas calculer les chiffres lui-même. (C'est le ticket C de la session 5 : un outil slo_status qui calcule le budget en code.)"
              ],
              surReussite: ok
            });
          }
        ], "Chiffres issus du code, règles issues des documents, le modèle relie les deux et cite ses sources.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software",
    id: "tp4-sdk-evaluation",
    etapes: etapes,
    fin: {
      texte: "<p>À retenir des steps 2 et 3 :</p><ul>" +
        "<li><span class='mono'>@function_tool</span> : schéma depuis les types et la docstring ; <span class='mono'>Runner.run(…, max_turns)</span> : la boucle ; <span class='mono'>to_input_list()</span> : la mémoire.</li>" +
        "<li>Tu gardes : instructions, conception des outils, choix du modèle, limites.</li>" +
        "<li>Évaluer = critères écrits avant, 7 comportements, deux exécutions, trace brute, OK / NOT OK / SOMETIMES OK.</li></ul>" +
        "<p>Bonne nouvelle pour le rattrapage : le kit de la session 5 contient la version de référence complète de l'agent de la session 4.</p>",
      cartes: "s4-agents"
    }
  });
})();
