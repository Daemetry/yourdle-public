using Microsoft.AspNetCore.Mvc;

namespace Yourdle.WebApi.Controllers.UsersController;

public partial class UsersController
{
    [HttpGet]
    [Route("getgames")]
    public IActionResult GetGames()
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

        return Ok(new
        {
            Games = dbContext.Games.Where(g => g.UserId == userId).Select(g => new
            {
                Id = g.GameId,
                Code = g.GameCode,
                Name = g.Name,
                Type = dbContext.Objecttypes.First(ot => ot.TypeId == g.ObjectTypeId).TypeName
            })
        });
    }
}