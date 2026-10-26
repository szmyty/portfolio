# Descript film showcase

`/descript` is a dedicated application showcase for **Manifest**, Alan's original
song and cinematic video. It introduces the film, lets the viewer choose among
three versions, and explains the creative workflow. It is separate from the
portfolio's global navigation and is marked `noindex`; this is a discoverability
choice, not access control. Anyone with the page or media URL can open it.

Alan approved the design and authorized the lowercase title correction and PR
merge on October 25, 2026. Preparing this page does not submit an application. The actual videos and their post-compression sizes have not been
verified by the page implementation.

## Connect the videos

Edit **`src/config/descript.ts`**. This is the single configuration file for media
URLs and the optional Descript share link. Save, commit, and redeploy the portfolio
after changing it. A missing source stays `null`; do not add sample URLs or pretend
that an unconfigured film is playable.

| Config field       | Original export                   | Purpose                                                |
| ------------------ | --------------------------------- | ------------------------------------------------------ |
| `final.src`        | `manifest_descript_subbed_v1.mp4` | Main showcase: Descript version with baked-in captions |
| `edited.src`       | `manifest_descript_v1.mp4`        | Descript edit without the baked-in captions            |
| `original.src`     | `manifest.mp4`                    | Original cut before Descript finishing                 |
| `poster`           | `/images/descript/manifest.webp`  | Film artwork shown before playback                     |
| `descriptShareUrl` | Optional published Descript link  | Direct access to the project in Descript's viewer      |

Use the corresponding compressed web copy when one has been reviewed. File names
do not establish quality, codec, duration, or a measured reduction in size.

Public **HTTPS** video URLs are recommended, for example URLs returned after
uploading the three reviewed MP4s to a public Vercel Blob store. Same-origin paths
such as `/media/descript/manifest.mp4` are also supported if those files are
actually served by the deployment. Large exports can remain in dedicated media
storage while the portfolio contains only the viewer and configuration.

These values are public frontend content. Do not put storage tokens, private
Drive links, expiring authenticated download links, private application PDFs,
career records, or secrets in this file. Use stable links that a recruiter can
open without signing into Alan's accounts.

## Optional subtitle tracks

Each version has a nullable `captions` field. Supply a public **WebVTT** (`.vtt`)
URL if a separate English caption track is available. An SRT file must be
converted to WebVTT first; renaming its extension alone is not a conversion.

The final version already has baked-in captions, so it works with
`final.captions: null`. Adding an identical separate track may show duplicate
captions when enabled. Leave it unset unless a separate accessible track is
intended. Cross-origin caption hosting must permit the browser's caption request
through CORS; verify it in the deployed player.

## Validate before sending the application

The following are setup and review steps, not claims that hosted playback has
already passed. The implementation's PR records the checks actually performed.

1. Open each configured media URL in a signed-out or private browser window.
   Confirm it serves the intended video rather than a login page or download
   error. Check the poster and optional Descript share link too.
2. Confirm media response headers identify MP4 video and that playback and
   seeking work. For an optional header check, assign the actual public URL to
   `descript_video_url`, then run:

   ```bash
   curl --head --location --fail --show-error --silent "$descript_video_url"
   ```

   A successful HEAD response alone does not prove playback, correct content,
   caption access, or browser codec support.

3. Visit `/descript` on the local preview or PR deployment. Confirm the captioned
   final is the initial selection, each version selects the correct source,
   switching stops the previous playback, and playback starts only after an
   intentional user action.
4. Test keyboard focus and version switching, native play/pause, seeking, volume,
   and fullscreen. Check mobile portrait and landscape layouts, desktop layouts,
   and reduced-motion preferences. Captions and important artwork must remain
   legible without cropping the film.
5. Test an unset source and a temporarily invalid source in a local working copy.
   The page should offer a readable state rather than broken controls. Restore
   reviewed URLs before publishing. Test optional WebVTT tracks in a real browser
   if configured.
6. After the owner merges and the deployment finishes, open
   `https://szmyty.vercel.app/descript` in a signed-out browser and repeat a brief
   playback check before copying that link into the application. If using the
   employer's Descript-video review route, also provide the actual public
   Descript share link requested by the form.

## Continue this work

The route is intentionally absent from the global menu and search indexing.
Media URLs remain unset until the owner has reviewed and uploaded the videos.
Next: connect the three exports in `src/config/descript.ts`, verify playback and
the captioned default on the deployed page, then let Alan complete the employer's
application. No application submission or employer contact is automated here.

## Artwork provenance

The poster is a web derivative of Alan's retained `manifest_v2.png` artwork.
The original PNG is retained separately; only its duplicate in the portfolio's
public assets was replaced. No resizing, cropping, composition changes, or new
visual elements were applied.

- Source: `manifest_v2.png`, 3,640,352 bytes, SHA-256 `727746450bb81782f0e4497866c496a442363797faeada91760fbeee60f69538`.
- Web asset: `public/images/descript/manifest.webp`, 375,530 bytes, SHA-256 `2b57385bd203bb99274b43c4255e204e4d30835d6d13b3b41fbfdf7de78954e4`.
- Dimensions: 1254 × 1254 pixels, preserved from the source.
- Conversion: Sharp 0.35.5, WebP quality 90, effort 6. This is a lossy web optimization, not a lossless archival replacement.

## Implementation checkpoint — October 25, 2026

Prepared in [portfolio PR296](https://github.com/szmyty/portfolio/pull/296), branch
`feat/descript-manifest-showcase`. Alan approved the design and authorized the
lowercase title correction and merge on October 25; video hosting remains pending.

Production build, TypeScript, scoped ESLint, the existing homepage/3D/responsive/
selected-work contracts, static application-readiness checks, promoted-destination
fixtures and performance budgets passed locally. Full lint completed with ten
pre-existing warnings outside this feature. The Vercel branch deployment completed
successfully. Hosted Actions jobs did not start; they are not reported as passing.

Browser visual QA remains unverified: the managed local preview runner supplied
Vite-only flags to the Next.js command; the Vercel branch preview redirected this
browser to sign-in. No working application code or security settings were changed
to compensate. Native playback, seeking, real-media switching, and the final
mobile visual check still require the actual configured videos and signed-in
preview or production access.

The route's built HTML was checked for the `/descript` canonical URL, `noindex`,
Manifest artwork/social metadata, and absence of broken video elements while
URLs are unset. All pre-existing repository files remain intact.

## Upload handoff

Keep the existing MP4 filenames. In the Vercel portfolio project, open Storage,
create a Blob store with public access (or use an existing connected public Blob
store), and upload the reviewed web copies in the store browser. Copy each file's
ordinary public URL. The filename-to-slot mapping above is authoritative; upload
alone does not connect the player. Add the three returned URLs to the config and
redeploy, then verify playback before submitting the application.
