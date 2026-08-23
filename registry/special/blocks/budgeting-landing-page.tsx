import { useEffect, useState } from "react"
import { ArrowRight, FileSpreadsheet, LockKeyhole, Moon, RotateCcw, Sun } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

const transactions = [
  { merchant: "Whole Foods Market", amount: "−$84.20", category: "Groceries" },
  { merchant: "A24 Films", amount: "−$19.99", category: "Entertainment" },
  { merchant: "Metropolitan Transit", amount: "−$34.00", category: "Transport" },
  { merchant: "Salary deposit", amount: "+$4,820.00", category: "Income" },
] as const

const categories = [
  { name: "Housing", spent: 2100, budget: 2400 },
  { name: "Groceries", spent: 486, budget: 600 },
  { name: "Dining", spent: 238, budget: 400 },
  { name: "Transport", spent: 164, budget: 300 },
] as const

const categoryDetails = {
  Housing: ["Rent — 55 Bowery", "Lemonade insurance"],
  Groceries: ["Whole Foods Market", "Trader Joe’s", "Farmers market"],
  Dining: ["Blue Bottle Coffee", "Sweetgreen", "Bar Primi"],
  Transport: ["Metropolitan Transit", "Citi Bike", "Uber"],
} as const

function BudgetingLandingPage() {
  const [dark, setDark] = useState(false)
  const [organized, setOrganized] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryDetails>("Dining")

  useEffect(() => {
    document.title = "Bank CSV — A clear budget from any bank statement"
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    description?.setAttribute(
      "content",
      "Turn bank CSV exports into a private, organized budget without connecting your bank account."
    )

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(() => setOrganized(true), reducedMotion ? 0 : 900)
    return () => window.clearTimeout(timer)
  }, [])

  function replayDemo() {
    setOrganized(false)
    window.setTimeout(() => setOrganized(true), 500)
  }

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme min-h-screen bg-background text-foreground`}>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="/budgeting" className="flex items-center gap-2.5 type-label">
            <span className="grid size-5 grid-cols-2 gap-px rounded-sm bg-foreground p-1" aria-hidden="true">
              <span className="bg-background" />
              <span className="bg-background" />
              <span className="col-span-2 bg-background" />
            </span>
            Bank CSV
          </a>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            <a href="#product" className="rounded-full px-3 py-2 type-label hover:bg-secondary">Product</a>
            <a href="#privacy" className="rounded-full px-3 py-2 type-label hover:bg-secondary">Privacy</a>
            <a href="#questions" className="rounded-full px-3 py-2 type-label hover:bg-secondary">Questions</a>
          </nav>
          <div className="flex items-center gap-1.5">
            <a href="#" className="hidden rounded-full px-3 py-2 type-label hover:bg-secondary sm:block">Sign in</a>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDark((value) => !value)}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
            >
              {dark ? <Sun /> : <Moon />}
            </Button>
            <a href="#upload" className={buttonVariants({ size: "sm" })}>Try it free</a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
            <h1 className="max-w-[12ch] text-[clamp(2.75rem,5.5vw,4.75rem)] font-medium leading-[0.96] tracking-[-0.06em]">
              <span className="block">Turn any bank CSV</span>
              <span className="block text-muted-foreground">into a clear monthly budget.</span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-2">
              <a href="#upload" className={buttonVariants({ size: "lg" })}>
                Categorize a CSV <ArrowRight data-icon="inline-end" />
              </a>
              <a href="#product" className={buttonVariants({ variant: "outline", size: "lg" })}>
                See how it works
              </a>
            </div>
          </div>

          <div id="upload" className="scroll-mt-24">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_9.5rem] xl:items-end">
              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-floating">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-md border border-border bg-secondary">
                    <FileSpreadsheet className="size-4" />
                  </span>
                  <div>
                    <p className="type-label">checking—august.csv</p>
                    <p className="type-caption text-muted-foreground">42 transactions · 18 KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={replayDemo} aria-label="Replay categorization">
                  <RotateCcw />
                </Button>
              </div>

              <div className="flex items-center justify-between border-b border-border bg-secondary/55 px-4 py-2.5">
                <p className="type-caption text-muted-foreground">
                  {organized ? "42 of 42 transactions organized" : "Reading descriptions…"}
                </p>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full bg-foreground transition-[width] duration-700 ease-special ${organized ? "w-full" : "w-1/4"}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] border-b border-border px-4 py-2 type-caption text-subtle-foreground sm:grid-cols-[1fr_9rem_auto]">
                <span>Description</span>
                <span className="hidden sm:block">Category</span>
                <span>Amount</span>
              </div>
              <div>
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction.merchant}
                    className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-4 border-b border-border px-4 last:border-b-0 sm:grid-cols-[1fr_9rem_auto]"
                  >
                    <p className="type-body">{transaction.merchant}</p>
                    <div className="hidden sm:block">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 type-caption transition-all duration-500 ${
                          organized
                            ? "translate-y-0 border-border-strong bg-secondary text-foreground opacity-100"
                            : "translate-y-1 border-transparent text-transparent opacity-0"
                        }`}
                        style={{ transitionDelay: organized ? `${index * 90}ms` : "0ms" }}
                      >
                        {transaction.category}
                      </span>
                    </div>
                    <p className="type-label tabular-nums">{transaction.amount}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border bg-secondary/35 px-4 py-3">
                <p className="type-caption text-muted-foreground">
                  {organized ? "Ready to review" : "Organizing your month"}
                </p>
                <button
                  type="button"
                  onClick={() => setOrganized((value) => !value)}
                  className="type-label underline decoration-border-strong underline-offset-4 hover:decoration-foreground"
                >
                  {organized ? "Show raw file" : "Show result"}
                </button>
              </div>
              </div>
              <div className="grid grid-cols-3 gap-3 xl:block">
                {["Under 2 minutes", "Every bank CSV", "No account connection"].map((benefit) => (
                  <span key={benefit} className="border-t border-foreground py-3 type-caption xl:block xl:py-4">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="border-y border-border">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-9 gap-y-3 px-5 py-5 type-caption text-muted-foreground md:px-8">
            <span>Chase</span><span>Capital One</span><span>American Express</span><span>Wells Fargo</span><span>Citi</span><span>Schwab</span><span>SoFi</span><span>Any CSV export</span>
          </div>
        </div>

        <section id="product" className="scroll-mt-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <div>
                <h2 className="max-w-[15ch] type-display">
                  <span className="block">From export to budget.</span>
                  <span className="block text-muted-foreground">In under two minutes.</span>
                </h2>
              </div>
              <ol className="grid border-t border-border sm:grid-cols-3 sm:border-l">
                {[
                  ["1", "Export a CSV from any bank or card."],
                  ["2", "Drop in one file or combine several."],
                  ["3", "Review a clean budget and export it anywhere."],
                ].map(([number, title]) => (
                  <li key={number} className="border-b border-border py-5 sm:border-r sm:px-5">
                    <p className="type-caption text-subtle-foreground">{number}</p>
                    <h3 className="mt-8 max-w-[16ch] type-heading">{title}</h3>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-16 overflow-hidden rounded-lg border border-border bg-card shadow-card md:mt-20">
              <div className="flex flex-col justify-between gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-center md:px-6">
                <div>
                  <p className="type-heading">August overview</p>
                  <p className="mt-1 type-caption text-muted-foreground">Checking + credit card · 42 transactions</p>
                </div>
                <div className="flex gap-1 rounded-full border border-border p-1 type-caption">
                  <button type="button" className="rounded-full bg-foreground px-3 py-1.5 text-background">Spending</button>
                  <button type="button" className="rounded-full px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">Cash flow</button>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_19rem]">
                <div className="p-4 md:p-6 lg:border-r lg:border-border">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="border-b border-border pb-4 sm:border-b-0 sm:border-r sm:pr-4">
                      <p className="type-caption text-muted-foreground">Spent this month</p>
                      <p className="mt-2 type-title tabular-nums">$3,241.80</p>
                    </div>
                    <div className="border-b border-border pb-4 sm:border-b-0 sm:border-r sm:px-4">
                      <p className="type-caption text-muted-foreground">Left to budget</p>
                      <p className="mt-2 type-title tabular-nums">$1,578.20</p>
                    </div>
                    <div className="pb-2 sm:pl-4">
                      <p className="type-caption text-muted-foreground">Compared with July</p>
                      <p className="mt-2 type-title tabular-nums">−8.4%</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="mb-3 grid grid-cols-[1fr_5rem_4rem] type-caption text-subtle-foreground">
                      <span>Category</span><span>Spent</span><span className="text-right">Budget</span>
                    </div>
                    {categories.map((category) => {
                      const active = selectedCategory === category.name
                      const progress = Math.min(100, Math.round((category.spent / category.budget) * 100))
                      return (
                        <button
                          key={category.name}
                          type="button"
                          onClick={() => setSelectedCategory(category.name)}
                          className={`grid w-full grid-cols-[1fr_5rem_4rem] items-center border-t border-border py-4 text-left transition-[background-color,padding] duration-fast ${active ? "bg-secondary/65 px-3" : "hover:bg-secondary/40 hover:px-3"}`}
                        >
                          <span className="pr-5">
                            <span className="type-label">{category.name}</span>
                            <span className="mt-2 block h-1 max-w-72 overflow-hidden rounded-full bg-border">
                              <span className="block h-full rounded-full bg-foreground" style={{ width: `${progress}%` }} />
                            </span>
                          </span>
                          <span className="type-label tabular-nums">${category.spent}</span>
                          <span className="text-right type-caption tabular-nums text-muted-foreground">${category.budget}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <aside className="border-t border-border bg-secondary/35 p-5 md:p-6 lg:border-t-0">
                  <p className="type-caption text-muted-foreground">Selected category</p>
                  <h3 className="mt-2 type-heading">{selectedCategory}</h3>
                  <p className="mt-3 type-body text-muted-foreground">
                    {selectedCategory === "Dining"
                      ? "You spent $52 less than last month and still have $162 available."
                      : `${categoryDetails[selectedCategory].length} merchants make up this category.`}
                  </p>
                  <div className="mt-6 border-t border-border">
                    {categoryDetails[selectedCategory].map((merchant, index) => (
                      <div key={merchant} className="flex items-center justify-between gap-4 border-b border-border py-3">
                        <span className="type-caption">{merchant}</span>
                        <span className="type-caption tabular-nums text-muted-foreground">
                          {index === 0 ? "$84.20" : index === 1 ? "$31.40" : "$18.00"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="mt-5 inline-flex items-center gap-1 type-label underline decoration-border-strong underline-offset-4 hover:decoration-foreground">
                    Review all transactions <ArrowRight className="size-3.5" />
                  </button>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/35">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
            <h2 className="max-w-[19ch] type-display">
              <span className="block">Categorize, combine, and understand.</span>
              <span className="block text-muted-foreground">Without the spreadsheet work.</span>
            </h2>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              <article className="rounded-lg border border-border bg-card p-5 lg:col-span-2 md:p-7">
                <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="max-w-[24ch] type-heading">Correct a merchant once. Every future upload remembers.</h3>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1.5 type-caption">Always in your control</span>
                </div>
                <div className="mt-10 overflow-hidden rounded-md border border-border">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border bg-secondary/55 px-4 py-3 sm:grid-cols-[1fr_8rem_auto]">
                    <span className="type-label">WHOLEFDS NY 10442</span>
                    <span className="hidden type-caption text-muted-foreground sm:block">Uncategorized</span>
                    <span className="type-caption">−$84.20</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 px-4 py-4 type-caption">
                    <span className="text-muted-foreground">When description contains</span>
                    <span className="rounded-full border border-border-strong bg-secondary px-2.5 py-1">WHOLEFDS</span>
                    <span className="text-muted-foreground">categorize as</span>
                    <span className="rounded-full bg-foreground px-2.5 py-1 text-background">Groceries</span>
                  </div>
                </div>
              </article>

              <article className="rounded-lg border border-border bg-card p-5 md:p-7">
                <h3 className="max-w-[18ch] type-heading">Combine every bank and account in one month.</h3>
                <div className="mt-10 space-y-2">
                  {["Chase checking.csv", "Amex card.csv", "SoFi savings.csv"].map((file, index) => (
                    <div key={file} className="flex items-center justify-between rounded-md border border-border px-3 py-3">
                      <span className="inline-flex items-center gap-2 type-caption"><FileSpreadsheet className="size-3.5" />{file}</span>
                      <span className="type-caption text-muted-foreground">{[42, 28, 6][index]} rows</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-lg border border-border bg-card p-5 md:p-7">
                <h3 className="max-w-[18ch] type-heading">Export clean data to CSV, Excel, or Sheets.</h3>
                <div className="mt-10 grid grid-cols-3 gap-2 type-caption">
                  {["CSV", "XLSX", "Sheets"].map((format) => (
                    <div key={format} className="grid aspect-square place-items-center rounded-md border border-border bg-secondary/45">{format}</div>
                  ))}
                </div>
              </article>

              <article className="rounded-lg border border-border bg-card p-5 lg:col-span-2 md:p-7">
                <h3 className="max-w-[22ch] type-heading">See what changed without reading another chart.</h3>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Subscriptions", "+$27", "Two new recurring charges"],
                    ["Dining", "−18%", "Lower than your 3-month average"],
                    ["Cash flow", "+$612", "More in than out this month"],
                  ].map(([title, value, detail]) => (
                    <div key={title} className="border-t border-foreground pt-3">
                      <p className="type-caption text-muted-foreground">{title}</p>
                      <p className="mt-5 type-title tabular-nums">{value}</p>
                      <p className="mt-2 type-caption text-muted-foreground">{detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="privacy" className="scroll-mt-20 bg-foreground text-background">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <LockKeyhole className="size-6" />
              <h2 className="mt-8 max-w-[12ch] type-display">
                <span className="block">No bank login.</span>
                <span className="block text-background/55">No stored statements.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2">
              {[
                "No credentials, Plaid connection, or OAuth permission.",
                "Statements disappear after processing.",
                "Files stay encrypted in transit.",
                "Export anytime. Nothing is locked in.",
              ].map((title, index) => (
                <div key={title} className={`border-background/20 py-6 sm:p-6 ${index < 2 ? "border-b" : ""} ${index % 2 === 0 ? "sm:border-r" : ""}`}>
                  <h3 className="type-label">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="questions" className="scroll-mt-20 border-b border-border">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <h2 className="max-w-[14ch] type-display">
                <span className="block">Everything to know</span>
                <span className="block text-muted-foreground">before uploading a statement.</span>
              </h2>
            </div>
            <div className="border-t border-border">
              {[
                ["Do I need to connect my bank?", "No. Download a CSV from your bank and upload that file. Bank CSV never asks for login credentials or ongoing account access."],
                ["Which banks are supported?", "Any bank that can export transactions as a CSV should work, including Chase, Citi, Capital One, Amex, Wells Fargo, Schwab, SoFi, and many others."],
                ["Is this a replacement for YNAB or another budgeting app?", "It can be a lightweight standalone budget, or a faster way to clean and categorize data before moving it into your preferred spreadsheet or budgeting system."],
                ["Can I combine multiple accounts?", "Yes. Upload multiple CSVs from checking, savings, and credit-card accounts to see the month together."],
                ["What happens to my file?", "The file is encrypted in transit, processed for categorization, and returned to your browser. The source statement and transaction history are not saved."],
              ].map(([question, answer], index) => (
                <details key={question} className="group border-b border-border" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 type-label marker:hidden">
                    {question}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pb-5 pr-10 type-body text-muted-foreground">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-10 rounded-lg border border-border bg-secondary/45 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-10">
            <div>
              <h2 className="max-w-[18ch] type-display">
                <span className="block">Your next statement is already a budget.</span>
                <span className="block text-muted-foreground">See it without connecting your bank.</span>
              </h2>
            </div>
            <a href="#upload" className={buttonVariants({ size: "lg" })}>
              Try your first file <ArrowRight data-icon="inline-end" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-[1fr_auto] md:items-end md:px-8">
          <div>
            <a href="/budgeting" className="type-label">Bank CSV</a>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 type-caption text-muted-foreground" aria-label="Footer navigation">
            <a href="#product" className="hover:text-foreground">Product</a>
            <a href="#privacy" className="hover:text-foreground">Privacy</a>
            <a href="#questions" className="hover:text-foreground">Questions</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export { BudgetingLandingPage }
