'use client';
import { Button as BaseButton } from '@base-ui/react/button';
import { defineVariants } from '../styles/variants';
import { createStyledPart } from '../internals/createStyledPart';
import type { VariantPropsOf } from '../internals/types';

/**
 * Exported so consumers can reuse the exact button styling on something that
 * isn't a `<Button>` — a menu item, a third-party component:
 *
 * ```tsx
 * <SomeThirdPartyThing className={buttonStyles({ variant: 'secondary' })} />
 * ```
 */
export const buttonStyles = defineVariants({
  base: [
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap',
    'rounded-control font-medium',
    'transition-colors duration-fast ease-editorial',
    // The focus ring is the foreground color, never a hue. In a monochrome
    // system a colored ring is the one thing that would break the palette.
    // `outline-solid` is required, not decorative: `outline-none` sets
    // `--tw-outline-style: none`, and Tailwind v4's `outline-2` resolves its
    // style from that variable. Without restoring it the ring gets a width and
    // a colour but `outline-style: none`, and never paints.
    'outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    // Base UI sets `data-disabled` on the element, which is what lets us style
    // the disabled state without relying on the `:disabled` pseudo-class —
    // important because `render` may swap in a non-<button>.
    'data-disabled:pointer-events-none data-disabled:opacity-40',
  ],
  variants: {
    variant: {
      /**
       * The inverted fill: near-black on white, flipping to white on near-black
       * in dark mode. Both reference sites lead with this. Because the flip
       * lives in the token pair, there is no `dark:` variant here at all.
       */
      primary: 'bg-accent text-accent-fg hover:bg-accent-hover',
      /** Hairline outline — the default for anything not the page's main action. */
      secondary: 'border border-line bg-transparent text-fg hover:border-line-strong hover:bg-bg-subtle',
      /** No chrome until hovered. */
      ghost: 'bg-transparent text-fg hover:bg-bg-subtle',
      /**
       * An underlined run of text, sitting on the baseline rather than in a box.
       * This is how base-ui.com renders nearly all of its navigation.
       */
      link: 'bg-transparent text-fg underline decoration-line-strong underline-offset-[0.25em] hover:decoration-fg',
      /** The single chromatic exception in the system. */
      danger: 'bg-danger text-danger-fg hover:bg-danger-hover',
    },
    size: {
      sm: 'h-7 px-2.5 text-caption',
      md: 'h-9 px-4 text-label',
      lg: 'h-11 px-6 text-body',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
  compoundVariants: [
    // A link is type, not a control: it must not carry the box metrics its
    // size variant would otherwise give it, or it stops sitting on the
    // baseline of the text around it.
    { variant: 'link', size: 'sm', class: 'h-auto rounded-none px-0' },
    { variant: 'link', size: 'md', class: 'h-auto rounded-none px-0' },
    { variant: 'link', size: 'lg', class: 'h-auto rounded-none px-0' },
    // Ghost buttons have no edge, so they need tighter horizontal padding to
    // stay optically aligned with adjacent text.
    { variant: 'ghost', size: 'sm', class: 'px-2' },
    { variant: 'ghost', size: 'md', class: 'px-3' },
  ],
});

export type ButtonVariants = VariantPropsOf<typeof buttonStyles>;

export interface ButtonProps extends BaseButton.Props, ButtonVariants {}

/**
 * A button.
 *
 * Inherits every Base UI `Button` capability — `render`, `nativeButton`,
 * `focusableWhenDisabled`, correct disabled semantics — and adds the design
 * system's `variant`, `size` and `fullWidth` props.
 *
 * ```tsx
 * <Button variant="danger" size="sm">Delete</Button>
 * <Button variant="link" render={<a href="/docs" />}>Documentation</Button>
 * ```
 */
export const Button = createStyledPart<ButtonProps>(BaseButton, buttonStyles, {
  displayName: 'Button',
});
