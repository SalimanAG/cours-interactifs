/* pipeline-rag.js — l'étape « retrieve → pack » d'un RAG : les candidats renvoyés par la recherche,
   ce qui entre dans le budget de contexte (chunks entiers), ce qui est écarté, les doublons.

   PipelineRag.packer(candidats, budget, { dedoublonner: true, separateur: 2 })
     → { gardes: [indices], ecartes: [indices], doublons: [indices], utilise: caractères }
     Règle (celle du packer du cours) : on parcourt les candidats dans l'ordre ; un chunk déjà vu est
     ignoré (si dedoublonner) ; un bloc n'entre que s'il tient en entier dans le budget restant
     (séparateur compté entre deux blocs) ; sinon il est écarté et on continue avec les suivants.

   var p = new PipelineRag(conteneur, { titre: "…" });
   p.dessiner({
     candidats: [{ id: "N01-00", titre: "Limites d'envoi", version: "3.0", taille: 640 }],  // taille = caractères du bloc
     budget: 1400,
     resultat: PipelineRag.packer(…),      // (optionnel) colonne « contexte » + barre de budget
     courant: 0,                           // (optionnel) ligne en couleur d'accent
     clic: function (i) { … }              // (optionnel) lignes cliquables
   });
   La brique injecte son propre CSS (variables de theme.css). */
(function () {
  "use strict";
  var STYLE =
    ".pipeline-rag{border:1px solid var(--trait);border-radius:var(--rayon);padding:.5rem .6rem;background:var(--fond-2)}" +
    ".pipeline-rag .pr-titre{font-size:.8rem;color:var(--encre-2);margin:0 0 .35rem}" +
    ".pipeline-rag table{width:100%;border-collapse:collapse;font-size:.85rem}" +
    ".pipeline-rag th{font-weight:600;color:var(--encre-2);text-align:left;font-size:.75rem;padding:.2rem .3rem;border-bottom:1px solid var(--trait)}" +
    ".pipeline-rag td{padding:.3rem .3rem;border-bottom:1px solid var(--trait);vertical-align:top}" +
    ".pipeline-rag td.pr-id,.pipeline-rag td.pr-n{font-family:var(--mono);font-size:.78rem;white-space:nowrap}" +
    ".pipeline-rag td.pr-n{text-align:right}" +
    ".pipeline-rag tr.clic{cursor:pointer}.pipeline-rag tr.clic:hover td{background:var(--fond)}" +
    ".pipeline-rag tr.courant td{background:var(--accent-doux)}.pipeline-rag tr.courant td.pr-id{color:var(--accent)}" +
    ".pipeline-rag .pr-etat{font-family:var(--mono);font-size:.72rem;white-space:nowrap}" +
    ".pipeline-rag .pr-etat.garde{font-weight:600}" +
    ".pipeline-rag .pr-etat.ecarte,.pipeline-rag .pr-etat.doublon{color:var(--encre-3);text-decoration:line-through}" +
    ".pipeline-rag .pr-budget{margin:.5rem 0 0;font-family:var(--mono);font-size:.75rem;color:var(--encre-2)}" +
    ".pipeline-rag .pr-barre{height:8px;border:1px solid var(--trait-fort);border-radius:4px;overflow:hidden;margin-top:.2rem;background:var(--fond)}" +
    ".pipeline-rag .pr-barre span{display:block;height:100%;background:var(--encre-2)}";
  function styler() {
    if (document.getElementById("style-pipeline-rag")) return;
    var s = document.createElement("style"); s.id = "style-pipeline-rag"; s.textContent = STYLE;
    document.head.appendChild(s);
  }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; }

  function packer(candidats, budget, o) {
    o = o || {};
    var dedoublonner = o.dedoublonner !== false;
    var sep = o.separateur === undefined ? 2 : o.separateur;
    var vus = {}, r = { gardes: [], ecartes: [], doublons: [], utilise: 0 };
    candidats.forEach(function (c, i) {
      if (dedoublonner && vus[c.id]) { r.doublons.push(i); return; }
      vus[c.id] = true;
      var ajout = c.taille + (r.gardes.length ? sep : 0);
      if (r.utilise + ajout <= budget) { r.gardes.push(i); r.utilise += ajout; }
      else r.ecartes.push(i);
    });
    return r;
  }

  function PipelineRag(conteneur, opts) {
    styler();
    this.opts = opts || {};
    this.boite = el("div", "pipeline-rag");
    if (this.opts.titre) this.boite.appendChild(el("p", "pr-titre", this.opts.titre));
    this.corps = el("div");
    this.boite.appendChild(this.corps);
    conteneur.appendChild(this.boite);
  }
  PipelineRag.prototype.dessiner = function (o) {
    var c = this.corps; c.innerHTML = "";
    var t = el("table"), h = el("tr");
    ["rang", "chunk", "source", "caract."].concat(o.resultat ? ["contexte"] : []).forEach(function (x, k) {
      var th = el("th", null, x); if (k === 3) th.style.textAlign = "right"; h.appendChild(th);
    });
    t.appendChild(h);
    o.candidats.forEach(function (cand, i) {
      var tr = el("tr");
      if (o.courant === i) tr.classList.add("courant");
      if (o.clic) { tr.classList.add("clic"); tr.onclick = function () { o.clic(i); }; tr.tabIndex = 0; tr.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); o.clic(i); } }; }
      tr.appendChild(el("td", "pr-n", String(i + 1)));
      tr.appendChild(el("td", "pr-id", cand.id));
      tr.appendChild(el("td", null, cand.titre + (cand.version ? " (v" + cand.version + ")" : "")));
      tr.appendChild(el("td", "pr-n", String(cand.taille)));
      if (o.resultat) {
        var r = o.resultat, etat = r.gardes.indexOf(i) >= 0 ? ["garde", "packé"] : r.doublons.indexOf(i) >= 0 ? ["doublon", "doublon"] : r.ecartes.indexOf(i) >= 0 ? ["ecarte", "écarté"] : ["", "—"];
        var td = el("td"); td.appendChild(el("span", "pr-etat " + etat[0], etat[1])); tr.appendChild(td);
      }
      t.appendChild(tr);
    });
    c.appendChild(t);
    if (o.budget) {
      var u = o.resultat ? o.resultat.utilise : 0;
      var p = el("p", "pr-budget", "budget de contexte : " + (o.resultat ? u + " / " : "") + o.budget + " caractères");
      if (o.resultat) {
        var b = el("div", "pr-barre"), s = el("span"); s.style.width = Math.min(100, 100 * u / o.budget) + "%";
        b.appendChild(s); p.appendChild(b);
      }
      c.appendChild(p);
    }
  };
  PipelineRag.packer = packer;
  window.PipelineRag = PipelineRag;
})();
