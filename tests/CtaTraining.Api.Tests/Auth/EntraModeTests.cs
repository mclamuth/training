using System.Net;

namespace CtaTraining.Api.Tests.Auth;

public class EntraModeTests
{
    [Fact]
    public async Task Api_rejects_requests_without_a_token()
    {
        using var factory = new ApiFactory { AuthMode = "Entra" };

        var response = await factory.CreateClient().GetAsync(new Uri("/api/me", UriKind.Relative), TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Health_checks_stay_anonymous_in_entra_mode()
    {
        using var factory = new ApiFactory { AuthMode = "Entra" };

        var response = await factory.CreateClient().GetAsync(new Uri("/health/live", UriKind.Relative), TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public void Dev_auth_is_refused_outside_development()
    {
        using var factory = new ApiFactory { EnvironmentName = "Production", AuthMode = "Dev" };

        var error = Assert.ThrowsAny<Exception>(() => factory.CreateClient());

        Assert.Contains("only allowed in the Development environment", error.ToString(), StringComparison.Ordinal);
    }
}
