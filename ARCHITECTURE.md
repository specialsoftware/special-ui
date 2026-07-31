# How Base UI works, and how this library sits on top of it

Two parts. The first is a read of `mui/base-ui` — the mechanisms that actually
matter if you want to build or extend something like it. The second is how this
repository uses them.

File references point at `mui/base-ui` at v1.6.0.

---

## Part 1 — Base UI

### The repository shape

```
packages/react/     the component library (@base-ui/react)
packages/utils/     framework-agnostic hooks and helpers (@base-ui/utils)
docs/               Next.js docs site, also where demos live
playground/         Vite app for manual testing
test/               e2e, regression screenshots, bundle-size, performance
```

The split between `packages/react` and `packages/utils` is deliberate: `utils`
holds things with no opinion about components (`useControlled`, `useTimeout`,
`useMergedRefs`, a store implementation), so they can be depended on without
pulling in the component layer.

Two conventions in `packages/react/package.json` are worth copying:

- **Every component is its own export path.** `"./switch": "./src/switch/index.ts"`,
  ~45 of them. A consumer importing `@base-ui/react/switch` never touches the
  code for `select`, regardless of how good their bundler is.
- **`"sideEffects": false`.** Required for that tree-shaking to actually happen.

They also expose an `./internals/*` surface — `useRenderElement`, `useButton`,
`useAnchorPositioning` and friends. Not covered by semver, but it is the seam
that makes the library extensible from outside.

### Idea 1: components are parts, not props

There is no `<Switch label="..." thumbClassName="..." />`. There is
`<Switch.Root>` and `<Switch.Thumb>`, and you assemble them.

The plumbing is two files per component:

```ts
// switch/index.parts.ts
export { SwitchRoot as Root } from './root/SwitchRoot';
export { SwitchThumb as Thumb } from './thumb/SwitchThumb';

// switch/index.ts
export * as Switch from './index.parts';
export type * from './root/SwitchRoot';
```

`export * as Switch` gives the `Switch.Root` call site while keeping each part a
separate module. You get the namespace ergonomics of a monolith with the
tree-shaking of separate files.

State flows from root to parts through a context created per component
(`SwitchRootContext.ts`), and the context hook throws a specific error when a
part is used outside its root:

```
Base UI: SwitchRootContext is missing. Switch parts must be placed within <Switch.Root>.
```

### Idea 2: `useRenderElement` is the whole rendering engine

`src/internals/useRenderElement.tsx` is the single most important file in the
repo. Every part ends by calling it:

```tsx
return useRenderElement('span', componentProps, {
  state,
  ref: [forwardedRef, switchRef, buttonRef],
  props: [rootProps, elementProps, getButtonProps],
  stateAttributesMapping,
});
```

It does five things:

1. **Resolves `className`**, which may be a string *or* `(state) => string`.
2. **Resolves `style`**, same deal.
3. **Converts `state` into `data-*` attributes** (idea 3).
4. **Merges every prop source** left-to-right through `mergeProps` (idea 4),
   and merges all the refs.
5. **Decides what to actually render**, based on the `render` prop.

That last step is the `render` prop contract, and it accepts two forms:

```tsx
// A React element — cloned with the merged props.
<Switch.Root render={<MyThing />} />

// A function — called with the props and the state.
<Switch.Root render={(props, state) => <MyThing {...props} data-on={state.checked} />} />
```

Note that `render` is called as a *plain function*, not rendered as a component.
That is why they warn when you pass something that looks like a component:

```
The `render` prop received a function named `Foo` that starts with an uppercase letter.
Base UI calls `render` as a plain function, which can break the Rules of Hooks
during reconciliation.
```

Worth internalising if you build the same escape hatch: `render={Component}` is
a bug, `render={<Component />}` is not.

There is also a small `renderTag` detail — rendering `button` injects
`type="button"` and `img` injects `alt=""` before spreading props. Cheap
defaults that prevent two common bugs.

`useRender` (`src/use-render/useRender.ts`) is the same engine exposed publicly,
so consumers can build their own parts with identical semantics. It is a
one-line wrapper over `useRenderElement`.

### Idea 3: state becomes `data-*` attributes

`src/internals/getStateAttributesProps.ts` is 30 lines:

```ts
for (const key in state) {
  const value = state[key];
  if (customMapping?.hasOwnProperty(key)) { /* custom */ continue; }
  if (value === true) props[`data-${key.toLowerCase()}`] = '';
  else if (value) props[`data-${key.toLowerCase()}`] = value.toString();
}
```

So `state.disabled === true` becomes `data-disabled=""`, and you style
`[data-disabled]`. Per-component overrides handle the cases where the default
isn't right — Switch maps `checked` to *two* attributes so both states are
directly addressable without `:not()`:

```ts
// switch/stateAttributesMapping.ts
checked: (value) => (value ? { 'data-checked': '' } : { 'data-unchecked': '' }),
```

This is why the library ships no CSS and still supports every state you'd want
to style. Each component also documents its attributes as an enum
(`SwitchRootDataAttributes.ts`) — those enums are the source for the docs site.

### Idea 4: `mergeProps` and the event-handler protocol

`src/merge-props/mergeProps.ts`. Ordinary props follow `Object.assign`
semantics — rightmost wins. Three things do not:

- **`style`** merges as an object.
- **`className`** concatenates (`theirClassName + ' ' + ourClassName`). Note:
  *no conflict resolution*. This matters enormously for a Tailwind layer, and is
  the reason for `cn()` in this repo.
- **Event handlers** chain, running **right-to-left** — the consumer's handler
  runs first, then the library's.

That ordering enables the interesting bit: a consumer's handler can cancel the
library's.

```tsx
<Select.Item onClick={(event) => event.preventBaseUIHandler()} />
```

`mergeEventHandlers` wraps every synthetic event with `preventBaseUIHandler()`,
runs the consumer handler, then checks `baseUIHandlerPrevented` before calling
its own. It's a cleaner contract than `preventDefault` because it targets the
library's behaviour specifically rather than the browser's.

A prop source can also be a **function** — `(previousProps) => props` — which
receives everything merged so far. That's how `useButton`'s `getButtonProps`
composes into the chain in `SwitchRoot`.

### Idea 5: animation via `data-starting-style` / `data-ending-style`

There is no animation library and no `AnimatePresence`. `useTransitionStatus`
(`src/internals/useTransitionStatus.ts`) tracks `'starting' | 'ending' | 'idle'`,
keeps the element mounted through its exit, and emits attributes you style:

```css
.popup { opacity: 1; transition: opacity 200ms; }
.popup[data-starting-style], .popup[data-ending-style] { opacity: 0; }
```

The exit is real: the component stays mounted until the animation finishes
(`useAnimationsFinished`), then unmounts. Plain CSS transitions, no JS
interpolation.

### Idea 6: controlled/uncontrolled, done once

`useControlled` (`packages/utils/src/useControlled.ts`) decides once, on first
render, whether a prop is controlled (`controlled !== undefined`), and warns
loudly in development if that ever changes. Every stateful component funnels
through it, so `value`/`defaultValue` and `checked`/`defaultChecked` behave
identically everywhere.

Changes are reported through an **event details** object rather than a bare
value:

```ts
onCheckedChange?: (checked: boolean, eventDetails: SwitchRoot.ChangeEventDetails) => void;
```

`eventDetails` carries `reason` (why it changed), the `nativeEvent`, and a
`cancel()` — checked via `eventDetails.isCanceled` before committing state. Far
more extensible than adding a new callback per interaction type.

### Conventions worth stealing

- **`'use client'` at the top of every component file**, not just entry points.
  Per-file directives are what let an RSC app import the package without turning
  the whole thing into a client bundle.
- **Types published as namespaces.** Each component declares
  `SwitchRootProps`/`SwitchRootState` and re-exports them as `SwitchRoot.Props`
  and `SwitchRoot.State`. Call sites read as `Switch.Root.Props`.
- **`BaseUIComponentProps<'span', State>`** is the shared prop shape: native
  props for the element, minus `className`/`style`/`defaultValue` (replaced with
  state-aware versions), plus `render`.
- **Tests live next to source** (`SwitchRoot.test.tsx` beside `SwitchRoot.tsx`),
  and run in both jsdom and real browsers — `it.skipIf(isJSDOM)` for anything
  needing layout.
- **Error messages have a required format** (see their `AGENTS.md`): say what
  happened, why it's a problem, how to fix it, prefixed `Base UI:` with a docs
  link. There is a build step that extracts them into error codes.
- **They vendored `floating-ui`** into `src/floating-ui-react/` rather than
  depending on `@floating-ui/react`, so they can patch positioning behaviour
  without waiting upstream.

### The anatomy of one component

`Switch`, in full — 11 files, and every library component follows the pattern:

```
switch/
  index.ts                      export * as Switch, plus type re-exports
  index.parts.ts                Root, Thumb
  stateAttributesMapping.ts     checked -> data-checked / data-unchecked
  root/
    SwitchRoot.tsx              the component
    SwitchRootContext.ts        context + throwing hook
    SwitchRootDataAttributes.ts documented attribute enum
    SwitchRoot.test.tsx
  thumb/
    SwitchThumb.tsx             reads context, renders, done (28 lines)
    SwitchThumbDataAttributes.ts
    SwitchThumb.test.tsx
```

`SwitchRoot` itself: destructure props → pull in field/form context → `useControlled`
for `checked` → build `rootProps` (role, aria, handlers) and `inputProps` (a
visually-hidden real `<input type="checkbox">` so forms and validation work) →
assemble `state` → `useRenderElement`. It renders the element, the hidden input,
and a context provider.

That hidden input is the pattern for every form control in the library: full
native form participation, with the visible element free to be any tag.

---

## Part 2 — This library

The choice here is to **wrap** Base UI rather than reimplement or fork it: take
`@base-ui/react` as a dependency, keep all of its behaviour and accessibility,
and add a Tailwind-first styling layer.

```
packages/react/src/
  styles/
    cn.ts                     clsx + tailwind-merge
    variants.ts               defineVariants / defineSlots
  theme.css                   design tokens (@theme inline)
  internals/
    createStyledPart.tsx      the wrapper factory
    resolveClassName.ts
  provider/
    SpecialUIProvider.tsx     themed portal container
  button/  switch/  dialog/   the components
```

### `cn()` — why a plain concat is not enough

Base UI's `mergeProps` concatenates class names with no notion of conflict. For
a Tailwind library that is fatal: `"px-4"` (built in) and `"px-6"` (consumer)
would both land on the element, and CSS source order — not the consumer —
decides the winner.

So every class string is resolved through `twMerge` before it reaches Base UI.
`cn('px-4', 'px-6') === 'px-6'`. That single guarantee is what makes
`<Button className="px-6">` mean what it looks like it means.

Custom utilities need registering, or `twMerge` cannot know they conflict:

```ts
extendTailwindMerge({ extend: { classGroups: { shadow: [{ shadow: ['elevated', 'overlay'] }] } } })
```

### `defineVariants` / `defineSlots`

`defineVariants` builds a class-name function for a single element.
`defineSlots` does the same for a compound component, where one variant
selection drives several parts — `<Switch size="lg">` has to resize the track
*and* the thumb, but you should only say it once.

Both attach `variantKeys`, which is how the factory knows which props are
variants and which belong on the DOM. (Forgetting to attach `variantKeys` to
each individual slot function was a real bug during development — the tests in
`Switch.test.tsx` catch it.)

### `createStyledPart`

The factory that turns a Base UI part into a styled one. Deliberately thin —
four steps:

1. Split variant props out of the props object so they never reach the DOM.
2. Fill omitted variants from the parent part's context.
3. Compute the built-in classes for this slot.
4. Hand Base UI a `className` **function**, not a string.

Step 4 is the subtle one. Passing a function means the merge happens *after*
Base UI computes the part's state, so a consumer can still write
`className={(state) => ...}` and get conflict resolution against the built-ins:

```tsx
className={(state) => cn(builtIn, resolveClassName(consumerClassName, state))}
```

Everything else — accessibility, focus, keyboard behaviour, `render`, `data-*` —
passes straight through untouched.

### Theming, and the two traps

**Trap 1: `@theme` vs `@theme inline`.** Semantic tokens indirect through a raw
variable so dark mode can swap them:

```css
@theme inline { --color-surface: var(--su-surface); }
@layer base {
  :root  { --su-surface: oklch(100% 0 0deg); }
  .dark  { --su-surface: oklch(14.5% 0 0deg); }
}
```

Without `inline`, Tailwind emits `--color-surface: var(--su-surface)` on
`:root`. CSS substitutes that `var()` *at `:root`*, and the resolved light value
is what inherits down the tree — a `.dark` block on a descendant then has no
effect whatsoever. `inline` inlines the reference into each utility instead, so
`bg-surface` compiles to `background-color: var(--su-surface)` and resolves
against whichever element it lands on.

**Trap 2: portals escape scoped themes.** Base UI mounts popups on
`document.body`, which is outside a scoped `<div className="dark">`. A dialog
opened from a dark subtree renders with light tokens. Either put the theme class
on `<html>`, or use `SpecialUIProvider`, which renders a themed container on
`document.body` and hands it to portal-based parts through context. Both the
provider and the `Dialog.Portal` default are covered by tests.

**Tailwind must scan the library.** v4 only generates utilities it can see, and
the library ships prebuilt JS containing class strings. `theme.css` carries
`@source "../dist"` so consumers get this automatically.

### Adding a component

1. `pnpm add` nothing — the Base UI part already exists. Find its parts in
   `node_modules/@base-ui/react/<component>/index.parts.ts`.
2. Create `src/<component>/<Component>.tsx`. Declare styles with `defineSlots`
   (or `defineVariants` for a single element).
3. Wrap each part with `createStyledPart`. Put `provideVariants` on the part
   that owns the variant selection, `useVariants` on the rest.
4. Re-export parts with no DOM element (`Root`, `Portal`) untouched.
5. Add `index.parts.ts` + `index.ts` following the Base UI pattern.
6. Register the entry in `package.json#exports` and `tsdown.config.ts`.
7. Write tests. The four that matter every time: built-in classes land, consumer
   classes override on conflict, variant props do not leak to the DOM, and
   `render` still works.

### If you later want to stop wrapping

The layers are independent. `cn`, `defineVariants`, `defineSlots` and
`createStyledPart` know nothing about Base UI — `createStyledPart` only needs a
component that accepts `className` as a function of state. Swapping the
underlying primitives, or reimplementing one component's behaviour while leaving
the others wrapped, is a per-component decision rather than a rewrite.
