/* Atelier : BFS et DFS sur ton propre graphe (prérequis).
   Le même banc d'essai sert aux 4 étapes ; le graphe modifié est conservé
   d'une étape à l'autre (pas entre deux visites de la page). */
(function () {
  "use strict";
  var el = Site.el;
  var base = Parcours.EXEMPLE;
  var graphe = { sommets: base.sommets.slice(), aretes: base.aretes.slice() };

  function cle(u, v) { return u < v ? u + v : v + u; }

  /* Construit le banc d'essai dans zone. surFin(e, algo, g) est appelé à la fin de chaque exécution. */
  function banc(zone, surFin, options) {
    options = options || {};
    var algo = options.algo || "BFS";
    var source = "a";
    var edition = false, premier = null;
    var trace = null;

    var outils = el("div", "rangee-btn");
    var selAlgo = el("select");
    ["BFS", "DFS"].forEach(function (a) { var o = el("option", null, a); o.value = a; selAlgo.appendChild(o); });
    selAlgo.value = algo;
    var lancer = el("button", "btn btn-plein btn-petit", "Lancer"); lancer.type = "button";
    var modif = el("button", "btn btn-petit", "Modifier le graphe"); modif.type = "button";
    var raz = el("button", "btn btn-petit", "Graphe d'origine"); raz.type = "button";
    var ligneSel = el("span", "saisie");
    ligneSel.appendChild(selAlgo);
    [ligneSel, lancer, modif, raz].forEach(function (x) { outils.appendChild(x); });
    zone.appendChild(outils);
    var aide = el("p", "discret petit");
    zone.appendChild(aide);

    var cadre = el("div", "cadre-figure");
    zone.appendChild(cadre);
    var fig = new FigureGraphe(cadre, { largeur: 350, hauteur: 200, onSommet: clicSommet });
    var info = el("p", "legende-figure");
    zone.appendChild(info);
    var mem = el("div", "memoire");
    zone.appendChild(mem);
    var ctl = new Controleur(zone, {
      delai: 400,
      afficher: function (i) { afficherEtat(trace[i]); },
      surFin: function () { var e = trace[trace.length - 1]; surFin(e, selAlgo.value, graphe); }
    });
    var pcZone = el("div");
    zone.appendChild(pcZone);
    var pc = null;

    function m() { return graphe.aretes.length; }
    function pseudo() {
      pcZone.innerHTML = "";
      pc = new PseudoCode(pcZone, selAlgo.value === "BFS" ?
        { titre: "BFS(G, s)", lignes: Parcours.BFS_LIGNES } : { titre: "DFS récursif", lignes: Parcours.DFS_LIGNES });
    }
    function textes() {
      aide.textContent = edition ?
        "Mode édition : touche deux sommets pour ajouter ou retirer l'arête entre eux." :
        "Touche un sommet pour en faire la source (actuellement " + source + "), puis « Lancer ».";
      modif.textContent = edition ? "Terminer la modification" : "Modifier le graphe";
    }
    function dessinBrut() {
      fig.dessiner({
        sommets: graphe.sommets.map(function (s) {
          return { id: s.id, x: s.x, y: s.y, label: s.id, classe: (edition && s.id === premier) || (!edition && s.id === source) ? "courant" : "" };
        }),
        aretes: graphe.aretes.map(function (a) { return { id: a.id, u: a.u, v: a.v }; })
      });
      info.innerHTML = "<span>n = <span class='mono'>" + graphe.sommets.length + "</span></span><span>m = <span class='mono'>" + m() + "</span></span><span>2m = <span class='mono'>" + 2 * m() + "</span></span>";
      mem.innerHTML = "";
    }
    function afficherEtat(e) {
      var bfs = selAlgo.value === "BFS";
      fig.dessiner({
        sommets: graphe.sommets.map(function (s) {
          var p = e.ordre.indexOf(s.id);
          var sous = bfs ? (e.dist[s.id] !== undefined ? "dist " + e.dist[s.id] : "") : (p >= 0 ? "n°" + (p + 1) : "");
          return { id: s.id, x: s.x, y: s.y, label: s.id, sous: sous, classe: s.id === e.courant ? "courant" : p >= 0 ? "plein" : "" };
        }),
        aretes: graphe.aretes.map(function (a) { return { id: a.id, u: a.u, v: a.v, classe: a.id === e.arete ? "courante" : "" }; })
      });
      pc.surligner(e.ligne);
      info.innerHTML = "<span>" + (bfs ? "défilés" : "marqués") + " : <span class='mono'>" + e.ordre.length + " / n = " + graphe.sommets.length + "</span></span>" +
        "<span>arêtes examinées : <span class='mono'>" + e.examinees + " / 2m = " + 2 * m() + "</span></span>";
      mem.innerHTML = "";
      mem.appendChild(el("span", "nom-memoire", bfs ? "F =" : "pile d'appels ="));
      if (!e.structure.length) mem.appendChild(el("span", "vide", "(vide)"));
      e.structure.forEach(function (x, i) {
        mem.appendChild(el("span", "elt" + (bfs && i === 0 ? " tete-file" : ""), bfs ? x : "DFS(" + x + ")"));
      });
      if (e === trace[trace.length - 1]) {
        mem.appendChild(el("span", "nom-memoire", " · ordre : " + e.ordre.join(", ")));
      }
    }
    function clicSommet(id) {
      if (edition) {
        if (!premier) { premier = id; dessinBrut(); return; }
        if (premier === id) { premier = null; dessinBrut(); return; }
        var k = cle(premier, id);
        var existe = graphe.aretes.filter(function (a) { return cle(a.u, a.v) === k; });
        if (existe.length) graphe.aretes = graphe.aretes.filter(function (a) { return cle(a.u, a.v) !== k; });
        else graphe.aretes = graphe.aretes.concat([{ id: k, u: premier < id ? premier : id, v: premier < id ? id : premier }]);
        premier = null;
        dessinBrut();
      } else {
        source = id; trace = null; ctl.charger(0); textes(); dessinBrut();
      }
    }
    lancer.onclick = function () {
      if (edition) { edition = false; premier = null; textes(); }
      pseudo();
      trace = selAlgo.value === "BFS" ? Parcours.bfs(graphe, source) : Parcours.dfs(graphe, source);
      ctl.charger(trace.length);
      ctl.lecture();
    };
    modif.onclick = function () { edition = !edition; premier = null; trace = null; ctl.charger(0); textes(); dessinBrut(); };
    raz.onclick = function () { graphe = { sommets: base.sommets.slice(), aretes: base.aretes.slice() }; trace = null; ctl.charger(0); dessinBrut(); };
    selAlgo.addEventListener("change", function () { trace = null; ctl.charger(0); pseudo(); dessinBrut(); });
    if (options.sansEdition) { modif.style.display = "none"; raz.style.display = "none"; }
    pseudo(); textes(); dessinBrut();
    return function () { ctl.stop(); };
  }

  var etapes = [
    {
      titre: "Un BFS complet",
      texte: "<p>Le banc d'essai exécute BFS ou DFS pas à pas sur le graphe. Lance un BFS depuis a et regarde la file F se remplir et se vider. " +
        "Les compteurs comparent le travail fait à n et à 2m.</p>",
      objectif: "Exécuter un BFS jusqu'au bout.",
      installer: function (zone, api) {
        return banc(zone, function (e, algo) {
          if (algo !== "BFS") return;
          api.retour("BFS terminé : " + e.ordre.length + " sommets défilés, " + e.examinees + " arêtes examinées.", true);
          api.valider("Chaque sommet atteint est défilé exactement une fois, chaque arête est examinée deux fois (une depuis chaque extrémité) : n + 2m opérations, O(n + m).");
        }, { algo: "BFS", sansEdition: true });
      }
    },
    {
      titre: "Un DFS complet",
      texte: "<p>Même graphe, même source, mais en profondeur. La pile d'appels remplace la file.</p>",
      objectif: "Exécuter un DFS jusqu'au bout et comparer l'ordre avec celui du BFS.",
      installer: function (zone, api) {
        return banc(zone, function (e, algo) {
          if (algo !== "DFS") return;
          var bfs = Parcours.bfs(graphe, e.ordre[0]);
          api.retour("DFS : " + e.ordre.join(", ") + " — BFS depuis la même source : " + bfs[bfs.length - 1].ordre.join(", ") + ".", true);
          api.valider("Même coût O(n + m), ordre différent : le DFS s'enfonce, le BFS avance par niveaux.");
        }, { algo: "DFS", sansEdition: true });
      }
    },
    {
      titre: "Ton propre graphe",
      texte: "<p>Ajoute ou retire des arêtes (au moins une modification), puis relance BFS ou DFS. Le nombre d'arêtes examinées suit-il toujours 2m ?</p>",
      objectif: "Modifier le graphe puis exécuter un parcours complet dessus.",
      installer: function (zone, api) {
        return banc(zone, function (e, algo, g) {
          var orig = base.aretes.map(function (a) { return cle(a.u, a.v); }).sort().join();
          var cur = g.aretes.map(function (a) { return cle(a.u, a.v); }).sort().join();
          if (orig === cur) { api.retour("C'est encore le graphe d'origine : modifie-le d'abord.", false); return; }
          var touteAtteint = e.ordre.length === g.sommets.length;
          api.retour(algo + " : " + e.examinees + " arêtes examinées pour m = " + g.aretes.length + (touteAtteint ? " (2m = " + 2 * g.aretes.length + ")." : " — mais tous les sommets n'ont pas été atteints."), true);
          api.valider(touteAtteint ? "Quand tout le graphe est atteint, on examine exactement 2m arêtes." : "Seules les arêtes de la partie atteinte sont examinées : c'est l'objet de l'étape suivante.");
        }, { algo: "BFS" });
      }
    },
    {
      titre: "Un graphe non connexe",
      texte: "<p>Retire des arêtes pour couper le graphe en deux morceaux, puis lance un parcours. Que se passe-t-il pour les sommets de l'autre morceau ?</p>" +
        "<div class='signalement'>Lien avec le cours 2 : la diapo « Cas des graphes non connexes » de la coupe minimum n'a qu'un titre. " +
        "Ce qu'on voit ici est un fait général (un parcours depuis s n'atteint que la composante connexe de s), pas le contenu de cette diapo.</div>",
      objectif: "Obtenir un parcours qui n'atteint pas tous les sommets.",
      installer: function (zone, api) {
        return banc(zone, function (e, algo, g) {
          if (e.ordre.length < g.sommets.length) {
            var non = g.sommets.map(function (s) { return s.id; }).filter(function (x) { return e.ordre.indexOf(x) < 0; });
            api.retour("Non atteints : " + non.join(", ") + ".", true);
            api.valider("Un parcours depuis s visite exactement la composante connexe de s. Pour tout visiter, on relance un parcours depuis chaque sommet non encore visité — le total reste O(n + m). Et le BFS sert ainsi à tester la connexité.");
          } else {
            api.retour("Tous les sommets sont encore atteints : le graphe est toujours connexe. Retire d'autres arêtes.", false);
          }
        }, { algo: "BFS" });
      }
    }
  ];

  Lecon.demarrer({
    matiere: "advanced-algorithms",
    id: "bfs-dfs",
    etapes: etapes,
    fin: {
      cartes: "prerequis",
      texte: "<p>Tu as vu les deux parcours sur le graphe d'exemple et sur tes propres graphes : coût O(n + m), BFS par niveaux (distances), DFS en profondeur, et un parcours ne visite que la composante connexe de sa source.</p>"
    }
  });
})();
