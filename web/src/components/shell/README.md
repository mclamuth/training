# App shell

`AppHeader` is a stand-in for the shared CTA header used by the Bug Tracking app
(blue bar, app launcher on the left, CTA logo centred). When that repository is
available, the plan is to move its header into a small shared package that both
apps import, and replace `AppHeader`, `CtaLogo` and `icons.tsx` with it.

Keep the props `AppHeader` takes today (`me`, `navOpen`, `onToggleNav`) in mind
when wiring the shared component, so `AppShell` changes as little as possible.
