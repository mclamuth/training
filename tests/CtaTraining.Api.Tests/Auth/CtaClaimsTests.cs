using System.Security.Claims;
using CtaTraining.Api.Auth;
using CtaTraining.Domain.Security;

namespace CtaTraining.Api.Tests.Auth;

public class CtaClaimsTests
{
    private static ClaimsPrincipal SignedIn(params Claim[] claims) =>
        new(new ClaimsIdentity(claims, authenticationType: "test"));

    [Fact]
    public void Every_signed_in_user_is_an_employee()
    {
        var roles = CtaClaims.GetEffectiveRoles(SignedIn());

        Assert.Equal([AppRoles.Employee], roles);
    }

    [Fact]
    public void Anonymous_user_has_no_roles()
    {
        Assert.Empty(CtaClaims.GetEffectiveRoles(new ClaimsPrincipal(new ClaimsIdentity())));
    }

    [Fact]
    public void Trainer_and_admin_come_from_the_roles_claim()
    {
        var user = SignedIn(new Claim("roles", "Trainer"), new Claim("roles", "Admin"));

        Assert.Equal([AppRoles.Employee, AppRoles.Trainer, AppRoles.Admin], CtaClaims.GetEffectiveRoles(user));
    }

    [Fact]
    public void Mapped_long_role_claims_are_also_read()
    {
        var user = SignedIn(new Claim(ClaimTypes.Role, "Trainer"));

        Assert.True(CtaClaims.HasRole(user, AppRoles.Trainer));
    }

    [Fact]
    public void Unknown_roles_are_ignored()
    {
        var user = SignedIn(new Claim("roles", "SuperUser"));

        Assert.Equal([AppRoles.Employee], CtaClaims.GetEffectiveRoles(user));
    }

    [Fact]
    public void Option2_from_app_role()
    {
        var user = SignedIn(new Claim("roles", "Option2"));

        Assert.True(CtaClaims.IsOption2(user, option2GroupId: null));
        Assert.DoesNotContain("Option2", CtaClaims.GetEffectiveRoles(user));
    }

    [Fact]
    public void Option2_from_group_claim_when_group_id_is_configured()
    {
        const string groupId = "6f1c2a4e-1111-2222-3333-444455556666";
        var user = SignedIn(new Claim("groups", groupId));

        Assert.True(CtaClaims.IsOption2(user, groupId));
        Assert.False(CtaClaims.IsOption2(user, option2GroupId: null));
    }

    [Theory]
    [InlineData("access_as_user", true)]
    [InlineData("User.Read access_as_user", true)]
    [InlineData("User.Read", false)]
    public void Scope_claim_is_space_separated(string scp, bool expected)
    {
        Assert.Equal(expected, CtaClaims.HasScope(SignedIn(new Claim("scp", scp)), "access_as_user"));
    }

    [Fact]
    public void Display_name_falls_back_to_email()
    {
        var user = SignedIn(new Claim("preferred_username", "pat@cta.org"));

        Assert.Equal("pat@cta.org", CtaClaims.GetDisplayName(user));
    }
}
