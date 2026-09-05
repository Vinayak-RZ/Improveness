/**
 * Thin DSH ModelTaste strap (D17/D18).
 * Business logic lives in packages/improveness-modeltaste — this file only RPCs/attaches.
 */

import {
  applyRepairs,
  detectFailures,
  getProfile,
  listProfiles,
  evaluateFit,
} from "../../../packages/improveness-modeltaste/src/index.ts";

/** Structured deny / fence error for agent RPC (no free-form throws). */
export class TasteError extends Error {
  /** @param {string} code */
  constructor(code, message) {
    super(message);
    this.name = "TasteError";
    this.code = code;
  }

  toJSON() {
    return { ok: false, error: { code: this.code, message: this.message } };
  }
}

/**
 * @param {{ enabled: boolean }} opts
 */
export function createTasteRuntime(opts = { enabled: true }) {
  const enabled = opts.enabled !== false;
  /** @type {string | null} */
  let attachedProfileId = null;
  /** @type {import("../../../packages/improveness-modeltaste/src/index.ts").ModelProfile | null} */
  let attached = null;
  let hooksRegistered = 0;

  function assertEnabled(op) {
    if (!enabled) {
      throw new TasteError("TASTE_DISABLED", `ModelTaste disabled (IMPROVENESS_TASTE=0); cannot ${op}`);
    }
  }

  return {
    enabled: () => enabled,
    hooksRegistered: () => hooksRegistered,
    attachedProfileId: () => attachedProfileId,

    listProfiles: () => (enabled ? listProfiles() : []),

    inspect() {
      if (!enabled) return { enabled: false, hooksRegistered: 0, profile: null };
      return {
        enabled: true,
        hooksRegistered,
        profile: attached,
        profiles: listProfiles().map((p) => p.id),
      };
    },

    attach(profileId) {
      assertEnabled("attach");
      attached = getProfile(profileId);
      attachedProfileId = attached.id;
      hooksRegistered = 1;
      return { attached: attachedProfileId };
    },

    detach() {
      attached = null;
      attachedProfileId = null;
      hooksRegistered = 0;
      return { detached: true };
    },

    analyze(trace) {
      assertEnabled("analyze");
      const profile = attached ?? getProfile("deepseek");
      const failures = detectFailures(trace);
      return { failures, profileId: profile.id };
    },

    proposeRepair(trace) {
      assertEnabled("proposeRepair");
      const profile = attached ?? getProfile("deepseek");
      return applyRepairs(trace, profile);
    },

    /** Ephemeral apply: return repaired args + teachback; caller does not persist. */
    applyEphemeral(trace) {
      assertEnabled("applyEphemeral");
      const profile = attached ?? getProfile("deepseek");
      return applyRepairs(trace, profile);
    },

    evaluateFit(samples) {
      assertEnabled("evaluateFit");
      const profile = attached ?? getProfile("deepseek");
      return evaluateFit(samples, profile);
    },
  };
}
