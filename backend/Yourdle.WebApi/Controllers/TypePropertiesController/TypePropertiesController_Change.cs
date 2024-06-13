using Microsoft.AspNetCore.Mvc;
using Yourdle.Database.Model;

namespace Yourdle.WebApi.Controllers.TypePropertiesController;

public partial class TypePropertiesController
{
    [HttpPost]
    [Route("change")]
    public IActionResult ChangeProperties(ChangePropertiesRequest request)
    {
        if (dbContext.Objecttypes.FirstOrDefault(t => t.TypeId == request.TypeId) is null)
            return BadRequest("Type does not exist");
        
        var idsToChange = new HashSet<long>(request.ChangedProperties.Select(p => p.PropertyId));
        var entities = dbContext.Typeproperties.Where(
            prop => idsToChange.Contains(prop.PropertyId) && prop.TypeId == request.TypeId
        ).ToDictionary(p => p.PropertyId, p => p);
        
        if (entities.Count != idsToChange.Count)
            return BadRequest("Some ids do not belong to this type.");

        foreach (var changedProperty in request.ChangedProperties)
        {
            entities[changedProperty.PropertyId].PropertyType = changedProperty.NewType;
            foreach (var changedOp in dbContext.Objectproperties.Where(
                         op => op.PropertyId == changedProperty.PropertyId))
                changedOp.PropertyValue = null;
        }
        
        dbContext.SaveChanges();
        
        return Ok();
    }
}

public class ChangePropertiesRequest
{
    public int TypeId { get; set; }
    public ChangedProperty[] ChangedProperties { get; set; }
}

public class ChangedProperty
{
    public long PropertyId { get; set; }
    public PropertyType NewType { get; set; }
}

/*
POST /type/properties/change
    request:
{
    typeId: int
    changedProperties: array of 
    {
        propertyId: bigint,
        newValue: string | integer | date | image
    }
}
    response:
{

}
*/