# Cours interactifs

Site statique de révision pour mes cours de M1 Informatique (Université Côte d'Azur).
On apprend en manipulant : une idée par écran, une action à faire, un objectif à
atteindre avant de pouvoir continuer, et un seul exemple fil rouge par leçon.

- HTML / CSS / JavaScript, **sans dépendance ni compilation** (seules les polices
  viennent de Google Fonts, avec repli sur les polices du système).
- Fonctionne en ouvrant `index.html` directement (scripts classiques, pas de modules
  ES, pas de `fetch`) et sur GitHub Pages.
- Thème clair / sombre selon le système, lisible sur téléphone (400 px).
- Progression enregistrée dans `localStorage` (toujours dans un `try/catch` : si le
  stockage est indisponible, le site marche et la progression repart de zéro).

> Le dépôt est public : aucun PDF, sujet ou corrigé de cours n'est copié ici.
> Les exemples sont redessinés à partir des cours.

## Structure

```
index.html            Accueil : une carte par matière, « Reprendre », cartes à revoir
matiere.html          Page d'une matière (matiere.html?m=<id>) : chapitres, contenus, progression
revision.html         Séance de cartes (revision.html?m=<id>&p=<paquet>)
test.html             Test noté (test.html?m=<id>&t=<test>) : QCM, score par notion, historique
catalogue.js          ★ La liste centrale des matières et de leurs contenus
socle/
  css/theme.css       Couleurs (clair/sombre), typographie
  css/composants.css  Composants partagés
  js/stockage.js      localStorage protégé par try/catch
  js/progression.js   Lecture/écriture de la progression (leçons, cartes, dernière activité)
  js/navigation.js    Catalogue, chemins, en-tête, chargement des paquets, résumés
  js/lecon.js         Lecteur de leçon : étapes, objectif bloquant, rail de progression
  js/exercices.js     Petits exercices : choix, saisie d'un nombre, vrai/faux, associer à une catégorie, cases à cocher, remise en ordre,
                      saisie d'un texte (sortie d'un programme) comparé comme par un juge (Exercices.texte)
  js/courbes.js       Graphique SVG de fonctions d'une variable (n par défaut, nom d'axe réglable : nomX)
  js/graphe.js        Figure SVG de (multi)graphe cliquable
  js/pasapas.js       Pseudo-code avec ligne courante + contrôleur ⏮ ◀ ▶ ⏵
  js/cartes.js        Cartes de révision en répétition espacée (boîtes de Leitner)
  js/controle.js      Test noté : une question par écran, correction, score par notion
  js/machines.js      Affectation de tâches à des machines : affichage, List Scheduling, LPT, optimum exact
  js/tableau.js       Tableau de cases indexées, cliquables, avec pointeurs et plage encadrée
  js/arbre.js         Arbres binaires : parcours, reconstruction (préfixe/postfixe + infixe), dessin
  js/tablepd.js       Table de programmation dynamique à remplir case par case (dépendances encadrées)
  js/grille.js        Grille de puzzle cliquable (carré latin, inégalités, Binairo…) : doublons, signes
  js/frise.js         Intervalles de temps sur une frise, cliquables (sélection d'activités, ordonnancement)
  js/vecteurs.js      Plan 2D : vecteurs et points déplaçables au doigt, angle ; produit scalaire, norme, cosinus
matieres/<matiere>/
  lecons/             Une leçon = un .html (squelette) + un .js (les étapes)
  ateliers/           Algorithmes exécutés pas à pas (même lecteur que les leçons)
  cartes/             Paquets de cartes (fichiers de données .js)
  tests/              Tests notés (fichiers de données .js)
  js/                 Modèles propres à la matière (ex. contraction.js, parcours.js)
```

Les briques `grille.js`, `frise.js` et `vecteurs.js` injectent leur propre CSS (balise `<style>` créée une seule fois),
construit uniquement avec les variables de `theme.css` : rien à ajouter dans `composants.css`.

Conventions visuelles : texte en serif, police à chasse fixe uniquement pour le code et
les valeurs, **une seule couleur d'accent, réservée à ce qui est « en cours »** (étape
courante, ligne exécutée, arête tirée). Les encadrés « Note de fidélité » signalent ce
qui manque ou est ambigu dans le cours, au lieu de l'inventer.

## Ajouter une matière

Dans `catalogue.js`, ajouter un objet dans `matieres` :

```js
{ id: "model-checking", titre: "Model Checking for AI", dossier: "Model_checking_for_AI" }
```

Sans `chapitres`, elle s'affiche « à venir ». Pour lui donner du contenu, ajouter
`description` et `chapitres` (voir Advanced Algorithms comme modèle).

## Ajouter une leçon (ou un atelier)

1. Copier `matieres/advanced-algorithms/lecons/coupe-min-contraction.html` dans le
   dossier de la matière, en ajustant `data-racine` (chemin vers la racine du site) et
   les `<script>` propres à la leçon.
2. Écrire le `.js` de la leçon :

```js
Lecon.demarrer({
  matiere: "advanced-algorithms",
  id: "ma-lecon",                       // même id que dans catalogue.js
  etapes: [
    {
      titre: "Une idée",
      texte: "<p>Explication courte.</p>",
      objectif: "Ce que l'étudiant doit réussir.",
      installer: function (zone, api) {
        // construire l'interaction dans `zone`, puis quand c'est réussi :
        api.valider("Message de conclusion.");
        // api.retour("texte", true | false | null) affiche un retour immédiat
        // return function () { … }  // (optionnel) nettoyage : minuteurs, etc.
      }
    }
  ],
  fin: { texte: "<p>À retenir…</p>", cartes: "id-du-paquet" }
});
```

3. L'inscrire dans `catalogue.js`, dans le bon chapitre :

```js
{ type: "lecon", id: "ma-lecon", titre: "…", fichier: "matieres/<matiere>/lecons/ma-lecon.html", etapes: 8 }
```

`etapes` doit être égal au nombre d'étapes (l'accueil s'en sert pour la progression ;
la console avertit en cas d'écart). Pour un atelier, même chose avec `type: "atelier"`.

## Ajouter un paquet de cartes

1. Créer `matieres/<matiere>/cartes/<paquet>.js` :

```js
Paquets.enregistrer({
  matiere: "advanced-algorithms",
  id: "mon-paquet",
  titre: "…",
  cartes: [ { id: "identifiant-stable", q: "Question ?", r: "Réponse (HTML court)" } ]
});
```

2. L'inscrire dans `catalogue.js` : `{ type: "cartes", id: "mon-paquet", titre: "…", fichier: "matieres/<matiere>/cartes/mon-paquet.js" }`.

Garder l'`id` d'une carte stable : c'est lui qui retient sa boîte.

**Répétition espacée** : 5 boîtes. Une carte nouvelle ou ratée est en boîte 1 (revue
dans la séance) ; « Je savais » la fait monter d'une boîte, revue après 1, 3, 7 puis
15 jours.

## Ajouter un test noté

1. Créer `matieres/<matiere>/tests/<test>.js` :

```js
Tests.enregistrer({
  matiere: "advanced-algorithms", id: "mon-test", titre: "…",
  notions: { cle: { titre: "Nom de la notion", lecon: "id-de-la-lecon-a-revoir" } },
  questions: [ { id: "q1", notion: "cle", enonce: "…", options: ["…", "…"], bonnes: [0], explication: "…" } ]
});
```

Plusieurs indices dans `bonnes` → cases à cocher (le point n'est accordé que si la sélection est exacte).

2. L'inscrire dans `catalogue.js` : `{ type: "test", id: "mon-test", titre: "…", fichier: "matieres/<matiere>/tests/mon-test.js" }`.

## Publier sur GitHub Pages

Pousser le dossier tel quel sur un dépôt, puis Settings → Pages → « Deploy from a
branch », dossier racine. Aucune étape de construction.

## Mettre à jour le site

Adresse : <https://salimanag.github.io/cours-interactifs/> (dépôt `SalimanAG/cours-interactifs`,
branche `main`, dossier racine). La version de référence est le dossier `cours-interactifs`
sur mon ordinateur : on modifie toujours là, puis on republie.

1. **Ajouter le contenu** dans le dossier (leçon, cartes, test…) et l'inscrire dans
   `catalogue.js` (voir les sections ci-dessus). Ouvrir `index.html` en local pour vérifier.
2. **Relire avant de publier** (le dépôt est public) : aucun PDF, sujet ou corrigé recopié,
   aucune note, aucun résultat personnel (score, réponses données à un test).
3. **Republier** — au choix :
   - *Avec Claude* : « Republie le site depuis le dossier cours-interactifs ». Claude copie
     le dossier dans son conteneur, commite et pousse depuis là (pas depuis l'ordinateur,
     où git laisse des fichiers `.lock`).
   - *Depuis le navigateur* : sur github.com, dans le dépôt, « Add file → Upload files »,
     glisser les fichiers modifiés **en gardant leurs dossiers**, puis « Commit changes ».
4. **Attendre 1 à 2 minutes** (onglet *Actions* du dépôt : « pages build and deployment »
   doit être vert), puis recharger le site sur le téléphone. Si l'ancienne version reste
   affichée, forcer le rechargement ou ajouter `?v=2` à l'adresse.

La progression (leçons faites, cartes) est stockée dans le navigateur de chaque appareil :
republier ne l'efface pas, tant que les `id` dans `catalogue.js` et dans les paquets ne changent pas.
