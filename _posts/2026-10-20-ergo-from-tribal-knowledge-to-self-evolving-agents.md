---
title: "From Tribal Knowledge to Self-evolving Agents"
subtitle: "ERGO Innovation Lab, Google Cloud & Deloitte (2026) — capturing, governing and scaling institutional knowledge in financial enterprises"
date: 2026-10-20 09:00:00 +0200
tags: [papers]
---

**Authors:** Thuy Emilia Dang (Innovation Developer, ERGO Group AG), Michael Zimmermann
(Office of the CTO, Google Cloud), Tim Oberbauer (Manager, Deloitte),
Dr. Matthias Lein (Head of AI Foundations, ERGO Group AG)

**Year:** 2026

**Publisher:** ERGO Innovation Lab, in collaboration with Google Cloud and Deloitte — 26 pages

**Announcement:** <https://www.ergo.com/en/newsroom/media-information/2026/20260723-ergo-whitepaper-ai-agents>

**Whitepaper (PDF):** <https://www.ergo.com/content/dam/ergocom/en/pdf/newsroom/whitepaper/20260801-ergo-whitepaper-from-tribal-knowledge-to-self-evolving-agents.pdf.coredownload.pdf>

**Keywords:** self-evolving agents, tribal knowledge, agentic AI, insurance, knowledge management, AI governance

## Summary

The subject is the knowledge an insurer runs on that was never written down: the
shortcuts, exceptions and decision patterns that live in experience and get passed
on by practice. The paper's image for it is an iceberg — agents are built on the
documented surface, while people work from everything beneath it — and the urgency
is demographic, with a large share of senior staff in Germany close to retirement.

Five obstacles are named: catastrophic forgetting, missing context, drift as
conditions and regulation move, the translation gap between domain experts and
engineers, and legacy systems that cannot support continuous learning. The
human-in-the-loop answer is judged necessary but insufficient, since one expert's
feedback does not represent an organisation.

A self-evolving agent is defined as one that keeps learning from interaction while
staying safe. The design principles matter more than the label: value from day one
rather than autonomy at launch; experts in the loop and developers out of it;
failures treated as the learning signal; and — the load-bearing idea — knowledge
held in an **editable layer outside the model**, so the organisation can review and
correct it, and so a model upgrade does not discard what has been learned.

For insurance, four conditions are given for when such an agent is worth building,
and the use cases cluster into knowledge preservation (underwriting, product
design), operational intelligence (claims, service, distribution) and continuous
recalibration (pricing, fraud, risk thresholds). A chapter on enterprise readiness
covers DORA, the IDD, the EU AI Act, GDPR and the US equivalents, and argues that
oversight belongs inside existing risk and control structures rather than beside
them. Maturity is then described along three axes — complexity, autonomy and
memory — rather than by calling a system "agentic".

### The case study is the honest part

ERGO, Google Cloud and Deloitte built an AI Content Engine for marketing assets and
compared a stable multi-agent baseline against a self-evolving variant:

| Metric | Baseline | Self-evolving |
|---|---|---|
| Topical depth, mean | 80.67% | 85.33% |
| Topical depth, median | 80.00% | 90.00% |
| Expert rating (1–5) | 3.12 | 3.25 |
| Readability | 29.18 | 29.35 |

The self-evolving agent is ahead on every measure, and expert edits folded back into
structured lessons correlate with quality (r ≈ 0.68). But the authors report that the
difference falls short of statistical significance (p > 0.05), and that individual
runs still collapse to 30% under context drift — which is why they land on permanent
human oversight rather than on autonomy.

## Notes

<!-- Reading notes go here. -->
