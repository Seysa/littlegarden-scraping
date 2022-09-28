import { Browser } from "puppeteer-core";
import { navigateToMangaPage } from "./browser";
import { getCurrentImageSrc, getNumberOfPagesOfChapter } from "./extract";
import { getFilenameAndMakePath } from "./link";
import { writeFile } from "fs/promises";

export async function downloadChapter(
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

export async function downloadImage(
  browser: Browser,
  url: string,
  filename: string
) {
  const page = await browser.newPage();
  const viewSource = await page.goto(url);
  if (!viewSource) {
    throw new Error("No viewsource for " + url);
  }
  try {
    await writeFile(filename, await viewSource.buffer());
    console.log("file", filename, "was succesfully saved");
  } catch (e) {
    console.error("error during the download of", filename, ":", e);
  } finally {
    page.close();
  }
}
