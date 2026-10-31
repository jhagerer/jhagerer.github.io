---
title: "Agentic Retrieval: A Working Terminology"
subtitle: "The vocabulary for search agents that navigate a document structure instead of only matching chunk text."
date: 2026-10-31 08:00:00 +0200
tags: [nlp-and-data-concepts]
venue-name: "Johann Hagerer"
venue-logo: profile.jpg
---

The literature on agentic retrieval has grown faster than its vocabulary has settled.
The same idea appears under different names across papers, and two teams can describe
the same architecture without noticing they agree. The table below is the set of terms
I use, each with the paper I take it from, so that a design discussion can start from
shared words.

One idea runs through all of them. Classical retrieval-augmented generation embeds the
chunks and searches their content. The methods collected here instead treat a corpus
as a structure to be navigated: folder paths, document names and headings carry
meaning, and an agent can move through them, scope a search to a branch, and go back
when a branch turns out to be unhelpful. Finding the right section and then reading it
in order is a different operation from retrieving the top *k* passages, and most of
these terms exist to name parts of that difference.

The terms assume one particular design, which is worth stating because it decides
what several of them mean: only the meaning-carrying metadata is embedded — path,
document name, headings — while the chunks themselves are stored but not embedded, and
there are no summary nodes and no table-of-contents nodes. Under a different design,
"metadata embedding" and "tree traversal" would refer to something else.

It should be useful if you are building a retrieval system over a structured corpus and
want to name its parts precisely, if you are reading across these papers and keep
meeting the same concept under new labels, or if you are settling terminology with a
team before an architecture discussion rather than during one.

## Terminology

| Term | Meaning | Source |
|---|---|---|
| **Search agent / agentic search** | An LLM that plans and runs several searches and reasons over the results | [Search agent survey](https://arxiv.org/abs/2508.05668), [Search-R1](https://arxiv.org/abs/2503.09516) |
| **Chunk / passage** | A piece of a document; stored but not embedded | [HiQA](https://arxiv.org/abs/2402.01767), [DAPR](https://arxiv.org/abs/2305.13915) |
| **Hierarchical metadata / file path context** | Folder path, document name, and headings | [HiQA](https://arxiv.org/abs/2402.01767), [BLAgent](https://arxiv.org/abs/2605.17965) |
| **Structural coordinates** | A metadata key that encodes the section and the position of a chunk | [DeepRead](https://arxiv.org/abs/2602.05014) |
| **Metadata embedding** | Only the meaning-carrying metadata (path, document name, headings) is turned into a vector | [Metadata for RAG](https://arxiv.org/abs/2601.11863) |
| **Metadata filtering** | Limiting the search by exact values: data source, document type, timestamps, path prefix | [Multi-Meta-RAG](https://arxiv.org/abs/2406.13213), [Metadata-driven RAG](https://arxiv.org/abs/2510.24402) |
| **Facets** | The distinct values of a filter field and their counts, returned by a tool so the agent knows which filters exist | Classic IR term (faceted search) |
| **Schema linking** | Mapping words in the query to the right filter fields and values | [RAT-SQL](https://arxiv.org/abs/1911.04942) (Text-to-SQL) |
| **Query expansion / query reformulation** | Writing several variants of the query, and changing it between steps | [CSQE](https://aclanthology.org/2024.eacl-short.34), [DeepRetrieval](https://arxiv.org/abs/2503.00223) |
| **Retrieval-induced tree** | A query-specific tree built by grouping search hits by path and heading | [RIT-RAG](https://arxiv.org/abs/2610.11370) |
| **Bird's-eye view** | The agent's first overview of the relevant part of the corpus, here taken from the retrieval-induced tree | [Corpus2Skill](https://arxiv.org/abs/2604.14572) |
| **Navigation-based retrieval** | Finding content by moving through the structure instead of matching the content text | [Corpus2Skill](https://arxiv.org/abs/2604.14572), [RIT-RAG](https://arxiv.org/abs/2610.11370) |
| **Tree traversal** | Going deeper by repeating the vector search, scoped to a path | [LATTICE](https://arxiv.org/abs/2510.13217), [RIT-RAG](https://arxiv.org/abs/2610.11370) |
| **Corpus-discriminative vocabulary** | Terms that exist in the corpus and separate relevant documents from distractors | [SIRA](https://arxiv.org/abs/2605.06647) |
| **Locate-then-read / section reading** | First find the right section, then read its stored text in order | [DeepRead](https://arxiv.org/abs/2602.05014) |
| **Backtracking** | Going back from a branch that was not useful | [Corpus2Skill](https://arxiv.org/abs/2604.14572) |

<small>One entry carries no paper: <em>facets</em> is a long-established term from
information retrieval, where faceted search predates this literature, and I cite no
specific source for it.</small>
