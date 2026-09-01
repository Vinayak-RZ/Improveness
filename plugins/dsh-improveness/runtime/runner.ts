import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const checkout = join(here, "../../../harness/omp/drivers/dsh-core-runner.ts");
const bundled = join(here, "dsh-core-runner.ts");
const target = existsSync(bundled) ? bundled : checkout;
const { serveStdin } = await import(pathToFileURL(target).href);
await serveStdin();
