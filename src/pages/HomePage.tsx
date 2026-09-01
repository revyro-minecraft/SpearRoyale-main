import { Link } from 'react-router-dom';
import { Play, MessageCircle, Swords, ChevronDown, ArrowRight } from 'lucide-react';
import ParticleField from '@/components/ParticleField';
import IpCopyButton from '@/components/IpCopyButton';
import ServerStatusCard from '@/components/ServerStatusCard';
import Reveal from '@/components/Reveal';
import { home, store, site } from '@/lib/content';
import { getIcon } from '@/lib/icons';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(0,226,122,0.12), transparent 70%)' }}
        />
        <ParticleField />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="animate-fade-up">
                <span className="section-eyebrow">
                  <Swords className="h-3.5 w-3.5" />
                  {home.hero.eyebrow}
                </span>
              </div>

              <h1
                className="mt-6 animate-fade-up font-display text-5xl font-bold leading-[1.05] tracking-tight text-white text-balance sm:text-6xl lg:text-7xl"
                style={{ animationDelay: '80ms' }}
              >
                SPEAR <span className="text-brand-400">{home.hero.titleHighlight}</span>
              </h1>

              <p
                className="mt-5 max-w-xl animate-fade-up text-lg text-white/70 text-balance sm:text-xl"
                style={{ animationDelay: '160ms' }}
              >
                {home.hero.subtitle}
              </p>
              <p
                className="mt-3 max-w-xl animate-fade-up text-base text-white/50"
                style={{ animationDelay: '200ms' }}
              >
                {home.hero.description}
              </p>

              <div className="mt-8 animate-fade-up" style={{ animationDelay: '240ms' }}>
                <IpCopyButton />
              </div>

              <div className="mt-6 flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: '320ms' }}>
                <a href={site.server.discordUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Play className="h-4 w-4" />
                  {home.finalCta.primaryButtonText}
                </a>
                <a href={site.server.discordUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <MessageCircle className="h-4 w-4" />
                  {home.finalCta.secondaryButtonText}
                </a>
              </div>

              <dl
                className="mt-12 grid max-w-lg animate-fade-up grid-cols-3 gap-6 border-t border-white/10 pt-6"
                style={{ animationDelay: '400ms' }}
              >
                {home.hero.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-display text-2xl font-bold text-white">{s.value}</dt>
                    <dd className="text-xs uppercase tracking-wider text-white/40">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="animate-fade-up lg:col-span-5" style={{ animationDelay: '360ms' }}>
              <ServerStatusCard className="mx-auto max-w-sm lg:ml-auto" />
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <a href="#why" className="flex flex-col items-center gap-1 text-white/30 transition-colors hover:text-white/60" aria-label="Scroll to content">
              <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Why Spear Royale</span>
            <h2 className="section-title mt-5">
              Built for players who want to <span className="text-brand-400">win</span>.
            </h2>
            <p className="mt-4 text-white/60 text-balance">
              A competitive network designed around skill, progression, and a community that actually plays together.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {home.whyFeatures.map((f, i) => {
              const Icon = getIcon(f.icon);
              return (
                <Reveal key={f.title} delay={i * 90}>
                  <article className="glass glass-hover group h-full rounded-2xl p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 ring-1 ring-brand-500/30 transition-all duration-300 group-hover:bg-brand-500/20 group-hover:shadow-glow-sm">
                      <Icon className="h-6 w-6 text-brand-400" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{f.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(50% 40% at 80% 20%, rgba(0,226,122,0.06), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Server Features</span>
            <h2 className="section-title mt-5">Everything you need to compete.</h2>
            <p className="mt-4 text-white/60 text-balance">
              From ranked PvP to special gamemodes, Spear Royale ships the systems that keep a competitive server alive.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {home.features.map((f, i) => {
              const Icon = getIcon(f.icon);
              return (
                <Reveal key={f.title} delay={(i % 4) * 80}>
                  <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-brand-500/30 hover:bg-white/[0.04]">
                    <span
                      className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/0 blur-2xl transition-all duration-500 group-hover:bg-brand-500/20"
                      aria-hidden="true"
                    />
                    <div className="relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover:bg-brand-500/15 group-hover:ring-brand-500/40">
                        <Icon className="h-5 w-5 text-brand-400" />
                      </div>
                      <h3 className="mt-5 font-display text-base font-semibold text-white">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/50">{f.description}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ranks preview */}
      <section id="ranks" className="relative py-20 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(50% 40% at 20% 30%, rgba(0,226,122,0.05), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">{home.ranksPreview.eyebrow}</span>
            <h2 className="section-title mt-5">{home.ranksPreview.title}</h2>
            <p className="mt-4 text-white/60 text-balance">{home.ranksPreview.description}</p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {store.ranks.map((rank, i) => {
              const Icon = getIcon(rank.icon);
              return (
                <Reveal key={rank.name} delay={i * 90}>
                  <article
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                      rank.featured
                        ? 'border-brand-500/50 bg-brand-500/[0.06] shadow-glow'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    {rank.featured && (
                      <span className="absolute right-4 top-4 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                        Popular
                      </span>
                    )}
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', boxShadow: `0 0 24px -8px ${rank.glow}` }}
                    >
                      <Icon className={`h-7 w-7 ${rank.accent}`} />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-white">{rank.name}</h3>
                    <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/40">[{rank.tag}]</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{rank.description}</p>
                    <div className="mt-auto pt-5">
                      <span className="font-display text-2xl font-bold text-white">{rank.price}</span>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-12 text-center">
            <Link to={home.ranksPreview.viewAllHref} className="btn-ghost">
              {home.ranksPreview.viewAllText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="relative py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(0,226,122,0.18), transparent 70%)' }}
          />
          <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal className="glass relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
            <span className="section-eyebrow">{home.community.eyebrow}</span>
            <h2 className="section-title mt-5">{home.community.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/65 text-balance">{home.community.description}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={site.server.discordUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageCircle className="h-4 w-4" />
                {home.community.buttonText}
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-white/40">
              {home.community.stats.map((s, i) => (
                <span key={s} className="flex items-center gap-8">
                  {s}
                  {i < home.community.stats.length - 1 && <span className="hidden h-3 w-px bg-white/15 sm:block" />}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section id="play" className="relative py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute left-1/2 top-1/2 h-[380px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, rgba(0,226,122,0.22), transparent 70%)' }}
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <span className="section-eyebrow">
              <Swords className="h-3.5 w-3.5" />
              {home.finalCta.eyebrow}
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {home.finalCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/65 text-balance">{home.finalCta.description}</p>
            <div className="mt-8 flex justify-center">
              <IpCopyButton />
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={site.server.discordUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Play className="h-4 w-4" />
                {home.finalCta.primaryButtonText}
              </a>
              <a href={site.server.discordUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <MessageCircle className="h-4 w-4" />
                {home.finalCta.secondaryButtonText}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
