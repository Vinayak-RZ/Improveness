import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { deepseekProfile, evaluateFit } from "../../packages/improveness-modeltaste/src/index.ts";
const fixtures = JSON.parse(readFileSync(new URL("./fixtures/golden.json", import.meta.url), "utf8"));
const samples = fixtures.map((f: { rawValid: boolean; trace: never }) => ({ rawValid: f.rawValid, trace: f.trace }));
const on = evaluateFit(samples, deepseekProfile);
const offAccept = samples.filter((s: { rawValid: boolean }) => s.rawValid).length;
mkdirSync(new URL("./results", import.meta.url), { recursive: true });
const md = `# ModelTaste keyless comparison (not live-model)

| Mode | Accept / N | Rate |
|------|------------|------|
| Taste off (rawValid) | ${offAccept} / ${on.n} | ${(offAccept / on.n).toFixed(2)} |
| Taste on (repairedAccept) | ${on.repairedAccept} / ${on.n} | ${(on.repairedAccept / on.n).toFixed(2)} |
| Delta | | ${on.delta.toFixed(2)} |

Evidence: \`bash evals/fit-suite/demo.sh\`. Not a live DeepSeek-class campaign — see CLAIM_LEDGER.
`;
writeFileSync(new URL("./results/keyless-comparison.md", import.meta.url), md);
console.log(md);
