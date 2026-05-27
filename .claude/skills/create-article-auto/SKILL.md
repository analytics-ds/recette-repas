# Skill : Créer un article evergreen SEO (full auto) — recette-repas

Cette skill produit **automatiquement** un article evergreen SEO (pas GEO) à partir d'un mot-clé pris dans la roadmap éditoriale du blog `recette-repas`. **PBN FR uniquement**, pas de version EN. Aucun input humain. Aucun point d'arrêt. Publication directe sur GitHub.

Elle est destinée à être déclenchée par une routine planifiée (mardi + vendredi à 3h du mat via `/schedule`). Elle peut aussi être lancée manuellement pour tester.

## Quand l'utiliser

- Déclenchement automatique via routine planifiée (cron distant CCR).
- Déclenchement manuel : `/create-article-auto` dans le contexte du blog `recette-repas`.

## Pré-requis dans le blog

- `roadmap.yaml` existe à la racine et contient au moins une entrée `status: todo`.
- `hugo.toml` configuré avec FR comme langue unique.
- `content/recettes/` existe.
- Remote git `origin` configuré (`analytics-ds/recette-repas`), accès push.
- Clé SerpAPI dans `SERPAPI_API_KEY` OU MCP `mcp__serpapi__search` dispo.
- Clé Datafer dans `DATAFER_API_KEY` (`dfk_...`) si on veut optimiser le score via l'API (étape 7.5 optionnelle).

## Philosophie : full auto, pas de human in the loop

Aucune question à l'utilisateur. Toutes les décisions sont prises par l'agent à partir de :
- Le mot-clé de la roadmap
- L'analyse SERP automatique
- Le contexte du site (CLAUDE.md, hugo.toml, articles déjà publiés)

Si une étape bloque (SerpAPI indispo, image introuvable, build Hugo échoue, push rejeté), l'agent **n'insiste pas** : il marque l'entrée `status: failed` dans la roadmap avec le message d'erreur, commit la roadmap, et sort proprement en exit code non-zero.

## Pas de quota hebdomadaire (règle exemptée)

Cette skill **ignore complètement** la règle indicative "4 articles par semaine" mentionnée dans le `CLAUDE.md`. Cette règle s'applique uniquement aux skills interactives.

`/create-article-auto` est faite pour tourner en routine cron (mardi/vendredi 3h Paris) et doit publier l'entrée éligible de la roadmap **sans aucune vérification de quota**. Ne pas lire le `MEMORY.md` pour compter les publications de la semaine. Publier point.

Le seul critère d'éligibilité est défini à l'Étape 0 : `status == todo` ET `scheduled_date <= today`.

## Étape 0 — Sélection de l'entrée roadmap

1. `cd` vers la racine du blog (la skill est lancée depuis ce contexte).
2. Pull du remote :
   ```bash
   git pull --rebase origin main
   ```
   Si échec : abort avec log clair.
3. Lire `roadmap.yaml`.
4. Filtrer les entrées :
   - `status == todo`
   - `scheduled_date <= today` (YYYY-MM-DD)
5. Trier par `scheduled_date` croissante. Prendre la première.
6. Si aucune entrée éligible : logger "Aucune entrée roadmap éligible aujourd'hui" et exit 0 (pas d'erreur).

L'entrée sélectionnée fournit : `kw`, `category`, `scheduled_date`.

## Étape 1 — Analyse SERP automatique

### 1.1 Requête SerpAPI

**Mode A - MCP** : si `mcp__serpapi__search` disponible, appeler avec `q=<kw>`, `engine=google`, `hl=fr`, `gl=fr`, `num=10`, `location=France`.

**Mode B - curl direct** :
```bash
QUERY_ENC=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$KW")
curl -s "https://serpapi.com/search.json?q=${QUERY_ENC}&engine=google&hl=fr&gl=fr&num=10&location=France&api_key=${SERPAPI_API_KEY}" > /tmp/serp.json
```

Si `SERPAPI_API_KEY` absente ET MCP indispo : marquer failed avec `error: "SerpAPI indispo"` et abort.

### 1.2 Extraction données

Extraire de SerpAPI :
- `organic_results[0..9]` : `title`, `link`, `snippet`
- `related_questions` (People Also Ask) si présents
- `related_searches` si présents

**Ne PAS tenter de fetch les URLs concurrentes** (sandbox cloud les bloque).

### 1.3 Synthèse auto

- **Intention de recherche** : informationnelle par défaut sur ce PBN (questions cuisine)
- **Angles concurrents** : sous-thèmes récurrents dans titles + snippets
- **Champ sémantique** : mots récurrents
- **FAQ pertinente ?** : vrai si `related_questions` présents
- **Longueur cible** : 2500-3500 mots (PBN cuisine, articles bien étoffés)
- **Tableau pertinent ?** : vrai si KW contient "comment", "combien", "quel", ou si les titles concurrents montrent des comparaisons
- **Questions FAQ** : 4-6 questions construites à partir des `related_questions`, reformulées (pas de copie mot pour mot)

## Étape 2 — Title, meta description, h1

### Title (SEO)
- Contient le `kw` en premier tiers
- Max 60 caractères
- Format cible : `[Kw] : [angle] | Recette & Repas`
- 1 seule option, choix direct

### Meta description
- Max 155 caractères
- Contient le `kw`
- Phrase descriptive factuelle, pas de CTA agressif

### H1
- Contient le `kw` en début
- Plus engageant que le SEO title (peut être plus long)
- Format : `[Kw avec verbe action] : [angle complémentaire]`
- Le H1 est rendu par Hugo depuis le frontmatter `h1:`, pas dans le body

## Étape 3 — Structure Hn auto

- **1 H1** (depuis frontmatter, contient `kw`)
- **5 à 8 H2** construits à partir des patterns récurrents (étape 1.3)
- **1 H2 "À retenir"** obligatoire en fin (avant FAQ) — **important pour le score Datafer GEO quickSummary**
- **1 H2 "Questions fréquentes"** si FAQ pertinente, en H3 finissant par "?"
- **H3** : 1 à 3 par H2, optionnels
- Pas de H2 vague type "Introduction"/"Conclusion"
- Pas de `&`, pas de tiret cadratin/demi-cadratin

## Étape 4 — Auteur (auteur unique)

Auteur unique du blog : **Julien Marchand** (placeholder en attendant le vrai chef).

Dans le frontmatter : `author: "Julien Marchand"`. Pas de système `data/authors.yaml` sur ce PBN.

## Étape 5 — Image hero auto

```bash
bash .claude/scripts/fetch-image.sh "<kw traduit en anglais>" "<slug>" "static/images/recettes"
```

- Si exit non-zero : retenter une fois avec query plus générique (`category` traduite en anglais).
- Si 2e échec : marquer `failed` "image fetch failed" et abort.
- Frontmatter : `image: "images/recettes/<slug>.jpg"`, `image_alt: "<alt FR>"`.

## Étape 6 — Maillage interne auto

1. Lister tous les `.md` dans `content/recettes/` (sauf `_index.md`).
2. Lire le frontmatter de chacun : `title`, slug, `categories`, `tags`.
3. Scorer par proximité (catégorie identique = +3, tags partagés = +1/tag, mots communs entre KW = +2).
4. Garder les 3 à 5 meilleurs scores.
5. Ancre = mot-clé principal de l'article cible.
6. Positionner les liens contextuellement dans le body. Au moins **3 liens internes obligatoires** (règle CLAUDE.md du blog).

Si le blog a moins de 3 articles : faire au mieux (2 liens, 1 lien, ou aucun pour le tout premier). Ne pas bloquer.

## Étape 7 — Rédaction FR complète

Produire le fichier `content/recettes/[slug].md`.

### Frontmatter type (recette-repas)
```yaml
---
title: "[Title SEO]"
is_guide: true
slug: "[slug-kebab-sans-accents]"
date: 2026-05-27
lastmod: 2026-05-27
seo_title: "[Title SEO max 60 car]"
h1: "[H1 plus engageant]"
description: "[Meta description <= 155 car]"
categories: ["[Catégorie hugo.toml]"]
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
image: "images/recettes/[slug].jpg"
image_alt: "[Alt FR, max 125 car]"
author: "Julien Marchand"
faq:
  - q: "[Q1] ?"
    a: "[R1, 3-5 phrases]"
  - q: "[Q2] ?"
    a: "[R2]"
  # 4 à 6 questions au total
---
```

**Important sur la FAQ** : sur ce PBN, la FAQ est dans le frontmatter (format `q:` / `a:`), pas dans le body. Le layout Hugo `single.html` la rend en JSON-LD + bloc visible en bas d'article.

### Body
- Premier paragraphe : KW exact + intro
- Callout-brief en intro avec liste à puces 4-5 items :
  ```html
  <div class="callout-brief">

  - **Point 1** : ...
  - **Point 2** : ...
  - **Point 3** : ...

  </div>
  ```
- Respecter la structure Hn de l'étape 3
- Longueur cible : 2500-3500 mots
- Densité KW exact : 1-2 % (compter avec : `grep -oc "[kw]" body`)
- KW exact réparti sur au moins 3 des 4 quarts du texte
- Mots-clés en **gras** quand pertinent
- Au moins 1 **tableau markdown** avec données chiffrées (très important pour score Datafer GEO + sémantique)
- 3+ liens internes contextuels (étape 6)
- 3+ données chiffrées avec unités (min, °C, g, ml, %, jours...) pour score GEO statistics
- Ton impersonnel (pas de je/tu/nous/vous)
- Paragraphes 40-140 mots
- Pas de `&`, pas de séparateur horizontal `---`, pas de tiret cadratin/demi-cadratin
- **H2 "À retenir" obligatoire** en fin d'article avant FAQ (débloque GEO quickSummary +20pts Datafer)

## Étape 7.5 — Scoring Datafer (optionnel mais recommandé)

Si `DATAFER_API_KEY` disponible :

```bash
# 1. Convertir md -> html enrichi (H1 + FAQ rendue)
python3 /tmp/md_to_html_datafer.py content/recettes/[slug].md /tmp/article.html

# 2. Créer brief Datafer
curl -X POST "https://datafer.analytics-e0d.workers.dev/api/v1/briefs" \
  -H "Authorization: Bearer ${DATAFER_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -d '{"keyword": "[kw]", "country": "fr"}'

# 3. Poll jusqu'à ready (3-90s)

# 4. POST le contenu pour scorer
curl -X POST "https://datafer.analytics-e0d.workers.dev/api/v1/briefs/{id}/content" \
  -H "Authorization: Bearer ${DATAFER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"editorHtml\": \"$(cat /tmp/article.html | jq -Rsa .)\"}"
```

Récupérer `score` et `competitors.best`. Logger le score. Si score < best : log warning mais on continue (on ne re-rédige pas en auto).

Si pas de `DATAFER_API_KEY` : skip silencieusement.

## Étape 8 — Build Hugo

```bash
hugo --gc --minify
```

- Si exit non-zero : marquer `failed` avec log d'erreur, abort.
- Si OK : noter le nombre de pages générées.

## Étape 9 — Update roadmap et MEMORY.md

### Roadmap
Mettre à jour l'entrée traitée :
```yaml
  status: done
  brief_id: "[id si Datafer utilisé, sinon null]"
  datafer_score: [score si Datafer, sinon null]
  published_date: "[YYYY-MM-DD]"
  published_url: "https://recette-repas.com/recettes/[slug]/"
  error: null
```

### MEMORY.md
Ajouter une ligne dans la section de la semaine en cours :
```
- **YYYY-MM-DD** — [Titre](content/recettes/[slug].md) — KW : `[kw]` (vol [X], KD [Y], Datafer [score]/100) | auto
```

Le suffixe `| auto` distingue les articles générés par cette skill.

## Étape 10 — Commit et push

```bash
git add -A
git commit -m "Auto: [kw]"
git pull --rebase origin main
git push origin main
```

En cas de rejet du push après rebase : retenter jusqu'à 3 fois. Si toujours KO : marquer failed "push rejected 3x", commit du roadmap local, exit non-zero.

## Gestion des échecs (transversal)

À n'importe quelle étape, si un blocage survient :
1. Loger le message d'erreur précis (étape + cause).
2. Mettre à jour l'entrée roadmap :
   ```yaml
     status: failed
     error: "[étape] [message]"
   ```
3. Si des fichiers article ont été partiellement écrits : les supprimer (revenir à l'état pre-skill).
4. Commit uniquement le `roadmap.yaml` mis à jour, message `Auto: roadmap update (failed)`.
5. Push.
6. Exit non-zero.

L'entrée `failed` n'est **pas retentée automatiquement**. L'humain corrige et la repasse en `todo`.

## Format de `roadmap.yaml`

Voir `.claude/templates/roadmap-template.yaml`. Champs spécifiques à recette-repas :

```yaml
articles:
  - kw: "mot cle principal"
    category: "Conseils et astuces"   # ou autre catégorie hugo.toml
    volume: 720                       # informatif
    kd: 20                            # informatif
    scheduled_date: "2026-06-02"
    status: todo
    brief_id: null                    # rempli si Datafer utilisé
    datafer_score: null
    published_date: null
    published_url: null
    error: null
```

## Logs

Tout le déroulement dans `/tmp/create-article-auto-[YYYY-MM-DD-HHMM].log`. Conserver les 30 derniers logs (rotation).
