# special-ui

A Tailwind-first React component library built on [Base UI](https://base-ui.com)
primitives.

Base UI supplies the behaviour — accessibility, focus management, keyboard
interaction, form participation. This repository supplies the design system: a
Swiss/editorial theme, a variants API, and styled parts that keep every Base UI
escape hatch intact.

The design is monochrome and typographic. Hierarchy comes from type size,
weight and value contrast rather than colour; surfaces separate with hairline
rules rather than shadows; the only hue in the system is destructive red. Light
and dark are a single inverted token pair, so components carry no `dark:`
variants at all.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for how Base UI works internally and
how this layer plugs into it.

## Quick start

```bash
pnpm install
pnpm dev      # playground at http://localhost:5173
pnpm test     # 52 tests
pnpm build    # build the library
```

## Usage

```css
/* app.css */
@import 'tailwindcss';
@import '@special-ui/react/theme.css';
```

The library declares `--font-sans` but does not load a webfont, keeping the
package free of network dependencies. Install Inter yourself:

```bash
pnpm add @fontsource-variable/inter
```

```ts
import '@fontsource-variable/inter';
```

```tsx
import { Button } from '@special-ui/react/button';
import { Switch } from '@special-ui/react/switch';
import { Text } from '@special-ui/react/text';
import { Dialog } from '@special-ui/react/dialog';

<Button variant="danger" size="sm">Delete</Button>

<Text variant="eyebrow">Components</Text>
<Text variant="display" render={<h1 />}>Unstyled UI components</Text>
<Text measure>Running prose, capped at a readable measure.</Text>

<Switch.Root size="lg" defaultChecked>
  <Switch.Thumb />
</Switch.Root>

<Dialog.Root>
  <Dialog.Trigger render={<Button variant="danger" />}>Delete project</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Popup size="lg">
      <Dialog.Title>Delete project</Dialog.Title>
      <Dialog.Description>This cannot be undone.</Dialog.Description>
      <Dialog.Footer>
        <Dialog.Close variant="danger">Delete</Dialog.Close>
        <Dialog.Close>Cancel</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

### Overriding styles

Consumer classes always win on conflicting utilities — everything runs through
`tailwind-merge` before it reaches Base UI:

```tsx
<Button className="rounded-full bg-fuchsia-600" />   // built-in bg/radius replaced
<Button className={(state) => (state.disabled ? 'grayscale' : '')} />
```

Any custom token that shares a Tailwind utility prefix must be registered as a
class group in `styles/cn.ts` — `rounded-control`, `text-body`, `shadow-overlay`
and the named durations all are. Without that, twMerge cannot tell the token
from Tailwind's own scale and keeps both classes, leaving CSS source order to
decide. Add a case to the regression test in `variants.test.ts` whenever you add
a token of this kind.

### Swapping the element

`render` is Base UI's, passed straight through — styles and behaviour come with
it:

```tsx
<Button render={<a href="/pricing" />}>Pricing</Button>
```

### Theming

Redefine tokens; no need to fork a component. Semantic colours indirect through
`--su-*` raw values, which is what lets dark mode swap them at runtime.

```css
:root { --su-bg: oklch(99% 0 0deg); --su-accent: oklch(12% 0 0deg); }
.dark { --su-bg: oklch(8.5% 0 0deg); --su-accent: oklch(97% 0 0deg); }
```

Shape and motion are tokens too. To make every control pill-shaped, change one
line rather than touching a component or a call site:

```css
@theme { --radius-control: 9999px; }
```

If you scope the theme to an element rather than `<html>`, wrap the app in
`SpecialUIProvider` so portalled surfaces (dialogs, popovers) follow it too:

```tsx
<SpecialUIProvider theme={dark ? 'dark' : undefined}>
  <div className={dark ? 'dark' : undefined}>{children}</div>
</SpecialUIProvider>
```

## Layout

```
packages/react/   the library (@special-ui/react)
playground/       Vite app for manual testing
test/             shared test setup
```

## Building your own parts

```tsx
import { defineSlots, createStyledPart, createVariantContext } from '@special-ui/react';

const styles = defineSlots({
  slots: { root: 'rounded-control border', label: 'text-sm' },
  variants: { size: { sm: { root: 'p-2', label: 'text-xs' }, md: { root: 'p-4' } } },
  defaultVariants: { size: 'md' },
});

const [Provider, useVariants] = createVariantContext<{ size?: 'sm' | 'md' }>('CardVariants');

export const CardRoot = createStyledPart(BaseThing.Root, styles.root, {
  displayName: 'Card.Root',
  provideVariants: Provider,
});

export const CardLabel = createStyledPart(BaseThing.Label, styles.label, {
  displayName: 'Card.Label',
  useVariants,
});
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Playground dev server |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Watch mode |
| `pnpm build` | Build `@special-ui/react` to `dist/` |
| `pnpm typescript` | Typecheck |

## License

MIT. Base UI is MIT-licensed and used as a dependency.
