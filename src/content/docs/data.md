---
title: Data
description: The pre-training data recipes, how data is prepared, and the fine-tuning data format.
order: 3
section: Training
---

## Recipes

A recipe is a YAML file in `data/mixes/` listing the Hugging Face datasets to stream and how many
documents to take from each.

| Recipe | File | Use |
|---|---|---|
| `pretrain` | `data/mixes/pretrain.yaml` | Main recipe for every Base model |
| `code` | `data/mixes/code.yaml` | Code-heavy recipe for the future **Code** variant, used for continued pre-training from a Base checkpoint |
| `pilot` | `data/mixes/pilot.yaml` | Small and cheap, for checking the pipeline before real runs |

All three draw from the same sources, in different proportions:

| Source | Content |
|---|---|
| [FineWeb-2](https://huggingface.co/datasets/HuggingFaceFW/fineweb-2) (`fra_Latn`) | French web text |
| [FineWeb-Edu](https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu) | English educational text |
| [github-code](https://huggingface.co/datasets/codeparrot/github-code) | Source code under permissive licences only (MIT, Apache-2.0, BSD, ISC, CC0, Unlicense) |

Review each dataset card and licence before any commercial use.

## Preparing data

```bash
bash scripts/prepare.sh pretrain     # or: make prepare MIX=pretrain
```

This runs three steps:

1. **Download.** `scripts/download_data.py` streams each source, cleans the text (Unicode
   normalisation and whitespace; code keeps its indentation), filters low-quality documents and drops
   exact duplicates. About 0.2% of documents go to a validation split.
2. **Tokenizer.** `scripts/train_tokenizer.py` trains the shared tokenizer the first time a recipe is
   prepared. Delete `artifacts/tokenizer` to retrain it.
3. **Packing.** `scripts/pack_data.py` turns each document into `<bos> … <eos>` tokens and writes
   flat `uint32` files to `data/packed/<recipe>/`.

### Scaling up

The `max_documents` values in the recipes are sized for pilots. For a full run, raise them until the
packed data holds **at least** as many tokens as the model's planned budget. The budget is written at
the top of each config file, and `pack_data.py` prints the token count when it finishes.

## Fine-tuning data

Fine-tuning reads a Hugging Face dataset or a local `.jsonl` file. Each row has a `messages` list:

```json
{"messages": [
  {"role": "system", "content": "Tu es un assistant utile et concis."},
  {"role": "user", "content": "Quelle est la capitale de la France ?"},
  {"role": "assistant", "content": "La capitale de la France est Paris."}
]}
```

Roles are `system`, `user` and `assistant`. Conversations are formatted with ChatML, and the loss is
computed on assistant replies only. `data/sft/example.jsonl` holds a few French and English examples.

The default dataset (`HuggingFaceTB/smol-smoltalk`) is English. For the French side, add French
conversations in the same format and point `finetune.dataset` at the combined file.
