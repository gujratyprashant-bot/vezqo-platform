# VEZQO Platform

Fresh rebuild using Next.js App Router and TypeScript. No legacy application runtime is included.

## Local development

1. Install Node.js 20.9+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` after services are configured.
4. Run `npm run dev`.

## Cloudflare Workers

This project uses the OpenNext Cloudflare adapter.

- Build: `npx opennextjs-cloudflare build`
- Deploy: `npx opennextjs-cloudflare deploy`
- Local Workers preview: `npm run preview`

## Planned integrations

- A new Supabase project for authentication and database
- Server-side Cashfree integration

Never commit production credentials. Configure secrets in Cloudflare Workers secrets/environment variables.
