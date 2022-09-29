import archiver from "archiver";
import { createWriteStream } from "fs";
import { basename } from "path";
import { getCbz, getFolder } from "./link";

/**
 * @param {String[]} source is an array of path
 * @param {String} out is the filename
 * @param {Boolean} flat true if you want no subdirectories in the zip
 */
export async function zipDirectories(
  source: string[],
  out: string,
  flat?: boolean
): Promise<string> {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = createWriteStream(out);

  return new Promise((resolve, reject) => {
    source.forEach((s) => {
      archive.directory(s, flat ? false : basename(s));
    });
    archive.on("error", (err) => reject(err)).pipe(stream);

    stream.on("close", () => resolve(out));
    archive.finalize();
  });
}

export async function zipManga(manga: string, chapter: number) {
  const folderPath = getFolder(manga, chapter);

  zipDirectories([folderPath], getCbz(manga, chapter));
}
