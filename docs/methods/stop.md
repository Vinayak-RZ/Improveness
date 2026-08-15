# STOP — Self-Taught Optimizer

**Paper:** Zelikman et al., COLM 2024 (work 2023).  
**Parent:** [../06-self-improving-harness.md](../06-self-improving-harness.md)

## What it optimizes

The **improver function** \(I\), not the downstream solution \(s\).

## Mechanism

\(s' = I(u, s; M)\)  
Meta-utility: \(\hat{u}(I) = \frac{1}{|\mathcal{D}|}\mathbb{E}[u(I(u,s;M))]\)  
Recursion: \(I_t = I_{t-1}(\hat{u}, I_{t-1}; M)\)

Discovered: GAs, decompose-and-improve, prompt bandits, annealing, temperature schedules, beam/tree search.

## Evidence

Mean downstream utility rose across iterations with **GPT-4**. Degraded with **GPT-3.5** and **Mixtral**.

## Failure modes

Recursive scaffolding without a capable enough model makes the improver worse. Intelligence remains the core.

## Spec notes

- Do not run STOP as v1.
- Do adopt the idea: the object of optimization can be the improver (harness), measured by downstream utility on a fixed task set.
- Pair with Lin et al.: a weaker evolver can still *write* useful harnesses if the task model can *use* them.
