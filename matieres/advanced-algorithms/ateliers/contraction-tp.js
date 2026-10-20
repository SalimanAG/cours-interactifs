/* Atelier : contraction pas à pas et implémentation du TP1 (« péridurale »).
   Le graphe n'est jamais modifié : chaque sommet porte l'identifiant de son groupe,
   on unit les groupes (en réétiquetant le plus petit), et on parcourt les arêtes
   dans un ordre aléatoire fixé à l'avance en rejetant celles qui ont disparu.
   Fil rouge : le graphe « Exemple » du cours 2, sommets a…f (= 0…5 dans le TP). */
(function () {
  "use strict";
  var el = Site.el;
  var G = Contraction.EXEMPLE;
  var IDS = G.sommets.map(function (s) { return s.id; });
  var n = IDS.length, m = G.aretes.length;

  /* Structures du TP1 : groupe[v], sommets_du_groupe[g], taille_groupe[g] */
  function Groupes() { this.reinit(); }
  Groupes.prototype.reinit = function () {
    var self = this;
    this.groupe = {}; this.sommets = {}; this.taille = {}; this.reetiquetes = 0; this.contractions = 0;
    IDS.forEach(function (v) { self.groupe[v] = v; self.sommets[v] = [v]; self.taille[v] = 1; });
  };
  /* contraction_simulee(u, v) : renvoie { petit, grand, deplaces } ou null si même groupe */
  Groupes.prototype.contracter = function (u, v) {
    var gu = this.groupe[u], gv = this.groupe[v];
    if (gu === gv) return null;
    var petit = gu, grand = gv;
    if (this.taille[gu] > this.taille[gv]) { petit = gv; grand = gu; }
    var self = this, dep = this.sommets[petit].slice();
    dep.forEach(function (x) { self.groupe[x] = grand; });
    this.reetiquetes += dep.length;
    this.sommets[grand] = this.sommets[grand].concat(dep);
    this.taille[grand] += this.taille[petit];
    this.sommets[petit] = []; this.taille[petit] = 0;
    this.contractions++;
    return { petit: petit, grand: grand, deplaces: dep };
  };
  Groupes.prototype.valeurCoupe = function () {
    var g = this.groupe;
    return G.aretes.filter(function (a) { return g[a.u] !== g[a.v]; }).length;
  };

  function melange(alea) { // Fisher-Yates, comme dans le sujet du TP1
    var t = G.aretes.slice();
    for (var i = 0; i < t.length - 1; i++) {
      var j = i + Math.floor((alea || Math.random)() * (t.length - i));
      var x = t[i]; t[i] = t[j]; t[j] = x;
    }
    return t;
  }

  function cadre(zone) { var c = el("div", "cadre-figure"); zone.appendChild(c); return c; }
  function figure(zone, opts) { return new FigureGraphe(cadre(zone), Object.assign({ largeur: 320, hauteur: 185 }, opts || {})); }
  function vue(Gr, classeA, classeS) {
    return {
      sommets: G.sommets.map(function (s) { return { id: s.id, x: s.x, y: s.y, label: s.id, sous: "g=" + Gr.groupe[s.id], classe: classeS ? classeS(s.id) : "" }; }),
      aretes: G.aretes.map(function (a) {
        return { id: a.id, u: a.u, v: a.v, classe: (Gr.groupe[a.u] === Gr.groupe[a.v] ? "estompee" : "") + (classeA ? " " + classeA(a) : "") };
      })
    };
  }
  function tableaux(zone) {
    var w = el("div", "defile-x"); var t = el("table", "table-pd"); w.appendChild(t); zone.appendChild(w);
    return function (Gr, surligne) {
      var h = "<tr><th>v</th>", g = "<tr><th>groupe[v]</th>", s = "<tr><th>sommets_du_groupe</th>", ta = "<tr><th>taille_groupe</th>";
      IDS.forEach(function (v) {
        h += "<th>" + v + "</th>";
        g += "<td class='" + (surligne && surligne.indexOf(v) >= 0 ? "courante" : "") + "'>" + Gr.groupe[v] + "</td>";
        s += "<td>" + (Gr.sommets[v].length ? Gr.sommets[v].join("") : "∅") + "</td>";
        ta += "<td>" + Gr.taille[v] + "</td>";
      });
      t.innerHTML = h + "</tr>" + g + "</tr>" + s + "</tr>" + ta + "</tr>";
    };
  }

  var etapes = [
    {
      titre: "Trois tableaux pour les groupes",
      texte: "<p>Dans le TP1, on <b>simule</b> les contractions sans toucher au graphe. Chaque sommet a l'identifiant de son groupe (toujours l'identifiant d'un sommet du groupe) ; " +
        "contracter une arête = faire l'union des groupes de ses deux extrémités. Trois tableaux de taille n : <code>groupe[v]</code>, <code>sommets_du_groupe[g]</code>, " +
        "<code>taille_groupe[g]</code>. Pour la complexité, on ne change que les identifiants des sommets du <b>plus petit</b> groupe.</p>" +
        "<p>Touche des arêtes pour les contracter. Les cases de <code>groupe[]</code> modifiées sont en couleur.</p>",
      objectif: "Réaliser une contraction entre deux groupes de tailles différentes.",
      installer: function (zone, api) {
        var Gr = new Groupes();
        var maj;
        var fig = figure(zone, {
          onArete: function (id) {
            var a = G.aretes.filter(function (x) { return x.id === id; })[0];
            var r = Gr.contracter(a.u, a.v);
            if (!r) { api.retour("groupe[" + a.u + "] = groupe[" + a.v + "] : cette arête a déjà disparu (elle est interne à un groupe).", false); return; }
            maj(r.deplaces);
            var tp = Gr.taille[r.grand] - r.deplaces.length;
            if (r.deplaces.length < tp) {
              api.retour("Groupe " + r.petit + " (taille " + r.deplaces.length + ") versé dans le groupe " + r.grand + " (taille " + tp + ") : " + (r.deplaces.length > 1 ? "seuls " + r.deplaces.join(", ") + " changent" : "seul " + r.deplaces[0] + " change") + " d'identifiant.", true);
              api.valider("On n'a réétiqueté que le plus petit groupe. Les listes sommets_du_groupe se concatènent en O(1) (pointeurs prem et dern).");
            } else api.retour("Union de deux groupes de même taille (" + tp + ") : " + r.deplaces.join(", ") + " change(nt) d'identifiant. Essaie avec des tailles différentes.", null);
          }
        });
        var afficher = tableaux(zone);
        var b = el("button", "btn btn-petit", "Recommencer"); b.type = "button";
        b.onclick = function () { Gr.reinit(); api.retour("", null); maj(); };
        zone.appendChild(b);
        maj = function (sur) { fig.dessiner(vue(Gr)); afficher(Gr, sur); fig.activerAretes(Gr.contractions < n - 2); };
        maj();
      }
    },

    {
      titre: "Pourquoi le plus petit groupe ?",
      texte: "<p>Question 7 du TP : complexité totale de toutes les unions d'une exécution, avec cette règle. " +
        "Lance des exécutions complètes et compare le nombre total de réétiquetages à n log₂ n.</p>",
      objectif: "Donner la complexité totale des unions.",
      installer: function (zone, api) {
        var info = el("p", "legende-figure");
        var b = el("button", "btn btn-petit", "1000 exécutions"); b.type = "button";
        b.onclick = function () {
          var Gr = new Groupes(), max = 0, tot = 0;
          for (var k = 0; k < 1000; k++) {
            Gr.reinit();
            var pi = melange();
            for (var i = 0; i < pi.length && Gr.contractions < n - 2; i++) Gr.contracter(pi[i].u, pi[i].v);
            tot += Gr.reetiquetes; max = Math.max(max, Gr.reetiquetes);
          }
          info.innerHTML = "<span>réétiquetages : moyenne <span class='mono'>" + (tot / 1000).toFixed(2) + "</span>, maximum <span class='mono'>" + max + "</span></span>" +
            "<span>n log₂ n = <span class='mono'>" + (n * Math.log(n) / Math.LN2).toFixed(1) + "</span></span>";
        };
        zone.appendChild(b); zone.appendChild(info);
        Exercices.choix(zone, {
          question: "Complexité totale des unions au cours d'une exécution de l'algorithme de contraction ?",
          options: ["O(n²)", "O(n log n)", "O(n)", "O(m)"],
          bonne: 1,
          expliquer: [
            "C'est le coût si l'on réétiquetait n'importe quel groupe (un sommet pourrait changer n − 2 fois).",
            "Exact : quand un sommet change d'identifiant, son groupe au moins double de taille ; il change donc au plus log₂ n fois. n sommets : O(n log n).",
            "Non : un même sommet peut être réétiqueté plusieurs fois.",
            "Non : les unions ne dépendent pas du nombre d'arêtes."
          ],
          surReussite: function () { api.valider(); }
        });
      }
    },

    {
      titre: "Un ordre aléatoire des arêtes",
      texte: "<p>Pour tirer uniformément une arête du multigraphe courant sans le représenter, on choisit d'emblée un <b>ordre aléatoire π</b> des m arêtes de G " +
        "(mélange : pour i de 0 à m − 1, on tire l'arête de la position i parmi les positions i à m − 1). Puis on parcourt π : si l'arête existe encore " +
        "dans le multigraphe, on la contracte ; sinon on la <b>rejette</b>. C'est toi qui décides, arête par arête.</p>",
      objectif: "Traiter l'ordre π jusqu'à n − 2 = 4 contractions, sans erreur à la fin.",
      installer: function (zone, api) {
        var Gr = new Groupes(), pi = [], k = 0;
        var fig = figure(zone, {});
        var afficher = tableaux(zone);
        var ordre = el("div", "memoire"); zone.appendChild(ordre);
        var rang = el("div", "rangee-btn");
        var bC = el("button", "btn btn-plein btn-petit", "Contracter"), bR = el("button", "btn btn-petit", "Rejeter"), bN = el("button", "btn btn-petit", "Nouvel ordre π");
        [bC, bR, bN].forEach(function (x) { x.type = "button"; rang.appendChild(x); });
        zone.appendChild(rang);
        function nouvel() { Gr.reinit(); pi = melange(); k = 0; api.retour("", null); maj(); }
        function courante() { return pi[k]; }
        function maj(sur) {
          var c = courante();
          fig.dessiner(vue(Gr, function (a) { return c && a.id === c.id && Gr.contractions < n - 2 ? "courante" : ""; }));
          afficher(Gr, sur);
          ordre.innerHTML = "";
          ordre.appendChild(el("span", "nom-memoire", "π ="));
          pi.forEach(function (a, i) { ordre.appendChild(el("span", "elt" + (i === k && Gr.contractions < n - 2 ? " tete-file" : ""), (i < k ? "" : "") + a.id)); if (i < k) ordre.lastChild.style.opacity = ".45"; });
          var fini = Gr.contractions >= n - 2;
          bC.disabled = bR.disabled = fini;
          if (fini) ordre.appendChild(el("span", "nom-memoire", " · " + Gr.contractions + " contractions"));
        }
        function decider(contracter) {
          var a = courante(); if (!a) return;
          var existe = Gr.groupe[a.u] !== Gr.groupe[a.v];
          if (contracter !== existe) {
            api.retour(existe ? "Non : groupe[" + a.u + "] = " + Gr.groupe[a.u] + " ≠ groupe[" + a.v + "] = " + Gr.groupe[a.v] + ", l'arête existe encore : on la contracte." :
              "Non : groupe[" + a.u + "] = groupe[" + a.v + "] = " + Gr.groupe[a.u] + ", l'arête a disparu (elle serait une boucle) : on la rejette.", false);
            return;
          }
          var r = existe ? Gr.contracter(a.u, a.v) : null;
          k++;
          maj(r ? r.deplaces : null);
          if (Gr.contractions >= n - 2) {
            api.retour("4 contractions : il reste 2 groupes. Arêtes examinées : " + k + " sur m = " + m + ".", true);
            api.valider("Question 11 : uv existe encore ssi groupe[u] ≠ groupe[v]. Question 10 : oui, ce procédé tire bien uniformément parmi les arêtes restantes — la première arête restante dans un ordre aléatoire uniforme est uniforme parmi elles.");
          } else api.retour(existe ? "Contractée." : "Rejetée.", null);
        }
        bC.onclick = function () { decider(true); };
        bR.onclick = function () { decider(false); };
        bN.onclick = nouvel;
        nouvel();
      }
    },

    {
      titre: "Valeur de la coupe et nombre d'itérations",
      texte: "<p>À la fin, il reste deux groupes. La valeur de la coupe (question 14) = le nombre d'arêtes de G dont les deux extrémités sont dans des groupes différents.</p>",
      objectif: "Calculer la valeur de la coupe, puis le nombre d'itérations N du TP (question 20).",
      installer: function (zone, api) {
        var Gr = new Groupes();
        var pi = melange();
        for (var i = 0; i < pi.length && Gr.contractions < n - 2; i++) Gr.contracter(pi[i].u, pi[i].v);
        var fig = figure(zone, {});
        fig.dessiner(vue(Gr, null, function (v) { return Gr.groupe[v] === Gr.groupe[IDS[0]] ? "plein" : ""; }));
        var afficher = tableaux(zone); afficher(Gr);
        Exercices.nombre(zone, {
          label: "valeur_coupe =", attendu: Gr.valeurCoupe(), tolerance: 0, placeholder: "arêtes",
          indice: "Compte les arêtes (non estompées) entre un sommet plein et un sommet vide.",
          bravo: "Exact.",
          surReussite: function () {
            Exercices.nombre(zone, {
              label: "N pour une probabilité ≥ 0,999 (n = 6) :", attendu: 15 * Math.log(1000), tolerance: 1.5, placeholder: "itérations",
              indice: "Le cours : t = log(1000) · n(n − 1)/2 exécutions donnent p ≥ 1 − 1/1000 (log népérien).",
              bravo: "N = ln(1000) × 15 ≈ 104. Pour les gros graphes du TP (roadNet-TX, youtube : plus d'un million de sommets), n(n − 1)/2 · ln 1000 est hors de portée : c'est l'objet des questions 21 et 22.",
              surReussite: function () { api.valider(); }
            });
          }
        });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "contraction-tp",
    etapes: etapes,
    fin: {
      cartes: "coupe-min",
      texte: "<div class='encadre'><span class='titre-encadre'>À retenir (TP1)</span><ul>" +
        "<li>groupe[v], sommets_du_groupe[g], taille_groupe[g] ; on réétiquette le plus petit groupe : O(n log n) pour toutes les unions.</li>" +
        "<li>Un ordre aléatoire π des arêtes (mélange) ; on rejette uv si groupe[u] = groupe[v].</li>" +
        "<li>n − 2 contractions effectives, puis valeur de la coupe = arêtes entre groupes différents.</li></ul></div>" +
        "<div class='signalement'>Ce qui précède suit le sujet du TP1 et ton corrigé ; la diapo « implémentation péridurale » du cours n'a qu'un titre.</div>"
    }
  });
})();
