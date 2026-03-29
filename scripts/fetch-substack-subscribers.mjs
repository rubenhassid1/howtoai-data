import { writeFileSync, readFileSync, existsSync } from "fs";

const COOKIE = process.env.SUBSTACK_SID;
const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!COOKIE || !APIFY_TOKEN) {
  console.error("SUBSTACK_SID and APIFY_TOKEN env vars are required");
  process.exit(1);
}

const DATA_FILE = "data/substack-subscribers.json";

async function fetchExactCount() {
  // Use Apify's playwright-scraper with residential proxy to bypass Cloudflare.
  // Navigate to homepage first (no auth needed), set cookie, then go to dashboard.
  const pageFunction = `async function pageFunction({ page, log }) {
    await page.context().addCookies([{
      name: "substack.sid",
      value: ${JSON.stringify(COOKIE)},
      domain: ".substack.com",
      path: "/"
    }]);
    log.info("Navigating to subscribers page...");
    await page.goto("https://ruben.substack.com/publish/subscribers", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });
    await page.waitForTimeout(10000);
    const text = await page.textContent("body");
    const match = text.match(/(\\d[\\d,]+)\\s+subscribers/);
    const count = match ? match[1] : null;
    const num = count ? parseInt(count.replace(/,/g, ""), 10) : null;
    return { count: num, url: page.url() };
  }`;

  const input = {
    startUrls: [{ url: "https://ruben.substack.com" }],
    pageFunction,
    proxyConfiguration: { useApifyProxy: true, apifyProxyGroups: ["RESIDENTIAL"] },
    launchContext: { launchOptions: { headless: false } },
    maxRequestRetries: 0,
  };

  console.log("Starting Apify actor...");
  const runRes = await fetch(
    `https://api.apify.com/v2/acts/apify~playwright-scraper/runs?token=${APIFY_TOKEN}&waitForFinish=240`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );
  const run = (await runRes.json()).data;

  if (run.status !== "SUCCEEDED") {
    console.error(`Apify run failed: ${run.status} — ${run.statusMessage}`);
    process.exit(1);
  }

  const dsRes = await fetch(
    `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=${APIFY_TOKEN}`
  );
  const items = await dsRes.json();

  const count = items[0]?.count;
  if (!count || count < 100000) {
    console.error("Could not extract exact subscriber count:", items[0]);
    process.exit(1);
  }

  // Load existing data or create new
  let data = { history: [] };
  if (existsSync(DATA_FILE)) {
    data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  }

  const today = new Date().toISOString().slice(0, 10);
  const entry = { date: today, subscribers: count };

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
