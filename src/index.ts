import { cli } from "./cli/cli.js";
import { logger } from "./logger/logger.js";

const log = logger.child({ module: "main" });

(async () => {
  try {
    log.info("starting CLI program");

    await cli.parseAsync(process.argv);
  } catch (err: any) {
    log.fatal(`program returned error: ${err}`);

    process.exit(1);
  }
})();
