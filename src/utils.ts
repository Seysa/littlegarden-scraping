//@ts-ignore
import webpConverter from "webp-converter";
import { rm } from "fs/promises";

export function toNDigits(num: string | number, digits: number): string {
  if (typeof num === "number") {
    return toNDigits(num.toString(), digits);
  }
  let addedZeros = digits - num.length;
  // this prevents error if number is bigger than the number of digits
  if (addedZeros < 0) addedZeros = 0;
  return "0".repeat(addedZeros) + num;
}

export async function convertWebpToPng(filename: string, remove = true) {
  const webp = filename.replace(/\.webp|.png/g, ".webp");
  const png = filename.replace(/\.webp|.png/g, ".png");
  await webpConverter.dwebp(webp, png, "-o");
  try {
    if (remove) await rm(webp);
  } catch (e){
    //ignore
    console.error(e);
  }
}
