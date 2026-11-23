# aulvero.github.io

The Aulvero website, built with [Astro](https://astro.build) and deployed to GitHub Pages
by GitHub Actions on every push to `main`.

Aulvero is a GitHub organization. The site introduces our focus: highly capable small language models with a lower memory footprint.
There are currently **no announced models**. `/models/` and `/comparison/` show empty states until
entries are added to the model registry. The homepage presents the mission and latest updates.

The logo and favicon in `public/` are extracted from page 1 of the supplied
`Aulvero_logo_variants_full_quality.pdf`. The logo stays in the navigation and footer;
the homepage memory illustration is an interactive estimate based on parameter count and weight precision. The site uses system fonts, violet accents,
and light/dark themes without external font dependencies.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # type-check + static build into dist/
npm run preview    # serve dist/
```

Node 22+ (see `.nvmrc`).

## Editing the model

Everything about the models lives in **`src/data/models.ts`**. Each model's page
(`/models/<id>/`), the models index and comparison are generated from it.
The `models` array is intentionally empty. Add a complete `Model` entry when ready; its card and detail page appear automatically.

| You want to… | Do this in `src/data/models.ts` |
|---|---|
| Release a model | Set the variant's status to `"released"` and `released` to a date |
| Mark a model as training | Set the status to `"training"` |
| Add a new version | Add `{ version: "v1.5", ... }` to that model's `versions` |
| Add a model | Add a `Model` entry with its id, name, params, context, config, trainingTokens, license, summary and versions |
| Change GitHub / Hugging Face links | Edit `site.links` |

Model shapes and training budgets mirror `configs/*.yaml` in
[aulvero-train](https://github.com/aulvero/aulvero-train). Keep them in sync when a config changes.

## Documentation

The docs at [/docs](https://aulvero.github.io/docs/) are Markdown files in `src/content/docs/`.
Each file has a `title`, `description`, `order` (position in the sidebar) and `section`
(sidebar group). To add a page, create a new `.md` file there. It gets a URL, a sidebar
entry, an "On this page" list and previous/next links automatically.

## Publishing an update

Add a Markdown file to `src/content/updates/`. The filename becomes its URL, e.g.
`new-research.md` becomes `/updates/new-research/`. Use this frontmatter:

```yaml
---
title: Your update title
description: A short summary for the feed.
date: 2026-11-23
category: Research
artwork: focus # focus or measure
order: 1       # lower numbers appear first when dates match
---
```

Write the article below the frontmatter. Updates are sorted newest first, and the latest two
appear on the homepage. Initial posts describe our direction and evaluation goals; they do not
announce models or claim measured results.

## Structure

```
src/
  data/models.ts        model registry (empty until a model is announced)
  content/docs/*.md     documentation pages (/docs)
  content/updates/*.md  news and perspectives (/updates)
  lib/models.ts         formatting + derived values
  layouts/Base.astro    <head>, header, footer
  components/           Header, Footer, SocialLinks, MemoryStudy, UpdateCard, Status
  pages/                index, models/index, models/[id], comparison, updates, docs/[...slug], 404
  styles/global.css     design tokens + all styles (light/dark)
public/                 favicon, robots.txt
.github/workflows/      deploy to GitHub Pages
```

## Deploying

In the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
After that, every push to `main` publishes the site.
