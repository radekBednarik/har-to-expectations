import { cli } from "./cli/cli.js";

(async () => {
  try {
    
    await cli.parseAsync(process.argv);

  } catch (err: any) {
    console.error("program returned error: ${err}");
    process.exit(1);    
  }
})();
