import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpecialUIProvider } from './SpecialUIProvider';
import { Dialog } from '../dialog';

function Example({ theme, wrap = true }: { theme?: string; wrap?: boolean }) {
  const dialog = (
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Popup>
          <Dialog.Title>Title</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );

  return wrap ? <SpecialUIProvider theme={theme}>{dialog}</SpecialUIProvider> : dialog;
}

describe('SpecialUIProvider', () => {
  it('mounts portalled parts inside the themed container', () => {
    render(<Example theme="dark" />);

    const dialog = screen.getByRole('dialog');
    // The regression this guards: without the provider the dialog lands on
    // document.body, escapes the `.dark` scope, and silently renders with
    // light theme tokens.
    expect(dialog.closest('.dark')).not.toBeNull();
    expect(dialog.closest('[data-special-ui-portal-container]')).not.toBeNull();
  });

  it('leaves the container unthemed when no theme is given', () => {
    render(<Example />);

    const dialog = screen.getByRole('dialog');
    expect(dialog.closest('[data-special-ui-portal-container]')).not.toBeNull();
    expect(dialog.closest('.dark')).toBeNull();
  });

  it('falls back to Base UI behaviour with no provider', () => {
    render(<Example wrap={false} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog.closest('[data-special-ui-portal-container]')).toBeNull();
  });

  it('lets an explicit container prop win', async () => {
    const target = document.createElement('div');
    target.id = 'custom-container';
    document.body.appendChild(target);

    render(
      <SpecialUIProvider theme="dark">
        <Dialog.Root defaultOpen>
          <Dialog.Portal container={target}>
            <Dialog.Popup>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </SpecialUIProvider>,
    );

    expect(screen.getByRole('dialog').closest('#custom-container')).not.toBeNull();

    target.remove();
    await Promise.resolve();
  });

  it('still opens and closes normally through the provider', async () => {
    const user = userEvent.setup();
    render(
      <SpecialUIProvider theme="dark">
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Popup>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </SpecialUIProvider>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
