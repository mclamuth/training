using System.Security.Claims;
using System.Text.Encodings.Web;
using CtaTraining.Domain.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace CtaTraining.Api.Auth;

/// <summary>
/// Signs every request in as the user described by the DevAuth settings, so the
/// app runs locally before the Entra app registrations exist. Only registered in
/// the Development environment (see AuthenticationSetup).
///
/// Send an "X-Dev-Role: Employee|Trainer|Admin" header to try another role
/// without restarting; the web app's role switcher does this.
/// </summary>
public sealed class DevAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    IOptionsMonitor<DevAuthSettings> devSettings)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string SchemeName = "Dev";
    public const string RoleHeader = "X-Dev-Role";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var settings = devSettings.CurrentValue;
        var roles = settings.Roles.AsEnumerable();

        if (Request.Headers.TryGetValue(RoleHeader, out var headerRole)
            && AppRoles.All.Contains(headerRole.ToString(), StringComparer.OrdinalIgnoreCase))
        {
            roles = [headerRole.ToString()];
        }

        var claims = new List<Claim>
        {
            new(CtaClaims.ObjectId, settings.ObjectId.ToString()),
            new(CtaClaims.Name, settings.Name),
            new(CtaClaims.PreferredUsername, settings.Email),
        };
        claims.AddRange(roles
            .Where(r => !string.Equals(r, AppRoles.Employee, StringComparison.OrdinalIgnoreCase))
            .Select(r => new Claim(CtaClaims.Roles, r)));
        if (settings.IsOption2)
        {
            claims.Add(new Claim(CtaClaims.Roles, CtaClaims.Option2Role));
        }

        var identity = new ClaimsIdentity(claims, SchemeName, CtaClaims.Name, CtaClaims.Roles);
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), SchemeName);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
