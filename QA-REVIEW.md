# Clew Labs QA Review

## Summary

The site is structurally and editorially strong: typography, palette, rhythm, and hierarchy are deliberate, and after the meta-line audit the Clew Suite reads as curated rather than listed. The two issues that materially undermine that craft are **performance** (logo PNGs averaging 3 MB each, plus a 2.4 MB favicon, push the page well over the 1 MB target) and a **broken social-share image** (`og-card.png` is referenced four times in the head but does not exist in the repo). Everything else is polish or judgment.

---

## Critical fixes (must address before sharing)

1. **`og-card.png` is missing.** Referenced at `index.html:22` (`og:image`) and `index.html:29` (`twitter:image`). When the site is shared on LinkedIn / iMessage / Slack / X, the preview will fall back to a generic placeholder or fail. Either create `images/og-card.png` (recommended: 1200×630 with the brand name + tagline) or remove the references.

2. **Logo asset weight.** Total of `images/` is ~40 MB; each Clew logo is between 2 and 7 MB:
   - `logo-memoria-clew.png` 7.1 MB
   - `logo-readme-clew.png` 3.6 MB
   - `logo-iris-clew.png` 3.5 MB
   - `logo-ariadne-clew.png` 3.3 MB
   - `logo-metis-clew.png` 3.2 MB
   - `logo-lumen-clew.png` 3.2 MB
   - `logo-athena-clew.png` 2.9 MB
   - `logo-clew-quest.png` 2.5 MB
   - `logo-agentis-lux.png` 2.3 MB

   The brief targets <200 KB per logo and <1 MB total page weight. Current Clew Suite section will pull ~30 MB on first load. On mobile/3G this is essentially unusable. Recommended fix: re-export each logo at 400×400 PNG with quantization (TinyPNG / squoosh.app); aim for 60–120 KB. No HTML change needed since each `<img>` already constrains to a 185×185 grid cell — the source files are simply much larger than rendered.

3. **Favicon is 2.4 MB.** `images/favicon.png`. Browsers downscale to 16/32 px but still pay the full transfer cost. Re-export at 256×256 PNG.

---

## Polish improvements (should address)

1. **Wins section pull-quote duplicates the new intro.** The Part 1D update made the intro now read "Five hackathon wins in nine months. One team, four solo. One writing, one comedy. Every winning build does the same structural thing: takes something invisible and makes it inspectable." The pull-quote at `index.html:1416` says the same second sentence almost verbatim ("Every winning build does the same structural thing. Takes something invisible and makes it inspectable."). Reading them back-to-back feels like an echo. Either delete the pull-quote or rewrite it to a different beat (e.g., a quote about volume, or about external deadlines). I did NOT touch the pull-quote since the brief said not to "improve" wording outside its scope.

2. **"Five wins" vs the wins-list count.** The new intro and the Story opening both say "Five wins." The wins-list at `index.html:1408–1414` shows seven rows, only three of which are explicitly "Winner" (the rest are Semi-finalist, Accepted, 4th of 250, 2nd of 14). The five-wins claim and the displayed list don't reconcile at a glance. Either tighten the list to the five wins or rephrase the intro to "Five wins, plus finalist placements."

3. **AgentisLux suite-map "Start here" + dead link.** `index.html:1170–1172` highlights AgentisLux as the suggested entry point ("Start here"), but its link is now "Site coming soon." A reader pulled to "Start here" hits a dead end. Consider either (a) reframing the suite-map label to "Building first" / "Launching May 2026," or (b) swapping the "Start here" highlight to Janus Clew (which is the closest shipped winner) until AgentisLux launches.

4. **Story aside thesis vs new opening.** The new opening framing leads with hackathons and volume, not courts. The aside thesis at `index.html:1107` still says "Started in a courtroom. Built for systems that need to explain themselves." It still fits, but the opening paragraph no longer sets it up the way the previous paragraph did. Worth reading the section aloud to see if the aside still lands.

5. **"Nine years" vs "Ten years" inconsistency.** Practice principle 04 (`index.html:1158`) says "Nine years in judicial systems." Story aside fact-stack (`index.html:1109`) says "10 years in courts." Pick one.

6. **Sienna link contrast.** `--sienna` (#E85A1F) on `--field` (#0A1F2E) is around 4.6:1 — just barely passing WCAG AA for normal-size text. Most `clew-link` and `civic-entry a` text is 0.92rem (~14.7 px), which is below the 18 px / 14 px-bold threshold for "large text." It passes, but barely. Bumping `--sienna` toward #F26B30 (~5.1:1) or using a slightly off-white for link text on dark surfaces would buy headroom without breaking the brand.

---

## Optional enhancements (nice to have)

1. **Active section indicator on anchor nav.** The nav stays visible on scroll, but doesn't show where the reader is. Adding a small JS observer + an `[aria-current="true"]` style on the active link would help orientation in a long page. Requires a few lines of JavaScript — out of scope for a static-only ethos but small if you want it.

2. **Visual treatment for hackathon winners in Movement 4.** Currently Janus and Memoria flag "Winner" inside the meta line, but visually look identical to non-winning entries. Steep gets a sienna left border in Movement 6 because it leads. The Movement 4 winners could carry the same treatment. The brief explicitly said NOT to do this, but flagging in case the decision was about avoiding visual chaos rather than principled restraint.

3. **Wins section weight.** "Five hackathon wins in nine months" is one of the strongest credibility signals on the page, but the section currently reads at the same visual weight as Practice or Other. Options: a larger headline at the top of the section, or a "5 / 17" stat card before the list. Not necessary, but the section could carry more.

4. **Screenshot moment.** The hero is the strongest screenshot candidate (CLEW · LABS, tagline, portrait). The Story pull-quote ("Every tool I build does the same structural thing...") is the second-strongest. Both already exist and will screenshot well. If you want a third, the new Wins intro is a natural pull-quote candidate — pull "Five hackathon wins in nine months" out as a large display callout above the list.

---

## What's working well

- **Typography system is uniform and disciplined.** Cinzel for display, Source Serif Pro for body, JetBrains Mono for utility — used consistently across every section.
- **Section markers (§ 01–§ 08) work as wayfinding without becoming visual noise** — small, mono, turquoise, doing exactly what they should.
- **Heading hierarchy is correct.** One `<h1>` (site name), `<h2>` for sections, `<h3>` for entries. No skips.
- **Alt text is descriptive** on every Clew logo, not just "logo." Athena Clew's alt is even smarter ("Athena Clew — Theseus logo") to reflect the engine.
- **Reduced-motion respected** for scroll-behavior at `index.html:1042`.
- **Focus states cover all interactive elements** via the `a:focus-visible, button:focus-visible` rule.
- **CRAP repetition is tight.** Every link in the Clew Suite ends with → (Unicode), every section uses the same headline + intro + content rhythm, every meta line now uses the same `Built for [Hackathon] [Year]` shape.
- **The "no AI in it, must pop" lens is met by typography and rhythm, not gimmicks.** No apologetic language anywhere on the page. The Practice section principles do double duty as a credibility signal.

---

## Specific code changes proposed (NOT applied)

### Wins pull-quote — replace to avoid echo with new intro

Current `index.html:1416–1419`:
```html
<blockquote class="pull-quote">
  Every winning build does the same structural thing.<br>
  Takes something invisible and makes it inspectable.
</blockquote>
```

Proposed (one option):
```html
<blockquote class="pull-quote">
  Volume is the practice.<br>
  External deadlines are the discipline.
</blockquote>
```

### Sienna contrast bump for link text only

Current rule `index.html:563–571`:
```css
.section-outro a, .paper-panel a, .clew-link, .other-entry a, .civic-entry a {
  color: var(--sienna);
  ...
}
```

Proposed addition (without changing the brand sienna for accent shapes):
```css
:root {
  --sienna-link: #F26B30;
}
.section-outro a, .clew-link, .other-entry a, .civic-entry a {
  color: var(--sienna-link);
}
```
Keeps sienna as the accent color for borders/marks; only link text gets the brighter shade.

### og-card.png placeholder until real card exists

If creating the OG card is going to take time, replace lines `index.html:22` and `index.html:29` with a path to an existing image (e.g., the favicon or `logo-cl.png`) so the social preview at least renders something on-brand:

```html
<meta property="og:image" content="https://clewlabs.com/images/logo-cl.png" />
<meta name="twitter:image" content="https://clewlabs.com/images/logo-cl.png" />
```
(Note: `logo-cl.png` is 1.2 MB; downsize before using as OG card. OG images should be 1200×630.)

### Anchor nav active section indicator (JS)

Adds ~20 lines of JS using IntersectionObserver. Not applied because the brief asked for restraint and no new interactive features. Worth weighing if you want orientation help in the long page.

---

## Specific code changes applied directly

1. **Skip-to-content link** added at `index.html` body start. CSS rule added in the head (`.skip-link`, hidden off-screen, slides in on focus, targets `#main-content`).

2. **`<main>` got `id="main-content"` and `tabindex="-1"`** so the skip link can land focus there.

3. **`.clew-link-inactive`** styled with transparent border-bottom override so the inherited underline from `.clew-link` doesn't show on the inactive AgentisLux paragraph.

4. **All Part 1 and Part 2 content edits** applied per spec:
   - 1A: AgentisLux link → "Site coming soon" non-link paragraph (`index.html:1199`)
   - 1B: Steep moved to first in `.other-grid` with `other-entry-winner` border + winner meta line (`index.html:1398–1404`); Sprint Kit and Le Petit Mot reordered
   - 1C: Story drop-cap paragraph replaced with new "Seventeen hackathons in nine months" framing (`index.html:1100`)
   - 1D: Wins intro replaced (`index.html:1398` — was 1364 before edits)
   - All 14 Clew Suite meta lines updated/added per the table
   - Panoptes Scout `civic-meta` line added (`index.html:1380`)
   - Sprint Kit and Le Petit Mot meta lines added

5. **CSS rules added** for `.clew-link-inactive`, `.clew-link-inactive::after`, `.civic-meta`, `.other-entry-winner`, `.other-meta` — placed alongside related rules in the `<style>` block.

---

*This audit was produced as a single pass against the full brief. Browser-level checks (FCP timing, anchor-nav active indicator behavior, exact pixel snap on mobile, console errors) require running the page in a browser; recommend a quick Lighthouse run after the asset-weight fixes land.*
