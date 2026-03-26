/**
 * Rebuild all newsletter posts from Substack export.
 * - Uses authoritative CSV metadata
 * - Converts HTML to clean Markdown
 * - Excludes: unpublished, podcasts, adhoc emails, pages, marketing emails (only_free), theme preview
 * - Optimized for Claude/AI consumption
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, basename } from "path";

const EXPORT_DIR = "/Users/rubenhassid/Downloads/HP8G_eVsT9GKMgaDiQed8w";
const OUTPUT_DIR = "/Users/rubenhassid/howtoai-data/data/posts";

// ── Parse CSV ──
function parseCSV(text) {
  const lines = [];
  let current = "";
  let inQuotes = false;
  for (const char of text) {
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === "\n" && !inQuotes) {
      lines.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current);

  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ""));
    return obj;
  });
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// ── HTML to Markdown ──
function htmlToMarkdown(html) {
  let md = html;

  // Remove script/style tags
  md = md.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");

  // Remove Substack-specific elements (buttons, subscription widgets, etc.)
  md = md.replace(/<div[^>]*class="[^"]*subscription[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  md = md.replace(/<div[^>]*class="[^"]*paywall[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  md = md.replace(/<div[^>]*data-component-name="SubscribeWidget"[^>]*>[\s\S]*?<\/div>/gi, "");
  md = md.replace(/<div[^>]*class="[^"]*captioned-button[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");

  // Handle video embeds → just note them
  md = md.replace(/<div[^>]*class="native-video-embed"[^>]*><\/div>/gi, "[Video]");
  md = md.replace(/<div[^>]*data-component-name="VideoPlaceholder"[^>]*><\/div>/gi, "[Video]");

  // Handle images
  md = md.replace(/<figure[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*\/?>([\s\S]*?)<\/figure>/gi, (_, src, rest) => {
    const capMatch = rest.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const caption = capMatch ? stripTags(capMatch[1]).trim() : "";
    return caption ? `![${caption}](${src})\n*${caption}*` : `![](${src})`;
  });
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `\n# ${stripTags(c).trim()}\n`);
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `\n## ${stripTags(c).trim()}\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `\n### ${stripTags(c).trim()}\n`);
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, c) => `\n#### ${stripTags(c).trim()}\n`);

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) => {
    const text = stripTags(c).trim().split("\n").map((l) => `> ${l.trim()}`).join("\n");
    return `\n${text}\n`;
  });

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, c) => {
    return "\n" + c.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => `- ${stripTags(li).trim()}`).trim() + "\n";
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, c) => {
    let i = 0;
    return "\n" + c.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => `${++i}. ${stripTags(li).trim()}`).trim() + "\n";
  });

  // Bold, italic, code
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*");
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n");

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const clean = stripTags(text).trim();
    if (!clean || clean === href) return href;
    return `[${clean}](${href})`;
  });

  // Horizontal rules
  md = md.replace(/<hr[^>]*\/?>/gi, "\n---\n");

  // Paragraphs and line breaks
  md = md.replace(/<br[^>]*\/?>/gi, "\n");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => `\n${c.trim()}\n`);

  // Remove remaining divs (keep content)
  md = md.replace(/<\/?div[^>]*>/gi, "\n");

  // Strip any remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&lt;/g, "<");
  md = md.replace(/&gt;/g, ">");
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, " ");
  md = md.replace(/&rsquo;/g, "'");
  md = md.replace(/&lsquo;/g, "'");
  md = md.replace(/&rdquo;/g, "\u201D");
  md = md.replace(/&ldquo;/g, "\u201C");
  md = md.replace(/&mdash;/g, "\u2014");
  md = md.replace(/&ndash;/g, "\u2013");
  md = md.replace(/&hellip;/g, "\u2026");
  md = md.replace(/&#x27;/g, "'");
  md = md.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, "\n\n");
  md = md.trim();

  return md;
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}

// ── Main ──
const csvText = readFileSync(join(EXPORT_DIR, "posts.csv"), "utf-8");
const allPosts = parseCSV(csvText);

// Filter: keep only published newsletter posts, exclude marketing (only_free), exclude theme preview
const EXCLUDE_AUDIENCES = new Set(["only_free"]);
const EXCLUDE_TYPES = new Set(["podcast", "adhoc_email", "page"]);

const posts = allPosts.filter((p) => {
  if (p.is_published !== "true") return false;
  if (EXCLUDE_TYPES.has(p.type)) return false;
  if (EXCLUDE_AUDIENCES.has(p.audience)) return false;
  if (p.post_id.includes("THEME-PREVIEW")) return false;
  if (!p.title || !p.title.trim()) return false;
  return true;
});

console.log(`Total posts in CSV: ${allPosts.length}`);
console.log(`After filtering: ${posts.length} posts to process`);

// Clean output directory
if (existsSync(OUTPUT_DIR)) {
  for (const f of readdirSync(OUTPUT_DIR)) {
    if (f.endsWith(".md") || f === "index.json") {
      const fp = join(OUTPUT_DIR, f);
      writeFileSync(fp, ""); // will be overwritten or we delete
      import("fs").then((fs) => fs.unlinkSync(fp));
    }
  }
}
mkdirSync(OUTPUT_DIR, { recursive: true });

// Find HTML file for each post
const postsDir = join(EXPORT_DIR, "posts");
const htmlFiles = readdirSync(postsDir).filter((f) => f.endsWith(".html"));

let success = 0;
let skipped = 0;
const indexEntries = [];

for (const post of posts) {
  const postId = post.post_id.split(".")[0];
  const slug = post.post_id.split(".").slice(1).join(".");

  // Find matching HTML file
  const htmlFile = htmlFiles.find((f) => f.startsWith(postId + "."));
  if (!htmlFile) {
    console.log(`  SKIP (no HTML): ${slug}`);
    skipped++;
    continue;
  }

  const html = readFileSync(join(postsDir, htmlFile), "utf-8");
  const markdown = htmlToMarkdown(html);

  if (markdown.length < 50) {
    console.log(`  SKIP (too short): ${slug} — ${markdown.length} chars`);
    skipped++;
    continue;
  }

  // Parse date
  const date = post.post_date.split("T")[0];
  const audience = post.audience === "only_paid" ? "paid" : "free";

  // Build frontmatter
  const title = post.title.replace(/"/g, '\\"');
  const subtitle = post.subtitle ? post.subtitle.replace(/"/g, '\\"') : "";

  let content = `---
title: "${title}"
date: ${date}
slug: ${slug}
subtitle: "${subtitle}"
audience: ${audience}
url: https://ruben.substack.com/p/${slug}
---

${markdown}
`;

  const filename = `${date}-${slug}.md`;
  writeFileSync(join(OUTPUT_DIR, filename), content, "utf-8");

  indexEntries.push({
    title: post.title,
    subtitle: post.subtitle,
    date,
    slug,
    audience,
    url: `https://ruben.substack.com/p/${slug}`,
    filename,
  });

  success++;
}

// Sort index by date descending
indexEntries.sort((a, b) => b.date.localeCompare(a.date));

writeFileSync(join(OUTPUT_DIR, "index.json"), JSON.stringify(indexEntries, null, 2), "utf-8");

console.log(`\nDone:`);
console.log(`  ✓ ${success} posts converted`);
console.log(`  ✗ ${skipped} skipped`);
console.log(`  📄 index.json written with ${indexEntries.length} entries`);
