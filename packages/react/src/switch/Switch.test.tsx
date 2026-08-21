import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './index';

function renderSwitch(rootProps: React.ComponentProps<typeof Switch.Root> = {}) {
  render(
    <Switch.Root aria-label="Notifications" {...rootProps}>
      <Switch.Thumb data-testid="thumb" />
    </Switch.Root>,
  );

  return {
    root: screen.getByRole('switch'),
    thumb: screen.getByTestId('thumb'),
  };
}

describe('Switch', () => {
  it('renders the Base UI switch semantics', () => {
    const { root } = renderSwitch();

    expect(root).toHaveAttribute('role', 'switch');
    expect(root).toHaveAttribute('aria-checked', 'false');
    expect(root).toHaveAttribute('data-unchecked');
  });

  it('inherits variants from the root to the thumb', () => {
    const { root, thumb } = renderSwitch({ size: 'lg' });

    expect(root).toHaveClass('h-7', 'w-13');
    expect(thumb).toHaveClass('size-[1.625rem]', 'data-checked:translate-x-6');
  });

  it('falls back to the default variant when none is given', () => {
    const { root, thumb } = renderSwitch();

    expect(root).toHaveClass('h-6', 'w-11');
    expect(thumb).toHaveClass('size-[1.375rem]');
  });

  it('lets a part override the inherited variant', () => {
    render(
      <Switch.Root size="sm" aria-label="Notifications">
        <Switch.Thumb size="lg" data-testid="thumb" />
      </Switch.Root>,
    );

    expect(screen.getByRole('switch')).toHaveClass('h-5', 'w-9');
    expect(screen.getByTestId('thumb')).toHaveClass('size-[1.625rem]');
  });

  it('applies the variant to both slots as declared', () => {
    const { root, thumb } = renderSwitch({ variant: 'danger' });

    expect(root).toHaveClass('data-checked:bg-danger');
    expect(thumb).toHaveClass('data-checked:bg-danger-fg');
    // The root's own colour must not leak onto the thumb.
    expect(thumb).not.toHaveClass('data-checked:bg-danger');
  });

  it('toggles and reports the change', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { root } = renderSwitch({ onCheckedChange });

    await user.click(root);

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange.mock.calls[0][0]).toBe(true);
    expect(root).toHaveAttribute('data-checked');
    expect(root).not.toHaveAttribute('data-unchecked');
  });

  it('works as a controlled component', () => {
    const { root } = renderSwitch({ checked: true, onCheckedChange: () => {} });

    expect(root).toHaveAttribute('aria-checked', 'true');
    expect(root).toHaveAttribute('data-checked');
  });

  it('lets a consumer class override a built-in one', () => {
    const { root } = renderSwitch({ className: 'h-10' });

    expect(root).toHaveClass('h-10');
    expect(root).not.toHaveClass('h-6');
  });

  it('declares a paintable focus ring', () => {
    const { root } = renderSwitch();

    expect(root).toHaveClass('focus-visible:outline-solid', 'focus-visible:outline-2');
  });

  it('does not leak variant props onto the DOM', () => {
    const { root, thumb } = renderSwitch({ size: 'lg', variant: 'danger' });

    expect(root).not.toHaveAttribute('size');
    expect(root).not.toHaveAttribute('variant');
    expect(thumb).not.toHaveAttribute('size');
  });
});
