import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('renders a <p> at the body role by default', () => {
    render(<Text data-testid="t">Copy</Text>);
    const el = screen.getByTestId('t');

    expect(el.tagName).toBe('P');
    expect(el).toHaveClass('text-body');
  });

  it('applies the type role', () => {
    render(
      <Text variant="eyebrow" data-testid="t">
        Components
      </Text>,
    );

    expect(screen.getByTestId('t')).toHaveClass('text-eyebrow', 'uppercase');
  });

  it('separates visual weight from document outline via render', () => {
    render(
      <Text variant="display" render={<h1 />} data-testid="t">
        Unstyled UI components
      </Text>,
    );
    const el = screen.getByTestId('t');

    expect(el.tagName).toBe('H1');
    expect(el).toHaveClass('text-display');
  });

  it('caps the measure when asked', () => {
    render(
      <Text measure data-testid="t">
        Long copy
      </Text>,
    );

    expect(screen.getByTestId('t')).toHaveClass('max-w-[68ch]');
  });

  it('lets a consumer class override the built-in size', () => {
    render(
      <Text variant="title" className="text-body" data-testid="t">
        Copy
      </Text>,
    );
    const el = screen.getByTestId('t');

    // Requires the editorial scale to be registered as a font-size class group
    // in cn.ts — otherwise twMerge treats `text-title` as a colour and keeps both.
    expect(el).toHaveClass('text-body');
    expect(el).not.toHaveClass('text-title');
  });

  it('does not leak variant props onto the DOM', () => {
    render(
      <Text variant="caption" muted measure data-testid="t">
        Copy
      </Text>,
    );
    const el = screen.getByTestId('t');

    expect(el).not.toHaveAttribute('variant');
    expect(el).not.toHaveAttribute('muted');
    expect(el).not.toHaveAttribute('measure');
  });
});
