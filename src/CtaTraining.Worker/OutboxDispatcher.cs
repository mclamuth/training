namespace CtaTraining.Worker;

/// <summary>
/// Will send queued email, Outlook invites and Webex calls from the outbox table
/// (Phase 2). For now it only proves the worker host runs and stays healthy.
/// </summary>
public sealed partial class OutboxDispatcher(ILogger<OutboxDispatcher> logger) : BackgroundService
{
    private static readonly TimeSpan PollInterval = TimeSpan.FromSeconds(30);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        LogStarted(PollInterval);

        using var timer = new PeriodicTimer(PollInterval);
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            // Phase 2: claim pending OutboundMessage rows and dispatch them.
            LogNothingToDispatch();
        }
    }

    [LoggerMessage(Level = LogLevel.Information, Message = "Outbox dispatcher started; polling every {Interval}.")]
    private partial void LogStarted(TimeSpan interval);

    [LoggerMessage(Level = LogLevel.Debug, Message = "Outbox poll: nothing to dispatch yet.")]
    private partial void LogNothingToDispatch();
}
