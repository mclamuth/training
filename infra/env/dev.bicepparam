using '../main.bicep'

// Fill in after creating the Entra app registrations and the SQL admin group
// (see docs/entra-setup.md). None of these values are secrets.
param environmentName = 'dev'
param apiClientId = '<api-app-registration-client-id>'
param option2GroupId = ''
param sqlAdminGroupName = '<sql-admin-group-name>'
param sqlAdminGroupObjectId = '<sql-admin-group-object-id>'
