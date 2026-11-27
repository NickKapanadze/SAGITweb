# SAGIT website

A bilingual Georgian/English university website. The redesign keeps the original crest, burgundy/gold identity, campus imagery, and student voice. SAGIT is a roleplay university: all public content stays in character and never describes the project as humor or satire. Keep the language switcher, but do not restore the discarded KA/EN promotional block.

## Develop and validate

Requires Node 20 or newer. No npm dependencies or paid APIs.

```sh
npm run build
npm run check
npm run preview
```

Preview: http://127.0.0.1:4173. Stop the preview with Ctrl+C.

Edit page content and templates in `scripts/build.mjs`, visual styles in `assets/style/site.css`, and browser behavior in `assets/js/site.js`. Build regenerates the root HTML files (compatible with the original static host) and publishes the same pages to `dist/`. Georgian content remains readable without JavaScript; English selection persists when browser storage is available. Fonts use the free Google Fonts service with system fallbacks.

## Render static hosting

- Repository: `https://github.com/NickKapanadze/SAGITweb`
- Service type: **Static Site**
- Build command: `npm run build`
- Publish directory: `dist`
- A matching `render.yaml` is included; no server, database, paid assets, or background worker is needed.

Static hosting is free within Render's included usage. Account-level bandwidth/build overages can still apply when billing is enabled. Verify account billing controls before changing DNS; maintain the user's $0 budget. Do not select paid compute or add a payment method for this project.

## Domain cutover

Verify the Render deployment first. Add both `www.sagit.com.ge` and `sagit.com.ge` to its Custom Domains settings, then use the exact DNS instructions Render returns. Preserve unrelated Cloudflare records, particularly mail records. Record the previous web DNS values before changing them. Verify HTTPS on both hosts, canonical redirects, the served build, the 404 page, and mobile navigation after propagation. This repository's CNAME is retained for compatibility with the existing hosting.

## Content and privacy

All public copy speaks as the university. The contact page links to the existing Instagram account `@sgt_uni`; it does not pretend to send messages or collect identity documents. Generic social links, unverified contact details, expired admission dates, and the expired countdown were removed. New admissions dates await publication rather than being invented. Program filters, native expandable details, mobile navigation, and language selection are implemented without external JavaScript dependencies.

## Interactive campus

The homepage and `/campus.html` use the 14 destinations in the Instagram plan as their layout reference. `assets/js/campus-model.js` contains named destinations, bilingual copy, and architectural geometry. It is a schematic interpretation of a low-resolution plan, not surveyed dimensions or verified building heights. Only Business and Humanities have dedicated named school buildings in the plan; other school links use the academic quarter rather than inventing separate building positions.

`scripts/campus-template.mjs` creates the interface and an SVG landscape visible before JavaScript loads. The locally served renderer loads on demand, uses Canvas with projected 3D geometry, and redraws only for interaction, camera transitions, resizing, or language changes. It does not use a 3D engine, external map API, paid service, downloaded mesh, video, or continuous animation. Render resolution is capped at 1.75 device pixels per CSS pixel. Reduced-motion preferences skip camera animation.

Visitors can select numbered pins or the destination list, filter by learning/life/sport, rotate, zoom, switch to a top-down plan, and open school pages. Campus deep links use `?place=business`, `?place=humanities`, or any destination key. School pages link into the relevant campus location. Touch devices retain vertical page scrolling; horizontal drag rotates. Zoom buttons work on all devices; modified wheel and pinch zoom are supported.

The source plan is preserved in `references/` and published at `/assets/images/campus-plan.jpg`. It is the profile-size public image, not verified original resolution. Both no-JavaScript and canvas-unavailable paths preserve a static landscape and links. `npm run check` verifies plan geography, destinations, finite camera projection, school links, and compressed-size budgets alongside the page/link checks.
