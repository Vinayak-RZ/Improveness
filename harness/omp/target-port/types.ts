import type { SplitScore } from "../drivers/run-eval.ts";
import type { CandidateFile, Decision } from "../drivers/self-harness.ts";

/** What kind of agentic artifact this port improves. Not coding-harness-only. */
export const TARGET_KINDS = ["domain-kernel", "agentic-harness", "agentic-system"] as const;
export type TargetKind = (typeof TARGET_KINDS)[number];

export type TargetEval = {
  kind: "family-playbook";
  root: string;
};

export type TargetManifest = {
  id: string;
  kind: TargetKind;
  title: string;
  upstream?: string;
  frozenIds: string[];
  frozenPrefixes: string[];
  editablePrefixes: string[];
  stagingPrefix: string;
  heldOutIds: string[];
  eval: TargetEval;
  notes?: string;
};

export type TargetSurfaces = {
  frozen: string[];
  editable: string[];
};

export type TargetPort = {
  id: string;
  kind: TargetKind;
  manifest: TargetManifest;
  frozenIds(): string[];
  listSurfaces(): TargetSurfaces;
  isFrozenRel(rel: string): boolean;
  isEditableRel(rel: string): boolean;
  score(split: "held-in" | "held-out", playbook: string): SplitScore;
  stage(files: CandidateFile[], repoRoot: string): string[];
};

export type ImproveTargetInput = {
  target: TargetPort;
  heldInBefore: SplitScore;
  heldInAfter: SplitScore;
  heldOutBefore: SplitScore;
  heldOutAfter: SplitScore;
  files: CandidateFile[];
  repoRoot: string;
};

export type ImproveTargetResult = {
  decision: Decision;
  staged: string[];
};
