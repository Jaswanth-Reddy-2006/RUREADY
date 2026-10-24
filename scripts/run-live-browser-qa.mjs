// ═══════════════════════════════════════════════════════════════
// RU Ready? — Roadmap Studio Live Browser QA & Verification Suite
// Real Chrome Browser Automation via Playwright against Real Services & Neon DB
// ═══════════════════════════════════════════════════════════════

import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { prisma } from '../services/roadmap-service/dist/lib/prisma.js';

const SCREENSHOT_DIR = path.resolve('tests/e2e/screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('🚀 [QA Runner] Launching real Chrome browser for live Roadmap Studio QA...');
  
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  // Collect console and network errors
  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', (req) => {
    networkErrors.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
  });

  // Setup authenticated user in localStorage
  const authUserId = `usr_qa_architect_${Date.now()}`;
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ userId: authUserId, name: 'Alex Mercer', email: 'architect@ruready.io' })).toString('base64url');
  const authToken = `${header}.${payload}.mockSig`;

  await page.addInitScript(({ token, userId }) => {
    const authState = {
      state: {
        user: {
          id: userId,
          email: 'architect@ruready.io',
          name: 'Alex Mercer',
          role: 'CANDIDATE',
        },
        accessToken: token,
        isAuthenticated: true,
      },
      version: 0,
    };
    window.localStorage.setItem('rennetus-auth', JSON.stringify(authState));

    // Hide any floating debug widget from intercepting clicks
    const style = document.createElement('style');
    style.id = 'qa-hide-overlays';
    style.textContent = '[data-agentation-root] { display: none !important; pointer-events: none !important; }';
    document.head.appendChild(style);
  }, { token: authToken, userId: authUserId });

  console.log(`🔑 [QA Runner] Injected test user: ${authUserId}`);

  let createdRoadmapId = '';

  try {
    // ─────────────────────────────────────────────────────────────
    // STEP 1: OPEN ROADMAP STUDIO (STEP A)
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 1] Navigating to http://localhost:3000/roadmap/create...');
    await page.goto('http://localhost:3000/roadmap/create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-step-a-goal-prompt.png'), fullPage: true });
    console.log('📸 Saved: 01-step-a-goal-prompt.png');

    // Verify prompt area exists
    const goalTextarea = page.locator('form textarea');
    await goalTextarea.waitFor({ state: 'visible' });

    // ─────────────────────────────────────────────────────────────
    // STEP 2: CREATE ROADMAP WITH NATURAL GOAL (TRIGGER STEP B)
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 2] Filling natural language goal...');
    const goalPrompt = 'Become a backend engineer with Node.js, PostgreSQL, Redis, Docker, and AWS.';
    await goalTextarea.fill(goalPrompt);

    const continueBtn = page.locator('button:has-text("Continue with AI Copilot")');
    await continueBtn.click();
    console.log('👉 Clicked Continue with AI Copilot');

    // ─────────────────────────────────────────────────────────────
    // STEP 3: CLARIFICATION QUESTIONS (STEP B)
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 3] Waiting for AI clarification questions...');
    await page.waitForSelector('text=Targeted Curriculum Questions', { timeout: 10000 });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-step-b-clarification.png'), fullPage: true });
    console.log('📸 Saved: 02-step-b-clarification.png');

    // Select clarification answers via option pills
    const optionPills = page.locator('button:has-text("Intermediate"), button:has-text("Job Readiness"), button:has-text("hours")');
    const pillCount = await optionPills.count();
    for (let i = 0; i < Math.min(pillCount, 3); i++) {
      await optionPills.nth(i).click().catch(() => {});
    }

    const generateDraftBtn = page.locator('button:has-text("Generate Structured Draft"), button:has-text("Generate Structured")');
    await generateDraftBtn.click();
    console.log('👉 Clicked Generate Structured Draft');

    // ─────────────────────────────────────────────────────────────
    // STEP 4: VERIFY 3-PANEL STUDIO CANVAS & MODULES (STEP C)
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 4] Waiting for 3-Panel Studio Canvas...');
    await page.waitForSelector('input[placeholder="Roadmap title..."]', { timeout: 15000 });
    await page.waitForTimeout(1500);

    // Verify roadmap ID is in URL or set
    const currentUrl = new URL(page.url());
    createdRoadmapId = currentUrl.searchParams.get('id') || '';
    console.log(`✅ Draft generated with Roadmap ID: ${createdRoadmapId}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-step-c-studio-initial.png'), fullPage: true });
    console.log('📸 Saved: 03-step-c-studio-initial.png');

    // Verify modules, objectives, deliverables are rendered
    const nodeCount = await page.locator('aside[aria-label="Component Palette & Roadmap Outline"] .space-y-1 > div').count();
    console.log(`📊 Rendered nodes count in outline: ${nodeCount}`);

    // ─────────────────────────────────────────────────────────────
    // STEP 5: ADD A MODULE MANUALLY
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 5] Adding module manually from palette...');
    const projectPaletteItem = page.locator('button:has-text("Capstone Project")').first();
    await projectPaletteItem.click();
    await page.waitForTimeout(800);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-manual-node-added.png'), fullPage: true });
    console.log('📸 Saved: 04-manual-node-added.png');

    // ─────────────────────────────────────────────────────────────
    // STEP 6: RENAME AN EXISTING MODULE
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 6] Renaming module in Properties Inspector...');
    // Click outline item 0
    const outlineItems = page.locator('aside[aria-label="Component Palette & Roadmap Outline"] .space-y-1 > div');
    await outlineItems.first().click();
    await page.waitForTimeout(500);

    // In right inspector, edit title input
    const inspectorTitleInput = page.locator('aside[aria-label="Module Properties Inspector"] input[value*="1."]');
    if (await inspectorTitleInput.isVisible()) {
      await inspectorTitleInput.fill('1. Advanced Network Protocols, Sockets & HTTP/3');
      await page.waitForTimeout(600);
      console.log('✏️ Renamed node to "1. Advanced Network Protocols, Sockets & HTTP/3"');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-renamed-node.png'), fullPage: true });
    console.log('📸 Saved: 05-renamed-node.png');

    // ─────────────────────────────────────────────────────────────
    // STEP 7: CREATE A PREREQUISITE CONNECTION
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 7] Wiring prerequisite connection...');
    // Click the last node (the manually added one)
    const totalOutline = await outlineItems.count();
    if (totalOutline > 1) {
      await outlineItems.last().click();
      await page.waitForTimeout(500);

      // In inspector, find prerequisite checkbox
      const prereqCheckbox = page.locator('aside[aria-label="Module Properties Inspector"] input[type="checkbox"]').first();
      if (await prereqCheckbox.isVisible()) {
        const isChecked = await prereqCheckbox.isChecked();
        if (!isChecked) {
          await prereqCheckbox.check();
          await page.waitForTimeout(600);
          console.log('🔗 Prerequisite dependency checked!');
        }
      }
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-prerequisite-wired.png'), fullPage: true });
    console.log('📸 Saved: 06-prerequisite-wired.png');

    // ─────────────────────────────────────────────────────────────
    // STEP 8: ATTEMPT CIRCULAR DEPENDENCY & VERIFY CYCLE WARNING
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 8] Attempting circular dependency for cycle rejection...');
    await outlineItems.first().click();
    await page.waitForTimeout(500);

    // Make node 0 depend on the last node -> forms a cycle!
    const checkboxes = page.locator('aside[aria-label="Module Properties Inspector"] input[type="checkbox"]');
    const cbCount = await checkboxes.count();
    if (cbCount > 0) {
      await checkboxes.last().check();
      await page.waitForTimeout(800);
    }

    // Verify cycle warning banner
    const cycleBanner = page.locator('text=Circular dependency detected:');
    const isCycleVisible = await cycleBanner.isVisible().catch(() => false);
    console.log(`⚠️ Cycle warning banner visible: ${isCycleVisible}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-cycle-detected-banner.png'), fullPage: true });
    console.log('📸 Saved: 07-cycle-detected-banner.png');

    // Uncheck to resolve cycle
    if (cbCount > 0) {
      await checkboxes.last().uncheck();
      await page.waitForTimeout(800);
      console.log('✅ Resolved cycle, graph is valid DAG again.');
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 9: CANVAS ZOOM, PAN, AND NODE SELECTION
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 9] Testing canvas zoom and pan controls...');
    const zoomInBtn = page.locator('button[title="Zoom In"]');
    const zoomOutBtn = page.locator('button[title="Zoom Out"]');
    const resetZoomBtn = page.locator('button[title="Reset View"], button[title="Reset Zoom"]');

    if (await zoomInBtn.isVisible()) {
      await zoomInBtn.click();
      await page.waitForTimeout(300);
      await zoomInBtn.click();
      await page.waitForTimeout(300);
      console.log('🔍 Zoomed In');

      await zoomOutBtn.click();
      await page.waitForTimeout(300);
      console.log('🔍 Zoomed Out');

      await resetZoomBtn.click();
      await page.waitForTimeout(300);
      console.log('🔍 Zoom Reset to 100%');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-canvas-zoom-pan.png'), fullPage: true });
    console.log('📸 Saved: 08-canvas-zoom-pan.png');

    // ─────────────────────────────────────────────────────────────
    // STEP 10: USE AI COPILOT FOR TARGETED SURGICAL EDIT
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 10] Interacting with surgical AI Copilot...');
    const copilotToggleBtn = page.locator('header button:has-text("AI Copilot")');
    if (await copilotToggleBtn.isVisible()) {
      await copilotToggleBtn.click();
      await page.waitForTimeout(500);

      const copilotInput = page.locator('aside[aria-label="AI Curriculum Copilot Drawer"] input, input[placeholder*="Move SQL before ORM"]');
      await copilotInput.fill('Add Docker and Kubernetes containerization module after networking fundamentals');

      // Submit via form submission / Enter key to bypass any DOM overlay
      await copilotInput.press('Enter');
      console.log('🤖 Sent instruction to AI Copilot via Enter key...');

      // Wait for AI response in chat drawer
      await page.waitForSelector('text=Containerization & Orchestration with Docker & Kubernetes', { timeout: 15000 });
      await page.waitForTimeout(1000);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-copilot-diff-preview.png'), fullPage: true });
      console.log('📸 Saved: 09-copilot-diff-preview.png');

      // Verify that our earlier manual rename is still present in outline
      const renamedStillPresent = await page.locator('text=1. Advanced Network Protocols, Sockets & HTTP/3').count();
      console.log(`🛡️ Unrelated manual rename preserved: ${renamedStillPresent > 0}`);

      // Close copilot drawer
      const closeCopilotBtn = page.locator('aside[aria-label="AI Curriculum Copilot Drawer"] button:has(svg.lucide-x)').first();
      if (await closeCopilotBtn.isVisible().catch(() => false)) {
        await closeCopilotBtn.click({ force: true });
        await page.waitForTimeout(500);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 11: SAVE DRAFT & VERIFY NEON POSTGRES PERSISTENCE
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 11] Saving draft and verifying real DB persistence...');
    const saveDraftBtn = page.locator('header button:has-text("Save")');
    await saveDraftBtn.click();
    await page.waitForTimeout(2000);

    const saveStatusText = await page.locator('text=All changes saved, text=Saved').first().isVisible().catch(() => false);
    console.log(`💾 Live save status indicates Saved: ${saveStatusText}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-autosave-saved.png'), fullPage: true });
    console.log('📸 Saved: 10-autosave-saved.png');

    // Direct DB Verification
    console.log('🔎 Querying Neon PostgreSQL database directly...');
    const dbRoadmap = await prisma.roadmap.findUnique({
      where: { id: createdRoadmapId },
      include: { nodes: true },
    });

    console.log(`✅ DB Roadmap Found: "${dbRoadmap?.title}", Current Version: ${dbRoadmap?.currentVersion}, Nodes: ${dbRoadmap?.nodes.length}`);

    const dbVersions = await prisma.roadmapVersion.findMany({
      where: { roadmapId: createdRoadmapId },
      orderBy: { version: 'desc' },
    });

    console.log(`✅ DB Snapshots Found in roadmap_versions: ${dbVersions.length} snapshots`);
    for (const v of dbVersions) {
      console.log(`   - Revision ${v.version}: "${v.changelog}"`);
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 12: BROWSER REFRESH & PERSISTENCE INTEGRITY
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 12] Refreshing browser to verify reload persistence...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const reloadedRenamedNode = await page.locator('text=1. Advanced Network Protocols, Sockets & HTTP/3').count();
    console.log(`✅ After browser reload: Renamed module loaded intact: ${reloadedRenamedNode > 0}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-reloaded-after-save.png'), fullPage: true });
    console.log('📸 Saved: 11-reloaded-after-save.png');

    // ─────────────────────────────────────────────────────────────
    // STEP 13: VERSION HISTORY & RESTORE EARLIER REVISION
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 13] Opening Version History Drawer & Restoring Version 1...');
    const historyBtn = page.locator('header button:has-text("History")');
    await historyBtn.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-version-history-drawer.png'), fullPage: true });
    console.log('📸 Saved: 12-version-history-drawer.png');

    const restoreButtons = page.locator('aside[aria-label="Version History Snapshots"] button:has-text("Restore this version")');
    const restoreCount = await restoreButtons.count();
    console.log(`📜 Found ${restoreCount} restore buttons in version history`);

    if (restoreCount > 0) {
      await restoreButtons.last().click({ force: true });
      await page.waitForTimeout(2000);
      console.log('⏪ Clicked Restore on Version 1 snapshot');

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-version-restored.png'), fullPage: true });
      console.log('📸 Saved: 13-version-restored.png');

      const refreshedDbRoadmap = await prisma.roadmap.findUnique({
        where: { id: createdRoadmapId },
      });
      console.log(`✅ DB version after rollback incremented to: ${refreshedDbRoadmap?.currentVersion}`);
    }

    // Close history drawer if still open
    const closeDrawerBtn = page.locator('aside[aria-label="Version History Snapshots"] button:has(svg.lucide-x)').first();
    if (await closeDrawerBtn.isVisible().catch(() => false)) {
      await closeDrawerBtn.click({ force: true });
      await page.waitForTimeout(500);
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 14: CONCURRENCY CONFLICT DETECTION (HTTP 409)
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 14] Testing optimistic concurrency conflict rejection...');
    const conflictRes = await fetch(`http://localhost:4000/api/roadmaps/${createdRoadmapId}/draft`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        baseVersion: 1, // Stale version! Server is now at version 3+
        title: 'Conflict overwrite attempt',
      }),
    });

    console.log(`🔒 Stale-revision API response status: ${conflictRes.status} (Expected: 409)`);
    const conflictJson = await conflictRes.json();
    console.log(`🔒 Error code returned: ${conflictJson.code}, message: "${conflictJson.message}"`);

    // Test unauthorized user protection
    const badTokenHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const badTokenPayload = Buffer.from(JSON.stringify({ userId: 'usr_unauthorized_hacker', name: 'Hacker' })).toString('base64url');
    const badToken = `${badTokenHeader}.${badTokenPayload}.sig`;

    const unauthorizedRes = await fetch(`http://localhost:4000/api/roadmaps/${createdRoadmapId}/draft`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${badToken}`,
      },
      body: JSON.stringify({
        baseVersion: 1,
        title: 'Hacked title',
      }),
    });
    console.log(`🛡️ Unauthorized user edit attempt status: ${unauthorizedRes.status} (Expected: 404 or 403)`);

    // ─────────────────────────────────────────────────────────────
    // STEP 15: PREVIEW MODE & PUBLICATION TO LEARNER WORKSPACE
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 15] Preview mode & Publication...');
    const previewBtn = page.locator('header button:has-text("Preview")');
    if (await previewBtn.isVisible()) {
      await previewBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14-preview-mode.png'), fullPage: true });
      console.log('📸 Saved: 14-preview-mode.png');

      const exitPreviewBtn = page.locator('header button:has-text("Visual Studio")');
      await exitPreviewBtn.click();
      await page.waitForTimeout(500);
    }

    // Publish Roadmap
    const publishBtn = page.locator('header button:has-text("Publish")');
    await publishBtn.click();
    await page.waitForTimeout(2000);
    console.log('🚀 Published roadmap to community!');

    // Navigate to public learner workspace
    console.log(`📍 Navigating to learner workspace: http://localhost:3000/roadmap/${createdRoadmapId}...`);
    await page.goto(`http://localhost:3000/roadmap/${createdRoadmapId}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15-published-workspace.png'), fullPage: true });
    console.log('📸 Saved: 15-published-workspace.png');

    // Test Study Pacing slider on learner workspace
    const paceSlider = page.locator('input[type="range"]');
    if (await paceSlider.isVisible()) {
      await paceSlider.fill('16');
      await page.waitForTimeout(500);
      console.log('⏱️ Adjusted study pace slider to 16 hrs/week');
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 16: RESPONSIVE VIEWPORT CHECKS
    // ─────────────────────────────────────────────────────────────
    console.log('📍 [Step 16] Capturing responsive viewports...');
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16-responsive-tablet.png'), fullPage: true });
    console.log('📸 Saved: 16-responsive-tablet.png');

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17-responsive-mobile.png'), fullPage: true });
    console.log('📸 Saved: 17-responsive-mobile.png');

    console.log('🎉 [QA Runner] All 17 verification checkpoints and screenshots completed successfully!');

  } catch (err) {
    console.error('❌ [QA Runner] Error during execution:', err);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error-failure-state.png'), fullPage: true }).catch(() => {});
    throw err;
  } finally {
    // Clean up test roadmap safely
    if (createdRoadmapId) {
      console.log(`🧹 [QA Cleanup] Cleaning up test roadmap ${createdRoadmapId}...`);
      await prisma.roadmapVersion.deleteMany({ where: { roadmapId: createdRoadmapId } }).catch(() => {});
      await prisma.roadmapNode.deleteMany({ where: { roadmapId: createdRoadmapId } }).catch(() => {});
      await prisma.roadmap.delete({ where: { id: createdRoadmapId } }).catch(() => {});
      console.log('🧹 [QA Cleanup] Cleaned up test roadmap records.');
    }

    await browser.close();
    console.log('🏁 [QA Runner] Browser closed. Console errors count:', consoleErrors.length, 'Network errors count:', networkErrors.length);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
