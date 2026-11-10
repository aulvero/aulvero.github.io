---
title: Architecture
description: The transformer design shared by every Aulvero model, the size table, and the tokenizer.
order: 2
section: Models
---

All Aulvero models share one architecture. Sizes differ only in depth, width, head count and
feed-forward size, so one codebase and one export path cover the whole lineup.

## Design

| Component | Choice | Why |
|---|---|---|
| Type | Dense decoder-only transformer | The standard for open small models (Llama 3, Qwen 3, SmolLM, Gemma 3) |
| Normalisation | RMSNorm, pre-norm | Stable and cheap |
| Attention | Grouped-query attention (GQA) | Smaller KV cache, so faster inference on phones and laptops |
| QK norm | RMSNorm on each query and key head | Stabilises training at higher learning rates (Qwen 3, OLMo 2, Gemma 3) |
| Positions | RoPE, θ = 50,000 | Leaves room to extend the context later |
| Feed-forward | SwiGLU | Better quality per parameter than GELU MLPs |
| Embeddings | Tied input and output | Saves 19–75M parameters, which matters most at small sizes |
| Biases | None | Simpler, with no quality loss |
| Head dimension | 64 at every size | Same kernels and export path everywhere |

### Deep and thin

Below a billion parameters, models do better deep and narrow than shallow and wide at the same
parameter count (MobileLLM, SmolLM2). Wren 50M has 20 layers and Condor 900M has 33, where a
GPT-2-style layout would use 12–24.

## Sizes

| Model | Params | Layers | Width | Q heads | KV heads | FFN | Context |
|---|---:|---:|---:|---:|---:|---:|---:|
| wren-50m | 50.3M | 20 | 384 | 6 | 2 | 1,024 | 2,048 |
| finch-85m | 84.4M | 21 | 512 | 8 | 2 | 1,408 | 2,048 |
| robin-125m | 123.9M | 27 | 576 | 9 | 3 | 1,536 | 2,048 |
| lark-160m | 159.8M | 29 | 640 | 10 | 2 | 1,792 | 4,096 |
| kestrel-250m | 252.8M | 26 | 896 | 14 | 2 | 2,304 | 4,096 |
| osprey-350m | 352.0M | 31 | 960 | 15 | 5 | 2,560 | 4,096 |
| heron-500m | 495.5M | 31 | 1,152 | 18 | 6 | 3,072 | 4,096 |
| crane-700m | 702.0M | 33 | 1,344 | 21 | 7 | 3,584 | 4,096 |
| condor-900m | 906.1M | 33 | 1,536 | 24 | 8 | 4,096 | 4,096 |

`make count` prints this table from the configs. A test fails if any model drifts more than 3%
from the size in its name.

## Tokenizer

One byte-level BPE tokenizer with 49,152 tokens, trained on the main French / English / code mix and
shared by every size.

| Token | Use |
|---|---|
| `<bos>` `<eos>` | Document boundaries in pre-training |
| `<pad>` `<unk>` | Padding and unknown |
| `<\|im_start\|>` `<\|im_end\|>` | Chat turns (ChatML) for Instruct models |
| `<fim_prefix>` `<fim_middle>` `<fim_suffix>` `<file_sep>` | Reserved for the Code variant (fill-in-the-middle) |

## Compatibility

Parameter names map one-to-one onto Hugging Face `Qwen3ForCausalLM`. `scripts/export_hf.py` converts
a checkpoint, and a test checks that the exported model produces the same outputs as the original.
Released models load with `transformers`, vLLM, llama.cpp and Ollama, with no Aulvero code needed.
