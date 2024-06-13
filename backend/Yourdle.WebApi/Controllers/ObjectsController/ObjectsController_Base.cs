using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Yourdle.Database.Model;

namespace Yourdle.WebApi.Controllers.ObjectsController;

[ApiController]
[Route("objects")]
[Authorize]
public partial class ObjectsController(YourdbContext dbContext, UserManager<User> userManager) : ControllerBase;