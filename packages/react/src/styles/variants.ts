import { cn, type ClassValue } from './cn';

/**
 * A map of variant value -> classes. e.g. `{ sm: 'h-8', md: 'h-10' }`
 */
type VariantOptions = Record<string, ClassValue>;

/**
 * A map of variant name -> its options. e.g. `{ size: { sm: 'h-8' } }`
 */
type VariantMap = Record<string, VariantOptions>;

/**
 * Boolean variants are declared with `'true'` / `'false'` keys but should be
 * *consumed* as real booleans (`<Button loading />`), so map them back.
 */
type VariantValue<T> = T extends 'true' | 'false' ? boolean : T;

/**
 * The props a variants function accepts: one optional key per declared variant.
 */
export type VariantSelection<V> = {
  [K in keyof V]?: VariantValue<keyof V[K]> | undefined;
};

export interface VariantsFn<V extends VariantMap> {
  (props?: VariantSelection<V> & { class?: ClassValue }): string;
  /** The names of every declared variant, used to split variant props from DOM props. */
  variantKeys: Array<keyof V>;
}

export interface VariantsConfig<V extends VariantMap> {
  /** Classes applied to every instance. */
  base?: ClassValue;
  variants?: V;
  defaultVariants?: VariantSelection<V>;
  /** Extra classes applied only when *all* listed variants match. */
  compoundVariants?: Array<VariantSelection<V> & { class: ClassValue }>;
}

function selectionMatches(
  selection: Record<string, unknown>,
  condition: Record<string, unknown>,
): boolean {
  for (const key in condition) {
    if (key === 'class') {
      continue;
    }
    if (normalize(selection[key]) !== normalize(condition[key])) {
      return false;
    }
  }
  return true;
}

function normalize(value: unknown): string | undefined {
  return value === undefined || value === null ? undefined : String(value);
}

/**
 * Builds a class-name function for a single-element component.
 *
 * ```ts
 * const button = defineVariants({
 *   base: 'inline-flex items-center rounded-md',
 *   variants: {
 *     variant: { primary: 'bg-accent text-accent-fg', ghost: 'bg-transparent' },
 *     size: { sm: 'h-8 px-3', md: 'h-10 px-4' },
 *   },
 *   defaultVariants: { variant: 'primary', size: 'md' },
 * });
 *
 * button({ size: 'sm' }); // -> "inline-flex items-center rounded-md bg-accent text-accent-fg h-8 px-3"
 * ```
 */
export function defineVariants<V extends VariantMap>(config: VariantsConfig<V>): VariantsFn<V> {
  const { base, variants, defaultVariants, compoundVariants } = config;
  const variantKeys = (variants ? Object.keys(variants) : []) as Array<keyof V>;

  const fn: VariantsFn<V> = (props) => {
    const selection = { ...defaultVariants, ...props } as Record<string, unknown>;
    const classes: ClassValue[] = [base];

    if (variants) {
      for (const name of variantKeys as string[]) {
        const value = normalize(selection[name]);
        if (value !== undefined) {
          classes.push(variants[name]?.[value]);
        }
      }
    }

    if (compoundVariants) {
      for (const compound of compoundVariants) {
        if (selectionMatches(selection, compound as Record<string, unknown>)) {
          classes.push(compound.class);
        }
      }
    }

    classes.push(props?.class);

    return cn(classes);
  };

  fn.variantKeys = variantKeys;
  return fn;
}

/* -------------------------------------------------------------------------- */
/*                                   Slots                                     */
/* -------------------------------------------------------------------------- */

type SlotMap = Record<string, ClassValue>;
type SlotClasses<S extends SlotMap> = Partial<Record<keyof S, ClassValue>>;
type SlotVariantMap<S extends SlotMap> = Record<string, Record<string, SlotClasses<S>>>;

export type SlotsFn<S extends SlotMap, V extends SlotVariantMap<S>> = {
  // Each slot carries `variantKeys` of its own, because a slot function is
  // handed to `createStyledPart` on its own, detached from this container.
  [K in keyof S]: ((props?: VariantSelection<V> & { class?: ClassValue }) => string) & {
    variantKeys: Array<keyof V>;
  };
} & {
  variantKeys: Array<keyof V>;
};

export interface SlotsConfig<S extends SlotMap, V extends SlotVariantMap<S>> {
  slots: S;
  variants?: V;
  defaultVariants?: VariantSelection<V>;
  compoundVariants?: Array<VariantSelection<V> & { class: SlotClasses<S> }>;
}

/**
 * The multi-part counterpart of {@link defineVariants}, for compound components.
 *
 * One variant selection (`size`, `variant`, ...) drives the classes of every part
 * at once, which is exactly what a compound component needs: `<Switch size="lg">`
 * has to resize both the track and the thumb, but the consumer should only say
 * it once.
 *
 * ```ts
 * const switchStyles = defineSlots({
 *   slots: { root: 'relative rounded-full', thumb: 'block rounded-full bg-white' },
 *   variants: {
 *     size: {
 *       sm: { root: 'h-5 w-9', thumb: 'size-4' },
 *       md: { root: 'h-6 w-11', thumb: 'size-5' },
 *     },
 *   },
 *   defaultVariants: { size: 'md' },
 * });
 *
 * switchStyles.root({ size: 'sm' });
 * switchStyles.thumb({ size: 'sm' });
 * ```
 */
export function defineSlots<S extends SlotMap, V extends SlotVariantMap<S>>(
  config: SlotsConfig<S, V>,
): SlotsFn<S, V> {
  const { slots, variants, defaultVariants, compoundVariants } = config;
  const variantKeys = (variants ? Object.keys(variants) : []) as Array<keyof V>;

  const result = { variantKeys } as SlotsFn<S, V>;

  for (const slotName of Object.keys(slots) as Array<keyof S & string>) {
    const slotFn = (props?: VariantSelection<V> & { class?: ClassValue }) => {
      const selection = { ...defaultVariants, ...props } as Record<string, unknown>;
      const classes: ClassValue[] = [slots[slotName]];

      if (variants) {
        for (const name of variantKeys as string[]) {
          const value = normalize(selection[name]);
          if (value !== undefined) {
            classes.push(variants[name]?.[value]?.[slotName]);
          }
        }
      }

      if (compoundVariants) {
        for (const compound of compoundVariants) {
          if (selectionMatches(selection, compound as Record<string, unknown>)) {
            classes.push(compound.class[slotName]);
          }
        }
      }

      classes.push(props?.class);

      return cn(classes);
    };

    slotFn.variantKeys = variantKeys;
    (result as Record<string, unknown>)[slotName] = slotFn;
  }

  return result;
}

/**
 * Splits a props object into the variant props declared by `keys` and
 * everything else, so that variant props never leak onto the DOM as invalid
 * attributes.
 */
export function splitVariantProps<P extends Record<string, any>>(
  props: P,
  keys: Array<string | number | symbol>,
): [Record<string, unknown>, Record<string, unknown>] {
  const variantProps: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const key in props) {
    if (keys.includes(key)) {
      variantProps[key] = props[key];
    } else {
      rest[key] = props[key];
    }
  }

  return [variantProps, rest];
}
