import { describe, it, expect, beforeEach } from "vitest";
import { loadProviderConfig } from "@/lib/ai/provider-config";

describe("loadProviderConfig", () => {
  beforeEach(() => {
    delete process.env.LLM_PROVIDER;
    delete process.env.OLLAMA_BASE_URL;
    delete process.env.OLLAMA_MODEL;
    delete process.env.CODEX_EXEC_BIN;
    delete process.env.CODEX_EXEC_TIMEOUT_MS;
    delete process.env.CODEX_EXEC_MODEL;
    delete process.env.CODEX_EXEC_PROFILE;
  });

  it("defaults to ollama when LLM_PROVIDER is unset", () => {
    const config = loadProviderConfig();
    expect(config.provider).toBe("ollama");
  });

  it("uses default ollama settings when env vars are unset", () => {
    const config = loadProviderConfig();
    expect(config.ollama.baseUrl).toBe("http://localhost:11434");
    expect(config.ollama.model).toBe("llama3.2");
  });

  it("honors explicit provider override", () => {
    process.env.LLM_PROVIDER = "codex_exec";
    const config = loadProviderConfig();
    expect(config.provider).toBe("codex_exec");
  });

  it("normalizes codex-exec and codex to codex_exec", () => {
    process.env.LLM_PROVIDER = "codex-exec";
    expect(loadProviderConfig().provider).toBe("codex_exec");

    process.env.LLM_PROVIDER = "codex";
    expect(loadProviderConfig().provider).toBe("codex_exec");
  });

  it("throws for unknown provider", () => {
    process.env.LLM_PROVIDER = "unknown";
    expect(() => loadProviderConfig()).toThrow("Unknown LLM_PROVIDER");
  });

  it("uses default codex settings when env vars are unset", () => {
    const config = loadProviderConfig();
    expect(config.codexExec.bin).toBe("codex");
    expect(config.codexExec.timeoutMs).toBe(180_000);
    expect(config.codexExec.model).toBeUndefined();
    expect(config.codexExec.profile).toBeUndefined();
  });

  it("reads codex settings from environment", () => {
    process.env.CODEX_EXEC_BIN = "/usr/local/bin/codex";
    process.env.CODEX_EXEC_TIMEOUT_MS = "60000";
    process.env.CODEX_EXEC_MODEL = "o3";
    process.env.CODEX_EXEC_PROFILE = "custom";

    const config = loadProviderConfig();
    expect(config.codexExec.bin).toBe("/usr/local/bin/codex");
    expect(config.codexExec.timeoutMs).toBe(60000);
    expect(config.codexExec.model).toBe("o3");
    expect(config.codexExec.profile).toBe("custom");
  });

  it("falls back to default timeout for invalid values", () => {
    process.env.CODEX_EXEC_TIMEOUT_MS = "not-a-number";
    const config = loadProviderConfig();
    expect(config.codexExec.timeoutMs).toBe(180_000);
  });
});
