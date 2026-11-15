# Product context

Lumen Radar is intended to offer web and API analytics to Stellar ecosystem
projects, with private project views and a future global view for SCF operators.

Current authorized scope: the dashboard, local sign-in and signup, project creation,
and selection of website analytics, API analytics, or both. The user
explicitly requires realistic UI wording without demo/sample labels. Data is
empty for new projects. Local workspace records are scoped by normalized email and
preserve project drafts across reloads. Email/password sign-in stores only email in the browser;
passwords are not persisted or transmitted. No actual authentication backend,
tracking or additional analytics pages are implemented. Interface language is English.

The user requires Next.js, TypeScript, Animate UI, separate `components` and
`containers` folders, reusable presentation code, and pages that render containers.
Sections combining presentation components belong in containers. Structure is
inspired by https://github.com/luanlabs/fluxity-interface/tree/master/src.

The brand name is Lumen Radar. The user's supplied brand kit is the visual
authority: navy #0B2757, blue #244A97, white, and the original stepped-L mark.
The required interface typeface is Plus Jakarta Sans. Current redesign scope is
the existing dashboard only; the landing page and monorepo migration are excluded.
