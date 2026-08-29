-- ============================================================
-- 001 — Extensions + Full Schema
-- Government Work Helper
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language      TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en','hi','kn')),
  state         TEXT NOT NULL DEFAULT 'karnataka',
  age_bracket   TEXT CHECK (age_bracket IN ('under_18','18_25','26_35','36_50','51_60','60_plus')),
  category      TEXT,
  district      TEXT,
  location_type TEXT CHECK (location_type IN ('urban','rural')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX profiles_auth_user_idx ON profiles(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- ============================================================
-- service_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS service_categories (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  icon         TEXT NOT NULL DEFAULT 'file-text',
  translations JSONB NOT NULL DEFAULT '{}',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- services
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  TEXT NOT NULL UNIQUE,
  name                  JSONB NOT NULL DEFAULT '{}',
  category              TEXT NOT NULL,
  tier                  SMALLINT NOT NULL CHECK (tier IN (1,2,3)),
  state                 TEXT NOT NULL DEFAULT 'karnataka',
  description           JSONB NOT NULL DEFAULT '{}',
  short_description     JSONB NOT NULL DEFAULT '{}',
  eligibility_rules     JSONB,
  questions             JSONB NOT NULL DEFAULT '[]',
  required_documents    JSONB NOT NULL DEFAULT '[]',
  conditional_documents JSONB NOT NULL DEFAULT '[]',
  official_fee          JSONB,
  steps                 JSONB NOT NULL DEFAULT '[]',
  official_url          TEXT NOT NULL,
  official_url_label    JSONB NOT NULL DEFAULT '{}',
  what_happens_after    JSONB,
  troubleshooting       JSONB NOT NULL DEFAULT '[]',
  source_notes          TEXT,
  verification_status   TEXT NOT NULL DEFAULT 'needs_verification'
                        CHECK (verification_status IN ('verified','needs_verification','draft','inactive')),
  last_verified_on      DATE,
  version               INTEGER NOT NULL DEFAULT 1,
  embedding             vector(1536),
  active                BOOLEAN NOT NULL DEFAULT true,
  keywords              TEXT[] NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX services_category_idx     ON services(category);
CREATE INDEX services_tier_idx         ON services(tier);
CREATE INDEX services_state_idx        ON services(state);
CREATE INDEX services_active_idx       ON services(active);
CREATE INDEX services_verification_idx ON services(verification_status);
CREATE INDEX services_keywords_idx     ON services USING GIN(keywords);
CREATE INDEX services_name_trgm_idx    ON services USING GIN ((name->>'en') gin_trgm_ops);
CREATE INDEX services_embedding_idx    ON services USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ============================================================
-- service_versions
-- ============================================================
CREATE TABLE IF NOT EXISTS service_versions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id    UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  version       INTEGER NOT NULL,
  snapshot      JSONB NOT NULL,
  changed_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  change_reason TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX service_versions_svc_idx ON service_versions(service_id);

-- ============================================================
-- conversations
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_session_id   TEXT,
  language           TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en','hi','kn')),
  state              TEXT NOT NULL DEFAULT 'karnataka',
  matched_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT conversations_has_owner CHECK (
    user_id IS NOT NULL OR guest_session_id IS NOT NULL
  )
);
CREATE INDEX conversations_user_idx   ON conversations(user_id);
CREATE INDEX conversations_guest_idx  ON conversations(guest_session_id);

-- ============================================================
-- conversation_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS conversation_messages (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id     UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role                TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content             TEXT NOT NULL,
  structured_response JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX conv_messages_conv_idx ON conversation_messages(conversation_id);

-- ============================================================
-- user_service_journeys
-- ============================================================
CREATE TABLE IF NOT EXISTS user_service_journeys (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id         UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status             TEXT NOT NULL DEFAULT 'started'
                     CHECK (status IN ('started','in_progress','completed','abandoned')),
  current_step       INTEGER NOT NULL DEFAULT 0,
  collected_answers  JSONB NOT NULL DEFAULT '{}',
  eligibility_result JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX journeys_user_idx    ON user_service_journeys(user_id);
CREATE INDEX journeys_service_idx ON user_service_journeys(service_id);
CREATE UNIQUE INDEX journeys_active_unique_idx
  ON user_service_journeys(user_id, service_id)
  WHERE status NOT IN ('completed','abandoned');

-- ============================================================
-- bookmarks
-- ============================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, service_id)
);
CREATE INDEX bookmarks_user_idx ON bookmarks(user_id);

-- ============================================================
-- saved_services
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_services (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, service_id)
);
CREATE INDEX saved_services_user_idx ON saved_services(user_id);

-- ============================================================
-- history
-- ============================================================
CREATE TABLE IF NOT EXISTS history (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  query      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX history_user_idx       ON history(user_id);
CREATE INDEX history_created_at_idx ON history(created_at DESC);

-- ============================================================
-- unlisted_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS unlisted_requests (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_session_id   TEXT,
  suggested_name     TEXT NOT NULL,
  suggested_category TEXT NOT NULL,
  original_query     TEXT NOT NULL,
  language           TEXT NOT NULL DEFAULT 'en',
  state              TEXT NOT NULL DEFAULT 'karnataka',
  status             TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','under_review','accepted','rejected')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at        TIMESTAMPTZ,
  reviewed_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
CREATE INDEX unlisted_status_idx     ON unlisted_requests(status);
CREATE INDEX unlisted_created_at_idx ON unlisted_requests(created_at DESC);

-- ============================================================
-- audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX audit_actor_idx     ON audit_logs(actor_id);
CREATE INDEX audit_entity_idx    ON audit_logs(entity_type, entity_id);
CREATE INDEX audit_created_idx   ON audit_logs(created_at DESC);

-- ============================================================
-- admin_users
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','super_admin')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (auth_user_id)
);
