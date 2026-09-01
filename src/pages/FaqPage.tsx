import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faq } from '@/lib/content';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [open, setOpen] = useState<number | null>(0);

  const filteredItems =
    activeCategory === 'All' ? faq.items : faq.items.filter((item) => item.category === activeCategory);

  return (
    <>
      <PageHeader header={faq.header} />

      {/* Category filter */}
      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal className="flex flex-wrap justify-center gap-2">
            {faq.categories.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.label);
                  setOpen(null);
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === cat.label
                    ? 'bg-brand-500 text-ink-950'
                    : 'border border-white/10 bg-white/[0.03] text-white/70 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Accordion */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal className="space-y-3">
            {filteredItems.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.question}
                  className={`glass overflow-hidden rounded-xl transition-colors ${isOpen ? 'border-brand-500/30' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base font-semibold text-white">{item.question}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                        isOpen ? 'bg-brand-500 text-ink-950' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-white/60">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
          {filteredItems.length === 0 && (
            <div className="py-20 text-center text-white/40">No questions in this category.</div>
          )}
        </div>
      </section>
    </>
  );
}
