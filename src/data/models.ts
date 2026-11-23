/*
  Aulvero model registry
  ----------------------
  Shared model data for the home page, model pages and comparison.
  Technical guides in src/content/docs should be kept in sync with config changes.

  - Release a model:  set a variant's status to "released" and `released` to a date ("2026-12-01").
  - New version:      add an entry to that model's `versions` list.
  - New size:         copy a model entry. Its page appears at /models/<id>/.

  Shapes and training budgets mirror configs/*.yaml in Aulvero/aulvero-train.
*/

export type Status = "planned" | "training" | "released";
export type VariantId = "base" | "instruct" | "code";

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
  tagline: "More intelligence. Less memory.",
  description:
    "Aulvero is a GitHub organization working toward capable, small language models with a lower memory footprint. Follow our research, documentation and updates.",
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

export const variants: Variant[] = [
  {
    id: "base",
    name: "Base",
    summary: "Pre-trained",
    description:
      "The raw pre-trained model. It continues text rather than following instructions. Use it as the starting point for your own fine-tuning.",
    producedBy: "Pre-training on text and code",
  },
  {
    id: "instruct",
    name: "Instruct",
    summary: "Follows instructions",
    description:
      "Fine-tuned from Base to follow instructions and hold a conversation. Most people should start here.",
    producedBy: "Supervised fine-tuning of Base",
  },
];

// No models have been announced. Add entries here when ready to publish a model card.
export const models: Model[] = [];
