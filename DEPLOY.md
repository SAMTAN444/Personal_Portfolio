# Deployment

Frontend → **S3 + AWS CloudFront** (static). Backend → **Render** (Docker). Domain
**samueltan.dev** is registered at **Cloudflare** (DNS lives there):
- `samueltan.dev` + `www.samueltan.dev` → the frontend (CloudFront)
- `api.samueltan.dev` → the backend (Render)

> ⚠️ **CloudFront (AWS CDN) ≠ Cloudflare (your registrar/DNS).** Two different
> companies. Your site is served by AWS CloudFront; the DNS records that point at
> it live in the Cloudflare dashboard.

**Order matters** because the pieces reference each other's URLs:
1. Deploy the **backend** to Render, then attach `api.samueltan.dev` to it.
2. Build + deploy the **frontend** with `VITE_API_BASE_URL=https://api.samueltan.dev`
   baked in, then attach `samueltan.dev` to CloudFront.
3. Set the backend's `CORS_ORIGINS` to `https://samueltan.dev`.

The full domain wiring (ACM cert, CloudFront aliases, Cloudflare DNS, Render custom
domain) is in the **Custom domain** section at the bottom — do it as you reach each
piece.

---

## 0. Prep & push the repo

The backend image ships a **prebuilt index** (`backend/rag_index.pkl`). Rebuild it
from your current `backend/documents/`, then commit everything.

```bash
cd backend && source .venv/bin/activate
python -m app.ingest                 # regenerates rag_index.pkl from documents/
cd ..

git add -A && git commit -m "Portfolio + RAG backend"
# create a repo and push (GitHub CLI shown; or use the website)
gh repo create samuel-portfolio --private --source=. --push
```

> **Repo privacy.** `backend/documents/` (your PDFs) is git-ignored and never
> committed. But `rag_index.pkl` contains the **text** of those documents (résumé,
> transcript, letter) so the API can run. That text is already public via the
> chatbot, but if you'd rather it not sit in git, keep the repo **private**
> (Render deploys fine from a private repo).

---

## 1. Backend → Render

1. **render.com** → New → **Blueprint** → connect your repo. It reads `render.yaml`
   and creates the `samuel-portfolio-rag` Docker service from `backend/`.
   *(Or: New → Web Service → Docker → Root Directory `backend`.)*
2. Set environment variables (Dashboard → the service → Environment):
   - `ANTHROPIC_API_KEY` = your key (secret)
   - `ANTHROPIC_MODEL` = `claude-haiku-4-5` (already in the blueprint)
   - `CORS_ORIGINS` = leave blank for now; you'll set it in step 3
3. Deploy. First build is slow (it pre-downloads the embedding model). When live,
   note the URL, e.g. `https://samuel-portfolio-rag.onrender.com`.
4. Test it:
   ```bash
   curl https://<your-render-url>/health        # {"status":"ok","indexed":true,...}
   ```

> **Free-tier cold starts.** Render's free web services sleep after ~15 min idle;
> the first request then takes ~30–60 s (model + index load). Fine for a portfolio.
> To avoid it, use a paid instance or a cron pinger on `/health`.

---

## 2. Frontend → S3 + CloudFront

You need AWS credentials with **S3 + CloudFront** permissions (your `bedrock-local`
IAM user likely doesn't — use an admin profile or add the permissions). 

### Build with the backend URL baked in
```bash
# from the project root — the VITE_ var overrides .env at build time.
# Use the api subdomain (set up in the Custom domain section); until DNS is live
# you can substitute your https://<your-render-url> and rebuild later.
VITE_API_BASE_URL=https://api.samueltan.dev npm run build   # → dist/
```

### Create the bucket and upload
```bash
BUCKET=samuel-portfolio-site            # must be globally unique
aws s3 mb "s3://$BUCKET"
aws s3 sync dist/ "s3://$BUCKET" --delete
```
Keep the bucket **private**; CloudFront will read it via Origin Access Control.

### Create the CloudFront distribution (Console is easiest)
AWS Console → CloudFront → **Create distribution**:
- **Origin**: the S3 bucket; **Origin access** → *Origin access control (OAC)* →
  create one, then click **Copy policy** and paste it into the bucket policy when
  prompted.
- **Default root object**: `index.html`
- **Viewer protocol policy**: Redirect HTTP → HTTPS
- **Custom error responses** (this is the SPA fallback — add both):
  | HTTP error code | Response page path | HTTP Response code |
  |---|---|---|
  | 403 | `/index.html` | 200 |
  | 404 | `/index.html` | 200 |
- Create. Note the domain, e.g. `https://d1234abcd.cloudfront.net`.

### Re-deploys later
```bash
VITE_API_BASE_URL=https://api.samueltan.dev npm run build
aws s3 sync dist/ "s3://$BUCKET" --delete
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
```

---

## 3. Wire CORS

On Render → the service → Environment, set:
```
CORS_ORIGINS = https://samueltan.dev,https://www.samueltan.dev
```
Save (Render restarts). Now the deployed site can call the API. Open
**https://samueltan.dev**, go to **Chat**, and ask something — you should get a
grounded answer with the live pipeline panel.

> Before DNS is live you can test against the default URLs: set `CORS_ORIGINS` to
> your `https://<dist>.cloudfront.net` and build the frontend with the
> `*.onrender.com` URL, then switch both to the custom domains once they resolve.

---

## Updating the corpus later

Whenever you add/change a document in `backend/documents/`:
```bash
cd backend && source .venv/bin/activate && python -m app.ingest && cd ..
git commit -am "Update corpus" && git push        # Render auto-redeploys
```
The résumé/letter on the site are separate static files — keep them synced:
```bash
cp backend/documents/RAGResume.pdf public/resume.pdf
cp "backend/documents/Letter of Recommendation.pdf" public/recommendation-letter.pdf
# then rebuild + re-sync the frontend (step 2)
```

---

## Cost & guards (already in place)

- **Embeddings + vector store: $0** (local). Only Claude answer tokens cost money —
  Haiku 4.5 ≈ $0.003/question.
- The `/chat` endpoint is protected by **per-IP rate limits** (12/min, 300/day) and
  a 500-char query cap (`RATE_LIMIT_PER_MINUTE` / `RATE_LIMIT_PER_DAY` /
  `MAX_QUERY_CHARS` env vars), so a public endpoint can't run up your bill.

## Custom domain — samueltan.dev (Cloudflare DNS)

DNS records live in the **Cloudflare** dashboard. Set every record below to
**DNS only (grey cloud)**, not proxied — AWS CloudFront and Render each terminate
their own HTTPS, and Cloudflare's proxy in front of them causes redirect/SSL loops.

### Frontend → samueltan.dev + www (CloudFront)
1. **ACM certificate** (AWS Certificate Manager, region **us-east-1** — CloudFront
   only reads certs there): request a public cert for `samueltan.dev` **and**
   `www.samueltan.dev`. Choose **DNS validation** — ACM gives you CNAME records;
   add them in Cloudflare (DNS only). Wait until the cert shows **Issued**.
2. **CloudFront distribution** → Settings → Edit:
   - **Alternate domain names (CNAMEs)**: add `samueltan.dev` and `www.samueltan.dev`
   - **Custom SSL certificate**: select the ACM cert from step 1
3. **Cloudflare DNS** (add both, DNS only):
   | Type | Name | Target |
   |---|---|---|
   | CNAME | `samueltan.dev` (apex — Cloudflare flattens it) | `d<dist>.cloudfront.net` |
   | CNAME | `www` | `d<dist>.cloudfront.net` |

### Backend → api.samueltan.dev (Render)
1. Render → your service → **Settings → Custom Domains** → add `api.samueltan.dev`.
   Render shows a target host (e.g. `samuel-portfolio-rag.onrender.com`) and issues
   a TLS cert automatically once DNS resolves.
2. **Cloudflare DNS** (DNS only):
   | Type | Name | Target |
   |---|---|---|
   | CNAME | `api` | `samuel-portfolio-rag.onrender.com` (the target Render shows) |

### Final wiring
- Build the frontend with `VITE_API_BASE_URL=https://api.samueltan.dev` (already the
  default in the build commands above), re-sync to S3, invalidate CloudFront.
- Set `CORS_ORIGINS=https://samueltan.dev,https://www.samueltan.dev` on Render.
- Visit **https://samueltan.dev** — your brand mark (`SAMUELTAN.DEV`) now matches the
  address bar.
