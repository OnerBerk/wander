# Frontend Accessibility & SEO Audit

Audit scope: `apps/web`

Goal: reach a high quality baseline for accessibility (a11y) and SEO, with concrete prioritized actions.

---

## Quick Diagnosis

- Strengths:
  - Good semantic shell with `header` + `main`.
  - Buttons in several places already use `aria-label`.
  - Attribution links are present for map data providers.
  - PWA manifest exists.
- Main gaps:
  - Multiple high-impact accessibility issues around interactive map UI and dialogs.
  - Basic SEO metadata is missing from `index.html`.
  - Mobile and desktop heading structure is inconsistent.

---

## Priority Plan

Use this order:

- **P0 (must fix first)**: blockers for usability/compliance and basic SEO.
- **P1 (strongly recommended)**: important quality improvements.
- **P2 (advanced)**: polish and long-term improvements.

---

## P1 - Strongly Recommended

### 6) Add non-pointer access path for map items

- Current:
  - Event/metro markers are opened mostly via click handlers.
- Action:
  - Provide an alternate keyboard-accessible list of visible results.
  - Each item opens the same detail modal.
- Why:
  - Canvas/map interactions are not naturally accessible for keyboard/screen readers.

### 9) Ensure color contrast is AA on image/blur backgrounds

- Current:
  - Text over translucent/illustrated backgrounds may fail contrast in some states.
- Action:
  - Validate with contrast tooling on header and mobile panels (day/night variants).
  - Add overlays or stronger text colors when needed.
- Why:
  - WCAG contrast compliance.

## P2 - Advanced / Nice to Have

## Acceptance Checklist (Definition of Done)

Accessibility is considered "good baseline" when:

- [ ] Keyboard-only user can open/close all panels and dialogs.
- [ ] All dialogs have proper semantics and focus management.
- [ ] All clickable icons are true buttons.
- [ ] Motion is reduced when user requests reduced motion.
- [ ] Contrast checks pass on day/night states.
- [ ] Heading hierarchy is valid and consistent on mobile + desktop.

SEO is considered "good baseline" when:

- [ ] `lang="fr"` is set.
- [ ] Description + canonical + OG + Twitter tags are present.
- [ ] Only one meaningful page `h1`.
- [ ] `robots.txt` and `sitemap.xml` are served.
- [ ] Lighthouse SEO score is consistently high.

---

## Recommended Tooling for Validation

- Lighthouse (Chrome DevTools):
  - Accessibility
  - SEO
  - Best Practices
- axe DevTools browser extension for deep a11y checks.
- Manual keyboard test:
  - `Tab`, `Shift+Tab`, `Enter`, `Space`, `Esc`.
- Screen reader quick pass (VoiceOver/NVDA).

---

## Suggested Execution Order (Practical)

1. P0 items 1-5 in one cleanup pass.
2. Add validation workflow (Lighthouse/axe) before shipping more UI.
3. Tackle P1 map accessibility path (list fallback) as next major UX improvement.
4. Finish P2 SEO enrichments once routes/content model are stable.
