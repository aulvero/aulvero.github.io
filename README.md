# aulvero.github.io

The Aulvero website, built with [Astro](https://astro.build) and deployed to GitHub Pages
by GitHub Actions on every push to `main`.

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # type-check + static build into dist/
npm run preview    # serve dist/
```

Node 22+ (see `.nvmrc`).

## Editing the model lineup

Everything about the models lives in **`src/data/models.ts`**. Each model's page
(`/models/<id>/`), the models index, the home page scale and the footer are generated from it.

| You want to… | Do this in `src/data/models.ts` |
|---|---|
| Release a model | Set the variant's status to `"released"` and `released` to a date |
| Mark a model as training | Set the status to `"training"` |
| Add a new version | Add `{ version: "v1.5", ... }` to that model's `versions` |
| Add a new size | Copy a model entry; a page is created at `/models/<id>/` |
| Add a tier (e.g. 1B+ "Large") | Add an entry to `tiers`, then use its `id` on models |
| Change GitHub / Hugging Face links | Edit `site.links` |

Model shapes and training budgets mirror `configs/*.yaml` in
[aulvero-train](https://github.com/aulvero/aulvero-train). Keep them in sync when a config changes.

## Documentation

The docs at [/docs](https://aulvero.github.io/docs/) are Markdown files in `src/content/docs/`.
Each file has a `title`, `description`, `order` (position in the sidebar) and `section`
(sidebar group). To add a page, create a new `.md` file there. It gets a URL, a sidebar
entry, an "On this page" list and previous/next links automatically.

## Structure

```
src/
  data/models.ts        the lineup (single source of truth)
  content/docs/*.md     documentation pages (/docs)
  lib/models.ts         formatting + derived values
  layouts/Base.astro    <head>, header, footer
  components/           Header, Footer, Scale (Fig. 1), Status
  pages/                index, models/index, models/[id], docs/[...slug], 404
  styles/global.css     design tokens + all styles (light/dark)
public/                 favicon, robots.txt
.github/workflows/      deploy to GitHub Pages
```

## Deploying

In the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
After that, every push to `main` publishes the site.
