-- PostgreSQL 16 production foundation. Run with a migration role that can install extensions.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS mut_sa_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE,
  email_verified_at timestamptz, display_name text NOT NULL, role text NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin','moderator')),
  password_hash text, reg_no text UNIQUE, school_id uuid, course_id uuid, year_group_id uuid,
  deleted_at timestamptz, delete_requested_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mut_sa_profiles (
  user_id uuid PRIMARY KEY REFERENCES mut_sa_users(id) ON DELETE CASCADE, username text NOT NULL UNIQUE,
  bio text, avatar_url text, banner_url text, followers_count integer NOT NULL DEFAULT 0, following_count integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS mut_sa_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE,
  session_hash text NOT NULL UNIQUE, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mut_sa_oauth_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK(provider IN ('google','apple')), provider_account_id text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(provider,provider_account_id)
);
CREATE TABLE IF NOT EXISTS mut_sa_admin_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE, requested_at timestamptz NOT NULL DEFAULT now(), approved_by uuid REFERENCES mut_sa_users(id), approved_at timestamptz
);
CREATE TABLE IF NOT EXISTS mut_sa_communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), parent_id uuid REFERENCES mut_sa_communities(id) ON DELETE RESTRICT,
  type text NOT NULL CHECK(type IN ('school','course','year_group','study_group','club')), name text NOT NULL,
  slug text NOT NULL UNIQUE, description text, cover_image_url text, icon_url text, created_by uuid REFERENCES mut_sa_users(id),
  created_at timestamptz NOT NULL DEFAULT now(), CHECK ((type='school' AND parent_id IS NULL) OR (type<>'school' AND parent_id IS NOT NULL))
);
ALTER TABLE mut_sa_users DROP CONSTRAINT IF EXISTS mut_sa_users_school_fk;
ALTER TABLE mut_sa_users ADD CONSTRAINT mut_sa_users_school_fk FOREIGN KEY(school_id) REFERENCES mut_sa_communities(id);
ALTER TABLE mut_sa_users DROP CONSTRAINT IF EXISTS mut_sa_users_course_fk;
ALTER TABLE mut_sa_users ADD CONSTRAINT mut_sa_users_course_fk FOREIGN KEY(course_id) REFERENCES mut_sa_communities(id);
ALTER TABLE mut_sa_users DROP CONSTRAINT IF EXISTS mut_sa_users_year_fk;
ALTER TABLE mut_sa_users ADD CONSTRAINT mut_sa_users_year_fk FOREIGN KEY(year_group_id) REFERENCES mut_sa_communities(id);
CREATE TABLE IF NOT EXISTS mut_sa_community_members (
  community_id uuid NOT NULL REFERENCES mut_sa_communities(id) ON DELETE CASCADE, user_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(community_id,user_id)
);
CREATE TABLE IF NOT EXISTS mut_sa_study_group_creations (
  user_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE, community_id uuid NOT NULL REFERENCES mut_sa_communities(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,community_id)
);
CREATE TABLE IF NOT EXISTS mut_sa_study_group_quota (user_id uuid PRIMARY KEY REFERENCES mut_sa_users(id) ON DELETE CASCADE, group_count integer NOT NULL DEFAULT 0 CHECK(group_count BETWEEN 0 AND 5));
CREATE TABLE IF NOT EXISTS mut_sa_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), community_id uuid NOT NULL REFERENCES mut_sa_communities(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES mut_sa_users(id), title text NOT NULL, body text NOT NULL, pinned boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mut_sa_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), author_id uuid NOT NULL REFERENCES mut_sa_users(id), community_id uuid REFERENCES mut_sa_communities(id),
  body text NOT NULL DEFAULT '', media_type text NOT NULL DEFAULT 'text' CHECK(media_type IN ('text','image','video','audio')),
  media_urls jsonb NOT NULL DEFAULT '[]', like_count integer NOT NULL DEFAULT 0, comment_count integer NOT NULL DEFAULT 0,
  repost_count integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE TABLE IF NOT EXISTS mut_sa_follows (follower_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE, following_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(follower_id,following_id), CHECK(follower_id<>following_id));
CREATE TABLE IF NOT EXISTS mut_sa_likes (user_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE, post_id uuid NOT NULL REFERENCES mut_sa_posts(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,post_id));
CREATE TABLE IF NOT EXISTS mut_sa_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), post_id uuid NOT NULL REFERENCES mut_sa_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES mut_sa_users(id), parent_id uuid REFERENCES mut_sa_comments(id) ON DELETE CASCADE,
  body text NOT NULL, depth smallint NOT NULL DEFAULT 0 CHECK(depth BETWEEN 0 AND 3), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mut_sa_reposts (user_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE, post_id uuid NOT NULL REFERENCES mut_sa_posts(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,post_id));
CREATE TABLE IF NOT EXISTS mut_sa_timeline_entries (user_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE, post_id uuid NOT NULL REFERENCES mut_sa_posts(id) ON DELETE CASCADE, score real NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,post_id));
CREATE TABLE IF NOT EXISTS mut_sa_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reporter_id uuid REFERENCES mut_sa_users(id) ON DELETE SET NULL,
  anonymous boolean NOT NULL DEFAULT false, entity_type text NOT NULL CHECK(entity_type IN ('post','comment','user','community','listing')),
  entity_id uuid NOT NULL, category text NOT NULL CHECK(category IN ('harassment','misinformation','academic_integrity','technical_issue','other')),
  details text, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','investigating','resolved')), created_at timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz,
  CHECK(NOT anonymous OR reporter_id IS NULL)
);
CREATE TABLE IF NOT EXISTS mut_sa_admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), admin_id uuid NOT NULL REFERENCES mut_sa_users(id), action text NOT NULL,
  entity_type text NOT NULL, entity_id uuid, details jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mut_sa_marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), seller_id uuid NOT NULL REFERENCES mut_sa_users(id), title text NOT NULL,
  description text NOT NULL, price_kes numeric(12,2) NOT NULL CHECK(price_kes>=0), category text NOT NULL,
  image_urls jsonb NOT NULL DEFAULT '[]', location geography(Point,4326), campus_zone text,
  verified_seller boolean NOT NULL DEFAULT false, status text NOT NULL DEFAULT 'active' CHECK(status IN ('active','sold','removed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mut_sa_conversations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), kind text NOT NULL CHECK(kind IN ('direct','group')), community_id uuid REFERENCES mut_sa_communities(id), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS mut_sa_conversation_members (conversation_id uuid NOT NULL REFERENCES mut_sa_conversations(id) ON DELETE CASCADE, user_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE, joined_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(conversation_id,user_id));
CREATE TABLE IF NOT EXISTS mut_sa_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id uuid NOT NULL REFERENCES mut_sa_conversations(id) ON DELETE CASCADE, sender_id uuid NOT NULL REFERENCES mut_sa_users(id), ciphertext text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now()+interval '7 days');
CREATE TABLE IF NOT EXISTS mut_sa_documents (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, source_url text, content text NOT NULL, embedding vector(768), school_id uuid REFERENCES mut_sa_communities(id), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS mut_sa_notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES mut_sa_users(id) ON DELETE CASCADE, kind text NOT NULL, payload jsonb NOT NULL DEFAULT '{}', read_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS mut_sa_user_settings (user_id uuid PRIMARY KEY REFERENCES mut_sa_users(id) ON DELETE CASCADE, privacy jsonb NOT NULL DEFAULT '{}', notifications jsonb NOT NULL DEFAULT '{}');

CREATE INDEX IF NOT EXISTS mut_sa_posts_feed_idx ON mut_sa_posts(created_at DESC,id DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS mut_sa_posts_community_feed_idx ON mut_sa_posts(community_id,created_at DESC,id DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS mut_sa_follows_reverse_idx ON mut_sa_follows(following_id,follower_id);
CREATE INDEX IF NOT EXISTS mut_sa_comments_post_idx ON mut_sa_comments(post_id,created_at,id);
CREATE INDEX IF NOT EXISTS mut_sa_timeline_feed_idx ON mut_sa_timeline_entries(user_id,score DESC,created_at DESC,post_id);
CREATE INDEX IF NOT EXISTS mut_sa_reports_queue_idx ON mut_sa_reports(status,created_at DESC);
CREATE INDEX IF NOT EXISTS mut_sa_listings_geo_idx ON mut_sa_marketplace_listings USING gist(location);
CREATE INDEX IF NOT EXISTS mut_sa_listings_search_idx ON mut_sa_marketplace_listings USING gin(to_tsvector('english',title||' '||description));
CREATE INDEX IF NOT EXISTS mut_sa_documents_embedding_idx ON mut_sa_documents USING hnsw(embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS mut_sa_messages_ttl_idx ON mut_sa_messages(expires_at);

-- Enforce study group ownership quota (up to five groups per creator) without race conditions.
CREATE OR REPLACE FUNCTION mut_sa_guard_study_group() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.type='study_group' THEN
    IF NEW.created_by IS NULL THEN RAISE EXCEPTION 'study groups require a creator'; END IF;
    INSERT INTO mut_sa_study_group_quota(user_id,group_count) VALUES(NEW.created_by,1)
    ON CONFLICT(user_id) DO UPDATE SET group_count=mut_sa_study_group_quota.group_count+1
    WHERE mut_sa_study_group_quota.group_count<5;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'study group limit reached';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE OR REPLACE FUNCTION mut_sa_track_study_group() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.type='study_group' THEN
    INSERT INTO mut_sa_study_group_creations(user_id,community_id) VALUES(NEW.created_by,NEW.id);
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS mut_sa_study_group_limit ON mut_sa_communities;
CREATE TRIGGER mut_sa_study_group_limit BEFORE INSERT ON mut_sa_communities FOR EACH ROW EXECUTE FUNCTION mut_sa_guard_study_group();
DROP TRIGGER IF EXISTS mut_sa_study_group_track ON mut_sa_communities;
CREATE TRIGGER mut_sa_study_group_track AFTER INSERT ON mut_sa_communities FOR EACH ROW EXECUTE FUNCTION mut_sa_track_study_group();
CREATE OR REPLACE FUNCTION mut_sa_untrack_study_group() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.type='study_group' THEN
    DELETE FROM mut_sa_study_group_creations WHERE community_id=OLD.id;
    UPDATE mut_sa_study_group_quota SET group_count=GREATEST(0,group_count-1) WHERE user_id=OLD.created_by;
  END IF;
  RETURN OLD;
END $$;
DROP TRIGGER IF EXISTS mut_sa_study_group_untrack ON mut_sa_communities;
CREATE TRIGGER mut_sa_study_group_untrack AFTER DELETE ON mut_sa_communities FOR EACH ROW EXECUTE FUNCTION mut_sa_untrack_study_group();
