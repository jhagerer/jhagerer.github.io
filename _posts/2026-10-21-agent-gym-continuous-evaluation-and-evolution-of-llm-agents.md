---
title: "Agent Gym: A Framework for Continuous Evaluation and Evolution of LLM Agents Through Human-in-the-Loop Feedback"
subtitle: "Ghiasnezhad Omran et al. (2026) — the static agent dilemma: agent behaviour is fixed at deployment while business rules change"
date: 2026-10-21 09:00:00 +0200
tags: [papers]
venue-name: "arXiv"
venue-logo: arxiv.svg
venue-url: "https://arxiv.org/abs/2608.15591"
---

**Authors:** Pouya Ghiasnezhad Omran, Michael Zimmermann, Duncan Cambridge,
Ashmita Kapoor, Tanya Dixit (Google Cloud)

**Year:** 2026

**Publisher:** arXiv preprint — arXiv:2608.15591 [cs.AI], submitted 16 Aug 2026,
revised 14 Oct 2026 (v2), 15 pages, 4 figures

**URL:** <https://arxiv.org/abs/2608.15591>

**PDF:** <https://arxiv.org/pdf/2608.15591>

**Keywords:** LLM agents, human-in-the-loop, continuous evaluation, agent evolution,
compliance validation, invoice processing

## Summary

The problem the paper starts from is what it calls the static agent dilemma: an
agent's behaviour is fixed the moment it is deployed, while the business rules it
is supposed to follow keep changing. Every new exception or policy edit becomes
another development cycle, so the agent is always trailing the organisation it
serves.

Agent Gym is proposed as a modular, domain-agnostic wrapper around an existing
LLM-based agent rather than a new agent architecture — the agent keeps acting, and
a loop around it evaluates, diagnoses and corrects. The loop is described as six
composable capabilities — Act, Evaluate, Investigate, Correct, Learn and Observe —
arranged across three architectural zones.

Three pieces carry the design. The correction engine is a hybrid of deterministic
rules and LLM judgement, with 21 condition operators and actions at three tiers.
The investigation architecture is layered so that compliance can be checked
**without ground truth** — the practical case, since production work rarely comes
with labelled answers. And a safety loop validates a newly learned rule before it
is put to a domain expert for approval, so the human reviews candidates rather
than raw model output.

The paper also names a gap it sees in agentic systems: the **Spec-to-Note Gap**,
an autoencoder-inspired way of talking about how far an agent's observable notes
and outputs fall short of the specification it was given. It is framed as a
generalisation of round-trip correctness (Allamanis et al., 2024) from the level
of a single function to a whole system.

An open-source reference implementation on invoice processing is offered as
evidence that the loop runs end to end rather than only on paper.

## Notes

<!-- Reading notes go here. -->
