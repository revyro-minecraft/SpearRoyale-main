import { useState } from 'react';
import { news } from '@/lib/content';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

export default function NewsPage() {
  const [activeTag, setActiveTag] = useState('All');

  const filteredPosts =
    activeTag === 'All' ? news.posts : news.posts.filter((p) => p.tag === activeTag);

  const featuredPost = news.posts.find((p) => p.featured);
  const showFeatured = activeTag === 'All' && featuredPost;
  const restPosts = showFeatured ? filteredPosts.filter((p) => !p.featured) : filteredPosts;

  return (
    <>
      <PageHeader header={news.header} />

      {/* Tag filter */}
      <section className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal className="flex flex-wrap justify-center gap-2">
            {news.tags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setActiveTag(tag.label)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeTag === tag.label
                    ? 'bg-brand-500 text-ink-950'
                    : 'border border-white/10 bg-white/[0.03] text-white/70 hover:text-white'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Featured post */}
      {showFeatured && (
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <article className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
                  style={{ background: 'radial-gradient(closest-side, rgba(0,226,122,0.3), transparent)' }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-brand-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-400 ring-1 ring-brand-500/30">
                      Featured
                    </span>
                    <span className={`text-xs font-semibold ${featuredPost.tagColor}`}>{featuredPost.tag}</span>
                    <span className="text-xs text-white/40">{featuredPost.date}</span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">{featuredPost.title}</h2>
                  <p className="mt-3 text-base leading-relaxed text-white/60">{featuredPost.excerpt}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{featuredPost.body}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs text-white/40">
                    <span className="font-semibold text-white/60">{featuredPost.author}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      )}

      {/* Post grid */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-2">
            {restPosts.map((post, i) => (
              <Reveal key={post.title} delay={i * 70}>
                <article className="glass glass-hover group h-full rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold ${post.tagColor}`}>{post.tag}</span>
                    <span className="text-xs text-white/40">{post.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-white transition-colors group-hover:text-brand-400">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{post.excerpt}</p>
                  <div className="mt-4 text-xs text-white/40">
                    by <span className="font-semibold text-white/60">{post.author}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          {restPosts.length === 0 && !showFeatured && (
            <div className="py-20 text-center text-white/40">No posts in this category yet.</div>
          )}
        </div>
      </section>
    </>
  );
}
