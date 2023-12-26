import { cli } from "./cli/cli.js";

(async () => {
  const parsed = await cli.parseAsync(process.argv);
  console.log("parsed", parsed.args);
})();
