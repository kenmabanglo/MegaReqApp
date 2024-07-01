﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ReqApi.Models.Entities; 

namespace ReqApi.Models.Context
{
    public partial class ReqappDBContext : DbContext
    {
        public ReqappDBContext()
        {
        }

        public ReqappDBContext(DbContextOptions<ReqappDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<RequestItem> RequestItems { get; set; } = null!;
        public virtual DbSet<RequestFiles> RequestFiles { get; set; } = null!;
        public virtual DbSet<RequestMaster> RequestMasters { get; set; } = null!;
        public virtual DbSet<RequestTypeMaster> RequestTypeMasters { get; set; } = null!;
        public virtual DbSet<SysTransactionParam> SysTransactionParams { get; set; } = null!;
        public virtual DbSet<UserSetting> UserSettings { get; set; } = null!;
        public virtual DbSet<SerialNoMaster> SerialNoMasters { get; set; } = null!;
        public virtual DbSet<UserBranchMaster> UserBranchMasters { get; set; } = null!;
        public virtual DbSet<UserApprovalMatrix> UserApprovalMatrix { get; set; } = null!;

        public virtual DbSet<UserApprover> UserApprovers { get; set; }
        //public object RequestMaster { get; internal set; }

        public virtual DbSet<RightsMaster> RightsMasters { get; set; }
        public virtual DbSet<UserRightsMaster> UserRightsMasters { get; set; }
        public virtual DbSet<VwCurrentUserApproverMaster> VwCurrentUserApproverMasters { get; set; } 
        public virtual DbSet<VwCurrentUserBranchMaster> VwCurrentUserBranchMasters { get; set; }
        public virtual DbSet<VwCustodianMaster> VwCustodianMasters { get; set; } = null!;
        public virtual DbSet<VwDepartmentMaster> VwDepartmentMasters { get; set; } = null!;
        public virtual DbSet<VwDivisionMaster> VwDivisionMasters { get; set; } = null!;
        public virtual DbSet<VwItemMaster> VwItemMasters { get; set; } = null!;
        public virtual DbSet<VwSupplierMaster> VwSupplierMasters { get; set; } = null!;

        public virtual DbSet<VwSupplierItemsMaster> VwSupplierItemsMasters { get; set; }

        public virtual DbSet<VwSerialNoMaster> VwSerialNoMasters { get; set; } = null!;
        public virtual DbSet<VwSerialNoLocationCodes> VwSerialNoLocationCodes { get; set; } = null!;

        public virtual DbSet<AllowancesMaster> AllowancesMasters { get; set; }
        public virtual DbSet<BenefitsPackageMaster> BenefitsPackageMasters { get; set; }
        public virtual DbSet<EmpStatusMaster> EmpStatusMasters { get; set; }
        public virtual DbSet<RequestReasonMaster> RequestReasonMasters { get; set; }
        public virtual DbSet<TalentAllowance> TalentAllowances { get; set; }
        public virtual DbSet<TalentBenefit> TalentBenefits { get; set; }
        public virtual DbSet<TalentHiree> TalentHirees { get; set; }
        public virtual DbSet<TalentRequestMaster> TalentRequestMasters { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
           .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
           .AddJsonFile("appsettings.json")
           .Build();

            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder 
                    .UseSqlServer(configuration.GetConnectionString("ReqAppConnection"))
                    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RequestItem>(entity =>
            {
                entity.HasKey(e => new { e.Row, e.RequestNo, e.RequestTypeCode, e.BranchCode });

                entity.Property(e => e.BranchCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("branchCode")
                    .IsFixedLength();

                entity.Property(e => e.Cost).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Row)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("row")
                    .IsFixedLength();

                entity.Property(e => e.ItemCode)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .HasColumnName("itemCode")
                    .IsFixedLength();

                entity.Property(e => e.SupplierCode)
                    .IsUnicode(false)
                    .HasColumnName("supplierCode")
                    .IsFixedLength();

                entity.Property(e => e.SupplierName)
                    .IsUnicode(false)
                    .HasColumnName("supplierName")
                    .IsFixedLength();


                entity.Property(e => e.Onhand)
                .HasColumnName("onhand")
                .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Price)
                .HasColumnName("price")
                .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Quantity)
                .HasColumnName("quantity")
                .HasColumnType("numeric(18, 0)");

                entity.Property(e => e.Description)
                    .HasColumnType("nvarchar(MAX)")
                    .IsUnicode(false)
                    .HasColumnName("description");

                entity.Property(e => e.Remarks)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("remarks");

                entity.Property(e => e.RequestNo)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .HasColumnName("requestNo")
                    .IsFixedLength();

                entity.Property(e => e.RequestTypeCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("requestTypeCode")
                    .IsFixedLength();

                entity.Property(e => e.TotalCost)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("totalCost");

                entity.Property(e => e.TotalPrice)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("totalPrice");

                entity.Property(e => e.SerialNo)
                    .HasMaxLength(1000)
                    .IsUnicode(false)
                    .HasColumnName("SerialNo");

                entity.Property(e => e.Status)
                   .HasMaxLength(500)
                   .IsUnicode(false)
                   .HasColumnName("status");

                entity.Property(e => e.LocationCode)
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("locationCode")
                    .IsFixedLength();
            });


            modelBuilder.Entity<RequestFiles>(entity =>
            {
                entity.HasKey(e => new { e.Row, e.RequestNo, e.RequestTypeCode, e.BranchCode });

                entity.Property(e => e.BranchCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("branchCode")
                    .IsFixedLength();

                entity.Property(e => e.Row)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("row")
                    .IsFixedLength();

                entity.Property(e => e.RequestNo)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestTypeCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property<byte[]>("File")
                        .HasColumnType("varbinary(max)");

                entity.Property<string>("FileName")
                    .HasColumnType("nvarchar(max)");


                entity.Property<string>("MimeType")
                    .HasColumnType("nvarchar(max)");

            });


            modelBuilder.Entity<RequestMaster>(entity =>
            {
                entity.HasKey(e => new { e.RequestNo, e.RequestTypeCode, e.BranchCode });

                entity.ToTable("RequestMaster");

                entity.Property(e => e.Approved1)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approved2)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approved3)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approved4)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approved5)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.ApprovedDate1).HasColumnType("datetime");

                entity.Property(e => e.ApprovedDate2).HasColumnType("datetime");

                entity.Property(e => e.ApprovedDate3).HasColumnType("datetime");

                entity.Property(e => e.ApprovedDate4).HasColumnType("datetime");

                entity.Property(e => e.ApprovedDate5).HasColumnType("datetime");

                entity.Property(e => e.Approver1)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approver2)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approver3)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approver4)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approver5)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.AssignedTo)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.BranchCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Cost).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ExtendedAmount).HasColumnType("decimal(18, 2)");

               // entity.Property(e => e.RefundAmount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.EWT)
                .HasColumnName("ewt")
                .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.LiquidatedBy)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Objective)
                    .HasColumnType("nvarchar(MAX)")
                    .IsUnicode(false);

                entity.Property(e => e.PayableTo)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ProcessedByAp)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("ProcessedByAP")
                    .IsFixedLength();

                entity.Property(e => e.ProcessedByGl)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("ProcessedByGL")
                    .IsFixedLength();

                entity.Property(e => e.Quantity).HasColumnType("numeric(18, 0)");

                entity.Property(e => e.Recommendation)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Reference)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.ReferenceAdb)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("ReferenceADB")
                    .IsFixedLength();

                //entity.Property(e => e.ReferenceRfp)
                //   .HasMaxLength(8)
                //   .IsUnicode(false)
                //   .HasColumnName("ReferenceRFP")
                //   .IsFixedLength();

                entity.Property(e => e.RequestDate).HasColumnType("datetime");

                entity.Property(e => e.RequestNo)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestTypeCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequirementDate).HasColumnType("datetime");

                entity.Property(e => e.Rstype)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("RSType")
                    .IsFixedLength();

                entity.Property(e => e.IsReferral)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasColumnName("isReferral")
                    .HasDefaultValue("N")
                    .IsFixedLength();



                entity.Property(e => e.rfpSource)
                   .HasMaxLength(1)
                   .IsUnicode(false)
                   .HasColumnName("rfpSource") 
                   .IsFixedLength();


                entity.Property(e => e.SupplierCode)
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("supplierCode")
                    .IsFixedLength();

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

            });

            modelBuilder.Entity<UserBranchMaster>(entity =>
            {
                entity.HasKey(e => new { e.UserName, e.BranchCode });

                entity.Property(e => e.UserName)
                   .HasMaxLength(20)
                   .IsUnicode(false)
                   .HasColumnName("userName")
                   .IsFixedLength();

                entity.Property(e => e.BranchCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("branchCode")
                    .IsFixedLength();

                entity.Property(e => e.DateAdd).HasColumnType("datetime");

            });


            modelBuilder.Entity<RequestTypeMaster>(entity =>
            {
                entity.HasKey(e => new { e.RequestTypeCode });

                entity.ToTable("RequestTypeMaster");

                entity.Property(e => e.RequestTypeCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestTypeName)
                    .HasMaxLength(30)
                    .IsUnicode(false);
            });
            modelBuilder.Entity<RightsMaster>(entity =>
            {
                entity.ToTable("rightsMaster");

                entity.HasKey(e => new { e.RightsCode });

                entity.Property(e => e.RightsCode)
                     .HasMaxLength(5)
                     .IsUnicode(false)
                     .HasColumnName("RightsCode");

                entity.Property(e => e.Rightsname)
                     .HasMaxLength(50)
                     .IsFixedLength()
                     .IsUnicode(false)
                     .HasColumnName("Rightsname");

                entity.Property(e => e.Module)
                     .HasMaxLength(2)
                     .IsFixedLength()
                     .IsUnicode(false)
                     .HasColumnName("Module");

                entity.Property(e => e.Type)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("Type");

                entity.Property(e => e.ParentRightsCode)
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("ParentRightsCode");

                entity.Property(e => e.UserName)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .HasColumnName("userName")
                    .IsFixedLength();

                entity.Property(e => e.DateAdd)
                .HasColumnType("datetime")
                .HasColumnName("dateAdd")
                .ValueGeneratedOnAdd();

                entity.Property(e => e.BranchCode)
                   .HasMaxLength(3)
                   .IsUnicode(false)
                   .HasColumnName("branchCode")
                   .IsFixedLength();
            });

            modelBuilder.Entity<UserRightsMaster>(entity =>
            {
                entity.ToTable("userRightsMaster");

                entity.HasKey(e => new { e.UserCode, e.RightsCode });

                entity.Property(e => e.UserCode)
                     .HasMaxLength(8)
                     .IsUnicode(false)
                     .HasColumnName("userCode");

                entity.Property(e => e.RightsCode)
                     .HasMaxLength(5)
                     .IsUnicode(false)
                     .HasColumnName("rightsCode");

                entity.Property(e => e.UserAdd)
                  .HasMaxLength(8)
                  .IsUnicode(false)
                  .HasColumnName("userAdd")
                  .IsFixedLength();

                entity.Property(e => e.DateAdd)
                 .HasColumnType("datetime")
                 .HasColumnName("dateAdd")
                 .ValueGeneratedOnAdd();

                entity.Property(e => e.BranchCode)
                   .HasMaxLength(3)
                   .IsUnicode(false)
                   .HasColumnName("branchCode")
                   .IsFixedLength();
            });



            modelBuilder.Entity<SysTransactionParam>(entity =>
            {
                entity.HasKey(e => new { e.RequestTypeCode, e.BranchCode });

                entity.ToTable("sysTransactionParam");

                entity.Property(e => e.BranchCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.LastNo).HasColumnType("numeric(18, 0)");

                entity.Property(e => e.Locked)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasColumnName("locked")
                    .IsFixedLength();

                entity.Property(e => e.LockedBy)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("lockedBy")
                    .IsFixedLength();

                entity.Property(e => e.RequestTypeCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestTypeName)
                    .HasMaxLength(30)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UserSetting>(entity =>
            {
                entity.HasKey(e => new { e.UserName });

                entity.Property(e => e.BranchCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("branchCode")
                    .IsFixedLength();

                entity.Property(e => e.DigitalSignature)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("digitalSignature")
                    .IsFixedLength();

                entity.Property(e => e.PositionName)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("positionName")
                    .IsFixedLength();

                entity.Property(e => e.PositionRank)
                   .HasMaxLength(50)
                   .IsUnicode(false)
                   .HasColumnName("positionRank")
                   .IsFixedLength();

                entity.Property(e => e.UserName)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("userName")
                    .IsFixedLength();

                entity.Property(e => e.FullName)
                   .HasMaxLength(100)
                   .IsUnicode(false)
                   .HasColumnName("fullName")
                   .IsFixedLength();

                entity.Property(e => e.UserType)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("userType")
                    .IsFixedLength();

                entity.Property(e => e.Active)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasColumnName("active")
                    .IsFixedLength();


            });

            modelBuilder.Entity<SerialNoMaster>(entity =>
            {
                entity.HasKey(e => new { e.ItemCode, e.RequestNo, e.RequestTypeCode, e.BranchCode });

                entity.Property(e => e.ItemCode)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestNo)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestTypeCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.BranchCode)
                   .HasMaxLength(3)
                   .IsUnicode(false)
                   .HasColumnName("BranchCode")
                   .IsFixedLength();

                entity.Property(e => e.SerialNo)
                    .HasMaxLength(1000)
                    .IsUnicode(false)
                    .HasColumnName("SerialNo");

                entity.Property(e => e.DateAdd).HasColumnType("datetime");


            });

            modelBuilder.Entity<UserApprovalMatrix>(entity =>
            {
                entity.HasKey(e => new { e.PositionName });

                entity.Property(e => e.PositionName)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("positionName")
                    .IsFixedLength();

                entity.Property(e => e.PositionRank)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("positionRank")
                    .IsFixedLength();

                entity.Property(e => e.Level)
                   .HasMaxLength(1)
                   .IsUnicode(false)
                   .HasColumnName("level")
                   .IsFixedLength();

                entity.Property(e => e.LimitFrom)
                   .HasColumnName("limitFrom")
                   .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.LimitTo)
                   .HasColumnName("limitTo")
                   .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Approver1)
                   .HasMaxLength(1)
                   .IsUnicode(false)
                   .HasColumnName("approver1")
                   .IsFixedLength();

                entity.Property(e => e.Approver2)
                  .HasMaxLength(1)
                  .IsUnicode(false)
                  .HasColumnName("approver2")
                  .IsFixedLength();


                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.CreatedBy)
                   .HasMaxLength(20)
                   .IsUnicode(false)
                   .IsFixedLength();
            });

            modelBuilder.Entity<UserApprover>(entity =>
            {
                entity.HasKey(e => e.TranId)
                   .HasName("PK_UserApprovers_1");

                entity.Property(e => e.TranId)
                    .ValueGeneratedNever()
                    .HasColumnName("tranId");

                entity.Property(e => e.ApproverUserName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("approverUserName")
                    .IsFixedLength();

                entity.Property(e => e.BranchCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("branchCode")
                    .IsFixedLength();

                entity.Property(e => e.Created).HasColumnName("created");

                entity.Property(e => e.PositionName)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("positionName")
                    .IsFixedLength();

                entity.Property(e => e.UserAdd)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("userAdd")
                    .IsFixedLength();

                entity.Property(e => e.UserName)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("userName")
                    .IsFixedLength();
            });


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

                entity.Property(e => e.supplierCode)
                  .IsFixedLength()
                  .IsUnicode(false);

                entity.Property(e => e.dateAdd).HasColumnType("datetime");

            });

            modelBuilder.Entity<VwSerialNoLocationCodes>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vw_serialNoLocationCodes");
                 
                entity.Property(e => e.locationCode)
                   .IsFixedLength()
                   .IsUnicode(false);

                entity.Property(e => e.locationName)
                   .IsFixedLength()
                   .IsUnicode(false);


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

            modelBuilder.Entity<AllowancesMaster>(entity =>
            {
                entity.ToTable("AllowancesMaster");

                entity.Property(e => e.Description)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<BenefitsPackageMaster>(entity =>
            {
                entity.ToTable("BenefitsPackageMaster");

                entity.Property(e => e.Description)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<EmpStatusMaster>(entity =>
            {
                entity.ToTable("EmpStatusMaster");

                entity.Property(e => e.Description)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<RequestReasonMaster>(entity =>
            {
                entity.ToTable("RequestReasonMaster");

                entity.Property(e => e.Description)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<TalentAllowance>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Others)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestNo)
                    .IsRequired()
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<TalentBenefit>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Others)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestNo)
                    .IsRequired()
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<TalentHiree>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.FullName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestNo)
                    .IsRequired()
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<TalentRequestMaster>(entity =>
            {
                entity.HasKey(e => e.RequestNo);

                entity.ToTable("TalentRequestMaster");

                entity.Property(e => e.RequestNo)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approved1)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approved2)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approved3)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.ApprovedDate1).HasColumnType("datetime");

                entity.Property(e => e.ApprovedDate2).HasColumnType("datetime");

                entity.Property(e => e.ApprovedDate3).HasColumnType("datetime");

                entity.Property(e => e.Approver1)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approver2)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Approver3)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.BasicSalary).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.BranchCode)
                    .IsRequired()
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Department)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.DepartmentRequesting)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.AllowanceOthers)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.BenefitsOthers)
                   .HasMaxLength(100)
                   .IsUnicode(false)
                   .IsFixedLength();

                entity.Property(e => e.DescriptionOfDuties)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.EmpProbationaryMonths).HasColumnType("numeric(18, 0)");

                entity.Property(e => e.EmpProjectDuration)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.EmpProjectName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.EmploymentOthers)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.FileDate).HasColumnType("datetime");

                entity.Property(e => e.IsPositionBudgeted)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.PresentNoOfEmployees).HasColumnType("numeric(18, 0)");

                entity.Property(e => e.NoOfTalent).HasColumnType("numeric(18, 0)");

                entity.Property(e => e.Position)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.PositionOffered)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.PreparedBy)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.RequestDate).HasColumnType("datetime");

                entity.Property(e => e.ResignationOf)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Property(e => e.TerminationEffectiveDate).HasColumnType("datetime");

                entity.Property(e => e.TerminationOf)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.TransferFrom)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.TransferOf)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.TransferTo)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.UpdatedBy)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            });

             
            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}