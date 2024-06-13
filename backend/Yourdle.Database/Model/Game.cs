using System;
using System.Collections.Generic;

namespace Yourdle.Database.Model;

public class Game
{
    public int GameId { get; set; }

    public string GameCode { get; set; } = null!;

    public int? UserId { get; set; }

    public int? ObjectTypeId { get; set; }

    public string Name { get; set; } = null!;

    public bool Public { get; set; }

    public virtual ObjectType? ObjectType { get; set; }

    public virtual User? User { get; set; }
}
