using System;
using System.Collections.Generic;

namespace Yourdle.Database.Model;

public class ObjectType
{
    public int TypeId { get; set; }

    public int? UserId { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<Game> Games { get; set; } = new List<Game>();

    public virtual ICollection<Object> Objects { get; set; } = new List<Object>();

    public virtual ICollection<TypeProperty> TypeProperties { get; set; } = new List<TypeProperty>();

    public virtual User? User { get; set; }
}
