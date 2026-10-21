using CtaTraining.Domain.Security;

namespace CtaTraining.Application.Abstractions;

/// <summary>Identity used by background jobs (outbox, reminders, directory sync).</summary>
public sealed class SystemCurrentUser : ICurrentUser
{
    public const string Name = "system";

    public bool IsAuthenticated => true;
    public Guid? EntraObjectId => null;
    public string? Email => null;
    public string DisplayName => Name;
    public IReadOnlyCollection<string> Roles { get; } = [AppRoles.Admin];
    public bool IsOption2 => false;
    public string AuditName => Name;

    public bool IsInRole(string role) => Roles.Contains(role, StringComparer.OrdinalIgnoreCase);
}
