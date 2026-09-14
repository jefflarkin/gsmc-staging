# GSMC New-Page Template (static mockup)

A working static replica of the [easttnscouts.org Advancement page](https://easttnscouts.org/advancement/) designed as an edit-in-place template: swap out the page content, keep the look and structure intact.

## Why it looks the real deal

The mockup is built from the *actual* theme assets pulled from the live site (GSMC WordPress theme, Foundation 6.3.1, WPBakery-style content markup) and uses the same HTML structure/classes as the original pages:

- `assets/css/style.css` — the site's own theme stylesheet (header nav, footer, colors `#3e4527` / `#ffc000`, typography)
- `assets/css/foundation.css` + `motion-ui.css` — Foundation grid & components
- `assets/css/js_composer_front_custom.css` — the page-builder layout rules the site loads
- `assets/css/font-awesome.css`, `full-screen-search.css` — icons & search overlay
- `assets/img/*` (43 files) — logo, nav buttons, footer backgrounds, social icons
- `assets/js/*` — jQuery, Foundation, theme script (mobile accordion menu), search overlay
- Google Fonts (Quantico, Roboto Condensed, Roboto, Teko) are still loaded from the live font CDN — needs internet for the correct typefaces; the page still renders with fallback fonts offline

## File map

```
index.html        ← the template (open this in a browser)
images/           ← your page's content images (sample: advancement-300x200.jpg)
assets/css/       ← site stylesheets (do not edit)
assets/img/       ← theme images (do not edit)
assets/fonts/     ← Font Awesome fonts
assets/js/        ← site scripts (do not edit)
src/_research/    ← original captured page HTML for reference
```

## How to create a new page

1. **Copy** `index.html` to a new file (e.g. `my-new-page.html`) so the sample stays intact.
2. **Title** — change `<title>`, `og:title`, and your own page heading text.
3. **Content** — add your new page content inside the empty `.wpb_wrapper`
   between the markers in the file:

   ```html
   <!-- ==== CONTENT START — add new page content below this line ==== -->
   ...
   <!-- ==== CONTENT END   — new page content above this line ==== -->
   ```

   Everything outside that region (header, two-row navigation with dropdowns,
   BE A SCOUT button, footer, search overlay) is the site's fixed chrome.

   A fully worked example of this page type (with the original content) is in
   `src/_research/page.html`.

### Content building blocks (copy any of these)

Copy, repeat as needed — each block is one `vc_column` inside the content `vc_row`.

Page heading (the H1 above the content). This is the pattern used by the
actual site's pages (e.g. `/scouts/`, `/parents/advancement/`): a spacer that
pushes the heading below the hanging header chevron band, then a centered
`<h1>`. Use this as the first block on the page (it is already in `index.html`).

```html
<div class="vc_row wpb_row vc_row-fluid">
  <div class="wpb_column vc_column_container vc_col-sm-12">
    <div class="vc_column-inner">
      <div class="wpb_wrapper">
        <div class="vc_empty_space" style="height: 160px"><span class="vc_empty_space_inner"></span></div>
        <h1 style="text-align: center;">Page Title</h1>
      </div>
    </div>
  </div>
</div>
```

Without the `vc_empty_space` spacer the H1 rides up under the absolutely
positioned header and gets clipped — that's the "heading hidden behind the
header" problem.

Full-width text block (the most common building unit):

```html
<div class="vc_column vc_column_container vc_col-sm-12">
  <div class="vc_column-inner">
    <div class="wpb_wrapper">
      <p>Your paragraph text, with <a href="https://example.org">links</a>.</p>
      <ul><li>Bulleted items…</li></ul>
      <ol><li>Numbered items…</li></ol>
      <p style="text-align: center;"><strong>Centered lead-in line</strong></p>
    </div>
  </div>
</div>
```

Centered image block:

```html
<div class="wpb_single_image wpb_content_element vc_align_center wpb_content_element">
  <figure class="wpb_wrapper vc_figure">
    <div class="vc_single_image-wrapper">
      <img src="images/your-image.jpg" class="vc_single_image-img" alt="Describe the image" />
    </div>
  </figure>
</div>
```

Spacer (any height):

```html
<div class="vc_empty_space" style="height: 125px"><span class="vc_empty_space_inner"></span></div>
```

Use `h1`–`h6`, `p`, `ul/ol/li`, `strong/em`, `a`, tables, etc. directly inside
`wpb_wrapper`. Headings/links inherit the site's typography and colors
automatically because the theme CSS styles them.

## Running it

It's fully static — just open `index.html` in a browser, or serve the folder:

```bash
cd /home/larkin/tmp/gsmc
python3 -m http.server 8000     # then visit http://localhost:8000/
```

Notes:

- Mobile menu (hamburger → accordion) and the full-screen search overlay work
  out of the box thanks to the included Foundation/theme scripts.
- The search overlay submits to the live site's search (as the real header does).
- Header/footer links still point at the live easttnscouts.org pages — that is
  intentional for a mockup; change them if your new page should link
  elsewhere.
- `_template.html` is a clean blank snapshot of `index.html` (chrome only,
  empty content region) — your safe starting point for a new page.
- Short pages (little content) automatically fill the viewport so the footer
  sits at the bottom of the screen — the page fills via
  `.wrapper { display:flex; … min-height:100vh }` in the head `<style>`
  block; delete those three rules if you ever want the old floaty behavior.

## Hosting on GitHub Pages

1. Create an empty repository on GitHub (e.g. `gsmc-pages`).
2. Push this folder:

   ```bash
   git remote add origin git@github.com:<you>/gsmc-pages.git
   git push -u origin main
   ```

3. In the repo: **Settings → Pages → Build and deployment** →
   Source: **Deploy from a branch** → Branch: **main**, folder: **/ (root)** → Save.
4. Wait for the deploy job (≈1 min), then open
   `https://<you>.github.io/gsmc-pages/`.

Every other file in the repo (`_template.html`, content pages you add,
`assets/`, `images/`) is served at the same path as in this folder, so
`<base>/newpage.html` works as-is. Google Fonts load from the live CDN, so the
hosted page needs internet access.

## Verifying fidelity

`src/_research/page.html` is the unmodified capture of the live page (486 lines).
If you ever wonder "did the template keep the original structure?", diff the
header/footer regions of `index.html` against it — they match class-for-class.
