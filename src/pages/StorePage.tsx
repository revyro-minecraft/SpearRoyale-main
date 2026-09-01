import { Check, ArrowRight } from 'lucide-react';
import { store, site } from '@/lib/content';
import { getIcon } from '@/lib/icons';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

export default function StorePage() {
  return (
    <>
      <PageHeader header={store.header} />

      {/* Store info bar */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {store.storeInfo.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="glass flex items-center gap-3 rounded-xl p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/30">
                      <Icon className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      <p className="text-xs text-white/50">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ranks */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <span className="section-eyebrow">Ranks</span>
            <h2 className="section-title mt-5">Choose your rank</h2>
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
                    <span
                      className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: `linear-gradient(90deg, transparent, ${rank.glow}, transparent)` }}
                      aria-hidden="true"
                    />
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', boxShadow: `0 0 24px -8px ${rank.glow}` }}
                    >
                      <Icon className={`h-7 w-7 ${rank.accent}`} />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-white">{rank.name}</h3>
                    <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/40">[{rank.tag}]</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{rank.description}</p>
                    <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                      {rank.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2.5 text-sm text-white/70">
                          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${rank.accent}`} />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <span className="font-display text-2xl font-bold text-white">{rank.price}</span>
                        <span className="ml-1 text-xs text-white/40">one-time</span>
                      </div>
                    </div>
                    <a
                      href={`${site.server.storeUrl}?rank=${rank.tag.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                        rank.featured
                          ? 'bg-brand-500 text-ink-950 hover:bg-brand-400 hover:shadow-glow-sm'
                          : 'border border-white/15 bg-white/[0.03] text-white hover:border-brand-500/40 hover:bg-white/[0.06]'
                      }`}
                    >
                      Buy Now
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cosmetics */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <span className="section-eyebrow">Cosmetics</span>
            <h2 className="section-title mt-5">Stand out from the crowd</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {store.cosmetics.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <Reveal key={item.name} delay={i * 90}>
                  <article className="glass glass-hover group h-full rounded-2xl p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 ring-1 ring-brand-500/30 transition-all duration-300 group-hover:bg-brand-500/20 group-hover:shadow-glow-sm">
                      <Icon className="h-6 w-6 text-brand-400" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-white">{item.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{item.description}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-white">{item.price}</span>
                      <a
                        href={site.server.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white transition-all hover:border-brand-500/40 hover:bg-white/[0.06]"
                      >
                        Buy
                      </a>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
