import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button with the default variant classes', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass('bg-accent', 'h-9', 'px-4');
  });

  it('lets a consumer class override a built-in one on conflict', () => {
    render(<Button className="px-8 bg-emerald-500">Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveClass('px-8', 'bg-emerald-500');
    // This is the assertion that justifies the whole `cn`/twMerge layer.
    expect(button).not.toHaveClass('px-4');
    expect(button).not.toHaveClass('bg-accent');
  });

  it('does not leak variant props onto the DOM', () => {
    render(
      <Button variant="ghost" size="sm" fullWidth>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).not.toHaveAttribute('variant');
    expect(button).not.toHaveAttribute('size');
    expect(button).not.toHaveAttribute('fullWidth');
    expect(button).not.toHaveAttribute('fullwidth');
    expect(button).toHaveClass('w-full');
  });

  it('applies compound variants', () => {
    render(
      <Button variant="ghost" size="sm">
        Save
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveClass('px-2');
    expect(screen.getByRole('button')).not.toHaveClass('px-3');
  });

  it('supports a className function of Base UI state', () => {
    render(
      <Button disabled className={(state) => (state.disabled ? 'line-through' : 'no-underline')}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('line-through');
    expect(button).toHaveAttribute('data-disabled');
  });

  it('keeps Base UI\'s render escape hatch, styles included', () => {
    render(<Button render={<a href="/pricing" />}>Pricing</Button>);
    const link = screen.getByRole('link', { name: 'Pricing' });

    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/pricing');
    expect(link).toHaveClass('bg-accent');
  });

  it('declares a paintable focus ring', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });

    // `outline-none` sets `--tw-outline-style: none` and Tailwind v4's
    // `outline-2` resolves its style from that variable, so without
    // `outline-solid` the ring gets a width and a colour but never paints.
    // jsdom cannot evaluate that cascade, so assert the class contract instead.
    expect(button).toHaveClass(
      'focus-visible:outline-solid',
      'focus-visible:outline-2',
      'focus-visible:outline-focus',
    );
  });

  it('forwards a ref to the underlying element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);

    expect(ref.current).toBe(screen.getByRole('button'));
  });

  it('fires onClick and does not when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { rerender } = render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
