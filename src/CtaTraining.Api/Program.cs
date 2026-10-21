using CtaTraining.Api.Auth;
using CtaTraining.Api.Endpoints;
using CtaTraining.Application.Abstractions;
using CtaTraining.Infrastructure;
using CtaTraining.Infrastructure.Persistence;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCtaAuthentication(builder.Configuration, builder.Environment);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, ClaimsCurrentUser>();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks()
    .AddDbContextCheck<TrainingDbContext>("database", tags: ["ready"]);

if (!string.IsNullOrWhiteSpace(builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]))
{
    builder.Services.AddApplicationInsightsTelemetry();
}

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi().AllowAnonymous();

    if (app.Configuration.GetValue<bool>("Database:MigrateOnStartup"))
    {
        using var scope = app.Services.CreateScope();
        await scope.ServiceProvider.GetRequiredService<TrainingDbContext>().Database.MigrateAsync();
    }
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

// In Azure the built React app is published into wwwroot and served from here.
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

// Liveness never touches the database; readiness does.
app.MapHealthChecks("/health/live", new HealthCheckOptions { Predicate = _ => false }).AllowAnonymous();
app.MapHealthChecks("/health/ready", new HealthCheckOptions { Predicate = c => c.Tags.Contains("ready") }).AllowAnonymous();

var api = app.MapGroup("/api");
api.MapMeEndpoints();
// Unknown API routes are a 404, never the SPA's index.html.
api.MapFallback(() => Results.NotFound());

app.MapFallbackToFile("index.html").AllowAnonymous();

await app.RunAsync();

/// <summary>Exposed so integration tests can host the API in memory.</summary>
public partial class Program;
