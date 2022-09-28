import puppeteer, { Browser, Page, WaitForOptions } from "puppeteer-core";
import { blockNotifications } from "./browser";
import { getCurrentImageSrc, getImagesFromPage } from "./extract";
import { getLink } from "./link";

const navigateToMangaPage = async (
  browser: Browser,
  manga: string,
  chapter: number,
  page: number
) => {
  const p = await browser.newPage();
  const link = getLink(manga, chapter, page);
  const options: WaitForOptions = {
    waitUntil: "networkidle0",
  };
  await p.goto(link, options);
  return p;
};

const getNumberOfPagesOfChapter = async (page: Page) => {
  const raw = await page.evaluate(() => {
    return document.querySelector("div.total-pages")?.textContent;
  });
  if (!raw) {
    throw new Error("Could not access total pages element, got " + raw);
  }
  // match a digit at least once
  const match = raw.match(/[0-9]+/);
  if (!match) {
    throw new Error(
      "No numbers found in match for total pages element, got " + raw
    );
  }
  return match[0];
};

console.log("--- Starting");
main();

async function downloadChapter(
  browser: Browser,
  manga: string,
  chapter: number
) {
  let currentPageNumber = 1;
  const page = await navigateToMangaPage(
    browser,
    "one-piece",
    1,
    currentPageNumber
  );
  const nextPageButton = await page.$("#touch > div:nth-child(2)");
  if (!nextPageButton) {
    throw new Error("Couldn't get next page button");
  }
  const pages = +(await getNumberOfPagesOfChapter(page));
  if (isNaN(pages)) {
    throw new Error(
      "number of manga pages from page couldn't be parsed as number"
    );
  }
  const srcs: string[] = [];
  for (; currentPageNumber <= pages; currentPageNumber++) {
    const src = await getCurrentImageSrc(page);
    srcs.push(src);
    await nextPageButton.click();
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  blockNotifications(browser);
  console.log("--- Browser instanciated");

  const page = await navigateToMangaPage(browser, "one-piece", 1, 1);
  const pages = await getNumberOfPagesOfChapter(page);
  console.log("there is", pages, "pages");
  const imgSrc = await getCurrentImageSrc(page);
  console.log("current image src is", imgSrc);
  const nextPage = await page.$("#touch > div:nth-child(2)");
  await nextPage?.click();
  console.log("next page is", await getCurrentImageSrc(page));
}
