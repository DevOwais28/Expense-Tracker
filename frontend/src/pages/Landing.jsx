import { useState } from 'react'

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="mt-6 space-y-14 sm:space-y-16 md:space-y-20 pb-10 sm:pb-14 md:pb-16 px-2 sm:px-4 md:px-0">
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection id="features" />
      <HowItWorksSection id="how-it-works" />
      <InteractiveDemoSection />
      <TestimonialsSection id="testimonials" />
      <FooterSection />
    </div>
  )
}

const HeroSection = ({ onGetStarted }) => (
  <section className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
    <div className="space-y-6">
      <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-100/80 ring-1 ring-white/20">
        AI-powered expense insights
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
        Track, Analyze, and Predict Your Expenses Effortlessly
      </h1>
      <p className="max-w-xl text-sm leading-relaxed text-slate-100/80 sm:text-base">
        ExpenseAI helps you understand where your money goes today and uses AI to forecast what you&apos;ll
        spend next month — so you can stay ahead of every bill and goal.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onGetStarted}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/50 transition hover:translate-y-px hover:shadow-xl hover:shadow-amber-500/70"
        >
          Get Started
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-slate-50 ring-1 ring-white/20 transition hover:bg-white/15">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px]">
            ▶
          </span>
          Watch demo
        </button>
      </div>
      <div className="flex flex-wrap gap-6 text-xs text-slate-100/70">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-emerald-400/90 text-[13px] font-semibold text-slate-900 flex items-center justify-center">
            ✓
          </span>
          <span>No credit card required</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-indigo-500/90 text-[13px] font-semibold text-slate-50 flex items-center justify-center">
            ⬤
          </span>
          <span>Bank-level security</span>
        </div>
      </div>
    </div>

    <HeroDashboardCard />
  </section>
)

const HeroDashboardCard = () => (
  <div className="relative mx-auto w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-white/95 p-4 sm:p-5 text-slate-900 shadow-2xl shadow-slate-900/40 ring-1 ring-slate-200/80">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500">This month&apos;s spend</p>
        <p className="text-2xl font-semibold tracking-tight text-slate-900">₹48,320</p>
      </div>
      <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
        Under budget by ₹3,180
      </div>
    </div>

    <div className="mb-5 flex items-center gap-3 text-xs">
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-600">
        <span className="h-1.5 w-3 rounded-full bg-indigo-500" />
        Last 3 months
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
        <span className="h-1.5 w-3 rounded-full bg-emerald-500" />
        Next month (AI)
      </span>
    </div>

    <div className="relative mb-4 h-32 w-full overflow-hidden rounded-2xl bg-slate-50">
      <div className="absolute inset-4 flex items-end justify-between gap-2">
        {[40, 55, 47, 52].map((h, idx) => (
          <div key={idx} className="flex-1">
            <div
              className="mx-auto w-1 rounded-full bg-indigo-400"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
        <div className="flex-1">
          <div
            className="relative mx-auto w-1 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.8)]"
            style={{ height: '68%' }}
          >
            <div className="absolute -top-3 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-md ring-2 ring-emerald-400" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-slate-400">
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Next</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-xs text-slate-500">
      <div>
        <p className="font-medium text-slate-700">Projected next month</p>
        <p className="text-sm font-semibold text-slate-900">₹51,500</p>
      </div>
      <div className="text-right">
        <p>Confidence</p>
        <p className="text-sm font-semibold text-emerald-600">92%</p>
      </div>
    </div>
  </div>
)

const FeaturesSection = ({ id }) => {
  const features = [
    {
      title: 'Smart tracking',
      description: 'Auto-categorize your expenses and see exactly where your money goes.',
      icon: '📊',
    },
    {
      title: 'AI predictions',
      description: "Forecast next month's spending using your real patterns — not guesses.",
      icon: '🤖',
    },
    {
      title: 'Alerts & insights',
      description: 'Get notified before you overspend and discover hidden trends.',
      icon: '🔔',
    },
    {
      title: 'Secure & private',
      description: 'Bank level encryption and privacy by design keep your data safe.',
      icon: '🔒',
    },
  ]

  return (
    <section id={id} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">Why ExpenseAI?</h2>
        <p className="mt-1 text-sm text-slate-100/80">
          Everything you need to stay on top of your money — in one clean, intelligent dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-2xl bg-white/90 p-4 text-left text-slate-900 shadow-lg shadow-slate-900/20 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-lg">
              <span>{feature.icon}</span>
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900">{feature.title}</h3>
            <p className="text-xs text-slate-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const HowItWorksSection = ({ id }) => {
  const steps = [
    {
      title: 'Connect & capture',
      description: 'Link accounts or add expenses manually — it takes seconds to get started.',
      label: 'Step 1',
    },
    {
      title: 'See where it goes',
      description: 'We categorize every transaction and visualize your spending in real time.',
      label: 'Step 2',
    },
    {
      title: 'Predict & plan ahead',
      description: 'Our AI forecasts next month so you can plan with confidence.',
      label: 'Step 3',
    },
  ]

  return (
    <section id={id} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">How it works</h2>
        <p className="mt-1 text-sm text-slate-100/80">
          Three simple steps to go from confusion to clarity.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative h-full rounded-2xl bg-white/90 p-4 text-left text-slate-900 shadow-lg shadow-slate-900/20 ring-1 ring-slate-200"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white">
                {index + 1}
              </span>
              {step.label}
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900">{step.title}</h3>
            <p className="text-xs text-slate-500">{step.description}</p>
          </div>
        ))}
      </div>
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
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          See your next month&apos;s spend — before it happens
        </h2>
        <p className="text-sm text-slate-100/85">
          Adjust your budget and see how our AI instantly updates your projected spending. This is a live demo
          with mocked data — the real app learns from your history.
        </p>
        <p className="text-xs text-slate-100/70">Demo data only. Predictions are illustrative.</p>

        <div className="mt-4 space-y-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
          <div className="flex items-center justify-between text-xs text-slate-100">
            <span>Monthly budget</span>
            <span className="font-semibold">₹{budget.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={100000}
            step={5000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-yellow-300"
          />

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-900/30 px-3 py-2 text-xs text-slate-100 ring-1 ring-white/10">
            <div>
              <p className="font-medium">Include one-time purchases</p>
              <p className="text-[11px] text-slate-300/80">
                Factor in large or irregular expenses for a more realistic forecast.
              </p>
            </div>
            <ToggleSwitch checked={includeOneTime} onChange={setIncludeOneTime} />
          </label>
        </div>
      </div>

      <div className="rounded-2xl sm:rounded-3xl bg-white/95 p-4 sm:p-5 text-slate-900 shadow-2xl shadow-slate-900/40 ring-1 ring-slate-200/80">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">AI forecast</p>
            <p className="text-xl font-semibold tracking-tight text-slate-900">
              ₹{Math.round(prediction).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Confidence {Math.round(confidence * 100)}%
          </div>
        </div>

        <div className="relative mb-5 h-36 overflow-hidden rounded-2xl bg-slate-50">
          <div className="absolute inset-4 flex items-end justify-between gap-2">
            {[0.78, 0.9, 0.95].map((ratio, idx) => (
              <div key={idx} className="flex-1">
                <div
                  className="mx-auto w-1.5 rounded-full bg-indigo-400"
                  style={{ height: `${ratio * 100}%` }}
                />
              </div>
            ))}
            <div className="flex-1">
              <div
                className="relative mx-auto w-1.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)] transition-all"
                style={{ height: `${Math.min((prediction / (budget * 1.5)) * 100, 100)}%` }}
              >
                <div className="absolute -top-3 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white shadow-md ring-2 ring-emerald-400" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-slate-400">
            <span>3 mo ago</span>
            <span>2 mo ago</span>
            <span>Last mo</span>
            <span>Next (AI)</span>
          </div>
        </div>

        <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[11px] font-medium text-slate-500">Risk of overspend</p>
            <p className="mt-1 text-sm font-semibold text-amber-600">
              {prediction > budget ? 'High' : 'Low'} ({prediction > budget ? '₹' + (prediction - budget).toLocaleString('en-IN') + ' over' : 'within budget'})
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[11px] font-medium text-slate-500">Suggested safe budget</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              ₹{Math.round(budget * (prediction > budget ? 0.92 : 1.02)).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
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
    {
      name: 'Ananya Sharma',
      role: 'Marketing Manager',
      quote:
        'ExpenseAI finally helped me understand where my salary disappears every month. The predictions keep me honest.',
    },
    {
      name: 'Rahul Verma',
      role: 'Freelance Developer',
      quote:
        'I love how simple it is. I log expenses on the go and the app tells me if next month looks risky.',
    },
    {
      name: 'Priya Iyer',
      role: 'Product Designer',
      quote: 'The UI is clean, the charts are beautiful, and I feel more in control of my finances.',
    },
  ]

  return (
    <section id={id} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">Loved by modern savers</h2>
        <p className="mt-1 text-sm text-slate-100/80">
          People who care about their money — and their time.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="flex h-full flex-col rounded-2xl bg-white/95 p-4 text-left text-slate-900 shadow-lg shadow-slate-900/25 ring-1 ring-slate-200"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-sm font-semibold text-white">
                {t.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-[11px] text-slate-500">{t.role}</p>
              </div>
            </div>
            <p className="flex-1 text-xs leading-relaxed text-slate-600">“{t.quote}”</p>
            <div className="mt-3 flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const FooterSection = () => (
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
          <li><a href="#features" className="text-slate-300 hover:text-slate-100 transition-colors">Features</a></li>
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
