'use client';
import * as React from 'react';
import { createPortal } from 'react-dom';

const PortalContainerContext = React.createContext<HTMLElement | null>(null);

/**
 * The element that portal-based parts should mount into.
 *
 * Returns `null` when there is no provider, in which case parts fall back to
 * Base UI's default (`document.body`).
 */
export function usePortalContainer(): HTMLElement | null {
  return React.useContext(PortalContainerContext);
}

export interface SpecialUIProviderProps {
  children?: React.ReactNode;
  /**
   * Class names carrying the theme — typically `'dark'` or `undefined`.
   *
   * Applied to the portal container so that portalled surfaces resolve the same
   * theme tokens as the rest of the tree.
   */
  theme?: string | undefined;
}

/**
 * Solves a problem every portal-based design system eventually hits.
 *
 * Class-based theming works by inheritance: `.dark` redefines the token
 * variables, and everything beneath it resolves against the new values. A
 * portal breaks that chain — Base UI mounts popups on `document.body`, which
 * is *outside* a scoped `<div className="dark">`, so a dialog opened from a
 * dark subtree renders with light tokens.
 *
 * There are two ways out. Either put the theme class on `<html>`, so nothing
 * can escape it — fine when the whole app shares one theme — or give portals a
 * themed container to mount into. This provider does the latter: it renders an
 * empty, themed element on `document.body` and hands it to every portal-based
 * part through context.
 *
 * It is opt-in. Without it, parts behave exactly as Base UI does.
 *
 * ```tsx
 * <SpecialUIProvider theme={dark ? 'dark' : undefined}>
 *   <div className={dark ? 'dark' : undefined}>...</div>
 * </SpecialUIProvider>
 * ```
 */
export function SpecialUIProvider(props: SpecialUIProviderProps) {
  const { children, theme } = props;
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  // The container can only exist in the browser. Rendering it on the first
  // client render rather than during SSR keeps the server and client markup
  // identical, so hydration does not warn.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PortalContainerContext.Provider value={container}>
      {children}
      {mounted
        ? createPortal(
            <div ref={setContainer} className={theme} data-special-ui-portal-container="" />,
            document.body,
          )
        : null}
    </PortalContainerContext.Provider>
  );
}
