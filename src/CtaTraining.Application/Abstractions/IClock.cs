namespace CtaTraining.Application.Abstractions;

/// <summary>
/// Time source, so rules like "remind after 3 days" can be unit tested.
/// Prefer this over DateTimeOffset.UtcNow in application code.
/// </summary>
public interface IClock
{
    DateTimeOffset UtcNow { get; }
}
