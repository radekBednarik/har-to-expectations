import { createCommand } from "commander";
import { readHarFile, writeJsonFile } from "../io/io.js";
import { parser } from "../parser/har-to-expectations.js";

export const cli = createCommand();

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
    await writeJsonFile(expectations, jsonPath);
  });
