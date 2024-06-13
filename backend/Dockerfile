FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release

WORKDIR /src
COPY ["Yourdle.Database/Yourdle.Database.csproj", "Yourdle.Database/"]
RUN dotnet restore "Yourdle.Database/Yourdle.Database.csproj"
WORKDIR "/src/Yourdle.Database"
COPY ["Yourdle.Database", "."] 

WORKDIR /src
COPY ["Yourdle.WebApi/Yourdle.WebApi.csproj", "Yourdle.WebApi/"]
RUN dotnet restore "Yourdle.WebApi/Yourdle.WebApi.csproj"
WORKDIR "/src/Yourdle.WebApi"
COPY ["Yourdle.WebApi", "."] 

RUN dotnet build "Yourdle.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Yourdle.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Yourdle.WebApi.dll"]
