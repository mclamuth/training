using CtaTraining.Application.Abstractions;
using CtaTraining.Infrastructure.Persistence;
using CtaTraining.Infrastructure.Time;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CtaTraining.Infrastructure;

public static class DependencyInjection
{
    public const string ConnectionStringName = "TrainingDb";

    /// <summary>
    /// Registers persistence and shared services. The host must register its
    /// own <see cref="ICurrentUser"/> (HTTP user for the API, system user for the worker).
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        var connectionString = configuration.GetConnectionString(ConnectionStringName)
            ?? throw new InvalidOperationException(
                $"Connection string '{ConnectionStringName}' is not configured. See README.md, 'Local setup'.");

        services.AddSingleton(TimeProvider.System);
        services.AddSingleton<IClock, SystemClock>();
        services.AddScoped<AuditingInterceptor>();

        services.AddDbContext<TrainingDbContext>((sp, options) =>
        {
            options.UseSqlServer(connectionString, sql =>
            {
                sql.MigrationsHistoryTable("__EFMigrationsHistory", "training");
                sql.EnableRetryOnFailure();
            });
            options.AddInterceptors(sp.GetRequiredService<AuditingInterceptor>());
        });

        return services;
    }
}
