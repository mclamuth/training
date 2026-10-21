using System.Net;
using System.Net.Http.Json;
using CtaTraining.Api.Endpoints;

namespace CtaTraining.Api.Tests.Endpoints;

public sealed class MeEndpointTests : IDisposable
{
    private readonly ApiFactory _factory = new();

    [Fact]
    public async Task Me_returns_the_dev_user_with_effective_roles()
    {
        var client = _factory.CreateClient();

        var me = await client.GetFromJsonAsync<MeResponse>("/api/me", TestContext.Current.CancellationToken);

        Assert.NotNull(me);
        Assert.Equal("Test Trainer", me.DisplayName);
        Assert.Equal("test.trainer@cta.org", me.Email);
        Assert.Equal(["Employee", "Trainer"], me.Roles);
        Assert.False(me.IsOption2);
    }

    [Theory]
    [InlineData("Employee", new[] { "Employee" })]
    [InlineData("Admin", new[] { "Employee", "Admin" })]
    public async Task Dev_role_header_switches_role(string role, string[] expected)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Dev-Role", role);

        var me = await client.GetFromJsonAsync<MeResponse>("/api/me", TestContext.Current.CancellationToken);

        Assert.Equal(expected, me!.Roles);
    }

    [Fact]
    public async Task Liveness_check_does_not_need_the_database()
    {
        var response = await _factory.CreateClient().GetAsync(new Uri("/health/live", UriKind.Relative), TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Unknown_api_route_is_404_not_the_spa()
    {
        var response = await _factory.CreateClient().GetAsync(new Uri("/api/nope", UriKind.Relative), TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    public void Dispose() => _factory.Dispose();
}
