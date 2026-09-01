import { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  Crown,
  Search,
  Trophy,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

type Category = 'wins' | 'kills' | 'kd';

type ApiEntry = {
  position: number;
  uuid: string;
  name: string;
  value: number;
};

type LeaderboardResponse = {
  entries: ApiEntry[];
};

type PlayerStats = {
  uuid?: string;
  name?: string;
  username?: string;
  kills?: number;
  deaths?: number;
  wins?: number;
  games_played?: number;
  gamesPlayed?: number;
  kd?: number;
  win_rate?: number;
  role?: string;
};

type Player = {
  position: number;
  uuid: string;
  name: string;
  role: string;
  value: number;
  kills: number;
  wins: number;
  deaths: number;
  gamesPlayed: number;
  kd: number;
};

const API_BASE =
  'https://api.spearroyale.com/api/v1';

const categories: {
  id: Category;
  label: string;
}[] = [
  {
    id: 'wins',
    label: 'Wins',
  },
  {
    id: 'kills',
    label: 'Kills',
  },
  {
    id: 'kd',
    label: 'K/D',
  },
];

/*
 * LuckPerms roles.
 *
 * Files are located in:
 *
 * public/roles/
 *
 * Therefore the browser paths are:
 *
 * /roles/owner.png
 * /roles/manager.png
 * /roles/admin.png
 * /roles/mod.png
 * /roles/spearplus.png
 * /roles/spear.png
 * /roles/member.png
 */
const roleImages: Record<string, string> = {
  owner: '/roles/owner.png',
  manager: '/roles/manager.png',
  admin: '/roles/admin.png',
  mod: '/roles/mod.png',
  spearplus: '/roles/spearplus.png',
  spear: '/roles/spear.png',
  member: '/roles/member.png',
};

/*
 * Converts the LuckPerms role returned by the API
 * into one of the exact roles used by the website.
 *
 * Expected API values:
 *
 * owner
 * manager
 * admin
 * mod
 * spearplus
 * spear
 * member
 */
function normalizeRole(
  role?: string,
): string {
  if (!role) {
    return 'member';
  }

  const normalized = role
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, '');

  switch (normalized) {
    case 'owner':
      return 'owner';

    case 'manager':
      return 'manager';

    case 'admin':
      return 'admin';

    case 'mod':
    case 'moderator':
      return 'mod';

    case 'spearplus':
      return 'spearplus';

    case 'spear':
      return 'spear';

    case 'member':
    default:
      return 'member';
  }
}

function getRoleImage(
  role?: string,
): string {
  const normalizedRole =
    normalizeRole(role);

  return (
    roleImages[normalizedRole] ||
    roleImages.member
  );
}

async function fetchJson<T>(
  url: string,
): Promise<T> {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `API returned ${response.status}`,
    );
  }

  return response.json();
}

async function fetchLeaderboard(
  category: Category,
): Promise<ApiEntry[]> {
  const data =
    await fetchJson<LeaderboardResponse>(
      `${API_BASE}/leaderboard/${category}?limit=100`,
    );

  if (
    !data ||
    !Array.isArray(data.entries)
  ) {
    return [];
  }

  return data.entries;
}

async function fetchPlayerStats(
  uuid: string,
): Promise<PlayerStats | null> {
  try {
    return await fetchJson<PlayerStats>(
      `${API_BASE}/player/${encodeURIComponent(uuid)}`,
    );
  } catch (error) {
    console.error(
      `Failed to fetch player ${uuid}:`,
      error,
    );

    return null;
  }
}

function formatNumber(
  value: number,
): string {
  return value.toLocaleString();
}

function formatKd(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return '0.00';
  }

  return value.toFixed(2);
}

function calculateKd(
  kills: number,
  deaths: number,
): number {
  if (deaths <= 0) {
    return kills;
  }

  return kills / deaths;
}

function PlayerHead({
  uuid,
  name,
}: {
  uuid: string;
  name: string;
}) {
  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10">
      <img
        src={`https://mc-heads.net/avatar/${encodeURIComponent(uuid)}/96`}
        alt={`${name} avatar`}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display =
            'none';
        }}
      />

      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-white/30">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

/*
 * Displays the LuckPerms rank image.
 *
 * The username is displayed separately immediately
 * after this image.
 */
function RoleImage({
  role,
}: {
  role: string;
}) {
  const normalizedRole =
    normalizeRole(role);

  return (
    <img
      src={getRoleImage(normalizedRole)}
      alt={`${normalizedRole} rank`}
      title={normalizedRole}
      loading="lazy"
      className="h-8 w-auto max-w-[120px] shrink-0 object-contain"
      onError={(event) => {
        /*
         * If the selected role image somehow does not
         * exist, fall back to the member image.
         */
        const image =
          event.currentTarget;

        if (
          image.src.endsWith(
            '/roles/member.png',
          )
        ) {
          image.style.display = 'none';
          return;
        }

        image.src =
          '/roles/member.png';
      }}
    />
  );
}

function categoryTitle(
  category: Category,
): string {
  switch (category) {
    case 'wins':
      return 'Wins';

    case 'kills':
      return 'Kills';

    case 'kd':
      return 'K/D';
  }
}

export default function LeaderboardPage() {
  const [category, setCategory] =
    useState<Category>('wins');

  const [players, setPlayers] =
    useState<Player[]>([]);

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [selectedPlayer, setSelectedPlayer] =
    useState<Player | null>(null);

  const [profileLoading, setProfileLoading] =
    useState(false);

  /*
   * Load leaderboard whenever the selected
   * leaderboard changes.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      try {
        setLoading(true);
        setError('');

        const entries =
          await fetchLeaderboard(category);

        if (cancelled) {
          return;
        }

        /*
         * For every leaderboard entry, get the
         * player's complete stats.
         *
         * This is also where the LuckPerms role
         * comes from the API.
         */
        const loadedPlayers =
          await Promise.all(
            entries.map(
              async (entry) => {
                const stats =
                  await fetchPlayerStats(
                    entry.uuid,
                  );

                const kills =
                  stats?.kills ?? 0;

                const deaths =
                  stats?.deaths ?? 0;

                const kd =
                  typeof stats?.kd ===
                  'number'
                    ? stats.kd
                    : calculateKd(
                        kills,
                        deaths,
                      );

                return {
                  position:
                    entry.position,

                  uuid:
                    entry.uuid,

                  name:
                    stats?.name ||
                    stats?.username ||
                    entry.name,

                  /*
                   * THIS is the LuckPerms role.
                   */
                  role: normalizeRole(
                    stats?.role,
                  ),

                  value:
                    entry.value,

                  kills,

                  wins:
                    stats?.wins ?? 0,

                  deaths,

                  gamesPlayed:
                    stats?.games_played ??
                    stats?.gamesPlayed ??
                    0,

                  kd,
                };
              },
            ),
          );

        if (!cancelled) {
          setPlayers(
            loadedPlayers,
          );
        }
      } catch (err) {
        console.error(
          'Failed to load leaderboard:',
          err,
        );

        if (!cancelled) {
          setPlayers([]);

          setError(
            'Unable to load leaderboard data.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [category]);

  /*
   * Search players by IGN.
   */
  const filteredPlayers =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return players;
      }

      return players.filter(
        (player) =>
          player.name
            .toLowerCase()
            .includes(query),
      );
    }, [players, search]);

  /*
   * Top three players for the currently
   * selected leaderboard.
   */
  const topThree =
    filteredPlayers.slice(0, 3);

  /*
   * Open player profile.
   */
  async function openProfile(
    player: Player,
  ) {
    setSelectedPlayer(player);
    setProfileLoading(true);

    try {
      const stats =
        await fetchPlayerStats(
          player.uuid,
        );

      if (stats) {
        const kills =
          stats.kills ?? 0;

        const deaths =
          stats.deaths ?? 0;

        const kd =
          typeof stats.kd ===
          'number'
            ? stats.kd
            : calculateKd(
                kills,
                deaths,
              );

        setSelectedPlayer({
          ...player,

          name:
            stats.name ||
            stats.username ||
            player.name,

          role: normalizeRole(
            stats.role,
          ),

          kills,

          wins:
            stats.wins ?? 0,

          deaths,

          gamesPlayed:
            stats.games_played ??
            stats.gamesPlayed ??
            0,

          kd,
        });
      }
    } catch (error) {
      console.error(
        'Failed to load player profile:',
        error,
      );
    } finally {
      setProfileLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        header={{
          eyebrow: 'Rankings',

          title: 'Leaderboard',

          description:
            'The best of Spear Royale, ranked across wins, kills and K/D.',
        }}
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* ==================================================
              CATEGORY BUTTONS + SEARCH
          =================================================== */}

          <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex flex-wrap gap-2">
              {categories.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setCategory(
                        item.id,
                      )
                    }
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                      category ===
                      item.id
                        ? 'bg-brand-500 text-ink-950 shadow-glow-sm'
                        : 'border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ),
              )}
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search players..."
                aria-label="Search players"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand-400/40"
              />
            </div>
          </Reveal>

          {/* ==================================================
              TOP THREE
          =================================================== */}

          {!loading &&
            !error &&
            topThree.length > 0 && (
              <Reveal className="mb-8 grid gap-4 md:grid-cols-3">

                {topThree.map(
                  (
                    player,
                    index,
                  ) => (
                    <button
                      key={
                        player.uuid
                      }
                      type="button"
                      onClick={() =>
                        openProfile(
                          player,
                        )
                      }
                      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:-translate-y-1 hover:border-brand-400/30 hover:bg-white/[0.05] ${
                        index === 0
                          ? 'md:-translate-y-2'
                          : ''
                      }`}
                    >
                      {/* Position */}
                      <div className="absolute right-4 top-4">
                        {index ===
                        0 ? (
                          <Crown className="h-5 w-5 text-brand-400" />
                        ) : (
                          <span className="font-mono text-sm text-white/35">
                            #
                            {index +
                              1}
                          </span>
                        )}
                      </div>

                      {/* Player */}
                      <div className="flex items-center gap-4">

                        <PlayerHead
                          uuid={
                            player.uuid
                          }
                          name={
                            player.name
                          }
                        />

                        <div className="min-w-0">

                          {/* RANK IMAGE + USERNAME */}
                          <div className="flex min-w-0 items-center gap-2">

                            <RoleImage
                              role={
                                player.role
                              }
                            />

                            <div className="truncate font-semibold text-white group-hover:text-brand-400">
                              {
                                player.name
                              }
                            </div>

                          </div>

                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-5 grid grid-cols-3 gap-2">

                        <div className="rounded-lg bg-white/[0.03] p-2.5">
                          <div className="text-[10px] uppercase tracking-wider text-white/30">
                            Wins
                          </div>

                          <div className="mt-1 font-mono text-sm text-white/80">
                            {formatNumber(
                              player.wins,
                            )}
                          </div>
                        </div>

                        <div className="rounded-lg bg-white/[0.03] p-2.5">
                          <div className="text-[10px] uppercase tracking-wider text-white/30">
                            Kills
                          </div>

                          <div className="mt-1 font-mono text-sm text-white/80">
                            {formatNumber(
                              player.kills,
                            )}
                          </div>
                        </div>

                        <div className="rounded-lg bg-white/[0.03] p-2.5">
                          <div className="text-[10px] uppercase tracking-wider text-white/30">
                            K/D
                          </div>

                          <div className="mt-1 font-mono text-sm text-brand-400">
                            {formatKd(
                              player.kd,
                            )}
                          </div>
                        </div>

                      </div>
                    </button>
                  ),
                )}

              </Reveal>
            )}

          {/* ==================================================
              LEADERBOARD
          =================================================== */}

          <Reveal>
            <div className="glass overflow-hidden rounded-2xl">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">

                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {categoryTitle(
                      category,
                    )}
                  </h2>

                  <p className="mt-1 text-xs text-white/35">
                    Click a player to view their profile.
                  </p>
                </div>

                <div className="rounded-lg bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  {
                    filteredPlayers.length
                  }{' '}
                  Players
                </div>

              </div>

              {/* Loading */}
              {loading && (
                <div className="px-6 py-16 text-center text-sm text-white/35">
                  Loading leaderboard...
                </div>
              )}

              {/* Error */}
              {!loading &&
                error && (
                  <div className="px-6 py-16 text-center">

                    <Trophy className="mx-auto h-8 w-8 text-white/20" />

                    <div className="mt-3 text-sm font-semibold text-white">
                      Unable to load leaderboard
                    </div>

                    <div className="mt-1 text-xs text-white/35">
                      Please try again later.
                    </div>

                  </div>
                )}

              {/* No results */}
              {!loading &&
                !error &&
                filteredPlayers.length ===
                  0 && (
                  <div className="px-6 py-16 text-center">

                    <Search className="mx-auto h-8 w-8 text-white/20" />

                    <div className="mt-3 text-sm font-semibold text-white">
                      No players found
                    </div>

                    <div className="mt-1 text-xs text-white/35">
                      Try searching for another username.
                    </div>

                  </div>
                )}

              {/* Results */}
              {!loading &&
                !error &&
                filteredPlayers.length >
                  0 && (
                  <>
                    {/* ==================================================
                        DESKTOP TABLE
                    =================================================== */}

                    <div className="hidden overflow-x-auto md:block">
                      <div className="min-w-[800px]">

                        {/* Table headings */}
                        <div className="grid grid-cols-[70px_minmax(250px,1fr)_100px_100px_100px_40px] items-center gap-3 border-b border-white/[0.07] px-5 py-3 text-[10px] uppercase tracking-wider text-white/30">

                          <div>
                            Rank
                          </div>

                          <div>
                            Player
                          </div>

                          <div className="text-right">
                            Wins
                          </div>

                          <div className="text-right">
                            Kills
                          </div>

                          <div className="text-right">
                            K/D
                          </div>

                          <div />

                        </div>

                        {/* Rows */}
                        {filteredPlayers.map(
                          (
                            player,
                            index,
                          ) => (
                            <button
                              key={
                                player.uuid
                              }
                              type="button"
                              onClick={() =>
                                openProfile(
                                  player,
                                )
                              }
                              className="grid w-full grid-cols-[70px_minmax(250px,1fr)_100px_100px_100px_40px] items-center gap-3 border-b border-white/[0.05] px-5 py-3.5 text-left transition last:border-0 hover:bg-white/[0.025]"
                            >

                              {/* Position */}
                              <div
                                className={`font-mono text-sm font-semibold ${
                                  index <
                                  3
                                    ? 'text-brand-400'
                                    : 'text-white/35'
                                }`}
                              >
                                #
                                {index +
                                  1}
                              </div>

                              {/* Player */}
                              <div className="flex min-w-0 items-center gap-3">

                                <PlayerHead
                                  uuid={
                                    player.uuid
                                  }
                                  name={
                                    player.name
                                  }
                                />

                                <div className="min-w-0">

                                  {/* RANK IMAGE DIRECTLY BEFORE NAME */}
                                  <div className="flex min-w-0 items-center gap-2">

                                    <RoleImage
                                      role={
                                        player.role
                                      }
                                    />

                                    <div className="truncate font-semibold text-white/90">
                                      {
                                        player.name
                                      }
                                    </div>

                                  </div>

                                  <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/25">
                                    {formatNumber(
                                      player.gamesPlayed,
                                    )}{' '}
                                    Games
                                  </div>

                                </div>
                              </div>

                              {/* Wins */}
                              <div className="text-right font-mono text-sm text-white/70">
                                {formatNumber(
                                  player.wins,
                                )}
                              </div>

                              {/* Kills */}
                              <div className="text-right font-mono text-sm text-white/70">
                                {formatNumber(
                                  player.kills,
                                )}
                              </div>

                              {/* K/D */}
                              <div className="text-right font-mono text-sm font-semibold text-brand-400">
                                {formatKd(
                                  player.kd,
                                )}
                              </div>

                              {/* Arrow */}
                              <ChevronRight className="h-4 w-4 text-white/20" />

                            </button>
                          ),
                        )}

                      </div>
                    </div>

                    {/* ==================================================
                        MOBILE LIST
                    =================================================== */}

                    <div className="divide-y divide-white/[0.05] md:hidden">

                      {filteredPlayers.map(
                        (
                          player,
                          index,
                        ) => (
                          <button
                            key={
                              player.uuid
                            }
                            type="button"
                            onClick={() =>
                              openProfile(
                                player,
                              )
                            }
                            className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-white/[0.025]"
                          >

                            {/* Position */}
                            <div
                              className={`w-7 shrink-0 text-center font-mono text-sm font-semibold ${
                                index <
                                3
                                  ? 'text-brand-400'
                                  : 'text-white/30'
                              }`}
                            >
                              {index +
                                1}
                            </div>

                            {/* Head */}
                            <PlayerHead
                              uuid={
                                player.uuid
                              }
                              name={
                                player.name
                              }
                            />

                            {/* Name + Role */}
                            <div className="min-w-0 flex-1">

                              <div className="flex min-w-0 items-center gap-2">

                                <RoleImage
                                  role={
                                    player.role
                                  }
                                />

                                <div className="truncate font-semibold text-white/90">
                                  {
                                    player.name
                                  }
                                </div>

                              </div>

                              <div className="mt-1 text-[10px] text-white/25">
                                {formatNumber(
                                  player.gamesPlayed,
                                )}{' '}
                                games
                              </div>

                            </div>

                            {/* Stats */}
                            <div className="text-right">

                              <div className="font-mono text-xs text-white/55">
                                {formatNumber(
                                  player.wins,
                                )}{' '}
                                W
                              </div>

                              <div className="mt-1 font-mono text-xs text-white/55">
                                {formatNumber(
                                  player.kills,
                                )}{' '}
                                K
                              </div>

                              <div className="mt-1 font-mono text-xs font-semibold text-brand-400">
                                {formatKd(
                                  player.kd,
                                )}{' '}
                                KD
                              </div>

                            </div>

                            <ChevronRight className="h-4 w-4 shrink-0 text-white/20" />

                          </button>
                        ),
                      )}

                    </div>
                  </>
                )}

            </div>
          </Reveal>

        </div>
      </section>

      {/* ==================================================
          PLAYER PROFILE MODAL
      =================================================== */}

      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedPlayer(null)
          }
        >

          <div
            className="glass w-full max-w-lg overflow-hidden rounded-2xl border border-white/10"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal header */}
            <div className="border-b border-white/10 px-5 py-4">

              <div className="text-[10px] uppercase tracking-[0.15em] text-brand-400/70">
                Player Profile
              </div>

            </div>

            <div className="p-6">

              {/* Player identity */}
              <div className="flex items-center gap-4">

                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5 ring-2 ring-brand-400/20">

                  <img
                    src={`https://mc-heads.net/avatar/${encodeURIComponent(selectedPlayer.uuid)}/160`}
                    alt={`${selectedPlayer.name} avatar`}
                    className="h-full w-full object-cover"
                  />

                </div>

                <div className="min-w-0">

                  {/* Rank image + username */}
                  <div className="flex min-w-0 items-center gap-2">

                    <RoleImage
                      role={
                        selectedPlayer.role
                      }
                    />

                    <h2 className="truncate font-display text-2xl font-bold text-white">
                      {
                        selectedPlayer.name
                      }
                    </h2>

                  </div>

                </div>

              </div>

              {/* Profile statistics */}
              {profileLoading ? (
                <div className="py-10 text-center text-sm text-white/35">
                  Loading profile...
                </div>
              ) : (
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

                  {/* Games played */}
                  <div className="rounded-xl bg-white/[0.03] p-4">

                    <div className="text-[10px] uppercase tracking-wider text-white/30">
                      Games Played
                    </div>

                    <div className="mt-2 font-mono text-lg font-semibold text-white">
                      {formatNumber(
                        selectedPlayer.gamesPlayed,
                      )}
                    </div>

                  </div>

                  {/* Wins */}
                  <div className="rounded-xl bg-white/[0.03] p-4">

                    <div className="text-[10px] uppercase tracking-wider text-white/30">
                      Wins
                    </div>

                    <div className="mt-2 font-mono text-lg font-semibold text-white">
                      {formatNumber(
                        selectedPlayer.wins,
                      )}
                    </div>

                  </div>

                  {/* Kills */}
                  <div className="rounded-xl bg-white/[0.03] p-4">

                    <div className="text-[10px] uppercase tracking-wider text-white/30">
                      Kills
                    </div>

                    <div className="mt-2 font-mono text-lg font-semibold text-white">
                      {formatNumber(
                        selectedPlayer.kills,
                      )}
                    </div>

                  </div>

                  {/* K/D */}
                  <div className="rounded-xl bg-brand-400/[0.06] p-4">

                    <div className="text-[10px] uppercase tracking-wider text-brand-400/50">
                      K/D
                    </div>

                    <div className="mt-2 font-mono text-lg font-semibold text-brand-400">
                      {formatKd(
                        selectedPlayer.kd,
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* Close button */}
              <div className="mt-5 flex justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPlayer(
                      null,
                    )
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Close
                </button>

              </div>

            </div>
          </div>

        </div>
      )}
    </>
  );
}