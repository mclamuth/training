namespace CtaTraining.Domain.Security;

/// <summary>
/// Application roles. Trainer and Admin are Entra ID app roles assigned to
/// people. Employee is implied for every signed-in user from the CTA tenant,
/// so nobody has to assign it to the whole staff.
/// </summary>
public static class AppRoles
{
    public const string Employee = "Employee";
    public const string Trainer = "Trainer";
    public const string Admin = "Admin";

    public static readonly IReadOnlyList<string> All = [Employee, Trainer, Admin];
}

/// <summary>Authorization policy names used by API endpoints.</summary>
public static class AppPolicies
{
    /// <summary>Trainers and admins: anyone who can create trainings.</summary>
    public const string CanTeach = nameof(CanTeach);

    /// <summary>Admins only.</summary>
    public const string AdminOnly = nameof(AdminOnly);
}
