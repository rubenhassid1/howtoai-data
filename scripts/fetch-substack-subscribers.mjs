import { chromium } from "playwright";
import { writeFileSync, readFileSync, existsSync } from "fs";

const COOKIE = process.env.SUBSTACK_SID;
if (!COOKIE) {
  console.error("SUBSTACK_SID env var is required");
  process.exit(1);
}

const DATA_FILE = "data/substack-subscribers.json";

async function fetchExactCount() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  await context.addCookies([
    {
      name: "substack.sid",
      value: COOKIE,
      domain: ".substack.com",
      path: "/",
    },
  ]);

  const page = await context.newPage();

  await page.goto("https://ruben.substack.com/publish/subscribers", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });

  // Wait for the subscriber count to render via client-side JS
  await page.waitForTimeout(5000);

  let count = null;

  // The dashboard header shows "410,901 subscribers" — extract that pattern
  const allText = await page.textContent("body");
  const match = allText.match(/([\d,]+)\s+subscribers/);
  if (match) {
    count = parseInt(match[1].replace(/,/g, ""), 10);
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
