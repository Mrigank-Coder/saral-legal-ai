# Saral — plain-language Indian law, cited

A prototype that explains legal situations and drafts documents (RTI applications,
legal notices), grounded only in a small sample corpus of statute sections, with
every claim cited back to an Act and Section.

## What changed from the original file

- **Security fix (important):** calling an AI provider's API directly from the
  browser can't work once deployed — browsers block that cross-origin call,
  and even if they didn't, shipping your API key in frontend JS means anyone
  can steal it from the browser's network tab and run up your bill. The app
  calls your own `/api/ai` serverless function, which holds the key
  server-side. See `api/ai.js`. It currently calls **Groq's** API
  (OpenAI-compatible), using `openai/gpt-oss-120b` for text and
  `qwen/qwen3.6-27b` for vision/OCR (see "Languages and scanned documents" below).
- The case file (your saved explanations/drafts) now persists in `localStorage`,
  so it survives a page refresh, with delete-one and clear-all controls.
- Added a short "How it works" strip, toast notifications, a search box in the
  Library tab, favicon/meta tags for link previews, an error boundary, keyboard
  focus states, and a scrollable tab bar on narrow screens.
- Errors from the AI call now surface the real reason instead of a generic message.
- **22 languages instead of 2:** the "Explain" tab can now translate its answer
  into English, Hindi, or any of the 20 other languages listed in the Eighth
  Schedule to the Constitution (Bengali, Telugu, Marathi, Tamil, Gujarati,
  Urdu, Kannada, Odia, Punjabi, Malayalam, Assamese, Maithili, Santali,
  Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo). Pick one from the
  dropdown next to the answer; it's translated and cached on demand, so
  switching back and forth doesn't re-call the AI. Translation quality will be
  strongest for the languages with the most training data behind them (Hindi,
  Bengali, Tamil, Telugu, Marathi, and similar) — treat the less-resourced
  scripts as a helpful draft, not a certified translation.
- **Scanned documents:** "Explain" now has an "Upload a photo or scan" button
  that accepts a JPG/PNG photo or a PDF. It's transcribed by a vision model
  and dropped into the text box for you to skim and correct before submitting
  — OCR on messy phone photos or old scans isn't perfect, so this review step
  matters. PDFs are read up to 5 pages per upload (the vision model's limit
  per request); longer documents are truncated with a note telling you so.

## Languages and scanned documents — how they work

[#languages-and-scanned-documents--how-they-work](#languages-and-scanned-documents--how-they-work)

- **Translation** (`TRANSLATE_SYSTEM`/`translateSystemFor` in `src/App.jsx`)
  sends the already-generated English explanation to `openai/gpt-oss-120b`
  with instructions to translate it into the selected language, preserving
  Act/Section citations untranslated. Each language is only translated once
  per answer and then cached in that answer's `translations` object.
- **Scanned-document OCR** (`OCR_SYSTEM`, `fileToOcrImages` in `src/App.jsx`)
  converts the uploaded file into one or more base64 JPEGs in the browser
  (images are downscaled; PDF pages are rendered client-side with
  `pdfjs-dist`), then sends them to `/api/ai` with an `images` field. The
  backend detects that field and routes the request to `qwen/qwen3.6-27b`,
  Groq's current multimodal model, instead of the text-only model — see
  `api/ai.js`.
- Both features reuse the existing `/api/ai` proxy and `GROQ_API_KEY`, so no
  new environment variables or accounts are needed beyond what step 1 already
  sets up.
- Groq's model lineup changes fairly often — `qwen/qwen3.6-27b` is currently
  a preview model, meaning Groq could swap or deprecate it with limited
  notice. If OCR uploads start failing, check
  <https://console.groq.com/docs/deprecations> for a replacement vision model
  and update `VISION_MODEL` in `api/ai.js`.


## Run it locally

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install
npm run dev
```

This starts the frontend at `http://localhost:5173`. The AI features won't work
yet — you still need the serverless function running, which is easiest via the
Vercel CLI (next section covers the same tool you'll use to deploy).

## Deploy it — step by step (Vercel, free tier)

Vercel is the simplest path because this project already includes a serverless
function (`api/ai.js`) in the format Vercel expects. Netlify or Cloudflare
Pages work too, but the API route folder structure differs slightly.

### 1. Get a Groq API key
1. Go to https://console.groq.com and sign in / sign up.
2. Under **API Keys**, create a new key and copy it somewhere safe. You won't be
   able to see it again.
3. Groq has a free tier with generous rate limits — good for a hackathon demo.
   Check https://console.groq.com/settings/limits if you want to see your caps.

### 2. Put this code in a GitHub repository
1. Create a new empty repository on https://github.com/new.
2. From inside this project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### 3. Import the project into Vercel
1. Go to https://vercel.com and sign up/log in (GitHub login is easiest).
2. Click **Add New → Project**, then select the GitHub repo you just pushed.
3. Vercel auto-detects Vite. Leave the build command (`vite build`) and output
   directory (`dist`) as suggested.
4. Before clicking Deploy, open **Environment Variables** and add:
   - Key: `GROQ_API_KEY`
   - Value: the key you copied in step 1
5. Click **Deploy**. After ~1 minute you'll get a live URL like
   `https://saral-legal-ai.vercel.app`.

### 4. Test it
Open the live URL, try the "Explain" tab with one of the example prompts. If you
get an error, check **Vercel dashboard → your project → Deployments → the latest
deployment → Functions → api/ai** for server logs — that will show whether
the key is missing or the Groq request failed.

### 5. (Optional) Custom domain
In the Vercel project, go to **Settings → Domains**, add your domain, and follow
the DNS instructions it gives you (usually one CNAME or A record at your
registrar). HTTPS is issued automatically.

### 6. Local development with the real API
To test the AI features locally before pushing:
```bash
npm install -g vercel
vercel login
vercel link              # connect this folder to your Vercel project
vercel env pull .env     # pulls GROQ_API_KEY into a local .env file
vercel dev               # runs both the frontend and /api functions together
```

## Before you rely on this for anything real

The legal corpus in `src/App.jsx` (`CORPUS` constant) is **paraphrased sample
text for prototyping**, not verified statute text. Two things to do before this
is trustworthy:

1. Replace every entry with verbatim text pulled from an authoritative source
   (e.g. https://www.indiacode.nic.in), not a paraphrase.
2. Add a real disclaimer/ToS page and consider whether you need legal review
   given you're operating in a regulated space (unauthorized practice of law
   rules vary, but "AI legal advice" products are under increasing scrutiny in
   India and elsewhere).

## Basic cost/abuse guardrails worth adding next

The current `api/ai.js` has no rate limiting, so a bot could hammer your
endpoint and burn through your Groq quota. Cheapest fixes, roughly in order of
effort:
- Check your usage/limits in the Groq console (Settings → Limits).
- Add Vercel's built-in Web Application Firewall rate limiting (Project →
  Firewall) — a few clicks, no code.
- For a code-level fix, add an IP-based counter using Vercel KV or Upstash
  Redis and reject requests past N/hour.
