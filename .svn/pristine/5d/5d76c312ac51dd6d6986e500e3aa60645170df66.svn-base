using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ReqApi.Models.Entities; 

namespace ReqApi.Models.Context
{
    public partial class ViewsReqappDBContext : DbContext
    {
        public ViewsReqappDBContext()
        {
        }

        public ViewsReqappDBContext(DbContextOptions<ViewsReqappDBContext> options)
            : base(options)
        {
        }

        
        public virtual DbSet<VwCustodianMaster> VwCustodianMasters { get; set; } = null!;
        public virtual DbSet<VwDepartmentMaster> VwDepartmentMasters { get; set; } = null!;
        public virtual DbSet<VwDivisionMaster> VwDivisionMasters { get; set; } = null!;
        public virtual DbSet<VwItemMaster> VwItemMasters { get; set; } = null!;

        public virtual DbSet<VwSupplierItemsMaster> VwSupplierItemsMasters { get; set; } = null!;
        public virtual DbSet<VwSupplierMaster> VwSupplierMasters { get; set; } = null!;
        public virtual DbSet<VwSerialNoMaster> VwSerialNoMasters { get; set; } = null!;
       
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
           .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
           .AddJsonFile("appsettings.json")
           .Build();

            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder 
                    .UseSqlServer(configuration.GetConnectionString("ViewsReqappDBContext"))
                    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<VwCustodianMaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vw_custodianMaster");

                entity.Property(e => e.CustodianCode)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("custodianCode")
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");

                entity.Property(e => e.CustodianName)
                    .HasMaxLength(250)
                    .IsUnicode(false)
                    .HasColumnName("custodianName")
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");
            });

            modelBuilder.Entity<VwDepartmentMaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vw_departmentMaster");

                entity.Property(e => e.DepartmentCode)
                    .HasMaxLength(4)
                    .IsUnicode(false)
                    .HasColumnName("departmentCode")
                    .IsFixedLength()
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");

                entity.Property(e => e.DepartmentName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("departmentName")
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");
            });

            modelBuilder.Entity<VwDivisionMaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vw_divisionMaster");

                entity.Property(e => e.DivisionCode)
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("divisionCode")
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");

                entity.Property(e => e.DivisionName)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("divisionName")
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");

                entity.Property(e => e.CompanyCode)
                   .HasMaxLength(5)
                   .IsUnicode(false)
                   .HasColumnName("companyCode")
                   .UseCollation("SQL_Latin1_General_CP1_CI_AS");
            });

            modelBuilder.Entity<VwItemMaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vw_itemMaster");
 

                entity.Property(e => e.Serialized)
                    .HasMaxLength(1)
                    .HasColumnName("serialized");

                entity.Property(e => e.ItemCode)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .HasColumnName("itemCode")
                    .IsFixedLength()
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");

                entity.Property(e => e.ItemName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("itemName")
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");
            });
            modelBuilder.Entity<VwSupplierItemsMaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vw_supplierItemsMaster");

                entity.Property(e => e.ItemCode)
                    .IsRequired()
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .HasColumnName("itemCode")
                    .IsFixedLength()
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");

                entity.Property(e => e.SupplierCode)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("supplierCode")
                    .IsFixedLength()
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");
            });


            modelBuilder.Entity<VwSupplierMaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vw_supplierMaster");

                entity.Property(e => e.Company)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("company")
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");

                entity.Property(e => e.SupplierCode)
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("supplierCode")
                    .IsFixedLength()
                    .UseCollation("SQL_Latin1_General_CP1_CI_AS");
            });

            modelBuilder.Entity<VwSerialNoMaster>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vw_serialNoMaster");

                entity.Property(e => e.ItemCode)
                    .IsFixedLength()
                    .IsUnicode(false);

                entity.Property(e => e.serialNo)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.locationCode)
                   .IsFixedLength()
                   .IsUnicode(false);

            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
