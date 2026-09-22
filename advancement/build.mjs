#!/usr/bin/env node
/**
 * Build the Advancement site: every index.md under this directory
 *     (+ _template.html: site chrome: header/nav/footer)
 *     -> index.html in the SAME directory as its index.md
 *
 * The directory structure of the sources is preserved in the output,
 * so pages nested N levels deep get their local asset references
 * (assets/..., images/...) prefixed with "../" x N.
 *
 * Usage:
 *   node build.mjs           (one-shot build)
 *   node --watch build.mjs   (rebuild on every save)
 * or via npm:  npm run build / npm run watch
 *
 * The build only rewrites the region between the BUILD:CONTENT-START and
 * BUILD:CONTENT-END markers, so chrome edits in _template.html survive.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const dir = dirname(fileURLToPath(import.meta.url));
const templatePath = join(dir, "_template.html");

const START = "<!-- BUILD:CONTENT-START — generated from index.md (npm run build); edit index.md, not this block -->";
const END = "<!-- BUILD:CONTENT-END -->";

function fail(msg) {
  console.error(`build: ${msg}`);
  process.exit(1);
}

let template;
try {
  template = readFileSync(templatePath, "utf8");
} catch {
  fail(`cannot read ${templatePath}`);
}

const startMarker = template.indexOf(START);
const endMarker = template.indexOf(END, startMarker + 1); // END must come after START
if (startMarker === -1 || endMarker === -1) {
  fail("BUILD:CONTENT markers not found in _template.html — restore them before building");
}

/**
 * Recursively collect index.md files under `base` (depth-first, sorted).
 */
function findIndexMd(base, root = base, depth = 0, out = []) {
  for (const entry of readdirSync(base, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = join(base, entry.name);
    if (entry.isDirectory()) {
      findIndexMd(full, root, depth + 1, out);
    } else if (entry.name === "index.md") {
      out.push({ path: full, depth });
    }
  }
  return out;
}

/**
 * Prefix local asset references (assets/..., images/...) in the template's
 * src/href attributes with "../" x depth so nested pages can reach
 * assets that live at the site root.
 */
function adjustTemplate(t, depth) {
  if (depth === 0) return t;
  const prefix = "../".repeat(depth);
  return t.replace(
    /(src|href)="((?:assets|images)\/[^"]*)"/g,
    (_m, attr, value) => `${attr}="${prefix}${value}"`
  );
}

const pages = findIndexMd(dir);
if (pages.length === 0) fail("no index.md files found under advancement/");

for (const { path: mdPath, depth } of pages) {
  let md;
  try {
    md = readFileSync(mdPath, "utf8");
  } catch {
    fail(`cannot read ${mdPath}`);
  }

  // Render Markdown (GFM tables, lists, links, images…) to an HTML fragment.
  const html = marked.parse(md, { gfm: true, breaks: false }).trim();

  // Indent to sit inside .wpb_wrapper like hand-written content.
  const indent = " ".repeat(10);
  const body = html.split("\n").map((line) => indent + line.trim()).join("\n");

  const t = adjustTemplate(template, depth);
  const start = t.indexOf(START);
  const end = t.indexOf(END, start + 1);
  const out = t.slice(0, start) + START + "\n" + body + "\n" + END + t.slice(end + END.length);

  const outPath = join(dirname(mdPath), "index.html");
  writeFileSync(outPath, out);
  const rel = relative(dir, outPath);
  console.log(`built ${rel} (${md.split("\n").length} md lines -> ${html.split("\n").length} html lines${depth ? `, ../ prefix x${depth}` : ""})`);
}
console.log(`built ${pages.length} page(s) from index.md sources`);
