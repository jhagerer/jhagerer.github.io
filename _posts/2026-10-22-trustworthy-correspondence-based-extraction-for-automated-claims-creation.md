---
title: "Trustworthy Correspondence Based Extraction for Automated Claims Creation"
subtitle: "Master's thesis at TU Darmstadt, in cooperation with Inverso GmbH, September 2026"
date: 2026-10-22 13:00:00 +0200
tags: [projects, technical-university-of-darmstadt, thesis-topic]
venue-name: "Johann Hagerer & TU Darmstadt"
venue-logo: profile.jpg
---

**Industry supervisor:** Dr. Gerhard Johann Hagerer, Inverso GmbH

**Date:** September 2026

## 1 Abstract

Insurance claims intake requires converting unstructured correspondence into
structured records — a high-volume, error-intolerant task in a regulated setting.
Large language models make the underlying NLP tasks, such as key information
extraction and intent recognition, technically feasible, yet deployment stalls on a
governance question. Domain experts request a single confidence score and a cutoff
as the control mechanism. This expectation is structurally unmet: a confidence score
measures how reliably a system applies a specification, and for precisely those
fields where automation is hardest, no shared specification exists. Where claims
handlers would disagree among themselves about what a field means, no threshold can
deliver reliability, because the uncertainty lies in the definition rather than in
the model.

This thesis addresses that gap through an action design research study at an
insurance IT provider. The ensemble artifact under design is not the extraction
model alone but the method by which a new claim category is brought into automated
processing: defining fields and acceptance criteria, generating expert
specifications, setting operating points, and monitoring after go-live. The method
is grounded in a taxonomy of extraction targets classified by verification logic —
verbatim, normalised, aggregated, inferred, and absent — which determines for each
field type what counts as evidence, how it can be checked, and whether
threshold-based automation is admissible at all. Mechanisms for evidence grounding
and decomposition, including select-then-predict extraction and sub-question
decomposition for inferred fields, are implemented and assessed by faithfulness
metrics adapted from the rationalised-NLP literature and by their effect on the cost
of expert specification work.

Expert review of individual cases takes place in a pre-deployment test environment;
once a category enters production, cases are processed without per-case review.
Governance therefore rests on decisions made before go-live. Extraction results from
both environments are presented to domain experts in a form that lets them examine
their own extraction rules against authentic output, and the study examines how this
shifts expert effort from setting thresholds toward defining the rules those
thresholds presuppose.

Build–intervene–evaluate cycles follow the sequential onboarding of claim
categories, whose order is determined by the organisation rather than the research
team. Each cycle comprises specification with domain experts, review in the test
environment, the go-live decision, and production monitoring; the second application
of the method serves to observe how the method itself has changed. The study
contributes a set of design principles for progressive document-to-record automation
in regulated settings, presented together with their evolution across cycles.

## 2 Research questions

### RQ1 — Trustworthiness requirements

Which trustworthiness requirements do domain experts, compliance, and process owners
place on straight-through LLM-based claim creation, and how do these requirements
change once the artifact operates on authentic correspondence?

### RQ2 — Field taxonomy

How can extraction targets be classified by their verification logic — verbatim,
normalised, aggregated, inferred, absent — and does this classification hold as an
organising principle for field-level automation decisions when confronted with
authentic documents and expert judgement?

### RQ3 — Extraction quality and specification work

Which mechanisms for grounding and decomposition improve extraction quality and the
efficiency of expert specification work, and how do the artifact and the
organisation's rule-definition practice reshape each other across
build–intervene–evaluate cycles?

### RQ4 — Governance without per-case review

Confidence scores measure adherence to a specification but cannot establish one.
Which representations of extraction results enable domain experts to examine and
revise their own extraction rules, and how does this shift their effort between
threshold-setting and rule definition?

### RQ5 — Design principles

Which design principles for progressive, trustworthy document-to-record automation
emerge from these cycles, how do they evolve in response to anticipated and
unanticipated consequences, and to what class of solutions do they generalise?

## 3 Key related work

**Method.** Sein et al. (2011), "Action Design Research," *MIS Quarterly* 35(1),
provides the methodological backbone: building, intervention and evaluation as
inseparable activities, guided emergence, and the required levels of generalisation.
Gregor, Kruse & Seidel (2020), *JAIS* 21(6), supplies the schema for formulating
design principles with sufficient precision.

**Explainability.** DeYoung et al. (2020), "ERASER," *ACL*, contributes the
comprehensiveness and sufficiency metrics adapted here for structured extraction.
Turpin et al. (2023), *NeurIPS*, establishes that chain-of-thought rationales are
plausible yet systematically unfaithful, motivating verifiable spans over generated
justifications. Jain et al. (2020), "FRESH," *ACL*, gives the select-then-predict
architecture that makes sufficiency structural rather than merely measured.

**Domain.** Guha et al. (2023), "LegalBench," arXiv:2308.11462, offers the insurance
policy interpretation task and its three-class treatment of indeterminacy.
