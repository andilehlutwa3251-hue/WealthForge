'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleCheck,
  GraduationCap,
  LineChart,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react'

const dimensions = [
  { label: 'Savings & liquidity', value: 76, color: '#c9a84c' },
  { label: 'Debt management', value: 62, color: '#d9c27b' },
  { label: 'Investing & growth', value: 48, color: '#8f7a39' },
  { label: 'Financial behaviour', value: 84, color: '#b79a45' },
]

const plans = [
  { id: 'builder', name: 'Builder', price: 'R149', description: 'Your full wealth foundation.', features: ['Full six-dimension Wealth Score', 'Complete Academy library', 'Stokvel tracking tools'] },
  { id: 'forge-elite', name: 'Forge Elite', price: 'R349', description: 'Your intelligent wealth advantage.', features: ['AI wealth coach', 'Advanced JSE insights', 'Group accounts and priority support'] },
]

const courses = [
  { tag: 'FOUNDATIONS', title: 'Your money, in context', meta: '4 lessons · 18 min', tone: 'gold' },
  { tag: 'DEBT', title: 'A smarter way out of debt', meta: '6 lessons · 32 min', tone: 'dark' },
  { tag: 'INVESTING', title: 'Your first JSE portfolio', meta: '5 lessons · 26 min', tone: 'cream' },
]

export function WealthForgeLanding() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  async function handleCheckout(productId: string) {
    setCheckoutPlan(productId)
    setCheckoutError('')
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const result = await response.json()
    if (!response.ok || !result.url) throw new Error(result.error || 'Checkout is unavailable.')
    window.location.href = result.url
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Checkout is unavailable.')
      setCheckoutPlan(null)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Submission failed')
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="wf-site">
      <nav className="wf-nav" aria-label="Main navigation">
        <a className="wf-wordmark" href="#top" aria-label="WealthForge home">
          <span className="wf-mark" aria-hidden="true">W</span>
          <span>WEALTH<span>FORGE</span></span>
        </a>
        <div className={`wf-nav-links ${menuOpen ? 'is-open' : ''}`}>
          <a href="#why">Why WealthForge</a>
          <a href="#how">How it works</a>
          <a href="#academy">Academy</a>
          <a href="#waitlist">Early access</a>
        </div>
        <a className="wf-nav-cta" href="#waitlist">Get early access <ArrowUpRight size={16} /></a>
        <button className="wf-menu" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <section className="wf-hero" id="top">
        <div className="wf-hero-copy">
          <p className="wf-eyebrow"><span className="wf-eyebrow-line" /> THE WEALTH OPERATING SYSTEM FOR SOUTH AFRICA</p>
          <h1>Make your money<br /><em>work harder.</em></h1>
          <p className="wf-hero-text">A clearer picture of your wealth. A smarter path forward. WealthForge brings your score, your strategy, and your next best move into one place.</p>
          <div className="wf-hero-actions">
            <a className="wf-button wf-button-gold" href="#waitlist">Join the waitlist <ArrowUpRight size={17} /></a>
            <a className="wf-text-link" href="#how">See how it works <ChevronRight size={16} /></a>
          </div>
          <div className="wf-trust-row"><CircleCheck size={15} /> Built for South Africans · Private by design</div>
        </div>
        <div className="wf-score-wrap" aria-label="Example Wealth Score dashboard">
          <div className="wf-score-card">
            <div className="wf-card-top"><span className="wf-card-label">YOUR WEALTH SCORE</span><span className="wf-live-dot">LIVE PREVIEW</span></div>
            <div className="wf-score-number">742<span>/1000</span></div>
            <div className="wf-score-status"><span className="wf-status-dot" /> Building momentum <span className="wf-score-up">+38 this month</span></div>
            <div className="wf-score-divider" />
            <div className="wf-dimensions">
              {dimensions.map((dimension) => <div className="wf-dimension" key={dimension.label}><div className="wf-dim-label"><span>{dimension.label}</span><b>{dimension.value}</b></div><div className="wf-progress"><span style={{ width: `${dimension.value}%`, background: dimension.color }} /></div></div>)}
            </div>
            <div className="wf-next-move"><div className="wf-next-icon"><Sparkles size={17} /></div><div><span>NEXT BEST MOVE</span><p>Build a 3-month emergency fund</p></div><ChevronRight size={17} /></div>
          </div>
          <div className="wf-float-card wf-float-top"><span className="wf-float-icon"><LineChart size={15} /></span><span><b>+12.4%</b><small>wealth growth</small></span></div>
          <div className="wf-float-card wf-float-bottom"><span className="wf-float-icon wf-purple"><ShieldCheck size={15} /></span><span><b>POPIA protected</b><small>your data stays yours</small></span></div>
        </div>
      </section>

      <div className="wf-proof"><span>ONE SCORE.</span><span>EVERYTHING CONNECTED.</span><span>BUILT FOR REAL LIFE IN SA.</span></div>

      <section className="wf-section wf-story" id="why">
        <div className="wf-section-kicker">01 — THE GAP</div>
        <div className="wf-story-grid"><h2>South Africans know how to save.<br /><em>They deserve better tools.</em></h2><div><p className="wf-lead">Wealth in South Africa does not look like a US spreadsheet. It lives in stokvels, salary deductions, family commitments, and first-time investments.</p><p className="wf-muted">WealthForge is the first platform designed around that reality — making the invisible visible, then showing you what to do next.</p></div></div>
        <div className="wf-stat-grid"><div><b>11m</b><span>South Africans save through stokvels</span></div><div><b>R50bn</b><span>moved through community savings yearly</span></div><div><b>0–1000</b><span>one score that makes progress tangible</span></div></div>
      </section>

      <section className="wf-section wf-how" id="how">
        <div className="wf-section-kicker">02 — THE SYSTEM</div><div className="wf-section-heading"><h2>Your wealth,<br /><em>with a game plan.</em></h2><p>Measure where you stand. Learn what matters. Take the next right step.</p></div>
        <div className="wf-system-grid"><div className="wf-system-card wf-system-main"><div className="wf-system-icon"><LineChart size={20} /></div><span className="wf-card-overline">WEALTHFORGE.OS</span><h3>See the whole picture.</h3><p>Your Wealth Score turns six dimensions of your financial life into one clear, honest snapshot — with a priority list that evolves with you.</p><a href="#waitlist">Explore the score <ArrowUpRight size={15} /></a></div><div className="wf-system-card wf-system-academy" id="academy"><div className="wf-system-icon wf-icon-dark"><GraduationCap size={20} /></div><span className="wf-card-overline">WEALTHFORGE ACADEMY</span><h3>Learn what moves the needle.</h3><p>South Africa-specific lessons on debt, tax, investing, savings, and stokvels. Education that turns into action.</p><a href="#waitlist">Browse the academy <ArrowUpRight size={15} /></a></div><div className="wf-system-side"><div className="wf-side-icon"><Users size={19} /></div><h3>Save together.</h3><p>Stokvel tracking and group tools, built in from day one.</p></div><div className="wf-system-side"><div className="wf-side-icon"><Sparkles size={19} /></div><h3>Think forward.</h3><p>An AI coach that explains the why, not just the what.</p></div></div>
      </section>

      <section className="wf-section wf-academy-preview"><div className="wf-section-kicker">03 — THE ACADEMY</div><div className="wf-section-heading"><h2>Financial education<br /><em>that speaks your language.</em></h2><a className="wf-text-link" href="#waitlist">See all courses <ChevronRight size={16} /></a></div><div className="wf-course-grid">{courses.map((course, index) => <article className={`wf-course wf-course-${course.tone}`} key={course.title}><div className="wf-course-num">0{index + 1}</div><span>{course.tag}</span><h3>{course.title}</h3><p>{course.meta}</p><div className="wf-course-arrow"><ArrowUpRight size={18} /></div></article>)}</div></section>

      <section className="wf-section wf-pricing" id="pricing">
        <div className="wf-section-kicker">04 — CHOOSE YOUR PATH</div>
        <div className="wf-section-heading"><h2>Turn clarity<br /><em>into momentum.</em></h2><p>Start free. Upgrade when you are ready to build with more power.</p></div>
        <div className="wf-pricing-grid">
          {plans.map((plan) => <article className="wf-plan" key={plan.id}><div><span className="wf-card-overline">WEALTHFORGE {plan.name.toUpperCase()}</span><h3>{plan.price}<small>/ month</small></h3><p>{plan.description}</p><ul>{plan.features.map((feature) => <li key={feature}><Check size={15} /> {feature}</li>)}</ul></div><button className="wf-button wf-button-gold wf-plan-button" type="button" onClick={() => handleCheckout(plan.id)} disabled={checkoutPlan === plan.id}>{checkoutPlan === plan.id ? 'Opening secure checkout…' : 'Start building'} <ArrowUpRight size={16} /></button></article>)}
        </div>
        {checkoutError && <p className="wf-form-error" role="alert">{checkoutError}</p>}
      </section>

      <section className="wf-waitlist" id="waitlist"><div className="wf-waitlist-inner"><div><p className="wf-eyebrow"><span className="wf-eyebrow-line" /> EARLY ACCESS · 2026</p><h2>Build wealth<br /><em>with intention.</em></h2><p>We are building the wealth infrastructure South Africans have always deserved. Be first in line.</p></div><form className="wf-form" onSubmit={handleSubmit}>{submitted ? <div className="wf-success"><Check size={22} /><div><strong>You&apos;re on the list.</strong><span>We&apos;ll be in touch soon.</span></div></div> : <><label htmlFor="email">Your email address</label><div className="wf-input-row"><input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} aria-describedby={submitError ? 'waitlist-error' : undefined} /><button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Join the waitlist'} {!isSubmitting && <ArrowUpRight size={16} />}</button></div><small>By joining, you agree to receive WealthForge updates. No spam. Ever.</small>{submitError && <small id="waitlist-error" role="alert" className="wf-form-error">{submitError}</small>}</>}</form></div></section>

      <footer className="wf-footer"><a className="wf-wordmark" href="#top"><span className="wf-mark" aria-hidden="true">W</span><span>WEALTH<span>FORGE</span></span></a><p>Wealth, made clearer.</p><span className="wf-footer-note">© 2026 WealthForge · Built in South Africa</span></footer>
    </main>
  )
}

export default WealthForgeLanding
