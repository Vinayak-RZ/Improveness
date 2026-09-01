export type CacdLayer = "contract" | "architecture" | "control" | "delivery";

export type CacdItem = {
  id: string;
  layer: CacdLayer;
  title: string;
  path: string;
  mustContain: string[];
};

export const CACD_ITEMS: CacdItem[] = [
  {
    id: "c-kernel",
    layer: "contract",
    title: "Frozen kernel",
    path: "harness/omp/KERNEL.md",
    mustContain: ["evals/checker", "system-prompt.md", "approval.ts", "plugins/dsh-improveness"],
  },
  {
    id: "c-surfaces",
    layer: "contract",
    title: "Editable surfaces",
    path: "harness/omp/SURFACES.md",
    mustContain: ["playbook", "evolver", "dsh.bundle", "generated"],
  },
  {
    id: "c-plan",
    layer: "contract",
    title: "Execution contract",
    path: "IMPLEMENTATION_PLAN.md",
    mustContain: ["No public Terminal-Bench", "working snapshot", "dsh.bundle", "HostPort"],
  },
  {
    id: "c-decisions",
    layer: "contract",
    title: "ADRs",
    path: "DECISIONS.md",
    mustContain: ["D7", "D11", "D12", "D13", "D14", "D15", "dsh.bundle", "HostPort"],
  },
  {
    id: "a-cacd",
    layer: "architecture",
    title: "CACD definition",
    path: "harness/omp/CACD.md",
    mustContain: ["Contract", "Architecture", "Control", "Delivery", "Simulation"],
  },
  {
    id: "a-agents",
    layer: "architecture",
    title: "Playbook is context",
    path: "harness/omp/overlay/.omp/AGENTS.md",
    mustContain: ["PLAYBOOK.md", "system-prompt"],
  },
  {
    id: "k-allowlist",
    layer: "control",
    title: "Evolver path policy",
    path: "harness/omp/drivers/allowlist.ts",
    mustContain: ["assertEvolverWrite", "KERNEL_PATH_MARKERS"],
  },
  {
    id: "k-search-cap",
    layer: "control",
    title: "Hard search step cap",
    path: "harness/omp/drivers/search.ts",
    mustContain: ["MAX_STEP_CAP", "isKernelRel"],
  },
  {
    id: "k-propose",
    layer: "control",
    title: "Held-in-only proposer",
    path: "harness/omp/drivers/propose.ts",
    mustContain: ["heldInOnly", "held-out"],
  },
  {
    id: "d-queue",
    layer: "delivery",
    title: "Human review queue",
    path: "harness/omp/REVIEW_QUEUE.md",
    mustContain: ["evidence", "no auto-apply"],
  },
  {
    id: "d-ci",
    layer: "delivery",
    title: "Overlay CI",
    path: ".github/workflows/overlay.yml",
    mustContain: ["validate.sh", "1.3.14"],
  },
  {
    id: "d-qa",
    layer: "delivery",
    title: "Repository QA orchestrator",
    path: "harness/omp/scripts/qa.sh",
    mustContain: ["validate.sh", "qa-repo", "simulate-architectures"],
  },
  {
    id: "c-snapshot",
    layer: "contract",
    title: "Working snapshot apply",
    path: "docs/proposals/06-snapshot-apply.md",
    mustContain: ["working snapshot", "D14"],
  },
  {
    id: "d-bundle",
    layer: "delivery",
    title: "DSH bundle plugin",
    path: "plugins/dsh-improveness/package.json",
    mustContain: ["dsh.bundle", "dsh-improveness"],
  },
  {
    id: "c-host-port",
    layer: "contract",
    title: "HostPort surface",
    path: "docs/methods/host-port.md",
    mustContain: ["HostPort", "frozenIds", "mountEphemeral"],
  },
];

export const CACD_LAYERS: CacdLayer[] = ["contract", "architecture", "control", "delivery"];
