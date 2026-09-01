import { useEffect, useState } from 'react';
import { Wifi, Users, Cpu, Activity } from 'lucide-react';
import { fetchServerStatus, type ServerStatus } from '@/lib/serverStatus';
import { site } from '@/lib/content';

/**
 * Live server status card. Loads from `fetchServerStatus` (see
 * lib/serverStatus.ts) so the data source can be swapped for a real API
 * without touching this component.
 */
export default function ServerStatusCard({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState<ServerStatus | null>(null);

  useEffect(() => {
    let active = true;
    fetchServerStatus().then((s) => {
      if (active) setStatus(s);
    });
    return () => {
      active = false;
    };
  }, []);

  const online = status?.online ?? false;
  const players = status?.players ?? 0;
  const maxPlayers = status?.maxPlayers ?? 0;
  const version = status?.version ?? site.server.version;
  const latency = status?.latencyMs ?? 0;

  return (
    <div
      className={`glass rounded-2xl p-5 shadow-card ${className}`}
      aria-label="Live server status"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                online ? 'animate-ping bg-brand-500/70' : 'bg-red-500/70'
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                online ? 'bg-brand-500' : 'bg-red-500'
              }`}
            />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-400">
            {online ? 'Server Online' : 'Offline'}
          </span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">
          Live
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="font-display text-3xl font-bold tabular-nums text-white">
            {players}
            <span className="text-lg font-medium text-white/40"> / {maxPlayers}</span>
          </div>
          <div className="mt-0.5 text-xs text-white/50">Players Online</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm text-white/80">{latency}ms</div>
          <div className="text-[11px] text-white/40">Latency</div>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-700"
          style={{ width: online ? `${Math.min(100, (players / maxPlayers) * 100)}%` : '0%' }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-brand-400/80" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/40">Version</div>
            <div className="font-mono text-xs text-white/80">{version}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-brand-400/80" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/40">Address</div>
            <div className="font-mono text-xs text-white/80">{site.server.ip}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
