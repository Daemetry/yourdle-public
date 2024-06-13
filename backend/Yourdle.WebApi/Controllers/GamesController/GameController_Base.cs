using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Yourdle.Database.Model;
using Object = Yourdle.Database.Model.Object;

namespace Yourdle.WebApi.Controllers.GamesController;

[ApiController]
[Route("game")]
public partial class GameController(YourdbContext dbContext, UserManager<User> userManager) : ControllerBase
{
    private long DailyTarget(int gameId, int typeId)
    {
        var rnd = new Random(
            HashCode.Combine(DateOnly.FromDateTime(DateTime.Now),
                gameId)
        );
        var ids = dbContext.Objects.Where(o => o.TypeId == typeId).ToArray();
        return ids[rnd.NextInt64(1, ids.Length) - 1].ObjectId;
    }
}

public class GameProperty 
{
    public string Name { get; set; }
    public PropertyType Type { get; set; }
}

public static class GameExtensions
{
    public static dynamic GetValue(byte[] value, PropertyType type)
    {
        switch (type)
        {
            case PropertyType.String:
                return System.Text.Encoding.UTF8.GetString(value);
            case PropertyType.Integer:
                return int.Parse(System.Text.Encoding.UTF8.GetString(value));  
            case PropertyType.Date:
            case PropertyType.Image:
                throw new NotImplementedException();
            default:
                throw new ArgumentOutOfRangeException();
        }
    }
}