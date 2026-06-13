# Your corpus — drop PDFs here

This folder is the knowledge base the chatbot answers from. Put **all the PDFs
about yourself here**, for example:

- `resume.pdf` — your résumé
- `transcript.pdf`, `certifications.pdf`
- project write-ups, a bio, case studies, talk notes…

Supported file types: **`.pdf`, `.md`, `.txt`**.

After adding or changing files, re-index:

```bash
cd backend
python -m app.ingest            # ingest everything in this folder
python -m app.ingest resume.pdf # or just one file
```

> **Résumé download button.** The site's "Download Résumé (PDF)" button serves
> `public/resume.pdf` (separate from this folder). Keep both in sync:
>
> ```bash
> cp backend/documents/resume.pdf public/resume.pdf
> ```

Files here are git-ignored by default (see `backend/.gitignore`) so your personal
documents don't get committed. Remove that ignore line if you *want* them in the repo.
