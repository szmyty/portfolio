# Translation messages

- Translations live in `/home/runner/work/portfolio/portfolio/messages/en.json`.
- Group keys by feature or page namespace (for example `NavBar`, `GitHub`, `PublishingPage`, `ThemeToggle`).
- Reuse existing copy where possible and keep keys descriptive instead of abbreviating them.
- Use `getTranslations` in async server components/pages and `useTranslations` in client or shared components.
- Add new keys to `en.json` first, then replace inline UI strings with translation lookups.
- Missing translations fall back to their key path so the app does not crash while new copy is being wired up.
