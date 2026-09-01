import { site } from '@/lib/content';

export type ServerStatus = {
  online: boolean;
  players: number;
  maxPlayers: number;
  version: string;
  ip: string;
  latencyMs: number;
};

const API_URL = 'https://api.spearroyale.com/api/v1/server';

export async function fetchServerStatus(): Promise<ServerStatus> {
  const start = performance.now();

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      cache: 'no-store',
    });

    const latencyMs = Math.round(performance.now() - start);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    return {
      online: true,
      players: data.online_players ?? 0,
      maxPlayers: data.max_players ?? 400,
      version: site.server.version,
      ip: site.server.ip,
      latencyMs,
    };
  } catch (error) {
    console.error('Failed to fetch Spear Royale server status:', error);

    return {
      online: false,
      players: 0,
      maxPlayers: 400,
      version: site.server.version,
      ip: site.server.ip,
      latencyMs: 0,
    };
  }
}