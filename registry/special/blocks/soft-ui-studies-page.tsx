import { useState } from "react"
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Coffee, Home, ShoppingBag, Sparkles, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import "./soft-ui-studies.css"

const directions = [
  { id: "editorial", number: "01", name: "Soft editorial", note: "More room. Less friction.", description: "A spacious, gently rounded take on Special’s editorial foundation. White surfaces inside a pale blue canvas, with one clear accent.", recipe: "20px panels · pale blue canvas · generous spacing", reference: "Commas-inspired composition" },
  { id: "tactile", number: "02", name: "Tactile utility", note: "A little more feeling.", description: "Small, satisfying controls with delicate elevation. Color acts as a useful cue, while the structure stays precise.", recipe: "12px panels · soft shadows · colored signals", reference: "Procedural Sounds-inspired controls" },
  { id: "bubble", number: "03", name: "Rounded workspace", note: "Everything has its place.", description: "An airy collection of soft islands. Larger corners and inset groups make a familiar dashboard feel more approachable.", recipe: "28px panels · capsule groups · neutral palette", reference: "A synthesis for everyday product UI" },
] as const
const months = ["July", "August", "September"]
const spending = [[1480, 365, 210], [1480, 420, 285], [1480, 390, 245]]
const categories = [{ name: "Home", icon: Home, color: "peach" }, { name: "Food & coffee", icon: Coffee, color: "yellow" }, { name: "Shopping", icon: ShoppingBag, color: "violet" }]
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)

function MoneyStudy({ direction, baseline }: { direction: typeof directions[number]; baseline: boolean }) {
  const [month, setMonth] = useState(1)
  const [selected, setSelected] = useState(1)
  const [contribution, setContribution] = useState(250)
  const [goalName, setGoalName] = useState("A little time away")
  const [savedGoal, setSavedGoal] = useState("A little time away")
  const [saved, setSaved] = useState(false)
  const values = spending[month]
  const total = values.reduce((sum, value) => sum + value, 0)
  const remaining = 4200 - total - contribution
  return (
    <section id={direction.id} className="soft-study">
      <div className="soft-study-heading">
        <div><span className="soft-index">{direction.number} / {direction.reference}</span><h2>{direction.name}</h2><p>{direction.description}</p></div>
        <span className="soft-recipe">{baseline ? "Original Special UI geometry" : direction.recipe}</span>
      </div>
      <div className={`soft-demo soft-${direction.id} ${baseline ? "soft-baseline" : ""}`}>
        <div className="soft-demo-top"><a href="#" aria-label="Back to design studies"><span className="soft-brand-mark" />special<span className="soft-brand-muted"> / everyday</span></a><span className="soft-account">JD</span></div>
        <div className="soft-workspace">
          <div className="soft-intro"><span className="soft-eyebrow">YOUR MONTH, AT A GLANCE</span><h3>{direction.note}</h3><p>A clear view of what’s yours to spend.</p></div>
          <div className="soft-month" aria-label={`${direction.name} month selector`}><Button variant="ghost" size="icon" aria-label={`Previous month in ${direction.name}`} disabled={month === 0} onClick={() => setMonth(month - 1)}><ChevronLeft /></Button><span aria-live="polite">{months[month]} 2026</span><Button variant="ghost" size="icon" aria-label={`Next month in ${direction.name}`} disabled={month === 2} onClick={() => setMonth(month + 1)}><ChevronRight /></Button></div>
          <Card className="soft-balance soft-panel">
            <div className="soft-label"><span className="soft-icon"><Wallet size={18} /></span> Left to spend</div>
            <div className="soft-big-number" aria-live="polite">{money(remaining)}<span>.00</span></div>
            <p>Your bills and savings are accounted for.</p>
            <div className="soft-balance-metrics"><div><span><ArrowDownLeft size={14} /> Income</span><strong>$4,200</strong></div><div><span><ArrowUpRight size={14} /> Spending</span><strong>{money(total)}</strong></div></div>
            <div className="soft-money-track" aria-label={`${money(total)} spent, ${money(contribution)} saved, ${money(remaining)} remaining`} role="img"><span style={{ width: `${total / 42}%` }} /><span style={{ width: `${contribution / 42}%` }} /><span style={{ flex: 1 }} /></div>
            <div className="soft-track-label"><span>Already spoken for</span><span>{Math.round(remaining / 42)}% available</span></div>
          </Card>
          <Card className="soft-spending soft-panel">
            <div className="soft-panel-title"><h4>Where it went</h4><span>{months[month]}</span></div>
            <div className="soft-category-list">{categories.map(({ name, icon: Icon, color }, index) => <Button key={name} variant="ghost" className={`soft-category ${selected === index ? "is-selected" : ""}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><span className={`soft-category-icon ${color}`}><Icon size={17} /></span><span>{name}</span><strong>{money(values[index])}</strong><ChevronRight size={14} /></Button>)}</div>
            <div className="soft-category-detail" aria-live="polite"><span className={`soft-dot ${categories[selected].color}`} /><span>{categories[selected].name}</span><strong>{Math.round(values[selected] / total * 100)}% of spending</strong></div>
          </Card>
          <Card className="soft-goal soft-panel">
            <div className="soft-panel-title"><h4><Sparkles size={16} /> {savedGoal}</h4><span className="soft-pill">Savings goal</span></div>
            <div className="soft-goal-body"><div className="soft-goal-summary"><span className="soft-muted">Set aside this month</span><strong>{money(contribution)}</strong><span className="soft-muted">{money(1250 + contribution)} of $3,000 saved</span></div><div className="soft-goal-controls"><label htmlFor={`${direction.id}-amount`}>Monthly contribution <span>{money(contribution)}</span></label><input id={`${direction.id}-amount`} type="range" min="50" max="600" step="25" value={contribution} onChange={(event) => { setContribution(Number(event.target.value)); setSaved(false) }} /><div className="soft-range-label"><span>$50</span><span>$600</span></div></div></div>
            <form onSubmit={(event) => { event.preventDefault(); setSavedGoal(goalName.trim()); setSaved(true) }} className="soft-goal-form"><label className="sr-only" htmlFor={`${direction.id}-name`}>Goal name</label><Input id={`${direction.id}-name`} required maxLength={60} value={goalName} onChange={(event) => { setGoalName(event.target.value); setSaved(false) }} /><Button type="submit" disabled={!goalName.trim()}>{saved ? <Check size={16} /> : <ArrowRight size={16} />}{saved ? "Saved" : "Save goal"}</Button></form><span className="soft-save-status" role="status">{saved ? "Saved for this preview session." : "Try a contribution or give your goal a name."}</span>
          </Card>
        </div>
        <div className="soft-demo-footer"><span><span className="soft-status-dot" /> All caught up</span><span>Sample account · Nothing connected</span></div>
      </div>
    </section>
  )
}

export function SoftUiStudiesPage() {
  const [baseline, setBaseline] = useState(false)
  return <div className="special-ui-theme soft-studies-page"><header className="soft-lab-header"><a href="/">Special UI <span>/ Studies</span></a><a href="#references">Reference notes <ArrowRight size={14} /></a></header><main className="soft-lab-main"><div className="soft-lab-intro"><span className="soft-index">DESIGN EXPLORATIONS / 04</span><h1>A softer side of Special.</h1><p>The same foundations, with a little more room to breathe. Three directions for lighter, friendlier product interfaces.</p><div className="soft-lab-tools"><nav aria-label="Design directions">{directions.map(d => <a key={d.id} href={`#${d.id}`}>{d.number} {d.name}</a>)}</nav><Button variant="outline" aria-pressed={baseline} onClick={() => setBaseline(!baseline)}>{baseline ? "Show soft treatments" : "Compare original geometry"}</Button></div></div>{directions.map(direction => <MoneyStudy key={direction.id} direction={direction} baseline={baseline} />)}<section id="references" className="soft-reference-notes"><span className="soft-index">WHAT CHANGES THE FEEL</span><h2>Soft minimalism, with tactile details.</h2><p>“Lighter / bubblier” is a useful description. The shift is about space, surface, and geometry as much as color. These are descriptive design labels, rather than a formal genre.</p><div><article><h3><a href="https://commas.com/" target="_blank" rel="noreferrer">Commas ↗</a></h3><p>Editorial whitespace, pale blue framing, and rounded white panels inform the first study. Its composition is translated into a finance workspace.</p></article><article><h3><a href="https://procedural-sounds.vercel.app/" target="_blank" rel="noreferrer">Procedural Sounds ↗</a></h3><p>Rounded panels, lightly raised controls, and tiny colorful signals inform the second. Physical cues without heavy skeuomorphism.</p></article><article><h3>Still Special</h3><p>Inter, neutral text, clear hierarchy, and the existing Button, Input, and Card primitives. All styling stays local to these explorations.</p></article></div><p className="soft-reference-footnote">Each study uses identical sample data and independent controls. “Original geometry” compares corners, spacing, borders, and elevation inside these new layouts; it is not a screenshot of the current playground.</p></section></main></div>
}
