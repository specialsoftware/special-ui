# Special UI

A personal product design system built from shadcn's Base UI components and
distributed as an open-code registry.

Special UI adds a semantic visual language, polished interaction states, and
reusable product conventions while keeping component source directly editable
inside every consuming application.

## Current foundation

- Three visual directions with tuned light and dark modes:
  - **Warm Precision** — ivory, charcoal, and cobalt (recommended)
  - **Cool Studio** — porcelain, ink, and iris
  - **Signal Modernist** — newsprint, serif display type, and vermilion
- Semantic color, typography, spacing, radius, elevation, focus, and motion tokens
- Polished Button, Input/Field, and Card components
- A realistic calibration playground rather than isolated component examples
- A GitHub-compatible shadcn registry

The original Base UI package implementation is preserved on the `v1` branch.

## Local development

```bash
pnpm install
pnpm dev
```

The playground runs at `http://localhost:5173`.

```bash
pnpm test        # component tests
pnpm typescript  # registry source typecheck
pnpm build       # production playground build
pnpm preview     # preview the production build locally
```

## Repository layout

```text
registry.json             GitHub registry catalog
registry/special/
  lib/                    shared utilities
  styles/theme.css        semantic tokens and theme directions
  ui/                     source-installed components
playground/               Vite component lab and documentation site
docs/V2_PLAN.md           component roadmap and quality bar
```

## Install components

After initializing shadcn in a consuming project, install items directly from
GitHub:

```bash
pnpm dlx shadcn@latest add specialsoftware/special-ui/button
pnpm dlx shadcn@latest add specialsoftware/special-ui/input
pnpm dlx shadcn@latest add specialsoftware/special-ui/field
pnpm dlx shadcn@latest add specialsoftware/special-ui/card
```

Install the visual foundations separately:

```bash
pnpm dlx shadcn@latest add specialsoftware/special-ui/special-theme
```

Then import the installed stylesheet from the application's global CSS.

## Deploy to Vercel

The repository includes `vercel.json`. Import the GitHub repository into Vercel
with the repository root as the project root. Vercel will install the pnpm
workspace, build the playground, and publish `playground/dist`.

No runtime server, database, environment variables, or external font requests
are required.

## Roadmap

The next component batch establishes the shared floating-surface language:

- Tooltip
- Dropdown Menu
- Select
- Combobox

Dialog, Tabs, and Toast follow once those shared popup and menu recipes are
settled. See [docs/V2_PLAN.md](./docs/V2_PLAN.md) for the full plan.

## License

MIT. Base UI and shadcn are used under their respective open-source licenses.
