'use client';
import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../styles/cn';
import { usePortalContainer } from '../provider/SpecialUIProvider';
import { defineSlots } from '../styles/variants';
import { createStyledPart, createVariantContext } from '../internals/createStyledPart';
import type { VariantPropsOf } from '../internals/types';
import { buttonStyles } from '../button/Button';

export const dialogStyles = defineSlots({
  slots: {
    backdrop: [
      'fixed inset-0 z-50 bg-scrim',
      'transition-opacity duration-normal ease-editorial',
      // Base UI keeps the element mounted through its exit animation and marks
      // the two ends of the transition with `data-starting-style` /
      // `data-ending-style`. Styling those two attributes is the entire
      // animation contract — no animation library, no `AnimatePresence`.
      'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
    ],
    popup: [
      'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
      'flex w-[calc(100vw-2rem)] flex-col outline-none',
      // Hairline border *and* the one shadow in the system. The border is what
      // keeps the panel legible against a dark canvas, where a shadow alone
      // reads as nothing at all.
      'rounded-surface border border-line bg-bg p-6 shadow-overlay',
      'transition-[opacity,translate,scale] duration-normal ease-editorial',
      // A short rise rather than a scale. Editorial interfaces should not
      // appear to zoom.
      'data-[starting-style]:translate-y-[calc(-50%+0.5rem)] data-[starting-style]:opacity-0',
      'data-[ending-style]:translate-y-[calc(-50%+0.5rem)] data-[ending-style]:opacity-0',
      // Respect the user's motion preference. A design system should do this
      // once, centrally, rather than leaving it to each consumer.
      'motion-reduce:transition-none',
      'motion-reduce:data-[starting-style]:translate-y-[-50%] motion-reduce:data-[ending-style]:translate-y-[-50%]',
    ],
    title: 'text-heading text-fg',
    description: 'mt-2 text-body text-fg-muted',
    // Separated by a hairline rather than whitespace alone, and pulled to the
    // panel edges so the rule spans the full width.
    footer: 'mt-6 -mx-6 -mb-6 flex flex-row-reverse gap-2 border-t border-line px-6 py-4',
  },
  variants: {
    size: {
      sm: { popup: 'max-w-sm' },
      md: { popup: 'max-w-md' },
      lg: { popup: 'max-w-xl' },
      full: { popup: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type DialogVariants = VariantPropsOf<typeof dialogStyles.popup>;

const [VariantsProvider, useDialogVariants] = createVariantContext<DialogVariants>(
  'DialogVariantsContext',
);

export interface DialogBackdropProps extends BaseDialog.Backdrop.Props, DialogVariants {}
export interface DialogPopupProps extends BaseDialog.Popup.Props, DialogVariants {}
export interface DialogTitleProps extends BaseDialog.Title.Props {}
export interface DialogDescriptionProps extends BaseDialog.Description.Props {}

/*
 * `Root` renders no DOM element of its own — it is pure state. There is nothing
 * to style, so it is re-exported untouched rather than wrapped. Wrapping it
 * would only add a component to the tree and a `className` prop that goes
 * nowhere. The same reasoning applies to `Trigger`, which takes its appearance
 * from whatever it is composed with via `render`.
 */
export const DialogRoot = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;

export interface DialogPortalProps extends BaseDialog.Portal.Props {}

/**
 * `Portal` has no styles either, but it does need one behavioural change:
 * defaulting its mount point to the themed container from `SpecialUIProvider`.
 *
 * Without this, a dialog opened from inside a scoped `<div className="dark">`
 * mounts on `document.body`, outside the element that defines the dark tokens,
 * and renders with light colors. An explicit `container` prop still wins, and
 * with no provider present this falls through to Base UI's own default.
 */
export function DialogPortal(props: DialogPortalProps) {
  const themedContainer = usePortalContainer();
  const { container = themedContainer ?? undefined, ...rest } = props;

  return <BaseDialog.Portal container={container} {...rest} />;
}

export const DialogBackdrop = createStyledPart<DialogBackdropProps>(
  BaseDialog.Backdrop,
  dialogStyles.backdrop,
  { displayName: 'Dialog.Backdrop' },
);

/**
 * The dialog surface. Owns the `size` variant for the rest of the parts.
 */
export const DialogPopup = createStyledPart<DialogPopupProps>(
  BaseDialog.Popup,
  dialogStyles.popup,
  {
    displayName: 'Dialog.Popup',
    provideVariants: VariantsProvider,
  },
);

export const DialogTitle = createStyledPart<DialogTitleProps>(
  BaseDialog.Title,
  dialogStyles.title,
  { displayName: 'Dialog.Title', useVariants: useDialogVariants },
);

export const DialogDescription = createStyledPart<DialogDescriptionProps>(
  BaseDialog.Description,
  dialogStyles.description,
  { displayName: 'Dialog.Description', useVariants: useDialogVariants },
);

/**
 * Reuses the button's variants but flips the default, since a dismiss action
 * should not be the loudest thing in the dialog. Re-defaulting a variants
 * function this way keeps the two components from drifting apart while still
 * letting a consumer write `<Dialog.Close variant="danger">`.
 */
const closeStyles = Object.assign(
  (props?: VariantPropsOf<typeof buttonStyles> & { class?: string }) =>
    buttonStyles({ variant: 'secondary', ...props }),
  { variantKeys: buttonStyles.variantKeys },
);

export interface DialogCloseProps
  extends BaseDialog.Close.Props,
    VariantPropsOf<typeof buttonStyles> {}

/**
 * A close button. Composes `buttonStyles` so that a dialog's dismiss action and
 * a standalone `<Button>` cannot drift apart visually.
 */
export const DialogClose = createStyledPart<DialogCloseProps>(BaseDialog.Close, closeStyles, {
  displayName: 'Dialog.Close',
});

/**
 * A layout-only part that Base UI does not provide.
 *
 * Built on Base UI's public `useRender` hook rather than a bare `<div>`, so it
 * keeps the same `render` escape hatch as every other part in the library. This
 * is the seam to use whenever the design system needs a part that has no
 * behavioural counterpart upstream.
 */
export interface DialogFooterProps extends useRender.ComponentProps<'div'> {}

export const DialogFooter = React.forwardRef(function DialogFooter(
  props: DialogFooterProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, ...elementProps } = props;

  return useRender({
    render,
    ref: forwardedRef,
    defaultTagName: 'div',
    props: { ...elementProps, className: cn(dialogStyles.footer(), className) },
  });
});
