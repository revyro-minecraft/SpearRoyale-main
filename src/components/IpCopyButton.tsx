import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyIp } from '@/hooks/useCopyIp';
import { site } from '@/lib/content';

/**
 * Pill that displays the server IP and copies it to the clipboard on click,
 * swapping to a "Copied!" success state with a check animation.
 */
export default function IpCopyButton({ className = '' }: { className?: string }) {
  const { copied, copy } = useCopyIp();
  const [focused, setFocused] = useState(false);

  return (
    <button
      type="button"
      onClick={() => copy(site.server.ip)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label={`Copy server IP ${site.server.ip} to clipboard`}
      className={`group inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 font-mono text-sm font-medium text-white/90 backdrop-blur transition-all duration-300 hover:border-brand-500/50 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${className}`}
    >
      <span className="select-all">{site.server.ip}</span>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md transition-all duration-300 ${
          copied
            ? 'bg-brand-500 text-ink-950'
            : 'bg-white/10 text-white/70 group-hover:bg-brand-500/20 group-hover:text-brand-400'
        }`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 animate-[fade-in_0.3s_ease]" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </span>
      <span
        className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
          copied ? 'text-brand-400' : focused ? 'text-white/60' : 'text-white/40'
        }`}
      >
        {copied ? 'Copied!' : 'Copy IP'}
      </span>
    </button>
  );
}
