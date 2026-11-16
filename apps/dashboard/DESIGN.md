---
name: Lumen Radar
description: A clear operating workspace for web and API analytics.
colors:
  lumen-navy: "#0b2757"
  lumen-blue: "#244a97"
  background: "#ffffff"
  surface: "#ffffff"
  foreground: "#0b2757"
  muted: "#4c629a"
  accent: "#e8f0fc"
  border: "#d7e5f9"
  chart-fill: "#244a9708"
  success: "#267058"
  success-background: "#edf7f2"
typography:
  headline:
    fontFamily: "Space Grotesk Variable, Plus Jakarta Sans Variable, sans-serif"
    fontSize: "clamp(25px, 2.2vw, 32px)"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Space Grotesk Variable, Plus Jakarta Sans Variable, sans-serif"
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

Lumen Radar is an operating workspace: documentation-colored navigation beside a bright,
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

Match the landing page typography: Space Grotesk Variable for headings (h1–h3),
and Plus Jakarta Sans Variable for body text, navigation, forms, controls and data.
Both families are bundled locally through Fontsource, with the same fallback
stacks as the landing page. Use `--font-display` for heading roles and
`--font-sans` for interface text.
Headlines and metric values use tight tracking; titles use restrained semibold
weight. Supporting text is compact, generally (9–12px). Use tabular numerals for
measurements, shares and table values. At narrow widths the page headline is
(26px), metrics (25px) and panel titles (12px).

## Layout

The full-width brand header is (64px) tall and stays above the project workspace.
Sticky navigation starts below it, normally (236px) wide. Report content is capped at (1540px), with desktop horizontal
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
- **Navigation:** pale blue navigation in light mode and deep navy in dark mode,
  with primary-colored active text and an accent selection surface. Upcoming pages are disabled and marked Soon. Icon navigation
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

The `/login` route uses the existing navy/white palette and the shared locally
bundled Space Grotesk / Plus Jakarta Sans typography pairing. The white form surface and navy brand panel split the desktop view;
below 760px only the form surface remains. Brand artwork uses the original assets.
Inputs have visible labels, browser validation, a password visibility control and
clear focus states. Pages render containers; LoginForm owns form composition and
InputField remains reusable. Only email is persisted for the local flow, never the
password. Session logic is isolated from presentation for later server integration.


## Documentation theme parity

The dashboard uses the exact semantic palette in `../docs/src/app/globals.css`.
Light mode uses white (#ffffff), muted surfaces (#f4f8fe), navy ink (#0b2757),
secondary ink (#4c629a), blue actions (#244a97), accent (#e8f0fc), borders
(#d7e5f9), and focus rings (#3563c4). Dark mode uses canvas (#04102a),
surfaces (#071a3d), ink (#e8f0fc), muted ink (#9dbbf5), turquoise actions
and focus (#3fd6c9), navy accent (#0b2757), and borders (#123370).

The theme defaults to the system preference and persists explicit selection under
`lumen-radar-dashboard-theme`. Appearance controls are available on login, in the
account header, including the full-width project workspace header.
Brand assets switch from navy to white in dark mode. Fixed navy artwork panels
keep white artwork and text in both modes.

## Project workspace

The project detail page groups the date selector and refresh control with Website
activity. A single page-view measure sits beside an explicit loading, setup, empty,
error, or recorded-traffic state. Installation and its accordion guide share a
24px two-column grid above 1100px and stack below it. At 640px, the activity
summary stacks and controls remain touch accessible. The project selector is the
first item in the sidebar and stays usable as an icon when the sidebar collapses.
Its menu includes All projects. Existing sidebar navigation and Coming soon states
remain intact. The full-width header contains the brand, appearance control, and
account menu. Open website sits beside the website introduction in the content.
The script toolbar uses Animate UI's copy icon feedback and buttons, while the
existing Animate UI accordion and project dialogs retain their keyboard behavior
and the provider's reduced-motion preference. No traffic data is fabricated.
