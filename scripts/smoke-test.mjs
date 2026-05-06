#!/usr/bin/env node

const { chromium } = await import("playwright");

const baseUrl = process.env.SMOKE_BASE_URL || process.argv[2] || "http://localhost:3000";
const opsPassword = process.env.SMOKE_OPS_PASSWORD || "";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
page.setDefaultTimeout(30000);
page.setDefaultNavigationTimeout(30000);

const results = [];

async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, ok: true, detail });
  } catch (error) {
    results.push({ name, ok: false, detail: String(error) });
  }
}

await check("home", async () => {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const title = await page.title();
  if (!title.includes("IGNAI")) {
    throw new Error(`unexpected title: ${title}`);
  }
  return title;
});

await check("blog-detail", async () => {
  await page.goto(`${baseUrl}/blog`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const href = await page.locator('main a[href^="/blog/"]').first().getAttribute("href");
  if (!href) {
    throw new Error("no blog detail link found");
  }
  await page.goto(`${baseUrl}${href}`, { waitUntil: "domcontentloaded" });
  const title = await page.title();
  if (!title.includes("Blog")) {
    throw new Error(`unexpected blog detail title: ${title}`);
  }
  return href;
});

await check("story-detail", async () => {
  await page.goto(`${baseUrl}/stories`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const href = await page.locator('main a[href^="/stories/"]').first().getAttribute("href");
  if (!href) {
    throw new Error("no story detail link found");
  }
  await page.goto(`${baseUrl}${href}`, { waitUntil: "domcontentloaded" });
  const title = await page.title();
  if (!title.includes("Stories")) {
    throw new Error(`unexpected story detail title: ${title}`);
  }
  return href;
});

await check("join-submit", async () => {
  await page.goto(`${baseUrl}/join`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const qr = page.getByRole("img", { name: "扫码添加千逐微信，联系 IGNAI 社区管理者" });
  if ((await qr.count()) !== 1) {
    throw new Error("join qr card not found");
  }
  const text = await page.locator("main").innerText();
  if (!text.includes("直接加社区管理者")) {
    throw new Error(`missing direct-contact copy: ${text}`);
  }
  return "qr visible";
});

await check("ops-gate", async () => {
  await page.goto(`${baseUrl}/ops/join`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const text = await page.locator("body").innerText();
  if (!text.includes("OPS ACCESS")) {
    throw new Error("ops access gate not shown");
  }
  return "gate visible";
});

if (opsPassword) {
  await check("ops-login", async () => {
    await page.goto(`${baseUrl}/ops/join`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    await page.getByPlaceholder("运营访问密码").fill(opsPassword);
    await page.getByRole("button", { name: "进入后台" }).click();
    await page.waitForTimeout(1200);
    const text = await page.locator("body").innerText();
    if (!text.includes("申请池")) {
      throw new Error("ops dashboard not visible after login");
    }
    return "login success";
  });
}

await browser.close();

const failed = results.filter((item) => !item.ok);
for (const item of results) {
  console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}: ${item.detail}`);
}

if (failed.length > 0) {
  process.exit(1);
}
