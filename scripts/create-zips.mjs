import { readdir, readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync } from 'node:fs';

const DATA_DIR = join(import.meta.dirname, '..', 'data');
const POSTS_DIR = join(DATA_DIR, 'posts');

const README_CONTENT = (count) => `# How to AI — Newsletter Archive

Posts from the [How to AI](https://ruben.substack.com) newsletter by Ruben Hassid.

## What's inside
- [${count}] newsletter posts in Markdown format
- Each post includes frontmatter with title, date, subtitle, and original URL

## Usage
These files work great with AI tools. Drop them into Claude, ChatGPT, or your favorite LLM for analysis, search, or reference.

## MCP Access
Point your MCP client to this directory to give your AI assistant access to the full archive.
`;

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  return fm;
}

async function main() {
  // Get all posts sorted by date descending
  const files = (await readdir(POSTS_DIR)).filter(f => f.endsWith('.md')).sort();
  const posts = [];
  for (const file of files) {
    const content = await readFile(join(POSTS_DIR, file), 'utf-8');
    const fm = parseFrontmatter(content);
    posts.push({ file, date: fm?.date || '' });
  }
  posts.sort((a, b) => b.date.localeCompare(a.date));

  const top10 = posts.slice(0, 10);

  // Create starter pack ZIP
  console.log('Creating howtoai-starter-pack.zip (10 most recent posts)...');
  const tmpStarter = await mkdtemp(join(tmpdir(), 'starter-'));
  const starterDir = join(tmpStarter, 'howtoai-starter-pack');
  mkdirSync(starterDir);
  await writeFile(join(starterDir, 'README.md'), README_CONTENT(10));
  for (const p of top10) {
    cpSync(join(POSTS_DIR, p.file), join(starterDir, p.file));
  }
  const starterZip = join(DATA_DIR, 'howtoai-starter-pack.zip');
  execSync(`cd "${tmpStarter}" && zip -r "${starterZip}" howtoai-starter-pack/`);
  await rm(tmpStarter, { recursive: true });

  // Create full archive ZIP
  console.log('Creating howtoai-full-archive.zip (all posts + index.json)...');
  const tmpFull = await mkdtemp(join(tmpdir(), 'full-'));
  const fullDir = join(tmpFull, 'howtoai-full-archive');
  mkdirSync(fullDir);
  await writeFile(join(fullDir, 'README.md'), README_CONTENT(posts.length));
  for (const p of posts) {
    cpSync(join(POSTS_DIR, p.file), join(fullDir, p.file));
  }
  cpSync(join(POSTS_DIR, 'index.json'), join(fullDir, 'index.json'));
  const fullZip = join(DATA_DIR, 'howtoai-full-archive.zip');
  execSync(`cd "${tmpFull}" && zip -r "${fullZip}" howtoai-full-archive/`);
  await rm(tmpFull, { recursive: true });

  // Print sizes
  const { statSync } = await import('node:fs');
  const starterSize = statSync(starterZip).size;
  const fullSize = statSync(fullZip).size;
  const fmt = (bytes) => bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;

  console.log(`\nDone!`);
  console.log(`  howtoai-starter-pack.zip: ${fmt(starterSize)} (10 posts)`);
  console.log(`  howtoai-full-archive.zip: ${fmt(fullSize)} (${posts.length} posts + index.json)`);

  console.log('\nStarter pack posts:');
  for (const p of top10) {
    console.log(`  ${p.date} — ${p.file}`);
  }
}

main().catch(console.error);
