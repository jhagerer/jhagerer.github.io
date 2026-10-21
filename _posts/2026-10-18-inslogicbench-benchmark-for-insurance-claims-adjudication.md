---
title: "InsLogicBench: An Argumentation Logic Grounded Benchmark for Complex Insurance Claims Adjudication"
subtitle: "Liu et al. (2026) — whether a model can justify an insurance decision, not just arrive at one"
date: 2026-10-18 09:00:00 +0200
tags: [papers]
---

**Authors:** Jin Liu, Yunpeng Liu, Keyi Wang, Jie Shi, Xiao Xu, Wenkang Huang, Xingzhong Xu, Xin Liang, Yanghua Xiao
(College of Computer Science and Artificial Intelligence, Fudan University; Ant Group)

**Year:** 2026

**Publisher:** *Proceedings of the 64th Annual Meeting of the Association for Computational Linguistics* (Volume 1: Long Papers), pages 22592–22619

**DOI:** [10.18653/v1/2026.acl-long.1035](https://doi.org/10.18653/v1/2026.acl-long.1035)

**URL:** <https://aclanthology.org/2026.acl-long.1035/>

**Code and data:** <https://github.com/lius64909-prog/InsLogicBench> — Apache-2.0, with
the dataset on Google Drive. Not formally attributed to the authors, but the released
schema matches the paper: propositions, clause-level judgments, exclusions and their
exceptions, and the four coverage/exclusion scenarios.

## Summary

A benchmark for insurance claims adjudication, where a decision has to be derived
step by step from the clauses of a policy rather than guessed from the facts. Each
case carries a reasoning trace tying the facts to the clauses that apply and on to
the verdict, so a model is scored on the derivation and not only on the final yes or
no. The cases are produced by a synthesis framework built on the Nested Toulmin
Model, which gives the arguments their structure.

Eight LLMs were evaluated. Exception clauses and conditions that the evidence leaves
unverified were the hard cases, and models frequently reached the right verdict while
supporting it with reasoning that did not hold up — the gap the benchmark is built to
expose.

## Notes

<!-- Reading notes go here. -->
