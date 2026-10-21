using CtaTraining.Domain.Common;

namespace CtaTraining.Domain.Users;

/// <summary>
/// A CTA staff member, mirrored from Entra ID. The manager link drives
/// registration approvals; Option 2 eligibility comes from an Entra group.
/// </summary>
public class AppUser : AuditableEntity
{
    private AppUser() { } // EF Core

    public AppUser(Guid entraObjectId, string email, string displayName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(displayName);

        EntraObjectId = entraObjectId;
        Email = email;
        DisplayName = displayName;
    }

    public Guid EntraObjectId { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public string DisplayName { get; private set; } = string.Empty;
    public string? Department { get; private set; }

    public Guid? ManagerUserId { get; private set; }
    public AppUser? Manager { get; private set; }

    public bool IsOption2 { get; private set; }
    public bool IsActive { get; private set; } = true;

    /// <summary>Applies the latest values from an Entra directory sync.</summary>
    public void UpdateFromDirectory(string email, string displayName, string? department, bool isOption2)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(displayName);

        Email = email;
        DisplayName = displayName;
        Department = department;
        IsOption2 = isOption2;
        IsActive = true;
    }

    public void SetManager(AppUser? manager)
    {
        if (manager is not null && manager.Id == Id)
        {
            throw new InvalidOperationException("A user cannot be their own manager.");
        }

        Manager = manager;
        ManagerUserId = manager?.Id;
    }

    /// <summary>Keeps the person's history but stops them signing up (left CTA, etc.).</summary>
    public void Deactivate() => IsActive = false;
}
