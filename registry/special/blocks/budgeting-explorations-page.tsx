import { useEffect, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileSpreadsheet,
  FolderOpen,
  Landmark,
  LockKeyhole,
  Moon,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

const categoryViews = {
  Overview: {
    value: "$2,184",
    label: "left this month",
    rows: [["Home", "$2,800"], ["Everyday", "$1,120"], ["Future", "$1,400"]],
  },
  Spending: {
    value: "$1,236",
    label: "spent this month",
    rows: [["Groceries", "$486"], ["Dining", "$238"], ["Shopping", "$192"]],
  },
  Goals: {
    value: "73%",
    label: "of monthly goal",
    rows: [["Emergency", "$600"], ["Japan", "$420"], ["Home", "$300"]],
  },
} as const

const prompts = [
  "Find subscriptions I forgot about",
  "Show where July went over plan",
  "Build a realistic grocery budget",
] as const

const promptResults = [
  { metric: "$74 / month", detail: "Five recurring charges found" },
  { metric: "+$186", detail: "Dining caused most of the overage" },
  { metric: "$520 / month", detail: "Based on your last six months" },
] as const

function SectionFrame({
  index,
  reference,
  children,
  flush = false,
}: {
  index: string
  reference: string
  children: ReactNode
  flush?: boolean
}) {
  return (
    <section className={`border-t border-border ${flush ? "py-0" : "py-16 md:py-24"}`}>
      <div className="grid gap-7 lg:grid-cols-[9rem_1fr] lg:gap-10">
        <p className={`${flush ? "pt-8 lg:pt-10" : ""} type-caption text-muted-foreground`}>
          {index} / {reference}
        </p>
        {children}
      </div>
    </section>
  )
}

function SplitTitle({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <h2 className="max-w-[22ch] type-display">
      <span className="block text-foreground">{primary}</span>
      <span className="block text-muted-foreground">{secondary}</span>
    </h2>
  )
}

export function BudgetingExplorationsPage() {
  const [dark, setDark] = useState(false)
  const [demoPhase, setDemoPhase] = useState(0)
  const [analyzed, setAnalyzed] = useState(false)
  const [category, setCategory] = useState<keyof typeof categoryViews>("Overview")
  const [promptIndex, setPromptIndex] = useState(0)
  const [mapStep, setMapStep] = useState(0)

  useEffect(() => {
    document.title = "Budgeting Explorations — Special UI"
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = window.setInterval(() => setDemoPhase((value) => (value + 1) % 3), 2400)
    return () => window.clearInterval(timer)
  }, [])

  const selectedCategory = categoryViews[category]
  const selectedPrompt = promptResults[promptIndex]

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme min-h-screen bg-background text-foreground`}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="/" className="inline-flex items-center gap-2 type-label">
            <ArrowLeft className="size-3.5" /> Special UI
          </a>
          <p className="hidden type-caption text-muted-foreground sm:block">Budgeting explorations</p>
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
        <section className="grid min-h-[32rem] items-center gap-10 py-16 lg:grid-cols-[9rem_1fr] lg:gap-10 lg:py-24">
          <p className="self-start type-caption text-muted-foreground">Section studies for a quieter finance site.</p>
          <div>
            <h1 className="max-w-[20ch] text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.04] tracking-[-0.045em]">
              Smaller type. One idea at a time. More room for the product.
            </h1>
            <div className="mt-8 flex flex-wrap gap-2">
              <a href="#studies" className={buttonVariants({ size: "lg" })}>
                View explorations <ArrowRight data-icon="inline-end" />
              </a>
              <a href="/finance-blocks" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Previous blocks
              </a>
            </div>
          </div>
        </section>

        <div id="studies" className="scroll-mt-20">
          <SectionFrame index="01" reference="X object hero">
            <div className="grid min-h-[34rem] border border-border lg:grid-cols-[8rem_1fr]">
              <div className="hidden border-r border-border p-4 lg:block">
                <div className="flex items-center gap-2 type-label"><CircleDollarSign className="size-4" /> Budget</div>
                <div className="mt-10 space-y-4 type-caption">
                  <p>Overview</p>
                  <p className="text-muted-foreground">Method</p>
                  <p className="text-muted-foreground">Privacy</p>
                </div>
              </div>
              <div className="relative flex flex-col items-center justify-between overflow-hidden px-6 py-12 text-center md:px-12">
                <h2 className="max-w-[22ch] text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.04] tracking-[-0.045em]">
                  Turn a bank statement into a plan you can use.
                </h2>
                <div className="relative my-12 h-40 w-52" aria-label="A stack of bank statement files becoming an organized budget">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className={`absolute left-1/2 top-1/2 grid h-28 w-44 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border border-border bg-card shadow-card transition-transform duration-700 motion-reduce:transition-none ${
                        demoPhase === item
                          ? "-translate-y-[62%] rotate-0"
                          : item === 0 ? "-rotate-6 translate-x-[-58%]" : item === 2 ? "rotate-6 translate-x-[-42%]" : ""
                      }`}
                    >
                      {item === 2 ? <BarChart3 className="size-7" /> : <FileSpreadsheet className="size-7 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
                <p className="type-caption text-muted-foreground">Private, local-first categorization.</p>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="02" reference="Mobbin proof hero">
            <div className="text-center">
              <h2 className="mx-auto max-w-[21ch] text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.04] tracking-[-0.045em]">
                Your spreadsheet already has the answer. We make it visible.
              </h2>
              <div className="mt-12 overflow-hidden rounded-xl border border-border bg-card text-left">
                <div className="flex h-11 items-center gap-2 border-b border-border px-4">
                  <span className="size-2 rounded-full bg-border" />
                  <span className="size-2 rounded-full bg-border" />
                  <span className="size-2 rounded-full bg-border" />
                </div>
                <div className="grid gap-8 p-6 md:grid-cols-[0.75fr_1.25fr] md:p-10">
                  <div className="flex min-h-64 flex-col justify-between rounded-lg border border-dashed border-border-strong p-5">
                    <div>
                      <Upload className="size-5" />
                      <p className="mt-4 type-heading">August-checking.csv</p>
                      <p className="mt-1 type-caption text-muted-foreground">148 transactions</p>
                    </div>
                    <Button onClick={() => setAnalyzed((value) => !value)}>
                      {analyzed ? "Reset statement" : "Build my budget"}
                      {analyzed ? <RotateCcw data-icon="inline-end" /> : <Sparkles data-icon="inline-end" />}
                    </Button>
                  </div>
                  <div className="grid content-center gap-3">
                    {(analyzed
                      ? [["Needs", "$3,180", "51%"], ["Wants", "$1,264", "20%"], ["Future", "$1,756", "29%"]]
                      : [["Uncategorized", "148 items", "—"], ["Monthly plan", "Waiting", "—"], ["Safe to spend", "Waiting", "—"]]
                    ).map(([label, value, share]) => (
                      <div key={label} className="grid grid-cols-[1fr_auto_auto] items-center gap-5 border-b border-border py-4">
                        <span className="type-body">{label}</span>
                        <span className="type-body text-muted-foreground">{value}</span>
                        <span className="w-9 text-right type-caption text-subtle-foreground">{share}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="03" reference="Mobbin statement">
            <div>
              <h2 className="mx-auto max-w-[25ch] text-center type-display">
                Budgets should make decisions easier.
                <span className="block text-muted-foreground">Not give you another system to maintain.</span>
              </h2>
              <div className="mx-auto mt-14 max-w-3xl rounded-xl border border-border bg-card p-5 md:p-8">
                <div className="flex items-center justify-between border-b border-border pb-5">
                  <div>
                    <p className="type-caption text-muted-foreground">Safe to spend</p>
                    <p className="mt-1 type-title">$2,184</p>
                  </div>
                  <p className="type-caption text-muted-foreground">18 days left</p>
                </div>
                <div className="grid gap-4 pt-6 sm:grid-cols-3">
                  {[["Bills covered", "$3,180"], ["Goals funded", "$1,400"], ["Flex money", "$784"]].map(([label, value]) => (
                    <div key={label} className="border-l border-border pl-4">
                      <p className="type-caption text-muted-foreground">{label}</p>
                      <p className="mt-1 type-heading">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="04" reference="Mobbin category browser">
            <div className="grid overflow-hidden rounded-xl border border-border md:grid-cols-[0.72fr_1.28fr]">
              <div className="border-b border-border p-6 md:border-b-0 md:border-r md:p-8">
                <h2 className="max-w-[13ch] type-display">One file. Three useful views.</h2>
                <div className="mt-10">
                  {(Object.keys(categoryViews) as Array<keyof typeof categoryViews>).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`flex w-full items-center justify-between border-b border-border py-4 text-left type-heading transition-colors ${category === item ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {item} <ChevronRight className={`size-4 transition-transform ${category === item ? "translate-x-1" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid min-h-[28rem] place-items-center bg-secondary p-7 md:p-12">
                <div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-card">
                  <p className="type-caption text-muted-foreground">{category}</p>
                  <p className="mt-2 type-title">{selectedCategory.value}</p>
                  <p className="mt-1 type-caption text-muted-foreground">{selectedCategory.label}</p>
                  <div className="mt-8 space-y-4">
                    {selectedCategory.rows.map(([label, value], index) => (
                      <div key={label}>
                        <div className="flex justify-between type-caption"><span>{label}</span><span>{value}</span></div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                          <div className={`h-full bg-foreground transition-[width] duration-500 ${index === 0 ? "w-4/5" : index === 1 ? "w-3/5" : "w-2/5"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="05" reference="X product story">
            <div>
              <SplitTitle primary="Built to explain" secondary="Every dollar gets a job." />
              <div className="mt-10 grid border-y border-border lg:grid-cols-[1fr_14rem]">
                <div className="grid min-h-[30rem] place-items-center bg-secondary p-8">
                  <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-card">
                    <div className="flex items-center justify-between">
                      <p className="type-label">Monthly plan</p>
                      <p className="type-caption text-muted-foreground">August</p>
                    </div>
                    <div className="mt-10 grid grid-cols-3 gap-2">
                      {[["Fixed", "51%"], ["Flexible", "20%"], ["Future", "29%"]].map(([label, value], index) => (
                        <div key={label} className={`${index === 0 ? "bg-foreground text-background" : "bg-secondary"} rounded-lg p-4`}>
                          <p className="type-caption opacity-65">{label}</p>
                          <p className="mt-3 type-heading">{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-10 border-t border-border pt-5 type-caption text-muted-foreground">Based on six months of actual spending.</p>
                  </div>
                </div>
                <div className="divide-y divide-border lg:border-l lg:border-border">
                  {[[Landmark, "Any bank CSV"], [Sparkles, "Automatic categories"], [LockKeyhole, "Nothing sold"]].map(([Icon, label]) => {
                    const ItemIcon = Icon as typeof Landmark
                    return <div key={label as string} className="flex min-h-24 items-center gap-3 px-5 type-label"><ItemIcon className="size-4" />{label as string}</div>
                  })}
                </div>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="06" reference="X feature mosaic">
            <div>
              <SplitTitle primary="One upload" secondary="Everything your month can tell you." />
              <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
                <div className="min-h-72 bg-card p-6 md:p-8">
                  <p className="type-caption text-muted-foreground">01</p>
                  <div className="mt-14 flex justify-center">
                    <div className="w-full max-w-sm space-y-2">
                      {[["Rent", "$2,100"], ["Whole Foods", "$84.16"], ["Internet", "$65.00"]].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 type-caption">
                          <span>{label}</span><span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mt-10 type-label">Clean transactions</p>
                </div>
                <div className="min-h-72 bg-card p-6 md:p-8">
                  <p className="type-caption text-muted-foreground">02</p>
                  <div className="mt-14 flex h-28 items-end justify-center gap-2">
                    {[42, 70, 54, 92, 63, 78].map((height, index) => (
                      <div key={index} className="w-7 rounded-t bg-foreground/15" style={{ height: `${height}%` }}><div className="h-1/3 rounded-t bg-foreground" /></div>
                    ))}
                  </div>
                  <p className="mt-10 type-label">Month-to-month patterns</p>
                </div>
                <div className="min-h-60 bg-card p-6 md:col-span-2 md:p-8">
                  <p className="type-caption text-muted-foreground">03</p>
                  <div className="mt-10 grid items-end gap-8 md:grid-cols-[1fr_auto]">
                    <p className="max-w-[16ch] type-title">A budget grounded in what you actually do.</p>
                    <div className="grid grid-cols-3 gap-6 text-right">
                      {[["Income", "$6,200"], ["Spend", "$4,444"], ["Left", "$1,756"]].map(([label, value]) => (
                        <div key={label}><p className="type-caption text-muted-foreground">{label}</p><p className="mt-1 type-heading">{value}</p></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="07" reference="Mobbin prompt rail">
            <div className="text-center">
              <h2 className="type-display">Ask your month a better question.</h2>
              <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card text-left">
                <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                  <div className="border-b border-border p-5 md:border-b-0 md:border-r md:p-7">
                    <p className="type-caption text-muted-foreground">Try a question</p>
                    <div className="mt-5 space-y-2">
                      {prompts.map((prompt, index) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => setPromptIndex(index)}
                          className={`w-full rounded-lg border px-4 py-3 text-left type-body transition-colors ${promptIndex === index ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-border-strong"}`}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex min-h-72 flex-col justify-between p-7 md:p-10">
                    <Sparkles className="size-5" />
                    <div>
                      <p className="type-title">{selectedPrompt.metric}</p>
                      <p className="mt-2 type-body text-muted-foreground">{selectedPrompt.detail}</p>
                    </div>
                    <div className="flex items-center gap-2 type-caption text-muted-foreground"><Check className="size-3.5" />Based only on your uploaded file</div>
                  </div>
                </div>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="08" reference="Mobbin process map">
            <div>
              <h2 className="type-display">From raw rows to a useful plan.</h2>
              <div className="mt-10 rounded-xl border border-border p-5 md:p-8">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
                  {[
                    { icon: FileSpreadsheet, title: "Statement", detail: "148 raw rows" },
                    { icon: Sparkles, title: "Rules", detail: "Merchants recognized" },
                    { icon: BarChart3, title: "Budget", detail: "$2,184 left" },
                  ].map((item, index) => (
                    <div key={item.title} className="contents">
                      <button
                        type="button"
                        onClick={() => setMapStep(index)}
                        className={`min-h-44 rounded-lg border p-5 text-left transition-colors ${mapStep === index ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-border-strong"}`}
                      >
                        <item.icon className="size-5" />
                        <p className="mt-12 type-heading">{item.title}</p>
                        <p className={`mt-1 type-caption ${mapStep === index ? "text-background/60" : "text-muted-foreground"}`}>{item.detail}</p>
                      </button>
                      {index < 2 && <ArrowRight className="mx-auto hidden size-4 text-muted-foreground md:block" />}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <p className="type-caption text-muted-foreground">Step {mapStep + 1} of 3</p>
                  <Button variant="outline" size="sm" onClick={() => setMapStep((value) => (value + 1) % 3)}>
                    Next step <ArrowRight data-icon="inline-end" />
                  </Button>
                </div>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="09" reference="X trust field">
            <div>
              <SplitTitle primary="Built to stay private" secondary="Your financial life remains yours." />
              <div className="mt-10 grid min-h-[28rem] overflow-hidden rounded-xl border border-border md:grid-cols-[1.2fr_0.8fr]">
                <div className="relative grid place-items-center overflow-hidden bg-foreground text-background">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
                  <div className="relative grid size-40 place-items-center rounded-full border border-background/20">
                    <div className="grid size-24 place-items-center rounded-full border border-background/30 bg-background/10"><ShieldCheck className="size-9" /></div>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {[[LockKeyhole, "Encrypted processing"], [FolderOpen, "No bank login"], [ShieldCheck, "No data resale"]].map(([Icon, label]) => {
                    const ItemIcon = Icon as typeof LockKeyhole
                    return <div key={label as string} className="flex min-h-32 items-center gap-4 px-6 type-label"><ItemIcon className="size-4" />{label as string}</div>
                  })}
                </div>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="10" reference="Mobbin setup steps">
            <div>
              <h2 className="type-display">A useful budget in under a minute.</h2>
              <div className="mt-10 border-t border-border">
                {[
                  ["1", "Export", "Download a CSV from your bank."],
                  ["2", "Upload", "Drop the file into your workspace."],
                  ["3", "Review", "Confirm the handful of uncertain rows."],
                  ["4", "Plan", "Start with a budget based on real life."],
                ].map(([number, title, detail]) => (
                  <div key={number} className="grid gap-3 border-b border-border py-6 sm:grid-cols-[4rem_10rem_1fr] sm:items-baseline">
                    <span className="type-caption text-muted-foreground">{number}</span>
                    <span className="type-heading">{title}</span>
                    <span className="type-body text-muted-foreground">{detail}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <Button size="lg">Try your own CSV <Play data-icon="inline-end" /></Button>
                <Button variant="ghost" size="lg">See a sample budget</Button>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame index="11" reference="Quiet closing CTA" flush>
            <div className="flex min-h-[30rem] flex-col items-center justify-center px-6 py-16 text-center">
              <h2 className="max-w-[19ch] text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.04] tracking-[-0.045em]">
                Your money is already telling a story. Make it legible.
              </h2>
              <a href="/budgeting" className={`${buttonVariants({ size: "lg" })} mt-8`}>
                View the budgeting template <ArrowRight data-icon="inline-end" />
              </a>
            </div>
          </SectionFrame>
        </div>
      </main>
    </div>
  )
}
