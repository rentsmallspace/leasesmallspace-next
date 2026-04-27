# Meta Ads Handoff: Context for working in leasesmallspace-next

**Owner:** Nate Perry (SAMG / LeaseSmallSpace.com)
**Doc purpose:** Drop this in front of a fresh Claude Code session so it has full context on the Meta ads automation project without you having to re-explain everything.
**Date written:** 2026-04-27

---

## TL;DR

You are looking at `leasesmallspace-next`, the Next.js website for LeaseSmallSpace.com (LSS). It is one of three repos that together implement an automated Meta (Facebook + Instagram) ads system for LSS. The other two repos are **`lss-ad-agency`** (TypeScript ad-ops monorepo, just shipped Phase 1) and **`meta-ads-components/mureo-main`** (a hardened fork of `logly/mureo`, the Python MCP server that talks to Meta's Marketing API).

Phase 1 of `lss-ad-agency` shipped at commit `5e24f42` tagged `phase-1-v1`. **Phase 2 is being scoped right now**: build a Supabase Edge Function CAPI handler. **`leasesmallspace-next` has a small but real role in Phase 2**: this site's inquiry pipeline must call the new Edge Function after writing each inquiry, so Meta gets a Lead event for each tenant who fills out the form.

---

## Repo map

```
c:/Users/Nate/OneDrive/Documents/GitHub/
  lss-ad-agency/              <- ad-ops infrastructure (TS monorepo). Phase 1 shipped.
    packages/lss-config       Env loader, locked safety defaults, Meta allowlist
    packages/lss-safety       8 SafetyDecision validators (paused-only, budget,
                              pixel lock, allowlist, HMAC approval, special ad
                              category, sample size, mutation orchestrator)
    packages/lss-audit        Append-only audit events, secret/PII redaction,
                              logger
    packages/lss-mureo-bridge MureoToolClient interface, Mock + Stdio scaffold,
                              SafeMureoClient wrapper that runs gates before
                              every mureo MCP call
    packages/lss-strategy     Phase 1 placeholder
    supabase/migrations/      0001_action_log.sql exists
    supabase/functions/       capi-handler (Phase 2 placeholder)
    project/specs/            2026-04-26-phase-1-safety-scaffold-brief.md
                              2026-04-27-phase-2-capi-handler-brief.md  <- read this
    docs/                     ARCHITECTURE.md, SAFETY_GATES.md, PLAYBOOK.md
    Repo:  https://github.com/na8thegre8/lss-ad-agency  (private)

  leasesmallspace-next/       <- THIS REPO. The live LSS website (Next.js).
                              Already has lib/leads.ts createInquiry, an admin
                              dashboard, lead-capture components, a test API
                              route at /api/test-inquiry. Will be modified in
                              Phase 2 to also POST to the CAPI handler.

  meta-ads-components/mureo-main/   <- Hardened fork of logly/mureo (Python MCP).
                              Used as upstream by lss-ad-agency. Dormant
                              unless we need local mureo patches.
                              Repo: https://github.com/na8thegre8/meta-ads-components

  samg-leasing.netlify.app    <- The legacy URL referenced in the old playbook;
                              actual code is here in leasesmallspace-next.
```

---

## Current state and blockers

**Phase 1 status:** shipped. 109 tests passing across 15 files in `lss-ad-agency`. Safety control system is in place. Codex reviewed and approved.

**Phase 2 status:** brief written and committed (`lss-ad-agency/project/specs/2026-04-27-phase-2-capi-handler-brief.md`). Build paused on three blockers:

1. **Pixel ID needed.** Owner is finding the existing LSS Pixel ID in Meta Events Manager. Format: 15-16 digit number. Will arrive as `LSS_META_PIXEL_ID`.
2. **Credential rotation in progress.** The previous Claude Code session saw the App Secret and a System User Token pasted into chat. Both must be rotated. See "Critical security note" below.
3. **Supabase project decision.** Default plan: create a new `lss-ad-ops` project for clean isolation from `SAMG Dashboard`. Alternative: cohabit with `SAMG Dashboard` (project ID `inhgrwzccytowxuffzua`). Owner to confirm.

---

## What Phase 2 changes IN THIS REPO (leasesmallspace-next)

The CAPI handler lives in `lss-ad-agency`. This repo's job is small: after every successful inquiry, POST the inquiry payload to the CAPI handler. That triggers the Meta CAPI Lead event.

Concretely:

### 1. Update `lib/leads.ts`

`createInquiry()` currently writes to Supabase. After Phase 2 it should:
1. Generate a stable `event_id` (UUID v4 is fine; will be reused by the browser-side Pixel)
2. Write the inquiry to Supabase as today (no schema change)
3. Call `postCapiLead(inquiry, event_id)` from the new `lib/capi-client.ts`
4. Log but do not block the user response on CAPI failures (the inquiry was captured; CAPI is best-effort)

### 2. Add `lib/capi-client.ts`

```ts
// Pseudo-shape; final structure agreed in the lss-ad-agency Phase 2 brief.
export async function postCapiLead(
  inquiry: InquiryPayload,
  event_id: string,
): Promise<void> {
  const url = process.env.LSS_CAPI_HANDLER_URL;
  if (!url) {
    console.warn("LSS_CAPI_HANDLER_URL not set; CAPI Lead skipped");
    return;
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...inquiry, event_id }),
  });
  // 2xx = ok, 4xx = malformed (log, do not retry), 5xx = bounded retry
  // Implementation detail: see Phase 2 brief in lss-ad-agency
}
```

### 3. Add `LSS_CAPI_HANDLER_URL` to `.env.example`

```
# Phase 2 deliverable. URL of the deployed Supabase Edge Function in lss-ad-agency.
# Format: https://<lss-ad-ops-project-ref>.supabase.co/functions/v1/capi-handler
LSS_CAPI_HANDLER_URL=
```

### 4. Browser-side Pixel snippet (separate small task)

For Meta's dedup to work, the Pixel needs to fire client-side too with the same `event_id`. The Pixel base code goes into `app/layout.tsx` (or equivalent) and a `Lead` event fires on the inquiry confirmation page. This is separate from CAPI (different commit, different review) but happens around the same time.

**Do NOT do these changes blindly.** The Phase 2 brief in `lss-ad-agency/project/specs/` is the contract. Read it first. The owner approves the brief before any code lands.

---

## Existing inquiry pipeline in this repo

Worth knowing before you touch `lib/leads.ts`:

- `lib/leads.ts` exposes `createInquiry()`. Used by inquiry forms, exit-intent modals, inactivity popups.
- `app/api/test-inquiry/route.ts` is a test endpoint that wraps `createInquiry`.
- `app/api/track-event/route.ts` already exists (analytics tracking; unrelated to CAPI but good to know).
- `app/admin/dashboard/lss-leads/` is the admin view of accumulated leads.
- The repo writes to a Supabase project. **Confirm which project before adding the CAPI call** so you know the existing data flow and don't accidentally double-write.

---

## Brand voice (applies to all generated copy and code comments)

Per the playbook (lives at `lss-ad-agency/docs/PLAYBOOK.md`):

- No em dashes ever
- No AI-fluff: avoid "excited," "thrilled," "leverage," "synergy," "robust," "unleash," "unlock"
- Direct, short sentences
- "Confident operator, not salesperson" tone
- Email greetings: "Hey [Name]," then straight to business
- Sign-offs: "Thanks," or just end

Brand colors:
- LeaseSmallSpace: charcoal/concrete tones, sharp edges, green accent `#29CC61`, Barlow Condensed headers, dark industrial aesthetic

---

## Critical security note

**A previous chat saw real credentials pasted in. Both must be rotated:**

1. **App Secret** at https://developers.facebook.com → app `LeaseSmallSpace Ads` → Settings > Basic > Reset App Secret
2. **System User Token** at https://business.facebook.com/settings → Business Settings > System Users > `LSS Bot` > Generate New Token

If owner has not confirmed rotation, do that first. Anthropic logs conversation transcripts. Treat anything in chat as semi-public until rotated.

**Where credentials live (never in chat, never in code, never in commits):**

- 1Password (canonical)
- `.env.local` in each repo (gitignored)
- `~/.mureo/credentials.json` (mureo, with PreToolUse credential-guard hook)
- Supabase project secrets (Edge Function deploy time, set via `supabase secrets set ...`)

**Already-known IDs that are NOT secrets** (fine in chat, fine in code):
- BUSINESS_PORTFOLIO_ID = `1442962034510259`
- AD_ACCOUNT_ID = `act_1255387966579422`
- PAGE_ID = `695075003686206`
- App ID (semi-public; appears in browser-side Pixel snippet)
- Pixel ID (once it exists; appears client-side)

---

## Process for any work in this repo (Phase 2 and beyond)

Same flow as Phase 1 in `lss-ad-agency`:

1. **Spec first.** Owner approves a written brief before code starts. If the work item is "modify createInquiry to call CAPI," the brief lives in `lss-ad-agency/project/specs/`. Do not start coding without it.
2. **Build with no commits.** Implementer writes code, runs tests, but does not `git init` (this repo is already a git repo) or `git commit` until owner says go.
3. **Tests first or alongside.** TDD where it fits. At minimum every code change ships with the relevant test.
4. **Lint, typecheck, test all green.** Same triad as `lss-ad-agency`.
5. **Codex review** (via the `CODEX_REVIEW_PROMPT.md` template in `lss-ad-agency/project/`).
6. **Owner approves push.** Tag if it's a milestone (e.g. `meta-ads-phase-2-leasesmallspace-next-side`).

---

## Conversation history (abbreviated, just decisions)

For full transcript, read the chat in the prior Claude Code session. The decisions that matter:

- **2026-04-26:** Started `lss-ad-agency` from scratch. Decided to fork mureo (kept at `meta-ads-components/mureo-main`) but use it via `pip install -e` editable, not vendored.
- **2026-04-26:** Built Phase 1 scaffold: 5 packages, 8 safety validators, audit + redaction, mock mureo client, append-only action log migration. Codex reviewed: 7 findings, all addressed (HMAC approval signing, required campaign counter, defends against missing approval, more wrapper tests, valid SQL, CAPI redaction keys, em dash cleanup). 109 tests passing.
- **2026-04-27:** Pushed `lss-ad-agency` to GitHub (`na8thegre8/lss-ad-agency`, private). Tagged `phase-1-v1`. Committed Phase 2 brief. Owner identified existing LSS Pixel; needs to find the ID. Owner pasted credentials in chat by mistake; rotation pending.

---

## Quick start for a fresh Claude Code session in this repo

```
Hey, I'm working on Phase 2 of the LSS Meta ads project. This repo
(leasesmallspace-next) needs to wire createInquiry() to call a new CAPI
handler that lives in ../lss-ad-agency. Read META_ADS_HANDOFF.md for
context. The Phase 2 brief is at
../lss-ad-agency/project/specs/2026-04-27-phase-2-capi-handler-brief.md.

Status check first: confirm Phase 2 brief is the latest version, confirm
this repo is on a clean branch, then ask me what step we're at.
```

---

## End of handoff
