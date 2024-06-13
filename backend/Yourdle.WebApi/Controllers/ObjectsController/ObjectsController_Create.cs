using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Yourdle.Database.Model;
using Object = Yourdle.Database.Model.Object;

namespace Yourdle.WebApi.Controllers.ObjectsController;

public partial class ObjectsController
{
    [HttpPost]
    [Route("create")]
    public IActionResult CreateObject(CreateObjectRequest request)
    {
        try
        {
            dbContext.Objecttypes.First(t => t.TypeId == request.TypeId);
        }
        catch (Exception e)
        {
            return BadRequest("Type does not exist");
        }

        var propertyIdValuesMap = new Dictionary<EntityEntry<Object>, PropertyIdValue[]>();
        foreach (var gameObject in request.Objects)
        {
            propertyIdValuesMap[dbContext.Objects.Add(new Object() { TypeId = request.TypeId, ObjectName = gameObject.Name })] = gameObject.Properties;
            dbContext.SaveChanges();
        }

        foreach (var (objectEntity, propsValues) in propertyIdValuesMap)
        {
            var objId = objectEntity.Entity.ObjectId;
            foreach (var propValue in propsValues)
            {
                dbContext.Objectproperties.Add(new ObjectProperty
                    { ObjectId = objId, PropertyId = propValue.PropertyId, PropertyValue = propValue.Value });
                dbContext.SaveChanges();
            }
        }
        
        return Ok(new { ObjectIds = propertyIdValuesMap.Keys.Select(k =>k.Entity.ObjectId).ToArray() });
    }
}

public class CreateObjectRequest
{
    public int TypeId { get; set; }
    public GameObject[] Objects { get; set;}
}

public class GameObject
{
    public string Name { get; set; }
    public PropertyIdValue[] Properties { get; set; }
}

public class PropertyIdValue
{
    public long PropertyId { get; set; }
    
    [JsonConverter(typeof(ValueJsonConverter))]
    public byte[] Value { get; set; }
}

internal class ValueJsonConverter : JsonConverter<byte[]>
{
    public override byte[] Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) 
        => System.Text.Encoding.UTF8.GetBytes(reader.GetString());

    public override void Write(Utf8JsonWriter writer, byte[] value, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
}

/*
POST /objects/create
    request:
{
    typeId: int,
    objects:
    {
        name: string
        objectProperties: array of
        {
            propertyId: int
            value: image | string | integer | 
        }
    }
}
    response:
{
    objectIds: array of bigint
}
*/