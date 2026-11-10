---
title: History
description: How the earlier Elan, Luciole and Carnot families became one lineup.
order: 5
section: About
---

Before aulvero-train, training code lived in three separate folders: three "families" with
identical code and different configs. They were merged into one codebase, following current industry
practice: one model line, one architecture, several data recipes.

| Former family | Purpose | What it became |
|---|---|---|
| **Luciole** | Balanced, long-context general model | Its data became the main `pretrain` recipe, and its choices (QK norm everywhere, RoPE θ 50,000, 4K context) became the defaults |
| **Carnot** | Code- and reasoning-heavy | Its data became the `code` recipe, reserved for the future Code variant |
| **Elan** | Fast, cheap iteration | Its data became the `pilot` recipe, and `configs/pilot.yaml` is the smoke-test run |

The shared `francogpt` package became `aulvero`, and the model class became `AulveroLM`.

## Former model shapes

Kept for reference.

| Family | Size | Params | Layers | Width | Heads | KV | FFN | Context |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Elan | tiny | 75.7M | 10 | 640 | 10 | 2 | 1,792 | 2,048 |
| Elan | small | 147.9M | 16 | 768 | 12 | 4 | 2,304 | 2,048 |
| Elan | base | 302.8M | 26 | 960 | 15 | 5 | 2,560 | 2,048 |
| Elan | large | 601.4M | 31 | 1,280 | 20 | 5 | 3,456 | 4,096 |
| Luciole | tiny | 78.7M | 12 | 640 | 10 | 2 | 1,536 | 4,096 |
| Luciole | small | 147.9M | 16 | 768 | 12 | 4 | 2,304 | 4,096 |
| Luciole | base | 311.5M | 24 | 1,024 | 16 | 4 | 2,688 | 4,096 |
| Luciole | large | 618.7M | 32 | 1,280 | 20 | 5 | 3,456 | 4,096 |
| Carnot | tiny | 75.7M | 9 | 640 | 10 | 2 | 2,048 | 4,096 |
| Carnot | small | 148.7M | 12 | 896 | 14 | 2 | 2,560 | 4,096 |
| Carnot | base | 293.6M | 16 | 1,024 | 16 | 4 | 4,096 | 4,096 |
| Carnot | large | 609.4M | 23 | 1,280 | 20 | 5 | 5,120 | 8,192 |

To recreate one, copy a model file in `configs/`, set these values, and point
`pretrain.train_bin` / `val_bin` at the matching recipe.
