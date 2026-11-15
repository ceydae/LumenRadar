# LUMEN RADAR — Brand Asset Kit

A practical, organized export package based on the supplied logo and its generated brand variants. Original generated PNGs are preserved separately in `07_Original_Exports`.

## Directories

- **01_Logos** — Primary horizontal lockup and standalone wordmark (transparent navy / white / blue PNGs; traced SVGs); a dark-background banner.
- **02_Symbol** — Standalone stepped-L symbol, transparent PNGs and scalable traced SVGs, plus standard square sizes.
- **03_App_Icons** — iOS and Android raster icon sizes, Android 512 × 512, PWA icons and maskable variants. Square iOS exports intentionally have **no baked rounded corners** so that the operating system applies its own shape.
- **04_Favicons** — favicon.ico, SVG and PNG sizes (16, 32, 48, 64, 96, 180), Apple touch icon, a sample HTML snippet and a sample PWA manifest.
- **05_Social** — OpenGraph cover (1200 × 630) and wide banner (1600 × 500).
- **06_Brand_Guidelines** — Brand overview and color-token files (CSS/JSON).
- **07_Original_Exports** — Original AI-generated image exports, unmodified.

## Color tokens

- Navy: `#0B2757`
- Blue: `#244A97`
- White: `#FFFFFF`

## Notes

1. The vector SVGs are **auto-traced from PNG assets**, not the original designer-authored vector source. Review and refine them if you need manufacturing-grade or exact curve geometry.
2. The wordmark artwork is embedded as paths in SVGs; no external font installation is required.
3. The supplied imagery was raster-derived. PNG and favicon sizes are actual correctly sized output files, not merely renamed source images.
4. The included `site.webmanifest` uses relative file references intended as a starting point. Update paths after copying assets to your website's public folder.
5. The dark banner and preview preserve the original generated appearance; all standard-size iOS/Android/PWA app icons use a consistent solid navy field with a clean white symbol.