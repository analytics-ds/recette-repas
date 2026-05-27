# Skill : Produire des articles evergreen SEO en batch local — recette-repas

Cette skill produit **plusieurs** articles evergreen SEO en batch sur le Mac de Pierre (local, Opus 4.7, fetch concurrents réel). Complément de `/create-article-auto` (cron CCR cloud Sonnet). À utiliser quand on veut un batch mensuel de qualité max avec maillage interne propre entre articles produits dans la même session.

## Différences avec `/create-article-auto`

| Critère | `/create-article-auto` (cron) | `/create-article-seo` (local) |
|---|---|---|
| Modèle | Sonnet 4.6 (CCR cloud) | Opus 4.7 (Mac local) |
| Fetch concurrents | Bloqué (sandbox) | OK |
| Maillage cross-batch | Non (1 article/run) | Oui (les articles produits ensemble se citent) |
| Cadence | 2 par semaine (mardi/vendredi 3h) | À la demande, batch mensuel |
| Quota hebdo | Ignoré | Warning soft à 4+ |

## Quand l'utiliser

- Batch mensuel : "Pierre, je veux 8 articles d'un coup avec maillage"
- KW à la demande : "rédige ces 3 KW maintenant"
- Roadmap externe (Sheet, CSV client) avec scheduling personnalisé

## 3 modes au choix

À l'invocation, demander à Pierre quel mode utiliser.

### Mode A — Roadmap blog
Prend les N premières entrées `status: todo` triées par `scheduled_date` croissante dans `roadmap.yaml`. Demander à Pierre `N` (default 5).

### Mode B — Roadmap externe
Pierre fournit une roadmap externe (Sheet URL, CSV path, ou liste collée dans le chat). Parser les KW + catégories + dates. Ne pas modifier le `roadmap.yaml` du blog.

### Mode C — KW à la demande
Pierre colle 1 ou plusieurs KW dans le chat. Catégorie inférée du KW (cuisine = "Conseils et astuces" par défaut), `scheduled_date` = today.

## 3 stratégies de scheduling

Demander à Pierre laquelle utiliser.

1. **Garder les dates source** (défaut) : utilise les `scheduled_date` tels quels.
2. **Cascade remapping** : décale tout à partir d'une date X (utile pour reporter un batch).
3. **Prochain slot dispo** : trouve les prochains mardis/vendredis libres (cadence 2/sem) et y place les articles.

## Pipeline pour chaque article

Identique à `/create-article-auto` mais avec quelques bonus locaux :

1. **Étape 0** : sélection KW (selon mode A/B/C).
2. **Étape 1** : SerpAPI + **fetch des 3-5 pages concurrentes** via WebFetch (ce que cloud ne peut pas faire).
3. **Étape 2** : title + meta + h1.
4. **Étape 3** : structure Hn (basée sur analyse réelle des concurrents, pas juste titles/snippets).
5. **Étape 4** : auteur (Julien Marchand, fixe).
6. **Étape 5** : image hero via `bash .claude/scripts/fetch-image.sh`.
7. **Étape 6** : maillage interne (avec **cross-batch** : les articles produits dans la même session se citent entre eux).
8. **Étape 7** : rédaction FR complète (frontmatter recette-repas avec FAQ dans frontmatter, callout-brief, tableau, H2 "À retenir", 3+ liens internes, etc. — voir `/create-article-auto` pour le détail).
9. **Étape 7.5** : scoring Datafer via API (`DATAFER_API_KEY`). Si score < `competitors.best`, **re-rédiger** une fois pour pousser le score (ce que `/create-article-auto` ne fait pas en cloud).
10. **Étape 8** : build Hugo après tous les articles du batch.
11. **Étape 9** : update roadmap + MEMORY.md (suffixe `| seo` pour les distinguer du `| auto`).
12. **Étape 10** : commit unique pour tout le batch + push.

## Maillage cross-batch

C'est la valeur ajoutée principale vs `/create-article-auto`. À la fin de la rédaction du batch, faire une passe finale sur chaque article pour insérer **au moins 1 lien vers un autre article du batch** (en plus des liens vers les articles déjà publiés). Cela densifie le maillage thématique dès la publication.

Algorithme :
1. Pour chaque article A du batch, identifier 1-2 autres articles B du batch les plus proches sémantiquement (catégorie identique + tags partagés + tokens KW communs).
2. Insérer 1 lien contextuel `[ancre KW de B](/recettes/[slug-B]/)` dans le body de A, dans une section pertinente.
3. Les ancres utilisent le KW principal de l'article cible (extrait du frontmatter).

## Scheduling cron via `buildFuture: false`

Pour publier le batch avec dates futures sans tout sortir d'un coup :
1. Vérifier que `hugo.toml` a `buildFuture = false` (par défaut sur Hugo, sinon ajouter).
2. Chaque article est écrit avec son `date:` futur dans le frontmatter.
3. Au build Hugo, les articles dont `date > now` sont masqués.
4. Le cron GitHub Actions (à configurer si pas déjà fait) rebuild le site mardi/vendredi 3h Paris.
5. Quand la date de l'article est atteinte, il apparaît automatiquement au prochain build.

## Conventions identiques à `/create-article-auto`

Pour tout ce qui concerne le format frontmatter, la structure Hn, les règles SEO et GEO, la FAQ format, la longueur cible, le H2 "À retenir", le scoring Datafer, etc., **se référer au SKILL.md de `/create-article-auto`** qui sert de référence canonique.

## Récap de fin de batch

À la fin, afficher dans le chat :
```
Batch terminé : [N] articles publiés
- [Titre 1] | KW [kw] | Datafer [score]/100 | [URL]
- [Titre 2] | KW [kw] | Datafer [score]/100 | [URL]
...

Maillage cross-batch : [X] liens internes inter-articles.
Build Hugo OK. Commit + push fait.
```
