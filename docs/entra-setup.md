# Entra ID setup

CTA Training needs three app registrations and one security group per tenant.
Create them in the Microsoft Entra admin center under **App registrations**.
None of the values below are secrets; there are no client secrets anywhere.

## 1. CTA Training API

The registration the API validates tokens for.

1. **New registration**: name `CTA Training API`, single tenant. No redirect URI.
2. **Expose an API**:
   - Set the Application ID URI to the default, `api://<client-id>`.
   - Add a scope `access_as_user`; who can consent: Admins and users.
     Display name: "Use CTA Training as you".
3. **App roles**: create these three. For each, allowed member types are
   "Users/Groups" and the value must match exactly.

   | Display name | Value | Assign to |
   | --- | --- | --- |
   | Trainer | `Trainer` | Each trainer, or a "CTA Training Trainers" group |
   | Admin | `Admin` | CTA Training admins |
   | Option 2 staff | `Option2` | The existing Option 2 staff group |

   Everyone else is an Employee automatically; there is no Employee role to assign.

4. In **Enterprise applications > CTA Training API > Users and groups**, assign
   the roles above. Leave **Properties > Assignment required** set to **No** so
   all staff can sign in.

> Assigning app roles to groups needs Entra ID P1 or higher. Without it, leave
> the Option2 role unassigned, set `Auth:Option2GroupId` to the Option 2 group's
> object ID, and add a **groups** claim under **Token configuration**.

## 2. CTA Training (web app)

The registration the React app signs in with.

1. **New registration**: name `CTA Training`, single tenant.
2. **Authentication > Add a platform > Single-page application**. Redirect URIs:
   - `http://localhost:5173` (local development)
   - `https://<api-app-name>.azurewebsites.net` (one per environment)
3. **API permissions > Add > My APIs > CTA Training API > access_as_user**,
   then **Grant admin consent**. Keep Microsoft Graph `User.Read`.

Use its client ID for `VITE_ENTRA_CLIENT_ID` and the deploy workflow's
`SPA_CLIENT_ID` variable.

## 3. CTA Training GitHub Deploy

The identity the Deploy workflow uses. It signs in with OpenID Connect, so
there is no secret to store or rotate.

1. **New registration**: name `CTA Training GitHub Deploy`, single tenant.
2. **Certificates & secrets > Federated credentials > Add**, scenario
   "GitHub Actions deploying Azure resources":
   - Organization `mclamuth`, repository `training`, entity type
     **Environment**, environment name `dev`.
   - Repeat for `test` and `prod`.
3. In the Azure portal, give it **Contributor** on each environment's resource group.
4. Add it to each database with `infra/sql/grant-app-access.sql` so it can run
   migrations. Its SQL user name is the registration's display name.

## 4. SQL admin group

Create a security group (for example `CTA Training SQL Admins`) with the people
who administer the database, and put its name and object ID in
`infra/env/<env>.bicepparam`. The SQL server uses Entra-only authentication.

## Later phases

These are added when the features that need them are built:

- **Email and Outlook invites (Phase 2–3):** Microsoft Graph application
  permissions `Mail.Send` and `Calendars.ReadWrite` for the apps' managed
  identities, limited to `training@cta.org` with an Exchange application access policy.
- **Directory sync (Phase 2):** Graph `User.Read.All` for the worker's managed
  identity, to sync managers and departments.
- **Webex (Phase 3):** a Webex integration (OAuth) so each trainer can connect
  their own Webex account. Its client secret goes in Key Vault.
