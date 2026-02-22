# NimbleAi

## Setup

```bash
npm install
```

## Development

```bash
npm run dev      # Start Next.js dev server
npm run build    # Production build
npm start        # Start production server
npm test         # Run tests with Vitest
```

## LLM Provider Configuration

Provider selection is environment-driven via `LLM_PROVIDER`. When unset, defaults to `ollama`.

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `LLM_PROVIDER` | No | `ollama` | Provider to use: `ollama` or `codex_exec` |
| `OLLAMA_BASE_URL` | No | `http://localhost:11434` | Ollama API base URL |
| `OLLAMA_MODEL` | No | `llama3.2` | Ollama model name |
| `CODEX_EXEC_BIN` | No | `codex` | Path to codex CLI binary |
| `CODEX_EXEC_TIMEOUT_MS` | No | `180000` | Codex execution timeout in ms |
| `CODEX_EXEC_MODEL` | No | _(none)_ | Codex model override |
| `CODEX_EXEC_PROFILE` | No | _(none)_ | Codex profile override |

### Example `.env.local`

```bash
# Use Ollama (default)
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Or use Codex:
# LLM_PROVIDER=codex_exec
# CODEX_EXEC_BIN=codex
# CODEX_EXEC_TIMEOUT_MS=180000
```
