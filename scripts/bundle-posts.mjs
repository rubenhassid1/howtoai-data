import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const POSTS_DIR = join(import.meta.dirname, "..", "data", "posts");
const OUTPUT = join(import.meta.dirname, "..", "lib", "posts-bundle.json");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, body: raw.trim() };

  const block = match[1];
  const meta = {};
  for (const line of block.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
  }

  const body = raw.slice(match[0].length).trim();
  return { meta, body };
}

const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith(".md")).sort();

const posts = [];
for (const file of files) {
  const raw = await readFile(join(POSTS_DIR, file), "utf-8");
  const { meta, body } = parseFrontmatter(raw);
  posts.push({
    title: meta.title || "",
    date: meta.date || "",
    slug: meta.slug || "",
    subtitle: meta.subtitle || "",
    content: body,
  });
}

// Sort by date descending (most recent first)
posts.sort((a, b) => b.date.localeCompare(a.date));

await writeFile(OUTPUT, JSON.stringify(posts, null, 2), "utf-8");

const sizeKB = (Buffer.byteLength(JSON.stringify(posts)) / 1024).toFixed(1);
console.log(`Bundled ${posts.length} posts into ${OUTPUT} (${sizeKB} KB)`);
