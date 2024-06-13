using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Yourdle.Database.Model;

namespace Yourdle.WebApi.Controllers.TypePropertiesController;

public partial class TypePropertiesController
{
    [HttpPost]
    [Route("add")]
    public IActionResult AddProperties(AddPropertiesRequest request)
    {
        try
        {
            dbContext.Objecttypes.First(t => t.TypeId == request.TypeId);
        }
        catch (Exception e)
        {
            return BadRequest("Type does not exist");
        }

        var newProperties = new IdNameProperty[request.Properties.Length];
        for (var i = 0; i < request.Properties.Length; i++)
        {
            var property = request.Properties[i];
            var e = dbContext.Typeproperties.Add(new TypeProperty
                { TypeId = request.TypeId, PropertyName = property.Name, PropertyType = property.Type });
            dbContext.SaveChanges();
            newProperties[i] = new IdNameProperty() { Id = e.Entity.PropertyId, Name = e.Entity.PropertyName };
        }

        dbContext.SaveChanges();
        
        return Ok(new 
        { 
            Properties = newProperties
        });
    }
}

public class AddPropertiesRequest
{
    public int TypeId { get; set; }
    public Property[] Properties { get; set; }
}

public class IdNameProperty
{
    public long Id { get; set; }
    public string Name { get; set; }
}

/*POST /type/properties/add
request:
{
    typeId: int
    properties: array of
    {
        name: string,
        value: propertyType
    }
}
response:
{
    properties: array of 
    {
        id: bigint
        name: string
    }
}*/