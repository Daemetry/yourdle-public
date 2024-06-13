using System.Reflection;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Yourdle.Database;
using Yourdle.Database.Model;

namespace Yourdle.WebApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        
        // Add services to the container.
        builder.Services.AddAuthentication();
        
        builder.Services.AddAuthorization();
        
        builder.Services.AddIdentityApiEndpoints<User>().AddEntityFrameworkStores<YourdbContext>();

        var connectionString = Environment.GetEnvironmentVariable("ConnectionString"); // Environment.GetEnvironmentVariable("ConnectionString");
        builder.Services.AddDatabaseServices(connectionString);
        
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin", builder =>
            {
                builder.WithOrigins("yourdle.fun")
                       .AllowAnyHeader()
                       .AllowAnyMethod();
            });
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowSpecificOrigin");
        
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapIdentityApi<User>();

        app.Run();
    }
}
