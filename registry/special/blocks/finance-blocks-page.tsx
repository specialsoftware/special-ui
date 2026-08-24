import { useEffect, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDollarSign,
  Landmark,
  LockKeyhole,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

const orbitBenefits = [
  {
    name: "Track",
    title: "Every account in one view.",
    metric: "$48,920",
    detail: "Across 6 accounts",
  },
  {
    name: "Budget",
    title: "Know what is safe to spend.",
    metric: "$1,578",
    detail: "Left this month",
  },
  {
    name: "Collaborate",
    title: "Plan together without losing privacy.",
    metric: "2 people",
    detail: "One shared plan",
  },
  {
    name: "Plan",
    title: "Give every goal a finish line.",
    metric: "Mar 2027",
    detail: "Japan fund on track",
  },
] as const

const categoryPills = [
  ["Groceries", "$486", "left-[6%] top-[18%]"],
  ["Rent", "$2,100", "right-[7%] top-[12%]"],
  ["Dining", "$238", "left-[12%] bottom-[18%]"],
  ["Travel", "$410", "right-[11%] bottom-[20%]"],
  ["Subscriptions", "$74", "left-[43%] top-[8%]"],
] as const

function SplitHeading({ primary, secondary, className = "" }: { primary: string; secondary: string; className?: string }) {
  return (
    <h2 className={`type-display ${className}`}>
      <span className="block">{primary}</span>
      <span className="block text-muted-foreground">{secondary}</span>
    </h2>
  )
}

function BlockFrame({
  number,
  use,
  primary,
  secondary,
  children,
}: {
  number: string
  use: string
  primary: string
  secondary: string
  children: ReactNode
}) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[10rem_1fr] lg:gap-12">
        <p className="type-caption text-muted-foreground">{number} · {use}</p>
        <div>
          <SplitHeading primary={primary} secondary={secondary} className="max-w-[20ch]" />
          <div className="mt-10 md:mt-14">{children}</div>
        </div>
      </div>
    </section>
  )
}

function FinanceBlocksPage() {
  const [dark, setDark] = useState(false)
  const [motionPhase, setMotionPhase] = useState(false)
  const [orbitIndex, setOrbitIndex] = useState(0)
  const [proofStep, setProofStep] = useState(0)
  const [cashFlowMonth, setCashFlowMonth] = useState<"July" | "August">("August")
  const [monthlyGoal, setMonthlyGoal] = useState(650)
  const [connectedCount, setConnectedCount] = useState(3)
  const [household, setHousehold] = useState(true)
  const [privacyStage, setPrivacyStage] = useState(0)
  const [yearly, setYearly] = useState(true)

  useEffect(() => {
    document.title = "Finance Blocks — Special UI"
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) return

    const ambientTimer = window.setInterval(() => setMotionPhase((value) => !value), 2200)
    const orbitTimer = window.setInterval(() => setOrbitIndex((value) => (value + 1) % orbitBenefits.length), 3600)
    const proofTimer = window.setInterval(() => setProofStep((value) => (value + 1) % 4), 1600)

    return () => {
      window.clearInterval(ambientTimer)
      window.clearInterval(orbitTimer)
      window.clearInterval(proofTimer)
    }
  }, [])

  const selectedOrbit = orbitBenefits[orbitIndex]
  const goalMonths = Math.ceil((12000 - 4200) / monthlyGoal)
  const accountTotal = connectedCount === 5 ? 73420 : 48920
  const cashFlow = cashFlowMonth === "August"
    ? { income: 6200, fixed: 3180, flexible: 1264, saved: 1756 }
    : { income: 6200, fixed: 3140, flexible: 1686, saved: 1374 }

  const privacyStages = ["Your device", "Encrypted transit", "Categorization", "Back to you"]

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme min-h-screen bg-background text-foreground`}>
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="/" className="inline-flex items-center gap-2 type-label">
            <ArrowLeft className="size-3.5" /> Special UI
          </a>
          <p className="hidden type-caption text-muted-foreground sm:block">Finance blocks · exploratory set</p>
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

      <main className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <section className="grid min-h-[36rem] items-end gap-12 py-16 md:py-24 lg:grid-cols-[10rem_1fr] lg:gap-12">
          <p className="self-start type-caption text-muted-foreground">Block studies for personal finance products.</p>
          <div>
            <h1 className="max-w-[14ch] text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.93] tracking-[-0.065em]">
              <span className="block">Nine product stories.</span>
              <span className="block text-muted-foreground">Built to make money feel clear.</span>
            </h1>
            <div className="mt-10 flex flex-wrap gap-2">
              <a href="#blocks" className={buttonVariants({ size: "lg" })}>Explore the blocks <ArrowRight data-icon="inline-end" /></a>
              <a href="/budgeting" className={buttonVariants({ variant: "outline", size: "lg" })}>Budgeting template</a>
            </div>
          </div>
        </section>

        <div id="blocks" className="scroll-mt-20">
          <BlockFrame
            number="01"
            use="Homepage hero"
            primary="Make organization feel immediate."
            secondary="Let the product data create the atmosphere."
          >
            <div className="relative min-h-[31rem] overflow-hidden rounded-lg border border-border bg-foreground text-background">
              {categoryPills.map(([label, value, position], index) => (
                <div
                  key={label}
                  className={`absolute ${position} rounded-full border border-background/20 bg-background/10 px-3 py-2 backdrop-blur-sm transition-transform duration-[1800ms] motion-reduce:transition-none ${
                    motionPhase
                      ? index % 2 === 0 ? "translate-x-3 -translate-y-2" : "-translate-x-2 translate-y-3"
                      : "translate-x-0 translate-y-0"
                  }`}
                >
                  <span className="type-caption">{label}</span>
                  <span className="ml-3 type-caption text-background/55">{value}</span>
                </div>
              ))}
              <div className="absolute inset-0 grid place-items-center px-6 text-center">
                <div>
                  <CircleDollarSign className="mx-auto size-8" />
                  <p className="mt-6 max-w-[15ch] type-display">Your money, already organized.</p>
                  <button type="button" className="mt-7 rounded-full bg-background px-4 py-2 type-label text-foreground">See your month</button>
                </div>
              </div>
            </div>
          </BlockFrame>

          <BlockFrame
            number="02"
            use="Feature overview"
            primary="One live product moment."
            secondary="Four benefits orbit around it."
          >
            <div className="grid gap-4 lg:grid-cols-[12rem_1fr_12rem] lg:items-center">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {orbitBenefits.slice(0, 2).map((benefit, index) => (
                  <button
                    key={benefit.name}
                    type="button"
                    onClick={() => setOrbitIndex(index)}
                    className={`rounded-md border px-4 py-4 text-left transition-colors ${orbitIndex === index ? "border-foreground bg-foreground text-background" : "border-border hover:border-border-strong"}`}
                  >
                    <span className="type-label">{benefit.name}</span>
                  </button>
                ))}
              </div>
              <div className="min-h-[25rem] rounded-lg border border-border bg-secondary/45 p-5 md:p-8">
                <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-border bg-card shadow-floating">
                  <div className="border-b border-border px-5 py-4">
                    <p className="type-caption text-muted-foreground">{selectedOrbit.name}</p>
                    <p className="mt-2 type-heading">{selectedOrbit.title}</p>
                  </div>
                  <div className="grid min-h-52 place-items-center p-6 text-center">
                    <div>
                      <p className="type-display tabular-nums">{selectedOrbit.metric}</p>
                      <p className="mt-2 type-caption text-muted-foreground">{selectedOrbit.detail}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 border-t border-border p-3">
                    {orbitBenefits.map((benefit, index) => (
                      <span key={benefit.name} className={`h-1 rounded-full ${index === orbitIndex ? "bg-foreground" : "bg-border"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {orbitBenefits.slice(2).map((benefit, offset) => {
                  const index = offset + 2
                  return (
                    <button
                      key={benefit.name}
                      type="button"
                      onClick={() => setOrbitIndex(index)}
                      className={`rounded-md border px-4 py-4 text-left transition-colors ${orbitIndex === index ? "border-foreground bg-foreground text-background" : "border-border hover:border-border-strong"}`}
                    >
                      <span className="type-label">{benefit.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </BlockFrame>

          <BlockFrame
            number="03"
            use="Automation proof"
            primary="Show the transaction changing."
            secondary="Do not describe the automation."
          >
            <div className="grid overflow-hidden rounded-lg border border-border lg:grid-cols-[1fr_13rem]">
              <div className="bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="type-label">August activity</span>
                  <span className="type-caption text-muted-foreground">Live demo</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border px-4 py-5 sm:grid-cols-[1fr_9rem_auto]">
                  <div>
                    <p className="type-label">SQ *Bar Primi</p>
                    <p className="mt-1 type-caption text-muted-foreground">Aug 18 · New York</p>
                  </div>
                  <span className={`hidden rounded-full border px-2 py-1 type-caption transition-all sm:inline-flex ${proofStep >= 1 ? "border-border-strong bg-secondary opacity-100" : "opacity-0"}`}>Dining</span>
                  <span className="type-label tabular-nums">−$74.20</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between type-caption">
                    <span>Dining budget</span><span className="tabular-nums">$238 / $400</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-foreground transition-[width] duration-700" style={{ width: proofStep >= 2 ? "59.5%" : "41%" }} />
                  </div>
                  <p className={`mt-4 type-caption text-muted-foreground transition-opacity ${proofStep >= 3 ? "opacity-100" : "opacity-0"}`}>$162 remains for the rest of August.</p>
                </div>
              </div>
              <div className="grid content-end gap-4 border-t border-border bg-secondary/45 p-5 lg:border-l lg:border-t-0">
                {["Category resolved", "Budget updated", "$162 still available"].map((benefit, index) => (
                  <span key={benefit} className={`border-t pt-3 type-caption transition-colors ${proofStep > index ? "border-foreground text-foreground" : "border-border text-muted-foreground"}`}>{benefit}</span>
                ))}
                <Button variant="outline" size="sm" onClick={() => setProofStep(0)}><RotateCcw /> Replay</Button>
              </div>
            </div>
          </BlockFrame>

          <BlockFrame
            number="04"
            use="Dashboard story"
            primary="Explain cash flow in one glance."
            secondary="Income in. Decisions out."
          >
            <div className="rounded-lg border border-border p-5 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="type-heading">Where the month went</p>
                  <p className="mt-1 type-caption text-muted-foreground">{cashFlowMonth} cash flow</p>
                </div>
                <div className="flex rounded-full border border-border p-1 type-caption">
                  {(["July", "August"] as const).map((month) => (
                    <button key={month} type="button" onClick={() => setCashFlowMonth(month)} className={`rounded-full px-3 py-1.5 ${cashFlowMonth === month ? "bg-foreground text-background" : "text-muted-foreground"}`}>{month}</button>
                  ))}
                </div>
              </div>
              <div className="mt-10 grid gap-7 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <p className="type-caption text-muted-foreground">Income</p>
                  <p className="mt-2 text-[2.75rem] font-medium leading-none tracking-[-0.04em] tabular-nums">${cashFlow.income.toLocaleString()}</p>
                  <p className="mt-5 type-body text-muted-foreground">You kept {Math.round((cashFlow.saved / cashFlow.income) * 100)}% of what came in.</p>
                </div>
                <div className="space-y-5">
                  {[
                    ["Fixed", cashFlow.fixed, "bg-foreground"],
                    ["Flexible", cashFlow.flexible, "bg-muted-foreground"],
                    ["Saved", cashFlow.saved, "bg-border-strong"],
                  ].map(([label, value, color]) => (
                    <div key={label as string}>
                      <div className="flex items-center justify-between type-caption"><span>{label}</span><span className="tabular-nums">${Number(value).toLocaleString()}</span></div>
                      <div className="mt-2 h-8 overflow-hidden rounded-sm bg-secondary"><div className={`h-full ${color}`} style={{ width: `${(Number(value) / cashFlow.income) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BlockFrame>

          <BlockFrame
            number="05"
            use="Goal conversion"
            primary="Make the future adjustable."
            secondary="Turn a slider into a finish line."
          >
            <div className="grid overflow-hidden rounded-lg border border-border md:grid-cols-[1fr_17rem]">
              <div className="p-5 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="type-heading">Japan trip</p><p className="mt-1 type-caption text-muted-foreground">$4,200 of $12,000 saved</p></div>
                  <span className="rounded-full border border-border px-3 py-1.5 type-caption">35% funded</span>
                </div>
                <div className="mt-12">
                  <label htmlFor="goal-contribution" className="flex items-end justify-between gap-4">
                    <span className="type-label">Monthly contribution</span>
                    <span className="type-title tabular-nums">${monthlyGoal}</span>
                  </label>
                  <input
                    id="goal-contribution"
                    type="range"
                    min="200"
                    max="1500"
                    step="50"
                    value={monthlyGoal}
                    onChange={(event) => setMonthlyGoal(Number(event.target.value))}
                    className="mt-5 w-full accent-foreground"
                  />
                  <div className="mt-2 flex justify-between type-caption text-muted-foreground"><span>$200</span><span>$1,500</span></div>
                </div>
              </div>
              <div className="grid place-items-center border-t border-border bg-foreground p-6 text-center text-background md:border-l md:border-t-0">
                <div><p className="type-caption text-background/60">Goal reached in</p><p className="mt-3 type-display tabular-nums">{goalMonths} months</p><p className="mt-3 type-caption">Move the slider. Move the date.</p></div>
              </div>
            </div>
          </BlockFrame>

          <BlockFrame
            number="06"
            use="Integration proof"
            primary="Bring every account into focus."
            secondary="Make connectivity visible."
          >
            <div className="relative min-h-[29rem] overflow-hidden rounded-lg border border-border bg-secondary/45">
              <div className="absolute inset-0 grid place-items-center">
                <div className="z-10 rounded-lg border border-border bg-card px-8 py-7 text-center shadow-floating">
                  <Landmark className="mx-auto size-5" />
                  <p className="mt-4 type-display tabular-nums">${accountTotal.toLocaleString()}</p>
                  <p className="mt-2 type-caption text-muted-foreground">Across {connectedCount} connected accounts</p>
                  <Button size="sm" variant="outline" className="mt-5" onClick={() => setConnectedCount((value) => value === 3 ? 5 : 3)}>{connectedCount === 3 ? "Connect two more" : "Show core accounts"}</Button>
                </div>
              </div>
              {[
                ["Chase", "left-[8%] top-[18%]"], ["Amex", "right-[10%] top-[17%]"], ["SoFi", "left-[13%] bottom-[18%]"], ["Schwab", "right-[13%] bottom-[18%]"], ["Apple Card", "left-[43%] top-[7%]"],
              ].map(([name, position], index) => (
                <div key={name} className={`absolute ${position} rounded-full border border-border bg-card px-3 py-2 type-caption shadow-card transition-all ${index < connectedCount ? "scale-100 opacity-100" : "scale-90 opacity-20"}`}>{name}</div>
              ))}
            </div>
          </BlockFrame>

          <BlockFrame
            number="07"
            use="Collaboration feature"
            primary="Plan together."
            secondary="Keep personal spending personal."
          >
            <div className="rounded-lg border border-border p-5 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-foreground text-background"><Users className="size-4" /></span><div><p className="type-label">The Parkers</p><p className="type-caption text-muted-foreground">Two members</p></div></div>
                <div className="flex rounded-full border border-border p-1 type-caption">
                  <button type="button" onClick={() => setHousehold(false)} className={`rounded-full px-3 py-1.5 ${!household ? "bg-foreground text-background" : "text-muted-foreground"}`}>My view</button>
                  <button type="button" onClick={() => setHousehold(true)} className={`rounded-full px-3 py-1.5 ${household ? "bg-foreground text-background" : "text-muted-foreground"}`}>Household</button>
                </div>
              </div>
              <div className="mt-9 grid gap-3 sm:grid-cols-3">
                {[
                  ["Shared checking", "$6,240", true], ["Home budget", "$1,180 left", true], ["Personal card", "$842", false],
                ].map(([name, value, shared]) => (
                  <div key={name as string} className={`rounded-md border border-border p-4 transition-opacity ${household || shared ? "opacity-100" : "opacity-35"}`}>
                    <div className="flex items-center justify-between"><span className="type-caption text-muted-foreground">{name}</span>{shared ? <Users className="size-3.5 text-muted-foreground" /> : <LockKeyhole className="size-3.5 text-muted-foreground" />}</div>
                    <p className="mt-7 type-title tabular-nums">{value}</p>
                    <p className="mt-2 type-caption text-muted-foreground">{shared ? "Visible to both" : "Only visible to you"}</p>
                  </div>
                ))}
              </div>
            </div>
          </BlockFrame>

          <BlockFrame
            number="08"
            use="Trust block"
            primary="Show exactly where the data goes."
            secondary="Make privacy a product demonstration."
          >
            <div className="grid overflow-hidden rounded-lg border border-border lg:grid-cols-[1fr_14rem]">
              <div className="p-5 md:p-8">
                <div className="grid gap-3 sm:grid-cols-4">
                  {privacyStages.map((stage, index) => (
                    <div key={stage} className={`rounded-md border p-4 transition-colors ${privacyStage === index ? "border-foreground bg-foreground text-background" : "border-border"}`}>
                      <span className="grid size-6 place-items-center rounded-full border border-current type-caption">{index + 1}</span>
                      <p className="mt-8 type-label">{stage}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 h-1 overflow-hidden rounded-full bg-border"><div className="h-full bg-foreground transition-[width] duration-500" style={{ width: `${((privacyStage + 1) / privacyStages.length) * 100}%` }} /></div>
              </div>
              <div className="grid content-between gap-8 border-t border-border bg-secondary/45 p-5 lg:border-l lg:border-t-0">
                <div><ShieldCheck className="size-5" /><p className="mt-4 type-label">Nothing is retained after processing.</p></div>
                <Button size="sm" onClick={() => setPrivacyStage((value) => (value + 1) % privacyStages.length)}>Advance the file <ArrowRight /></Button>
              </div>
            </div>
          </BlockFrame>

          <BlockFrame
            number="09"
            use="Pricing conversion"
            primary="Let people try the product first."
            secondary="Put the price beside the proof."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-foreground p-6 text-background md:p-8">
                <Sparkles className="size-5" />
                <h3 className="mt-8 max-w-[14ch] type-title">Explore a complete month with demo data.</h3>
                <div className="mt-10 overflow-hidden rounded-md border border-background/20 bg-background/10">
                  {["Income", "Housing", "Food", "Saved"].map((label, index) => (
                    <div key={label} className="flex items-center justify-between border-b border-background/15 px-4 py-3 last:border-b-0 type-caption"><span>{label}</span><span className="tabular-nums text-background/60">{["$6,200", "$2,100", "$724", "$1,756"][index]}</span></div>
                  ))}
                </div>
                <button type="button" className="mt-6 rounded-full bg-background px-4 py-2 type-label text-foreground">Open the demo</button>
              </div>
              <div className="rounded-lg border border-border p-6 md:p-8">
                <div className="flex items-center justify-between gap-4"><p className="type-heading">Simple pricing</p><div className="flex rounded-full border border-border p-1 type-caption"><button type="button" onClick={() => setYearly(true)} className={`rounded-full px-3 py-1.5 ${yearly ? "bg-foreground text-background" : "text-muted-foreground"}`}>Yearly</button><button type="button" onClick={() => setYearly(false)} className={`rounded-full px-3 py-1.5 ${!yearly ? "bg-foreground text-background" : "text-muted-foreground"}`}>Monthly</button></div></div>
                <p className="mt-12 text-[3.5rem] font-medium leading-none tracking-[-0.05em] tabular-nums">${yearly ? "8.25" : "13"}<span className="ml-1 type-body text-muted-foreground">/ month</span></p>
                <p className="mt-3 type-caption text-muted-foreground">{yearly ? "$99 billed annually · save $57" : "Billed monthly · cancel anytime"}</p>
                <div className="mt-8 space-y-3 border-t border-border pt-5">
                  {["Thirty-day free trial", "No ads or data sales", "Cancel in one click"].map((benefit) => <p key={benefit} className="flex items-center gap-2 type-caption"><Check className="size-3.5" />{benefit}</p>)}
                </div>
                <a href="#" className={`${buttonVariants({ size: "lg" })} mt-8 w-full`}>Start free <ArrowRight data-icon="inline-end" /></a>
              </div>
            </div>
          </BlockFrame>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 sm:flex-row sm:items-center md:px-8">
          <p className="type-label">Special UI · Finance Blocks</p>
          <a href="/budgeting" className="inline-flex items-center gap-1 type-caption text-muted-foreground hover:text-foreground">View the budgeting template <ArrowRight className="size-3.5" /></a>
        </div>
      </footer>
    </div>
  )
}

export { FinanceBlocksPage }
