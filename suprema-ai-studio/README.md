# Suprema AI Studio — Version 2 starter

A small, mobile-friendly AI marketing microapp for Suprema Digital. It generates hooks, captions, hashtags, a call to action and a simple content idea. The API key stays on the server.

## Stack (free to start)
- Static front end: HTML, CSS and JavaScript
- Hosting + server-side endpoint: Cloudflare Pages Functions
- AI: Gemini API, using the `gemini-2.5-flash` model
- No database required for the first version

Free tiers, quotas, model availability and terms can change. Review the provider dashboards before publishing commercially. Gemini's free-tier terms may permit submitted content to be used to improve products, so don't send private client data or confidential information.

## Files
- `index.html` — user interface
- `functions/api/generate.js` — server-side AI endpoint at `/api/generate`

## Deploy for free (beginner route)
1. Create or sign in to a Cloudflare account.
2. Create a GitHub account if you do not have one.
3. Create a new GitHub repository named `suprema-ai-studio`.
4. Upload `index.html` to the repository root.
5. Upload `functions/api/generate.js` to the exact folder path `functions/api/generate.js`.
6. In Cloudflare Dashboard, open **Workers & Pages** → **Create** → **Pages** → **Connect to Git**. Choose the repository.
7. For a plain static HTML project, use no framework preset. Set the build command to blank / none and the output directory to `.` (the repository root), if the dashboard asks.
8. Create a Gemini API key in Google AI Studio: https://aistudio.google.com/app/apikey
9. In your Cloudflare Pages project, open **Settings** → **Variables and Secrets** (wording may vary). Add a secret named `GEMINI_API_KEY` and paste the key as its value. Never paste the key into `index.html`, GitHub, screenshots or chat.
10. Redeploy the project after adding the secret. Open the published site, fill the form and generate a test.
11. If generation fails, check Cloudflare function logs, the Gemini API key, model access and quota. Do not share your API key when asking for help.

## Local preview
Opening `index.html` directly lets you view the layout, but AI generation will not work because `/api/generate` must run as a server-side function. Deploy it to Cloudflare Pages to test the full flow. A local static server alone does not run Cloudflare Pages Functions.

## Before sharing publicly
- Replace the WhatsApp number in `index.html` if the business number changes. The current link is set to `256748505723`.
- Add a privacy notice and contact details.
- Add rate limiting / abuse protection before significant public use. The starter has no per-user usage quota or login.
- Do not put confidential client data into prompts.
- Test from a phone and desktop, and confirm that the deployed `/api/generate` endpoint works.
- The first version does not save history, manage subscriptions, authenticate users, or accept payments. Add those only after validating demand.
- Do not advertise unlimited free generation: the AI provider has quotas and can change free-tier terms.

## Suggested business model
Keep a small free demo for prospects. Offer done-for-you content packs and monthly social media management through Suprema Digital. Later, consider a paid tier only after adding sign-in, server-side usage limits, payment handling suitable for Uganda, and clear refund/privacy terms.
