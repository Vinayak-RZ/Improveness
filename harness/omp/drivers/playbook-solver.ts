import { join } from "node:path";
import { listFixtures, type Split, type SplitScore } from "./run-eval.ts";
import { loadFixture, scoreWorkspace } from "../evals/checker/check.ts";

/** Families the playbook can unlock. Shared families generalize held-in → held-out. */
export const RECIPE_FAMILY_TO_FIXTURES: Record<string, readonly string[]> = {
  "recipe:default-export": ["default-export", "typed-default-export"],
  "recipe:gitignore": ["gitignore-rule", "gitignore-dist"],
  "recipe:named-export": ["greet-export", "sum-fn", "named-type-export", "greet-types"],
  "recipe:index-reexport": ["index-reexport"],
  "recipe:license-header": ["license-header"],
  "recipe:package-script": ["package-script", "package-test-script"],
  "recipe:readme-h2": ["readme-section", "readme-usage"],
  "recipe:readme-h1": ["readme-title"],
  "recipe:tsconfig": ["tsconfig-strict", "no-implicit-any"],
  "recipe:unused-prefix": ["unused-var-marker"],
  "recipe:no-secrets": ["no-secrets", "barrel-no-secrets"],
};

export const HELD_IN_ID_TO_FAMILY: Record<string, string> = {
  "default-export": "recipe:default-export",
  "gitignore-rule": "recipe:gitignore",
  "greet-export": "recipe:named-export",
  "index-reexport": "recipe:index-reexport",
  "license-header": "recipe:license-header",
  "named-type-export": "recipe:named-export",
  "package-script": "recipe:package-script",
  "readme-section": "recipe:readme-h2",
  "readme-title": "recipe:readme-h1",
  "sum-fn": "recipe:named-export",
  "tsconfig-strict": "recipe:tsconfig",
  "unused-var-marker": "recipe:unused-prefix",
};

export const RECIPE_BLURBS: Record<string, string> = {
  "recipe:default-export": "Prefer a default export when the task asks for one.",
  "recipe:gitignore": "When asked to ignore a path, append that path as its own .gitignore line.",
  "recipe:named-export": "Export the named function or type the task asks for.",
  "recipe:index-reexport": "Re-export public symbols from src/index.ts.",
  "recipe:license-header": "Put the MIT license comment at the top of the named source file.",
  "recipe:package-script": "Add the requested npm script key to package.json.",
  "recipe:readme-h2": "Add the requested markdown H2 section to the README.",
  "recipe:readme-h1": "Give the README a level-1 title.",
  "recipe:tsconfig": "Enable the requested TypeScript strictness flag.",
  "recipe:unused-prefix": "Prefix unused bindings with an underscore.",
  "recipe:no-secrets": "Do not hardcode API keys; read them from the environment.",
};

export function unlockedFamilies(playbook: string): Set<string> {
  const found = new Set<string>();
  for (const family of Object.keys(RECIPE_FAMILY_TO_FIXTURES)) {
    if (playbook.includes(family)) found.add(family);
  }
  return found;
}

export function familyForFixture(id: string): string | undefined {
  for (const [family, ids] of Object.entries(RECIPE_FAMILY_TO_FIXTURES)) {
    if (ids.includes(id)) return family;
  }
  return undefined;
}

export function isFixtureUnlocked(playbook: string, fixtureId: string): boolean {
  const family = familyForFixture(fixtureId);
  return Boolean(family && unlockedFamilies(playbook).has(family));
}

/** Score a split as if a task agent followed the playbook recipes. */
export function scorePlaybook(evalsRoot: string, split: Split, playbook: string): SplitScore {
  const unlocked = unlockedFamilies(playbook);
  const results = listFixtures(evalsRoot, split).map((fixtureDir) => {
    const spec = loadFixture(fixtureDir);
    const family = familyForFixture(spec.id);
    const which = family && unlocked.has(family) ? "expected" : "repo";
    return scoreWorkspace(fixtureDir, join(fixtureDir, which));
  });
  const byId: Record<string, boolean> = {};
  let passed = 0;
  for (const result of results) {
    byId[result.id] = result.passed;
    if (result.passed) passed++;
  }
  return { split, passed, total: results.length, byId, results };
}
