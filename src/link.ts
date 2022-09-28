import { join } from "path/posix";
import { toNDigits } from "./utils";
import fs from "fs";

export const website = "https://littlexgarden.com/";

export function getLink(manga: string, chapter?: number, page?: number) {
  let result = website + join(manga);
  if (chapter !== undefined) result = join(result, chapter.toString());
  if (page !== undefined) result = join(result, page.toString());
  return result;
}

export function getFolder(manga: string, chapter: number) {
  return `manga/${manga}/${toNDigits(chapter, 4)}`;
}

export function getFilename(manga: string, chapter: number, page: number) {
  const filename = toNDigits(page, 3) + ".webp";
  return join(getFolder(manga, chapter), filename);
}

export function getFilenameAndMakePath(
  manga: string,
  chapter: number,
  page: number
) {
  fs.mkdirSync(getFolder(manga, chapter), { recursive: true });
  return getFilename(manga, chapter, page);
}
