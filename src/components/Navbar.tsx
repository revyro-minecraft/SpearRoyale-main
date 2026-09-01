import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Swords, MessageCircle } from 'lucide-react';
import { site } from '@/lib/content';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-white/10 bg-ink-950/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Spear Royale home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 ring-1 ring-brand-500/40 transition-transform duration-300 group-hover:scale-105">
            <Swords className="h-5 w-5 text-brand-400" />
          </span>
          <span className="hidden font-display text-base font-bold tracking-[0.18em] text-white sm:block">
            SPEAR <span className="text-brand-400">ROYALE</span>
          </span>
        </Link>

        {/* Desktop nav — scrollable if needed */}
        <ul className="hidden flex-1 items-center justify-center gap-0.5 overflow-x-auto lg:flex xl:gap-1">
          {site.nav.map((item) => {
            const isActive =
              item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-brand-400' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side — Discord always visible */}
        <div className="flex shrink-0 items-center gap-2.5">
          <a
            href={site.server.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/15 px-3.5 py-2.5 text-sm font-semibold text-[#a5aef5] transition-all duration-300 hover:border-[#5865F2]/60 hover:bg-[#5865F2]/25 hover:text-white"
            aria-label="Join our Discord"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Discord</span>
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-ink-950/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-1 px-4 py-4">
          {site.nav.map((item) => {
            const isActive =
              item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-400'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
