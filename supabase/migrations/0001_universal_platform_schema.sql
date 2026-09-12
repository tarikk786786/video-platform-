-- ==============================================================================
-- Freedom-First Universal Media & Social Platform Schema
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    followers_count BIGINT DEFAULT 0,
    following_count BIGINT DEFAULT 0,
    total_likes_received BIGINT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'creator', 'moderator', 'admin')),
    privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'private', 'followers_only')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Universal Contents Table (Video, Image, Audio, Document, Post, Link, Gallery)
CREATE TABLE IF NOT EXISTS public.contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('video', 'image', 'audio', 'document', 'text', 'link', 'gallery')),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'General',
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'followers_only', 'private')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'uploading', 'processing', 'published', 'failed')),
    is_pinned BOOLEAN DEFAULT FALSE,
    view_count BIGINT DEFAULT 0,
    watch_time_seconds BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    comment_count BIGINT DEFAULT 0,
    share_count BIGINT DEFAULT 0,
    save_count BIGINT DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- 3. Content Assets (Files, Telegram/S3 keys, Mime types, Dimensions, Durations)
CREATE TABLE IF NOT EXISTS public.content_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    storage_provider TEXT NOT NULL DEFAULT 'telegram' CHECK (storage_provider IN ('telegram', 'local', 'r2', 's3', 'backblaze', 'minio')),
    storage_key TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT DEFAULT 0,
    duration_seconds NUMERIC(10, 2),
    width INTEGER,
    height INTEGER,
    thumbnail_key TEXT,
    hls_master_url TEXT,
    telegram_file_id TEXT,
    telegram_message_id BIGINT,
    telegram_chat_id TEXT,
    captions_vtt_key TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Content Views & Watch Time (Deduplicated with IP hash and session tracking)
CREATE TABLE IF NOT EXISTS public.content_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    watch_time_seconds INTEGER NOT NULL DEFAULT 0,
    completion_rate NUMERIC(5, 2) DEFAULT 0.00,
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Content Likes
CREATE TABLE IF NOT EXISTS public.content_likes (
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (content_id, user_id)
);

-- 6. Threaded Comments (Nested tree structure via parent_comment_id)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    like_count BIGINT DEFAULT 0,
    reply_count BIGINT DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'flagged', 'deleted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Comment Likes
CREATE TABLE IF NOT EXISTS public.comment_likes (
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (comment_id, user_id)
);

-- 8. Follows
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

-- 9. Hashtags
CREATE TABLE IF NOT EXISTS public.hashtags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag TEXT UNIQUE NOT NULL,
    usage_count BIGINT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Content Hashtag Mapping
CREATE TABLE IF NOT EXISTS public.content_hashtags (
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    hashtag_id UUID NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (content_id, hashtag_id)
);

-- 11. Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, content_id)
);

-- 12. Playlists
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    item_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Playlist Items
CREATE TABLE IF NOT EXISTS public.playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (playlist_id, content_id)
);

-- 14. Conversations (DMs and Groups)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL DEFAULT 'dm' CHECK (type IN ('dm', 'group')),
    title TEXT,
    avatar_url TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Conversation Members
CREATE TABLE IF NOT EXISTS public.conversation_members (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    is_muted BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- 16. Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file', 'reply')),
    body TEXT,
    media_url TEXT,
    reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Message Reactions
CREATE TABLE IF NOT EXISTS public.message_reactions (
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id, reaction)
);

-- 18. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('follow', 'like', 'comment', 'reply', 'mention', 'message', 'reaction', 'published')),
    entity_id UUID,
    entity_type TEXT,
    content_snippet TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Community Reports (Safety/Legal Foundation)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.contents(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 20. User Blocks
CREATE TABLE IF NOT EXISTS public.blocks (
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id)
);

-- 21. Media Processing Jobs (Decoupled Background Worker Queue)
CREATE TABLE IF NOT EXISTS public.media_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.content_assets(id) ON DELETE CASCADE,
    job_type TEXT NOT NULL CHECK (job_type IN ('thumbnail', 'metadata', 'telegram_upload', 'transcode', 'hls', 'transcription')),
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    priority INTEGER DEFAULT 10,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    progress_percent INTEGER DEFAULT 0,
    error_message TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    result JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. Media Processing Logs
CREATE TABLE IF NOT EXISTS public.media_processing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.media_jobs(id) ON DELETE CASCADE,
    level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warn', 'error', 'debug')),
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast Feeds, Search & Queries
CREATE INDEX IF NOT EXISTS idx_contents_status_visibility ON public.contents(status, visibility, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_contents_user_id ON public.contents(user_id);
CREATE INDEX IF NOT EXISTS idx_contents_type ON public.contents(type);
CREATE INDEX IF NOT EXISTS idx_content_assets_content_id ON public.content_assets(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_content_id ON public.comments(content_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_media_jobs_queue ON public.media_jobs(status, priority DESC, created_at ASC);

-- Full text search index trigger
CREATE OR REPLACE FUNCTION contents_search_vector_update() RETURNS TRIGGER AS 
BEGIN
    NEW.search_vector := setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
                         setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
                         setweight(to_tsvector('english', coalesce(NEW.category, '')), 'C');
    RETURN NEW;
END;
 LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contents_search_vector ON public.contents;
CREATE TRIGGER trg_contents_search_vector
BEFORE INSERT OR UPDATE ON public.contents
FOR EACH ROW EXECUTE FUNCTION contents_search_vector_update();

CREATE INDEX IF NOT EXISTS idx_contents_search ON public.contents USING gin(search_vector);
