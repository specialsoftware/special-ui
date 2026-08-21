/**
 * Base UI lets `className` be either a string or a function of the component's
 * state (`(state) => string`). Any layer that wants to *prepend* its own
 * classes has to resolve that function itself before merging.
 */
export function resolveClassName<State>(
  className: string | ((state: State) => string | undefined) | undefined,
  state: State,
): string | undefined {
  return typeof className === 'function' ? className(state) : className;
}
