/* Leçon : Du stdin au verdict (cours 0 Getting Started, cours 1 Input/Output ; exo1_1, exo1_2).
   Fil rouge : le problème HELLOKIT (Hello Kitty), avec l'entrée « Love 1 / Kitty 2 / . ». */
(function () {
  "use strict";
  var el = Site.el;
  var ENTREE = "Love 1\nKitty 2\n.";

  function motif(w, n) {
    var r = [];
    for (var i = w.length; i >= 1; i--) r.push(w.slice(w.length - i) + new Array(n).join(w) + w.slice(0, w.length - i));
    return r;
  }

  var etapes = [

    /* 1 */
    {
      titre: "Ce qu'est une solution",
      texte:
        "<p>Le cours (Getting Started) : une solution est un programme, dans le langage que tu veux, qui</p>" +
        "<div class='encadre'><b>lit</b> les cas de test sur l'<b>entrée standard</b> ; les <b>résout</b> ; " +
        "<b>écrit</b> les résultats sur la <b>sortie standard</b>. Ces étapes peuvent être imbriquées : c'est la boucle <i>Read-Eval-Print</i>.</div>" +
        "<p>Les flux standard sont des canaux d'entrée/sortie <i>préconnectés</i> entre le programme et son environnement dès le début de l'exécution.</p>",
      objectif: "Dire ce qui est permis dans une solution.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "On peut lancer plusieurs threads pour aller plus vite.", vrai: false, explication: "Le cours : « without parallelism (no threads) »." },
            { texte: "On peut ouvrir un fichier <span class='mono'>input.txt</span> pour lire les données.", vrai: false, explication: "« without file/network IO » : tout passe par stdin / stdout." },
            { texte: "On peut lire un cas, l'afficher, puis lire le suivant.", vrai: true, explication: "Les étapes lire / résoudre / écrire peuvent être imbriquées." },
            { texte: "On peut écrire la solution en Python.", vrai: true, explication: "« in whatever languages you wish » ; les juges acceptent C, C++, Java, Python, R." },
            { texte: "On peut appeler une bibliothèque externe (numpy, networkx…).", vrai: false, explication: "« without external library calls ». La bibliothèque standard du langage reste utilisable (sys, collections…)." }
          ],
          surReussite: function () { api.valider("Retiens : stdin → résoudre → stdout, sans thread, sans fichier, sans bibliothèque externe."); }
        });
        PC.html(zone, "Le cours dit « without external library calls » sans préciser la bibliothèque standard. " +
          "Je considère qu'elle est permise (sys, collections), comme le suggèrent les squelettes du juge.", "signalement");
      }
    },

    /* 2 */
    {
      titre: "Les verdicts du juge",
      texte:
        "<p>Le juge automatique répond par un verdict. Les trois courants : <b>AC</b> (Accepted), <b>WA</b> (Wrong Answer), <b>TLE</b> (Time Limit Exceeded). " +
        "Avec une bonne méthode, il devrait rarement renvoyer : <b>CE</b> (Compilation Error), <b>RE</b> (Runtime Error), <b>MLE</b> (Memory Limit Exceeded), <b>OLE</b> (Output Limit Exceeded).</p>" +
        "<p>Les juges sont très pointilleux : il faut interpréter l'énoncé exactement, sans faire d'hypothèse.</p>",
      objectif: "Associer chaque situation à son verdict.",
      installer: function (zone, api) {
        var verdicts = ["?", "AC", "WA", "TLE", "CE", "RE", "MLE", "OLE"];
        var cas = [
          { t: "Ton programme affiche <span class='mono'>Yes</span> alors que l'énoncé demande <span class='mono'>yes</span>.", b: "WA" },
          { t: "Ta boucle de lecture ne s'arrête jamais et n'affiche rien.", b: "TLE" },
          { t: "Ta boucle affiche sans fin la même ligne.", b: "OLE" },
          { t: "Tu accèdes à <span class='mono'>t[n]</span> dans un tableau de taille n.", b: "RE" },
          { t: "Tu alloues un tableau de 10<sup>10</sup> entiers.", b: "MLE" },
          { t: "Ton programme C a un warning mais compile : il donne les bonnes réponses à temps.", b: "AC" }
        ];
        var sel = [];
        cas.forEach(function (c) {
          var l = el("div", "saisie");
          l.style.margin = ".4rem 0";
          var lab = el("label");
          lab.innerHTML = c.t;
          lab.style.flex = "1 1 14rem";
          var s = el("select");
          verdicts.forEach(function (v) { var o = el("option", null, v); o.value = v; s.appendChild(o); });
          s.addEventListener("change", verifier);
          l.appendChild(lab); l.appendChild(s);
          zone.appendChild(l);
          sel.push(s);
        });
        function verifier() {
          var j = 0, r = 0;
          sel.forEach(function (s, i) { if (s.value !== "?") r++; if (s.value === cas[i].b) j++; });
          if (j === cas.length) {
            sel.forEach(function (s) { s.disabled = true; });
            api.retour("Tout est juste. Les warnings sont ignorés par le juge (cours : « Warning messages are ignored »).", true);
            api.valider("Le juge donne très peu d'indices sur ce qui ne va pas : souvent, il faut relire l'énoncé.");
          } else if (r === cas.length) {
            api.retour(j + " sur " + cas.length + ". Corrige les autres.", false);
          } else api.retour("", null);
        }
      }
    },

    /* 3 */
    {
      titre: "HELLOKIT : lire le motif",
      texte:
        "<p>HELLOKIT (exo1_2) : Kitty choisit un mot W et un nombre n, écrit W n fois sur une ligne, puis répète la ligne en faisant <b>tourner</b> les caractères d'un cran vers la gauche, " +
        "jusqu'à ce que W apparaisse dans la première colonne. Chaque ligne d'entrée est un cas ; une ligne contenant seulement un point termine l'entrée (elle n'est pas traitée).</p>",
      objectif: "Écrire exactement la sortie du premier cas, Love 1.",
      installer: function (zone, api) {
        PC.entree(zone, ENTREE);
        Exercices.texte(zone, {
          label: "Sortie de Love 1 :", lignes: 5, placeholder: "une ligne par rangée du motif",
          attendu: motif("Love", 1).join("\n"),
          indice: "Il y a autant de lignes que de lettres dans le mot ; chaque ligne est la précédente tournée d'un cran vers la gauche.",
          bravo: "Exact : Love, oveL, veLo, eLov.",
          surReussite: function () { api.valider("4 lettres → 4 lignes. Pour Kitty 2 : 5 lignes de 10 caractères."); }
        });
      }
    },

    /* 4 */
    {
      titre: "L'algorithme du cours",
      texte:
        "<p>Le cours donne l'algorithme <i>RectangularPattern</i> (données : un mot w et un entier n &gt; 0), corrigé ici :</p>",
      objectif: "Calculer la 3e ligne du motif pour Kitty 2.",
      installer: function (zone, api) {
        var pc = new PseudoCode(zone, { titre: "MOTIF-RECTANGULAIRE(w, n)", lignes: [
          "pour i ← |w| jusqu'à 1 faire",
          "    afficher les i dernières lettres de w",
          "    afficher n − 1 fois le mot w",
          "    afficher les |w| − i premières lettres de w",
          "    passer à la ligne"
        ] });
        pc.surligner(null);
        PC.html(zone, "Le cours écrit « print the first <b>i − 1</b> letters of w ». C'est une coquille : pour Love 1, la 1re ligne (i = 4) donnerait « Love » + « Lov ». " +
          "Il faut les <b>|w| − i</b> premières lettres (ce qui a été « tourné » vers la fin). Le pseudo-code ci-dessus est corrigé.", "signalement");
        zone.appendChild(el("p", null, "Pour w = Kitty, n = 2 : la 1re ligne correspond à i = 5, la 2e à i = 4, la 3e à i = 3."));
        Exercices.texte(zone, {
          label: "Ligne pour i = 3 :", attendu: "ttyKittyKi", mode: "exact",
          indice: "Les 3 dernières lettres, puis Kitty une fois (n − 1 = 1), puis les |w| − i = 2 premières lettres.",
          bravo: "Exact : tty + Kitty + Ki.",
          surReussite: function () {
            pc.surligner(2);
            PC.code(zone,
              "def motif(w, n):\n" +
              "    for i in range(len(w), 0, -1):\n" +
              "        print(w[len(w) - i:] + w * (n - 1) + w[:len(w) - i])", "En Python (tranches de chaîne)");
            api.valider("Les tranches Python w[a:b] font exactement « les i dernières / i − 1 premières lettres ».");
          }
        });
      }
    },

    /* 5 */
    {
      titre: "La boucle de lecture",
      texte:
        "<p>L'entrée contient plusieurs cas, un par ligne, et se termine par une ligne « <span class='mono'>.</span> » qui ne doit pas être traitée. " +
        "Le squelette Python :</p>",
      objectif: "Prévoir combien de cas sont traités.",
      installer: function (zone, api) {
        PC.code(zone,
          "import sys\n" +
          "for ligne in sys.stdin:\n" +
          "    ligne = ligne.strip()\n" +
          "    if ligne == \".\":\n" +
          "        break               # fin de l'entrée : on s'arrête\n" +
          "    w, n = ligne.split()\n" +
          "    motif(w, int(n))");
        PC.entree(zone, "Love 1\nKitty 2\n.\nHello 3", "Entrée reçue");
        Exercices.choix(zone, {
          question: "Combien de motifs sont affichés ?",
          options: ["1", "2", "3"],
          bonne: 1,
          expliquer: ["Non : Love et Kitty sont avant le point.", "Exact : le break s'arrête sur « . », Hello 3 n'est jamais lu.", "Non : tout ce qui suit la ligne « . » est ignoré."],
          surReussite: function () { api.valider("Toujours vérifier comment l'entrée se termine : nombre de cas en tête, ligne sentinelle (« . », « 0 », « 0 0 »), ou fin de fichier."); }
        });
      }
    },

    /* 6 */
    {
      titre: "Les codes ASCII",
      texte:
        "<p>ASCII code 2<sup>7</sup> = 128 caractères sur un octet. Les majuscules, les minuscules et les chiffres y sont <b>consécutifs</b>. Le cours en tire :</p>" +
        "<ul><li>rang d'une lettre : on soustrait la première (<span class='mono'>'I' − 'A'</span>) ;</li>" +
        "<li>majuscule → minuscule : <span class='mono'>'C' − 'A' + 'a'</span> ;</li>" +
        "<li>trier « alphabétiquement » = trier par code ;</li>" +
        "<li>10 (nouvelle ligne) et 13 (retour chariot) délimitent les lignes.</li></ul>" +
        "<p>En Python : <span class='mono'>ord('A')</span> = 65, <span class='mono'>ord('a')</span> = 97, <span class='mono'>chr(99)</span> = 'c'.</p>",
      objectif: "Calculer un rang, puis prévoir un tri par codes.",
      installer: function (zone, api) {
        Exercices.nombre(zone, {
          label: "ord('I') − ord('A') =", attendu: 8, tolerance: 0, placeholder: "ex. 3",
          indice: "A est au rang 0, B au rang 1…",
          bravo: "Exact : I est la 8e lettre en partant de 0 (« eighth, if 'A' is the zeroth »).",
          surReussite: function () {
            Exercices.choix(zone, {
              question: "Que renvoie sorted([\"banana\", \"Cherry\", \"apple\"]) ?",
              options: ["['apple', 'banana', 'Cherry']", "['Cherry', 'apple', 'banana']", "['banana', 'Cherry', 'apple']"],
              bonne: 1,
              expliquer: ["Non : ce serait un tri qui ignore la casse.", "Exact : 'C' = 67 est avant 'a' = 97. Toutes les majuscules passent avant les minuscules.", "Non : c'est l'ordre d'origine."],
              surReussite: function () { api.valider("Pour un autre ordre (sans casse, par exemple), il faut une clé de comparaison : sorted(t, key=str.lower)."); }
            });
          }
        });
      }
    },

    /* 7 */
    {
      titre: "Représenter une chaîne",
      texte:
        "<p>Le cours compare trois représentations :</p>" +
        "<ul><li><b>tableau terminé par un nul</b> (C/C++) : la chaîne s'arrête au premier <span class='mono'>'\\0'</span> ;</li>" +
        "<li><b>tableau + longueur</b> : la longueur est stockée à part (probablement ce que fait Java) ;</li>" +
        "<li><b>liste chaînée de caractères</b> : rarement utilisée, un pointeur de plusieurs octets par caractère.</li></ul>" +
        "<p>Le cours pose les questions de comparaison sans y répondre. À toi :</p>",
      objectif: "Répondre aux questions de comparaison du cours.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Le tableau terminé par un nul ne peut pas contenir le caractère <span class='mono'>'\\0'</span>.", vrai: true, explication: "Il marquerait la fin : c'est la seule qui contraint le contenu." },
            { texte: "La liste chaînée donne l'accès au i-ème caractère en temps constant.", vrai: false, explication: "Il faut suivre i pointeurs : O(i). Les deux tableaux donnent O(1)." },
            { texte: "Avec tableau + longueur, vérifier que i est dans la chaîne coûte O(1).", vrai: true, explication: "On compare i à la longueur. Avec le nul final, il faut parcourir jusqu'au '\\0' : O(n)." },
            { texte: "Insérer un caractère en position i (pointeur déjà connu) est efficace avec la liste chaînée.", vrai: true, explication: "On modifie deux pointeurs ; dans un tableau, il faut décaler la fin." },
            { texte: "Pour une chaîne courte, la liste chaînée est la plus économe en mémoire.", vrai: false, explication: "Un pointeur (plusieurs octets) par caractère (un octet) : c'est la plus coûteuse." }
          ],
          surReussite: function () {
            PC.html(zone, "Les réponses ne sont pas dans les diapos : elles découlent des définitions données par le cours.", "signalement");
            api.valider("En Python, str est immuable : « insérer » crée une nouvelle chaîne en O(n). Pour construire beaucoup de texte, on accumule dans une liste puis on fait ''.join(...).");
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "programming-challenge",
    id: "stdin-verdict",
    etapes: etapes,
    fin: {
      cartes: "demarrer-es",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir</span><ul>" +
        "<li>Solution = lire stdin, résoudre, écrire stdout ; ni thread, ni fichier, ni bibliothèque externe.</li>" +
        "<li>Verdicts : AC, WA, TLE (courants) ; CE, RE, MLE, OLE (évitables).</li>" +
        "<li>Repérer la fin de l'entrée (ligne « . » pour HELLOKIT).</li>" +
        "<li>ASCII : lettres et chiffres consécutifs ; trier = trier par code (majuscules avant minuscules).</li></ul></div>"
    }
  });
})();
