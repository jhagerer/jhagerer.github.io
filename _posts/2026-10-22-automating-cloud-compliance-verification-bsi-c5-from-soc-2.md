---
title: "Automating Cloud Compliance Verification"
subtitle: "Automating Cloud Compliance Verification: Benchmarking LLM Workflows and Agentic Systems for BSI C5 Criteria Mapping from SOC 2 Type II Audit Reports"
date: 2026-10-22 09:00:00 +0200
tags: [projects, university-of-applied-sciences-munich, thesis-topic]
venue-name: "Johann Hagerer & Hochschule München"
venue-logo: profile.jpg
---

**Academic supervisor:** Prof. Fabian Spanhel, Hochschule München

**Industry supervisor:** Dr. Johann Hagerer, Inverso GmbH — Inverso Data and
Analytics (I-DNA)

**Company:** Inverso GmbH — Internal IT Consultancy, Procurement Unit
(Sparkassen-Finanzgruppe / Versicherungskammer Bayern)

**Keywords:** *large language models, agentic AI, compliance automation, BSI C5,
SOC 2 Type II, regulatory mapping, Apache Hamilton, Apache Burr, Snowflake*

## 1 Motivation and problem statement

Financial institutions within the Sparkassen-Finanzgruppe are subject to stringent
regulatory requirements when procuring cloud-based software services. Before
adopting solutions from vendors such as Atlassian, GitHub, or AWS, the procurement
unit at Inverso GmbH must verify that the vendor's security controls satisfy the
criteria defined in the BSI Cloud Computing Compliance Criteria Catalogue (C5:2020)
as well as Inverso's own internal control framework. Vendors typically provide
SOC 2 Type II audit reports based on the AICPA Trust Services Criteria, which differ
substantially in structure, granularity, and language from the German C5 catalogue.
The current mapping and gap analysis process is performed manually by compliance
analysts: each C5 criterion must be matched against the corresponding SOC 2 controls,
cross-referenced with ISO 27001, and assessed for coverage level. Where gaps exist,
analysts must formulate technical and organizational measures (TOMs) to remediate
them.

This process is labor-intensive, error-prone, and difficult to scale across multiple
vendors. A single gap analysis — for the Atlassian Cloud or GitHub SOC 2 report
mapped against roughly 120 C5 criteria — can require days of expert effort. The
thesis addresses the question of whether and to what extent this end-to-end
compliance verification workflow can be automated using large language models, and
whether agentic AI architectures offer measurable improvements over simpler
LLM-based pipeline approaches.

## 2 Research objectives

The thesis pursues three primary objectives. First, it aims to design and implement
a baseline system using deterministic LLM workflows that automates the mapping of
SOC 2 Type II controls to BSI C5 criteria, evaluates coverage, and generates gap
reports with proposed TOMs. Second, it develops an agentic extension of this system
in which autonomous agents dynamically plan multi-step reasoning chains, retrieve
evidence from audit report documents, resolve ambiguities through iterative
refinement, and produce structured compliance assessments. Third, it conducts a
rigorous comparative benchmark of both approaches against expert-annotated ground
truth derived from real-world compliance mappings provided by Inverso GmbH, covering
three vendor cases: AWS (C5-native report), Atlassian (SOC 2), and GitHub (SOC 2).

## 3 Methodology and technical approach

**Data and ground truth.** The study uses authentic compliance documents from
Inverso's procurement practice: the BSI C5:2020 criteria catalogue (German and
English, roughly 120 criteria across 17 domains), three vendor audit reports (AWS C5
report, Atlassian SOC 2 Type II, GitHub SOC 2 Type II), the BSI cross-reference table
mapping C5 to ISO 27001, CSA CCM, and AICPA TSC, and expert-curated mapping
spreadsheets with coverage assessments and gap classifications. These gold-standard
annotations serve as the benchmark reference for evaluating system outputs.

**Baseline: LLM workflow pipeline.** The baseline implements a directed acyclic graph
of LLM invocations using Apache Hamilton for dataflow orchestration. The pipeline
consists of sequential stages: (1) document ingestion and chunking of PDF audit
reports, (2) semantic embedding and retrieval of relevant control descriptions via
Snowflake's vector capabilities, (3) pairwise LLM-based matching of SOC 2 controls
against C5 criteria using structured prompts with few-shot examples, (4) coverage
classification (fulfilled, partially fulfilled, not fulfilled), and (5) TOM
generation for identified gaps. Each stage is a deterministic Hamilton node with
defined inputs, outputs, and data quality checks. This approach represents the class
of fixed, human-designed LLM workflows as described in the recent literature on LLM
orchestration.

**Agentic system.** The agentic extension employs Apache Burr as a state-machine
orchestrator that enables dynamic, multi-step reasoning with branching logic.
Individual agents — implemented as Burr actions delegating to Hamilton sub-DAGs —
are responsible for specialized tasks: a Mapping Agent retrieves candidate control
pairs and proposes alignments; a Verification Agent cross-references the audit report
narrative to confirm or reject coverage claims; a Gap Analyst Agent identifies
residual risks and formulates TOMs; and a Coordinator Agent manages the overall
workflow, including re-planning when initial evidence is insufficient. Agents
communicate through Burr's shared state, enabling iterative refinement loops: if a
control is initially classified as not fulfilled, the Verification Agent searches
alternative report sections before finalizing the assessment. This architecture draws
on established agentic patterns including ReAct-style reasoning, tool-augmented
retrieval, and multi-agent debate for consensus on ambiguous mappings.

## 4 Evaluation framework

The benchmarking framework evaluates both systems across multiple dimensions.
Task-level accuracy is measured as precision, recall, and F1-score for correct
C5-to-SOC 2 control mappings, and as classification accuracy for coverage assessments
against the expert ground truth. Qualitative evaluation assesses the plausibility,
specificity, and actionability of generated TOMs through expert ratings. Efficiency
metrics capture end-to-end latency, total LLM token consumption, API cost, and the
number of reasoning steps required. Robustness is tested across the three vendor
cases, which vary in report structure, language (English and German), and audit
framework (C5-native versus SOC 2). An ablation study isolates the contribution of
individual agentic components — iterative verification, multi-agent debate, dynamic
re-planning — relative to the static baseline.

## 5 Expected contributions

This thesis contributes to both applied AI research and regulatory technology
practice. It provides the first empirical comparison of deterministic LLM workflows
versus agentic architectures on a real-world, domain-specific compliance task in the
German financial sector. It introduces a reproducible benchmark dataset and
evaluation protocol for cloud compliance automation grounded in authentic regulatory
artifacts. It delivers an open, modular system architecture built on production-grade
tools (Apache Hamilton, Apache Burr, Snowflake) that can be extended to additional
vendors, regulatory frameworks such as DORA and NIS2, or audit standards. Finally, it
offers actionable guidance for compliance teams on when agentic complexity yields
meaningful gains over simpler pipeline approaches — and when it does not.

## 6 Relation to the state of the art

The thesis situates itself at the intersection of several active research areas. In
the domain of agentic AI evaluation, recent work such as AgentBench, AgentArch, and
the CLASSic framework has established multi-dimensional benchmarking methodologies
for enterprise agent systems, covering accuracy, cost, latency, and stability. The
AFlow framework demonstrates that automated discovery of agentic workflow structures
can outperform manually designed pipelines, motivating the comparison undertaken in
this thesis. In compliance and regulatory NLP, prior work has applied LLMs to
contract analysis, policy compliance checking, and regulatory document
classification, but systematic automation of cross-framework control mapping
(SOC 2 → C5) with grounded evaluation remains unexplored. The thesis further draws on
advances in retrieval-augmented generation, structured output generation, and
LLM-as-judge evaluation, adapting these techniques to the bilingual, multi-document
compliance domain.

## 7 Related work

The thesis builds on five key strands of research.

**Berger et al. (2023) [1]** benchmark six LLMs on regulatory compliance verification
in German financial auditing (IFRS/HGB datasets, with PwC Germany), revealing
significant performance variation across prompt designs and degradation on
German-language data — directly motivating our bilingual evaluation. However, their
work is limited to single-turn classification and does not address cross-framework
mapping or agentic architectures.

**Watson et al. (2025) [2]** introduce LAW, a modular agentic system for legal
contract analysis (COLING 2025, J.P. Morgan AI Research), where specialized domain
tools and text agents orchestrated by an LLM outperform baselines by up to 92.9
percentage points on complex extraction tasks — providing an architectural template
for our multi-agent compliance system.

**Zhang et al. (2025) [3]** present AFlow (ICLR 2025 Oral), which reformulates
agentic workflow construction as an automated search problem using Monte Carlo tree
search, showing that optimized workflows outperform hand-crafted pipelines and enable
smaller models to surpass GPT-4o at a fraction of inference cost — motivating our
workflow-versus-agent comparison.

**Hassani (2024) [4]** validates LLM-based legal provision classification and
compliance checking (GDPR, food safety), demonstrating feasibility of the core
matching subtask.

**Elazhary et al. (2024) [5]** show that integrating Graph-RAG with chain-of-thought
prompting significantly improves LLM-based requirement traceability and compliance
checks in regulated environments, informing our retrieval strategy over the C5
cross-reference table.

## References

[1] A. Berger, L. Hillebrand, D. Leonhard, T. Deußer, T. B. F. de Oliveira,
T. Dilmaghani, M. Khaled, B. Kliem, R. Loitz, C. Bauckhage, and R. Sifa, "Towards
Automated Regulatory Compliance Verification in Financial Auditing with Large
Language Models," *Proc. IEEE International Conference on Big Data (BigData)*,
Sorrento, Italy, 2023, pp. 4626–4635.

[2] W. Watson, N. Cho, N. Srishankar, Z. Zeng, L. Cecchi, D. Scott, S. Siddagangappa,
R. Kaur, T. Balch, and M. Veloso, "LAW: Legal Agentic Workflows for Custody and Fund
Services Contracts," *Proc. 31st International Conference on Computational
Linguistics (COLING), Industry Track*, Abu Dhabi, UAE, 2025, pp. 583–594.

[3] J. Zhang, J. Xiang, Z. Yu, F. Teng, X. Chen, J. Chen, M. Zhuge, X. Cheng,
S. Hong, J. Wang, B. Zheng, B. Liu, Y. Luo, and C. Wu, "AFlow: Automating Agentic
Workflow Generation," *Proc. 13th International Conference on Learning
Representations (ICLR)*, 2025 (Oral). arXiv:2410.10762.

[4] S. Hassani, "Enhancing Legal Compliance and Regulation Analysis with Large
Language Models," *arXiv preprint arXiv:2404.17522*, 2024.

[5] O. Elazhary, A. Ezzat, and M. ElHelw, "Leveraging Graph-RAG and Prompt
Engineering to Enhance LLM-Based Automated Requirement Traceability and Compliance
Checks," *arXiv preprint arXiv:2412.08593*, 2024.
