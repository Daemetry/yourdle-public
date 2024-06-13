using Microsoft.AspNetCore.Mvc;

namespace Yourdle.WebApi.Controllers.GamesController;

public partial class GameController
{
    [HttpGet]
    [Route("public")]
    public IActionResult GetPublicGames()
    {
        return Ok(new
        {
            Games = dbContext.Games.Where(g => g.Public).Select(g => new
                {
                    Name = g.Name,
                    Code = g.GameCode,
                    Creator = dbContext.Users.First(u => u.Id == g.UserId).UserName
                } ).ToList()
        });
    }
}