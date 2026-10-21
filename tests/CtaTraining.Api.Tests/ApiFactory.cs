using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace CtaTraining.Api.Tests;

/// <summary>
/// Hosts the API in memory. Endpoints under test must not need a database:
/// the connection string points at a server that is never opened.
/// </summary>
public sealed class ApiFactory : WebApplicationFactory<Program>
{
    public string EnvironmentName { get; init; } = "Development";
    public string AuthMode { get; init; } = "Dev";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);
        builder.UseEnvironment(EnvironmentName);

        // UseSetting goes into host configuration, which Program reads at startup.
        builder.UseSetting("Auth:Mode", AuthMode);
        builder.UseSetting("Database:MigrateOnStartup", "false");
        builder.UseSetting("ConnectionStrings:TrainingDb", "Server=unused.invalid;Database=Unused;TrustServerCertificate=True");
        builder.UseSetting("DevAuth:Name", "Test Trainer");
        builder.UseSetting("DevAuth:Email", "test.trainer@cta.org");
        builder.UseSetting("DevAuth:Roles:0", "Trainer");
        builder.UseSetting("AzureAd:TenantId", "11111111-1111-1111-1111-111111111111");
        builder.UseSetting("AzureAd:ClientId", "22222222-2222-2222-2222-222222222222");
    }
}
