// CTA Training: one environment (dev, test or prod) in one resource group.
//
//   az deployment group create -g <resource-group> -f infra/main.bicep -p infra/env/dev.bicepparam
//
// After the first deployment, grant the two app identities access to the
// database with infra/sql/grant-app-access.sql (Bicep cannot create SQL users).

targetScope = 'resourceGroup'

@description('Environment name, used in resource names and app settings.')
@allowed(['dev', 'test', 'prod'])
param environmentName string

@description('Azure region for every resource.')
param location string = resourceGroup().location

@description('CTA Entra tenant ID.')
param tenantId string = subscription().tenantId

@description('Client ID of the API app registration ("CTA Training API").')
param apiClientId string

@description('Object ID of the Option 2 staff Entra group. Leave empty when the Option2 app role is assigned to that group instead.')
param option2GroupId string = ''

@description('Entra group that administers the SQL server (Entra-only authentication).')
param sqlAdminGroupName string

@description('Object ID of that Entra group.')
param sqlAdminGroupObjectId string

@description('App Service plan SKU. B1 is enough for dev; use P0v3 or larger for prod.')
param appServiceSku string = environmentName == 'prod' ? 'P0v3' : 'B1'

@description('Database size limit in GB. Training documents are stored in the database (250 GB budget).')
param databaseMaxSizeGb int = 300

@description('Short suffix that keeps globally unique names unique.')
param nameSuffix string = take(uniqueString(resourceGroup().id), 6)

var baseName = 'cta-training-${environmentName}'
var isProd = environmentName == 'prod'
var tags = {
  application: 'cta-training'
  environment: environmentName
}

// ---------- Monitoring ----------

resource logs 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'log-${baseName}'
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: isProd ? 90 : 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-${baseName}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logs.id
  }
}

// ---------- Secrets ----------

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: take('kv-ctatrn-${environmentName}-${nameSuffix}', 24)
  location: location
  tags: tags
  properties: {
    tenantId: tenantId
    sku: { family: 'A', name: 'standard' }
    enableRbacAuthorization: true
    enableSoftDelete: true
    enablePurgeProtection: isProd ? true : null
    softDeleteRetentionInDays: 90
  }
}

// ---------- Database ----------

resource sqlServer 'Microsoft.Sql/servers@2021-11-01' = {
  name: 'sql-${baseName}-${nameSuffix}'
  location: location
  tags: tags
  properties: {
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
    administrators: {
      administratorType: 'ActiveDirectory'
      azureADOnlyAuthentication: true
      login: sqlAdminGroupName
      sid: sqlAdminGroupObjectId
      principalType: 'Group'
      tenantId: tenantId
    }
  }
}

// Lets App Service reach the server. Replace with private endpoints before go-live if CTA requires it.
resource allowAzureServices 'Microsoft.Sql/servers/firewallRules@2021-11-01' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource database 'Microsoft.Sql/servers/databases@2021-11-01' = {
  parent: sqlServer
  name: 'sqldb-${baseName}'
  location: location
  tags: tags
  // Dev and test pause when idle; prod stays provisioned.
  sku: isProd
    ? { name: 'GP_Gen5', tier: 'GeneralPurpose', family: 'Gen5', capacity: 2 }
    : { name: 'GP_S_Gen5', tier: 'GeneralPurpose', family: 'Gen5', capacity: 2 }
  properties: {
    maxSizeBytes: databaseMaxSizeGb * 1024 * 1024 * 1024
    autoPauseDelay: isProd ? -1 : 60
    minCapacity: isProd ? null : json('0.5')
    zoneRedundant: false
    requestedBackupStorageRedundancy: isProd ? 'Geo' : 'Local'
  }
}

// ---------- App Service ----------

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'asp-${baseName}'
  location: location
  tags: tags
  kind: 'linux'
  sku: { name: appServiceSku }
  properties: {
    reserved: true // Linux
  }
}

// Managed identity sign-in; no SQL passwords anywhere.
var sqlConnectionString = 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Database=${database.name};Authentication=Active Directory Default;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'

var sharedSettings = [
  { name: 'ASPNETCORE_ENVIRONMENT', value: isProd ? 'Production' : 'Staging' }
  { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appInsights.properties.ConnectionString }
  { name: 'KeyVault__Uri', value: keyVault.properties.vaultUri }
]

var siteConfigBase = {
  linuxFxVersion: 'DOTNETCORE|10.0'
  alwaysOn: true
  ftpsState: 'Disabled'
  minTlsVersion: '1.2'
  http20Enabled: true
  healthCheckPath: '/health/live'
}

resource apiApp 'Microsoft.Web/sites@2023-12-01' = {
  name: 'app-${baseName}-${nameSuffix}'
  location: location
  tags: union(tags, { component: 'api-and-web' })
  kind: 'app,linux'
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: union(siteConfigBase, {
      appSettings: concat(sharedSettings, [
        { name: 'AzureAd__TenantId', value: tenantId }
        { name: 'AzureAd__ClientId', value: apiClientId }
        { name: 'Auth__Mode', value: 'Entra' }
        { name: 'Auth__Option2GroupId', value: option2GroupId }
      ])
      connectionStrings: [
        { name: 'TrainingDb', connectionString: sqlConnectionString, type: 'SQLAzure' }
      ]
    })
  }
}

resource workerApp 'Microsoft.Web/sites@2023-12-01' = {
  name: 'app-${baseName}-worker-${nameSuffix}'
  location: location
  tags: union(tags, { component: 'worker' })
  kind: 'app,linux'
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: union(siteConfigBase, {
      appSettings: sharedSettings
      connectionStrings: [
        { name: 'TrainingDb', connectionString: sqlConnectionString, type: 'SQLAzure' }
      ]
    })
  }
}

// ---------- Access ----------

var keyVaultSecretsUserRoleId = '4633458b-17de-408a-b874-0445c86b69e6'

resource apiKeyVaultAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, apiApp.id, keyVaultSecretsUserRoleId)
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', keyVaultSecretsUserRoleId)
    principalId: apiApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

resource workerKeyVaultAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, workerApp.id, keyVaultSecretsUserRoleId)
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', keyVaultSecretsUserRoleId)
    principalId: workerApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// ---------- Outputs (used by the deploy workflow and the SQL grant script) ----------

output apiAppName string = apiApp.name
output apiUrl string = 'https://${apiApp.properties.defaultHostName}'
output workerAppName string = workerApp.name
output sqlServerName string = sqlServer.name
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output databaseName string = database.name
output keyVaultName string = keyVault.name
