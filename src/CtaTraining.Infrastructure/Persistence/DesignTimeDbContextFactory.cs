using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CtaTraining.Infrastructure.Persistence;

/// <summary>
/// Lets `dotnet ef migrations add` run without starting the API.
/// The connection string here is only used when you apply migrations from the
/// command line without passing --connection.
/// </summary>
internal sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<TrainingDbContext>
{
    public TrainingDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__TrainingDb")
            ?? "Server=localhost,1433;Database=CtaTraining;User Id=sa;Password=Your_password123;TrustServerCertificate=True";

        var options = new DbContextOptionsBuilder<TrainingDbContext>()
            .UseSqlServer(connectionString, sql => sql.MigrationsHistoryTable("__EFMigrationsHistory", "training"))
            .Options;

        return new TrainingDbContext(options);
    }
}
