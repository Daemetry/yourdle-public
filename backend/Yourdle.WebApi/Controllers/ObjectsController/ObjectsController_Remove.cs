using Microsoft.AspNetCore.Mvc;

namespace Yourdle.WebApi.Controllers.ObjectsController;

public partial class ObjectsController
{
    [HttpPost]
    [Route("remove")]
    public IActionResult RemoveObject(RemoveObjectsRequest request)
    {
        try
        {
            dbContext.Objecttypes.First(t => t.TypeId == request.TypeId);
        }
        catch (Exception e)
        {
            return BadRequest("Type does not exist");
        }
        
        var objectsToRemove = new HashSet<long>(request.ObjectIds);
        var entities = dbContext.Objects.Where(o => objectsToRemove.Contains(o.ObjectId) && o.TypeId == request.TypeId).ToArray();
        if (entities.Length != objectsToRemove.Count)
            return BadRequest("Not all of the objects belong to the type.");
        
        dbContext.Objects.RemoveRange(entities);
        dbContext.SaveChanges();
        
        return Ok();
    }
}

public class RemoveObjectsRequest
{
    public int TypeId { get; set; }
    public long[] ObjectIds { get; set; }
}

/*POST /objects/remove
request:
{
    typeId: int,
    objectIds: array of bigint
}
response:
{
    ok: bool
}*/