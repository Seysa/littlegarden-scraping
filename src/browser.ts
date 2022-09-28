import { Browser, WaitForOptions } from "puppeteer-core";
import { getLink, website } from "./link";

export function blockNotifications(browser: Browser) {
  const context = browser.defaultBrowserContext();
  context.overridePermissions(website, ["notifications"]);
}

export async function navigateToMangaPage(
  browser: Browser,
  manga: string,
  chapter: number,
  page: number
) {
  const p = await browser.newPage();
  const link = getLink(manga, chapter, page);
  const options: WaitForOptions = {
    waitUntil: "networkidle0",
  };
  await p.goto(link, options);
  return p;
}
