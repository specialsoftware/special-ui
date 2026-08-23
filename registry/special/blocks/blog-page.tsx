import { useState } from "react"
import { ArrowLeft, ArrowUpRight, Moon, Sun } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

const architectureImage =
  "https://images.unsplash.com/photo-1741447419387-ab1e93cb429c?auto=format&fit=crop&w=1800&q=85"
const deskImage =
  "https://images.unsplash.com/photo-1632965053624-eea7c66017de?auto=format&fit=crop&w=1600&q=85"

function BlogPage() {
  const [dark, setDark] = useState(false)

  return (
    <div className={`${dark ? "dark" : ""} special-ui-theme`}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 md:px-8">
            <a
              href="/personal-website"
              className="inline-flex items-center gap-2 type-label text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Field Notes
            </a>
            <div className="flex items-center gap-1">
              <a
                href="/personal-website"
                className="hidden rounded-full px-3 py-2 type-label text-foreground transition-colors duration-fast hover:bg-secondary sm:block"
              >
                Index
              </a>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setDark((value) => !value)}
                aria-label={dark ? "Use light theme" : "Use dark theme"}
              >
                {dark ? <Sun /> : <Moon />}
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 pb-24 pt-14 md:px-8 md:pt-20">
          <article>
            <header className="mx-auto max-w-[38.625rem]">
              <p className="type-eyebrow uppercase text-subtle-foreground">Essay 04</p>
              <h1 className="mt-4 max-w-[21ch] font-display type-display text-foreground">
                Making software feel inevitable
              </h1>
              <p className="mt-5 max-w-[58ch] type-prose text-foreground">
                The best interfaces rarely announce how clever they are. They make the next step
                feel obvious, then get out of the way.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 type-caption text-muted-foreground">
                <span>August 22, 2026</span>
                <span aria-hidden="true">·</span>
                <span>8 minute read</span>
                <span aria-hidden="true">·</span>
                <span>Design practice</span>
              </div>
            </header>

            <figure className="mt-10 md:mt-12">
              <div className="overflow-hidden rounded-md border border-border bg-secondary p-1.5">
                <img
                  src={architectureImage}
                  alt="Geometric modern architecture photographed in black and white"
                  className="aspect-[16/9] w-full rounded-sm object-cover grayscale contrast-105 dark:brightness-75"
                />
              </div>
              <figcaption className="mt-2 flex flex-col justify-between gap-1 type-caption text-muted-foreground sm:flex-row">
                <span>A system becomes visible where its parts meet.</span>
                <a
                  href="https://unsplash.com/photos/modern-architecture-stands-in-a-black-and-white-photograph-VO6K5NSY_1I"
                  className="hover:underline hover:underline-offset-4"
                >
                  Photograph by Cai Fang
                </a>
              </figcaption>
            </figure>

            <div className="mx-auto mt-12 max-w-[38.625rem] space-y-5 type-prose text-foreground">
              <p>
                A good product often feels simpler than the work required to make it. The controls
                sit where you expect them. Labels use the words you would have chosen yourself. The
                interface responds quickly enough that action and result feel like the same event.
              </p>
              <p>
                None of this happens by accident. What reads as ease on the surface is usually the
                result of hundreds of small decisions being resolved in the same direction. The
                designer’s job is not to remove every decision. It is to make the important ones
                coherent.
              </p>
              <p>
                I think of this as making software feel inevitable: not predictable or generic,
                but so internally consistent that each part seems like the only reasonable outcome
                of the parts before it.
              </p>

              <h2 className="pt-10 type-heading text-foreground">Start with the edges</h2>
              <p>
                Interfaces tend to reveal themselves at their boundaries. Empty states, loading
                moments, errors, first-run experiences, and transitions between tools tell you more
                about a system than its polished center. They are also where borrowed patterns stop
                fitting and product judgment has to begin.
              </p>
              <p>
                When I begin a feature, I sketch the ideal path once and then immediately draw the
                awkward paths around it. What happens when the title is three lines? What remains
                useful without an image? Can someone understand the action before the data arrives?
                These questions establish the real shape of the component.
              </p>

              <figure className="py-7 md:-mx-16">
                <div className="rounded-md border border-border bg-secondary p-3 md:p-4">
                  <img
                    src={deskImage}
                    alt="A notebook and tablet arranged on a minimal desk in black and white"
                    className="aspect-[3/2] w-full rounded-sm object-cover grayscale dark:brightness-75"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-2 flex flex-col justify-between gap-1 type-caption text-muted-foreground sm:flex-row">
                  <span>Working in context exposes decisions an isolated component hides.</span>
                  <a
                    href="https://unsplash.com/photos/a-black-and-white-photo-of-a-desk-notebook-C_D9L8itwhY"
                    className="hover:underline hover:underline-offset-4"
                  >
                    Photograph by Sayan Majhi
                  </a>
                </figcaption>
              </figure>

              <h2 className="pt-10 type-heading text-foreground">Build rhythm before hierarchy</h2>
              <p>
                Most pages do not need more kinds of text. They need a clearer rhythm. A dependable
                measure, a stable line height, and consistent space between paragraphs do more for
                comprehension than adding another size or weight.
              </p>
              <blockquote className="my-8 border-l border-foreground py-1 pl-5 type-prose text-foreground">
                The page should feel composed before any individual element asks for attention.
              </blockquote>
              <p>
                This page uses one family and essentially one reading color. Metadata steps back,
                but the article itself does not change tone every few lines. Headings are separated
                mostly by space. Images are allowed to move beyond the reading measure because they
                carry a different kind of information.
              </p>
              <p>
                The same principle applies to code and diagrams. Give them a distinct container,
                but keep their visual language connected to the article around them.
              </p>
              <pre className="my-8 overflow-x-auto rounded-md border border-border bg-secondary p-4 font-mono type-caption text-foreground">
                <code>{`const rhythm = {
  measure: "38.625rem",
  body: "16px / 28px",
  paragraph: "20px",
}`}</code>
              </pre>

              <h2 className="pt-10 type-heading text-foreground">Let the system disappear</h2>
              <p>
                A design system is successful when it gives a product a point of view without
                making every screen look like documentation. Tokens and components should settle
                the recurring questions so the product can spend its attention on what is unique.
              </p>
              <ul className="my-6 list-disc space-y-2 pl-5 marker:text-subtle-foreground">
                <li>Use contrast to express meaning, not to decorate every choice.</li>
                <li>Keep the reading measure stable even when media becomes wider.</li>
                <li>Repeat spacing deliberately enough that exceptions feel intentional.</li>
              </ul>
              <p>
                The final test is not whether someone notices the system. It is whether they can
                move through the product without having to renegotiate it. When the rules are
                coherent, the interface stops feeling designed and starts feeling inevitable.
              </p>
            </div>
          </article>

          <footer className="mx-auto mt-20 max-w-[38.625rem] border-t border-border pt-5">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="type-eyebrow uppercase text-subtle-foreground">Next essay</p>
                <a href="#" className="mt-2 inline-flex items-center gap-1 type-label text-foreground hover:underline hover:underline-offset-4">
                  A case for fewer choices <ArrowUpRight className="size-3.5" />
                </a>
              </div>
              <a
                href="/personal-website"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                All writing
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export { BlogPage }
