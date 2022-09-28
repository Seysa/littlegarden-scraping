import { join } from "path/posix";

export const website = "https://littlexgarden.com/";

export function getLink(manga: string, chapter?: number, page?: number) {
  let result = website + join(manga);
  if (chapter !== undefined) result = join(result, chapter.toString());
  if (page !== undefined) result = join(result, page.toString());
  return result;
}
