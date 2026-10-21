using CtaTraining.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CtaTraining.Infrastructure.Persistence.Configurations;

internal sealed class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.ToTable("Users");
        builder.ConfigureAudit();

        builder.HasIndex(u => u.EntraObjectId).IsUnique();
        builder.HasIndex(u => u.Email);

        builder.Property(u => u.Email).HasMaxLength(320).IsRequired();
        builder.Property(u => u.DisplayName).HasMaxLength(200).IsRequired();
        builder.Property(u => u.Department).HasMaxLength(200);

        builder.HasOne(u => u.Manager)
            .WithMany()
            .HasForeignKey(u => u.ManagerUserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
