/* Leçon : Le passage de messages (cours 6 « Graph Neural Networks », diapos 2 à 24).
   Fil rouge : le graphe à 4 nœuds de la diapo 4 (arêtes 1–2, 1–3, 1–4, 2–3, 3–4), redessiné, avec une caractéristique
   scalaire par nœud inventée pour la leçon : h = (1, 2, 4, 3). */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  var S = [{ id: "1", x: 70, y: 45 }, { id: "2", x: 250, y: 45 }, { id: "3", x: 250, y: 145 }, { id: "4", x: 70, y: 145 }];
  var AR = [["1", "2"], ["1", "3"], ["1", "4"], ["2", "3"], ["3", "4"]];
  var ADJ = [[0, 1, 1, 1], [1, 0, 1, 0], [1, 1, 0, 1], [1, 0, 1, 0]];
  var H0 = [1, 2, 4, 3];
  function voisins(i) { return ADJ[i].map(function (v, j) { return v ? j : -1; }).filter(function (j) { return j >= 0; }); }
  function pasMoyenne(h) { return h.map(function (hi, i) { var v = voisins(i); var m = v.reduce(function (s, j) { return s + h[j]; }, 0) / v.length; return 0.5 * hi + 0.5 * m; }); }
  function figure(zone, sous, classes, onSommet) {
    var fig = new FigureGraphe(A.cadre(zone), { largeur: 320, hauteur: 190, titre: "Graphe à 4 nœuds", onSommet: onSommet });
    fig.dessiner({
      sommets: S.map(function (s, i) { return { id: s.id, x: s.x, y: s.y, label: s.id, sous: sous ? sous[i] : undefined, classe: classes ? classes[i] : "" }; }),
      aretes: AR.map(function (a, k) { return { id: "a" + k, u: a[0], v: a[1] }; })
    });
    return fig;
  }

  Lecon.demarrer({
    matiere: "ai-models",
    id: "passage-messages",
    etapes: [

      /* 1 ─────────────────────────────────────────────── */
      {
        titre: "Pourquoi des graphes ?",
        texte: "<p>Intuition du cours : un GNN est utile quand les <b>relations</b> contiennent un signal auquel un modèle qui ne voit que les caractéristiques n'accède pas directement.</p>",
        objectif: "Classer les données en structure régulière ou relations irrégulières.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["structure régulière", "relations irrégulières"],
            items: [
              { texte: "Image : grille de pixels", bonne: 0 }, { texte: "Personnes et amitiés", bonne: 1 },
              { texte: "Texte : suite de tokens", bonne: 0 }, { texte: "Atomes et liaisons", bonne: 1 },
              { texte: "Routes et intersections", bonne: 1 }, { texte: "Série temporelle", bonne: 0 }
            ],
            surReussite: function () { api.valider("CNN : grille ; RNN : séquence ; GNN : graphe de taille et de forme variables."); }
          });
        }
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        titre: "Adjacence et degrés",
        texte: "<p>Un graphe <span class='mono'>G = (V, E)</span>, n = |V| nœuds, m = |E| arêtes. Caractéristiques des nœuds : <span class='mono'>X ∈ ℝ^(n×F)</span>, la ligne xᵢ décrit le nœud i. " +
          "Matrice d'adjacence : <span class='mono'>A_ij = 1</span> si l'arête (i, j) existe, 0 sinon. Degré : <span class='mono'>dᵢ = Σⱼ A_ij</span>.</p>" +
          "<p>Les lignes de X doivent suivre le même ordre de nœuds que A et les étiquettes.</p>",
        objectif: "Compléter la ligne du nœud 2 de A, puis donner le degré du nœud 1.",
        installer: function (zone, api) {
          figure(zone);
          var bons = 0;
          var mx = new Matrice(A.cadre(zone), { nom: "A", lignes: ["1", "2", "3", "4"], colonnes: ["1", "2", "3", "4"], onSaisie: function (i, j, t) {
            var ok = [0, 1, 2, 3].every(function (k) { return mx.lire(1, k) !== null && Exercices.lireNombre(mx.lire(1, k)) === ADJ[1][k]; });
            if (ok && !bons) { bons = 1; suite(); }
          } });
          var vals = ADJ.map(function (l, i) { return i === 1 ? ["", "", "", ""] : l.slice(); });
          mx.dessiner(vals, { format: String, editables: { "1,0": true, "1,1": true, "1,2": true, "1,3": true } });
          function suite() {
            var b = el("div"); zone.appendChild(b);
            Exercices.nombre(b, { label: "d₁ =", attendu: 3, placeholder: "ex. 2", surReussite: function () { api.valider("Ligne 2 : (1, 0, 1, 0). Degrés : 3, 2, 3, 2. Graphe non orienté : A est symétrique (A = Aᵀ)."); } });
          }
        }
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        titre: "Que prédit-on ?",
        texte: "<p>Variantes : orienté ou non, pondéré ou non, homogène ou hétérogène, statique ou temporel. Et l'unité de prédiction : un nœud, une arête, ou le graphe entier.</p>",
        objectif: "Rattacher chaque tâche à son niveau.",
        installer: function (zone, api) {
          Exercices.associer(zone, {
            categories: ["nœud", "arête", "graphe"],
            items: [
              { texte: "Classer un article ou un utilisateur", bonne: 0 }, { texte: "Prédire un lien ou une interaction", bonne: 1 },
              { texte: "Prédire une propriété d'une molécule", bonne: 2 }, { texte: "Recommander un article à un utilisateur (lien utilisateur–article)", bonne: 1 },
              { texte: "Thème d'un article de Cora", bonne: 0 }
            ],
            surReussite: function () { api.valider("Molécule : nœuds = atomes, arêtes = liaisons, prédiction au niveau du graphe (avec un readout)."); }
          });
        }
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        titre: "L'ordre des nœuds est arbitraire",
        texte: "<p>Si l'on renumérote les nœuds avec une matrice de permutation P : <span class='mono'>X′ = PX</span>, <span class='mono'>A′ = PAPᵀ</span>.</p>" +
          "<div class='formule lignes'>nœud (équivariance) : f(PAPᵀ, PX) = P f(A, X)\ngraphe (invariance) : g(PAPᵀ, PX) = g(A, X)</div>",
        objectif: "Classer les affirmations.",
        installer: function (zone, api) {
          Exercices.vraiFaux(zone, {
            items: [
              { texte: "Un GNN au niveau des nœuds doit permuter ses sorties comme les nœuds.", vrai: true },
              { texte: "La prédiction d'une propriété d'une molécule ne doit pas dépendre de la numérotation des atomes.", vrai: true },
              { texte: "Somme, moyenne et maximum des voisins ne dépendent pas de l'ordre dans lequel on présente les voisins.", vrai: true },
              { texte: "Concaténer les voisins dans l'ordre de leurs numéros est une agrégation acceptable.", vrai: false, explication: "Le résultat changerait avec la numérotation." }
            ],
            surReussite: function () { api.valider("D'où des agrégateurs invariants par permutation : somme, moyenne, max."); }
          });
        }
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        titre: "Un pas de passage de messages",
        texte: "<div class='formule lignes'>mᵢ = AGG_(j ∈ N(i)) φ(hᵢ, hⱼ, eᵢⱼ)\nh′ᵢ = ψ(hᵢ, mᵢ)</div>" +
          "<p>φ : fonction de message ; AGG : réduction invariante par permutation ; ψ : mise à jour. Un voisinage de taille variable devient un vecteur de taille fixe. " +
          "Pas jouet (comme dans l'exemple du cours) : <span class='mono'>mᵢ = moyenne des hⱼ voisins</span>, <span class='mono'>h′ᵢ = 0,5 hᵢ + 0,5 mᵢ</span>. Ici h = (1, 2, 4, 3).</p>",
        objectif: "Calculer m₁ et h′₁, puis h′₂.",
        installer: function (zone, api) {
          figure(zone, H0.map(function (v) { return "h=" + v; }), ["courant", "", "", ""]);
          var H1 = pasMoyenne(H0);
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "m₁ =", attendu: 3, placeholder: "ex. 2", indice: "Voisins de 1 : 2, 3, 4.", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "h′₁ =", attendu: H1[0], placeholder: "ex. 2", surReussite: ok }); },
            function (b, ok) { Exercices.nombre(b, { label: "h′₂ =", attendu: H1[1], tolerance: 1e-6, placeholder: "ex. 2", indice: "Voisins de 2 : 1 et 3.", surReussite: ok }); }
          ], "Un pas jouet, pas un modèle entraîné : les vraies couches apprennent leurs paramètres (par exemple h′ᵢ = ReLU(W [hᵢ ‖ mᵢ] + b)).");
        }
      },

      /* 6 ─────────────────────────────────────────────── */
      {
        titre: "L couches = L sauts",
        texte: "<p>En répétant L couches, chaque nœud intègre de l'information jusqu'à L sauts de distance.</p>",
        objectif: "Dire de quels nœuds vient l'information reçue par le nœud 2.",
        installer: function (zone, api) {
          figure(zone, null, ["", "courant", "", ""]);
          A.enchainer(zone, api, [
            function (b, ok) { A.cocher(b, { question: "Après 1 couche, h′₂ dépend de… (plusieurs réponses)", options: ["h₁", "h₂", "h₃", "h₄"], bonnes: [0, 1, 2], explication: "Lui-même et ses voisins 1 et 3.", surReussite: ok }); },
            function (b, ok) { A.cocher(b, { question: "Après 2 couches, h″₂ dépend de…", options: ["h₁", "h₂", "h₃", "h₄"], bonnes: [0, 1, 2, 3], explication: "4 est à 2 sauts (via 1 ou 3).", surReussite: ok }); }
          ], "Ici 2 couches suffisent à mélanger tout le graphe.");
        }
      },

      /* 7 ─────────────────────────────────────────────── */
      {
        titre: "Trop de couches : over-smoothing",
        texte: "<p>Répéter la moyenne des voisins peut effacer les différences entre nœuds : leurs représentations deviennent semblables. Règle le nombre de couches.</p>",
        objectif: "Trouver à partir de combien de couches tous les hᵢ sont à moins de 0,05 les uns des autres.",
        installer: function (zone, api) {
          var hs = [H0]; for (var k = 0; k < 20; k++) hs.push(pasMoyenne(hs[hs.length - 1]));
          var seuil = hs.findIndex(function (h) { return Math.max.apply(null, h) - Math.min.apply(null, h) < 0.05; });
          var box = el("div"); zone.appendChild(box);
          var info = A.legende(zone);
          function maj(L) {
            box.innerHTML = ""; figure(box, hs[L].map(function (v) { return "h=" + A.fmt(v, 2); }));
            var e = Math.max.apply(null, hs[L]) - Math.min.apply(null, hs[L]);
            info.innerHTML = "<span>L = <span class='mono'>" + L + "</span></span><span>écart max − min = <span class='mono'>" + A.fmt(e, 3) + "</span></span>";
          }
          A.curseur(zone, { label: "couches L", min: 0, max: 20, pas: 1, valeur: 0, format: String, surChange: maj });
          maj(0);
          A.enchainer(zone, api, [
            function (b, ok) { Exercices.nombre(b, { label: "Plus petit L avec un écart < 0,05 :", attendu: seuil, placeholder: "ex. 5", surReussite: ok }); },
            function (b, ok) {
              Exercices.associer(b, { categories: ["over-smoothing", "over-squashing", "hétérophilie"], items: [
                { texte: "Trop de mélange : tous les nœuds se ressemblent", bonne: 0 },
                { texte: "Beaucoup de signaux lointains compressés par un goulot du graphe", bonne: 1 },
                { texte: "Des nœuds de classes différentes sont reliés : lisser nuit", bonne: 2 }
              ], surReussite: ok });
            }
          ], "Remèdes cités : moins de couches, connexions résiduelles, normalisation, jumping knowledge (over-smoothing) ; rewiring, nœuds virtuels, attention (over-squashing). Choisir l'architecture selon le graphe et la tâche, pas selon la mode.");
        }
      }
    ],
    fin: { texte: "<p>À retenir : <span class='mono'>mᵢ = AGG_(j∈N(i)) φ(hᵢ, hⱼ, eᵢⱼ)</span>, <span class='mono'>h′ᵢ = ψ(hᵢ, mᵢ)</span> ; AGG invariant par permutation ; L couches = L sauts ; trop de couches → over-smoothing.</p>", cartes: "gnn" }
  });
})();
