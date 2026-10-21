# CTA Training: notes for contributors and coding agents

## Commands

- `dotnet build` / `dotnet test` from the repo root. Tests run on Microsoft.Testing.Platform (set in global.json).
- `cd web && npm run typecheck && npm run lint && npm test` for the React app.
- Migrations: `dotnet tool restore`, then `dotnet ef migrations add <Name> --project src/CtaTraining.Infrastructure --output-dir Persistence/Migrations`.

## Architecture rules

- Dependencies point inward: Api and Worker → Infrastructure → Application → Domain. Domain has no framework packages.
- Business rules (registration lifecycle, waitlist promotion, approvals) live in Domain and are unit tested there.
- Calls to outside services (Graph email and calendar, Webex) go through the outbox and the Worker, never inline in a request.
- Use `IClock`, not `DateTime.UtcNow`, so time-based rules can be tested. Store UTC; display Pacific time.
- Every API endpoint requires a signed-in user unless it opts out with `AllowAnonymous`. Check roles with `AppPolicies`; check "own training" in resource-based authorization handlers, not only in the UI.

## Code style

- Warnings are errors (`Directory.Build.props`), with the recommended .NET analyzers on. Use `[LoggerMessage]` for logging.
- NuGet versions live only in `Directory.Packages.props`.
- Web: strict TypeScript, no enums (`erasableSyntaxOnly`); use `as const` objects.
- Styles come from the approved Figma Make design ("Design CTA Training App Shell", file key `cbdwKvVeTCsBwBQclcSDpN`), split by area under `web/src/styles/`: `tokens.css`, `base.css`, `shell.css`, `components.css`, `responsive.css`, and one file per screen in `styles/pages/`. A screen imports its own page stylesheet. Reuse the design's class names and markup; put app-only additions in `styles/app.css`.
- Shared UI lives in `web/src/components/ui/` (Button, IconButton, Icon, Chip, FormatBadge, Field, Dialog, Drawer, ToastProvider/useToast). `/design-system` shows them all.
- Browser storage can be unavailable; wrap every access in try/catch (see `web/src/auth/devRole.ts`).

## Not yet available

- The legacy database schema, needed for the migration tool.
- Designs for the create-training wizard (Prompt 7) and for states and phone layouts (Prompt 10). Pages not yet built are placeholders.
