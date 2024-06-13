using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Yourdle.Database.Model;
using Object = Yourdle.Database.Model.Object;
using static Yourdle.WebApi.Controllers.GamesController.GameExtensions;

namespace Yourdle.WebApi.Controllers.GamesController;

public partial class GameController
{
    private static State GetState(dynamic valueB, dynamic anotherValueB, PropertyType type)
    {
        var value = GetValue(valueB, type);
        var anotherValue = GetValue(anotherValueB, type);
        switch (type)
        {
            case PropertyType.String:
                return (string)value == (string)anotherValue ? State.Right : State.Wrong; 
            case PropertyType.Integer:
                if ((int)value > (int)anotherValue)
                    return State.Over;
                return (int)value < (int)anotherValue ? State.Under : State.Right;
            case PropertyType.Date:
                return State.Right;
            case PropertyType.Image:
                return State.Right;
            default:
                Console.WriteLine("wtf is this type");
                return State.Right;
        }
    }
    
    [HttpPost]
    [Route("guess")]
    public IActionResult GuessObject(GuessObjectRequest request)
    {
        if (request.GameId is null && request.GameCode is null)
            return BadRequest("At least one of the game code or game id must be supplied.");
        Database.Model.Game game;
        if (request.GameCode is not null)
            try
            {
                game = dbContext.Games.First(t => t.GameCode == request.GameCode);
            }
            catch (Exception e)
            {
                return BadRequest("There is no game attributed to this game code.");
            }
        else
            try
            {
                game = dbContext.Games.First(t => t.GameId == request.GameId);
            }
            catch (Exception e)
            {
                return BadRequest("There is no game with such id.");
            }
        
        var dailyTargetId = DailyTarget(game.GameId, game.ObjectTypeId!.Value);
        // Warning: nullable suppression. This shouldn't backfire, but just take note.
        // (foreshadowing?)
        
        Object guess;
        try
        {
            guess = dbContext.Objects.First(o => o.TypeId == game.ObjectTypeId && o.ObjectId == request.ObjectId);
        }
        catch (Exception e)
        {
            return BadRequest($"Game {game.Name} does not contain object with id {request.ObjectId}.");
        }

        if (dailyTargetId == guess.ObjectId)
        {
            return Ok(new GuessObjectResponse
            {
                Guessed = true,
                GuessProperties = dbContext.Objectproperties
                    .Where(op=>op.ObjectId == guess.ObjectId)
                    .Select(op => new GuessProperty()
                    {
                        Property = new GameProperty()
                        {
                            Name = dbContext.Typeproperties.First(tp=>tp.PropertyId == op.PropertyId).PropertyName,
                            Type = dbContext.Typeproperties.First(tp=>tp.PropertyId == op.PropertyId).PropertyType,
                        },
                        PropertyValue = GetValue(op.PropertyValue, dbContext.Typeproperties.First(tp=>tp.PropertyId == op.PropertyId).PropertyType),
                        State = State.Right
                    }).ToList()
            });
        }
        return Ok(new GuessObjectResponse
        {
            Guessed = false,
            GuessProperties = dbContext.Objectproperties
                .Where(op=>op.ObjectId == guess.ObjectId)
                .Select(op => new GuessProperty()
                {
                    Property = new GameProperty()
                    {
                        Name = dbContext.Typeproperties.First(tp=>tp.PropertyId == op.PropertyId).PropertyName,
                        Type = dbContext.Typeproperties.First(tp=>tp.PropertyId == op.PropertyId).PropertyType,
                    },
                    PropertyValue = GetValue(op.PropertyValue, dbContext.Typeproperties.First(tp => tp.PropertyId == op.PropertyId).PropertyType),
                    State = GetState(dbContext.Objectproperties
                        .First(t => t.ObjectId == dailyTargetId && t.PropertyId == op.PropertyId).PropertyValue,
                        op.PropertyValue,
                        op.Property.PropertyType)
                }).ToList()
        });
    }
}

public class GuessObjectRequest
{
    public int? GameId { get; set; }
    public string? GameCode { get; set; }
    public int ObjectId { get; set; }
}

public class GuessObjectResponse
{
    public bool Guessed { get; set; }
    public List<GuessProperty> GuessProperties { get; set; }
    
}

public class GuessProperty
{
    public GameProperty Property { get; set; }
    public dynamic PropertyValue { get; set; }
    public State State { get; set; }
}

public enum State
{
    Wrong,
    Right, 
    Under,
    Over
}
