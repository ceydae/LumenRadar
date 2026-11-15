---
name: Lumen Radar
description: A clear operating workspace for web and API analytics.
colors:
  lumen-navy: "#0b2757"
  lumen-blue: "#244a97"
  background: "#f6f8fb"
  surface: "#ffffff"
  foreground: "#142b4d"
  muted: "#65758a"
  accent: "#edf2fa"
  border: "#e2e8f0"
  chart-fill: "#244a9708"
  success: "#267058"
  success-background: "#edf7f2"
typography:
  headline:
    fontFamily: "Plus Jakarta Sans Variable, sans-serif"
    fontSize: "clamp(25px, 2.2vw, 32px)"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Plus Jakarta Sans Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 650
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Plus Jakarta Sans Variable, sans-serif"
    fontSize: "13px"
  metric:
    fontFamily: "Plus Jakarta Sans Variable, sans-serif"
    fontSize: "clamp(26px, 2.35vw, 35px)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.035em"
rounded:
  badge: "4px"
  control: "6px"
  navigation: "7px"
  tooltip: "8px"
  panel: "12px"
  dialog: "14px"
components:
  button-primary:
    backgroundColor: "{colors.lumen-navy}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  button-primary-hover:
    backgroundColor: "{colors.lumen-blue}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  select:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "8px 30px 8px 11px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "23px 23px 18px"
  badge-success:
    backgroundColor: "{colors.success-background}"
    textColor: "{colors.success}"
    rounded: "{rounded.badge}"
    padding: "4px 6px"
---

# Design System: Lumen Radar

## Overview

Lumen Radar is an operating workspace: a navy navigation anchor beside a bright,
neutral report surface. Compact measurements and connection coverage support
repeated inspection. The supplied brand kit is the authority for the original
stepped-L symbol, white wordmark, navy and blue.

**Key Characteristics:**
- Compact report typography with prominent measurements.
- Flat white panels, cool borders and restrained blue emphasis.
- Locally bundled typography and original brand assets.

## Colors

The frontmatter records implemented primitives from `src/app/globals.css`.
Lumen navy anchors navigation, primary buttons and tooltips. Lumen blue identifies
chart lines, connection icons, links and interactive emphasis. The neutral
background separates white report panels; foreground, muted and border tokens
establish reading hierarchy. Green communicates connected status. The chart uses
the translucent chart-fill token as a solid area fill.

## Typography

Use Plus Jakarta Sans Variable throughout, bundled locally through Fontsource.
Headlines and metric values use tight tracking; titles use restrained semibold
weight. Supporting text is compact, generally (9–12px). Use tabular numerals for
measurements, shares and table values. At narrow widths the page headline is
(26px), metrics (25px) and panel titles (12px).

## Layout

Sticky navigation fills the viewport height, normally (236px) wide, beside a white
header (77px) tall. Report content is capped at (1540px), with desktop horizontal
padding (38px). Panels use a (22px) gap. Overview has a sample-data disclosure,
four-column metric strip, activity plot with a (284px) connection rail, then two
breakdown panels.

At (1240px), navigation and gutters tighten. At (1060px), navigation becomes an
icon rail with accessible names retained. At (800px), connections move below the
plot with two internal columns. At (640px), the header wraps, connections and
breakdowns stack, metrics use two columns, and content gutters become (16px).
At (1600px), the plot becomes taller. Allow long source names to wrap.

## Elevation & Depth

Panels are flat: white surfaces and thin borders provide structure. Only selected
metric tabs, tooltips and modals use shadows; exact values are in the sidecar.
Focus uses a blue outline (2px), offset (4px); navigation uses lighter blue against
navy.

## Shapes

Use rounded report panels, smaller controls and compact badges according to the
frontmatter. Dialogs have the largest corners. Keep separators thin and coverage
meters slender. Preserve original SVG logo paths; navigation assets trim viewBox
whitespace only, with brand source files retained intact.

## Components

- **Buttons and selectors:** compact navy primary actions and bordered white
  secondary actions. Primary hover changes to blue; secondary hover uses a pale
  surface and stronger border. Selectors retain native semantics.
- **Navigation:** white active text, translucent active surface and a small active
  marker on navy. Upcoming pages are disabled and marked Soon. Icon navigation
  retains accessible names.
- **Panels and metrics:** white bordered panels with compact headings; the metric
  strip uses internal dividers rather than separate floating cards.
- **Status badges:** connected status combines text and a green dot; status must
  remain understandable without color.
- **Activity plot:** Animate UI metric tabs switch the measure. Keep the ink-blue
  line and light fill static; expose daily values through an expandable table.
  Breakdown shares are relative to listed rows.
- **Overlays:** Animate UI supplies tooltip and modal transitions. Respect reduced
  motion and preserve keyboard focus behavior.

## Do's and Don'ts

- **Do** use the supplied Lumen Radar symbol and wordmark.
- **Do** keep report surfaces neutral and use blue for useful emphasis.
- **Do** use natural product copy and explicit status labels. The user requires
  no demo/sample wording in the interface; implementation limits belong in README.
- **Do** expose chart values as text and preserve tabular numerals.
- **Don't** replace the local Plus Jakarta Sans font with remote font requests.
- **Don't** imply disabled future pages or illustrative connections are live.
- **Don't** add decorative chart animation.

## Account entry

The `/login` route uses the existing navy/white palette and locally bundled Plus
Jakarta Sans. The white form surface and navy brand panel split the desktop view;
below 760px only the form surface remains. Brand artwork uses the original assets.
Inputs have visible labels, browser validation, a password visibility control and
clear focus states. Pages render containers; LoginForm owns form composition and
InputField remains reusable. Only email is persisted for the local flow, never the
password. Session logic is isolated from presentation for later server integration.
