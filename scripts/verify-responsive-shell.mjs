import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function requireText(source, fragment, label) {
  if (!source.includes(fragment)) {
    errors.push(`${label} is missing ${JSON.stringify(fragment)}`);
  }
}

const nav = read("src/components/ui/NavBar/NavBar.tsx");
const appNav = read("src/components/app/AppNavBar/AppNavBar.tsx");
const mainContent = read("src/features/landing/MainContent/MainContent.tsx");
const pageShell = read("src/components/ui/PageShell/PageShell.tsx");
const footer = read("src/features/landing/Footer/Footer.tsx");
const styles = read("src/app/globals.css");
const messages = JSON.parse(read("messages/en.json"));

for (const route of [
  "/",
  "/music",
  "/publishing",
  "/research",
  "/development",
  "/insights",
]) {
  requireText(appNav, `href: "${route}"`, `primary destination ${route}`);
}

requireText(nav, "aria-expanded={isMobileMenuOpen}", "mobile disclosure");
requireText(nav, "aria-controls={menuId}", "mobile disclosure");
requireText(nav, 'event.key !== "Escape"', "keyboard close behavior");
requireText(nav, "menuButtonRef.current?.focus()", "focus restoration");
requireText(nav, "onNavigate={onNavigate}", "route navigation close behavior");
requireText(nav, "lg:hidden", "mobile navigation breakpoint");
requireText(
  nav,
  "hidden min-w-0 flex-1 lg:block",
  "desktop navigation breakpoint",
);
requireText(appNav, "mobileActions", "simplified mobile actions");

for (const source of [mainContent, pageShell]) {
  requireText(source, "site-header", "safe-area header");
}
requireText(footer, "site-footer", "safe-area footer");
requireText(styles, "env(safe-area-inset-top)", "top safe area");
requireText(styles, "env(safe-area-inset-right)", "right safe area");
requireText(styles, "env(safe-area-inset-bottom)", "bottom safe area");
requireText(styles, "env(safe-area-inset-left)", "left safe area");
requireText(styles, "overflow-y: auto", "bounded mobile menu");
requireText(styles, "scroll-padding-top", "fixed-header scroll offset");

for (const message of [
  "ariaLabel",
  "brand",
  "menu",
  "closeMenu",
  "repository",
]) {
  if (!messages.NavBar?.[message]) {
    errors.push(`NavBar translation is missing ${JSON.stringify(message)}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    "Verified all primary destinations, responsive disclosure semantics, and four-edge safe-area coverage.",
  );
}
