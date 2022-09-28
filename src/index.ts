import puppeteer, { Browser, Page, WaitForOptions } from "puppeteer-core";
import { blockNotifications } from "./browser";
import { getCurrentImageSrc } from "./extract";
import { getFilenameAndMakePath, getLink } from "./link";
import fs from "fs/promises";

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
    manga,
    chapter,
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
  // < pages because last page is not an image
  for (; currentPageNumber < pages; currentPageNumber++) {
    const src = await getCurrentImageSrc(page);
    console.log(currentPageNumber, src);
    await downloadImage(
      browser,
      src,
      getFilenameAndMakePath(manga, chapter, currentPageNumber)
    );
    srcs.push(src);
    await nextPageButton.click();
  }
  return srcs;
}

async function downloadImage(browser: Browser, url: string, filename: string) {
  const page = await browser.newPage();
  const viewSource = await page.goto(url);
  if (!viewSource) {
    throw new Error("No viewsource for " + url);
  }
  try {
    await fs.writeFile(filename, await viewSource.buffer());
    console.log("file", filename, "was succesfully saved");
  } catch (e) {
    console.error("error during the download of", filename, ":", e);
  } finally {
    page.close();
  }
}

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
