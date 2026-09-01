import { useState } from 'react';
import { rules } from '@/lib/content';
import { getIcon } from '@/lib/icons';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

const severityStyles: Record<string, string> = {
  low: 'bg-brand-500/10 text-brand-400 ring-brand-500/30',
  medium: 'bg-amber-500/10 text-amber-400 ring-amber-500/30',
  high: 'bg-orange-500/10 text-orange-500 ring-orange-500/30',
  severe: 'bg-red-500/10 text-red-500 ring-red-500/30',
};

export default function RulesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCategories =
    activeCategory === 'all' ? rules.categories : rules.categories.filter((c) => c.id === activeCategory);

  return (
    <>
      <PageHeader header={rules.header} />

      {/* Severity legend */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal className="flex flex-wrap justify-center gap-3">
            {rules.severityLegend.map((s) => (
              <div key={s.level} className="glass flex items-center gap-2.5 rounded-xl px-4 py-2.5">
                <span className={`flex h-2.5 w-2.5 rounded-full ring-1 ${severityStyles[s.level]}`} />
                <span className={`text-sm font-semibold ${s.color}`}>{s.label}</span>
                <span className="text-xs text-white/40">{s.description}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Category filter */}
      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-brand-500 text-ink-950'
                  : 'border border-white/10 bg-white/[0.03] text-white/70 hover:text-white'
              }`}
            >
              All
            </button>
            {rules.categories.map((cat) => {
              const Icon = getIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-brand-500 text-ink-950'
                      : 'border border-white/10 bg-white/[0.03] text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.name}
                </button>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Rules */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCategories.map((cat, ci) => {
              const Icon = getIcon(cat.icon);
              return (
                <Reveal key={cat.id} delay={ci * 80}>
                  <div className="glass h-full rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 ring-1 ring-brand-500/30">
                        <Icon className="h-5 w-5 text-brand-400" />
                      </div>
                      <h2 className="font-display text-lg font-semibold text-white">{cat.name}</h2>
                    </div>
                    <ul className="mt-5 space-y-3">
                      {cat.rules.map((rule) => (
                        <li key={rule.text} className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${
                              severityStyles[rule.severity] ?? severityStyles.low
                            }`}
                          >
                            {rule.severity}
                          </span>
                          <span className="text-sm leading-relaxed text-white/65">{rule.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
