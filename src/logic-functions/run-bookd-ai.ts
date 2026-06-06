// src/logic-functions/run-bookd-ai.ts
// This file goes in your Twenty CRM fork at: src/logic-functions/run-bookd-ai.ts
// It bridges Twenty's runAgent() to book'd's managed AI sidecar

import { runAgent } from "twenty-sdk/logic-function";
import { fetch } from "twenty-sdk/fetch";

interface RunBookdAiInput {
  agentUniversalIdentifier: string;
  prompt: string;
  threadId?: string;
}

interface RunBookdAiResult {
  success: boolean;
  result?: string;
  error?: string;
  creditsCharged?: number;
  providerStatus?: "live" | "fallback" | "not_configured" | "blocked";
}

export default async function ({
  input,
  context,
}: {
  input: RunBookdAiInput;
  context: { user: { id: string; tenantId: string }; tenant: { id: string } };
}): Promise<RunBookdAiResult> {
  const { agentUniversalIdentifier, prompt, threadId } = input;
  const { user, tenant } = context;

  // Map Twenty agent universalIdentifier to book'd agent key
  const agentKeyMap: Record<string, string> = {
    "bookd-fast": "bookd-fast",
    "bookd-balanced": "bookd-balanced",
    "bookd-thinking": "bookd-thinking",
    "bookd-flagship": "bookd-flagship",
  };

  const agentKey = agentKeyMap[agentUniversalIdentifier] ?? "bookd-balanced";

  // Call book'd managed AI sidecar
  const sidecarUrl = process.env.BOOKD_SIDECAR_URL ?? "http://bookd-ai-chat:8080";
  const sidecarSecret = process.env.BOOKD_SIDECAR_SHARED_SECRET;

  if (!sidecarSecret) {
    return {
      success: false,
      error: "BOOKD_SIDECAR_SHARED_SECRET not configured",
    };
  }

  try {
    const response = await fetch(`${sidecarUrl}/v1/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bookd-sidecar-secret": sidecarSecret,
      },
      body: JSON.stringify({
        tenantId: tenant.id,
        userId: user.id,
        agentKey,
        prompt,
        threadId,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorBody.error ?? `Sidecar returned ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: data.ok ?? false,
      result: data.content ?? data.assistant?.content ?? "",
      creditsCharged: data.creditDebit?.creditsCharged ?? 0,
      providerStatus: data.providerStatus,
      error: data.ok ? undefined : (data.providerError ?? data.blockedReasons?.[0] ?? "Unknown error"),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to call managed AI sidecar",
    };
  }
}