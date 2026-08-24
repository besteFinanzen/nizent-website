import { chromium } from "playwright";
import { mkdirSync } from "fs";

const base = process.env.URL || "http://localhost:4173";
const outDir = process.env.OUT || "/tmp/opencode/shots";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  args: [
    "--disable-gpu",
    "--use-gl=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-gpu-compositing",
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(base, { waitUntil: "load" });
await page.waitForTimeout(3000);

const targets = (process.env.SECTIONS || "home,mpg,dlrg,about,services,contact").split(",");

for (const id of targets) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    const lenis = window.__lenis;
    if (el && lenis?.scrollTo) lenis.scrollTo(el, { immediate: true, force: true });
    else if (el) window.scrollTo(0, el.offsetTop - 60);
  }, id);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${outDir}/${id}.png` });
  console.log("shot:", id);
}

await browser.close();
