import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './index';

function TestDialog(props: { size?: 'sm' | 'md' | 'lg' | 'full' }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop data-testid="backdrop" />
        <Dialog.Popup size={props.size} data-testid="popup">
          <Dialog.Title>Delete project</Dialog.Title>
          <Dialog.Description>This action cannot be undone.</Dialog.Description>
          <Dialog.Footer data-testid="footer">
            <Dialog.Close>Cancel</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

describe('Dialog', () => {
  it('is closed until the trigger is activated', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('wires the accessible name and description through Base UI', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Delete project');
    expect(dialog).toHaveAccessibleDescription('This action cannot be undone.');
  });

  it('styles the popup and applies the size variant', async () => {
    const user = userEvent.setup();
    render(<TestDialog size="lg" />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    const popup = screen.getByTestId('popup');
    expect(popup).toHaveClass('rounded-surface', 'bg-surface-raised', 'shadow-overlay');
    expect(popup).toHaveClass('max-w-xl');
  });

  it('declares the enter and exit transition hooks Base UI drives', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    const popup = screen.getByTestId('popup');
    expect(popup).toHaveClass('data-[starting-style]:opacity-0', 'data-[ending-style]:opacity-0');
    expect(screen.getByTestId('backdrop')).toHaveClass('data-[starting-style]:opacity-0');
  });

  it('closes via the Close part', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('styles Close with the neutral button tone by default', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    const close = screen.getByRole('button', { name: 'Cancel' });
    expect(close).toHaveClass('rounded-control', 'border-line');
    expect(close).not.toHaveClass('bg-brand-600');
  });

  it('renders the Footer part, which has no Base UI counterpart', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    await user.click(screen.getByRole('button', { name: 'Open' }));

    const footer = screen.getByTestId('footer');
    expect(footer.tagName).toBe('DIV');
    expect(footer).toHaveClass('flex', 'flex-row-reverse', 'gap-2');
  });

  it('keeps the render escape hatch on the Footer', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Popup>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Footer render={<footer />} data-testid="footer" />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    expect(screen.getByTestId('footer').tagName).toBe('FOOTER');
    expect(screen.getByTestId('footer')).toHaveClass('flex-row-reverse');
  });
});
