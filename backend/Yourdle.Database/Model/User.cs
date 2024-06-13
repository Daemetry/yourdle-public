using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Yourdle.Database.Model;

public class User : IdentityUser<int>
{
    public virtual ICollection<Game> Games { get; set; } = new List<Game>();

    public virtual ICollection<ObjectType> ObjectTypes { get; set; } = new List<ObjectType>();
}
