# Government Work Helper — MVP Build Plan (v2, Karnataka RTO Pilot)
*Based on your 30 answers — this supersedes the general architecture doc with a concrete, buildable scope.*

---

## 1. Locked Decisions (from your answers)

| Area | Decision |
|---|---|
| MVP domain | Driving licence + RTO services only |
| Geography | Karnataka pilot first, expand later |
| Beyond guidance | Also auto-fill/pre-generate downloadable application forms |
| Accounts | Optional (email or phone, user's choice); guest mode always available |
| Data sourcing | AI-assisted research, human-verified monthly |
| AI scope | Grounded answers from DB **+** general term explanations (clearly marked "general info") |
| Unlisted service | Best-effort general guidance with a visible disclaimer |
| Chat history | Persists across visits — requires login (guests get session-only) |
| Trust signals | "Last verified on [date]" shown to every user |
| Reporting | "Report incorrect info" button — logged-in users only |
| Legal | You're arranging legal review before launch — I'll draft placeholder disclaimer/privacy text now |
| Languages | English, Hindi, Kannada — all at launch |
| Translation | AI-assisted, human-reviewed |
| Brand | Working title only, decide later |
| Visual style | Friendly, approachable, non-bureaucratic |
| Platform | Website now, app possibly later |
| Stack | You asked me to recommend (below) |
| Hosting | Free/low-cost tiers |
| Build approach | You have some coding experience; AI (me) does the heavy lifting |
| Team | Solo + AI |
| Timeline | A few weeks |
| Business context | Startup intended to scale |
| Success metrics | Usage numbers + feedback ratings |
| Govt partnership | Open later, not now |
| Growth channel | Not decided yet |
| Constraints | Tight budget + India's DPDP Act compliance + additional restrictions (**you still need to tell me what these are** — flag below) |

⚠️ **Open item:** you mentioned "some other restrictions" beyond budget and DPDP but didn't specify them yet. Everything below assumes just those two — tell me the rest whenever you have them and I'll adjust.

---

## 2. Recommended Tech Stack

Chosen specifically for: free/low-cost hosting, fast solo build, AI doing most of the work, and needing auth + Postgres + storage without standing up separate services.

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js (React) + Tailwind CSS** | One framework for pages + API routes; huge ecosystem; free hosting on Vercel |
| Backend | **Next.js API routes** (no separate backend server needed at MVP scale) | Fewer moving parts for a solo build |
| Database + Auth | **Supabase** (Postgres + built-in email/phone-OTP auth + file storage) | Free tier covers MVP; gives you the DB, login, and file storage (for generated PDFs) in one place; satisfies "email or phone, user's choice" out of the box |
| AI / NLU | **Claude API** (Anthropic) for intent matching + grounded response generation | You're already in the Claude ecosystem; strong instruction-following for "only state facts from provided context" |
| Semantic matching | Start with simple keyword/category matching for 5–8 services; add `pgvector` (Supabase supports it) only if free-text matching proves unreliable | Keeps MVP simple; upgrade path exists without re-architecting |
| PDF form generation | **pdf-lib** (Node) to fill official RTO form templates with user-entered data | Runs entirely client/server side, no third-party data exposure |
| Hosting | **Vercel** (frontend + API routes) + **Supabase** (DB/auth/storage) | Both have generous free tiers |
| Translations | Claude API for first-pass Hindi/Kannada text, stored per-language in DB, you review before publishing | Matches "AI-assisted, human-reviewed" |

This entire stack can run at **$0/month** at MVP traffic levels.

---

## 3. MVP Feature Scope (Karnataka RTO only)

To hit "a few weeks" solo, narrow to **4–5 services** fully polished rather than many half-done:

1. Learner's Licence (new)
2. Permanent Driving Licence (new, after LL)
3. Driving Licence Renewal
4. Duplicate Driving Licence
5. *(stretch)* International Driving Permit

**Per-service, the guide includes:** eligibility, required documents (personalized checklist), official fee, numbered steps, official Sarathi/Parivahan portal link with trust badge + "last verified on" date, a downloadable pre-filled PDF form, and a "what happens after submission" + troubleshooting section.

**Core features:**
- Chat-style problem intake ("I want to renew my driving licence") in EN/HI/KN
- Intent matching against the 4–5 seeded services
- Dynamic follow-up questions (age, first-time vs renewal, etc.)
- Personalized results page (as above)
- PDF auto-fill using user-entered (non-sensitive) details — generated client-side/server-side, never submitted anywhere by us
- Optional login (email or phone) to save history/bookmarks; full guest mode always available
- Thumbs up/down feedback (everyone); "report incorrect info" + comments (logged-in only)
- Admin panel (you) to add/edit services, set `last_verified_on`, review flagged reports
- Basic privacy policy + disclaimer pages (DPDP-aware draft, pending your legal review)
- General-info fallback with a visible disclaimer for anything outside the 4–5 services

**Explicitly deferred past MVP:** other states, other service categories, native app, WhatsApp/SMS access, reminders/renewal nudges, government partnerships, growth/SEO work.

---

## 4. Data Model (Supabase/Postgres)

```
services
  id, name, category, state ('Karnataka'), 
  eligibility_rules (jsonb), fees (jsonb),
  official_url, last_verified_on, source_notes

service_documents
  id, service_id, document_name, is_conditional, condition (jsonb)

service_steps
  id, service_id, step_order, instruction, language

service_translations
  id, service_id, language ('en'|'hi'|'kn'), field_name, translated_text

post_submission_info
  id, service_id, stage, description, language

troubleshooting
  id, service_id, issue, resolution, language

users (via Supabase Auth)
  id, email/phone, created_at

user_journeys
  id, user_id (nullable for guest), service_id, answers (jsonb), created_at

feedback
  id, user_id (nullable), service_id, rating, comment, is_report (bool), status

form_templates
  id, service_id, template_file_url, field_mapping (jsonb)
```

---

## 5. Suggested Build Order (few-week timeline)

**Week 1 — Foundation**
- Supabase project: schema above, auth (email + phone OTP) wired up
- Seed 2 services fully (e.g., Learner's Licence + DL Renewal) with real, human-verified Karnataka data
- Basic Next.js shell: landing page, chat intake UI, language switcher (EN only functional first)

**Week 2 — Core Loop**
- Intent matching (start simple: keyword rules against the 2–5 seeded services)
- Dynamic question engine + personalized results page
- PDF auto-fill for the 2 seeded services
- Admin panel v1 (CRUD for services/documents/steps)

**Week 3 — Polish & Multilingual**
- Add Hindi + Kannada translations (AI draft → your review) for seeded services
- Feedback + report-incorrect-info flow
- Add remaining services (Duplicate DL, Permanent DL, stretch: IDP)
- Privacy policy / disclaimer pages, DPDP-aware data handling review
- Basic analytics (page views, guide completions, feedback counts)

**After MVP:** expand service count, consider other states, evaluate need for pgvector-based matching if keyword matching proves too brittle, revisit growth channel.

---

## 6. DPDP Act — Practical Notes for This Build

- Collect only what's needed: email/phone for login, and only the form fields the user chooses to enter for PDF generation — nothing is transmitted to any government system by us.
- Explicit consent checkbox at signup, plain-language privacy notice (not legal boilerplate).
- Let users delete their account and data (Supabase makes this straightforward).
- No storage of government credentials, OTPs, or passwords — ever, per your trust principle.
- Data localization: Supabase lets you choose a region; consider hosting the Postgres instance in a region compliant with your legal counsel's guidance once you have it.
- This is a starting checklist, not legal advice — your planned legal review should have the final say.

---

## 7. Immediate Next Steps

1. Confirm the final 4–5 service list (or I can propose the exact Karnataka RTO service list with sub-variants).
2. Share the "other restrictions" you mentioned so I can fold them in.
3. I can start scaffolding the actual Next.js + Supabase project structure, or draft the seed data for the first 2 services — say which you'd like first.
