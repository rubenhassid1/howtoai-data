import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const POSTS_DIR = '/Users/rubenhassid/howtoai-data/data/posts';
const DELAY_MS = 500;

const URLS = [
  "https://ruben.substack.com/p/grok-420",
  "https://ruben.substack.com/p/claude-code",
  "https://ruben.substack.com/p/claude-charts",
  "https://ruben.substack.com/p/claude-for-teams",
  "https://ruben.substack.com/p/powerpoint",
  "https://ruben.substack.com/p/claude-cowork",
  "https://ruben.substack.com/p/banana-2-3bd",
  "https://ruben.substack.com/p/1000000",
  "https://ruben.substack.com/p/ai-holic",
  "https://ruben.substack.com/p/claude",
  "https://ruben.substack.com/p/bubble",
  "https://ruben.substack.com/p/magic",
  "https://ruben.substack.com/p/slow",
  "https://ruben.substack.com/p/quit-chatgpt",
  "https://ruben.substack.com/p/youre-using-ai-backwards",
  "https://ruben.substack.com/p/ai-couldnt-do-excel",
  "https://ruben.substack.com/p/you-forgot-70-of-yesterdays-meeting",
  "https://ruben.substack.com/p/i-am-just-a-text-file",
  "https://ruben.substack.com/p/your-prompt-sucks",
  "https://ruben.substack.com/p/how-to-better-use-ai-before-prompting",
  "https://ruben.substack.com/p/rovo",
  "https://ruben.substack.com/p/grok-chatgpt",
  "https://ruben.substack.com/p/replaced",
  "https://ruben.substack.com/p/happy-new-ai-year",
  "https://ruben.substack.com/p/app",
  "https://ruben.substack.com/p/from-49-to-10000-followers-in-17",
  "https://ruben.substack.com/p/opus",
  "https://ruben.substack.com/p/carousels",
  "https://ruben.substack.com/p/52",
  "https://ruben.substack.com/p/detection",
  "https://ruben.substack.com/p/declining",
  "https://ruben.substack.com/p/flow",
  "https://ruben.substack.com/p/infographic",
  "https://ruben.substack.com/p/split",
  "https://ruben.substack.com/p/the-200-chatgpt-model-but-for-25",
  "https://ruben.substack.com/p/banana-2",
  "https://ruben.substack.com/p/context-is-all-you-need",
  "https://ruben.substack.com/p/51",
  "https://ruben.substack.com/p/free",
  "https://ruben.substack.com/p/delve",
  "https://ruben.substack.com/p/youtube",
  "https://ruben.substack.com/p/long",
  "https://ruben.substack.com/p/emdash",
  "https://ruben.substack.com/p/same",
  "https://ruben.substack.com/p/atlas",
  "https://ruben.substack.com/p/sorry",
  "https://ruben.substack.com/p/master",
  "https://ruben.substack.com/p/upgrade",
  "https://ruben.substack.com/p/search",
  "https://ruben.substack.com/p/video",
  "https://ruben.substack.com/p/gold",
  "https://ruben.substack.com/p/vibing",
  "https://ruben.substack.com/p/imagine",
  "https://ruben.substack.com/p/grandma",
  "https://ruben.substack.com/p/banana",
  "https://ruben.substack.com/p/the-7-deadly-sins-of-prompting",
  "https://ruben.substack.com/p/start",
  "https://ruben.substack.com/p/consulting",
  "https://ruben.substack.com/p/business-plan",
  "https://ruben.substack.com/p/linkedin",
  "https://ruben.substack.com/p/chatgpt-5",
  "https://ruben.substack.com/p/spend",
  "https://ruben.substack.com/p/settings",
  "https://ruben.substack.com/p/16-chatgpt-myths",
  "https://ruben.substack.com/p/f1",
  "https://ruben.substack.com/p/context",
  "https://ruben.substack.com/p/how-to-train-your-own-chatgpt",
  "https://ruben.substack.com/p/how-chatgpt-makes-you-dumb",
  "https://ruben.substack.com/p/fight",
  "https://ruben.substack.com/p/prompt-maker",
  "https://ruben.substack.com/p/socrates-and-ai",
  "https://ruben.substack.com/p/past",
];

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function extractMeta(html, property) {
  // Try og: and article: meta tags - handle arbitrary attributes (like data-rh="true") between <meta and property/content
  for (const attr of ['property', 'name']) {
    const re = new RegExp(`<meta[^>]*${attr}="${property}"[^>]*content="([^"]*)"`, 'i');
    let m = html.match(re);
    if (m) return decodeEntities(m[1]);
    // Also try content before property
    const re2 = new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${property}"`, 'i');
    m = html.match(re2);
    if (m) return decodeEntities(m[1]);
  }
  return '';
}

function decodeEntities(str) {
  return str
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, ' ');
}

function extractDate(html) {
  // Try article:published_time meta
  let date = extractMeta(html, 'article:published_time');
  if (date) return date.slice(0, 10);

  // Try time element with datetime
  const m = html.match(/<time[^>]*datetime="([^"]+)"/i);
  if (m) return m[1].slice(0, 10);

  // Try datePublished in JSON-LD
  const jm = html.match(/"datePublished"\s*:\s*"([^"]+)"/);
  if (jm) return jm[1].slice(0, 10);

  return 'unknown';
}

function extractBody(html) {
  // Substack puts article content in a div with class containing "body markup"
  // or in the <div class="available-content"> or <div class="body markup">

  // Try to find the main post body
  let body = '';

  // Method 1: Look for class="body markup"
  let m = html.match(/<div[^>]*class="[^"]*body\s+markup[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*(?:<div[^>]*class="[^"]*subscription|<div[^>]*class="[^"]*post-footer|<div[^>]*id="[^"]*footer)/i);
  if (m) {
    body = m[1];
  }

  if (!body) {
    // Method 2: Try to get content between body markup div and the subscription widget
    m = html.match(/class="[^"]*body\s+markup[^"]*"[^>]*>([\s\S]*?)(?:<div[^>]*class="[^"]*subscription-widget|<div[^>]*class="[^"]*post-footer|class="[^"]*paywall)/i);
    if (m) body = m[1];
  }

  if (!body) {
    // Method 3: broader approach - find available-content
    m = html.match(/<div[^>]*class="[^"]*available-content[^"]*"[^>]*>([\s\S]*?)(?:<div[^>]*class="[^"]*subscription-widget|<div[^>]*class="[^"]*paywall|<div[^>]*class="[^"]*post-footer)/i);
    if (m) body = m[1];
  }

  if (!body) {
    // Method 4: Just grab everything in the post
    m = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (m) body = m[1];
  }

  return body || '';
}

function htmlToMarkdown(html) {
  if (!html) return '';

  let md = html;

  // Remove script and style tags
  md = md.replace(/<script[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[\s\S]*?<\/style>/gi, '');
  md = md.replace(/<button[\s\S]*?<\/button>/gi, '');

  // Remove subscription/paywall widgets
  md = md.replace(/<div[^>]*class="[^"]*subscription-widget[^"]*"[\s\S]*?<\/div>/gi, '');

  // Convert headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');

  // Convert images - try to get src from various attributes
  md = md.replace(/<picture[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>[\s\S]*?<\/picture>/gi, '\n![$2]($1)\n');
  md = md.replace(/<picture[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*>[\s\S]*?<\/picture>/gi, '\n![]($1)\n');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '\n![$2]($1)\n');
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '\n![$1]($2)\n');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '\n![]($1)\n');

  // Convert links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Convert bold and italic
  md = md.replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, '**$2**');
  md = md.replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, '*$2*');

  // Convert blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    const clean = content.replace(/<[^>]+>/g, '').trim();
    return '\n> ' + clean.split('\n').join('\n> ') + '\n';
  });

  // Convert unordered lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return '\n' + content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => {
      return '- ' + item.replace(/<[^>]+>/g, '').trim() + '\n';
    }) + '\n';
  });

  // Convert ordered lists
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let i = 0;
    return '\n' + content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => {
      i++;
      return `${i}. ` + item.replace(/<[^>]+>/g, '').trim() + '\n';
    }) + '\n';
  });

  // Convert line breaks and paragraphs
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<\/p>/gi, '\n\n');
  md = md.replace(/<p[^>]*>/gi, '');
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n');

  // Convert divs to newlines
  md = md.replace(/<\/div>/gi, '\n');
  md = md.replace(/<div[^>]*>/gi, '');

  // Remove figcaption content (keep it but strip tags)
  md = md.replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, '*$1*\n');

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  md = decodeEntities(md);

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

function escapeYaml(str) {
  if (!str) return '""';
  // If it contains special chars, wrap in quotes and escape internal quotes
  if (str.includes(':') || str.includes('#') || str.includes('"') || str.includes("'") || str.includes('\n') || str.startsWith(' ')) {
    return '"' + str.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  return str;
}

async function scrapeSingle(url) {
  const slug = url.split('/p/')[1];

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const html = await res.text();

  const title = extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title') || '';
  const subtitle = extractMeta(html, 'og:description') || '';
  const date = extractDate(html);
  const bodyHtml = extractBody(html);
  const bodyMd = htmlToMarkdown(bodyHtml);

  const filename = `${date}-${slug}.md`;

  const frontmatter = [
    '---',
    `title: ${escapeYaml(title)}`,
    `date: ${date}`,
    `slug: ${slug}`,
    `subtitle: ${escapeYaml(subtitle)}`,
    `url: ${url}`,
    '---',
  ].join('\n');

  const content = frontmatter + '\n\n' + bodyMd + '\n';

  writeFileSync(join(POSTS_DIR, filename), content, 'utf-8');

  return { title, date, slug, url, filename };
}

async function main() {
  mkdirSync(POSTS_DIR, { recursive: true });

  const results = [];
  const errors = [];

  for (let i = 0; i < URLS.length; i++) {
    const url = URLS[i];
    const slug = url.split('/p/')[1];

    try {
      console.log(`[${i + 1}/${URLS.length}] Scraping: ${slug}`);
      const meta = await scrapeSingle(url);
      results.push(meta);
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      errors.push({ url, error: err.message });
    }

    if (i < URLS.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Sort by date descending
  results.sort((a, b) => b.date.localeCompare(a.date));

  // Write index.json
  const index = results.map(r => ({
    title: r.title,
    date: r.date,
    slug: r.slug,
    url: r.url,
  }));

  writeFileSync(
    join(POSTS_DIR, 'index.json'),
    JSON.stringify(index, null, 2),
    'utf-8'
  );

  console.log(`\n=== DONE ===`);
  console.log(`Successfully scraped: ${results.length}/${URLS.length}`);
  console.log(`Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Failed URLs:');
    errors.forEach(e => console.log(`  ${e.url}: ${e.error}`));
  }
}

main();
