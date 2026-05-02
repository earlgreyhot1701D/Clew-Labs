# Clew Labs

The editorial home for L. Cordero and the Clew Suite of AI assisted developer tools.

## What this is

A static, single page editorial portfolio site. No backend, no database, no AI features in the site itself. Long scroll, dark teal field with cream paper inset panels, hand drawn aesthetic.

## Stack

- HTML5 with inline CSS and minimal vanilla JavaScript
- Google Fonts (Cinzel for display, Source Serif Pro for body, JetBrains Mono for markers)
- Inline SVG for the circuit pattern background and Clew tool placeholder logos
- Python 3 simple HTTP server for local preview

## Running locally

In Replit, the workspace runs automatically with `python3 -m http.server 8080`.

To run elsewhere:

```
python3 -m http.server 8080
```

Then open http://localhost:8080 in a browser.

## File structure

```
.
├── index.html          # The entire site
├── robots.txt          # Crawler rules, AI agents explicitly welcome
├── sitemap.xml         # SEO sitemap
├── images/             # Project logos and portrait
│   ├── clew-athena.png
│   ├── clew-argus.png
│   ├── clew-quest.png
│   └── ...             # Add other Clew tool logos here
├── .replit             # Replit run config
├── replit.nix          # Replit environment config
└── README.md           # This file
```

## Updating Clew tool logos

The site currently uses inline SVG placeholders for each Clew tool logo. To replace them with real illustrated logos:

1. Save each logo as a square PNG at minimum 400x400 in the `images/` folder
2. Use the naming convention: `clew-[name].png` (lowercase, hyphenated)
   - `clew-agentislux.png`
   - `clew-janus.png`
   - `clew-ariadne.png`
   - `clew-memoria.png`
   - `clew-metis.png`
   - `clew-lumen.png`
   - `clew-hermes.png`
   - `clew-anton.png`
   - `clew-readme.png`
   - `clew-iris.png`
   - `clew-directive.png`
   - `clew-athena.png` (already present)
   - `clew-argus.png` (already present)
   - `clew-quest.png` (already present)
3. Replace the `<svg class="placeholder-mark">...</svg>` block inside each `<div class="clew-logo">` with `<img src="images/clew-[name].png" alt="[Name] Clew logo" />`

## Updating the hero portrait

The hero currently uses an inline SVG placeholder. To add the real AI self portrait:

1. Save the portrait as `images/portrait.png` (recommended 720x720 or larger)
2. Replace the `<svg class="portrait-card">...</svg>` block inside `<div class="hero-portrait">` with `<img class="portrait-card" src="images/portrait.png" alt="L. Cordero" />`

## Updating the social card image

The Open Graph and Twitter Card meta tags reference `images/og-card.png`. This image appears when the site is shared on social platforms. Recommended size: 1200x630.

## Build principles

This site follows L. Cordero's documented build principles. See BUILD-PRINCIPLES.md on GitHub for the full set.

- One file, one responsibility
- No backend, no AI features in the site itself
- WCAG 2.1 AA compliant
- Self scanning: must pass agent readiness scan when AgentisLux ships

---

AI assisted. Human approved. Powered by NLP.
