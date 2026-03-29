import { chromium } from "playwright";
import { writeFileSync, readFileSync, existsSync } from "fs";

const COOKIE = process.env.SUBSTACK_SID;
if (!COOKIE) {
  console.error("SUBSTACK_SID env var is required");
  process.exit(1);
}

const DATA_FILE = "data/substack-subscribers.json";

async function fetchExactCount() {
  // Use non-headless tricks to avoid Cloudflare bot detection
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--headless=new",
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
    ],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 720 },
    locale: "en-US",
  });

  // Remove webdriver indicator
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  await context.addCookies([
    {
      name: "substack.sid",
      value: COOKIE,
      domain: ".substack.com",
      path: "/",
    },
  ]);

  const page = await context.newPage();

  // Navigate and wait for Cloudflare challenge to resolve
  await page.goto("https://ruben.substack.com/publish/subscribers", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // Wait for Cloudflare challenge to pass + page to render
  // Poll for up to 30s until we see "subscribers" in the page
  let count = null;
  for (let attempt = 0; attempt < 15; attempt++) {
    await page.waitForTimeout(2000);
    const text = await page.textContent("body");

    const match = text.match(/([\d,]+)\s+subscribers/);
    if (match) {
      const num = parseInt(match[1].replace(/,/g, ""), 10);
      if (num > 100000) {
        count = num;
        break;
      }
    }

    // Check if still on Cloudflare challenge
    if (text.includes("security verification") || text.includes("cf_chl")) {
      console.log(`Waiting for Cloudflare challenge (attempt ${attempt + 1})...`);
      continue;
    }
  }

  // Fallback: try growth page
  if (!count) {
    console.log("Trying growth page...");
    await page.goto("https://ruben.substack.com/publish/growth", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    for (let attempt = 0; attempt < 10; attempt++) {
      await page.waitForTimeout(2000);
      const text = await page.textContent("body");
      const match = text.match(/([\d,]+)\s+subscribers/);
      if (match) {
        const num = parseInt(match[1].replace(/,/g, ""), 10);
        if (num > 100000) {
          count = num;
          break;
        }
      }
    }
  }

  if (!count) {
    const text = await page.textContent("body");
    console.error("Page URL:", page.url());
    console.error("Page text (first 500):", text.slice(0, 500).replace(/\s+/g, " "));
  }

  await browser.close();

  if (!count) {
    console.error("Could not extract exact subscriber count");
    process.exit(1);
  }

  // Load existing data or create new
  let data = { history: [] };
  if (existsSync(DATA_FILE)) {
    data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  }

  const today = new Date().toISOString().slice(0, 10);
  const entry = { date: today, subscribers: count };

  // Avoid duplicate entries for the same day
  const existingIdx = data.history.findIndex((e) => e.date === today);
  if (existingIdx >= 0) {
    data.history[existingIdx] = entry;
  } else {
    data.history.push(entry);
  }

  data.latest = entry;

  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  console.log(`Substack subscribers: ${count.toLocaleString()} (${today})`);
}

fetchExactCount();
