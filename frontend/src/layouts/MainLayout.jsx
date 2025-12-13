import { Outlet, useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const MainLayout = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-sky-900 to-indigo-900 text-slate-50">
      {/* Background Blurs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-teal-400/20 to-transparent blur-[100px]" />
        <div className="absolute top-1/2 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-sky-400/20 to-transparent blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[80px]" />
      </div>

      {/* Container */}
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">

        <nav className="relative mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/10 px-4 py-4 shadow-lg backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden select-none" aria-label="ExpenseAI logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047"/>
                  <stop offset="100%" stopColor="#34d399"/>
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="20" fill="url(#grad)"/>
              <text x="50%" y="70%" fontSize="65" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="#1e293b">₹</text>
            </svg>
          </span>
          <span className="ml-1 text-xl font-semibold tracking-tight cursor-pointer select-none" onClick={() => navigate("/")}>ExpenseAI</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/#features" className="transition hover:text-teal-300 font-medium">Features</Link>
          <Link to="/#how-it-works" className="transition hover:text-teal-300 font-medium">How It Works</Link>
          <Link to="/#testimonials" className="transition hover:text-teal-300 font-medium">Testimonials</Link>
        </div>
        <div className="hidden md:flex items-center gap-2 ml-6">
          <button className="px-4 py-1.5 rounded-lg font-medium text-slate-100 hover:text-teal-300 transition" onClick={() => navigate("/login")}>Login</button>
          <button className="px-4 py-1.5 rounded-lg font-semibold bg-gradient-to-r from-yellow-300 to-emerald-400 text-slate-900 shadow hover:from-yellow-200 hover:to-emerald-300 transition" onClick={() => navigate("/signup")}>Get Started</button>
        </div>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen((open) => !open)} aria-label="Open menu" className="rounded-md p-2 text-slate-100 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 flex flex-col rounded-xl border border-white/20 bg-slate-900/95 py-4 px-6 shadow-xl md:hidden animate-fade-in">
            <Link to="/#features" className="mb-2 w-full text-left py-2 px-2 rounded hover:bg-teal-900/30 transition font-medium" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link to="/#how-it-works" className="mb-2 w-full text-left py-2 px-2 rounded hover:bg-teal-900/30 transition font-medium" onClick={() => setMenuOpen(false)}>How It Works</Link>
            <Link to="/#testimonials" className="mb-2 w-full text-left py-2 px-2 rounded hover:bg-teal-900/30 transition font-medium" onClick={() => setMenuOpen(false)}>Testimonials</Link>
            <button className="mb-2 w-full text-left py-2 px-2 rounded hover:bg-slate-800/50 transition font-medium text-slate-100" onClick={() => { setMenuOpen(false); navigate("/login"); }}>Login</button>
            <button className="w-full text-left py-2 px-2 rounded bg-gradient-to-r from-yellow-300 to-emerald-400 text-slate-900 font-semibold shadow hover:from-yellow-200 hover:to-emerald-300 transition" onClick={() => { setMenuOpen(false); navigate("/signup"); }}>Get Started</button>
          </div>
        )}
      </nav>

        {/* Page Content */}
        <main className="flex-1 transition-all duration-300 text-slate-100">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
