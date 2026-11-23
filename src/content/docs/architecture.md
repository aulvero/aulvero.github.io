---
title: Architecture
description: The transformer design and example configuration in the training code.
order: 2
section: Models
---

The training code uses a dense decoder-only transformer. The configuration below is a code example, not an announced model.

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

## Configuration

| Configuration | Params | Layers | Width | Q heads | KV heads | FFN | Context |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| kestrel-250m | 252.8M | 26 | 896 | 14 | 2 | 2,304 | 4,096 |

These values describe the example training configuration. They are not specifications for a released or announced model.

## Tokenizer

One byte-level BPE tokenizer with 49,152 tokens, trained on the main French / English / code mix and
used for both Base and Instruct.

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
