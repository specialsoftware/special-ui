import { useState, type KeyboardEvent, type ReactNode } from "react"
import {
  AlertCircle,
  Check,
  FileSpreadsheet,
  LoaderCircle,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react"
import { useDropzone, useUppyContext, useUppyState } from "@uppy/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type FileUploadVariant = "field" | "ledger" | "split" | "compact" | "stack"

export interface UppyFileUploadProps {
  variant?: FileUploadVariant
  title?: string
  note?: string
  className?: string
}

type FileStatus = "queued" | "uploading" | "processing" | "error" | "complete"

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileStatus(file: {
  error?: string | null
  progress: {
    uploadStarted: number | null
    uploadComplete?: boolean
    complete?: true
    postprocess?: { message?: string }
  }
}): FileStatus {
  if (file.error) return "error"
  if (file.progress.postprocess) return "processing"
  if (file.progress.complete || file.progress.uploadComplete) return "complete"
  if (file.progress.uploadStarted) return "uploading"
  return "queued"
}

function StatusMark({ status }: { status: FileStatus }) {
  if (status === "error") return <AlertCircle className="size-4" />
  if (status === "complete") return <Check className="size-4" />
  if (status === "uploading" || status === "processing") return <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
  return <FileSpreadsheet className="size-4" />
}

function statusLabel(status: FileStatus, percentage: number, error?: string | null) {
  if (status === "error") return error || "Upload failed"
  if (status === "complete") return "Uploaded"
  if (status === "processing") return "Processing"
  if (status === "uploading") return `Uploading · ${percentage}%`
  return "Ready"
}

function ProgressLine({ value, error = false }: { value: number; error?: boolean }) {
  return (
    <div className="h-px overflow-hidden bg-border" aria-hidden="true">
      <div
        className={cn("h-full bg-foreground transition-[width] duration-300", error && "bg-destructive")}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

function DropCopy({ title, note, compact = false }: { title: string; note: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Plus className="size-4 shrink-0" />
        <span className="truncate type-label">{title}</span>
        <span className="hidden truncate type-caption text-muted-foreground sm:block">{note}</span>
      </div>
    )
  }

  return (
    <div>
      <Upload className="mx-auto size-5" />
      <p className="mt-5 type-heading">{title}</p>
      <p className="mt-1 type-caption text-muted-foreground">{note}</p>
    </div>
  )
}

export function UppyFileUpload({
  variant = "field",
  title = "Drop bank statements",
  note = "CSV · 10 max · 20 MB each",
  className,
}: UppyFileUploadProps) {
  const { uppy } = useUppyContext()
  const files = useUppyState(uppy, (state) => Object.values(state.files))
  const totalProgress = useUppyState(uppy, (state) => state.totalProgress)
  const latestInfo = useUppyState(uppy, (state) => state.info.at(-1))
  const [dragActive, setDragActive] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDrop: () => setDragActive(false),
    onFileInputChange: () => setDragActive(false),
  })

  const rootProps = getRootProps()
  const inputProps = getInputProps()
  const noteId = `${inputProps.id}-note`
  const queueId = `${inputProps.id}-queue`
  const completedCount = files.filter((file) => getFileStatus(file) === "complete").length
  const activeCount = files.filter((file) => {
    const status = getFileStatus(file)
    return status === "uploading" || status === "processing"
  }).length
  const errorCount = files.filter((file) => getFileStatus(file) === "error").length
  const canUpload = files.some((file) => {
    const status = getFileStatus(file)
    return status === "queued" || status === "error"
  })

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      rootProps.onClick()
    }
  }

  const startUpload = () => {
    void uppy.upload().catch((error: Error) => uppy.info(error.message, "error"))
  }

  const retryFile = (fileId: string) => {
    void uppy.retryUpload(fileId).catch((error: Error) => uppy.info(error.message, "error"))
  }

  const dropTarget = (children: ReactNode, targetClassName: string) => (
    <div
      {...rootProps}
      role="button"
      tabIndex={0}
      aria-describedby={noteId}
      aria-controls={files.length > 0 ? queueId : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        "cursor-pointer outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        dragActive && "bg-secondary",
        targetClassName,
      )}
      data-drag-active={dragActive || undefined}
    >
      <input {...inputProps} className="sr-only" />
      {children}
    </div>
  )

  const rowQueue = (dense = false) => files.length > 0 ? (
    <div id={queueId} className="divide-y divide-border" aria-live="polite">
      {files.map((file) => {
        const status = getFileStatus(file)
        const percentage = file.progress.percentage ?? 0
        return (
          <div key={file.id} className={cn("relative grid items-center gap-3 px-4 py-4 sm:grid-cols-[1fr_auto_auto]", dense && "py-3")}>
            <div className="flex min-w-0 items-center gap-3">
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full bg-secondary", status === "error" && "text-destructive")}>
                <StatusMark status={status} />
              </span>
              <div className="min-w-0">
                <p className="truncate type-label">{file.name}</p>
                <p className={cn("mt-0.5 truncate type-caption text-muted-foreground", status === "error" && "text-destructive")}>
                  {statusLabel(status, percentage, file.error)}
                </p>
              </div>
            </div>
            <span className="hidden type-caption text-muted-foreground sm:block">{formatBytes(file.size)}</span>
            <div className="flex justify-end gap-1">
              {status === "error" && (
                <Button variant="ghost" size="icon-sm" onClick={() => retryFile(file.id)} aria-label={`Retry ${file.name}`}>
                  <RefreshCw />
                </Button>
              )}
              <Button variant="ghost" size="icon-sm" onClick={() => uppy.removeFile(file.id)} aria-label={`Remove ${file.name}`}>
                <Trash2 />
              </Button>
            </div>
            {(status === "uploading" || status === "error") && (
              <div className="absolute inset-x-4 bottom-0"><ProgressLine value={percentage} error={status === "error"} /></div>
            )}
          </div>
        )
      })}
    </div>
  ) : null

  const cardQueue = () => files.length > 0 ? (
    <div id={queueId} className="grid gap-2" aria-live="polite">
      {files.map((file) => {
        const status = getFileStatus(file)
        const percentage = file.progress.percentage ?? 0
        return (
          <div key={file.id} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <StatusMark status={status} />
                <div className="min-w-0">
                  <p className="truncate type-label">{file.name}</p>
                  <p className={cn("mt-1 type-caption text-muted-foreground", status === "error" && "text-destructive")}>
                    {statusLabel(status, percentage, file.error)}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {status === "error" && <Button variant="ghost" size="icon-sm" onClick={() => retryFile(file.id)} aria-label={`Retry ${file.name}`}><RefreshCw /></Button>}
                <Button variant="ghost" size="icon-sm" onClick={() => uppy.removeFile(file.id)} aria-label={`Remove ${file.name}`}><Trash2 /></Button>
              </div>
            </div>
            <div className="mt-4"><ProgressLine value={status === "complete" ? 100 : percentage} error={status === "error"} /></div>
          </div>
        )
      })}
    </div>
  ) : null

  const chipQueue = () => files.length > 0 ? (
    <div id={queueId} className="mt-3 flex flex-wrap gap-2" aria-live="polite">
      {files.map((file) => {
        const status = getFileStatus(file)
        const percentage = file.progress.percentage ?? 0
        return (
          <div key={file.id} className={cn("flex max-w-full items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-2.5 pr-1.5", status === "error" && "border-destructive/40")}>
            <StatusMark status={status} />
            <span className="max-w-48 truncate type-caption">{file.name}</span>
            {status === "uploading" && <span className="type-caption text-muted-foreground">{percentage}%</span>}
            {status === "error" && <Button variant="ghost" size="icon-sm" onClick={() => retryFile(file.id)} aria-label={`Retry ${file.name}`}><RefreshCw /></Button>}
            <Button variant="ghost" size="icon-sm" onClick={() => uppy.removeFile(file.id)} aria-label={`Remove ${file.name}`}><Trash2 /></Button>
          </div>
        )
      })}
    </div>
  ) : null

  const actionBar = (inverted = false) => files.length > 0 ? (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3", inverted && "border-background/15")}>
      <p className={cn("type-caption text-muted-foreground", inverted && "text-background/55")}>
        {activeCount
          ? `${totalProgress}%`
          : errorCount
            ? `${completedCount} complete · ${errorCount} failed`
            : completedCount === files.length
              ? `${files.length} complete`
              : `${files.length} files`}
      </p>
      <Button variant={inverted ? "secondary" : "default"} size="sm" onClick={startUpload} disabled={!canUpload}>
        {activeCount ? "Uploading" : "Upload files"}
        {activeCount ? <LoaderCircle className="animate-spin motion-reduce:animate-none" data-icon="inline-end" /> : <Upload data-icon="inline-end" />}
      </Button>
    </div>
  ) : null

  const info = latestInfo ? (
    <p className="mt-3 type-caption text-destructive" role="status">{latestInfo.message}</p>
  ) : null

  if (variant === "ledger") {
    return (
      <div className={cn("border border-border bg-card", className)}>
        <div className="grid grid-cols-[1fr_auto] items-center border-b border-border px-4 py-3">
          <p className="type-label">Statement import</p>
          <p className="type-caption text-muted-foreground">{files.length} files</p>
        </div>
        {dropTarget(
          <div className="flex items-center justify-between gap-4">
            <DropCopy title={dragActive ? "Release to add statements" : title} note={note} compact />
            <span className="shrink-0 rounded-full border border-border px-3 py-1.5 type-caption">Browse</span>
          </div>,
          "border-b border-dashed border-border px-4 py-5",
        )}
        {files.length > 0 && (
          <div className="hidden grid-cols-[1fr_7rem_5rem] border-b border-border px-4 py-2 type-caption text-muted-foreground sm:grid">
            <span>File</span><span>Size</span><span className="text-right">Action</span>
          </div>
        )}
        {rowQueue(true)}
        {actionBar()}
        <p id={noteId} className="sr-only">{note}</p>
        {info && <div className="px-4 pb-3">{info}</div>}
      </div>
    )
  }

  if (variant === "split") {
    return (
      <div className={cn("grid overflow-hidden rounded-xl border border-border bg-card md:grid-cols-[0.78fr_1.22fr]", className)}>
        <div className="flex min-h-80 flex-col bg-foreground text-background">
          {dropTarget(
            <div className="grid h-full place-items-center p-8 text-center">
              <div>
                <Upload className="mx-auto size-5" />
                <p className="mt-6 type-title">{dragActive ? "Release to add" : "Drop CSV files"}</p>
                <p className="mt-2 type-caption text-background/55">{note}</p>
              </div>
            </div>,
            "min-h-64 flex-1 border-b border-background/15 data-[drag-active]:bg-background/10",
          )}
          {actionBar(true)}
        </div>
        <div className="p-5 md:p-7">
          <div className="flex items-baseline justify-between gap-3">
            <p className="type-heading">Upload queue</p>
            <p className="type-caption text-muted-foreground">{totalProgress}% overall</p>
          </div>
          <div className="mt-5">{cardQueue()}</div>
          <p id={noteId} className="sr-only">{note}</p>
          {info}
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={className}>
        {dropTarget(
          <div className="flex items-center gap-3 px-4 py-3">
            <DropCopy title={dragActive ? "Release to attach" : "Add CSV files"} note={note} compact />
            <span className="shrink-0 type-caption text-muted-foreground">⌘ U</span>
          </div>,
          "rounded-full border border-border bg-card hover:border-border-strong",
        )}
        {chipQueue()}
        {files.length > 0 && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="type-caption text-muted-foreground">{completedCount} complete · {errorCount} failed</p>
            <Button size="sm" onClick={startUpload} disabled={!canUpload}>Upload {files.length} files</Button>
          </div>
        )}
        <p id={noteId} className="sr-only">{note}</p>
        {info}
      </div>
    )
  }

  if (variant === "stack") {
    return (
      <div className={cn("rounded-xl border border-border bg-secondary p-4 md:p-7", className)}>
        {dropTarget(
          <div className="relative grid min-h-64 place-items-center overflow-hidden rounded-lg border border-border bg-background p-8 text-center shadow-card">
            <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(to right, var(--su-border) 1px, transparent 1px), linear-gradient(to bottom, var(--su-border) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="relative">
              <div className="mx-auto grid size-12 place-items-center rounded-full border border-border bg-background"><Upload className="size-5" /></div>
              <p className="mt-5 type-heading">{dragActive ? "Release to build the batch" : title}</p>
              <p className="mt-1 type-caption text-muted-foreground">{note}</p>
            </div>
          </div>,
          "rounded-lg data-[drag-active]:bg-secondary",
        )}
        {files.length > 0 && (
          <div className="mt-4 rounded-lg border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="type-label">Progress</p>
              <p className="type-caption text-muted-foreground">{totalProgress}%</p>
            </div>
            {rowQueue(true)}
            {actionBar()}
          </div>
        )}
        <p id={noteId} className="sr-only">{note}</p>
        {info}
      </div>
    )
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      {dropTarget(
        <div className="grid min-h-56 place-items-center border-b border-dashed border-border p-8 text-center">
          <DropCopy title={dragActive ? "Release to add files" : title} note={note} />
        </div>,
        "hover:bg-secondary/60 data-[drag-active]:bg-secondary",
      )}
      {rowQueue()}
      {actionBar()}
      <p id={noteId} className="sr-only">{note}</p>
      {info && <div className="px-4 pb-3">{info}</div>}
    </div>
  )
}
