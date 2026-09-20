# Executable business card — local prototype

**Starting state:** clean `main` at `bd21760aa0e7bf51911ec295240f5a9c2070df36` (`refactor: simplify footer navigation`). Work is on `feat/executable-business-card`, created directly from that HEAD. No commits, merges, pushes or deployments were made. `main` remains at the original commit.

## Review locally

From `site/`, run `npm run dev`. On Windows PowerShell, use `npm.cmd run dev` if the execution policy blocks `npm.ps1`.

The opening card is the entire homepage. Turn it over, open a project, then collapse it. About, Build Log and the workbench expand the same object. Browser Back/Forward also changes the card state.

For the production preview and browser suite:

```sh
npm run build
npm test
```

Tests use installed Chrome by default. Set `PLAYWRIGHT_CHANNEL` to `msedge` if needed. Screenshots and failure traces are generated under ignored `test-results/`. The runner starts a local Vite preview on port 4173, or reuses one already running there.

## Architecture

- `BusinessCardShell` stays mounted across the card routes. The URL owns front, back and expanded state; there is no parallel navigation state machine.
- `/` is the identity face; `/work` is the reverse/index. Existing `/projects/<slug>`, `/about`, `/log` and `/lab` routes remain. Think Before Code and FlowTrace now have internal case-study routes as well.
- `/projects`, `/skills`, `/contact` and `/projects/cortex-ai` retain their redirects. Toolkit/contact hashes scroll inside the expanded surface. Unknown URLs get an in-card 404.
- `CardTilt` isolates spring-driven Motion values. No pointer coordinates enter React state and there is no custom animation loop.
- The CSS flip takes 560ms. Framer Motion animates the persistent shell's layout with transforms; the expanded body fades in. Collapse reverses the size change. Long content scrolls within the object while its header and collapse control stay available.
- `CardFront`, `CardBack` and `CardActions` handle compact content. `ExpandedProject` loads original detailed project components on demand with their duplicate page heroes omitted. `ProjectStudyVisual` renders the real screenshot or diagrams based on existing project examples.
- `CardSecondary` reuses the complete About component and maps existing build-log, active-build, learning and utility data into the new surfaces.
- `useCardMetadata` preserves the default title/description and updates title, description, canonical and social metadata on navigation. Existing social images, icons, verification, robots and Vercel rewrites remain. The two new project URLs were added to the sitemap.

## Visual and interaction system

Self-hosted Instrument Serif 400 supplies display typography; IBM Plex Sans 400/500 handles body text and labels. Only Latin subsets are loaded; the two regular faces are preloaded. There are no font CDN requests.

Graphite-green background `#222521` (with grain at roughly half a brightness level and a faint field of light around the card that follows its state), warm paper `#f2efe5`, dark ink `#252720`, and one deep green accent `#37634b`. A tiny inline SVG texture, hairline rules and restrained shadows give the card a physical surface. The desktop card rests at −1.2°; pointer tilt is limited to approximately ±1.5° and settles on focus.

The desktop card is 590×382px at 1024 wide and scales in three steps (×1.06, ×1.12, ×1.16) on larger screens, sitting slightly above centre. On phones it takes about 90% of the width and is only as tall as its content (roughly 316–320px), so it reads as a card rather than a profile panel; pointer transforms are disabled. The soft shadow beneath the card and a faint paper sheen are driven by CSS variables fed from the same spring values as the tilt, so they settle with it and never touch React state. The surrounding field brightens slightly on hover, widens on the back and grows with the card when it expands; with reduced motion all of this is static. Expanded mobile surfaces fill the available height with safe-area padding; typography, diagrams and content columns adapt vertically.

Flip controls are buttons; project navigation uses real links. Inactive faces are inert and hidden from assistive technology. Route changes focus the active heading, and returning to the index restores its corresponding link. Escape collapses expanded surfaces. The original native résumé dialog keeps its focus trap, Escape behavior and both PDFs.

Project rows, arrows, underlines and buttons respond to interaction; nothing animates continuously. The illustrative FlowTrace example lets the visitor step from `x = 2` to `x = 5`. Reduced motion disables tilt, physical flips and layout movement, retaining short opacity changes. The existing project video has controls, no autoplay and no eager download.

## Files changed

New:

- `src/components/business-card/BusinessCardShell.jsx`
- `src/components/business-card/CardFront.jsx`
- `src/components/business-card/CardBack.jsx`
- `src/components/business-card/CardTilt.jsx`
- `src/components/business-card/CardActions.jsx`
- `src/components/business-card/ExpandedProject.jsx`
- `src/components/business-card/ProjectStudyVisual.jsx`
- `src/components/business-card/CardSecondary.jsx`
- `src/components/business-card/useCardMetadata.js`
- `src/data/identity.js`
- `src/styles/business-card.css`
- `playwright.config.js`
- `tests/business-card.spec.js`
- `PROTOTYPE.md`

Modified:

- `src/App.jsx`, `src/main.jsx`: load the new experience without the old navigation, footer or stylesheet stack.
- `src/data/projects.js`: add the two flagship case-study URLs; factual project data stays centralized.
- `src/components/About.jsx`: allow route focus on its existing heading.
- `src/pages/project-pages/{FolderStructure,DevJTool,PasswordCrackEsti,PromptRouterPage}.jsx`: support embedded content and correct existing Motion import lint errors; retain full prose. Folder Structure also stops video autoplay.
- `src/components/{Contact,Projects,SelectedWork,Skills}.jsx`: naming-only fixes for pre-existing Motion import lint errors. These legacy components remain in source and are not mounted by the prototype.
- `index.html`: preload self-hosted fonts and match the browser theme color; retain metadata.
- `public/sitemap.xml`: add new project URLs.
- `package.json`, `package-lock.json`: fonts and browser tests.
- `.gitignore`: exclude browser test artifacts.

## Dependencies

Added runtime: `@fontsource/instrument-serif`, `@fontsource/ibm-plex-sans`, for packaged/self-hosted typography.

Added development: `@playwright/test`, for repeatable routing, keyboard, responsive and reduced-motion tests plus screenshots. It does not ship to visitors.

No direct dependencies were removed and no animation library was added. The existing lockfile was out of sync with the existing manifest: it had Vite 7 / React plugin 5 while `package.json` already requested Vite 8 / React plugin 6. npm reconciled those versions and their transitive packages during installation. This accounts for the larger lockfile diff; the build system and manifest's existing version ranges were not changed.

## Validation and limits

- ESLint passes, including the eight baseline Motion naming errors corrected above.
- Production build passes. Main JS is approximately 123KB gzip and CSS approximately 4.8KB gzip. Detailed legacy case-study components are separate lazy chunks. Existing images were preserved.
- 42 Playwright cases pass across desktop (1440×900), laptop (1280×800), tablet (1024×768, touch), mobile (390×844, touch), narrow mobile (320×568, touch) and reduced motion. Tests cover flips, accessible face isolation, keyboard focus, all deep links, refresh, Back/Forward, legacy redirects, hashes, metadata, résumé, Escape, scroll access to complete project notes and persistent card identity.
- Screenshots were inspected for both faces and expanded FlowTrace across desktop and mobile layouts, plus About, Build Log, Lab and Folder Structure views. Front-card line wrapping and expanded-surface scrolling were refined from that review.
- `git diff --check` passes; branch/HEAD and the complete changed-file list were inspected.

Real iPhone/Safari, Firefox and assistive-technology sessions still deserve manual testing, particularly the 3D face rendering and nested scrolling. Automated mobile checks emulate touch in Chrome. Client-side per-route metadata retains the existing SPA limitation: crawlers that do not execute JavaScript see the default HTML metadata. No server rendering or deployment changes were introduced.

Browser runs inside the Windows sandbox completed their assertions but stalled while stopping the preview server. The final run used approved execution outside the sandbox: all 42 cases passed, the preview server shut down normally, and the command exited with code 0. Stalled sandbox runners were stopped.

All work is local and uncommitted for review. Nothing was pushed or deployed.
