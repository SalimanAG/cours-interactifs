/* Leçon : Comment un LLM répond (session 1, parties 01 à 03 : histoire, paradigmes, LLM et foundation models).
   Fil rouge : l'exemple de la diapo « How an LLM answers » — « The capital of France is » → « Paris ». */
(function () {
  "use strict";
  var el = Site.el, A = ASD;

  var etapes = [
    {
      titre: "Où se placent les LLM",
      texte: "<p>Fil rouge : on demande à un LLM de compléter <span class='mono'>« The capital of France is »</span>. Avant de voir comment il répond, situons-le.</p>",
      objectif: "Ranger les cinq notions du plus large au plus étroit.",
      installer: function (zone, api) {
        Exercices.ordonner(zone, {
          items: ["Intelligence artificielle", "Machine learning", "Deep learning", "IA générative", "Large language models"],
          separateur: "⊃",
          bravo: "IA ⊃ ML (comportement appris sur des données) ⊃ DL (réseaux à nombreuses couches) ⊃ IA générative (produit du contenu nouveau) ⊃ LLM (texte et code : Claude, GPT, Gemini, Llama).",
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Règles écrites ou règles apprises",
      texte: "<p>Deux façons de construire de l'intelligence. Un LLM est du côté <b>connexionniste</b>.</p>",
      objectif: "Associer chaque propriété à son approche.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["symbolique", "connexionniste"],
          items: [
            { texte: "des humains écrivent des règles explicites (IF fever AND rash THEN …)", bonne: 0 },
            { texte: "des réseaux de neurones apprennent le comportement à partir de données", bonne: 1 },
            { texte: "explicable, prévisible, auditable", bonne: 0 },
            { texte: "gère l'ambiguïté, s'améliore avec données et calcul", bonne: 1 },
            { texte: "fragile : ne couvre pas le réel désordonné", bonne: 0 },
            { texte: "opaque : fait des erreurs statistiques", bonne: 1 }
          ],
          surReussite: function () { api.valider("L'histoire du cours : chaque vague (symbolique, systèmes experts, deep learning) a finalement été jugée sur la fiabilité en production."); }
        });
      }
    },
    {
      titre: "Comment un LLM est fabriqué",
      texte: "<p>Un LLM est un <b>foundation model</b> : entraîné une fois, très cher, sur des données larges, puis adapté à de nombreuses tâches (prompting, fine-tuning, RAG, outils).</p>",
      objectif: "Associer chaque mode d'apprentissage à son exemple, puis ordonner la fabrication.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["supervisé", "non supervisé", "renforcement", "auto-supervisé"],
              items: [
                { texte: "cet e-mail est un spam, celui-là non (exemples étiquetés)", bonne: 0 },
                { texte: "regrouper des clients par comportement, sans étiquette", bonne: 1 },
                { texte: "AlphaGo, et l'étape RLHF des LLM : apprendre de récompenses", bonne: 2 },
                { texte: "cacher le mot suivant, puis le prédire : le pré-entraînement des LLM", bonne: 3 }
              ],
              surReussite: ok
            });
          },
          function (b, ok) {
            Exercices.ordonner(b, {
              items: ["Pré-entraînement (prédire le prochain token)", "Instruction tuning (paires instruction–réponse)", "Alignement des préférences (RLHF…)", "Inférence (génération token par token)"],
              separateur: "→", surReussite: ok
            });
          }
        ], "C'est l'étape d'inférence que tu utilises chaque fois que tu envoies un prompt.");
      }
    },
    {
      titre: "Des tokens, pas des lettres",
      texte: "<p>Le prompt est d'abord découpé en <b>tokens</b>. Dans la diapo : <span class='mono'>The · ·capital · ·of · ·France · ·is</span> (le « · » marque l'espace collé au token).</p>",
      objectif: "Compter les tokens, puis dire pourquoi ils comptent.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.nombre(b, { label: "Nombre de tokens de « The capital of France is » :", attendu: 5, placeholder: "ex. 24", indice: "Un token par mot ici, avec son espace.", surReussite: ok }); },
          function (b, ok) {
            Exercices.cocher(b, {
              question: "Selon le cours, les tokens sont aussi l'unité…",
              options: ["du prix", "des limites de contexte", "de beaucoup d'erreurs", "de la vitesse du réseau"],
              bonnes: [0, 1, 2],
              explication: "« Tokens are also the unit of price, context limits and many errors. »",
              surReussite: ok
            });
          }
        ], "5 tokens, pas 24 caractères.");
      }
    },
    {
      titre: "Un token à la fois",
      texte: "<p>Le Transformer calcule une probabilité pour <b>chaque token du vocabulaire</b>. Probabilités de la diapo pour le token suivant :</p>",
      objectif: "Choisir le token, puis dire ce qui se passe ensuite.",
      installer: function (zone, api) {
        var t = el("table", "tableau");
        t.innerHTML = "<tr><th>token</th><th class='num'>probabilité</th></tr><tr><td class='mono'>·Paris</td><td class='num'>0,91</td></tr><tr><td class='mono'>·a</td><td class='num'>0,04</td></tr><tr><td class='mono'>·the</td><td class='num'>0,02</td></tr><tr><td>… tous les autres</td><td class='num'>…</td></tr>";
        zone.appendChild(t);
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "Quel token est choisi ici ?", options: ["·Paris", "·a", "·the"], bonne: 0, surReussite: ok }); },
          function (b, ok) {
            Exercices.choix(b, {
              question: "Et ensuite ?",
              options: ["le token est ajouté au texte, et on recommence jusqu'à ce que la réponse soit complète", "le modèle relit Wikipédia pour vérifier", "la réponse est finie après un token"],
              bonne: 0,
              expliquer: ["Oui : « append it to the text, then go round again ». Ton prompt est l'endroit où cette boucle commence.", "Non : il ne vérifie rien ; il prédit le token suivant.", "Non : la boucle continue."],
              surReussite: ok
            });
          }
        ], "Un LLM prédit le prochain token, encore et encore. Fluent ≠ true.");
      }
    },
    {
      titre: "L'attention",
      texte: "<p>Pour comprendre un mot, chaque token pondère tous les autres. Exemple du cours : <span class='mono'>« The server crashed because it ran out of memory »</span>. Personne n'a écrit cette règle : elle a été apprise.</p>",
      objectif: "Trouver à quoi « it » fait le plus attention, puis les conséquences pratiques.",
      installer: function (zone, api) {
        A.enchainer(zone, api, [
          function (b, ok) { Exercices.choix(b, { question: "Pour comprendre « it », le modèle met le plus de poids sur…", options: ["server", "memory", "crashed"], bonne: 0, surReussite: ok }); },
          function (b, ok) {
            Exercices.associer(b, {
              categories: ["position", "structure", "longueur"],
              items: [
                { texte: "le milieu du contexte est moins bien utilisé : instructions clés au début ou à la fin", bonne: 0 },
                { texte: "titres, délimiteurs et balises sont plus faciles à suivre", bonne: 1 },
                { texte: "chaque token rencontre chaque autre : coût et latence croissent avec le contexte", bonne: 2 }
              ],
              surReussite: ok
            });
          }
        ], "Ces trois conséquences guident la façon d'écrire un prompt.");
      }
    },
    {
      titre: "La fenêtre de contexte",
      texte: "<div class='encadre'><span class='titre-encadre'>Idée clé</span>La fenêtre de contexte est <b>toute</b> la mémoire de travail du modèle. Il connaît ses données d'entraînement et ce qui est dans le prompt — rien d'autre.</div>",
      objectif: "Vérifier quatre affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Le modèle se souvient de la conversation d'hier si on ne la lui redonne pas.", vrai: false },
            { texte: "Il ne voit ton dépôt de code que si tu le mets dans le contexte.", vrai: true },
            { texte: "Le prompt engineering, c'est l'art de bien remplir cette fenêtre.", vrai: true },
            { texte: "Un texte fluide prouve que le modèle a compris (effet ELIZA).", vrai: false, explication: "1966, Weizenbaum : on attribue trop vite de la compréhension à un texte fluide." }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },
    {
      titre: "Quatre choses à ne jamais oublier",
      texte: "<p>La diapo de synthèse de la partie LLM, et la cause racine de l'hallucination : <b>Software 3.0</b> (des prompts qui programment un modèle génératif) produit du contenu <b>plausible</b>, qui peut être faux.</p>",
      objectif: "Associer chaque principe à sa phrase.",
      installer: function (zone, api) {
        Exercices.associer(zone, {
          categories: ["Fluent ≠ true", "Context matters", "Prompting is iterative", "Trust, but verify"],
          items: [
            { texte: "Une réponse confiante peut être fausse.", bonne: 0 },
            { texte: "Le modèle ne travaille qu'avec l'information à sa disposition.", bonne: 1 },
            { texte: "Les bons prompts émergent des tests.", bonne: 2 },
            { texte: "Ne jamais déléguer sa responsabilité au modèle.", bonne: 3 }
          ],
          surReussite: function () { api.valider(); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "agentic-software", id: "comment-llm-repond", etapes: etapes,
    fin: { texte: "<p>Un LLM : un foundation model pré-entraîné en auto-supervisé, qui découpe en tokens, pondère par l'attention, et prédit un token à la fois — dans les limites de sa fenêtre de contexte.</p>", cartes: "s1-bases-prompts" }
  });
})();
