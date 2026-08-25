import { useEffect, useState, type ReactNode } from "react"
import Uppy from "@uppy/core"
import { UppyContextProvider } from "@uppy/react"
import { ArrowLeft, Check, Moon, RotateCcw, Sun, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UppyFileUpload, type FileUploadVariant } from "@/components/ui/file-upload"

const sampleFiles = [
  ["august-checking.csv", 46_000],
  ["august-credit-card.csv", 72_000],
  ["august-savings.csv", 31_000],
] as const

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

function createDemoFile(name: string, bytes: number) {
  const heading = "date,merchant,amount,account\n"
  const row = "2026-08-21,Corner Market,-84.16,Checking\n"
  const content = `${heading}${row.repeat(Math.ceil(bytes / row.length))}`.slice(0, bytes)
  return new File([content], name, { type: "text/csv" })
}

function addSamples(uppy: Uppy) {
  uppy.cancelAll()
  uppy.clear()
  sampleFiles.forEach(([name, bytes]) => {
    uppy.addFile({ name, type: "text/csv", data: createDemoFile(name, bytes), source: "demo" })
  })
}

function createDemoUppy(id: string, failOnce: boolean) {
  const attempts = new Map<string, number>()
  const uppy = new Uppy({
    id,
    autoProceed: false,
    allowMultipleUploadBatches: true,
    restrictions: {
      allowedFileTypes: [".csv", "text/csv"],
      maxFileSize: 20 * 1024 * 1024,
      maxNumberOfFiles: 10,
    },
  })

  uppy.addUploader(async (fileIds) => {
    await Promise.all(fileIds.map(async (fileId, index) => {
      const firstFile = uppy.getFiles().find((file) => file.id === fileId)
      if (!firstFile) return

      const attempt = (attempts.get(fileId) ?? 0) + 1
      attempts.set(fileId, attempt)
      const total = firstFile.size ?? 100_000
      const started = Date.now()

      for (const percentage of [8, 24, 47, 71, 92, 100]) {
        await wait(160 + index * 45)
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

        if (failOnce && index === 1 && attempt === 1 && percentage === 47) {
          const error = new Error("Connection interrupted. Retry this file.")
          uppy.setFileState(fileId, { error: error.message })
          uppy.emit("upload-error", uppy.getFile(fileId), error)
          return
        }
      }

      const uploadedFile = uppy.getFiles().find((file) => file.id === fileId)
      if (!uploadedFile) return

      uppy.setFileState(fileId, {
        progress: {
          ...uploadedFile.progress,
          uploadStarted: started,
          bytesUploaded: total,
          bytesTotal: total,
          percentage: 100,
          uploadComplete: true,
          postprocess: { mode: "indeterminate", message: "Categorizing transactions" },
        },
      })

      await wait(420)
      const processedFile = uppy.getFiles().find((file) => file.id === fileId)
      if (!processedFile) return

      const response = { status: 200, body: {}, bytesUploaded: total }
      uppy.setFileState(fileId, {
        error: null,
        response,
        progress: {
          ...processedFile.progress,
          uploadStarted: started,
          bytesUploaded: total,
          bytesTotal: total,
          percentage: 100,
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

function Study({
  number,
  title,
  principle,
  children,
}: {
  number: string
  title: string
  principle: string
  children: ReactNode
}) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[9rem_1fr] lg:gap-10">
        <p className="type-caption text-muted-foreground">{number}</p>
        <div>
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <h2 className="type-title">{title}</h2>
            <p className="max-w-md type-caption text-muted-foreground md:text-right">{principle}</p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  )
}

function UploadStudy({
  id,
  variant,
  initialFiles = false,
  autoStart = false,
  failOnce = false,
}: {
  id: string
  variant: FileUploadVariant
  initialFiles?: boolean
  autoStart?: boolean
  failOnce?: boolean
}) {
  const [uppy] = useState(() => createDemoUppy(id, failOnce))

  useEffect(() => {
    if (initialFiles) addSamples(uppy)
    const timer = autoStart ? window.setTimeout(() => void uppy.upload(), 450) : undefined

    return () => {
      if (timer) window.clearTimeout(timer)
    }
  }, [autoStart, initialFiles, uppy])

  const reset = () => {
    uppy.cancelAll()
    uppy.clear()
  }

  return (
    <UppyContextProvider uppy={uppy}>
      <div>
        <div className="mb-3 flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => addSamples(uppy)}>
            <Upload data-icon="inline-start" /> Load sample files
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={reset} aria-label="Reset upload demo">
            <RotateCcw />
          </Button>
        </div>
        <UppyFileUpload variant={variant} />
      </div>
    </UppyContextProvider>
  )
}

export function FileUploadStudiesPage() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.title = "File Upload Studies — Special UI"
  }, [])

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme min-h-screen bg-background text-foreground`}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="/" className="inline-flex items-center gap-2 type-label">
            <ArrowLeft className="size-3.5" /> Special UI
          </a>
          <p className="hidden type-caption text-muted-foreground sm:block">File upload studies · Uppy 5</p>
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
        <section className="grid min-h-[30rem] items-center gap-10 py-16 lg:grid-cols-[9rem_1fr] lg:gap-10 lg:py-24">
          <p className="self-start type-caption text-muted-foreground">Five entry patterns. Five matching queue systems.</p>
          <div>
            <h1 className="max-w-[20ch] text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.04] tracking-[-0.045em]">
              Multiple-file upload without the default uploader aesthetic.
            </h1>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 type-caption text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Check className="size-3.5" />Real Uppy state</span>
              <span className="inline-flex items-center gap-2"><Check className="size-3.5" />Per-file progress</span>
              <span className="inline-flex items-center gap-2"><Check className="size-3.5" />Retry and removal</span>
            </div>
          </div>
        </section>

        <Study
          number="01 / Field"
          title="Quiet empty state"
          principle="A generous target for infrequent imports. The queue appears only after the user commits files."
        >
          <UploadStudy id="special-field-demo" variant="field" />
        </Study>

        <Study
          number="02 / Ledger"
          title="Dense batch importer"
          principle="Files behave like rows in a financial table: name, size, state, and action stay aligned."
        >
          <UploadStudy id="special-ledger-demo" variant="ledger" initialFiles />
        </Study>

        <Study
          number="03 / Split"
          title="Drop target and queue"
          principle="The input and its consequences are given equal space. Useful when importing is the page’s main job."
        >
          <UploadStudy id="special-split-demo" variant="split" initialFiles autoStart />
        </Study>

        <Study
          number="04 / Compact"
          title="Inline attachment rail"
          principle="A light-touch control for forms and existing workflows, with errors recoverable at file level."
        >
          <UploadStudy id="special-compact-demo" variant="compact" initialFiles autoStart failOnce />
        </Study>

        <Study
          number="05 / Stack"
          title="Focused import workspace"
          principle="A contained batch surface with an explicit overall summary and a calm spatial hierarchy."
        >
          <UploadStudy id="special-stack-demo" variant="stack" initialFiles autoStart />
        </Study>
      </main>
    </div>
  )
}
