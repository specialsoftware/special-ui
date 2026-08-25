import { useEffect, useState, type ReactNode } from "react"
import { ArrowLeft, Check, Minus, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

function Study({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[9rem_1fr] lg:gap-10">
        <p className="type-caption text-muted-foreground">{number}</p>
        <div><h2 className="type-title">{title}</h2><div className="mt-8">{children}</div></div>
      </div>
    </section>
  )
}

function PlanFeature({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <li className={`inline-flex items-start gap-2 type-label ${muted ? "text-muted-foreground" : ""}`}>{muted ? <Minus className="mt-0.5 size-3.5" /> : <Check className="mt-0.5 size-3.5" />}{children}</li>
}

function ConceptNote({ children }: { children: ReactNode }) {
  return <p className="border-t border-border pt-3 type-caption text-muted-foreground">Concept only · {children}</p>
}

export function PricingStudiesPage() {
  const [dark, setDark] = useState(false)
  const [annual, setAnnual] = useState(false)
  const [statements, setStatements] = useState(5)

  useEffect(() => {
    document.title = "Pricing Studies — Special UI"
  }, [])

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme min-h-screen bg-background text-foreground`}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="/bankcsv-landing" className="inline-flex items-center gap-2 type-label"><ArrowLeft className="size-3.5" />Bank CSV landing</a>
          <p className="hidden type-caption text-muted-foreground sm:block">Pricing studies</p>
          <Button variant="ghost" size="icon-sm" onClick={() => setDark((value) => !value)} aria-label={dark ? "Use light theme" : "Use dark theme"}>{dark ? <Sun /> : <Moon />}</Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <section className="grid min-h-[26rem] items-center gap-8 py-16 lg:grid-cols-[9rem_1fr] lg:py-24">
          <p className="self-start type-caption text-muted-foreground">Five pricing systems.</p>
          <div>
            <h1 className="max-w-[17ch] type-display">A clear price for a simple monthly job.</h1>
            <p className="mt-5 max-w-[54ch] type-body text-muted-foreground">The first study reflects current public limits. Future models keep placeholders until billing, retention, and cancellation terms are set.</p>
          </div>
        </section>

        <Study number="01 / Current" title="Free and Pro">
          <div className="grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-2">
            <div className="p-6 md:border-r md:border-border md:p-8">
              <div className="flex items-start justify-between gap-5"><div><h3 className="type-heading">Free</h3><p className="mt-2 type-caption text-muted-foreground">Organize a few statements.</p></div><p className="type-display tabular-nums">$0</p></div>
              <ul className="mt-8 space-y-3"><PlanFeature>4 uploads every 30 days</PlanFeature><PlanFeature>50 transactions per CSV</PlanFeature><PlanFeature>AI categorization</PlanFeature><PlanFeature>Community support</PlanFeature></ul>
              <Button className="mt-8 w-full">Start free</Button>
            </div>
            <div className="border-t border-border bg-secondary/35 p-6 md:border-t-0 md:p-8">
              <div className="flex items-start justify-between gap-5"><div><h3 className="type-heading">Pro</h3><p className="mt-2 type-caption text-muted-foreground">Work across more accounts.</p></div><p className="text-right type-heading">[PRICE]<span className="block type-caption text-muted-foreground">per month</span></p></div>
              <ul className="mt-8 space-y-3"><PlanFeature>15 uploads every 30 days</PlanFeature><PlanFeature>300 transactions per CSV</PlanFeature><PlanFeature>AI categorization</PlanFeature><PlanFeature>Priority support</PlanFeature></ul>
              <Button variant="outline" className="mt-8 w-full">Choose Pro</Button>
            </div>
            <div className="border-t border-border px-6 py-3 md:col-span-2"><ConceptNote>confirm the live Pro price before shipping.</ConceptNote></div>
          </div>
        </Study>

        <Study number="02 / Continuity" title="Categorize free. Pay to keep a budget.">
          <div className="grid overflow-hidden rounded-lg border border-border lg:grid-cols-2">
            <div className="bg-card p-6 md:p-8">
              <h3 className="type-title">Organize a file.</h3><p className="mt-3 type-display tabular-nums">$0</p>
              <ul className="mt-8 space-y-3"><PlanFeature>Upload and organize</PlanFeature><PlanFeature>Review every category</PlanFeature><PlanFeature>Export your CSV</PlanFeature><PlanFeature>No bank connection</PlanFeature></ul>
              <Button variant="outline" className="mt-8">Categorize free</Button>
            </div>
            <div className="border-t border-border bg-foreground p-6 text-background lg:border-l lg:border-t-0 md:p-8">
              <h3 className="type-title">Keep the month.</h3><p className="mt-3 type-heading tabular-nums">[PRICE] <span className="type-caption text-background/55">/ month</span></p>
              <ul className="mt-8 space-y-3"><li className="inline-flex gap-2 type-label"><Check className="mt-0.5 size-3.5" />Save monthly history</li><li className="inline-flex gap-2 type-label"><Check className="mt-0.5 size-3.5" />Reuse category rules</li><li className="inline-flex gap-2 type-label"><Check className="mt-0.5 size-3.5" />Set category budgets</li><li className="inline-flex gap-2 type-label"><Check className="mt-0.5 size-3.5" />Compare months</li></ul>
              <Button variant="secondary" className="mt-8">Start a budget</Button>
            </div>
          </div>
          <div className="mt-3"><ConceptNote>requires accounts, saved history, deletion controls, and a revised privacy promise.</ConceptNote></div>
        </Study>

        <Study number="03 / Billing" title="One plan, two billing periods">
          <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 md:p-8">
            <fieldset>
              <legend className="sr-only">Billing period</legend>
              <div className="inline-flex rounded-full border border-border p-1 type-caption">
                {([[false, "Monthly"], [true, "Yearly"]] as const).map(([value, label]) => (
                  <label key={label} className={`cursor-pointer rounded-full px-3 py-1.5 ${annual === value ? "bg-foreground text-background" : "text-muted-foreground"}`}>
                    <input type="radio" name="billing" value={label} checked={annual === value} onChange={() => setAnnual(value)} className="sr-only" />{label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-9 flex items-end justify-between gap-5 border-b border-border pb-7">
              <div><h3 className="type-title">Budget</h3><p className="mt-2 type-caption text-muted-foreground">One clear subscription.</p></div>
              <p className="text-right type-display" aria-live="polite">[PRICE]<span className="block type-caption text-muted-foreground">{annual ? "billed yearly" : "per month"}</span></p>
            </div>
            <ul className="grid gap-3 py-7 sm:grid-cols-2"><PlanFeature>Saved months</PlanFeature><PlanFeature>Reusable rules</PlanFeature><PlanFeature>Budgets and exports</PlanFeature><PlanFeature>Multiple accounts</PlanFeature></ul>
            <Button className="w-full">Choose {annual ? "yearly" : "monthly"}</Button>
            <div className="mt-5"><ConceptNote>calculate any annual saving from the billing system.</ConceptNote></div>
          </div>
        </Study>

        <Study number="04 / Usage" title="Pay by statement">
          <div className="grid overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[1fr_18rem]">
            <div className="p-6 md:p-8 lg:border-r lg:border-border">
              <h3 className="max-w-[12ch] type-display">[PRICE] per statement.</h3>
              <p className="mt-4 type-body text-muted-foreground">No subscription.</p>
              <div className="mt-10 flex flex-wrap gap-2" role="radiogroup" aria-label="Number of statements">
                {[1, 5, 10].map((count) => <Button key={count} variant={statements === count ? "default" : "outline"} size="sm" role="radio" aria-checked={statements === count} onClick={() => setStatements(count)}>{count} {count === 1 ? "file" : "files"}</Button>)}
              </div>
            </div>
            <div className="border-t border-border bg-secondary/35 p-6 lg:border-t-0 md:p-8">
              <p className="type-caption text-muted-foreground">Order</p>
              <p className="mt-3 type-title tabular-nums">{statements} {statements === 1 ? "statement" : "statements"}</p>
              <p className="mt-8 type-caption text-muted-foreground">Total</p>
              <p className="mt-2 type-display tabular-nums">[TOTAL]</p>
              <Button className="mt-8 w-full">Buy credits</Button>
            </div>
          </div>
          <div className="mt-3"><ConceptNote>define failed-upload credits, expiration, and refunds first.</ConceptNote></div>
        </Study>

        <Study number="05 / Trial" title="Show every billing moment">
          <div className="rounded-lg border border-border bg-card p-6 md:p-8">
            <ol className="grid border-t border-border md:grid-cols-4 md:border-l">
              {[
                ["Today", "Start the full product"],
                ["Day [N−1]", "Renewal reminder"],
                ["Day [N]", "[PRICE] begins"],
                ["Any time", "Cancel in settings"],
              ].map(([when, event]) => (
                <li key={when} className="border-b border-border py-5 md:border-r md:px-5">
                  <p className="type-caption text-muted-foreground">{when}</p><p className="mt-8 max-w-[15ch] type-heading">{event}</p>
                </li>
              ))}
            </ol>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><ConceptNote>match trial length, reminders, card policy, and cancellation to checkout.</ConceptNote><Button>Start [N]-day trial</Button></div>
          </div>
        </Study>
      </main>
    </div>
  )
}
