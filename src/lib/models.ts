import { architecture, models, site, tiers, variants, type Model, type ModelVersion, type Status, type VariantId } from "../data/models";

export const STATUS_LABEL: Record<Status, string> = {
  planned: "Planned",
  training: "In training",
  released: "Released",
};

const RANK: Record<Status, number> = { planned: 0, training: 1, released: 2 };

/** The variants every model ships with (excludes announced-but-upcoming ones). */
export const coreVariants = variants.filter((v) => !v.upcoming);

export function fmtParams(n: number): string {
  if (n >= 1e9) return `${+(n / 1e9).toFixed(1)}B`;
  return `${Math.round(n / 1e6)}M`;
}

export function fmtTokens(n: number): string {
  if (n >= 1e12) return `${+(n / 1e12).toFixed(1)}T`;
  return `${+(n / 1e9).toFixed(1)}B`;
}

export function fmtBytes(b: number): string {
  if (b >= 1e9) return `${+(b / 1e9).toFixed(1)} GB`;
  return `${Math.round(b / 1e6)} MB`;
}

export const fmtInt = (n: number) => n.toLocaleString("en-US");

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const latest = (m: Model): ModelVersion => m.versions[m.versions.length - 1];

export function modelStatus(m: Model, version: ModelVersion = latest(m)): Status {
  return Object.values(version.variants).reduce<Status>((best, s) => (s && RANK[s] > RANK[best] ? s : best), "planned");
}

export const tierOf = (m: Model) => tiers.find((t) => t.id === m.tier)!;
export const variantOf = (id: VariantId) => variants.find((v) => v.id === id)!;
export const indexOf = (m: Model) => models.indexOf(m) + 1;

/** "Aulvero/Kestrel-250M-Instruct-v1" */
export function repoId(m: Model, variant: VariantId, version: string): string {
  return `${site.name}/${m.name}-${fmtParams(m.params)}-${variantOf(variant).name}-${version}`;
}

/** Exact parameter count from the shape; mirrors aulvero.model.estimate_parameters. */
export function exactParams(m: Model): number {
  const { layers, hidden: d, heads, kvHeads, ffn } = m.config;
  const hd = d / heads;
  const attention = 2 * d * heads * hd + 2 * d * kvHeads * hd;
  const block = attention + 2 * hd + 2 * d + 3 * d * ffn;
  return architecture.vocab * d + layers * block + d;
}
