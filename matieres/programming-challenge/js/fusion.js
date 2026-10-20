/* fusion.js — tri fusion « à la main » (cours 4 Sort) avec comptage.
   Modes :
     "simple"     : fusionner (G avant D en cas d'égalité) ;
     "inversions" : quand on prend dans D, on compte les éléments restant dans G (Inversion Count) ;
     "murder"     : quand on prend x dans D, on ajoute la somme des éléments de G déjà placés,
                    tous strictement plus petits que x (It's a Murder) — D passe avant G en cas d'égalité.
   Découpage comme dans le cours : la moitié gauche reçoit ⌊n/2⌋ éléments ([2 3 | 8 6 1]).

   Fusion.fusions(t)                → liste des fusions dans l'ordre d'exécution : [{ G, D }]
   Fusion.increment(mode, G, i)      → ce qu'on ajoute en prenant D[j] quand i éléments de G sont placés
   Fusion.total(t, mode)            → nombre d'inversions / somme « murder » (force brute)
   Fusion.widget(zone, G, D, { mode, surFin(resultat, compteur) })  → fusion interactive
   Fusion.triComplet(zone, t, { mode, surFin(trie, total) })       → enchaîne toutes les fusions */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  function fusions(t) {
    var r = [];
    (function f(a) {
      if (a.length <= 1) return a.slice();
      var k = Math.floor(a.length / 2);
      var G = f(a.slice(0, k)), D = f(a.slice(k));
      r.push({ G: G, D: D });
      var res = [], i = 0, j = 0;
      while (i < G.length || j < D.length) {
        if (j >= D.length || (i < G.length && G[i] <= D[j])) res.push(G[i++]); else res.push(D[j++]);
      }
      return res;
    })(t);
    return r;
  }
  function prendreG(mode, g, d) { return mode === "murder" ? g < d : g <= d; }
  function increment(mode, G, i) {
    if (mode === "inversions") return G.length - i;
    if (mode === "murder") { var s = 0; for (var k = 0; k < i; k++) s += G[k]; return s; }
    return 0;
  }
  function total(t, mode) {
    var s = 0;
    for (var i = 0; i < t.length; i++) for (var j = i + 1; j < t.length; j++) {
      if (mode === "inversions" && t[i] > t[j]) s++;
      if (mode === "murder" && t[i] < t[j]) s += t[i];
    }
    return s;
  }

  function widget(zone, G, D, o) {
    o = o || {};
    var mode = o.mode || "simple";
    var i = 0, j = 0, res = [], cpt = 0, attente = null;
    var boite = el("div", "fusion");
    zone.appendChild(boite);
    var tg = new Tableau(boite, { nom: "G", indices: false, onCase: function (k) { clic("G", k); } });
    var td = new Tableau(boite, { nom: "D", indices: false, onCase: function (k) { clic("D", k); } });
    var tr = new Tableau(boite, { nom: "→", indices: false });
    var info = el("p", "legende-figure");
    boite.appendChild(info);
    var question = el("div");
    boite.appendChild(question);
    var retour = el("div", "retour");
    boite.appendChild(retour);

    function classes(T, k) {
      var c = {};
      for (var x = 0; x < T.length; x++) c[x] = x < k ? "vue barree" : (x === k && !attente ? "courante" : "");
      return c;
    }
    function dessiner() {
      tg.dessiner(G, { classes: classes(G, i) });
      td.dessiner(D, { classes: classes(D, j) });
      var vide = [];
      for (var x = 0; x < G.length + D.length; x++) vide.push(x < res.length ? res[x] : null);
      tr.dessiner(vide, { classes: (function () { var c = {}; for (var x = res.length; x < vide.length; x++) c[x] = "vide"; return c; })() });
      info.innerHTML = mode === "simple" ? "" : "<span>" + (mode === "inversions" ? "inversions comptées" : "somme") + " : <span class='mono'>" + cpt + "</span></span>";
    }
    function bonCote() {
      if (i >= G.length) return "D";
      if (j >= D.length) return "G";
      return prendreG(mode, G[i], D[j]) ? "G" : "D";
    }
    function clic(cote, k) {
      if (attente || res.length === G.length + D.length) return;
      if ((cote === "G" && k !== i) || (cote === "D" && k !== j)) { retour.className = "retour ko"; retour.textContent = "On ne prend que la tête (première case non utilisée) de G ou de D."; return; }
      var b = bonCote();
      if (cote !== b) {
        retour.className = "retour ko";
        retour.textContent = mode === "murder" && i < G.length && j < D.length && G[i] === D[j] ?
          "À égalité, on prend D d'abord : un élément égal n'est pas « strictement plus petit »." :
          "Il faut prendre le plus petit des deux têtes" + (mode !== "murder" ? " (G en cas d'égalité)." : ".");
        return;
      }
      retour.className = "retour"; retour.textContent = "";
      if (cote === "G") { res.push(G[i++]); dessiner(); finir(); return; }
      var inc = increment(mode, G, i);
      var x = D[j++];
      res.push(x);
      if (mode === "simple") { dessiner(); finir(); return; }
      attente = { inc: inc, x: x };
      dessiner();
      demander();
    }
    function demander() {
      question.innerHTML = "";
      var l = el("div", "saisie");
      var lab = el("label", null, mode === "inversions" ?
        attente.x + " passe devant combien d'éléments de G ? +" :
        "somme des éléments de G déjà placés (< " + attente.x + ") : +");
      var c = el("input"); c.type = "text"; c.inputMode = "numeric"; c.autocomplete = "off"; c.placeholder = "0";
      var b = el("button", "btn btn-petit btn-plein", "OK"); b.type = "button";
      l.appendChild(lab); l.appendChild(c); l.appendChild(b);
      question.appendChild(l);
      function ok() {
        var v = c.value.trim() === "" ? NaN : +c.value;
        if (v === attente.inc) {
          cpt += v; attente = null; question.innerHTML = "";
          retour.className = "retour ok"; retour.textContent = "+" + v + (mode === "inversions" ? " : les éléments restants de G sont tous plus grands que " + res[res.length - 1] + " et placés avant lui." : ".");
          dessiner(); finir();
        } else {
          retour.className = "retour ko";
          retour.textContent = mode === "inversions" ? "Compte les éléments de G qui ne sont pas encore placés." : "Additionne les éléments de G déjà passés dans le résultat.";
        }
      }
      b.onclick = ok;
      c.addEventListener("keydown", function (e) { if (e.key === "Enter") ok(); });
      setTimeout(function () { try { c.focus(); } catch (e) { /* rien */ } }, 0);
    }
    function finir() {
      if (res.length === G.length + D.length && o.surFin) o.surFin(res.slice(), cpt);
    }
    dessiner();
    return { boite: boite };
  }

  function triComplet(zone, t, o) {
    o = o || {};
    var liste = fusions(t);
    var k = 0, totalCpt = 0;
    var tete = el("p", "legende-figure");
    zone.appendChild(tete);
    var scene = el("div");
    zone.appendChild(scene);
    var journal = el("div", "journal");
    zone.appendChild(journal);
    function suivant() {
      scene.innerHTML = "";
      if (k >= liste.length) {
        tete.innerHTML = "<span>tri terminé</span>" + (o.mode && o.mode !== "simple" ? "<span>total : <span class='mono'>" + totalCpt + "</span></span>" : "");
        if (o.surFin) o.surFin(t.slice().sort(function (a, b) { return a - b; }), totalCpt);
        return;
      }
      var f = liste[k];
      tete.innerHTML = "<span>fusion <span class='mono'>" + (k + 1) + " / " + liste.length + "</span></span>" +
        (o.mode && o.mode !== "simple" ? "<span>total : <span class='mono'>" + totalCpt + "</span></span>" : "");
      widget(scene, f.G, f.D, {
        mode: o.mode,
        surFin: function (res, c) {
          totalCpt += c;
          journal.appendChild(el("div", null, "[" + f.G.join(" ") + "] + [" + f.D.join(" ") + "] → [" + res.join(" ") + "]" + (o.mode && o.mode !== "simple" ? "   +" + c : "")));
          k++;
          setTimeout(suivant, 450);
        }
      });
    }
    suivant();
  }

  window.Fusion = { fusions: fusions, increment: increment, total: total, widget: widget, triComplet: triComplet };
})();
