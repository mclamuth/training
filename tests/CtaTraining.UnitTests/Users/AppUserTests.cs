using CtaTraining.Domain.Users;

namespace CtaTraining.UnitTests.Users;

public class AppUserTests
{
    [Fact]
    public void New_user_is_active_and_not_option2()
    {
        var user = new AppUser(Guid.NewGuid(), "pat@cta.org", "Pat Lee");

        Assert.True(user.IsActive);
        Assert.False(user.IsOption2);
        Assert.Null(user.ManagerUserId);
    }

    [Theory]
    [InlineData("", "Pat Lee")]
    [InlineData("pat@cta.org", " ")]
    public void Email_and_display_name_are_required(string email, string displayName)
    {
        Assert.ThrowsAny<ArgumentException>(() => new AppUser(Guid.NewGuid(), email, displayName));
    }

    [Fact]
    public void Manager_link_is_set_and_cleared()
    {
        var manager = new AppUser(Guid.NewGuid(), "boss@cta.org", "Sam Boss");
        var user = new AppUser(Guid.NewGuid(), "pat@cta.org", "Pat Lee");

        user.SetManager(manager);
        Assert.Equal(manager.Id, user.ManagerUserId);

        user.SetManager(null);
        Assert.Null(user.ManagerUserId);
    }

    [Fact]
    public void User_cannot_be_their_own_manager()
    {
        var user = new AppUser(Guid.NewGuid(), "pat@cta.org", "Pat Lee");

        Assert.Throws<InvalidOperationException>(() => user.SetManager(user));
    }

    [Fact]
    public void Directory_update_reactivates_a_deactivated_user()
    {
        var user = new AppUser(Guid.NewGuid(), "pat@cta.org", "Pat Lee");
        user.Deactivate();

        user.UpdateFromDirectory("pat.lee@cta.org", "Pat Lee", "IT", isOption2: true);

        Assert.True(user.IsActive);
        Assert.True(user.IsOption2);
        Assert.Equal("pat.lee@cta.org", user.Email);
        Assert.Equal("IT", user.Department);
    }
}
