#!/usr/bin/env node
/**
 * Build the Advancement page:
 *   index.md  (your Markdown content)
 *     + _template.html  (site chrome: header/nav/footer)
 *     -> index.html
 *
 * Usage:
 *   node build.mjs           (one-shot build)
 *   node --watch build.mjs   (rebuild on every save)
 * or via npm:  npm run build / npm run watch
 *
 * The build only rewrites the region between the BUILD:CONTENT-START and
 * BUILD:CONTENT-END markers, so chrome edits in _template.html survive.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const dir = dirname(fileURLToPath(import.meta.url));
const templatePath = join(dir, "_template.html");
const mdPath = join(dir, "index.md");
const outPath = join(dir, "index.html");

const START = "<!-- BUILD:CONTENT-START — generated from index.md (npm run build); edit index.md, not this block -->";
const END = "<!-- BUILD:CONTENT-END -->";

function fail(msg) {
  console.error(`build: ${msg}`);
  process.exit(1);
}

let template, md;
try {
  template = readFileSync(templatePath, "utf8");
} catch {
  fail(`cannot read ${templatePath}`);
}
try {
  md = readFileSync(mdPath, "utf8");
} catch {
  fail(`cannot read ${mdPath} — create it with your page content in Markdown`);
}

const start = template.indexOf(START);
const end = template.indexOf(END, start + 1); // END must come after START
if (start === -1 || end === -1) {
  fail("BUILD:CONTENT markers not found in _template.html — restore them before building");
}

// Render Markdown (GFM tables, lists, links, images…) to an HTML fragment.
const html = marked.parse(md, { gfm: true, breaks: false }).trim();

// Indent to sit inside .wpb_wrapper like hand-written content.
const indent = " ".repeat(10);
const body = html
  .split("\n")
  .map((line) => indent + line.trim())
  .join("\n");

const out = template.slice(0, start) + START + "\n" + body + "\n" + END + template.slice(end + END.length);
writeFileSync(outPath, out);
console.log(`built ${outPath} from index.md (${md.split("\n").length} md lines -> ${html.split("\n").length} html lines)`);
