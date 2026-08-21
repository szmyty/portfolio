# Application-ready trust suite

This suite separates deterministic source checks from evidence that can only be
collected from a deployed release candidate. A passing pull-request workflow
does not claim that an external profile, feed, or deployment is currently live.

## Pull-request contracts

Run these checks without network access:

```bash
node scripts/verify-application-readiness.mjs
node scripts/check-promoted-destinations.mjs
```

They verify the route/metadata map, sitemap membership, semantic heading
owners, skip and landmark wiring, navigation ARIA, focus and reduced-motion
styles, contrast-critical theme tokens, hydration guards, remote-data state
fixtures, mobile viewport matrix, and promoted-link ownership.

## Remote-data contract

Remote data uses three independent dimensions so fallback behavior is not
hidden behind an ambiguous `data | null` value.

| Scenario        | Status      | Freshness | Source            | User-facing behavior                                    |
| --------------- | ----------- | --------- | ----------------- | ------------------------------------------------------- |
| Loading         | `loading`   | n/a       | `none`            | Polite progress status                                  |
| Empty           | `empty`     | `fresh`   | `live`            | Successful empty-state copy                             |
| Available       | `available` | `fresh`   | `live`            | Render current data                                     |
| Stale           | `available` | `stale`   | `live`            | Render data with freshness notice                       |
| Last known good | `available` | `stale`   | `last-known-good` | Preserve trusted data and name the fallback             |
| Error           | `error`     | n/a       | `none`            | Error copy and recovery path; never masquerade as empty |

The canonical fixture is
`tests/application-readiness/fixtures/api-states.json`. The
`RemoteDataStatus` stories provide reviewable UI for every non-default state.
Route-level `loading.tsx` files cover the server-fetching phase.

The GitHub dashboard also ships a dated, public snapshot of the four promoted
Ego Hygiene systems. A rate limit or network failure therefore cannot fail the
portfolio build: the service returns that last-known-good snapshot, marks each
record as such, logs the capture time, and renders a visible stale-data notice.
Empty snapshots for other scopes do not fabricate repositories.
`scripts/verify-github-fallback-build.mjs` starts a local 403 stub and runs a
full production build against it, proving the rate-limit path rather than only
inspecting source text.

## Release gate

After all launch PRs are merged and deployed, manually run the **Application
Readiness** workflow with the release-candidate origin. The release job:

1. reruns deterministic contracts;
2. performs live checks only for destinations explicitly marked `live`;
3. keeps bot-protected and non-HTTP destinations labeled `syntax`;
4. opens every recruiter-facing route in fresh Chromium contexts across the
   mobile, reduced-motion, light-theme, and desktop matrix;
5. verifies status, title, canonical, exactly one non-empty `h1`, skip-link
   focus, labeled navigation, tab order, horizontal overflow, and hydration
   console cleanliness; and
6. uploads full-page captures and traces as release evidence.

Dynamic feed links are schema/source contracts in pull requests because their
exact values change. Review representative rendered links during the release
run rather than checking transient URLs into the repository.
