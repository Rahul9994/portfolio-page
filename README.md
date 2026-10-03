# Rahul Penugonda — Portfolio

**Live:** https://rahul9994.github.io/portfolio-page/

A cinematic, single-page portfolio: boot intro, animated aurora + constellation background, light/dark themes, featured projects, every GitHub repo, and a certificate gallery with a lightbox. Plain HTML/CSS/JS — no build step.

## Deploy to GitHub Pages

1. Create a repo named **`Rahul9994.github.io`** (serves at `https://rahul9994.github.io/`), or any name (serves at `https://rahul9994.github.io/<repo>/`).
2. Upload the **contents of this folder** (`index.html`, `assets/`, `.nojekyll`, this README) to the repo root.
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. Wait ~1 minute and open the URL.

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/Rahul9994/Rahul9994.github.io.git
git push -u origin main
```

## Editing content

Almost everything lives in **`assets/js/data.js`**:

| What | Key |
| --- | --- |
| Signature project rows | `featured` |
| Repo cards (titles, descriptions, categories, images) | `repos` |
| Certificates (title, issuer, date, category) | `certs` |
| Badges | `badges` |
| Skill cards and the scrolling marquee | `skills`, `marquee` |

- **New GitHub repos appear automatically.** On load, the site fetches `api.github.com/users/Rahul9994/repos` (cached for 1 hour) and adds any repo not already in `data.js`. Add an entry to `repos` to give it a custom title, description and image.
- **New certificate:** drop `name.webp` (full size) and `name_thumb.webp` (~720px wide) into `assets/img/certs/` and add `{ file: "name", ... }` to `certs`.
- About, Journey and Contact text is in `index.html`.

## Preview locally

```bash
python -m http.server 5500
```

Then open http://localhost:5500.

## Notes

- Keyboard: `T` toggles the theme, `Esc` skips the intro, arrow keys move through the certificate viewer.
- Respects `prefers-reduced-motion`; the intro runs in full once per browser session and in a short version on reloads.
- If you move the site to another URL, update the `og:image` and `og:url` meta tags in `index.html`.
