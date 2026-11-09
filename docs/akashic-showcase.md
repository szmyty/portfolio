# Akashic film showcase

`/akashic` mirrors the cinematic presentation of `/descript`, with its own copy,
metadata, and portrait/landscape selector. The portrait film is selected first.
The landscape slot is for a separate film sharing the song and theme.

The route stays out of the global menu and sitemap and uses `noindex`, matching
the existing showcase while the films are being prepared. This is a public page
available to anyone with its URL; `noindex` is not access control.

## Connect the exports

Edit `src/config/akashic.ts`. Until the real upload URLs are provided, `src`,
`captions`, and `poster` are `null`. An unset source shows a readable pending
state without mounting a broken video or a fake play button.

| Field                                        | Asset                                     |
| -------------------------------------------- | ----------------------------------------- |
| `portrait.src`                               | Reviewed portrait MP4, 9:16               |
| `landscape.src`                              | Separate landscape MP4, 16:9, when ready  |
| `portrait.poster` / `landscape.poster`       | Optional matching public artwork or frame |
| `portrait.posterAlt` / `landscape.posterAlt` | Description of the actual poster          |
| `portrait.captions` / `landscape.captions`   | Optional separate English WebVTT track    |

1. Finish and review the portrait export, including the audio and subtitles.
2. In the portfolio's Vercel project, open Storage and the existing public Blob
   store used for the Manifest films. Upload the reviewed web export.
3. Copy the file's returned ordinary public HTTPS URL into `portrait.src`.
   Uploading a file alone does not connect the viewer. Never guess its URL from
   a filename or put a storage token in this frontend configuration.
4. Leave `landscape.src` as `null` until its actual film is available. The
   portrait can be published independently.
5. If captions are baked into the video, leave the separate caption field unset
   unless an additional accessible track is intended. SRT needs conversion to
   WebVTT; changing its extension is insufficient. Verify caption CORS when a
   separate cross-origin track is used.
6. Commit the configuration and redeploy. Verify the final public
   `https://szmyty.vercel.app/akashic` page after the merge/deployment.

Only stable public HTTPS URLs or served same-origin paths are supported. Do not
commit video binaries, credentials, private Drive links, or expiring download
links. Poster images are optional and served directly; no unrelated artwork is
used as a substitute for an Akashic poster.

## Review

- Confirm the Akashic title and canonical URL, portrait default, and honest
  pending state for each unconfigured film.
- Check both format buttons, keyboard focus, mobile/desktop layout, and full
  frames without cropping. Portrait keeps 9:16; landscape keeps 16:9 on mobile
  as well as desktop.
- With actual sources, check intentional playback, pause, seeking, sound,
  fullscreen, and beginning/middle/end synchronization. Only the selected source
  is mounted; switching films releases the previous player.
- Check a temporary invalid source locally: retry and the direct link should be
  available. Restore the reviewed URL before publishing.
- The page implementation and build do not establish real-video playback or
  audio quality. Record those checks after the actual exports are connected.
