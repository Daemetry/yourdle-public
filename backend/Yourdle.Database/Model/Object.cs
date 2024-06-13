using System;
using System.Collections.Generic;

namespace Yourdle.Database.Model;

public class Object
{
    public long ObjectId { get; set; }

    public int TypeId { get; set; }

    public string ObjectName { get; set; } = null!;

    public virtual ICollection<ObjectProperty> ObjectProperties { get; set; } = new List<ObjectProperty>();

    public virtual ObjectType Type { get; set; } = null!;
}
