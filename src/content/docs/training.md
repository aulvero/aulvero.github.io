---
title: Training
description: Configs, pre-training, fine-tuning, sampling and exporting a model to Hugging Face.
order: 4
section: Training
---

## Configs

Every model has one file in `configs/` with three sections:

- **`model`:** the shape
- **`pretrain`:** settings for pre-training
- **`finetune`:** settings for fine-tuning

Shared values live in `configs/defaults.yaml`, so a model file only lists what is specific to it.

```yaml
# configs/kestrel-250m.yaml
model:
  name: kestrel-250m
  max_seq_len: 4096
  n_layers: 26
  d_model: 896
  n_heads: 14
  n_kv_heads: 2
  d_ff: 2304

pretrain:
  seq_len: 4096
  micro_batch_size: 8          # per GPU; lower it if you run out of memory
  global_batch_tokens: 524288  # gradient accumulation is derived from this
  max_steps: 47500
  learning_rate: 0.0006
```

## Pre-training

```bash
GPUS=8 bash scripts/pretrain.sh kestrel-250m     # or: make pretrain MODEL=kestrel-250m GPUS=8
```

- **Batch size in tokens.** You set `global_batch_tokens`, and gradient accumulation is derived from
  it, so the same config works on 1 or 64 GPUs.
- **Warmup-stable-decay schedule.** The learning rate warms up, stays flat, then decays linearly over
  the last 20% of steps. To train longer, raise `max_steps` and resume from a checkpoint taken
  *before* the decay began.
- **Budgets.** Defaults are about 100 tokens per parameter, five times the Chinchilla ratio.
- **Checkpoints.** A `step-*.pt` file is written every `save_interval` steps (the last 3 are kept),
  plus `final.pt`. Writes are atomic, so a crash never leaves a broken file.
- **Logs.** Printed and appended to `checkpoints/<model>/pretrain/metrics.jsonl`.

To resume:

```bash
GPUS=8 bash scripts/pretrain.sh kestrel-250m \
  --resume checkpoints/kestrel-250m/pretrain/step-0020000.pt
```

### Planned budgets

| Model | Steps | Tokens / step | Total tokens |
|---|---:|---:|---:|
| Wren 50M | 19,000 | 262,144 | 5.0B |
| Finch 85M | 32,500 | 262,144 | 8.5B |
| Robin 125M | 47,500 | 262,144 | 12.5B |
| Lark 160M | 30,500 | 524,288 | 16.0B |
| Kestrel 250M | 47,500 | 524,288 | 24.9B |
| Osprey 350M | 67,000 | 524,288 | 35.1B |
| Heron 500M | 47,500 | 1,048,576 | 49.8B |
| Crane 700M | 67,000 | 1,048,576 | 70.3B |
| Condor 900M | 86,000 | 1,048,576 | 90.2B |

## Fine-tuning

```bash
GPUS=8 bash scripts/finetune.sh kestrel-250m     # or: make finetune MODEL=kestrel-250m GPUS=8
```

Fine-tuning starts from `checkpoints/<model>/pretrain/final.pt` and writes
`checkpoints/<model>/sft/final.pt`. Defaults are in the `finetune` section of
`configs/defaults.yaml`: two epochs, cosine schedule, peak learning rate 1e-4. See
[Data](/docs/data/#fine-tuning-data) for the expected format.

## Trying a checkpoint

```bash
# Base model: continues text
python scripts/generate.py --checkpoint checkpoints/kestrel-250m/pretrain/final.pt \
  --prompt "La France est"

# Instruct model: answers as an assistant
python scripts/generate.py --checkpoint checkpoints/kestrel-250m/sft/final.pt \
  --chat --prompt "Explique la photosynthèse."
```

## Exporting and publishing

```bash
python scripts/export_hf.py \
  --checkpoint checkpoints/kestrel-250m/sft/final.pt \
  --output exports/Kestrel-250M-Instruct-v1

huggingface-cli upload Aulvero/Kestrel-250M-Instruct-v1 exports/Kestrel-250M-Instruct-v1
```

The export is a standard `Qwen3ForCausalLM` folder in safetensors format, with the tokenizer and chat
template included. Once uploaded, set the variant's status to `"released"` in the website's
`src/data/models.ts`, and the model page will link to it.

## Roadmap

- Preference tuning (DPO) after fine-tuning
- Code variant: continued pre-training on the `code` recipe with fill-in-the-middle
- Context extension to 8K+ with RoPE scaling during the decay phase
- An evaluation harness with French and English benchmarks
