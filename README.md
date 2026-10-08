# Xóm Coding Dev Tools

An open-source developer tools directory for Vietnamese developers — the community contributes
tools through GitHub Pull Requests.

- Website: https://tools.xomcoding.me
- Xóm Coding: https://xomcoding.me
- Slogan: Code local, Connect global.

## Current data

- **125 tools** across **15 categories**, one JSON file per tool
- 125 SVG icons committed directly into the repo (no hotlinking to third-party services)
- Real status data from the `check-tools` workflow — no fake counts or fake statuses

Categories: Database & Backend · Cloud & Hosting · AI Coding & Agents · AI & Machine Learning ·
DevOps · Developer Tools · Frontend · UI & Design · Security · Productivity · Storage & Media ·
Email & Communication · Payment · Self-hosted · Others

## Features

- Dark mode, tools rendered as a compact table (no big cards) — many tools visible per screen.
- Client-side search: case-insensitive, Vietnamese diacritics-insensitive, keyboard shortcuts `/` and `Ctrl/Cmd + K`.
- Filters by category, status, pricing (`free`/`freemium`/`paid`), open source and Xóm Coding articles — synced to URL query params, shareable and restored after refresh.
- Tool status (`active`/`inactive`/`unknown`) checked automatically by GitHub Actions every day, results delivered as a Pull Request for review.
- Safe icon fallback: broken image → first letter of the tool name, layout never breaks.
- Strict JSON validation: duplicate `id`/`slug`/`website`, valid category, dangerous URLs (`javascript:`, `data:`, `file:`), path traversal, HTML in text fields.
- `xomcodingUrl` integration: the "Read on Xóm Coding" link only appears when a real article exists.
- No backend, no database, no API keys — a static site deployed on GitHub Pages.

## Getting started

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

## Adding a tool

1. Create `data/tools/<id>.json` (see the template in [CONTRIBUTING.md](CONTRIBUTING.md)).
2. Add an icon SVG to `public/icons/` (optional — the UI falls back automatically).
3. Run `npm run validate` and open a Pull Request.

Data structure:

```text
data/
├── categories.json        # categories (id, name, Lucide icon, order)
├── tools/*.json           # one file per tool → easy reviews, fewer conflicts
└── generated/
    ├── tool-status.json   # status written by the check-tools workflow (committed)
    ├── tools.json         # merged artifact (gitignored, npm run generate-data)
    └── xomcoding-report.json  # article matching report (gitignored)
```

Source structure:

```text
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
```

## Useful scripts

```bash
npm run check-tools      # HTTP-check tool websites → writes tool-status.json
npm run sync-xomcoding   # match xomcoding.me sitemap → report (never overwrites JSON)
npm run generate-data    # merge tools + status → data/generated/tools.json
```

## Configuration to fill in

| File | Field | What to do |
|---|---|---|
| `src/config/site.ts` | `repository` | GitHub repository URL (when `null`, GitHub/PR buttons are hidden) |
| `src/config/site.ts` | `links.*` | Social media URLs; `null` = link hidden, no guessed URLs |
| `public/CNAME` | — | Custom domain; **automatic**: with CNAME → base `/`, without → base `/<repo>/` |

## Deploying to GitHub Pages

1. Push to `main` → the `deploy.yml` workflow validates, tests, builds and deploys automatically.
2. **Settings → Pages → Source: GitHub Actions** (required once per repository).
3. Base path is automatic: no `public/CNAME` → deployed at `/<repo>/` on github.io; add a CNAME (after DNS is configured) → base `/`.
4. `check-tools.yml` runs at 03:00 UTC daily and opens a PR with status changes (never commits straight to `main`, no loops).
5. `validate.yml` runs on every PR touching `data/` — bad data is blocked before merge.

## Technology

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · Lucide React · Vitest · GitHub Actions

## License

[MIT](LICENSE) — © 2026 Xóm Coding
