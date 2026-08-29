-- ============================================================
-- Government Work Helper — Row Level Security Policies
-- ============================================================

-- Enable RLS on all user-facing tables
ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_service_journeys  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_services         ENABLE ROW LEVEL SECURITY;
ALTER TABLE history                ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlisted_requests      ENABLE ROW LEVEL SECURITY;
ALTER TABLE services               ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_versions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users            ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================

-- Users can only read their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Users can only insert their own profile
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Admins can read all profiles
CREATE POLICY "profiles_admin_select" ON profiles
  FOR SELECT USING (is_admin(auth.uid()));

-- ============================================================
-- SERVICES — Public read for active verified/needs_verification
-- ============================================================

CREATE POLICY "services_public_select" ON services
  FOR SELECT USING (
    active = true AND verification_status != 'inactive'
  );

-- Admins can do everything
CREATE POLICY "services_admin_all" ON services
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================
-- SERVICE CATEGORIES — Public read
-- ============================================================

CREATE POLICY "service_categories_public_select" ON service_categories
  FOR SELECT USING (active = true);

CREATE POLICY "service_categories_admin_all" ON service_categories
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================
-- SERVICE VERSIONS — Admin only
-- ============================================================

CREATE POLICY "service_versions_admin_select" ON service_versions
  FOR SELECT USING (is_admin(auth.uid()));

-- ============================================================
-- CONVERSATIONS
-- ============================================================

-- Authenticated users: own conversations only
CREATE POLICY "conversations_select_own" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "conversations_insert_own" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "conversations_update_own" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can read all
CREATE POLICY "conversations_admin_select" ON conversations
  FOR SELECT USING (is_admin(auth.uid()));

-- ============================================================
-- CONVERSATION MESSAGES
-- ============================================================

CREATE POLICY "messages_select_own" ON conversation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert_own" ON conversation_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_admin_select" ON conversation_messages
  FOR SELECT USING (is_admin(auth.uid()));

-- ============================================================
-- USER SERVICE JOURNEYS
-- ============================================================

CREATE POLICY "journeys_select_own" ON user_service_journeys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "journeys_insert_own" ON user_service_journeys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "journeys_update_own" ON user_service_journeys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "journeys_admin_select" ON user_service_journeys
  FOR SELECT USING (is_admin(auth.uid()));

-- ============================================================
-- BOOKMARKS
-- ============================================================

CREATE POLICY "bookmarks_select_own" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "bookmarks_insert_own" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_delete_own" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SAVED SERVICES
-- ============================================================

CREATE POLICY "saved_services_select_own" ON saved_services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_services_insert_own" ON saved_services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_services_delete_own" ON saved_services
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- HISTORY
-- ============================================================

CREATE POLICY "history_select_own" ON history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "history_insert_own" ON history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "history_delete_own" ON history
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "history_admin_select" ON history
  FOR SELECT USING (is_admin(auth.uid()));

-- ============================================================
-- UNLISTED REQUESTS
-- ============================================================

-- Anyone can insert (guests too — handled in API with service role)
CREATE POLICY "unlisted_requests_insert_any" ON unlisted_requests
  FOR INSERT WITH CHECK (true);

-- Authenticated users can see their own
CREATE POLICY "unlisted_requests_select_own" ON unlisted_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can see and update all
CREATE POLICY "unlisted_requests_admin_all" ON unlisted_requests
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================
-- AUDIT LOGS — Admin read only
-- ============================================================

CREATE POLICY "audit_logs_admin_select" ON audit_logs
  FOR SELECT USING (is_admin(auth.uid()));

-- Service role inserts (from API routes)
CREATE POLICY "audit_logs_service_insert" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- ADMIN USERS — Super admin only
-- ============================================================

CREATE POLICY "admin_users_super_admin" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users a
      WHERE a.auth_user_id = auth.uid() AND a.role = 'super_admin'
    )
  );

-- Admins can read their own record
CREATE POLICY "admin_users_select_own" ON admin_users
  FOR SELECT USING (auth.uid() = auth_user_id);
