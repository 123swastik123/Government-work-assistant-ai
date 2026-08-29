# Database — Government Work Helper

## Structure

```
database/
├── migrations/
│   ├── 001_extensions_and_schema.sql   — All tables, indexes, pgvector
│   ├── 002_functions_and_triggers.sql  — Functions, triggers, semantic search
│   └── 003_rls_policies.sql            — Row Level Security policies
└── seed/
    ├── 01_categories.sql               — 13 service categories
    ├── 02_services_tier1.sql           — Services 1–10 (highest frequency)
    ├── 03_services_tier2.sql           — Services 11–20 (certificates, etc.)
    └── 04_services_tier3.sql           — Services 21–30 (property, EPF, etc.)
```

## Setup Instructions

### 1. Create Supabase Project
- Go to https://supabase.com → New Project
- Note your Project URL and API keys

### 2. Enable pgvector
In Supabase Dashboard:
- Database → Extensions → Search "vector" → Enable

### 3. Run migrations (in order)
Option A — Supabase CLI:
```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Option B — Supabase SQL Editor:
1. Open Supabase Dashboard → SQL Editor
2. Paste and run each migration file in order:
   - 001_extensions_and_schema.sql
   - 002_functions_and_triggers.sql
   - 003_rls_policies.sql

### 4. Run seed data
In Supabase SQL Editor, run each seed file in order:
- 01_categories.sql
- 02_services_tier1.sql
- 03_services_tier2.sql
- 04_services_tier3.sql

### 5. Generate embeddings
After seeding, run the embedding generation script from the frontend:
```bash
cd frontend
npm run generate-embeddings
```
This calls the Anthropic/OpenAI embedding API and updates the `embedding` column.

## Important Notes

### verification_status
All seeded services have `verification_status = 'needs_verification'`.

To mark a service as verified:
1. Log in as an admin on the platform
2. Go to /admin/services/[id]
3. Verify all fields against official government sources
4. Add source notes
5. Click "Mark as Verified"

**Never display unverified data as verified to citizens.**

### Fees
Most fees are set to `null` with a note to check the official portal.
This is intentional — fees change without notice and must be human-verified.

### Official URLs
All official URLs in the seed data are real Karnataka/India government portals.
They should be verified periodically as URLs can change.

## Schema Overview

| Table | Purpose |
|---|---|
| profiles | User personalization preferences |
| service_categories | 13 service categories |
| services | 30 government services (expandable) |
| service_versions | Audit trail of service changes |
| conversations | Chat sessions |
| conversation_messages | Individual chat messages |
| user_service_journeys | Progress tracking per service |
| bookmarks | User-saved service bookmarks |
| saved_services | User-saved services |
| history | Search/interaction history |
| unlisted_requests | Unmatched service requests for review |
| audit_logs | Admin action audit trail |
| admin_users | Admin role assignments |
