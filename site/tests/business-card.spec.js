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

test.describe("hidden command interface", () => {
  const trigger = (page) => page.getByRole("button", { name: /command interface$/ });
  const input = (page) => page.getByRole("textbox", { name: /^Command/ });
  const reply = (page) => page.locator(".command-reply");
  async function run(page, command) {
    await input(page).fill(command);
    await input(page).press("Enter");
  }

  test("is absent from the compact card on both faces", async ({ page }) => {
    for (const route of ["/", "/work"]) {
      await page.goto(route);
      await settled(page);
      await expect(trigger(page)).toHaveCount(0);
      await expect(page.locator("#command-tray")).toHaveCount(0);
      await page.keyboard.press("Control+k");
      await expect(page.locator("#command-tray")).toHaveCount(0);
      await expect(page.locator(".command-lift")).toHaveCSS("transform", "none");
    }
  });

  test("opens from the folio, answers quietly and closes with Escape", async ({ page }, info) => {
    await page.goto("/about");
    await settled(page);
    const card = page.locator(".business-card");
    const resting = await card.boundingBox();
    await expect(page.locator("#command-tray")).toBeHidden();
    await expect(input(page)).toHaveCount(0); // inert while closed: not focusable or exposed
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
    await trigger(page).click();
    await expect(input(page)).toBeFocused();
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
    await expect(trigger(page)).toHaveAccessibleName("Close command interface");
    await settled(page);
    expect((await card.boundingBox()).y).toBeLessThan(resting.y);
    await noOverflow(page);
    await page.screenshot({ path: info.outputPath("command-open.png") });

    await run(page, "help");
    await expect(reply(page)).toContainText("index");
    await expect(reply(page)).toContainText("collapse");
    await page.screenshot({ path: info.outputPath("command-help.png") });
    await run(page, "  STATUS ");
    await expect(reply(page)).toHaveText("still building.");
    await run(page, "xyzzy now");
    await expect(reply(page)).toHaveText("command not found: xyzzy · try help");
    await run(page, "hire");
    await expect(reply(page)).toHaveText("excellent command.");
    await run(page, "sudo collapse");
    await expect(reply(page)).toHaveText("nice try.");
    await run(page, "rm -rf portfolio");
    await expect(reply(page)).toHaveText("permission denied. for your own protection.");
    await run(page, "about");
    await expect(reply(page)).toHaveText("already here.");
    await run(page, "cls");
    await expect(reply(page)).toHaveText("");
    await input(page).press("ArrowUp");
    await expect(input(page)).toHaveValue("cls");
    await input(page).press("ArrowUp");
    await expect(input(page)).toHaveValue("about");
    await input(page).press("ArrowDown");
    await input(page).press("ArrowDown");
    await expect(input(page)).toHaveValue("");
    await expect(page).toHaveURL(/\/about$/);

    // Escape puts the tray away first; only the next Escape collapses the folio, as before.
    await page.keyboard.press("Escape");
    await expect(page.locator("#command-tray")).toBeHidden();
    await expect(trigger(page)).toBeFocused();
    await expect(page).toHaveURL(/\/about$/);
    await settled(page);
    expect(await card.boundingBox()).toEqual(resting);
    await expect(page.locator(".command-lift")).toHaveCSS("transform", "none");
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
  });

  test("Ctrl/Cmd+K reaches the tray without taking over other fields", async ({ page }) => {
    await page.goto("/log");
    await settled(page);
    const scroller = page.getByRole("region", { name: "Build log content" });
    await scroller.focus();
    await page.keyboard.press("Control+k");
    await expect(input(page)).toBeFocused();
    await page.keyboard.press("Control+k");
    await expect(page.locator("#command-tray")).toBeHidden();
    await expect(scroller).toBeFocused();
    await page.keyboard.press("Meta+k");
    await expect(input(page)).toBeFocused();
    await scroller.focus();
    await page.keyboard.press("Control+k");
    await expect(input(page)).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(scroller).toBeFocused();

    await page.locator(".surface-body").evaluate((node) => {
      const field = document.createElement("input");
      field.id = "other-field";
      node.prepend(field);
    });
    await page.locator("#other-field").focus();
    await page.keyboard.press("Control+k");
    await expect(page.locator("#other-field")).toBeFocused();
    await expect(page.locator("#command-tray")).toBeHidden();
  });

  test("navigation commands use the card's own routes and history", async ({ page }) => {
    await page.goto("/about");
    await settled(page);
    await page.keyboard.press("Control+k");
    await run(page, "lab");
    await expect(page).toHaveURL(/\/lab$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Small experiments, useful tools.");
    await expect(page.locator("#command-tray")).toBeHidden();
    await expect(page).toHaveTitle("Workbench | Farhaan Khan");
    await expect(page.locator('.surface-footer [aria-current="page"]')).toHaveText("Lab");
    // Browser history puts an open tray away and never reopens it.
    await page.keyboard.press("Control+k");
    await expect(input(page)).toBeFocused();
    await page.goBack();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("#command-tray")).toBeHidden();
    await page.goForward();
    await expect(page).toHaveURL(/\/lab$/);
    await expect(page.locator("#command-tray")).toBeHidden();

    // A normal link still navigates with the tray out (on phones the tray covers the footer, so use the header mark).
    await page.keyboard.press("Control+k");
    await expect(input(page)).toBeFocused();
    await page.getByRole("link", { name: "Return to card index" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.locator("#command-tray")).toHaveCount(0);
    await page.goBack();
    await settled(page);
    await expect(page).toHaveURL(/\/lab$/);
    await expect(page.locator("#command-tray")).toBeHidden();
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");

    await page.goto("/log");
    await settled(page);
    await page.keyboard.press("Control+k");
    await run(page, "index");
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.getByRole("link", { name: "Build log" })).toBeFocused();
    await expect(page.locator("#command-tray")).toHaveCount(0);
  });

  test("flip and collapse reuse the card's own controls", async ({ page }) => {
    await page.goto("/work");
    await settled(page);
    await page.locator(".project-row").filter({ hasText: "FlowTrace" }).click();
    await settled(page);
    await page.keyboard.press("Control+k");
    await run(page, "collapse");
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.locator(".project-row").filter({ hasText: "FlowTrace" })).toBeFocused();
    await settled(page);
    await expect(page.locator(".card-turn")).toHaveClass(/is-turned/);

    await page.goto("/projects/flowtrace");
    await settled(page);
    await page.keyboard.press("Control+k");
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

  test("resume opens the existing dialog and returns focus to the trigger", async ({ page }) => {
    await page.goto("/lab");
    await settled(page);
    await trigger(page).click();
    await run(page, "resume");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator("#command-tray")).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(trigger(page)).toBeFocused();
    await expect(page).toHaveURL(/\/lab$/);
  });
});
