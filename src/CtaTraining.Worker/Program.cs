using CtaTraining.Application.Abstractions;
using CtaTraining.Infrastructure;
using CtaTraining.Worker;

// The worker is a web host only so Azure App Service can health-check it;
// its real work happens in hosted services.
var builder = WebApplication.CreateBuilder(args);

// Background jobs act as the system user in audit columns.
builder.Services.AddSingleton<ICurrentUser, SystemCurrentUser>();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHealthChecks();

if (!string.IsNullOrWhiteSpace(builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]))
{
    builder.Services.AddApplicationInsightsTelemetry();
}

builder.Services.AddHostedService<OutboxDispatcher>();

var app = builder.Build();
app.MapHealthChecks("/health/live");
await app.RunAsync();
