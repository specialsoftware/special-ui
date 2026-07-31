import { useState } from 'react';
import { SpecialUIProvider } from '@special-ui/react/provider';
import { Button } from '@special-ui/react/button';
import { Switch } from '@special-ui/react/switch';
import { Dialog } from '@special-ui/react/dialog';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-medium tracking-wide text-content-muted uppercase">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export function App() {
  const [dark, setDark] = useState(false);

  const theme = dark ? 'dark' : undefined;

  return (
    /*
     * The theme is scoped to a `<div>` rather than `<html>`, which is the case
     * that breaks naively-portalled popups. The provider gives Dialog a themed
     * container on `document.body` so the dialog follows the theme too.
     */
    <SpecialUIProvider theme={theme}>
      <div className={theme}>
        <div className="min-h-screen bg-surface px-8 py-12 text-content">
        <div className="mx-auto flex max-w-2xl flex-col gap-12">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">special-ui</h1>
              <p className="text-sm text-content-muted">Tailwind-first components on Base UI.</p>
            </div>
            <label className="flex items-center gap-3 text-sm">
              Dark
              <Switch.Root checked={dark} onCheckedChange={setDark}>
                <Switch.Thumb />
              </Switch.Root>
            </label>
          </header>

          <Section title="Button tones">
            <Button tone="brand">Brand</Button>
            <Button tone="neutral">Neutral</Button>
            <Button tone="ghost">Ghost</Button>
            <Button tone="danger">Danger</Button>
            <Button disabled>Disabled</Button>
          </Section>

          <Section title="Button sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Section>

          <Section title="Escape hatches">
            {/* `render` swaps the element but keeps every style and behaviour. */}
            <Button render={<a href="https://base-ui.com" />} tone="neutral">
              Renders an anchor
            </Button>
            {/* A consumer class beats the built-in one, thanks to twMerge. */}
            <Button className="rounded-full bg-fuchsia-600 hover:bg-fuchsia-700">
              Overridden classes
            </Button>
          </Section>

          <Section title="Switch">
            <Switch.Root size="sm">
              <Switch.Thumb />
            </Switch.Root>
            <Switch.Root size="md" defaultChecked>
              <Switch.Thumb />
            </Switch.Root>
            <Switch.Root size="lg" tone="danger" defaultChecked>
              <Switch.Thumb />
            </Switch.Root>
            <Switch.Root disabled>
              <Switch.Thumb />
            </Switch.Root>
          </Section>

          <Section title="Dialog">
            <Dialog.Root>
              <Dialog.Trigger render={<Button tone="danger" />}>Delete project</Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                  <Dialog.Title>Delete project</Dialog.Title>
                  <Dialog.Description>
                    This permanently removes the project and everything in it. This action cannot be
                    undone.
                  </Dialog.Description>
                  <Dialog.Footer>
                    <Dialog.Close tone="danger">Delete</Dialog.Close>
                    <Dialog.Close>Cancel</Dialog.Close>
                  </Dialog.Footer>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root>
              <Dialog.Trigger render={<Button tone="neutral" />}>Large dialog</Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup size="lg">
                  <Dialog.Title>Release notes</Dialog.Title>
                  <Dialog.Description>
                    The size variant flows from the popup down to the parts through context.
                  </Dialog.Description>
                  <Dialog.Footer>
                    <Dialog.Close tone="brand">Got it</Dialog.Close>
                  </Dialog.Footer>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
          </Section>
          </div>
        </div>
      </div>
    </SpecialUIProvider>
  );
}
