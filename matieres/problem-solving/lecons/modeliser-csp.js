/* Leçon : Modéliser un problème en CSP (cours « Modélisation »).
   Fil rouge : le coloriage de la carte à 7 régions et 3 couleurs du cours. */
(function () {
  "use strict";
  var el = Site.el;
  var F = Carte.FRONTIERES;

  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function html(zone, contenu, classe) { var d = el("div", classe || ""); d.innerHTML = contenu; zone.appendChild(d); return d; }
  function cle(a, b) { return a < b ? a + "-" + b : b + "-" + a; }
  function contrainte(f) { return "v" + f[0] + " ≠ v" + f[1]; }

  var etapes = [

    /* 1 ─────────────────────────────────────────────────────────── */
    {
      titre: "Un problème, une instance",
      texte:
        "<p>Le cours décrit un problème par des <b>données</b> et une <b>question</b>. Une <b>instance</b> est un jeu de données précis ; l'algorithme cherché doit marcher pour toutes les instances.</p>" +
        "<div class='encadre'><span class='titre-encadre'>Coloriage de carte (cours)</span>" +
        "3 couleurs : bleu, rose et vert. Deux régions qui se touchent ont des couleurs différentes.</div>" +
        "<p>Voici la carte du cours, redessinée : 7 régions numérotées comme dans les slides.</p>",
      objectif: "Cocher ce qui relève de cette instance précise (et pas du problème général).",
      installer: function (zone, api) {
        new Carte(cadre(zone), {});
        Exercices.cocher(zone, {
          question: "Qu'est-ce qui est propre à <b>cette</b> instance ?",
          options: [
            "les 7 régions et leurs frontières",
            "la règle « deux régions voisines ont des couleurs différentes »",
            "les 3 couleurs : bleu, rose, vert",
            "la question « existe-t-il un coloriage qui respecte la règle ? »"
          ],
          bonnes: [0, 2],
          explication: "La carte et la liste des couleurs sont des <b>données</b> : une autre carte, ou 4 couleurs, donnerait une autre instance. La règle et la question définissent le problème lui-même.",
          surReussite: function () { api.valider("Données = cette carte + 3 couleurs. Problème = la règle et la question."); }
        });
      }
    },

    /* 2 ─────────────────────────────────────────────────────────── */
    {
      titre: "Les inconnues deviennent les variables",
      texte:
        "<p>Un modèle a trois parties :</p>" +
        "<div class='formule'>V = {v₁, …, vₙ} : variables<br>D = {D₁, …, Dₙ} : domaines<br>C = {C₁, …, Cₚ} : contraintes</div>" +
        "<p>La première question du cours : <b>quelles sont les inconnues ?</b></p>",
      objectif: "Choisir les variables du modèle du cours.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "Ce que l'on cherche, c'est…",
          options: [
            "la couleur de chaque région : 7 variables v₁, …, v₇",
            "les frontières : 10 variables",
            "le nombre de couleurs : 1 variable",
            "le numéro de chaque région : 7 variables"
          ],
          bonne: 0,
          expliquer: [
            "Exact : c'est le modèle du cours, V = {v₁, v₂, …, v₇}, où vᵢ est la couleur de la région i.",
            "Les frontières sont connues : elles font partie des données. Elles serviront à écrire les contraintes.",
            "Le nombre de couleurs (3) est une donnée de l'instance, pas une inconnue.",
            "Les numéros sont connus : ce sont des noms, pas des inconnues."
          ],
          surReussite: function () { api.valider("V = {v₁, …, v₇} : une variable par région."); }
        });
      }
    },

    /* 3 ─────────────────────────────────────────────────────────── */
    {
      titre: "Les valeurs possibles deviennent les domaines",
      texte:
        "<p>Deuxième question du cours : <b>quelles sont les valeurs possibles</b> de chaque variable ?</p>",
      objectif: "Donner le domaine de chaque variable.",
      installer: function (zone, api) {
        Exercices.choix(zone, {
          question: "D₁ = D₂ = … = D₇ =",
          options: ["{1, 2, …, 7}", "{bleu, rose, vert}", "{0, 1}", "{bleu, rose, vert, « pas de couleur »}"],
          bonne: 1,
          expliquer: [
            "Ce sont les numéros des régions, pas les valeurs que peut prendre une couleur.",
            "Exact : D₁ = … = D₇ = {bleu, rose, vert}. Toutes les variables ont ici le même domaine.",
            "{0, 1} servirait pour des variables « appartenance » (comme xᵢ dans le sac à dos), pas ici.",
            "Toutes les régions doivent être coloriées : « pas de couleur » n'est pas une valeur permise."
          ],
          surReussite: function () { api.valider("Dᵢ = {bleu, rose, vert}, noté {B, R, V} dans la suite."); }
        });
      }
    },

    /* 4 ─────────────────────────────────────────────────────────── */
    {
      titre: "Les règles deviennent les contraintes",
      texte:
        "<p>Une contrainte relie des variables. Ici, chaque <b>frontière</b> entre deux régions i et j donne une contrainte v<sub>i</sub> ≠ v<sub>j</sub>.</p>" +
        "<p>Touche deux régions qui se touchent pour écrire leur contrainte (la première touchée s'entoure en couleur).</p>",
      objectif: "Écrire les 10 contraintes du cours.",
      installer: function (zone, api) {
        var trouvees = {};
        var premiere = null;
        var c = new Carte(cadre(zone), { onRegion: toucher, legende: false });
        var liste = html(zone, "", "legende-figure");
        function n() { return Object.keys(trouvees).length; }
        function maj() {
          var cl = {};
          if (premiere) cl[premiere] = "courante";
          c.dessiner({ classes: cl });
          var ordre = F.filter(function (f) { return trouvees[cle(f[0], f[1])]; });
          liste.innerHTML = "<span>" + n() + " / 10</span>" + ordre.map(function (f) {
            return "<span class='mono'>C" + (F.indexOf(f) + 1) + " : " + contrainte(f) + "</span>";
          }).join("");
        }
        function toucher(r) {
          if (api.estAtteint() && !api.dejaFaite) return;
          if (premiere === null) { premiere = r; maj(); return; }
          if (premiere === r) { premiere = null; maj(); return; }
          var a = premiere, b = r;
          premiere = null;
          if (!Carte.voisins(a, b)) {
            api.retour("Les régions " + a + " et " + b + " ne se touchent pas : aucune contrainte entre v" + a + " et v" + b + ". Elles peuvent avoir la même couleur.", false);
          } else if (trouvees[cle(a, b)]) {
            api.retour("v" + Math.min(a, b) + " ≠ v" + Math.max(a, b) + " est déjà écrite.", null);
          } else {
            trouvees[cle(a, b)] = true;
            api.retour("Nouvelle contrainte : v" + Math.min(a, b) + " ≠ v" + Math.max(a, b) + ".", true);
          }
          maj();
          if (n() === 10) {
            api.retour("Les 10 contraintes C1 … C10 du cours.", true);
            api.valider("C = {C1, …, C10}. Il n'y a de contrainte qu'entre voisines.");
          }
        }
        maj();
        html(zone,
          "<div class='signalement'>Dans la carte du cours, les régions 6 et 7 sont reliées par la contrainte C10 : v₆ ≠ v₇. Je les ai donc dessinées en contact. " +
          "Dans le cours « Programmation par contraintes », la slide 8 donne une autre liste (C2 : v₁ ≠ v₃, C7 : v₃ ≠ v₆…) : c'est une autre numérotation des régions. La liste de cette leçon est celle de « Modélisation », qui correspond à la figure.</div>");
      }
    },

    /* 5 ─────────────────────────────────────────────────────────── */
    {
      titre: "Une solution : tout affecter, tout satisfaire",
      texte:
        "<p>Une <b>solution</b> donne une valeur de son domaine à chaque variable et satisfait <b>toutes</b> les contraintes.</p>" +
        "<p>Touche une région pour changer sa couleur (B → R → V → aucune). Les régions en conflit ont un contour en tirets.</p>",
      objectif: "Colorier les 7 régions sans aucune contrainte violée.",
      installer: function (zone, api) {
        var val = {};
        var CYCLE = ["B", "R", "V", null];
        var c = new Carte(cadre(zone), { onRegion: toucher });
        var info = html(zone, "", "legende-figure");
        function maj() {
          var conf = Carte.conflits(val);
          var cl = {};
          conf.forEach(function (f) { cl[f[0]] = cl[f[1]] = "conflit"; });
          c.dessiner({ valeurs: val, classes: cl });
          var nb = Object.keys(val).filter(function (k) { return val[k]; }).length;
          info.innerHTML = "<span>affectées : <span class='mono'>" + nb + " / 7</span></span>" +
            "<span>contraintes violées : <span class='mono'>" + conf.length + "</span></span>" +
            (conf.length ? "<span class='mono'>" + conf.map(contrainte).join(", ") + "</span>" : "");
          if (nb === 7 && conf.length === 0) {
            api.retour("v₁…v₇ = " + [1, 2, 3, 4, 5, 6, 7].map(function (k) { return val[k]; }).join(", ") + " : toutes les contraintes sont satisfaites.", true);
            api.valider("C'est une solution. Il y en a d'autres : permuter les couleurs en donne déjà 6 fois plus.");
          } else if (nb === 7) {
            api.retour("Tout est affecté, mais " + conf.length + " contrainte" + (conf.length > 1 ? "s sont violées" : " est violée") + " : ce n'est pas une solution.", false);
          } else {
            api.retour("", null);
          }
        }
        function toucher(r) {
          var i = CYCLE.indexOf(val[r] || null);
          val[r] = CYCLE[(i + 1) % CYCLE.length];
          maj();
        }
        maj();
      }
    },

    /* 6 ─────────────────────────────────────────────────────────── */
    {
      titre: "L'espace de recherche",
      texte:
        "<p>La méthode la plus naïve du cours, <b>générer et tester</b>, énumère toutes les affectations possibles et vérifie chacune. " +
        "Combien y en a-t-il ? Chaque variable prend une valeur de son domaine, indépendamment des autres :</p>" +
        "<div class='formule'>|D₁| × |D₂| × … × |D₇|</div>",
      objectif: "Calculer la taille de l'espace de recherche de ce modèle.",
      installer: function (zone, api) {
        Exercices.nombre(zone, {
          label: "Nombre d'affectations =",
          attendu: 2187,
          placeholder: "un entier",
          indice: "7 variables, 3 valeurs chacune : 3 × 3 × … × 3 (7 fois).",
          bravo: "3⁷ = 2 187 affectations, dont seules quelques-unes sont des solutions.",
          surReussite: function () {
            api.valider("Espace de recherche = 3⁷ = 2 187. Les contraintes ne le changent pas : elles disent seulement quelles affectations sont des solutions.");
          }
        });
        html(zone,
          "<div class='signalement'>Le cours n'a pas de définition écrite de l'« espace de recherche », alors que les annales le demandent à chaque exercice. " +
          "La définition utilisée ici (le produit des tailles des domaines) est celle qu'appliquent ses exemples : 2ⁿ pour n interrupteurs, " +
          "et 9² × 10⁶ = 81 000 000 feuilles pour SEND + MORE = MONEY (deux lettres dans [1, 9], six dans [0, 9]).</div>");
      }
    },

    /* 7 ─────────────────────────────────────────────────────────── */
    {
      titre: "Et avec 2 couleurs ? Décision puis optimisation",
      texte:
        "<p>« Peut-on colorier cette carte avec <b>2</b> couleurs ? » est un <b>problème de décision</b> (réponse oui ou non). " +
        "« Quel est le nombre <b>minimum</b> de couleurs ? » est un <b>problème d'optimisation</b>.</p>" +
        "<p>Pour répondre non à la question de décision, il suffit de trouver 3 régions qui se touchent toutes deux à deux : elles demandent 3 couleurs différentes.</p>",
      objectif: "Trouver 3 régions voisines deux à deux, puis conclure.",
      installer: function (zone, api) {
        var choisies = [];
        var fini = false;
        var c = new Carte(cadre(zone), { onRegion: toucher, legende: false });
        var info = html(zone, "", "legende-figure");
        var suite = el("div");
        zone.appendChild(suite);
        function maj() {
          var cl = {};
          choisies.forEach(function (r) { cl[r] = fini ? "choisie" : "courante"; });
          c.dessiner({ classes: cl });
          info.innerHTML = "<span>choisies : <span class='mono'>{" + choisies.map(function (r) { return "v" + r; }).join(", ") + "}</span></span>";
        }
        function toucher(r) {
          if (fini) return;
          var i = choisies.indexOf(r);
          if (i >= 0) choisies.splice(i, 1); else if (choisies.length < 3) choisies.push(r);
          maj();
          if (choisies.length < 3) { api.retour("", null); return; }
          var a = choisies[0], b = choisies[1], d = choisies[2];
          var manque = [[a, b], [a, d], [b, d]].filter(function (p) { return !Carte.voisins(p[0], p[1]); });
          if (manque.length) {
            api.retour("v" + manque[0][0] + " et v" + manque[0][1] + " ne se touchent pas : elles pourraient avoir la même couleur. Retouche une région pour la retirer.", false);
            return;
          }
          fini = true;
          maj();
          api.retour("v" + a + ", v" + b + ", v" + d + " se touchent deux à deux : avec 2 couleurs, deux d'entre elles auraient la même. Réponse : non.", true);
          Exercices.choix(suite, {
            question: "Tu as trouvé une solution à 3 couleurs à l'étape 5. Le nombre minimum de couleurs est donc :",
            options: ["2", "3", "on ne peut pas savoir sans tout énumérer", "7"],
            bonne: 1,
            expliquer: [
              "Non : tu viens de prouver que 2 couleurs ne suffisent pas.",
              "Exact : une solution à 3 couleurs existe, et la question « existe-t-il une solution à 2 couleurs ? » a pour réponse non. C'est la preuve d'optimalité.",
              "Les deux faits suffisent : une solution de valeur 3, et la preuve qu'il n'en existe pas de valeur inférieure.",
              "7 couleurs marcheraient, mais on cherche le minimum."
            ],
            surReussite: function () {
              api.valider("Optimum = 3, prouvé par une suite de problèmes de décision (cours d'introduction).");
            }
          });
        }
        maj();
      }
    },

    /* 8 ─────────────────────────────────────────────────────────── */
    {
      titre: "Le modèle complet",
      texte:
        "<div class='encadre'><span class='titre-encadre'>Coloriage de carte</span>" +
        "<span class='mono'>V = {v₁, …, v₇}</span><br>" +
        "<span class='mono'>D₁ = … = D₇ = {B, R, V}</span><br>" +
        "<span class='mono'>C = { v₁≠v₂, v₁≠v₄, v₂≠v₃, v₂≠v₄, v₃≠v₄, v₃≠v₅, v₄≠v₅, v₄≠v₆, v₅≠v₆, v₆≠v₇ }</span></div>" +
        "<p>À l'examen, on demande souvent : le modèle, puis l'espace de recherche, puis une solution.</p>",
      objectif: "Répondre juste aux 5 affirmations.",
      installer: function (zone, api) {
        Exercices.vraiFaux(zone, {
          items: [
            { texte: "Ajouter la contrainte v₁ ≠ v₃ change l'espace de recherche.", vrai: false, explication: "L'espace ne dépend que des variables et des domaines. Une contrainte en plus retire des solutions, pas des affectations." },
            { texte: "Avec 4 couleurs, l'espace de recherche passe à 4⁷.", vrai: true, explication: "Chaque domaine a 4 valeurs : 4⁷ = 16 384." },
            { texte: "Une affectation qui viole une seule contrainte est une solution approchée acceptée par le CSP.", vrai: false, explication: "Une solution satisfait toutes les contraintes. (Compter les contraintes violées servira en recherche locale.)" },
            { texte: "Le second modèle de SEND + MORE ajoute 4 retenues binaires : son espace de recherche est 2⁴ fois plus grand.", vrai: true, explication: "2⁴ × 9² × 10⁶ = 1 296 000 000, contre 81 000 000 (cours)." },
            { texte: "Les données de l'instance (la carte) servent à écrire les contraintes.", vrai: true, explication: "Les frontières ne sont pas des variables : elles déterminent quelles contraintes vᵢ ≠ vⱼ on écrit." }
          ],
          surReussite: function () { api.valider("Modèle, espace de recherche, solution : la méthode de l'examen."); }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "problem-solving",
    id: "modeliser-csp",
    etapes: etapes,
    fin: {
      texte:
        "<p>À retenir :</p><ul>" +
        "<li>Un modèle = <b>V</b> (les inconnues), <b>D</b> (leurs valeurs possibles), <b>C</b> (les règles).</li>" +
        "<li>Les données de l'instance (carte, couleurs) servent à écrire D et C ; elles ne sont pas des variables.</li>" +
        "<li>Une solution affecte toutes les variables et satisfait toutes les contraintes.</li>" +
        "<li>Espace de recherche = produit des tailles des domaines (ici 3⁷ = 2 187).</li>" +
        "<li>Optimum = une solution de valeur k et la preuve qu'aucune n'est de valeur &lt; k.</li></ul>" +
        "<p>Pour t'exercer sur des grilles comme à l'examen : l'atelier « Modéliser comme à l'examen ».</p>",
      cartes: "modelisation"
    }
  });
})();
