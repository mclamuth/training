namespace CtaTraining.Domain.Common;

/// <summary>
/// Base class for every persisted entity. Audit columns are filled in by the
/// persistence layer on save, so domain code never sets them by hand.
/// </summary>
public abstract class AuditableEntity
{
    public Guid Id { get; protected set; } = Guid.NewGuid();

    public DateTimeOffset CreatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTimeOffset? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    /// <summary>SQL Server rowversion used for optimistic concurrency.</summary>
    public byte[] RowVersion { get; set; } = [];
}
