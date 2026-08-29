-- ============================================================
-- 003 — Row Level Security Policies
-- Government Work Helper
-- ============================================================

ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE services               ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_versions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_service_journeys  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_services         ENABLE ROW LEVEL SECURITY;
ALTER TABLE history                ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlisted_requests      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users            ENABLE ROW LEVEL SECURITY;

-- ─── profiles ────────────────────────────────────────────────
CREATE POLICY profiles_select_own  ON profiles FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY profiles_insert_own  ON profiles FOR INSERT WITH CHECK (auth.uid() = auth_user_id);
CREATE POLICY profiles_update_own  ON profiles FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY profiles_admin       ON profiles FOR ALL    USING (is_admin(auth.uid()));

-- ─── service_categories — public read ────────────────────────
CREATE POLICY categories_public_select ON service_categories FOR SELECT USING (active = true);
CREATE POLICY categories_admin_all     ON service_categories FOR ALL    USING (is_admin(auth.uid()));

-- ─── services — public read (active only) ────────────────────
CREATE POLICY services_public_select ON services
  FOR SELECT USING (active = true AND verification_status != 'inactive');

CREATE POLICY services_admin_all ON services
  FOR ALL USING (is_admin(auth.uid()));

-- ─── service_versions — admin only ───────────────────────────
CREATE POLICY service_versions_admin ON service_versions
  FOR SELECT USING (is_admin(auth.uid()));

-- ─── conversations ────────────────────────────────────────────
CREATE POLICY conversations_select_own ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY conversations_insert_own ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY conversations_update_own ON conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY conversations_admin      ON conversations FOR SELECT USING (is_admin(auth.uid()));

-- ─── conversation_messages ────────────────────────────────────
CREATE POLICY messages_select_own ON conversation_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
  );
CREATE POLICY messages_insert_own ON conversation_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
  );
CREATE POLICY messages_admin ON conversation_messages
  FOR SELECT USING (is_admin(auth.uid()));

-- ─── user_service_journeys ────────────────────────────────────
CREATE POLICY journeys_select_own ON user_service_journeys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY journeys_insert_own ON user_service_journeys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY journeys_update_own ON user_service_journeys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY journeys_admin      ON user_service_journeys FOR SELECT USING (is_admin(auth.uid()));

-- ─── bookmarks ────────────────────────────────────────────────
CREATE POLICY bookmarks_select_own ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY bookmarks_insert_own ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY bookmarks_delete_own ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ─── saved_services ───────────────────────────────────────────
CREATE POLICY saved_select_own ON saved_services FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY saved_insert_own ON saved_services FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY saved_delete_own ON saved_services FOR DELETE USING (auth.uid() = user_id);

-- ─── history ──────────────────────────────────────────────────
CREATE POLICY history_select_own ON history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY history_insert_own ON history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY history_delete_own ON history FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY history_admin      ON history FOR SELECT USING (is_admin(auth.uid()));

-- ─── unlisted_requests ────────────────────────────────────────
-- Guests can insert via service-role key (API handles auth)
CREATE POLICY unlisted_insert_any  ON unlisted_requests FOR INSERT WITH CHECK (true);
CREATE POLICY unlisted_select_own  ON unlisted_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY unlisted_admin_all   ON unlisted_requests FOR ALL    USING (is_admin(auth.uid()));

-- ─── audit_logs ───────────────────────────────────────────────
CREATE POLICY audit_admin_select   ON audit_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY audit_service_insert ON audit_logs FOR INSERT WITH CHECK (true);

-- ─── admin_users ──────────────────────────────────────────────
CREATE POLICY admin_select_own   ON admin_users FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY admin_super_admin  ON admin_users FOR ALL    USING (
  EXISTS (SELECT 1 FROM admin_users a WHERE a.auth_user_id = auth.uid() AND a.role = 'super_admin')
);
