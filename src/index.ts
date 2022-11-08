import { config } from "dotenv";
import puppeteer from "puppeteer-core";
import { blockNotifications } from "./browser";
import { downloadChapter } from "./downloader";
import { log } from "./logging";

config();
if (!process.env.CHROME) {
  throw new Error("No chrome specified in .env file");
}
log(process.env.CHROME);
log("--- Starting");
main();
log("--- Done");

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath: process.env.CHROME,
  });
  blockNotifications(browser);
  log("--- Browser instanciated");

  const i = 1;
  const srcs = await downloadChapter(browser, "one-piece", i);
  log(srcs.length, "images downloaded for chapter", i);
  await browser.close();
}
