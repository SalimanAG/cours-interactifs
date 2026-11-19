/* Atelier : TP 5 — Claude Code en tech lead (session 5, labs 1 à 4) : harness, permissions, CLAUDE.md et skills,
   workflow explore → plan → implement → commit, le bug du lab 1, MCP et moindre privilège.
   Les fichiers de configuration montrés sont réécrits et simplifiés pour l'atelier (pas ceux du kit). */
(function () {
  "use strict";
  var A = ASD;

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Agent, harness, coding agent",
      texte:
        "<p>Rôle de la session 5 : <b>tu es le tech lead, Claude est un junior très rapide</b>. Il écrit le code ; toi, tu spécifies, décides, relis et vérifies.</p>" +
        "<p>Trois mots, dans l'ordre du cours :</p>",
      objectif: "Associer les définitions, puis retrouver ton agent de la session 4 dans Claude Code.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["agent", "harness", "coding agent"],
              items: [
                { texte: "Un modèle, des outils et une boucle où le modèle décide l'action suivante jusqu'à la fin de la tâche.", bonne: 0 },
                { texte: "Le code autour du modèle qui fait tourner la boucle : construit ce que voit le modèle, exécute les outils demandés, applique les limites.", bonne: 1, explication: "« The model only proposes; the harness acts. » Claude Code est un harness." },
                { texte: "Un agent dont les outils sont ceux d'un développeur : lire et modifier des fichiers, lancer des commandes, des tests, git.", bonne: 2 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.associer(b, {
              consigne: "Ton step1_manual_loop.py → dans Claude Code :",
              categories: ["Esc pour l'arrêter", "/context, /compact", "permissions allow / ask / deny", "CLAUDE.md et skills", "checkpoints (Esc Esc) et git"],
              items: [
                { texte: "la boucle et MAX_ITERATIONS", bonne: 0, explication: "Claude Code tourne jusqu'à la fin ; c'est toi qui l'arrêtes." },
                { texte: "la liste messages qui grandit", bonne: 1 },
                { texte: "read_file qui ne sort pas de docs/ (TODO 1.6)", bonne: 2 },
                { texte: "le prompt système écrit dans le code", bonne: 3 },
                { texte: "aucun moyen d'annuler", bonne: 4 }
              ],
              surReussite: ok
            });
          }
        ], "Mêmes pièces dans Codex, Copilot ou tout autre agent : apprendre les pièces, pas le produit.");
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Les permissions : deny, puis ask, puis allow",
      texte:
        "<p>Les règles de <span class='mono'>.claude/settings.json</span> décident quels appels d'outils passent sans te demander. Elles sont vérifiées dans l'ordre <b>deny → ask → allow</b> : la première qui correspond gagne.</p>",
      objectif: "Prévoir la décision pour chaque appel.",
      installer: function (zone, api) {
        A.code(zone, [
          "\"allow\": [\"Bash(pytest *)\", \"Bash(git diff *)\", \"mcp__github__issue_read\"],",
          "\"ask\":   [\"Bash(pip install *)\", \"mcp__github__issue_write\"],",
          "\"deny\":  [\"Read(./.env)\", \"Bash(git push *)\"]"
        ], "# réglages simplifiés pour l'atelier");
        Exercices.associer(zone, {
          categories: ["passe", "te demande", "refusé"],
          items: [
            { texte: "<span class='mono'>Bash(pytest tests/test_stats.py)</span>", bonne: 0 },
            { texte: "<span class='mono'>Read(./.env)</span>", bonne: 2, explication: "Le secret n'entre jamais dans le contexte." },
            { texte: "<span class='mono'>Bash(git push origin main)</span>", bonne: 2, explication: "« A human pushes. »" },
            { texte: "<span class='mono'>mcp__github__issue_write</span>", bonne: 1, explication: "Les lectures passent, chaque écriture attend ton accord." },
            { texte: "<span class='mono'>Bash(pip install requests)</span>", bonne: 1, explication: "Pas de nouvelle dépendance sans demander." }
          ],
          surReussite: function () { api.valider("Lectures libres, écritures sur demande, secrets et push interdits : c'est le moindre privilège appliqué à l'agent."); }
        });
        A.note(zone, "Le cours liste aussi les modes (Plan, Default, Accept edits, Auto, Bypass), qu'on fait défiler avec Shift+Tab. Ce qui se passe pour un appel qui ne correspond à aucune règle dépend du mode : l'atelier ne prend que des appels couverts par une règle.");
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "CLAUDE.md et skills",
      texte:
        "<p><b>CLAUDE.md</b> est chargé au début de chaque conversation : les règles du projet pour l'agent, versionnées avec le code. On le lance avec <span class='mono'>/init</span>, puis on l'élague avec un seul test : " +
        "<i>retirer cette ligne ferait-il faire une erreur à Claude ?</i></p>",
      objectif: "Élaguer un CLAUDE.md, puis régler un skill.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["garder", "couper"],
              items: [
                { texte: "Tests (offline) : <span class='mono'>pytest</span> · lint : <span class='mono'>ruff check .</span>", bonne: 0, explication: "Des commandes qu'il ne peut pas deviner." },
                { texte: "Never read or print .env", bonne: 0 },
                { texte: "Write clean, readable code.", bonne: 1, explication: "Slogan sans effet : il ne change aucun comportement." },
                { texte: "tools.py contient les outils de l'agent.", bonne: 1, explication: "Il le lit dans le code : inutile." },
                { texte: "Specs in specs/, never in docs/ (everything in docs/ is indexed by the agent)", bonne: 0, explication: "Un piège propre au projet : sans cette ligne, une spec finirait dans la base documentaire." },
                { texte: "Never edit a test to make it pass", bonne: 0 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            A.code(b, [
              "---",
              "name: deploy",
              "description: ???",
              "disable-model-invocation: ???",
              "---",
              "Deploy the API to staging. Target: $ARGUMENTS"
            ], "# .claude/skills/deploy/SKILL.md (exemple de l'atelier)");
            Exercices.vraiFaux(b, {
              items: [
                { texte: "La description sert de déclencheur : elle commence par le cas d'usage et les mots que les gens tapent.", vrai: true },
                { texte: "Pour un skill à effet de bord comme /deploy, on met <span class='mono'>disable-model-invocation: true</span> : seul toi le lances.", vrai: true },
                { texte: "Le corps du skill est chargé dans le contexte à chaque conversation.", vrai: false, explication: "Seule la description y est ; le corps se charge quand le skill est utilisé." },
                { texte: "<span class='mono'>$ARGUMENTS</span> est remplacé par ce que tu tapes après /deploy.", vrai: true },
                { texte: "Un skill dans <span class='mono'>.claude/skills/</span> est partagé avec l'équipe par git ; dans <span class='mono'>~/.claude/skills/</span>, il n'est qu'à toi.", vrai: true }
              ],
              surReussite: ok
            });
          }
        ], "CLAUDE.md court et spécifique ; les procédures d'équipe deviennent des skills.");
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Livrer un ticket : pas de preuve, pas de livraison",
      texte:
        "<p>Le workflow : <b>Explore</b> et <b>Plan</b> en mode plan (lecture seule), <b>Implement</b> en mode par défaut (tests d'abord, itérer jusqu'au vert), <b>Commit</b> (tu lis le diff ; un humain pousse). " +
        "On saute le plan quand on peut décrire le diff en une phrase.</p>",
      objectif: "Remettre le workflow dans l'ordre, puis transformer des demandes vagues en demandes de preuve.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.ordonner(b, {
              items: ["/spec : l'interview, puis specs/<nom>.md", "/clear, mode plan : un plan relu comme une pull request", "Tests d'abord avec un faux ask_fn, puis le code", "Preuves : pytest, ruff, curl", "Relecture dans une conversation neuve, tri des remarques"],
              separateur: "→",
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.associer(b, {
              consigne: "Chaque demande vague → la demande avec preuve :",
              categories: ["« … montre-moi la sortie de pytest »", "« … curl /health et un POST /ask vide »", "« … corrige la cause, ne touche pas aux tests »"],
              items: [
                { texte: "« Mappe les erreurs du fournisseur vers 502 »", bonne: 0, explication: "Avec un faux ask_fn qui lève l'erreur : le test le prouve." },
                { texte: "« L'API marche »", bonne: 1 },
                { texte: "« Les tests échouent »", bonne: 2 }
              ],
              surReussite: ok
            });
          }
        ], "« Without a test to run, ‘looks done’ is the only stop signal. »");
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Lab 1 · Qui a cassé le MTTR ?",
      texte:
        "<p>Dans le kit, 3 tests de <span class='mono'>tests/test_stats.py</span> échouent. Consigne : corriger la cause dans <span class='mono'>orbitra/</span>, jamais les tests, et <b>lire l'historique git du fichier</b>.</p>" +
        "<p>L'historique montre un commit d'un collègue (fictif) : <span class='mono'>feat(stats): count still-open incidents in MTTR (ops request)</span>. Désormais, un incident encore ouvert compte « jusqu'à maintenant » dans la moyenne.</p>",
      objectif: "Expliquer pourquoi la réponse de Q7 serait fausse en silence.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.cocher(b, {
              question: "Avec ce commit, que devient le MTTR que l'agent cite pour Q7 ?",
              options: [
                "il est gonflé par les incidents encore ouverts",
                "il change à chaque exécution, puisque « maintenant » avance",
                "il reste plausible et aucune erreur n'apparaît",
                "il fait planter l'outil incident_stats"
              ],
              bonnes: [0, 1, 2],
              explication: "C'est le pire cas : un chiffre faux, plausible, sans erreur — exactement ce que la session 1 apprenait à traquer. Les tests (MTTR de référence 478,0, incidents ouverts exclus) l'attrapent.",
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Quel prompt donne le meilleur résultat ?",
              options: [
                "« 3 tests fail in test_stats.py: fix the root cause in orbitra/, don't edit the tests; read the git history of the file. »",
                "« Fix the tests. »"
              ],
              bonne: 0,
              expliquer: ["Oui : il pose les contraintes. Le lab demande de garder les deux prompts dans le rapport pour comparer.", "Trop vague : l'agent peut « réparer » en modifiant les valeurs attendues."],
              surReussite: ok
            });
          }
        ], "Fini quand la suite est verte, que le diff ne touche aucun test, et que tu sais qui a introduit le bug et pourquoi.");
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "MCP, backlog et moindre privilège",
      texte:
        "<p>Lab 3 : <span class='mono'>BACKLOG.md</span> est la source de vérité, dans git ; le skill <span class='mono'>/sync-backlog</span> crée ou met à jour les issues GitHub par un serveur MCP. " +
        "Chaque serveur MCP est un <b>nouvel accès</b> : on donne le minimum.</p>",
      objectif: "Placer les portées MCP, puis vérifier les règles de sécurité du lab 3.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              consigne: "Portée d'un serveur MCP → où il est stocké, avec qui il est partagé :",
              categories: ["local", "project", "user"],
              items: [
                { texte: "<span class='mono'>.mcp.json</span> dans le dépôt : toute l'équipe, par git", bonne: 1 },
                { texte: "<span class='mono'>~/.claude.json</span> : toi, pour tous tes projets", bonne: 2 },
                { texte: "<span class='mono'>~/.claude.json</span> : toi, pour ce projet seulement", bonne: 0 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.vraiFaux(b, {
              items: [
                { texte: "Dans <span class='mono'>.mcp.json</span>, on écrit <span class='mono'>Bearer ${GITHUB_PAT}</span> entre apostrophes simples : le fichier garde le nom de la variable, pas le jeton.", vrai: true },
                { texte: "Le jeton GitHub peut avoir tous les droits sur tous les dépôts, c'est plus simple.", vrai: false, explication: "Un seul dépôt, Issues en lecture-écriture seulement, 30 jours." },
                { texte: "Le texte d'un ticket est une donnée écrite par quelqu'un d'autre, pas une instruction.", vrai: true, explication: "Même leçon que la question piège de la session 4." },
                { texte: "/sync-backlog ferme une issue quand le ticket est terminé.", vrai: false, explication: "Jamais : fermer est la décision du relecteur." },
                { texte: "La synchronisation montre son plan et attend ton accord avant d'écrire.", vrai: true }
              ],
              surReussite: ok
            });
          }
        ], "Jeton limité, écritures sur demande, plan avant écriture, texte des tickets traité comme une donnée.");
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software",
    id: "tp5-claude-code",
    etapes: etapes,
    fin: {
      texte: "<p>Les six habitudes de la session 5 :</p><ol>" +
        "<li>L'agent écrit ; toi, tu spécifies, décides, vérifies, relis.</li>" +
        "<li>La spec avant le code : périmètre, hors périmètre, critères d'acceptation.</li>" +
        "<li>Le contexte est la ressource rare : une tâche par conversation.</li>" +
        "<li>Pas de preuve, pas de livraison : tests, une vraie requête, une relecture en contexte neuf.</li>" +
        "<li>Ce qui se répète devient un skill ; les outils d'équipe se branchent par MCP.</li>" +
        "<li>Moindre privilège : jetons limités, écritures sur demande, un humain pousse.</li></ol>" +
        "<p>Pour le dépôt final : <span class='mono'>CLAUDE.md</span> et <span class='mono'>AI_LOG.md</span> sont obligatoires (principe 10).</p>",
      cartes: "s5-claude-code"
    }
  });
})();
