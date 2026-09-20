import { test, expect } from "@playwright/test";

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
    ["/log", "Build log."],
    ["/lab", "On the workbench."],
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
});

test("folio content, native scrolling and media remain usable", async ({ page }, info) => {
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
