import { useEffect, useState } from "react"
import Uppy from "@uppy/core"
import { UppyContextProvider } from "@uppy/react"
import { ArrowRight, Check, Download, FileSpreadsheet, LockKeyhole, Moon, Sun } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { UppyFileUpload } from "@/components/ui/file-upload"

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

function createLandingUppy() {
  const uppy = new Uppy({
    autoProceed: false,
    restrictions: {
      allowedFileTypes: [".csv", "text/csv", "application/vnd.ms-excel"],
      maxFileSize: 20 * 1024 * 1024,
      maxNumberOfFiles: 10,
      minNumberOfFiles: 1,
    },
  })

  uppy.addUploader(async (fileIds) => {
    await Promise.all(fileIds.map(async (fileId) => {
      const firstFile = uppy.getFiles().find((file) => file.id === fileId)
      if (!firstFile) return
      const total = firstFile.size ?? 100_000
      const started = Date.now()

      for (const percentage of [18, 46, 74, 100]) {
        await wait(150)
        const currentFile = uppy.getFiles().find((file) => file.id === fileId)
        if (!currentFile) return
        const progress = {
          ...currentFile.progress,
          uploadStarted: started,
          bytesUploaded: Math.round(total * percentage / 100),
          bytesTotal: total,
          percentage,
        }
        uppy.setFileState(fileId, { progress })
        uppy.emit("upload-progress", uppy.getFile(fileId), progress)
      }

      const uploading = uppy.getFiles().find((file) => file.id === fileId)
      if (!uploading) return
      uppy.setFileState(fileId, {
        progress: {
          ...uploading.progress,
          uploadStarted: started,
          percentage: 100,
          bytesUploaded: total,
          bytesTotal: total,
          uploadComplete: true,
          postprocess: { mode: "indeterminate", message: "Categorizing transactions" },
        },
      })
      await wait(420)

      const complete = uppy.getFiles().find((file) => file.id === fileId)
      if (!complete) return
      const response = { status: 200, body: {}, bytesUploaded: total }
      uppy.setFileState(fileId, {
        error: null,
        response,
        progress: {
          ...complete.progress,
          uploadStarted: started,
          percentage: 100,
          bytesUploaded: total,
          bytesTotal: total,
          uploadComplete: true,
          postprocess: undefined,
          complete: true,
        },
      })
      uppy.emit("upload-success", uppy.getFile(fileId), response)
    }))
  })

  return uppy
}

export function BankCsvLandingPage() {
  const [dark, setDark] = useState(false)
  const [uppy] = useState(createLandingUppy)

  useEffect(() => {
    document.title = "Bank CSV Categorizer — Your statement, already organized"
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute(
      "content",
      "Upload bank CSV files, organize transactions, and track a monthly budget without connecting your bank account."
    )
  }, [])

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme min-h-screen bg-background text-foreground`}>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="/bankcsv-landing" className="type-label">Bank CSV Categorizer</a>
          <nav className="hidden items-center gap-5 type-caption text-muted-foreground md:flex" aria-label="Primary navigation">
            <a href="#product" className="hover:text-foreground">Product</a>
            <a href="#privacy" className="hover:text-foreground">Privacy</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => setDark((value) => !value)} aria-label={dark ? "Use light theme" : "Use dark theme"}>
              {dark ? <Sun /> : <Moon />}
            </Button>
            <a href="#upload" className={buttonVariants({ size: "sm" })}>Upload a CSV</a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <h1 className="max-w-[13ch] text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.04] tracking-[-0.045em]">
              Upload a statement. Leave with a budget.
            </h1>
            <p className="mt-5 max-w-[48ch] type-body text-muted-foreground">
              Categorize transactions from every account and see the month in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <a href="#upload" className={buttonVariants({ size: "lg" })}>Upload a CSV <ArrowRight data-icon="inline-end" /></a>
              <a href="#product" className={buttonVariants({ variant: "outline", size: "lg" })}>View a sample month</a>
            </div>
            <div className="mt-9 grid grid-cols-3 gap-3 border-t border-border pt-3 type-caption text-muted-foreground">
              <span>No bank login</span>
              <span>No stored spending data</span>
              <span>Free</span>
            </div>
          </div>

          <div id="upload" className="scroll-mt-20">
            <UppyContextProvider uppy={uppy}>
              <UppyFileUpload variant="field" title="Drop bank statements" note="CSV · 10 max · 20 MB each" />
            </UppyContextProvider>
          </div>
        </section>

        <section id="product" className="scroll-mt-20 border-y border-border">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <h2 className="max-w-[12ch] type-display">Every account. One month.</h2>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-3 type-caption text-muted-foreground lg:grid-cols-1">
                <span>Multiple files</span>
                <span>One combined view</span>
                <span>Export anytime</span>
              </div>
            </div>
            <div className="grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[0.8fr_1.2fr]">
              <div className="border-b border-border bg-secondary/35 p-5 md:border-b-0 md:border-r md:p-7">
                <p className="type-caption text-muted-foreground">August files</p>
                <div className="mt-5 space-y-2">
                  {[
                    ["Chase checking.csv", "42 rows"],
                    ["Amex card.csv", "28 rows"],
                    ["SoFi savings.csv", "6 rows"],
                  ].map(([file, count]) => (
                    <div key={file} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-3">
                      <span className="inline-flex min-w-0 items-center gap-2 type-caption"><FileSpreadsheet className="size-3.5 shrink-0" /><span className="truncate">{file}</span></span>
                      <span className="shrink-0 type-caption text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 md:p-7">
                <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
                  <p className="type-heading">August</p>
                  <p className="type-caption text-muted-foreground">3 accounts · 76 rows</p>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ["Housing", "$2,100", "56%"],
                    ["Groceries", "$486", "31%"],
                    ["Dining", "$238", "18%"],
                    ["Transport", "$164", "12%"],
                  ].map(([category, amount, width]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between gap-4 type-caption"><span>{category}</span><span className="tabular-nums text-muted-foreground">{amount}</span></div>
                      <div className="mt-2 h-px bg-border"><div className="h-full bg-foreground" style={{ width }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/35">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <h2 className="max-w-[14ch] type-display">Automatic categories. Easy corrections.</h2>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-3 type-caption text-muted-foreground lg:grid-cols-1">
                <span>Review every row</span>
                <span>Edit any category</span>
                <span>CSV, Excel, or Sheets</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="grid grid-cols-[1fr_auto] items-center border-b border-border px-4 py-3 sm:grid-cols-[1fr_9rem_auto]">
                <span className="type-label">SQ *BLUE BOTTLE 0831</span>
                <span className="hidden type-caption text-muted-foreground sm:block">Uncategorized</span>
                <span className="type-label tabular-nums">−$6.25</span>
              </div>
              <div className="grid min-h-44 place-items-center border-b border-border bg-secondary/35 p-6">
                <div className="flex flex-wrap items-center justify-center gap-2 type-caption">
                  <span className="text-muted-foreground">Category</span>
                  {[
                    ["Dining", true], ["Groceries", false], ["Shopping", false], ["Transport", false],
                  ].map(([category, selected]) => (
                    <span key={String(category)} className={selected ? "rounded-full bg-foreground px-3 py-1.5 text-background" : "rounded-full border border-border bg-background px-3 py-1.5"}>
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="inline-flex items-center gap-2 type-caption"><Check className="size-3.5" />Ready to export</span>
                <span className="inline-flex items-center gap-2 type-caption text-muted-foreground"><Download className="size-3.5" />CSV · XLSX · Sheets</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <h2 className="max-w-[14ch] type-display">Your spending, ready to read.</h2>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-background/20 pt-3 type-caption text-background/55 lg:grid-cols-1">
                <span>Category totals</span>
                <span>Monthly comparison</span>
                <span>Recent transactions</span>
              </div>
            </div>
            <div className="rounded-lg border border-background/20 p-5 md:p-7">
              <div className="grid gap-6 border-b border-background/20 pb-6 sm:grid-cols-3">
                {[
                  ["Spent", "$3,241.80"], ["Income", "$4,820.00"], ["Net", "+$1,578.20"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="type-caption text-background/55">{label}</p>
                    <p className="mt-2 type-title tabular-nums">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 pt-6 sm:grid-cols-3">
                {[
                  ["Dining", "−18%", "from July"], ["Subscriptions", "+$27", "two new charges"], ["Cash flow", "+$612", "above average"],
                ].map(([label, value, note]) => (
                  <div key={label} className="border-t border-background pt-3">
                    <p className="type-caption text-background/55">{label}</p>
                    <p className="mt-5 type-title tabular-nums">{value}</p>
                    <p className="mt-1 type-caption text-background/55">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="privacy" className="scroll-mt-20 border-b border-border">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <LockKeyhole className="size-5" />
              <h2 className="mt-7 max-w-[14ch] type-display">See the whole month without connecting your bank.</h2>
            </div>
            <div className="grid border-t border-border sm:grid-cols-2 sm:border-l">
              {[
                "No bank login, Plaid, or OAuth access.",
                "Files are encrypted in transit.",
                "Spending data is not stored in our system.",
                "Export whenever you want.",
              ].map((item) => (
                <div key={item} className="border-b border-border py-5 sm:border-r sm:px-5">
                  <p className="max-w-[24ch] type-label">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-secondary/35">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <h2 className="max-w-[12ch] type-display">Early feedback.</h2>
              <p className="mt-5 type-caption text-muted-foreground">Public product feedback · not a verified customer testimonial</p>
            </div>
            <figure className="border-t border-foreground pt-6">
              <blockquote className="max-w-[34ch] type-title">“If it automatically categorizes stuff and gives visual feedback, that’s a huge win.”</blockquote>
              <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-3 type-caption text-muted-foreground">
                <span>Comment on the original product launch</span>
                <a href="https://www.reddit.com/r/SaaS/comments/1l1yd78/i_built_a_privacyfocused_budgeting_app_that/" className="text-foreground underline decoration-border-strong underline-offset-4">Read the source</a>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-b border-border">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <h2 className="max-w-[12ch] type-display">Start with one statement.</h2>
              <p className="mt-5 type-body text-muted-foreground">Upgrade only when you need more files.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 md:p-7">
              <div className="flex items-start justify-between gap-6 border-b border-border pb-7">
                <div>
                  <p className="type-heading">Free</p>
                  <p className="mt-2 type-caption text-muted-foreground">For a simple monthly check-in.</p>
                </div>
                <p className="type-display tabular-nums">$0</p>
              </div>
              <ul className="grid gap-3 py-7 type-label sm:grid-cols-2">
                <li className="inline-flex items-center gap-2"><Check className="size-3.5" />4 uploads every 30 days</li>
                <li className="inline-flex items-center gap-2"><Check className="size-3.5" />Up to 50 transactions per CSV</li>
                <li className="inline-flex items-center gap-2"><Check className="size-3.5" />Automatic categorization</li>
                <li className="inline-flex items-center gap-2"><Check className="size-3.5" />Export your results</li>
              </ul>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                <a href="#upload" className={buttonVariants()}>Start free</a>
                <a href="https://bankcsvcategorizer.com/pricing" className={buttonVariants({ variant: "ghost" })}>Compare current plans <ArrowRight data-icon="inline-end" /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-8 rounded-lg border border-border bg-secondary/35 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-9">
            <h2 className="max-w-[18ch] type-display">Upload a statement. See your month.</h2>
            <a href="#upload" className={buttonVariants({ size: "lg" })}>Upload a CSV <ArrowRight data-icon="inline-end" /></a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 type-caption md:flex-row md:items-center md:px-8">
          <a href="/bankcsv-landing" className="type-label">Bank CSV Categorizer</a>
          <nav className="flex flex-wrap gap-5 text-muted-foreground" aria-label="Footer navigation">
            <a href="#product" className="hover:text-foreground">Product</a>
            <a href="#privacy" className="hover:text-foreground">Privacy</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="/social-proof-studies" className="hover:text-foreground">Proof studies</a>
            <a href="/pricing-studies" className="hover:text-foreground">Pricing studies</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
