---
title: Quality and memory belong in the same conversation.
description: What we want to understand before calling a small model a good model.
date: 2026-11-23
category: Research perspective
artwork: measure
order: 2
---

A parameter count tells you how large a model is. It does not tell you how useful it is, or exactly how much memory your application will need.

At Aulvero, we want to look at **capability and resource use together**. This is our intended approach to evaluating future models, not a report of results.

## Start with useful work

We want to understand how a model handles the tasks people need it for. Evaluation should make the tasks, settings, and limitations clear, so a score has context.

## Look beyond the weights

The memory occupied by model weights is only part of the picture. Inference also needs memory for cached context and intermediate computation. Precision, context length, batch size, hardware, and runtime can all change the footprint.

A meaningful memory measurement needs to describe those conditions.

## Make comparisons understandable

When we have results to share, our aim is to show quality alongside memory use and the setup used to measure it. That makes the tradeoffs easier to assess.

There are no published measurements yet. The [Comparison](/comparison/) page will hold results when they are available.
