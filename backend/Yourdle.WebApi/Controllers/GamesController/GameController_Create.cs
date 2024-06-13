using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Yourdle.Database.Model;
using Object = Yourdle.Database.Model.Object;

namespace Yourdle.WebApi.Controllers.GamesController;

public partial class GameController
{
    [HttpPost]
    [Route("create")]
    [Authorize]
    public IActionResult CreateGame(CreateGameRequest request)
    {
        int userId;
        try
        {
            userId = int.Parse(userManager.GetUserId(User));
        }
        catch (NullReferenceException e)
        {
            return Unauthorized();
        }
            
        
        if (request.TypeId is null && request.TypeName is null)
            return BadRequest("There must be either the id of an existing type or the name of one to create.");
        
        if (userId == 0 && request.GameName is null)
            return BadRequest($"The user is invalid or the name of the game is null.");

        if (!ValidateGameCode(request.GameCode))
            return BadRequest("Game code is invalid.");

        ObjectType type;
        if (request.TypeId is not null)
        {
            try
            {
                type = dbContext.Objecttypes.First(objectType => objectType.TypeId == request.TypeId);
            }
            catch (Exception e)
            {
                return BadRequest("This type does not exist.");
            }
                
            if (type.UserId != userId)
                return Unauthorized("This type is not attributed to requesting user.");
        }
        else
        {
            var typeEntity = dbContext.Objecttypes.Add(new ObjectType()
            {
                TypeName = request.TypeName,
                UserId = userId
            });
            dbContext.SaveChanges();
            type = typeEntity.Entity;
        } 
        
        var game = dbContext.Games.Add(new Database.Model.Game()
        {
            GameCode = request.GameCode ?? GenerateCode(request.GameName), // Possible error due to collisions in database!!
            Name = request.GameName,
            ObjectTypeId = type.TypeId,
            UserId = userId
        });
        dbContext.SaveChanges();
        
        return Ok(new CreateGameResponse()
        {
            GameCode = game.Entity.GameCode,
            GameId = game.Entity.GameId,
            TypeId = type.TypeId
        });
    }

    [GeneratedRegex(@"[A-Z\d]{7}")]
    private static partial Regex MyRegex();
    
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private static bool ValidateGameCode(string? gamecode) 
        => gamecode is null || MyRegex().IsMatch(gamecode);


    private static readonly HashSet<char> vowelsAndWhitespaces = ['a', 'e', 'i', 'u', 'o', ' ', '\t', '\n'];
    private static string GenerateCode(string gamename)
    {
        var code = string.Join("", gamename.Where(l => !vowelsAndWhitespaces.Contains(l)).Take(7));
        if (code.Length < 7)
            code = code[..4] + "DLE";
        return code.ToUpper();
        // TODO: нужно улушить генерацию кода, чтобы исключить как можно больше коллизий
        // (в бд стоит ограничение уникальности кода, так что коллизии вызывают ошибку создания игры)
    }
}

public class CreateGameRequest
{
    public string GameName { get; set; }
    public string? TypeName { get; set; }
    public string? GameCode { get; set; }
    public int? TypeId { get; set; }
}

public class CreateGameResponse
{
    public int GameId { get; set; }
    public string GameCode { get; set; }
    public int TypeId { get; set; }
}