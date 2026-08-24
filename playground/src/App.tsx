import { useState } from "react"
import { ArrowRight, CreditCard, Moon, MoreHorizontal, Settings2, Sun } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
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

const neutralScale = [
  { label: "Canvas", light: "#FFFFFF", dark: "#0A0A0A", className: "bg-background" },
  { label: "Surface", light: "#F5F5F5", dark: "#171717", className: "bg-secondary" },
  { label: "Rule", light: "#E5E5E5", dark: "#292929", className: "bg-border" },
  { label: "Muted", light: "#616161", dark: "#A3A3A3", className: "bg-muted-foreground" },
  { label: "Ink", light: "#111111", dark: "#F5F5F5", className: "bg-foreground" },
] as const

function SectionHeading({
  index,
  title,
  description,
}: {
  index: string
  title: string
  description: string
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[7rem_1fr] md:gap-8">
      <p className="pt-0.5 type-caption text-subtle-foreground">{index}</p>
      <div className="max-w-xl">
        <h2 className="font-display type-heading text-foreground">{title}</h2>
        <p className="mt-2 type-body text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function App() {
  const [dark, setDark] = useState(false)

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme`}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
          <div className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto] items-center px-5 md:grid-cols-[7rem_1fr_auto] md:px-8">
            <span className="hidden type-caption text-subtle-foreground md:block">S / UI</span>
            <div className="flex items-center gap-2.5">
              <span className="size-2 bg-foreground" aria-hidden="true" />
              <p className="type-label">Special UI</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDark((value) => !value)}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
            >
              {dark ? <Sun /> : <Moon />}
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
          <section className="grid gap-10 py-14 md:grid-cols-[1fr_15rem] md:gap-8 md:py-20 md:pl-[9rem]">
            <div className="max-w-2xl">
              <h1 className="max-w-[20ch] font-display type-display text-foreground">
                A precise interface system for product work.
              </h1>
              <p className="mt-5 max-w-[58ch] type-body text-muted-foreground">
                Monochrome foundations, compact typography, and quiet components. Structure carries
                the hierarchy; color is reserved for meaning.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <Button>
                  Explore components <ArrowRight data-icon="inline-end" />
                </Button>
                <a href="/blog" className={buttonVariants({ variant: "outline" })}>
                  Read article template
                </a>
                <a href="/personal-website" className={buttonVariants({ variant: "ghost" })}>
                  Personal website
                </a>
                <a href="/budgeting" className={buttonVariants({ variant: "ghost" })}>
                  Budgeting site
                </a>
                <a href="/finance-blocks" className={buttonVariants({ variant: "ghost" })}>
                  Finance blocks
                </a>
              </div>
            </div>
            <dl className="grid content-start gap-3 border-t border-border pt-3 type-caption md:border-t-0 md:pt-0">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Typeface</dt>
                <dd>Inter</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Scale</dt>
                <dd data-tabular>11—32</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Grid</dt>
                <dd data-tabular>4px</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Mode</dt>
                <dd>{dark ? "Dark" : "Light"}</dd>
              </div>
            </dl>
          </section>

          <section className="border-t border-border py-12">
            <SectionHeading
              index="01 / Color"
              title="Neutral by default"
              description="Pure white and neutral off-black anchor the system. Grays organize secondary information, rules, and surfaces without adding a visual theme of their own."
            />
            <div className="mt-9 grid border-l border-t border-border sm:grid-cols-5 md:ml-[9rem]">
              {neutralScale.map((color) => (
                <div key={color.label} className="border-b border-r border-border">
                  <div className={`h-20 ${color.className}`} />
                  <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2.5 type-caption">
                    <span>{color.label}</span>
                    <span className="text-subtle-foreground">{dark ? color.dark : color.light}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border py-12">
            <SectionHeading
              index="02 / Type"
              title="One family, fewer gestures"
              description="Inter carries every role. Size changes are compact, weight stays mostly regular or medium, and text color provides the remaining hierarchy."
            />
            <div className="mt-9 border-t border-border md:ml-[9rem]">
              <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline">
                <span className="type-caption text-subtle-foreground">Display · 32/36</span>
                <span className="font-display type-display">Build with clarity.</span>
                <span className="type-caption text-muted-foreground">500</span>
              </div>
              <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline">
                <span className="type-caption text-subtle-foreground">Title · 24/30</span>
                <span className="font-display type-title">A measured title</span>
                <span className="type-caption text-muted-foreground">500</span>
              </div>
              <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline">
                <span className="type-caption text-subtle-foreground">Heading · 18/24</span>
                <span className="font-display type-heading">Section heading</span>
                <span className="type-caption text-muted-foreground">500</span>
              </div>
              <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline">
                <span className="type-caption text-subtle-foreground">Body · 14/21</span>
                <span className="max-w-[60ch] type-body text-muted-foreground">
                  Calm contrast and a comfortable line height make dense interfaces easier to scan.
                </span>
                <span className="type-caption text-muted-foreground">400</span>
              </div>
            </div>
          </section>

          <section className="border-t border-border py-12">
            <SectionHeading
              index="03 / Controls"
              title="Controls without decoration"
              description="Actions use neutral contrast, precise borders, compact geometry, and restrained state changes instead of color, shine, or physical movement."
            />
            <div className="mt-9 space-y-7 md:ml-[9rem]">
              <div className="flex flex-wrap items-center gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Delete</Button>
                <Button variant="link">Text link</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button loading>Saving</Button>
                <Button disabled>Unavailable</Button>
                <Button variant="outline" size="icon" aria-label="Open settings">
                  <Settings2 />
                </Button>
              </div>
            </div>
          </section>

          <section className="border-t border-border py-12">
            <SectionHeading
              index="04 / Form"
              title="Structure before surface"
              description="Borders and spacing define regions. Cards remain flat, labels stay compact, and supporting information steps back through neutral text contrast."
            />

            <div className="mt-9 grid gap-4 md:ml-[9rem] lg:grid-cols-[1.2fr_0.8fr]">
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

              <div className="grid gap-4">
                <Card interactive tabIndex={0} role="button">
                  <CardHeader>
                    <CardDescription>Current plan</CardDescription>
                    <CardTitle>Studio</CardTitle>
                    <CardAction>
                      <CreditCard className="size-4 text-muted-foreground" />
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display type-title" data-tabular>$24</span>
                      <span className="type-caption text-muted-foreground">/ month</span>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <span className="type-caption text-muted-foreground">Renews Sep 21</span>
                    <ArrowRight className="size-4" />
                  </CardFooter>
                </Card>

                <Card variant="subtle" size="sm">
                  <CardHeader>
                    <CardDescription>Usage this month</CardDescription>
                    <CardTitle data-tabular>8,420 / 10,000</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-px bg-border">
                      <div className="h-px w-[84%] bg-foreground" />
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
