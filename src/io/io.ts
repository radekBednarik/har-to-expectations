import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { Har } from "har-format";
import { logger } from "../logger/logger.js";

const log = logger.child({ module: "io" });

export async function readHarFile(filepath: string) {
  const fullPath = resolve(filepath);

  log.info(`reading .har file from ${fullPath}`);

  try {
    return JSON.parse(await readFile(fullPath, { encoding: "utf-8" })) as Har;
  } catch (err: any) {
    log.error(`func readHarFile returned error: ${err}`);
    throw err;
  }
}

export async function readJsonFile(filepath: string) {
  const fullpath = resolve(filepath);

  log.info(`reading .json file from ${fullpath}`);

  try {
    return JSON.parse(await readFile(fullpath, { encoding: "utf8" })) as any;
  } catch (err: any) {
    log.error(`func readJsonFile returned error: ${err}`);
    throw err;
  }
}

export async function writeJsonFile(data: any, filepath: string) {
  const fullPath = resolve(filepath);

  log.info(`writing JSON data to ${fullPath}`);

  try {
    await writeFile(fullPath, JSON.stringify(data, null, 2));
  } catch (err: any) {
    log.error(`func writeJsonFile returned error: ${err}`);
    throw err;
  }
}
