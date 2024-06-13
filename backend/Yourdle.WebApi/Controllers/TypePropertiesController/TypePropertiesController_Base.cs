using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Yourdle.Database.Model;

namespace Yourdle.WebApi.Controllers.TypePropertiesController;

[ApiController]
[Route("type/properties")]
[Authorize]
public partial class TypePropertiesController(YourdbContext dbContext, UserManager<User> userManager) : ControllerBase;

public class Property
{
    public string Name { get; set; }
    
    [JsonConverter(typeof(PropertyTypeConverter))]
    public PropertyType Type { get; set; }
}

internal class PropertyTypeConverter : JsonConverter<PropertyType>
{
    public override PropertyType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) 
        => reader.TokenType switch
        {
            JsonTokenType.String => Enum.Parse<PropertyType>(reader.GetString() ?? "string", true),
            JsonTokenType.Number => (PropertyType)reader.GetInt32(),
            _ => throw new JsonException("Unexpected value in JSON for property type.")
        };

    public override void Write(Utf8JsonWriter writer, PropertyType value, JsonSerializerOptions options)
    {
        var stringValue = value switch
        {
            PropertyType.String => "String",
            PropertyType.Integer => "Integer",
            PropertyType.Date => "Date",
            PropertyType.Image => "Image",
            _ => throw new JsonException($"Unexpected property type: {value}")
        };

        writer.WriteStringValue(stringValue);
    }
}
