/* Atelier : TP 1 — Legacy rescue (session 1, dans Claude.ai) : critères de réussite, tests, chaîne de
   raisonnement sur un chiffre faux, prompt chaining pour refactorer, règles du lab.
   Le module du lab n'est pas recopié : l'atelier utilise une petite fonction RÉÉCRITE qui reproduit
   le même type de bug (un except nu qui transforme une erreur en 0). */
(function () {
  "use strict";
  var A = ASD;

  var CODE = [
    "def duree_minutes(incident):",
    "    try:",
    "        fin = parse(incident[\"resolved_at\"])",
    "        debut = parse(incident[\"opened_at\"])",
    "        return (fin - debut).total_seconds() / 60",
    "    except:",
    "        return 0",
    "",
    "def mttr(incidents):",
    "    return round(sum(duree_minutes(i) for i in incidents) / len(incidents), 1)"
  ];
  var DONNEES = [
    '{"id": "INC-1", "opened_at": "2026-09-02T10:00:00Z", "resolved_at": "2026-09-02T11:00:00Z"}',
    '{"id": "INC-2", "opened_at": "2026-09-05T08:00:00Z", "resolved_at": "2026-09-05T10:00:00Z"}',
    '{"id": "INC-3", "opened_at": "2026-09-09T14:00:00",  "resolved_at": "2026-09-09T15:30:00Z"}'
  ];

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Des critères avant le prompt",
      texte:
        "<p>Le lab de la session 1 se fait dans Claude.ai : on attache le module, les données et les tests, et Claude exécute le code. Ta tâche : décider quoi demander, et <b>vérifier chaque résultat</b>.</p>" +
        "<p>Étape 1 du lab : écrire les <b>critères de réussite</b> dans le journal de prompts, <i>puis</i> un prompt zero-shot qui demande d'expliquer le module et ses risques.</p>",
      objectif: "Garder les critères vérifiables.",
      installer: function (zone, api) {
        Exercices.cocher(zone, {
          question: "Lesquels sont de bons critères de réussite pour « expliquer le module » ?",
          options: [
            "l'explication liste chaque fonction publique, ses entrées et ses sorties",
            "elle cite au moins deux risques",
            "elle est claire et intéressante",
            "Claude dit qu'il a bien compris"
          ],
          bonnes: [0, 1],
          explication: "Un critère se vérifie sur la réponse (c'est l'exemple du lab). « Clair » n'est pas mesurable, et l'avis de Claude sur lui-même n'est pas une preuve.",
          surReussite: function () { api.valider("Définir le succès, construire un test, puis seulement écrire le prompt (diapo « Start with success criteria »)."); }
        });
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le chiffre est faux, et rien ne plante",
      texte:
        "<p>Version réécrite pour l'atelier : une fonction de durée, puis le MTTR (temps moyen de résolution, en minutes).</p>",
      objectif: "Calculer le MTTR attendu, puis celui que renvoie le code.",
      installer: function (zone, api) {
        A.code(zone, CODE, "# réécrit pour l'atelier");
        A.code(zone, DONNEES, "# trois incidents résolus");
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "MTTR attendu (minutes) :", attendu: 90, placeholder: "ex. 45", indice: "Durées 60, 120 et 90 minutes.", surReussite: ok }); },
          function (b, ok) {
            Exercices.nombre(b, { label: "MTTR renvoyé par le code :", attendu: 60, placeholder: "ex. 45",
              indice: "Regarde INC-3 : sa date d'ouverture n'a pas de « Z ». Soustraire une date sans fuseau d'une date avec fuseau lève une TypeError en Python.", surReussite: ok });
          }
        ], "Le code renvoie 60 au lieu de 90, sans aucune erreur visible. Dans le lab : 403,0 au lieu de 478,0 pour payments.");
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Chain of thought : la cause racine",
      texte:
        "<p>Étape 3 du lab : donner le test qui échoue, pointer les données, et demander à Claude de <b>raisonner pas à pas</b> — lister des hypothèses, vérifier chacune contre le code et les données, conclure, et répondre « unknown » plutôt que deviner. " +
        "Puis <b>vérifier son raisonnement toi-même</b> en ouvrant l'enregistrement qu'il désigne.</p>",
      objectif: "Désigner la ligne fautive et expliquer pourquoi l'erreur est silencieuse.",
      installer: function (zone, api) {
        A.code(zone, CODE, "# réécrit pour l'atelier");
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.choix(b, {
              question: "Quelle ligne transforme l'erreur en mauvais chiffre ?",
              options: ["except: return 0", "return (fin - debut).total_seconds() / 60", "round(..., 1)"],
              bonne: 0,
              expliquer: ["Oui : l'except nu avale la TypeError et renvoie 0 — et ce 0 entre dans la moyenne.", "Non : cette ligne lève l'erreur, mais c'est l'except qui la cache.", "Non : l'arrondi n'y est pour rien."],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Correctif minimal le plus honnête ?",
              options: [
                "Interpréter une date sans fuseau comme UTC, et ne plus avaler les erreurs : un incident illisible doit se voir",
                "Remplacer « return 0 » par « return 90 »",
                "Changer la valeur attendue du test pour qu'il passe"
              ],
              bonne: 0,
              expliquer: [
                "Oui : on corrige la cause et on rend l'erreur visible. (La version de référence du kit de la session 5 traite une date sans fuseau comme UTC.)",
                "Non : un chiffre inventé ne corrige rien.",
                "Interdit par le lab : un test encode le comportement attendu, pas le comportement actuel."
              ],
              surReussite: ok
            });
          }
        ], "« The code never crashes. Why could a wrong value be silent? » — parce qu'une erreur est convertie en valeur plausible.");
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Une technique par étape",
      texte:
        "<p>Le lab enchaîne cinq étapes, chacune avec une technique de prompt vue en cours.</p>",
      objectif: "Associer chaque étape du lab à sa technique, puis ordonner la chaîne de refactoring.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["zero-shot", "few-shot", "chain of thought", "prompt chaining"],
              items: [
                { texte: "Comprendre : expliquer le module et lister ses risques", bonne: 0 },
                { texte: "Tester : écrire des tests dans le style de l'équipe, à partir des deux tests d'exemple", bonne: 1 },
                { texte: "Diagnostiquer : pourquoi 403 au lieu de 478 ?", bonne: 2 },
                { texte: "Refactorer : analyser, planifier, exécuter, relire", bonne: 3 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.ordonner(b, {
              consigne: "Les maillons de la chaîne de refactoring (un prompt par maillon, vérifié avant le suivant) :",
              items: ["Analyser (bugs en JSON)", "Planifier (5 étapes max)", "Exécuter l'étape 1, montrer le diff et les tests", "Relire contre le plan et les tests"],
              separateur: "→",
              surReussite: ok
            });
          }
        ], "Et le prompt d'ouverture de la chaîne : « After each step, stop and wait for my validation. »");
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Les règles du lab",
      texte:
        "<p>Ces règles s'appliquent dès la session 1 (la sécurité a sa propre session plus tard), et reviennent dans le projet final : <span class='mono'>AI_LOG.md</span> doit tracer ce que tu as accepté ou refusé de Claude.</p>",
      objectif: "Trier les bonnes et les mauvaises pratiques.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Si Claude écrit « Tested, it works », on demande la sortie brute de pytest.", vrai: true },
            { texte: "Si un nouveau test échoue, on peut laisser Claude modifier la valeur attendue pour qu'il passe.", vrai: false, explication: "Un test qui échoue révèle un bug : c'est son rôle." },
            { texte: "On peut coller le fichier .env pour que Claude comprenne la configuration.", vrai: false, explication: "Jamais de clé, de token ni de .env dans un prompt." },
            { texte: "On garde aussi les essais ratés dans le journal de prompts.", vrai: true },
            { texte: "Avant d'installer un paquet suggéré par Claude, on vérifie qu'il existe et que c'est le bon.", vrai: true }
          ],
          surReussite: function () { api.valider("Lire chaque diff, exiger la sortie brute, ne jamais trafiquer un test ni partager un secret."); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software",
    id: "tp1-legacy-rescue",
    etapes: etapes,
    fin: {
      texte: "<p>À retenir du TP 1 :</p><ul>" +
        "<li>Critères de réussite vérifiables avant le prompt ; sortie brute exigée.</li>" +
        "<li>Un <span class='mono'>except</span> nu peut transformer une erreur en chiffre plausible : le bug le plus dangereux est silencieux.</li>" +
        "<li>Zero-shot pour comprendre, few-shot pour les tests, chain of thought pour la cause, chaining pour refactorer.</li></ul>" +
        "<p>Pour le projet : les prompts système doivent vivre dans des fichiers dédiés et versionnés (rôle, contexte, contraintes, format de sortie) — principe 1 de la notation.</p>",
      cartes: "s1-bases-prompts"
    }
  });
})();
