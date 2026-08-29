# Housefly tutorial site

This Astro site publishes the Housefly web-scraping tutorial in multiple languages.

## Development

From the repository root:

```sh
pnpm install
pnpm --filter tutorial dev
```

Build and type-check the site with:

```sh
pnpm --filter tutorial build
```

Tutorial posts live in `src/content/posts/<locale>/`. Keep a locale's seven sections aligned with the exercises in `exercises/`, and keep code examples consistent with the commands in the root `README.md`.
