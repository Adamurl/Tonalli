# Editorial, Modern Digital Studio — Visual Style Guide

> A practical reconstruction brief based on the public interface at [midu.design](https://midu.design/), inspected on **October 7, 2026**. This guide describes reusable visual patterns, not Midu’s proprietary identity, copy, logo, or portfolio assets. Use an original name, content, imagery, and signature motif.

## Evidence labels

- **Observed** — directly visible in the rendered desktop homepage or supported by its page structure and accessible labels.
- **Inferred** — a likely design intent or implementation interpretation, not a verified source value.
- **Recommended token** — a suggested starting value for a new design system. It is not claimed to be Midu’s exact CSS.

The rendered view inspected was a wide desktop viewport. Text extraction and a visual screenshot were available; exact source font files, CSS measurements, mobile layouts, and animation timing were not independently verified. Treat numerical recommendations below as starting points and tune them against your own content and device testing.

## 1. Design principles

### Observed

- **Darkness creates the canvas.** The page is predominantly near-black, so type and artwork carry the hierarchy.
- **One high-impact visual per moment.** The hero centers attention on a large, softly glowing red/pink typographic form; lower sections use large project imagery and carefully spaced text.
- **Editorial pacing.** Wide empty areas alternate with dense proof sections such as work, testimonials, pricing, and FAQs.
- **Confidence through restraint.** Most interface elements are quiet. Bright color is concentrated in the hero and project work.
- **Studio character with product clarity.** Minimal labels and short section introductions support direct, functional content.
- **Motion is part of the surface.** The hero contains an embedded gradient/shader experience; the page also exposes scroll cues and animated or repeated content regions.

### Inferred / recommended

- Build hierarchy with **scale, alignment, contrast, and whitespace** before adding decorative UI.
- Reserve saturated color for a small number of deliberate moments; avoid turning every control into an accent.
- Keep one recurring graphic idea (for example, a light field, abstract glyph, or material texture), but make it original to the new product.
- Alternate broad, image-led sections with narrower reading zones. This gives a long page a deliberate rhythm instead of a uniform stack of cards.

## 2. Page structure and editorial flow

### Observed homepage sequence

1. Persistent top navigation with brand mark, a centered menu/status capsule, and a right-aligned contact action.
2. Full-viewport hero: small studio/location metadata, oversized luminous graphic, concise headline, and “scroll to explore” cue.
3. Intro/about statement with a large heading, supporting copy, and process link.
4. Featured projects with brief context and image-led entries.
5. Trust section with client count and testimonial cards, including person and organization marks.
6. Tools strip and services overview.
7. Pricing models and reassurance callouts.
8. FAQ list.
9. Large closing statement, contact action, navigation/social links, and legal footer.

### Recommended section recipe

For each section, give the reader one clear job:

1. **Eyebrow** — short category or context label.
2. **Headline** — one strong editorial statement.
3. **Support** — one concise paragraph or a few concrete facts.
4. **Primary visual or evidence** — work, quote, metric, diagram, or product UI.
5. **Next action** — a text link or button only when there is a meaningful next step.

Vary the composition between sections (split text/image, full-bleed image, clustered cards, simple list). Keep section spacing and type rules consistent so the variation feels authored rather than arbitrary.

## 3. Typography

### Observed

- Headlines use a clean sans-serif appearance with compact, direct phrasing.
- The hero headline is much smaller than the huge backdrop graphic and sits in the upper-right region of the composition.
- Small metadata and navigation labels remain legible but visually secondary.
- Page headings frequently use sentence-style phrasing; uppercase treatment appears more in footer/legal details than in main editorial copy.
- The exact typeface and measured sizes are **not verified** from the available inspection.

### Recommended type system

Choose an original contemporary grotesk or humanist sans with a broad weight range. Pair it with a mono or compact sans only for utility metadata if that supports the product’s character.

| Role | Recommended starting size | Line height | Weight / treatment |
|---|---:|---:|---|
| Display / hero | `clamp(3rem, 6vw, 6.5rem)` | `0.92–1.02` | 450–600; tight tracking |
| Section heading | `clamp(2.25rem, 4.5vw, 5rem)` | `0.98–1.08` | 450–600 |
| Card heading | `1.25–1.75rem` | `1.1–1.2` | 500–600 |
| Lead copy | `1.125–1.5rem` | `1.35–1.5` | 400–500 |
| Body | `1rem–1.125rem` | `1.45–1.65` | 400 |
| Metadata | `0.75–0.875rem` | `1.3–1.45` | 400–500; modest tracking |

**Implementation guidance:** Use a fluid scale with `clamp()`, keep paragraph measure around `45–68ch`, and avoid setting long copy in all caps. Tighten display tracking only after checking the chosen font at the actual size. On small screens, preserve comfortable line-height and avoid shrinking body text to fit a desktop composition.

## 4. Spacing, grids, and alignment

### Observed

- The desktop hero uses generous outer margins and broad negative space.
- The header elements are distributed across the width rather than placed in a conventional compact navigation row.
- Lower page content uses wide imagery and multi-column groups, then becomes more text/list-oriented for FAQs and footer content.
- Exact grid count, max-width, and spacing values are **not verified**.

### Recommended layout tokens

| Token | Recommended value | Use |
|---|---:|---|
| `space-1` | `0.25rem` | Icon/text gap |
| `space-2` | `0.5rem` | Tight control padding |
| `space-3` | `0.75rem` | Compact metadata grouping |
| `space-4` | `1rem` | Base spacing |
| `space-6` | `1.5rem` | Card internals |
| `space-8` | `2rem` | Content grouping |
| `space-12` | `3rem` | Medium section gap |
| `space-16` | `4rem` | Large section gap |
| `space-24` | `6rem` | Editorial section padding |
| `space-32` | `8rem` | Hero / dramatic transitions |

Recommended grid: 12 columns on desktop, 8 on tablet, 4 on mobile; use a centered container capped around `80–90rem` with fluid side gutters (`clamp(1.25rem, 4vw, 4rem)`). Use a narrower reading column for FAQs and narrative copy. These are implementation starting points, not observed measurements.

## 5. Color system

### Observed

- The main canvas is black or near-black.
- Primary text is white; supporting text uses lower-contrast gray.
- Large hero artwork combines saturated red and hot pink with bloom, soft edges, and dark negative space.
- Project artwork supplies additional colors; the site chrome itself stays neutral.
- Exact sampled color values are **not verified**.

### Recommended tokens

```css
:root {
  /* Recommended starting tokens; tune for contrast and brand fit. */
  --color-canvas: #080808;
  --color-surface: #111111;
  --color-surface-raised: #1a1a1a;
  --color-text: #f5f5f3;
  --color-text-muted: #a3a3a3;
  --color-text-subtle: #737373;
  --color-line: rgb(255 255 255 / 12%);
  --color-accent: #ff3b52;
  --color-accent-secondary: #ff79a6;
}
```

Treat the red/pink pair as an optional expressive accent, not a required brand color. Check text contrast on every surface and do not place small text over busy glows without a stable dark backing.

## 6. Borders, dividers, corners, and surfaces

### Observed

- The page reads as a largely uninterrupted dark field; the first viewport has no prominent panel grid or heavy outlines.
- The menu/status control and call-to-action appear as rounded capsules.
- Content cards and media use shape and surface contrast more than obvious borders.
- Exact border widths and radii are **not verified**.

### Recommended

- Use hairline dividers (`1px` at low white opacity) to separate lists, FAQ rows, or footer groups.
- Prefer a tonal surface change over a border for card grouping; add a border only when needed for clarity.
- Reserve pill radii for compact controls and status chips. Use moderate rounding on media only when it supports the art direction; avoid rounding every container.
- Keep shadows subtle in a dark UI. A large glow belongs to the artwork, not to every interactive element.

## 7. Imagery and art direction

### Observed

- The hero uses an abstract oversized letterform/brand-like shape with a red-to-pink bloom and a dark center.
- Project entries are image-forward, with interface mockups and branded project visuals.
- Small client portraits and logos support testimonial attribution.
- The services/tools region includes a repeated strip of tool marks.

### Recommended

- Commission or generate original hero artwork: abstract typography, a shader field, 3D object, or material study. Do not reproduce the Midu glyph, logo, or exact gradient composition.
- Use project images as the primary card surface and keep labels close to the image so the work remains the focus.
- Crop consistently within a project group; use `object-fit: cover` and define focal points for each asset.
- Provide descriptive alt text when an image communicates project information. Mark purely decorative glow layers as decorative.
- Optimize heavy media, provide a static poster/fallback, and avoid making essential text part of a bitmap.

## 8. Navigation, buttons, and links

### Observed

- A persistent header places the studio mark at the left, a dark capsule containing “Menu” and availability status near the center, and a bright contact capsule at the right.
- The menu exposes home, pricing, process, and social destinations in the accessible page structure.
- Buttons use pill geometry; the contact action is light with dark text, while secondary actions are dark/tonal with light text and a small directional icon.
- A scroll cue points the visitor into the page.

### Recommended implementation

- Keep primary navigation short. On smaller screens, collapse it into an accessible menu button with a visible open/close state.
- Provide visible keyboard focus, minimum 44px touch targets, semantic links/buttons, and an `aria-expanded` state for disclosures.
- Use one primary action style (high contrast) and one quiet secondary style. Ensure icons never carry meaning alone.
- Make hover/focus states clear: slight surface or brightness shift, underline reveal, or small icon movement. Keep focus styling visible even when hover is subtle.
- Ensure sticky navigation does not cover anchor targets; apply scroll margin to section headings.

## 9. Cards and reusable editorial patterns

### Observed patterns

- **Project card:** large visual, service/category labels, project name, and a visit/case action.
- **Testimonial card:** quote first, person identity and role, avatar, and client logo.
- **Service item:** service title, brief info label, explanatory copy.
- **Pricing card:** model/plan name, large price, billing unit, feature list, and decorative keycap-like graphic.
- **FAQ row:** question with associated answer; repeated vertically as a compact long-form section.
- **Tools strip:** recognizable marks and labels in a repeated row/sequence.

### Recommended component behavior

- Project cards should be a single clear link target, with accessible name and restrained hover image treatment.
- Testimonial cards should preserve quote readability and clear attribution; never use carousel motion as the only way to reach content.
- Service cards can be borderless rows or a simple grid. Keep each description concise and parallel in structure.
- Pricing cards should make differences scannable. Use semantic lists for features and avoid relying on color alone to identify a recommended tier.
- FAQ disclosures should support keyboard activation, expose expanded state, and respect reduced-motion preferences.
- Tools/partner marquees should pause or become static when motion is reduced; do not endlessly animate when it adds no information.

## 10. Editorial patterns and copy layout

### Observed

- Headings use direct, conversational statements and include a short supporting sentence or paragraph.
- Section titles are often sentence-like rather than terse labels.
- Repetition appears in marquee-like or duplicated regions, likely supporting motion or continuous presentation.
- The long page alternates portfolio proof, service explanation, social proof, pricing, and answers to common questions.

### Recommended

- Write a headline that states a perspective, then use the body to prove it with specifics.
- Use short labels for context, not as substitutes for a useful heading.
- Keep one dominant message per viewport. Break long explanations into scannable subheads and lists.
- Treat duplicated marquee content as an enhancement only; preserve a complete, readable static version for assistive technology and reduced-motion users.

## 11. Responsive behavior

### What was observable

Only a wide desktop composition was visually inspected. The presence of responsive service and pricing content in the page structure does **not** prove how those sections reflow on mobile.

### Recommended responsive rules

- At narrow widths, stack hero metadata, headline, and action into a clear vertical reading order; scale the background artwork without hiding text.
- Collapse project grids to one column or a deliberate horizontal scroller with visible affordance. Prefer a normal stacked list when scrolling would hide content.
- Convert multi-column testimonials, services, pricing, and footer groups into one-column or compact two-column layouts as space permits.
- Keep the header controls reachable without crowding; move status metadata into the menu if necessary.
- Set breakpoints based on content fit, not device labels. Test at approximately 360px, 768px, and 1280px widths as a starting QA set.
- Check reduced viewport height and safe areas, especially for a full-screen hero and fixed header.

## 12. Motion and interaction

### Observed

- The hero includes an embedded shader/gradient experience.
- A live London time label and location are visible in the hero and closing region.
- A scroll prompt implies staged exploration; repeated testimonial/tool content suggests animated presentation may exist.
- Specific transition curves, durations, menu open behavior, and scroll-trigger behavior were not verified.

### Recommended motion system

- Use motion to reveal hierarchy: a restrained text fade/translate, image mask reveal, or slow ambient background shift.
- Keep interaction transitions around `160–280ms`; use longer timings only for ambient artwork or large scene changes.
- Avoid animating body copy in a way that delays access to content.
- Honor `prefers-reduced-motion`; provide static alternatives for shader, marquees, and scroll-linked effects.
- Keep scrolling natural and ensure controls remain usable if animation scripts fail.

## 13. Reusable component inventory

| Component | Purpose | Core anatomy | States / implementation notes |
|---|---|---|---|
| `SiteHeader` | Persistent wayfinding | Brand mark, menu/status control, primary action | Default, menu open, keyboard focus; compact layout on mobile |
| `MenuOverlay` | Site destinations | Main links, social links, close control | Focus management, Escape close, scroll lock, visible active state |
| `HeroStage` | Establish tone and promise | Metadata, original art layer, headline, scroll cue | Static fallback; responsive art crop; reduced-motion variant |
| `SectionIntro` | Introduce a content chapter | Eyebrow, heading, supporting copy, optional link | Use consistent semantic heading levels |
| `ProjectCard` | Present portfolio work | Media, tags, title, action | Hover/focus treatment; full card link with useful accessible name |
| `ProjectGrid` | Organize selected work | Responsive card collection | Column count follows content fit; stable aspect ratios |
| `TestimonialCard` | Establish trust | Quote, person, affiliation, portrait/logo | Static accessible order; attribution not image-only |
| `LogoOrToolStrip` | Show ecosystem or partners | Mark and label items | Static fallback or paused marquee; no distorted logos |
| `ServiceRow` | Explain capabilities | Service title, short label, description | Can be a responsive grid or divided list |
| `PricingCard` | Compare engagement options | Plan name, price, unit, feature list, action | Distinguish tiers with text and structure, not color alone |
| `ReassuranceNote` | Reduce purchase uncertainty | Small icon/illustration, heading, sentence | Keep independent of pricing card for flexible layout |
| `FAQDisclosure` | Answer common questions | Question button, answer panel, indicator | `aria-expanded`, keyboard support, reduced-motion behavior |
| `ClosingCTA` | End with a clear next step | Large headline, contact action, location detail | Strong contrast; no essential content hidden in motion |
| `SiteFooter` | Secondary navigation and legal links | Explore, social, copyright, policies | Stack columns on mobile; adequate link spacing |

## 14. Suggested CSS foundation

These variables are recommendations for a similar dark editorial system, not measured values from the reference site.

```css
:root {
  color-scheme: dark;
  --page-bg: #080808;
  --surface-1: #111111;
  --surface-2: #1a1a1a;
  --text-primary: #f5f5f3;
  --text-secondary: #a3a3a3;
  --text-tertiary: #737373;
  --rule: rgb(255 255 255 / 12%);
  --accent: #ff3b52;
  --accent-soft: #ff79a6;
  --radius-control: 999px;
  --radius-card: 1rem;
  --gutter: clamp(1.25rem, 4vw, 4rem);
  --content-max: 88rem;
  --section-space: clamp(5rem, 12vw, 11rem);
}

body {
  margin: 0;
  background: var(--page-bg);
  color: var(--text-primary);
  font-family: "Your chosen sans", sans-serif;
  -webkit-font-smoothing: antialiased;
}

.page-container {
  width: min(calc(100% - 2 * var(--gutter)), var(--content-max));
  margin-inline: auto;
}

.section {
  padding-block: var(--section-space);
}
```

## 15. Practical recreation checklist

- [ ] Start with a near-black canvas, readable type, and a restrained neutral surface palette.
- [ ] Design one original hero visual with strong scale and a controlled accent glow.
- [ ] Use a fluid type scale and maintain readable line lengths.
- [ ] Establish a wide container, generous gutters, and clear section rhythm.
- [ ] Build project, testimonial, service, pricing, FAQ, CTA, and footer patterns as reusable components.
- [ ] Make the navigation and every interactive pattern keyboard accessible.
- [ ] Test desktop and mobile reflow; the reference’s mobile behavior was not verified here.
- [ ] Add reduced-motion and static fallbacks before shipping shader or marquee effects.
- [ ] Use original branding, copy, project imagery, and illustration assets.

## Inspection notes

- Source: [midu.design](https://midu.design/)
- Inspection date: October 7, 2026 (America/Los_Angeles)
- Evidence: public homepage page structure and a rendered wide desktop view.
- Limitations: exact font family, CSS token values, responsive breakpoints, and detailed motion behavior were not confirmed.
