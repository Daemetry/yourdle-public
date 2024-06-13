using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace Yourdle.Database.Model;

public partial class YourdbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
     
    public YourdbContext()
    {
    }

    public YourdbContext(DbContextOptions<YourdbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Game> Games { get; set; }

    public virtual DbSet<Object> Objects { get; set; }

    public virtual DbSet<ObjectProperty> Objectproperties { get; set; }

    public virtual DbSet<ObjectType> Objecttypes { get; set; }

    public virtual DbSet<TypeProperty> Typeproperties { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.HasPostgresEnum<PropertyType>("public", "propertytype");

        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.GameId).HasName("games_pkey");

            entity.ToTable("games");

            entity.HasIndex(e => e.GameCode, "games_gamecode_key").IsUnique();

            entity.Property(e => e.GameId).HasColumnName("gameid");
            entity.Property(e => e.GameCode)
                .HasMaxLength(7)
                .IsFixedLength()
                .HasColumnName("gamecode");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.ObjectTypeId).HasColumnName("objecttypeid");
            entity.Property(e => e.Public)
                .HasDefaultValue(false)
                .HasColumnName("public");
            entity.Property(e => e.UserId).HasColumnName("userid");

            entity.HasOne(d => d.ObjectType).WithMany(p => p.Games)
                .HasForeignKey(d => d.ObjectTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("games_objecttypeid_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Games)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("games_userid_fkey");
        });

        modelBuilder.Entity<Object>(entity =>
        {
            entity.HasKey(e => e.ObjectId).HasName("objects_pkey");

            entity.ToTable("objects");

            entity.Property(e => e.ObjectId).HasColumnName("objectid");
            entity.Property(e => e.ObjectName)
                .HasColumnType("character varying")
                .HasColumnName("objectname");
            entity.Property(e => e.TypeId).HasColumnName("typeid");

            entity.HasOne(d => d.Type).WithMany(p => p.Objects)
                .HasForeignKey(d => d.TypeId)
                .HasConstraintName("objects_typeid_fkey");
        });

        modelBuilder.Entity<ObjectProperty>(entity =>
        {
            entity.HasKey(e => new { Objectid = e.ObjectId, Propertyid = e.PropertyId }).HasName("objectproperties_pkey");

            entity.ToTable("objectproperties");

            entity.Property(e => e.ObjectId).HasColumnName("objectid");
            entity.Property(e => e.PropertyId).HasColumnName("propertyid");
            entity.Property(e => e.PropertyValue).HasColumnName("propertyvalue");

            entity.HasOne(d => d.Object).WithMany(p => p.ObjectProperties)
                .HasForeignKey(d => d.ObjectId)
                .HasConstraintName("objectproperties_objectid_fkey");

            entity.HasOne(d => d.Property).WithMany(p => p.ObjectProperties)
                .HasForeignKey(d => d.PropertyId)
                .HasConstraintName("objectproperties_propertyid_fkey");
        });

        modelBuilder.Entity<ObjectType>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("objecttypes_pkey");

            entity.ToTable("objecttypes");

            entity.Property(e => e.TypeId).HasColumnName("typeid");
            entity.Property(e => e.TypeName)
                .HasColumnType("character varying")
                .HasColumnName("typename");
            entity.Property(e => e.UserId).HasColumnName("userid");

            entity.HasOne(d => d.User).WithMany(p => p.ObjectTypes)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("objecttypes_userid_fkey");
        });

        modelBuilder.Entity<TypeProperty>(entity =>
        {
            entity.HasKey(e => e.PropertyId).HasName("typeproperties_pkey");

            entity.ToTable("typeproperties");

            entity.Property(e => e.PropertyId).HasColumnName("propertyid");
            entity.Property(e => e.PropertyName)
                .HasColumnType("character varying")
                .HasColumnName("propertyname");
            entity.Property(e => e.TypeId).HasColumnName("typeid");

            entity.Property(e => e.PropertyType).HasColumnName("propertytype");

            entity.HasOne(d => d.Type).WithMany(p => p.TypeProperties)
                .HasForeignKey(d => d.TypeId)
                .HasConstraintName("typeproperties_typeid_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");

        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
