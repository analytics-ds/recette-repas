# Hugo Site Factory

Ce repo est un template pour creer des sites blogs statiques avec Hugo, optimises SEO/GEO, heberges gratuitement sur GitHub Pages.

## Comment ca marche

Ce repo ne contient pas de site. Il contient les **instructions et templates** pour que Claude Code genere un site complet automatiquement.

### Premier lancement

1. L'utilisateur connecte Claude Code a ce repo
2. L'utilisateur tape `/create-site`
3. Claude pose les questions necessaires (nom du site, couleurs, categories, etc.)
4. Claude genere tout le site Hugo, les fichiers SEO, et configure le deploiement
5. L'utilisateur push sur GitHub, active GitHub Pages, le site est en ligne

### Utilisation courante

- `/create-article` : créer un nouvel article de blog (choix parmi plusieurs types : article standard, comparatif). Push automatiquement sur GitHub si le repo est configuré
- `/create-article-auto` : **publication automatique** d'un article evergreen SEO depuis la roadmap `roadmap.yaml`. Full auto, aucun input humain. Conçue pour être déclenchée par une routine planifiée (2x/semaine via `/schedule`, mardi + vendredi 3h Paris). Modèle Sonnet 4.6 forcé en CCR cloud
- `/create-article-seo` : **production batch locale** d'articles evergreen SEO depuis la roadmap. Tourne sur le Mac de Pierre (Opus 4.7, fetch concurrents réel, maillage cross-batch). 3 modes : (A) suivre la roadmap.yaml du blog, (B) roadmap externe, (C) KW à la demande
- `/seo-setup` : générer ou mettre à jour les fichiers SEO techniques de base
- `/seo` : mode interactif pour modifier/ajouter des éléments SEO
- `/serve` : lancer le serveur Hugo en local
- `/share` : lancer Hugo + ngrok (partage public)
- `/github-setup` : créer un repo GitHub + activer GitHub Pages
- `/github-deploy` : push et déployer sur GitHub Pages

## Structure du repo

```
.claude/
├── skills/
│   ├── create-site.md           ← Workflow creation de site complet
│   ├── create-article.md        ← Workflow creation d'article (multi-types)
│   ├── seo-setup.md             ← Workflow fichiers SEO techniques (baseline)
│   ├── seo.md                   ← Mode interactif SEO (modifications ponctuelles)
│   ├── serve.md                 ← Lancer le serveur Hugo en local
│   ├── share.md                 ← Lancer Hugo + ngrok (partage public)
│   ├── github-setup.md          ← Creer un repo GitHub + activer GitHub Pages
│   └── github-deploy.md         ← Push et deployer sur GitHub Pages
└── templates/
    ├── hugo-workflow.yml         ← GitHub Actions CI/CD
    ├── main.css                  ← CSS avec variables de charte graphique
    ├── articles/                 ← Templates d'articles par type
    │   ├── article-standard.md   ← Article informatif SEO + GEO (type par defaut)
    │   └── geo-comparatif.md     ← Article comparatif avec mise en avant
    ├── seo/                      ← Fichiers SEO techniques (editables)
    │   ├── robots.txt            ← Modele robots.txt
    │   ├── llms.txt              ← Modele llms.txt
    │   └── structured-data/      ← Schemas JSON-LD
    │       ├── article.json      ← BlogPosting
    │       ├── organization.json ← Organization
    │       ├── author.json       ← Person (auteur)
    │       ├── breadcrumb.json   ← BreadcrumbList
    │       ├── website.json      ← WebSite
    │       └── faq.json          ← FAQPage (a integrer manuellement)
    ├── layouts/
    │   ├── baseof.html           ← Layout de base
    │   ├── home.html             ← Page d'accueil
    │   ├── list.html             ← Pages de liste
    │   ├── single.html           ← Page article (avec affichage auteur)
    │   └── sitemap-html.html    ← Page plan du site (liste toutes les pages)
    └── partials/
        ├── header.html           ← Header/navigation
        ├── footer.html           ← Footer
        └── seo-head.html         ← Meta tags SEO + JSON-LD (OG, Twitter, canonical, schemas)
```

## Contexte du site

> Cette section est remplie automatiquement par le skill `/create-site`.
> Elle permet a Claude de connaitre le contexte du site pour les futures actions.

- **Nom du site** : Recette & Repas
- **Description** : Des recettes de cuisine faciles et des conseils pour cuisiner au quotidien.
- **URL** : https://analytics-ds.github.io/recette-repas/ (GitHub Pages, repo `analytics-ds/recette-repas`, domaine custom a venir)
- **Couleurs** : DA SaaS clean (cf. `DESIGN.md`). Texte titres `#111827`, corps `#374151`, attenue `#6B7280`. Fond `#FFFFFF` / alt `#F9FAFB`. Bordures `#F2F3F5` / rails `#E5E7EB`. Accent principal degrade vert `#21C45E -> #099D67`. Accent secondaire degrade indigo `#3C80F5 -> #4D4BE6`.
- **Polices** : Inter (titres + corps + UI)
- **Categories** : Entrées, Plats, Desserts, Cuisine du monde, Conseils et astuces
- **Langue** : Français (fr)
- **Auteur** : Julien Marchand (persona inventee, a remplacer par la vraie personne recrutee)
- **URL auteur** : https://www.linkedin.com/in/julien-marchand-chef/ (PLACEHOLDER, a remplacer par le LinkedIn du vrai chef contacte)
- **Fonction auteur** : Ancien chef de cuisine

> DA imposee : voir `DESIGN.md` a la racine. Cartes blanches arrondies (20px), ombres douces, header blanc, accents en degrade. Inter partout, pas de serif.

## Suivi des publications (MEMORY.md)

Le fichier `MEMORY.md` à la racine trace tous les articles publiés, classés par semaine. Il est mis à jour automatiquement par les skills `/create-article`, `/create-article-auto` et `/create-article-seo`.

**Repère indicatif : 4 articles par semaine maximum** pour les skills interactives (warning soft à 4+, jamais de blocage).

Comportement par skill :
- `/create-article` (création manuelle interactive) : warning soft à 4+
- `/create-article-seo` (batch local Opus) : warning soft à 4+
- `/create-article-auto` (routine cron 2x/semaine) : **la règle ne s'applique pas**, publie systématiquement l'entrée éligible de la roadmap

**Cadence cible : 2 publications par semaine** (mardi + vendredi 3h Paris), gérée par `/create-article-auto` via roadmap.

## Publications evergreen automatiques

En plus des articles créés à la main via `/create-article`, ce blog publie automatiquement des articles evergreen SEO depuis `roadmap.yaml`. Deux skills coexistent.

### Méthode 1 : CCR cloud auto (`/create-article-auto`)

- **Exécution** : sandbox cloud Anthropic (CCR), déclenchée par une routine `/schedule` (cron 2x/semaine, mardi + vendredi 3h Paris)
- **Modèle** : Sonnet 4.6 forcé (Opus 4.7 a un bug Stream idle timeout en CCR)
- **Fetch concurrents** : bloqué par le sandbox, analyse limitée aux métadonnées SerpAPI (titles + snippets + PAA)
- **Maillage cross-batch** : non (1 article à la fois)
- **Publication** : push immédiat → en ligne tout de suite
- **Cas d'usage** : tient la cadence sans intervention humaine
- **Scoring Datafer** : optionnel via `DATAFER_API_KEY`

### Méthode 2 : batch local + GitHub Actions cron (`/create-article-seo`)

- **Exécution** : Mac de Pierre (local), Opus 4.7 sans contrainte
- **Modèle** : Opus 4.7 (qualité max, pas de bug timeout)
- **Fetch concurrents** : marche normalement (WebFetch), analyse SERP avec lecture des 3-5 pages concurrentes
- **Maillage cross-batch** : oui (les articles produits dans une même batch se citent entre eux)
- **3 modes** : (A) roadmap blog, (B) roadmap externe, (C) KW à la demande
- **3 stratégies de scheduling** : garder dates source / cascade remapping / prochain slot dispo
- **Scoring Datafer** : oui, avec re-rédaction si score < competitors.best
- **Cas d'usage** : production en lot mensuelle, qualité max

### Roadmap éditoriale

Fichier : `roadmap.yaml` à la racine du blog. Format documenté dans `.claude/templates/roadmap-template.yaml`.

Chaque entrée = 1 article à publier. Champs éditables par l'humain :
- `kw` (obligatoire) : mot-clé SEO principal
- `category` (obligatoire) : doit matcher une catégorie définie dans `hugo.toml`
- `scheduled_date` (obligatoire) : date à partir de laquelle l'agent peut publier (YYYY-MM-DD)
- `status` : `todo` | `done` | `failed`
- `volume`, `kd` (informatifs, ignorés par l'agent)

Champs remplis par l'agent : `brief_id`, `datafer_score`, `published_date`, `published_url`, `error`.

### Comment ajouter / modifier une entrée

- **Ajouter** : copier un bloc existant, remplir `kw` + `category` + `scheduled_date`, garder `status: todo`.
- **Reporter** : modifier `scheduled_date`.
- **Débloquer un `failed`** : corriger la cause, repasser `status: todo`, vider `error`.

### Cron `/schedule`

La routine `/schedule` lance `/create-article-auto` 2x/semaine (mardi + vendredi 3h Paris). Si la routine n'est pas encore configurée, lancer manuellement `/create-article-auto` pour publier l'entrée éligible suivante.

## Regles generales

- Toujours utiliser `relURL` dans les templates Hugo pour les liens (compatibilite GitHub Pages)
- Les articles vont dans `content/recettes/`
- Les slugs sont en minuscules, sans accents, mots separes par des tirets
- Les slugs doivent etre COURTS : retirer les mots de liaison (a, la, le, de, du, des, et, aux). Ex : "Pates a la carbonara a la francaise" -> `pate-carbonara-francaise` ; "Cuisine du monde" -> `cuisine-monde` ; "Conseils et astuces" -> `conseils-astuces`. Definir le slug via le champ `slug` du frontmatter (recettes) ou `url` (termes de taxonomie/categories), et ajouter un `aliases` si on raccourcit un slug deja en ligne
- Ne JAMAIS utiliser `&` dans les noms de categories ou de tags — toujours remplacer par "et" (Hugo genere un double tiret `--` dans le slug, ce qui casse les URLs)
- Le ton des articles est impersonnel (pas de je/tu/nous/vous) sauf instruction contraire
- Les specs d'article (mots minimum, H2, blocs obligatoires) dependent du type choisi — lire les `<!-- NOTES POUR CLAUDE -->` dans chaque template d'article
- Chaque article doit contenir au minimum 3 liens internes contextuels vers d'autres articles du blog. L'ancre de chaque lien doit contenir le mot-cle principal de l'article cible
- L'auteur est ajoute automatiquement dans le frontmatter et affiche sur la page (configure dans `hugo.toml [params]`)
- Les templates SEO dans `.claude/templates/seo/` sont editables par l'utilisateur — toujours lire la version en place avant de generer
- Pour ajouter un nouveau type d'article, creer un `.md` dans `.claude/templates/articles/` — il sera automatiquement propose par `/create-article`
- Pour ajouter un schema JSON-LD, creer un `.json` dans `.claude/templates/seo/structured-data/` et utiliser `/seo` pour l'integrer
- Chaque article doit avoir un champ `lastmod` dans le frontmatter (= date de derniere modification). Il est utilise par le sitemap XML, le sitemap HTML et le schema JSON-LD
- Quand un article est modifie, toujours mettre a jour le champ `lastmod` avec la date du jour
- Le sitemap HTML (`/plan-du-site/`) se regenere automatiquement a chaque build Hugo
- Toujours build et verifier (`hugo`) avant de commit

## Comment repondre a l'utilisateur

- Tutoiement, ton decontracte
- Pas de jargon technique sans explication
- Reponses structurees avec listes a puces
- Pas d'emoji sauf demande explicite
