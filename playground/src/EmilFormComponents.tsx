import { useRef, useState } from 'react'
import { Select } from '@base-ui/react/select'
import { Menu } from '@base-ui/react/menu'
import { Tooltip } from '@base-ui/react/tooltip'
import { Archive, Check, ChevronDown, Copy, Link, MoreHorizontal, Pencil, Plus } from 'lucide-react'

export function EmilFormComponents({ notify }: { notify: (message: string) => void }) {
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null)
  const [name, setName] = useState('Website refresh')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [role, setRole] = useState('editor')
  const [project, setProject] = useState('Website refresh')
  const nameInput = useRef<HTMLInputElement>(null)
  const emailInput = useRef<HTMLInputElement>(null)
  const emailError = submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email address.' : ''
  const nameError = submitted && !name.trim() ? 'Enter a project name.' : ''
  const roles = [{ value: 'viewer', label: 'Viewer' }, { value: 'editor', label: 'Editor' }, { value: 'admin', label: 'Admin' }]
  function submit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (!name.trim()) { nameInput.current?.focus(); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailInput.current?.focus(); return }
    notify('Project details saved')
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(location.href); notify('Link copied') }
    catch { notify('Copy the URL from your browser to share this page.') }
  }
  return <>
    <article className="ek-specimen"><div className="ek-specimen-label"><span>07</span> Inputs & validation</div><div className="ek-demo ek-form-demo"><form className="ek-form" noValidate onSubmit={submit}>
      <div className="ek-form-field"><label htmlFor="ek-project-name">Project name</label><input className="ek-input" ref={nameInput} id="ek-project-name" value={name} onChange={event => setName(event.target.value)} required aria-invalid={!!nameError} aria-describedby={nameError ? 'ek-name-error' : undefined}/>{nameError && <p className="ek-field-error" id="ek-name-error">{nameError}</p>}</div>
      <div className="ek-form-field"><label htmlFor="ek-project-email">Contact email</label><input className="ek-input" ref={emailInput} id="ek-project-email" type="email" autoComplete="email" placeholder="jane@studio.com" value={email} onChange={event => setEmail(event.target.value)} required aria-invalid={!!emailError} aria-describedby={emailError ? 'ek-contact-error' : undefined}/>{emailError && <p className="ek-field-error" id="ek-contact-error">{emailError}</p>}</div>
      <div className="ek-form-field"><label htmlFor="ek-project-description">Description <span>Optional</span></label><textarea className="ek-input" id="ek-project-description" rows={2} maxLength={240} value={description} onChange={event => setDescription(event.target.value)}/></div>
      <button className="ek-button" type="submit">Save details</button>
    </form></div></article>
    <article className="ek-specimen"><div className="ek-specimen-label"><span>08</span> Select</div><div className="ek-demo ek-select-demo"><div className="ek-form"><label id="ek-role-label">Member role</label><Select.Root items={roles} value={role} onValueChange={value => { if (value) setRole(value) }}><Select.Trigger className="ek-input ek-select-trigger" aria-labelledby="ek-role-label"><Select.Value/><Select.Icon><ChevronDown size={14}/></Select.Icon></Select.Trigger><Select.Portal container={portalHost}><Select.Positioner className="ek-floating-positioner" sideOffset={6} align="start" alignItemWithTrigger={false}><Select.Popup className="ek-floating ek-select-popup"><Select.List>{roles.map(item => <Select.Item className="ek-option" key={item.value} value={item.value}><Select.ItemText>{item.label}</Select.ItemText><Select.ItemIndicator><Check size={13}/></Select.ItemIndicator></Select.Item>)}</Select.List></Select.Popup></Select.Positioner></Select.Portal></Select.Root><p className="ek-field-help">{role === 'viewer' ? 'Can view projects.' : role === 'editor' ? 'Can create and edit projects.' : 'Can manage projects, members, and settings.'}</p><label htmlFor="ek-disabled-select">Workspace</label><select id="ek-disabled-select" className="ek-input" disabled><option>Acme studio</option></select></div></div></article>
    <article className="ek-specimen"><div className="ek-specimen-label"><span>09</span> Dropdown menu</div><div className="ek-demo"><div className="ek-menu-demo"><span>{project}</span><Menu.Root><Menu.Trigger className="ek-icon ek-bordered" aria-label="Project actions"><MoreHorizontal size={16}/></Menu.Trigger><Menu.Portal container={portalHost}><Menu.Positioner className="ek-floating-positioner" sideOffset={6} align="end"><Menu.Popup className="ek-floating ek-menu-popup"><Menu.Item className="ek-option" onClick={() => { setProject(`${project} copy`); notify('Project duplicated') }}><Copy size={14}/> Duplicate</Menu.Item><Menu.Item className="ek-option" onClick={copyLink}><Link size={14}/> Copy link</Menu.Item><div className="ek-menu-separator" role="separator"/><Menu.Item className="ek-option" onClick={() => { setProject('Archived project'); notify('Project archived') }}><Archive size={14}/> Archive</Menu.Item></Menu.Popup></Menu.Positioner></Menu.Portal></Menu.Root></div></div></article>
    <article className="ek-specimen"><div className="ek-specimen-label"><span>10</span> Tooltips</div><div className="ek-demo"><Tooltip.Provider delay={500} closeDelay={100}><div className="ek-tooltip-toolbar" role="group" aria-label="Project toolbar">{[
      { label: 'New project', icon: <Plus size={16}/>, action: () => notify('New project created') },
      { label: 'Edit project', icon: <Pencil size={15}/>, action: () => { nameInput.current?.focus(); nameInput.current?.scrollIntoView({ block: 'center' }) } },
      { label: 'Copy link', icon: <Link size={15}/>, action: copyLink },
      { label: 'Archive project', icon: <Archive size={15}/>, action: () => { setProject('Archived project'); notify('Project archived') } },
    ].map(item => <Tooltip.Root key={item.label}><Tooltip.Trigger className="ek-icon" aria-label={item.label} onClick={item.action}>{item.icon}</Tooltip.Trigger><Tooltip.Portal container={portalHost}><Tooltip.Positioner className="ek-floating-positioner" sideOffset={8}><Tooltip.Popup className="ek-tooltip-popup">{item.label}</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal></Tooltip.Root>)}</div></Tooltip.Provider></div></article>
    <div className="ek-portal-host" ref={setPortalHost}/>
  </>
}
