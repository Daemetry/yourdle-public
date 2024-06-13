using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Npgsql;
using Yourdle.Database.Model;

namespace Yourdle.Database;

public static class ServiceCollectionExtension
{
    private static NpgsqlDataSource datasource = null;
    
    public static IServiceCollection AddDatabaseServices(this IServiceCollection services, string connectionString)
    {
        if (datasource is null)
        {
            var temp = new NpgsqlDataSourceBuilder(connectionString);
            temp.MapEnum<PropertyType>("propertytype");
            datasource = temp.Build();
        }
        
        services.AddDbContext<YourdbContext>(options =>
        {
            options.UseNpgsql(datasource);
            options.ConfigureWarnings(builder => builder.Log((CoreEventId.ManyServiceProvidersCreatedWarning, LogLevel.Warning)));
        });
        return services;
    }
}