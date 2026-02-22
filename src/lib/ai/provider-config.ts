export type ProviderName = "ollama" | "codex_exec";

export interface OllamaSettings {
  baseUrl: string;
  model: string;
}

export interface CodexExecSettings {
  bin: string;
  timeoutMs: number;
  model?: string;
  profile?: string;
}

export interface ProviderConfig {
  provider: ProviderName;
  ollama: OllamaSettings;
  codexExec: CodexExecSettings;
}

const SUPPORTED_PROVIDERS: ReadonlySet<string> = new Set<string>([
  "ollama",
  "codex_exec",
  "codex-exec",
  "codex",
]);

function normalizeProvider(raw: string): ProviderName {
  const lower = raw.trim().toLowerCase();
  if (!SUPPORTED_PROVIDERS.has(lower)) {
    throw new Error(
      `Unknown LLM_PROVIDER "${raw}". Supported: ollama, codex_exec`,
    );
  }
  if (lower === "codex" || lower === "codex-exec" || lower === "codex_exec") {
    return "codex_exec";
  }
  return lower as ProviderName;
}

function parsePositiveInt(
  value: string | undefined,
  fallback: number,
): number {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export function loadProviderConfig(): ProviderConfig {
  const providerRaw = process.env.LLM_PROVIDER;
  const provider = providerRaw ? normalizeProvider(providerRaw) : "ollama";

  const ollama: OllamaSettings = {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "llama3.2",
  };

  const codexExec: CodexExecSettings = {
    bin: process.env.CODEX_EXEC_BIN || "codex",
    timeoutMs: parsePositiveInt(process.env.CODEX_EXEC_TIMEOUT_MS, 180_000),
    model: process.env.CODEX_EXEC_MODEL || undefined,
    profile: process.env.CODEX_EXEC_PROFILE || undefined,
  };

  // Fail-fast: validate required values for selected provider
  if (provider === "codex_exec") {
    if (!codexExec.bin) {
      throw new Error(
        "CODEX_EXEC_BIN is required when LLM_PROVIDER is codex_exec",
      );
    }
  }

  return { provider, ollama, codexExec };
}
