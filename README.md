# ASG Lubricants

A single-page marketing and product discovery website for ASG Lubricants, built with Vite, React, TypeScript, and Tailwind CSS v4.

The site is designed as a branded landing page for the Pakistan market and currently includes:

- Hero section with SEO metadata in `index.html`
- Oil Finder recommendation flow
- Product catalog with filters and product detail modal
- Cart and multi-step checkout UI
- Dealer locator with search
- B2B/trade, FAQs, blog-style content, and contact form sections
- Single-file production build via `vite-plugin-singlefile`

## Tech Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS v4
- `vite-plugin-singlefile`

## Project Structure

```text
.
|-- index.html
|-- src/
|   |-- App.tsx
|   |-- data.ts
|   |-- index.css
|   |-- main.tsx
|   |-- components/
|   `-- utils/
|-- vite.config.ts
|-- tsconfig.json
|-- Dockerfile
`-- nginx.conf
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Build Notes

The Vite config includes `vite-plugin-singlefile`, so the production output is bundled into a single deployable HTML asset with inlined resources where possible. This is useful for lightweight static hosting and simple Nginx-based deployment.

## Deployment

This repository already includes:

- `Dockerfile` for containerized deployment
- `nginx.conf` for serving the built frontend
- `.dockerignore` to keep Docker build context smaller

Typical flow:

```bash
npm run build
docker build -t asg-lubricants .
```

## Important Data Sources

- Product catalog and dealer records live in `src/data.ts`
- Core page behavior and UI flow live in `src/App.tsx`
- Global styles live in `src/index.css`

## Git Tips

If `node_modules` was accidentally added to Git, keep it ignored and remove it from the index without deleting your local files:

```bash
git rm -r --cached node_modules
```

If you only staged it and want to unstage it:

```bash
git restore --staged node_modules
```

Then confirm with:

```bash
git status
```
