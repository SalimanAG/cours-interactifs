/* Atelier : le tournoi de l'article « Face recognition by SVMs » (document 17 du cours).
   Fil rouge : une image requête à classer parmi 8 personnes numérotées 1 à 8 ; les valeurs des SVM sont inventées pour l'atelier. */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  /* Valeur f_ij(x) = wᵀx + θ du SVM qui oppose i à j (inventée) : > 0 → i gagne, < 0 → j gagne.
     Construite à partir d'un classement caché (5 est la vraie classe). */
  var RANG = { 1: 3, 2: 6, 3: 2, 4: 7, 5: 8, 6: 4, 7: 1, 8: 5 };
  function f(i, j) { var v = (RANG[i] - RANG[j]) * 0.41 + ((i * 7 + j * 3) % 5 - 2) * 0.03; return Math.round(v * 100) / 100; }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "tournoi-visages",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Le pipeline de l'article",
        texte: "<p>L'article reconnaît des visages avec des SVM linéaires. Chaque image est représentée par ses poids dans l'espace des <b>eigenfaces</b> (ACP), puis classée par des SVM à deux classes combinés.</p>",
        objectif: "Remettre les étapes dans l'ordre.",
        installer: function (zone, api) {
          Exercices.ordonner(zone, {
            consigne: "Du jeu d'entraînement à la réponse pour une image requête :",
            items: ["calculer les eigenfaces (ACP) sur l'entraînement", "projeter chaque image sur les eigenfaces", "entraîner un SVM linéaire pour chaque paire de personnes", "classer la requête par un tournoi en arbre binaire"],
            surReussite: function () { api.valider("L'article compare ensuite à la méthode standard des eigenfaces avec le plus proche centre (NCC) : mêmes caractéristiques, autre classifieur."); }
          });
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Un contre un, ou un contre tous ?",
        texte: "<p>Deux façons de construire un classifieur à c classes avec des SVM à deux classes : <b>un contre tous</b> (chaque classe contre toutes les autres) ou <b>un contre un</b> (chaque paire).</p>",
        objectif: "Choisir la stratégie de l'article et compter les SVM pour 8 personnes.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { A.choix(b, { question: "L'article adopte…", options: ["un contre un, car un contre tous mène souvent à une classification ambiguë", "un contre tous, car il demande moins de SVM", "un seul SVM à noyau RBF pour toutes les classes"], bonne: 0, surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Un contre un, c = 8 : nombre de SVM =", attendu: 28, placeholder: "ex. 8", indice: "c(c − 1)/2.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "Un contre tous, c = 8 : nombre de SVM =", attendu: 8, placeholder: "ex. 28", surReussite: ok }); }
          ], "Un contre un : c(c − 1)/2 SVM à l'entraînement.");
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Le tournoi, match par match",
        texte: "<p>Arbre binaire ascendant : on oppose les classes deux par deux, le « gagnant » de chaque paire monte au niveau supérieur, et la classe unique en haut est la réponse. " +
          "Le SVM qui oppose i à j renvoie <span class='mono'>f_ij(x) = wᵀx + θ</span> : positif → i gagne, négatif → j gagne.</p>",
        objectif: "Désigner le gagnant de chaque match jusqu'en haut de l'arbre.",
        installer: function (zone, api) {
          var niveaux = [[1, 2, 3, 4, 5, 6, 7, 8]], n = 0;
          var arbre = el("div"), q = el("div"), info = A.legende(zone);
          zone.appendChild(arbre); zone.appendChild(q);
          function dessiner() {
            var der = niveaux.length - 1, k = (niveaux._cours || []).length * 2;
            arbre.innerHTML = niveaux.map(function (niv, l) {
              return "<p class='mono' style='text-align:center;letter-spacing:.06em'>" + niv.map(function (c, i) {
                return (l === der && niv.length > 1 && (i === k || i === k + 1)) ? "<span style='color:var(--accent);font-weight:600'>" + c + "</span>" : c;
              }).join("  ") + "</p>"; }).reverse().join("");
          }
          function match() {
            dessiner();
            var niv = niveaux[niveaux.length - 1];
            if (niv.length === 1) { q.innerHTML = ""; info.textContent = n + " comparaisons."; api.valider("La requête est attribuée à la personne " + niv[0] + ", après " + n + " comparaisons = c − 1."); return; }
            var cours = niveaux._cours || (niveaux._cours = []);
            var k = cours.length * 2, i = niv[k], j = niv[k + 1], v = f(i, j);
            q.innerHTML = "";
            var p = el("p"); p.innerHTML = "Match " + i + " contre " + j + " : <span class='mono'>f_" + i + "" + j + "(x) = " + A.fmt(v) + "</span>"; q.appendChild(p);
            var r = el("div", "rangee-btn"); q.appendChild(r);
            [i, j].forEach(function (c) {
              var b = el("button", "btn", "gagnant : " + c); b.type = "button";
              b.onclick = function () {
                var bon = v > 0 ? i : j;
                if (c !== bon) { api.retour(A.fmt(v) + (v > 0 ? " > 0 : c'est " + i + " qui gagne." : " < 0 : c'est " + j + " qui gagne."), false); return; }
                api.retour(A.fmt(v) + (v > 0 ? " > 0 : " + i : " < 0 : " + j) + " monte.", true); n++; cours.push(bon);
                if (cours.length * 2 >= niv.length) { niveaux.push(cours.slice()); niveaux._cours = []; }
                match();
              };
              r.appendChild(b);
            });
            info.textContent = n + " comparaison(s) faite(s).";
          }
          match();
          A.note(zone, "Les valeurs f_ij sont inventées ; l'article dessine un arbre à 8 classes (sa figure 2) sans donner de valeurs.");
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "Un nombre quelconque de classes",
        texte: "<p>Pour c classes : c(c − 1)/2 SVM à l'entraînement, c − 1 comparaisons pour une requête. Si c n'est pas une puissance de 2, l'article décompose c en somme de puissances de 2, construit un arbre par terme, puis fait s'affronter les gagnants.</p>",
        objectif: "Faire les comptes pour la base ORL (40 personnes) et la base composite (137 personnes).",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "c = 40 : nombre de SVM =", attendu: 780, placeholder: "ex. 1600", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "c = 40 : comparaisons par requête =", attendu: 39, placeholder: "ex. 40", surReussite: ok }); },
            function (b, ok) { A.choix(b, { question: "Décomposition de 40 :", options: ["32 + 8", "16 + 16 + 8", "20 + 20", "32 + 4 + 4"], bonne: 0, surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "c = 137 : comparaisons par requête =", attendu: 136, placeholder: "ex. 137", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "c = 137 : nombre de SVM (paires) =", attendu: 9316, placeholder: "ex. 10000", surReussite: ok }); }
          ], "Chaque test calcule un seul produit scalaire et regarde son signe : c'est rapide malgré le nombre de comparaisons.");
          A.note(zone, "Pour c = 137, l'article annonce 18 632 paires, soit 137 × 136 : c'est le nombre de paires <i>ordonnées</i>. Avec un SVM par paire non ordonnée, c(c − 1)/2 = 9 316. " +
            "Il donne bien 136 comparaisons par requête. Pour c = 40, la décomposition 32 + 8 est l'exemple de l'article ; il précise que la décomposition n'est pas unique mais que le nombre de comparaisons vaut toujours c − 1.");
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Lire les résultats",
        texte: "<p>Base ORL : 400 images, 40 personnes ; 200 images (5 par personne) pour l'entraînement, 200 pour le test ; quatre tirages. Taux d'erreur minimum moyen : SVM <span class='mono'>3,0 %</span>, NCC <span class='mono'>5,25 %</span> ; le CNN de Lawrence et al. : <span class='mono'>3,83 %</span>. " +
          "Base composite (1 079 images, 137 personnes) : SVM <span class='mono'>8,79 %</span>, NCC <span class='mono'>15,14 %</span>.</p>",
        objectif: "Traduire les taux en nombres d'images et juger les conclusions.",
        installer: function (zone, api) {
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "ORL, 3,0 % d'erreur sur 200 images de test : images mal reconnues =", attendu: 6, placeholder: "ex. 10", surReussite: ok }); },
            function (b, ok) { Exercices.vraiFaux(b, { items: [
              { texte: "Les SVM et le NCC partent des mêmes caractéristiques (eigenfaces).", vrai: true },
              { texte: "Les SVM de l'article utilisent un noyau RBF.", vrai: false, explication: "Ce sont des SVM linéaires." },
              { texte: "Les taux sont tracés en fonction du nombre d'eigenfaces (dimension des caractéristiques).", vrai: true },
              { texte: "Sur la base composite, l'erreur du SVM est à peu près la moitié de celle du NCC.", vrai: true, explication: "8,79 % contre 15,14 %." }
            ], surReussite: ok }); }
          ], "Même représentation, meilleur classifieur : l'écart vient des fonctions de discrimination apprises par les SVM.");
          A.note(zone, "Le meilleur taux sur un seul des quatre tirages ORL est masqué par une annotation dans ton exemplaire de l'article ; il n'est pas repris ici.");
        }
      }
    ],
    fin: { texte: "<p>À retenir : eigenfaces + SVM linéaires un contre un, tournoi en arbre binaire ascendant ; c(c − 1)/2 SVM, c − 1 comparaisons par requête ; meilleure erreur que le NCC sur les mêmes caractéristiques.</p>", cartes: "svm" }
  });
})();
