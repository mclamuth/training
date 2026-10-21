using CtaTraining.Domain.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web;

namespace CtaTraining.Api.Auth;

public static class AuthenticationSetup
{
    /// <summary>
    /// Entra ID bearer auth in every deployed environment; a fake user in
    /// Development when Auth:Mode is Dev. Every endpoint requires a signed-in
    /// user unless it opts out with AllowAnonymous.
    /// </summary>
    public static IServiceCollection AddCtaAuthentication(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        ArgumentNullException.ThrowIfNull(configuration);
        ArgumentNullException.ThrowIfNull(environment);

        var settings = configuration.GetSection(AuthSettings.SectionName).Get<AuthSettings>() ?? new AuthSettings();
        services.Configure<AuthSettings>(configuration.GetSection(AuthSettings.SectionName));

        if (settings.Mode == AuthMode.Dev)
        {
            if (!environment.IsDevelopment())
            {
                throw new InvalidOperationException(
                    "Auth:Mode 'Dev' signs everyone in as a fake user and is only allowed in the Development environment.");
            }

            services.Configure<DevAuthSettings>(configuration.GetSection(DevAuthSettings.SectionName));
            services.AddAuthentication(DevAuthenticationHandler.SchemeName)
                .AddScheme<AuthenticationSchemeOptions, DevAuthenticationHandler>(DevAuthenticationHandler.SchemeName, null);
        }
        else
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(
                    jwt =>
                    {
                        configuration.Bind("AzureAd", jwt);
                        // Keep Entra's short claim names (oid, roles, scp, groups).
                        jwt.MapInboundClaims = false;
                        jwt.TokenValidationParameters.NameClaimType = CtaClaims.Name;
                        jwt.TokenValidationParameters.RoleClaimType = CtaClaims.Roles;
                    },
                    identity => configuration.Bind("AzureAd", identity));
        }

        services.AddAuthorizationBuilder()
            .SetFallbackPolicy(BuildSignedInPolicy(settings))
            .AddPolicy(AppPolicies.CanTeach, policy => policy
                .Combine(BuildSignedInPolicy(settings))
                .RequireAssertion(ctx =>
                    CtaClaims.HasRole(ctx.User, AppRoles.Trainer) || CtaClaims.HasRole(ctx.User, AppRoles.Admin)))
            .AddPolicy(AppPolicies.AdminOnly, policy => policy
                .Combine(BuildSignedInPolicy(settings))
                .RequireAssertion(ctx => CtaClaims.HasRole(ctx.User, AppRoles.Admin)));

        return services;
    }

    private static AuthorizationPolicy BuildSignedInPolicy(AuthSettings settings)
    {
        var builder = new AuthorizationPolicyBuilder().RequireAuthenticatedUser();

        if (settings.Mode == AuthMode.Entra)
        {
            // The SPA's token must carry this API's delegated scope.
            builder.RequireAssertion(ctx => CtaClaims.HasScope(ctx.User, settings.RequiredScope));
        }

        return builder.Build();
    }
}
