# Prerequisites
## Make sure to install the ff
1. VS 2022
2. [.NET 6 SDK](https://download.visualstudio.microsoft.com/download/pr/15ab772d-ce5c-46e5-a90e-57df11adabfb/4b1b1330b6279a50c398f94cf716c71e/dotnet-sdk-6.0.301-win-x64.exe)
3. [Node.js](https://nodejs.org/en/download/) LTS version (16.15.x) includes npm version (8.11.0)
4. [Angular CLI](https://github.com/angular/angular-cli) version 14.0.4. Run `npm install @angular/cli@14.0.4`

# Setup 
## Set the project properties
   1. In Solution Explorer, right-click the ASP.NET Core project and choose Properties.
   2. Go to the Debug menu and select Open debug launch profiles UI option. Uncheck the Launch Browser option.
   3. 

## Set the startup project
   1. In Solution Explorer, right-click the solution name and select Set Startup Project. 
   2. Change the startup project from Single startup project to Multiple startup projects. 
   3. Select Start for each project’s action.
   4. Select the backend project and move it above the frontend, so that it starts up first.

## Set the Build Order
   1. In Solution Explorer, right-click the solution name and select Project Build Order
   2. In dependencies Tab, Select ng-app in Projects, In depends on: Checked api.
   
## Install angular app packages (node_modules)
   1. In the terminal go to app folder directory then run `npm install`

## Close external console automatically when debugging stops (Optional)
   1. Tools > Options > Debugging | General > Automatically close the console when debugging stops
## Release
ng build --aot --output-hashing all
#RUN
npm ng serve
# Issues

## Certificate is invalid for localhost in Chrome
1. Delete the C:\Users{USER}\AppData\Roaming\ASP.NET\Https folder.
2. Clean the solution. Delete the bin and obj folders.
3. Restart the development tool. 
4. Check the certificates in the certificate store.`Win + r` run `certmgr.msc`. There should be a localhost certificate with the ASP.NET Core HTTPS development certificate friendly name both under Current User > Personal > Certificates and Current User > Trusted root certification authorities > Certificates
5. Remove all the found certificates from both Personal and Trusted root certification authorities. Do not remove the IIS Express localhost certificate.
6. Run the following commands:
`dotnet dev-certs https --clean` 
`dotnet dev-certs https --trust`

## How To Fix Error PS1 Can Not Be Loaded Because Running Scripts Is Disabled On This System In Angular

https://www.c-sharpcorner.com/article/how-to-fix-ps1-can-not-be-loaded-because-running-scripts-is-disabled-on-this-sys/


## Scaffold

DBContext 

IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();

https://www.youtube.com/watch?v=BIk7PssaDe8

Adding ASP .NET Core Identity to Web API Project
https://thecodeblogger.com/2020/01/23/adding-asp-net-core-identity-to-web-api-project/
1. Create AppDBCOntext
2. appsettings.json > connectionstrings
3. program.cs > identity config, appdb config
Add-Migration InitialMigration -OutputDir "<Data/Migrations>"
Update-Database

Scaffold Identity
Scaffold-DbContext "Server=ICTD-V;Initial Catalog=TS_LOGINS;Integrated Security=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models/Users
Scaffold-DbContext "Server=ICTD-V;Initial Catalog=TallySheet;Integrated Security=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models

Scaffold-DbContext "Server=210.4.112.22;Initial Catalog=Reqapp;Integrated Security=False;User ID=sa;Password=1ctddba;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models/Entities

-----------------------------
Add Property/Column to identity Tables

console > EntityFrameworkCore\Add-Migration InitialMigration -Context ReqappDbContext
IdentityModels.cs > add column or property
console > EntityFrameworkCore\Add-Migration AdddedNewColumnName -Context ReqappDbContext
Remove initial migration file before update the database
console > EntityFrameworkCore\Update-Database -Context ReqappDbContext

Update Database Reqapp
EntityFrameworkCore\Add-Migration InitialMigration -Context ReqappDBcontext

## REQAPP TUTS

1. create module & component
src/app/modules/request > ng g m fund-liquidation --routing
src/app/modules/request > ng g c fund-liquidation

2. copy last request routing; rename it fund-liquidation
src/app/modules/request > request-routing.module.ts

3. inside fund-liquidation folder > fund-liquidation.module.ts
add to imports SharedModule
add exports FundLiquidationRoutingModule

4. inside fund-liquidation folder > fund-liquidation-routing.module.ts
add route, panel title and icon

5. new link
go to src/app/layout/sidenav/_nav.ts



to run app
dev: ng serve
prod: ng serve --configuration production

to publish app
make sure to publish api first then,
ng build --aot --output-hashing all 
folder: Release

http://localhost:4200/