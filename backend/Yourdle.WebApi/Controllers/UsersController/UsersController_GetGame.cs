using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Mvc;
using Yourdle.Database.Model;
using static Yourdle.WebApi.Controllers.GamesController.GameExtensions;

namespace Yourdle.WebApi.Controllers.UsersController;

public partial class UsersController
{
    [HttpPost]
    [Route("getgame")]
    public IActionResult GetGame(UserGetGameRequest request)
    {
        int userId;
        try
        {
            userId = int.Parse(userManager.GetUserId(User));
        }
        catch (ArgumentNullException e)
        {
            return Unauthorized();
        }

        Game game;
        try
        {
            game = dbContext.Games.First(g => g.UserId == userId && g.GameId == request.GameId);
        }
        catch (InvalidOperationException e)
        {
            return Unauthorized("This game does not belong to this user.");
        }

        var type = dbContext.Objecttypes.First(ot => ot.TypeId == game.ObjectTypeId);
        
        return Ok(new
        {
            Game = new
            {
                Id = game.GameId,
                Code = game.GameCode,
                Name = game.Name,
                Public = game.Public,
                Type = new
                {
                    Name = type.TypeName,
                    Properties = dbContext.Typeproperties.Where(tp => tp.TypeId == type.TypeId).Select(tp => new
                    {
                        Id = tp.PropertyId,
                        Name = tp.PropertyName,
                        PropertyType = tp.PropertyType
                    })
                },
                objects = dbContext.Objects.Where(o => o.TypeId == type.TypeId).Select(o => new
                {
                    Id = o.ObjectId,
                    Name = o.ObjectName,
                    Properties = dbContext.Objectproperties.Where(op => op.ObjectId == o.ObjectId).Select(op => new
                    {
                        Id = op.PropertyId,
                        Value = GetValue(op.PropertyValue, dbContext.Typeproperties.First(tp => tp.PropertyId == op.PropertyId).PropertyType)
                    })
                })
            }
        });
    }
}

public class UserGetGameRequest
{
    public int GameId { get; set; }
}