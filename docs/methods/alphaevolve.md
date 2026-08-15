# AlphaEvolve

**Paper:** Novikov et al., 2025. [arXiv:2506.13131](https://arxiv.org/abs/2506.13131)  
**Parent:** [../07-evolutionary-search.md](../07-evolutionary-search.md)

## What it optimizes

A pool of **programs**, via LLM-generated diffs, for scientific/algorithmic discovery (and the same shape applies to harness code).

## Mechanism

- Prompt: parent programs, results, instructions, optional meta.
- Coding agent sees the full repo; only regions between `# EVOLVE-BLOCK-START` and `# EVOLVE-BLOCK-END` are in-scope.
- Child programs are evaluated; successes stay.
- Meta-prompt co-evolves with instructions/context.

Ablations credit: evolution procedure, prompt context, meta-prompts, full-file evolution, stronger LLMs.

## Evidence

Discoveries in domains with automatic fitness (e.g. matrix multiplication / kernels — see paper). Design transfers to any “mark the editable block + evaluate” loop.

## Failure modes

- Needs fast objective eval.
- Unmarked files can still be read; if write scope leaks, reward hacking.

## Spec notes

- If a later OMP/generic archive exists, mark evolve-blocks **only** on allowlisted `.omp` files, never on the verifier.
