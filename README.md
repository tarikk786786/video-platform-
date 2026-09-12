# FreedomPlay — Freedom-First Universal Media & Social Platform

An open publishing, censorship-resistant user-generated content platform combining YouTube, TikTok, Reddit, Instagram, and Telegram-style messaging with an open publishing philosophy.

## Architecture Overview

Vercel Frontend / API: Next.js 15 + React 19 + Tailwind CSS
Supabase Cloud: PostgreSQL + FTS + Realtime
Storage Layer: StorageProvider abstraction (Telegram / Local / S3 / R2)
Autonomous Worker: FFmpeg + Transcoding + Media Jobs Queue

### Core Innovations & Capabilities

1. Universal Content Model: Generic publishing system (contents and content_assets) supporting videos, images, audio, documents, and rich text without schema redesign.
2. Pluggable Storage Abstraction: Decoupled StorageProvider interface (lib/storage/storage-provider.ts). Implementations for Telegram and Local disk with future support for Cloudflare R2, AWS S3, and Backblaze. Telegram bot tokens never leak to the client.
3. Decoupled Background Media Worker: Vercel handles lightweight HTTP requests while a standalone worker processes video metadata, generates thumbnails, slices HLS streams, and runs Whisper captions.
4. Custom HTML5 + HLS.js Player: Integrated playback with quality selection, playback speed controls, picture-in-picture, fullscreen, and smooth range seeking.
5. Realtime Social Graph & Messaging: Reddit/YouTube-style nested threaded comments, DM/Group chat with Supabase Realtime, and community-driven report moderation without algorithmic censorship.

## Getting Started

### 1. Installation
npm install

### 2. Environment Setup
Copy .env.example to .env.local

### 3. Database Migration
Apply supabase/migrations/0001_universal_platform_schema.sql to your Supabase PostgreSQL instance.

### 4. Running the Web Platform
npm run dev
Open http://localhost:3000

### 5. Running the Background Media Worker
npm run worker