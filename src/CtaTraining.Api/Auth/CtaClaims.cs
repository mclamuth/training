using System.Security.Claims;
using CtaTraining.Domain.Security;

namespace CtaTraining.Api.Auth;

/// <summary>
/// Reads CTA identity facts from a token's claims. Accepts both the short Entra
/// claim names ("oid", "roles") and the long names ASP.NET maps them to, so it
/// works whatever the JWT handler's claim mapping is.
/// </summary>
public static class CtaClaims
{
    public const string ObjectId = "oid";
    public const string Roles = "roles";
    public const string Groups = "groups";
    public const string Name = "name";
    public const string PreferredUsername = "preferred_username";
    public const string Email = "email";
    public const string Scope = "scp";

    /// <summary>App role assigned to the Option 2 staff group (recommended setup).</summary>
    public const string Option2Role = "Option2";

    private const string LongObjectId = "http://schemas.microsoft.com/identity/claims/objectidentifier";
    private const string LongScope = "http://schemas.microsoft.com/identity/claims/scope";

    public static Guid? GetObjectId(ClaimsPrincipal user)
    {
        ArgumentNullException.ThrowIfNull(user);
        var value = user.FindFirstValue(ObjectId) ?? user.FindFirstValue(LongObjectId);
        return Guid.TryParse(value, out var id) ? id : null;
    }

    public static string? GetEmail(ClaimsPrincipal user)
    {
        ArgumentNullException.ThrowIfNull(user);
        return user.FindFirstValue(Email)
            ?? user.FindFirstValue(ClaimTypes.Email)
            ?? user.FindFirstValue(PreferredUsername)
            ?? user.FindFirstValue(ClaimTypes.Upn);
    }

    public static string GetDisplayName(ClaimsPrincipal user)
    {
        ArgumentNullException.ThrowIfNull(user);
        return user.FindFirstValue(Name)
            ?? user.FindFirstValue(ClaimTypes.Name)
            ?? GetEmail(user)
            ?? "Unknown user";
    }

    /// <summary>Raw role values from the token (Trainer, Admin, Option2 ...).</summary>
    public static IEnumerable<string> GetTokenRoles(ClaimsPrincipal user)
    {
        ArgumentNullException.ThrowIfNull(user);
        return user.FindAll(Roles).Concat(user.FindAll(ClaimTypes.Role)).Select(c => c.Value);
    }

    /// <summary>
    /// Effective app roles: Employee for every signed-in person, plus any of
    /// Trainer / Admin the token carries. Option2 is an eligibility flag, not a role.
    /// </summary>
    public static IReadOnlyCollection<string> GetEffectiveRoles(ClaimsPrincipal user)
    {
        ArgumentNullException.ThrowIfNull(user);
        if (user.Identity?.IsAuthenticated != true)
        {
            return [];
        }

        var tokenRoles = GetTokenRoles(user).ToHashSet(StringComparer.OrdinalIgnoreCase);
        return AppRoles.All
            .Where(role => role == AppRoles.Employee || tokenRoles.Contains(role))
            .ToArray();
    }

    public static bool HasRole(ClaimsPrincipal user, string role) =>
        GetEffectiveRoles(user).Contains(role, StringComparer.OrdinalIgnoreCase);

    public static bool IsOption2(ClaimsPrincipal user, string? option2GroupId)
    {
        ArgumentNullException.ThrowIfNull(user);
        if (GetTokenRoles(user).Contains(Option2Role, StringComparer.OrdinalIgnoreCase))
        {
            return true;
        }

        return !string.IsNullOrWhiteSpace(option2GroupId)
            && user.FindAll(Groups).Any(g => string.Equals(g.Value, option2GroupId, StringComparison.OrdinalIgnoreCase));
    }

    public static bool HasScope(ClaimsPrincipal user, string scope)
    {
        ArgumentNullException.ThrowIfNull(user);
        return user.FindAll(Scope).Concat(user.FindAll(LongScope))
            .SelectMany(c => c.Value.Split(' ', StringSplitOptions.RemoveEmptyEntries))
            .Contains(scope, StringComparer.Ordinal);
    }
}
