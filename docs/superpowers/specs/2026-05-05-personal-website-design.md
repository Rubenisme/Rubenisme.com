# Personal Website Design Spec
**Date:** 2026-05-05
**Status:** Approved

## Context

A personal + professional portfolio website for Rubenisme. Equal parts personal expression and professional showcase. The site needs to reflect the owner's aesthetic (aerial ocean photography palette) while being practical for job opportunities and sharing projects. The God/NDE interest is intentionally excluded — that belongs on a separate future website.

## Tech Stack

- **Framework:** Astro (static site generation)
- **Components:** Svelte/SvelteKit components for interactive elements if needed
- **Styling:** CSS with ocean-inspired custom properties
- **Package manager:** Bun (already installed, use `bun install` / `bun run dev`)
- **Deployment:** TBD

## Design Language

**Color palette** (pulled from boat cursor spec + aerial beach photography):
- Deep water: `#083b77` / `#0b4c9a` / `#1d7ddc` — hero background gradient
- Turquoise lagoon: `#48cae4` — accents, badges, hover states
- Sandy off-white: `#f4f8fb` — content section backgrounds
- Navy text: `#0d1b2a` — body text on light backgrounds
- White: `#ffffff` — card backgrounds, nav

**Signature interaction:** Custom boat cursor from `boat_cursor.md` — runs on all pages. This is the "wow" moment on first visit, not a theme that permeates every element.

**Typography:** Clean, modern sans-serif. Large heading in Hero, readable body size elsewhere.

**Responsive:** Mobile-first. Two-column layouts stack vertically on small screens.

## Page Structure

Single `index.astro` page. Five vertical sections, scrolled continuously. Nav stays fixed at top.

### 1. Nav (fixed/sticky)

```
[ Home ]  [ About ]  [ Projects ]  [ Contact ]
```

- Smooth scroll to section on click
- Subtle frosted glass / semi-transparent background so the hero gradient shows through
- Logo/name on the left, links on the right

### 2. Hero (full viewport)

- Background: deep ocean gradient (`#1d7ddc → #0b4c9a → #083b77`) from boat cursor spec
- Content: name centered, short tagline below (e.g. "Developer & maker of things")
- Subtle downward scroll indicator at bottom
- No other animation — the boat cursor is the experience

### 3. About

Two columns (stacked on mobile, Professional first):

**Left — Professional**
- Short paragraph: what you do and build
- Skills/tech list (scannable, not exhaustive)

**Right — Personal**
- Short paragraph: who you are beyond code — tech as passion, aesthetic (those aerial ocean views), what drives you
- Photo: an aerial ocean/beach image (no personal photo — privacy)

### 4. Projects

2-column card grid, 8 cards total:
- 4 "Built" cards (solid teal `#48cae4` status badge)
- 4 "In Progress" cards (outlined/muted badge, cards slightly desaturated)

Each card contains:
- Project name
- One-line description
- Status badge
- GitHub link icon (if public) OR lock icon (if private)

Hover effect: slight lift + box shadow. No lazy loading needed for 8 cards.

Apple-style progressive disclosure (expandable detail) is available as a future enhancement for tech stack, longer description, and screenshots within each card.

### 5. Contact

Centered section with three direct links:
- Email (opens mail client)
- GitHub profile
- LinkedIn profile

Each rendered as icon + label. No contact form.

### Footer

Three-column layout:
- **Left:** `© 2026 Rubenisme - All rights reserved.`
- **Center:** `Download CV · Blog · GitHub · LinkedIn`
- **Right:** `Built with Claude`

CV and Blog are placeholder links in v1, to be filled in later.

## File Structure

```
/
├── src/
│   ├── pages/
│   │   └── index.astro        # single page
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Projects.astro
│   │   ├── ProjectCard.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── styles/
│   │   └── global.css         # CSS custom properties, reset
│   └── scripts/
│       └── boat-cursor.js     # extracted from boat_cursor.md
├── public/
│   └── images/
│       └── about-ocean.jpg    # aerial ocean photo (About section, not Hero)
├── boat_cursor.md
└── docs/
    └── superpowers/specs/
        └── 2026-05-05-personal-website-design.md
```

## Content Placeholders

Items to fill in before/during implementation:
- Tagline text
- About professional paragraph
- About personal paragraph
- Skills list
- 8 project entries (name, description, URL or private flag)
- Email address
- GitHub profile URL
- LinkedIn profile URL
- CV file (or external link)
- Aerial ocean photo for About section (`public/images/about-ocean.jpg`)

## Verification

To confirm the site works end-to-end:
1. `bun run dev` starts Astro dev server, opens in browser
2. Boat cursor appears and animates on mouse movement
3. Nav links scroll smoothly to correct sections
4. All 8 project cards render with correct status badges
5. GitHub/lock icons display correctly per card
6. Contact links open correctly (email, GitHub, LinkedIn)
7. Footer renders three-column layout, all links present
8. Resize to mobile — columns stack, nav remains usable
