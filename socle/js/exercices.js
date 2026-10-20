/* exercices.js — petits exercices réutilisables dans les étapes de leçon.

   Exercices.choix(zone, {
     question: "…", options: ["…", "…"], bonne: 0,
     expliquer: ["pourquoi faux…", …],      // (optionnel) un message par option
     surReussite: function () {…}
   });

   Exercices.nombre(zone, {
     label: "p =", attendu: 2/7, tolerance: 0.002,
     indice: "…",                            // message si faux
     surReussite: function (valeur) {…}
   });
   Accepte « 2/7 », « 0,2857 », « 0.2857 ».

   Exercices.lireNombre("3/5") → 0.6 (ou NaN).

   Exercices.vraiFaux(zone, { items: [{ texte, vrai, explication? }], surReussite })
   Exercices.cocher(zone, { question, options, bonnes: [indices], explication, surReussite })
   Exercices.ordonner(zone, { consigne, items: [ordre correct], separateur: "<", surReussite })

   Exercices.texte(zone, {
     label: "Sortie :", attendu: "Case 1: 0:1 1:7",   // chaîne, ou tableau de réponses acceptées
     lignes: 3,                  // (optionnel) > 1 → zone multiligne
     mode: "juge",               // "juge" (défaut) : espaces en fin de ligne et lignes vides finales ignorés
                                 // "exact" : comparaison caractère par caractère
                                 // "souple" : espaces multiples, casse et ponctuation de bord ignorés
     indice: "…", bravo: "…", surReussite: function (texte) {…}
   });
   En cas d'erreur, indique comme un juge la première ligne / colonne qui diffère. */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };

  function lireNombre(txt) {
    if (txt === null || txt === undefined) return NaN;
    var s = String(txt).trim().replace(/\s+/g, "").replace(",", ".");
    if (!s) return NaN;
    var m = /^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s);
    if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    if (/^-?\d*\.?\d+(e-?\d+)?$/i.test(s)) return parseFloat(s);
    return NaN;
  }

  function choix(zone, o) {
    var bloc = el("div");
    if (o.question) bloc.appendChild(el("p", null, o.question));
    var liste = el("div", "choix");
    var retour = el("div", "retour");
    var boutons = o.options.map(function (texte, i) {
      var b = el("button", null, texte);
      b.type = "button";
      b.onclick = function () {
        if (i === o.bonne) {
          boutons.forEach(function (x, j) { x.disabled = true; if (j === o.bonne) x.classList.add("bon"); });
          retour.className = "retour ok";
          retour.textContent = (o.expliquer && o.expliquer[i]) || "Exact.";
          if (o.surReussite) o.surReussite();
        } else {
          b.classList.add("faux");
          b.disabled = true;
          retour.className = "retour ko";
          retour.textContent = (o.expliquer && o.expliquer[i]) || "Non, essaie une autre réponse.";
        }
      };
      liste.appendChild(b);
      return b;
    });
    bloc.appendChild(liste);
    bloc.appendChild(retour);
    zone.appendChild(bloc);
    return bloc;
  }

  function nombre(zone, o) {
    var bloc = el("div");
    var ligne = el("div", "saisie");
    var lab = el("label", null, o.label || "Réponse :");
    var champ = el("input");
    champ.type = "text";
    champ.inputMode = "decimal";
    champ.autocomplete = "off";
    champ.placeholder = o.placeholder || "ex. 3/5";
    var id = "n" + Math.random().toString(36).slice(2, 8);
    champ.id = id; lab.htmlFor = id;
    var b = el("button", "btn", "Vérifier");
    b.type = "button";
    ligne.appendChild(lab); ligne.appendChild(champ); ligne.appendChild(b);
    var retour = el("div", "retour");
    function verifier() {
      var v = lireNombre(champ.value);
      if (isNaN(v)) { retour.className = "retour ko"; retour.textContent = "Écris un nombre ou une fraction (ex. 3/5 ou 0,6)."; return; }
      if (Math.abs(v - o.attendu) <= (o.tolerance || 1e-9)) {
        retour.className = "retour ok";
        retour.textContent = o.bravo || "Exact.";
        champ.disabled = true; b.disabled = true;
        if (o.surReussite) o.surReussite(v);
      } else {
        retour.className = "retour ko";
        retour.textContent = o.indice || "Pas tout à fait. Recommence le calcul.";
      }
    }
    b.onclick = verifier;
    champ.addEventListener("keydown", function (e) { if (e.key === "Enter") verifier(); });
    bloc.appendChild(ligne);
    bloc.appendChild(retour);
    zone.appendChild(bloc);
    return { bloc: bloc, champ: champ };
  }

  /* Vrai / faux sur plusieurs affirmations.
     Exercices.vraiFaux(zone, { items: [{ texte, vrai: true|false, explication? }], surReussite }) */
  function vraiFaux(zone, o) {
    var bloc = el("div", "vf");
    var reponses = o.items.map(function () { return null; });
    var verdicts = [];
    var expl = [];
    o.items.forEach(function (it, i) {
      var ligne = el("div", "vf-ligne");
      var t = el("span", "enonce"); t.innerHTML = it.texte; ligne.appendChild(t);
      var r = el("div", "rangee-btn");
      var bV = el("button", "btn btn-petit", "Vrai"), bF = el("button", "btn btn-petit", "Faux");
      bV.type = bF.type = "button";
      bV.onclick = function () { reponses[i] = true; bV.classList.add("choisi"); bF.classList.remove("choisi"); verdicts[i].textContent = ""; };
      bF.onclick = function () { reponses[i] = false; bF.classList.add("choisi"); bV.classList.remove("choisi"); verdicts[i].textContent = ""; };
      r.appendChild(bV); r.appendChild(bF);
      var v = el("span", "verdict");
      verdicts.push(v);
      r.appendChild(v);
      ligne.appendChild(r);
      var e = el("div", "discret petit");
      e.style.flexBasis = "100%";
      expl.push(e);
      ligne.appendChild(e);
      bloc.appendChild(ligne);
    });
    var b = el("button", "btn", "Vérifier");
    b.type = "button";
    b.style.marginTop = ".6rem";
    var retour = el("div", "retour");
    b.onclick = function () {
      if (reponses.some(function (x) { return x === null; })) {
        retour.className = "retour ko"; retour.textContent = "Réponds à toutes les affirmations."; return;
      }
      var justes = 0;
      o.items.forEach(function (it, i) {
        var ok = reponses[i] === it.vrai;
        if (ok) justes++;
        verdicts[i].textContent = ok ? "✓" : "✗";
        expl[i].innerHTML = ok && it.explication ? it.explication : "";
      });
      if (justes === o.items.length) {
        retour.className = "retour ok"; retour.textContent = o.bravo || "Tout est juste.";
        b.disabled = true;
        if (o.surReussite) o.surReussite();
      } else {
        retour.className = "retour ko";
        retour.textContent = justes + " / " + o.items.length + " justes. Change les réponses marquées ✗ puis vérifie à nouveau.";
      }
    };
    zone.appendChild(bloc);
    zone.appendChild(b);
    zone.appendChild(retour);
  }

  /* Cases à cocher (plusieurs bonnes réponses possibles).
     Exercices.cocher(zone, { question, options: [...], bonnes: [indices], explication, surReussite }) */
  function cocher(zone, o) {
    var bloc = el("div");
    if (o.question) { var q = el("p"); q.innerHTML = o.question; bloc.appendChild(q); }
    var liste = el("div", "cocher");
    var cases = o.options.map(function (texte) {
      var lab = el("label");
      var c = el("input"); c.type = "checkbox";
      lab.appendChild(c);
      var s = el("span"); s.innerHTML = texte; lab.appendChild(s);
      c.addEventListener("change", function () { lab.className = ""; });
      liste.appendChild(lab);
      return { lab: lab, c: c };
    });
    bloc.appendChild(liste);
    var b = el("button", "btn", o.bouton || "Valider");
    b.type = "button";
    var retour = el("div", "retour");
    b.onclick = function () {
      var exact = true;
      cases.forEach(function (x, i) {
        var bonne = o.bonnes.indexOf(i) >= 0;
        x.lab.className = x.c.checked && bonne ? "bon" : (!x.c.checked && bonne ? "" : (x.c.checked ? "faux" : ""));
        if (x.c.checked !== bonne) exact = false;
      });
      if (exact) {
        cases.forEach(function (x) { x.c.disabled = true; });
        b.disabled = true;
        retour.className = "retour ok";
        retour.innerHTML = o.explication || "Exact.";
        if (o.surReussite) o.surReussite();
      } else {
        var oublis = cases.filter(function (x, i) { return !x.c.checked && o.bonnes.indexOf(i) >= 0; }).length;
        retour.className = "retour ko";
        retour.textContent = "Pas encore." + (oublis ? " Il manque " + oublis + " bonne" + (oublis > 1 ? "s" : "") + " réponse" + (oublis > 1 ? "s" : "") + "." : "") + " Les réponses barrées sont fausses.";
      }
    };
    bloc.appendChild(b);
    bloc.appendChild(retour);
    zone.appendChild(bloc);
  }

  /* Remettre des éléments dans l'ordre, en les touchant un par un.
     Exercices.ordonner(zone, { consigne, items: [ordre correct], surReussite }) */
  function ordonner(zone, o) {
    var bloc = el("div");
    if (o.consigne) bloc.appendChild(el("p", "discret petit", o.consigne));
    var reserve = el("div", "jetons");
    var seq = el("div", "jetons sequence");
    var retour = el("div", "retour");
    var choisis = [];
    var melange = o.items.slice();
    // mélange déterministe mais jamais dans l'ordre correct
    melange.sort(function (a, b) { return (a.length * 7 + a.charCodeAt(0)) % 5 - (b.length * 7 + b.charCodeAt(0)) % 5; });
    if (melange.join("|") === o.items.join("|")) melange.reverse();
    var boutons = melange.map(function (it) {
      var b = el("button", "jeton", it);
      b.type = "button";
      b.onclick = function () {
        b.disabled = true;
        choisis.push(it);
        dessinerSeq();
        if (choisis.length === o.items.length) verifier();
      };
      reserve.appendChild(b);
      return b;
    });
    function dessinerSeq() {
      seq.innerHTML = "";
      if (!choisis.length) { seq.appendChild(el("span", "tres-discret petit", "touche les éléments dans l'ordre…")); return; }
      choisis.forEach(function (it, i) {
        if (i) seq.appendChild(el("span", "fleche", o.separateur === undefined ? "<" : o.separateur));
        var j = el("span", "jeton", it);
        seq.appendChild(j);
      });
    }
    function verifier() {
      for (var i = 0; i < o.items.length; i++) {
        if (choisis[i] !== o.items[i]) {
          retour.className = "retour ko";
          retour.textContent = "Erreur à la position " + (i + 1) + " : " + choisis[i] + " n'est pas à sa place. Recommence.";
          return;
        }
      }
      retour.className = "retour ok";
      retour.textContent = o.bravo || "Bon ordre.";
      raz.disabled = true;
      if (o.surReussite) o.surReussite();
    }
    var raz = el("button", "btn btn-petit", "Recommencer");
    raz.type = "button";
    raz.onclick = function () {
      choisis = []; boutons.forEach(function (b) { b.disabled = false; });
      retour.className = "retour"; retour.textContent = ""; dessinerSeq();
    };
    dessinerSeq();
    bloc.appendChild(seq);
    bloc.appendChild(reserve);
    bloc.appendChild(raz);
    bloc.appendChild(retour);
    zone.appendChild(bloc);
  }

  /* Saisie d'un texte (sortie d'un programme, liste de sommets…) comparé à la
     réponse attendue, avec un diagnostic de juge en cas d'écart. */
  function normaliser(s, mode) {
    s = String(s === null || s === undefined ? "" : s).replace(/\r\n?/g, "\n");
    if (mode === "exact") return s;
    var l = s.split("\n").map(function (x) { return x.replace(/[ \t]+$/, ""); });
    while (l.length && l[l.length - 1] === "") l.pop();
    if (mode === "souple") {
      l = l.map(function (x) { return x.trim().replace(/\s+/g, " ").replace(/^[.,;:]+|[.,;:]+$/g, "").toLowerCase(); })
        .filter(function (x) { return x !== ""; });
    }
    return l.join("\n");
  }
  function premierEcart(a, b) {
    var la = a.split("\n"), lb = b.split("\n");
    for (var i = 0; i < Math.max(la.length, lb.length); i++) {
      var x = la[i], y = lb[i];
      if (x === y) continue;
      if (x === undefined) return { ligne: i + 1, quoi: "il manque la ligne " + (i + 1) };
      if (y === undefined) return { ligne: i + 1, quoi: "la ligne " + (i + 1) + " est en trop" };
      for (var j = 0; j < Math.max(x.length, y.length); j++) if (x[j] !== y[j]) break;
      return { ligne: i + 1, quoi: "ligne " + (i + 1) + ", colonne " + (j + 1) + " : différence à partir de « " + (x.slice(j, j + 12) || "fin de ligne") + " »" };
    }
    return null;
  }
  function texte(zone, o) {
    var mode = o.mode || "juge";
    var attendus = (Array.isArray(o.attendu) ? o.attendu : [o.attendu]).map(function (a) { return normaliser(a, mode); });
    var bloc = el("div");
    var ligne = el("div", "saisie" + (o.lignes > 1 ? " saisie-bloc" : ""));
    var lab = el("label", null, o.label || "Réponse :");
    var champ = el(o.lignes > 1 ? "textarea" : "input");
    if (o.lignes > 1) { champ.rows = o.lignes; champ.spellcheck = false; }
    else { champ.type = "text"; }
    champ.autocomplete = "off";
    champ.setAttribute("autocapitalize", "off");
    champ.className = "mono";
    if (o.placeholder) champ.placeholder = o.placeholder;
    var id = "t" + Math.random().toString(36).slice(2, 8);
    champ.id = id; lab.htmlFor = id;
    var b = el("button", "btn", o.bouton || "Vérifier");
    b.type = "button";
    ligne.appendChild(lab); ligne.appendChild(champ); ligne.appendChild(b);
    var retour = el("div", "retour");
    function verifier() {
      var v = normaliser(champ.value, mode);
      if (!v) { retour.className = "retour ko"; retour.textContent = "Écris d'abord ta réponse."; return; }
      if (attendus.indexOf(v) >= 0) {
        retour.className = "retour ok";
        retour.innerHTML = o.bravo || "Exact.";
        champ.disabled = true; b.disabled = true;
        if (o.surReussite) o.surReussite(champ.value);
        return;
      }
      var e = premierEcart(v, attendus[0]);
      retour.className = "retour ko";
      retour.innerHTML = (o.verdict === false ? "" : "Wrong Answer — " + (e ? e.quoi : "réponse différente") + ". ") + (o.indice || "");
    }
    b.onclick = verifier;
    champ.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !(o.lignes > 1)) verifier();
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) verifier();
    });
    bloc.appendChild(ligne);
    bloc.appendChild(retour);
    zone.appendChild(bloc);
    return { bloc: bloc, champ: champ, reinitialiser: function () { champ.disabled = false; b.disabled = false; champ.value = ""; retour.className = "retour"; retour.textContent = ""; } };
  }

  window.Exercices = { lireNombre: lireNombre, choix: choix, nombre: nombre, vraiFaux: vraiFaux, cocher: cocher, ordonner: ordonner, texte: texte, normaliserTexte: normaliser };
})();
