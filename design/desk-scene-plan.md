# Brief: Desk-Scene Background for the Business-Card Portfolio

Paste this whole document into the other tool. It is self-contained.

---

## 1. Context

I have a portfolio site (React + Vite, live at farhaankhan.dev). I redesigned the landing view as a **digital business card**. The card itself is finished and I like it. The problem: it floats on a flat dark background and feels sad and weightless.

**The task is to build the environment around the card, not to change the card.**

## 2. Hard constraints (read first)

1. **Do not redesign, restyle, or re-lay-out the card.** Its typography, colors, spacing, copy, and proportions stay exactly as they are.
2. **Do not touch anything else on the site.** No other pages, sections, routes, or components change.
3. **The card stays the interactive element.** Everything new lives behind it as a scene.
4. **Additive only.** The new scene should be a self-contained component (or small set of files) that can be dropped in behind the existing card and removed cleanly.
5. **Use my existing stack** (React, Vite). Before adding any dependency, check what is already in `package.json` and prefer what is there.

## 3. The card (described, since you can't see it)

- Cream / off-white paper card, landscape, roughly 1.5:1 (business-card proportions), small rounded corners.
- Top-left: a small green serif monogram, `fk.`
- Top-right: tiny uppercase tracked label, `PERSONAL INTERFACE / 01`
- Large condensed serif name: **Farhaan Khan**
- Below it, uppercase sans label: `SOFTWARE DEVELOPER`
- Tagline in a lighter sans: "I build things, then figure out why they broke."
- A thin horizontal rule near the bottom.
- Bottom-left: `farhaankhan.dev`
- Bottom-right: `Turn over` with a small green diagonal arrow (↗)
- Palette: cream card (~`#F1EEE4`), near-black text, muted forest green accent (~`#2F6B4F`), dark charcoal-green page background (~`#232622`).

**Locate the existing card component in the repo and reuse it as-is.** Do not recreate it from this description.

## 4. Goal

Make the card feel like a **physical object resting on a desk in warm lamp light**, instead of a rectangle floating in flat space. The reference mood: a dark, textured desk surface; a warm pool of light from an off-screen lamp; soft shadows; a few quiet desk objects around it; shallow depth of field.

## 5. Deliverables

### A. `DeskScene` component: the scene behind the card

Build it in code (CSS and/or 3D). Elements, in priority order:

1. **Desk surface.** Dark, slightly warm, with visible material texture (leather/slate/worn wood feel). Generate the texture procedurally (SVG `feTurbulence`, canvas noise, or a shader). Do not depend on a huge image file.
2. **Lighting.** A warm light source (amber, roughly `#FFC58A`-ish) from upper-left. A soft radial pool of light on the desk around the card, falling off to near-black at the edges (vignette).
3. **Card shadow.** A contact shadow tight under the card plus a wider soft ambient shadow, offset away from the light. This is the single biggest thing that fixes the "floating" feel. The card should read as lying flat, slightly lifted, not hovering.
4. **Desk objects (secondary, keep them subtle and out of the card's way):**
   - a notebook with an elastic band, partially cropped at the left edge
   - a pen, lower-left, angled
   - a ceramic mug on a cork coaster, top-right, partially cropped (mug text: "BETTER THINGS AHEAD")
   - a keyboard corner, bottom-right, with visible `esc` and `tab` keys
   - a blurred plant/leaf in the bottom foreground for depth of field

   These can be simple 3D primitives, layered CSS/SVG illustrations, or cut-out image layers. Pick whichever is lightest and looks best. They do not need to be photoreal, but they must be **soft, dark, low-contrast, and slightly blurred** so they never compete with the card.
5. **Ambient motion (subtle):** faint dust motes drifting in the light, and/or a very slow light flicker. Keep it tasteful.

### B. Card perspective / placement

- The card sits on the desk. A **slight** rotation (about 2–4°) and a gentle perspective tilt (as if viewed from above at an angle) sells the physicality. Keep the card fully legible.
- Optional but nice: a very subtle mouse-parallax where the desk objects shift a few pixels at different depths, and the light shifts slightly. The card itself should stay stable and readable.

### C. The flip interaction

- Clicking the card (or the `Turn over ↗` label) flips it to reveal a **back face**, using a 3D CSS transform (`rotateY(180deg)`, `preserve-3d`, `backface-visibility: hidden`), with a smooth ~0.7–0.9s ease.
- **If a flip / back face already exists in the current card, reuse it.** If not, add a simple back face in the same visual language (same cream paper and type system). Suggested back content: short list of links (GitHub `Far-200`, LinkedIn `farhaan-khan-dev`, X `@PotatoBuiltThis`), plus a `Turn back` control. Keep the copy short; I will edit it.
- During the flip, the shadow should react: it shifts and softens as the card lifts, then settles when it lands. This detail matters.
- Clicking again flips back.

### D. Hero / preview image

I also want a **static hero image** (used for social preview / OG image / README). I already have a photographic mockup of the card on a desk. So do not try to generate this from code:

- Add an `og:image` / social-preview slot that points to a file I will supply at `/public/og-desk.jpg` (1200×630 crop).
- Optionally use that same image, blurred and low-opacity, as a **loading placeholder** for the scene until the code-rendered scene is ready, so first paint is never a blank dark screen.

## 6. Technical guidance

- **Preferred approach:** layered CSS + SVG + a `<canvas>` for the light, noise, and dust. Reach for `three` / `@react-three/fiber` only if it is already in the project or if the CSS approach cannot produce believable depth. The scene is basically a still life; it does not need a full 3D engine.
- **Performance:** target 60fps on a mid-range laptop. Cap canvas DPR at 2. Pause animations when the tab is hidden. No huge textures.
- **Responsive:** on mobile, the card is centered and scaled to fit; reduce the number of desk objects (crop them harder or drop the keyboard/mug), and disable parallax.
- **Accessibility:** respect `prefers-reduced-motion` (turn off dust, flicker, and parallax; keep the flip but shorten it). The scene is decorative: mark it `aria-hidden="true"`. The card content must stay real, selectable text, and the flip control must be keyboard-operable (`Enter` / `Space`) and have a visible focus state.
- **Layering:** scene at `z-index` below the card; `pointer-events: none` on the scene so it never blocks clicks.
- **Fonts:** reuse whatever the site already loads. Do not add or swap fonts.

## 7. Suggested file structure

```
src/
  components/
    DeskScene/
      DeskScene.jsx        // composes the layers
      DeskScene.css
      layers/
        DeskSurface.jsx    // texture + vignette
        Lighting.jsx       // warm light pool
        DeskObjects.jsx    // notebook, pen, mug, keyboard, plant
        Dust.jsx           // canvas particles
      useParallax.js       // optional mouse parallax hook
```

The existing card component is only **wrapped** (for placement, tilt, and shadow), never rewritten.

## 8. Order of work

1. Read the repo. Find the card component and how it is mounted. Report what you find before changing anything.
2. Build the desk surface + lighting + card shadow. **Stop and show me.** This alone should fix most of the "floating" problem.
3. Add the flip interaction and shadow reaction.
4. Add desk objects, one at a time, subtle first.
5. Add dust, parallax, and responsive/reduced-motion handling.
6. Wire up the OG image slot and loading placeholder.

## 9. Acceptance checklist

- [ ] The card is visually **unchanged**
- [ ] The card looks like it is resting on a surface, not floating
- [ ] Lighting reads as warm and directional, with a vignette
- [ ] Desk objects are subtle and never draw attention from the card
- [ ] Click flips the card smoothly; shadow responds; flips back
- [ ] Keyboard-accessible flip; visible focus; `aria-hidden` on the scene
- [ ] `prefers-reduced-motion` respected
- [ ] Mobile layout works and is lighter
- [ ] ~60fps, no large image dependencies
- [ ] No other page or component in the site was modified
- [ ] Scene is removable by deleting one wrapper and one folder

## 10. Things to avoid

- Restyling or "improving" the card
- Bright or neon lighting, heavy bloom, or anything that competes with the card
- Photoreal-but-uncanny 3D objects (soft and blurry beats detailed and wrong)
- Adding new dependencies without checking what is already installed
- Touching unrelated files
