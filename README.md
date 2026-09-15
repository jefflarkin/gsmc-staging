# GSMC Advancement Page (static mockup)

A working static replica of the [easttnscouts.org Advancement page](https://easttnscouts.org/advancement/), built from the *actual* theme assets of the live site (GSMC WordPress theme, Foundation 6.3.1).

**The workflow: write content in Markdown (`advancement/index.md`), build it into the page (`index.html`).** The site chrome — header, two-row navigation, BE A SCOUT button, footer, search overlay — lives in `_template.html` and needs no maintenance.

## File map

```
advancement/
├── index.md        ← YOUR CONTENT (Markdown) — the file you edit
├── _template.html  ← site chrome + page skeleton (build preserves everything
│                     outside the BUILD:CONTENT … markers)
├── index.html      ← GENERATED — the page that gets hosted (do not hand-edit
│                     the content region; edit index.md and rebuild)
├── build.mjs       ← the build (index.md + _template.html → index.html)
├── package.json    ← npm run build / npm run watch
├── assets/         ← theme CSS/JS/images/fonts pulled from the live site
└── images/         ← your page's content images
src/_research/      ← unmodified capture of the live page (reference only)
```

## Writing the page

1. **Set up once:**

   ```bash
   cd advancement
   npm install        # installs `marked`, the Markdown renderer
   ```

2. **Edit `index.md`** — standard Markdown:

   | Write in index.md            | Becomes on the page                    |
   | ---------------------------- | -------------------------------------- |
   | `# Title`                    | the large centered page title (H1)     |
   | `## Section`                 | Quantico uppercase section heading (H2)|
   | `### Subsection`             | Teko uppercase heading (H3)            |
   | `#### Item`                  | smaller section heading (H4)           |
   | `Text with a [link](https://…)` | the site's standard underlined link  |
   | `\| Name \| Position \| … \|`| the styled contact/policy tables       |
   | `- item` / `1. item`         | bulleted / numbered lists              |
   | `![Alt text](images/foo.png)`| centered-friendly image block          |

   Everything else (paragraphs, emphasis, etc.) is plain Markdown.

3. **Build:**

   ```bash
   npm run build      # one shot
   # or, while editing:
   npm run watch      # rebuilds automatically on every save
   ```

4. **Preview:** open `advancement/index.html` in a browser, or
   `python3 -m http.server 8088` in `advancement/` and visit
   `http://localhost:8088/`.

### Conventions

- **Pending links** use `href="#todo-…"` (e.g. `[Learn More](#todo-religious-awards)`).
  They render as ordinary links but don't navigate — so the mockup looks
  complete while you collect the real URLs. Find every one with:
  `grep -n "#todo-" index.md` — then just swap in the real URL.
- **Photo column** in the contacts table is empty — drop image references in
  the cell (e.g. `![](images/les.png)`) when you have the files.
- **Title** — change `<title>` / `og:title` in `_template.html` (the Markdown
  `# heading` is the big display heading in the content area).
- **Raw HTML escape hatch** — if you ever need something Markdown can't
  express, paste it into `_template.html` *outside* the `BUILD:CONTENT`
  markers; the build preserves everything outside them.

## Behavior notes

- The header is part of the design's "hanging" chevron band; the page title is
  automatically pushed below it (`.wpb_wrapper > h1:first-child` rule in the
  template's head `<style>` block).
- Short pages fill the viewport so the footer sits at the bottom
  (`.wrapper { display:flex; … min-height:100vh }` in the same `<style>`
  block); long content pages flow normally.
- Mobile menu and the full-screen search overlay work out of the box.
- Google Fonts (Quantico, Roboto Condensed, Roboto, Teko) load from the live
  CDN — the page needs internet for the exact typefaces (fallbacks render without).
- Header/footer links point at the live easttnscouts.org pages, as they do in
  the mockup of the real site; adjust in `_template.html` if they should
  point elsewhere.

## Hosting on GitHub Pages

1. Create an empty repo (e.g. `gsmc-pages`), then

   ```bash
   git remote add origin git@github.com:<you>/gsmc-pages.git
   git push -u origin main
   ```

2. Repo → **Settings → Pages → Build and deployment** → deploy from branch
   `main`, folder **`/advancement`** → Save.
3. Wait ~1 minute and open `https://<you>.github.io/gsmc-pages/`.

Because the site's assets are relative, hosting from the `advancement/`
folder works as-is.
