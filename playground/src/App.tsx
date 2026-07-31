import { useState } from 'react';
import { SpecialUIProvider } from '@special-ui/react/provider';
import { Button } from '@special-ui/react/button';
import { Switch } from '@special-ui/react/switch';
import { Text } from '@special-ui/react/text';
import { Dialog } from '@special-ui/react/dialog';

/**
 * The editorial grid: a narrow label column and a wide content column, divided
 * by a hairline. Repeating this one row shape down the page is what produces
 * the Swiss look — far more than any individual component does.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-x-10 gap-y-5 border-t border-line py-12 md:grid-cols-[10rem_1fr]">
      <Text variant="eyebrow" render={<h2 />} className="pt-1">
        {label}
      </Text>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  );
}

function Cluster({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function Spec({ children, note }: { children: React.ReactNode; note: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Text variant="caption" className="text-fg-subtle">
        {note}
      </Text>
      {children}
    </div>
  );
}

export function App() {
  const [dark, setDark] = useState(true);
  const theme = dark ? 'dark' : undefined;

  return (
    /*
     * The theme is scoped to a `<div>` rather than `<html>`, which is the case
     * that breaks naively-portalled popups. The provider gives Dialog a themed
     * container on `document.body` so the dialog follows the theme too.
     */
    <SpecialUIProvider theme={theme}>
      <div className={theme}>
        <div className="min-h-screen bg-bg text-fg antialiased">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <header className="flex items-baseline justify-between py-6">
              <Text variant="label" className="font-medium">
                special-ui
              </Text>
              <div className="flex items-center gap-6">
                <Button variant="link" size="sm" render={<a href="#components" />}>
                  Components
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  render={<a href="https://base-ui.com" target="_blank" rel="noreferrer" />}
                >
                  Base UI
                </Button>
                <label className="flex items-center gap-2.5">
                  <Text variant="caption" render={<span />}>
                    Dark
                  </Text>
                  <Switch.Root
                    size="sm"
                    checked={dark}
                    onCheckedChange={setDark}
                    aria-label="Dark mode"
                  >
                    <Switch.Thumb />
                  </Switch.Root>
                </label>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-x-10 py-20 md:grid-cols-[10rem_1fr]">
              <div />
              <div className="flex flex-col gap-8">
                <Text variant="display" render={<h1 />}>
                  A Tailwind-first component library, built on Base UI.
                </Text>
                <Text measure>
                  Base UI supplies the behaviour — accessibility, focus management, keyboard
                  interaction. This layer supplies the design system: a monochrome token set, an
                  editorial type scale, and styled parts that keep every escape hatch intact.
                </Text>
                <Cluster>
                  <Button>Get started</Button>
                  <Button variant="secondary">Documentation</Button>
                </Cluster>
              </div>
            </div>

            <main id="components">
              <Row label="Type">
                <Spec note="Six roles, named for their job. Tracking tightens as size grows.">
                  <div className="flex flex-col gap-4">
                    <Text variant="display">Display</Text>
                    <Text variant="title">Title</Text>
                    <Text variant="heading">Heading</Text>
                    <Text variant="body" className="text-fg">
                      Body — running prose, set at a readable measure.
                    </Text>
                    <Text variant="label">Label</Text>
                    <Text variant="caption">Caption</Text>
                    <Text variant="eyebrow">Eyebrow</Text>
                  </div>
                </Spec>
              </Row>

              <Row label="Button">
                <Spec note="Primary inverts against the canvas, so it needs no dark: variant.">
                  <Cluster>
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="link">Link</Button>
                    <Button disabled>Disabled</Button>
                  </Cluster>
                </Spec>

                <Spec note="Compact by default — editorial interfaces run tighter than app UI.">
                  <Cluster>
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </Cluster>
                </Spec>

                <Spec note="render swaps the element; className overrides win through twMerge.">
                  <Cluster>
                    <Button variant="secondary" render={<a href="https://base-ui.com" />}>
                      Renders an anchor
                    </Button>
                    <Button className="rounded-full px-6">Overridden to a pill</Button>
                  </Cluster>
                </Spec>
              </Row>

              <Row label="Switch">
                <Spec note="Off reads as an empty field: a hairline inset ring, not a filled pill.">
                  <Cluster>
                    <Switch.Root size="sm">
                      <Switch.Thumb />
                    </Switch.Root>
                    <Switch.Root size="md" defaultChecked>
                      <Switch.Thumb />
                    </Switch.Root>
                    <Switch.Root size="lg" defaultChecked>
                      <Switch.Thumb />
                    </Switch.Root>
                    <Switch.Root variant="danger" defaultChecked>
                      <Switch.Thumb />
                    </Switch.Root>
                    <Switch.Root disabled>
                      <Switch.Thumb />
                    </Switch.Root>
                  </Cluster>
                </Spec>
              </Row>

              <Row label="Dialog">
                <Spec note="Enters on a short rise, never a zoom. Footer is divided by a hairline.">
                  <Cluster>
                    <Dialog.Root>
                      <Dialog.Trigger render={<Button variant="danger" />}>
                        Delete project
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Backdrop />
                        <Dialog.Popup>
                          <Dialog.Title>Delete project</Dialog.Title>
                          <Dialog.Description>
                            This permanently removes the project and everything in it. This action
                            cannot be undone.
                          </Dialog.Description>
                          <Dialog.Footer>
                            <Dialog.Close variant="danger">Delete</Dialog.Close>
                            <Dialog.Close>Cancel</Dialog.Close>
                          </Dialog.Footer>
                        </Dialog.Popup>
                      </Dialog.Portal>
                    </Dialog.Root>

                    <Dialog.Root>
                      <Dialog.Trigger render={<Button variant="secondary" />}>
                        Large dialog
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Backdrop />
                        <Dialog.Popup size="lg">
                          <Dialog.Title>Release notes</Dialog.Title>
                          <Dialog.Description>
                            The size variant flows from the popup down to the parts through
                            context, so each part is styled once and stays consistent.
                          </Dialog.Description>
                          <Dialog.Footer>
                            <Dialog.Close variant="primary">Got it</Dialog.Close>
                          </Dialog.Footer>
                        </Dialog.Popup>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </Cluster>
                </Spec>
              </Row>
            </main>

            <footer className="border-t border-line py-10">
              <Text variant="caption">
                Monochrome by design. The only hue in the system is destructive red.
              </Text>
            </footer>
          </div>
        </div>
      </div>
    </SpecialUIProvider>
  );
}
