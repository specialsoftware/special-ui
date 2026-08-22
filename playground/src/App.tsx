import { useState } from "react"
import {
  ArrowRight,
  Check,
  CreditCard,
  Moon,
  MoreHorizontal,
  Settings2,
  Sparkles,
  Sun,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const themes = [
  {
    id: "warm",
    name: "Warm Precision",
    description: "Ivory, charcoal, and cobalt. Editorial restraint for premium product UI.",
    className: "theme-warm",
    swatches: ["bg-background", "bg-card", "bg-secondary", "bg-primary", "bg-destructive"],
  },
  {
    id: "cool",
    name: "Cool Studio",
    description: "Porcelain, ink, and iris. Softer, friendlier, and more spacious.",
    className: "theme-cool",
    swatches: ["bg-background", "bg-card", "bg-secondary", "bg-primary", "bg-destructive"],
  },
  {
    id: "signal",
    name: "Signal Modernist",
    description: "Newsprint, black, and vermilion. Compact and graphically direct.",
    className: "theme-signal",
    swatches: ["bg-background", "bg-card", "bg-secondary", "bg-primary", "bg-destructive"],
  },
] as const

type ThemeId = (typeof themes)[number]["id"]

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[9rem_1fr] md:gap-8">
      <p className="pt-1 text-eyebrow uppercase text-subtle-foreground">{eyebrow}</p>
      <div className="max-w-2xl">
        <h2 className="font-display text-heading text-foreground">{title}</h2>
        <p className="mt-2 text-body text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ThemePicker({ selected, onSelect }: { selected: ThemeId; onSelect: (id: ThemeId) => void }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {themes.map((theme) => {
        const active = selected === theme.id
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            aria-pressed={active}
            className="group rounded-lg border border-border bg-card p-4 text-left shadow-card outline-none transition-[border-color,box-shadow,transform] duration-normal ease-special hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 active:translate-y-0"
          >
            <span className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-label text-foreground">{theme.name}</span>
                <span className="mt-1 block text-caption text-muted-foreground">{theme.description}</span>
              </span>
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-primary"
                aria-hidden="true"
              >
                {active && <Check className="size-3" strokeWidth={2.5} />}
              </span>
            </span>
            <span className="mt-4 flex gap-1.5" aria-hidden="true">
              {theme.swatches.map((swatch) => (
                <span key={swatch} className={`h-5 flex-1 rounded-sm border border-border ${swatch}`} />
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function App() {
  const [themeId, setThemeId] = useState<ThemeId>("warm")
  const [dark, setDark] = useState(false)
  const theme = themes.find((item) => item.id === themeId) ?? themes[0]

  return (
    <div className={`${theme.className} ${dark ? "dark" : ""} special-ui-theme`}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.16)]">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-label">Special UI</p>
                <p className="text-caption text-muted-foreground">Foundation calibration</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setDark((value) => !value)}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
            >
              {dark ? <Sun /> : <Moon />}
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
          <section className="grid gap-10 py-16 md:grid-cols-[1fr_18rem] md:items-end md:py-24">
            <div className="max-w-3xl">
              <p className="text-eyebrow uppercase text-primary">Special UI · v2</p>
              <h1 className="mt-5 max-w-[18ch] font-display text-display text-foreground">
                A quieter foundation for ambitious products.
              </h1>
              <p className="mt-6 max-w-[62ch] text-body text-muted-foreground">
                One semantic system, three visual directions. The components below share the same
                structure and behavior so we can judge the design language rather than isolated
                mockups.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button>
                  Start a project <ArrowRight data-icon="inline-end" />
                </Button>
                <Button variant="secondary">Read the principles</Button>
              </div>
            </div>

            <Card variant="subtle" size="sm">
              <CardHeader>
                <CardDescription>Active direction</CardDescription>
                <CardTitle>{theme.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-caption text-muted-foreground">{theme.description}</p>
              </CardContent>
            </Card>
          </section>

          <section className="border-t border-border py-12">
            <SectionHeading
              eyebrow="Direction"
              title="Compare complete visual systems"
              description="Switching direction changes color, typography, shape, surface depth, and contrast together. Every option includes a tuned dark mode."
            />
            <div className="mt-8 md:ml-[11rem]">
              <ThemePicker selected={themeId} onSelect={setThemeId} />
            </div>
          </section>

          <section className="border-t border-border py-12">
            <SectionHeading
              eyebrow="Type"
              title="Application-first typography"
              description="The scale is compact enough for dense tools, with enough contrast for product marketing and onboarding moments."
            />
            <div className="mt-10 grid gap-8 md:ml-[11rem] md:grid-cols-[1fr_14rem]">
              <div className="space-y-5">
                <p className="font-display text-title">Build with clarity.</p>
                <p className="font-display text-heading">Section heading</p>
                <p className="max-w-[64ch] text-body text-muted-foreground">
                  Body text carries the work: calm color contrast, comfortable line height, and a
                  measure that supports scanning without feeling oversized.
                </p>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  <span className="text-label">Interface label</span>
                  <span className="text-caption text-muted-foreground">Supporting caption</span>
                  <span className="text-eyebrow uppercase text-subtle-foreground">Eyebrow</span>
                </div>
              </div>
              <div className="rounded-md border border-border bg-secondary p-4 font-mono text-caption text-muted-foreground">
                <p data-tabular>Revenue&nbsp;&nbsp;$24,880</p>
                <p data-tabular>Growth&nbsp;&nbsp;&nbsp;&nbsp;+18.4%</p>
                <p data-tabular>Latency&nbsp;&nbsp;&nbsp;&nbsp;82ms</p>
              </div>
            </div>
          </section>

          <section className="border-t border-border py-12">
            <SectionHeading
              eyebrow="Controls"
              title="Buttons with complete interaction intent"
              description="The first component establishes control height, optical padding, icon sizing, focus treatment, press behavior, and disabled/loading states."
            />
            <div className="mt-10 space-y-8 md:ml-[11rem]">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Delete</Button>
                <Button variant="link">Text link</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button loading>Saving changes</Button>
                <Button disabled>Unavailable</Button>
                <Button variant="outline" size="icon" aria-label="Open settings">
                  <Settings2 />
                </Button>
              </div>
            </div>
          </section>

          <section className="border-t border-border py-12">
            <SectionHeading
              eyebrow="Composition"
              title="Fields and cards in a realistic setting"
              description="A small billing screen exposes spacing, surface hierarchy, validation, alignment, and action density better than isolated swatches."
            />

            <div className="mt-10 grid gap-5 md:ml-[11rem] lg:grid-cols-[1.15fr_0.85fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Billing details</CardTitle>
                  <CardDescription>Receipts and renewal notices will be sent here.</CardDescription>
                  <CardAction>
                    <Button variant="ghost" size="icon-sm" aria-label="More billing options">
                      <MoreHorizontal />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="company">Company name</FieldLabel>
                      <Input id="company" defaultValue="Special Software" />
                      <FieldDescription>Displayed on invoices and receipts.</FieldDescription>
                    </Field>
                    <Field data-invalid="true">
                      <FieldLabel htmlFor="billing-email">Billing email</FieldLabel>
                      <Input
                        id="billing-email"
                        type="email"
                        defaultValue="accounts@"
                        aria-invalid="true"
                      />
                      <FieldError>Enter a complete email address.</FieldError>
                    </Field>
                  </FieldGroup>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button variant="ghost">Cancel</Button>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>

              <div className="grid gap-5">
                <Card interactive tabIndex={0} role="button">
                  <CardHeader>
                    <CardDescription>Current plan</CardDescription>
                    <CardTitle>Studio</CardTitle>
                    <CardAction>
                      <CreditCard className="size-4 text-muted-foreground" />
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-1">
                      <span className="font-display text-title">$24</span>
                      <span className="pb-1 text-caption text-muted-foreground">/ month</span>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <span className="text-caption text-muted-foreground">Renews Sep 21</span>
                    <ArrowRight className="size-4" />
                  </CardFooter>
                </Card>

                <Card variant="subtle" size="sm">
                  <CardHeader>
                    <CardDescription>Usage this month</CardDescription>
                    <CardTitle data-tabular>8,420 / 10,000</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[84%] rounded-full bg-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
