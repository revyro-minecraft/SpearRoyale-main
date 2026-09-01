import { howToPlay } from '@/lib/content';
import { getIcon } from '@/lib/icons';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

export default function HowToPlayPage() {
  return (
    <>
      <PageHeader header={howToPlay.header} />

      {/* Overview cards */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {howToPlay.overview.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <Reveal key={item.title} delay={i * 90}>
                  <article className="glass glass-hover group h-full rounded-2xl p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-brand-500/10 ring-1 ring-brand-500/30 transition-all duration-300 group-hover:bg-brand-500/20 group-hover:shadow-glow-sm">
                      <Icon className="h-7 w-7 text-brand-400" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs font-mono uppercase tracking-wider text-brand-400">{item.value}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{item.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Match flow */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal className="text-center">
            <span className="section-eyebrow">Match Flow</span>
            <h2 className="section-title mt-5">How a match plays out</h2>
          </Reveal>
          <div className="mt-12 space-y-4">
            {howToPlay.matchFlow.map((step, i) => {
              const Icon = getIcon(step.icon);
              return (
                <Reveal key={step.step} delay={i * 70}>
                  <div className="glass flex items-start gap-4 rounded-2xl p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 ring-1 ring-brand-500/30">
                      <Icon className="h-6 w-6 text-brand-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-brand-400">STEP {step.step}</span>
                        <h3 className="font-display text-lg font-semibold text-white">{step.title}</h3>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/55">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Loot system */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <span className="section-eyebrow">Loot System</span>
            <h2 className="section-title mt-5">Chests, durability & enchants</h2>
          </Reveal>

          {/* Loot tiers */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {howToPlay.lootTiers.map((tier) => (
              <div key={tier.name} className="glass rounded-xl px-5 py-3 text-center">
                <div className={`font-display text-lg font-bold ${tier.color}`}>{tier.name}</div>
                <div className="mt-1 text-xs text-white/50">{tier.description}</div>
              </div>
            ))}
          </div>

          {/* Loot details */}
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {howToPlay.lootDetails.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <Reveal key={item.title} delay={i * 90}>
                  <article className="glass glass-hover group h-full rounded-2xl p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover:bg-brand-500/15 group-hover:ring-brand-500/40">
                      <Icon className="h-5 w-5 text-brand-400" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">{item.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special gamemodes */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <span className="section-eyebrow">Special Gamemodes</span>
            <h2 className="section-title mt-5">Mix it up every match</h2>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Chooseable */}
            <Reveal>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  Chooseable <span className="text-xs font-normal text-white/40">(can stack)</span>
                </h3>
                <div className="mt-4 space-y-3">
                  {howToPlay.chooseableGamemodes.map((mode) => {
                    const Icon = getIcon(mode.icon);
                    return (
                      <div key={mode.name} className="glass glass-hover flex items-start gap-3 rounded-xl p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/30">
                          <Icon className="h-5 w-5 text-brand-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{mode.name}</h4>
                          <p className="mt-1 text-sm text-white/50">{mode.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            {/* Random */}
            <Reveal delay={100}>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  Random <span className="text-xs font-normal text-white/40">(one per game, or none)</span>
                </h3>
                <div className="mt-4 space-y-3">
                  {howToPlay.randomGamemodes.map((mode) => {
                    const Icon = getIcon(mode.icon);
                    return (
                      <div key={mode.name} className="glass glass-hover flex items-start gap-3 rounded-xl p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/30">
                          <Icon className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{mode.name}</h4>
                          <p className="mt-1 text-sm text-white/50">{mode.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Zone timeline */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <span className="section-eyebrow">The Zone</span>
            <h2 className="section-title mt-5">Border timeline</h2>
            <p className="mt-4 text-white/60 text-balance">
              The zone is circular and closes over 15 minutes. It doesn't appear for the first 5 minutes.
            </p>
          </Reveal>

          <Reveal className="mt-12">
            <div className="glass rounded-2xl p-6">
              <div className="space-y-0">
                {howToPlay.zoneTimeline.map((item, i) => (
                  <div key={item.time} className="flex items-center gap-4 border-b border-white/5 py-3 last:border-0">
                    <span className="w-16 shrink-0 font-mono text-sm font-bold text-brand-400">{item.time}</span>
                    <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500/50" />
                    <span className="text-sm text-white/60">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team & match rules */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <h3 className="font-display text-lg font-semibold text-white">Team Rules</h3>
              <ul className="mt-4 space-y-2.5">
                {howToPlay.teamRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5 text-sm text-white/60">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {rule}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="font-display text-lg font-semibold text-white">Match Rules</h3>
              <ul className="mt-4 space-y-2.5">
                {howToPlay.matchRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5 text-sm text-white/60">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {rule}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
