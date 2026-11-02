/* jetons.js — découper un texte en tokens en touchant les frontières, et
   afficher une séquence de tokens alignée avec leurs identifiants.

   Jetons.decouper(conteneur, {
     texte: "The cat sat on the mat.",
     cible: ["The", "cat", "sat", "on", "the", "mat", "."],   // découpage attendu
     coupesInitiales: [],            // (optionnel) positions déjà coupées (indices de caractères)
     surChangement: function (tokens) {…},                    // (optionnel)
     surReussite: function (tokens) {…}
   });
   Chaque espace est une frontière automatique (il n'est pas un token) ; on
   touche l'espace entre deux caractères collés pour y ajouter une coupe.

   Jetons.rangee(conteneur, [
     { nom: "tokens", valeurs: ["the", "cat"] },
     { nom: "IDs", valeurs: [4, 5], classes: { 1: "courante" } }       // "courante", "pale", "masque"
   ]);   → rangées alignées (une colonne par position), défilables sur téléphone.
   Jetons.segmenter(texte, coupes) → tokens. */
(function () {
  "use strict";
  var el = function (t, c, x) { return Site.el(t, c, x); };
  var STYLE =
    ".decoupe{font-family:var(--mono);font-size:1.05rem;line-height:2.6;display:flex;flex-wrap:wrap;align-items:center;margin:.4rem 0}" +
    ".decoupe .car{padding:0 1px}" +
    ".decoupe .mot{display:inline-flex;align-items:center;white-space:nowrap}" +
    ".decoupe .espace{width:.7rem}" +
    ".decoupe .fente{width:14px;height:2rem;border:0;background:transparent;cursor:pointer;position:relative;padding:0;margin:0 -2px}" +
    ".decoupe .fente::after{content:'';position:absolute;left:6px;top:.35rem;bottom:.35rem;width:2px;border-radius:1px;background:var(--trait)}" +
    ".decoupe .fente:hover::after{background:var(--encre-3)}" +
    ".decoupe .fente.coupee::after{background:var(--accent);width:3px;left:5px;top:.1rem;bottom:.1rem}" +
    ".rangees{overflow-x:auto;margin:.4rem 0}" +
    ".rangees table{border-collapse:separate;border-spacing:3px;font-family:var(--mono);font-size:.85rem}" +
    ".rangees th{font-weight:500;color:var(--encre-2);text-align:right;padding-right:.3rem;white-space:nowrap;font-size:.8rem}" +
    ".rangees td{min-width:2.2rem;text-align:center;border:1px solid var(--trait);border-radius:6px;padding:.2rem .35rem;white-space:nowrap}" +
    ".rangees td.courante{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}" +
    ".rangees td.pale{color:var(--encre-3)}" +
    ".rangees td.masque{border-style:dashed;color:var(--encre-3)}";
  function injecterStyle() {
    if (document.getElementById("style-jetons")) return;
    var s = document.createElement("style"); s.id = "style-jetons"; s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function segmenter(texte, coupes) {
    var toks = [], cur = "";
    for (var i = 0; i < texte.length; i++) {
      var c = texte[i];
      if (c === " ") { if (cur) toks.push(cur); cur = ""; continue; }
      if (coupes[i] && cur) { toks.push(cur); cur = ""; }
      cur += c;
    }
    if (cur) toks.push(cur);
    return toks;
  }

  function decouper(conteneur, o) {
    injecterStyle();
    var coupes = {};
    (o.coupesInitiales || []).forEach(function (i) { coupes[i] = true; });
    var boite = el("div", "decoupe");
    var info = el("p", "legende-figure");
    var fini = false;
    var mot = null;
    for (var i = 0; i < o.texte.length; i++) {
      (function (i) {
        var c = o.texte[i];
        if (c === " ") { boite.appendChild(el("span", "espace")); mot = null; return; }
        if (!mot) { mot = el("span", "mot"); boite.appendChild(mot); }
        if (i > 0 && o.texte[i - 1] !== " ") {
          var f = el("button", "fente" + (coupes[i] ? " coupee" : ""));
          f.type = "button";
          f.setAttribute("aria-label", "couper avant « " + c + " » (position " + i + ")");
          f.setAttribute("data-pos", String(i));
          f.onclick = function () {
            if (fini) return;
            coupes[i] = !coupes[i];
            f.classList.toggle("coupee", !!coupes[i]);
            maj();
          };
          mot.appendChild(f);
        }
        mot.appendChild(el("span", "car", c));
      })(i);
    }
    conteneur.appendChild(boite);
    conteneur.appendChild(info);
    function maj() {
      var t = segmenter(o.texte, coupes);
      info.innerHTML = "<span>" + t.length + " tokens : </span><span class='mono'>" + t.map(function (x) { return "[" + x + "]"; }).join(" ") + "</span>";
      if (o.surChangement) o.surChangement(t);
      if (o.cible && t.join("\u0001") === o.cible.join("\u0001")) { fini = true; if (o.surReussite) o.surReussite(t); }
    }
    maj();
    return { tokens: function () { return segmenter(o.texte, coupes); } };
  }

  function rangee(conteneur, lignes) {
    injecterStyle();
    var b = el("div", "rangees");
    var t = el("table");
    lignes.forEach(function (l) {
      var tr = el("tr");
      tr.appendChild(el("th", null, l.nom || ""));
      l.valeurs.forEach(function (v, j) {
        tr.appendChild(el("td", (l.classes && l.classes[j]) || "", v === null || v === undefined ? "" : String(v)));
      });
      t.appendChild(tr);
    });
    b.appendChild(t);
    conteneur.appendChild(b);
    return b;
  }

  window.Jetons = { decouper: decouper, rangee: rangee, segmenter: segmenter };
})();
