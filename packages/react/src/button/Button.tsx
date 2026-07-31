'use client';
import { Button as BaseButton } from '@base-ui/react/button';
import { defineVariants } from '../styles/variants';
import { createStyledPart } from '../internals/createStyledPart';
import type { VariantPropsOf } from '../internals/types';

/**
 * Exported so consumers can reuse the exact button styling on something that
 * isn't a `<Button>` — a link, a menu item, a third-party component:
 *
 * ```tsx
 * <a href="/docs" className={buttonStyles({ tone: 'ghost' })}>Docs</a>
 * ```
 */
export const buttonStyles = defineVariants({
  base: [
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap',
    'rounded-control font-medium',
    'transition-[background-color,border-color,color,box-shadow] duration-fast ease-emphasized',
    'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
    // Base UI's Button sets `data-disabled` on the element, which is what lets
    // us style the disabled state without relying on the `:disabled`
    // pseudo-class — important because `render` may swap in a non-<button>.
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
  variants: {
    tone: {
      brand: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
      neutral:
        'bg-surface-raised text-content border border-line shadow-xs hover:bg-surface-sunken',
      ghost: 'bg-transparent text-content hover:bg-surface-sunken',
      danger: 'bg-danger text-white hover:opacity-90 active:opacity-80',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: {
    tone: 'brand',
    size: 'md',
    fullWidth: false,
  },
  compoundVariants: [
    // Ghost buttons are visually lighter, so they need tighter horizontal
    // padding to stay optically aligned with adjacent text.
    { tone: 'ghost', size: 'sm', class: 'px-2' },
    { tone: 'ghost', size: 'md', class: 'px-3' },
  ],
});

export type ButtonVariants = VariantPropsOf<typeof buttonStyles>;

export interface ButtonProps extends BaseButton.Props, ButtonVariants {}

/**
 * A button.
 *
 * Inherits every Base UI `Button` capability — `render`, `nativeButton`,
 * `focusableWhenDisabled`, correct disabled semantics — and adds the design
 * system's `tone`, `size` and `fullWidth` variants.
 *
 * ```tsx
 * <Button tone="danger" size="sm">Delete</Button>
 * <Button render={<a href="/pricing" />}>Pricing</Button>
 * ```
 */
export const Button = createStyledPart<ButtonProps>(BaseButton, buttonStyles, {
  displayName: 'Button',
});
