# V5 local email/API fix

Normal local development (`npm run dev`) does not load the Cloudflare runtime.
The API endpoints now use Astro `getSecret()` instead of importing `cloudflare:workers`.

## Local Resend key
1. Copy `.env.example` to `.env`.
2. Put your real Resend API key in `.env`:
   `RESEND_API_KEY=re_...`
3. Stop and restart `npm run dev` after creating or changing `.env`.

`.dev.vars` is for Cloudflare/Miniflare development and is not used by the normal V4/V5 local dev command.

## Production
Set the production Worker secret with:
`npx wrangler secret put RESEND_API_KEY`
