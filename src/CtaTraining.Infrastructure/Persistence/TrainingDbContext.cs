using CtaTraining.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace CtaTraining.Infrastructure.Persistence;

public class TrainingDbContext(DbContextOptions<TrainingDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ArgumentNullException.ThrowIfNull(modelBuilder);
        modelBuilder.HasDefaultSchema("training");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TrainingDbContext).Assembly);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        ArgumentNullException.ThrowIfNull(configurationBuilder);
        // Strings default to a sane length instead of nvarchar(max).
        configurationBuilder.Properties<string>().HaveMaxLength(256);
    }
}
