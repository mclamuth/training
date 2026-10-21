namespace CtaTraining.Application.Abstractions;

/// <summary>The person (or system process) making the current request.</summary>
public interface ICurrentUser
{
    bool IsAuthenticated { get; }

    /// <summary>Entra object ID (oid claim). Null for system processes.</summary>
    Guid? EntraObjectId { get; }

    string? Email { get; }
    string DisplayName { get; }

    /// <summary>Effective app roles, including the implied Employee role.</summary>
    IReadOnlyCollection<string> Roles { get; }

    bool IsOption2 { get; }

    /// <summary>Value written to CreatedBy / UpdatedBy audit columns.</summary>
    string AuditName { get; }

    bool IsInRole(string role);
}
