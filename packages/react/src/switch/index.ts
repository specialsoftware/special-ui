/**
 * Base UI's namespace-export pattern, kept deliberately: the component is used
 * as `<Switch.Root>` / `<Switch.Thumb>`, but each part is still a separate
 * module, so a bundler can tree-shake the parts a consumer never renders.
 */
export * as Switch from './index.parts';

export { switchStyles } from './Switch';
export type { SwitchRootProps, SwitchThumbProps, SwitchVariants } from './Switch';
