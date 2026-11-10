/*
  Aulvero model registry
  ----------------------
  The ONLY file you need to edit to change the lineup. Every page (home, model index,
  one page per model) is generated from it at build time.

  - Release a model:  set a variant's status to "released" and `released` to a date ("2026-12-01").
  - New version:      add an entry to that model's `versions` list.
  - New size:         copy a model entry. Its page appears at /models/<id>/.
  - New tier (1B+):   add an entry to `tiers`, then use its id on models.

  Shapes and training budgets mirror configs/*.yaml in Aulvero/aulvero-train.
*/

export type Status = "planned" | "training" | "released";
export type VariantId = "base" | "instruct" | "code";

export interface Tier {
  id: string;
  name: string;
  range: string;
  runsOn: string;
  blurb: string;
}

export interface Variant {
  id: VariantId;
  name: string;
  summary: string;
  description: string;
  producedBy: string;
  /** Variants marked `upcoming` are announced but not yet part of every model. */
  upcoming?: boolean;
}

export interface ModelVersion {
  version: string;
  released: string | null;
  variants: Partial<Record<VariantId, Status>>;
}

export interface Model {
  id: string;
  name: string;
  params: number;
  tier: string;
  context: number;
  config: { layers: number; hidden: number; heads: number; kvHeads: number; ffn: number };
  /** Planned pre-training budget in tokens (max_steps x global_batch_tokens). */
  trainingTokens: number;
  license: string;
  summary: string;
  versions: ModelVersion[];
}

export const site = {
  name: "Aulvero",
  tagline: "Compact language models for French and English",
  description:
    "Aulvero builds compact bilingual French and English language models, from 50 million to 900 million parameters, that run on the hardware people already own.",
  languages: ["French", "English"],
  links: {
    github: "https://github.com/aulvero",
    trainingRepo: "https://github.com/aulvero/aulvero-train",
    huggingFace: "https://huggingface.co/Aulvero",
  },
};

export const architecture = {
  type: "Decoder-only transformer",
  attention: "Grouped-query attention",
  qkNorm: "Per-head RMSNorm",
  positional: "RoPE, θ = 50,000",
  activation: "SwiGLU",
  norm: "RMSNorm, pre-norm",
  vocab: 49152,
  tiedEmbeddings: true,
  hfArchitecture: "Qwen3ForCausalLM",
};

export const tiers: Tier[] = [
  {
    id: "tiny",
    name: "Tiny",
    range: "50M – 125M",
    runsOn: "Phones, browsers, embedded devices",
    blurb:
      "Small enough to run inside a web page or on low-power devices. Fast and inexpensive, and strong on narrow tasks once fine-tuned.",
  },
  {
    id: "small",
    name: "Small",
    range: "160M – 350M",
    runsOn: "Phones and laptops",
    blurb:
      "The everyday middle. Runs comfortably on a phone or any laptop CPU, with enough capacity for general instruction following.",
  },
  {
    id: "medium",
    name: "Medium",
    range: "500M – 900M",
    runsOn: "Laptops and single GPUs",
    blurb:
      "Our most capable models. Still small enough for one consumer GPU or a recent laptop, with noticeably stronger reasoning and writing.",
  },
];

export const variants: Variant[] = [
  {
    id: "base",
    name: "Base",
    summary: "Pre-trained",
    description:
      "The raw pre-trained model. It continues text rather than following instructions. Use it as the starting point for your own fine-tuning.",
    producedBy: "Pre-training on French, English and code",
  },
  {
    id: "instruct",
    name: "Instruct",
    summary: "Follows instructions",
    description:
      "Fine-tuned from Base to follow instructions and hold a conversation in French or English. Most people should start here.",
    producedBy: "Supervised fine-tuning of Base",
  },
  {
    id: "code",
    name: "Code",
    summary: "Coming later",
    description:
      "Base models further pre-trained on a code-heavy mix with fill-in-the-middle, for completion and repository understanding.",
    producedBy: "Continued pre-training on code",
    upcoming: true,
  },
];

const v1 = (): ModelVersion[] => [{ version: "v1", released: null, variants: { base: "planned", instruct: "planned" } }];

export const models: Model[] = [
  {
    id: "wren",
    name: "Wren",
    params: 50e6,
    tier: "tiny",
    context: 2048,
    config: { layers: 20, hidden: 384, heads: 6, kvHeads: 2, ffn: 1024 },
    trainingTokens: 19_000 * 262_144,
    license: "TBA",
    summary: "Our smallest model, built for the browser and tiny devices.",
    versions: v1(),
  },
  {
    id: "finch",
    name: "Finch",
    params: 85e6,
    tier: "tiny",
    context: 2048,
    config: { layers: 21, hidden: 512, heads: 8, kvHeads: 2, ffn: 1408 },
    trainingTokens: 32_500 * 262_144,
    license: "TBA",
    summary: "A step up from Wren, with more room for vocabulary and facts.",
    versions: v1(),
  },
  {
    id: "robin",
    name: "Robin",
    params: 125e6,
    tier: "tiny",
    context: 2048,
    config: { layers: 27, hidden: 576, heads: 9, kvHeads: 3, ffn: 1536 },
    trainingTokens: 47_500 * 262_144,
    license: "TBA",
    summary: "The largest of the tiny tier and a good default for on-device tasks.",
    versions: v1(),
  },
  {
    id: "lark",
    name: "Lark",
    params: 160e6,
    tier: "small",
    context: 4096,
    config: { layers: 29, hidden: 640, heads: 10, kvHeads: 2, ffn: 1792 },
    trainingTokens: 30_500 * 524_288,
    license: "TBA",
    summary: "Entry to the small tier, with a longer 4K context window.",
    versions: v1(),
  },
  {
    id: "kestrel",
    name: "Kestrel",
    params: 250e6,
    tier: "small",
    context: 4096,
    config: { layers: 26, hidden: 896, heads: 14, kvHeads: 2, ffn: 2304 },
    trainingTokens: 47_500 * 524_288,
    license: "TBA",
    summary: "A balanced, general-purpose model that runs well on a phone.",
    versions: v1(),
  },
  {
    id: "osprey",
    name: "Osprey",
    params: 350e6,
    tier: "small",
    context: 4096,
    config: { layers: 31, hidden: 960, heads: 15, kvHeads: 5, ffn: 2560 },
    trainingTokens: 67_000 * 524_288,
    license: "TBA",
    summary: "The strongest small model, for when quality matters more than speed.",
    versions: v1(),
  },
  {
    id: "heron",
    name: "Heron",
    params: 500e6,
    tier: "medium",
    context: 4096,
    config: { layers: 31, hidden: 1152, heads: 18, kvHeads: 6, ffn: 3072 },
    trainingTokens: 47_500 * 1_048_576,
    license: "TBA",
    summary: "Half a billion parameters, comfortable on any modern laptop.",
    versions: v1(),
  },
  {
    id: "crane",
    name: "Crane",
    params: 700e6,
    tier: "medium",
    context: 4096,
    config: { layers: 33, hidden: 1344, heads: 21, kvHeads: 7, ffn: 3584 },
    trainingTokens: 67_000 * 1_048_576,
    license: "TBA",
    summary: "Stronger reasoning and writing, still on a single consumer GPU.",
    versions: v1(),
  },
  {
    id: "condor",
    name: "Condor",
    params: 900e6,
    tier: "medium",
    context: 4096,
    config: { layers: 33, hidden: 1536, heads: 24, kvHeads: 8, ffn: 4096 },
    trainingTokens: 86_000 * 1_048_576,
    license: "TBA",
    summary: "Our largest model and the flagship of the lineup.",
    versions: v1(),
  },
].sort((a, b) => a.params - b.params);
