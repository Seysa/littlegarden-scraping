import puppeteer from "puppeteer-core";
import { blockNotifications } from "./browser";
import { downloadChapter } from "./downloader";

console.log("--- Starting");
main();

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  blockNotifications(browser);
  console.log("--- Browser instanciated");

  const srcs = await downloadChapter(browser, "one-piece", 2);
  console.log(srcs);
  await browser.close();
}
