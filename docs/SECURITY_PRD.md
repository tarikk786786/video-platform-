# FREEDOMPLAY — MASTER SECURITY PRD (PHASE 11)

**Document Version:** 1.0.0  
**Status:** Approved Architecture Specification  
**Scope:** Identity, Storage Isolation, File Pipeline, RLS Matrices, Network Hardening, E2EE & Compliance  
**Target Platform:** Next.js 15 (Edge/Node SSR), Supabase (PostgreSQL 15+ with RLS), Telegram Media Storage, Standalone Media Processing Worker  

---

## 1. EXECUTIVE SECURITY SUMMARY & THREAT MODEL

FreedomPlay is engineered with a **freedom-first, zero-trust architecture**. While maximizing civil liberties, open dialogue, and creative expression, the platform must resist malicious infrastructure attacks, botnets, illegal material, data leakage, and service deplatforming.

### 1.1 Core Threat Matrix

| Threat Vector | Severity | Attack Mechanism | Mitigation Architecture |
| :--- | :--- | :--- | :--- |
| **Malicious Media Uploads** | Critical | Polyglot files (e.g. GIFAR), zip bombs, SVG XSS, malformed FFmpeg parser exploits | Magic byte validation, Sharp EXIF stripper, isolated non-root FFmpeg worker, ClamAV sandbox |
| **Telegram Bot Token Compromise** | Critical | Leakage of bot token leading to channel hijacking and asset wipeout | KMS token encryption, zero client exposure, proxy-only streaming, automated daily token rotation |
| **SSRF via Media / RSS Proxy** | High | Attacker triggers server-side fetching of internal AWS/Vercel metadata IP (`169.254.169.254`) | Strict IP egress filtering, private IP denylist (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) |
| **Row-Level Security (RLS) Leakage** | Critical | Direct Supabase REST queries bypassing application-level authorization | Default-deny RLS enabled on all 38 tables, verified with automated pgTAP regression suites |
| **Sybil Spam & Automated Flooding** | High | Scripted generation of millions of accounts and spam posts | Proof-of-work challenge, Redis sliding window rate limits, reputation scoring |
| **Private Chat / DM Eavesdropping** | High | Database compromise revealing direct messages | Signal Double-Ratchet client-side E2EE with zero server plaintext storage |

---

## 2. IDENTITY, AUTHENTICATION & ACCESS CONTROL (RBAC + ABAC)

### 2.1 Role Hierarchy

FreedomPlay enforces a 5-tier Role-Based and Attribute-Based Access Control model:

1. **Anonymous (`anon`)**:
   - Capabilities: View public videos, posts, stories, explore directories, view open community rules.
   - Restrictions: Cannot publish, comment, react, message, or access private channels.
2. **Authenticated Member (`authenticated`)**:
   - Capabilities: Publish posts/media, comment, cast votes, create stories, join communities, send DMs, create live events.
   - Restrictions: Subject to standard rate limits; cannot perform administrative or cross-user moderation actions.
3. **Verified Creator (`creator_verified`)**:
   - Capabilities: Elevated upload quotas (up to 4GB files), live stream broadcasting key generation, verified checkmark badge, podcast hosting.
   - Criteria: Cryptographic identity verification or community tenure.
4. **Community Moderator (`community_mod`)**:
   - Capabilities: Manage community posts, pin threads, issue temporary community mutes, view community report queue.
   - Restrictions: Permissions strictly scoped to specific `community_id`.
5. **Platform Safety & Legal Admin (`platform_admin`)**:
   - Capabilities: Action legal/DMCA takedowns, review platform-wide appeals, inspect tamper-evident audit logs, configure system flags.
   - Restrictions: Multi-Factor Authentication (FIDO2 / WebAuthn hardware keys) mandatory. All actions write unalterable records to `audit_logs`.

### 2.2 Session Security
- **JWT Lifespan**: Access tokens valid for 15 minutes; refresh tokens stored exclusively in `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
- **Session Revocation**: Real-time revocation check via PostgreSQL `profiles.session_revoked_at` timestamp.

---

## 3. COMPREHENSIVE ROW-LEVEL SECURITY (RLS) POLICY MATRIX

All 38 tables have `ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;` applied by default. The table below specifies the exact access rules enforced at the database kernel level:

| Table Name | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | Public for all active profiles | `auth.uid() = id` | `auth.uid() = id` | Admin only |
| `contents` | `visibility = 'public'` OR `author_id = auth.uid()` | `auth.uid() = author_id` | `auth.uid() = author_id` | `auth.uid() = author_id` OR Admin |
| `media_assets` | Referenced in viewable `contents` OR `creator_id = auth.uid()` | Worker service-role OR `creator_id = auth.uid()` | Owner only | Owner only OR Admin |
| `comments` | Associated content is viewable | Authenticated user (`auth.uid() = author_id`) | `auth.uid() = author_id` | Author OR Content Owner OR Admin |
| `reactions` | Public | Authenticated user | Author only | Author only |
| `follows` | Public | `auth.uid() = follower_id` | N/A | `auth.uid() = follower_id` |
| `communities` | Public | Authenticated user | Community Owner OR Mod | Community Owner only |
| `community_members` | Public | `auth.uid() = user_id` | Community Owner | `auth.uid() = user_id` OR Mod |
| `stories` | Follows author OR Author's profile is public | `auth.uid() = user_id` | Author only | Author only |
| `channels` | Public | Authenticated user | Channel Owner | Channel Owner |
| `channel_subscriptions`| `auth.uid() = user_id` OR Channel Owner | `auth.uid() = user_id` | N/A | `auth.uid() = user_id` |
| `events` | Public | Authenticated user | Event Creator | Event Creator |
| `event_attendees` | Public | `auth.uid() = user_id` | N/A | `auth.uid() = user_id` |
| `podcasts` | Public | Authenticated user | Show Owner | Show Owner |
| `podcast_episodes` | Public | Show Owner | Show Owner | Show Owner |
| `polls` | Public | Poll Creator | Creator (close only) | Poll Creator |
| `poll_options` | Public | Poll Creator | Poll Creator | Poll Creator |
| `poll_votes` | Public (aggregated) | Authenticated (1 vote per user) | Denied (Votes immutable) | Denied |
| `direct_messages` | Sender (`auth.uid() = sender_id`) OR Recipient (`auth.uid() = recipient_id`) | `auth.uid() = sender_id` | Denied | Sender only |
| `processing_jobs` | Service-role only OR User owns target content | Service-role only | Service-role only | Service-role only |
| `reports` | Reporting user OR Mod/Admin | Authenticated user | Mod/Admin only | Denied |
| `appeals` | Submitting user OR Admin | Authenticated user | Admin only | Denied |
| `audit_logs` | Platform Admin only | Service-role / DB trigger only | Denied (Append-only) | Denied (Append-only) |

---

## 4. FILE UPLOAD & PROCESSING SECURITY PIPELINE

Every uploaded file is treated as potentially hostile. Assets progress through a rigorous 5-step sanitization lifecycle before being served to users:

```text
[User Client] 
      │ (Chunked HTTPS Upload)
      ▼
[Next.js API Gateway: /api/upload]
      │ 1. Verify Authentication & Rate Limits
      │ 2. Magic-Byte Sniffing (Detect MIME spoofing)
      │ 3. Reject forbidden extensions (.exe, .bat, .php, .html, .svg with scripts)
      ▼
[Quarantine Storage Bucket / Local Staging]
      │ 4. Antivirus & Malicious Signature Scan (ClamAV)
      │ 5. Image Sanitization: Sharp metadata stripping (EXIF/GPS removal)
      ▼
[Background Worker: Isolated Docker Sandbox]
      │ 6. FFmpeg execution under non-root unprivileged UID (10001)
      │ 7. Memory cgroup limit: 2048MB; CPU quota: 2 cores; Execution timeout: 600s
      │ 8. Generate HLS Adaptive Bitrate Playlist (.m3u8 + .ts)
      ▼
[Telegram / S3 Storage Array & Public CDN Proxy]
```

### 4.1 SVG Security Policy
SVG uploads are notorious for stored XSS via embedded `<script>` or `onload` handlers.
- **Rule**: If SVG uploads are allowed, they MUST be parsed through `DOMPurify` on the server and served with `Content-Type: image/svg+xml; sandbox="allow-scripts=false"`. For user avatars and thumbnails, SVGs are converted directly to WebP via Sharp.

---

## 5. TELEGRAM STORAGE PROVIDER SECURITY & ISOLATION

Using Telegram channels as a cost-free media storage experiment requires strict protection to prevent channel exposure, API token compromise, and DMCA strikes on the bot.

### 5.1 Defense-in-Depth Measures
1. **Zero Client Exposure**:
   - The bot token (`TELEGRAM_BOT_TOKEN`) and storage channel ID (`TELEGRAM_STORAGE_CHANNEL_ID`) exist purely in server-side environment variables.
   - Client applications never connect to Telegram APIs directly.
2. **Encrypted Key Architecture**:
   - `storage_key` in `media_assets` uses an opaque UUID hash (e.g. `tg_f839a04...`) rather than exposing the Telegram Message ID directly in client-facing JSON.
3. **Signed Streaming URLs with HMAC Expiry**:
   - Video streaming routes (`/api/media/stream/[key]`) validate HMAC-SHA256 tokens with a 2-hour sliding window.
   - Direct hotlinking from third-party websites is prevented via `Sec-Fetch-Site` inspection and referrer validation.
4. **Channel Sharding & Multi-Bot Failover**:
   - Media storage is partitioned across multiple private storage channels and backup bots to prevent single-point-of-failure or channel rate limiting.

---

## 6. NETWORK HARDENING, RATE LIMITING & SECURITY HEADERS

### 6.1 Edge Rate Limiting Policies (Redis Token Bucket)

| Endpoint | Window | Max Requests | Exceeded Action |
| :--- | :--- | :--- | :--- |
| `/api/auth/*` | 1 minute | 10 requests | HTTP 429 + 15-minute IP cooldown |
| `/api/upload/*` | 1 hour | 25 uploads | HTTP 429 + CAPTCHA challenge |
| `/api/media/stream/*` | 1 minute | 300 chunks | HTTP 429 |
| Universal Feed Query | 1 minute | 120 queries | HTTP 429 |
| Post Creation / Reactions | 1 minute | 30 actions | HTTP 429 |

### 6.2 HTTP Security Headers
Every response from Next.js sets modern security headers:
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; media-src 'self' https: blob:; connect-src 'self' https: wss:; frame-ancestors 'none'; object-src 'none';`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 7. END-TO-END ENCRYPTION (E2EE) ROADMAP FOR DIRECT MESSAGING

To maintain true communication freedom, 1:1 direct messages and private group conversations use client-side cryptography:

1. **Protocol**: Signal Double-Ratchet Algorithm (Curve25519, AES-256-GCM, HMAC-SHA256).
2. **Key Exchange**:
   - Upon registration, client generates Identity Key (`IK`), Signed Prekey (`SPK`), and 100 One-Time Prekeys (`OPK`).
   - Public keys are stored on Supabase in `user_prekeys` table; private keys remain strictly in browser `IndexedDB` (non-extractable CryptoKey objects).
3. **Zero Plaintext Ingestion**:
   - Server only receives ciphertext, initialization vectors (`IV`), and public key fingerprints.
   - Search on direct messages is performed client-side using an indexed local cache.

---

## 8. LEGAL COMPLIANCE, SAFE HARBOR & TRANSPARENT MODERATION

To protect platform availability while upholding maximum speech freedom:

1. **Section 230 & DMCA Safe Harbor Compliance**:
   - Automated DMCA notice ingestion endpoint (`/legal/dmca`).
   - Counter-notice workflow with statutory 10-14 business day restoration window.
2. **Harm Prevention (CSAM & Terrorism)**:
   - Zero tolerance policy for illegal material.
   - Pre-commit perceptual hash scanning (pHash) against known hash databases.
3. **Cryptographic Moderation Transparency**:
   - Whenever an item is moderated, an entry is written to `audit_logs` containing: `moderator_id`, `target_id`, `reason_code`, `timestamp`, and `action_taken`.
   - Users can file a one-click appeal (`appeals` table), which triggers a blind secondary review by a different moderator.

---

## 9. PENETRATION TESTING & SECURITY VERIFICATION CHECKLIST

Before promoting any release to production:

- [x] All 38 tables verified with RLS enabled (`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false;` returns 0).
- [x] Static Application Security Testing (SAST) with `npm audit` and TypeScript zero-error strict mode.
- [x] SSRF test: Verify internal IPs (`127.0.0.1`, `169.254.169.254`, `localhost`) are unreachable via media proxies.
- [x] File upload test: Verify SVG scripts do not execute in browser context.
- [x] Path traversal test: Verify `../../` in storage keys is sanitized.
- [x] Rate limit test: Verify 429 status code on burst attacks.
- [x] Telegram token leak test: Verify `grep -r "TELEGRAM" .next/` returns no client bundle references.

---
*End of Master Security PRD — FreedomPlay Platform*