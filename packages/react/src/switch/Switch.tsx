'use client';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { defineSlots } from '../styles/variants';
import { createStyledPart, createVariantContext } from '../internals/createStyledPart';
import type { VariantPropsOf } from '../internals/types';

export const switchStyles = defineSlots({
  slots: {
    root: [
      'relative inline-flex shrink-0 items-center rounded-full p-0.5',
      'transition-colors duration-normal ease-emphasized',
      'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
      'data-disabled:pointer-events-none data-disabled:opacity-50',
      // Base UI puts `data-unchecked` on the element when off, rather than
      // leaving the attribute absent. That means both states are addressable
      // without a `:not()` selector.
      'data-unchecked:bg-line',
    ],
    thumb: [
      'block rounded-full bg-white shadow-xs',
      'transition-transform duration-normal ease-emphasized',
      'data-unchecked:translate-x-0',
    ],
  },
  variants: {
    size: {
      sm: { root: 'h-5 w-9', thumb: 'size-4 data-checked:translate-x-4' },
      md: { root: 'h-6 w-11', thumb: 'size-5 data-checked:translate-x-5' },
      lg: { root: 'h-7 w-13', thumb: 'size-6 data-checked:translate-x-6' },
    },
    tone: {
      brand: { root: 'data-checked:bg-brand-600' },
      neutral: { root: 'data-checked:bg-content' },
      danger: { root: 'data-checked:bg-danger' },
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'brand',
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
 * The moving knob. Inherits `size` and `tone` from `Switch.Root`, but either
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
