# DA du site recette-repas

Direction artistique reprise de la maquette **Deliciously Ella** (fournie par Pierre, scrape dans `deliciouslyella-export/`), adaptée au blog. Style éditorial food : vert profond, vert sauge, crème, photos de plats, cartes arrondies, polices serif + sans.

## Polices
- **Titres** : Source Serif 4 (serif, poids 400, italique pour les accents `.rr-em`)
- **Corps / UI** : Chivo (sans-serif)
- Chargées via Google Fonts dans `baseof.html` sur toutes les pages.

## Palette (échantillonnée sur la maquette)

| Rôle | Hex |
|---|---|
| Vert profond (texte, boutons, footer) | `#27483E` |
| Vert atténué | `#5D766E` |
| Vert sauge (bandeau défilant) | `#CFE2C0` |
| Vert pâle (cards, sections, header bandeau de titre) | `#E7F1DF` |
| Crème / fond alt | `#F9F7F5` |
| Beige | `#F2EFEB` |
| Bordure / ligne | `#E4E2DD` |
| Blanc | `#FFFFFF` |

- Boutons : **pilule** (`border-radius: 100px`), vert plein `#27483E`, texte blanc, `text-transform: capitalize`.
- Cards (3 cartes home) : fond `#E7F1DF`, texte vert foncé.

## Structure & règles
- **Header et footer STRICTEMENT identiques sur toutes les pages** (cf. [[feedback-recette-repas-header-footer]]). Un seul `partials/header.html` (bandeau d'annonce + topbar sticky + logo marmite + menu + bouton "Toutes nos recettes") et un seul `partials/footer.html` (vert, colonnes + réseaux + liens légaux), inclus par `baseof.html` partout.
- Header + bandeau d'annonce = **sticky ensemble** (descendent avec la page au scroll).
- Logo : `static/images/logo-mark.png` (marmite, fond transparent) + texte "Recette & Repas". Favicons générés depuis cette icône.
- Menu : Entrées, Plats, Desserts, Cuisine du monde, Conseils et astuces, Batch cooking. Bouton CTA = "Toutes nos recettes" -> /blog/. À propos uniquement au footer.
- Hero : vraie `<img>` affichée en entier (téléphone non coupé), encart texte en surimpression à gauche.
- Page d'accueil : CSS dans `assets/css/home.css` (classes `.rr-*`), chargée partout. Pages internes : `assets/css/main.css` (mêmes tokens, classes templates Hugo).
- Tokens DA globaux dans `main.css :root` ET `home.css .rr-home`.

## SEO home
- Optimisée pour le mot-clé **"idée recette"** (brief Datafer). H1 ciblé, structure Hn propre (H1 > H2 > H3), bloc éditorial en sections alternées image/texte, tableau, listes, FAQ en H3. Champ sémantique intégré.

## Référence
- Maquette source : `deliciouslyella-export/homepage-final.html`
- Captures : `screenshots/`
