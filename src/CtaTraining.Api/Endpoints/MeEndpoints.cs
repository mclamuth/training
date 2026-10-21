using CtaTraining.Application.Abstractions;

namespace CtaTraining.Api.Endpoints;

public sealed record MeResponse(
    Guid? Id,
    string DisplayName,
    string? Email,
    IReadOnlyCollection<string> Roles,
    bool IsOption2);

public static class MeEndpoints
{
    /// <summary>GET /api/me: who the signed-in user is and what they may do.</summary>
    public static RouteGroupBuilder MapMeEndpoints(this RouteGroupBuilder api)
    {
        ArgumentNullException.ThrowIfNull(api);

        api.MapGet("/me", (ICurrentUser user) => TypedResults.Ok(new MeResponse(
                user.EntraObjectId,
                user.DisplayName,
                user.Email,
                user.Roles,
                user.IsOption2)))
            .WithName("GetMe")
            .WithTags("Me")
            .WithSummary("The signed-in user's identity, effective roles and Option 2 eligibility.");

        return api;
    }
}
