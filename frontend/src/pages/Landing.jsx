import { useState } from 'react'

const LandingPage = ({ onGetStarted }) => {
  // Scroll helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="mt-6 space-y-14 sm:space-y-16 md:space-y-20 pb-10 sm:pb-14 md:pb-16 px-2 sm:px-4 md:px-0">
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection id="features" />
      <HowItWorksSection id="how-it-works" />
      <InteractiveDemoSection />
      <TestimonialsSection id="testimonials" />
      <FooterSection scrollToSection={scrollToSection} />
    </div>
  )
}

const HeroSection = ({ onGetStarted }) => (
  <section className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
    {/* ... your hero content unchanged ... */}
  </section>
)

const HeroDashboardCard = () => (
  <div className="relative mx-auto w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-white/95 p-4 sm:p-5 text-slate-900 shadow-2xl shadow-slate-900/40 ring-1 ring-slate-200/80">
    {/* ... unchanged */}
  </div>
)

const FeaturesSection = ({ id }) => {
  const features = [
    { title: 'Smart tracking', description: 'Auto-categorize your expenses and see exactly where your money goes.', icon: '📊' },
    { title: 'AI predictions', description: "Forecast next month's spending using your real patterns — not guesses.", icon: '🤖' },
    { title: 'Alerts & insights', description: 'Get notified before you overspend and discover hidden trends.', icon: '🔔' },
    { title: 'Secure & private', description: 'Bank level encryption and privacy by design keep your data safe.', icon: '🔒' },
  ]

  return (
    <section id={id} className="space-y-6">
      {/* ... unchanged */}
    </section>
  )
}

const HowItWorksSection = ({ id }) => {
  const steps = [
    { title: 'Connect & capture', description: 'Link accounts or add expenses manually — it takes seconds to get started.', label: 'Step 1' },
    { title: 'See where it goes', description: 'We categorize every transaction and visualize your spending in real time.', label: 'Step 2' },
    { title: 'Predict & plan ahead', description: 'Our AI forecasts next month so you can plan with confidence.', label: 'Step 3' },
  ]

  return (
    <section id={id} className="space-y-6">
      {/* ... unchanged */}
    </section>
  )
}

const InteractiveDemoSection = () => {
  const [budget, setBudget] = useState(30000)
  const [includeOneTime, setIncludeOneTime] = useState(true)
  const basePrediction = budget * 1.05
  const prediction = includeOneTime ? basePrediction * 1.06 : basePrediction
  const confidence = includeOneTime ? 0.88 : 0.93

  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] md:items-center">
      {/* ... unchanged */}
    </section>
  )
}

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative flex h-5 w-9 items-center rounded-full border border-slate-300 bg-slate-200 px-0.5 transition ${
      checked ? 'bg-emerald-500/90 border-emerald-500' : ''
    }`}
  >
    <span
      className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
        checked ? 'translate-x-4' : ''
      }`}
    />
  </button>
)

const TestimonialsSection = ({ id }) => {
  const testimonials = [
    { name: 'Ananya Sharma', role: 'Marketing Manager', quote: 'ExpenseAI finally helped me understand where my salary disappears every month. The predictions keep me honest.' },
    { name: 'Rahul Verma', role: 'Freelance Developer', quote: 'I love how simple it is. I log expenses on the go and the app tells me if next month looks risky.' },
    { name: 'Priya Iyer', role: 'Product Designer', quote: 'The UI is clean, the charts are beautiful, and I feel more in control of my finances.' },
  ]

  return (
    <section id={id} className="space-y-6">
      {/* ... unchanged */}
    </section>
  )
}

// Footer updated for smooth scrolling
const FooterSection = ({ scrollToSection }) => (
  <footer className="mt-6 rounded-2xl bg-slate-950/40 px-4 py-5 text-xs text-slate-300 ring-1 ring-white/10">
    <div className="grid gap-4 sm:grid-cols-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-50">ExpenseAI</p>
        <p className="text-[11px] text-slate-400">
          Track every rupee, understand your habits, and let AI help you plan what comes next.
        </p>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Product</p>
        <ul className="space-y-1 text-[11px]">
          <li>
            <button
              onClick={() => scrollToSection('features')}
              className="text-slate-300 hover:text-slate-100 transition-colors"
            >
              Features
            </button>
          </li>
          <li><span className="text-slate-500">Pricing</span></li>
          <li><span className="text-slate-500">FAQ</span></li>
        </ul>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Company</p>
        <ul className="space-y-1 text-[11px]">
          <li><span className="text-slate-500">About</span></li>
          <li><span className="text-slate-500">Contact</span></li>
        </ul>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Legal</p>
        <ul className="space-y-1 text-[11px]">
          <li><span className="text-slate-500">Privacy policy</span></li>
          <li><span className="text-slate-500">Terms of use</span></li>
        </ul>
      </div>
    </div>
    <div className="mt-4 flex flex-col items-start justify-between gap-2 border-t border-slate-800/80 pt-3 text-[11px] text-slate-500 sm:flex-row sm:items-center">
      <p>© {new Date().getFullYear()} ExpenseAI. All rights reserved.</p>
      <div className="flex gap-3">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-300 transition-colors">Twitter</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-300 transition-colors">LinkedIn</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-300 transition-colors">Instagram</a>
      </div>
    </div>
  </footer>
)

export default LandingPage
