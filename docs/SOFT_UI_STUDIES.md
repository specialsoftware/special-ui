# A softer Special UI

Preview: `/soft-ui-studies`. Three independent, interactive finance studies use the same sample data. Month changes, category selection, savings contributions, and goal naming work locally. No account is connected and changes are not persisted.

## What kind of design is this?

These are useful descriptive labels, not official names supplied by the designers:

- **Commas: soft product minimalism / tactile SaaS.** Inter and Inter Display, dark ink, pale blue framing, white rounded panels, gentle shadows, occasional translucent surfaces, and pill controls. The marketed dashboard remains fairly dense; lightness comes from container treatment rather than faint text.
- **Procedural Sounds: tactile minimalism / soft utility UI.** Mostly white and neutral gray, rounded panels, softly raised control chips, small colored signals, and playful interaction details. It uses physical cues without relying on heavy neumorphism.

“Lighter / bubblier” is accurate, but increasing button radius alone would barely change Special: its buttons are already pills. The main differences are the existing 2–6px panel/input radii, flat cards, tight spacing, and pervasive structural rules.

## Reference evidence

Examined September 19, 2026. Public HTML/CSS provided exact values; the Commas dashboard illustration was also visually inspected. A live browser was unavailable during reference research, so declared motion was not observed in playback.

| Property | Commas | Procedural Sounds | Current Special |
| --- | --- | --- | --- |
| Typography | Inter / Inter Display, medium headings; hero 36–56px | Regular hero 44–64px, −0.05em tracking | Inter, compact 11–32px scale |
| Surfaces | White, `#f6f5f3`, pale blue `#e6f0f9` | White; `#e5e5e5` borders | White, `#f5f5f5`, flat |
| Corners | Feature cards 24px, windows 16px, icon tiles 14px | 10px base radius, rounded cards and pills | 2/4/4/6px tokens; pill buttons |
| Depth | Layered low-opacity shadows, selective glass | Example shadow `0 2px 8px #0000000f` | No card shadow |
| Accents | Blue CTA gradient, blue charts, lime badges | Tiny colored category dots | Neutral, color for meaning |
| Motion | Declared 200–300ms transitions | Declared press, ring, bubble, wobble effects | Restrained 100–180ms transitions |

Sources:

- [Commas homepage](https://commas.com/)
- [Commas public stylesheet](https://commas.com/_next/static/chunks/29ok4su2es4aw.css)
- [Commas dashboard illustration](https://commas.com/figma/dashboard.webp)
- [Procedural Sounds](https://procedural-sounds.vercel.app/)
- [Procedural Sounds public stylesheet](https://procedural-sounds.vercel.app/_next/static/immutable/chunks/39oh5_-t7_b62.css)
- [Procedural Sounds source repository](https://github.com/m1ckc3s/procedural-sounds)

Static asset URLs may change with upstream deployments.

## Explorations

1. **Soft editorial:** pale blue frame, white 20px cards, roomy two-column structure, blue action accent. Closest to a Commas-influenced evolution.
2. **Tactile utility:** centered introduction, 12px panels, 8px raised controls, colored category signals, restrained shadows. Closest to Procedural Sounds.
3. **Rounded workspace:** neutral gray canvas, 28px card islands, inset capsule rows, and a tall savings rail. Applies the shared language to daily product work.

The comparison button removes selected surface treatments and restores original-like geometry within the new layouts. It is not a reproduction of the existing homepage. The studies deliberately explore surface/spacing differences; elaborate sound and spring animations are not reproduced.

Implementation reuses Button, Card, and Input; CSS and token overrides are scoped to the study page. The production theme remains unchanged. Card does not consume the existing shadow token, so study elevation is applied explicitly. These are light-mode experiments.
