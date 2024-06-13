using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Yourdle.Database.Model;
using Object = Yourdle.Database.Model.Object;

namespace Yourdle.WebApi.Controllers.VarietyController;

[ApiController]
public partial class VarietyController(YourdbContext dbContext, SignInManager<User> signInManager) : ControllerBase 
{}