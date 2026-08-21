import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const root = process.cwd();
const routeFixture = JSON.parse(
  readFileSync(
    join(root, "tests/application-readiness/fixtures/routes.json"),
    "utf8",
  ),
);

const hydrationPattern =
  /hydration failed|hydration mismatch|did not match|server rendered html|text content does not match/i;

for (const route of routeFixture.routes) {
  test(`${route.path} passes the release browser contract`, async ({
    page,
  }, testInfo) => {
    const expectedTheme =
      testInfo.project.use.colorScheme === "light" ? "light" : "dark";
    const browserErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        browserErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));

    await page.addInitScript((theme) => {
      localStorage.setItem("theme-preference", theme);
    }, expectedTheme);

    const response = await page.goto(route.path, {
      waitUntil: "domcontentloaded",
    });
    expect(
      response,
      `${route.path} did not return a document response`,
    ).not.toBeNull();
    expect(
      response.status(),
      `${route.path} returned ${response.status()}`,
    ).toBeLessThan(400);

    await expect(page).toHaveTitle(route.title);
    expect(
      await page.evaluate(() =>
        document.documentElement.hasAttribute("data-theme")
          ? document.documentElement.getAttribute("data-theme")
          : "dark",
      ),
    ).toBe(expectedTheme);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new URL(route.canonical, routeFixture.siteOrigin).href,
    );

    const headings = page.locator("h1");
    await expect(headings).toHaveCount(1);
    await expect(headings.first()).not.toHaveText(/^\s*$/);

    const main = page.locator("#main-content");
    await expect(main).toHaveCount(1);
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeVisible();

    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    await page.keyboard.press("Tab");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(main).toBeFocused();

    const positiveTabIndexes = await page
      .locator("[tabindex]")
      .evaluateAll((elements) =>
        elements
          .map((element) => Number(element.getAttribute("tabindex")))
          .filter((value) => value > 0),
      );
    expect(positiveTabIndexes).toEqual([]);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(
      overflow,
      `${route.path} has horizontal overflow`,
    ).toBeLessThanOrEqual(1);

    const reducedMotion = testInfo.project.use.reducedMotion === "reduce";
    expect(
      await page.evaluate(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ),
    ).toBe(reducedMotion);

    await page.waitForTimeout(1_000);
    expect(
      browserErrors.filter((message) => hydrationPattern.test(message)),
    ).toEqual([]);

    const capturePath = testInfo.outputPath("full-page.png");
    await page.screenshot({
      path: capturePath,
      fullPage: true,
      animations: "disabled",
    });
    await testInfo.attach("full-page", {
      path: capturePath,
      contentType: "image/png",
    });
  });
}
