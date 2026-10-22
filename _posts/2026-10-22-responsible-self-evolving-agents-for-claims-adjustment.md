---
title: "Responsible Self-Evolving Agents for Claims Adjustment"
subtitle: "Governed Self-Evolution: Design Principles for Responsible Self-Evolving Agents in Insurance Claims Adjustment — a DSR/ADR Literature Review and an Agent-Gym Demonstrator"
date: 2026-10-22 15:00:00 +0200
tags: [projects, technical-university-of-munich, practical-course-topic]
venue-name: "Johann Hagerer & TUM"
venue-logo:
  - profile.jpg
  - tum.svg
---

**Type:** Guided research topic, Technical University of Munich

**Proposed by:** Johann Hagerer, 10 October 2026

## Abstract

LLM agents in insurance are frozen at deployment, while policies, edge cases and
expert know-how keep changing. Self-evolving agents promise to close this gap by
learning from expert corrections, but a wrong learned rule can silently harm
customers. This guided research first reviews design science (DSR) and action design
research (ADR) studies on agents and AI systems that learn from human experts. It
catalogs their use cases, consolidates their design principles for safe, responsible
and privacy-aware learning loops, and classifies their theoretical contributions.

Second, the student instantiates selected principles in a demonstrator that ports
Google's Agent Gym framework (Omran et al., 2026) from invoice processing to claims
adjudication. The demonstrator runs on InsLogicBench (Liu et al., 2026), a publicly
available benchmark of 2,621 synthetic claim cases built on 110 Chinese-language
insurance policies, which the student first translates to English. Each case comes
with the relevant policy clauses, a step-by-step explanation and an approve-or-deny
verdict. The policies serve as the agent's rules book, and the gold explanations
simulate the adjuster's corrections in the learning loop. Cases with exclusions and
nested exceptions to exclusions test whether learned rules become over-broad.

The evaluation compares a frozen agent with a self-evolving one on held-out cases,
measuring decision accuracy, expert effort per learned rule, and the rate of harmful
or over-broad rules. Expected outcomes are a use-case catalog, a consolidated set of
design principles, a working demonstrator evaluated on public data, and an agenda
for future DSR work.

## Research questions

1. **RQ1 — Use cases.** In which application contexts and use cases have
   self-evolving or expert-in-the-loop learning agents been designed and evaluated
   with DSR?
2. **RQ2 — Design knowledge.** Which design requirements and design principles does
   this literature propose, especially for the safety, responsibility, privacy and
   security of the learning loop?
3. **RQ3 — Core literature comparison.** What are further patterns of the DSR
   literature about self-evolving agents when compared along all possible DSR axes?
   What are the impacts on safety aspects, in particular?
4. **RQ4 — Instantiation.** How can the consolidated principles be instantiated in
   an Agent-Gym-style demonstrator for claims adjustment, and how does a
   self-evolving agent compare with a frozen agent on decision quality and safety
   metrics?

## Demo system: Agent Gym for claims adjustment

The demonstrator ports Google's Agent Gym to claims adjustment. Agent Gym wraps an
existing LLM agent in a loop of six capabilities — Act, Evaluate, Investigate,
Correct, Learn, Observe — and learns correction rules from experts in natural
language, without changing the agent's code (Omran et al. 2026). Its open-source
reference implementation targets invoice processing, which has to be changed to the
insurance claims use case.

The acting agent stays unchanged; adjusters' corrections become rules only after the
safety loop and their approval.

**Scope:** the InsLogicBench claim cases and their 110 policies (life, medical,
critical-illness, accident and long-term care insurance). Each case comes with the
relevant clauses, a reference explanation and an approve-or-deny verdict. The cases
are synthetic, so no real customer data is involved.

**Translation to English:** InsLogicBench is in Chinese, so the student first
translates the policies, cases, explanations and labels to English with an LLM. The
original Chinese text stays alongside each translated item. A random sample is
checked by hand, and an automatic check confirms that each translated explanation
still cites the right clauses and reaches the same verdict. Translation errors are
reported as a limitation of the evaluation.

| Component | Role in the claims demo |
|---|---|
| Constitution | Rules book (Markdown) from the translated InsLogicBench policy clauses; master data spec (YAML) for claim fields and decisions |
| Acting agent | Extracts claim facts, checks coverage and exclusions, proposes approve or deny and names the clauses it relied on |
| Investigation agent | Checks each decision against the rules book, also when no gold answer exists |
| Correction engine | Applies approved correction rules: field edits, LLM patches, pipeline continuation |
| Learning agent | The adjuster explains a correction in plain language (in the demo simulated by the case's reference explanation); the agent drafts a candidate rule |
| Safety loop | Tests the rule on its target case and on unrelated cases; tightens it if it over-matches; adjuster approves |
| Audit log | Records rules matched, revision plan, model and costs; supports rollback |

### Evaluation design

Agent Gym is shown as a working implementation, but the paper reports no correction
accuracy, false-positive rates or cost comparisons (alphaXiv overview). The demo
fills exactly this gap. It reuses the white paper's protocol: a training split of
InsLogicBench builds the rule base, then a frozen agent and the self-evolving agent
run on the held-out test split.

- **Decision quality:** accuracy of approve-or-deny decisions against the
  InsLogicBench verdicts, reported per scenario (coverage not met, exclusion, nested
  exception)
- **Learning effort:** number of expert interactions needed per useful rule
- **Safety:** rate of over-broad rules (collateral matches) and of rules that make a
  correct decision wrong
- **Rule hygiene:** growth, conflicts and obsolete rules in the rule base over time
- **Privacy:** personal data that ends up in learned rules
- **Security:** effect of a few deliberately poisoned corrections

Note: Agent Gym (Google Cloud, 2026) is a different system from "AgentGym" (Xi et
al., 2024), a benchmark for general LLM agents; the literature search should
separate the two.

## Related work on design knowledge

The review should start from a small seed set of principles found in the key sources
and test whether the wider literature confirms, refines or contradicts them. Here
are a few examples:

| Seed principle | What to consider when building | Source |
|---|---|---|
| Keep learning outside the agent | Store learned knowledge in an editable, versioned layer, not in weights or ad-hoc prompts | Omran et al. 2026; ERGO white paper |
| Human approval before persistence | No learned rule goes live without expert sign-off; deactivation and rollback built in | Omran et al. 2026 |
| Test rules for side effects | Check each new rule on its target case and on unrelated cases before approval | Omran et al. 2026 |
| Govern the capture of tacit knowledge | Motivate experts to share, help them articulate, check fidelity, make it usable for successors | O'Sullivan et al. 2026 |
| Learning goes both ways | Design so humans also learn from the machine, not only the reverse | Te'eni et al. 2023 |
| Measure whether learning helps | Compare frozen and evolving versions; watch for drift | ERGO white paper |

There are two ways to build the final list of design principles from many papers.

- **Bottom-up (simplest).** Read all papers (say 30). Copy every design principle you
  find into a spreadsheet, one row per principle. Then group the rows that say the
  same thing and give each group a name. The groups become the consolidated
  principles.
- **With a starting list (seed principles).** Start with a short list of maybe 6
  principles taken and clustered from a few key papers, here Agent Gym, O'Sullivan
  et al., Te'eni et al. and the ERGO paper. Then, for each new paper, check each of
  its principles against the list:
  - Same idea → count it as more support for that principle.
  - Same idea plus a condition → a refinement.
  - Opposite idea → a contradiction, which is interesting to discuss.
  - Not on the list → add it as a new principle.

Example: the starting principle "a human approves every learned rule before it goes
live" comes from Agent Gym. Paper X says "only high-risk rules need human approval;
low-risk ones go live automatically." That is a refinement. Paper Y updates memory
fully automatically and shows that it works. That challenges the starting principle.

## DSR core literature review

Axes are just columns in the coding table. For each paper you fill in one value per
column, and then the patterns across papers become the results.

- **Requirements → principles → features:** three layers of what a paper says about
  design.
  - *Requirement:* what the system must achieve, e.g. "a wrong learned rule must not
    harm customers."
  - *Principle:* a general rule for how to achieve it, e.g. "test every learned rule
    on unrelated cases before it goes live."
  - *Feature:* the concrete implementation, e.g. Agent Gym's impact check that runs a
    new rule on sample cases.

  The review sorts statements into these layers so that principles from different
  papers can be compared at the same level.
- **Artifact type:** what the paper actually built. That could be a vocabulary, a
  framework or model, a step-by-step method, or working software.
- **Contribution type:** how new the result is. For example, an existing solution
  applied to a new problem, like Agent Gym moved from invoices to claims. Or a better
  solution for a known problem. This column also records whether the paper offers
  only a prototype or general principles too.
- **Evaluation:** how the paper tested its result. For example, in a lab or
  simulation versus with real users in a real company, or by argument only versus
  with measurements.

A mini example with two papers from earlier:

| Paper | Artifact type | Principles? | Evaluation |
|---|---|---|---|
| Agent Gym (Omran et al. 2026) | Software framework | Implicit, in the architecture | Working implementation on invoices, no quantitative study |
| O'Sullivan et al. 2026 | Design principles | Yes, four explicit ones | Logical reasoning plus a feasibility check on three GenAI setups, no user study |

With 30 rows and say 15 columns, you can then say things like "most papers propose
principles, but few test them with real users." A statement like that is the kind of
finding a review delivers.

## Agenda

The plan assumes about 23 weeks of part-time work; if the guided research is
shorter, cut the demonstrator to the safety loop and two metrics.

1. **Weeks 1–2 · Scoping and review protocol.** Search strings, databases (AIS
   eLibrary, Scopus, IEEE, ACM, arXiv for agent papers), inclusion criteria (DSR/ADR
   studies on AI that learns from experts or captures tacit knowledge), coding
   scheme. *Deliverable:* review protocol.
2. **Weeks 3–7 · Search and screening.** Database search plus forward and backward
   search. *Deliverable:* paper corpus with a PRISMA-style flow.
3. **Weeks 8–10 · Coding and synthesis.** Use-case catalog (RQ1); design principles
   structured by aim, context, mechanism and rationale (RQ2); contribution types and
   evaluation methods (RQ3). *Deliverable:* concept matrix and consolidated
   principles.
4. **Weeks 11–16 · Demonstrator.** Translate InsLogicBench to English and check the
   translation; port the Agent Gym reference implementation to claims; build the
   claims constitution from the translated policies; instantiate the selected
   principles. *Deliverable:* running demo and repository.
5. **Weeks 17–19 · Evaluation.** Frozen versus self-evolving agent on held-out cases,
   plus the safety, privacy and poisoning tests; evaluation strategy planned with
   FEDS. *Deliverable:* results and limitations.
6. **Week 20 · Write-up and talk.** Report and final presentation; replication
   package with pinned model versions and the English translation of InsLogicBench
   (Zenodo or OSF, if the dataset license allows it). *Deliverable:* GR report.

Open question: the exact length and credit points of the guided research, to fix the
weeks.

## Literature

### Core papers (start here)

1. Omran, P. G., Zimmermann, M., Cambridge, D., Kapoor, A., & Dixit, T. (2026).
   Agent Gym: A Framework for Continuous Evaluation and Evolution of LLM Agents
   Through Human-in-the-Loop Feedback. arXiv:2608.15591. — The system to port; read
   for architecture and its missing evaluation.
2. Sein, M. K., Henfridsson, O., Purao, S., Rossi, M., & Lindgren, R. (2011). Action
   Design Research. *MIS Quarterly*, 35(1), 37–56. — ADR stages and principles.
3. Gregor, S., & Hevner, A. R. (2013). Positioning and Presenting Design Science
   Research for Maximum Impact. *MIS Quarterly*, 37(2), 337–355. — Contribution
   levels and quadrants for RQ3.
4. O'Sullivan, P., Seppälä, S., & Feller, J. (2026). Towards scaling expertise with
   generative AI: design principles for governing AI-mediated knowledge capture and
   transfer. *Journal of Decision Systems*, 35(1). — A DSR model case on tacit
   knowledge and GenAI.
5. Te'eni, D., Yahav, I., Zagalsky, A., Schwartz, D., Silverman, G., Cohen, D., Mann,
   Y., & Lewinsky, D. (2023). Reciprocal Human-Machine Learning: A Theory and an
   Instantiation for the Case of Message Classification. *Management Science*. —
   Design science on humans and machines learning from each other.

### Dataset for the demonstrator

- Liu, J., Liu, Y., Wang, K., Shi, J., Xu, X., Huang, W., Xu, X., Liang, X., & Xiao,
  Y. (2026). InsLogicBench: An Argumentation Logic Grounded Benchmark for Complex
  Insurance Claims Adjudication. In *Proceedings of the 64th Annual Meeting of the
  Association for Computational Linguistics* (Volume 1: Long Papers), 22592–22619.
  Data: GitHub repository (Apache-2.0). — Claim cases, policies and gold explanations
  for the Agent Gym experiments; the repository is not linked from the paper, so
  confirm it with the authors.

### Further reading

- Dang, T. E., Zimmermann, M., Oberbauer, T., & Lein, M. (2026). From Tribal
  Knowledge to Self-evolving Agents. ERGO Innovation Lab, Google Cloud, Deloitte
  (white paper). — Practitioner framing and the stable-versus-evolving evaluation
  protocol.
- Fang, J., et al. (2025). A Comprehensive Survey of Self-Evolving AI Agents.
  arXiv:2508.07407. — Technical background on self-evolution.
- Gregor, S., Kruse, L. C., & Seidel, S. (2020). The Anatomy of a Design Principle.
  *Journal of the Association for Information Systems*, 21(6). — Template for writing
  the principles in RQ2.
- Venable, J., Pries-Heje, J., & Baskerville, R. (2016). FEDS: A Framework for
  Evaluation in Design Science Research. *European Journal of Information Systems*,
  25(1). — Evaluation strategy for RQ4.
- Kirchdorfer, L., Rebmann, A., Warmuth, C., Kampik, T., Heilker, T., & Berg, G.
  (2026). Organizational Memory for Agentic Business Process Execution.
  arXiv:2607.03228. — Governed, shared knowledge layer for agents.

*Sources used in this document: TUM press release on relAI · Agent Gym on alphaXiv ·
UCC record of O'Sullivan et al. · Bar-Ilan record of Te'eni et al. The MIS Quarterly,
JAIS and EJIS references are standard and were cited from memory; check page numbers
before use.*
