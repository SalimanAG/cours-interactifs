/* controle.js — test noté (QCM), avec un score par notion.
   Un fichier de données appelle :
     Tests.enregistrer({
       matiere, id, titre,
       notions: { cle: { titre: "Notation O", lecon: "id-de-la-lecon" }, … },
       questions: [{ id, notion, enonce, options: [...], bonnes: [indices], explication }]
     });
   Une question avec plusieurs bonnes réponses s'affiche en cases à cocher ;
   elle ne rapporte le point que si toutes les bonnes cases (et elles seules)
   sont cochées. Chaque tentative est enregistrée (Progression.ajouterTentative). */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };
  window.TESTS = window.TESTS || {};
  window.Tests = {
    enregistrer: function (t) { window.TESTS[t.matiere + "/" + t.id] = t; },
    obtenir: function (m, id) { return window.TESTS[m + "/" + id] || null; }
  };

  function demarrer(conteneur, matiere, test) {
    var i = 0, reponses = [];

    function accueil() {
      conteneur.innerHTML = "";
      var res = Progression.resultatsTest(matiere.id, test.id).tentatives;
      var p = el("p", null, test.questions.length + " questions, une par écran. La correction s'affiche après chaque réponse ; le score par notion à la fin.");
      conteneur.appendChild(p);
      if (res.length) {
        conteneur.appendChild(el("p", "historique", "Tentatives : " + res.map(function (t) {
          return t.score + "/" + t.total + " (" + new Date(t.quand).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + ")";
        }).join(" · ")));
        conteneur.appendChild(bilan(res[res.length - 1], "Dernière tentative"));
      }
      var b = el("button", "btn btn-plein", res.length ? "Repasser le test" : "Commencer");
      b.type = "button";
      b.onclick = function () { i = 0; reponses = []; question(); };
      conteneur.appendChild(b);
    }

    function question() {
      conteneur.innerHTML = "";
      var q = test.questions[i];
      var multi = q.bonnes.length > 1;
      var art = el("div", "question-test");
      art.appendChild(el("span", "num", "Question " + (i + 1) + " sur " + test.questions.length + " · " + test.notions[q.notion].titre));
      var e = el("div", "enonce-test"); e.innerHTML = q.enonce; art.appendChild(e);
      if (multi) art.appendChild(el("p", "discret petit", "Plusieurs réponses possibles."));
      var liste = el("div", "cocher");
      var cases = q.options.map(function (o) {
        var lab = el("label");
        var c = el("input"); c.type = multi ? "checkbox" : "radio"; c.name = "q";
        lab.appendChild(c);
        var s = el("span"); s.innerHTML = o; lab.appendChild(s);
        liste.appendChild(lab);
        return { lab: lab, c: c };
      });
      art.appendChild(liste);
      var retour = el("div", "retour");
      var expl = el("div", "encadre");
      expl.style.display = "none";
      var b = el("button", "btn btn-plein", "Valider");
      b.type = "button";
      b.onclick = function () {
        if (b.dataset.etape === "suivant") {
          i++;
          if (i < test.questions.length) question(); else fin();
          return;
        }
        if (!cases.some(function (x) { return x.c.checked; })) { retour.className = "retour ko"; retour.textContent = "Choisis une réponse."; return; }
        var juste = true;
        cases.forEach(function (x, k) {
          var bonne = q.bonnes.indexOf(k) >= 0;
          if (x.c.checked !== bonne) juste = false;
          x.c.disabled = true;
          x.lab.className = bonne ? (x.c.checked ? "bon" : "bon manque") : (x.c.checked ? "faux" : "");
        });
        reponses[i] = juste;
        retour.className = "retour " + (juste ? "ok" : "ko");
        retour.textContent = juste ? "Juste." : "Faux — les bonnes réponses sont en gras.";
        expl.innerHTML = q.explication || "";
        expl.style.display = q.explication ? "" : "none";
        b.dataset.etape = "suivant";
        b.textContent = i < test.questions.length - 1 ? "Question suivante →" : "Voir le bilan →";
      };
      art.appendChild(retour);
      art.appendChild(expl);
      var nav = el("div", "nav-etape");
      var quitter = el("button", "btn", "Abandonner");
      quitter.type = "button";
      quitter.onclick = accueil;
      nav.appendChild(quitter); nav.appendChild(b);
      art.appendChild(nav);
      conteneur.appendChild(art);
      window.scrollTo(0, 0);
    }

    function fin() {
      var parNotion = {};
      var score = 0;
      test.questions.forEach(function (q, k) {
        var n = parNotion[q.notion] = parNotion[q.notion] || [0, 0];
        n[1]++;
        if (reponses[k]) { n[0]++; score++; }
      });
      var t = { score: score, total: test.questions.length, parNotion: parNotion };
      Progression.ajouterTentative(matiere.id, test.id, t);
      Progression.noterActivite({ matiere: matiere.id, id: test.id, type: "test" });
      conteneur.innerHTML = "";
      conteneur.appendChild(el("h2", null, "Score : " + score + " / " + t.total));
      conteneur.appendChild(bilan(t, "Par notion"));
      var b = el("button", "btn", "Revenir au début du test");
      b.type = "button";
      b.onclick = accueil;
      conteneur.appendChild(b);
      window.scrollTo(0, 0);
    }

    function bilan(t, titre) {
      var d = el("div");
      d.style.margin = "1rem 0";
      d.appendChild(el("h3", null, titre));
      Object.keys(test.notions).forEach(function (cle) {
        var v = t.parNotion[cle];
        if (!v) return;
        var notion = test.notions[cle];
        var ligne = el("div", "score-notion");
        var nom = el("span");
        nom.textContent = notion.titre;
        if (v[0] < v[1] && notion.lecon) {
          var info = Site.contenu(matiere.id, notion.lecon);
          if (info && info.contenu.fichier) {
            nom.appendChild(document.createTextNode(" — "));
            var a = el("a", null, "revoir la leçon");
            a.href = Site.lienContenu(matiere, info.contenu);
            nom.appendChild(a);
          }
        }
        ligne.appendChild(nom);
        ligne.appendChild(el("span", "val", v[0] + " / " + v[1] + (v[0] === v[1] ? " ✓" : "")));
        ligne.appendChild(Site.barre(v[0] / v[1]));
        d.appendChild(ligne);
      });
      return d;
    }

    accueil();
  }

  window.Controle = { demarrer: demarrer };
})();
