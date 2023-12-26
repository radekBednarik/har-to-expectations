import { createCommand } from "commander";

export const cli = createCommand();

cli
  .command("convert")
  .description("converts .har file to .json file with expectations.")
  .argument("<harPath>", "path to .har source file")
  .argument("<jsonPath>", "path to .json destination file")
  .argument(
    "<regex>",
    "regExp which will filter wanted requests/responses to be converted into expectations",
  );
