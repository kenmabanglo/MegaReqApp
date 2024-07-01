import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { AuthGuard, LoggedInAuthGuard, ApproverGuard } from './core/guard/'; 
import { ViewerGuard } from './core/guard/viewer.guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

const routes: Routes = [
   {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
   },
   {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard],//
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./modules/about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./modules/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'request',
        loadChildren: () =>
          import('./modules/request/request.module').then(m => m.RequestModule)
      },
      {
        path: 'viewer',  
        canActivateChild:[ViewerGuard],
        loadChildren: () =>
          import('./modules/viewer/viewer.module').then(m => m.ViewerModule)
      },
      {
        path: 'approver',
        canActivateChild:[ApproverGuard],
        loadChildren: () =>
          import('./modules/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'master',
        loadChildren: () =>
          import('./modules/master/master.module').then(m => m.MasterModule)
      },
    ]
   },
   {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [LoggedInAuthGuard],//
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)   
  },
    // Fallback when no prior routes is matched
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    relativeLinkResolution: 'legacy',
    // enableTracing: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

