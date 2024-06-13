using Microsoft.AspNetCore.Mvc;
using Yourdle.Database.Model;

namespace Yourdle.WebApi.Controllers.TypePropertiesController;

public partial class TypePropertiesController
{
    [HttpPost]
    [Route("remove")]
    public IActionResult RemoveProperties(RemovePropertiesRequest request)
    {
        ObjectType type;
        try
        {
            type = dbContext.Objecttypes.FirstOrDefault(t => t.TypeId == request.TypeId);
        }
        catch (Exception e)
        {
            return BadRequest("Type does not exist");
        }

        var idsToRemove = new HashSet<long>(request.PropertyIds);
        var entities = dbContext.Typeproperties.Where(
            prop => idsToRemove.Contains(prop.PropertyId) && prop.TypeId == request.TypeId
            ).ToArray();
        
        if (entities.Length != idsToRemove.Count)
            return BadRequest("Some ids do not belong to this type.");
        
        dbContext.Typeproperties.RemoveRange(entities);
        dbContext.SaveChanges();

        return Ok(new RemovePropertiesResponse 
        { 
            TypeId = request.TypeId, 
            Properties = dbContext.Typeproperties.Where(p => p.TypeId == request.TypeId).Select(tp => new Property()
            {
                Name = tp.PropertyName, 
                Type = tp.PropertyType
            }).ToArray()
        });
    }
}

public class RemovePropertiesRequest
{
    public int TypeId { get; set; }
    public long[] PropertyIds { get; set; }
}

public class RemovePropertiesResponse
{
    public int TypeId { get; set; }
    public Property[] Properties { get; set; }
}

/*POST /type/properties/remove
request:
{
    typeId: int
    propertyIds: array of int
}
response:
{
    typeId: int,
    properties: array of
    {
        name: string,
        value: propertyType
    }
}*/