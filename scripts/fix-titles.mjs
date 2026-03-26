import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const POSTS_DIR = join(import.meta.dirname, '..', 'data', 'posts');
const DELAY = 500;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // Remove surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  return { frontmatter: fm, raw: match[0], fmBody: match[1] };
}

function extractMeta(html, property) {
  // Try og: meta tags
  const re = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const match = html.match(re);
  if (match) return match[1];
  // Try reversed attribute order
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i');
  const match2 = html.match(re2);
  if (match2) return match2[1];
  return null;
}

function extractTitle(html) {
  // Try og:title first
  let title = extractMeta(html, 'og:title');
  if (title) return title;
  // Try <h1 class="post-title">
  const h1 = html.match(/<h1[^>]*class="[^"]*post-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return h1[1].replace(/<[^>]+>/g, '').trim();
  // Try <title>
  const t = html.match(/<title>([^<]+)<\/title>/i);
  if (t) return t[1].trim();
  return null;
}

function extractSubtitle(html) {
  return extractMeta(html, 'og:description');
}

function escapeYaml(str) {
  if (!str) return '""';
  // If it contains quotes, colons, or special chars, wrap in double quotes and escape internal quotes
  const escaped = str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}"`;
}

async function main() {
  const files = (await readdir(POSTS_DIR)).filter(f => f.endsWith('.md')).sort();
  console.log(`Found ${files.length} markdown files`);

  const results = [];
  let updated = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = join(POSTS_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const parsed = parseFrontmatter(content);
    if (!parsed) {
      console.log(`  SKIP ${file} - no frontmatter`);
      continue;
    }

    const url = parsed.frontmatter.url;
    if (!url) {
      console.log(`  SKIP ${file} - no URL`);
      continue;
    }

    console.log(`  Fetching ${file} -> ${url}`);
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; archiver/1.0)' },
        redirect: 'follow',
      });
      if (!resp.ok) {
        console.log(`    FAILED HTTP ${resp.status}`);
        failed++;
        await sleep(DELAY);
        continue;
      }
      const html = await resp.text();
      const title = extractTitle(html);
      const subtitle = extractSubtitle(html);

      if (!title) {
        console.log(`    FAILED - no title found in HTML`);
        failed++;
        await sleep(DELAY);
        continue;
      }

      // Decode HTML entities
      const decodeEntities = (s) => s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&ndash;/g, '\u2013')
        .replace(/&mdash;/g, '\u2014')
        .replace(/&hellip;/g, '\u2026')
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));

      const cleanTitle = decodeEntities(title);
      const cleanSubtitle = subtitle ? decodeEntities(subtitle) : '';

      console.log(`    Title: ${cleanTitle}`);
      if (cleanSubtitle) console.log(`    Subtitle: ${cleanSubtitle.slice(0, 60)}...`);

      // Rebuild frontmatter
      const newFm = `---
title: ${escapeYaml(cleanTitle)}
date: ${parsed.frontmatter.date}
slug: ${parsed.frontmatter.slug}
subtitle: ${escapeYaml(cleanSubtitle)}
url: ${parsed.frontmatter.url}
---`;

      const newContent = content.replace(parsed.raw, newFm);
      await writeFile(filePath, newContent, 'utf-8');
      updated++;

      results.push({
        title: cleanTitle,
        subtitle: cleanSubtitle,
        date: parsed.frontmatter.date,
        slug: parsed.frontmatter.slug,
        url: parsed.frontmatter.url,
        file,
      });

    } catch (err) {
      console.log(`    ERROR: ${err.message}`);
      failed++;
    }

    await sleep(DELAY);
  }

  // Build index.json sorted by date descending
  // Re-read all files to catch any that already had titles
  const allFiles = (await readdir(POSTS_DIR)).filter(f => f.endsWith('.md')).sort();
  const index = [];
  for (const file of allFiles) {
    const content = await readFile(join(POSTS_DIR, file), 'utf-8');
    const parsed = parseFrontmatter(content);
    if (!parsed) continue;
    index.push({
      title: parsed.frontmatter.title || '',
      date: parsed.frontmatter.date || '',
      slug: parsed.frontmatter.slug || '',
      subtitle: parsed.frontmatter.subtitle || '',
      url: parsed.frontmatter.url || '',
    });
  }
  index.sort((a, b) => b.date.localeCompare(a.date));

  await writeFile(join(POSTS_DIR, 'index.json'), JSON.stringify(index, null, 2) + '\n', 'utf-8');
  console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`);
  console.log(`index.json rebuilt with ${index.length} entries`);
}

main().catch(console.error);
