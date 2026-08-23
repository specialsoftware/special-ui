import { useState, type ReactNode } from "react"
import { ArrowUpRight, Moon, Sun } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

const writing = [
  {
    year: "2026",
    posts: [
      { title: "Making software feel inevitable", date: "22 / 08", tag: "Design", isNew: true },
      { title: "The tools we choose", date: "02 / 07", tag: "Process", isNew: false },
      { title: "Building systems that age well", date: "14 / 05", tag: "Systems", isNew: false },
      { title: "A case for fewer choices", date: "21 / 02", tag: "Product", isNew: false },
    ],
  },
  {
    year: "2025",
    posts: [
      { title: "Design is operations", date: "09 / 11", tag: "Practice", isNew: false },
      { title: "Notes from a small software studio", date: "23 / 06", tag: "Studio", isNew: false },
    ],
  },
  {
    year: "2024",
    posts: [
      { title: "Making room for better work", date: "04 / 09", tag: "Work", isNew: false },
    ],
  },
] as const

function JournalLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="underline decoration-border-strong underline-offset-[0.2em] transition-colors duration-fast hover:decoration-foreground"
    >
      {children}
    </a>
  )
}

function PersonalWebsitePage() {
  const [dark, setDark] = useState(false)

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme`}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 md:px-8">
            <a href="/personal-website" className="flex items-center gap-2.5 type-label">
              <span className="size-2 bg-foreground" aria-hidden="true" />
              Field Notes
            </a>
            <nav className="flex items-center gap-1" aria-label="Journal navigation">
              <a
                href="#writing"
                className="hidden rounded-full px-3 py-2 type-label text-muted-foreground transition-colors duration-fast hover:bg-secondary hover:text-foreground sm:block"
              >
                Writing
              </a>
              <a
                href="#about"
                className="hidden rounded-full px-3 py-2 type-label text-muted-foreground transition-colors duration-fast hover:bg-secondary hover:text-foreground sm:block"
              >
                About
              </a>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setDark((value) => !value)}
                aria-label={dark ? "Use light theme" : "Use dark theme"}
              >
                {dark ? <Sun /> : <Moon />}
              </Button>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 pb-20 pt-16 md:px-8 md:pt-24">
          <article id="about" className="scroll-mt-20">
            <div className="grid gap-8 md:grid-cols-[7rem_1fr]">
              <div>
                <p className="type-caption text-muted-foreground">Updated Aug 2026</p>
              </div>

              <div className="max-w-xl">
                <h1 className="font-display type-display">
                  Notes on software, systems, and the spaces between.
                </h1>
                <div className="mt-7 space-y-4 type-body text-muted-foreground">
                  <p>
                    I design and build digital products with small teams. This journal is where I
                    work through ideas about interface design, product judgment, and the craft of
                    making software.
                  </p>
                  <p>
                    My current focus is creating durable tools for ambitious independent studios.
                    Previously, I worked across early-stage products, design systems, and consumer
                    applications.
                  </p>
                  <p>
                    I care about calm technology, direct communication, and systems that leave room
                    for taste. You can follow along on <JournalLink href="#">X</JournalLink>, see
                    ongoing work on <JournalLink href="#">GitHub</JournalLink>, or get in touch by{" "}
                    <JournalLink href="mailto:hello@example.com">email</JournalLink>.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  <a href="#writing" className={buttonVariants({ size: "sm" })}>
                    Browse writing
                  </a>
                  <a href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Special UI
                  </a>
                </div>
              </div>
            </div>
          </article>

          <section id="writing" className="mt-20 scroll-mt-20 md:mt-24">
            <div className="border-b border-border pb-3 md:ml-[7rem]">
              <div className="flex items-baseline justify-between gap-6">
                <h2 className="type-heading">Writing</h2>
                <p className="type-caption text-subtle-foreground">07 notes</p>
              </div>
            </div>

            <div>
              {writing.map((group) => (
                <div key={group.year} className="grid md:grid-cols-[7rem_1fr]">
                  <p className="border-b border-border py-4 type-caption text-subtle-foreground md:border-b-0">
                    {group.year}
                  </p>
                  <ol>
                    {group.posts.map((post) => (
                      <li key={post.title}>
                        <a
                          href={post.isNew ? "/blog" : `#${post.title.toLowerCase().replaceAll(" ", "-")}`}
                          className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-border py-4 transition-colors duration-fast hover:bg-secondary/65 sm:grid-cols-[1fr_5rem_auto] sm:items-baseline sm:px-3 sm:hover:-mx-3 sm:hover:px-3"
                        >
                          <span className="flex min-w-0 items-center gap-2 type-body text-foreground">
                            <span>{post.title}</span>
                            {post.isNew && (
                              <span className="rounded-full border border-border-strong px-1.5 py-0.5 type-caption text-muted-foreground">
                                New
                              </span>
                            )}
                          </span>
                          <span className="hidden type-caption text-subtle-foreground sm:block">
                            {post.tag}
                          </span>
                          <time className="type-caption text-subtle-foreground" data-tabular>
                            {post.date}
                          </time>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-20 border-t border-border pt-5 md:ml-[7rem]">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <p className="max-w-sm type-caption text-muted-foreground">
                Occasional notes on making thoughtful software. No feeds to game, no schedule to
                keep.
              </p>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center gap-1 type-label hover:underline hover:underline-offset-4"
              >
                Say hello <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export { PersonalWebsitePage }
