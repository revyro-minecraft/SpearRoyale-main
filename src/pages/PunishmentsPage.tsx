import { useEffect, useState } from 'react';
import {
  Ban,
  VolumeX,
  AlertTriangle,
  UserX,
  Loader2,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { punishments as punishmentContent } from '@/lib/content';

type PunishmentEntry = {
  id: number;
  type: string;
  uuid: string;
  reason: string;
  staff: string;
  staff_uuid: string | null;
  date: number;
  until: number;
  permanent: boolean;
  active: boolean;
  removed_by: string | null;
  removed_by_uuid: string | null;
  removal_reason: string | null;
};

type PunishmentResponse = {
  entries: PunishmentEntry[];
};

const API_URL = 'https://api.spearroyale.com/api/v1';

function punishmentIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'ban':
      return Ban;

    case 'mute':
      return VolumeX;

    case 'warn':
    case 'warning':
      return AlertTriangle;

    case 'kick':
      return UserX;

    default:
      return AlertTriangle;
  }
}

function punishmentTypeClass(type: string) {
  switch (type.toLowerCase()) {
    case 'ban':
      return 'text-red-400';

    case 'mute':
      return 'text-amber-400';

    case 'warn':
    case 'warning':
      return 'text-yellow-400';

    case 'kick':
      return 'text-white/55';

    default:
      return 'text-white/55';
  }
}

function punishmentIconClass(type: string) {
  switch (type.toLowerCase()) {
    case 'ban':
      return 'text-red-400';

    case 'mute':
      return 'text-amber-400';

    case 'warn':
    case 'warning':
      return 'text-yellow-400';

    case 'kick':
      return 'text-white/55';

    default:
      return 'text-white/55';
  }
}

function formatType(type: string) {
  switch (type.toLowerCase()) {
    case 'ban':
      return 'BAN';

    case 'mute':
      return 'MUTE';

    case 'warn':
    case 'warning':
      return 'WARN';

    case 'kick':
      return 'KICK';

    default:
      return type.toUpperCase();
  }
}

function formatDate(timestamp: number) {
  if (!timestamp) {
    return 'Unknown';
  }

  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDuration(
  until: number,
  permanent: boolean,
  date: number
) {
  if (permanent || until === 0) {
    return 'Permanent';
  }

  if (!until) {
    return 'Unknown';
  }

  const duration = until - date;

  if (duration <= 0) {
    return 'Expired';
  }

  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `${days}d`;
  }

  if (hours >= 1) {
    return `${hours}h`;
  }

  if (minutes >= 1) {
    return `${minutes}m`;
  }

  return `${Math.max(1, seconds)}s`;
}

function getStatus(punishment: PunishmentEntry) {
  /*
   * A punishment that has been removed is considered pardoned.
   */
  if (
    !punishment.active &&
    (
      punishment.removed_by !== null ||
      punishment.removed_by_uuid !== null
    )
  ) {
    return {
      label: 'PARDONED',
      className:
        'bg-emerald-500/10 text-emerald-400',
    };
  }

  /*
   * An inactive punishment with no removal information
   * is treated as expired.
   */
  if (!punishment.active) {
    return {
      label: 'EXPIRED',
      className:
        'bg-white/[0.05] text-white/45',
    };
  }

  /*
   * A timed punishment can technically still have active=true
   * after its expiry depending on LiteBans state, so check it here.
   */
  if (
    !punishment.permanent &&
    punishment.until > 0 &&
    punishment.until <= Date.now()
  ) {
    return {
      label: 'EXPIRED',
      className:
        'bg-white/[0.05] text-white/45',
    };
  }

  return {
    label: 'ACTIVE',
    className:
      'bg-red-500/10 text-red-400',
  };
}

function PlayerHead({
  name,
}: {
  name: string;
}) {
  return (
    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[3px] bg-white/5">
      <img
        src={`https://mc-heads.net/avatar/${encodeURIComponent(name)}/64`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />

      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white/30">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function PlayerCell({
  uuid,
  name,
}: {
  uuid: string;
  name: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <PlayerHead name={name} />

      <span className="truncate font-semibold text-white/90">
        {name}
      </span>
    </div>
  );
}

export default function PunishmentsPage() {
  const [entries, setEntries] = useState<PunishmentEntry[]>([]);
  const [playerNames, setPlayerNames] =
    useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [resolvingNames, setResolvingNames] =
    useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPunishments() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${API_URL}/punishments?limit=100`,
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error(
            `Punishment API returned ${response.status}`
          );
        }

        const data: PunishmentResponse =
          await response.json();

        const punishmentEntries =
          [...(data.entries ?? [])].sort(
            (a, b) => b.date - a.date
          );

        setEntries(punishmentEntries);

        /*
         * Get every unique UUID.
         * We resolve these through the Spear Royale API,
         * so the punishment API itself stays simple.
         */
        const uniqueUuids = [
          ...new Set(
            punishmentEntries
              .map((entry) => entry.uuid)
              .filter(Boolean)
          ),
        ];

        if (uniqueUuids.length === 0) {
          return;
        }

        setResolvingNames(true);

        const resolved:
          Record<string, string> = {};

        /*
         * Resolve UUID -> IGN.
         *
         * The existing player endpoint already knows the
         * player's name, so we reuse it here.
         */
        await Promise.all(
          uniqueUuids.map(async (uuid) => {
            try {
              const playerResponse =
                await fetch(
                  `${API_URL}/player/${encodeURIComponent(uuid)}`,
                  {
                    cache: 'no-store',
                  }
                );

              if (!playerResponse.ok) {
                return;
              }

              const player =
                await playerResponse.json();

              if (player?.name) {
                resolved[uuid] = player.name;
              }
            } catch (err) {
              console.error(
                `Failed to resolve player ${uuid}:`,
                err
              );
            }
          })
        );

        setPlayerNames(resolved);
      } catch (err) {
        console.error(
          'Failed to load punishments:',
          err
        );

        setError(
          'Unable to load punishment history.'
        );
      } finally {
        setResolvingNames(false);
        setLoading(false);
      }
    }

    loadPunishments();
  }, []);

  return (
    <>
      <PageHeader
        header={punishmentContent.header}
      />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Loading */}
          {loading && (
            <Reveal>
              <div className="glass rounded-2xl py-16 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-400" />

                <div className="mt-4 text-sm text-white/40">
                  Loading punishments...
                </div>
              </div>
            </Reveal>
          )}

          {/* Error */}
          {!loading && error && (
            <Reveal>
              <div className="glass rounded-2xl px-6 py-16 text-center">
                <AlertTriangle className="mx-auto h-9 w-9 text-red-400/70" />

                <div className="mt-4 text-sm font-semibold text-white">
                  Unable to load punishments
                </div>

                <div className="mt-1 text-sm text-white/40">
                  Please try again later.
                </div>
              </div>
            </Reveal>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            entries.length === 0 && (
              <Reveal>
                <div className="glass rounded-2xl px-6 py-16 text-center">
                  <div className="text-sm font-semibold text-white">
                    No punishments found
                  </div>

                  <div className="mt-1 text-sm text-white/40">
                    There are currently no recorded punishments.
                  </div>
                </div>
              </Reveal>
            )}

          {/* Punishment list */}
          {!loading &&
            !error &&
            entries.length > 0 && (
              <Reveal>
                <div className="glass overflow-hidden rounded-2xl">

                  {/* Top bar */}
                  <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
                    <div>
                      <h2 className="font-display text-lg font-bold text-white">
                        Punishment History
                      </h2>

                      <p className="mt-0.5 text-xs text-white/35">
                        Recent server punishments
                      </p>
                    </div>

                    <div className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      {entries.length}
                      {entries.length === 100
                        ? '+'
                        : ''}{' '}
                      Records
                    </div>
                  </div>

                  {resolvingNames && (
                    <div className="border-b border-white/[0.05] px-5 py-2 text-[11px] text-white/25 sm:px-6">
                      Resolving player names...
                    </div>
                  )}

                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full table-fixed border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.07] text-left">
                          <th className="w-[21%] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35 sm:px-6">
                            Player
                          </th>

                          <th className="w-[12%] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                            Type
                          </th>

                          <th className="w-[32%] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                            Reason
                          </th>

                          <th className="w-[16%] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                            By
                          </th>

                          <th className="w-[12%] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                            Date
                          </th>

                          <th className="w-[9%] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {entries.map(
                          (punishment, index) => {
                            const playerName =
                              playerNames[
                                punishment.uuid
                              ] ??
                              'Unknown';

                            const Icon =
                              punishmentIcon(
                                punishment.type
                              );

                            const typeClass =
                              punishmentTypeClass(
                                punishment.type
                              );

                            const iconClass =
                              punishmentIconClass(
                                punishment.type
                              );

                            const status =
                              getStatus(
                                punishment
                              );

                            const duration =
                              formatDuration(
                                punishment.until,
                                punishment.permanent,
                                punishment.date
                              );

                            return (
                              <tr
                                key={`${punishment.id}-${punishment.type}-${punishment.date}-${index}`}
                                className="border-b border-white/[0.05] last:border-0 transition-colors hover:bg-white/[0.025]"
                              >
                                {/* Player */}
                                <td className="px-5 py-3 sm:px-6">
                                  <PlayerCell
                                    uuid={
                                      punishment.uuid
                                    }
                                    name={
                                      playerName
                                    }
                                  />
                                </td>

                                {/* Type */}
                                <td className="px-3 py-3">
                                  <div className="flex items-center gap-2">
                                    <Icon
                                      className={`h-4 w-4 ${iconClass}`}
                                    />

                                    <span
                                      className={`text-xs font-bold tracking-wide ${typeClass}`}
                                    >
                                      {formatType(
                                        punishment.type
                                      )}
                                    </span>
                                  </div>
                                </td>

                                {/* Reason */}
                                <td className="px-3 py-3">
                                  <div className="truncate text-sm text-white/55">
                                    {punishment.reason?.trim()
                                      ? punishment.reason
                                      : 'No reason specified.'}

                                    <span className="ml-2 text-xs text-white/25">
                                      ({duration})
                                    </span>
                                  </div>
                                </td>

                                {/* Staff */}
                                <td className="truncate px-3 py-3 text-sm text-white/55">
                                  {punishment.staff ||
                                    'CONSOLE'}
                                </td>

                                {/* Date */}
                                <td className="whitespace-nowrap px-3 py-3 text-xs text-white/45">
                                  {formatDate(
                                    punishment.date
                                  )}
                                </td>

                                {/* Status */}
                                <td className="px-3 py-3">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] ${status.className}`}
                                  >
                                    {status.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile list */}
                  <div className="divide-y divide-white/[0.05] md:hidden">
                    {entries.map(
                      (punishment, index) => {
                        const playerName =
                          playerNames[
                            punishment.uuid
                          ] ??
                          'Unknown';

                        const Icon =
                          punishmentIcon(
                            punishment.type
                          );

                        const typeClass =
                          punishmentTypeClass(
                            punishment.type
                          );

                        const iconClass =
                          punishmentIconClass(
                            punishment.type
                          );

                        const status =
                          getStatus(
                            punishment
                          );

                        const duration =
                          formatDuration(
                            punishment.until,
                            punishment.permanent,
                            punishment.date
                          );

                        return (
                          <div
                            key={`${punishment.id}-${punishment.type}-${punishment.date}-${index}`}
                            className="px-4 py-4"
                          >
                            <div className="flex items-start justify-between gap-3">

                              <div className="flex min-w-0 items-center gap-3">
                                <PlayerHead
                                  name={
                                    playerName
                                  }
                                />

                                <div className="min-w-0">
                                  <div className="truncate text-sm font-semibold text-white/90">
                                    {playerName}
                                  </div>

                                  <div className="mt-0.5 flex items-center gap-1.5">
                                    <Icon
                                      className={`h-3.5 w-3.5 ${iconClass}`}
                                    />

                                    <span
                                      className={`text-[10px] font-bold tracking-wide ${typeClass}`}
                                    >
                                      {formatType(
                                        punishment.type
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <span
                                className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-bold tracking-[0.1em] ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </div>

                            <div className="mt-3 rounded-lg bg-white/[0.02] px-3 py-2">
                              <div className="text-xs text-white/55">
                                {punishment.reason?.trim()
                                  ? punishment.reason
                                  : 'No reason specified.'}

                                <span className="ml-1.5 text-white/25">
                                  ({duration})
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-[10px] text-white/30">
                              <span>
                                By{' '}
                                <span className="text-white/50">
                                  {punishment.staff ||
                                    'CONSOLE'}
                                </span>
                              </span>

                              <span>
                                {formatDate(
                                  punishment.date
                                )}
                              </span>
                            </div>

                            {!status.label.includes(
                              'ACTIVE'
                            ) &&
                              punishment.removed_by && (
                                <div className="mt-2 text-[10px] text-white/25">
                                  Removed by{' '}
                                  <span className="text-white/45">
                                    {
                                      punishment.removed_by
                                    }
                                  </span>
                                </div>
                              )}
                          </div>
                        );
                      }
                    )}
                  </div>

                </div>
              </Reveal>
            )}

        </div>
      </section>
    </>
  );
}