using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using ReqApi.Models;
using ReqApi.Models.Context;
using System.Configuration;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var Configuration = builder.Configuration;

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DB Config
builder.Services.AddDbContext<ApplicationDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("LoginConnection")));

builder.Services.AddDbContext<ReqappDBContext>(options =>
{ 
    options.UseSqlServer(builder.Configuration.GetConnectionString("ReqAppConnection"));
});

//builder.Services.AddDbContext<ViewsReqappDBContext>(options =>
//{
//    options.UseSqlServer(builder.Configuration.GetConnectionString("ViewsReqAppConnection"));
//});


builder.Services.AddLogging(loggingBuilder => {
    loggingBuilder.AddConsole()
        .AddFilter(DbLoggerCategory.Database.Command.Name, LogLevel.Information);
    loggingBuilder.AddDebug();
});

// Identity Config
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
}).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders(); ;

// upload
builder.Services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = int.MaxValue;
    o.MultipartBodyLengthLimit = int.MaxValue;
    o.MemoryBufferThreshold = int.MaxValue;
});

// Jwt config
builder.Services.Configure<JWTConfig>(builder.Configuration.GetSection("JWTConfig"));

// JWT Authentication
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    var key = Encoding.ASCII.GetBytes(Configuration.GetSection("JWTConfig:Key").Value);
    var issuer = Configuration.GetSection("JWTConfig:Issuer").Value;
    var audience = Configuration.GetSection("JWTConfig:Audience").Value;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        RequireExpirationTime = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuerSigningKey = true
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(policy => policy
.AllowAnyHeader()
.AllowAnyMethod()
.AllowAnyOrigin()
.WithExposedHeaders("Content-Disposition")
); 

app.UseAuthentication();
app.UseAuthorization();
app.UseDeveloperExceptionPage();

app.MapControllers();

app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
    {
        context.Request.Path = "/index.html";
        await next();
    }
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.Run(); 
