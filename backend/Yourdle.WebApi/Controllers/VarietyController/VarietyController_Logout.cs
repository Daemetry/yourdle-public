using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Yourdle.WebApi.Controllers.VarietyController;

public partial class VarietyController
{
    [HttpGet]
    [Route("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }
}