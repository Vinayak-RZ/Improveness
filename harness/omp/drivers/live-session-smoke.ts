export type SmokeSessionOptions = {
  cwd: string;
  toolNames: string[];
  restrictToolNames: boolean;
  modelPattern: string;
  enableMCP: boolean;
};

export type SmokeSession = {
  prompt: (text: string) => Promise<{ text: string }>;
};

export type CreateSmokeSession = (options: SmokeSessionOptions) => Promise<SmokeSession>;

export type SmokeResult = {
  skipped: boolean;
  reason?: string;
  passed?: boolean;
  reply?: string;
};

export const DEFAULT_SMOKE_OPTIONS: SmokeSessionOptions = {
  cwd: "harness/omp/evals/held-in/greet-export/repo",
  toolNames: ["read", "grep", "glob"],
  restrictToolNames: true,
  modelPattern: "@smol",
  enableMCP: false,
};

export function shouldSkipLiveSmoke(env: NodeJS.ProcessEnv = process.env): { skip: boolean; reason?: string } {
  if (env.OMP_LIVE_SMOKE !== "1") {
    return { skip: true, reason: "OMP_LIVE_SMOKE is not 1" };
  }
  const hasAuth = Boolean(
    env.ANTHROPIC_API_KEY ||
      env.OPENAI_API_KEY ||
      env.OMP_ANTHROPIC_OAUTH_CLIENT_ID ||
      env.OPENROUTER_API_KEY,
  );
  if (!hasAuth) {
    return { skip: true, reason: "no LLM credentials in environment" };
  }
  return { skip: false };
}

export function buildSmokeOptions(cwd = DEFAULT_SMOKE_OPTIONS.cwd): SmokeSessionOptions {
  return { ...DEFAULT_SMOKE_OPTIONS, cwd };
}

export async function runLiveSessionSmoke(input: {
  createSession: CreateSmokeSession;
  prompt?: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<SmokeResult> {
  const gate = shouldSkipLiveSmoke(input.env ?? process.env);
  if (gate.skip) {
    return { skipped: true, reason: gate.reason };
  }
  const options = buildSmokeOptions(input.cwd);
  const session = await input.createSession(options);
  const reply = await session.prompt(input.prompt ?? "Reply with the word pong and do not edit files.");
  return { skipped: false, passed: /pong/i.test(reply.text), reply: reply.text };
}
