using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yourdle.Database.Model;

public class TypeProperty
{
    public long PropertyId { get; set; }

    public int TypeId { get; set; }

    public string PropertyName { get; set; } = null!;
    
    public PropertyType PropertyType { get; set; }

    public virtual ICollection<ObjectProperty> ObjectProperties { get; set; } = new List<ObjectProperty>();

    public virtual ObjectType Type { get; set; } = null!;
}
