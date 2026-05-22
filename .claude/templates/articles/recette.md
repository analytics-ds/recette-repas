---
title: "{{ Nom de la recette }}"
layout: "recette"
date: {{ AAAA-MM-JJ }}
lastmod: {{ AAAA-MM-JJ }}
description: "{{ Phrase descriptive avec le mot-cle principal, le temps total et les ingredients phares. 150-160 caracteres. }}"
categories: ["{{ Une categorie existante du site }}"]
tags: ["{{ tag1 }}", "{{ tag2 }}", "{{ tag3 }}"]
author: "{{ Auteur du site }}"
image: "images/recettes/{{ slug }}.jpg"
prep_min: {{ minutes de preparation }}
cook_min: {{ minutes de cuisson }}
difficulty: "{{ Facile | Intermediaire | Difficile }}"
servings: {{ nombre de portions de reference }}
servings_options: [{{ ex: 2, 4, 6 }}]

# Ingredients principaux : un par ligne. qty numerique pour permettre la mise a l'echelle.
# image : photo ronde de l'ingredient dans static/images/ingredients/ (jpg).
ingredients:
  - { name: "{{ Ingredient }}", qty: {{ nb }}, unit: "{{ g/cl/cs/cc/piece... }}", image: "images/ingredients/{{ slug }}.jpg" }

# Ingredients de base (placard) : sel, poivre, huile, beurre, sucre, farine...
# Soit qty + unit (mis a l'echelle), soit note libre ("selon le gout"). image en PNG transparent.
pantry:
  - { name: "Huile d'olive", qty: 1, unit: "cs", image: "images/ingredients/huile-olive.png" }
  - { name: "Sel", note: "selon le gout", image: "images/ingredients/sel.png" }
  - { name: "Poivre", note: "selon le gout", image: "images/ingredients/poivre.png" }

# Ustensiles necessaires : image en PNG transparent dans static/images/ustensiles/.
ustensiles:
  - { name: "{{ Ustensile }}", image: "images/ustensiles/{{ slug }}.png" }

# Valeurs nutritionnelles : estimation realiste. portion = par portion de reference, per100g = pour 100 g.
# Garder les memes libelles (utilises pour le schema.org NutritionInformation). sub:true pour les sous-lignes.
nutrition_note: "Valeurs moyennes estimees pour une portion d'environ {{ poids }} g. Elles varient selon les marques et les quantites utilisees."
nutrition:
  - { label: "Énergie", unit: "kcal", portion: {{ }}, per100g: {{ }} }
  - { label: "Énergie", unit: "kJ", portion: {{ }}, per100g: {{ }} }
  - { label: "Matières grasses", unit: "g", portion: {{ }}, per100g: {{ }} }
  - { label: "dont acides gras saturés", unit: "g", portion: {{ }}, per100g: {{ }}, sub: true }
  - { label: "Glucides", unit: "g", portion: {{ }}, per100g: {{ }} }
  - { label: "dont sucres", unit: "g", portion: {{ }}, per100g: {{ }}, sub: true }
  - { label: "Fibres alimentaires", unit: "g", portion: {{ }}, per100g: {{ }} }
  - { label: "Protéines", unit: "g", portion: {{ }}, per100g: {{ }} }
  - { label: "Sel", unit: "g", portion: {{ }}, per100g: {{ }} }

# Etapes : chaque etape = un titre court + un texte detaille et explicite.
# Donner les reperes concrets (temps, temperature, signes visuels, astuces anti-rate).
steps:
  - title: "{{ Titre court de l'etape }}"
    text: "{{ Description detaillee : quoi faire, combien de temps, a quoi ca doit ressembler, l'astuce a connaitre. }}"

faq:
  - { q: "{{ Question frequente }}", a: "{{ Reponse claire et complete }}" }
---

{{ Paragraphe d'introduction : contexte de la recette, pourquoi elle plait, en integrant naturellement le mot-cle principal et au moins 3 liens internes contextuels vers d'autres recettes du blog. }}

<!-- NOTES POUR CLAUDE
TYPE : Fiche recette (layout "recette"). Rendu en 2 colonnes : contenu + sidebar nutritionnelle (toggle "par portion" / "pour 100 g"). Inspiration HelloFresh.

OBLIGATOIRE sur chaque recette :
1. INGREDIENTS PRINCIPAUX : qty numerique (mise a l'echelle automatique via le selecteur de portions).
2. INGREDIENTS DE BASE (pantry) : toujours lister le sel, le poivre, l'huile/beurre et autres basiques du placard. Ne jamais les oublier, meme s'ils ne sont pas dans la liste principale.
3. USTENSILES : lister le materiel reellement necessaire (casserole, poele, saladier, fouet, passoire, four, etc.).
4. NUTRITION : valeurs realistes et coherentes (per100g = portion / (poids portion en g / 100)). Garder les libelles exacts ci-dessus pour le schema.org.
5. ETAPES DETAILLEES : etapes explicites avec titres, reperes de temps/temperature, signes visuels, et astuces. Pas de phrases vagues.

IMAGES (via Playwright sur Google Images, voir feedback "External UIs via Playwright") :
- Ustensiles et ingredients de base : PNG TRANSPARENT. Rechercher sur https://www.google.com/search?q={{terme}}&tbm=isch&tbs=ic:trans
- Recuperer les URLs .png embarquees dans le HTML de la page de resultats (regex sur le innerHTML), telecharger la 1re valide (PNG, > 3 Ko), puis redimensionner (sips -Z 240) pour alleger.
- Ustensiles -> static/images/ustensiles/  |  Ingredients -> static/images/ingredients/
- Ingredients principaux : photo ronde (jpg) classique.

SEO : minimum 3 liens internes contextuels (ancre = mot-cle de la recette cible). lastmod a la date du jour. Le schema.org Recipe + FAQ + Breadcrumb est genere automatiquement par le layout.
-->
