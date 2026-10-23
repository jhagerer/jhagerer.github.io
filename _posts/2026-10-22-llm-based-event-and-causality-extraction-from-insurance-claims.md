---
title: "LLM-Based Event and Causality Extraction from Insurance Claims"
subtitle: "Master's thesis in Informatics, Technical University of Munich (TUM), in cooperation with Inverso GmbH, October 2026"
date: 2026-10-22 11:00:00 +0200
tags: [projects, technical-university-of-munich, thesis-topic]
venue-name: "Johann Hagerer & TUM & LMU"
venue-logo:
  - profile.jpg
  - tum.svg
---

## Motivation

When a claims handler reads a liability claim, the key questions are: what
happened, in what order, and what caused what? Take "I knocked over a shelf, my
neighbour's vase fell and broke, and the pieces scratched the floor." This causal
chain decides who pays.

To test large language models (LLMs) on claims processing, we need realistic data.
But real claim descriptions contain personal data protected by the GDPR, so they
can't be shared freely. In earlier work at Inverso, we built a pipeline that turns
real claims into synthetic ones. It extracts a knowledge graph of entities and
relations from each claim and then rewrites a new claim step by step. The resulting
synthetic claims preserve the entities and their relations, such as the persons
involved and the damaged objects. However, they often do not preserve the order of
events and the causal links between them, even though these determine liability.

This thesis closes that gap. It extracts event structures from claims and uses them
to steer the generation of synthetic claims.

## Research questions

- **RQ1:** How well can LLMs extract event triggers, event types, participant roles
  and event relations from liability-relevant text, without any task-specific
  training?
- **RQ2:** How well does this extraction transfer to German private liability (PHV)
  claim descriptions?
- **RQ3:** Does conditioning synthetic claim generation on the extracted event
  structure preserve causal logic, temporal order and event content better than a
  baseline without this conditioning?

## Approach

All extraction is training-free (zero-shot and few-shot prompting). It uses the 168
event types of MAVEN and the causal and temporal relations of MAVEN-ERE. Three
generation variants are compared: the existing baseline (knowledge graph + style),
an event-conditioned iterative pipeline, and an event-conditioned one-shot
generator. To evaluate whether a generated claim preserves the event structure of
the original claim, the same extraction pipeline is applied to each generated claim
(round-trip extraction). The evaluation then measures which share of the original
causal and temporal relations is recovered. Overall, 11 metrics cover text
similarity, knowledge graph faithfulness, holistic quality (LLM judge) and event
structure.

## Main outcomes

- **RQ1: LLMs extract events and relations reliably enough for downstream use, but
  remain below fine-tuned models.** Across 8 event detection, 5 relation extraction
  and 2 argument extraction approaches, the best event detection reaches a trigger
  classification F1 of 0.565. The two design choices with the largest effect are
  reducing the 168 event types to a small set of candidate types before
  classification, and adding annotated examples to the prompt (few-shot). Relation
  extraction reaches 41.4% F1 for temporal and 27.4% for causal relations. That is
  clearly above GPT-4 5-shot results reported in the literature, but still below
  fine-tuned models. Causal relations are consistently harder to extract than
  temporal ones.
- **RQ2: The pipeline transfers to German claims without training or translation.**
  On 300 real PHV claims, it finds 3.72 events per claim on average. 250 claims
  contain at least one causal relation and 260 at least one temporal relation. The
  most common event types (damaging, motion, placing, destroying) fit what liability
  claims are about. No gold labels exist for German claims, so the quality was
  checked indirectly through RQ3.
- **RQ3: Conditioning on event structure clearly improves the generated claims.**
  Compared to the baseline, the event-conditioned pipelines more than double causal
  edge recall (0.18 → 0.38 iterative / 0.47 one-shot). They roughly triple temporal
  edge recall (0.15 → 0.43 / 0.48) and double event type F1. An LLM judge also rates
  them higher overall (0.60 vs. 0.52). The cost is a very small drop in knowledge
  graph faithfulness (at most 0.015). In one example, the baseline produced a
  generic damage report that mentioned none of the original events. The
  event-conditioned version, by contrast, described the fold-away bed, the torn-out
  mounting and the collapse of the bed, and linked these events causally as in the
  original claim. The one-shot variant is best for event fidelity, and the iterative
  variant is best for overall claim quality.

| Category | Metric | Baseline | Event-conditioned (iterative) | Event-conditioned (one-shot) |
|---|---|---|---|---|
| Text similarity | Cosine similarity | 0.773 | 0.820 | **0.847** |
| | BLEU\* | 0.016 | 0.025 | 0.048 |
| | ROUGE-L\* | 0.117 | 0.154 | 0.233 |
| | Jaccard\* | 0.115 | 0.150 | 0.214 |
| Knowledge graph faithfulness | Structural GED | **0.913** | 0.908 | 0.898 |
| | Schema-aligned | **0.890** | 0.885 | 0.876 |
| Holistic quality | LLM judge | 0.515 | **0.604** | 0.590 |
| Event structure | Event type F1 | 0.215 | 0.429 | **0.539** |
| | Event structure recall | 0.227 | 0.521 | **0.573** |
| | Causal edge recall | 0.180 | 0.382 | **0.467** |
| | Temporal edge recall | 0.154 | 0.430 | **0.482** |

*Results of the three generation approaches (mean over 300 claims for the baseline
and the iterative pipeline, 244 claims for the one-shot pipeline). Higher is better;
best values in bold. \*Lexical overlap metrics have no single best direction: low
values mean the text was paraphrased rather than copied.*

## Future work

The most important open question is realism: **are the synthetic claims so real that
an experienced claims handler cannot tell them apart from genuine ones?** A blind
study, where handlers judge a mix of real and synthetic claims, would show whether
this synthetic data can replace real claims in benchmarks and model training.
Further steps include expert gold annotations for German claims and tests on other
lines of business, such as motor and property insurance.

## Key literature

- Wang, X. et al. (2020). [MAVEN: A Massive General Domain Event Detection Dataset](https://aclanthology.org/2020.emnlp-main.129). EMNLP 2020.
- Wang, X. et al. (2022). [MAVEN-ERE: A Unified Large-scale Dataset for Event Coreference, Temporal, Causal, and Subevent Relation Extraction](https://aclanthology.org/2022.emnlp-main.60). EMNLP 2022.
