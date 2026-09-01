import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';

/**
 * Wraps children in a fade/slide-up reveal triggered when scrolled into view.
 * Falls back to visible immediately if IntersectionObserver is unavailable.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
