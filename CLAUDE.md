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
- Web: strict TypeScript, no enums (`erasableSyntaxOnly`); use `as const` objects. Styles use the CSS variables in `web/src/styles/tokens.css`.
- Browser storage can be unavailable; wrap every access in try/catch (see `web/src/auth/devRole.ts`).

## Not yet available

- The shared CTA header from the Bug Tracking app: `web/src/components/shell/AppHeader.tsx` is a stand-in.
- The legacy database schema, needed for the migration tool.
- Figma designs: page components are placeholders until the designs land.
