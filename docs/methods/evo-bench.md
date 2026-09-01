# Evo-Bench held-out construction

**Paper:** [arXiv:2608.09096](https://arxiv.org/html/2608.09096)

Methodology: harness-sensitive **held-out**, not a public leaderboard as fitness.

Improveness already splits 12 practice / 8 hidden fixtures. P1 does **not** download public Terminal-Bench. Construction rule: hidden ids never appear in proposer context (`propose.ts` already throws). Additional P1 note: when compiling skills or Pareto-archiving, fitness is still this local suite (or a user-supplied private split), never a public TB2 URL.
