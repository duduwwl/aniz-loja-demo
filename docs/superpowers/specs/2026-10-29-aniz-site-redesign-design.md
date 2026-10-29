# Aniz Site Redesign — Design Specification

## Objective

Remove the generic demo-template look while keeping the existing store data, real photography, routes, cart, checkout, accessibility, and GitHub Pages deployment.

## Approved Direction

Use the “name as monument” direction already selected for Aniz. Borrow only the presentation logic from the Atheliê Márcio Moura reference: a large, delicate, responsive name treatment and a physical clothes-rail composition. Keep Aniz's blue identity, content, typography character, and product system.

## Requested Removals

- Remove the “Lua Luá / Pijamas em tons de rosa...” overlay from the home photograph.
- Remove the home purchase tag/form for “Pijama curto estampa cerejas”. Product purchase remains available on product pages.
- Remove the footer “Ver todas as peças” CTA tile.

## Visual System

- Keep `Italiana` for large display text because it matches the requested delicacy. Increase contrast through scale, spacing, darker ink, and cleaner compositions instead of a heavier replacement serif.
- Keep `Jost` for body and controls, but use regular/medium weights. Do not use thin body copy.
- Reduce the type scale to five clearly separated levels.
- Keep Aniz blue as the single interface accent. Use white, pale blue-grey, and deep navy as supporting fields.
- Replace repeated 1px boxes and hairline grids with spacing, filled tone fields, and a few intentional 2px structural bars.
- Use Lucide icons at consistent 18–20px sizing and 1.75–2 stroke width. No custom arrow glyphs where Lucide already covers the action.
- Buttons use a consistent 48px minimum height, direct labels, visible focus, and subtle `scale(0.97)` press feedback.

## Home Page

- First frame: real store photograph plus a large responsive “ANIZ” letreiro and short factual sentence. No product form over the hero.
- Keep the four real storefront themes as a photograph switcher, but remove the text overlay from the image.
- Make the existing `SwingingRail` the signature interaction. Restyle it as a metallic arara, like the reference's physical rail, while preserving drag, arrow keys, buttons, reduced motion, and product links.
- Keep departments, store story, and contact. Recompose them with fewer boxes and stronger type hierarchy.

## Internal Pages

- Catalog: clearer search/filter hierarchy, calm product cards, consistent controls and empty state.
- Product: stronger title/price hierarchy, restrained gallery controls, clearer option selection and primary action.
- Cart, checkout, confirmation, and mobile menu: same typography, button, icon, focus, and tone system. Do not alter validation, persistence, totals, routes, or demo-payment behavior.

## Footer

- Remove the CTA tile and local-time module.
- Use a large ANIZ wordmark as the closing letreiro, followed by compact navigation, contact, and demo disclosure.
- Preserve all factual contact links and the visible demonstration notice.

## Motion

- Reuse installed `motion`, `InView`, `TransitionPanel`, `AnimatedBackground`, and `SwingingRail`; add no dependency.
- The rail may swing because motion explains the physical object and direct manipulation.
- Use short transform/opacity feedback only. No universal fade-up, bounce, preloader, autoplay marquee, custom cursor, or decorative infinite loop.
- `prefers-reduced-motion` keeps content visible and removes travel/rotation.

## Responsive and Accessibility Requirements

- Support 320–1920px without horizontal overflow.
- Keep 44px minimum interactive targets, visible keyboard focus, semantic headings, usable dialogs, screen-reader labels, and keyboard rail navigation.
- Preserve real image alt text. Decorative repeats use empty alt text.
- Verify desktop, tablet, and phone screenshots plus keyboard paths.

## Content Boundaries

- Use only existing verified store facts and existing real photography.
- Do not invent address, hours, CNPJ, policies, testimonials, inventory claims, or social proof.
- Keep prices and checkout explicitly demonstrative.

## Success Criteria

- All three marked elements are absent.
- The site-wide text remains delicate but is materially easier to read.
- The ANIZ letreiro and arara are the two distinctive visual anchors.
- All existing purchase-flow tests pass.
- Typecheck, production build, visual inspection, responsive inspection, and live GitHub Pages check pass.
