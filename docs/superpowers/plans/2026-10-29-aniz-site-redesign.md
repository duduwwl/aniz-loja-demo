# Aniz Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Aniz storefront into a distinctive, legible, responsive boutique site and publish it on GitHub Pages.

**Architecture:** Keep the current React routes, data, state, and commerce logic. Make a focused JSX deletion/recomposition in Home and Footer, then consolidate the visual system in the existing global stylesheet and refine the existing rail rather than adding components or dependencies.

**Tech Stack:** React 19, TypeScript 7, Vite 8, Motion 14, Lucide React, Vitest, Testing Library, GitHub Actions/Pages

**Spec:** `docs/superpowers/specs/2026-10-29-aniz-site-redesign-design.md`

## Global Constraints

- Preserve routes, cart persistence, validation, totals, checkout simulation, real photos, verified contact links, and demo disclosure.
- Add no dependency; reuse installed Motion, Lucide, and house UI components.
- Support 320–1920px, keyboard use, visible focus, 44px targets, and reduced motion.
- Do not invent business facts, testimonials, inventory, policies, or social proof.
- Commit only source, tests, docs, and deployment files; exclude graph analysis and local audit artifacts.

## Review Focus

- Home first frame at 320px: letreiro and copy remain readable without overflow.
- Rail with keyboard, drag, first/last controls, and reduced motion: navigation remains usable and bounded.
- Removed home form: product purchase still works from product pages and cart totals stay unchanged.
- Catalog/product/checkout at tablet widths: no sticky overlap, clipped controls, or horizontal scroll.
- Demo notice and focus states: visible on every route and against every color field.

---

### Task 1: Pin the requested removals and home semantics

**Files:**
- Modify: `src/flow.test.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/components/Chrome.tsx`

**Interfaces:**
- Consumes: `SwingingRail({ items, label })`, `Img`, existing hashes, existing product data.
- Produces: home landmark with ANIZ letreiro, photograph switcher, and rail; footer without CTA/local time.

- [ ] **Step 1: Write the failing home regression test**

Add a test that renders `#/`, asserts the home heading/letreiro and “Na arara” region exist, and asserts these are absent: the hero purchase form labelled “Comprar Pijama curto estampa cerejas”, text “Pijamas em tons de rosa, coleção de outubro”, and footer link “Ver todas as peças”.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/flow.test.tsx`

Expected: FAIL because the three marked elements still exist and the new hero heading does not.

- [ ] **Step 3: Recompose `Vitrine` and simplify `Footer`**

Delete `PriceTag`, its now-unused imports/state, image `figcaption`, footer CTA, and local-time state. Keep photograph switching, product discovery links, demo disclosure, contacts, and semantic landmarks. Add only the minimal letreiro markup required by the spec.

- [ ] **Step 4: Run the focused test and full flow suite**

Run: `npm test -- --run src/flow.test.tsx`

Expected: PASS, including product-page purchase, cart, checkout, and payment simulations.

- [ ] **Step 5: Commit**

```bash
git add src/flow.test.tsx src/pages/Home.tsx src/components/Chrome.tsx
git commit -m "feat: reshape Aniz storefront"
```

### Task 2: Build the site-wide type and interaction system

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/ui/swinging-rail.tsx` only if the current markup cannot express the metallic rail accessibly.
- Verify: `src/pages/Catalog.tsx`
- Verify: `src/pages/ProductPage.tsx`
- Verify: `src/pages/Checkout.tsx`
- Verify: `src/components/CartDrawer.tsx`

**Interfaces:**
- Consumes: existing class names, CSS custom properties, Lucide icons, Motion values, and reduced-motion signal.
- Produces: shared typography, button, icon, field, card, layout, footer, and responsive rules.

- [ ] **Step 1: Replace visual tokens and repeated generic geometry**

Set five type levels, regular/medium body weights, deep navy ink, Aniz blue accent, calm filled surfaces, consistent 48px controls, explicit transitions, and press/focus states. Remove repeated 1px outlined tiles and the hollow footer/section grid treatment.

- [ ] **Step 2: Restyle the existing arara**

Give `rail-bar`, hooks, garments, active state, controls, and mobile sizing the physical clarity of the Márcio Moura reference. Preserve current drag thresholds, keyboard arrows, bounds, link semantics, and reduced-motion behavior.

- [ ] **Step 3: Harmonize all route layouts through existing classes**

Apply the same hierarchy to catalog filters/cards, product gallery/options, cart drawer, checkout stepper/forms/summary, confirmation, mobile menu, toast, and footer. Do not change commerce logic.

- [ ] **Step 4: Run static and behavior checks**

Run: `npm run typecheck`

Run: `npm run lint`

Run: `npm test`

Run: `npm run build`

Expected: typecheck, tests, and build PASS; lint has no new warnings over the recorded baseline.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/components/ui/swinging-rail.tsx
git commit -m "style: refine Aniz visual system"
```

### Task 3: Visual, responsive, and interaction verification

**Files:**
- Modify if defects appear: files from Tasks 1–2 only.
- Keep local only: `.taste-skill/`, `graphify-out/`, `src/graphify-out/`, `.graphify-venv/`, `work/`.

**Interfaces:**
- Consumes: production build and all public routes.
- Produces: verified screenshots and an audit with zero known blocking visual failures.

- [ ] **Step 1: Run design-taste lint and inspector**

Inspect home at phone, tablet, and desktop widths. Resolve unreadable text, overlaps, overflow, excessive type sizes, generic repeated boxes, and hidden reveal content.

- [ ] **Step 2: Check all routes and key interactions**

Verify home switcher/rail, catalog search/filters, product options/add-to-cart, cart quantity/removal, checkout steps/errors/payment simulation, dialogs, external contact links, keyboard navigation, and reduced motion.

- [ ] **Step 3: Review the diff**

Run: `git diff --check`

Run: `git diff --stat HEAD~2..HEAD`

Request one independent code review focused on regressions, accessibility, responsive overflow, and scope.

- [ ] **Step 4: Run final clean verification**

Run: `npm run typecheck && npm test && npm run build`

Expected: all commands exit 0 from the final source state.

### Task 4: Publish and verify GitHub Pages

**Files:**
- Verify: `.github/workflows/deploy.yml`
- No source changes unless deployment reveals a real defect.

**Interfaces:**
- Consumes: reviewed main-branch commits and existing Pages workflow.
- Produces: live `https://duduwwl.github.io/aniz-loja-demo/` matching the verified build.

- [ ] **Step 1: Push the reviewed commits**

Run: `git push origin main`

Expected: remote `main` advances without force.

- [ ] **Step 2: Wait for GitHub Pages workflow success**

Check the newest Actions run for the pushed commit. If it fails, read the build diagnostics and fix only the deployment defect.

- [ ] **Step 3: Verify the live site**

Reload the public URL, bypass stale cache, and confirm the three removals, ANIZ letreiro, arara, typography, responsive layout, navigation, catalog, product page, cart, and checkout entry.

- [ ] **Step 4: Report exact verification and residual risk**

Include commit, live URL, checks run, graph analysis warning, and anything not tested on physical hardware.
