import { useState } from 'react';
import { staff } from '@/lib/content';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

const roleColors: Record<string, string> = {
  Owner: 'text-fuchsia-400 ring-fuchsia-500/30 bg-fuchsia-500/10',
  Admin: 'text-red-400 ring-red-500/30 bg-red-500/10',
  Moderator: 'text-amber-400 ring-amber-500/30 bg-amber-500/10',
  Helper: 'text-brand-400 ring-brand-500/30 bg-brand-500/10',
  Developer: 'text-sky-400 ring-sky-500/30 bg-sky-500/10',
};

export default function StaffPage() {
  const [activeRole, setActiveRole] = useState('All');

  const filtered = activeRole === 'All' ? staff.members : staff.members.filter((m) => m.role === activeRole);

  return (
    <>
      <PageHeader header={staff.header} />

      {/* Role filter */}
      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-wrap justify-center gap-2">
            {['All', ...staff.roles].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeRole === role
                    ? 'bg-brand-500 text-ink-950'
                    : 'border border-white/10 bg-white/[0.03] text-white/70 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Staff grid */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member, i) => (
              <Reveal key={member.name} delay={i * 70}>
                <article className="glass glass-hover group h-full rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5 ring-2 ring-white/10">
                      <img
                        src={`https://mc-heads.net/avatar/${encodeURIComponent(member.name)}/64`}
                        alt={`${member.name} avatar`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-white/40">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg font-semibold text-white">{member.name}</h3>
                      <span
                        className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${
                          roleColors[member.role] ?? roleColors.Helper
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/55">{member.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
