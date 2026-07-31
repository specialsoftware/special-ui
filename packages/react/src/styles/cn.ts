import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * `twMerge` needs to know about any custom utility groups introduced in
 * `theme.css`, otherwise it cannot tell that two classes conflict and will keep
 * both. Register them here as you grow the design system.
 *
 * The rule of thumb: if you add a `@utility` or a token that produces a class
 * which should *replace* another rather than stack with it, it belongs here.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // `shadow-elevated` / `shadow-overlay` are custom shadows from theme.css.
      // Without this they would not conflict with Tailwind's own `shadow-*`.
      'shadow': [{ shadow: ['elevated', 'overlay'] }],
    },
  },
});

export type { ClassValue };

/**
 * Combines conditional class names and then resolves conflicting Tailwind
 * utilities, last-one-wins.
 *
 * This is the single most important primitive in a Tailwind-first library.
 * Base UI's own `mergeProps` concatenates `className` strings without any
 * knowledge of Tailwind, so `"px-4" + "px-6"` would leave both classes on the
 * element and let CSS source order decide the winner — which is effectively
 * random from the consumer's point of view. Running everything through
 * `twMerge` before it reaches Base UI is what makes
 * `<Button className="px-6">` reliably override the built-in `px-4`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
