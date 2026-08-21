# Performance budgets

The portfolio keeps its visual identity, but no recruiter-facing route depends
on WebGL, heavyweight environmental media, or eager playback.

## Enforced budgets

- Public assets remain below 30 MB in aggregate and 10 MB per tracked file.
- EXR assets are forbidden from `public/`; the previous 30 MB global galaxy
  environment has been replaced by a CSS atmosphere.
- The home route may own at most two nearby Canvas contexts: one hero context
  and one shared below-fold context.
- Music does not preload an unplayed remote track. The magazine video requests
  metadata only and exists only while its shared visual is near the viewport.

`node scripts/verify-performance-budgets.mjs` enforces these limits without a
network connection or browser. The dedicated Performance Budgets workflow runs
the same contract for every pull request and default-branch push.

## Lifecycle contract

The server-rendered page and CSS fallback are always complete. Optional WebGL
enhancement follows these rules:

1. A scene may mount only when its visual target is near the viewport, the tab
   is visible, reduced motion is not requested, and WebGL is available.
2. The three below-fold objects share one Canvas. Only the active object's
   component and assets mount.
3. Leaving the viewport or hiding the tab unregisters the target and releases
   the Canvas context.
4. Context loss removes the enhancement and exposes the semantic fallback;
   content and navigation remain usable.

The automated contract protects structure and budgets. Deployment-preview QA
still verifies actual transfer, GPU behavior, reduced motion, and no-WebGL
rendering before launch.
