'use client';
import * as React from 'react';
import { cn } from '../styles/cn';
import { splitVariantProps } from '../styles/variants';
import { resolveClassName } from './resolveClassName';

export interface CreateStyledPartOptions {
  /** Shown in React DevTools and in error messages. */
  displayName: string;
  /**
   * Reads variant values published by an ancestor part, so that
   * `<Switch.Root size="lg">` can style `<Switch.Thumb />` without the consumer
   * repeating the variant on every child.
   */
  useVariants?: () => Record<string, unknown> | undefined;
  /**
   * Publishes this part's resolved variants to its descendants. Set on the
   * root part of a compound component; pair it with `useVariants` on the
   * children.
   */
  provideVariants?: React.Provider<any> | undefined;
}

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) {
    return false;
  }
  for (const key of aKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

/**
 * Returns a referentially stable object as long as its own values do not
 * change, so that publishing variants through context does not re-render every
 * part on each parent render.
 */
function useShallowStable<T extends Record<string, unknown>>(value: T): T {
  const ref = React.useRef(value);
  if (!shallowEqual(ref.current, value)) {
    ref.current = value;
  }
  return ref.current;
}

/**
 * Wraps a Base UI part in a Tailwind-aware styled part.
 *
 * The wrapper is deliberately thin. It does exactly four things, and delegates
 * everything else — accessibility, focus management, state, `render`,
 * `data-*` attributes — to the Base UI component underneath:
 *
 * 1. Pulls variant props (`size`, `variant`, ...) out of the props object so they
 *    never reach the DOM as invalid attributes.
 * 2. Fills in any variant the consumer omitted from the parent's context.
 * 3. Computes the built-in classes for this slot.
 * 4. Hands Base UI a `className` *function*, so the built-in classes can be
 *    combined with the consumer's own — resolved through `twMerge` so the
 *    consumer always wins on conflicting utilities.
 *
 * Step 4 is the subtle one. Passing a function rather than a string means the
 * merge happens after Base UI has computed the part's state, which is what lets
 * a consumer write `className={(state) => ...}` and still get conflict
 * resolution against the built-in classes.
 */
export function createStyledPart<Props extends object>(
  Component: React.ElementType,
  slotFn: (props?: any) => string,
  options: CreateStyledPartOptions,
): React.ForwardRefExoticComponent<Props & React.RefAttributes<any>> {
  const { displayName, useVariants, provideVariants: VariantsProvider } = options;
  const variantKeys: Array<string | number | symbol> =
    (slotFn as { variantKeys?: Array<string | number | symbol> }).variantKeys ?? [];

  const StyledPart = React.forwardRef(function StyledPart(
    props: Record<string, any>,
    forwardedRef: React.Ref<any>,
  ) {
    const contextVariants = useVariants?.();
    const [ownVariants, elementProps] = splitVariantProps(props, variantKeys);

    const merged: Record<string, unknown> = { ...contextVariants };
    for (const key in ownVariants) {
      // An explicitly omitted prop must not clobber the inherited value.
      if (ownVariants[key] !== undefined) {
        merged[key] = ownVariants[key];
      }
    }
    const variants = useShallowStable(merged);

    const { className, ...rest } = elementProps as {
      className?: string | ((state: any) => string | undefined);
    } & Record<string, unknown>;

    const builtIn = slotFn(variants);

    const element = (
      <Component
        ref={forwardedRef}
        {...rest}
        className={(state: any) => cn(builtIn, resolveClassName(className, state))}
      />
    );

    if (VariantsProvider) {
      return <VariantsProvider value={variants}>{element}</VariantsProvider>;
    }

    return element;
  });

  StyledPart.displayName = displayName;

  return StyledPart as React.ForwardRefExoticComponent<Props & React.RefAttributes<any>>;
}

/**
 * Creates the context a compound component uses to broadcast its resolved
 * variant selection to its parts.
 *
 * Returns the provider component and the hook to pass as `useVariants`.
 */
export function createVariantContext<Variants extends Record<string, unknown>>(name: string) {
  const Context = React.createContext<Variants | undefined>(undefined);
  Context.displayName = name;

  function useVariantContext(): Variants | undefined {
    return React.useContext(Context);
  }

  return [Context.Provider, useVariantContext, Context] as const;
}
