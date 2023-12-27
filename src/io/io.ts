import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { Har } from "har-format";

export async function readHarFile(filepath: string) {
  const fullPath = resolve(filepath);

  try {
    return JSON.parse(await readFile(fullPath, { encoding: "utf-8" })) as Har;
  } catch (err: any) {
    console.error(`func readHarFile returned error: ${err}`);
    throw err;
  }
}

export async function writeJsonFile(data: any, filepath: string) {
  const fullPath = resolve(filepath);

  try {
    await writeFile(fullPath, JSON.stringify(data, null, 2));
  } catch (err: any) {
    console.error(`func writeJsonFile returned error: ${err}`);
    throw err;
  }
}
