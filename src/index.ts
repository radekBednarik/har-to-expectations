import { cli } from "./cli/cli.js";

(async () => {
  await cli.parseAsync(process.argv);
})();
