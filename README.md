# Xóm Coding Dev Tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Deploy GitHub Pages](https://github.com/dungnh999/xomcoding-tools/actions/workflows/deploy.yml/badge.svg)](https://github.com/dungnh999/xomcoding-tools/actions/workflows/deploy.yml)
[![Tools](https://img.shields.io/badge/tools-125-blue.svg)](https://tools.xomcoding.me)

A community-curated, open-source directory of developer tools — **in Vietnamese** — for the
[Xóm Coding](https://xomcoding.me) community and Vietnamese developers everywhere.

> 🔥 **Know a great tool? Share it in 2 minutes — see [Share a tool](#share-a-tool).**

- Website: https://tools.xomcoding.me
- Xóm Coding: https://xomcoding.me
- License: [MIT](LICENSE)
- Slogan: Code local, Connect global.

## Why this project

- **125+ tools across 15 categories** — databases, cloud, AI, DevOps, frontend, security, and more.
- Every tool lives in its own JSON file → tiny, conflict-free Pull Requests.
- Automated daily status checks (`active` / `inactive` / `unknown`) — no fake data.
- Search that understands Vietnamese (diacritics-free), shareable filter URLs.
- Fully static, no backend, no database, no ads — deployed on GitHub Pages.

## Share a tool

Anyone can contribute. There is no admin panel and no sign-up form — **everything happens through
a GitHub Pull Request**:

1. **Fork** this repository.
2. **Create** `data/tools/<your-tool-id>.json`:

   ```json
   {
     "id": "docker",
     "name": "Docker",
     "slug": "docker",
     "category": "devops",
     "shortDescription": "Container Platform",
     "description": "Đóng gói và triển khai ứng dụng bằng container.",
     "icon": "/icons/docker.svg",
     "website": "https://www.docker.com/",
     "github": "https://github.com/moby/moby",
     "pricing": "freemium",
     "openSource": true,
     "status": "unknown",
     "lastChecked": null,
     "xomcodingUrl": null,
     "tags": ["docker", "container", "devops"]
   }
   ```

3. *(Optional)* Add an SVG icon to `public/icons/` — if you skip it, the UI falls back to a
   letter mark automatically.
4. **Validate locally**, then open a PR:

   ```bash
   npm install
   npm run validate
   npm test
   ```

5. CI re-validates your JSON (duplicates, URLs, categories, safety checks) → maintainer review →
   merge → the site redeploys automatically.

**Quick checklist for a fast merge**

- ✅ Tool is not already listed (`id`, `slug`, `website`)
- ✅ Working `https://` website
- ✅ Vietnamese `shortDescription` (≤ 140 chars) and `description` (≤ 300 chars)
- ✅ Valid `category` from `data/categories.json`
- ✅ `pricing`: `free` / `freemium` / `paid` — kept separate from `openSource`
- ✅ `status`: leave as `unknown` (the daily bot verifies it, never fake `active`)
- ✅ `xomcodingUrl`: only a real article on xomcoding.me, otherwise `null`
- ❌ No ads, no affiliate spam, no `javascript:`/`data:` links, no malware

Full details: [CONTRIBUTING.md](CONTRIBUTING.md)

## Local development

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the build
npm run validate   # validate data/tools + categories
npm test           # unit tests (search, filter, validation, icon fallback, data loading)
npm run typecheck  # strict TypeScript check
npm run lint       # oxlint
```

## Project structure

```text
data/
├── categories.json        # categories (id, name, Lucide icon, order)
├── tools/*.json           # one file per tool → easy reviews, fewer conflicts
└── generated/
    └── tool-status.json   # status from the check-tools workflow (committed via PR)

src/
├── components/
│   ├── layout/     # Header, Sidebar, Footer
│   ├── tools/      # ToolList, ToolRow, ToolFilters, CategorySection, ToolStatus, StatsBar
│   └── ui/         # SearchInput, Badge, ToolIcon
├── config/site.ts  # repository + social URLs (null = hidden)
├── data/load.ts    # JSON loading + generated status merge
├── hooks/          # useToolFilters (filter ↔ URL sync)
├── types/          # TypeScript interfaces
└── utils/          # search (diacritics-insensitive), filters

scripts/            # validate, check-tools, sync-xomcoding, generate-data
.github/workflows/  # validate.yml, deploy.yml, check-tools.yml
```

## Automation

| Workflow | Trigger | What it does |
|---|---|---|
| `validate.yml` | PR touching `data/` | JSON validation + tests + typecheck — bad data never merges |
| `check-tools.yml` | Daily 03:00 UTC | HTTP-checks every website, opens a **PR** with status changes |
| `deploy.yml` | Push to `main` | Validate → test → build → deploy to GitHub Pages |

Status rules: `active` only after a verified successful response; a single 403/429/timeout never
flips a tool to `inactive`.

## Deployment

1. **Settings → Pages → Source: GitHub Actions** (once per repo).
2. Push to `main` → the site deploys automatically.
3. Base path is automatic: no `public/CNAME` → `/<repo>/` on github.io; add a CNAME after DNS is
   configured → base `/`.
4. Custom domain plan: `tools.xomcoding.me`.

## Find us on GitHub

Add these **topics** to the repository (Settings → Topics) so people can discover it via GitHub
search: `developer-tools` · `devtools` · `awesome-list` · `awesome` · `open-source` ·
`vietnamese` · `resources` · `directory` · `free-tools` · `ai-tools` · `devops` · `react` ·
`typescript` · `vite` · `tailwindcss` · `github-pages` · `static-site` · `hacktoberfest`

## License

[MIT](LICENSE) — © 2026 Xóm Coding. Contributions welcome!
