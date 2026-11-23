---
title: Introduction
description: Our focus, the current training code, and how to explore the project.
order: 1
section: Start here
---

Aulvero is a GitHub organization working toward **highly capable, small general-purpose language models with a lower memory footprint**.

There are **no models announced or released yet**. Follow [Updates](/updates/) for our direction and future progress.

## About these docs

These pages describe the current training code, data recipes, and example configurations. They are technical references, not specifications for an announced model. Names such as `kestrel-250m` in commands refer to example configurations in the training repository.

Model cards will appear on [Models](/models/) when there is a model to announce. Evaluation results will appear on [Comparison](/comparison/) when available.

## Repositories

| Repository | What it holds |
|---|---|
| [aulvero-train](https://github.com/aulvero/aulvero-train) | Pre-training and fine-tuning code, model configs, data recipes |
| [aulvero.github.io](https://github.com/aulvero/aulvero.github.io) | This website and these docs |
| [huggingface.co/Aulvero](https://huggingface.co/Aulvero) | Future model releases |

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
make pilot                   # 2,000-step pipeline check
```

To run the example training configuration:

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
