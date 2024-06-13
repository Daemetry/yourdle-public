using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Yourdle.Database.Model;
using Object = Yourdle.Database.Model.Object;

namespace Yourdle.WebApi.Controllers.GamesController;

public partial class GameController
{
    [HttpPost]
    [Route("get")]
    public IActionResult GetGame(GetGameRequest request)
    {
        if (request.GameId is null && request.GameCode is null)
            return BadRequest("At least one of the game code or game id must be supplied.");
        Database.Model.Game game;
        if (request.GameCode is not null) 
            try
            {
                game = dbContext.Games.First(t => t.GameCode == request.GameCode.ToUpperInvariant());
            }
            catch
            {
                return BadRequest("There is no game attributed to this game code.");
            }
        else 
            try
            {
                game = dbContext.Games.First(t => t.GameId == request.GameId);
            }
            catch
            {
                return BadRequest("There is no game with such id.");
            }

        ObjectType type;
        try
        {
            type = dbContext.Objecttypes.First(t => t.TypeId == game.ObjectTypeId);
        }
        catch
        {
            return BadRequest(
                "This error should be impossible to get, because any game theoretically features a type.");
        }
        
        return Ok(new GetGameResponse
        {
            Game = new Game()
            {
                Id = game.GameId,
                Code = game.GameCode,
                Name = game.Name,
                Type = new GameType()
                {
                    Name = type.TypeName,
                    Properties = dbContext.Typeproperties
                        .Where(tp=>tp.TypeId == type.TypeId)
                        .Select(tp=> new GameProperty()
                        {
                            Name = tp.PropertyName,
                            Type = tp.PropertyType
                        }).ToList()
                },
                Objects = dbContext.Objects
                    .Where(o => o.TypeId == type.TypeId)
                    .Select(o=> new GameObject()
                    {
                        Id = (int)o.ObjectId,
                        Name = o.ObjectName
                    }).ToList()
            }
        });
    }
}

public class GetGameRequest
{
    public int? GameId { get; set; }
    public string? GameCode { get; set; }
}

public class GetGameResponse
{
    public Game Game { get; set; }
}

public class Game
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public GameType Type { get; set; }
    public List<GameObject> Objects { get; set; }
}

public class GameObject
{
    public long Id { get; set; }
    public string Name { get; set; }
}

public class GameType
{
    public string Name { get; set; }
    public List<GameProperty> Properties { get; set; }
}