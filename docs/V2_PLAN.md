# Special UI v2 plan

## Direction

Special UI v2 uses current shadcn component source with Base UI primitives. It
adds a semantic design language, polished interaction states, product-level
conventions, and reusable compositions. Components are distributed through the
root GitHub registry rather than requiring every product to consume a runtime UI
package.

The original package-based implementation is preserved on the `v1` branch. The
`main` branch now focuses on the source registry and its playground.

## Foundation calibration

The primary direction is monochrome and editorial: Inter throughout, a compact
11–32px type scale, neutral off-black and white anchors, fine rules, small
radii, flat product surfaces, and color reserved for semantic status. The same
semantic contract is tuned for light and dark modes.

## Component batches

### Batch 1: foundational controls

- Button
- Input, Label, Field, and validation messaging
- Card

### Batch 2: shared floating surfaces

- Tooltip
- Dropdown Menu
- Select
- Combobox

The batch should first establish shared recipes for floating surfaces, menu
items, section labels, separators, selection indicators, collision spacing, and
enter/exit motion.

### Batch 3: larger interactions

- Dialog
- Tabs
- Toast

Dialog should reuse the established surface and motion recipes. Tabs should
define the system's selected-navigation treatment. Toast should define compact
status surfaces and announcement behavior.

## Quality bar

A component is complete only when it covers:

- default, hover, pressed, focus-visible, disabled, and loading states;
- invalid and read-only states where relevant;
- light and dark themes;
- keyboard interaction and focus behavior;
- long content, wrapping, and narrow layouts;
- reduced motion;
- accessible names and descriptions;
- unit or interaction tests; and
- rendered review inside a realistic product composition.

## Registry workflow

Validate the local source registry:

```bash
pnpm dlx shadcn@latest registry validate ./registry.json
```

After a component is committed to the public default branch, install it with:

```bash
pnpm dlx shadcn@latest add specialsoftware/special-ui/button
```

Use a tag or commit SHA for reproducible product installs once the first stable
foundation is selected.
