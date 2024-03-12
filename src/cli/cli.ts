import { createCommand } from "commander";
import { readHarFile, readJsonFile, writeJsonFile } from "../io/io.js";
import { parser, merger } from "../parser/har-to-expectations.js";
import { logger } from "../logger/logger.js";

const log = logger.child({ module: "cli" });

log.debug("Initializing CLI");

export const cli = createCommand();

log.debug("CLI initialized");

cli
  .command("convert")
  .description("converts .har file to .json file with expectations.")
  .argument("<harPath>", "path to .har source file")
  .argument("<jsonPath>", "path to .json destination file")
  .argument(
    "<regex>",
    "regExp which will filter wanted requests/responses to be converted into expectations",
  )
  .action(async (harPath, jsonPath, regex) => {
    const harObject = await readHarFile(harPath);
    const expectations = parser(harObject, regex);

    if (expectations !== null) {
      await writeJsonFile(expectations, jsonPath);
    }
  });

cli
  .command("merge")
  .description("merge existing .json expectations file with generated .har file")
  .argument("<harPath>", "path to .har source file")
  .argument("<jsonPath>", "path to .json expectations destination file")
  .argument(
    "<regex>",
    "regExp which will filter wanted requests/responses to be converted into expectations",
  )
  .option("-u, --update [bool]", "whether to update existing expectations in .json file", false)
  .action(async (harPath, jsonPath, regex, options) => {
    const harObject = await readHarFile(harPath);
    const existingJsonObject = await readJsonFile(jsonPath);
    const parsedHarObject = parser(harObject, regex);

    if (parsedHarObject !== null) {
      const merged = merger(existingJsonObject, parsedHarObject, options.update);
      await writeJsonFile(merged, jsonPath);
    }
  });
