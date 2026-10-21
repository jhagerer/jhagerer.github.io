---
title: "Detecting Controversial Claim–Policy Pairs: Three Training-Free LLM Workflows"
subtitle: "TUM NLP Lab Course, winter term 2026/27 — topic definition for my student group on insurance and legal NLP"
date: 2026-10-21 14:00:00 +0200
tags: [projects]
venue-name: "Johann Hagerer"
venue-logo: profile.jpg
---

| Field | Value |
|---|---|
| Industry supervisor | Dr. Gerhard Johann Hagerer, Inverso GmbH (I-DNA) |
| Domain | NLP / LLM reasoning, insurance coverage assessment (Deckungsprüfung) |
| Dataset | Waldon et al. (2023) replication package; also distributed as LegalBench `insurance_policy_interpretation` |
| Size | 138 items — 46 controversial, 92 unambiguous |
| Training required | None. All workflows are prompt-level and run against any chat API. |

## Abstract

Before a coverage decision can be automated, a system must recognise the cases it
should not decide alone. Waldon et al. (2023) built 138 insurance vignettes in which
a policy definition is held constant while the claim narrative varies, producing
pairs that are uncontroversially covered, uncontroversially not covered, or
controversial — the last defined by the absence of consensus among human readers.
This project treats the identification of controversial pairs as a binary detection
task and compares three training-free LLM workflows on it: SelfCheckGPT as the
established baseline, disambiguation rewrites with Chain of Logic, and a
reader-persona ensemble. Evidence about which proxy tracks human disagreement best
transfers directly to escalation logic in production coverage systems. Last but not
least, we investigate how LLMs process Kleene's strong three-valued logic, where
besides "true" and "false" an additional value "unknown" propagates as U
(F ∧ U = F, T ∨ U = T).

## Task and success metric

Input: one (policy definition, claim narrative) pair. Output: a continuous
controversy score in [0,1]. A pair counts as positive if its dataset condition is
"controversial", and negative if it is "unambiguous_covered" or
"unambiguous_uncovered". This gives 46 positives and 92 negatives.

- **Primary metric:** AUROC of the controversy score against the binary controversial
  label. AUROC rather than accuracy, because each workflow scores on its own scale and
  a shared threshold would be arbitrary.
- **Secondary metric:** best F1 for the controversial class, with the threshold chosen
  on one half of the item groups and applied to the other half.
- **Third metric:** Spearman correlation between the controversy score and the
  empirical human disagreement per item, computed as the entropy of the
  yes / no / cannot-decide response distribution in the replication package. This
  target is graded rather than binary and is therefore more informative at n = 138.
- **Cost** is reported alongside quality: LLM calls per item and wall-clock time. A
  workflow that wins by 0.02 AUROC at ten times the cost is not the better workflow
  for production use.

Reporting the correlation against human entropy matters because the gold label is
itself derived from a response distribution: the three conditions were assigned by
thresholding multinomial confidence intervals over crowdworker answers, with
"ambiguous" as the residual category when no label reached consensus.

*Source: Waldon, Brodsky, Ma & Degen (2023); label derivation documented in Guha et
al. (2023), LegalBench.*

## Workflow A — SelfCheckGPT (baseline)

The reference method for detecting unreliable LLM output without training,
fine-tuning or access to model internals. It asks: does the model give the same
answer when asked repeatedly?

1. Ask the model for a coverage decision with a short justification at temperature 0.
   This is the reference answer.
2. Ask the same question k = 10 more times at temperature 1.0. These are the samples.
3. Score the consistency of the reference answer against the samples. The simple
   variant compares final labels; the NLI variant scores whether each sample entails
   the reference justification.
4. Controversy score = 1 − consistency.

*Source: Manakul, Liusie & Gales (2023), SelfCheckGPT, EMNLP 2023. Reference
implementation available in LM-Polygraph (Vashurin et al., TACL 2025) — use it rather
than reimplementing.*

## Workflow B — Disambiguation rewrites + Chain of Logic + Kleene K3

This workflow locates indeterminacy in the clause and in the facts. It combines three
published components:

| Component | What it contributes | Source |
|---|---|---|
| Disambiguation rewrites | Two sharp readings of the vague term in the policy definition | Liu et al. (2023), AmbiEnt |
| Chain of Logic | Decomposition of the clause into elements and a logical expression | Servantez et al. (2024) |
| Kleene K3 | Recomposition when an element is unresolved because the narrative does not state the fact | Kleene (1952) |
| Supervaluation | Combining the verdicts obtained under the two readings | Fine (1975) |

The workflow addresses two problems:

- **Information gap** — the predicate has a determinate meaning and a determinate
  truth value, but the narrative does not state the fact. It is represented as U and
  propagated by Kleene's three valued logic. An absorption keeps the decision
  determinate whenever the structure makes the missing fact moot
  (F ∧ U = F, T ∨ U = T).
- **Term vagueness** — no additional fact would settle the element, because the
  boundary of the term is not drawn. This is a semantic gap. It is represented by
  evaluating the clause under two sharp readings and comparing the results.

Because the policy definition is constant within each Waldon item group, steps 1–3
below run once per group and are reused across its three items. Any divergence is
then attributable to where the narrative sits relative to the boundary, not to
variation in the rewrites.

### Steps

1. **Locus selection.** Give the model only the policy definition and a list of the
   terms it contains. Ask which single term has a boundary that competent readers
   could draw in different places. The narrative is withheld at this stage, so the
   model cannot tailor the reading to the outcome.
2. **Rewrite generation.** Ask for two rewrites of the definition that differ only in
   how that term is understood: a narrow and a broad reading. Constrain the model to
   change only the wording expressing that term, to add no more than ten words, and to
   ensure every case falling under the narrow reading also falls under the broad one.
3. **Admissibility check.** In a fresh call, ask whether an average policyholder
   reading the policy attentively could arrive at each reading. Reject and regenerate
   anything judged inadmissible. A separate call is required because a model asked to
   judge its own output passes everything.
4. **Element decomposition.** Run Chain of Logic on the definition to obtain the
   elements E1 … En and the logical expression connecting them (for example
   Coverage = (E1 ∧ E2) ∧ ¬E3).
5. **Element evaluation, twice.** For each rewrite, evaluate every element against the
   narrative, returning T, F or U — U only where the narrative is silent on a fact,
   never where the term is merely vague, since the rewrite has already made it sharp.
6. **K3 recomposition.** Combine the element values using the Kleene truth tables, in
   deterministic code outside the model. This yields a verdict in {T, F, U} per
   rewrite.
7. **Supervaluation.** Compare the two verdicts: agreement means the pair is not
   controversial, divergence means it is. For a continuous score, repeat steps 2–6
   with k sampled reading pairs and report the proportion yielding coverage; a value
   near 0.5 is maximum divergence.

### Validation before any scoring

- **Subset property:** the set of items judged covered under the narrow reading must
  be a strict subset of those covered under the broad reading. If this fails, the
  model did not apply the rewrites and all downstream numbers are noise. This is the
  single most important check in the project.
- **Non-degeneracy:** if narrow and broad give identical verdicts on all three items
  of a group, the wrong term was selected; repeat step 1 with that term excluded.
- **Rewrite stability:** cluster the k sampled reading pairs by their extension over
  the group's items rather than by string similarity. Wording varies constantly,
  extensions rarely do.

*Source: Liu, Wu, Michael, Suhr, West, Koller, Swayamdipta, Smith & Choi (2023),
EMNLP 2023.*

## Workflow C — Reader-persona ensemble

This workflow simulates the disagreement directly. The gold label does not record
that a reader was uncertain; it records that readers disagreed. So instead of asking
one model repeatedly, ask several differently-disposed readers once each.

1. Define j personas that plausibly differ in how they read policy language — for
   example a cautious claims adjuster, a literal-minded consumer, a plaintiff's
   lawyer, an insurer's lawyer, a lay reader with no insurance experience. Five to ten
   is a reasonable range.
2. For each persona, in a separate call, present the policy and the narrative and ask
   for a YES / NO / CANNOT DECIDE verdict with one sentence of reasoning.
   Temperature 0 per persona, so variation comes from the persona and not from
   sampling.
3. Controversy score = entropy of the verdict distribution across personas.

*Source: Argyle, Busby, Fulda, Gubler, Rytting & Wingate (2023), "Out of One, Many",
Political Analysis — the silicon-sampling method of conditioning a model on reader
backstories to approximate a human response distribution.*

### Required controls

- **Neutral-persona ablation:** run j identical neutral personas at temperature 1.0.
  If this scores as well, the effect was sampling noise dressed up as perspective, and
  Workflow C collapses into Workflow A.
- **Unanimity check:** persona verdicts on the unambiguous items should be
  near-unanimous. Personas that disagree everywhere are miscalibrated and must be
  revised.

*Source: Hu & Collier (2024), "Quantifying the Persona Effect in LLM Simulations",
ACL 2024.*

## Research questions

1. Does SelfCheckGPT separate controversial from uncontroversial claim–policy pairs
   above chance?
2. Does disambiguation-rewrite divergence outperform it, and does the advantage hold
   on the exclusion-clause subset, where production accuracy is worst?
3. Does the persona ensemble outperform both, as predicted by the fact that the gold
   label measures population disagreement rather than individual uncertainty?
4. Can LLMs perform K3 recomposition correctly, and does competence degrade between
   the synthetic and the grounded tier?
5. Do the three scores flag the same items? Disagreement between them would indicate
   they capture distinct phenomena and could be combined.

## Data

- **Dataset:** the replication package at
  [github.com/madiganbrodsky/vague_contracts](https://github.com/madiganbrodsky/vague_contracts).
  The stimulus file supplies the policy text with the definition span marked in `<b>`
  tags, the narrative, the condition label, an annotation of the vague term per item
  group (`locus_of_uncertainty`), and the elaboration type (exhaustive definition 105,
  exclusion 24, inclusion 9). The response file supplies 4,140 individual judgments
  from 1,378 workers, between 19 and 48 per item (median 31), from which the human
  disagreement entropy is computed.
- Restrict the primary analysis to the 36 of 46 item groups whose human yes-rates are
  monotone across the three conditions. In the other 10 — among them Escape of Water I,
  Hot Work I, Vehicle Glass II, House Removial I and Identity Theft I — the intended
  contrast did not materialise, so scoring a detector on them measures nothing about
  the detector. Report those 10 separately.
- The `locus_of_uncertainty` annotation must never be shown to the model in
  Workflow B. It is the gold answer for step 1 and is used only for scoring.
- Run every workflow on at least two model families, to separate method effects from
  model effects.
- Bootstrap confidence intervals throughout. With 138 items and 46 positives, a
  difference of a few items is not a result.

## Deliverables

- Three workflows behind a common interface taking a (policy, narrative) pair and
  returning a score in [0,1].
- A results table: AUROC, best F1, Spearman correlation with human entropy, and cost
  per item, for each workflow and each model.
- Locus-selection accuracy for Workflow B, scored against the annotated vague term.
- An error analysis of the items where the three workflows disagree.

## References

Argyle, L. P., Busby, E. C., Fulda, N., Gubler, J. R., Rytting, C., & Wingate, D.
(2023). Out of one, many: Using language models to simulate human samples.
*Political Analysis*, 31(3), 337–351.

Fine, K. (1975). Vagueness, truth and logic. *Synthese*, 30(3–4), 265–300.

Guha, N., et al. (2023). LegalBench: A collaboratively built benchmark for measuring
legal reasoning in large language models. arXiv:2308.11462.

Hu, T., & Collier, N. (2024). Quantifying the persona effect in LLM simulations.
*ACL 2024*, 10289–10307.

Kleene, S. C. (1952). *Introduction to Metamathematics*. North-Holland, §64.

Liu, A., Wu, Z., Michael, J., Suhr, A., West, P., Koller, A., Swayamdipta, S.,
Smith, N. A., & Choi, Y. (2023). We're afraid language models aren't modeling
ambiguity. *EMNLP 2023*, 790–807.

Manakul, P., Liusie, A., & Gales, M. (2023). SelfCheckGPT: Zero-resource black-box
hallucination detection for generative large language models. *EMNLP 2023*,
9004–9017.

Servantez, S., Barrow, J., Hammond, K., & Jain, R. (2024). Chain of Logic:
Rule-based reasoning with large language models. *Findings of ACL 2024*.

Solan, L., Rosenblatt, T., & Osherson, D. (2008). False consensus bias in contract
interpretation. *Columbia Law Review*, 108, 1268–1300.

Vashurin, R., et al. (2025). Benchmarking uncertainty quantification methods for
large language models with LM-Polygraph. *TACL*, 13, 220–248.

Waldon, B., Brodsky, M., Ma, M., & Degen, J. (2023). Predicting consensus in legal
document interpretation. *Proceedings of the 45th Annual Conference of the Cognitive
Science Society*.
