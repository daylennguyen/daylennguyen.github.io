# Daylen Nguyen

Personal website with a Windows 95–style UI, built with Next.js and [React95](https://react95.io).

## Features

- **Windows 95 aesthetic** — AppBar, Window, Button, and MS Sans Serif font via React95
- **Interactive chicken** — Pixel-art chicken on the ground that follows the cursor; click it to trigger a hurt animation (bounce up and left)
- **Static export** — Configured for GitHub Pages deployment

## Tech stack

- **Next.js 16** (App Router, static export)
- **React 19**
- **React95** — Windows 95–style components
- **styled-components** — Theming and global styles (with `StyleSheetManager` + `@emotion/is-prop-valid` for clean DOM props)
- **Tailwind CSS 4**
- **TypeScript**
- **Storybook** — Component development and docs
- **Vitest + Playwright** — Testing

## Getting started

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm (or yarn / pnpm)

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production static build (output in `out/`) |
| `npm run start` | Serve production build (after `build`) |
| `npm run lint` | Run ESLint |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build Storybook to `storybook-static/` |

## Project structure

```
├── app/
│   ├── components/     # ChickenCanvas, React95Provider
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── assets/         # chicken.png, blocks.png, etc.
├── stories/            # Storybook stories
├── .github/workflows/  # GitHub Actions (deploy to Pages)
└── next.config.ts      # static export, styled-components
```

## Deployment

The site is set up for **GitHub Pages**:

- Pushes to `master` trigger the **Deploy Next.js site to Pages** workflow.
- The workflow builds the Next.js app (static export) and Storybook, then deploys the `out/` artifact to GitHub Pages.
- Live site: **https://daylennguyen.github.io** (or your repo’s Pages URL).

## Credits

Assets in `public/assets/` (PNG sprites and textures):

| Asset | Preview |
|-------|---------|
| `blocks.png` | <img src="https://raw.githubusercontent.com/daylennguyen/daylennguyen.github.io/master/public/assets/blocks.png" alt="blocks.png" width="80" /> |
| `chicken.png` | <img src="https://raw.githubusercontent.com/daylennguyen/daylennguyen.github.io/master/public/assets/chicken.png" alt="chicken.png" width="80" /> |
| `Custom Edited - Minecraft Customs - Chicken.png` | <img src="https://raw.githubusercontent.com/daylennguyen/daylennguyen.github.io/master/public/assets/Custom%20Edited%20-%20Minecraft%20Customs%20-%20Chicken.png" alt="Custom Edited - Minecraft Customs - Chicken.png" width="80" /> |
| `textures.png` | <img src="https://raw.githubusercontent.com/daylennguyen/daylennguyen.github.io/master/public/assets/textures.png" alt="textures.png" width="80" /> |
| `wolfie.png` | <img src="https://raw.githubusercontent.com/daylennguyen/daylennguyen.github.io/master/public/assets/wolfie.png" alt="wolfie.png" width="80" /> |
| `zombie.png` | <img src="https://raw.githubusercontent.com/daylennguyen/daylennguyen.github.io/master/public/assets/zombie.png" alt="zombie.png" width="80" /> |

## License

Private project.
