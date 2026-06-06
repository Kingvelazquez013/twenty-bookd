# book'd CRM — Twenty CRM Fork with Managed AI

This is the **book'd CRM fork of Twenty CRM** with native managed AI agent support.

## What This Fork Adds

| Feature | Files |
|---------|-------|
| **4 Managed AI Agents** (chip selector) | `src/agents/bookd-managed-agents.ts` |
| **CRM Action Skills** (dashboard, workflow, count) | `src/skills/bookd-crm-skills.ts` |
| **Logic Function** (bridges `runAgent` → sidecar) | `src/logic-functions/run-bookd-ai.ts` |
| **AI Permission Role** | `src/roles/default-role.ts` |

## Agent Chips in Chat UI

| Agent | Credits | Model Tier |
|-------|---------|------------|
| book'd fast | 1 | Fast (qwen/qwen3-235b-a22b) |
| book'd balanced | 2 | Balanced (minimax/minimax-m2.5) |
| book'd thinking | 5 | Thinking (moonshotai/kimi-k2-thinking) |
| book'd flagship | 8 | Flagship (GPT-5.5 / Opus 4.8) |

## Architecture

```
Twenty CRM (this fork)          book'd Sidecar (ai-chat)
┌─────────────────────┐         ┌─────────────────────┐
│ User clicks chip    │         │                     │
│ Sends message       │         │                     │
│ runAgent() called   │──────▶  │ POST /v1/ai/chat    │
│                     │         │ Credit check        │
│                     │         │ Managed AI (OpenRouter)│
│                     │         │ Persist to core DB  │
│                     │◀─────── │ Return response     │
└─────────────────────┘         └─────────────────────┘
```

## Quick Start

### 1. Build & Push Image
```bash
# GitHub Actions builds on push to main
git push origin main
# Or build locally:
docker build -t ghcr.io/kingvelazquez013/twenty-bookd:latest .
docker push ghcr.io/kingvelazquez013/twenty-bookd:latest
```

### 2. Deploy to book'd VPS
Update `deploy/twenty/docker-compose.yml`:
```yaml
server:
  image: ghcr.io/kingvelazquez013/twenty-bookd:latest  # was: twentycrm/twenty:latest
worker:
  image: ghcr.io/kingvelazquez013/twenty-bookd:latest  # was: twentycrm/twenty:latest
```
Add to server environment:
```yaml
server:
  environment:
    BOOKD_SIDECAR_URL: "http://bookd-ai-chat:8080"
    BOOKD_SIDECAR_SHARED_SECRET: "${BOOKD_SIDECAR_SHARED_SECRET}"
```
Run: `./deploy/twenty/deploy.sh`

### 3. Required Secrets (Doppler)
| Secret | Purpose |
|--------|---------|
| `OPENROUTER_API_KEY` | Managed AI models |
| `BOOKD_SIDECAR_SHARED_SECRET` | Auth: Twenty → sidecar |
| `PG_DATABASE_URL` | Conversation persistence |

## Testing Checklist

- [ ] Open CRM → Chat UI shows 4 agent chips with credit badges
- [ ] Select "book'd fast" → send message → response appears
- [ ] Thread appears in left sidebar, persists on reload
- [ ] Credit deducted in Control Center
- [ ] "Create a dashboard for leads" → dashboard created
- [ ] "Count my contacts" → returns number
- [ ] Out of credits → blocked with "buy pack" message

## Local Development

```bash
# Install deps
yarn install

# Run dev server
yarn dev

# Build
yarn build

# Run tests
yarn test
```

## License

Proprietary — book'd CRM internal fork of Twenty CRM.