# special-ui

A Tailwind-first React component library built on [Base UI](https://base-ui.com)
primitives.

Base UI supplies the behaviour — accessibility, focus management, keyboard
interaction, form participation. This repository supplies the design system: a
token-driven theme, a variants API, and styled parts that keep every Base UI
escape hatch intact.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for how Base UI works internally and
how this layer plugs into it.

## Quick start

```bash
pnpm install
pnpm dev      # playground at http://localhost:5173
pnpm test     # 45 tests
pnpm build    # build the library
```

## Usage

```css
/* app.css */
@import 'tailwindcss';
@import '@special-ui/react/theme.css';
```

```tsx
import { Button } from '@special-ui/react/button';
import { Switch } from '@special-ui/react/switch';
import { Dialog } from '@special-ui/react/dialog';

<Button tone="danger" size="sm">Delete</Button>

<Switch.Root size="lg" defaultChecked>
  <Switch.Thumb />
</Switch.Root>

<Dialog.Root>
  <Dialog.Trigger render={<Button tone="danger" />}>Delete project</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Popup size="lg">
      <Dialog.Title>Delete project</Dialog.Title>
      <Dialog.Description>This cannot be undone.</Dialog.Description>
      <Dialog.Footer>
        <Dialog.Close tone="danger">Delete</Dialog.Close>
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

### Swapping the element

`render` is Base UI's, passed straight through — styles and behaviour come with
it:

```tsx
<Button render={<a href="/pricing" />}>Pricing</Button>
```

### Theming

Redefine tokens; no need to fork a component.

```css
:root { --su-surface: oklch(99% 0.01 250deg); }
.dark { --su-surface: oklch(16% 0.02 265deg); }
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
