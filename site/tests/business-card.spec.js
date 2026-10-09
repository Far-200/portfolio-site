import { test, expect } from "@playwright/test";
import { completeCommand, runCommand } from "../src/components/business-card/commands.js";

const browserErrors = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
});

test.afterEach(async ({ page }) => expect(browserErrors.get(page)).toEqual([]));

async function settled(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700); // Wait for the physical flip/layout transition.
}

async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const scroller = page.locator(".surface-scroll");
  if (await scroller.count()) expect(await scroller.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
}

test("portrait loads and stays clear of identity and controls", async ({ page }, info) => {
  await page.goto("/");
  await settled(page);
  const portrait = page.getByRole("img", { name: "Farhaan Khan", exact: true });
  await expect(portrait).toBeVisible();
  expect(await portrait.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  async function clearPrint() {
    const photo = await page.locator(".front-photo").boundingBox();
    for (const selector of [".front-identity", ".front-line", ".front-bottom"]) {
      const print = await page.locator(selector).boundingBox();
      const overlaps = photo.x < print.x + print.width && photo.x + photo.width > print.x
        && photo.y < print.y + print.height && photo.y + photo.height > print.y;
      expect(overlaps, `${selector} must remain clear of the print`).toBe(false);
    }
    await noOverflow(page);
  }
  await clearPrint();
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 667, height: 375 });
    await settled(page);
    await clearPrint();
    await page.screenshot({ path: info.outputPath("landscape-front.png") });
  }
});

test("keyboard flip, one accessible face, and route-owned history", async ({ page }, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await settled(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Farhaan Khan");
  await expect(page.getByRole("link", { name: /Think Before Code/ })).toHaveCount(0);
  await noOverflow(page);
  await page.screenshot({ path: info.outputPath("01-front.png") });
  await expect(page.locator(".registration-note")).toHaveCSS("opacity", "0");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Flip card to selected work" })).toBeFocused();
  await expect(page.locator(".registration-note")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: info.outputPath("01-front-focused.png") });
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work$/);
  await settled(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Selected work");
  const clippedControls = await page.locator(".back-content").evaluate((face) => {
    const bounds = face.getBoundingClientRect();
    return Array.from(face.querySelectorAll("a, button")).filter((control) => {
      const rect = control.getBoundingClientRect();
      return rect.bottom > bounds.bottom + 1 || rect.right > bounds.right + 1
        || rect.top < bounds.top - 1 || rect.left < bounds.left - 1;
    }).map((control) => control.textContent);
  });
  expect(clippedControls, "Every reverse-side control stays on the paper").toEqual([]);
  await expect(page.getByRole("button", { name: "Flip card to selected work" })).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("02-back.png") });
  await expect(page.locator(".currently-building")).toContainText("Attendance Analytics");
  await expect(page.locator(".currently-building")).not.toContainText("FlowTrace");
  await noOverflow(page);
  const project = page.locator(".project-row").filter({ hasText: "FlowTrace" });
  await project.click();
  await expect(page).toHaveURL(/\/projects\/flowtrace$/);
  await settled(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await noOverflow(page);
  await page.screenshot({ path: info.outputPath("03-flowtrace.png") });
  await page.getByRole("button", { name: "Step through" }).click();
  await expect(page.locator(".trace-value")).toHaveText("x = 5");
  await page.goBack();
  await expect(project).toBeFocused();
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FlowTrace");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FlowTrace");
  await expect(page).toHaveTitle("FlowTrace | Farhaan Khan");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://farhaankhan.dev/projects/flowtrace");
  await page.getByRole("button", { name: "Collapse" }).click();
  await expect(project).toBeFocused();
  await page.getByRole("button", { name: "Flip card to identity" }).click();
  await settled(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Farhaan Khan");
  expect(errors).toEqual([]);
});

test("expansion keeps the card mounted and the complete notes remain reachable", async ({ page }, info) => {
  await page.goto("/work");
  await settled(page);
  await page.locator(".business-card").evaluate((node) => { node.dataset.continuity = "original-card"; });
  await page.locator(".project-row").filter({ hasText: "Folder Structure" }).click();
  await expect(page.locator(".business-card")).toHaveAttribute("data-continuity", "original-card");
  await settled(page);
  const notes = page.getByRole("heading", { name: "Next Improvements" });
  await notes.scrollIntoViewIfNeeded();
  await expect(notes).toBeVisible();
  await expect(notes).toBeInViewport();
  await page.getByRole("button", { name: "Collapse" }).click();
  await expect(page.locator(".project-row").filter({ hasText: "Folder Structure" })).toBeFocused();
  await expect(page.locator(".business-card")).toHaveAttribute("data-continuity", "original-card");
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 568 });
    await settled(page);
    await noOverflow(page);
    await page.screenshot({ path: info.outputPath("small-mobile-back.png") });
  }
});

test("all deep links, content surfaces, aliases and not found", async ({ page }, info) => {
  const routes = [
    ["/projects/think-before-code", "Think Before Code"],
    ["/projects/folder-structure-visualizer", "Folder Structure Visualizer"],
    ["/projects/password-estimator", "Password Strength & Crack Time Estimator"],
    ["/projects/devtool", "Developer JSON Formatter Tool"],
    ["/projects/prompt-router", "PromptRouter"],
    ["/about", "I build useful software, then learn from what breaks."],
    ["/log", "Things I’ve been building."],
    ["/lab", "Small experiments, useful tools."],
    ["/missing", "This side is blank."],
  ];
  for (const [route, title] of routes) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await settled(page);
    await noOverflow(page);
    if (["/about", "/log", "/projects/folder-structure-visualizer"].includes(route)) await page.screenshot({ path: info.outputPath(`${route.split("/").pop()}.png`) });
    if (route.includes("folder-structure")) {
      await expect(page.getByRole("heading", { name: "What I Learned" })).toBeAttached();
      await expect(page.locator("video")).not.toHaveAttribute("autoplay");
    }
  }
  await page.goto("/projects/cortex-ai");
  await expect(page).toHaveURL(/\/projects\/folder-structure-visualizer$/);
  await page.goto("/skills");
  await expect(page).toHaveURL(/\/about#toolkit$/);
  await expect(page.locator("#toolkit")).toBeInViewport();
  await page.goto("/contact");
  await expect(page).toHaveURL(/\/about#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
  await page.goto("/projects");
  await expect(page).toHaveURL(/\/work$/);
  await page.goto("/work/");
  await expect(page).toHaveURL(/\/work$/);
  await page.goto("/projects/flowtrace/");
  await expect(page).toHaveURL(/\/projects\/flowtrace$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FlowTrace");
});

test("resume dialog, escape, contact and keyboard return", async ({ page }) => {
  await page.goto("/work");
  await settled(page);
  await page.getByRole("button", { name: "Résumé" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("link", { name: /ATS Resume/ })).toHaveAttribute("href", "/resume/Farhaan_Khan_Resume_ATS.pdf");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Résumé" })).toBeFocused();
  await expect(page.getByRole("link", { name: /^Email/ })).toHaveAttribute("href", "mailto:hello.farhaankhan@gmail.com");
  await page.getByRole("link", { name: "About", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).focus();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
});

test("tilt is restrained and disabled for touch and reduced motion", async ({ page }, info) => {
  await page.goto("/");
  await settled(page);
  const card = page.locator(".business-card");
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width - 30, box.y + 30);
  await settled(page);
  const transform = await page.locator(".card-tilt").evaluate((node) => getComputedStyle(node).transform);
  if (["mobile", "narrow", "tablet", "reduced-motion"].includes(info.project.name)) expect(transform).toBe("none");
  else expect(transform).toMatch(/^matrix3d/);

  await page.getByRole("button", { name: "Flip card to selected work" }).click();
  await settled(page);
  await page.getByRole("link", { name: "About", exact: true }).click();
  await settled(page);
  const tilt = page.locator(".card-tilt");
  await tilt.evaluate((node) => {
    window.tiltStyleWrites = 0;
    window.tiltObserver = new MutationObserver((records) => { window.tiltStyleWrites += records.length; });
    window.tiltObserver.observe(node, { attributes: true, attributeFilter: ["style"] });
  });
  const scroller = page.getByRole("region", { name: "About content" });
  const bounds = await scroller.boundingBox();
  await page.mouse.move(bounds.x + 20, bounds.y + 20);
  await page.mouse.move(bounds.x + bounds.width - 20, bounds.y + bounds.height - 20, { steps: 8 });
  await page.mouse.move(0, 0);
  await page.getByRole("button", { name: "Collapse" }).focus();
  await scroller.focus();
  await page.keyboard.press("PageDown");
  await expect.poll(() => scroller.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await settled(page);
  expect(await tilt.evaluate((node) => getComputedStyle(node).transform)).toBe("none");
  expect(await scroller.boundingBox()).toEqual(bounds);
  expect(await page.evaluate(() => {
    window.tiltObserver.disconnect();
    return window.tiltStyleWrites;
  })).toBe(0);

  // Pointer interaction must resume after collapsing the same mounted card.
  await page.getByRole("button", { name: "Collapse" }).click();
  await settled(page);
  const compact = await card.boundingBox();
  await page.mouse.move(compact.x + compact.width - 30, compact.y + 30);
  await settled(page);
  const restored = await tilt.evaluate((node) => getComputedStyle(node).transform);
  if (["mobile", "narrow", "tablet", "reduced-motion"].includes(info.project.name)) expect(restored).toBe("none");
  else expect(restored).toMatch(/^matrix3d/);
});

test("folio content, native scrolling and media remain usable", async ({ page }, info) => {
  // Compact tablet checks stay at 1024px; expanded sheets also need the portrait tablet breakpoint.
  if (info.project.name === "tablet") await page.setViewportSize({ width: 768, height: 1024 });
  const surfaces = [
    ["/about", ["#toolkit", "#contact"]],
    ["/log", [".log-year li:last-child"]],
    ["/lab", [".lab-section:nth-of-type(2)", ".lab-collection"]],
    ["/projects/think-before-code", [".study-notes"]],
    ["/projects/flowtrace", [".study-notes"]],
    ["/projects/folder-structure-visualizer", [".project-video-wrap", ".project-learnings"]],
  ];
  for (const [route, sections] of surfaces) {
    await page.goto(route);
    await settled(page);
    const name = route.split("/").pop();
    await page.screenshot({ path: info.outputPath(`${name}-top.png`) });
    const scroller = page.getByRole("region", { name: / content$/ });
    const restingWidth = await scroller.evaluate((node) => node.clientWidth);
    await scroller.focus();
    expect(await scroller.evaluate((node) => node.clientWidth)).toBe(restingWidth);
    await page.keyboard.press("PageDown");
    await expect.poll(() => scroller.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    await scroller.evaluate((node) => node.blur());
    for (const [index, selector] of sections.entries()) {
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      await settled(page);
      await expect(section).toBeInViewport();
      await noOverflow(page);
      await page.screenshot({ path: info.outputPath(`${name}-detail-${index + 1}.png`) });
    }
    await expect(page.getByRole("button", { name: "Collapse" })).toBeInViewport();
    if (route === "/about") {
      await expect(page.locator('.surface-footer [aria-current="page"]')).toHaveText("About");
      await page.locator("#contact button").click();
      await page.screenshot({ path: info.outputPath("resume.png") });
      await page.keyboard.press("Escape");
      await expect(page.locator("#contact button")).toBeFocused();
      await expect(page).toHaveURL(/\/about$/);
    }
    if (route.includes("folder-structure")) {
      const video = page.locator("video");
      await expect(video).toHaveAttribute("preload", "none");
      await expect(video).toHaveAttribute("poster", /folder-visualiser-preview/);
      await expect(video).toHaveAttribute("controls", "");
      if (["desktop", "mobile"].includes(info.project.name)) {
        await video.scrollIntoViewIfNeeded();
        await video.evaluate((node) => node.play());
        await expect.poll(() => video.evaluate((node) => node.currentTime)).toBeGreaterThan(0);
        await video.evaluate((node) => node.pause());
        await page.screenshot({ path: info.outputPath("demo-playback.png") });
      }
    }
  }
});

test("Chaos opens from Lab as a simulation sheet and preserves card navigation", async ({ page }, info) => {
  await page.goto("/lab");
  await settled(page);
  const entry = page.locator(".lab-entry").filter({ has: page.getByRole("heading", { name: "Chaos", exact: true }) });
  await expect(entry).toContainText("Experiment");
  await entry.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("chaos-lab.png") });
  await page.locator(".business-card").evaluate((node) => { node.dataset.continuity = "lab-card"; });
  await entry.getByRole("link", { name: "Project notes" }).click();
  await expect(page).toHaveURL(/\/projects\/chaos$/);
  await settled(page);
  await expect(page.getByRole("heading", { name: "Chaos", exact: true })).toBeFocused();
  await expect(page.locator(".business-card")).toHaveAttribute("data-continuity", "lab-card");
  await expect(page.locator(".study-kicker")).toContainText("04 / Frontend Simulation");
  await expect(page.getByRole("link", { name: "Open live project" })).toHaveAttribute("href", "https://chaos.farhaankhan.dev/");
  await expect(page.getByRole("link", { name: "View source" })).toHaveAttribute("href", "https://github.com/Far-200/chaos-team");
  await expect(page.locator(".incident-figure li")).toHaveCount(5);
  await noOverflow(page);
  await page.screenshot({ path: info.outputPath("chaos-top.png") });

  const scroller = page.getByRole("region", { name: "Work content" });
  const bounds = await scroller.boundingBox();
  await page.mouse.move(bounds.x + 20, bounds.y + 20);
  await page.mouse.move(bounds.x + bounds.width - 20, bounds.y + bounds.height - 20, { steps: 8 });
  await scroller.focus();
  await page.keyboard.press("PageDown");
  await expect.poll(() => scroller.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await settled(page);
  expect(await scroller.boundingBox()).toEqual(bounds);
  await expect(page.locator(".card-tilt")).toHaveCSS("transform", "none");
  const limitations = page.getByRole("heading", { name: "What it is not", exact: true }).locator("..");
  await limitations.scrollIntoViewIfNeeded();
  await expect(limitations).toContainText("No live Claude, Codex, Copilot, ChatGPT, or Gemini calls. No autonomous agents. No backend. No arbitrary prompting.");
  await noOverflow(page);
  await page.screenshot({ path: info.outputPath("chaos-notes.png") });
  await page.goBack();
  await expect(page).toHaveURL(/\/lab$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/projects\/chaos$/);
  await page.reload();
  await expect(page).toHaveTitle("Chaos | Farhaan Khan");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://farhaankhan.dev/projects/chaos");
  await page.getByRole("button", { name: "Collapse" }).click();
  await settled(page);
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeFocused();
  await expect(page.locator(".project-row-title")).toHaveText(["Think Before Code", "FlowTrace", "Folder Structure Visualizer"]);
  // Browser Back reopens Chaos from the compact card through the same layout animation.
  await page.goBack();
  await settled(page);
  await expect(page.getByRole("heading", { name: "Chaos", exact: true })).toBeFocused();
  await expect(scroller).toBeVisible();
  await noOverflow(page);
  await page.getByRole("button", { name: "Collapse" }).click();
  await settled(page);
  await page.getByRole("button", { name: "Flip card to identity" }).click();
  await settled(page);
  await expect(page.getByRole("heading", { name: "Farhaan Khan" })).toBeVisible();
});

test("trace explains the assignment and resets without losing focus", async ({ page }) => {
  await page.goto("/projects/flowtrace");
  const step = page.getByRole("button", { name: "Step through" });
  await step.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".trace-active")).toHaveText("x = x + 3;");
  await expect(page.locator(".trace-bottom p")).toHaveText("Assignment executed. x is now 5.");
  const reset = page.getByRole("button", { name: "Reset trace" });
  await expect(reset).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".trace-value")).toHaveText("x = 2");
  await expect(step).toBeFocused();
});

test("build log: the reading note sits under the introduction and the timeline spans the sheet", async ({ page }, info) => {
  if (info.project.name === "tablet") await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/log");
  await settled(page);
  const box = (selector) => page.locator(selector).first().boundingBox();
  const [intro, note, timeline, article] = await Promise.all([box(".card-log > .surface-intro"), box(".journal-note"), box(".log-year"), box(".card-log")]);
  expect(note.y).toBeGreaterThanOrEqual(intro.y + intro.height);
  expect(timeline.y).toBeGreaterThanOrEqual(note.y + note.height);
  // No sidebar: the note and the timeline both take the full width of the sheet.
  expect(timeline.width).toBeGreaterThan(article.width - 2);
  expect(note.width).toBeGreaterThan(article.width * 0.97);
  await expect(page.getByRole("complementary", { name: "Currently exploring" }).getByRole("link", { name: /Open the notebook/ })).toHaveAttribute("href", "/lab");
  // Same chronology, same links, same reading size.
  await expect(page.locator(".log-year h3")).toHaveText(["Think Before Code↗", "FlowTrace↗", "Attendance Analytics", "Folder Structure Visualizer↗"]);
  expect(await page.locator(".log-year h3 a").evaluateAll((links) => links.map((link) => link.getAttribute("href"))))
    .toEqual(["/projects/think-before-code", "/projects/flowtrace", "/projects/folder-structure-visualizer"]);
  await expect(page.locator(".log-year li p").first()).toHaveCSS("font-size", "17px");
  await noOverflow(page);
  await page.screenshot({ path: info.outputPath("log-top.png") });
  // The end of the log scrolls clear of the folio footer.
  const scroller = page.getByRole("region", { name: "Build log content" });
  await scroller.evaluate((node) => { node.scrollTop = node.scrollHeight; });
  const footer = await box(".surface-footer");
  const last = await box(".card-log > .ink-link");
  expect(last.y + last.height).toBeLessThanOrEqual(footer.y);
  await noOverflow(page);
  await page.screenshot({ path: info.outputPath("log-end.png") });
});

test.describe("command palette", () => {
  const panel = (page) => page.locator("#command-tray");
  const input = (page) => page.getByRole("textbox", { name: /^Command/ });
  const entries = (page) => page.locator(".command-output > li");
  const reply = (page) => entries(page).last().locator(".command-reply");
  async function summon(page) {
    await page.keyboard.press("Control+k");
    await expect(input(page)).toBeFocused();
  }
  async function run(page, command) {
    await input(page).fill(command);
    await input(page).press("Enter");
  }

  test("summons over both faces of the compact card without turning or opening it", async ({ page }, info) => {
    const viewport = page.viewportSize();
    for (const [route, title] of [["/", "Farhaan Khan"], ["/work", "Selected work"]]) {
      await page.goto(route);
      await settled(page);
      // Hidden until summoned: nothing on screen, no launcher.
      await expect(panel(page)).toBeHidden();
      await expect(input(page)).toHaveCount(0);
      await expect(page.getByRole("button", { name: /terminal/i })).toHaveCount(0);
      const turn = await page.locator(".card-turn").getAttribute("class");
      const card = await page.locator(".business-card").boundingBox();
      for (const [open, close] of [["Control+k", "Control+k"], ["Meta+k", "Escape"]]) {
        await page.keyboard.press(open);
        await expect(input(page)).toBeFocused();
        await settled(page);
        const box = await panel(page).boundingBox();
        // Centred and whole: inside the screen, and on top at its edges, so no stage or card transform clips or covers it.
        expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 0.5);
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 0.5);
        for (const point of [[box.x + 4, box.y + 4], [box.x + box.width - 4, box.y + box.height - 4], [box.x + box.width / 2, box.y + box.height / 2]]) {
          expect(await page.evaluate(([x, y]) => document.getElementById("command-tray").contains(document.elementFromPoint(x, y)), point), `${route} ${point}`).toBe(true);
        }
        // The card stays exactly as it was: same face, same size, not opened.
        expect(await page.locator(".business-card").boundingBox()).toEqual(card);
        await expect(page.locator(".business-card")).not.toHaveClass(/expanded-card/);
        if (open === "Control+k") await page.screenshot({ path: info.outputPath(`palette-compact${route === "/" ? "-front" : "-back"}.png`) });
        await page.keyboard.press(close);
        await expect(panel(page)).toBeHidden();
        expect(new URL(page.url()).pathname).toBe(route);
        await expect(page.locator(".card-turn")).toHaveAttribute("class", turn);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
        // Opened from nowhere, it leaves focus nowhere rather than reaching into (and straightening) the resting card.
        expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
        await settled(page);
        expect(await page.locator(".business-card").boundingBox()).toEqual(card);
      }
      await noOverflow(page);
    }
  });

  test("navigates from both faces of the compact card with the card's own animations and history", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    const turned = page.locator(".card-turn");
    await page.goto("/");
    await settled(page);
    // Front: a folio opens exactly as its link does, and Back returns to the front.
    await summon(page);
    await run(page, "about");
    await expect(page).toHaveURL(/\/about$/);
    await expect(heading).toHaveText("I build useful software, then learn from what breaks.");
    await expect(heading).toBeFocused();
    await expect(page.locator(".business-card")).toHaveClass(/expanded-card/);
    await expect(panel(page)).toBeHidden();
    await page.goBack();
    await settled(page);
    expect(new URL(page.url()).pathname).toBe("/");
    await expect(heading).toHaveText("Farhaan Khan");
    await expect(page.locator(".business-card")).not.toHaveClass(/expanded-card/);
    await expect(turned).not.toHaveClass(/is-turned/);

    await summon(page);
    await run(page, "fsv");
    await expect(page).toHaveURL(/\/projects\/folder-structure-visualizer$/);
    await expect(heading).toHaveText("Folder Structure Visualizer");
    await page.goBack();
    await settled(page);
    expect(new URL(page.url()).pathname).toBe("/");

    // Back of the card: a project opens, and Back returns focus to its row, as a click on the row would.
    await page.goto("/work");
    await settled(page);
    await summon(page);
    await run(page, "tbc");
    await expect(page).toHaveURL(/\/projects\/think-before-code$/);
    await expect(heading).toHaveText("Think Before Code");
    await expect(heading).toBeFocused();
    await page.goBack();
    await settled(page);
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.locator(".project-row").filter({ hasText: "Think Before Code" })).toBeFocused();
    await expect(turned).toHaveClass(/is-turned/);

    await summon(page);
    await run(page, "go to lab");
    await expect(page).toHaveURL(/\/lab$/);
    await expect(heading).toHaveText("Small experiments, useful tools.");
    await page.goBack();
    await settled(page);
    await expect(page).toHaveURL(/\/work$/);

    // The card's own turn, both ways.
    await summon(page);
    await run(page, "flip");
    await settled(page);
    expect(new URL(page.url()).pathname).toBe("/");
    await expect(turned).not.toHaveClass(/is-turned/);
    await expect(heading).toBeFocused();
    await summon(page);
    await run(page, "flip");
    await settled(page);
    await expect(page).toHaveURL(/\/work$/);
    await expect(turned).toHaveClass(/is-turned/);

    // Commands with nothing to do here say so and leave the card alone.
    await summon(page);
    await run(page, "index");
    await expect(reply(page)).toHaveText("already here.");
    await run(page, "collapse");
    await expect(reply(page)).toHaveText("nothing to collapse.");
    await run(page, "status");
    await expect(reply(page)).toHaveText("still building.");
    await run(page, "sudo");
    await expect(reply(page)).toHaveText("nice try.");
    await page.keyboard.press("Escape");
    await expect(panel(page)).toBeHidden();
    await expect(page).toHaveURL(/\/work$/);
    await expect(turned).toHaveClass(/is-turned/);
    await expect(page.locator(".business-card")).not.toHaveClass(/expanded-card/);
  });

  test("on the compact card, focus returns where it was and the résumé dialog keeps its rules", async ({ page }) => {
    await page.goto("/work");
    await settled(page);
    const row = page.locator(".project-row").filter({ hasText: "FlowTrace" });
    await row.focus();
    await summon(page);
    await page.keyboard.press("Escape");
    await expect(panel(page)).toBeHidden();
    await expect(row).toBeFocused();
    await summon(page);
    await page.keyboard.press("Control+k");
    await expect(panel(page)).toBeHidden();
    await expect(row).toBeFocused();

    // The card's own Résumé button: the shortcut stays out of its dialog.
    const resume = page.getByRole("button", { name: "Résumé" });
    await resume.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Which version would you like?" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Control+k");
    await expect(panel(page)).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(resume).toBeFocused();
    // The `resume` command opens the same dialog, and focus comes back to where the palette was summoned.
    await summon(page);
    await run(page, "resume");
    await expect(dialog).toBeVisible();
    await expect(panel(page)).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(resume).toBeFocused();
    await expect(page).toHaveURL(/\/work$/);
  });

  test("hidden until Ctrl/Cmd+K, then centred over the folio without moving it", async ({ page }, info) => {
    const viewport = page.viewportSize();
    const phone = viewport.width <= 700;
    for (const route of ["/about", "/projects/flowtrace", "/log"]) {
      await page.goto(route);
      await settled(page);
      // Nothing on screen for the terminal, and the folio keeps its own size: no reserved strip, no launcher.
      await expect(panel(page)).toBeHidden();
      await expect(page.getByRole("button", { name: /terminal/i })).toHaveCount(0);
      const card = await page.locator(".business-card").boundingBox();
      expect(Math.round(card.width)).toBe(phone ? Math.min(590, viewport.width - 32) : Math.min(1060, viewport.width - 64));
      expect(Math.round(card.height)).toBe(phone ? viewport.height - 32 : Math.min(800, viewport.height - 64));
      await noOverflow(page);
    }
    await page.screenshot({ path: info.outputPath("palette-closed.png") });

    const card = await page.locator(".business-card").boundingBox();
    const scroller = page.getByRole("region", { name: "Build log content" });
    const scrollerBox = await scroller.boundingBox();
    await summon(page);
    await settled(page);
    const box = await panel(page).boundingBox();
    const footer = await page.locator(".surface-footer").boundingBox();
    // Laid over the paper, centred, inside the screen and the folio, above its footer.
    expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThanOrEqual(1);
    expect(box.x).toBeGreaterThanOrEqual(card.x - 0.5);
    expect(box.x + box.width).toBeLessThanOrEqual(card.x + card.width + 0.5);
    expect(box.y).toBeGreaterThanOrEqual(card.y);
    expect(box.y + box.height).toBeLessThanOrEqual(footer.y);
    expect(box.width).toBeLessThanOrEqual(560);
    expect(box.height).toBeLessThanOrEqual(380);
    // Opening it shifts and resizes nothing.
    expect(await page.locator(".business-card").boundingBox()).toEqual(card);
    expect(await scroller.boundingBox()).toEqual(scrollerBox);
    if (info.project.name === "reduced-motion") await expect(panel(page)).toHaveCSS("transition-duration", /^0s/);
    await noOverflow(page);
    await run(page, "help");
    // The newest entry starts in view, even when it is taller than the panel.
    await expect(entries(page).last().locator(".command-echo")).toBeInViewport();
    await page.screenshot({ path: info.outputPath("palette-help.png") });
    const close = page.getByRole("button", { name: "Close", exact: true });
    if (info.project.use.hasTouch) await close.tap(); else await close.click();
    await expect(panel(page)).toBeHidden();
    // Opened from nowhere on the card, it hands focus to the folio's scroll region.
    await expect(scroller).toBeFocused();
    expect(await page.locator(".business-card").boundingBox()).toEqual(card);
  });

  test("keeps a history, answers quietly and gives focus back on Escape", async ({ page }, info) => {
    await page.goto("/about");
    await settled(page);
    await expect(input(page)).toHaveCount(0); // inert while closed: not focusable or exposed
    const heading = page.getByRole("heading", { level: 1 });
    await heading.focus();
    await summon(page);
    await expect(page.getByRole("dialog", { name: "Terminal" })).toBeVisible();
    await expect(page.locator(".command-hint")).toHaveText("type help for commands · tab completes · esc closes");

    await run(page, "  STATUS ");
    await expect(reply(page)).toHaveText("still building.");
    await expect(entries(page).last().locator(".command-echo")).toHaveText("> STATUS");
    await run(page, "xyzzy now");
    await expect(reply(page)).toHaveText("command not found: xyzzy · try help");
    await expect(reply(page)).toHaveAttribute("data-tone", "error");
    await run(page, "farhaan");
    await expect(reply(page)).toHaveText("hireable.");
    await run(page, "  What   Doing ");
    await expect(reply(page)).toHaveText("doing my best.");
    await run(page, "sudo collapse");
    await expect(reply(page)).toHaveText("nice try.");
    await run(page, "rm -rf portfolio");
    await expect(reply(page)).toHaveText("permission denied. for your own protection.");
    await run(page, "go to about");
    await expect(reply(page)).toHaveText("already here.");
    // Earlier output stays on screen as history.
    await expect(entries(page)).toHaveCount(7);
    await expect(entries(page).first()).toContainText("still building.");
    await page.screenshot({ path: info.outputPath("palette-history.png") });
    await run(page, "cls");
    await expect(entries(page)).toHaveCount(1);
    await expect(page.locator(".command-hint")).toBeVisible();
    await input(page).press("ArrowUp");
    await expect(input(page)).toHaveValue("cls");
    await input(page).press("ArrowUp");
    await expect(input(page)).toHaveValue("go to about");
    await input(page).press("ArrowDown");
    await input(page).press("ArrowDown");
    await expect(input(page)).toHaveValue("");
    await expect(page).toHaveURL(/\/about$/);

    // Escape puts the palette away and returns focus to where it was; only the next Escape collapses the folio, as before.
    await page.keyboard.press("Escape");
    await expect(panel(page)).toBeHidden();
    await expect(heading).toBeFocused();
    await expect(page).toHaveURL(/\/about$/);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
  });

  test("Ctrl/Cmd+K toggles without taking over other fields, and pressing elsewhere puts it away", async ({ page }) => {
    await page.goto("/log");
    await settled(page);
    const scroller = page.getByRole("region", { name: "Build log content" });
    await scroller.focus();
    await page.keyboard.press("Control+k");
    await expect(input(page)).toBeFocused();
    await page.keyboard.press("Control+k");
    await expect(panel(page)).toBeHidden();
    await expect(scroller).toBeFocused();
    await page.keyboard.press("Meta+k");
    await expect(input(page)).toBeFocused();
    await page.keyboard.press("Meta+k");
    await expect(panel(page)).toBeHidden();
    await expect(scroller).toBeFocused();

    // Focus or a press anywhere else closes it and leaves focus where it went.
    await summon(page);
    await scroller.focus();
    await expect(panel(page)).toBeHidden();
    await expect(scroller).toBeFocused();
    await summon(page);
    await page.locator(".surface-footer").click({ position: { x: 4, y: 4 } });
    await expect(panel(page)).toBeHidden();
    await expect(page).toHaveURL(/\/log$/);
    // A press inside the palette keeps it open.
    await summon(page);
    await page.locator(".command-output").click();
    await expect(panel(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel(page)).toBeHidden();

    // Ordinary keys on the page never reach the closed palette.
    await scroller.focus();
    await page.keyboard.type("help");
    await expect(panel(page)).toBeHidden();
    await expect(scroller).toBeFocused();

    await page.locator(".surface-body").evaluate((node) => {
      const field = document.createElement("input");
      field.id = "other-field";
      node.prepend(field);
    });
    await page.locator("#other-field").focus();
    await page.keyboard.press("Control+k");
    await expect(page.locator("#other-field")).toBeFocused();
    await expect(panel(page)).toBeHidden();

    // Never over the résumé dialog.
    await page.locator("#other-field").evaluate((node) => node.remove());
    await scroller.focus();
    await summon(page);
    await run(page, "resume");
    await expect(page.getByRole("dialog", { name: "Which version would you like?" })).toBeVisible();
    await page.keyboard.press("Control+k");
    await expect(panel(page)).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(scroller).toBeFocused();
  });

  test("tab completes, help lists every command, and Tab otherwise leaves the field", async ({ page }) => {
    await page.goto("/lab");
    await settled(page);
    await summon(page);
    for (const [typed, completed] of [["gi", "github"], ["go to ab", "go to about"], ["sh", "show "], ["show fs", "show fsv"], ["att", "attendance"]]) {
      await input(page).fill(typed);
      await input(page).press("Tab");
      await expect(input(page), typed).toHaveValue(completed);
    }
    await input(page).fill("op");
    await input(page).press("Tab");
    await expect(input(page)).toHaveValue("open ");
    await input(page).press("End");
    await input(page).pressSequentially("li");
    await input(page).press("Tab");
    await expect(input(page)).toHaveValue("open linkedin");
    // Ambiguous: nothing is guessed; the candidates are offered instead.
    await input(page).fill("f");
    await input(page).press("Tab");
    await expect(input(page)).toHaveValue("f");
    await expect(entries(page).last()).toHaveText("fsv flowtrace flip");
    await expect(input(page)).toBeFocused();
    // Nothing to finish: Tab is focus navigation again.
    await input(page).fill("");
    await input(page).press("Tab");
    await expect(input(page)).not.toBeFocused();

    await summon(page);
    await run(page, "help");
    const help = entries(page).last().locator(".command-reply");
    for (const line of ["projects", "tbc Think Before Code", "fsv Folder Structure Visualizer", "flowtrace FlowTrace", "attendance Attendance Analytics · in the lab, no page yet",
      "github github profile ↗ · gh", "x x profile ↗ · twitter", "resume choose a résumé · cv", "mail hello.farhaankhan@gmail.com · email"]) {
      await expect(help).toContainText(line);
    }
    await expect(help).not.toContainText("sudo");
    await expect(help).not.toContainText("English");
    await run(page, "open nowhere");
    await expect(reply(page)).toHaveText("can't open nowhere · try help");
    await expect(reply(page)).toHaveAttribute("data-tone", "error");
    await run(page, "show");
    await expect(reply(page)).toHaveText("show what? tbc · fsv · flowtrace · attendance");
  });

  test("project shortcuts open the existing project pages", async ({ page }) => {
    await page.goto("/about");
    await settled(page);
    for (const [command, route, title] of [
      ["tbc", "/projects/think-before-code", "Think Before Code"],
      ["show folder structure visualizer", "/projects/folder-structure-visualizer", "Folder Structure Visualizer"],
      ["go to flowtrace", "/projects/flowtrace", "FlowTrace"],
      ["  Open   Think Before Code ", "/projects/think-before-code", "Think Before Code"],
      ["show fsv", "/projects/folder-structure-visualizer", "Folder Structure Visualizer"],
      ["open tbc", "/projects/think-before-code", "Think Before Code"],
    ]) {
      await summon(page);
      await run(page, command);
      await expect(page, command).toHaveURL(new RegExp(`${route}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
      await expect(panel(page)).toBeHidden();
      await expect(page).toHaveTitle(`${title} | Farhaan Khan`);
    }
    await summon(page);
    await run(page, "go to tbc");
    await expect(reply(page)).toHaveText("already here.");
    // Attendance Analytics is only on the workbench: it says so and stays put.
    await run(page, "attendance");
    await expect(reply(page)).toHaveText("attendance analytics has no project page yet · it's in the lab: go to lab");
    await run(page, "show attendance analytics");
    await expect(reply(page)).toHaveText("attendance analytics has no project page yet · it's in the lab: go to lab");
    await expect(page).toHaveURL(/\/projects\/think-before-code$/);
    // Each shortcut is an ordinary history entry.
    await page.keyboard.press("Escape");
    await page.goBack();
    await expect(page).toHaveURL(/\/projects\/folder-structure-visualizer$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/projects\/think-before-code$/);
  });

  test("profiles and mail open from the card's own links, safely", async ({ page }) => {
    await page.goto("/about");
    await settled(page);
    await page.evaluate(() => {
      window.opened = [];
      window.open = (...args) => { window.opened.push(args); return null; };
    });
    await summon(page);
    for (const command of ["github", "gh", "open linkedin", "OPEN X", "twitter", "open mail", "email"]) await run(page, command);
    const github = ["https://github.com/Far-200", "_blank", "noopener,noreferrer"];
    const linkedin = ["https://www.linkedin.com/in/farhaan-khan-dev/", "_blank", "noopener,noreferrer"];
    const x = ["https://x.com/FarKh_Nhi", "_blank", "noopener,noreferrer"];
    const mail = ["mailto:hello.farhaankhan@gmail.com", "_self"];
    expect(await page.evaluate(() => window.opened)).toEqual([github, github, linkedin, x, x, mail, mail]);
    await expect(entries(page).nth(0).locator(".command-reply")).toHaveText("opening github ↗");
    await expect(entries(page).nth(3).locator(".command-reply")).toHaveText("opening x ↗");
    await expect(reply(page)).toHaveText("writing to hello.farhaankhan@gmail.com");
    // The palette stays out and the folio stays put.
    await expect(input(page)).toBeFocused();
    await expect(page).toHaveURL(/\/about$/);
    // The same destinations the page itself links to.
    const links = await page.locator("#contact a").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
    for (const href of [github[0], linkedin[0], mail[0]]) expect(links).toContain(href);
  });

  test("navigation commands use the card's own routes and history", async ({ page }) => {
    await page.goto("/about");
    await settled(page);
    await summon(page);
    await run(page, "go to lab");
    await expect(page).toHaveURL(/\/lab$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Small experiments, useful tools.");
    await expect(panel(page)).toBeHidden();
    await expect(page).toHaveTitle("Workbench | Farhaan Khan");
    await expect(page.locator('.surface-footer [aria-current="page"]')).toHaveText("Lab");
    // The output survives moving between folios.
    await summon(page);
    await expect(entries(page).last().locator(".command-echo")).toHaveText("> go to lab");
    await run(page, "log");
    await expect(page).toHaveURL(/\/log$/);
    // Browser history puts an open palette away and never reopens it.
    await summon(page);
    await page.goBack();
    await expect(page).toHaveURL(/\/lab$/);
    await expect(panel(page)).toBeHidden();
    await page.goForward();
    await expect(page).toHaveURL(/\/log$/);
    await expect(panel(page)).toBeHidden();

    // A normal link still works with the palette out: the press puts it away and the link navigates.
    await summon(page);
    await page.getByRole("link", { name: "Return to card index" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(panel(page)).toBeHidden();
    await page.goBack();
    await settled(page);
    await expect(page).toHaveURL(/\/log$/);
    await expect(panel(page)).toBeHidden();

    await summon(page);
    await run(page, "index");
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.getByRole("link", { name: "Build log" })).toBeFocused();
    await expect(panel(page)).toBeHidden();
  });

  test("flip and collapse reuse the card's own controls", async ({ page }) => {
    await page.goto("/work");
    await settled(page);
    await page.locator(".project-row").filter({ hasText: "FlowTrace" }).click();
    await settled(page);
    await summon(page);
    await run(page, "collapse");
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.locator(".project-row").filter({ hasText: "FlowTrace" })).toBeFocused();
    await settled(page);
    await expect(page.locator(".card-turn")).toHaveClass(/is-turned/);

    await page.goto("/projects/flowtrace");
    await settled(page);
    await summon(page);
    await run(page, "flip");
    await expect(page).toHaveURL(/\/$/);
    await settled(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Farhaan Khan");
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    await expect(page.locator(".card-turn")).not.toHaveClass(/is-turned/);
    await noOverflow(page);
    await page.goBack();
    await expect(page).toHaveURL(/\/projects\/flowtrace$/);
  });

  test("home returns an open folio to the front of the card", async ({ page }) => {
    for (const [route, command] of [["/about", "home"], ["/projects/flowtrace", "go home"]]) {
      await page.goto(route);
      await settled(page);
      await summon(page);
      await run(page, command);
      await expect(page).toHaveURL(/\/$/);
      await settled(page);
      await expect(panel(page)).toBeHidden();
      await expect(page.locator(".business-card")).not.toHaveClass(/expanded-card/);
      await expect(page.locator(".card-turn")).not.toHaveClass(/is-turned/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Farhaan Khan");
      await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
      await expect(page).toHaveTitle("Farhaan Khan | Portfolio | Software Developer");
      await noOverflow(page);
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${route}$`));
    }
  });

  test("registry: commands, aliases, verb forms and completion are deterministic", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "Pure registry mapping; one project is enough.");
    await page.goto("about:blank");
    const calls = [];
    const card = {
      go: (path) => { calls.push(["go", path]); }, flip: () => { calls.push(["flip"]); }, collapse: () => { calls.push(["collapse"]); },
      resume: () => { calls.push(["resume"]); }, clear: () => { calls.push(["clear"]); },
      open: (href, name) => { calls.push(["open", href]); return `opening ${name} ↗`; },
      mail: (address) => { calls.push(["mail", address]); return `writing to ${address}`; },
    };
    const asides = {
      hire: "excellent command.", sudo: "nice try.", "rm -rf portfolio": "permission denied. for your own protection.",
      farhaan: "hireable.", "what doing": "doing my best.", why: "god knows.", coffee: "yes.", stack: "LIFO.",
      fuck: "understandable.", whoami: "farhaan, probably.", sleep: "not found.", bug: "feature pending review.",
      ai: "coworker. occasionally supervisor.", deploy: "brave.", css: "depends who hurt you.", javascript: "unfortunately.",
      python: "indentation detected.", money: "404.", life: "still building.", test: "works on my machine.",
    };
    expect(Object.keys(asides)).toHaveLength(20);
    for (const [command, answer] of Object.entries(asides)) expect(runCommand(command, card), command).toBe(answer);
    expect(calls).toEqual([]);

    const github = ["open", "https://github.com/Far-200"];
    const linkedin = ["open", "https://www.linkedin.com/in/farhaan-khan-dev/"];
    const x = ["open", "https://x.com/FarKh_Nhi"];
    const mail = ["mail", "hello.farhaankhan@gmail.com"];
    const tbc = ["go", "/projects/think-before-code"];
    const fsv = ["go", "/projects/folder-structure-visualizer"];
    const flowtrace = ["go", "/projects/flowtrace"];
    const expected = {
      " HOME ": ["go", "/"], "go home": ["go", "/"], index: ["go", "/work"], work: ["go", "/work"], projects: ["go", "/work"],
      about: ["go", "/about"], "go to about": ["go", "/about"], "GO   TO  LAB": ["go", "/lab"], "go lab": ["go", "/lab"], log: ["go", "/log"], lab: ["go", "/lab"],
      tbc, "open tbc": tbc, "show tbc": tbc, "go to tbc": tbc, "go tbc": tbc, "open think before code": tbc, "Think Before Code": tbc, "show think-before-code": tbc,
      fsv, "show fsv": fsv, "show folder structure visualizer": fsv, "open folder-structure-visualizer": fsv, "go to fsv": fsv,
      flowtrace, "show flowtrace": flowtrace, "go to flowtrace": flowtrace, "OPEN FLOWTRACE": flowtrace,
      github, gh: github, "open github": github, "show gh": github, linkedin, "open linkedin": linkedin,
      x, twitter: x, "open x": x, "open twitter": x, mail, email: mail, "open mail": mail, "Open Email": mail,
      resume: ["resume"], cv: ["resume"], "open resume": ["resume"], "open cv": ["resume"],
      flip: ["flip"], collapse: ["collapse"], clear: ["clear"], cls: ["clear"],
    };
    for (const [command, call] of Object.entries(expected)) {
      runCommand(command, card);
      expect(calls.splice(0), command).toEqual([call]);
    }
    expect(runCommand("open github", card)).toBe("opening github ↗");
    expect(runCommand("email", card)).toBe("writing to hello.farhaankhan@gmail.com");
    calls.length = 0;

    const attendance = "attendance analytics has no project page yet · it's in the lab: go to lab";
    for (const [command, answer] of [
      ["attendance", attendance], ["show attendance", attendance], ["open attendance analytics", attendance], ["go to attendance-analytics", attendance],
      ["what", "command not found: what · try help"], ["homework", "command not found: homework · try help"],
      ["gopher", "command not found: gopher · try help"], ["opener", "command not found: opener · try help"], ["showcase", "command not found: showcase · try help"],
      ["tbcx", "command not found: tbcx · try help"], ["english terminal", "command not found: english · try help"],
      ["open nowhere", "can't open nowhere · try help"], ["show english terminal", "can't show english terminal · try help"],
      ["go to sleep", "can't go to sleep · try help"], ["open status", "can't open status · try help"], ["show sudo", "can't show sudo · try help"],
      ["open", "open what? github · linkedin · x · resume · mail"], ["show", "show what? tbc · fsv · flowtrace · attendance"],
      ["go to", "go where? home · index · about · log · lab"], ["status", "still building."],
    ]) expect(runCommand(command, card), command).toBe(answer);
    expect(calls).toEqual([]);

    const row = (name, description) => `  ${name.padEnd(12)}${description}`;
    const help = runCommand("help", card);
    expect(help.split("\n")).toEqual([
      "pages", row("home", "front of the card"), row("index", "selected work · work, projects"), row("about", "about me"), row("log", "build log"), row("lab", "workbench"),
      "projects", row("tbc", "Think Before Code"), row("fsv", "Folder Structure Visualizer"), row("flowtrace", "FlowTrace"), row("attendance", "Attendance Analytics · in the lab, no page yet"),
      "links", row("github", "github profile ↗ · gh"), row("linkedin", "linkedin profile ↗"), row("x", "x profile ↗ · twitter"), row("resume", "choose a résumé · cv"),
      row("mail", "hello.farhaankhan@gmail.com · email"),
      "card", row("flip", "turn the card over"), row("collapse", "put this page away"), row("status", "what's happening"), row("clear", "clear the screen · cls"), row("help", "this list"),
      "try: open github · show tbc · go to lab · tab completes · ↑↓ recalls",
    ]);
    for (const command of Object.keys(asides)) expect(help.split(/[\s·,:]+/)).not.toContain(command.split(" ")[0]);

    for (const [partial, completion] of [
      ["gi", { value: "github", options: [] }], ["GH", { value: "gh", options: [] }], ["tw", { value: "twitter", options: [] }],
      ["op", { value: "open ", options: [] }], ["sh", { value: "show ", options: [] }], ["open li", { value: "open linkedin", options: [] }],
      ["go to ab", { value: "go to about", options: [] }], ["go to a", { value: "go to a", options: ["about", "attendance"] }], ["show fs", { value: "show fsv", options: [] }], ["fs", { value: "fsv", options: [] }],
      ["att", { value: "attendance", options: [] }], ["th", { value: "think before code", options: [] }],
      ["go t", { value: "go t", options: ["tbc", "twitter", "to"] }], ["show f", { value: "show f", options: ["fsv", "flowtrace"] }],
      ["l", { value: "l", options: ["log", "lab", "linkedin"] }], ["f", { value: "f", options: ["fsv", "flowtrace", "flip"] }],
      ["s", { value: "s", options: ["status", "show"] }], ["c", { value: "c", options: ["cv", "collapse", "clear"] }],
      ["co", { value: "collapse", options: [] }], ["he", { value: "help", options: [] }],
    ]) expect(completeCommand(partial), partial).toEqual(completion);
    for (const partial of ["", "   ", "zz", "status now", "su", "far", "open zz", "show zz"]) expect(completeCommand(partial), partial).toBeNull();
  });

  test("resume opens the existing dialog and returns focus to the folio", async ({ page }) => {
    await page.goto("/lab");
    await settled(page);
    const scroller = page.getByRole("region", { name: "Workbench content" });
    for (const command of ["resume", "open cv"]) {
      await summon(page);
      await run(page, command);
      await expect(page.getByRole("dialog", { name: "Which version would you like?" })).toBeVisible();
      await expect(panel(page)).toBeHidden();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog", { name: "Which version would you like?" })).not.toBeVisible();
      await expect(scroller).toBeFocused();
      await expect(page).toHaveURL(/\/lab$/);
    }
  });
});
