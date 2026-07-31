'use client';
import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../styles/cn';
import { defineVariants } from '../styles/variants';
import { splitVariantProps } from '../styles/variants';
import type { VariantPropsOf } from '../internals/types';

/**
 * The type scale, as a component.
 *
 * In an editorial system the typography *is* the design system — the six roles
 * below carry more of the visual identity than every other component combined.
 * Naming them after their job rather than their size (`title`, not `text-2xl`)
 * is what keeps a codebase from accumulating fourteen almost-identical heading
 * sizes.
 */
export const textStyles = defineVariants({
  base: 'text-balance',
  variants: {
    variant: {
      /** Page-level statement. One per screen, at most. */
      display: 'text-display text-fg',
      /** Section opener. */
      title: 'text-title text-fg',
      /** Subsection or card heading. */
      heading: 'text-heading text-fg',
      /** Running prose. */
      body: 'text-body text-fg-muted',
      /** UI text: form labels, table cells, buttons. */
      label: 'text-label text-fg',
      /** Secondary annotation. */
      caption: 'text-caption text-fg-muted',
      /**
       * The small tracked-out capitals that label a column or section. The most
       * recognisable device in Swiss editorial layout, and the thing that makes
       * a page read as designed rather than merely styled.
       */
      eyebrow: 'text-eyebrow text-fg-subtle uppercase',
    },
    muted: {
      true: 'text-fg-muted',
      false: '',
    },
    /** Prose measure. Editorial columns cap around 65–75 characters. */
    measure: {
      true: 'max-w-[68ch]',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body',
    muted: false,
    measure: false,
  },
});

export type TextVariants = VariantPropsOf<typeof textStyles>;

export interface TextProps extends useRender.ComponentProps<'p'>, TextVariants {
  /**
   * The element to render. Defaults to `<p>`.
   *
   * Prefer `render` when you need a specific tag — `<Text render={<h1 />}>` —
   * so that visual weight and document outline stay independent of each other.
   */
  className?: string | undefined;
}

/**
 * Built on Base UI's public `useRender` hook rather than a bare element, so it
 * keeps the same `render` escape hatch as every other part in the library.
 *
 * ```tsx
 * <Text variant="eyebrow">Components</Text>
 * <Text variant="display" render={<h1 />}>Unstyled UI components</Text>
 * <Text measure>Long-form copy, capped at a readable measure.</Text>
 * ```
 */
export const Text = React.forwardRef(function Text(
  props: TextProps,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const [variants, rest] = splitVariantProps(props, textStyles.variantKeys);
  const { render, className, ...elementProps } = rest as TextProps;

  return useRender({
    render,
    ref: forwardedRef,
    defaultTagName: 'p',
    props: { ...elementProps, className: cn(textStyles(variants), className) },
  });
});
