-- Migration: 0003_cloud_drive_storage_engine.sql
-- Description: Personal Cloud Storage Engine (TeraBox / Google Drive / ownCloud model)
-- Adds hierarchical folders, file metadata, quota accounting, public & passworded shares,
-- collaborative folder access, versioning, trash lifecycle, and SHA-256 deduplication.

-- 1. Storage Quotas
CREATE TABLE IF NOT EXISTS storage_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    total_quota_bytes BIGINT NOT NULL DEFAULT 1099511627776, -- 1 TB default
    used_bytes BIGINT NOT NULL DEFAULT 0,
    file_count INTEGER NOT NULL DEFAULT 0,
    video_bytes BIGINT NOT NULL DEFAULT 0,
    photo_bytes BIGINT NOT NULL DEFAULT 0,
    audio_bytes BIGINT NOT NULL DEFAULT 0,
    document_bytes BIGINT NOT NULL DEFAULT 0,
    archive_bytes BIGINT NOT NULL DEFAULT 0,
    other_bytes BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Drive Folders (Hierarchical Tree)
CREATE TABLE IF NOT EXISTS drive_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES drive_folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6366f1',
    is_starred BOOLEAN DEFAULT FALSE,
    is_trashed BOOLEAN DEFAULT FALSE,
    trashed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Drive Files (Any File Type: Video, Audio, Image, Document, Code, Archive, Binary)
CREATE TABLE IF NOT EXISTS drive_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES drive_folders(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    extension TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('video', 'photo', 'audio', 'document', 'code', 'archive', 'binary')),
    size_bytes BIGINT NOT NULL,
    sha256_hash TEXT NOT NULL,
    storage_provider TEXT NOT NULL CHECK (storage_provider IN ('telegram', 'seaweedfs', 's3', 'r2', 'local')),
    storage_key TEXT NOT NULL,
    storage_url TEXT,
    thumbnail_url TEXT,
    is_starred BOOLEAN DEFAULT FALSE,
    is_trashed BOOLEAN DEFAULT FALSE,
    trashed_at TIMESTAMPTZ,
    is_published_to_social BOOLEAN DEFAULT FALSE,
    social_content_id UUID REFERENCES contents(id) ON DELETE SET NULL,
    version INTEGER NOT NULL DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Drive Deduplication Hashes (Zero-Byte Instant Dedup Registry)
CREATE TABLE IF NOT EXISTS drive_dedup_hashes (
    sha256_hash TEXT PRIMARY KEY,
    storage_provider TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    reference_count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TeraBox-Style Public & Passworded Shares
CREATE TABLE IF NOT EXISTS drive_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    target_type TEXT NOT NULL CHECK (target_type IN ('file', 'folder')),
    target_id UUID NOT NULL,
    password_hash TEXT,
    expires_at TIMESTAMPTZ,
    allow_download BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Collaborative Folder Permissions (ownCloud model)
CREATE TABLE IF NOT EXISTS drive_collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID NOT NULL REFERENCES drive_folders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('viewer', 'commenter', 'editor', 'uploader', 'manager', 'owner')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(folder_id, user_id)
);

-- 7. File Versions (History & Rollback)
CREATE TABLE IF NOT EXISTS drive_file_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES drive_files(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    size_bytes BIGINT NOT NULL,
    sha256_hash TEXT NOT NULL,
    storage_provider TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning queries
CREATE INDEX IF NOT EXISTS idx_drive_files_user ON drive_files(user_id, folder_id) WHERE NOT is_trashed;
CREATE INDEX IF NOT EXISTS idx_drive_files_starred ON drive_files(user_id) WHERE is_starred AND NOT is_trashed;
CREATE INDEX IF NOT EXISTS idx_drive_files_trashed ON drive_files(user_id) WHERE is_trashed;
CREATE INDEX IF NOT EXISTS idx_drive_files_category ON drive_files(user_id, category);
CREATE INDEX IF NOT EXISTS idx_drive_files_hash ON drive_files(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_drive_folders_tree ON drive_folders(user_id, parent_id) WHERE NOT is_trashed;
CREATE INDEX IF NOT EXISTS idx_drive_shares_token ON drive_shares(token);

-- Enable RLS on all Cloud Drive tables
ALTER TABLE storage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_dedup_hashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_file_versions ENABLE ROW LEVEL SECURITY;

-- Base RLS Policies
CREATE POLICY "Users view own storage quota" ON storage_quotas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own folders" ON drive_folders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own folders" ON drive_folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own files" ON drive_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own files" ON drive_files FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public shares are viewable by token" ON drive_shares FOR SELECT USING (TRUE);
CREATE POLICY "Users manage own shares" ON drive_shares FOR ALL USING (auth.uid() = user_id);