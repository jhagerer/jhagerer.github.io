---
title: "Predicting consensus in legal document interpretation"
subtitle: "Waldon, Brodsky, Ma & Degen (2023) — false consensus bias in contract reading, and whether an LLM can predict it"
date: 2026-09-06 10:00:00 +0200
tags: [papers]
venue-name: "Cognitive Science Society"
thumbnail-img: /assets/img/papers/waldon-false-consensus.png
thumbnail-alt: "Scatter plot of estimated agreement against actual agreement, with most points above the diagonal"
---

**Authors:** Brandon Waldon, Madigan Brodsky, Megan Ma, Judith Degen
(Department of Linguistics, Stanford University; Center for Legal Informatics, Stanford Law School)

**Year:** 2023

**Publisher:** *Proceedings of the Annual Meeting of the Cognitive Science Society*, 45(45)

**URL:** <https://escholarship.org/uc/item/8rq5012j>

**Keywords:** experimental jurisprudence, large language models, false consensus, linguistic ambiguity

## Abstract

> We present a large-scale conceptual replication of an experiment that provided
> evidence of false consensus biases in legal interpretation: when reading a legal
> contract, individuals tend to over-estimate the extent to which others would agree
> with their interpretation of that contract (Solan, Rosenblatt, & Osherson, 2008).
> Our results are consistent with this previous finding. We also observe substantial
> unexplained item-level variation in the extent to which individuals agree on contract
> interpretation, as well as unexplained variation in the extent to which the false
> consensus bias holds across different contexts. In a first step towards understanding
> the source(s) of this variability, we show that a state-of-the-art large language model
> (LLM) with zero-shot prompting does not robustly predict the degree to which interpreters
> will exhibit consensus in a given context. However, performance improves when the model
> is exposed to data of the form collected in our experiment, suggesting a path forward for
> modeling and predicting variability in the interpretation of legally-relevant natural language.

<small>Abstract quoted from the paper, which is published under a
<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> licence.</small>

<figure class="post-figure">
  <img src="/assets/img/papers/waldon-false-consensus.png"
       alt="Three scatter panels, one per condition: not covered, controversial and
            covered. Each plots a reader's mean estimate of how far others agree
            against the proportion of readers who in fact judged that way, with a
            dashed diagonal marking perfect calibration. Most points sit above the
            diagonal, and the gap is widest in the middle, controversial panel.">
  <figcaption>The bias itself: what readers expect others to agree against what
  others in fact answered, by condition. Points above the dashed diagonal are
  over-estimates. From the authors' replication package
  (<a href="https://github.com/madiganbrodsky/vague_contracts">analyses/1_falseconsensus</a>).</figcaption>
</figure>

## Notes

<!-- Reading notes go here. -->
