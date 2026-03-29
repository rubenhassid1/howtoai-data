import { chromium } from "playwright";
import { writeFileSync, readFileSync, existsSync } from "fs";

const COOKIE = process.env.SUBSTACK_SID;
if (!COOKIE) {
  console.error("SUBSTACK_SID env var is required");
  process.exit(1);
}

const DATA_FILE = "data/substack-subscribers.json";

async function fetchExactCount() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
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

  // Intercept XHR responses that may contain subscriber data
  let xhrCount = null;
  page.on("response", async (response) => {
    try {
      const url = response.url();
      if (url.includes("/api/") && response.status() === 200) {
        const text = await response.text().catch(() => "");
        // Look for subscriber count in API responses
        const m = text.match(/"total_subscribers?"\s*:\s*(\d+)/);
        if (m) xhrCount = parseInt(m[1], 10);
      }
    } catch {}
  });

  await page.goto("https://ruben.substack.com/publish/subscribers", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // Wait for client-side JS to fetch and render data
  await page.waitForTimeout(8000);

  let count = null;

  // Approach 1: Extract from page text — "410,901 subscribers"
  const allText = await page.textContent("body");
  const match = allText.match(/([\d,]+)\s+subscribers/);
  if (match) {
    const num = parseInt(match[1].replace(/,/g, ""), 10);
    if (num > 100000) count = num;
  }

  // Approach 2: Use intercepted XHR data
  if (!count && xhrCount) {
    count = xhrCount;
  }

  // Approach 3: Try the growth page
  if (!count) {
    console.log("Subscribers page didn't work, trying growth page...");
    await page.goto("https://ruben.substack.com/publish/growth", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(8000);

    const growthText = await page.textContent("body");
    const growthMatch = growthText.match(/([\d,]+)\s+subscribers/);
    if (growthMatch) {
      const num = parseInt(growthMatch[1].replace(/,/g, ""), 10);
      if (num > 100000) count = num;
    }
  }

  // Debug output if extraction failed
  if (!count) {
    console.error("Page URL:", page.url());
    console.error(
      "Page text (first 500 chars):",
      allText.slice(0, 500).replace(/\s+/g, " ")
    );
    await page.screenshot({ path: "/tmp/substack-debug.png" }).catch(() => {});
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
