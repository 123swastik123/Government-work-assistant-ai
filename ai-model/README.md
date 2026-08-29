# AI Model — Government Work Helper

This folder contains the AI/ML layer: Claude integration, system prompt, eligibility engine, and service matching pipeline.

## Files

| File | Purpose |
|---|---|
| `system-prompt.ts` | Exact system prompt + context assembler for Claude |
| `claude-client.ts` | Anthropic Claude API client with retry, rate limiting, fallback |
| `eligibility-engine.ts` | **Deterministic** eligibility evaluator — never uses AI |
| `matching-pipeline.ts` | Service matching: keyword + semantic pipeline |

## Architecture Principles

### Eligibility is NEVER decided by AI
`eligibility-engine.ts` evaluates structured JSON rules against user answers. Claude only *explains* the result. This is a trust-critical requirement.

### Intent matching happens BEFORE Claude
The matching pipeline identifies the service first. Claude then explains and personalizes — it does not identify services from its own knowledge.

### Claude never receives sensitive data
`system-prompt.ts > sanitizeProfile()` strips Aadhaar, PAN, credentials, and tokens before anything is sent to the API.

### Official URLs come from the database
Claude cannot invent or return URLs. All official government links come from verified `services.official_url` in the database.

## Flow

```
User message
    │
    ▼
Normalize input (matching-pipeline.ts)
    │
    ▼
Keyword matching → candidates
    │
    ▼  (if embedding available)
pgvector semantic search (via Supabase RPC in backend)
    │
    ▼
Rank & select service
    │
    ▼
evaluateEligibility() — deterministic (eligibility-engine.ts)
    │
    ▼
getApplicableDocuments() — deterministic
    │
    ▼
buildServiceContext() — assemble verified data
    │
    ▼
buildUserMessage() — construct Claude prompt
    │
    ▼
callClaude() — get explanation in citizen's language
    │
    ▼
Validate JSON (Zod schema)
    │
    ▼
Return to API route → citizen
```

## Environment Variables Required

```
ANTHROPIC_API_KEY=sk-ant-...
AI_RATE_LIMIT_RPM=20
```
