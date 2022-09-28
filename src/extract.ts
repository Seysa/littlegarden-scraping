import { Page } from "puppeteer-core";

// do `fun` until resolve or reject is used
// param can be sync or async
export function doUntil(
  fun: (resolve: any, reject: any) => Promise<void> | void
) {
  return new Promise((resolve, reject) => {
    const customResolve = (param: any) => {
      clearInterval(interval);
      resolve(param);
    };
    const customReject = (param: any) => {
      clearInterval(interval);
      reject(param);
    };
    const interval = setInterval(async () => {
      await fun(customResolve, customReject);
    }, 200);
  });
}

/**
 *
 * @param page to get images from
 * @returns array of the images' src
 */
export function getImagesFromPage(page: Page) {
  return new Promise((resolve) => {
    // create loop that runs every 200 ms
    const interval = setInterval(async () => {
      let images = [];
      const getImagesSrc = () => {
        const sources: string[] = [];
        const imgs = document.querySelectorAll("img");
        imgs.forEach((img) => {
          if (img.src) {
            sources.push(img.src);
          }
        });
        for (const source of sources) {
          if (source === "") {
            return [];
          }
        }
        return sources;
      };

      images = await page.evaluate(getImagesSrc);
      if (images.length >= 2) {
        clearInterval(interval);
        resolve(images);
      }
    }, 200);
  });
}

export async function getCurrentImageSrc(page: Page) {
  const result = await doUntil(async (resolve, reject) => {
    const src = await page.evaluate(() => {
      const img = document.querySelector("#curr > img") as
        | HTMLImageElement
        | undefined;
      if (!img) return null;
      return img.src;
    });
    if (src) resolve(src);
  });
  return result;
}
