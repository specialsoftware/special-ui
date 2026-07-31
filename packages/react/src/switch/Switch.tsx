'use client';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { defineSlots } from '../styles/variants';
import { createStyledPart, createVariantContext } from '../internals/createStyledPart';
import type { VariantPropsOf } from '../internals/types';

export const switchStyles = defineSlots({
  slots: {
    root: [
      'relative inline-flex shrink-0 items-center rounded-full p-px',
      'transition-colors duration-normal ease-editorial',
      // See Button.tsx: `outline-solid` restores the style that `outline-none`
      // zeroed out, without which the ring never paints.
      'outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
      'data-disabled:pointer-events-none data-disabled:opacity-40',
      // Base UI puts `data-unchecked` on the element when off, rather than
      // leaving the attribute absent. That means both states are addressable
      // without a `:not()` selector.
      //
      // Off is a hairline outline over the page, not a filled grey pill — the
      // control should read as an empty field until it holds a value.
      'data-unchecked:bg-bg-inset data-unchecked:inset-ring data-unchecked:inset-ring-line-strong',
    ],
    thumb: [
      'block rounded-full',
      'transition-transform duration-normal ease-editorial',
      'data-unchecked:translate-x-0',
      // Off is an ink knob on a paper field; on inverts to a paper knob on an
      // ink field. Using the muted foreground rather than the page background
      // is what keeps the knob visible in dark mode — `bg-bg` would make it
      // exactly the canvas colour and it would read as a hole.
      'data-unchecked:bg-fg-muted',
    ],
  },
  variants: {
    size: {
      // One px of padding, so the thumb travels the full track minus its own
      // width: 36 - 2 - 18 = 16.
      sm: { root: 'h-5 w-9', thumb: 'size-[1.125rem] data-checked:translate-x-4' },
      md: { root: 'h-6 w-11', thumb: 'size-[1.375rem] data-checked:translate-x-5' },
      lg: { root: 'h-7 w-13', thumb: 'size-[1.625rem] data-checked:translate-x-6' },
    },
    variant: {
      /** On is the inverted foreground — the same token the primary button uses. */
      primary: { root: 'data-checked:bg-accent', thumb: 'data-checked:bg-accent-fg' },
      danger: { root: 'data-checked:bg-danger', thumb: 'data-checked:bg-danger-fg' },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

export type SwitchVariants = VariantPropsOf<typeof switchStyles.root>;

const [VariantsProvider, useSwitchVariants] = createVariantContext<SwitchVariants>(
  'SwitchVariantsContext',
);

export interface SwitchRootProps extends BaseSwitch.Root.Props, SwitchVariants {}
export interface SwitchThumbProps extends BaseSwitch.Thumb.Props, SwitchVariants {}

/**
 * The switch track. Owns the variant selection for the whole component.
 */
export const SwitchRoot = createStyledPart<SwitchRootProps>(BaseSwitch.Root, switchStyles.root, {
  displayName: 'Switch.Root',
  provideVariants: VariantsProvider,
});

/**
 * The moving knob. Inherits `size` and `variant` from `Switch.Root`, but either
 * can still be overridden per-part.
 */
export const SwitchThumb = createStyledPart<SwitchThumbProps>(
  BaseSwitch.Thumb,
  switchStyles.thumb,
  {
    displayName: 'Switch.Thumb',
    useVariants: useSwitchVariants,
  },
);
