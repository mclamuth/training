namespace CtaTraining.Api.Auth;

public enum AuthMode
{
    /// <summary>Microsoft Entra ID bearer tokens (all deployed environments).</summary>
    Entra,

    /// <summary>A fake signed-in user for local development. Refused outside Development.</summary>
    Dev,
}

/// <summary>The "Auth" configuration section.</summary>
public sealed class AuthSettings
{
    public const string SectionName = "Auth";

    public AuthMode Mode { get; set; } = AuthMode.Entra;

    /// <summary>Delegated scope the SPA requests for this API (Entra mode only).</summary>
    public string RequiredScope { get; set; } = "access_as_user";

    /// <summary>
    /// Object ID of the Option 2 staff Entra group. Optional: the recommended setup
    /// assigns the "Option2" app role to that group instead (see docs/entra-setup.md).
    /// </summary>
    public string? Option2GroupId { get; set; }
}

/// <summary>The "DevAuth" configuration section: who you are when Auth:Mode is Dev.</summary>
public sealed class DevAuthSettings
{
    public const string SectionName = "DevAuth";

    public Guid ObjectId { get; set; } = new("00000000-0000-0000-0000-000000000001");
    public string Name { get; set; } = "Dev User";
    public string Email { get; set; } = "dev.user@cta.org";
    public string[] Roles { get; set; } = [];
    public bool IsOption2 { get; set; }
}
