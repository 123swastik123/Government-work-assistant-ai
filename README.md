# Government Work Helper

> **"Tell us what you need. We'll show you the path."**

A free AI-powered citizen guidance platform for Karnataka, India. Helps citizens understand and navigate government processes — without replacing official portals or performing transactions.

---

## Folder Structure

```
government-work-helper/
├── frontend/          # Next.js App Router + React + Tailwind CSS
├── backend/           # Next.js API routes (lives inside frontend/src/app/api/)
├── ai-model/          # Claude integration, prompts, eligibility engine, matching
├── ui/                # Shared design system components
└── database/          # Supabase migrations, seed scripts, schema docs
```

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/your-org/government-work-helper.git
cd government-work-helper/frontend
npm install
```

### 2. Set up environment variables

```bash
cp ../.env.example .env.local
# Fill in all values — see .env.example for details
```

### 3. Set up Supabase

1. Create a project at https://supabase.com
2. Enable the **pgvector** extension: Database → Extensions → vector
3. Run migrations in order:
   ```bash
   # Using Supabase CLI
   supabase link --project-ref your-project-ref
   supabase db push
   ```
   Or paste each file in `database/migrations/` into the Supabase SQL editor in order.

### 4. Seed the database

```bash
cd frontend
npm run db:seed
```

### 5. Run locally

```bash
cd frontend
npm run dev
# Open http://localhost:3000
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes (Route Handlers) |
| Database | Supabase (PostgreSQL + pgvector + RLS) |
| Auth | Supabase Auth (Email OTP, Phone OTP, Google) |
| AI | Anthropic Claude API |
| PDF | pdf-lib |
| Monitoring | Sentry |
| Hosting | Vercel (frontend) + Supabase (DB/auth/storage) |

---

## Environment Setup

See `.env.example` for all required variables.

Required services:
- [Supabase](https://supabase.com) — database, auth, storage
- [Anthropic](https://console.anthropic.com) — Claude API key
- [Sentry](https://sentry.io) — error monitoring (optional for dev)

---

## Deployment

### Staging
Push to `develop` branch → Vercel preview deployment auto-triggered.

### Production
Push to `main` branch → Vercel production deployment.

Set all environment variables in Vercel dashboard → Project → Settings → Environment Variables.

---

## Services Covered (Karnataka)

**Tier 1** — Aadhaar, PAN, Driving Licence, Voter ID, Ration Card  
**Tier 2** — Income/Caste/Birth/Death Certificates, Passport, Legal Heir, NCL  
**Tier 3** — Khata, Property Tax, EC, RTC, Vehicle RC, Marriage Cert, Police Clearance, EPF

---

## Core Principles

- ✅ We **explain**. The official government portal **transacts**.
- ✅ Eligibility is evaluated **deterministically** by backend code — never by AI.
- ✅ AI only **explains verified facts** — never invents government rules, fees, or URLs.
- ✅ Official URLs come only from **verified database records**.
- ✅ No government credentials, OTPs, or Aadhaar/PAN numbers are ever requested or stored.

---

## License

MIT — Free for citizens, forever.
