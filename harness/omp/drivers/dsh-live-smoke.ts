/**
 * Skip-gated DeepSeek Harness profile smoke for Improveness.
 * Default CI must not set DSH_LIVE_SMOKE — exits 0 when unset / no keys.
 */

export type DshSmokeResult = {
  skipped: boolean;
  reason?: string;
  passed?: boolean;
};

export function shouldSkipDshLiveSmoke(env: NodeJS.ProcessEnv = process.env): { skip: boolean; reason?: string } {
  if (env.DSH_LIVE_SMOKE !== "1") {
    return { skip: true, reason: "DSH_LIVE_SMOKE is not 1" };
  }
  const hasAuth = Boolean(env.DEEPSEEK_API_KEY || env.OPENAI_API_KEY || env.OPENROUTER_API_KEY);
  if (!hasAuth) {
    return { skip: true, reason: "no DeepSeek/OpenAI/OpenRouter credentials in environment" };
  }
  return { skip: false };
}

/** Maintainer entry: documents the gate; real session ping needs a host factory. */
export async function runDshLiveSmoke(env: NodeJS.ProcessEnv = process.env): Promise<DshSmokeResult> {
  const gate = shouldSkipDshLiveSmoke(env);
  if (gate.skip) return { skipped: true, reason: gate.reason };
  // ponytail: no in-repo DSH session factory — require maintainer wrapper when keys present.
  throw new Error(
    "DSH_LIVE_SMOKE=1 with keys set, but this CLI does not construct a DSH session; run via maintainer wrapper or inject createSession in tests",
  );
}

if (import.meta.main) {
  const gate = shouldSkipDshLiveSmoke();
  if (gate.skip) {
    console.log(JSON.stringify({ skipped: true, reason: gate.reason }));
    process.exit(0);
  }
  try {
    await runDshLiveSmoke();
  } catch (err) {
    console.error(String(err));
    process.exit(1);
  }
}
