import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { EmilFormComponents } from './EmilFormComponents'

describe('Playground form components', () => {
  it('focuses invalid fields and saves after correcting the email', async () => {
    const user = userEvent.setup()
    const notify = vi.fn()
    render(<EmilFormComponents notify={notify}/> )
    await user.click(screen.getByRole('button', { name: 'Save details' }))
    const email = screen.getByLabelText('Contact email')
    expect(email).toHaveFocus()
    expect(email).toHaveAccessibleDescription('Enter a valid email address.')
    expect(notify).not.toHaveBeenCalled()
    await user.type(email, 'jane@example.com')
    await user.click(screen.getByRole('button', { name: 'Save details' }))
    expect(notify).toHaveBeenCalledWith('Project details saved')
    expect(email).toHaveAttribute('aria-invalid', 'false')
  })
  it('supports role selection from the keyboard', async () => {
    const user = userEvent.setup()
    render(<EmilFormComponents notify={vi.fn()}/> )
    const select = screen.getByRole('combobox', { name: 'Member role' })
    select.focus()
    await user.keyboard('{ArrowDown}')
    await user.click(await screen.findByRole('option', { name: 'Viewer' }))
    expect(select).toHaveTextContent('Viewer')
    expect(screen.getByText('Can view projects.')).toBeVisible()
    expect(screen.getByLabelText('Workspace')).toBeDisabled()
  })
  it('duplicates a project and returns focus to the menu trigger', async () => {
    const user = userEvent.setup()
    const notify = vi.fn()
    render(<EmilFormComponents notify={notify}/> )
    const trigger = screen.getByRole('button', { name: 'Project actions' })
    await user.click(trigger)
    await user.click(await screen.findByRole('menuitem', { name: 'Duplicate' }))
    expect(screen.getByText('Website refresh copy')).toBeVisible()
    expect(notify).toHaveBeenCalledWith('Project duplicated')
    expect(trigger).toHaveFocus()
  })
})
