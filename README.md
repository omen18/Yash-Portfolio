# Yash Raj Sharan — Premium Portfolio v2

A world-class, fully animated developer portfolio.  
**Tech:** Vanilla HTML/CSS/JS · Three.js · Serverless API (Vercel) · Nodemailer

---

## Folder Structure

```
portfolio/
├── public/
│   ├── index.html        ← Full portfolio (self-contained)
│   └── resume.pdf        ← ADD YOUR RESUME HERE
├── api/
│   ├── contact.js        ← Serverless: contact form email
│   ├── repos.js          ← Serverless: GitHub repos proxy
│   └── resume.js         ← Serverless: resume download
├── server.js             ← Local dev server (not used on Vercel)
├── vercel.json           ← Vercel deployment config
├── package.json
├── .env.example          ← Copy to .env for local dev
├── .gitignore
└── README.md
```

---

## Option A — Open Locally (No Setup)

Just open `public/index.html` in a browser.  
The GitHub section fetches repos directly. The contact form shows a success
message (emails won't send without a backend, but FormSubmit.co can be used
as a no-code fallback — see bottom of this file).

---

## Option B — Run Locally with Backend

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Open .env and fill in EMAIL_USER and EMAIL_PASS

# 3. (Optional) Add your resume
cp /path/to/your-resume.pdf public/resume.pdf

# 4. Start dev server
node server.js
# → http://localhost:3001

# Or with auto-reload:
npx nodemon server.js
```

### Getting a Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Go to **App Passwords** → Select "Mail" → Generate
4. Paste the 16-character password into `.env` as `EMAIL_PASS`

---

## Option C — Deploy to Vercel ✅ (Recommended)

This is the cleanest deployment. The `api/` folder auto-becomes serverless
functions — no Express server needed on Vercel.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? *(your account)*
- Link to existing project? **N**
- Project name? **yashrajsharan-portfolio** (or anything)
- In which directory is your code? **.** (current dir)
- Want to override settings? **N**

### Step 3 — Add Environment Variables

Go to:  
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these one by one:

| Key | Value |
|-----|-------|
| `EMAIL_USER` | `yr6060602@gmail.com` |
| `EMAIL_PASS` | your Gmail App Password |
| `GITHUB_TOKEN` | (optional, increases rate limit) |

Then **redeploy**:
```bash
vercel --prod
```

### Step 4 — Add Your Resume (Optional)

Put `resume.pdf` in the `public/` folder, commit and push.
The `/api/resume` endpoint will serve it automatically.

---

## Troubleshooting

### Contact form not sending
- Make sure `EMAIL_USER` and `EMAIL_PASS` are set in Vercel env vars
- Make sure you used a **Gmail App Password**, not your login password
- Check Vercel → Project → Functions tab for error logs

### GitHub repos showing fallback
- The GitHub API has a rate limit of 60 req/hr without a token
- Add a `GITHUB_TOKEN` env var (no scopes needed) to increase to 5000/hr

### Vercel build error
- Make sure `vercel.json` is in the root
- Make sure `api/contact.js`, `api/repos.js`, `api/resume.js` exist
- Run `vercel logs` to see the exact error

### "Cannot find module nodemailer" on Vercel
- Make sure `package.json` lists `nodemailer` in `dependencies` (not devDependencies)
- Run `vercel --prod` after any `package.json` changes

---

## No-Code Contact Form Fallback (FormSubmit)

If you don't want to set up Nodemailer, replace the fetch URL in `index.html`:

```js
// Find this line in index.html:
const res = await fetch('/api/contact', { ... })

// Replace with:
const res = await fetch('https://formsubmit.co/ajax/yr6060602@gmail.com', { ... })
```

No backend needed — FormSubmit handles delivery for free.

---

## Custom Domain on Vercel

Vercel Dashboard → Project → Settings → Domains → Add your domain  
Then update your DNS as shown.

---

Built with ♥ by **Yash Raj Sharan**  
[GitHub](https://github.com/omen18) · [LinkedIn](https://linkedin.com/in/yashraj10)
