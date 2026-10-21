-- Run once per environment, connected to the database as a member of the SQL
-- admin group (Azure Data Studio, SSMS or sqlcmd with Entra sign-in).
-- Replace the names with the apiAppName and workerAppName outputs from the
-- Bicep deployment.

CREATE USER [app-cta-training-dev-xxxxxx] FROM EXTERNAL PROVIDER;
CREATE USER [app-cta-training-dev-worker-xxxxxx] FROM EXTERNAL PROVIDER;

-- Read and write data. Schema changes run from the deploy pipeline's
-- migration step, not from the apps, so the apps get no DDL rights.
ALTER ROLE db_datareader ADD MEMBER [app-cta-training-dev-xxxxxx];
ALTER ROLE db_datawriter ADD MEMBER [app-cta-training-dev-xxxxxx];
ALTER ROLE db_datareader ADD MEMBER [app-cta-training-dev-worker-xxxxxx];
ALTER ROLE db_datawriter ADD MEMBER [app-cta-training-dev-worker-xxxxxx];

-- The deploy pipeline's service principal applies migrations.
CREATE USER [github-cta-training-deploy] FROM EXTERNAL PROVIDER;
ALTER ROLE db_owner ADD MEMBER [github-cta-training-deploy];
