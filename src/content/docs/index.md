---
title: Introduction
description: What Aulvero is, how the model lineup is organised, and how to run the training code.
order: 1
section: Start here
---

Aulvero trains compact bilingual language models for **French and English**, from 50 million to
900 million parameters. These docs cover how the models are designed, what data they learn from, and
how to train one yourself with [aulvero-train](https://github.com/aulvero/aulvero-train).

## The lineup

Nine sizes share one architecture. Each size has a bird name, smallest to largest.

| Model | Params | Tier | Layers × width | Context |
|---|---:|---|---|---:|
| Wren | 50M | Tiny | 20 × 384 | 2,048 |
| Finch | 85M | Tiny | 21 × 512 | 2,048 |
| Robin | 125M | Tiny | 27 × 576 | 2,048 |
| Lark | 160M | Small | 29 × 640 | 4,096 |
| Kestrel | 250M | Small | 26 × 896 | 4,096 |
| Osprey | 350M | Small | 31 × 960 | 4,096 |
| Heron | 500M | Medium | 31 × 1,152 | 4,096 |
| Crane | 700M | Medium | 33 × 1,344 | 4,096 |
| Condor | 900M | Medium | 33 × 1,536 | 4,096 |

Each model ships in two variants:

- **Base** is the raw pre-trained model, for your own fine-tuning.
- **Instruct** is fine-tuned from Base to follow instructions and chat in French or English.

A **Code** variant (continued pre-training on code) is planned. See [Naming](/#naming) for how
names like `Kestrel-250M-Instruct-v1` are built.

## Repositories

| Repository | What it holds |
|---|---|
| [aulvero-train](https://github.com/aulvero/aulvero-train) | Pre-training and fine-tuning code, model configs, data recipes |
| [aulvero.github.io](https://github.com/aulvero/aulvero.github.io) | This website and these docs |
| [huggingface.co/Aulvero](https://huggingface.co/Aulvero) | Released weights |

## Quick start

You need Python 3.11+ and, for real runs, one or more NVIDIA GPUs. The tests run on a laptop CPU.

```bash
git clone https://github.com/aulvero/aulvero-train
cd aulvero-train
make install                 # .venv + dependencies
make test                    # unit tests, a few seconds on CPU
```

Check the pipeline end to end on the small pilot mix before spending real compute:

```bash
make prepare MIX=pilot       # download, tokenizer, packed token files
make pilot                   # 2,000-step run of a Wren-shaped model
```

Then train a real model:

```bash
make prepare                                 # main French / English / code mix
make pretrain MODEL=kestrel-250m GPUS=8      # -> Base
make finetune MODEL=kestrel-250m GPUS=8      # -> Instruct
make export   MODEL=kestrel-250m             # -> Hugging Face format
```

Run `make help` to list every command.

## Repository layout

```text
aulvero/          shared package: model, configs, data, chat format, LR schedules
pretrain/         pre-training entry point            -> Base models
finetune/         supervised fine-tuning entry point  -> Instruct models
configs/          one file per model + defaults.yaml shared by all of them
data/mixes/       pre-training data recipes (pretrain, code, pilot)
data/sft/         fine-tuning data (example.jsonl shows the format)
scripts/          data download, tokenizer, packing, launchers, export, sampling
tests/            unit and export tests
```

Generated files (`data/raw`, `data/packed`, `artifacts`, `checkpoints`, `exports`) are git-ignored.
Weights belong on Hugging Face, not in git.
