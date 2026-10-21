using System.Security.Claims;
using CtaTraining.Application.Abstractions;
using Microsoft.Extensions.Options;

namespace CtaTraining.Api.Auth;

/// <summary>The signed-in person for the current HTTP request.</summary>
public sealed class ClaimsCurrentUser(IHttpContextAccessor httpContextAccessor, IOptions<AuthSettings> authSettings)
    : ICurrentUser
{
    private ClaimsPrincipal Principal => httpContextAccessor.HttpContext?.User ?? new ClaimsPrincipal();

    public bool IsAuthenticated => Principal.Identity?.IsAuthenticated == true;
    public Guid? EntraObjectId => CtaClaims.GetObjectId(Principal);
    public string? Email => CtaClaims.GetEmail(Principal);
    public string DisplayName => CtaClaims.GetDisplayName(Principal);
    public IReadOnlyCollection<string> Roles => CtaClaims.GetEffectiveRoles(Principal);
    public bool IsOption2 => CtaClaims.IsOption2(Principal, authSettings.Value.Option2GroupId);

    // Email is what admins recognise in audit views; fall back to the object ID.
    public string AuditName => Email ?? EntraObjectId?.ToString() ?? "anonymous";

    public bool IsInRole(string role) => CtaClaims.HasRole(Principal, role);
}
