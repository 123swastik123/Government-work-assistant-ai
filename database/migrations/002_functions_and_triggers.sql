-- ============================================================
-- 002 — Functions, Triggers, Stored Procedures
-- Government Work Helper
-- ============================================================

-- ─── updated_at trigger ──────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER journeys_updated_at
  BEFORE UPDATE ON user_service_journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── auto-snapshot on service update ─────────────────────────
CREATE OR REPLACE FUNCTION snapshot_service_on_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Snapshot the OLD version before overwriting
  INSERT INTO service_versions (service_id, version, snapshot)
  VALUES (OLD.id, OLD.version, to_jsonb(OLD));
  -- Bump the version number
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_version_snapshot
  BEFORE UPDATE ON services
  FOR EACH ROW
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION snapshot_service_on_update();

-- ─── is_admin helper ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE auth_user_id = check_user_id
  );
$$;

-- ─── pgvector semantic search ─────────────────────────────────
CREATE OR REPLACE FUNCTION match_services(
  query_embedding  vector(1536),
  match_threshold  FLOAT   DEFAULT 0.5,
  match_count      INT     DEFAULT 10,
  filter_state     TEXT    DEFAULT 'karnataka'
)
RETURNS TABLE (
  id                  UUID,
  slug                TEXT,
  name                JSONB,
  short_description   JSONB,
  category            TEXT,
  tier                SMALLINT,
  verification_status TEXT,
  last_verified_on    DATE,
  similarity          FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    s.id,
    s.slug,
    s.name,
    s.short_description,
    s.category,
    s.tier,
    s.verification_status,
    s.last_verified_on,
    1 - (s.embedding <=> query_embedding) AS similarity
  FROM services s
  WHERE
    s.active = true
    AND s.state = filter_state
    AND s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ─── full-text + keyword search ───────────────────────────────
CREATE OR REPLACE FUNCTION search_services_by_keyword(
  search_query  TEXT,
  filter_state  TEXT  DEFAULT 'karnataka',
  result_limit  INT   DEFAULT 10
)
RETURNS TABLE (
  id                  UUID,
  slug                TEXT,
  name                JSONB,
  short_description   JSONB,
  category            TEXT,
  tier                SMALLINT,
  verification_status TEXT,
  last_verified_on    DATE,
  rank                FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    s.id,
    s.slug,
    s.name,
    s.short_description,
    s.category,
    s.tier,
    s.verification_status,
    s.last_verified_on,
    ts_rank(
      to_tsvector('english',
        COALESCE(s.name->>'en','') || ' ' ||
        COALESCE(s.short_description->>'en','') || ' ' ||
        array_to_string(s.keywords, ' ')
      ),
      plainto_tsquery('english', search_query)
    ) AS rank
  FROM services s
  WHERE
    s.active = true
    AND s.state = filter_state
    AND (
      to_tsvector('english',
        COALESCE(s.name->>'en','') || ' ' ||
        COALESCE(s.short_description->>'en','') || ' ' ||
        array_to_string(s.keywords, ' ')
      ) @@ plainto_tsquery('english', search_query)
      OR s.keywords && ARRAY[lower(search_query)]
      OR (s.name->>'en') ILIKE '%' || search_query || '%'
    )
  ORDER BY rank DESC, s.tier ASC
  LIMIT result_limit;
$$;

-- ─── auto-create profile on user signup ───────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (auth_user_id, language, state)
  VALUES (NEW.id, 'en', 'karnataka')
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
