import { Link } from 'react-router-dom';
import { Swords } from 'lucide-react';
import { site } from '@/lib/content';
import IpCopyButton from './IpCopyButton';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 ring-1 ring-brand-500/40">
                <Swords className="h-5 w-5 text-brand-400" />
              </span>
              <span className="font-display text-base font-bold tracking-[0.18em] text-white">
                SPEAR <span className="text-brand-400">ROYALE</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              A competitive Minecraft battle royale network. Fight, progress,
              and become part of the community.
            </p>
          </div>

          {/* Links */}
          <div className="lg:justify-self-center">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Links</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5">
              {site.footerLinks.map((link) => {
                const isExternal = link.href.startsWith('http');
                return (
                  <li key={link.label}>
                    {isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* IP */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Server IP</h3>
            <div className="mt-4">
              <IpCopyButton />
            </div>
            <p className="mt-3 text-xs text-white/40">{site.server.version} — {site.server.region}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-center text-xs text-white/40 sm:text-left">
            © {year} Spear Royale. All rights reserved. Not affiliated with Mojang or Microsoft.
          </p>
          <p className="font-mono text-xs text-white/30">{site.server.ip}</p>
        </div>
      </div>
    </footer>
  );
}
