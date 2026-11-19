/* boucle-agent.js — la liste des messages d'une boucle d'agent (ReAct / function calling), affichée
   comme une trace : system, user, assistant (texte ou demandes d'outil), tool (résultat lié à son id),
   réponse finale, erreur. Sert à simuler un agent pas à pas : on ajoute les messages un par un.

   var t = new TraceAgent(conteneur, { titre: "messages envoyés au modèle", tokens: true });
   t.dessiner([
     { role: "system", texte: "Tu es l'assistant…" },
     { role: "user", texte: "L'alerte affiche ORB-4031…" },
     { role: "assistant", appels: [{ id: "call_1", nom: "search_files", args: { query: "ORB-4031" } }] },
     { role: "tool", id: "call_1", texte: "runbook-payments-api.md:5: …" },
     { role: "final", texte: "…" },              // réponse sans appel d'outil : la boucle s'arrête
     { role: "erreur", texte: "400 …" }          // erreur renvoyée par l'API ou par le harness
   ], { courant: 3 });                           // indice mis en couleur d'accent (ce qui est « en cours »)

   Options de dessiner : courant (indice ou null), estompes (tableau d'indices affichés en pâle),
   resume (texte libre sous la liste ; par défaut : nombre de messages et taille approximative).
   TraceAgent.tokens(texte) → estimation grossière (1 token ≈ 4 caractères), à présenter comme telle.
   La brique injecte son propre CSS (variables de theme.css). */
(function () {
  "use strict";
  var STYLE =
    ".trace-agent{border:1px solid var(--trait);border-radius:var(--rayon);padding:.5rem .6rem;background:var(--fond-2)}" +
    ".trace-agent .ta-titre{font-size:.8rem;color:var(--encre-2);margin:0 0 .35rem}" +
    ".trace-agent ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.3rem}" +
    ".trace-agent li{display:grid;grid-template-columns:5.6rem 1fr;gap:.5rem;align-items:start;padding:.3rem .4rem;border-left:3px solid transparent;border-radius:4px;background:var(--fond)}" +
    ".trace-agent li.courant{border-left-color:var(--accent);background:var(--accent-doux)}" +
    ".trace-agent li.pale{opacity:.45}" +
    ".trace-agent .ta-role{font-family:var(--mono);font-size:.72rem;color:var(--encre-2);padding-top:.15rem;overflow-wrap:anywhere}" +
    ".trace-agent li.courant .ta-role{color:var(--accent)}" +
    ".trace-agent .ta-txt{font-size:.88rem;line-height:1.4;overflow-wrap:anywhere;min-width:0}" +
    ".trace-agent .ta-appel{font-family:var(--mono);font-size:.8rem;display:block}" +
    ".trace-agent .ta-id{font-family:var(--mono);font-size:.72rem;color:var(--encre-3)}" +
    ".trace-agent .ta-obs{font-family:var(--mono);font-size:.78rem;white-space:pre-wrap;display:block;color:var(--encre-2)}" +
    ".trace-agent li.ta-final .ta-txt{font-weight:500}" +
    ".trace-agent li.ta-erreur .ta-txt{font-family:var(--mono);font-size:.8rem;text-decoration:underline dotted}" +
    ".trace-agent .ta-vide{font-size:.85rem;color:var(--encre-3);padding:.3rem .4rem}" +
    ".trace-agent .ta-resume{font-family:var(--mono);font-size:.75rem;color:var(--encre-3);margin:.4rem 0 0}";
  function styler() {
    if (document.getElementById("style-trace-agent")) return;
    var s = document.createElement("style"); s.id = "style-trace-agent"; s.textContent = STYLE;
    document.head.appendChild(s);
  }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; }
  function tokens(texte) { return Math.ceil(String(texte || "").length / 4); }
  function argsTexte(a) {
    if (a === undefined || a === null) return "";
    if (typeof a === "string") return a;
    return Object.keys(a).map(function (k) { return k + "=" + JSON.stringify(a[k]); }).join(", ");
  }
  function texteMessage(m) {
    var t = m.texte || "";
    (m.appels || []).forEach(function (c) { t += c.nom + JSON.stringify(c.args || {}); });
    return t;
  }
  var ROLES = { system: "system", user: "user", assistant: "assistant", tool: "tool", final: "assistant · fin", erreur: "erreur" };

  function TraceAgent(conteneur, opts) {
    styler();
    this.opts = opts || {};
    this.boite = el("div", "trace-agent");
    if (this.opts.titre) this.boite.appendChild(el("p", "ta-titre", this.opts.titre));
    this.liste = el("ol");
    this.boite.appendChild(this.liste);
    this.pied = el("p", "ta-resume");
    this.boite.appendChild(this.pied);
    conteneur.appendChild(this.boite);
  }
  TraceAgent.prototype.dessiner = function (messages, o) {
    o = o || {};
    var liste = this.liste;
    liste.innerHTML = "";
    if (!messages.length) liste.appendChild(el("li", "ta-vide", "(aucun message)"));
    messages.forEach(function (m, i) {
      var li = el("li", "ta-" + m.role);
      if (o.courant === i) li.classList.add("courant");
      if (o.estompes && o.estompes.indexOf(i) >= 0) li.classList.add("pale");
      li.appendChild(el("span", "ta-role", ROLES[m.role] || m.role));
      var c = el("div", "ta-txt");
      if (m.role === "tool" && m.id) c.appendChild(el("span", "ta-id", "↳ résultat de " + m.id));
      if (m.texte) {
        if (m.role === "tool") c.appendChild(el("span", "ta-obs", m.texte));
        else { var p = el("span"); p.textContent = m.texte; c.appendChild(p); }
      }
      (m.appels || []).forEach(function (a) {
        c.appendChild(el("span", "ta-appel", "→ " + a.nom + "(" + argsTexte(a.args) + ")"));
        if (a.id) c.appendChild(el("span", "ta-id", "id " + a.id));
      });
      li.appendChild(c);
      liste.appendChild(li);
    });
    if (o.resume === false) { this.pied.textContent = ""; return; }
    var total = messages.reduce(function (s, m) { return s + tokens(texteMessage(m)); }, 0);
    this.pied.textContent = o.resume || (messages.length + " message" + (messages.length > 1 ? "s" : "") +
      (this.opts.tokens ? " · ≈ " + total + " tokens renvoyés au prochain appel (estimation : 4 caractères ≈ 1 token)" : ""));
  };
  TraceAgent.tokens = tokens;
  TraceAgent.texteMessage = texteMessage;
  window.TraceAgent = TraceAgent;
})();
