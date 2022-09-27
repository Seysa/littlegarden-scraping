import puppeteer from "puppeteer-core";
import { join } from "path";

const website = "https://littlexgarden.com/";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });

  function getImages() {
    return new Promise((resolve) => {
      let images;
      const interval = setInterval(async () => {
        images = await page.evaluate(() => {
          const imgs = document.querySelectorAll("img");
          const sources = [imgs[0].src, imgs[1].src];
          for (const source of sources) {
            if (source === "") {
              return [];
            }
          }
          return sources;
        });
        if (images.length === 2) {
          clearInterval(interval);
          resolve(images);
        }
      }, 200);
    });
  }

  // block notification popup
  const context = browser.defaultBrowserContext();
  context.overridePermissions("https://littlexgarden.com/", ["notifications"]);

  const page = await browser.newPage();
  console.log("-- going to page");
  await page.goto("https://littlexgarden.com/one-piece/1/", {
    waitUntil: "networkidle0",
  });

  console.log("-- waiting for img");
  await page.waitForSelector("img");

  console.log("-- getting imgs");
  const images = await getImages();
  console.log("images are", images);

  process.on("SIGINT", async () => {
    await browser.close();
    console.log("Closing program");
  });
})();
