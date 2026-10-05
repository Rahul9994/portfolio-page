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

## Performance notes (keep these when editing)

The site is tuned to stay smooth on phones. The rules that make that work:

- **Animate only `transform` / `opacity`** (or the individual `translate`, `scale`, `rotate` properties). These run on the GPU compositor. Animating `width`, `top`, `clip-path`, `filter`, `background-position` etc. repaints on the main thread and causes jank.
- **Scroll effects are CSS scroll-driven animations** (`animation-timeline`), not scroll listeners: the title sequence (`.mg.sda`), hero parallax, progress bar and journey lines. JS fallbacks exist for browsers without support.
- **The hero orbit is pure CSS** (`.orb` keyframes). JS only swaps the skill text while a card is behind the photo.
- **Phones get "lite" mode** (`data-perf="lite"`, decided in `<head>`): no live `backdrop-filter`, a background that is painted once and drifted with CSS, no Lenis (native scrolling). Add `?perf=full` or `?perf=lite` to the URL to force a mode when testing.
- **Fonts are self-hosted** in `assets/fonts/` (variable WOFF2, subset to the characters the site uses). If you add text with new symbols, re-subset with `pyftsubset`, or the symbol falls back to a system font.
- **Repo cards are built lazily** (only visible ones exist in the DOM) and the GitHub sync is deferred until the section is near.

## Notes

- Keyboard: `T` toggles the theme, `Esc` skips the intro, arrow keys move through the certificate viewer.
- Respects `prefers-reduced-motion`; the intro runs in full once per browser session and in a short version on reloads.
- If you move the site to another URL, update the `og:image` and `og:url` meta tags in `index.html`.
