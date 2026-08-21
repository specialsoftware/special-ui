import type * as React from 'react';

/**
 * Extracts the variant props accepted by a function produced by
 * `defineVariants` or a slot of `defineSlots`.
 *
 * ```ts
 * const button = defineVariants({ variants: { size: { sm: '', md: '' } } });
 * type ButtonVariants = VariantPropsOf<typeof button>; // { size?: 'sm' | 'md' }
 * ```
 */
export type VariantPropsOf<T> = T extends (props?: infer P) => string
  ? Omit<NonNullable<P>, 'class'>
  : never;

/**
 * Every styled part keeps Base UI's `className`-as-a-function contract, so that
 * consumers can still branch on component state:
 *
 * ```tsx
 * <Switch.Thumb className={(state) => state.checked ? 'shadow-lg' : ''} />
 * ```
 */
export type StyledClassName<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

/**
 * Props that the styled layer adds on top of a Base UI part.
 */
export interface StyledPartOptions<State> {
  className?: StyledClassName<State> | undefined;
}

export type PropsWithRef<T> = T & React.RefAttributes<any>;
