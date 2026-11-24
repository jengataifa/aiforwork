# JENGA TAIFA AI PROGRAM

Operational digital learning, cooperative coordination, membership, and partner investment platform for **JENGA TAIFA COMMUNITY BASED ORGANIZATION UGANDA LIMITED**.

---

## Deploying Free on GitHub Pages

This project is pre-configured for zero-cost static hosting on **GitHub Pages** using relative Vite asset resolution (`base: './'`), SPA `404.html` + `.nojekyll` generation, hash routing (`#/...`), and an automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

### 1. Push Code to GitHub

Run these commands inside your project folder (replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPO_NAME>` with your GitHub repository):

```bash
git init
git add .
git commit -m "Initial production release of JENGA TAIFA AI PROGRAM"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

### 2. Enable GitHub Pages (Free Live URL)

1. Open your repository on GitHub.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment -> Source**, select **GitHub Actions**.
4. Wait ~1–2 minutes for the **Deploy to GitHub Pages** workflow under the **Actions** tab to finish.
5. Your live website will be published at:

   `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>/`

### 3. Authorize Your Live Domain for Google Sign-In

So participants, coordinators, and administrators can sign in with Google on your live GitHub Pages URL:

1. Open the Google Cloud / Firebase Console for project **`gen-lang-client-0244065471`**.
2. Go to **Authentication -> Settings -> Authorized domains**.
3. Click **Add domain** and enter `<YOUR_GITHUB_USERNAME>.github.io` (and your custom domain such as `jengataifa.org` if linked).

---

## Local Development

```bash
npm install
npm run dev
```

Build and type-check locally before pushing:

```bash
npm run lint
npm run build
```
