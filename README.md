# CTA Training

Training calendar for California Teachers Association staff. Employees find
trainings and register for sessions; managers approve; trainers schedule and run
trainings. Replaces the legacy CTA Training web app.

**Stack:** ASP.NET Core on .NET 10 · EF Core · Azure SQL · React 19 + TypeScript
(Vite) · Microsoft Entra ID sign-in · Azure App Service · GitHub Actions.

Requirements and architecture: the "CTA Training Calendar – Requirements &
Architecture" doc.

## Repository layout

```
src/
  CtaTraining.Api             ASP.NET Core API; also serves the built web app in Azure
  CtaTraining.Application     Use cases and interfaces (ICurrentUser, IClock)
  CtaTraining.Domain          Entities and rules; no framework dependencies
  CtaTraining.Infrastructure  EF Core, migrations, and (later) Graph and Webex clients
  CtaTraining.Worker          Background jobs: outbox, reminders, directory sync
tests/
  CtaTraining.UnitTests       Domain and application tests
  CtaTraining.Api.Tests       API tests hosted in memory
web/                          React app
infra/                        Bicep for Azure, plus the one-time SQL access script
docs/                         Setup guides
```

## Local setup

You need the [.NET 10 SDK](https://dotnet.microsoft.com/download), Node.js 22,
and SQL Server. The quickest SQL Server is Docker:

```bash
docker run -d --name cta-training-sql -p 1433:1433 \
  -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='Your_password123' \
  mcr.microsoft.com/mssql/server:2022-latest
```

That password matches `appsettings.Development.json`. It is for local
containers only; deployed environments use managed identities and no passwords.

Then, in two terminals:

```bash
# API on http://localhost:5065; applies migrations on startup in Development
dotnet run --project src/CtaTraining.Api

# Web app on http://localhost:5173; proxies /api to the API
cd web
npm install
npm run dev
```

Open http://localhost:5173.

### Signing in locally

By default, development runs in **dev auth mode**: no Entra sign-in, and every
request is a fake user set in `DevAuth` in `appsettings.Development.json`.
Use **Dev mode: view as** in the user menu (top right) to switch between
Employee, Trainer and Admin. The API refuses dev auth outside the Development
environment.

To sign in with real Entra accounts locally, follow
[docs/entra-setup.md](docs/entra-setup.md), then:

- API: set `Auth:Mode` to `Entra` and fill in `AzureAd:TenantId` and
  `AzureAd:ClientId` (use `dotnet user-secrets` or environment variables).
- Web: copy `web/.env.example` to `web/.env.local` and fill it in.

## Common tasks

```bash
dotnet build                     # whole solution; warnings fail the build
dotnet test                      # all .NET tests
cd web && npm test               # web tests (Vitest)
cd web && npm run typecheck && npm run lint
```

### Database migrations

```bash
dotnet tool restore
dotnet ef migrations add <Name> --project src/CtaTraining.Infrastructure --output-dir Persistence/Migrations
dotnet ef database update --project src/CtaTraining.Infrastructure
```

CI fails if the model has changed without a migration.

## Deploying

1. Create the Entra app registrations and the SQL admin group
   ([docs/entra-setup.md](docs/entra-setup.md)).
2. Fill in `infra/env/dev.bicepparam` and deploy the infrastructure:
   ```bash
   az group create -n rg-cta-training-dev -l westus2
   az deployment group create -g rg-cta-training-dev -f infra/main.bicep -p infra/env/dev.bicepparam
   ```
3. Run `infra/sql/grant-app-access.sql` against the new database, using the app
   names from the deployment outputs.
4. In GitHub, create the `dev` environment and set the variables listed at the top
   of `.github/workflows/deploy.yml`.
5. Run the **Deploy** workflow from the Actions tab.

## Conventions

- Package versions live in `Directory.Packages.props`; shared build settings in
  `Directory.Build.props`.
- Every API endpoint requires a signed-in user unless it opts out with
  `AllowAnonymous`. Role checks use `AppPolicies` on the API, and the web app
  hides what a role can't use. The API check is the one that counts.
- Times are stored in UTC and shown in Pacific time.
