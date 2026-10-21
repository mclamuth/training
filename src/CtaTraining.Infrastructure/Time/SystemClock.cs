using CtaTraining.Application.Abstractions;

namespace CtaTraining.Infrastructure.Time;

public sealed class SystemClock(TimeProvider timeProvider) : IClock
{
    public DateTimeOffset UtcNow => timeProvider.GetUtcNow();
}
