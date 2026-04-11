# Alan Szmyt — Portfolio

Personal portfolio of Alan Szmyt — software engineer focused on building thoughtful, reliable systems.

---

## Getting Started

First, install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Project Structure

```
src/
├── app/              # Next.js App Router: pages, layouts, metadata, route handlers
├── components/       # Reusable UI components, organized by subdomain
│   ├── animation/    #   Lottie and motion-based display components
│   ├── debug/        #   Development-only diagnostic panels
│   └── ui/           #   Generic layout primitives (Container, Section, Center, Footer)
├── config/           # App-wide configuration and environment validation
│   ├── env.ts        #   Typed, validated environment variables and feature flags (isDev, isProd)
│   ├── site.ts       #   Site metadata (title, description, author, URLs)
│   └── index.ts      #   Public barrel export (@portfolio/config)
├── content/          # Content abstraction layer: types and static data
│   ├── types.ts      #   TypeScript interfaces (Project, CreativeWork, …)
│   ├── projects.ts   #   Software project entries
│   ├── creative.ts   #   Creative work entries
│   └── index.ts      #   Public barrel export (@portfolio/content)
├── features/         # Self-contained feature modules, one folder per feature
│   └── landing/      #   Landing page entry sequence
│       └── animation/ #     Animation hooks and visual layer components (isolated from layout)
├── i18n/             # Internationalization setup (next-intl)
├── lib/              # Shared utilities and design token constants
│   └── tokens.ts     #   TypeScript references for CSS custom properties
└── animations/       # Lottie JSON animation assets
```

### Conventions

| Directory       | What belongs here |
|-----------------|----------------------------------------------------------------|
| `app/`          | Next.js pages, layouts, `metadata`, `viewport`, error/sitemap/robots files |
| `components/`   | Stateless or lightly-stateful reusable UI pieces; no business logic |
| `config/`       | Environment variable validation and app-wide static config |
| `content/`      | Content types (interfaces) and static data arrays; no UI logic |
| `features/`     | Co-located components, hooks, and logic for a single product feature; animation sub-directories isolate visual logic from layout |
| `lib/`          | Pure utility functions and shared constants used across multiple modules |
| `animations/`   | Raw animation data files (Lottie JSON) consumed by animation components |
| `i18n/`         | next-intl configuration and locale message loading |

**Rules of thumb:**

- A **component** is reusable across features. A **feature** owns its own components when they are not shared.
- Configuration and secrets go in `config/`; never inline them in application code.
- `lib/` is for pure, side-effect-free helpers. Anything with side-effects belongs in a feature or a component.
- Each `features/<name>/` directory exports a public API through its `index.ts` file.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format source files with Prettier |

---

## Tech Stack

- [Next.js](https://nextjs.org) — React framework (App Router)
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [next-intl](https://next-intl.dev) — Internationalization
