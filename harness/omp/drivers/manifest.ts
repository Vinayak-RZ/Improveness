export type ManifestSurface = "tool" | "hook" | "memory" | "skill" | "playbook";

export type CandidateManifest = {
  id: string;
  surface: ManifestSurface;
  files: string[];
  parentHash: string;
  scores: {
    heldIn: { passed: number; total: number };
    heldOut: { passed: number; total: number };
  };
  rollback: string;
  evidenceId?: string;
  rootCause?: string;
};

export function isManifest(value: unknown): value is CandidateManifest {
  if (typeof value !== "object" || value === null) return false;
  const rec = value as Record<string, unknown>;
  return (
    typeof rec.id === "string" &&
    typeof rec.surface === "string" &&
    Array.isArray(rec.files) &&
    typeof rec.parentHash === "string" &&
    typeof rec.rollback === "string" &&
    typeof rec.scores === "object" &&
    rec.scores !== null
  );
}
