import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const fixturePath = join(
  root,
  "tests/application-readiness/fixtures/promoted-destinations.json",
);
const responseFixturePath = join(
  root,
  "tests/application-readiness/fixtures/destination-responses.json",
);
const destinations = JSON.parse(readFileSync(fixturePath, "utf8"));
const responseFixtures = JSON.parse(readFileSync(responseFixturePath, "utf8"));
const live = process.argv.includes("--live");
const setupScreenPattern =
  /complete setup|finish setup|site not configured|deployment not found/i;

function classifyResponse(input, expectedHost) {
  if (input.error) {
    return "broken";
  }

  if (
    !Number.isInteger(input.status) ||
    input.status < 200 ||
    input.status >= 400
  ) {
    return "broken";
  }

  let finalUrl;
  try {
    finalUrl = new URL(input.finalUrl);
  } catch {
    return "broken";
  }

  if (expectedHost && finalUrl.hostname !== expectedHost) {
    return "broken";
  }

  if (setupScreenPattern.test(input.body ?? "")) {
    return "broken";
  }

  return "ok";
}

function validateSyntax(destination) {
  if (destination.url.startsWith("mailto:")) {
    return /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(destination.url);
  }

  try {
    const url = new URL(destination.url);
    return (
      url.protocol === "https:" &&
      (!destination.expectedHost || url.hostname === destination.expectedHost)
    );
  } catch {
    return false;
  }
}

let failed = false;

for (const testCase of responseFixtures.cases) {
  const actual = classifyResponse(testCase.input, testCase.expectedHost);
  if (actual !== testCase.expected) {
    console.error(
      `ERROR: response fixture ${testCase.id} expected ${testCase.expected}, received ${actual}`,
    );
    failed = true;
  }
}

for (const destination of destinations.staticDestinations) {
  if (!validateSyntax(destination)) {
    console.error(`ERROR: ${destination.id} has an invalid destination URL`);
    failed = true;
  }
}

if (live) {
  for (const destination of destinations.staticDestinations) {
    if (destination.verification !== "live") {
      console.log(`SYNTAX: ${destination.id} (${destination.url})`);
      continue;
    }

    try {
      const response = await fetch(destination.url, {
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "szmyty-portfolio-release-readiness/1.0",
        },
      });
      const body = (await response.text()).slice(0, 250_000);
      const result = classifyResponse(
        {
          status: response.status,
          finalUrl: response.url,
          body,
        },
        destination.expectedHost,
      );

      if (result === "ok") {
        console.log(
          `LIVE: ${destination.id} -> ${response.status} ${response.url}`,
        );
      } else {
        console.error(
          `ERROR: ${destination.id} failed live verification (${response.status} ${response.url})`,
        );
        failed = true;
      }
    } catch (error) {
      console.error(
        `ERROR: ${destination.id} live verification failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      failed = true;
    }
  }
} else {
  console.log(
    `Verified ${responseFixtures.cases.length} response fixtures and ${destinations.staticDestinations.length} promoted destination contracts without network access.`,
  );
  console.log(
    "RELEASE: run with --live only against the release candidate; fixture checks do not claim destination availability.",
  );
}

if (failed) {
  process.exitCode = 1;
}
