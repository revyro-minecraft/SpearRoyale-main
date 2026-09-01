import type { PageHeader as PageHeaderType } from '@/lib/content';
import Reveal from './Reveal';

export default function PageHeader({ header }: { header: PageHeaderType }) {
  return (
    <Reveal className="mx-auto max-w-3xl px-4 pt-16 text-center sm:pt-24">
      <span className="section-eyebrow">{header.eyebrow}</span>
      <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-white text-balance sm:text-5xl">
        {header.title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60 text-balance">
        {header.description}
      </p>
    </Reveal>
  );
}
