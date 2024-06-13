using System;
using System.Collections.Generic;

namespace Yourdle.Database.Model;

public class ObjectProperty
{
    public long ObjectId { get; set; }

    public long PropertyId { get; set; }

    public byte[] PropertyValue { get; set; } = null!;

    public virtual Object Object { get; set; } = null!;

    public virtual TypeProperty Property { get; set; } = null!;
}
