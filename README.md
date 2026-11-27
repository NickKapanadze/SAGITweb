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

Edit shared pages in `scripts/build.mjs`, homepage/campus content in `scripts/editorial-template.mjs`, base styles in `assets/style/site.css`, editorial design in `assets/style/editorial.css`, and browser behavior in `assets/js/site.js`. Build regenerates the root HTML files (compatible with the original static host) and publishes the same pages to `dist/`. The build clears only its verified `dist` directory and publishes an explicit set of runtime assets. Georgian content remains readable without JavaScript; English selection persists when browser storage is available. Fonts use the free Google Fonts service with system fallbacks.

## Render static hosting

- Repository: `https://github.com/NickKapanadze/SAGITweb`
- Service type: **Static Site**
- Build command: `npm run build`
- Publish directory: `dist`
- A matching `render.yaml` is included; no server, database, paid assets, or background worker is needed.

The current service was created from a public repository URL. Render requires manual deploys for this connection type even though its service metadata reports auto-deploy enabled. Check deployment history before triggering, deploy the latest pushed commit when no automatic deploy is pending, then verify the served `/build.json` against that SHA. A connected Git-provider installation is needed for automatic builds.

Static hosting is free within Render's included usage. Account-level bandwidth/build overages can still apply when billing is enabled. Verify account billing controls before changing DNS; maintain the user's $0 budget. Do not select paid compute or add a payment method for this project.

## Domain cutover

Verify the Render deployment first. Add both `www.sagit.com.ge` and `sagit.com.ge` to its Custom Domains settings, then use the exact DNS instructions Render returns. Preserve unrelated Cloudflare records, particularly mail records. Record the previous web DNS values before changing them. Verify HTTPS on both hosts, canonical redirects, the served build, the 404 page, and mobile navigation after propagation. This repository's CNAME is retained for compatibility with the existing hosting.

## Content and privacy

All public copy speaks as the university. The contact page links to the existing Instagram account `@sgt_uni`; it does not pretend to send messages or collect identity documents. Generic social links, unverified contact details, expired admission dates, and the expired countdown were removed. New admissions dates await publication rather than being invented. Program filters, native expandable details, mobile navigation, and language selection are implemented without external JavaScript dependencies.

## Editorial design and campus guide

The user rejected the 3D campus treatment on 2026-11-27 and requested an informative website with a striking visual identity. The current palette is red, warm metallic gold, black, and white, with oversized typography and editorial school directories. Content, program comparisons, admissions information, and school navigation are the primary experience. Use the complete university name in long-form placements: **სარდივალ ღობეგლეჯიაშვილის ტექნიკური უნივერსიტეტი** / **Sardival Ghobeglejiashvili Institute of Technology**. Preserve **რატომ საღუნი? / Why SAGIT?** as the established section heading.

Decorative photo panels use small inline SVG/CSS compositions themed around learning, community, and research. `scripts/motion-art.mjs` generates them. Animations pause offscreen, when the document is hidden, or through the shared Pause motion controls. Reduced-motion preferences disable animation entirely. No new animation library, video, external API, or paid asset is used. The original new-campus, international/exchange, and student-startup photographs remain in their respective informational stories, not as unrelated decorative imagery. The original campus plan remains on the campus guide.

The 3D renderer, generated geometry, and camera controls have been removed from the source and build. `scripts/campus-data.mjs` retains the bilingual descriptions of the 14 destinations in the Instagram plan. `/campus.html` presents the original plan alongside a readable expandable destination directory. Business and Humanities have named buildings in the plan; other school links use the academic quarter. School links open the appropriate destination using fragments such as `#business`; previous `?place=business` links still open the matching section.

The source plan is preserved in `references/` and published at `/assets/images/campus-plan.jpg`. It is the profile-size public image, not verified original resolution. The campus directory and program details work without JavaScript through native details elements. Checks verify all pages, links, fragments, bilingual strings, the 14 campus destinations, and that retired 3D assets are absent from published output.
