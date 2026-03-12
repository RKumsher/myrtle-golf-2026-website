import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/myrtle-golf-2026-website/';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-masters-green text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link to="/" className="no-underline text-white">
            <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Myrtle Beach 2026
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="h-px bg-masters-gold flex-1 max-w-32" />
              <p className="text-masters-gold text-sm font-body tracking-widest uppercase">
                Golf Trip — Mar 20–24
              </p>
              <div className="h-px bg-masters-gold flex-1 max-w-32" />
            </div>
          </Link>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-masters-green-dark text-white/80 text-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4">
          {!isHome && (
            <Link to="/" className="text-masters-gold hover:text-white transition-colors no-underline">
              ← Leaderboard
            </Link>
          )}
          <Link to="/scoring" className="text-white/70 hover:text-white transition-colors no-underline ml-auto">
            How Scoring Works
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-masters-green text-white/60 text-center text-xs py-4">
        <div className="h-px bg-masters-gold/30 max-w-6xl mx-auto mb-4" />
        Myrtle Beach 2026 Golf Trip
      </footer>
    </div>
  );
}
