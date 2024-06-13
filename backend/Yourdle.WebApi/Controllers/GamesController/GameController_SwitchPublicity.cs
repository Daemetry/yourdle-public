using Microsoft.AspNetCore.Mvc;

namespace Yourdle.WebApi.Controllers.GamesController;

public partial class GameController
{
    [HttpPost]
    [Route("switch-publicity/{gameId:int}")]
    public IActionResult SwitchPublicity(int gameId)
    {
        Yourdle.Database.Model.Game game;
        try
        {
            game = dbContext.Games.First(g => g.GameId == gameId);
        }
        catch (Exception e)
        {
            return BadRequest();
        }

        game.Public = !game.Public;
        dbContext.SaveChanges();
        
        return Ok();
    }
}