# Technical Decisions

## 2026-04-23 — Auth: Clerk over NextAuth

**Context:** Authentication needed for users to manage their invoices.

**Decision:** Using Clerk instead of NextAuth.

**Reasoning:**

- Faster setup, less boilerplate
- Hosted UI reduces time spent on auth UI
- I've been burned by writing auth from scratch before and lose motivation
- Industry-standard for modern SaaS
- Free tier more than enough for portfolio project

**Trade-offs:** Vendor lock-in; if Clerk pricing changes, migration needed.

## 2026-04-23 — Database: Neon over Supabase

**Context:** Need Postgres hosting.

**Decision:** Neon.

**Reasoning:**

- Pure Postgres, better Drizzle integration
- Branching feature useful for development
- Since auth is handled by Clerk, don't need Supabase's bundle
