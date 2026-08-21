import { once } from "node:events";
import { createServer } from "node:http";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const server = createServer((_request, response) => {
  response.writeHead(403, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ message: "API rate limit exceeded" }));
});

server.listen(0, "127.0.0.1");
await once(server, "listening");

const address = server.address();
if (!address || typeof address === "string") {
  server.close();
  throw new Error("Unable to allocate the GitHub fallback test server");
}

const nextBin = join(root, "node_modules/next/dist/bin/next");
const child = spawn(process.execPath, [nextBin, "build"], {
  cwd: root,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    PORTFOLIO_GITHUB_API_BASE_URL: `http://127.0.0.1:${address.port}`,
  },
  stdio: "inherit",
});

const [code, signal] = await once(child, "exit");
await new Promise((resolve, reject) => {
  server.close((error) => (error ? reject(error) : resolve()));
});

if (code !== 0) {
  console.error(
    `ERROR: fallback build exited with ${code ?? `signal ${String(signal)}`}`,
  );
  process.exitCode = code || 1;
} else {
  console.log(
    "Verified the production build survives a simulated GitHub API rate limit by serving the dated last-known-good snapshot.",
  );
}
