# Family Health Vault 🏥
AI-powered hereditary health intelligence — Vercel + Gemini (FREE)

---

## Get Your FREE Gemini API Key (2 minutes)

1. Go to https://aistudio.google.com
2. Sign in with Google → click **Get API Key** → **Create API Key**
3. Copy the key (starts with `AIza...`)
4. No credit card needed — free tier is generous

---

## Deploy to Vercel (5 minutes)

### Option A — Upload ZIP (easiest)
1. Go to https://vercel.com → sign up free
2. Click **Add New → Project → Upload**
3. Upload this ZIP file
4. In **Environment Variables** add:
   - Name:  `GEMINI_API_KEY`
   - Value: `AIza...your-key-here`
5. Click **Deploy**
6. Your app is live at `https://your-project.vercel.app` ✅

### Option B — Via GitHub
1. Extract this ZIP and push to a GitHub repo
2. Import repo in Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy

---

## Run Locally

```bash
# Install Vercel CLI
npm install -g vercel

# Enter project folder
cd fhv-vercel

# Create .env.local with your key
echo "GEMINI_API_KEY=AIza...your-key" > .env.local

# Run dev server
vercel dev
```
Open http://localhost:3000

---

## Project Structure

```
fhv-vercel/
├── api/
│   └── analyse.js     ← Serverless proxy (Gemini, keeps key safe)
├── public/
│   └── index.html     ← Full app (all features)
├── vercel.json        ← Routing config
└── README.md
```

---

## Features
- 📤 Upload PDF or image — AI reads visually (OCR via Gemini Vision)
- 🌳 4-generation family tree with condition severity autocomplete
- 📊 Trend charts across multiple reports
- 🔍 Side-by-side report comparison with delta %
- ⚠️ Hereditary risk % scores per condition
- 🤖 AI health summary + recommendations
- 🔗 Doctor share card (copy/print)
- 🖨️ Export PDF via browser print

## Why Gemini?
- 100% FREE tier at Google AI Studio
- Gemini 1.5 Flash supports vision (reads scanned PDFs)
- No credit card required
