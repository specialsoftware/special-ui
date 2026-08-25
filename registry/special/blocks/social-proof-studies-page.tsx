import { useEffect, useState, type ReactNode } from "react"
import { ArrowLeft, ArrowRight, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

function Study({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[9rem_1fr] lg:gap-10">
        <p className="type-caption text-muted-foreground">{number}</p>
        <div>
          <h2 className="type-title">{title}</h2>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  )
}

function DemoLabel() {
  return <p className="type-caption text-muted-foreground">Demo structure · replace bracketed data with verified evidence</p>
}

export function SocialProofStudiesPage() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.title = "Social Proof Studies — Special UI"
  }, [])

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme min-h-screen bg-background text-foreground`}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="/bankcsv-landing" className="inline-flex items-center gap-2 type-label"><ArrowLeft className="size-3.5" />Bank CSV landing</a>
          <p className="hidden type-caption text-muted-foreground sm:block">Social proof studies</p>
          <Button variant="ghost" size="icon-sm" onClick={() => setDark((value) => !value)} aria-label={dark ? "Use light theme" : "Use dark theme"}>
            {dark ? <Sun /> : <Moon />}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <section className="grid min-h-[26rem] items-center gap-8 py-16 lg:grid-cols-[9rem_1fr] lg:py-24">
          <p className="self-start type-caption text-muted-foreground">Five proof systems.</p>
          <div>
            <h1 className="max-w-[18ch] type-display">Customer evidence without the testimonial wall.</h1>
            <p className="mt-5 max-w-[54ch] type-body text-muted-foreground">Each block has a clear source slot, date, and definition so sample copy never becomes a production claim by accident.</p>
          </div>
        </section>

        <Study number="01 / Rail" title="Verified usage at a glance">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="grid sm:grid-cols-3">
              {[
                ["[VERIFIED COUNT]", "statements categorized"],
                ["[VERIFIED COUNT]", "active users · last 30 days"],
                ["[VERIFIED RATE]%", "successful exports"],
              ].map(([value, label], index) => (
                <dl key={label} className={`p-5 md:p-7 ${index < 2 ? "border-b border-border sm:border-b-0 sm:border-r" : ""}`}>
                  <dd className="type-title tabular-nums">{value}</dd>
                  <dt className="mt-2 type-caption text-muted-foreground">{label}</dt>
                </dl>
              ))}
            </div>
            <div className="border-t border-border px-5 py-3"><DemoLabel /></div>
          </div>
        </Study>

        <Study number="02 / Outcome" title="One customer, one result">
          <div className="grid overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[1.25fr_0.75fr]">
            <figure className="p-6 md:p-9 lg:border-r lg:border-border">
              <blockquote className="max-w-[28ch] type-title">“[A short verified quote about organizing several accounts.]”</blockquote>
              <figcaption className="mt-12 type-caption text-muted-foreground">[Customer name] · [Role] · Customer since [Date]</figcaption>
            </figure>
            <div className="border-t border-border bg-secondary/35 p-6 lg:border-t-0 md:p-9">
              <p className="type-label">Outcome receipt</p>
              <dl className="mt-6 border-t border-border">
                {[["[COUNT]", "files"], ["[COUNT]", "transactions"], ["[TIME]", "to export"]].map(([value, label]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 border-b border-border py-4"><dt className="type-caption text-muted-foreground">{label}</dt><dd className="type-heading tabular-nums">{value}</dd></div>
                ))}
              </dl>
            </div>
            <div className="border-t border-border px-6 py-3 lg:col-span-2"><DemoLabel /></div>
          </div>
        </Study>

        <Study number="03 / Ledger" title="Proof by use case">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="hidden grid-cols-[10rem_1fr_10rem] border-b border-border px-5 py-2 type-caption text-muted-foreground md:grid">
              <span>Use case</span><span>Customer quote</span><span>Source</span>
            </div>
            {[
              ["Multiple accounts", "[Verified quote about combining exports from two banks.]"],
              ["Monthly review", "[Verified quote about seeing the month without spreadsheet cleanup.]"],
              ["Privacy", "[Verified quote about uploading files instead of linking a bank.]"],
            ].map(([useCase, quote]) => (
              <div key={useCase} className="grid gap-3 border-b border-border px-5 py-5 last:border-b-0 md:grid-cols-[10rem_1fr_10rem] md:items-start">
                <p className="type-label">{useCase}</p>
                <blockquote className="type-body">“{quote}”</blockquote>
                <span className="type-caption text-muted-foreground">[Customer · Date]</span>
              </div>
            ))}
            <div className="border-t border-border px-5 py-3"><DemoLabel /></div>
          </div>
        </Study>

        <Study number="04 / Aggregate" title="The typical completed session">
          <div className="rounded-lg border border-border bg-card p-6 md:p-9">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
              <div>
                <p className="type-caption text-muted-foreground">Raw statements</p>
                <p className="mt-4 type-display tabular-nums">[MEDIAN FILES]</p>
                <p className="mt-2 type-label">files uploaded</p>
              </div>
              <ArrowRight className="size-5 rotate-90 text-muted-foreground md:rotate-0" aria-hidden="true" />
              <div className="border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <p className="type-caption text-muted-foreground">Organized month</p>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <div><p className="type-title tabular-nums">[CATEGORIES]</p><p className="mt-1 type-caption text-muted-foreground">categories</p></div>
                  <div><p className="type-title tabular-nums">[TIME]</p><p className="mt-1 type-caption text-muted-foreground">median completion</p></div>
                </div>
              </div>
            </div>
            <p className="mt-10 border-t border-border pt-3 type-caption text-muted-foreground">Based on [SAMPLE SIZE] completed sessions · [DATE RANGE]</p>
          </div>
        </Study>

        <Study number="05 / Profiles" title="Four reasons people bring a CSV">
          <div className="grid overflow-hidden rounded-lg border-l border-t border-border sm:grid-cols-2">
            {[
              ["Spreadsheet budgeter", "[Verified quote about skipping manual categorization.]"],
              ["Two-bank household", "[Verified quote about one combined monthly view.]"],
              ["Freelancer", "[Verified quote about separating work and personal spending.]"],
              ["Privacy-conscious user", "[Verified quote about avoiding bank connections.]"],
            ].map(([profile, quote]) => (
              <figure key={profile} className="border-b border-r border-border bg-card p-5 md:p-7">
                <p className="type-label">{profile}</p>
                <blockquote className="mt-8 max-w-[28ch] type-body">“{quote}”</blockquote>
                <figcaption className="mt-8 type-caption text-muted-foreground">[Customer name] · [Verified usage fact]</figcaption>
              </figure>
            ))}
          </div>
        </Study>
      </main>
    </div>
  )
}
