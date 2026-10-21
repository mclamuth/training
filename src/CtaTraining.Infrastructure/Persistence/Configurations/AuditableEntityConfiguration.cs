using CtaTraining.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CtaTraining.Infrastructure.Persistence.Configurations;

/// <summary>Column setup shared by every entity that derives from AuditableEntity.</summary>
internal static class AuditableEntityConfiguration
{
    public static void ConfigureAudit<T>(this EntityTypeBuilder<T> builder)
        where T : AuditableEntity
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();
        builder.Property(e => e.CreatedBy).HasMaxLength(256).IsRequired();
        builder.Property(e => e.UpdatedBy).HasMaxLength(256);
        builder.Property(e => e.RowVersion).IsRowVersion();
    }
}
