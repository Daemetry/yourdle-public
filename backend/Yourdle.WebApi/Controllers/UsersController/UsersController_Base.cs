using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Yourdle.Database.Model;

namespace Yourdle.WebApi.Controllers.UsersController;

[ApiController]
[Route("type/properties")]
[Authorize]
public partial class UsersController(YourdbContext dbContext, UserManager<User> userManager) : ControllerBase;