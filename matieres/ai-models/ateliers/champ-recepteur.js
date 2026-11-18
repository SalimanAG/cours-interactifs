/* Atelier : calculer un champ récepteur (cours « Convolutional Neural Networks », diapos 21, 22, 50 et 51).
   r_l = r_(l−1) + (k_l − 1)·j_(l−1),  j_l = j_(l−1)·s_l,  r_0 = 1, j_0 = 1. */
(function () {
  "use strict";
  var A = AIM, el = Site.el;
  function rj(couches) {
    var r = 1, j = 1;
    return couches.map(function (c) { r = r + (c[0] - 1) * j; j = j * c[1]; return [r, j]; });
  }
  function exercice(zone, api, couches, conclusion) {
    var att = rj(couches), ok = {};
    var ed = {};
    couches.forEach(function (c, i) { ed[i + ",2"] = true; ed[i + ",3"] = true; });
    var mx = new Matrice(A.cadre(zone), {
      nom: "couche", lignes: couches.map(function (c, i) { return String(i + 1); }), colonnes: ["k", "s", "r", "j"],
      onSaisie: function (i, j, t) {
        var v = Exercices.lireNombre(t), k = i + "," + j;
        if (v === att[i][j - 2]) ok[k] = true; else delete ok[k];
        var n = Object.keys(ok).length;
        if (n === couches.length * 2) { api.retour("Tout est juste.", true); api.valider(conclusion); }
        else api.retour(n + " case(s) juste(s) sur " + couches.length * 2 + ".", null);
      }
    });
    mx.dessiner(couches.map(function (c) { return [c[0], c[1], "", ""]; }), { format: String, editables: ed });
  }
  var FORMULE = "<div class='formule lignes'>r_l = r_(l−1) + (k_l − 1)·j_(l−1)\nj_l = j_(l−1)·s_l        r₀ = 1, j₀ = 1</div>";

  Lecon.demarrer({
    matiere: "ai-models",
    id: "champ-recepteur",
    etapes: [
      {
        titre: "Trois convolutions 3×3",
        texte: "<p>Le <b>champ récepteur</b> est la région de l'entrée qui peut influencer une unité profonde. Pour chaque couche (taille k, stride s) :</p>" + FORMULE +
          "<p>j_l (le « saut ») est l'écart, en pixels d'entrée, entre deux unités voisines de la couche l.</p>",
        objectif: "Remplir r et j pour trois convolutions 3×3 de stride 1.",
        installer: function (zone, api) {
          exercice(zone, api, [[3, 1], [3, 1], [3, 1]], "r = 3, 5, 7 : de petits noyaux donnent de grands champs récepteurs après plusieurs couches.");
        }
      },
      {
        titre: "L'exercice 2 du cours",
        texte: "<p>Le cours demande le champ récepteur d'une unité de la dernière couche pour (3×3, s = 1) → (3×3, s = 2) → (3×3, s = 1).</p>" + FORMULE,
        objectif: "Remplir le tableau et lire le champ récepteur final.",
        installer: function (zone, api) {
          exercice(zone, api, [[3, 1], [3, 2], [3, 1]], "Champ récepteur 9×9 : la couche de stride 2 fait passer le saut de 1 à 2, donc le 3ᵉ noyau 3×3 ajoute 4 pixels par dimension au lieu de 2.");
          A.note(zone, "Dans le cours, la diapo « Solution: receptive field » (50) est placée avant celle de l'énoncé « In-class exercise 2 » (51). Le résultat est le même : 9.");
        }
      },
      {
        titre: "Avec des poolings",
        texte: "<p>Un max pooling 2×2 de stride 2 compte comme une couche (k = 2, s = 2). Le sous-échantillonnage change aussi l'échelle à laquelle une unité intègre le contexte.</p>" + FORMULE,
        objectif: "Remplir le tableau pour conv 3×3 → pool 2×2 → conv 3×3 → pool 2×2 → conv 3×3.",
        installer: function (zone, api) {
          exercice(zone, api, [[3, 1], [2, 2], [3, 1], [2, 2], [3, 1]], "r = 18 : chaque pooling double le saut, et les 3×3 suivants comptent double, puis quadruple.");
        }
      },
      {
        titre: "Construire un champ de 15",
        texte: "<p>Trois convolutions 3×3. Choisis le stride de chacune (1 ou 2) pour qu'une unité de la 3ᵉ couche voie exactement 15 × 15 pixels.</p>",
        objectif: "Atteindre r₃ = 15.",
        installer: function (zone, api) {
          var s = [1, 1, 1];
          var r = el("div", "rangee-btn"); r.style.justifyContent = "center"; zone.appendChild(r);
          var out = A.html(zone, "");
          var bts = s.map(function (v, i) {
            var b = el("button", "btn btn-petit", ""); b.type = "button";
            b.onclick = function () { s[i] = s[i] === 1 ? 2 : 1; maj(); };
            r.appendChild(b); return b;
          });
          function maj() {
            bts.forEach(function (b, i) { b.textContent = "couche " + (i + 1) + " : s = " + s[i]; b.classList.toggle("btn-plein", s[i] === 2); });
            var t = rj(s.map(function (v) { return [3, v]; }));
            out.innerHTML = A.tableau(["couche", "k", "s", "r", "j"], t.map(function (x, i) { return [String(i + 1), "3", String(s[i]), "<span class='mono'>" + x[0] + "</span>", "<span class='mono'>" + x[1] + "</span>"]; }));
            if (t[2][0] === 15) { api.retour("r₃ = 15.", true); api.valider("Strides 2 et 2 sur les deux premières couches : 3 + 2·2 + 2·4 = 15 (le stride de la dernière couche ne change pas son propre champ récepteur)."); }
            else api.retour("r₃ = " + t[2][0] + ".", null);
          }
          maj();
        }
      }
    ],
    fin: { texte: "<p>À retenir : <span class='mono'>r_l = r_(l−1) + (k_l − 1)·j_(l−1)</span>, <span class='mono'>j_l = j_(l−1)·s_l</span> : les strides multiplient le saut, et chaque noyau suivant agrandit le champ d'autant.</p>", cartes: "cnn" }
  });
})();
