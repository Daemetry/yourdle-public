using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Yourdle.Database.Model;

namespace Yourdle.WebApi.Controllers.ObjectsController;

public partial class ObjectsController
{
    [HttpPost]
    [Route("change")]
    public IActionResult ChangeObject(ChangeObjectsRequest request)
    {
        if (dbContext.Objecttypes.FirstOrDefault(t => t.TypeId == request.TypeId) is null)
            return BadRequest("Type does not exist");

        foreach (var changedObject in request.ChangedObjects)
        {
            if (changedObject.NewName is not null)
                dbContext.Objects.First(o => o.ObjectId == changedObject.ObjectId).ObjectName = changedObject.NewName;
            foreach (var changedProperty in changedObject.ChangedProperties)
            {
                dbContext.Objectproperties
                    .First(op => op.ObjectId == changedObject.ObjectId && op.PropertyId == changedProperty.PropertyId)
                    .PropertyValue = changedProperty.Value;
            }
        }

        dbContext.SaveChanges();
        
        return Ok();
    }
}

public class ChangeObjectsRequest
{
    public int TypeId { get; set; }
    public ChangeObject[] ChangedObjects { get; set; }
}

public class ChangeObject
{
    public long ObjectId { get; set; }
    public string? NewName { get; set; }
    public PropertyIdValue[] ChangedProperties { get; set; }
}

/*
POST /objects/change
    request:
{
    typeId: int
    changedObjects: array of 
    {
	    objectId: bigint
	    changedProperties: array of
	    {
	        propertyId: bigint
	        newValue: string | integer | date | image
	    }
    }
}
    response:
*/