import { load as yamlLoad } from 'js-yaml';

// YAML content files imported as raw strings by Vite
import siteYml from '@/content/site.yml?raw';
import homeYml from '@/content/home.yml?raw';
import howToPlayYml from '@/content/how-to-play.yml?raw';
import leaderboardYml from '@/content/leaderboard.yml?raw';
import rulesYml from '@/content/rules.yml?raw';
import staffYml from '@/content/staff.yml?raw';
import storeYml from '@/content/store.yml?raw';
import punishmentsYml from '@/content/punishments.yml?raw';
import newsYml from '@/content/news.yml?raw';
import faqYml from '@/content/faq.yml?raw';

function parse<T>(raw: string): T {
  return yamlLoad(raw) as T;
}

export const site = parse<SiteConfig>(siteYml);
export const home = parse<HomeContent>(homeYml);
export const howToPlay = parse<HowToPlayContent>(howToPlayYml);
export const leaderboard = parse<LeaderboardContent>(leaderboardYml);
export const rules = parse<RulesContent>(rulesYml);
export const staff = parse<StaffContent>(staffYml);
export const store = parse<StoreContent>(storeYml);
export const punishments = parse<PunishmentsContent>(punishmentsYml);
export const news = parse<NewsContent>(newsYml);
export const faq = parse<FaqContent>(faqYml);

// ---------- Types ----------

export type SiteConfig = {
  server: {
    name: string;
    ip: string;
    discordUrl: string;
    discordShortUrl: string;
    storeUrl: string;
    version: string;
    region: string;
  };
  nav: { label: string; path: string }[];
  footerLinks: { label: string; href: string }[];
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    description: string;
    stats: { value: string; label: string }[];
  };
  serverStatus: { players: number; maxPlayers: number; latencyMs: number };
  whyFeatures: { icon: string; title: string; description: string }[];
  features: { icon: string; title: string; description: string }[];
  ranksPreview: {
    eyebrow: string;
    title: string;
    description: string;
    viewAllText: string;
    viewAllHref: string;
  };
  community: {
    eyebrow: string;
    title: string;
    description: string;
    buttonText: string;
    stats: string[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
};

export type HowToPlayContent = {
  header: PageHeader;
  overview: { icon: string; title: string; description: string; value: string }[];
  matchFlow: { step: number; icon: string; title: string; description: string }[];
  lootTiers: { name: string; description: string; color: string }[];
  lootDetails: { icon: string; title: string; description: string }[];
  chooseableGamemodes: { icon: string; name: string; description: string }[];
  randomGamemodes: { icon: string; name: string; description: string }[];
  zoneTimeline: { time: string; description: string }[];
  teamRules: string[];
  matchRules: string[];
};

export type LeaderboardContent = {
  header: PageHeader;
  seasons: { label: string; active: boolean }[];
  entries: {
    rank: number;
    name: string;
    rankTitle: string;
    wins: number;
    kills: number;
    score: number;
  }[];
};

export type RulesContent = {
  header: PageHeader;
  categories: {
    id: string;
    icon: string;
    name: string;
    rules: { text: string; severity: string }[];
  }[];
  severityLegend: {
    level: string;
    label: string;
    color: string;
    description: string;
  }[];
};

export type StaffContent = {
  header: PageHeader;
  roles: string[];
  members: { name: string; role: string; description: string }[];
};

export type StoreContent = {
  header: PageHeader;
  ranks: {
    name: string;
    tag: string;
    icon: string;
    description: string;
    perks: string[];
    price: string;
    accent: string;
    glow: string;
    featured: boolean;
  }[];
  cosmetics: { icon: string; name: string; description: string; price: string }[];
  storeInfo: { icon: string; title: string; description: string }[];
};

export type PunishmentsContent = {
  header: PageHeader;
  appeal: { title: string; description: string; buttonText: string; buttonHref: string };
  types: { type: string; icon: string; color: string; description: string }[];
  recent: {
    id: string;
    player: string;
    type: string;
    reason: string;
    staff: string;
    date: string;
  }[];
};

export type NewsContent = {
  header: PageHeader;
  tags: { label: string; active: boolean }[];
  posts: {
    title: string;
    tag: string;
    tagColor: string;
    date: string;
    author: string;
    excerpt: string;
    body: string;
    featured?: boolean;
  }[];
};

export type ProfilesContent = {
  header: PageHeader;
  featured: {
    name: string;
    rankTitle: string;
    wins: number;
    kills: number;
    deaths: number;
    score: number;
    matches: number;
    bestStreak: number;
    joinedDate: string;
  };
  players: {
    name: string;
    rankTitle: string;
    wins: number;
    kills: number;
    score: number;
  }[];
};

export type FaqContent = {
  header: PageHeader;
  categories: { label: string; active: boolean }[];
  items: { question: string; answer: string; category: string }[];
};

export type PageHeader = {
  eyebrow: string;
  title: string;
  description: string;
};
